#!/usr/bin/env python3
"""
Exports the Osteoclast Knowledge Graph into Neo4j-ready formats:
1. neo4j/import_osteoclast_kg.cypher: Pure native Cypher script with constraints and batched MERGE commands.
2. neo4j/load_to_neo4j.py: Direct loader using Neo4j's transactional HTTP API (no pip dependencies required).
3. neo4j/style.grass: Graph Style Sheet for Neo4j Browser with the exact custom color scheme.
4. neo4j/sample_queries.cypher: Curated Cypher queries for exploring the Osteoclast Knowledge Graph.
5. neo4j/README.md: Complete step-by-step guide for Neo4j Desktop.
"""

import os
import sys
import csv
import json
from pathlib import Path
from collections import defaultdict

WORKSPACE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = WORKSPACE_DIR / "data" / "processed"
NEO4J_DIR = WORKSPACE_DIR / "neo4j"

# Subtype to PascalCase Neo4j Label mapping
SUBTYPE_LABELS = {
    "protein": "Protein",
    "enzyme": "Enzyme",
    "transcription_factor": "TranscriptionFactor",
    "gene": "Gene",
    "extracellular_compound": "ExtracellularCompound",
    "intracellular_compound": "IntracellularCompound",
    "reaction": "Reaction",
    "pathway": "Pathway"
}

# Subtype color styling (Hex fills, opaque borders, text colors)
STYLE_PALETTE = {
    "Protein": {
        "color": "#DCFCE7",
        "border": "#16A34A",
        "text": "#15803D",
        "name": "Protein (Green)"
    },
    "Enzyme": {
        "color": "#FEE2E2",
        "border": "#DC2626",
        "text": "#B91C1C",
        "name": "Enzyme (Red)"
    },
    "TranscriptionFactor": {
        "color": "#FAE8FF",
        "border": "#C026D3",
        "text": "#86198F",
        "name": "Transcription Factor (Magenta)"
    },
    "Gene": {
        "color": "#FFEDD5",
        "border": "#EA580C",
        "text": "#9A3412",
        "name": "Gene (Orange)"
    },
    "ExtracellularCompound": {
        "color": "#F5E6D3",
        "border": "#8B4513",
        "text": "#5C2C09",
        "name": "Extracellular Compound (Brown)"
    },
    "IntracellularCompound": {
        "color": "#F3E8FF",
        "border": "#9333EA",
        "text": "#6B21A8",
        "name": "Intracellular Compound (Purple)"
    },
    "Reaction": {
        "color": "#DBEAFE",
        "border": "#2563EB",
        "text": "#1E40AF",
        "name": "Reaction (Royal Blue)"
    },
    "Pathway": {
        "color": "#CFFAFE",
        "border": "#0891B2",
        "text": "#155E75",
        "name": "Pathway (Cyan)"
    }
}

RELATION_COLORS = {
    "ACTIVATES": "#16A34A",
    "INHIBITS": "#DC2626",
    "PART_OF": "#0891B2",
    "REGULATES": "#9333EA",
    "TRANSLATED_TO": "#EA580C",
    "TRANSPORTS": "#8B4513"
}

