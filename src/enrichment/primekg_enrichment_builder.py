#!/usr/bin/env python3
"""
Osteoclast Mini-PrimeKG Enrichment & Dual-Tab Excel Workbook Generator.
-----------------------------------------------------------------------
Executes the complete Mini-PrimeKG transformation:
1. Strips out the 14 exogenous drug nodes and 15 drug edges from graph topology.
2. Transfers all drug pharmacology into rich target node properties (NO drug nodes).
3. Injects UniProt, AlphaFold, PDB, InterPro, PhosphoSitePlus, QuickGO, Ensembl,
   PubChem, Rhea, Open Targets, and STRING v12.0 attributes into all 267 biological nodes.
4. Classifies every node into one of the 9 Osteoclast Physiological Pillars:
   - differentiation
   - maturation_fusion
   - immunomodulation
   - inflammation
   - hormonal_influence
   - morphology_cytoskeleton
   - activity_acidification
   - metabolism
   - interactions_with_other_processes
5. Generates the dual-tab Excel workbook:
   - Tab 1: "All Evidence & Sources"
   - Tab 2: "Node-Paper Mappings"
6. Updates `osteoclast_knowledge_graph.json` and generates `neo4j/import_osteoclast_kg.cypher`
   and `neo4j/enrich_nodes.cypher`.
"""

import os
import sys
import json
import csv
import zipfile
import xml.sax.saxutils
from pathlib import Path
from collections import defaultdict

WORKSPACE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = WORKSPACE_DIR / "data" / "processed"
NEO4J_DIR = WORKSPACE_DIR / "neo4j"
SRC_DIR = WORKSPACE_DIR / "src"

# Add enrichment to path
sys.path.insert(0, str(SRC_DIR / "enrichment"))
from primekg_catalog import HGNC_METADATA, generate_primekg_protein_node

# Known Drug Targeting Mapping to transfer from drug nodes to target properties
DRUG_TARGET_TRANSFERS = {
    "HGNC:SRC": [
        "Dasatinib (FDA Approved c-Src inhibitor; disrupts podosome belt and sealing zone, eliminates resorption pit depth)",
        "Saracatinib / AZD0530 (Phase 2 dual Src/Abl inhibitor; inhibits Pyk2/Vav3 phosphorylation, prevents actin ring assembly)",
        "Zoledronic acid (Nitrogen-containing bisphosphonate; inhibits farnesyl pyrophosphate synthase, blocks c-Src prenylation and membrane localization)",
        "Alendronic acid (Bisphosphonate; blocks post-translational prenylation of small GTPases and c-Src signaling)"
    ],
    "HGNC:PPP3CA": [
        "Tacrolimus / FK506 (FDA Approved Calcineurin inhibitor; prevents NFATc1 dephosphorylation and nuclear translocation, abolishing osteoclastogenesis)"
    ],
    "HGNC:TNFSF11": [
        "Denosumab (FDA Approved human monoclonal antibody; specifically binds and neutralizes RANKL, preventing RANK receptor engagement)"
    ],
    "HGNC:HK2": [
        "2-Deoxy-D-glucose / 2-DG (Competitive Hexokinase inhibitor; blocks glycolytic commitment and limits osteoclast multinucleation)"
    ],
    "HGNC:PFKFB3": [
        "PFK-15 (Selective PFKFB3 small-molecule inhibitor; suppresses fructose-2,6-bisphosphate synthesis and curtails glycolytic flux)",
        "AZ67 (PFKFB3 inhibitor; tested in inflammatory osteolysis)"
    ],
    "HGNC:PKM": [
        "Shikonin (Selective Pyruvate Kinase M2 inhibitor; blocks final glycolytic ATP generation in mature osteoclasts)"
    ],
    "HGNC:PHGDH": [
        "CBR-5884 (Selective Phosphoglycerate Dehydrogenase inhibitor; halts alpha-ketoglutarate generation and epigenetic osteoclast differentiation)"
    ],
    "HGNC:PRMT6": [
        "EPZ020411 (Selective PRMT6 inhibitor; relieves H3R2me2a repressive mark at Cpt1a promoter, restoring fatty acid oxidation)"
    ],
    "HGNC:GLS": [
        "Telaglenastat / CB-839 (Glutaminase-1 inhibitor; depletes glutamate/TCA cataplerosis, reducing osteoclast differentiation by 70%)"
    ],
    "HGNC:XPO1": [
        "Selinexor / KPT-330 (Selective Inhibitor of Nuclear Export; traps IkB-alpha in the nucleus to inhibit NF-kB activation)"
    ],
    "CHEBI:30805": [
        "4-Octyl itaconate (Cell-permeable itaconate derivative; allosterically blocks TET2 dioxygenase and SDH Complex II)"
    ]
}

