"""Project registry-grounded, source-anchored claims into a reversible proposed graph patch.

No expert-review status is assigned. Unresolved claims remain in a reason-coded queue.
"""
import argparse
from collections import Counter
import csv
import hashlib
import io
import json
from pathlib import Path
import re
import tempfile

from src.ingest.ground_development_claims import normalize, taxon, perturbation_projection
from src.kg.integrate_pyk2_pilot import TABLES, csv_text, sha, apply_patch_file
from src.kg.validate_schema import run_verification

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = 'data/staging/full_integration_v1'
SPECIES = {'10090':'mouse','9606':'human','10116':'rat'}
# Explicit process equivalences only. Formation is deliberately a separate node.
ENDPOINTS = {
    'osteoclastogenesis':'PATHWAY:OSTEOCLAST_DIFFERENTIATION',
    'osteoclastdifferentiation':'PATHWAY:OSTEOCLAST_DIFFERENTIATION',
    'boneresorption':'PATHWAY:BONE_RESORPTION',
    'osteoclasticboneresorption':'PATHWAY:BONE_RESORPTION',
    'osteoclastboneresorption':'PATHWAY:BONE_RESORPTION',
    'actinringformation':'PATHWAY:F_ACTIN_SEALING_ZONE',
    'factinringformation':'PATHWAY:F_ACTIN_SEALING_ZONE',
    'osteoclastformation':'LOCAL:process:osteoclast_formation',
    'osteoclastfusion':'LOCAL:process:osteoclast_fusion',
    'osteoclastactivity':'LOCAL:process:osteoclast_activity',
}
REVIEW_DEFERRALS = {
    'extracted:5241588967b3ba197da9a2be':'Melanoma cell result; osteoclast mention elsewhere does not establish osteoclast context.',
    'extracted:95c3f1a2f777e4d8f4e70b07':'NF-kappaB and inhibitory I-kappaB endpoint directions require separate interpretation.',
}


def stable(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:24]


def species_supported(tid, packet):
    text = ' '.join(p['text'] for p in packet['passages']).lower()
    patterns={'10090':r'\b(mouse|mice|murine|mus musculus)\b', '9606':r'\b(human|humans|homo sapiens)\b', '10116':r'\b(rat|rats|rattus norvegicus)\b'}
    return bool(tid in patterns and re.search(patterns[tid],text))


def resolve(entity, grounded, packet, nodes):
    form=entity['molecular_form']
    if form in ('phenotype','pathway'):
        nid=ENDPOINTS.get(normalize(entity['surface']))
        if not nid:
            return None,None,'process_not_in_explicit_mapping'
        if nid in nodes:
            return nid,None,'explicit_process_mapping'
        return nid,{'node_id':nid,'type':'pathway','name':entity['surface'],'taxon':'all','identity_status':'local_process_definition', 'annotation_status':'Local process label; formation, fusion and activity are separate endpoints, not asserted ontology accessions.', 'structure_candidates':'{}'},'local_process_definition'
    if form not in ('gene','protein','RNA'):
        return None,None,'compound_complex_or_other_identity_requires_separate_resolution'
    matches=grounded['registry_candidates']
    tid=grounded.get('specimen_taxon_candidate')
    if normalize(entity.get('taxon')) not in ('','null','unknown','notstated') and taxon(entity['taxon']) is None:
        return None,None,'explicit_taxon_unsupported_do_not_substitute_host'
    if len(matches)!=1 or not tid or not species_supported(tid,packet):
        return None,None,'registry_or_specimen_identity_unresolved'
    if 'molecular_form_conflict_with_model_node_hint' in grounded['flags']:
        return None,None,'molecular_form_conflict_requires_review'
    registry=matches[0]
    candidates=grounded['canonical_candidates']
    if len(candidates)>1:
        return None,None,'ambiguous_canonical_identity'
    nid=candidates[0] if candidates else f"LOCAL:{form.lower()}:NCBIGene:{registry['gene_id']}"
    if nid in nodes:
        return nid,None,'registry_alias_existing_entity'
    node={'node_id':nid,'type':form.lower(),'name':registry['symbol']+(' protein' if form=='protein' else ' gene' if form=='gene' else ' RNA'), 'symbol':registry['symbol'],'taxon':SPECIES[tid], 'aliases':entity['surface'], 'identity_status':'registry_gene_locus_mapped_protein_accession_pending' if form=='protein' else 'registry_gene_locus_mapped', 'structure_candidates':'{}', 'annotation_status':'Automated exact registry alias and explicit species match. Molecular form is extracted and unreviewed. Registry provenance is in full_integration_v1/entity_decisions.jsonl.'}
    if form=='RNA':
        surface=entity['surface'].lower()
        node['rna_type']='mirna' if 'mir-' in surface or 'microrna' in surface else 'lncrna' if 'lncrna' in surface or 'lincrna' in surface else 'mrna' if 'mrna' in surface else 'other'
        node['identity_status']='registry_gene_locus_mapped_transcript_accession_pending'
    return nid,node,'registry_alias_new_entity'


