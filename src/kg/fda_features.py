"""Build reversible structure groups and exact/orthology KG coverage features.

Requires requirements-structures.txt. Does not train a model or change the graph.
"""
import csv
import json
from collections import defaultdict,Counter
from pathlib import Path
from rdkit import Chem,rdBase
from rdkit.Chem import Descriptors,rdMolDescriptors
from rdkit.Chem import rdFingerprintGenerator
from rdkit.Chem.Scaffolds import MurckoScaffold
from rdkit.Chem.MolStandardize import rdMolStandardize
from src.ingest.fda_resolution import ROOT,OUT,RAW,read_csv,write_csv,digest,pages
from src.kg.drug_targets import load_graph,TABLES


def structure_features(smiles):
    blank={'structure_status':'missing','model_smiles':'','parent_inchikey':'','scaffold_group':'','fragment_count':'','molecular_weight':'','unspecified_stereocenters':'','structure_note':''}
    if not smiles:return blank
    mol=Chem.MolFromSmiles(smiles)
    if mol is None:return {**blank,'structure_status':'invalid'}
    fragments=Chem.GetMolFrags(mol,asMols=True)
    organic=[f for f in fragments if any(a.GetAtomicNum()==6 for a in f.GetAtoms())]
    # Two sizable carbon-containing components may be a mixture or organic counterion.
    # Keep original input; never silently choose one as the active ingredient.
    if sum(f.GetNumHeavyAtoms()>=8 for f in organic)>1:
        return {**blank,'structure_status':'multiple_substantial_components_review','fragment_count':len(fragments)}
    if not organic:return {**blank,'structure_status':'inorganic_outside_initial_model','fragment_count':len(fragments)}
    parent=rdMolStandardize.FragmentParent(mol)
    parent=rdMolStandardize.Uncharger().uncharge(parent)
    Chem.SanitizeMol(parent)
    sm=Chem.MolToSmiles(parent,isomericSmiles=True);mw=Descriptors.MolWt(parent)
    key=Chem.MolToInchiKey(parent);scaffold=MurckoScaffold.MurckoScaffoldSmiles(mol=parent,includeChirality=False)
    return {'structure_status':'eligible_small_molecule' if mw<=1200 and not any(a.GetAtomicNum()==0 for a in parent.GetAtoms()) else 'outside_initial_size_or_specificity_domain',
            'model_smiles':sm,'parent_inchikey':key,'scaffold_group':scaffold or 'ACYCLIC:'+key.split('-')[0],
            'fragment_count':len(fragments),'molecular_weight':mw,'unspecified_stereocenters':sum(v=='?' for _,v in Chem.FindMolChiralCenters(parent,includeUnassigned=True)),
            'structure_note':'Original registry structure retained separately; RDKit FragmentParent and Uncharger are explicit modeling transformations, not FDA active-moiety adjudication. Unspecified stereochemistry remains unspecified.'}


def orthology_nodes(graph, raw=RAW):
    p=raw/'HOM_MouseHumanSequence.rpt';meta=json.loads((raw/'HOM_MouseHumanSequence.meta.json').read_text(encoding='utf-8'))
    if digest(p.read_bytes())!=meta['sha256']:raise ValueError('MGI checksum mismatch')
    with p.open(encoding='utf-8') as f:rows=list(csv.DictReader(f,delimiter='\t'))
    groups=defaultdict(list)
    for r in rows:groups[r['DB Class Key']].append(r)
    mouse={json.loads(n.get('structure_candidates') or '{}').get('uniprot_id'):nid for nid,n in graph.nodes.items() if n['type']=='protein' and n['taxon']=='mouse'}
    mapping=defaultdict(set);provenance=[]
    for group,rr in groups.items():
        humans=[r for r in rr if r['NCBI Taxon ID']=='9606'];mice=[r for r in rr if r['NCBI Taxon ID']=='10090']
        # Unique gene on each side, not a guessed symbol equivalence or paralog projection.
        if len({r['EntrezGene ID'] for r in humans})!=1 or len({r['EntrezGene ID'] for r in mice})!=1:continue
        for h in humans:
            for m in mice:
                for ma in m['SWISS_PROT IDs'].split(','):
                    nid=mouse.get(ma.strip())
                    if not nid:continue
                    for ha in h['SWISS_PROT IDs'].split(','):
                        if not ha.strip():continue
                        mapping[ha.strip()].add(nid)
                        provenance.append({'human_accession':ha.strip(),'mouse_accession':ma.strip(),'kg_node_id':nid,'mgi_homology_class':group,'human_gene_id':h['EntrezGene ID'],'mouse_gene_id':m['EntrezGene ID'],'mapping':'unique_human_mouse_gene_homology_class','raw_sha256':meta['sha256'],'source_url':meta['url'],'assumption':'Gene homology does not establish conserved drug potency or identical phenotype.'})
    return mapping,provenance


