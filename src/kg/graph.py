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
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional, Any


class OsteoclastKnowledgeGraph:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: Dict[str, Dict[str, Any]] = {}
        self.experiments: Dict[str, Dict[str, Any]] = {}
        self.edge_evidence: List[Dict[str, Any]] = []
        self.contexts: Dict[str, Dict[str, Any]] = {}
        self.source_records: Dict[str, Dict[str, Any]] = {}
        self.last_search_truncated = False
        self.last_search_exclusions = {}

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
        sources_path: Optional[str] = None,
    ):
        """Loads all KG tables from standardized CSV files."""
        self.__init__()  # Loading is a replacement, not an accumulating merge.
        # Use the canonical source ledger when available; hand-built graphs can
        # still run, with a source_registry_not_loaded qualification.
        source_path = Path(sources_path) if sources_path else Path(nodes_path).with_name('source_records.csv')
        if source_path.exists():
            with source_path.open(encoding='utf-8', newline='') as f:
                self.source_records = {row['source_id']: row for row in csv.DictReader(f)}
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
        """Remove held-out evidence, preserving independently supported relationships.

        Evidence records are authoritative when present. Edge-level source IDs are
        a fallback for legacy records without evidence; retained copies are scrubbed.
        """
        subgraph = OsteoclastKnowledgeGraph()
        subgraph.nodes = {k:dict(v) for k,v in self.nodes.items() if k not in held_out_compounds}
        subgraph.contexts = dict(self.contexts)
        subgraph.source_records = {k:dict(v) for k,v in self.source_records.items() if k not in held_out_papers}
        subgraph.experiments = {
            exp_id: exp
            for exp_id, exp in self.experiments.items()
            if exp.get("paper_id") not in held_out_papers
        }

        # Filter edge evidence
        subgraph.edge_evidence = [
            ev
            for ev in self.edge_evidence
            if (not ev.get("experiment_id") or ev.get("experiment_id") in subgraph.experiments)
            and ev.get("source_id") not in held_out_papers
        ]

        # Valid edges
        for edge_id, edge in self.edges.items():
            sources = [v.strip() for v in edge.get("source_record_id", "").split(';') if v.strip()]
            retained_sources = [v for v in sources if v not in held_out_papers]
            original_support = [ev for ev in self.edge_evidence if ev["edge_id"] == edge_id]
            remaining_support = [ev for ev in subgraph.edge_evidence if ev["edge_id"] == edge_id]
            if original_support:
                if not remaining_support:
                    continue
            elif sources and not retained_sources:
                continue
            edge = dict(edge)
            edge["source_record_id"] = ';'.join(retained_sources)
            if "legacy_source_record_id" in edge:
                edge["legacy_source_record_id"] = ';'.join(
                    v.strip() for v in edge["legacy_source_record_id"].split(';')
                    if v.strip() not in held_out_papers)
            src = edge["source_id"]
            tgt = edge["target_id"]

            if src in held_out_compounds or tgt in held_out_compounds:
                continue

            subgraph.edges[edge_id] = edge
            subgraph.adj_out[src].append((tgt, edge_id))
            subgraph.adj_in[tgt].append((src, edge_id))

        subgraph.edge_evidence = [ev for ev in subgraph.edge_evidence if ev["edge_id"] in subgraph.edges]
        return subgraph

    @staticmethod
    def _context_value(value):
        text = re.sub(r'[^a-z0-9]', '', str(value or '').lower())
        return {'musmusculus': 'mouse', '10090': 'mouse',
                'homosapiens': 'human', '9606': 'human'}.get(text, text)

    def _source_usable(self, source_id):
        if not source_id:
            return False
        source = self.source_records.get(source_id, {})
        return (not self.source_records or bool(source)) and source.get('claim_match_status') != 'citation_topic_mismatch'

    def evidence_eligible(self, edge_id):
        """Compatibility API: strict experimental review, NOT general graph usability."""
        edge = self.edges[edge_id]
        context = self.contexts.get(edge.get('context_id'), {})
        if edge.get('status') != 'curated' or edge.get('context_status') != 'reviewed':
            return False
        if context.get('verification_status') != 'reviewed':
            return False
        for ev in self.edge_evidence:
            if ev['edge_id'] != edge_id or ev.get('curator_status') != 'reviewed':
                continue
            if ev.get('polarity') != 'support' or ev.get('passage_status') not in ('source_checked_paraphrase', 'source_checked_quote'):
                continue
            if not self._source_usable(ev.get('source_id')) or not all(ev.get(k) for k in ('source_location', 'source_sha256', 'quote_or_location')):
                continue
            exp = self.experiments.get(ev.get('experiment_id'), {})
            if exp.get('verification_status') == 'reviewed' and all(
                self._context_value(exp.get(k)) and self._context_value(exp.get(k)) == self._context_value(context.get(k))
                for k in ('species', 'cell_type')
            ):
                return True
        return False

    def assess_edge(self, edge_id, mode='informed'):
        """Explain usable evidence without promoting stored scientific review status.

        Weights are policy heuristics, not probabilities. Missing provenance limits
        categorization; known quarantines/mismatched citations cannot be evidence.
        """
        if mode not in ('informed', 'discovery', 'strict'):
            raise ValueError('mode must be informed, discovery, or strict')
        edge = self.edges[edge_id]
        result = {'edge_id': edge_id, 'usable': False, 'tier': 'excluded', 'weight': 0.0,
                  'support_sources': [], 'contradicting_sources': [], 'warnings': []}
        if edge.get('status') == 'quarantined':
            result['warnings'].append('quarantined_claim')
            return result
        records = [ev for ev in self.edge_evidence if ev['edge_id'] == edge_id]
        usable = [ev for ev in records if ev.get('curator_status') != 'quarantined' and self._source_usable(ev.get('source_id'))]
        support = [ev for ev in usable if ev.get('polarity') == 'support']
        contradict = [ev for ev in usable if ev.get('polarity') == 'contradict']
        result['support_sources'] = sorted({ev['source_id'] for ev in support})
        result['contradicting_sources'] = sorted({ev['source_id'] for ev in contradict})
        if contradict:
            result['warnings'].append('contradicting_evidence_present')
        checked = [ev for ev in support if ev.get('curator_status') == 'reviewed'
                   and ev.get('passage_status') in ('source_checked_quote', 'source_checked_paraphrase')
                   and ev.get('quote_or_location') and ev.get('source_location')]
        if self.evidence_eligible(edge_id):
            tier, weight = 'reviewed_experiment', 1.0
        elif mode == 'strict':
            result['warnings'].append('strict_experiment_requirements_not_met')
            return result
        else:
            sources = [s.strip() for s in edge.get('source_record_id', '').split(';') if s.strip()]
            # Do not fall back to the citation on an edge after its evidence has
            # explicitly been quarantined or contains only contradiction.
            if records:
                sources = result['support_sources']
            else:
                sources = [s for s in sources if self._source_usable(s)]
            db = edge.get('source_db', '').lower()
            curated_database = db in {'reactome', 'rhea', 'uniprot', 'omnipath', 'recon3d', 'hmdb', 'string', 'chembl'} and edge.get('status') == 'curated' and sources
            if curated_database:
                tier, weight = 'curated_database', 0.8
            elif checked:
                tier, weight = 'reviewed_passage', 0.65
            elif any(ev.get('quote_or_location') for ev in support):
                tier, weight = 'extracted_candidate', 0.25
            elif sources:
                tier, weight = 'citation_only_candidate', 0.15
            else:
                result['warnings'].append('no_nonquarantined_source_support')
                return result
            # Unresolved publication IDs can aid discovery, but cannot score as
            # resolved knowledge. Missing registry in hand-built fixtures is explicit.
            if self.source_records:
                resolved = [s for s in sources if self.source_records.get(s, {}).get('resolution_status') == 'resolved']
                if not resolved and mode == 'informed':
                    result['warnings'].append('unresolved_source_discovery_only')
                    return result
            result['support_sources'] = sorted(set(sources))
        result.update(usable=True, tier=tier, weight=weight)
        if edge.get('causal_basis') == 'genetic_perturbation_role_inference':
            result['warnings'].extend(['inferred_functional_role_not_direct_activation',
                                       'genetic_perturbation_not_equivalent_to_drug_inhibition'])
        if not self.source_records:
            result['warnings'].append('source_registry_not_loaded')
        if tier != 'reviewed_experiment':
            result['warnings'].append('not_strict_experimental_evidence')
        for key in ('source_id', 'target_id'):
            status = self.nodes.get(edge.get(key), {}).get('identity_status', '')
            if not status or 'pending' in status:
                result['warnings'].append('endpoint_identity_pending')
        context = self.contexts.get(edge.get('context_id'), {})
        for ev in support:
            exp = self.experiments.get(ev.get('experiment_id'), {})
            if any(exp.get(k) and context.get(k) and self._context_value(exp[k]) != self._context_value(context[k])
                   for k in ('species', 'cell_type')):
                result['warnings'].append('experiment_context_mismatch')
        result['warnings'] = sorted(set(result['warnings']))
        return result

    def find_mechanism_paths(self, drug_node_id, target_phenotype_id='PATHWAY:OSTEOCLAST_DIFFERENTIATION',
                             max_depth=8, evidence_only=None, *, mode='informed', target_context=None,
                             max_paths=1000):
        """Find target- or drug-starting routes, including single-edge routes.

        Default is evidence-informed exploration. Legacy evidence_only=True selects
        strict; False selects discovery. Unsigned/structural routes remain visible
        with unresolved direction, never silently interpreted as positive causality.
        """
        if evidence_only is not None:
            mode = 'strict' if evidence_only else 'discovery'
        if mode not in ('informed', 'discovery', 'strict'):
            raise ValueError('Unknown evidence mode')
        if max_depth < 1 or max_paths < 1:
            raise ValueError('max_depth and max_paths must be positive')
        assessments = {k: self.assess_edge(k, mode) for k in self.edges}
        paths = []
        self.last_search_truncated = False
        self.last_search_exclusions = {}
        signed_relations = {'ACTIVATES', 'INHIBITS', 'REGULATES'}
        structural = {'CATALYZES', 'INPUT_TO', 'OUTPUT_OF', 'TRANSPORTS', 'PART_OF', 'TRANSCRIBED_FROM', 'TRANSLATED_TO'}

        def describe(chain):
            net_sign, unsigned, warnings = 1, [], set()
            species, cells = set(), set()
            context_known = True
            for _, eid in chain:
                e = self.edges[eid]
                relation = e.get('relation', 'REGULATES')
                sign = int(e.get('sign', 0))
                if sign == 0 or relation not in signed_relations:
                    unsigned.append({'edge_id': eid, 'relation': relation,
                                     'kind': 'structural_or_biochemical' if relation in structural else 'unknown_influence'})
                else:
                    net_sign *= sign
                a = assessments[eid]
                warnings.update(a['warnings'])
                c = self.contexts.get(e.get('context_id'), {})
                # Experimental context on evidence can inform a proposed edge even
                # before its canonical context ID has been curated.
                contexts = [c] + [self.experiments.get(ev.get('experiment_id'), {}) for ev in self.edge_evidence
                                 if ev['edge_id'] == eid and ev.get('curator_status') != 'quarantined'
                                 and ev.get('polarity') == 'support' and self._source_usable(ev.get('source_id'))]
                found_species = {self._context_value(x.get('species')) for x in contexts if x.get('species')}
                found_cells = {self._context_value(x.get('cell_type')) for x in contexts if x.get('cell_type')}
                species.update(found_species)
                cells.update(found_cells)
                if not found_species or not found_cells:
                    context_known = False
            for key, values in [('species', species), ('cell_type', cells)]:
                requested = self._context_value((target_context or {}).get(key))
                if len(values) > 1 or (requested and values and values != {requested}):
                    warnings.add('context_mismatch')
            if not context_known:
                warnings.add('context_incomplete')
            if mode == 'strict' and 'context_mismatch' in warnings:
                return
            penalty = 0.6 if 'context_mismatch' in warnings or 'experiment_context_mismatch' in warnings else 0.85 if 'context_incomplete' in warnings else 1.0
            if 'endpoint_identity_pending' in warnings:
                penalty *= 0.85
            if 'contradicting_evidence_present' in warnings:
                penalty *= 0.5
            if unsigned:
                warnings.add('direction_unresolved')
            weight = min(assessments[eid]['weight'] for _, eid in chain) * penalty / len(chain) ** 0.5
            paths.append({'drug_id': drug_node_id, 'start_node_id': drug_node_id,
                          'nodes': [drug_node_id] + [n for n, _ in chain], 'edges': [e for _, e in chain],
                          'path_length': len(chain), 'net_sign': 0 if unsigned else net_sign,
                          'has_unsigned_step': bool(unsigned), 'unsigned_steps': unsigned,
                          'evidence_mode': mode, 'edge_assessments': [assessments[e] for _, e in chain],
                          'warnings': sorted(warnings), 'heuristic_weight': round(weight, 6)})

        def dfs(node, chain, visited):
            if node == target_phenotype_id and chain:
                describe(chain)
                return
            if len(chain) >= max_depth:
                return
            for nxt, eid in self.adj_out.get(node, []):
                if not assessments[eid]['usable']:
                    self.last_search_exclusions[eid] = assessments[eid]
                    continue
                if nxt in visited:
                    continue
                if len(paths) >= max_paths:
                    self.last_search_truncated = True
                    return
                dfs(nxt, chain + [(nxt, eid)], visited | {nxt})
        dfs(drug_node_id, [], {drug_node_id})
        return sorted(paths, key=lambda p: -p['heuristic_weight'])

    def score_drug_mechanism(self, drug_node_id, desired_phenotype_effect=-1,
                             target_phenotype_id='PATHWAY:OSTEOCLAST_DIFFERENTIATION', max_depth=8,
                             *, mode='informed', target_context=None, max_paths=1000):
        """Explain heuristic ranking, retaining opposing and unsigned routes.

        No probability of efficacy is estimated. For target-only exploration use
        find_mechanism_paths; drug scoring needs an explicit drug-target direction.
        """
        if desired_phenotype_effect not in (-1, 1):
            raise ValueError('desired_phenotype_effect must be -1 or +1')
        paths = self.find_mechanism_paths(drug_node_id, target_phenotype_id, max_depth,
                                          mode=mode, target_context=target_context, max_paths=max_paths)
        supporting = [p for p in paths if p['net_sign'] == desired_phenotype_effect]
        opposing = [p for p in paths if p['net_sign'] == -desired_phenotype_effect]
        unresolved = [p for p in paths if p['net_sign'] == 0]
        positive = max((p['heuristic_weight'] for p in supporting), default=0.0)
        negative = max((p['heuristic_weight'] for p in opposing), default=0.0)
        return {'drug_id': drug_node_id, 'evidence_mode': mode, 'score_kind': 'uncalibrated_heuristic',
                'graph_coverage': bool(paths), 'mechanism_coverage': bool(supporting),
                'surviving_paths_count': len(supporting), 'mechanism_feature': round(positive-negative, 4),
                'supporting_weight': positive, 'opposing_weight': negative,
                'contradiction_flag': bool(supporting and opposing) or any('contradicting_evidence_present' in p['warnings'] for p in paths) or any(a['contradicting_sources'] for a in self.last_search_exclusions.values()),
                'paths': supporting, 'opposing_paths': opposing, 'direction_unresolved_paths': unresolved,
                'all_paths': paths, 'excluded_edges': list(self.last_search_exclusions.values()),
                'search_truncated': self.last_search_truncated}
