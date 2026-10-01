"""Generate display conformers from exact ChEBI accession structures.

Install requirements-structures.txt; run python -m src.enrichment.build_compound_structures.
Use --offline for cached registry responses. Does not validate KG biological claims.
"""
import argparse
import csv
import hashlib
import json
import math
import re
import html
import time
from datetime import datetime, timezone
from pathlib import Path
import requests
from rdkit import Chem, rdBase
from rdkit.Chem import AllChem

ROOT = Path(__file__).resolve().parents[2]
SEED = 20260930
IDENTITY_CONFLICTS = {
    'CHEBI:32838': 'KG cis-aconitate label conflicts with registry L-seryl group',
    'CHEBI:30805': 'KG itaconate label conflicts with registry dodecanoic acid',
    'CHEBI:17544': 'KG hydronium/H+ label conflicts with registry hydrogencarbonate',
    'CHEBI:15554': 'KG PGE2 label conflicts with registry prostaglandin H2',
}

def sha(body):
    return hashlib.sha256(body).hexdigest()

def generate(smiles):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError('Invalid registry SMILES')
    if any(a.GetAtomicNum() == 0 for a in mol.GetAtoms()):
        raise ValueError('Generic chemical group has no unique molecular structure')
    if len(Chem.GetMolFrags(mol)) != 1:
        raise ValueError('Disconnected fragments: no unique relative geometry')
    if any(str(x.specified) == 'Unspecified' for x in Chem.FindPotentialStereo(mol)):
        raise ValueError('Registry structure leaves stereochemistry unspecified')
    mol = Chem.AddHs(mol)
    if mol.GetNumAtoms() == 1:
        conf = Chem.Conformer(1);conf.Set3D(True);conf.SetAtomPosition(0, (0, 0, 0));mol.AddConformer(conf)
        method = 'Single atom at origin; no molecular conformation'
    else:
        params = AllChem.ETKDGv3();params.randomSeed = SEED;params.numThreads = 1
        if AllChem.EmbedMolecule(mol, params) != 0:
            raise ValueError('ETKDG embedding failed')
        method = 'ETKDGv3'
        if AllChem.MMFFHasAllMoleculeParams(mol):
            code = AllChem.MMFFOptimizeMolecule(mol, maxIters=1000)
            method += ' + MMFF94' + (' (iteration limit reached)' if code else '')
        elif AllChem.UFFHasAllMoleculeParams(mol):
            code = AllChem.UFFOptimizeMolecule(mol, maxIters=1000)
            method += ' + UFF' + (' (iteration limit reached)' if code else '')
    conf = mol.GetConformer()
    if not conf.Is3D() or not all(math.isfinite(v) for pos in conf.GetPositions() for v in pos):
        raise ValueError('Invalid 3D coordinates')
    return mol, method