def run():
    identities=read_csv(OUT/'identities.csv');targets=read_csv(OUT/'drug_targets.csv');g=load_graph()
    mols,_=pages('https://www.ebi.ac.uk/chembl/api/data/molecule.json?max_phase=4&limit=1000','molecules',False)
    parents={m['molecule_chembl_id']:m for m in mols}
    ortho,prov=orthology_nodes(g);write_csv(OUT/'orthology_mappings.csv',prov)
    # All evaluation-source aliases are removed before graph feature generation.
    label_file=ROOT/'data/evaluation/drug_pilot_v1/observations.csv';held=set()
    if label_file.exists():
        for r in read_csv(label_file):held.update(x for x in [r['source_id'],r.get('pmcid'),('DOI:'+r['doi']) if r.get('doi') else ''] if x)
    for sid,s in g.source_records.items():
        if 'PMID:'+s.get('pmid','') in held or s.get('pmcid') in held or 'DOI:'+s.get('doi','') in held:held.add(sid)
    g=g.filter_subgraph_by_leakage(held,set())
    bydrug=defaultdict(list)
    for t in targets:bydrug[t['ingredient_id']].append(t)
    endpoints=['PATHWAY:OSTEOCLAST_DIFFERENTIATION','PATHWAY:BONE_RESORPTION'];pathcache={};features=[]
    action_sign={'INHIBITOR':-1,'ANTAGONIST':-1,'INVERSE AGONIST':-1,'AGONIST':1,'ACTIVATOR':1,'POSITIVE ALLOSTERIC MODULATOR':1,'NEGATIVE ALLOSTERIC MODULATOR':-1}
    mappings=[]
    for d in identities:
        # The exact PubChem salt remains in identities.csv. A registry-provided
        # parent permits salt/active-moiety modeling without string stripping.
        parent=parents.get(d['chembl_parent_id'],{})
        parent_smiles=(parent.get('molecule_structures') or {}).get('canonical_smiles')
        model_input=parent_smiles or d['smiles']
        try:chemistry=structure_features(model_input)
        except (ValueError,RuntimeError) as exc:
            chemistry={**structure_features(''),'structure_status':'standardization_error','structure_note':str(exc)}
        feat={'ingredient_id':d['ingredient_id'],'ingredient_name':d['ingredient_name'],'inventory_status':d['inventory_status'],
              'structure_input_basis':'chembl_registry_parent' if parent_smiles else 'pubchem_registry_structure',
              'identity_mapping_basis':d['chembl_mapping_basis'],**chemistry}
        rr=bydrug[d['ingredient_id']]
        for mode in ['exact','orthology_scenario']:
            matched=set();signed=set();support=set();oppose=set()
            for t in rr:
                # Mechanism references to held-out outcome papers cannot become features.
                refs=json.loads(t['mechanism_refs'])
                if any('PMID:'+str(x.get('ref_id')) in held for x in refs if x.get('ref_type')=='PubMed'):continue
                nodes=set(filter(None,t['kg_node_ids'].split('|')))
                if mode=='orthology_scenario' and t['target_taxon']=='human' and t['target_type']=='SINGLE PROTEIN':nodes |= ortho.get(t['target_accession'],set())
                matched|=nodes
                sign=action_sign.get(t['action_type'],0) if str(t['direct_interaction'])=='1' else 0
                for node in nodes:
                    if mode=='orthology_scenario' and node not in t['kg_node_ids'].split('|'):
                        mappings.append({'ingredient_id':d['ingredient_id'],'mechanism_id':t['mechanism_id'],'human_target_accession':t['target_accession'],'mouse_target_node':node,'status':'orthology_scenario_not_measured_binding'})
                    for endpoint in endpoints:
                        k=(node,endpoint)
                        if k not in pathcache:pathcache[k]=g.find_mechanism_paths(node,endpoint,max_depth=4,max_paths=1000,target_context={'species':g.nodes[node]['taxon']})
                        for path in pathcache[k]:
                            if not sign or not path['net_sign'] or path.get('context_applicability')=='incompatible':continue
                            token=(node,endpoint,tuple(path['edges']))
                            signed.add(token)
                            (support if sign*path['net_sign']<0 else oppose).add(token)
            feat.update({mode+'_target_count':len(matched),mode+'_signed_paths':len(signed),mode+'_supporting_paths':len(support),mode+'_opposing_paths':len(oppose),mode+'_coverage_missing':int(not matched)})
        feat['target_mechanisms_missing']=int(not rr);features.append(feat)
    write_csv(OUT/'features.csv',features)
    import numpy as np
    generator=rdFingerprintGenerator.GetMorganGenerator(radius=2,fpSize=2048,includeChirality=True)
    eligible=[r for r in features if r['structure_status']=='eligible_small_molecule']
    bits=np.asarray([generator.GetFingerprintAsNumPy(Chem.MolFromSmiles(r['model_smiles'])) for r in eligible],dtype=np.uint8)
    # Packed bits are deterministic and compact; identities are saved separately.
    (OUT/'morgan_r2_2048.bits').write_bytes(np.packbits(bits,axis=1).tobytes())
    (OUT/'morgan_r2_2048.json').write_text(json.dumps({'ingredient_ids':[r['ingredient_id'] for r in eligible],
        'rows':len(eligible),'bits_per_row':2048,'packed_bytes_per_row':256,'bitorder':'big','radius':2,'include_chirality':True,
        'rdkit_version':rdBase.rdkitVersion,'binary_sha256':digest((OUT/'morgan_r2_2048.bits').read_bytes())},indent=2)+'\n',encoding='utf-8')
    if mappings:write_csv(OUT/'orthology_drug_scenarios.csv',mappings)
    summary={'rdkit_version':rdBase.rdkitVersion,'ingredients':len(features),'structure_status':dict(Counter(r['structure_status'] for r in features)),
             'exact_target_covered':sum(r['exact_target_count']>0 for r in features),'orthology_scenario_target_covered':sum(r['orthology_scenario_target_count']>0 for r in features),
             'exact_signed_endpoint_covered':sum(r['exact_signed_paths']>0 for r in features),'orthology_signed_endpoint_covered':sum(r['orthology_scenario_signed_paths']>0 for r in features),
             'marketed_ingredients':sum(r['inventory_status']=='marketed_product_present' for r in features),
             'marketed_eligible_structures':sum(r['inventory_status']=='marketed_product_present' and r['structure_status']=='eligible_small_molecule' for r in features),
             'marketed_orthology_target_covered':sum(r['inventory_status']=='marketed_product_present' and r['orthology_scenario_target_count']>0 for r in features),
             'held_out_sources':sorted(held),'interpretation':'Coverage/features, not calibrated probabilities or predictions. Orthology is a qualified transfer scenario. Unknown coverage is not inactivity.',
             'canonical_input_sha256':{t:digest((ROOT/f'data/processed/{t}.csv').read_bytes()) for t in TABLES},'files':{p.name:digest(p.read_bytes()) for p in OUT.glob('*.csv')}}
    (OUT/'feature_summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8');print(json.dumps(summary,indent=2))


if __name__=='__main__':run()
