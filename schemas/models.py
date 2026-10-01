"""
Data schemas and models for the Osteoclast Mechanism Knowledge Graph.
Defines the six canonical tables:
1. nodes
2. edges
3. experiments
4. edge_evidence
5. contexts
6. source_records

Contextual osteoclastogenesis graph:
- RANKL-induced osteoclast differentiation, including RAW 264.7 and primary mouse BMMs.
- Additional recorded species and models retain explicit context; mouse is not inferred by default.
- Metabolic pathways (glycolysis, TCA, amino acids), actin dynamics, syncytium fusion,
  histone states, transcription factors, miRNA, and mRNA translation.
"""

from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any
from enum import Enum


class NodeType(str, Enum):
    EXTRACELLULAR_COMPOUND = "extracellular_compound"
    INTRACELLULAR_COMPOUND = "intracellular_compound"
    GENE = "gene"
    RNA = "rna"
    PROTEIN = "protein"
    REACTION = "reaction"
    PATHWAY = "pathway"


class EdgeRelation(str, Enum):
    INHIBITS = "INHIBITS"
    ACTIVATES = "ACTIVATES"
    CATALYZES = "CATALYZES"
    INPUT_TO = "INPUT_TO"
    OUTPUT_OF = "OUTPUT_OF"
    TRANSPORTS = "TRANSPORTS"
    REGULATES = "REGULATES"
    TRANSCRIBED_FROM = "TRANSCRIBED_FROM"
    TRANSLATED_TO = "TRANSLATED_TO"
    PART_OF = "PART_OF"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"


class EdgeStatus(str, Enum):
    CURATED = "curated"
    PROPOSED = "proposed"
    QUARANTINED = "quarantined"


class EvidenceKind(str, Enum):
    PERTURBATION = "perturbation"
    RESCUE = "rescue"
    MEASUREMENT = "measurement"
    ASSOCIATION = "association"
    PREDICTION = "prediction"


class EvidencePolarity(str, Enum):
    SUPPORT = "support"
    CONTRADICT = "contradict"


@dataclass
class Node:
    node_id: str  # Local entity identity or registry accession; local molecule IDs are not official gene IDs.
    type: str  # NodeType
    name: str
    taxon: str  # 'mouse', 'human', 'all'
    compartment: Optional[str] = None  # cytoplasm, nucleus, mitochondria, extracellular, plasma_membrane
    aliases: str = ""  # Pipe-separated aliases
    roles: str = ""  # Protein roles, e.g. enzyme|transcription_factor
    rna_type: str = ""  # mrna, mirna, lncrna; only for RNA entities
    legacy_ids: str = ""
    identity_status: str = "pending_registry_mapping"
    symbol: str = ""
    physiological_pillar: str = ""
    structure_candidates: str = "{}"
    annotation_status: str = "pending"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Edge:
    edge_id: str
    source_id: str
    relation: str  # EdgeRelation
    target_id: str
    sign: int  # -1 (inhibition/repression), +1 (activation/production), 0 (unsigned/reaction/structural)
    context_id: Optional[str]
    source_db: str  # pubmed, pubtator, rhea, reactome, chembl
    source_record_id: str  # PMID:..., RHEA:..., etc.
    status: str = EdgeStatus.PROPOSED.value
    context_status: str = "pending"
    legacy_source_record_id: str = ""
    review_note: str = ""
    causal_basis: str = ""  # e.g. genetic_perturbation_role_inference; not direct drug inhibition
    effect_level: str = ""  # phenotype, expression, activity; missing for legacy claims

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Experiment:
    experiment_id: str
    paper_id: str  # PMID:...
    model_system: str  # in_vitro, ex_vivo
    species: str  # Recorded model species; missingness is not silently replaced with mouse.
    cell_type: str  # bone marrow macrophage (BMM), RAW 264.7
    differentiation_stage: str  # uncommitted, early pre-osteoclast, committed mononuclear TRAP+, syncytium, mature multinucleated
    treatment: str  # M-CSF + RANKL, RANKL alone, etc.
    dose: Optional[str] = None
    duration: Optional[str] = None
    endpoint: str = ""  # TRAP+ multinucleated cells, pit resorption area, F-actin ring, viability
    assay: str = ""  # TRAP staining, qPCR, Western blot, metabolomics, RNA-seq, ChIP-seq, pit assay
    measured_effect: str = ""  # quantitative or qualitative effect
    viability: str = "not reported"  # MTT, CCK-8, LDH, Trypan blue, or 'not reported'
    figure_or_table: str = ""
    verification_status: str = "pending_passage_review"
    review_note: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class EdgeEvidence:
    edge_id: str
    experiment_id: Optional[str]  # None for basic database facts
    quote_or_location: str
    evidence_kind: str  # EvidenceKind
    polarity: str  # EvidencePolarity
    curator_status: str  # reviewed, automated_extraction, pending
    reviewed_at: str
    evidence_id: str = ""
    source_id: str = ""
    claim_summary: str = ""
    passage_status: str = "missing"
    source_location: str = ""
    source_url: str = ""
    source_sha256: str = ""
    legacy_experiment_id: str = ""
    legacy_source_records: str = ""
    review_note: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Context:
    context_id: str
    species: str  # mouse
    cell_type: str  # bone marrow macrophage, RAW 264.7
    stage: str
    compartment: Optional[str] = None
    disease_setting: Optional[str] = None  # physiological, RANKL_induced_osteoclastogenesis
    note: str = ""
    verification_status: str = "pending_source_review"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SourceRecord:
    source_id: str
    title: str
    resolution_status: str
    claim_match_status: str
    url: str
    retrieved_at: str
    raw_file: str
    raw_sha256: str
    doi: str = ""
    pmid: str = ""
    pmcid: str = ""
    publication_types: str = ""