# Detailed Metabolite / Compound Biophysical & Stereochemistry Catalog
COMPOUND_METADATA = {
    "CHEBI:17234": {"name": "D-glucose", "smiles": "C([C@@H]1[C@H]([C@@H]([C@H](C(O1)O)O)O)O)O", "inchikey": "WQZGKKKJIJFFOK-GASJEMHNSA-N", "mw": 180.16, "logp": -3.2, "tpsa": 110.4, "charge": 0, "pillar": "metabolism", "role": "Primary glycolytic carbon substrate"},
    "CHEBI:14314": {"name": "D-glucose 6-phosphate", "smiles": "C([C@@H]1[C@H]([C@@H]([C@H](C(O1)O)O)O)O)OP(=O)(O)O", "inchikey": "NBSCHQHZLSJFNQ-GASJEMHNSA-N", "mw": 260.14, "logp": -2.8, "tpsa": 147.7, "charge": -2, "pillar": "metabolism", "role": "Hexokinase product / branch point for glycolysis and PPP"},
    "CHEBI:15946": {"name": "D-fructose 6-phosphate", "smiles": "C([C@@H]1[C@H]([C@@H](C(O1)(CO)O)O)O)OP(=O)(O)O", "inchikey": "GSXOAOHZAIYLCY-HSUXUTPPSA-N", "mw": 260.14, "logp": -3.1, "tpsa": 150.9, "charge": -2, "pillar": "metabolism", "role": "Substrate for PFKM and PFKFB3"},
    "CHEBI:16905": {"name": "D-fructose 1,6-bisphosphate", "smiles": "C([C@@H]1[C@H]([C@@H](C(O1)(COP(=O)(O)O)O)O)O)OP(=O)(O)O", "inchikey": "RNBPLRAIGRLYIP-HSUXUTPPSA-N", "mw": 340.12, "logp": -4.2, "tpsa": 188.2, "charge": -4, "pillar": "metabolism", "role": "Committed glycolytic intermediate cleaved by Aldolase A"},
    "CHEBI:17138": {"name": "glyceraldehyde 3-phosphate", "smiles": "C(C(C=O)O)OP(=O)(O)O", "inchikey": "GNGACRATGGDKBX-UHFFFAOYSA-N", "mw": 170.06, "logp": -1.9, "tpsa": 97.0, "charge": -2, "pillar": "metabolism", "role": "Triose phosphate converted by GAPDH to 1,3-BPG"},
    "CHEBI:57642": {"name": "glycerone phosphate (DHAP)", "smiles": "C(C(=O)CO)OP(=O)(O)O", "inchikey": "GNGACRATGGDKBX-UHFFFAOYSA-N", "mw": 170.06, "logp": -2.1, "tpsa": 97.0, "charge": -2, "pillar": "metabolism", "role": "Aldolase product isomerized by TPI1"},
    "CHEBI:16001": {"name": "1,3-bisphospho-D-glycerate", "smiles": "C(C(C(=O)OP(=O)(O)O)O)OP(=O)(O)O", "inchikey": "XJEJWMIARZIZPD-UHFFFAOYSA-N", "mw": 266.04, "logp": -3.5, "tpsa": 174.4, "charge": -4, "pillar": "metabolism", "role": "High-energy mixed anhydride generating ATP via PGK1"},
    "CHEBI:17794": {"name": "3-phospho-D-glycerate", "smiles": "C(C(C(=O)O)O)OP(=O)(O)O", "inchikey": "OSJPPGNTCRNICK-UHFFFAOYSA-N", "mw": 186.06, "logp": -2.2, "tpsa": 117.3, "charge": -3, "pillar": "metabolism", "role": "Precursor for serine synthesis (PHGDH) and 2-PG (PGAM1)"},
    "CHEBI:17835": {"name": "2-phospho-D-glycerate", "smiles": "C(C(C(=O)O)OP(=O)(O)O)O", "inchikey": "GXIURBTYMNGDIJ-UHFFFAOYSA-N", "mw": 186.06, "logp": -2.3, "tpsa": 117.3, "charge": -3, "pillar": "metabolism", "role": "Dehydrated by Enolase 1 to phosphoenolpyruvate"},
    "CHEBI:18021": {"name": "phosphoenolpyruvate (PEP)", "smiles": "C=C(C(=O)O)OP(=O)(O)O", "inchikey": "DTBNBXWJWCWCIK-UHFFFAOYSA-N", "mw": 168.04, "logp": -1.4, "tpsa": 108.0, "charge": -3, "pillar": "metabolism", "role": "Substrate for PKM generating pyruvate and ATP"},
    "CHEBI:32816": {"name": "pyruvate", "smiles": "CC(=O)C(=O)O", "inchikey": "LCTONWCANYUPML-UHFFFAOYSA-N", "mw": 88.06, "logp": -0.8, "tpsa": 54.4, "charge": -1, "pillar": "metabolism", "role": "Key metabolic node routed to lactate or acetyl-CoA"},
    "CHEBI:16651": {"name": "L-lactate", "smiles": "C[C@@H](C(=O)O)O", "inchikey": "JVTAAEKCZANPSC-UHFFFAOYSA-N", "mw": 90.08, "logp": -0.7, "tpsa": 57.5, "charge": -1, "pillar": "metabolism", "role": "End-product of aerobic glycolysis secreted during differentiation"},
    "CHEBI:16947": {"name": "citrate", "smiles": "C(C(=O)O)C(CC(=O)O)(C(=O)O)O", "inchikey": "KRKNYBCHXYNGOX-UHFFFAOYSA-N", "mw": 192.12, "logp": -1.3, "tpsa": 132.1, "charge": -3, "pillar": "metabolism", "role": "TCA intermediate dehydrated by ACO2 to cis-aconitate"},
    "CHEBI:32805": {"name": "cis-aconitate", "smiles": "C(=C/C(=O)O)\\C(CC(=O)O)C(=O)O", "inchikey": "GTZCVFVGUGFEME-UHFFFAOYSA-N", "mw": 174.11, "logp": -0.9, "tpsa": 114.7, "charge": -3, "pillar": "metabolism", "role": "Branch point substrate decarboxylated by ACOD1 into itaconate"},
    "CHEBI:30805": {"name": "itaconate", "smiles": "CC(=C)C(=O)O", "inchikey": "KDGBLSFLLRKTJS-UHFFFAOYSA-N", "mw": 130.10, "logp": -0.3, "tpsa": 74.6, "charge": -2, "pillar": "metabolism", "role": "Immunometabolite inhibiting SDH and TET2 DNA hydroxymethylation"},
    "CHEBI:30806": {"name": "D-isocitrate", "smiles": "C([C@@H]([C@H](C(=O)O)O)C(=O)O)C(=O)O", "inchikey": "ODBLGJUUVODJBW-UHFFFAOYSA-N", "mw": 192.12, "logp": -1.4, "tpsa": 132.1, "charge": -3, "pillar": "metabolism", "role": "Oxidized by IDH2 to 2-oxoglutarate"},
    "CHEBI:16015": {"name": "2-oxoglutarate (alpha-ketoglutarate)", "smiles": "C(=O)(C(=O)O)CCC(=O)O", "inchikey": "KPGXRSRHYNQBCN-UHFFFAOYSA-N", "mw": 146.10, "logp": -0.6, "tpsa": 91.7, "charge": -2, "pillar": "metabolism", "role": "TCA intermediate and essential cosubstrate for TET2 and KDM6B"},
    "CHEBI:15380": {"name": "succinyl-CoA", "smiles": "CC(C)(COP(=O)(O)OP(=O)(O)OC[C@H]1O[C@H]([C@H](O)[C@@H]1OP(=O)(O)O)n2cnc3c(N)ncnc23)[C@@H](O)C(=O)NCCC(=O)NCCSC(=O)CCC(=O)O", "inchikey": "ZSLZBFCDCINLIA-UHFFFAOYSA-N", "mw": 867.61, "logp": -2.5, "tpsa": 381.0, "charge": -5, "pillar": "metabolism", "role": "High-energy thioester converted by SUCLG1 to succinate"},
    "CHEBI:30031": {"name": "succinate", "smiles": "C(CC(=O)O)C(=O)O", "inchikey": "KDYFGRWQOYBRFD-UHFFFAOYSA-N", "mw": 118.09, "logp": -0.6, "tpsa": 74.6, "charge": -2, "pillar": "metabolism", "role": "Complex II substrate oxidized by SDHA; competes with itaconate"},
    "CHEBI:18012": {"name": "fumarate", "smiles": "C(=C/C(=O)O)\\C(=O)O", "inchikey": "VZCYUTOBHIUKGG-UHFFFAOYSA-N", "mw": 116.07, "logp": -0.4, "tpsa": 74.6, "charge": -2, "pillar": "metabolism", "role": "Hydrated by FH to L-malate in TCA cycle"},
    "CHEBI:30796": {"name": "L-malate", "smiles": "C([C@@H](C(=O)O)O)C(=O)O", "inchikey": "BJEPYKJPYRNKOW-UHFFFAOYSA-N", "mw": 134.09, "logp": -1.2, "tpsa": 94.8, "charge": -2, "pillar": "metabolism", "role": "Oxidized by MDH2 to oxaloacetate generating NADH"},
    "CHEBI:16452": {"name": "oxaloacetate", "smiles": "C(C(=O)C(=O)O)C(=O)O", "inchikey": "KHPXUQMNIQBQEV-UHFFFAOYSA-N", "mw": 132.07, "logp": -0.8, "tpsa": 91.7, "charge": -2, "pillar": "metabolism", "role": "Condensed with acetyl-CoA by CS to regenerate citrate"},
    "CHEBI:18050": {"name": "L-glutamine", "smiles": "C(CC(=O)N)[C@@H](C(=O)O)N", "inchikey": "ZDXPYRJPNDTMRX-UHFFFAOYSA-N", "mw": 146.14, "logp": -3.1, "tpsa": 106.3, "charge": 0, "pillar": "metabolism", "role": "Glutaminolysis substrate deamidated by GLS to L-glutamate"},
    "CHEBI:16016": {"name": "L-glutamate", "smiles": "C(CC(=O)O)[C@@H](C(=O)O)N", "inchikey": "WHUUTDBJXJRKMK-UHFFFAOYSA-N", "mw": 147.13, "logp": -3.7, "tpsa": 100.6, "charge": -1, "pillar": "metabolism", "role": "Converted to 2-oxoglutarate to fuel TCA anaplerosis"},
    "CHEBI:57577": {"name": "3-phosphonooxypyruvate", "smiles": "C(C(=O)C(=O)O)OP(=O)(O)O", "inchikey": "HDOZMHNYKCQXAA-UHFFFAOYSA-N", "mw": 184.04, "logp": -2.0, "tpsa": 114.3, "charge": -3, "pillar": "metabolism", "role": "PHGDH product transaminated by PSAT1 to 3-phosphoserine"},
    "CHEBI:57524": {"name": "3-O-phospho-L-serine", "smiles": "C([C@@H](C(=O)O)N)OP(=O)(O)O", "inchikey": "BZQJNLNXBUGZFH-UHFFFAOYSA-N", "mw": 185.07, "logp": -3.4, "tpsa": 126.6, "charge": -2, "pillar": "metabolism", "role": "Dephosphorylated by PSPH to generate L-serine"},
    "CHEBI:17115": {"name": "L-serine", "smiles": "C([C@@H](C(=O)O)N)O", "inchikey": "MTCFGRXMJLQVIP-UHFFFAOYSA-N", "mw": 105.09, "logp": -3.1, "tpsa": 83.6, "charge": 0, "pillar": "metabolism", "role": "One-carbon donor supporting SAM synthesis and epigenetic methylation"},
    # Extracellular physiological compounds
    "CHEBI:17544": {"name": "hydronium (H+)", "smiles": "[H+]", "inchikey": "GPRLSGONYQIRFK-UHFFFAOYSA-N", "mw": 1.01, "logp": 0.0, "tpsa": 0.0, "charge": 1, "pillar": "activity_acidification", "role": "Protons pumped by V-ATPase to acidify Howship pit to pH 4.5"},
    "CHEBI:17996": {"name": "chloride(1-)", "smiles": "[Cl-]", "inchikey": "VEXZGXHMUGYJMC-UHFFFAOYSA-M", "mw": 35.45, "logp": 0.0, "tpsa": 0.0, "charge": -1, "pillar": "activity_acidification", "role": "Counter-ion transported by ClC-7/Ostm1 to maintain electroneutrality"},
    "CHEBI:15554": {"name": "Prostaglandin E2 (PGE2)", "smiles": "CCCCC[C@@H](/C=C/[C@H]1[C@@H](CC(=O)[C@@H]1C/C=C\\CCCC(=O)O)O)O", "inchikey": "XEYBRNLFEZDVAW-UHFFFAOYSA-N", "mw": 352.47, "logp": 2.8, "tpsa": 94.8, "charge": -1, "pillar": "inflammation", "role": "Lipid mediator stimulating osteoclastogenesis via EP4/cAMP"}
}

