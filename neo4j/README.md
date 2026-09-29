# Osteoclast Knowledge Graph - Neo4j Desktop Integration

This package recreates the complete **Osteoclast Knowledge Graph** (281 nodes, 365 edges, 8 distinct subtypes, 116 STRING PPI confirmed edges) inside **Neo4j Desktop**.

---

## 🎨 Palette & Schema Mapping

All nodes are rendered with **transparent/pastel fills and opaque saturated borders**, matching your exact specifications:

| Subtype | Neo4j Label | Color Name | Fill Hex | Border Hex | Count |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Protein** | `:Protein` | Green | `#DCFCE7` | `#16A34A` | 77 |
| **Enzyme** | `:Enzyme` | Red | `#FEE2E2` | `#DC2626` | 99 |
| **Transcription Factor** | `:TranscriptionFactor` | Magenta | `#FAE8FF` | `#C026D3` | 22 |
| **Gene** | `:Gene` | Orange | `#FFEDD5` | `#EA580C` | 13 |
| **Extracellular Compound** | `:ExtracellularCompound` | Brown | `#F5E6D3` | `#8B4513` | 17 |
| **Intracellular Compound** | `:IntracellularCompound` | Purple | `#F3E8FF` | `#9333EA` | 27 |
| **Reaction** | `:Reaction` | Royal Blue | `#DBEAFE` | `#2563EB` | 5 |
| **Pathway** | `:Pathway` | Cyan | `#CFFAFE` | `#0891B2` | 21 |

**Total:** 281 Nodes, 365 Relationships (`ACTIVATES`: 255, `INHIBITS`: 69, `PART_OF`: 15, `REGULATES`: 10, `TRANSLATED_TO`: 9, `TRANSPORTS`: 7).

---

## 🚀 Quick Setup in Neo4j Desktop

### Step 1: Create and Start a DBMS in Neo4j Desktop
1. Open **Neo4j Desktop**.
2. Under your Project (or click **New Project**), click **Add** > **Local DBMS**.
3. Set the configuration:
   - **Name**: `OsteoclastKG`
   - **Password**: `password` (or any password you prefer)
   - **Version**: default (5.x or 4.4)
4. Click **Create**, then click **Start**. Wait until the green status dot appears (active on port 7474 & 7687).

---

### Step 2: Load the Knowledge Graph

You have two convenient ways to load the graph:

#### Option A: Automated One-Line Loader (Recommended)
In your terminal, run:
```bash
python3 neo4j/load_to_neo4j.py --password password
```
*(If you set a different password, replace `password` with your password).*

The loader will:
- Connect directly to your local Neo4j instance
- Create uniqueness constraints and indexes
- Batch-load all 281 nodes with all properties and labels
- Batch-load all 365 relationships with full evidence, STRING v12.0 PPI scores, and PMIDs
- Verify the graph counts and print a summary table

#### Option B: Direct Cypher in Neo4j Browser
1. In Neo4j Desktop, click **Open** on your active DBMS to open **Neo4j Browser**.
2. Open [`neo4j/import_osteoclast_kg.cypher`](./import_osteoclast_kg.cypher).
3. Copy and paste the contents into the Neo4j query editor and click **Run** (Play button).

---

### Step 3: Apply the Custom Styling (`style.grass`)

To apply the exact transparent fill + opaque border palette:
1. In Neo4j Browser, drag and drop [`neo4j/style.grass`](./style.grass) directly into the Neo4j Browser window.
2. Alternatively:
   - Type `:style` in the query box and press enter.
   - Click the **Graph Style Sheet** download/upload icon, or paste the styling rules from `style.grass`.

---

## 🔍 Sample Cypher Queries

Once loaded, try running these queries in Neo4j Browser:

### View Whole Signaling Subnetwork
```cypher
MATCH (n)-[r]->(m) 
RETURN n, r, m 
LIMIT 150;
```

### Trace RANKL / RANK / TRAF6 / NF-κB Pathway
```cypher
MATCH path = (rankl:Protein {node_id: "HGNC:TNFSF11"})-[*1..4]->(downstream:Node)
RETURN path;
```

### View Edges Confirmed by STRING v12.0 Physical PPI
```cypher
MATCH (s:Node)-[r]->(t:Node)
WHERE r.evidence_quote CONTAINS "STRING"
RETURN s, r, t;
```

### Inspect Master Regulators & Brakes
```cypher
MATCH (b:Node)-[r:INHIBITS]->(target:Node)
RETURN b.name AS Brake, target.name AS Target, r.evidence_quote AS Evidence;
```