def run(offline=False):
    raw = ROOT/'data/raw/provenance/compound_structures';raw.mkdir(parents=True, exist_ok=True)
    dest = ROOT/'assets/structures';dest.mkdir(parents=True, exist_ok=True)
    path = ROOT/'data/processed/nodes.csv'
    with path.open(encoding='utf-8', newline='') as f:
        reader=csv.DictReader(f);fields=reader.fieldnames;nodes=list(reader)
    records=[]
    session=requests.Session()
    for node in nodes:
        if 'compound' not in node['type']:
            continue
        nid=node['node_id'];number=nid.removeprefix('CHEBI:')
        record={'node_id':nid,'kg_name':node['name'],'status':'unavailable'}
        candidates=json.loads(node['structure_candidates'] or '{}')
        candidates.pop('small_molecule', None)
        try:
            if not number.isdigit():
                raise ValueError('No exact ChEBI identifier')
            cache=raw/(number+'.json');meta=raw/(number+'.meta.json')
            url=f'https://www.ebi.ac.uk/chebi/backend/api/public/compound/{number}/'
            if not cache.exists():
                if offline:
                    raise ValueError('Missing offline registry response')
                response=session.get(url,timeout=45);response.raise_for_status();response.json()
                cache.write_bytes(response.content)
                meta.write_text(json.dumps({'url':url,'retrieved_at':datetime.now(timezone.utc).isoformat(),'sha256':sha(response.content)},indent=2)+'\n')
                time.sleep(.4)
            provenance=json.loads(meta.read_text())
            if sha(cache.read_bytes())!=provenance['sha256']:
                raise ValueError('Registry cache checksum mismatch')
            registry=json.loads(cache.read_text(encoding='utf-8'))
            if registry['chebi_accession']!=nid and nid not in registry.get('secondary_ids',[]):
                raise ValueError('Registry returned a different accession')
            registry['name']=html.unescape(re.sub('<[^>]+>', '', registry['name']))
            structure=registry.get('default_structure') or {}
            record.update(registry_name=registry['name'],source_url=url,raw_sha256=provenance['sha256'])
            if nid in IDENTITY_CONFLICTS:
                raise ValueError(IDENTITY_CONFLICTS[nid] + '; identity repair required before display')
            smiles=structure.get('smiles')
            if not smiles or structure.get('is_r_group'):
                raise ValueError('Registry has no specific molecular structure')
            mol,method=generate(smiles)
            mol.SetProp('_Name',registry['name'])
            mol.SetProp('CHEBI_ID',nid);mol.SetProp('METHOD',method)
            sdf=dest/('chebi_'+number+'.sdf')
            # Stable header; coordinates depend on recorded RDKit version and seed.
            block=Chem.MolToMolBlock(mol).splitlines();block[1]='     RDKit          3D'
            sdf.write_text('\n'.join(block)+'\n$$$$\n',encoding='utf-8')
            note='Exact accession structure; computed display geometry, not experimental coordinates or a physiological protonation assignment.'
            if node['name'].casefold()!=registry['name'].casefold():
                note+=' Registry name differs from the KG label; use the displayed registry identity. KG naming and biological-pool mapping remain unverified.'
            entry={'registry_id':registry['chebi_accession'],'registry_name':registry['name'],
                   'source_url':f'https://www.ebi.ac.uk/chebi/{registry["chebi_accession"]}',
                   'smiles':smiles,'inchikey':structure.get('standard_inchi_key'),
                   'formal_charge':Chem.GetFormalCharge(mol),'formula':registry.get('chemical_data',{}).get('formula'),
                   'sdf_url':sdf.relative_to(ROOT).as_posix(),'sdf_sha256':sha(sdf.read_bytes()),
                   'method':method,'rdkit_version':rdBase.rdkitVersion,'random_seed':SEED,
                   'atom_count':mol.GetNumAtoms(),'source_sha256':provenance['sha256'],
                   'mapping_status':'exact_accession_structure_kg_interpretation_unverified','note':note}
            candidates['small_molecule']=entry
            candidates.pop('small_molecule_unavailable',None)
            record.update(status='generated',**entry)
        except (ValueError,requests.RequestException,KeyError) as exc:
            record['reason']=str(exc)
            candidates['small_molecule_unavailable']=str(exc)
        node['structure_candidates']=json.dumps(candidates,separators=(',',':'),ensure_ascii=False)
        records.append(record)
        print(nid,record['status'],record.get('registry_name',''),record.get('reason',''),flush=True)
    with path.open('w',encoding='utf-8',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=fields,lineterminator='\n');writer.writeheader();writer.writerows(nodes)
    report={'rdkit_version':rdBase.rdkitVersion,'random_seed':SEED,'records':records,
            'generated':sum(r['status']=='generated' for r in records),'total_compounds':len(records)}
    (ROOT/'reports/COMPOUND_STRUCTURES.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    return report

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--offline',action='store_true')
    result=run(parser.parse_args().offline);print(f"Generated {result['generated']}/{result['total_compounds']}")
