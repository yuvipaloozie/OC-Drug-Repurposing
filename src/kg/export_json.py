#!/usr/bin/env python3
"""
Exports the complete Osteoclast Knowledge Graph into a rich, structured JSON format.
Output locations:
1. data/processed/osteoclast_knowledge_graph.json
2. neo4j/osteoclast_knowledge_graph.json
"""

import json
import csv
from pathlib import Path
from collections import Counter

WORKSPACE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = WORKSPACE_DIR / "data" / "processed"
NEO4J_DIR = WORKSPACE_DIR / "neo4j"

# Visual Color Scheme
COLOR_THEMES = {
    "protein": {
        "color_name": "Green",
        "bg": "rgba(34, 197, 94, 0.16)",
        "border": "#16a34a",
        "text": "#15803d",
        "hex_fill": "#DCFCE7",
        "neo4j_label": "Protein"
    },
    "enzyme": {
        "color_name": "Red",
        "bg": "rgba(239, 68, 68, 0.16)",
        "border": "#dc2626",
        "text": "#b91c1c",
        "hex_fill": "#FEE2E2",
        "neo4j_label": "Enzyme"
    },
    "transcription_factor": {
        "color_name": "Magenta",
        "bg": "rgba(217, 70, 239, 0.16)",
        "border": "#c026d3",
        "text": "#a21caf",
        "hex_fill": "#FAE8FF",
        "neo4j_label": "TranscriptionFactor"
    },
    "gene": {
        "color_name": "Orange",
        "bg": "rgba(249, 115, 22, 0.16)",
        "border": "#ea580c",
        "text": "#c2410c",
        "hex_fill": "#FFEDD5",
        "neo4j_label": "Gene"
    },
    "extracellular_compound": {
        "color_name": "Brown",
        "bg": "rgba(139, 69, 19, 0.16)",
        "border": "#8b4513",
        "text": "#78350f",
        "hex_fill": "#F5E6D3",
        "neo4j_label": "ExtracellularCompound"
    },
    "intracellular_compound": {
        "color_name": "Purple",
        "bg": "rgba(147, 51, 234, 0.16)",
        "border": "#9333ea",
        "text": "#7e22ce",
        "hex_fill": "#F3E8FF",
        "neo4j_label": "IntracellularCompound"
    },
    "reaction": {
        "color_name": "Royal Blue",
        "bg": "rgba(37, 99, 235, 0.16)",
        "border": "#2563eb",
        "text": "#1d4ed8",
        "hex_fill": "#DBEAFE",
        "neo4j_label": "Reaction"
    },
    "pathway": {
        "color_name": "Cyan",
        "bg": "rgba(6, 182, 212, 0.16)",
        "border": "#0891b2",
        "text": "#0e7490",
        "hex_fill": "#CFFAFE",
        "neo4j_label": "Pathway"
    }
}

def export_json():
    nodes_file = DATA_DIR / "nodes.csv"
    edges_file = DATA_DIR / "edges.csv"
    evidence_file = DATA_DIR / "edge_evidence.csv"

    with open(nodes_file, mode="r", encoding="utf-8") as f:
        raw_nodes = list(csv.DictReader(f))

    with open(edges_file, mode="r", encoding="utf-8") as f:
        raw_edges = list(csv.DictReader(f))

    evidence_by_edge = {}
    if evidence_file.exists():
        with open(evidence_file, mode="r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                evidence_by_edge[row["edge_id"]] = row

    # Process nodes
    formatted_nodes = []
    for n in raw_nodes:
        nid = n["node_id"]
        ntype = n.get("type", "protein")
        theme = COLOR_THEMES.get(ntype, COLOR_THEMES["protein"])
        aliases = [a.strip() for a in n.get("aliases", "").split("|") if a.strip()]

        formatted_nodes.append({
            "id": nid,
            "name": n.get("name", nid),
            "type": ntype,
            "neo4j_label": theme["neo4j_label"],
            "taxon": n.get("taxon", "mouse"),
            "compartment": n.get("compartment", "cytoplasm"),
            "aliases": aliases,
            "styling": {
                "color_name": theme["color_name"],
                "fill_color": theme["bg"],
                "hex_fill": theme["hex_fill"],
                "border_color": theme["border"],
                "text_color": theme["text"]
            }
        })

    # Process edges
    formatted_edges = []
    string_confirmed_count = 0
    for e in raw_edges:
        eid = e["edge_id"]
        ev = evidence_by_edge.get(eid, {})
        quote = ev.get("quote_or_location", "")
        is_string_confirmed = "STRING" in quote or "STRING" in e.get("source_record_id", "")
        if is_string_confirmed:
            string_confirmed_count += 1

        formatted_edges.append({
            "edge_id": eid,
            "source": e["source_id"],
            "target": e["target_id"],
            "relation": e["relation"],
            "sign": int(e.get("sign", 1)),
            "context_id": e.get("context_id", ""),
            "source_db": e.get("source_db", ""),
            "source_record_id": e.get("source_record_id", ""),
            "status": e.get("status", "curated"),
            "evidence": {
                "experiment_id": ev.get("experiment_id", ""),
                "kind": ev.get("evidence_kind", ""),
                "polarity": ev.get("polarity", "support"),
                "quote_or_description": quote,
                "curator_status": ev.get("curator_status", "reviewed"),
                "reviewed_at": ev.get("reviewed_at", ""),
                "string_ppi_validated": is_string_confirmed
            }
        })

    node_type_counts = dict(Counter(n["type"] for n in formatted_nodes))
    relation_counts = dict(Counter(e["relation"] for e in formatted_edges))

    payload = {
        "metadata": {
            "title": "Osteoclast Knowledge Graph",
            "version": "2.1.0",
            "species": "Mus musculus (Mouse) / Homology Mapped",
            "description": (
                "Curated knowledge graph for osteoclast differentiation and signaling, "
                "supporting computational drug repurposing. Incorporates 8 distinct biological subtypes, "
                "experimental literature evidence, and high-confidence physical PPI validation from STRING v12.0."
            ),
            "statistics": {
                "total_nodes": len(formatted_nodes),
                "total_edges": len(formatted_edges),
                "string_ppi_confirmed_edges": string_confirmed_count,
                "node_types": node_type_counts,
                "relation_types": relation_counts
            },
            "color_palette": {
                k: {
                    "color_name": v["color_name"],
                    "fill": v["bg"],
                    "hex_fill": v["hex_fill"],
                    "border": v["border"],
                    "text": v["text"],
                    "neo4j_label": v["neo4j_label"]
                }
                for k, v in COLOR_THEMES.items()
            }
        },
        "nodes": formatted_nodes,
        "edges": formatted_edges
    }

    # Save to data/processed
    out1 = DATA_DIR / "osteoclast_knowledge_graph.json"
    with open(out1, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"Exported JSON to: {out1}")

    # Save to neo4j
    NEO4J_DIR.mkdir(parents=True, exist_ok=True)
    out2 = NEO4J_DIR / "osteoclast_knowledge_graph.json"
    with open(out2, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"Exported JSON to: {out2}")

    return out1, out2

if __name__ == "__main__":
    export_json()
