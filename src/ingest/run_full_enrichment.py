"""Run the frozen full-corpus extraction with a combined $90 ceiling and resumable shards."""
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]


def aggregate(output):
    records = {}
    for file in sorted(output.glob('shard_*/ledger.json')):
        new = json.loads(file.read_text(encoding='utf-8'))['requests']
        if set(records) & set(new):
            raise ValueError('Overlapping shards')
        records.update(new)
    return records


def main():
    prepared = ROOT / 'data/staging/full_enrichment_prepared_v2'
    config = json.loads((prepared / 'config.json').read_text())
    total = json.loads((prepared / 'manifest.json').read_text())['request_count']
    workers, budget = config['workers'], config['budget_usd']
    if budget > 90 or budget > config['user_maximum_usd']:
        raise ValueError('Budget exceeds authorized run ceiling')
    output = ROOT / 'data/staging/full_enrichment_v2'
    output.mkdir(parents=True, exist_ok=True)

    def worker(index):
        folder = output / ('shard_' + str(index))
        expected = len(range(index, total, workers))
        command = [sys.executable, '-m', 'src.ingest.run_openai_claim_extraction', '--execute', '--limit', str(total),
                   '--prepared', str(prepared), '--budget-usd', str(budget / workers),
                   '--shard-index', str(index), '--shard-count', str(workers), '--output', str(folder)]
        # Resume the remainder after a bounded number of interrupted/invalid
        # papers. Attempted requests are never automatically billed again.
        for attempt in range(4):
            with (output / ('shard_' + str(index) + '.log')).open('a', encoding='utf-8') as log:
                result = subprocess.run(command, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT)
            ledger_path = folder / 'ledger.json'
            if not ledger_path.exists():
                return index, result.returncode, 'no_ledger'
            ledger = json.loads(ledger_path.read_text())
            records = list(ledger['requests'].values())
            if len(records) >= expected or sum(r['reserved_or_billed_usd'] for r in records) >= budget / workers - 0.15:
                return index, result.returncode, 'finished_or_budget_bound'
            if any(r.get('http_status') in (400, 401, 403, 404) for r in records):
                return index, result.returncode, 'configuration_or_auth_error'
            time.sleep(30)
        return index, result.returncode, 'resume_limit_reached'

    with ThreadPoolExecutor(max_workers=workers) as pool:
        for future in as_completed([pool.submit(worker, i) for i in range(workers)]):
            print('Shard finished:', future.result(), flush=True)
    records = aggregate(output)
    report = {'prepared_papers': total, 'attempted_papers': len(records),
              'completed_papers': sum(r['status'] == 'completed' for r in records.values()),
              'accepted_unreviewed_claims': sum(r.get('accepted_claims', 0) for r in records.values()),
              'rejected_claims': sum(r.get('rejected_claims', 0) for r in records.values()),
              'estimated_token_cost_usd': sum(r['reserved_or_billed_usd'] for r in records.values() if 'usage' in r),
              'reserved_or_billed_usd': sum(r['reserved_or_billed_usd'] for r in records.values()),
              'budget_usd': budget, 'canonical_mutations': 0, 'scientific_accuracy_measured': False}
    (output / 'summary.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)


if __name__ == '__main__':
    main()
