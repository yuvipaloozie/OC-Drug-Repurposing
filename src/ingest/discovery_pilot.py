"""Bounded, cached literature discovery; never writes canonical graph tables.

Run from repo root: python -m src.ingest.discovery_pilot
Re-run with --offline to reproduce outputs from saved responses.
"""
import argparse
import csv
import hashlib
import html
import json
import re
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

import requests
from src.ingest.pubtator_parser import PubTatorParser

ROOT = Path(__file__).resolve().parents[2]
EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
PUBTATOR = "https://www.ncbi.nlm.nih.gov/research/pubtator3-api/publications/export/biocjson"
OC = '(TITLE_ABS:osteoclast* OR TITLE_ABS:"bone resorption" OR MESH:"Osteoclasts")'
QUERIES = {
    "broad": f'SRC:MED AND {OC}',
    "metabolism": f'SRC:MED AND {OC} AND (TITLE_ABS:metabol* OR TITLE_ABS:mitochondri* OR TITLE_ABS:glycoly* OR TITLE_ABS:lipid* OR TITLE_ABS:"amino acid" OR TITLE_ABS:epigenetic*)',
    "mechanism_anchors": f'SRC:MED AND {OC} AND (TITLE_ABS:PHGDH OR TITLE_ABS:"serine synthesis" OR TITLE_ABS:itaconate OR TITLE_ABS:TET2 OR TITLE_ABS:PRMT6)',
}
CONTROLS = {"38200114": "PHGDH/serine", "40500265": "itaconate/TET2"}
MECHANISM = re.compile(r'\b(inhibit\w*|activat\w*|regulat\w*|knock\w*|delet\w*|silenc\w*|overexpress\w*|rescu\w*|deficien\w*|suppress\w*|promot\w*|attenuat\w*|impair\w*)\b', re.I)
METABOLIC = re.compile(r'metabol|mitochondri|glycoly|serine|itaconate|glutamin|lipid|fatty acid|epigenetic', re.I)
NEGATION = re.compile(r'\b(no|not|neither|without|failed|unchanged|independent)\b', re.I)


def digest(value):
    return hashlib.sha256(value).hexdigest()


def read_csv(path):
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path, rows, fields):
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


class Cache:
    def __init__(self, directory, offline=False):
        self.directory = directory
        directory.mkdir(parents=True, exist_ok=True)
        self.offline = offline
        self.calls = []
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "OC-Drug-Repurposing-discovery-pilot/1.0"

    def get(self, url, params):
        key = digest(json.dumps([url, params], sort_keys=True).encode())
        path = self.directory / f"{key}.json"
        meta_path = self.directory / f"{key}.meta.json"
        started = time.monotonic()
        hit = path.exists() and meta_path.exists()
        if hit:
            body = path.read_bytes()
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            if digest(body) != meta["sha256"]:
                raise ValueError(f"Cache checksum mismatch: {path}")
        else:
            if self.offline:
                raise RuntimeError(f"Missing offline response: {key}")
            for attempt in range(3):
                try:
                    response = self.session.get(url, params=params, timeout=45)
                    response.raise_for_status()
                    body = response.content
                    json.loads(body)
                    break
                except (requests.RequestException, ValueError):
                    if attempt == 2:
                        raise
                    time.sleep(2 ** (attempt + 1))
            meta = {"url": response.url, "params": params, "retrieved_at": datetime.now(timezone.utc).isoformat(),
                    "sha256": digest(body), "http_status": response.status_code}
            path.write_bytes(body)
            meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
            time.sleep(0.4)
        record = {**meta, "raw_file": path.relative_to(ROOT).as_posix(), "cache_hit": hit,
                  "elapsed_seconds": round(time.monotonic() - started, 3)}
        self.calls.append(record)
        return json.loads(body), record


def normalize_name(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())


