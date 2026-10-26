"""Leakage-aware pilot groups and evaluator for externally supplied predictions.

python -m src.kg.drug_experiment
python -m src.kg.drug_experiment --predictions predictions.csv --endpoint formation

Predictions: observation_id,score (higher means predicted inhibition).
No test labels become model inputs; no model is fit by this script.
"""
import argparse
import json
import math
from collections import defaultdict,Counter
from src.ingest.fda_resolution import ROOT,OUT,read_csv,write_csv,digest

PILOT=ROOT/'data/evaluation/drug_pilot_v1'


def grouped_components(rows,features):
    parent={r['observation_id']:r['observation_id'] for r in rows};seen={}
    def find(x):
        while parent[x]!=x:parent[x]=parent[parent[x]];x=parent[x]
        return x
    for r in rows:
        rid=r['observation_id'];f=features.get(r['ingredient_id'],{})
        keys=[('drug',r['drug_name']),('paper',r['source_id'])]
        for name in ['parent_inchikey','scaffold_group']:
            if f.get(name):keys.append((name,f[name]))
        for key in keys:
            if key in seen:parent[find(rid)]=find(seen[key])
            else:seen[key]=rid
    groups=defaultdict(list)
    for r in rows:groups[find(r['observation_id'])].append(r['observation_id'])
    return [sorted(v) for _,v in sorted(groups.items())]


def evaluate(rows,predictions,endpoint):
    from sklearn.metrics import average_precision_score,roc_auc_score
    byid={r['observation_id']:r for r in rows};pred={}
    for p in predictions:
        if p['observation_id'] not in byid or p['observation_id'] in pred:raise ValueError('Unknown or duplicate prediction ID')
        score=float(p['score'])
        if not math.isfinite(score):raise ValueError('Nonfinite score')
        pred[p['observation_id']]=score
    eligible=[r for r in rows if r['endpoint']==endpoint and r['effect_direction'] in {'decreased','no_significant_change','increased'}]
    records=[(r,1 if r['effect_direction']=='decreased' else 0,pred[r['observation_id']]) for r in eligible if r['observation_id'] in pred]
    if not records:return {'eligible_observations':len(eligible),'predicted_observations':0,'average_precision':None,'roc_auc':None}
    # Repeated assays for one drug must not dominate the metric by record count.
    counts=Counter(r['drug_name'] for r,_,_ in records)
    weights=[1/counts[r['drug_name']] for r,_,_ in records];ys=[y for _,y,_ in records];scores=[s for _,_,s in records]
    both=len(set(ys))==2
    return {'eligible_observations':len(eligible),'predicted_observations':len(records),'coverage':len(records)/len(eligible),
            'drug_moieties':len(counts),'average_precision':float(average_precision_score(ys,scores,sample_weight=weights)) if both else None,
            'roc_auc':float(roc_auc_score(ys,scores,sample_weight=weights)) if both else None,
            'weighted_positive_prevalence':sum(y*w for y,w in zip(ys,weights))/sum(weights),
            'interpretation':'Exploratory inhibition-direction metric, inverse-observation-count drug weighting. Not selective inhibition or clinical efficacy. Predictions must be genuinely out-of-fold; the evaluator cannot certify how they were trained.'}


def run(predictions=None,endpoint='formation'):
    rows=read_csv(PILOT/'observations.csv');features={r['ingredient_id']:r for r in read_csv(OUT/'features.csv')}
    groups=grouped_components(rows,features);allids={r['observation_id'] for r in rows}
    folds=[{'fold':i,'held_out_observations':g,'development_observations':sorted(allids-set(g)),
            'held_out_source_ids':sorted({r['source_id'] for r in rows if r['observation_id'] in g})} for i,g in enumerate(groups)]
    assembled=[]
    for r in rows:
        f=features.get(r['ingredient_id'],{})
        assembled.append({'observation_id':r['observation_id'],'ingredient_id':r['ingredient_id'],'drug_name':r['drug_name'],
                          'endpoint':r['endpoint'],'species':r['species'],'model':r['model'],'dose_value':r['dose_value'],
                          'dose_unit':r['dose_unit'],'duration':r['duration'],
                          **{k:v for k,v in f.items() if k not in {'ingredient_id','ingredient_name'}}})
    write_csv(PILOT/'model_inputs.csv',assembled)
    (PILOT/'group_folds.json').write_text(json.dumps({'strategy':'Connected groups share drug moiety, registry parent, scaffold, or source paper. Leave one connected group out; tiny pilot is not a final test set.','folds':folds},indent=2)+'\n',encoding='utf-8')
    result={'observations':len(rows),'drug_moieties':len({r['drug_name'] for r in rows}),'disjoint_groups':len(groups),
            'group_sizes':[len(g) for g in groups],'training_performed':False,'independent_test_accuracy':None,
            'input_hashes':{'observations':digest((PILOT/'observations.csv').read_bytes()),'features':digest((OUT/'features.csv').read_bytes())},
            'limitations':['Purposive small retrospective sample','Independent reviewer pending','Some abstract-only or incomplete dose/viability records','FDA salt versus experimental formulation not fully resolved','Few independent chemical/source groups; no reliable GNN training or final accuracy estimate']}
    if predictions:result['exploratory_metrics']=evaluate(rows,read_csv(predictions),endpoint)
    (PILOT/'experiment_summary.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))


if __name__=='__main__':
    from pathlib import Path
    p=argparse.ArgumentParser();p.add_argument('--predictions',type=Path);p.add_argument('--endpoint',choices=['formation','resorption','TRAP_activity'],default='formation');a=p.parse_args();run(a.predictions,a.endpoint)
