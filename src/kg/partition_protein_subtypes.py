"""
Partitions protein nodes into:
1. transcription_factor
2. enzyme
3. protein
"""
raise RuntimeError("Retired legacy transform: unverified enrichment or obsolete identity schema. Use python -m src.kg.rebuild; curate source-backed records in data/processed.")

import os
import csv
from collections import Counter


def partition_proteins(data_dir: str):
    nodes_file = os.path.join(data_dir, "nodes.csv")
    with open(nodes_file, "r", encoding="utf-8") as f:
        nodes = list(csv.DictReader(f))

    # Definitive Transcription Factors in Osteoclastogenesis
    TF_GENES = {
        'NFATC1', 'NFATC2', 'FOS', 'JUN', 'JUNB', 'JUND', 'FOSB', 'FRA1', 'FRA2', 'FOSL1', 'FOSL2',
        'RELA', 'RELB', 'REL', 'NFKB1', 'NFKB2', 'SPI1', 'MITF', 'TFE3', 'CEBPA', 'CREB1',
        'IRF8', 'PRDM1', 'BCL6', 'RBPJ', 'MAFB', 'TGIF2', 'SREBF2', 'IRF7', 'HIF1A', 'PPARG',
        'MYC', 'RUNX2', 'ESR1', 'ATF1', 'ATF2', 'ATF4'
    }

    # Definitive Enzymes (Metabolic enzymes, kinases, proteases, synthases, phosphatases, ATPases, epigenetic enzymes)
    ENZYME_GENES = {
        # Glycolysis & Fermentation
        'HK2', 'GPI', 'PFKFB3', 'PFKM', 'ALDOA', 'GAPDH', 'PGK1', 'PGAM1', 'ENO1', 'PKM', 'LDHA',
        # TCA Cycle & Amino Acid Metabolism
        'PDHA1', 'CS', 'ACO2', 'IDH1', 'IDH2', 'OGDH', 'SUCLG1', 'SDHA', 'FH', 'MDH1', 'MDH2',
        'PC', 'GLS', 'PHGDH', 'PSAT1', 'PSPH', 'ACOD1', 'GOT1', 'GOT2',
        # Kinases & Phosphatases in Osteoclast Signaling
        'SRC', 'PTK2B', 'PTK2', 'SYK', 'BTK', 'TEC', 'PLCG2', 'PPP3CA', 'CAMK4',
        'CHUK', 'IKBKB', 'IKBKG', 'MAP3K14', 'MAP3K7', 'MAPK14', 'MAPK8', 'MAPK1', 'MAPK3',
        'MAPK11', 'MAPK12', 'MAPK13', 'MAPK9', 'MAPK10', 'MAP3K1', 'MAP3K5', 'RAF1',
        'MAP2K1', 'MAP2K2', 'MAP2K3', 'MAP2K4', 'MAP2K6', 'MAP2K7',
        'PIK3CA', 'AKT1', 'GSK3B', 'JAK1', 'JAK2', 'TYK2',
        'DUSP1', 'DUSP6', 'PPM1D',
        # Proteases & Acidification Enzymes
        'CTSK', 'ACP5', 'MMP9', 'MMP2', 'MMP3', 'MMP8', 'MMP13', 'CA2',
        # E3 / E2 Ubiquitin Ligases & Deubiquitinases
        'CBLB', 'CBL', 'CYLD', 'UBE2N',
        # Epigenetic Histone/DNA Modifying Enzymes
        'PRMT6', 'KDM6B', 'KDM4A', 'EZH2', 'SIRT1', 'SIRT3', 'SIRT6', 'EP300', 'TET2', 'DNMT3A', 'HDAC1', 'HDAC2', 'HDAC5'
    }

    updated_nodes = []
    for n in nodes:
        curr_type = n["type"]
        nid = n["node_id"]
        name = n["name"].lower()
        sym = nid.replace("HGNC:", "").upper()

        if curr_type == "protein":
            if sym in TF_GENES or "transcription factor" in name:
                new_type = "transcription_factor"
            elif sym in ENZYME_GENES or any(term in name for term in [
                'kinase', 'synthase', 'dehydrogenase', 'phosphatase', 'protease', 'hydrolase',
                'peptidase', 'isomerase', 'transferase', 'lyase', 'ligase', 'carboxylase',
                'mutase', 'aldolase', 'enolase', 'carbonic anhydrase', 'ubiquitin-conjugating'
            ]):
                new_type = "enzyme"
            else:
                new_type = "protein"
        else:
            new_type = curr_type

        updated_nodes.append({
            "node_id": n["node_id"],
            "type": new_type,
            "name": n["name"],
            "taxon": n["taxon"],
            "compartment": n["compartment"],
            "aliases": n["aliases"]
        })

    fieldnames = ["node_id", "type", "name", "taxon", "compartment", "aliases"]
    with open(nodes_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_nodes)

    print("Successfully partitioned protein nodes!")
    print(f"Total Nodes: {len(updated_nodes)}")
    print("Subtypes Breakdown:")
    for k, v in Counter(n["type"] for n in updated_nodes).most_common():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_dir = os.path.join(project_root, "data", "processed")
    partition_proteins(data_dir)