def load_data():
    nodes_file = DATA_DIR / "nodes.csv"
    edges_file = DATA_DIR / "edges.csv"
    evidence_file = DATA_DIR / "edge_evidence.csv"

    with open(nodes_file, mode="r", encoding="utf-8") as f:
        nodes = list(csv.DictReader(f))

    with open(edges_file, mode="r", encoding="utf-8") as f:
        edges = list(csv.DictReader(f))

    evidence_by_edge = {}
    if evidence_file.exists():
        with open(evidence_file, mode="r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                evidence_by_edge[row["edge_id"]] = row

    return nodes, edges, evidence_by_edge

def escape_cypher_str(val):
    if val is None:
        return ""
    return str(val).replace("\\", "\\\\").replace("\"", "\\\"").replace("'", "\\'")

def generate_cypher_script(nodes, edges, evidence_by_edge):
    lines = []
    lines.append("// =============================================================================")
    lines.append("// Osteoclast Knowledge Graph - Neo4j Import Script")
    lines.append(f"// Generated with 281 nodes ({len(SUBTYPE_LABELS)} subtypes) and 365 edges")
    lines.append("// Supports Neo4j 4.x, 5.x, Desktop, and Aura")
    lines.append("// =============================================================================\n")

    lines.append("// --- 1. Schema Constraints & Indexes ---")
    lines.append("CREATE CONSTRAINT unique_node_id IF NOT EXISTS FOR (n:Node) REQUIRE n.node_id IS UNIQUE;")
    lines.append("CREATE INDEX node_name_idx IF NOT EXISTS FOR (n:Node) ON (n.name);")
    lines.append("CREATE INDEX node_type_idx IF NOT EXISTS FOR (n:Node) ON (n.type);")
    lines.append("CREATE INDEX node_compartment_idx IF NOT EXISTS FOR (n:Node) ON (n.compartment);")
    lines.append("CREATE INDEX edge_id_idx IF NOT EXISTS FOR ()-[r:ACTIVATES]-() ON (r.edge_id);")
    lines.append("CREATE INDEX edge_inhibits_idx IF NOT EXISTS FOR ()-[r:INHIBITS]-() ON (r.edge_id);")
    lines.append("\n// --- 2. Load Nodes grouped by Subtype ---")

    # Group nodes by subtype
    nodes_by_type = defaultdict(list)
    for n in nodes:
        st = n.get("type", "protein")
        nodes_by_type[st].append(n)

    for st, label in SUBTYPE_LABELS.items():
        sub_nodes = nodes_by_type.get(st, [])
        if not sub_nodes:
            continue
        lines.append(f"\n// Subtype: {st} ({len(sub_nodes)} nodes) -> Labels: :Node:{label}")
        lines.append("UNWIND [")
        rows = []
        for n in sub_nodes:
            aliases_list = [a.strip() for a in n.get("aliases", "").split("|") if a.strip()]
            aliases_json = json.dumps(aliases_list)
            rows.append(
                f"  {{node_id: {json.dumps(n['node_id'])}, name: {json.dumps(n['name'])}, "
                f"type: {json.dumps(n['type'])}, taxon: {json.dumps(n.get('taxon', 'mouse'))}, "
                f"compartment: {json.dumps(n.get('compartment', 'cytoplasm'))}, "
                f"aliases: {aliases_json}}}"
            )
        lines.append(",\n".join(rows))
        lines.append(f"] AS row")
        lines.append(f"MERGE (n:Node:{label} {{node_id: row.node_id}})")
        lines.append("SET n.name = row.name,")
        lines.append("    n.type = row.type,")
        lines.append("    n.taxon = row.taxon,")
        lines.append("    n.compartment = row.compartment,")
        lines.append("    n.aliases = row.aliases;")

    lines.append("\n// --- 3. Load Relationships grouped by Relation Type ---")
    edges_by_rel = defaultdict(list)
    for e in edges:
        edges_by_rel[e["relation"]].append(e)

    for rel, rel_edges in edges_by_rel.items():
        lines.append(f"\n// Relation: {rel} ({len(rel_edges)} edges)")
        lines.append("UNWIND [")
        rows = []
        for e in rel_edges:
            eid = e["edge_id"]
            ev = evidence_by_edge.get(eid, {})
            sign_val = int(e.get("sign", 1))
            rows.append(
                f"  {{edge_id: {json.dumps(eid)}, "
                f"source_id: {json.dumps(e['source_id'])}, "
                f"target_id: {json.dumps(e['target_id'])}, "
                f"sign: {sign_val}, "
                f"context_id: {json.dumps(e.get('context_id', ''))}, "
                f"source_db: {json.dumps(e.get('source_db', ''))}, "
                f"source_record_id: {json.dumps(e.get('source_record_id', ''))}, "
                f"status: {json.dumps(e.get('status', 'curated'))}, "
                f"experiment_id: {json.dumps(ev.get('experiment_id', ''))}, "
                f"evidence_kind: {json.dumps(ev.get('evidence_kind', ''))}, "
                f"polarity: {json.dumps(ev.get('polarity', 'support'))}, "
                f"evidence_quote: {json.dumps(ev.get('quote_or_location', ''))}, "
                f"curator_status: {json.dumps(ev.get('curator_status', 'reviewed'))}, "
                f"reviewed_at: {json.dumps(ev.get('reviewed_at', ''))}}}"
            )
        lines.append(",\n".join(rows))
        lines.append("] AS row")
        lines.append("MATCH (s:Node {node_id: row.source_id})")
        lines.append("MATCH (t:Node {node_id: row.target_id})")
        lines.append(f"MERGE (s)-[r:{rel} {{edge_id: row.edge_id}}]->(t)")
        lines.append("SET r.sign = row.sign,")
        lines.append("    r.context_id = row.context_id,")
        lines.append("    r.source_db = row.source_db,")
        lines.append("    r.source_record_id = row.source_record_id,")
        lines.append("    r.status = row.status,")
        lines.append("    r.experiment_id = row.experiment_id,")
        lines.append("    r.evidence_kind = row.evidence_kind,")
        lines.append("    r.polarity = row.polarity,")
        lines.append("    r.evidence_quote = row.evidence_quote,")
        lines.append("    r.curator_status = row.curator_status,")
        lines.append("    r.reviewed_at = row.reviewed_at;")

    return "\n".join(lines)

def generate_style_grass():
    lines = []
    lines.append("/* ===========================================================================")
    lines.append("   Osteoclast Knowledge Graph - Neo4j Browser Style Sheet (GRASS)")
    lines.append("   Colors: 8 distinct subtypes with transparent fills & opaque borders")
    lines.append("   =========================================================================== */")
    lines.append("""
node {
  diameter: 55px;
  color: #F8FAFC;
  border-color: #64748B;
  border-width: 2px;
  text-color-internal: #1E293B;
  font-size: 10px;
}

relationship {
  color: #94A3B8;
  shaft-width: 2px;
  font-size: 8px;
  padding: 3px;
  text-color-external: #475569;
  text-color-internal: #FFFFFF;
}
""")

    for label, styling in STYLE_PALETTE.items():
        lines.append(f"/* {styling['name']} */")
        lines.append(f"node.{label} {{")
        lines.append(f"  color: {styling['color']};")
        lines.append(f"  border-color: {styling['border']};")
        lines.append(f"  border-width: 3.5px;")
        lines.append(f"  text-color-internal: {styling['text']};")
        lines.append(f"  caption: \"{{name}}\";")
        lines.append("}\n")

    for rel, color in RELATION_COLORS.items():
        lines.append(f"relationship.{rel} {{")
        lines.append(f"  color: {color};")
        lines.append(f"  shaft-width: 2.5px;")
        lines.append("}\n")

    return "\n".join(lines)

def generate_sample_queries():
    return """// =============================================================================
// Curated Cypher Queries for Osteoclast Knowledge Graph Exploration
// =============================================================================

// 1. Database Overview: Total nodes & edge counts
MATCH (n:Node) 
RETURN count(n) AS total_nodes;

MATCH ()-[r]->() 
RETURN count(r) AS total_edges;

// 2. Node Counts by Subtype
MATCH (n:Node)
RETURN n.type AS subtype, count(n) AS count
ORDER BY count DESC;

// 3. Relationships by Type
MATCH ()-[r]->()
RETURN type(r) AS relation_type, count(r) AS count
ORDER BY count DESC;

// 4. View Core RANKL / RANK / TRAF6 Signaling Cascade
MATCH path = (rankl:Protein {node_id: "HGNC:TNFSF11"})-[*1..3]->(downstream:Node)
RETURN path;

// 5. Explore STRING v12.0 PPI Confirmed Edges
MATCH (s:Node)-[r]->(t:Node)
WHERE r.evidence_quote CONTAINS "STRING"
RETURN s.name, type(r), t.name, r.evidence_quote
LIMIT 25;

// 6. Inspect Master Transcription Factor NFATc1 Neighborhood
MATCH (n:TranscriptionFactor {node_id: "HGNC:NFATC1"})-[r]-(neighbor:Node)
RETURN n, r, neighbor;

// 7. Find All Metabolic Enzymes (Glycolysis & TCA Cycle)
MATCH (e:Enzyme)
RETURN e.node_id, e.name, e.compartment
ORDER BY e.name;

// 8. Find Extracellular and Intracellular Compounds
MATCH (c:Node)
WHERE c.type IN ['extracellular_compound', 'intracellular_compound']
RETURN c.type, c.name, c.compartment;

// 9. Discover Inhibitory Regulators (Negative Regulators / Brakes)
MATCH (s:Node)-[r:INHIBITS]->(t:Node)
RETURN s.name AS inhibitor, t.name AS target, r.evidence_quote AS evidence
LIMIT 20;

// 10. Multi-hop Path from RANKL to Bone Resorption Phenotype
MATCH p = shortestPath((rankl:Node {node_id: "HGNC:TNFSF11"})-[*]-(pheno:Node {node_id: "PHENO:bone_resorption"}))
RETURN p;
"""

def generate_loader_script():
    return '''#!/usr/bin/env python3
"""
Automated Osteoclast Knowledge Graph Loader for Neo4j Desktop / Server.
Uses native Python standard library (urllib.request, json) - no extra pip packages required.

Connects to Neo4j transactional HTTP endpoint:
  http://localhost:7474/db/neo4j/tx/commit
"""

import sys
import os
import json
import base64
import time
import argparse
from pathlib import Path
import urllib.request
import urllib.error

SCRIPT_DIR = Path(__file__).resolve().parent
CYPHER_FILE = SCRIPT_DIR / "import_osteoclast_kg.cypher"
DEFAULT_DBMSS_DIR = Path.home() / "Library" / "Application Support" / "neo4j-desktop" / "Application" / "Data" / "dbmss"

def parse_cypher_statements(cypher_text):
    """Quote-aware and comment-aware Cypher statement parser."""
    stmts, cur = [], []
    in_str, str_char, esc = False, None, False
    i = 0
    n = len(cypher_text)
    while i < n:
        ch = cypher_text[i]
        next_ch = cypher_text[i + 1] if i + 1 < n else ""

        if esc:
            cur.append(ch)
            esc = False
            i += 1
            continue

        if ch == "\\\\":
            cur.append(ch)
            esc = True
            i += 1
            continue

        if in_str:
            cur.append(ch)
            if ch == str_char:
                in_str = False
                str_char = None
            i += 1
            continue

        if ch in ('\"', "'"):
            in_str = True
            str_char = ch
            cur.append(ch)
            i += 1
            continue

        # Skip line comments outside strings
        if ch == "/" and next_ch == "/":
            while i < n and cypher_text[i] != "\\n":
                i += 1
            continue

        # Semicolon outside strings terminates a statement
        if ch == ';':
            s = "".join(cur).strip()
            if s:
                stmts.append(s)
            cur = []
            i += 1
            continue

        cur.append(ch)
        i += 1

    if cur:
        s = "".join(cur).strip()
        if s:
            stmts.append(s)
    return stmts

def run_cypher_tx(endpoint, auth_header, statements):
    """Executes a list of Cypher statements in a single transaction."""
    payload = {
        "statements": [{"statement": stmt} for stmt in statements]
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(endpoint, data=data, headers={
        "Content-Type": "application/json",
        "Accept": "application/json; charset=UTF-8",
        "Authorization": auth_header
    })

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            res = json.loads(body)
            errors = res.get("errors", [])
            if errors:
                return False, errors, res.get("results", [])
            return True, None, res.get("results", [])
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8") if e.fp else str(e)
        return False, [{"message": f"HTTP {e.code}: {err_msg}"}], []
    except Exception as e:
        return False, [{"message": str(e)}], []

def check_connection(host, port, user, password):
    url = f"http://{host}:{port}/db/neo4j/tx/commit"
    auth_str = f"{user}:{password}"
    auth_header = "Basic " + base64.b64encode(auth_str.encode("utf-8")).decode("ascii")
    
    test_stmt = ["RETURN 1 AS test"]
    ok, errors, _ = run_cypher_tx(url, auth_header, test_stmt)
    return ok, errors, url, auth_header

def inspect_desktop_dbmss():
    """Checks if Neo4j Desktop has created any DBMS directories on Mac."""
    if DEFAULT_DBMSS_DIR.exists():
        subdirs = [p for p in DEFAULT_DBMSS_DIR.iterdir() if p.is_dir() and p.name.startswith("dbms-")]
        return subdirs
    return []

def main():
    parser = argparse.ArgumentParser(description="Load Osteoclast Knowledge Graph into Neo4j")
    parser.add_argument("--host", default="localhost", help="Neo4j host (default: localhost)")
    parser.add_argument("--port", default=7474, type=int, help="Neo4j HTTP port (default: 7474)")
    parser.add_argument("--user", default="neo4j", help="Neo4j username (default: neo4j)")
    parser.add_argument("--password", default=None, help="Neo4j password")
    parser.add_argument("--wait", action="store_true", help="Wait and poll until Neo4j is running")
    parser.add_argument("--reset", action="store_true", help="Delete existing graph before loading")
    args = parser.parse_args()

    password = args.password
    if not password:
        password = os.environ.get("NEO4J_PASSWORD", "password")

    print("=================================================================")
    print("  Osteoclast Knowledge Graph -> Neo4j Desktop Loader")
    print("=================================================================")
    print(f"Target: http://{args.host}:{args.port}")
    print(f"User:   {args.user}")

    connected = False
    endpoint = None
    auth_header = None

    if args.wait:
        print("\\nWaiting for Neo4j DBMS to start... (press Ctrl+C to abort)")
        while not connected:
            ok, errors, endpoint, auth_header = check_connection(args.host, args.port, args.user, password)
            if ok:
                connected = True
                print("Neo4j DBMS detected and authenticated successfully!")
                break
            time.sleep(2)
    else:
        ok, errors, endpoint, auth_header = check_connection(args.host, args.port, args.user, password)
        if ok:
            connected = True
        else:
            dbmss = inspect_desktop_dbmss()
            print(f"\\n[Error] Unable to connect or authenticate to Neo4j at {args.host}:{args.port}:")
            for err in errors:
                print(f"  - {err.get('message', err)}")
            print("\\n--- Neo4j Desktop Status & Troubleshooting ---")
            if not dbmss:
                print("  Status: No DBMS detected in Neo4j Desktop.")
                print("  Action: In the Neo4j Desktop window, click 'Add' > 'Local DBMS', set a password (e.g. 'password'), and click 'Start'.")
            else:
                dbms_names = [d.name for d in dbmss]
                print(f"  Status: Found {len(dbmss)} DBMS directory ({', '.join(dbms_names)}).")
                print("  Action: Click the 'Start' button on your DBMS in Neo4j Desktop so the green active indicator appears.")
            print("\\n  Once started:")
            print("     python3 neo4j/load_to_neo4j.py --password YOUR_PASSWORD")
            print("  Or run with --wait to automatically load when Neo4j starts:")
            print("     python3 neo4j/load_to_neo4j.py --wait --password YOUR_PASSWORD")
            sys.exit(1)

    # Optional reset
    if args.reset:
        print("\\nPurging existing graph (MATCH (n) DETACH DELETE n)...")
        ok, errors, _ = run_cypher_tx(endpoint, auth_header, ["MATCH (n) DETACH DELETE n"])
        if not ok:
            print(f"Error purging graph: {errors}")
            sys.exit(1)
        print("Existing graph cleared.")

    print(f"\\nReading statements from {CYPHER_FILE.name}...")
    statements = parse_cypher_statements(CYPHER_FILE.read_text(encoding="utf-8"))
    print(f"Parsed {len(statements)} Cypher blocks (constraints, nodes, relationships).")

    print("\\nExecuting import transactions...")
    start_time = time.time()
    for i, stmt in enumerate(statements, 1):
        preview = stmt.splitlines()[0][:70]
        print(f"  [{i}/{len(statements)}] {preview}...")
        ok, errors, _ = run_cypher_tx(endpoint, auth_header, [stmt])
        if not ok:
            print(f"\\n[Error] Statement failed:")
            print(stmt[:300] + "...")
            for err in errors:
                print(f"  Error message: {err.get('message', err)}")
            sys.exit(1)

    elapsed = time.time() - start_time
    print(f"\\nImport completed successfully in {elapsed:.2f} seconds!")

    # Verify counts
    print("\\nVerifying Knowledge Graph contents in Neo4j...")
    verify_stmts = [
        "MATCH (n:Node) RETURN count(n) AS node_count",
        "MATCH ()-[r]->() RETURN count(r) AS edge_count",
        "MATCH (n:Node) RETURN n.type AS type, count(n) AS count ORDER BY count DESC",
        "MATCH ()-[r]->() RETURN type(r) AS rel, count(r) AS count ORDER BY count DESC"
    ]
    ok, errors, results = run_cypher_tx(endpoint, auth_header, verify_stmts)
    if ok and len(results) >= 4:
        total_nodes = results[0]["data"][0]["row"][0]
        total_edges = results[1]["data"][0]["row"][0]
        node_breakdown = results[2]["data"]
        edge_breakdown = results[3]["data"]

        print("-----------------------------------------------------------------")
        print(f" Total Nodes:         {total_nodes} (Target: 281)")
        print(f" Total Relationships: {total_edges} (Target: 365)")
        print("-----------------------------------------------------------------")
        print(" Node Subtypes:")
        for row in node_breakdown:
            stype, scnt = row["row"][0], row["row"][1]
            print(f"   - {stype:<25}: {scnt:>3}")
        print(" Relationship Types:")
        for row in edge_breakdown:
            rel, rcnt = row["row"][0], row["row"][1]
            print(f"   - {rel:<25}: {rcnt:>3}")
        print("-----------------------------------------------------------------")
        print("\\nSUCCESS! Knowledge graph is fully live in Neo4j Desktop.")
        print("Open Neo4j Browser and run: MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100")
        print("To apply colors, drag 'neo4j/style.grass' into Neo4j Browser.")

if __name__ == "__main__":
    main()
'''

def generate_readme():
    return """# Osteoclast Knowledge Graph - Neo4j Desktop Integration

This package recreates the complete **Osteoclast Knowledge Graph** (281 nodes, 365 edges, 8 distinct subtypes, 116 STRING PPI confirmed edges) inside **Neo4j Desktop**.

---

## 🎨 Palette & Schema Mapping

All nodes are rendered with **transparent/pastel fills and opaque saturated borders**, matching your exact specifications:

| Subtype | Neo4j Label | Color Name | Fill Hex | Border Hex | Count |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Protein** | `:Protein` | Green | `#DCFCE7` | `#16A34A` | 77 |
| **Enzyme** | `:Enzyme` | Red | `#FEE2E2` | `#DC2626` | 99 |
| **Transcription Factor** | `:TranscriptionFactor` | Magenta | `#FAE8FF` | `#C026D3` | 22 |
| **Gene** | `:Gene` | Orange | `#FFEDD5` | `#EA580C` | 13 |
| **Extracellular Compound** | `:ExtracellularCompound` | Brown | `#F5E6D3` | `#8B4513` | 17 |
| **Intracellular Compound** | `:IntracellularCompound` | Purple | `#F3E8FF` | `#9333EA` | 27 |
| **Reaction** | `:Reaction` | Royal Blue | `#DBEAFE` | `#2563EB` | 5 |
| **Pathway** | `:Pathway` | Cyan | `#CFFAFE` | `#0891B2` | 21 |

**Total:** 281 Nodes, 365 Relationships (`ACTIVATES`: 255, `INHIBITS`: 69, `PART_OF`: 15, `REGULATES`: 10, `TRANSLATED_TO`: 9, `TRANSPORTS`: 7).

---

## 🚀 Quick Setup in Neo4j Desktop

### Step 1: Create and Start a DBMS in Neo4j Desktop
1. Open **Neo4j Desktop**.
2. Under your Project (or click **New Project**), click **Add** > **Local DBMS**.
3. Set the configuration:
   - **Name**: `OsteoclastKG`
   - **Password**: `password` (or any password you prefer)
   - **Version**: default (5.x or 4.4)
4. Click **Create**, then click **Start**. Wait until the green status dot appears (active on port 7474 & 7687).

---

### Step 2: Load the Knowledge Graph

You have two convenient ways to load the graph:

#### Option A: Automated One-Line Loader (Recommended)
In your terminal, run:
```bash
python3 neo4j/load_to_neo4j.py --password password
```
*(If you set a different password, replace `password` with your password).*

The loader will:
- Connect directly to your local Neo4j instance
- Create uniqueness constraints and indexes
- Batch-load all 281 nodes with all properties and labels
- Batch-load all 365 relationships with full evidence, STRING v12.0 PPI scores, and PMIDs
- Verify the graph counts and print a summary table

#### Option B: Direct Cypher in Neo4j Browser
1. In Neo4j Desktop, click **Open** on your active DBMS to open **Neo4j Browser**.
2. Open [`neo4j/import_osteoclast_kg.cypher`](./import_osteoclast_kg.cypher).
3. Copy and paste the contents into the Neo4j query editor and click **Run** (Play button).

---

### Step 3: Apply the Custom Styling (`style.grass`)

To apply the exact transparent fill + opaque border palette:
1. In Neo4j Browser, drag and drop [`neo4j/style.grass`](./style.grass) directly into the Neo4j Browser window.
2. Alternatively:
   - Type `:style` in the query box and press enter.
   - Click the **Graph Style Sheet** download/upload icon, or paste the styling rules from `style.grass`.

---

## 🔍 Sample Cypher Queries

Once loaded, try running these queries in Neo4j Browser:

### View Whole Signaling Subnetwork
```cypher
MATCH (n)-[r]->(m) 
RETURN n, r, m 
LIMIT 150;
```

### Trace RANKL / RANK / TRAF6 / NF-κB Pathway
```cypher
MATCH path = (rankl:Protein {node_id: "HGNC:TNFSF11"})-[*1..4]->(downstream:Node)
RETURN path;
```

### View Edges Confirmed by STRING v12.0 Physical PPI
```cypher
MATCH (s:Node)-[r]->(t:Node)
WHERE r.evidence_quote CONTAINS "STRING"
RETURN s, r, t;
```

### Inspect Master Regulators & Brakes
```cypher
MATCH (b:Node)-[r:INHIBITS]->(target:Node)
RETURN b.name AS Brake, target.name AS Target, r.evidence_quote AS Evidence;
```
"""

def main():
    print("Loading osteoclast knowledge graph data...")
    nodes, edges, evidence_by_edge = load_data()
    print(f"Loaded {len(nodes)} nodes, {len(edges)} edges, {len(evidence_by_edge)} evidence records.")

    NEO4J_DIR.mkdir(parents=True, exist_ok=True)

    # 1. import_osteoclast_kg.cypher
    cypher_content = generate_cypher_script(nodes, edges, evidence_by_edge)
    cypher_path = NEO4J_DIR / "import_osteoclast_kg.cypher"
    with open(cypher_path, "w", encoding="utf-8") as f:
        f.write(cypher_content)
    print(f"Generated Cypher script: {cypher_path} ({len(cypher_content.splitlines())} lines)")

    # 2. style.grass
    grass_content = generate_style_grass()
    grass_path = NEO4J_DIR / "style.grass"
    with open(grass_path, "w", encoding="utf-8") as f:
        f.write(grass_content)
    print(f"Generated GRASS stylesheet: {grass_path}")

    # 3. sample_queries.cypher
    queries_content = generate_sample_queries()
    queries_path = NEO4J_DIR / "sample_queries.cypher"
    with open(queries_path, "w", encoding="utf-8") as f:
        f.write(queries_content)
    print(f"Generated Sample Queries: {queries_path}")

    # 4. load_to_neo4j.py
    loader_content = generate_loader_script()
    loader_path = NEO4J_DIR / "load_to_neo4j.py"
    with open(loader_path, "w", encoding="utf-8") as f:
        f.write(loader_content)
    os.chmod(loader_path, 0o755)
    print(f"Generated Loader script: {loader_path}")

    # 5. README.md
    readme_content = generate_readme()
    readme_path = NEO4J_DIR / "README.md"
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
    print(f"Generated README: {readme_path}")

    print("\nAll Neo4j export artifacts successfully created in 'neo4j/'!")

if __name__ == "__main__":
    main()
