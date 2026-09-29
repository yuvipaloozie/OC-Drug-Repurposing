"""
Fetch high-confidence Protein-Protein Interactions (PPI) from STRING v12.0
for mouse osteoclastogenesis proteins (NCBI Taxon ID: 10090).
"""

import os
import csv
import json
import urllib.request
import urllib.parse
import time


def fetch_string_ppi():
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    nodes_file = os.path.join(project_root, "data", "processed", "nodes.csv")
    output_dir = os.path.join(project_root, "data", "raw")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "string_mouse_ppi_high_confidence.json")

    with open(nodes_file, "r", encoding="utf-8") as f:
        nodes = list(csv.DictReader(f))

    # Extract all protein symbols
    protein_nodes = [n for n in nodes if n["type"] == "protein"]
    symbols = set()
    for p in protein_nodes:
        nid = p["node_id"]
        if nid.startswith("HGNC:"):
            symbols.add(nid.replace("HGNC:", ""))
        else:
            # check aliases
            aliases = p.get("aliases", "").split("|")
            for a in aliases:
                a_clean = a.strip()
                if a_clean and len(a_clean) <= 12 and not a_clean.startswith("CHEBI") and not a_clean.startswith("CHEMBL"):
                    symbols.add(a_clean)
            if p["name"] and len(p["name"].split()) == 1:
                symbols.add(p["name"])

    # Core key osteoclast markers to ensure present in query
    key_markers = [
        "Tnfsf11", "Tnfrsf11a", "Tnfrsf11b", "Traf6", "Traf3", "Traf2", "Chuk", "Ikbkb", "Ikbkg", "Nfkb1", "Rela", "Nfkb2", "Relb",
        "Map3k14", "Map3k7", "Tab1", "Tab2", "Mapk14", "Mapk8", "Mapk1", "Mapk3", "Fos", "Jun", "Nfatc1", "Spi1", "Mitf", "Creb1",
        "Ppp3ca", "Calm1", "Camk4", "Tyrobp", "Fcer1g", "Oscar", "Trem2", "Syk", "Plcg2", "Btk", "Tec", "Ctsk", "Acp5", "Dcstamp",
        "Ocstamp", "Atp6v0d2", "Tcirg1", "Clcn7", "Src", "Ptk2b", "Vav3", "Rac1", "Cdc42", "Rhoa", "Itgav", "Itgb3", "Hk2", "Pkm",
        "Gls", "Phgdh", "Got1", "Mdh1", "Mdh2", "Cs", "Idh1", "Idh2", "Sdha", "Fh", "Arap1", "Cyld", "Sqstm1", "Fhl2", "Gab2"
    ]
    symbols.update(key_markers)

    sorted_symbols = sorted(list(symbols))
    print(f"Total symbols to query from STRING: {len(sorted_symbols)}")

    # STRING API endpoint for network
    api_url = "https://string-db.org/api/json/network"

    # We query in batches or single POST
    params = {
        "identifiers": "\r".join(sorted_symbols),
        "species": 10090,  # Mus musculus
        "required_score": 700,  # High confidence threshold (>= 0.700)
        "caller_identity": "osteoclast_knowledge_graph"
    }

    data = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(api_url, data=data, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

    print("Connecting to STRING API v12.0 for species 10090 (Mus musculus)...")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            interactions = json.loads(content)
            print(f"Successfully retrieved {len(interactions)} high-confidence PPI records from STRING!")

            with open(output_file, "w", encoding="utf-8") as out_f:
                json.dump(interactions, out_f, indent=2)
            print(f"Saved raw STRING PPI data to: {output_file}")
            return interactions
    except Exception as e:
        print(f"Error connecting to STRING API: {e}")
        return None


if __name__ == "__main__":
    fetch_string_ppi()
