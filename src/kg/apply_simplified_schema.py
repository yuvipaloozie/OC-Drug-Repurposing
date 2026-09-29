"""
Applies the simplified 6-subtype schema to data/processed:
- extracellular_compound
- intracellular_compound
- gene
- protein
- reaction
- pathway
"""
raise RuntimeError("Retired legacy transform: unverified enrichment or obsolete identity schema. Use python -m src.kg.rebuild; curate source-backed records in data/processed.")

import os
import csv
from collections import Counter


def apply_simplified_schema(data_dir: str):
    nodes_file = os.path.join(data_dir, "nodes.csv")
    edges_file = os.path.join(data_dir, "edges.csv")
    evidence_file = os.path.join(data_dir, "edge_evidence.csv")

    with open(nodes_file, "r", encoding="utf-8") as f:
        old_nodes = list(csv.DictReader(f))

    with open(edges_file, "r", encoding="utf-8") as f:
        old_edges = list(csv.DictReader(f))

    with open(evidence_file, "r", encoding="utf-8") as f:
        evidence = list(csv.DictReader(f))

    # Node ID remapping dict
    id_map = {}
    new_nodes = []

    # Canonical pathway nodes to add to represent major cascades
    canonical_pathways = [
        {"node_id": "PATHWAY:RANKL_RANK_SIGNALING", "type": "pathway", "name": "RANKL-RANK Signaling Cascade", "taxon": "mouse", "compartment": "plasma_membrane", "aliases": "RANKL/RANK | Osteoclast signaling"},
        {"node_id": "PATHWAY:GLYCOLYSIS", "type": "pathway", "name": "Glycolysis and Lactate Fermentation", "taxon": "mouse", "compartment": "cytoplasm", "aliases": "Glycolytic Pathway | Warburg-like glycolysis"},
        {"node_id": "PATHWAY:TCA_CYCLE", "type": "pathway", "name": "Tricarboxylic Acid (TCA) Cycle & OXPHOS", "taxon": "mouse", "compartment": "mitochondria", "aliases": "Krebs cycle | Citric acid cycle"},
        {"node_id": "PATHWAY:GLUTAMINOLYSIS", "type": "pathway", "name": "Glutamine Anaplerosis and Glutaminolysis", "taxon": "mouse", "compartment": "mitochondria", "aliases": "Glutamate metabolism | GLS1 pathway"},
        {"node_id": "PATHWAY:SERINE_ONE_CARBON", "type": "pathway", "name": "De Novo Serine Synthesis & One-Carbon Metabolism", "taxon": "mouse", "compartment": "cytoplasm", "aliases": "PHGDH pathway | Serine biosynthesis"},
        {"node_id": "PATHWAY:CALCIUM_NFAT_SIGNALING", "type": "pathway", "name": "Costimulatory Calcium Oscillation & NFATc1 Activation", "taxon": "mouse", "compartment": "cytoplasm", "aliases": "ITAM | Calcineurin-NFAT pathway"},
        {"node_id": "PATHWAY:ACTIN_CYTOSKELETON", "type": "pathway", "name": "Podosome Belt and F-Actin Sealing Zone Assembly", "taxon": "mouse", "compartment": "cytoplasm", "aliases": "Actin ring | Cytoskeletal polarization"},
        {"node_id": "PATHWAY:BONE_RESORPTION", "type": "pathway", "name": "Lacunar Acidification and Bone Matrix Resorption", "taxon": "mouse", "compartment": "extracellular", "aliases": "Bone pit resorption | Osteoclast function"}
    ]

    for n in old_nodes:
        old_type = n["type"]
        nid = n["node_id"]
        name = n["name"]
        taxon = n["taxon"]
        comp = n["compartment"]
        aliases = n["aliases"]

        if old_type == "drug":
            new_type = "extracellular_compound"
            id_map[nid] = nid
        elif old_type == "metabolite":
            if comp == "extracellular" or "extracellular" in name.lower() or nid in ["CHEBI:52254"]:
                new_type = "extracellular_compound"
            else:
                new_type = "intracellular_compound"
            id_map[nid] = nid
        elif old_type in ["gene", "mrna", "mirna"]:
            new_type = "gene"
            clean_id = nid.replace("MRNA:", "GENE:").replace("MIRNA:", "GENE:")
            id_map[nid] = clean_id
            nid = clean_id
        elif old_type == "protein":
            new_type = "protein"
            id_map[nid] = nid
        elif old_type == "chromatin_event":
            new_type = "reaction"
            rxn_id = nid.replace("CHREV:", "RXN:CHROMATIN_")
            id_map[nid] = rxn_id
            nid = rxn_id
        elif old_type in ["cellular_structure", "phenotype", "differentiation_stage"]:
            pw_id = "PATHWAY:" + nid.replace("STRUCT:", "").replace("PHENO:", "").replace("STAGE:", "").upper()
            id_map[nid] = pw_id
            nid = pw_id
            new_type = "pathway"
        else:
            new_type = old_type
            id_map[nid] = nid

        new_nodes.append({
            "node_id": nid,
            "type": new_type,
            "name": name,
            "taxon": taxon,
            "compartment": comp,
            "aliases": aliases
        })

    # Add canonical pathways if not present
    existing_ids = {n["node_id"] for n in new_nodes}
    for pw in canonical_pathways:
        if pw["node_id"] not in existing_ids:
            new_nodes.append(pw)
            existing_ids.add(pw["node_id"])

    # Remap edges
    new_edges = []
    for e in old_edges:
        src = id_map.get(e["source_id"], e["source_id"])
        dst = id_map.get(e["target_id"], e["target_id"])
        rel = e["relation"]

        # Map relation to simplified set
        if rel in ["FORMS_STRUCTURE", "TRANSITIONS_TO"]:
            rel = "PART_OF"
        elif rel in ["TARGETS_MRNA", "CHANGES_MODIFICATION"]:
            rel = "REGULATES"
        elif rel in ["SECRETED_INTO", "TAKEN_UP_BY", "SECRETED_BY"]:
            rel = "TRANSPORTS"

        new_edges.append({
            "edge_id": e["edge_id"],
            "source_id": src,
            "relation": rel,
            "target_id": dst,
            "sign": e["sign"],
            "context_id": e["context_id"],
            "source_db": e["source_db"],
            "source_record_id": e["source_record_id"],
            "status": e.get("status", "curated")
        })

    # Validation Checks
    node_set = {n["node_id"] for n in new_nodes}
    for e in new_edges:
        assert e["source_id"] in node_set, f"Missing source node: {e['source_id']}"
        assert e["target_id"] in node_set, f"Missing target node: {e['target_id']}"

    edge_set = {e["edge_id"] for e in new_edges}
    for ev in evidence:
        assert ev["edge_id"] in edge_set, f"Evidence missing edge: {ev['edge_id']}"

    # Write out new files
    fieldnames_nodes = ["node_id", "type", "name", "taxon", "compartment", "aliases"]
    with open(nodes_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames_nodes)
        writer.writeheader()
        writer.writerows(new_nodes)

    fieldnames_edges = ["edge_id", "source_id", "relation", "target_id", "sign", "context_id", "source_db", "source_record_id", "status"]
    with open(edges_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames_edges)
        writer.writeheader()
        writer.writerows(new_edges)

    print("Successfully wrote simplified datasets!")
    print(f"Nodes: {len(new_nodes)}")
    print("Node Subtypes Breakdown:", Counter(n["type"] for n in new_nodes))
    print(f"Edges: {len(new_edges)}")
    print("Edge Relations Breakdown:", Counter(e["relation"] for e in new_edges))


if __name__ == "__main__":
    apply_simplified_schema("data/processed")
