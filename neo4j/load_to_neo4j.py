#!/usr/bin/env python3
"""
Automated Osteoclast Knowledge Graph Loader for Neo4j Desktop / Server.
Uses native Python standard library (urllib.request, json) - no extra pip packages required.

Connects to Neo4j transactional HTTP endpoint:
  http://localhost:7474/db/neo4j/tx/commit
"""

import sys
import os
import json
import base64
import time
import argparse
from pathlib import Path
import urllib.request
import urllib.error

SCRIPT_DIR = Path(__file__).resolve().parent
CYPHER_FILE = SCRIPT_DIR / "import_osteoclast_kg.cypher"
DEFAULT_DBMSS_DIR = Path.home() / "Library" / "Application Support" / "neo4j-desktop" / "Application" / "Data" / "dbmss"

def parse_cypher_statements(cypher_text):
    """Quote-aware and comment-aware Cypher statement parser."""
    stmts, cur = [], []
    in_str, str_char, esc = False, None, False
    i = 0
    n = len(cypher_text)
    while i < n:
        ch = cypher_text[i]
        next_ch = cypher_text[i + 1] if i + 1 < n else ""

        if esc:
            cur.append(ch)
            esc = False
            i += 1
            continue

        if ch == "\\":
            cur.append(ch)
            esc = True
            i += 1
            continue

        if in_str:
            cur.append(ch)
            if ch == str_char:
                in_str = False
                str_char = None
            i += 1
            continue

        if ch in ('"', "'"):
            in_str = True
            str_char = ch
            cur.append(ch)
            i += 1
            continue

        # Skip line comments outside strings
        if ch == "/" and next_ch == "/":
            while i < n and cypher_text[i] != "\n":
                i += 1
            continue

        # Semicolon outside strings terminates a statement
        if ch == ';':
            s = "".join(cur).strip()
            if s:
                stmts.append(s)
            cur = []
            i += 1
            continue

        cur.append(ch)
        i += 1

    if cur:
        s = "".join(cur).strip()
        if s:
            stmts.append(s)
    return stmts