def project(claim):
    if claim['assertion']!='observed_result':
        return None,'non_observed_assertion_retained_in_staging'
    reg=claim.get('regulatory')
    if not reg:
        return None,'reaction_participants_require_chemical_grounding'
    entities={e['key']:e for e in claim['entities']}
    subject=entities.get(reg['subject'],{})
    obj=entities.get(reg['object'],{})
    endpoint=normalize(claim['experiment'].get('endpoint'))
    # The intervention/condition is not necessarily the measured target.
    if obj.get('molecular_form') in ('gene','protein','RNA') and endpoint and normalize(obj.get('surface')) not in endpoint and reg['effect_level']!='binding':
        return None,'measured_endpoint_does_not_explicitly_identify_target'
    if claim['kind']=='association':
        return ('ASSOCIATED_WITH',0,'reported_association'),'projected'
    sign={'positive':1,'negative':-1}.get(reg['sign'],0)
    basis='reported_regulation'
    genetic=claim['experiment']['perturbation_type'] in ('loss_of_function','gain_of_function')
    if reg['interpretation']=='inferred_from_perturbation' or claim['kind']=='perturbation_effect' or genetic:
        role=perturbation_projection({**claim,'kind':'perturbation_effect'})
        if role['normal_role_sign_candidate'] is None:
            return None,'perturbation_role_unresolved'
        sign=role['normal_role_sign_candidate']
        basis='genetic_perturbation_role_inference'
        intervention=claim['experiment'].get('intervention') or ''
        if claim['experiment']['perturbation_type']=='gain_of_function' and not re.search(r'overexpress|transgen|transfect|mimic|construct|ectopic',intervention,re.I):
            basis='reported_molecular_addition_effect'
    if subject.get('molecular_form')=='gene':
        quote=' '.join(e['quote'] for e in claim['evidence']).lower()
        if not re.search(r'knock|delet|deficien|silenc|transgen|overexpress|antisense|mutation|mutant|null|\(-/-\)|-/-',quote):
            return None,'gene_versus_protein_intervention_requires_review'
    if reg['effect_level']=='activity' and 'phosphoryl' in endpoint:
        return ('REGULATES',0,'phosphorylation_change_activity_sign_unresolved'),'projected'
    if not sign or reg['direction']!='subject_to_object':
        return None,'causal_direction_unresolved'
    return ('REGULATES',sign,basis),'projected'


