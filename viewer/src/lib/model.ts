export type Entity = {
  id: string;
  name: string;
  symbol?: string;
  type: string;
  roles?: string[];
  rna_type?: string;
  taxon?: string;
  identity_status?: string;
  physiological_pillar?: string;
  aliases?: string[];
  legacy_ids?: string[];
  compartment?: string;
  structure_candidates?: Record<string, any>;
  [key: string]: any;
};
export type Evidence = {
  evidence_id: string;
  source_id?: string;
  experiment_id?: string;
  curator_status?: string;
  passage_status?: string;
  quote_or_location?: string;
  claim_summary?: string;
  source_url?: string;
  source_location?: string;
  [key: string]: any;
};
export type Edge = {
  edge_id: string;
  source: string;
  target: string;
  relation: string;
  sign: number;
  status: string;
  context_id?: string;
  evidence?: Evidence[];
  evidence_eligible?: boolean;
  [key: string]: any;
};
export type Dataset = {
  nodes: Entity[];
  edges: Edge[];
  contexts: Record<string, any>[];
  experiments: Record<string, any>[];
  sources: Record<string, any>[];
};
export const label = (n: Entity) => n.symbol || n.name || n.id;
export const human = (value: unknown) =>
  String(
    value === null || value === undefined || value === "" ? "Unknown" : value,
  ).replaceAll("_", " ");
export const entityType = (n: Entity) =>
  n.type === "rna"
    ? (
        { mrna: "mRNA", mirna: "miRNA", lncrna: "lncRNA" } as Record<
          string,
          string
        >
      )[n.rna_type || ""] || "RNA"
    : n.type.replace(/^(intracellular|extracellular)_/, "");
export function flags(e: Edge) {
  const ev = e.evidence || [];
  return {
    reviewed: ev.some(
      (v) =>
        v.curator_status === "reviewed" &&
        ["source_checked_quote", "source_checked_paraphrase"].includes(
          v.passage_status || "",
        ),
    ),
    pending:
      ev.some(
        (v) => !["reviewed", "quarantined"].includes(v.curator_status || ""),
      ) ||
      (!ev.length && e.status !== "quarantined"),
    quarantined:
      e.status === "quarantined" ||
      ev.some((v) => v.curator_status === "quarantined"),
    eligible: e.evidence_eligible === true,
  };
}
export function evidenceLabel(e: Edge) {
  const f = flags(e);
  const states = ["reviewed", "pending", "quarantined"].filter(
    (k) => f[k as keyof typeof f],
  );
  return states.length > 1
    ? "Mixed"
    : states[0]
      ? states[0][0].toUpperCase() + states[0].slice(1)
      : "Unknown";
}
export function matchesEvidence(e: Edge, filter: string) {
  return (
    filter === "all" ||
    flags(e)[filter as keyof ReturnType<typeof flags>] === true
  );
}
export function resolveEntity(data: Dataset, id: string | null) {
  return data.nodes.find(
    (n) => n.id === id || n.legacy_ids?.includes(id || ""),
  );
}
export function structureOptions(n: Entity) {
  const c = n.structure_candidates || {},
    options: {
      id: string;
      kind: string;
      label: string;
      url: string;
      metadata?: any;
    }[] = [];
  if (
    /^(intracellular|extracellular)_compound$/.test(n.type) &&
    /^assets\/structures\/chebi_\d+\.sdf$/.test(c.small_molecule?.sdf_url || "")
  )
    options.push({
      id: c.small_molecule.registry_id,
      kind: "sdf",
      label: "Computed conformer",
      url: c.small_molecule.source_url,
      metadata: c.small_molecule,
    });
  if (n.type !== "protein") return options;
  if (
    /^(?:[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9](?:[A-Z][A-Z0-9]{2}[0-9]){1,2})$/.test(
      c.uniprot_id || "",
    )
  )
    options.push({
      id: c.uniprot_id,
      kind: "alphafold",
      label: `AlphaFold · ${c.uniprot_id}`,
      url: `https://alphafold.ebi.ac.uk/entry/${c.uniprot_id}`,
    });
  [
    ...new Set<string>(
      [...(c.pdb_structures || []), c.primary_pdb].filter((p) =>
        /^[1-9][a-zA-Z0-9]{3}$/.test(p || ""),
      ),
    ),
  ].forEach((id) =>
    options.push({
      id,
      kind: "pdb",
      label: `PDB · ${id}`,
      url: `https://www.rcsb.org/structure/${id}`,
    }),
  );
  return options;
}
export function appearance(n: Entity) {
  const t = n.roles?.includes("enzyme")
    ? "enzyme"
    : n.roles?.includes("transcription_factor")
      ? "tf"
      : entityType(n).toLowerCase();
  return (
    (
      {
        protein: ["#47ad85", "#edf7f1"],
        enzyme: ["#e76560", "#fcefed"],
        tf: ["#247f99", "#edf5f8"],
        gene: ["#bb8139", "#fbf2e7"],
        mrna: ["#d2a019", "#fff8e3"],
        mirna: ["#d2a019", "#fff8e3"],
        lncrna: ["#d2a019", "#fff8e3"],
        compound: ["#c79b22", "#f9f5e5"],
        reaction: ["#5b929e", "#eff5f5"],
        pathway: ["#478d70", "#eef5ed"],
      } as Record<string, string[]>
    )[t] || ["#718596", "#edf2f5"]
  );
}
export function safeLink(url: unknown) {
  try {
    const u = new URL(String(url));
    return u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}