def run_cypher_tx(endpoint, auth_header, statements):
    """Executes a list of Cypher statements in a single transaction."""
    payload = {
        "statements": [{"statement": stmt} for stmt in statements]
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(endpoint, data=data, headers={
        "Content-Type": "application/json",
        "Accept": "application/json; charset=UTF-8",
        "Authorization": auth_header
    })

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            res = json.loads(body)
            errors = res.get("errors", [])
            if errors:
                return False, errors, res.get("results", [])
            return True, None, res.get("results", [])
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8") if e.fp else str(e)
        return False, [{"message": f"HTTP {e.code}: {err_msg}"}], []
    except Exception as e:
        return False, [{"message": str(e)}], []

def check_connection(host, port, user, password):
    url = f"http://{host}:{port}/db/neo4j/tx/commit"
    auth_str = f"{user}:{password}"
    auth_header = "Basic " + base64.b64encode(auth_str.encode("utf-8")).decode("ascii")
    
    test_stmt = ["RETURN 1 AS test"]
    ok, errors, _ = run_cypher_tx(url, auth_header, test_stmt)
    return ok, errors, url, auth_header

def inspect_desktop_dbmss():
    """Checks if Neo4j Desktop has created any DBMS directories on Mac."""
    if DEFAULT_DBMSS_DIR.exists():
        subdirs = [p for p in DEFAULT_DBMSS_DIR.iterdir() if p.is_dir() and p.name.startswith("dbms-")]
        return subdirs
    return []

def main():
    parser = argparse.ArgumentParser(description="Load Osteoclast Knowledge Graph into Neo4j")
    parser.add_argument("--host", default="localhost", help="Neo4j host (default: localhost)")
    parser.add_argument("--port", default=7474, type=int, help="Neo4j HTTP port (default: 7474)")
    parser.add_argument("--user", default="neo4j", help="Neo4j username (default: neo4j)")
    parser.add_argument("--password", default=None, help="Neo4j password")
    parser.add_argument("--wait", action="store_true", help="Wait and poll until Neo4j is running")
    parser.add_argument("--reset", action="store_true", help="Delete existing graph before loading")
    args = parser.parse_args()

    password = args.password
    if not password:
        password = os.environ.get("NEO4J_PASSWORD", "password")

    print("=================================================================")
    print("  Osteoclast Knowledge Graph -> Neo4j Desktop Loader")
    print("=================================================================")
    print(f"Target: http://{args.host}:{args.port}")
    print(f"User:   {args.user}")

    connected = False
    endpoint = None
    auth_header = None

    if args.wait:
        print("\nWaiting for Neo4j DBMS to start... (press Ctrl+C to abort)")
        while not connected:
            ok, errors, endpoint, auth_header = check_connection(args.host, args.port, args.user, password)
            if ok:
                connected = True
                print("Neo4j DBMS detected and authenticated successfully!")
                break
            time.sleep(2)
    else:
        ok, errors, endpoint, auth_header = check_connection(args.host, args.port, args.user, password)
        if ok:
            connected = True
        else:
            dbmss = inspect_desktop_dbmss()
            print(f"\n[Error] Unable to connect or authenticate to Neo4j at {args.host}:{args.port}:")
            for err in errors:
                print(f"  - {err.get('message', err)}")
            print("\n--- Neo4j Desktop Status & Troubleshooting ---")
            if not dbmss:
                print("  Status: No DBMS detected in Neo4j Desktop.")
                print("  Action: In the Neo4j Desktop window, click 'Add' > 'Local DBMS', set a password (e.g. 'password'), and click 'Start'.")
            else:
                dbms_names = [d.name for d in dbmss]
                print(f"  Status: Found {len(dbmss)} DBMS directory ({', '.join(dbms_names)}).")
                print("  Action: Click the 'Start' button on your DBMS in Neo4j Desktop so the green active indicator appears.")
            print("\n  Once started:")
            print("     python3 neo4j/load_to_neo4j.py --password YOUR_PASSWORD")
            print("  Or run with --wait to automatically load when Neo4j starts:")
            print("     python3 neo4j/load_to_neo4j.py --wait --password YOUR_PASSWORD")
            sys.exit(1)

    # Optional reset
    if args.reset:
        print("\nPurging existing graph (MATCH (n) DETACH DELETE n)...")
        ok, errors, _ = run_cypher_tx(endpoint, auth_header, ["MATCH (n) DETACH DELETE n"])
        if not ok:
            print(f"Error purging graph: {errors}")
            sys.exit(1)
        print("Existing graph cleared.")

    print(f"\nReading statements from {CYPHER_FILE.name}...")
    statements = parse_cypher_statements(CYPHER_FILE.read_text(encoding="utf-8"))
    print(f"Parsed {len(statements)} Cypher blocks (constraints, nodes, relationships).")

    print("\nExecuting import transactions...")
    start_time = time.time()
    for i, stmt in enumerate(statements, 1):
        preview = stmt.splitlines()[0][:70]
        print(f"  [{i}/{len(statements)}] {preview}...")
        ok, errors, _ = run_cypher_tx(endpoint, auth_header, [stmt])
        if not ok:
            print(f"\n[Error] Statement failed:")
            print(stmt[:300] + "...")
            for err in errors:
                print(f"  Error message: {err.get('message', err)}")
            sys.exit(1)

    elapsed = time.time() - start_time
    print(f"\nImport completed successfully in {elapsed:.2f} seconds!")

    # Verify counts
    print("\nVerifying Knowledge Graph contents in Neo4j...")
    verify_stmts = [
        "MATCH (n) RETURN count(n) AS node_count",
        "MATCH ()-[r]->() RETURN count(r) AS edge_count",
        "MATCH (n) RETURN n.type AS type, count(n) AS count ORDER BY count DESC",
        "MATCH ()-[r]->() RETURN type(r) AS rel, count(r) AS count ORDER BY count DESC"
    ]
    ok, errors, results = run_cypher_tx(endpoint, auth_header, verify_stmts)
    if ok and len(results) >= 4:
        total_nodes = results[0]["data"][0]["row"][0]
        total_edges = results[1]["data"][0]["row"][0]
        node_breakdown = results[2]["data"]
        edge_breakdown = results[3]["data"]

        print("-----------------------------------------------------------------")
        print(f" Total Nodes:         {total_nodes} (Target: 267 Biological Nodes)")
        print(f" Total Relationships: {total_edges} (Target: 350 Biological Edges)")
        print("-----------------------------------------------------------------")
        print(" Node Subtypes:")
        for row in node_breakdown:
            stype, scnt = row["row"][0], row["row"][1]
            print(f"   - {stype:<25}: {scnt:>3}")
        print(" Relationship Types:")
        for row in edge_breakdown:
            rel, rcnt = row["row"][0], row["row"][1]
            print(f"   - {rel:<25}: {rcnt:>3}")
        print("-----------------------------------------------------------------")
        print("\nSUCCESS! Knowledge graph is fully live in Neo4j Desktop.")
        print("Open Neo4j Browser and run: MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100")
        print("To apply colors, drag 'neo4j/style.grass' into Neo4j Browser.")

if __name__ == "__main__":
    main()
