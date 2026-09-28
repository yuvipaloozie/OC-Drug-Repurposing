"""
Generates an interactive KEGG-styled Knowledge Graph Explorer for osteoclastogenesis.
Features:
- Pure white background matching KEGG pathway diagrams.
- Rounded rectangle pill capsules (border-radius: 6px) for proteins, enzymes, TFs, RNAs, metabolites, drugs, phenotypes.
- Clean circular badges for small second messengers (IP3, Ca2+ oscillation, ROS) and DNA promoter elements.
- Clean color palette matching user specifications:
    * Proteins: soft green (#dcfce7, border #16a34a)
    * Enzymes: soft blue (#dbeafe, border #2563eb)
    * Transcription Factors: soft orange (#ffedd5, border #ea580c)
    * Epigenetics: soft purple (#f3e8ff, border #9333ea)
    * RNA (miRNA/mRNA): soft red (#fee2e2, border #dc2626)
    * Metabolites: soft amber (#fef3c7, border #d97706)
    * Drugs: soft teal (#ccfbf1, border #0d9488)
    * Phenotypes / Structures: soft rose (#ffe4e6, border #e11d48)
- KEGG Cell Architecture mode:
    * Extracellular microenvironment with donor cell tags (Osteoblasts, Th1 cells, BMMs)
    * Plasma membrane (double lipid bilayer)
    * Cytoplasm with pathway bubbles (PI3K-Akt, NF-κB, MAPK, Calcium, Jak-STAT, Metabolism)
    * Nuclear membrane (vertical dashed line)
    * Nucleus with DNA binding elements
    * Bone resorption lacuna and matrix
- Interactive toggles:
    * Free drag-and-drop of any node with real-time edge stretching
    * View mode toggle: KEGG Cell Architecture vs Free-Form Physics Network
    * Physics toggle: Pause / Resume repulsive force simulation
    * Edge declutter toggle: Focus Mode (Connected Edges Only) vs Show All Edges
    * Pathway dropdown filter (including KEGG Canonical Signaling, Metabolism, Fusion, Cytoskeleton, Resorption)
    * Fact search bar with auto-centering
    * Collapsible pharmacological evidence drawer with PubMed links
"""

import os
import csv
import json
import math