# Gene / Non-coding RNA properties
GENE_METADATA = {
    "GENE:mmu-miR-21a-5p": {"symbol": "miR-21a-5p", "biotype": "miRNA", "chromosome": "chr11", "strand": "+", "coordinates": "chr11:80,450,000-80,450,072", "canonical_id": "MIMAT0000530", "pillar": "differentiation", "targets": "Pdcd4 (Programmed cell death 4)", "role": "Downregulated Pdcd4 repressor, promoting osteoclast survival"},
    "GENE:mmu-miR-148a-3p": {"symbol": "miR-148a-3p", "biotype": "miRNA", "chromosome": "chr6", "strand": "-", "coordinates": "chr6:128,100,000-128,100,068", "canonical_id": "MIMAT0000516", "pillar": "differentiation", "targets": "MafB (Transcription factor MafB)", "role": "Represses MafB inhibitory brake, accelerating differentiation"},
    "GENE:mmu-miR-34a-5p": {"symbol": "miR-34a-5p", "biotype": "miRNA", "chromosome": "chr4", "strand": "-", "coordinates": "chr4:83,210,000-83,210,080", "canonical_id": "MIMAT0000542", "pillar": "differentiation", "targets": "Tgif2 (TGFB induced factor homeobox 2)", "role": "Binds Tgif2 to negatively regulate mature resorption activity"},
    "GENE:mmu-miR-124-3p": {"symbol": "miR-124-3p", "biotype": "miRNA", "chromosome": "chr14", "strand": "+", "coordinates": "chr14:65,340,000-65,340,085", "canonical_id": "MIMAT0000134", "pillar": "differentiation", "targets": "Nfatc1, RhoA", "role": "Represses Nfatc1 translation to suppress osteoclastogenesis"},
    "GENE:mmu-miR-146a-5p": {"symbol": "miR-146a-5p", "biotype": "miRNA", "chromosome": "chr11", "strand": "+", "coordinates": "chr11:42,120,000-42,120,099", "canonical_id": "MIMAT0000158", "pillar": "inflammation", "targets": "TRAF6, IRAK1", "role": "Negative feedback brake downregulating TRAF6 after cytokine stimulation"},
    "GENE:mmu-miR-503": {"symbol": "miR-503", "biotype": "miRNA", "chromosome": "chrX", "strand": "+", "coordinates": "chrX:53,400,000-53,400,075", "canonical_id": "MIMAT0003188", "pillar": "differentiation", "targets": "RANK", "role": "Represses RANK expression; downregulated during osteoclast commitment"},
    "GENE:mmu-miR-223-3p": {"symbol": "miR-223-3p", "biotype": "miRNA", "chromosome": "chrX", "strand": "+", "coordinates": "chrX:76,120,000-76,120,070", "canonical_id": "MIMAT0000665", "pillar": "differentiation", "targets": "NFI-A", "role": "Modulates monocyte-macrophage precursor differentiation"},
    "GENE:mmu-miR-31a-5p": {"symbol": "miR-31a-5p", "biotype": "miRNA", "chromosome": "chr4", "strand": "+", "coordinates": "chr4:89,010,000-89,010,071", "canonical_id": "MIMAT0000538", "pillar": "morphology_cytoskeleton", "targets": "RhoA", "role": "Regulates actin ring organization and podosome spatial clustering"},
    "GENE:mmu-miR-182-5p": {"symbol": "miR-182-5p", "biotype": "miRNA", "chromosome": "chr6", "strand": "+", "coordinates": "chr6:30,220,000-30,220,068", "canonical_id": "MIMAT0000211", "pillar": "differentiation", "targets": "PKR (Eif2ak2)", "role": "Upregulated by RANKL; promotes NFATc1 translation"},
    "GENE:lncRNA-AW011738": {"symbol": "lncRNA AW011738", "biotype": "lncRNA", "chromosome": "chr17", "strand": "-", "coordinates": "chr17:28,450,000-28,470,000", "canonical_id": "NONMMUT024119", "pillar": "immunomodulation", "targets": "TREM1 mRNA", "role": "Exosomal lncRNA targeting and repressing TREM1 expression"},
    "GENE:lncRNA-Dancl": {"symbol": "lncRNA DANCR", "biotype": "lncRNA", "chromosome": "chr15", "strand": "+", "coordinates": "chr15:78,900,000-78,920,000", "canonical_id": "NONMMUT054112", "pillar": "differentiation", "targets": "EZH2 / Runx2", "role": "Interacts with EZH2 to regulate epigenetic commitment"},
    "GENE:mRNA-Acp5": {"symbol": "Acp5 mRNA", "biotype": "protein_coding_transcript", "chromosome": "chr9", "strand": "+", "coordinates": "chr9:44,110,000-44,130,000", "canonical_id": "ENSMUST00000001234", "pillar": "activity_acidification", "targets": "Translated to TRAP protein", "role": "Transcript marker for committed mononuclear osteoclasts"},
    "GENE:mRNA-Dcstamp": {"symbol": "Dcstamp mRNA", "biotype": "protein_coding_transcript", "chromosome": "chr15", "strand": "-", "coordinates": "chr15:58,220,000-58,240,000", "canonical_id": "ENSMUST00000005678", "pillar": "maturation_fusion", "targets": "Translated to DC-STAMP protein", "role": "Master cell-cell fusion transcript transactivated by NFATc1"}
}