def node_index(nodes):
    index = defaultdict(set)
    for node in nodes:
        for name in [node["name"], node.get("symbol", ""), *node.get("aliases", "").split("|")]:
            key = normalize_name(name)
            if len(key) >= 3:
                index[(node["type"], key)].add(node["node_id"])
    return index


def match_nodes(entity, index):
    """Lexical suggestions only; never assert registry identity or species."""
    allowed = {"Gene": ("gene", "rna", "protein"),
               "Chemical": ("intracellular_compound", "extracellular_compound")}.get(entity["type"], ())
    # In particular, calcium 'Ca2+' must not become carbonic anhydrase 'CA2'.
    return sorted({n for kind in allowed for name in [entity["text"], entity.get("normalized_name", "")]
                   for n in index.get((kind, normalize_name(name)), set())})


def candidate_passages(paper, provenance, index):
    rows = []
    for p in paper["passages"]:
        if p["passage_type"] != "abstract":
            continue
        # Deterministic sentence-like spans; abbreviations can split sentences.
        for match in re.finditer(r'[^.!?]+(?:[.!?]+|$)', p["text"]):
            raw = match.group()
            if not raw.strip():
                continue
            start = match.start() + len(raw) - len(raw.lstrip())
            end = match.end() - (len(raw) - len(raw.rstrip()))
            text = p["text"][start:end]
            cues = sorted(set(m.group().lower() for m in MECHANISM.finditer(text)))
            if not cues:
                continue
            lo, hi = p["offset"] + start, p["offset"] + end
            mentions = [e for e in paper["entities"] if e["passage_index"] == p["passage_index"] and
                        any(lo <= loc["offset"] and loc["offset"] + loc["length"] <= hi for loc in e["locations"])]
            if not mentions:
                continue
            ids = sorted({n for e in mentions for n in match_nodes(e, index)})
            candidate_id = "candidate:" + digest(f'{paper["pmid"]}:{lo}:{hi}:{text}'.encode())[:20]
            score = 2 * bool(re.search(r'osteoclast|bone.resorp', text, re.I)) + bool(METABOLIC.search(text)) + bool(ids)
            rows.append({"candidate_id": candidate_id, "source_id": "PMID:" + paper["pmid"],
                         "pmid": paper["pmid"], "title": paper["title"], "passage_text": text,
                         "passage_index": p["passage_index"], "start": lo, "end": hi,
                         "source_location": f'PubTator BioC passage[{p["passage_index"]}], document characters [{lo},{hi})',
                         "source_url": f'https://pubmed.ncbi.nlm.nih.gov/{paper["pmid"]}/',
                         "source_sha256": provenance["sha256"], "raw_file": provenance["raw_file"],
                         "annotation_ids": [e["annotation_id"] for e in mentions],
                         "provider_identifiers": sorted({e["identifier"] for e in mentions if e["identifier"]}),
                         "candidate_node_ids": ids, "mechanistic_cues": cues,
                         "negation_cue": bool(NEGATION.search(text)), "triage_score": score,
                         "curator_status": "pending", "passage_status": "automated_extraction_unreviewed",
                         "relation": "", "sign": "", "context_id": "", "experiment_id": "", "polarity": "",
                         "identity_status": "unresolved_molecular_form_and_species", "eligible_for_scoring": False})
    return rows


