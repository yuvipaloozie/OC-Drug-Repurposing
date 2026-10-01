"""Assemble the paid run's saved outputs without making additional API requests."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--wait', action='store_true')
    args = parser.parse_args()
    output = ROOT / 'data/staging/full_enrichment_v2'
    deadline = time.monotonic() + 10800
    while not (output / 'summary.json').exists():
        if not args.wait:
            raise RuntimeError('Extraction has not finished; use --wait to assemble on completion.')
        if time.monotonic() >= deadline:
            raise TimeoutError('Extraction did not finish within three hours; saved shard outputs remain available.')
        time.sleep(30)
    subprocess.run([sys.executable, '-m', 'src.ingest.summarize_claim_extraction', '--full'], cwd=ROOT, check=True)
    summary = json.loads((output / 'extraction_summary.json').read_text(encoding='utf-8'))
    run = json.loads((output / 'summary.json').read_text(encoding='utf-8'))
    report = f"""# Full literature extraction run

Status: extraction stopped and saved outputs assembled. Completion counts below distinguish a complete corpus from a partial run.

- Prepared papers: {summary['prepared_papers']} (50 frozen evaluation papers excluded).
- Attempted papers: {summary['attempted_papers']}.
- Completed papers: {summary['completed_papers']}.
- Claims passing automated checks, still unreviewed: {summary['accepted_unreviewed_claims']}.
- Papers with accepted claims: {summary['papers_with_accepted_claims']}.
- Rejected claims: {summary['rejected_claims']}.
- Token-derived cost estimate: ${summary['estimated_token_cost_usd']:.4f} (cache discounts excluded).
- Billed-or-reserved accounting including uncertain requests: ${summary['reserved_or_billed_usd']:.4f}.
- Enforced run ceiling: ${run['budget_usd']:.2f}; user maximum $100.
- Canonical graph mutations: 0.

## Outputs

The repository's `data/staging/full_enrichment_v2/claims.jsonl` retains exact evidence, source IDs and hashes, molecular forms, experimental context, model and prompt provenance. `review_queue.csv` is the readable review queue; `extraction_summary.json` includes claim types and rejection reasons. Each shard retains its raw responses, validation outputs, and spending ledger. The prepared corpus is frozen in `data/staging/full_enrichment_prepared_v2`.

## Interpretation

Passing automated checks establishes the output format and passage anchoring, not biological accuracy. These are proposed claims. Registry grounding, context-aware relationship projection, and a reversible graph patch are the next steps. Gene, RNA, and protein mentions remain distinct; perturbation outcomes do not automatically become drug effects. The live canonical viewer remains unchanged by this extraction run.

## Reproduction

Run `python -m src.ingest.run_full_enrichment`, then `python -m src.ingest.finalize_full_enrichment`. Already attempted requests are skipped; failed or ambiguous requests are not automatically charged again. Credentials are loaded locally and are never included in output artifacts. Do not delete ledgers to retry a paid run.
"""
    (ROOT / 'reports/FULL_ENRICHMENT_RUN.md').write_text(report, encoding='utf-8')
    print(report, flush=True)


if __name__ == '__main__':
    main()