def build_kegg_app(data_dir: str, output_paths: list):
    def read_csv(filename):
        with open(os.path.join(data_dir, filename), "r", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    nodes = read_csv("nodes.csv")
    edges = read_csv("edges.csv")
    experiments = read_csv("experiments.csv")
    evidence = read_csv("edge_evidence.csv")

    exp_map = {e["experiment_id"]: e for e in experiments}
    ev_map = {}
    for ev in evidence:
        eid = ev["edge_id"]
        if eid not in ev_map:
            ev_map[eid] = []
        exp_info = exp_map.get(ev.get("experiment_id", ""), {})
        ev_combined = dict(ev)
        if exp_info:
            ev_combined["paper_id"] = exp_info.get("paper_id", "")
            ev_combined["cell_type"] = exp_info.get("cell_type", "")
            ev_combined["treatment"] = exp_info.get("treatment", "")
            ev_combined["dose"] = exp_info.get("dose", "")
            ev_combined["figure_or_table"] = exp_info.get("figure_or_table", "")
            ev_combined["endpoint"] = exp_info.get("endpoint", "")
        ev_map[eid].append(ev_combined)

    for edge in edges:
        edge["evidence"] = ev_map.get(edge["edge_id"], [])

    # Calculate degrees and literature citations
    node_papers = {}
    node_ev_counts = {}
    node_degrees = {}
    for n in nodes:
        nid = n["node_id"]
        node_papers[nid] = set()
        node_ev_counts[nid] = 0
        node_degrees[nid] = 0

    for e in edges:
        s = e["source_id"]
        t = e["target_id"]
        if s in node_degrees:
            node_degrees[s] += 1
        if t in node_degrees:
            node_degrees[t] += 1
        for ev in e.get("evidence", []):
            paper = ev.get("paper_id", "")
            if s in node_papers and paper:
                node_papers[s].add(paper)
            if t in node_papers and paper:
                node_papers[t].add(paper)
            if s in node_ev_counts:
                node_ev_counts[s] += 1
            if t in node_ev_counts:
                node_ev_counts[t] += 1

    # Exact Classification rules based on user request
    TF_SET = {
        'HGNC:NFATC1', 'HGNC:FOS', 'HGNC:JUN', 'HGNC:SPI1', 'HGNC:MITF', 'HGNC:TFE3',
        'HGNC:CEBPA', 'HGNC:CREB1', 'HGNC:NFKB1', 'HGNC:RELA', 'HGNC:NFKB2', 'HGNC:RELB',
        'HGNC:REL', 'HGNC:IRF8', 'HGNC:PRDM1', 'HGNC:BCL6', 'HGNC:RBPJ', 'HGNC:MAFB', 'HGNC:TGIF2',
        'HGNC:SREBF2', 'HGNC:IRF7', 'HGNC:HIF1A'
    }
    EPIGENETIC_SET = {
        'HGNC:PRMT6', 'HGNC:KDM6B', 'HGNC:KDM4A', 'HGNC:EZH2', 'HGNC:SIRT1', 'HGNC:SIRT3', 'HGNC:SIRT6',
        'HGNC:EP300', 'HGNC:TET2', 'HGNC:DNMT3A', 'HGNC:DPY30', 'HGNC:ASXL1', 'HGNC:HDAC1',
        'HGNC:HDAC2', 'HGNC:HDAC5',
        'CHREV:H3K27me3_demethylation_Nfatc1',
        'CHREV:H3R2me2a_fao_promoters', 'CHREV:H3K9ac_H3K27ac_promoters',
        'CHREV:TET2_5hmC_hydroxymethylation', 'CHREV:EZH2_H3K27me3_repression'
    }
    ENZYME_SET = {
        'HGNC:HK2', 'HGNC:GPI', 'HGNC:PFKFB3', 'HGNC:PFKM', 'HGNC:ALDOA', 'HGNC:GAPDH',
        'HGNC:PGK1', 'HGNC:PGAM1', 'HGNC:ENO1', 'HGNC:PKM', 'HGNC:LDHA', 'HGNC:CS',
        'HGNC:ACO2', 'HGNC:IDH2', 'HGNC:OGDH', 'HGNC:SUCLG1', 'HGNC:SDHA', 'HGNC:FH',
        'HGNC:MDH2', 'HGNC:PC', 'HGNC:GLS', 'HGNC:PHGDH', 'HGNC:PSAT1', 'HGNC:PSPH',
        'HGNC:ACOD1', 'HGNC:SRC', 'HGNC:PTK2B', 'HGNC:SYK', 'HGNC:BTK', 'HGNC:PLCG2',
        'HGNC:PPP3CA', 'HGNC:CAMK4', 'HGNC:CHUK', 'HGNC:IKBKB', 'HGNC:IKBKG', 'HGNC:MAP3K14',
        'HGNC:MAP3K7', 'HGNC:MAPK14', 'HGNC:MAPK8', 'HGNC:MAPK1', 'HGNC:CTSK', 'HGNC:ACP5',
        'HGNC:MMP9', 'HGNC:CA2', 'HGNC:CBLB', 'HGNC:CBL', 'HGNC:CYLD', 'HGNC:MAP3K1',
        'HGNC:MAP3K5', 'HGNC:RAF1', 'HGNC:MAP2K1', 'HGNC:MAP2K2', 'HGNC:MAP2K3', 'HGNC:MAP2K6',
        'HGNC:MAP2K4', 'HGNC:MAP2K7', 'HGNC:MAPK3', 'HGNC:MAPK11', 'HGNC:MAPK12', 'HGNC:MAPK13',
        'HGNC:MAPK9', 'HGNC:MAPK10', 'HGNC:PIK3CA', 'HGNC:AKT1', 'HGNC:GSK3B', 'HGNC:TEC',
        'HGNC:DUSP1', 'HGNC:DUSP6', 'HGNC:PPM1D', 'HGNC:MMP2', 'HGNC:MMP3', 'HGNC:MMP8', 'HGNC:MMP13',
        'HGNC:PDHA1'
    }

    # Short label overrides to match KEGG diagram exactly
    SHORT_NAME_MAP = {
        'HGNC:TNFSF11': 'RANKL',
        'HGNC:TNFRSF11A': 'RANK',
        'HGNC:TNFRSF11B': 'OPG',
        'HGNC:CSF1': 'M-CSF',
        'HGNC:CSF1R': 'c-Fms',
        'HGNC:TRAF6': 'TRAF2/6',
        'HGNC:TRAF2': 'TRAF2',
        'HGNC:TRAF3': 'TRAF3',
        'HGNC:MAP3K7': 'TAK1',
        'HGNC:TAB1': 'TAB1',
        'HGNC:TAB2': 'TAB2',
        'HGNC:CHUK': 'IKKα',
        'HGNC:IKBKB': 'IKKβ',
        'HGNC:IKBKG': 'IKKγ',
        'HGNC:NFKBIA': 'IκB',
        'HGNC:NFKB1': 'NFκB',
        'HGNC:RELA': 'RELA',
        'HGNC:NFKB2': 'NFκB2',
        'HGNC:RELB': 'RelB',
        'HGNC:MAP3K14': 'NIK',
        'HGNC:MAP2K1': 'MEK1',
        'HGNC:MAP2K6': 'MKK6',
        'HGNC:MAP2K7': 'MKK7',
        'HGNC:MAPK14': 'p38',
        'HGNC:MAPK8': 'JNK',
        'HGNC:FOS': 'c-Fos',
        'HGNC:JUN': 'c-Jun',
        'HGNC:NFATC1': 'NFATc1',
        'HGNC:NFATC2': 'NFATc2',
        'HGNC:SPI1': 'PU.1',
        'HGNC:MITF': 'MITF',
        'HGNC:CREB1': 'CREB',
        'HGNC:PPARG': 'PPARγ',
        'HGNC:SYK': 'Syk',
        'HGNC:BLNK': 'BLNK',
        'HGNC:LCP2': 'SLP76',
        'HGNC:BTK': 'Btk/Tek',
        'HGNC:TEC': 'Tec',
        'HGNC:PLCG2': 'PLCγ',
        'HGNC:TYROBP': 'DAP12',
        'HGNC:FCER1G': 'FcRγ',
        'HGNC:OSCAR': 'OSCAR',
        'HGNC:TREM2': 'TREM2',
        'HGNC:SIRPB1': 'SIRP-β1',
        'HGNC:PIRA': 'PIR-A',
        'HGNC:CALM1': 'Calmodulin',
        'HGNC:PPP3CA': 'CN',
        'HGNC:CAMK4': 'CaMKIV',
        'HGNC:CTSK': 'CTSK',
        'HGNC:ACP5': 'TRAP',
        'HGNC:CALCR': 'CTR',
        'HGNC:ITGB3': 'β3 integrin',
        'HGNC:ITGAV': 'αv integrin',
        'HGNC:SRC': 'Src',
        'HGNC:PIK3CA': 'PI3K',
        'HGNC:AKT1': 'Akt',
        'HGNC:GRB2': 'GRB2',
        'HGNC:MAPK1': 'ERK',
        'HGNC:IFNG': 'IFNγ',
        'HGNC:IFNB1': 'IFNβ',
        'HGNC:IFNAR1': 'IFNAR',
        'HGNC:IFNGR1': 'IFNGR',
        'HGNC:IL1R1': 'IL1R',
        'HGNC:IL1B': 'IL1',
        'HGNC:TNF': 'TNFα',
        'HGNC:TNFRSF1A': 'TNFR1',
        'HGNC:TGFB1': 'TGFβ',
        'HGNC:TGFBR1': 'TGFBR',
        'HGNC:CYLD': 'CYLD',
        'HGNC:SQSTM1': 'p62',
        'HGNC:FHL2': 'FHL2',
        'HGNC:GAB2': 'Gab2',
        'HGNC:RAC1': 'Rac1',
        'HGNC:JAK1': 'Jak1',
        'HGNC:STAT1': 'STAT1',
        'HGNC:IRF9': 'IRF9',
        'HGNC:SOCS1': 'SOCS1',
        'HGNC:SOCS3': 'SOCS3',
        'CHEBI:29108': 'Ca2+ oscillation',
        'CHEBI:16651': 'L-Lactate',
        'CHEBI:32816': 'Pyruvate',
        'CHEBI:17234': 'Glucose',
        'CHEBI:30805': 'Itaconate',
        'CHEBI:16947': 'Citrate',
        'CHEBI:30915': 'α-KG',
        'CHEBI:18050': 'L-Glutamine',
        'CHEBI:16015': 'L-Glutamate',
        'CHEBI:17115': 'L-Serine',
        'CHEBI:17544': 'CO2',
        'CHEBI:17996': 'HCO3-',
        'CHEBI:15378': 'H+',
        'CHEBI:15351': 'Acetyl-CoA',
        'CHEBI:14314': 'G6P',
        'CHEBI:15946': 'F6P',
        'CHEBI:16905': 'F-1,6-BP',
        'CHEBI:17794': '3-PG',
        'CHEBI:18021': 'PEP',
        'HGNC:DCSTAMP': 'DC-STAMP',
        'HGNC:OCSTAMP': 'OC-STAMP',
        'HGNC:ATP6V0D2': 'ATP6V0D2',
        'HGNC:TCIRG1': 'TCIRG1',
        'HGNC:CA2': 'CA2',
        'STRUCT:syncytium': 'Syncytium',
        'STRUCT:f_actin_sealing_zone': 'Sealing Zone',
        'STRUCT:podosome_belt': 'Podosome Belt',
        'STRUCT:ruffled_border': 'Ruffled Border',
        'STRUCT:resorption_lacuna': 'Resorption Lacuna',
        'PHENO:bone_resorption': 'Bone Resorption',
        'PHENO:trap_production': 'TRAP Secretion',
        'PHENO:osteoclast_differentiation': 'OC Differentiation'
    }

    # Curated KEGG Compartmental Coordinates (Canvas Width 3400, Height 2000)
    KEGG_COORDS = {
        # Extracellular Ligands (X ~ 180 - 240)
        'HGNC:CSF1': (200, 140),
        'HGNC:IFNG': (200, 220),
        'HGNC:IL1B': (200, 300),
        'HGNC:TNF': (200, 370),
        'HGNC:TGFB1': (200, 430),
        'HGNC:TNFSF11': (200, 520),
        'HGNC:TNFRSF11B': (130, 560), # OPG
        'HGNC:OSCAR': (200, 770),
        'HGNC:TREM2': (200, 850),
        'HGNC:IFNB1': (200, 1060),
        'CHEBI:17234': (200, 1260), # Glucose
        'CHEBI:18050': (200, 1680), # L-Glutamine
        'CHEBI:29108': (200, 920),  # Calcium
        'CHEMBL:DENOSUMAB': (100, 490),
        'CHEMBL:ZOLEDRONATE': (100, 620),
        'CHEMBL:ALENDRONATE': (100, 680),

        # Plasma Membrane Receptors (X ~ 430 - 450)
        'HGNC:CSF1R': (440, 140),
        'HGNC:IFNGR1': (440, 220),
        'HGNC:IL1R1': (440, 300),
        'HGNC:TNFRSF1A': (440, 370),
        'HGNC:TGFBR1': (440, 430),
        'HGNC:TNFRSF11A': (440, 520),
        'HGNC:FCER1G': (440, 770),
        'HGNC:TYROBP': (440, 850),
        'HGNC:SIRPB1': (440, 900),
        'HGNC:PIRA': (440, 730),
        'HGNC:IFNAR1': (440, 1060),
        'HGNC:SLC2A1': (440, 1260), # GLUT1
        'HGNC:SLC16A1': (440, 1360),# MCT1
        'HGNC:SLC1A5': (440, 1680), # ASCT2
        'HGNC:ITGAV': (440, 640),
        'HGNC:ITGB3': (440, 680),
        'HGNC:DCSTAMP': (440, 580),
        'HGNC:OCSTAMP': (440, 610),

        # Cytosolic Cascade 1: M-CSF -> c-Fms -> GRB2 -> ERK & Src -> PI3K -> Akt
        'HGNC:GRB2': (620, 140),
        'HGNC:SOS1': (760, 140),
        'HGNC:HRAS': (890, 140),
        'HGNC:RAF1': (1020, 140),
        'HGNC:MAP2K1': (1160, 140),
        'HGNC:MAPK1': (1300, 140),
        'HGNC:MAPK3': (1300, 180),
        'HGNC:SRC': (620, 230),
        'HGNC:PIK3CA': (800, 230),
        'HGNC:AKT1': (980, 230),

        # Cytosolic Cascade 2: RANK -> TRAF6 -> IKKs -> NF-kB
        'HGNC:TRAF6': (620, 520),
        'HGNC:TRAF2': (620, 480),
        'HGNC:TRAF3': (620, 440),
        'HGNC:CYLD': (590, 390),
        'HGNC:SQSTM1': (660, 390),
        'HGNC:FHL2': (600, 580),
        'HGNC:GAB2': (670, 580),

        # Noncanonical NF-kB
        'HGNC:MAP3K14': (810, 440),
        'HGNC:CHUK': (1000, 440),
        'HGNC:NFKB2': (1200, 440),
        'HGNC:RELB': (1340, 440),

        # Canonical NF-kB
        'HGNC:IKBKG': (810, 510),
        'HGNC:IKBKB': (960, 510),
        'HGNC:NFKBIA': (1110, 510),
        'HGNC:NFKB1': (1260, 510),
        'HGNC:RELA': (1400, 510),

        # MAPK / AP-1
        'HGNC:MAP3K7': (810, 610),
        'HGNC:TAB1': (810, 650),
        'HGNC:TAB2': (810, 690),
        'HGNC:MAP2K6': (1010, 590),
        'HGNC:MAP2K7': (1010, 640),
        'HGNC:MAPK14': (1220, 590),
        'HGNC:MAPK8': (1220, 640),
        'HGNC:RAC1': (810, 730),

        # ITAM / Calcium Flux
        'HGNC:SYK': (620, 810),
        'HGNC:BLNK': (770, 810),
        'HGNC:LCP2': (770, 850),
        'HGNC:BTK': (700, 760),
        'HGNC:TEC': (700, 860),
        'HGNC:PLCG2': (940, 810),
        'HGNC:CALM1': (1360, 780),
        'HGNC:PPP3CA': (1490, 780),
        'HGNC:CAMK4': (1490, 850),

        # IFN-beta feedback
        'HGNC:JAK1': (620, 1060),
        'HGNC:STAT1': (820, 1060),
        'HGNC:IRF9': (1020, 1060),

        # Glycolysis (Cytosolic, Y ~ 1220 - 1380)
        'HGNC:HK2': (600, 1220),
        'HGNC:GPI': (720, 1220),
        'HGNC:PFKFB3': (840, 1220),
        'HGNC:PFKM': (960, 1220),
        'HGNC:ALDOA': (1080, 1220),
        'HGNC:GAPDH': (1200, 1220),
        'HGNC:PGK1': (1320, 1220),
        'HGNC:PGAM1': (1440, 1220),
        'HGNC:ENO1': (1260, 1310),
        'HGNC:PKM': (1380, 1310),
        'HGNC:LDHA': (1500, 1310),
        'CHEBI:14314': (660, 1260), # G6P
        'CHEBI:15946': (780, 1260), # F6P
        'CHEBI:16905': (900, 1260), # F-1,6-BP
        'CHEBI:17138': (1020, 1260),# G3P
        'CHEBI:17794': (1140, 1260),# 3-PG
        'CHEBI:18021': (1260, 1260),# PEP
        'CHEBI:32816': (1380, 1260),# Pyruvate
        'CHEBI:16651': (1500, 1260),# Lactate

        # Serine Biosynthesis (Y ~ 1400 - 1480)
        'HGNC:PHGDH': (740, 1420),
        'HGNC:PSAT1': (920, 1420),
        'HGNC:PSPH': (1100, 1420),
        'CHEBI:17115': (1260, 1420), # L-Serine

        # TCA Cycle & Mitochondria (Y ~ 1520 - 1800)
        'HGNC:PDHA1': (620, 1540),
        'CHEBI:15351': (740, 1540), # Acetyl-CoA
        'HGNC:CS': (870, 1540),
        'CHEBI:16947': (1000, 1540), # Citrate
        'HGNC:ACO2': (1120, 1540),
        'CHEBI:30887': (1240, 1540), # Isocitrate
        'HGNC:IDH2': (1360, 1540),
        'CHEBI:30915': (1480, 1540), # a-KG
        'HGNC:OGDH': (1480, 1620),
        'CHEBI:15380': (1360, 1620), # Succinyl-CoA
        'HGNC:SUCLG1': (1240, 1620),
        'CHEBI:15741': (1120, 1620), # Succinate
        'HGNC:SDHA': (1000, 1620),
        'CHEBI:18012': (870, 1620),  # Fumarate
        'HGNC:FH': (740, 1620),
        'CHEBI:15589': (620, 1620),  # Malate
        'HGNC:MDH2': (620, 1700),
        'CHEBI:16452': (740, 1700),  # OAA
        'HGNC:ACOD1': (960, 1480),   # Itaconate enzyme
        'CHEBI:30805': (1080, 1480), # Itaconate
        'HGNC:GLS': (740, 1740),
        'CHEBI:16015': (870, 1740),  # Glutamate

        # Nucleus: Transcription Factors (X ~ 1760 - 1840)
        'HGNC:NFATC1': (1800, 780),
        'HGNC:NFATC2': (1800, 720),
        'HGNC:FOS': (1800, 580),
        'HGNC:JUN': (1800, 630),
        'HGNC:SPI1': (1800, 840),
        'HGNC:MITF': (1800, 890),
        'HGNC:CREB1': (1800, 940),
        'HGNC:PPARG': (1800, 990),

        # Epigenetics & Checkpoints in Nucleus (X ~ 1900 - 1980)
        'HGNC:KDM6B': (1940, 280),
        'HGNC:PRMT6': (1940, 330),
        'HGNC:EZH2': (1940, 380),
        'HGNC:TET2': (1940, 430),
        'HGNC:SIRT1': (1940, 480),
        'HGNC:IRF8': (1940, 640),
        'HGNC:PRDM1': (1940, 690),
        'HGNC:BCL6': (1940, 740),

        # DNA Promoters (X ~ 2080)
        'nfatc1_promoter': (2080, 780),
        'ctsk_promoter': (2080, 580),
        'acp5_promoter': (2080, 640),
        'dcstamp_promoter': (2080, 710),
        'atp6v0d2_promoter': (2080, 840),

        # Transcripts (mRNA) (X ~ 2220)
        'MRNA:Nfatc1': (2220, 780),
        'MRNA:Ctsk': (2220, 580),
        'MRNA:Acp5': (2220, 640),
        'MRNA:Dcstamp': (2220, 710),

        # Effector Machinery / Lacuna (X ~ 2440 - 2520)
        'HGNC:CTSK': (2460, 580),
        'HGNC:ACP5': (2460, 640),
        'HGNC:CALCR': (2460, 700),
        'HGNC:CA2': (2460, 760),
        'HGNC:TCIRG1': (2460, 820),
        'HGNC:ATP6V0D2': (2460, 880),
        'HGNC:CLCN7': (2460, 930),
        'HGNC:MMP9': (2460, 980),

        # Phenotypes & Structures (X ~ 2680 - 2900)
        'STRUCT:syncytium': (2700, 700),
        'STRUCT:podosome_belt': (2700, 760),
        'STRUCT:f_actin_sealing_zone': (2700, 820),
        'STRUCT:resorption_lacuna': (2700, 880),
        'PHENO:bone_resorption': (2920, 820),
        'PHENO:trap_production': (2920, 640),
        'PHENO:osteoclast_differentiation': (2920, 730)
    }

    # Group unassigned nodes by compartment and type to give them clean non-overlapping coordinates
    assigned_keys = set(KEGG_COORDS.keys())
    comp_bins = {
        'extracellular': [],
        'plasma_membrane': [],
        'cytoplasm': [],
        'mitochondria': [],
        'nucleus': [],
        'whole_cell': [],
        'lysosome': [],
        'resorption_lacuna': []
    }

    for n in nodes:
        nid = n["node_id"]
        if nid not in assigned_keys:
            comp = n.get("compartment", "cytoplasm")
            if comp not in comp_bins:
                comp = "cytoplasm"
            comp_bins[comp].append(n)

    # Place unassigned extracellular nodes (X ~ 100 - 160)
    for i, n in enumerate(comp_bins['extracellular']):
        KEGG_COORDS[n["node_id"]] = (120 + (i % 2) * 50, 740 + i * 44)

    # Place unassigned plasma membrane nodes (X ~ 430 - 450)
    for i, n in enumerate(comp_bins['plasma_membrane']):
        KEGG_COORDS[n["node_id"]] = (440, 960 + i * 42)

    # Place unassigned cytoplasm nodes in spacious column blocks
    for i, n in enumerate(comp_bins['cytoplasm']):
        col = i % 5
        row = i // 5
        KEGG_COORDS[n["node_id"]] = (580 + col * 180, 260 + row * 44)

    # Place unassigned mitochondria nodes
    for i, n in enumerate(comp_bins['mitochondria']):
        col = i % 4
        row = i // 4
        KEGG_COORDS[n["node_id"]] = (600 + col * 190, 1780 + row * 44)

    # Place unassigned nucleus nodes
    for i, n in enumerate(comp_bins['nucleus']):
        col = i % 3
        row = i // 3
        KEGG_COORDS[n["node_id"]] = (1750 + col * 150, 1050 + row * 44)

    # Place unassigned whole cell / structures / phenotypes
    for i, n in enumerate(comp_bins['whole_cell'] + comp_bins['lysosome'] + comp_bins['resorption_lacuna']):
        KEGG_COORDS[n["node_id"]] = (2650 + (i % 2) * 160, 1040 + (i // 2) * 48)

    classified_nodes = []
    for n in nodes:
        nid = n["node_id"]
        ntype = n["type"]

        if nid in TF_SET or ntype == "gene":
            category = "transcription_factor"
        elif nid in EPIGENETIC_SET or ntype == "chromatin_event":
            category = "epigenetics"
        elif ntype in ["mrna", "mirna"] or nid.startswith("RNA:") or nid.startswith("MIRNA:") or nid.startswith("MRNA:"):
            category = "rna"
        elif nid in ENZYME_SET:
            category = "enzyme"
        elif ntype == "metabolite":
            category = "metabolite"
        elif ntype == "drug":
            category = "drug"
        elif ntype in ["phenotype", "differentiation_stage"]:
            category = "phenotype"
        elif ntype == "cellular_structure":
            category = "cellular_structure"
        else:
            category = "protein"

        # Short label
        short_name = SHORT_NAME_MAP.get(nid)
        if not short_name:
            aliases = n.get("aliases", "")
            first_alias = aliases.split("|")[0].strip() if aliases else ""
            if first_alias and len(first_alias) <= 15:
                short_name = first_alias
            elif nid.startswith("HGNC:"):
                short_name = nid.replace("HGNC:", "")
            elif nid.startswith("CHEMBL:"):
                short_name = nid.replace("CHEMBL:", "")
            elif nid.startswith("MRNA:"):
                short_name = nid.replace("MRNA:", "") + " mRNA"
            elif nid.startswith("MIRNA:"):
                short_name = nid.replace("MIRNA:mmu-", "")
            elif nid.startswith("STRUCT:"):
                short_name = nid.replace("STRUCT:", "").replace("_", " ")
            elif nid.startswith("PHENO:"):
                short_name = nid.replace("PHENO:", "").replace("_", " ")
            elif nid.startswith("STAGE:"):
                short_name = nid.replace("STAGE:", "").replace("_", " ")
            else:
                short_name = n["name"][:16]

        paper_cnt = len(node_papers.get(nid, set()))
        ev_cnt = node_ev_counts.get(nid, 0)
        deg = node_degrees.get(nid, 0)
        is_hub = paper_cnt >= 4 or deg >= 10

        # Small circular badge if second messenger, ion, or promoter
        is_circle = (
            nid in ['CHEBI:29108', 'CHEBI:17544', 'CHEBI:17996', 'CHEBI:15378']
            or 'promoter' in nid
            or (ntype == 'metabolite' and len(short_name) <= 4)
        )

        # Dynamic box width to comfortably fit text
        char_len = len(short_name)
        w = 32 if is_circle else max(68, min(140, int(char_len * 7.5 + 20)))
        h = 32 if is_circle else (30 if is_hub else 26)

        # Coordinates
        kx, ky = KEGG_COORDS.get(nid, (1000, 800))

        # Organic initial positions for free-form physics
        angle = (hash(nid) % 360) * math.pi / 180
        dist = 300 + (hash(nid) % 800)
        fx = 1700 + math.cos(angle) * dist
        fy = 1000 + math.sin(angle) * (dist * 0.7)

        item = dict(n)
        item["category"] = category
        item["short_name"] = short_name
        item["paper_count"] = paper_cnt
        item["evidence_count"] = ev_cnt
        item["degree"] = deg
        item["is_hub"] = is_hub
        item["shape"] = 'circle' if is_circle else 'pill'
        item["w"] = w
        item["h"] = h
        item["radius"] = 16 if is_circle else 8
        item["kegg_x"] = kx
        item["kegg_y"] = ky
        item["free_x"] = fx
        item["free_y"] = fy
        item["x"] = kx
        item["y"] = ky
        classified_nodes.append(item)

    kg_payload = {
        "nodes": classified_nodes,
        "edges": edges,
    }

    kg_json = json.dumps(kg_payload, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Osteoclast Differentiation Knowledge Graph (KEGG Architecture)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    body {{
      background-color: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }}
    .custom-scroll::-webkit-scrollbar {{
      width: 5px;
    }}
    .custom-scroll::-webkit-scrollbar-thumb {{
      background: #cbd5e1;
      border-radius: 4px;
    }}
    canvas {{
      background-color: #ffffff;
    }}
  </style>
</head>
<body class="h-screen flex flex-col font-sans antialiased overflow-hidden select-none bg-white">

  <!-- Minimalist Clean KEGG Header Bar -->
  <header class="bg-white border-b border-slate-300 px-5 py-2.5 flex items-center justify-between z-20 shrink-0 shadow-xs">
    
    <!-- Title & View Mode Selector -->
    <div class="flex items-center space-x-3">
      <div class="px-2.5 py-1 border border-slate-800 text-slate-900 font-bold tracking-wider text-xs uppercase bg-white">
        OSTEOCLAST DIFFERENTIATION
      </div>
      
      <!-- Layout Mode Toggle -->
      <div class="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs">
        <button id="btn-mode-kegg" class="px-2.5 py-1 rounded-md font-semibold text-xs transition bg-white text-slate-900 shadow-xs">
          KEGG Architecture
        </button>
        <button id="btn-mode-free" class="px-2.5 py-1 rounded-md font-medium text-xs text-slate-600 hover:text-slate-900 transition">
          Free-Form Physics
        </button>
      </div>

      <!-- Physics Toggle Button -->
      <button id="btn-physics-toggle" class="flex items-center space-x-1.5 px-2.5 py-1 border border-slate-300 hover:border-slate-400 rounded-md bg-white text-slate-700 text-xs font-medium transition shadow-2xs">
        <span id="physics-indicator" class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span id="physics-label">Physics: Active</span>
      </button>

      <!-- Edge Declutter Filter -->
      <button id="btn-edge-filter" class="flex items-center space-x-1.5 px-2.5 py-1 border border-slate-300 hover:border-slate-400 rounded-md bg-white text-slate-700 text-xs font-medium transition shadow-2xs">
        <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        <span id="edge-filter-label">Focus Mode: Off</span>
      </button>

      <!-- Pathway Dropdown -->
      <div class="relative">
        <select id="pathway-select" class="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-3 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs">
          <option value="kegg">★ KEGG Canonical Signaling (RANKL-NFATc1 Axis)</option>
          <option value="all">Display All Pathways (Full 268-Node Graph)</option>
          <option value="glycolysis">Energy Metabolism & Glycolytic Shift</option>
          <option value="tca">TCA Cycle, Glutaminolysis & Itaconate Shunt</option>
          <option value="signaling">Costimulatory Receptors & Calcium Hubs</option>
          <option value="fusion">Cell Fusion & Syncytium (DC-STAMP / OC-STAMP)</option>
          <option value="cytoskeleton">Actin Sealing Zone & Podosomes (Src / Rac1)</option>
          <option value="resorption">Lacunar Resorption & Acidification (V-ATPase / CTSK / TRAP)</option>
          <option value="brakes">Molecular Brakes & Epigenetics (IRF8 / KDM6B)</option>
          <option value="drugs">Repurposable Therapeutics & Probes</option>
        </select>
      </div>
    </div>

    <!-- Search Box and Zoom Controls -->
    <div class="flex items-center space-x-2">
      <div class="relative w-72">
        <input type="text" id="fact-search" placeholder="Search genes, drugs, facts..."
          class="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-md pl-7 pr-3 py-1 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs">
        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div id="search-results-dropdown" class="hidden absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-72 overflow-y-auto custom-scroll z-50 text-xs divide-y divide-slate-100"></div>
      </div>

      <!-- Zoom and Reset Buttons -->
      <div class="inline-flex rounded-md border border-slate-300 bg-white p-0.5 text-xs shadow-2xs">
        <button id="btn-zoom-in" class="px-2 py-0.5 text-slate-700 hover:bg-slate-100 rounded font-bold" title="Zoom In">+</button>
        <button id="btn-zoom-out" class="px-2 py-0.5 text-slate-700 hover:bg-slate-100 rounded font-bold" title="Zoom Out">-</button>
        <button id="btn-fit-view" class="px-2 py-0.5 text-slate-700 hover:bg-slate-100 rounded font-medium" title="Fit to View">Fit</button>
        <button id="btn-reset-view" class="px-2 py-0.5 text-slate-700 hover:bg-slate-100 rounded font-medium" title="Reset View">Reset</button>
      </div>
    </div>
  </header>

  <!-- Main Canvas & Information Drawer -->
  <div class="flex-1 flex overflow-hidden relative">

    <!-- Interactive Canvas Wrapper -->
    <div class="flex-1 relative bg-white" id="canvas-wrapper">
      <canvas id="kg-canvas" class="w-full h-full absolute inset-0 block cursor-grab"></canvas>

      <!-- Category Legend (Clean minimal floating bar at top-left) -->
      <div class="absolute bottom-3 left-4 bg-white/95 border border-slate-300 rounded-md px-3 py-1.5 shadow-xs text-[11px] backdrop-blur-xs flex items-center space-x-3 pointer-events-auto">
        <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Legend:</span>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#dcfce7] border border-[#16a34a]"></span><span class="text-slate-700">Protein</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#dbeafe] border border-[#2563eb]"></span><span class="text-slate-700">Enzyme</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#ffedd5] border border-[#ea580c]"></span><span class="text-slate-700">Transcription Factor</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#f3e8ff] border border-[#9333ea]"></span><span class="text-slate-700">Epigenetics</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#fee2e2] border border-[#dc2626]"></span><span class="text-slate-700">RNA</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#fef3c7] border border-[#d97706]"></span><span class="text-slate-700">Metabolite / Ion</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#ccfbf1] border border-[#0d9488]"></span><span class="text-slate-700">Drug</span></div>
        <div class="flex items-center space-x-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-[#ffe4e6] border border-[#e11d48]"></span><span class="text-slate-700">Phenotype / Lacuna</span></div>
      </div>
    </div>

    <!-- Right Side: Detail Drawer & Pharmacology Fact Sheet -->
    <aside id="info-drawer" class="w-96 bg-white border-l border-slate-300 flex flex-col shrink-0 shadow-lg z-10 transition-transform duration-200">
      
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <span id="fact-category" class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white bg-slate-500">Target</span>
          <h2 id="fact-title" class="text-sm font-bold text-slate-900 mt-1">Select a Target</h2>
        </div>
        <button id="btn-close-drawer" class="text-slate-400 hover:text-slate-700 p-1 rounded text-xs font-bold">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 text-xs" id="fact-content">
        <div class="text-center py-20 text-slate-400">
          <p>Click any node or drag it freely to view its biological mechanism, interactions, and literature evidence.</p>
        </div>
      </div>

    </aside>

  </div>

  <script>
    const DATA = {kg_json};

    // User-Specified Pastel Color Palette with Crisp Borders (KEGG aesthetic)
    const COLOR_THEMES = {{
      'protein': {{ bg: '#dcfce7', border: '#16a34a', text: '#14532d' }},
      'enzyme': {{ bg: '#dbeafe', border: '#2563eb', text: '#1e3a8a' }},
      'transcription_factor': {{ bg: '#ffedd5', border: '#ea580c', text: '#7c2d12' }},
      'epigenetics': {{ bg: '#f3e8ff', border: '#9333ea', text: '#581c87' }},
      'rna': {{ bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d' }},
      'metabolite': {{ bg: '#fef3c7', border: '#d97706', text: '#78350f' }},
      'drug': {{ bg: '#ccfbf1', border: '#0d9488', text: '#134e4a' }},
      'phenotype': {{ bg: '#ffe4e6', border: '#e11d48', text: '#881337' }},
      'cellular_structure': {{ bg: '#ffe4e6', border: '#e11d48', text: '#881337' }}
    }};

    // Curated KEGG Pathway Member IDs
    const KEGG_CORE_MEMBERS = [
      'HGNC:CSF1', 'HGNC:CSF1R', 'HGNC:GRB2', 'HGNC:MAPK1', 'HGNC:MAPK3', 'HGNC:SRC', 'HGNC:PIK3CA', 'HGNC:AKT1',
      'HGNC:IFNG', 'HGNC:IFNGR1', 'HGNC:STAT1', 'HGNC:IL1B', 'HGNC:IL1R1', 'HGNC:TNF', 'HGNC:TNFRSF1A', 'HGNC:TGFB1', 'HGNC:TGFBR1',
      'HGNC:TNFSF11', 'HGNC:TNFRSF11A', 'HGNC:TNFRSF11B', 'HGNC:TRAF6', 'HGNC:CYLD', 'HGNC:SQSTM1', 'HGNC:FHL2', 'HGNC:GAB2',
      'HGNC:MAP3K14', 'HGNC:CHUK', 'HGNC:IKBKB', 'HGNC:IKBKG', 'HGNC:NFKBIA', 'HGNC:NFKB1', 'HGNC:RELA', 'HGNC:NFKB2', 'HGNC:RELB',
      'HGNC:MAP3K7', 'HGNC:TAB1', 'HGNC:TAB2', 'HGNC:MAP2K1', 'HGNC:MAP2K6', 'HGNC:MAP2K7', 'HGNC:MAPK14', 'HGNC:MAPK8', 'HGNC:RAC1',
      'HGNC:FOS', 'HGNC:JUN', 'HGNC:NFATC1', 'HGNC:NFATC2', 'HGNC:SPI1', 'HGNC:MITF', 'HGNC:CREB1', 'HGNC:PPARG',
      'HGNC:OSCAR', 'HGNC:PIRA', 'HGNC:TREM2', 'HGNC:SIRPB1', 'HGNC:FCER1G', 'HGNC:TYROBP', 'HGNC:SYK', 'HGNC:BLNK', 'HGNC:LCP2',
      'HGNC:BTK', 'HGNC:TEC', 'HGNC:PLCG2', 'CHEBI:29108', 'HGNC:PPP3CA', 'HGNC:CALM1', 'HGNC:CAMK4',
      'HGNC:IFNB1', 'HGNC:IFNAR1', 'HGNC:JAK1', 'HGNC:IRF9', 'HGNC:SOCS1', 'HGNC:SOCS3', 'HGNC:CTSK', 'HGNC:ACP5', 'HGNC:CALCR', 'HGNC:ITGB3',
      'nfatc1_promoter', 'ctsk_promoter', 'acp5_promoter', 'dcstamp_promoter', 'MRNA:Nfatc1', 'MRNA:Ctsk', 'MRNA:Acp5',
      'STRUCT:syncytium', 'PHENO:bone_resorption', 'PHENO:trap_production', 'PHENO:osteoclast_differentiation'
    ];

    // Pathway memberships for filtering
    const PATHWAY_MEMBERS = {{
      'kegg': KEGG_CORE_MEMBERS,
      'glycolysis': ['HGNC:HK2', 'HGNC:GPI', 'HGNC:PFKFB3', 'HGNC:PFKM', 'HGNC:ALDOA', 'HGNC:GAPDH', 'HGNC:PGK1', 'HGNC:PGAM1', 'HGNC:ENO1', 'HGNC:PKM', 'HGNC:LDHA', 'HGNC:HIF1A', 'CHEBI:17234', 'CHEBI:14314', 'CHEBI:15946', 'CHEBI:16905', 'CHEBI:17138', 'CHEBI:16001', 'CHEBI:17794', 'CHEBI:17835', 'CHEBI:18021', 'CHEBI:32816', 'CHEBI:16651', 'CHEMBL:2DG', 'CHEMBL:SHOKI3', 'CHEMBL:PFK15', 'MRNA:Pkm', 'MRNA:Pfkfb3'],
      'tca': ['HGNC:PDHA1', 'HGNC:CS', 'HGNC:ACO2', 'HGNC:IDH2', 'HGNC:OGDH', 'HGNC:SUCLG1', 'HGNC:SDHA', 'HGNC:FH', 'HGNC:MDH2', 'HGNC:PC', 'HGNC:GLS', 'HGNC:PHGDH', 'HGNC:PSAT1', 'HGNC:PSPH', 'HGNC:ACOD1', 'CHEBI:15351', 'CHEBI:16947', 'CHEBI:32838', 'CHEBI:30887', 'CHEBI:30915', 'CHEBI:15380', 'CHEBI:15741', 'CHEBI:18012', 'CHEBI:15589', 'CHEBI:16452', 'CHEBI:30805', 'CHEBI:18050', 'CHEBI:16015', 'CHEBI:17115', 'CHEBI:26523', 'CHEMBL:CBR5884', 'CHEMBL:CB839', 'CHEMBL:4OI'],
      'signaling': ['HGNC:TNFSF11', 'HGNC:TNFRSF11A', 'HGNC:TRAF6', 'HGNC:MAP3K7', 'HGNC:TAB1', 'HGNC:TAB2', 'HGNC:CHUK', 'HGNC:IKBKB', 'HGNC:IKBKG', 'HGNC:NFKBIA', 'HGNC:NFKB1', 'HGNC:RELA', 'HGNC:MAP3K14', 'HGNC:NFKB2', 'HGNC:RELB', 'HGNC:MAP3K5', 'HGNC:MAP2K3', 'HGNC:MAP2K6', 'HGNC:MAPK14', 'HGNC:MAPK11', 'HGNC:MAPK12', 'HGNC:MAPK13', 'HGNC:MAP3K1', 'HGNC:MAP2K4', 'HGNC:MAP2K7', 'HGNC:MAPK8', 'HGNC:MAPK9', 'HGNC:MAPK10', 'HGNC:CSF1', 'HGNC:CSF1R', 'HGNC:RAF1', 'HGNC:MAP2K1', 'HGNC:MAP2K2', 'HGNC:MAPK3', 'HGNC:MAPK1', 'HGNC:CREB1', 'HGNC:FOS', 'HGNC:JUN', 'HGNC:NFATC1', 'HGNC:TYROBP', 'HGNC:FCER1G', 'HGNC:OSCAR', 'HGNC:TREM2', 'HGNC:SIRPB1', 'HGNC:PIRA', 'HGNC:SYK', 'HGNC:LCP2', 'HGNC:BTK', 'HGNC:TEC', 'HGNC:PLCG2', 'CHEBI:29108', 'HGNC:CALM1', 'HGNC:PPP3CA', 'HGNC:CAMK4', 'MRNA:Nfatc1', 'CHEMBL:FK506', 'CHEMBL:DENOSUMAB'],
      'fusion': ['HGNC:DCSTAMP', 'HGNC:OCSTAMP', 'HGNC:ATP6V0D2', 'HGNC:CD9', 'HGNC:CD47', 'HGNC:SNX10', 'HGNC:MSN', 'STRUCT:syncytium', 'MRNA:Dcstamp', 'STAGE:syncytium_prefusion_polykaryon', 'STAGE:mature_resorbing_osteoclast'],
      'cytoskeleton': ['HGNC:ITGAV', 'HGNC:ITGB3', 'HGNC:SRC', 'HGNC:PTK2B', 'HGNC:VAV3', 'HGNC:RAC1', 'HGNC:CDC42', 'HGNC:RHOA', 'HGNC:CTTN', 'HGNC:WAS', 'HGNC:CBL', 'STRUCT:podosome_belt', 'STRUCT:f_actin_sealing_zone', 'STRUCT:resorption_lacuna', 'CHEMBL:DASATINIB', 'CHEMBL:SARACATINIB'],
      'resorption': ['HGNC:CA2', 'CHEBI:17544', 'CHEBI:17996', 'HGNC:TCIRG1', 'HGNC:ATP6V1C1', 'HGNC:ATP6AP1', 'HGNC:ATP6V0D2', 'HGNC:CLCN7', 'STRUCT:ruffled_border', 'STRUCT:resorption_lacuna', 'HGNC:CTSK', 'HGNC:ACP5', 'HGNC:MMP2', 'HGNC:MMP3', 'HGNC:MMP8', 'HGNC:MMP9', 'HGNC:MMP13', 'HGNC:TIMP1', 'HGNC:TIMP2', 'HGNC:TIMP3', 'HGNC:CST6', 'MRNA:Acp5', 'MRNA:Ctsk', 'PHENO:bone_resorption', 'PHENO:trap_production'],
      'brakes': ['HGNC:IRF8', 'HGNC:PRDM1', 'HGNC:BCL6', 'HGNC:SREBF2', 'HGNC:IRF7', 'HGNC:GNA13', 'HGNC:RGS10', 'HGNC:RGS12', 'HGNC:DUSP1', 'HGNC:DUSP6', 'HGNC:PPM1D', 'HGNC:AMBN', 'HGNC:CYLD', 'HGNC:CBLB', 'HGNC:IFT80', 'HGNC:IFNG', 'HGNC:IL4', 'HGNC:IL10', 'HGNC:IL13', 'HGNC:IL33', 'HGNC:RBPJ', 'HGNC:EFNB2', 'HGNC:EPHB4', 'HGNC:XPO1', 'CHEMBL:SELINEXOR'],
      'drugs': ['CHEMBL:DENOSUMAB', 'CHEMBL:ZOLEDRONATE', 'CHEMBL:ALENDRONATE', 'CHEMBL:DASATINIB', 'CHEMBL:SARACATINIB', 'CHEMBL:FK506', 'CHEMBL:SELINEXOR', 'CHEMBL:CBR5884', 'CHEMBL:CB839', 'CHEMBL:EPZ020411', 'CHEMBL:4OI', 'CHEMBL:2DG', 'CHEMBL:SHOKI3', 'CHEMBL:PFK15']
    }};

    let state = {{
      nodes: DATA.nodes,
      edges: DATA.edges,
      selectedNode: null,
      hoveredNode: null,
      highlightedNodes: new Set(),
      highlightedEdges: new Set(),
      scale: 0.65,
      panX: 50,
      panY: 30,
      activePathway: 'kegg',
      layoutMode: 'kegg', // 'kegg' or 'free'
      physicsActive: true,
      focusMode: false,   // only show connected edges when true
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      draggedNode: null,
      dragOffsetX: 0,
      dragOffsetY: 0
    }};

    const canvas = document.getElementById('kg-canvas');
    const ctx = canvas.getContext('2d');

    function init() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Fit to initial view
      fitToView();
      requestAnimationFrame(animationLoop);
    }}

    function fitToView() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      const activeMembers = getActiveMembers();
      const visibleNodes = state.nodes.filter(n => !activeMembers || activeMembers.has(n.node_id));

      if (visibleNodes.length === 0) return;

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const n of visibleNodes) {{
        minX = Math.min(minX, n.x - n.w);
        maxX = Math.max(maxX, n.x + n.w);
        minY = Math.min(minY, n.y - n.h);
        maxY = Math.max(maxY, n.y + n.h);
      }}

      const graphW = Math.max(100, maxX - minX);
      const graphH = Math.max(100, maxY - minY);
      const scaleX = (rect.width - 120) / graphW;
      const scaleY = (rect.height - 120) / graphH;
      state.scale = Math.min(1.2, Math.max(0.35, Math.min(scaleX, scaleY)));
      state.panX = (rect.width - graphW * state.scale) / 2 - minX * state.scale;
      state.panY = (rect.height - graphH * state.scale) / 2 - minY * state.scale;
    }}

    function getActiveMembers() {{
      if (state.activePathway === 'all') return null;
      return new Set(PATHWAY_MEMBERS[state.activePathway] || []);
    }}

    // Real-time gentle force simulation loop
    function animationLoop() {{
      if (state.physicsActive) {{
        simulateForces();
      }}
      render();
      requestAnimationFrame(animationLoop);
    }}

    function simulateForces() {{
      const activeMembers = getActiveMembers();
      const visibleNodes = state.nodes.filter(n => !activeMembers || activeMembers.has(n.node_id));

      // Node-Node Repulsion
      const len = visibleNodes.length;
      for (let i = 0; i < len; i++) {{
        const a = visibleNodes[i];
        if (a === state.draggedNode || a.pinned) continue;

        for (let j = i + 1; j < len; j++) {{
          const b = visibleNodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (a.w + b.w) / 2 + 18;

          if (dist < minDist) {{
            const force = (minDist - dist) / dist * 0.08;
            if (!a.pinned) {{
              a.x -= dx * force;
              a.y -= dy * force;
            }}
            if (!b.pinned && b !== state.draggedNode) {{
              b.x += dx * force;
              b.y += dy * force;
            }}
          }}
        }}
      }}
    }}

    // Main Canvas Render Function
    function render() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(state.panX, state.panY);
      ctx.scale(state.scale, state.scale);

      // In KEGG Architecture mode, draw cellular compartmental landmarks
      if (state.layoutMode === 'kegg') {{
        drawCellularCompartments();
      }}

      const nodeMap = new Map(state.nodes.map(n => [n.node_id, n]));
      const activeMembers = getActiveMembers();

      // Render Edges
      for (const e of state.edges) {{
        const src = nodeMap.get(e.source_id);
        const tgt = nodeMap.get(e.target_id);
        if (!src || !tgt) continue;

        const srcVisible = !activeMembers || activeMembers.has(src.node_id);
        const tgtVisible = !activeMembers || activeMembers.has(tgt.node_id);
        if (!srcVisible || !tgtVisible) continue;

        const isHighlighted = state.highlightedEdges.has(e.edge_id);
        const isConnectedToHover = state.hoveredNode && (e.source_id === state.hoveredNode.node_id || e.target_id === state.hoveredNode.node_id);
        const isConnectedToSelected = state.selectedNode && (e.source_id === state.selectedNode.node_id || e.target_id === state.selectedNode.node_id);
        
        const activeEdge = isHighlighted || isConnectedToHover || isConnectedToSelected;

        // In Focus Mode, only draw connected edges
        if (state.focusMode && (state.selectedNode || state.hoveredNode) && !activeEdge) {{
          continue;
        }}

        drawEdge(e, src, tgt, activeEdge);
      }}

      // Render Nodes
      for (const n of state.nodes) {{
        if (activeMembers && !activeMembers.has(n.node_id)) continue;
        drawNode(n);
      }}

      ctx.restore();
    }}

    // Draw KEGG Architectural Compartments (Membrane, Nucleus, Lacuna)
    function drawCellularCompartments() {{
      ctx.save();

      // 1. Extracellular Donor Labels
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Osteoblasts ──►', 20, 140);
      ctx.fillText('Th1 cells ──►', 20, 220);
      ctx.fillText('Osteoblasts ──►', 20, 520);
      ctx.fillText('BMM Precursor ──►', 20, 850);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 11px sans-serif';
      ctx.fillText('Bone Marrow Microenvironment (Extracellular)', 30, 80);

      // 2. Plasma Membrane (Double vertical lipid bilayer)
      ctx.beginPath();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(435, 100, 26, 1750);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.8;
      ctx.moveTo(435, 100);
      ctx.lineTo(435, 1850);
      ctx.moveTo(461, 100);
      ctx.lineTo(461, 1850);
      ctx.stroke();

      ctx.save();
      ctx.translate(452, 180);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PLASMA MEMBRANE', 0, 0);
      ctx.restore();

      // 3. Nuclear Membrane (Vertical dashed line)
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.moveTo(1680, 100);
      ctx.lineTo(1680, 1850);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.save();
      ctx.translate(1670, 200);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NUCLEAR MEMBRANE', 0, 0);
      ctx.restore();

      // 4. Compartment Region Titles
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cytoplasm (Signaling & Metabolic Networks)', 490, 80);
      ctx.fillText('Nucleus (Transcriptional Program)', 1710, 80);
      ctx.fillText('Resorption Lacuna & Matrix', 2420, 80);

      // 5. Rounded Pathway Group Bubbles (KEGG style)
      drawPathwayBubble(900, 230, 'PI3K-Akt signaling pathway');
      drawPathwayBubble(1060, 480, 'NF-κB signaling pathway');
      drawPathwayBubble(1070, 690, 'MAPK signaling pathway');
      drawPathwayBubble(1180, 930, 'Calcium signaling pathway');
      drawPathwayBubble(820, 1120, 'Jak-STAT signaling pathway');
      drawPathwayBubble(1040, 1370, 'Glycolysis & Biosynthesis');
      drawPathwayBubble(1040, 1780, 'Mitochondrial TCA Cycle');

      ctx.restore();
    }}

    function drawPathwayBubble(x, y, label) {{
      ctx.save();
      ctx.font = '11px sans-serif';
      const tw = ctx.measureText(label).width + 24;
      const th = 24;
      ctx.beginPath();
      ctx.roundRect(x - tw/2, y - th/2, tw, th, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
      ctx.restore();
    }}

    // Draw an edge with accurate boundary arrowheads and phosphorylation labels
    function drawEdge(e, src, tgt, isActive) {{
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const angle = Math.atan2(dy, dx);

      // Calculate intersection on target node boundary
      const tx = tgt.x - Math.cos(angle) * (tgt.w / 2 + 3);
      const ty = tgt.y - Math.sin(angle) * (tgt.h / 2 + 3);

      // Calculate intersection on source node boundary
      const sx = src.x + Math.cos(angle) * (src.w / 2 + 3);
      const sy = src.y + Math.sin(angle) * (src.h / 2 + 3);

      const isInhibition = e.sign < 0;
      const isPhospho = (e.relation || '').includes('phosphorylat') || (e.mechanism || '').includes('phosphorylat');

      ctx.save();
      ctx.beginPath();

      if (isActive) {{
        ctx.strokeStyle = isInhibition ? '#ef4444' : '#16a34a';
        ctx.lineWidth = 2.2;
      }} else {{
        ctx.strokeStyle = isInhibition ? 'rgba(239, 68, 68, 0.45)' : 'rgba(100, 116, 139, 0.35)';
        ctx.lineWidth = 1.1;
      }}

      if (isInhibition) {{
        ctx.setLineDash([5, 4]);
      }}

      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Arrowhead or Blunt T-bar
      if (isInhibition) {{
        // Blunt T-bar terminator (-|)
        const barLen = 10;
        const px = -Math.sin(angle) * (barLen / 2);
        const py = Math.cos(angle) * (barLen / 2);
        ctx.beginPath();
        ctx.strokeStyle = isActive ? '#ef4444' : '#ef4444';
        ctx.lineWidth = isActive ? 2.5 : 1.8;
        ctx.moveTo(tx - px, ty - py);
        ctx.lineTo(tx + px, ty + py);
        ctx.stroke();
      }} else {{
        // Clean pointed triangular arrowhead (->)
        const headLen = isActive ? 9 : 7;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - headLen * Math.cos(angle - Math.PI / 6), ty - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(tx - headLen * Math.cos(angle + Math.PI / 6), ty - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = isActive ? '#16a34a' : '#64748b';
        ctx.fill();
      }}

      // Phosphorylation annotation badge (+p or -p)
      if (isPhospho) {{
        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;
        const signText = isInhibition ? '-p' : '+p';
        ctx.beginPath();
        ctx.arc(midX, midY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isActive ? '#16a34a' : '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = isActive ? '#15803d' : '#475569';
        ctx.font = 'bold 8.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(signText, midX, midY);
      }}

      ctx.restore();
    }}

    // Draw Node as clean rounded pill capsule or circle
    function drawNode(n) {{
      const isSelected = state.selectedNode && state.selectedNode.node_id === n.node_id;
      const isHovered = state.hoveredNode && state.hoveredNode.node_id === n.node_id;
      const isHighlighted = state.highlightedNodes.has(n.node_id);
      const isDimmed = (state.selectedNode || state.hoveredNode) && !isSelected && !isHovered && !isHighlighted;

      const theme = COLOR_THEMES[n.category] || {{ bg: '#f1f5f9', border: '#64748b', text: '#1e293b' }};

      ctx.save();

      const rx = n.x - n.w / 2;
      const ry = n.y - n.h / 2;

      // Outer Selection Glow / Halo
      if (isSelected || isHovered) {{
        ctx.beginPath();
        if (n.shape === 'circle') {{
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
        }} else {{
          ctx.roundRect(rx - 3, ry - 3, n.w + 6, n.h + 6, 8);
        }}
        ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
      }}

      // Hub outer subtle halo
      if (n.is_hub && !isDimmed) {{
        ctx.beginPath();
        if (n.shape === 'circle') {{
          ctx.arc(n.x, n.y, n.radius + 2.5, 0, Math.PI * 2);
        }} else {{
          ctx.roundRect(rx - 2, ry - 2, n.w + 4, n.h + 4, 7);
        }}
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }}

      // Node Body (Pill or Circle)
      ctx.beginPath();
      if (n.shape === 'circle') {{
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      }} else {{
        ctx.roundRect(rx, ry, n.w, n.h, 6);
      }}

      if (isDimmed) {{
        ctx.fillStyle = '#fafafa';
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();
      }} else {{
        ctx.fillStyle = theme.bg;
        ctx.fill();
        ctx.strokeStyle = (isSelected || isHovered) ? '#0f172a' : theme.border;
        ctx.lineWidth = (isSelected || isHovered) ? 2 : (n.is_hub ? 1.5 : 1.2);
        ctx.stroke();
      }}

      // Node Label (Centered inside pill or circle)
      if (!isDimmed || isSelected || isHovered) {{
        ctx.fillStyle = isDimmed ? '#94a3b8' : ((isSelected || isHovered) ? '#0f172a' : theme.text);
        ctx.font = `${{(n.is_hub || isSelected) ? 'bold 11px' : '10.5px'}} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.short_name, n.x, n.y);
      }}

      ctx.restore();
    }}

    // Hit-testing function for clicking/dragging nodes
    function getNodeAt(x, y) {{
      const activeMembers = getActiveMembers();
      // Iterate backwards so top-most rendered node is selected
      for (let i = state.nodes.length - 1; i >= 0; i--) {{
        const n = state.nodes[i];
        if (activeMembers && !activeMembers.has(n.node_id)) continue;

        if (n.shape === 'circle') {{
          const dx = x - n.x;
          const dy = y - n.y;
          if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {{
            return n;
          }}
        }} else {{
          if (Math.abs(x - n.x) <= n.w / 2 + 4 && Math.abs(y - n.y) <= n.h / 2 + 4) {{
            return n;
          }}
        }}
      }}
      return null;
    }}

    function selectNode(node) {{
      state.selectedNode = node;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();

      if (node) {{
        state.highlightedNodes.add(node.node_id);
        for (const e of state.edges) {{
          if (e.source_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.target_id);
          }} else if (e.target_id === node.node_id) {{
            state.highlightedEdges.add(e.edge_id);
            state.highlightedNodes.add(e.source_id);
          }}
        }}
        renderFactSheet(node);
      }}
      render();
    }}

    function renderFactSheet(node) {{
      const badge = document.getElementById('fact-category');
      const title = document.getElementById('fact-title');
      const body = document.getElementById('fact-content');

      const theme = COLOR_THEMES[node.category] || {{ bg: '#64748b', border: '#475569', text: '#ffffff' }};
      badge.textContent = node.category.replace('_', ' ');
      badge.style.backgroundColor = theme.border;
      title.textContent = `${{node.short_name}} (${{node.name}})`;

      const inEdges = state.edges.filter(e => e.target_id === node.node_id);
      const outEdges = state.edges.filter(e => e.source_id === node.node_id);
      const allEv = [...inEdges, ...outEdges].flatMap(e => e.evidence || []);

      const litBadge = (node.paper_count >= 5) 
        ? '<span class=\"px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300\">Major Literature Hub</span>'
        : ((node.paper_count >= 2)
          ? '<span class=\"px-2 py-0.5 rounded-full font-mono text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200\">Pathway Mediator</span>'
          : '<span class=\"px-2 py-0.5 rounded-full font-mono text-[10px] text-slate-600 bg-slate-100\">Specific Intermediate</span>');

      let html = `
        <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2 text-xs\">
          <div class=\"flex justify-between items-center pb-1.5 border-b border-slate-200\">
            <span class=\"text-slate-500 font-medium\">Literature Evidence:</span>
            <div class=\"flex items-center space-x-1.5\">
              ${{litBadge}}
              <span class=\"font-bold text-slate-800 font-mono text-[11px]\">${{node.paper_count || 0}} Studies</span>
            </div>
          </div>
          <div class=\"flex justify-between items-center\">
            <span class=\"text-slate-500 font-medium\">Network Connectivity:</span>
            <span class=\"font-semibold text-slate-800 font-mono text-[11px]\">${{node.degree || 0}} direct links</span>
          </div>
          <div class=\"flex justify-between\">
            <span class=\"text-slate-500\">ID:</span>
            <span class=\"font-mono text-slate-800 font-medium\">${{node.node_id}}</span>
          </div>
          <div class=\"flex justify-between\">
            <span class=\"text-slate-500\">Compartment:</span>
            <span class=\"text-slate-700 capitalize font-medium\">${{node.compartment || 'Unspecified'}}</span>
          </div>
          <div class=\"flex justify-between\">
            <span class=\"text-slate-500\">Aliases:</span>
            <span class=\"text-slate-600 truncate max-w-[180px]\" title=\"${{node.aliases}}\">${{node.aliases || 'None'}}</span>
          </div>
        </div>
      `;

      // Upstream & Downstream interactions
      html += `
        <div class="space-y-1.5">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Functional Connections</h3>
      `;

      for (const e of outEdges) {{
        const signLabel = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        const signBadge = e.sign < 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
        html += `
          <div class="p-2 rounded border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between cursor-pointer" onclick="focusNode('${{e.target_id}}')">
            <span class="text-slate-700 font-medium">──► ${{e.target_id}}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded border font-mono font-semibold ${{signBadge}}">${{signLabel}}</span>
          </div>
        `;
      }}

      for (const e of inEdges) {{
        const signLabel = e.sign < 0 ? 'INHIBITS (-1)' : (e.sign > 0 ? 'ACTIVATES (+1)' : e.relation);
        const signBadge = e.sign < 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
        html += `
          <div class="p-2 rounded border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between cursor-pointer" onclick="focusNode('${{e.source_id}}')">
            <span class="text-slate-700 font-medium">◄── ${{e.source_id}}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded border font-mono font-semibold ${{signBadge}}">${{signLabel}}</span>
          </div>
        `;
      }}

      html += `</div>`;

      // Literature Facts with PubMed Links
      if (allEv.length > 0) {{
        html += `
          <div class="space-y-2 pt-2 border-t border-slate-200">
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Literature Facts & Evidence</span>
              <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">${{allEv.length}}</span>
            </h3>
            <div class="space-y-2">
        `;

        for (const ev of allEv) {{
          const isPmid = ev.paper_id && ev.paper_id.startsWith('PMID:');
          const pmidNum = isPmid ? ev.paper_id.replace('PMID:', '') : '';
          const link = isPmid ? `https://pubmed.ncbi.nlm.nih.gov/${{pmidNum}}/` : '#';

          html += `
            <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div class="flex items-center justify-between">
                <a href="${{link}}" target="_blank" class="text-indigo-600 font-bold hover:underline font-mono text-[11px]">${{ev.paper_id || 'Database Record'}}</a>
                <span class="text-[9px] text-slate-400 uppercase font-mono">${{ev.evidence_kind || 'experimental'}}</span>
              </div>
              <p class="text-slate-700 italic text-[11px] leading-relaxed">"${{ev.quote_or_location}}"</p>
              ${{ev.cell_type ? `<div class="text-[10px] text-slate-500 font-medium">Model: ${{ev.cell_type}} | Treatment: ${{ev.treatment || 'RANKL'}}</div>` : ''}}
            </div>
          `;
        }}

        html += `</div></div>`;
      }}

      body.innerHTML = html;
      document.getElementById('info-drawer').classList.remove('translate-x-full');
    }}

    window.focusNode = function(nid) {{
      const n = state.nodes.find(x => x.node_id === nid);
      if (n) {{
        selectNode(n);
        const rect = canvas.parentElement.getBoundingClientRect();
        state.panX = rect.width / 2 - n.x * state.scale;
        state.panY = rect.height / 2 - n.y * state.scale;
        render();
      }}
    }};

    // Event Handlers for Free Dragging, Panning & Zooming
    canvas.addEventListener('mousedown', e => {{
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - state.panX) / state.scale;
      const my = (e.clientY - rect.top - state.panY) / state.scale;

      const clicked = getNodeAt(mx, my);

      if (clicked) {{
        state.draggedNode = clicked;
        state.dragOffsetX = clicked.x - mx;
        state.dragOffsetY = clicked.y - my;
        selectNode(clicked);
        canvas.classList.remove('cursor-grab');
        canvas.classList.add('cursor-grabbing');
      }} else {{
        state.isPanning = true;
        state.panStartX = e.clientX - state.panX;
        state.panStartY = e.clientY - state.panY;
        canvas.classList.remove('cursor-grab');
        canvas.classList.add('cursor-grabbing');
      }}
    }});

    window.addEventListener('mousemove', e => {{
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - state.panX) / state.scale;
      const my = (e.clientY - rect.top - state.panY) / state.scale;

      if (state.draggedNode) {{
        state.draggedNode.x = mx + state.dragOffsetX;
        state.draggedNode.y = my + state.dragOffsetY;
        state.draggedNode.pinned = true; // Stay pinned where dragged
        render();
      }} else if (state.isPanning) {{
        state.panX = e.clientX - state.panStartX;
        state.panY = e.clientY - state.panStartY;
        render();
      }} else {{
        // Hover state
        const hovered = getNodeAt(mx, my);
        if (hovered !== state.hoveredNode) {{
          state.hoveredNode = hovered;
          state.highlightedNodes.clear();
          state.highlightedEdges.clear();

          if (hovered) {{
            state.highlightedNodes.add(hovered.node_id);
            for (const edge of state.edges) {{
              if (edge.source_id === hovered.node_id || edge.target_id === hovered.node_id) {{
                state.highlightedEdges.add(edge.edge_id);
                state.highlightedNodes.add(edge.source_id);
                state.highlightedNodes.add(edge.target_id);
              }}
            }}
          }} else if (state.selectedNode) {{
            state.highlightedNodes.add(state.selectedNode.node_id);
            for (const edge of state.edges) {{
              if (edge.source_id === state.selectedNode.node_id || edge.target_id === state.selectedNode.node_id) {{
                state.highlightedEdges.add(edge.edge_id);
                state.highlightedNodes.add(edge.source_id);
                state.highlightedNodes.add(edge.target_id);
              }}
            }}
          }}
          canvas.style.cursor = hovered ? 'pointer' : 'grab';
          render();
        }}
      }}
    }});

    window.addEventListener('mouseup', () => {{
      state.isPanning = false;
      state.draggedNode = null;
      canvas.classList.remove('cursor-grabbing');
      canvas.classList.add('cursor-grab');
    }});

    canvas.addEventListener('wheel', e => {{
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const newScale = Math.min(3.5, Math.max(0.2, state.scale * factor));

      state.panX = mouseX - (mouseX - state.panX) * (newScale / state.scale);
      state.panY = mouseY - (mouseY - state.panY) * (newScale / state.scale);
      state.scale = newScale;
      render();
    }}, {{ passive: false }});

    // View Mode Toggle
    document.getElementById('btn-mode-kegg').onclick = function() {{
      state.layoutMode = 'kegg';
      this.className = "px-2.5 py-1 rounded-md font-semibold text-xs transition bg-white text-slate-900 shadow-xs";
      document.getElementById('btn-mode-free').className = "px-2.5 py-1 rounded-md font-medium text-xs text-slate-600 hover:text-slate-900 transition";
      // Smoothly return nodes to KEGG coordinates
      for (const n of state.nodes) {{
        n.x = n.kegg_x;
        n.y = n.kegg_y;
        n.pinned = false;
      }}
      fitToView();
      render();
    }};

    document.getElementById('btn-mode-free').onclick = function() {{
      state.layoutMode = 'free';
      this.className = "px-2.5 py-1 rounded-md font-semibold text-xs transition bg-white text-slate-900 shadow-xs";
      document.getElementById('btn-mode-kegg').className = "px-2.5 py-1 rounded-md font-medium text-xs text-slate-600 hover:text-slate-900 transition";
      for (const n of state.nodes) {{
        n.x = n.free_x;
        n.y = n.free_y;
        n.pinned = false;
      }}
      fitToView();
      render();
    }};

    // Physics Toggle
    document.getElementById('btn-physics-toggle').onclick = function() {{
      state.physicsActive = !state.physicsActive;
      const ind = document.getElementById('physics-indicator');
      const lbl = document.getElementById('physics-label');
      if (state.physicsActive) {{
        ind.className = "w-2 h-2 rounded-full bg-emerald-500";
        lbl.textContent = "Physics: Active";
      }} else {{
        ind.className = "w-2 h-2 rounded-full bg-amber-500";
        lbl.textContent = "Physics: Paused";
      }}
    }};

    // Focus Mode / Edge Declutter Toggle
    document.getElementById('btn-edge-filter').onclick = function() {{
      state.focusMode = !state.focusMode;
      const lbl = document.getElementById('edge-filter-label');
      if (state.focusMode) {{
        lbl.textContent = "Focus Mode: Active";
        this.classList.add('bg-indigo-50', 'border-indigo-300', 'text-indigo-700');
      }} else {{
        lbl.textContent = "Focus Mode: Off";
        this.classList.remove('bg-indigo-50', 'border-indigo-300', 'text-indigo-700');
      }}
      render();
    }};

    // Pathway Select Dropdown
    document.getElementById('pathway-select').onchange = function(e) {{
      state.activePathway = e.target.value;
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      fitToView();
      render();
    }};

    // Zoom and Fit Controls
    document.getElementById('btn-zoom-in').onclick = () => {{
      state.scale = Math.min(3.5, state.scale * 1.25);
      render();
    }};
    document.getElementById('btn-zoom-out').onclick = () => {{
      state.scale = Math.max(0.2, state.scale / 1.25);
      render();
    }};
    document.getElementById('btn-fit-view').onclick = fitToView;
    document.getElementById('btn-reset-view').onclick = () => {{
      for (const n of state.nodes) {{
        n.x = state.layoutMode === 'kegg' ? n.kegg_x : n.free_x;
        n.y = state.layoutMode === 'kegg' ? n.kegg_y : n.free_y;
        n.pinned = false;
      }}
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      fitToView();
      render();
    }};

    document.getElementById('btn-close-drawer').onclick = () => {{
      state.selectedNode = null;
      state.highlightedNodes.clear();
      state.highlightedEdges.clear();
      render();
    }};

    // Search Bar
    const searchInput = document.getElementById('fact-search');
    const searchDropdown = document.getElementById('search-results-dropdown');

    searchInput.addEventListener('input', e => {{
      const q = e.target.value.trim().toLowerCase();
      if (!q) {{
        searchDropdown.classList.add('hidden');
        return;
      }}

      const matches = [];
      for (const n of state.nodes) {{
        if (n.name.toLowerCase().includes(q) || n.short_name.toLowerCase().includes(q) || n.node_id.toLowerCase().includes(q) || (n.aliases && n.aliases.toLowerCase().includes(q))) {{
          matches.push({{
            type: 'node',
            title: `${{n.short_name}} — ${{n.name}}`,
            sub: `${{n.node_id}} • ${{n.category.replace('_', ' ')}}`,
            id: n.node_id
          }});
        }}
        if (matches.length >= 20) break;
      }}

      if (matches.length > 0) {{
        searchDropdown.innerHTML = matches.map(m => `
          <div class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex flex-col" onclick="selectSearchMatch('${{m.id}}')">
            <span class="font-bold text-slate-800">${{m.title}}</span>
            <span class="text-[10px] text-slate-500 truncate">${{m.sub}}</span>
          </div>
        `).join('');
        searchDropdown.classList.remove('hidden');
      }} else {{
        searchDropdown.innerHTML = `<div class="p-3 text-slate-400 text-center">No matching entities found</div>`;
        searchDropdown.classList.remove('hidden');
      }}
    }});

    window.selectSearchMatch = function(nid) {{
      searchDropdown.classList.add('hidden');
      searchInput.value = '';
      focusNode(nid);
    }};

    document.addEventListener('click', e => {{
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {{
        searchDropdown.classList.add('hidden');
      }}
    }});

    window.addEventListener('resize', init);
    init();
  </script>
</body>
</html>
"""

    for out_path in output_paths:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated KEGG-styled clean app: {out_path}")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    data_dir = os.path.join(project_root, "data", "processed")

    repo_html = os.path.join(project_root, "index.html")
    artifact_dir = "/Users/sarahszabo/.gemini/antigravity/brain/f3c85251-4355-46db-a0c2-5ac60706f3c7"
    artifact_html = os.path.join(artifact_dir, "osteoclast_kg_explorer.html")

    build_kegg_app(data_dir, [repo_html, artifact_html])
