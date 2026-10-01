"""Run the remainder of the fixed 150-paper pilot in bounded independent shards."""
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
from pathlib import Path
import subprocess
import sys


def main():
    root = Path(__file__).resolve().parents[2]
    smoke = root / 'data/staging/openai_claim_pilot_v1'
    smoke_ledger = json.loads((smoke / 'ledger.json').read_text(encoding='utf-8'))
    reserved = sum(r['reserved_or_billed_usd'] for r in smoke_ledger['requests'].values())
    if reserved + 8 * 0.99 > 8:
        raise SystemExit('Combined budget would exceed $8')
    output = root / 'data/staging/openai_claim_pilot_parallel_v1'
    output.mkdir(parents=True, exist_ok=True)

    def worker(index):
        command = [sys.executable, '-m', 'src.ingest.run_openai_claim_extraction', '--execute', '--limit', '150',
                   '--budget-usd', '0.99', '--shard-index', str(index), '--shard-count', '8',
                   '--exclude-run', str(smoke), '--output', str(output / ('shard_' + str(index)))]
        with (output / ('shard_' + str(index) + '.log')).open('a', encoding='utf-8') as log:
            result = subprocess.run(command, cwd=root, stdout=log, stderr=subprocess.STDOUT)
        return index, result.returncode

    with ThreadPoolExecutor(max_workers=8) as pool:
        for future in as_completed([pool.submit(worker, i) for i in range(8)]):
            index, code = future.result()
            print(f'Shard {index} finished; exit={code}', flush=True)
    records = dict(smoke_ledger['requests'])
    for file in sorted(output.glob('shard_*/ledger.json')):
        new = json.loads(file.read_text(encoding='utf-8'))['requests']
        if set(records) & set(new):
            raise RuntimeError('Duplicate paper across pilot shards')
        records.update(new)
    report = {'attempted_papers': len(records), 'completed_papers': sum(r['status'] == 'completed' for r in records.values()),
              'accepted_unreviewed_claims': sum(r.get('accepted_claims', 0) for r in records.values()),
              'rejected_claims': sum(r.get('rejected_claims', 0) for r in records.values()),
              'repaired_spans': sum(r.get('repaired_spans', 0) for r in records.values()),
              'estimated_billed_usd': sum(r['reserved_or_billed_usd'] for r in records.values() if 'usage' in r),
              'reserved_or_billed_usd': sum(r['reserved_or_billed_usd'] for r in records.values()),
              'budget_usd': 8, 'canonical_mutations': 0, 'scientific_review_completed': False}
    (output / 'summary.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
