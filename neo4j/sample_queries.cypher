// =============================================================================
// Curated Cypher Queries for Osteoclast Knowledge Graph Exploration
// =============================================================================

// 1. Database Overview: Total nodes & edge counts
MATCH (n:Node) 
RETURN count(n) AS total_nodes;

MATCH ()-[r]->() 
RETURN count(r) AS total_edges;

// 2. Node Counts by Subtype
MATCH (n:Node)
RETURN n.type AS subtype, count(n) AS count
ORDER BY count DESC;

// 3. Relationships by Type
MATCH ()-[r]->()
RETURN type(r) AS relation_type, count(r) AS count
ORDER BY count DESC;

// 4. View Core RANKL / RANK / TRAF6 Signaling Cascade
MATCH path = (rankl:Protein {node_id: "HGNC:TNFSF11"})-[*1..3]->(downstream:Node)
RETURN path;

// 5. Explore STRING v12.0 PPI Confirmed Edges
MATCH (s:Node)-[r]->(t:Node)
WHERE r.evidence_quote CONTAINS "STRING"
RETURN s.name, type(r), t.name, r.evidence_quote
LIMIT 25;

// 6. Inspect Master Transcription Factor NFATc1 Neighborhood
MATCH (n:TranscriptionFactor {node_id: "HGNC:NFATC1"})-[r]-(neighbor:Node)
RETURN n, r, neighbor;

// 7. Find All Metabolic Enzymes (Glycolysis & TCA Cycle)
MATCH (e:Enzyme)
RETURN e.node_id, e.name, e.compartment
ORDER BY e.name;

// 8. Find Extracellular and Intracellular Compounds
MATCH (c:Node)
WHERE c.type IN ['extracellular_compound', 'intracellular_compound']
RETURN c.type, c.name, c.compartment;

// 9. Discover Inhibitory Regulators (Negative Regulators / Brakes)
MATCH (s:Node)-[r:INHIBITS]->(t:Node)
RETURN s.name AS inhibitor, t.name AS target, r.evidence_quote AS evidence
LIMIT 20;

// 10. Multi-hop Path from RANKL to Bone Resorption Phenotype
MATCH p = shortestPath((rankl:Node {node_id: "HGNC:TNFSF11"})-[*]-(pheno:Node {node_id: "PHENO:bone_resorption"}))
RETURN p;
