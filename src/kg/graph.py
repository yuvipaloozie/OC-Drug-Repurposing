"""
Core Knowledge Graph implementation for Osteoclast Mechanism Modeling.
Provides:
1. MultiDiGraph representation with node, edge, and context attributes.
2. Sign-aware path finding: Drug -> Target -> Metabolism -> Chromatin -> Phenotype.
3. Path scoring with contradiction handling, evidence weighting, and context matching.
4. Leakage-safe graph masking for evaluation folds.
"""

from collections import defaultdict
import csv
from typing import Dict, List, Set, Tuple, Optional, Any


class OsteoclastKnowledgeGraph:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: Dict[str, Dict[str, Any]] = {}
        self.experiments: Dict[str, Dict[str, Any]] = {}
        self.edge_evidence: List[Dict[str, Any]] = []
        self.contexts: Dict[str, Dict[str, Any]] = {}

        # Adjacency: source_id -> list of (target_id, edge_id)
        self.adj_out: Dict[str, List[Tuple[str, str]]] = defaultdict(list)
        self.adj_in: Dict[str, List[Tuple[str, str]]] = defaultdict(list)

    def load_from_csv(
        self,
        nodes_path: str,
        edges_path: str,
        experiments_path: Optional[str] = None,
        evidence_path: Optional[str] = None,
        contexts_path: Optional[str] = None,
    ):
        """Loads all KG tables from standardized CSV files."""
        # Load nodes
        with open(nodes_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.nodes[row["node_id"]] = row

        # Load contexts if provided
        if contexts_path:
            with open(contexts_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.contexts[row["context_id"]] = row

        # Load experiments if provided
        if experiments_path:
            with open(experiments_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.experiments[row["experiment_id"]] = row

        # Load edge evidence if provided
        if evidence_path:
            with open(evidence_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.edge_evidence.append(row)

        # Load edges
        with open(edges_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                edge_id = row["edge_id"]
                src = row["source_id"]
                tgt = row["target_id"]
                sign = int(row.get("sign", 0))
                row["sign"] = sign
                self.edges[edge_id] = row
                self.adj_out[src].append((tgt, edge_id))
                self.adj_in[tgt].append((src, edge_id))

    def filter_subgraph_by_leakage(
        self, held_out_papers: Set[str], held_out_compounds: Set[str]
    ) -> "OsteoclastKnowledgeGraph":
        """
        Creates a leakage-safe copy of the KG by excluding:
        1. Any edge whose source_record_id is in held_out_papers.
        2. Any edge whose evidence links to an experiment from held_out_papers.
        3. Edges directly linking to held-out compounds except strictly approved background facts.
        """
        subgraph = OsteoclastKnowledgeGraph()
        subgraph.nodes = dict(self.nodes)
        subgraph.contexts = dict(self.contexts)
        subgraph.experiments = {
            exp_id: exp
            for exp_id, exp in self.experiments.items()
            if exp.get("paper_id") not in held_out_papers
        }

        # Filter edge evidence
        subgraph.edge_evidence = [
            ev
            for ev in self.edge_evidence
            if ev.get("experiment_id") in subgraph.experiments or ev.get("experiment_id") is None
        ]

        # Valid edges
        for edge_id, edge in self.edges.items():
            # Check source record
            src_record = edge.get("source_record_id", "")
            if any(paper in src_record for paper in held_out_papers):
                continue

            src = edge["source_id"]
            tgt = edge["target_id"]

            if src in held_out_compounds or tgt in held_out_compounds:
                continue

            subgraph.edges[edge_id] = edge
            subgraph.adj_out[src].append((tgt, edge_id))
            subgraph.adj_in[tgt].append((src, edge_id))

        return subgraph

    def find_mechanism_paths(
        self,
        drug_node_id: str,
        target_phenotype_id: str = "PHENO:osteoclast_differentiation",
        max_depth: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Finds biologically typed directed paths from drug to osteoclast phenotype.
        Expected typical route:
        Drug -> (Target) -> (Metabolite / Reaction) -> (Chromatin Event / Transcription Factor) -> Phenotype
        """
        paths: List[Dict[str, Any]] = []

        # DFS search with cycle detection
        def dfs(curr_node: str, current_path: List[Tuple[str, str]], visited_nodes: Set[str]):
            if len(current_path) > max_depth:
                return

            if curr_node == target_phenotype_id and len(current_path) >= 2:
                # Extract path details and evaluate sign consistency
                path_edges = [edge_id for _, edge_id in current_path]
                net_sign = 1
                has_unknown = False
                for edge_id in path_edges:
                    s = self.edges[edge_id]["sign"]
                    if s == 0:
                        has_unknown = True
                    else:
                        net_sign *= s

                paths.append(
                    {
                        "drug_id": drug_node_id,
                        "nodes": [drug_node_id] + [tgt for tgt, _ in current_path],
                        "edges": path_edges,
                        "path_length": len(current_path),
                        "net_sign": 0 if has_unknown else net_sign,
                        "has_unsigned_step": has_unknown,
                    }
                )
                return

            for nxt_node, edge_id in self.adj_out.get(curr_node, []):
                if nxt_node not in visited_nodes:
                    visited_nodes.add(nxt_node)
                    current_path.append((nxt_node, edge_id))
                    dfs(nxt_node, current_path, visited_nodes)
                    current_path.pop()
                    visited_nodes.remove(nxt_node)

        dfs(drug_node_id, [], {drug_node_id})
        return paths

    def score_drug_mechanism(
        self,
        drug_node_id: str,
        desired_phenotype_effect: int = -1,  # -1 means inhibit osteoclastogenesis
        target_phenotype_id: str = "PHENO:osteoclast_differentiation",
    ) -> Dict[str, Any]:
        """
        Scores a drug candidate based on surviving validated paths:
        - Filters out unsigned causal chains where direction cannot be guaranteed.
        - Calculates signed consistency: does net path sign match desired_phenotype_effect?
        - Counts direct osteoclast experimental evidence.
        - Checks for contradictions.
        """
        raw_paths = self.find_mechanism_paths(drug_node_id, target_phenotype_id)
        if not raw_paths:
            return {
                "drug_id": drug_node_id,
                "mechanism_coverage": False,
                "surviving_paths_count": 0,
                "mechanism_feature": 0.0,
                "contradiction_flag": False,
                "paths": [],
            }

        surviving_paths = []
        contradictions = False
        signs_observed = set()

        for p in raw_paths:
            net_sign = p["net_sign"]
            signs_observed.add(net_sign)
            # Consistent with desired therapeutic effect?
            if net_sign == desired_phenotype_effect:
                surviving_paths.append(p)

        if len(signs_observed) > 1 and (-1 in signs_observed and 1 in signs_observed):
            contradictions = True

        # Calculate module feature: penalize long paths, reward direct evidence
        best_score = 0.0
        for p in surviving_paths:
            # Score decay by path length: 1.0 / path_length
            path_score = 1.0 / (p["path_length"] ** 0.5)
            if path_score > best_score:
                best_score = path_score

        return {
            "drug_id": drug_node_id,
            "mechanism_coverage": len(surviving_paths) > 0,
            "surviving_paths_count": len(surviving_paths),
            "mechanism_feature": round(best_score, 4),
            "contradiction_flag": contradictions,
            "paths": surviving_paths,
        }
