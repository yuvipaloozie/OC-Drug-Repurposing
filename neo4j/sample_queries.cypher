MATCH (n:Protein) RETURN n LIMIT 100;
MATCH (n:RNA) RETURN n;
MATCH (s)-[r]->(t) WHERE r.status = "curated" RETURN s,r,t;
MATCH (v:Evidence) WHERE v.curator_status <> "reviewed" RETURN v LIMIT 100;
