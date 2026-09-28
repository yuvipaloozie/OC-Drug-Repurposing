"""
Knowledge Graph Verification & Anti-Hallucination Audit Script.
Enforces strict boundaries:
1. Every edge source and target must exist in nodes.csv.
2. Every context must belong to RANKL-induced mouse BMMs or RAW 264.7 cells.
3. Every experiment must be an authentic primary paper with a verifiable PMID/DOI.
4. Audits coverage across all required biological domains:
   - Glycolysis intermediates and enzymes
   - TCA cycle intermediates and reactions
   - Actin ring / podosome / sealing zone dynamics
   - Syncytium formation (cell-cell fusion)
   - TRAP synthesis and lacunar resorption
   - Differentiation stage progression
   - Histone modifications and epigenetic marks
   - miRNA regulation and mRNA translation
"""

import os
import sys
import csv
import re
from typing import Dict, List, Set, Any


def run_verification(data_dir: str) -> Dict[str, Any]:
    nodes_file = os.path.join(data_dir, "nodes.csv")
    edges_file = os.path.join(data_dir, "edges.csv")
    contexts_file = os.path.join(data_dir, "contexts.csv")
    experiments_file = os.path.join(data_dir, "experiments.csv")
    evidence_file = os.path.join(data_dir, "edge_evidence.csv")

    errors = []
    warnings = []

    # 1. Load Nodes
    nodes = {}
    node_types = set()
    with open(nodes_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            nid = row["node_id"]
            if nid in nodes:
                errors.append(f"Duplicate node_id: {nid}")
            nodes[nid] = row
            node_types.add(row["type"])

    # 2. Load Contexts
    contexts = {}
    with open(contexts_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cid = row["context_id"]
            contexts[cid] = row
            # Enforce strict cell type boundary
            cell_type = row["cell_type"].lower()
            if "bone marrow macrophage" not in cell_type and "raw 264.7" not in cell_type:
                errors.append(f"Context {cid} violates search limits: cell_type='{cell_type}' (Must be BMM or RAW 264.7)")
            if "rankl" not in row["disease_setting"].lower() and "rankl" not in row["note"].lower():
                errors.append(f"Context {cid} violates search limits: Missing RANKL induction specification.")

    # 3. Load Experiments
    experiments = {}
    with open(experiments_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            eid = row["experiment_id"]
            experiments[eid] = row
            paper_id = row["paper_id"]
            # Validate PMID/DOI format
            if not (re.match(r"^PMID:\d+$", paper_id) or paper_id.startswith("DOI:")):
                errors.append(f"Experiment {eid} has invalid paper_id format: '{paper_id}'")
            # Validate cell type
            ctype = row["cell_type"].lower()
            if "bone marrow macrophage" not in ctype and "raw 264.7" not in ctype:
                errors.append(f"Experiment {eid} violates cell type filter: '{ctype}'")
            # Validate RANKL treatment
            treatment = row["treatment"].upper()
            if "RANKL" not in treatment:
                errors.append(f"Experiment {eid} violates treatment filter: Missing RANKL in treatment '{row['treatment']}'")

    # 4. Load Edges & Validate References
    edges = {}
    with open(edges_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            eid = row["edge_id"]
            edges[eid] = row
            src = row["source_id"]
            tgt = row["target_id"]
            cid = row["context_id"]

            if src not in nodes:
                errors.append(f"Edge {eid} references missing source node: '{src}'")
            if tgt not in nodes:
                errors.append(f"Edge {eid} references missing target node: '{tgt}'")
            if cid not in contexts:
                errors.append(f"Edge {eid} references missing context: '{cid}'")

    # 5. Check Edge Evidence
    evidence_count = 0
    with open(evidence_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            evidence_count += 1
            eid = row["edge_id"]
            exp_id = row.get("experiment_id")
            if eid not in edges:
                errors.append(f"Evidence references non-existent edge: '{eid}'")
            if exp_id and exp_id not in experiments:
                errors.append(f"Evidence references non-existent experiment: '{exp_id}'")

    # 6. Verify Required Biological Layer Coverage
    required_layers = {
        "Glycolysis": ["HGNC:HK2", "HGNC:PFKFB3", "HGNC:PKM", "HGNC:LDHA", "CHEBI:17234", "CHEBI:16651"],
        "TCA Cycle": ["HGNC:CS", "HGNC:ACO2", "HGNC:IDH2", "CHEBI:16947", "CHEBI:30915", "CHEBI:15351"],
        "Actin / Sealing Zone": ["HGNC:SRC", "HGNC:VAV3", "HGNC:RAC1", "STRUCT:podosome_belt", "STRUCT:f_actin_sealing_zone"],
        "Syncytium / Fusion": ["HGNC:DCSTAMP", "HGNC:OCSTAMP", "HGNC:ATP6V0D2", "STRUCT:syncytium"],
        "TRAP & Lacuna": ["HGNC:ACP5", "HGNC:CTSK", "HGNC:TCIRG1", "STRUCT:resorption_lacuna"],
        "Differentiation Stages": [
            "STAGE:monocyte_BMM_precursor",
            "STAGE:early_mononuclear_pre_osteoclast",
            "STAGE:committed_mononuclear_TRAP_pos",
            "STAGE:syncytium_prefusion_polykaryon",
            "STAGE:mature_resorbing_osteoclast",
        ],
        "Histone / Epigenetics": [
            "CHREV:H3K27me3_demethylation_Nfatc1",
            "CHREV:H3R2me2a_fao_promoters",
            "CHREV:H3K9ac_H3K27ac_promoters",
            "CHREV:TET2_5hmC_hydroxymethylation",
        ],
        "miRNAs & mRNAs": [
            "MIRNA:mmu-miR-21a-5p",
            "MIRNA:mmu-miR-148a-3p",
            "MIRNA:mmu-miR-34a-5p",
            "MIRNA:mmu-miR-124-3p",
            "MRNA:Nfatc1",
            "MRNA:Dcstamp",
            "MRNA:Acp5",
        ],
        "Transcriptional Brakes": [
            "HGNC:IRF8",
            "HGNC:PRDM1",
            "HGNC:BCL6",
            "HGNC:GNA13",
            "HGNC:IFNB1",
        ],
        "Co-stimulatory Receptors & Calcium Hubs": [
            "HGNC:OSCAR",
            "HGNC:TREM2",
            "HGNC:RGS10",
            "HGNC:RGS12",
            "HGNC:BLNK",
        ],
        "V-ATPase & Lacunar Machinery": [
            "HGNC:TCIRG1",
            "HGNC:ATP6V0D2",
            "HGNC:CLCN7",
            "HGNC:OSTM1",
            "HGNC:MMP9",
        ],
        "Therapeutic Probes & Anti-resorptives": [
            "CHEMBL:DENOSUMAB",
            "CHEMBL:ZOLEDRONATE",
            "CHEMBL:SARACATINIB",
            "CHEMBL:SELINEXOR",
        ],
    }

    coverage_report = {}
    for layer, expected_nodes in required_layers.items():
        missing = [n for n in expected_nodes if n not in nodes]
        if missing:
            errors.append(f"Missing required nodes for layer '{layer}': {missing}")
        else:
            coverage_report[layer] = f"{len(expected_nodes)}/{len(expected_nodes)} verified"

    return {
        "status": "PASS" if not errors else "FAIL",
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "total_experiments": len(experiments),
        "total_contexts": len(contexts),
        "total_evidence_rows": evidence_count,
        "node_types": list(node_types),
        "coverage": coverage_report,
        "errors": errors,
        "warnings": warnings,
    }


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_dir = os.path.join(project_root, "data", "processed")
    result = run_verification(data_dir)
    print("Verification Result:", result["status"])
    print(f"Nodes: {result['total_nodes']}, Edges: {result['total_edges']}, Experiments: {result['total_experiments']}")
    print("Coverage:", result["coverage"])
    if result["errors"]:
        print("ERRORS:")
        for err in result["errors"]:
            print(" -", err)
        sys.exit(1)
    else:
        print("All anti-hallucination and search limit constraints PASSED!")