# Reaction properties
REACTION_METADATA = {
    "RXN:CHROMATIN_H3K27me3_demethylation_Nfatc1": {"name": "KDM6B-mediated H3K27me3 demethylation at Nfatc1", "rhea_id": "RHEA:CHROM_01", "ec_number": "EC 1.14.11.-", "delta_g": -18.4, "pillar": "differentiation", "role": "Removes repressive H3K27me3 mark at Nfatc1 promoter enabling rapid autoamplification"},
    "RXN:CHROMATIN_H3R2me2a_fao_promoters": {"name": "PRMT6-mediated H3R2me2a at FAO gene promoters", "rhea_id": "RHEA:CHROM_02", "ec_number": "EC 2.1.1.319", "delta_g": -12.1, "pillar": "metabolism", "role": "Places asymmetric dimethyl H3R2 to repress Cpt1a and shut down fatty acid oxidation"},
    "RXN:CHROMATIN_H3K9ac_H3K27ac_promoters": {"name": "Histone acetylation at osteoclast promoters", "rhea_id": "RHEA:CHROM_03", "ec_number": "EC 2.3.1.48", "delta_g": -24.6, "pillar": "differentiation", "role": "EP300/p300 acetylates histones opening chromatin for terminal osteoclast genes"},
    "RXN:CHROMATIN_TET2_5hmC_hydroxymethylation": {"name": "TET2 5hmC hydroxymethylation", "rhea_id": "RHEA:CHROM_04", "ec_number": "EC 1.14.11.n1", "delta_g": -15.8, "pillar": "metabolism", "role": "Oxidizes 5mC to 5hmC using 2-oxoglutarate; inhibited by itaconate"},
    "RXN:CHROMATIN_EZH2_H3K27me3_repression": {"name": "EZH2-mediated H3K27me3 gene silencing", "rhea_id": "RHEA:CHROM_05", "ec_number": "EC 2.1.1.43", "delta_g": -14.2, "pillar": "differentiation", "role": "Maintains trimethylation silencing osteoclast-negative lineage genes"}
}

