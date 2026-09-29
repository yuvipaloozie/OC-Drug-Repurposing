// ==========================================================================
// Remove Exogenous Drug Nodes & Edges to Restore Pure Biological Topology
// ==========================================================================

MATCH (d) WHERE d.id STARTS WITH 'CHEMBL:' DETACH DELETE d;