def prepare(root=ROOT, *, output=OUTPUT, records_path='data/staging/full_enrichment_v2/claims.jsonl', packets_path='data/staging/full_enrichment_prepared_v2/requests.jsonl', grounding_path='data/staging/full_grounding_v1/grounded_claims.jsonl', resolver=resolve, projector=project):
    out=root/output
    out.mkdir(parents=True,exist_ok=True)
    target=out/'patch.json'
    if target.exists():
        return target
    packets={p['request_id']:p for p in map(json.loads,(root/packets_path).read_text(encoding='utf-8').splitlines())}
    records=list(map(json.loads,(root/records_path).read_text(encoding='utf-8').splitlines()))
    grounding={g['claim_id']:g for g in map(json.loads,(root/grounding_path).read_text(encoding='utf-8').splitlines())}
    before={t:(root/'data/processed'/f'{t}.csv').read_bytes().decode('utf-8') for t in TABLES}
    tables={t:list(csv.DictReader(io.StringIO(text))) for t,text in before.items()}
    fields={t:next(csv.reader(io.StringIO(text))) for t,text in before.items()}
    nodes={n['node_id']:n for n in tables['nodes']}
    original_nodes=set(nodes)
    sources={s['source_id']:s for s in tables['source_records']}
    source_checks=set()
    edges={(e['source_id'],e['target_id'],e['relation'],int(e['sign']),e['context_id']):e for e in tables['edges'] if e['edge_id'].startswith('edge:full:') and e['status']=='proposed'}
    original_edges={e['edge_id'] for e in tables['edges']}
    contexts={c['context_id'] for c in tables['contexts']}
    decisions=[]
    outcomes=[]
    for record in records:
        c=record['claim']; p=packets[record['request_id']]; cid=record['claim_id']
        reason=None
        if p['split']=='held_out':
            raise ValueError('Evaluation contamination')
        raw=root/p['raw_file']
        if str(raw) not in source_checks:
            if sha(raw.read_bytes())!=p['source_sha256']:
                raise ValueError('Raw publication hash mismatch')
            source_checks.add(str(raw))
        passages={x['passage_index']:x['text'] for x in p['passages']}
        for ev in c['evidence']:
            if passages[ev['passage_index']][ev['start']:ev['end']]!=ev['quote']:
                raise ValueError('Evidence span mismatch')
        projection,reason=projector(c)
        if cid in REVIEW_DEFERRALS:
            projection=None;reason=REVIEW_DEFERRALS[cid]
        if projection and not any('osteoclast' in v.lower() for v in passages.values()):
            projection=None;reason='outside_explicit_osteoclast_scope'
        old_source=sources.get(p['source_id'])
        if projection and old_source and (old_source['claim_match_status']=='citation_topic_mismatch' or old_source['resolution_status']!='resolved'):
            projection=None;reason='existing_source_quarantine_or_resolution_requires_review'
        staged=[]; resolved={}
        if projection:
            reg=c['regulatory']; bykey={e['key']:e for e in c['entities']}; gs={g['entity_key']:g for g in grounding[cid]['grounding']}
            for key in (reg['subject'],reg['object']):
                if key not in bykey:
                    reason='relationship_participant_unresolved';projection=None;break
                entity=bykey[key]
                if reg['effect_level']=='binding' and entity['molecular_form'] in ('gene','RNA'):
                    reason='binding_molecular_form_requires_review';projection=None;break
                nid,new,status=resolver(entity,gs[key],p,nodes)
                if not nid:
                    reason=status;projection=None;break
                resolved[key]=nid
                staged.append((entity,gs[key],nid,new,status))
            if projection and (resolved[reg['subject']]==resolved[reg['object']]):
                reason='self_relationship_requires_review';projection=None
            if projection and not any(nid in original_nodes or nid.startswith('LOCAL:process:') for nid in resolved.values()):
                reason='disconnected_from_existing_mechanisms';projection=None
        if not projection:
            outcomes.append({'claim_id':cid,'source_id':p['source_id'],'status':'deferred','reason':reason});continue
        for entity,g,nid,new,status in staged:
            if new and nid not in nodes:
                nodes[nid]=new;tables['nodes'].append(new)
            decisions.append({'claim_id':cid,'entity_key':entity['key'],'surface':entity['surface'],'node_id':nid,'decision':status,'grounding':g})
        if p['source_id'] not in sources:
            source={'source_id':p['source_id'],'pmid':p['pmid'],'title':next(x['text'] for x in p['passages'] if x['passage_type']=='title'), 'resolution_status':'resolved','claim_match_status':'relevant_paper_claim_pending','publication_types':'|'.join(p.get('publication_types',[])), 'url':'https://pubmed.ncbi.nlm.nih.gov/'+p['pmid']+'/', 'raw_file':p['raw_file'],'raw_sha256':p['source_sha256'],'retrieved_at':''}
            sources[p['source_id']]=source;tables['source_records'].append(source)
        ctx=c['context']; ctxid='ctx:extracted:'+stable([p['source_id'],ctx])
        if ctxid not in contexts:
            tables['contexts'].append({'context_id':ctxid,'species':SPECIES.get(taxon(ctx['species']),ctx['species'] or ''),'cell_type':ctx['cell_type'] or '', 'stage':ctx['stage'] or '', 'compartment':ctx['compartment'] or '', 'disease_setting':ctx['disease_setting'] or '', 'verification_status':'pending_source_review', 'note':'Extracted context, not expert reviewed. Source: '+p['source_id']})
            contexts.add(ctxid)
        relation,sign,basis=projection
        a,b=resolved[c['regulatory']['subject']],resolved[c['regulatory']['object']]
        if relation=='ASSOCIATED_WITH':
            a,b=sorted([a,b])
        key=(a,b,relation,sign,ctxid)
        note='Automated source-anchored proposal; identity decisions and original uncertainties retained in '+output+'. Not expert reviewed. '+json.dumps({'directness':c['regulatory']['directness'],'intervention':c['experiment']['intervention'],'endpoint':c['experiment']['endpoint']})+' '
        if basis=='genetic_perturbation_role_inference':
            note+='Sign is an inferred normal molecular role; genetic perturbation is not equivalent to pharmacological inhibition. '
        if key not in edges:
            edge={'edge_id':'edge:full:'+stable(key),'source_id':a,'target_id':b,'relation':relation,'sign':str(sign),'context_id':ctxid,'source_db':'pubtator','source_record_id':p['source_id'],'status':'proposed','context_status':'pending','causal_basis':basis,'effect_level':c['regulatory']['effect_level'],'review_note':note}
            edges[key]=edge;tables['edges'].append(edge)
        edge=edges[key]
        # If distinct evidence bases share a relationship, keep the stronger qualification visible.
        if basis=='genetic_perturbation_role_inference':
            edge['causal_basis']=basis;edge['review_note']=note
        expid='exp:full:'+stable(cid)
        exp=c['experiment']
        tables['experiments'].append({'experiment_id':expid,'paper_id':p['source_id'],'model_system':'','species':SPECIES.get(taxon(ctx['species']),ctx['species'] or ''),'cell_type':ctx['cell_type'] or '', 'differentiation_stage':ctx['stage'] or '', 'treatment':exp['intervention'] or '', 'dose':'','duration':'','endpoint':exp['endpoint'] or '', 'assay':'','measured_effect':exp['outcome_change'],'viability':'not reported','verification_status':'pending_passage_review','review_note':note+'Claim-level record, not an independent replication. Unverified quantities remain in the extraction sidecar.'})
        tables['edge_evidence'].append({'evidence_id':'ev:full:'+stable(cid),'edge_id':edge['edge_id'],'experiment_id':expid,'source_id':p['source_id'],'quote_or_location':'\n\n'.join(e['quote'] for e in c['evidence']),'claim_summary':c['summary'],'passage_status':'source_checked_quote','source_location':json.dumps({'claim_id':cid,'request_id':p['request_id'],'spans':c['evidence'],'validation_file':record['validation_file']},ensure_ascii=False),'source_url':sources[p['source_id']]['url'],'source_sha256':p['source_sha256'],'evidence_kind':'association' if relation=='ASSOCIATED_WITH' else 'perturbation' if basis=='genetic_perturbation_role_inference' else 'measurement','polarity':'support','curator_status':'automated_extraction','reviewed_at':'','review_note':note+'Uncertainties: '+' | '.join(c['uncertainties'])})
        outcomes.append({'claim_id':cid,'source_id':p['source_id'],'status':'integrated_proposed','edge_id':edge['edge_id'],'reason':basis})
    after={t:csv_text(tables[t],fields[t]) for t in TABLES}
    with tempfile.TemporaryDirectory() as tmp:
        for t,text in after.items():
            (Path(tmp)/f'{t}.csv').write_bytes(text.encode())
        check=run_verification(tmp)
        if check['errors']:
            raise ValueError(check['errors'])
    added_edges=[e['edge_id'] for e in edges.values() if e['edge_id'] not in original_edges]
    patch={'patch_id':out.name,'before':before,'after':after,'before_sha256':{t:sha(v.encode()) for t,v in before.items()},'after_sha256':{t:sha(v.encode()) for t,v in after.items()},'new_edge_ids':added_edges}
    target.write_text(json.dumps(patch,ensure_ascii=False),encoding='utf-8')
    for name,rows in [('entity_decisions',decisions),('claim_outcomes',outcomes)]:
        (out/(name+'.jsonl')).write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows),encoding='utf-8')
    summary={'input_claims':len(records),'integrated_proposed_claims':sum(r['status']=='integrated_proposed' for r in outcomes),'new_nodes':len(nodes)-len(original_nodes),'new_edges':len(added_edges),'deferral_reasons':dict(Counter(r['reason'] for r in outcomes if r['status']=='deferred')),'counts_after':check['counts'],'paid_api_calls':0}
    (out/'summary.json').write_text(json.dumps(summary,indent=2))
    print(json.dumps(summary,indent=2))
    return target


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply',action='store_true')
    parser.add_argument('--rollback',action='store_true')
    args=parser.parse_args()
    if args.apply and args.rollback:
        parser.error('Choose apply or rollback')
    path=prepare()
    if args.apply or args.rollback:
        print(apply_patch_file(path,rollback=args.rollback))
        from src.kg.rebuild import rebuild
        rebuild(ROOT)


if __name__=='__main__':
    main()