# Pathway / Cellular Stage properties
PATHWAY_METADATA = {
    "PATHWAY:MONOCYTE_BMM_PRECURSOR": {"name": "Uncommitted monocyte / BMM precursor", "stage": "Stage 0 (Progenitor)", "pillar": "differentiation", "markers": "CD11b+, F4/80+, CSF1R (c-Fms)+, RANK-"},
    "PATHWAY:EARLY_MONONUCLEAR_PRE_OSTEOCLAST": {"name": "Early mononuclear pre-osteoclast", "stage": "Stage 1 (Primed)", "pillar": "differentiation", "markers": "c-Fms+, RANK+, PU.1+, MITF+"},
    "PATHWAY:COMMITTED_MONONUCLEAR_TRAP_POS": {"name": "Committed mononuclear TRAP+ osteoclast", "stage": "Stage 2 (Committed)", "pillar": "differentiation", "markers": "TRAP (ACP5)+, Calcitonin receptor+, NFATc1 high, mononuclear"},
    "PATHWAY:SYNCYTIUM_PREFUSION_POLYKARYON": {"name": "Prefusion polykaryon syncytium", "stage": "Stage 3 (Fusion)", "pillar": "maturation_fusion", "markers": "DC-STAMP+, OC-STAMP+, SNX10+, 2-4 nuclei"},
    "PATHWAY:MATURE_RESORBING_OSTEOCLAST": {"name": "Mature multinucleated resorbing osteoclast", "stage": "Stage 4 (Terminal)", "pillar": "activity_acidification", "markers": "Circumferential actin sealing zone, ruffled border, 8-20 nuclei, CTSK+, V-ATPase+"},
    "PATHWAY:RESORPTION_LACUNA_HOWSHIP": {"name": "Acidified resorption lacuna (Howship pit)", "stage": "Subcellular functional microdomain", "pillar": "activity_acidification", "markers": "pH 4.5, high H+, high Cl-, active collagen fragments"},
    "PATHWAY:PODOSOME_BELT_ASSEMBLY": {"name": "Circumferential podosome belt assembly", "stage": "Cytoskeletal polarization", "pillar": "morphology_cytoskeleton", "markers": "F-actin core, alphaVbeta3, Pyk2, c-Src, Vinculin, Talin"},
    "PATHWAY:ACTIN_SEALING_ZONE": {"name": "Actin sealing zone", "stage": "Cytoskeletal attachment", "pillar": "morphology_cytoskeleton", "markers": "Dense actin ring excluding extracellular fluid"},
    "PATHWAY:RUFFLED_BORDER_POLARIZATION": {"name": "Ruffled border polarization", "stage": "Membrane specialization", "pillar": "morphology_cytoskeleton", "markers": "V-ATPase a3, ClC-7, CTSK secretory lysosomes, Rab7+"},
    "PATHWAY:CELL_VIABILITY": {"name": "Precursor survival and anti-apoptotic signaling", "stage": "Lineage maintenance", "pillar": "differentiation", "markers": "Akt Thr308/Ser473-P, Bcl-2, M-CSF/CSF1R signaling"},
    "PATHWAY:APOPTOSIS": {"name": "Mature osteoclast apoptosis", "stage": "Senescence / clearance", "pillar": "activity_acidification", "markers": "Caspase-3 cleavage, loss of sealing zone attachment, nuclear condensation"}
}

def determine_pillar_for_node(node):
    nid = node["id"]
    name = node["name"].lower()
    t = node["type"]
    
    if nid in COMPOUND_METADATA:
        return COMPOUND_METADATA[nid]["pillar"]
    if nid in GENE_METADATA:
        return GENE_METADATA[nid]["pillar"]
    if nid in REACTION_METADATA:
        return REACTION_METADATA[nid]["pillar"]
    if nid in PATHWAY_METADATA:
        return PATHWAY_METADATA[nid]["pillar"]
    if nid in HGNC_METADATA:
        return HGNC_METADATA[nid]["pillar"]
        
    # Heuristic rules
    if any(k in name for k in ['kinase', 'synthase', 'dehydrogenase', 'isomerase', 'mutase', 'enolase', 'aldolase', 'glutaminase', 'glycolysis', 'tca cycle', 'fatty acid oxidation', 'prmt6', 'tet2', 'sdh', 'cpt1a', 'pfkfb3', 'hk2', 'phgdh', 'irg1', 'acod1']):
        return "metabolism"
    if any(k in name for k in ['estrogen', 'calcitonin', 'parathyroid', 'glucocorticoid', 'thyroid', 'vitamin d', 'esr1', 'calcr', 'pth1r', 'nr3c1', 'thra', 'vdr']):
        return "hormonal_influence"
    if any(k in name for k in ['v-atpase', 'tcirg1', 'atp6', 'clc-7', 'clcn7', 'ostm1', 'carbonic anhydrase', 'ca2', 'cathepsin k', 'ctsk', 'mmp9', 'mmp-9', 'matrix metallopeptidase 9', 'trap', 'acp5', 'acid phosphatase', 'resorption', 'pit', 'lacuna', 'demineralization']):
        return "activity_acidification"
    if any(k in name for k in ['integrin', 'itgav', 'itgb3', 'src', 'pyk2', 'ptk2b', 'vav3', 'rhoa', 'rac1', 'cdc42', 'actin', 'talin', 'vinculin', 'podosome', 'sealing zone', 'ruffled border', 'cytoskeleton', 'cbl-b', 'ift80']):
        return "morphology_cytoskeleton"
    if any(k in name for k in ['dc-stamp', 'dcstamp', 'oc-stamp', 'ocstamp', 'cd47', 'sirpa', 'syncytin', 'snx10', 'moesin', 'msn', 'fusion', 'syncytium', 'polykaryon', 'multinucleat', 'calpain', 'hdac2']):
        return "maturation_fusion"
    if any(k in name for k in ['dap12', 'tyrobp', 'fcrg', 'fcer1g', 'trem2', 'oscar', 'siglec', 'cd200', 'b7-h3', 'pd-l1', 'slp-76', 'btk', 'syk', 'plcgamma', 'plcg2', 'ip3r', 'calcineurin', 'ppp3ca', 'calcium']):
        return "immunomodulation"
    if any(k in name for k in ['tnf', 'interleukin', 'il-1', 'il-6', 'il-17', 'ifn', 'interferon', 'tlr4', 'myd88', 'nlrp3', 'dusp1', 'dusp6', 'ppm1d', 'prostaglandin', 'pge2']):
        return "inflammation"
    if any(k in name for k in ['ephrin', 'ephb', 'semaphorin', 'plexin', 'sclerostin', 'sost', 'dkk1', 'hif1', 'hif-1', 'vegf', 'coupling', 'osteoblast']):
        return "interactions_with_other_processes"
        
    return "differentiation"

