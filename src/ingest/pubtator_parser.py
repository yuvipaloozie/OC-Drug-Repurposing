"""Lossless passage/annotation extraction for PubTator BioC staging.

Annotation types and relations are provider predictions, not canonical KG facts.
"""
from typing import Any


class PubTatorParser:
    @staticmethod
    def parse_bioc_json(data: Any) -> list[dict]:
        if isinstance(data, list):
            docs = data
        elif "passages" in data:
            docs = [data]
        else:
            docs = data.get("PubTator3", data.get("documents", []))
        papers = []
        for doc in docs:
            passages, entities, relations = [], [], list(doc.get("relations", []))
            for index, p in enumerate(doc.get("passages", [])):
                kind = p.get("infons", {}).get("type", "unknown")
                passages.append({"passage_index": index, "passage_type": kind,
                                 "offset": p.get("offset", 0), "text": p.get("text", ""),
                                 "infons": p.get("infons", {})})
                relations.extend(p.get("relations", []))
                for ann in p.get("annotations", []):
                    info = ann.get("infons", {})
                    locations = ann.get("locations", [])
                    entities.append({"annotation_id": ann.get("id", ""),
                                     "text": ann.get("text", ""), "type": info.get("type", ""),
                                     "identifier": str(info.get("identifier", "")),
                                     "normalized_name": info.get("name", ""),
                                     "locations": locations, "infons": info,
                                     "offset": locations[0].get("offset") if locations else None,
                                     "length": locations[0].get("length") if locations else None,
                                     "passage_index": index, "passage_type": kind})
            papers.append({"pmid": str(doc.get("id", "")),
                           "title": "\n".join(p["text"] for p in passages if p["passage_type"] == "title"),
                           "abstract": "\n".join(p["text"] for p in passages if p["passage_type"] == "abstract"),
                           "entity_count": len(entities), "entities": entities,
                           "passages": passages, "relations": relations})
        return papers

    @staticmethod
    def draft_claim_row(source_id, relation, target_id, sign, context_id, paper_id,
                        passage_text, claim_index=1):
        """Legacy explicit draft helper; never called by automated discovery.

        Caller must curate direction, molecular identity and context before use.
        This incomplete draft cannot qualify for evidence-based scoring.
        """
        edge_id = f"claim:{paper_id.replace('PMID:', '')}:{claim_index:03d}"
        return {"edge": {"edge_id": edge_id, "source_id": source_id, "relation": relation,
                         "target_id": target_id, "sign": sign, "context_id": context_id,
                         "source_db": "pubtator3", "source_record_id": paper_id,
                         "status": "proposed", "context_status": "pending"},
                "evidence": {"evidence_id": f"draft-ev:{edge_id}", "edge_id": edge_id,
                             "experiment_id": None, "source_id": paper_id,
                             "quote_or_location": passage_text, "evidence_kind": "prediction",
                             "polarity": "", "curator_status": "automated_extraction",
                             "reviewed_at": "", "passage_status": "automated_extraction_unreviewed",
                             "source_location": "", "source_sha256": ""}}
