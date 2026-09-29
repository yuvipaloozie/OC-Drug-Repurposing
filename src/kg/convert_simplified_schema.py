"""
Conversion script to map the Osteoclast Knowledge Graph to the simplified 6-subtype schema:
1. extracellular_compound
2. intracellular_compound
3. gene
4. protein
5. reaction
6. pathway
"""
raise RuntimeError("Retired legacy transform: unverified enrichment or obsolete identity schema. Use python -m src.kg.rebuild; curate source-backed records in data/processed.")

import os
import csv
from collections import Counter


def convert_nodes_and_edges(data_dir: str):
    nodes_path = os.path.join(data_dir, "nodes.csv")
    edges_path = os.path.join(data_dir, "edges.csv")

    with open(nodes_path, "r", encoding="utf-8") as f:
        nodes = list(csv.DictReader(f))

    with open(edges_path, "r", encoding="utf-8") as f:
        edges = list(csv.DictReader(f))

    # Canonical pathway nodes to add
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

    new_nodes = []
    node_id_remap = {}

    for n in nodes:
        old_type = n["type"]
        node_id = n["node_id"]
        name = n["name"]
        taxon = n["taxon"]
        comp = n["compartment"]
        aliases = n["aliases"]

        if old_type == "drug":
            new_type = "extracellular_compound"
            node_id_remap[node_id] = node_id
        elif old_type == "metabolite":
            # Check compartment
            if comp == "extracellular" or "extracellular" in name.lower() or node_id in ["CHEBI:52254"]:
                new_type = "extracellular_compound"
            else:
                new_type = "intracellular_compound"
            node_id_remap[node_id] = node_id
        elif old_type in ["gene", "mrna", "mirna"]:
            new_type = "gene"
            # Normalize ID prefix
            clean_id = node_id.replace("MRNA:", "GENE:").replace("MIRNA:", "GENE:")
            node_id_remap[node_id] = clean_id
            node_id = clean_id
        elif old_type == "protein":
            new_type = "protein"
            node_id_remap[node_id] = node_id
        elif old_type == "chromatin_event":
            new_type = "reaction"
            rxn_id = node_id.replace("CHREV:", "RXN:CHROMATIN_")
            node_id_remap[node_id] = rxn_id
            node_id = rxn_id
        elif old_type in ["cellular_structure", "phenotype", "differentiation_stage"]:
            # Map higher order phenotypes/structures to pathway
            pw_id = "PATHWAY:" + node_id.replace("STRUCT:", "").replace("PHENO:", "").replace("STAGE:", "").upper()
            node_id_remap[node_id] = pw_id
            node_id = pw_id
            new_type = "pathway"
        else:
            new_type = old_type
            node_id_remap[node_id] = node_id

        new_nodes.append({
            "node_id": node_id,
            "type": new_type,
            "name": name,
            "taxon": taxon,
            "compartment": comp,
            "aliases": aliases
        })

    # Add canonical pathways
    existing_ids = {n["node_id"] for n in new_nodes}
    for pw in canonical_pathways:
        if pw["node_id"] not in existing_ids:
            new_nodes.append(pw)
            existing_ids.add(pw["node_id"])

    # Remap edges
    new_edges = []
    for e in edges:
        src = node_id_remap.get(e["source_id"], e["source_id"])
        dst = node_id_remap.get(e["target_id"], e["target_id"])
        rel = e["relation"]

        # Normalize relations
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

    print(f"Total Simplified Nodes: {len(new_nodes)}")
    print("Node Subtypes Breakdown:", Counter(n["type"] for n in new_nodes))
    print(f"Total Simplified Edges: {len(new_edges)}")
    print("Edge Relations Breakdown:", Counter(e["relation"] for e in new_edges))

    return new_nodes, new_edges


if __name__ == "__main__":
    convert_nodes_and_edges("data/processed")