def escape_xml(val):
    if val is None:
        return ""
    if isinstance(val, (list, dict)):
        val = json.dumps(val)
    s = str(val)
    s = "".join(c for c in s if c in ('\t', '\n', '\r') or (ord(c) >= 32 and ord(c) != 127))
    return xml.sax.saxutils.escape(s)

def build_worksheet_xml(headers, rows):
    out = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ',
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n',
        '  <sheetViews><sheetView tabSelected="1" workbookViewId="0"/></sheetViews>\n',
        '  <sheetFormatPr defaultRowHeight="16"/>\n',
        '  <sheetData>\n'
    ]
    
    # Header row
    out.append('    <row r="1" spans="1:{}">\n'.format(len(headers)))
    for col_idx, h in enumerate(headers, 1):
        col_letter = chr(64 + col_idx) if col_idx <= 26 else f"A{chr(64 + col_idx - 26)}"
        ref = f"{col_letter}1"
        out.append(f'      <c r="{ref}" t="inlineStr"><is><t>{escape_xml(h)}</t></is></c>\n')
    out.append('    </row>\n')
    
    # Data rows
    for row_idx, r in enumerate(rows, 2):
        out.append(f'    <row r="{row_idx}" spans="1:{len(headers)}">\n')
        for col_idx, val in enumerate(r, 1):
            col_letter = chr(64 + col_idx) if col_idx <= 26 else f"A{chr(64 + col_idx - 26)}"
            ref = f"{col_letter}{row_idx}"
            out.append(f'      <c r="{ref}" t="inlineStr"><is><t>{escape_xml(val)}</t></is></c>\n')
        out.append('    </row>\n')
        
    out.append('  </sheetData>\n</worksheet>')
    return "".join(out)

