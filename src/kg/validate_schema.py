"""Structural validation and evidence-readiness reporting, not biological certification."""
import csv,json,re,sys
from pathlib import Path
from collections import Counter
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from schemas.models import NodeType,EdgeRelation,EdgeStatus,EvidenceKind,EvidencePolarity

def run_verification(data_dir):
    root=Path(data_dir);errors=[];warnings=[];tables={}
    for name,key in [('nodes','node_id'),('edges','edge_id'),('contexts','context_id'),('experiments','experiment_id'),('edge_evidence','evidence_id'),('source_records','source_id')]:
        try:
            with (root/f'{name}.csv').open(encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f))
        except (OSError,csv.Error) as e:errors.append(str(e));rows=[]
        ids=[r.get(key) for r in rows]
        if any(not id for id in ids) or len(ids)!=len(set(ids)):errors.append(f'{name}: missing or duplicate primary keys')
        tables[name]={r.get(key):r for r in rows}
    def enum(value,typ,where):
        if value not in {x.value for x in typ}:errors.append(f'{where}: invalid {typ.__name__}: {value}')
    for n in tables['nodes'].values():
        enum(n['type'],NodeType,n['node_id'])
        if n['type']=='rna' and n.get('rna_type') not in {'mrna','mirna','lncrna','other'}:errors.append(f"RNA subtype missing: {n['node_id']}")
        if n.get('roles') and n['type']!='protein':errors.append('Protein roles on non-protein '+n['node_id'])
        if n['type']=='gene' and any(w in n['name'].lower() for w in ['messenger rna','microrna','non-coding rna']):errors.append('RNA mislabeled as gene '+n['node_id'])
    for e in tables['edges'].values():
        for source_id in e['source_record_id'].split(';'):
            if source_id.strip() and source_id.strip() not in tables['source_records']:errors.append('Unresolved edge source record '+e['edge_id'])
        enum(e['relation'],EdgeRelation,e['edge_id']);enum(e['status'],EdgeStatus,e['edge_id'])
        if str(e['sign']) not in {'-1','0','1'}:errors.append('Invalid sign '+e['edge_id'])
        for k in ['source_id','target_id']:
            if e[k] not in tables['nodes']:errors.append(f'{e["edge_id"]}: missing {k} {e[k]}')
        if e['context_id'] and e['context_id'] not in tables['contexts']:errors.append('Missing context '+e['edge_id'])
        if e['relation']=='TRANSLATED_TO' and e['source_id'] in tables['nodes'] and e['target_id'] in tables['nodes']:
            a,b=tables['nodes'][e['source_id']],tables['nodes'][e['target_id']]
            if a['type']!='rna' or a.get('rna_type')!='mrna' or b['type']!='protein':errors.append('Invalid translation endpoints '+e['edge_id'])
    for ev in tables['edge_evidence'].values():
        for field,table in [('edge_id','edges'),('experiment_id','experiments'),('source_id','source_records')]:
            if (ev[field] or field=='edge_id') and ev[field] not in tables[table]:errors.append(f'{ev["evidence_id"]}: unresolved {field}')
        enum(ev['evidence_kind'],EvidenceKind,ev['evidence_id']);enum(ev['polarity'],EvidencePolarity,ev['evidence_id'])
        if ev['curator_status'] not in {'pending','quarantined','reviewed','automated_extraction'}:errors.append('Invalid curation status '+ev['evidence_id'])
        if ev['curator_status']=='reviewed':
            source=tables['source_records'].get(ev['source_id'],{})
            if source.get('resolution_status')!='resolved' or source.get('claim_match_status')=='citation_topic_mismatch':errors.append('Reviewed evidence with unresolved/mismatched source '+ev['evidence_id'])
            for field in ['quote_or_location','source_id','source_location','source_url','source_sha256','reviewed_at']:
                if not ev[field]:errors.append(f'Reviewed evidence missing {field}: {ev["evidence_id"]}')
            if ev['passage_status'] not in {'source_checked_paraphrase','source_checked_quote'}:errors.append('Unverified reviewed passage '+ev['evidence_id'])
            if not re.fullmatch('[a-f0-9]{64}',ev['source_sha256']):errors.append('Invalid source hash '+ev['evidence_id'])
    for exp in tables['experiments'].values():
        if exp['paper_id'] not in tables['source_records']:errors.append('Experiment missing source record '+exp['experiment_id'])
    pending=sum(v['curator_status']!='reviewed' for v in tables['edge_evidence'].values())
    warnings.append(f'{pending} evidence records require review or are quarantined; registry existence is not claim validation.')
    return {'status':'PASS' if not errors else 'FAIL','scope':'structural_only','errors':errors,'warnings':warnings,
            'counts':{k:len(v) for k,v in tables.items()},'evidence_statuses':dict(Counter(v['curator_status'] for v in tables['edge_evidence'].values()))}

def main():
    result=run_verification(Path(__file__).resolve().parents[2]/'data/processed');print(json.dumps(result,indent=2));sys.exit(bool(result['errors']))
if __name__=='__main__':main()
