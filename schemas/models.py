"""
Data schemas and models for the Osteoclast Mechanism Knowledge Graph.
Defines the five canonical tables:
1. nodes
2. edges
3. experiments
4. edge_evidence
5. contexts
"""

from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any
from enum import Enum


class NodeType(str, Enum):
    DRUG = "drug"
    PROTEIN = "protein"
    METABOLITE = "metabolite"
    REACTION = "reaction"
    CHROMATIN_EVENT = "chromatin_event"
    GENE = "gene"
    PHENOTYPE = "phenotype"


class EdgeRelation(str, Enum):
    INHIBITS = "INHIBITS"
    ACTIVATES = "ACTIVATES"
    CATALYZES = "CATALYZES"
    INPUT_TO = "INPUT_TO"
    OUTPUT_OF = "OUTPUT_OF"
    REGULATES = "REGULATES"
    CHANGES_MODIFICATION = "CHANGES_MODIFICATION"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"
    SECRETED_BY = "SECRETED_BY"
    TAKEN_UP_BY = "TAKEN_UP_BY"


class EdgeStatus(str, Enum):
    CURATED = "curated"
    PROPOSED = "proposed"


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
    node_id: str  # Namespaced stable ID (e.g., HGNC:PHGDH, CHEBI:16810, CHEMBL:CHEMBL25)
    type: str  # NodeType
    name: str
    taxon: str  # 'human', 'mouse', 'all'
    compartment: Optional[str] = None  # cytoplasm, nucleus, mitochondria, extracellular
    aliases: str = ""  # Pipe-separated aliases

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Edge:
    edge_id: str
    source_id: str
    relation: str  # EdgeRelation
    target_id: str
    sign: int  # -1 (inhibition/repression), +1 (activation/production), 0 (unsigned/reaction)
    context_id: str
    source_db: str  # pubmed, pubtator, rhea, reactome, chembl
    source_record_id: str  # PMID:..., RHEA:..., etc.
    status: str = EdgeStatus.PROPOSED.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Experiment:
    experiment_id: str
    paper_id: str  # PMID:... or PMC:...
    model_system: str  # in_vitro, in_vivo, cell_free
    species: str  # mouse, human, rat
    cell_type: str  # bone marrow macrophage, RAW264.7, PBMC, osteoclast, osteoblast
    differentiation_stage: str  # quiescent, early differentiation, multinucleated osteoclast
    treatment: str
    dose: Optional[str] = None
    duration: Optional[str] = None
    endpoint: str = ""  # TRAP+ multinucleated cells, pit resorption area, F-actin ring, viability
    assay: str = ""  # TRAP staining, qPCR, Western blot, metabolomics, RNA-seq, ChIP-seq
    measured_effect: str = ""  # quantitative or qualitative effect
    viability: str = "not reported"  # MTT, CCK-8, LDH, Trypan blue, or 'not reported'
    figure_or_table: str = ""

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

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Context:
    context_id: str
    species: str
    cell_type: str
    stage: str
    compartment: Optional[str] = None
    disease_setting: Optional[str] = None  # physiological, osteoporosis_OVX, rheumatoid_arthritis
    note: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