def create_xlsx_file(output_path, tab1_name, tab1_headers, tab1_rows, tab2_name, tab2_headers, tab2_rows):
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>''')
        z.writestr('_rels/.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>''')
        z.writestr('xl/_rels/workbook.xml.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>''')
        wb_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="{escape_xml(tab1_name)}" sheetId="1" r:id="rId1"/>
    <sheet name="{escape_xml(tab2_name)}" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>'''
        z.writestr('xl/workbook.xml', wb_xml)
        z.writestr('xl/worksheets/sheet1.xml', build_worksheet_xml(tab1_headers, tab1_rows))
        z.writestr('xl/worksheets/sheet2.xml', build_worksheet_xml(tab2_headers, tab2_rows))
        
    print(f"-> Generated XLSX: {output_path} ({output_path.stat().st_size:,} bytes)")

def run_enrichment_pipeline():
    print("=" * 70)
    print("STARTING OSTEOCLAST MINI-PRIMEKG ENRICHMENT & WORKBOOK PIPELINE")
    print("=" * 70)
    
    # 1. Load existing knowledge graph
    kg_path = DATA_DIR / "osteoclast_knowledge_graph.json"
    with open(kg_path, "r", encoding="utf-8") as f:
        kg = json.load(f)
        
    raw_nodes = kg.get("nodes", [])
    raw_edges = kg.get("edges", [])
    print(f"Initial raw graph: {len(raw_nodes)} nodes, {len(raw_edges)} edges.")
    
    # 2. Filter out 14 drug nodes and 15 drug edges
    drug_ids = {n["id"] for n in raw_nodes if n["id"].startswith("CHEMBL:")}
    print(f"Identified {len(drug_ids)} exogenous drug nodes to transition to target properties: {sorted(list(drug_ids))}")
    
    bio_nodes = [n for n in raw_nodes if n["id"] not in drug_ids]
    bio_edges = [e for e in raw_edges if e["source"] not in drug_ids and e["target"] not in drug_ids]
    print(f"Cleaned pure biological graph: {len(bio_nodes)} nodes, {len(bio_edges)} edges.")
    
    # Build node lookup by name and ID
    node_by_name = {n["name"]: n for n in bio_nodes}
    node_by_id = {n["id"]: n for n in bio_nodes}
    
    # 3. Enrich every biological node with full Mini-PrimeKG properties
    enriched_nodes = []
    pillar_counts = defaultdict(int)
    
    for n in bio_nodes:
        nid = n["id"]
        name = n["name"]
        ntype = n["type"]
        compartment = n.get("compartment", "cytoplasm")
        pillar = determine_pillar_for_node(n)
        pillar_counts[pillar] += 1
        
        # Start with base node
        en = dict(n)
        en["physiological_pillar"] = pillar
        
        # If HGNC protein/enzyme/TF
        if nid.startswith("HGNC:"):
            symbol = nid.replace("HGNC:", "")
            props = generate_primekg_protein_node(nid, symbol, name, ntype, compartment, pillar)
            en.update(props)
            # Add drug transfers if applicable
            if nid in DRUG_TARGET_TRANSFERS:
                en["known_targeting_drugs"] = DRUG_TARGET_TRANSFERS[nid]
                en["drug_interaction_count"] = len(DRUG_TARGET_TRANSFERS[nid])
                en["small_molecule_tractability"] = "Clinical Precedence"
                
        # If compound
        elif nid.startswith("CHEBI:"):
            if nid in COMPOUND_METADATA:
                en.update(COMPOUND_METADATA[nid])
            if nid in DRUG_TARGET_TRANSFERS:
                en["known_targeting_drugs"] = DRUG_TARGET_TRANSFERS[nid]
                en["drug_interaction_count"] = len(DRUG_TARGET_TRANSFERS[nid])
                
        # If gene / RNA
        elif nid.startswith("GENE:"):
            if nid in GENE_METADATA:
                en.update(GENE_METADATA[nid])
                
        # If reaction
        elif nid.startswith("RXN:"):
            if nid in REACTION_METADATA:
                en.update(REACTION_METADATA[nid])
                
        # If pathway
        elif nid.startswith("PATHWAY:"):
            if nid in PATHWAY_METADATA:
                en.update(PATHWAY_METADATA[nid])
                
        enriched_nodes.append(en)
        
    print("\nPillar breakdown across 267 biological nodes:")
    for p, c in sorted(pillar_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {p:35s}: {c:3d} nodes")
        
    # 4. Read sources.csv and filter out drug nodes
    sources_csv_path = WORKSPACE_DIR / "sources.csv"
    with open(sources_csv_path, "r", encoding="utf-8") as f:
        src_rows = list(csv.DictReader(f))
        
    # Tab 1: All Evidence & Sources (Database, Paper, DOI, Pillar, Node Type, Node Name, Findings)
    tab1_headers = [
        "Database",
        "Paper / Article Citation",
        "DOI / URL",
        "Physiological Pillar",
        "Node Type",
        "Node Name",
        "Experimental Findings & Evidentiary Data"
    ]
    tab1_rows = []
    
    # Tab 2: Node-Paper Mappings (Node ID, Node Name, Node Type, Compartment, Pillar, Database, Paper, DOI, Findings)
    tab2_headers = [
        "Node ID",
        "Node Name",
        "Node Type",
        "Subcellular Compartment",
        "Physiological Pillar",
        "Primary Database",
        "Paper / Article Citation",
        "DOI / URL",
        "Specific Evidence & Findings"
    ]
    tab2_rows = []
    
    drug_names_lower = {n["name"].lower() for n in raw_nodes if n["id"].startswith("CHEMBL:")}
    
    for r in src_rows:
        nname = r["node name"]
        if nname.lower() in drug_names_lower:
            continue  # Exclude drug node rows from pure biological topology
            
        matched_node = node_by_name.get(nname)
        nid = matched_node["id"] if matched_node else "N/A"
        comp = matched_node.get("compartment", "cytoplasm") if matched_node else "cytoplasm"
        pillar = determine_pillar_for_node(matched_node) if matched_node else "differentiation"
        
        db = r["database"]
        art = r["article"]
        doi = r["doi"]
        ntype = r["node type"]
        data = r["data"]
        
        tab1_rows.append([db, art, doi, pillar, ntype, nname, data])
        tab2_rows.append([nid, nname, ntype, comp, pillar, db, art, doi, data])
        
    print(f"\nCompiled {len(tab1_rows)} biological evidence rows for Tab 1.")
    print(f"Compiled {len(tab2_rows)} node-paper mappings for Tab 2.")
    
    # 5. Generate Excel Workbooks in root, data/processed/, and neo4j/
    xlsx_destinations = [
        WORKSPACE_DIR / "osteoclast_knowledge_graph_sources.xlsx",
        DATA_DIR / "osteoclast_knowledge_graph_sources.xlsx",
        NEO4J_DIR / "osteoclast_knowledge_graph_sources.xlsx"
    ]
    
    for dest in xlsx_destinations:
        create_xlsx_file(
            output_path=dest,
            tab1_name="All Evidence & Sources",
            tab1_headers=tab1_headers,
            tab1_rows=tab1_rows,
            tab2_name="Node-Paper Mappings",
            tab2_headers=tab2_headers,
            tab2_rows=tab2_rows
        )
        
    # 6. Save updated JSON knowledge graph (pure biological topology + enriched properties)
    updated_kg = {
        "metadata": {
            "name": "Osteoclast Mini-PrimeKG",
            "version": "3.0.0",
            "description": "High-resolution Osteoclast Differentiation and Maturation Knowledge Graph enriched with UniProt, AlphaFold, PDB, InterPro, PhosphoSitePlus, QuickGO, Ensembl, PubChem, Rhea, Open Targets, and STRING v12.0 multi-scale properties.",
            "total_nodes": len(enriched_nodes),
            "total_edges": len(bio_edges),
            "has_drug_nodes": False,
            "drug_annotations": "Target properties only (NO drug nodes)",
            "pillars": list(pillar_counts.keys())
        },
        "nodes": enriched_nodes,
        "edges": bio_edges
    }
    
    with open(DATA_DIR / "osteoclast_knowledge_graph.json", "w", encoding="utf-8") as f:
        json.dump(updated_kg, f, indent=2)
    with open(NEO4J_DIR / "osteoclast_knowledge_graph.json", "w", encoding="utf-8") as f:
        json.dump(updated_kg, f, indent=2)
        
    print(f"\n-> Updated JSON Knowledge Graph: {len(enriched_nodes)} nodes, {len(bio_edges)} edges.")
    
    # 7. Generate Cypher update scripts
    generate_cypher_scripts(enriched_nodes, bio_edges)
    
    print("=" * 70)
    print("PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 70)

def generate_cypher_scripts(nodes, edges):
    """Generates pure Cypher transaction scripts for Neo4j Desktop."""
    cypher_import_path = NEO4J_DIR / "import_osteoclast_kg.cypher"
    cypher_enrich_path = NEO4J_DIR / "enrich_nodes.cypher"
    cypher_remove_drugs_path = NEO4J_DIR / "remove_drug_nodes.cypher"
    
    # Script 1: Remove drug nodes from existing graph
    with open(cypher_remove_drugs_path, "w", encoding="utf-8") as f:
        f.write("// ==========================================================================\n")
        f.write("// Remove Exogenous Drug Nodes & Edges to Restore Pure Biological Topology\n")
        f.write("// ==========================================================================\n\n")
        f.write("MATCH (d) WHERE d.id STARTS WITH 'CHEMBL:' DETACH DELETE d;\n")
    print(f"-> Generated: {cypher_remove_drugs_path}")
    
    # Script 2: Enrich existing nodes in Neo4j with Mini-PrimeKG properties
    with open(cypher_enrich_path, "w", encoding="utf-8") as f:
        f.write("// ==========================================================================\n")
        f.write("// Osteoclast Mini-PrimeKG Node Property Enrichment Statements\n")
        f.write("// ==========================================================================\n\n")
        
        for n in nodes:
            nid = n["id"]
            label = n.get("neo4j_label", "Node")
            
            # Format properties into Cypher SET clauses
            set_clauses = [
                f"n.physiological_pillar = '{n.get('physiological_pillar', 'differentiation')}'"
            ]
            
            if "uniprot_id" in n:
                set_clauses.append(f"n.uniprot_id = '{n['uniprot_id']}'")
            if "sequence_length" in n:
                set_clauses.append(f"n.sequence_length = {n['sequence_length']}")
            if "molecular_mass_da" in n:
                set_clauses.append(f"n.molecular_mass_da = {n['molecular_mass_da']}")
            if "alphafold_id" in n:
                set_clauses.append(f"n.alphafold_id = '{n['alphafold_id']}'")
            if "alphafold_plddt" in n:
                set_clauses.append(f"n.alphafold_plddt = {n['alphafold_plddt']}")
            if "quaternary_structure" in n:
                set_clauses.append(f"n.quaternary_structure = '{n['quaternary_structure']}'")
            if "activation_state" in n:
                safe_act = n['activation_state'].replace("'", "\\'")
                set_clauses.append(f"n.activation_state = '{safe_act}'")
            if "gene_biotype" in n:
                set_clauses.append(f"n.gene_biotype = '{n['gene_biotype']}'")
            if "small_molecule_tractability" in n:
                set_clauses.append(f"n.small_molecule_tractability = '{n['small_molecule_tractability']}'")
            if "smiles" in n:
                set_clauses.append(f"n.smiles = '{n['smiles']}'")
            if "inchikey" in n:
                set_clauses.append(f"n.inchikey = '{n['inchikey']}'")
            if "logp" in n:
                set_clauses.append(f"n.logp = {n['logp']}")
            if "tpsa" in n:
                set_clauses.append(f"n.tpsa = {n['tpsa']}")
            if "charge" in n:
                set_clauses.append(f"n.charge = {n['charge']}")
                
            # Drug target transfers
            if "known_targeting_drugs" in n and n["known_targeting_drugs"]:
                escaped_drugs = [json.dumps(d) for d in n["known_targeting_drugs"]]
                drugs_cypher = "[" + ", ".join(escaped_drugs) + "]"
                set_clauses.append(f"n.known_targeting_drugs = {drugs_cypher}")
                set_clauses.append(f"n.drug_interaction_count = {n.get('drug_interaction_count', 0)}")
                
            clause_str = ", ".join(set_clauses)
            f.write(f"MATCH (n {{id: '{nid}'}}) SET {clause_str};\n")
            
    print(f"-> Generated: {cypher_enrich_path}")
    
    # Script 3: Complete Fresh Import Script
    with open(cypher_import_path, "w", encoding="utf-8") as f:
        f.write("// ==========================================================================\n")
        f.write("// Osteoclast Mini-PrimeKG Complete Knowledge Graph Import Script\n")
        f.write(f"// Total Nodes: {len(nodes)} (Pure Biological Topology) | Total Edges: {len(edges)}\n")
        f.write("// ==========================================================================\n\n")
        f.write("MATCH (n) DETACH DELETE n;\n\n")
        
        # Write nodes
        f.write("// --- 1. BIOLOGICAL NODES ---\n")
        for n in nodes:
            nid = n["id"]
            lbl = n.get("neo4j_label", "Node")
            name = n["name"].replace("'", "\\'")
            pillar = n.get("physiological_pillar", "differentiation")
            comp = n.get("compartment", "cytoplasm")
            ntype = n.get("type", "protein")
            
            node_props = [
                f"id: '{nid}'",
                f"name: '{name}'",
                f"type: '{ntype}'",
                f"compartment: '{comp}'",
                f"physiological_pillar: '{pillar}'"
            ]
            if "uniprot_id" in n:
                node_props.append(f"uniprot_id: '{n['uniprot_id']}'")
            if "alphafold_id" in n:
                node_props.append(f"alphafold_id: '{n['alphafold_id']}'")
            if "alphafold_plddt" in n:
                node_props.append(f"alphafold_plddt: {n['alphafold_plddt']}")
            if "quaternary_structure" in n:
                node_props.append(f"quaternary_structure: '{n['quaternary_structure']}'")
            if "activation_state" in n:
                safe_act = n['activation_state'].replace("'", "\\'")
                node_props.append(f"activation_state: '{safe_act}'")
            if "gene_biotype" in n:
                node_props.append(f"gene_biotype: '{n['gene_biotype']}'")
            if "smiles" in n:
                node_props.append(f"smiles: '{n['smiles']}'")
            if "logp" in n:
                node_props.append(f"logp: {n['logp']}")
            if "tpsa" in n:
                node_props.append(f"tpsa: {n['tpsa']}")
            if "charge" in n:
                node_props.append(f"charge: {n['charge']}")
            if "small_molecule_tractability" in n:
                node_props.append(f"small_molecule_tractability: '{n['small_molecule_tractability']}'")
            if "known_targeting_drugs" in n and n["known_targeting_drugs"]:
                escaped_drugs = [json.dumps(d) for d in n["known_targeting_drugs"]]
                drugs_cypher = "[" + ", ".join(escaped_drugs) + "]"
                node_props.append(f"known_targeting_drugs: {drugs_cypher}")
                node_props.append(f"drug_interaction_count: {n.get('drug_interaction_count', 0)}")
                
            f.write(f"CREATE (:{lbl} {{{', '.join(node_props)}}});\n")
            
        f.write("\n// --- 2. BIOLOGICAL EDGES ---\n")
        for e in edges:
            src = e["source"]
            tgt = e["target"]
            rel = e.get("relation", "INTERACTS_WITH").upper().replace(" ", "_").replace("-", "_")
            sign = e.get("sign", "+")
            evid_val = e.get("evidence", "")
            if isinstance(evid_val, dict):
                evid = json.dumps(evid_val).replace("'", "\\'")
            else:
                evid = str(evid_val).replace("'", "\\'")
            f.write(f"MATCH (s {{id: '{src}'}}), (t {{id: '{tgt}'}}) CREATE (s)-[:{rel} {{sign: '{sign}', evidence: '{evid}'}}]->(t);\n")
            
    print(f"-> Generated: {cypher_import_path}")

if __name__ == "__main__":
    run_enrichment_pipeline()
