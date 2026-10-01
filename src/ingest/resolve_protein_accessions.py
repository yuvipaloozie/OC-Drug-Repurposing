"""Resolve unique reviewed UniProt gene/species records without changing graph identity."""
import argparse
import csv
import io
import json
from src.ingest.resolution_quality_pass import ROOT,OUT,RAW,cache,write_json
from src.ingest.ground_development_claims import taxon,normalize
from src.kg.integrate_pyk2_pilot import TABLES,csv_text,sha,apply_patch_file

def run(apply=False,offline=False):
    target=OUT/'protein_accession_patch.json'
    if not target.exists():
        before={t:(ROOT/'data/processed'/f'{t}.csv').read_bytes().decode('utf-8') for t in TABLES}
        rows=list(csv.DictReader(io.StringIO(before['nodes'])));fields=next(csv.reader(io.StringIO(before['nodes'])))
        candidates=[n for n in rows if n['type']=='protein' and taxon(n['taxon']) and n.get('symbol')]
        registry=[]
        for tid in sorted({taxon(n['taxon']) for n in candidates}):
            symbols=sorted({n['symbol'] for n in candidates if taxon(n['taxon'])==tid})
            for offset in range(0,len(symbols),30):
                group=symbols[offset:offset+30]
                query=f'(organism_id:{tid}) AND (reviewed:true) AND ('+' OR '.join('gene_exact:'+s for s in group)+')'
                name='uniprot_'+sha(query.encode())[:16]+'.json'
                body=cache(name,'https://rest.uniprot.org/uniprotkb/search',{'query':query,'format':'json','size':500},offline)
                if len(body.get('results',[]))>=500: raise ValueError('Paginate registry query before assigning identities')
                for entry in body.get('results',[]): registry.append((entry,name))
                print('UniProt batch',tid,offset,len(body.get('results',[])),flush=True)
        decisions=[]
        for node in candidates:
            matches={}
            for entry,name in registry:
                if entry.get('entryType')!='UniProtKB reviewed (Swiss-Prot)': continue
                if str(entry['organism']['taxonId'])!=taxon(node['taxon']): continue
                names=[g.get('geneName',{}).get('value','') for g in entry.get('genes',[])]
                if normalize(node['symbol']) not in {normalize(n) for n in names}: continue
                if ':NCBIGene:' in node['node_id']:
                    gid=node['node_id'].split(':')[-1]
                    if gid not in {x['id'] for x in entry.get('uniProtKBCrossReferences',[]) if x['database']=='GeneID'}: continue
                matches[entry['primaryAccession']]=(entry,name)
            decision={'node_id':node['node_id'],'symbol':node['symbol'],'taxon':node['taxon'],'candidates':sorted(matches),'status':'unresolved_or_ambiguous','previous_structure_candidates':node['structure_candidates']}
            if len(matches)==1:
                accession,(entry,name)=next(iter(matches.items()))
                old=json.loads(node['structure_candidates'] or '{}');new=dict(old)
                if old.get('uniprot_id')!=accession: new['pdb_structures']=[]
                meta=json.loads((RAW/name).with_suffix('.json.meta.json').read_text())
                new.update(uniprot_id=accession,uniprot_identity_status='unique_reviewed_registry_gene_species_match',registry_identity_source=(RAW/name).relative_to(ROOT).as_posix(),registry_identity_sha256=meta['sha256'])
                node['structure_candidates']=json.dumps(new,sort_keys=True)
                # Keep more specific prior reviewed status when present.
                if 'pending' in node['identity_status']: node['identity_status']='registry_gene_species_protein_accession_mapped'
                note=' UniProt v3: unique reviewed primary gene/species match; canonical sequence reference, not experimental isoform confirmation.'
                if note not in node['annotation_status']: node['annotation_status']+=note
                decision.update(status='unique_reviewed_registry_match',accession=accession,registry_source=new['registry_identity_source'],changed_previous_accession=bool(old.get('uniprot_id') and old['uniprot_id']!=accession),previous_accession=old.get('uniprot_id'))
            else:
                old=json.loads(node['structure_candidates'] or '{}')
                # Preserve originals in the audit; no guessed cross-species display fallback.
                node['structure_candidates']=json.dumps({'pdb_structures':[],'uniprot_identity_status':'unresolved_gene_species_match','identity_note':'Prior candidate accessions archived in protein_accession_decisions.json; no unique reviewed primary-gene/species mapping.'})
                decision['removed_unverified_candidates']=bool(old.get('uniprot_id') or old.get('pdb_structures'))
            decisions.append(decision)
        after={**before,'nodes':csv_text(rows,fields)}
        patch={'patch_id':'protein_accession_quality_v3','before':before,'after':after,'before_sha256':{t:sha(v.encode()) for t,v in before.items()},'after_sha256':{t:sha(v.encode()) for t,v in after.items()},'new_edge_ids':[]}
        write_json(target,patch);write_json(OUT/'protein_accession_decisions.json',decisions)
    if apply: print(apply_patch_file(target))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--apply',action='store_true');p.add_argument('--offline',action='store_true');a=p.parse_args();run(a.apply,a.offline)