def render_review(path, candidates, summary):
    payload = json.dumps(candidates, ensure_ascii=False).replace("<", "\\u003c")
    page = '''<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Osteoclast discovery review queue</title><style>
body{font:16px/1.6 system-ui,sans-serif;background:#f5f7f7;color:#202b30;margin:0;padding:36px}main{max-width:1120px;margin:auto}h1{font-size:32px;letter-spacing:-1px;margin-bottom:8px}.note{color:#50636b}input,select{padding:12px;border:1px solid #cad5d8;border-radius:10px;font:inherit}input{width:min(520px,85%)}article{background:white;border:1px solid #dce4e5;border-radius:16px;padding:24px;margin:18px 0}h2{font-size:19px;margin:6px 0}a{color:#16728a}.badge{font-size:12px;background:#edf5f3;padding:4px 8px;border-radius:6px}blockquote{margin:14px 0;border-left:3px solid #46a687;padding-left:18px}details,small{font-size:13px;color:#50636b}code{overflow-wrap:anywhere}button{padding:10px 18px;border-radius:8px;border:1px solid #cad5d8;background:white;cursor:pointer}</style>
<main><span class="badge">DISCOVERY · UNREVIEWED</span><h1>Osteoclast literature review queue</h1>
<p class="note">Abstract passages selected by transparent keyword rules. Scores rank review priority, not evidence strength. Name matches are suggestions; species and molecular form remain unresolved. No records have been added to the live graph.</p>
<input id="search" aria-label="Search passages" placeholder="Search paper, entity, passage or node ID…"> <select id="filter" aria-label="Filter candidates"><option value="all">All passages</option><option value="matched">Possible existing-node match</option><option value="new">No lexical node match</option><option value="negation">Negation cue present</option></select><p id="count"></p><div id="results"></div><button id="more">Show 50 more</button></main><script>
const rows=PAYLOAD;let limit=50;const $=id=>document.getElementById(id);function el(tag,text,parent){const n=document.createElement(tag);n.textContent=text;if(parent)parent.append(n);return n}
function draw(){const q=$('search').value.toLowerCase(),f=$('filter').value;const hits=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q)&&(f==='all'||f==='matched'&&r.candidate_node_ids.length||f==='new'&&!r.candidate_node_ids.length||f==='negation'&&r.negation_cue));$('count').textContent=hits.length+' candidate passages · showing '+Math.min(limit,hits.length);$('results').replaceChildren();for(const r of hits.slice(0,limit)){const a=el('article','',$('results'));el('span','Pending review · priority '+r.triage_score+(r.negation_cue?' · check negation':''),a).className='badge';const h=el('h2','',a),link=el('a',r.title,h);link.href=r.source_url;link.target='_blank';link.rel='noopener';el('blockquote',r.passage_text,a);el('p','Possible graph matches: '+(r.candidate_node_ids.join(', ')||'None by lexical matching'),a);const d=el('details','',a);el('summary','Identifiers and provenance',d);el('p',r.provider_identifiers.join(', '),d);el('p',r.source_location,d);el('code',r.source_sha256,d);el('p',r.candidate_id,d)}$('more').hidden=hits.length<=limit}
$('search').oninput=$('filter').onchange=()=>{limit=50;draw()};$('more').onclick=()=>{limit+=50;draw()};draw();</script>'''
    path.write_text(page.replace("PAYLOAD", payload), encoding="utf-8")


def search_pages(cache, query, page_size, max_pages):
    """Bounded cursor traversal; stop on empty/repeated cursors or empty results."""
    cursor, seen = '*', set()
    for page in range(1, max_pages + 1):
        if cursor in seen:
            break
        seen.add(cursor)
        response, provenance = cache.get(EPMC, {"query": query, "format": "json",
            "resultType": "core", "pageSize": page_size, "cursorMark": cursor})
        yield response, provenance, page
        nxt = response.get('nextCursorMark')
        if not response.get('resultList', {}).get('result') or not nxt or nxt in seen:
            break
        cursor = nxt


