import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  human,
  safeLink,
  type Edge,
  type Dataset,
  type Evidence,
} from "../lib/model";
export function Fields({ values }: { values: Record<string, unknown> }) {
  return (
    <dl className="facts">
      {Object.entries(values).map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{human(v)}</dd>
        </div>
      ))}
    </dl>
  );
}
export function EvidenceView({ edge, data }: { edge: Edge; data: Dataset }) {
  const [sorting, setSorting] = useState<SortingState>([]),
    [query, setQuery] = useState(""),
    [active, setActive] = useState<string | null>(null);
  const rows = (edge.evidence || []).filter((v) =>
    JSON.stringify(v).toLowerCase().includes(query.toLowerCase()),
  );
  const columns = useMemo<ColumnDef<Evidence>[]>(
    () => [
      {
        accessorKey: "source_id",
        header: ({ column }) => (
          <button
            className="table-sort"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Source <ArrowUpDown size={12} />
          </button>
        ),
        cell: ({ row }) => (
          <button
            className="source-button"
            onClick={() => setActive(row.original.evidence_id)}
          >
            {row.original.source_id || "Unknown"}
          </button>
        ),
      },
      {
        accessorKey: "curator_status",
        header: "Review",
        cell: ({ getValue }) => (
          <span className={`status ${getValue()}`}>{human(getValue())}</span>
        ),
      },
    ],
    [],
  );
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const selected = rows.find((r) => r.evidence_id === active) || rows[0],
    source = data.sources.find((s) => s.source_id === selected?.source_id),
    experiment = data.experiments.find(
      (e) => e.experiment_id === selected?.experiment_id,
    ),
    context = data.contexts.find(
      (c) => c.context_id === (experiment?.context_id || edge.context_id),
    );
  let qualifiers = {};
  try {
    qualifiers =
      typeof context?.qualifiers === "string"
        ? JSON.parse(context.qualifiers)
        : context?.qualifiers || {};
  } catch {}
  return (
    <div className="evidence-view">
      <div className="section-heading">
        <h3>Evidence</h3>
        <span>{rows.length}</span>
      </div>
      <input
        aria-label="Filter evidence"
        placeholder="Filter records…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((g) => (
            <TableRow key={g.id}>
              {g.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.original.evidence_id}
              data-state={
                selected?.evidence_id === row.original.evidence_id
                  ? "selected"
                  : undefined
              }
            >
              {row.getVisibleCells().map((c) => (
                <TableCell key={c.id}>
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!selected ? (
        <p className="muted">No matching evidence records.</p>
      ) : (
        <article className="evidence-detail">
          <h3>{source?.title || selected.source_id || "Source record"}</h3>
          <div className="record-tags">
            <span className="status">{human(selected.passage_status)}</span>
            <span className="status">{human(selected.polarity)}</span>
          </div>
          <p className="passage">
            {selected.quote_or_location ||
              selected.claim_summary ||
              "No passage recorded."}
          </p>
          <p className="muted">{selected.source_location}</p>
          {safeLink(selected.source_url || source?.url) && (
            <Button asChild variant="outline" size="sm">
              <a
                href={safeLink(selected.source_url || source?.url)}
                target="_blank"
                rel="noreferrer"
              >
                Open publication <ExternalLink />
              </a>
            </Button>
          )}
          <h3 className="subheading">Conditions</h3>
          <Fields
            values={{
              Species: context?.species,
              "Cell / model": context?.cell_type,
              Stage: context?.stage,
              ...Object.fromEntries(
                Object.entries(qualifiers).map(([k, v]) => [human(k), v]),
              ),
            }}
          />
          <details>
            <summary>Record details</summary>
            <Fields
              values={{
                "Evidence ID": selected.evidence_id,
                "Experiment ID": selected.experiment_id,
                "Claim status": edge.status,
                "Strict experimental": edge.evidence_eligible
                  ? "Eligible"
                  : "Not eligible",
                "Causal basis": edge.causal_basis,
                "Effect level": edge.effect_level,
              }}
            />
            {edge.review_note && <p>{edge.review_note}</p>}
            {selected.review_note && <p>{selected.review_note}</p>}
            {experiment && <pre>{JSON.stringify(experiment, null, 2)}</pre>}
          </details>
        </article>
      )}
    </div>
  );
}