def run(args, queries=None, run_name="discovery_pilot"):
    if not re.fullmatch(r"[a-z0-9_]+", run_name):
        raise ValueError("run_name must contain only lowercase letters, digits and underscores")
    queries = QUERIES if queries is None else queries
    if not queries or not all(isinstance(k, str) and isinstance(v, str) and v.strip() for k, v in queries.items()):
        raise ValueError("queries must be a nonempty mapping of names to query strings")
    start = time.monotonic()
    output = ROOT / "data/staging" / run_name
    output.mkdir(parents=True, exist_ok=True)
    canonical = ROOT / "data/processed"
    before = {p.name: digest(p.read_bytes()) for p in canonical.glob("*.csv")}
    cache = Cache(ROOT / "data/raw/discovery_pilot", args.offline)
    papers, searches, memberships = {}, [], defaultdict(list)
    for family, query in queries.items():
        for response, provenance, page in search_pages(cache, query, args.per_query, getattr(args, 'pages', 1)):
            results = response.get("resultList", {}).get("result", [])
            searches.append({"family": family, "query": query, "page": page,
                             "hit_count": response.get("hitCount"), "returned": len(results),
                             "selection": "bounded provider-default ordering; not a random sample",
                             "next_cursor": response.get("nextCursorMark", ""), **provenance})
            for r in results:
                pmid = str(r.get("pmid", ""))
                if not pmid:
                    continue
                if family not in memberships[pmid]:
                    memberships[pmid].append(family)
                papers.setdefault(pmid, (r, provenance))
            print(f'{family} page {page}: {response.get("hitCount")} hits; {len(results)} retrieved', flush=True)
    natural_controls = {pmid: list(memberships[pmid]) for pmid in CONTROLS}
    # Positive controls are explicitly separate from search performance.
    control_response, control_prov = cache.get(EPMC, {"query": 'SRC:MED AND (' + ' OR '.join('EXT_ID:' + p for p in CONTROLS) + ')',
                                                     "format": "json", "resultType": "core", "pageSize": 10})
    for r in control_response.get("resultList", {}).get("result", []):
        pmid = str(r.get("pmid", ""))
        if pmid:
            papers.setdefault(pmid, (r, control_prov))
            memberships[pmid].append("positive_control_lookup")
    # Round-robin query families prevents annotated subset from being all one topic.
    selected = [p for p in CONTROLS if p in papers]
    pools = [[p for p in papers if family in memberships[p]] for family in queries]
    while len(selected) < args.annotations and any(pools):
        for pool in pools:
            while pool and pool[0] in selected:
                pool.pop(0)
            if pool and len(selected) < args.annotations:
                selected.append(pool.pop(0))
    index = node_index(read_csv(canonical / "nodes.csv"))
    candidates, mentions, documents, failures = [], [], [], []
    returned_ids = set()
    for offset in range(0, len(selected), 10):
        batch = selected[offset:offset + 10]
        try:
            data, provenance = cache.get(PUBTATOR, {"pmids": ",".join(batch)})
            parsed = PubTatorParser.parse_bioc_json(data)
        except (requests.RequestException, ValueError, RuntimeError) as exc:
            failures.append({"pmids": batch, "error": str(exc)})
            continue
        for paper in parsed:
            if paper["pmid"] not in batch:
                raise ValueError("Provider returned an unrequested PMID")
            returned_ids.add(paper["pmid"])
            documents.append({**paper, "provenance": provenance})
            candidates.extend(candidate_passages(paper, provenance, index))
            for entity in paper["entities"]:
                mentions.append({"pmid": paper["pmid"], **entity,
                                 "candidate_node_ids": match_nodes(entity, index),
                                 "mapping_status": "lexical_candidate_only",
                                 "raw_file": provenance["raw_file"], "source_sha256": provenance["sha256"]})
        print(f'PubTator: {min(offset+10,len(selected))}/{len(selected)} requested; {len(returned_ids)} returned', flush=True)
    candidates.sort(key=lambda r: (-r["triage_score"], r["pmid"], r["start"]))
    for candidate in candidates:
        metadata = papers[candidate["pmid"]][0]
        candidate["publication_types"] = metadata.get("pubTypeList", {}).get("pubType", [])
        candidate["query_families"] = memberships[candidate["pmid"]]
    source_rows = []
    for pmid, (r, prov) in papers.items():
        source_rows.append({"source_id": "PMID:" + pmid, "pmid": pmid, "pmcid": r.get("pmcid", ""),
                            "doi": r.get("doi", ""), "title": r.get("title", ""), "year": r.get("pubYear", ""),
                            "abstract": html.unescape(re.sub('<[^>]+>', '', r.get("abstractText", ""))),
                            "publication_types": r.get("pubTypeList", {}).get("pubType", []),
                            "mesh_terms": r.get("meshHeadingList", {}).get("meshHeading", []),
                            "query_families": memberships[pmid], "resolution_status": "resolved",
                            "claim_match_status": "pending_review", "url": f'https://pubmed.ncbi.nlm.nih.gov/{pmid}/',
                            "retrieved_at": prov["retrieved_at"], "raw_file": prov["raw_file"], "raw_sha256": prov["sha256"],
                            "annotation_status": "returned" if pmid in returned_ids else "missing_or_failed" if pmid in selected else "not_requested"})
    after = {p.name: digest(p.read_bytes()) for p in canonical.glob("*.csv")}
    if before != after:
        raise RuntimeError("Canonical tables changed during discovery")
    summary = {"run_at": datetime.now(timezone.utc).isoformat(), "elapsed_seconds": round(time.monotonic()-start, 2),
               "run_name": run_name, "queries": queries, "pages_per_query": getattr(args, "pages", 1), "offline": args.offline, "per_query_cap": args.per_query, "annotation_cap": args.annotations,
               "papers": len(papers), "papers_with_abstract": sum(bool(r["abstract"]) for r in source_rows),
               "annotations_requested": len(selected), "annotations_returned": len(returned_ids),
               "missing_annotations": sorted(set(selected)-returned_ids), "mentions": len(mentions),
               "candidate_passages": len(candidates), "candidates_with_node_suggestions": sum(bool(c["candidate_node_ids"]) for c in candidates),
               "distinct_suggested_nodes": len({n for c in candidates for n in c["candidate_node_ids"]}),
               "negation_cue_passages": sum(c["negation_cue"] for c in candidates),
               "provider_relation_count": sum(len(d["relations"]) for d in documents),
               "natural_control_retrieval": natural_controls, "failures": failures,
               "network_calls": sum(not c["cache_hit"] for c in cache.calls), "cache_hits": sum(c["cache_hit"] for c in cache.calls),
               "canonical_sha256": before, "canonical_unchanged": True, "promoted_nodes": 0, "promoted_edges": 0}
    summary["code_sha256"] = {p.name: digest(p.read_bytes()) for p in [Path(__file__), Path(__file__).with_name("pubtator_parser.py")]}
    history = output / "runs"
    history.mkdir(exist_ok=True)
    (history / (datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + ".json")).write_text(json.dumps(summary, indent=2), encoding="utf-8")
    for name, data in [("summary", summary), ("searches", searches), ("api_calls", cache.calls),
                       ("annotated_documents", documents), ("candidates", candidates)]:
        (output / f"{name}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    write_csv(output / "papers.csv", source_rows, list(source_rows[0]) if source_rows else ["pmid"])
    write_csv(output / "mentions.csv", mentions, list(mentions[0]) if mentions else ["pmid"])
    write_csv(output / "candidate_passages.csv", candidates, list(candidates[0]) if candidates else ["candidate_id"])
    render_review(output / "review_queue.html", candidates, summary)
    print(json.dumps(summary, indent=2), flush=True)
    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--per-query", type=int, default=150)
    parser.add_argument("--annotations", type=int, default=60)
    parser.add_argument("--offline", action="store_true")
    parser.add_argument("--query-config", type=Path, help="JSON mapping of named queries")
    parser.add_argument("--run-name", default="discovery_pilot")
    parser.add_argument("--pages", type=int, default=1)
    args = parser.parse_args()
    if not 1 <= args.per_query <= 500 or not 2 <= args.annotations <= 5000 or not 1 <= args.pages <= 20:
        parser.error("per-query must be 1..500; annotations must be 2..5000; pages must be 1..20")
    queries = json.loads(args.query_config.read_text(encoding="utf-8")) if args.query_config else None
    run(args, queries=queries, run_name=args.run_name)
