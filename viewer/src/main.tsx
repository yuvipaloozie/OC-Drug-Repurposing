import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Network,
  Atom,
  Columns2,
  ArrowUpRight,
  ChevronRight,
  Filter,
  X,
  Pin,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./components/ui/command";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/ui/resizable";
import { TooltipProvider } from "./components/ui/tooltip";
import { Graph } from "./components/graph";
import { Structure } from "./components/structure";
import { EvidenceView, Fields } from "./components/evidence";
import { Tool } from "./components/workbench-toolbar";
import {
  type Dataset,
  type Entity,
  type Edge,
  label,
  human,
  appearance,
  entityType,
  resolveEntity,
  matchesEvidence,
  evidenceLabel,
  structureOptions,
  safeLink,
} from "./lib/model";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/newsreader";
import "./style.css";
declare global {
  interface Window {
    OC_GRAPH: Dataset;
  }
}
const data = window.OC_GRAPH;
function App() {
  const initial = new URLSearchParams(location.search),
    first =
      resolveEntity(data, initial.get("node")) ||
      resolveEntity(data, "HGNC:PHGDH") ||
      data.nodes[0];
  const [selected, setSelected] = useState(first),
    [root, setRoot] = useState(
      resolveEntity(data, initial.get("root"))?.id || first.id,
    ),
    [view, setView] = useState(
      ["graph", "structure", "split"].includes(initial.get("view") || "")
        ? initial.get("view")!
        : document.body.dataset.mode === "structure"
          ? "structure"
          : "graph",
    ),
    [scope, setScope] = useState(initial.get("scope") || "neighbors");
  const [module, setModule] = useState(initial.get("module") || "all"),
    [review, setReview] = useState(initial.get("evidence") || "all"),
    [species, setSpecies] = useState(initial.get("species") || "all"),
    [degree, setDegree] = useState(0),
    [showFilters, setShowFilters] = useState(true);
  const [entityFilter, setEntityFilter] = useState("all");
  const [query, setQuery] = useState(""),
    [command, setCommand] = useState(false),
    [left, setLeft] = useState(true),
    [right, setRight] = useState(true),
    [narrow, setNarrow] = useState(window.innerWidth < 1000),
    [catalogOpen, setCatalogOpen] = useState(false),
    [inspectorOpen, setInspectorOpen] = useState(false);
  const [tab, setTab] = useState("overview"),
    [edge, setEdge] = useState<Edge | null>(null),
    [metadata, setMetadata] = useState<Record<string, any>>({}),
    [pinned, setPinned] = useState<string[]>([]);
  useEffect(() => {
    document
      .querySelector<HTMLButtonElement>(".entity-row.selected")
      ?.scrollIntoView({ block: "nearest" });
  }, [selected.id, query, entityFilter, module, catalogOpen, left, narrow]);
  useEffect(() => {
    const resize = () => setNarrow(window.innerWidth < 1000);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries({
      node: selected.id,
      root,
      view,
      scope,
      module,
      evidence: review,
      species,
    }))
      u.searchParams.set(k, v);
    history.replaceState(null, "", u);
    document.title = `${label(selected)} · Osteoclast`;
  }, [selected.id, root, view, scope, module, review, species]);
  const map = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), []),
    incident = useMemo(() => {
      const m = new Map(data.nodes.map((n) => [n.id, [] as Edge[]]));
      for (const e of data.edges) {
        m.get(e.source)?.push(e);
        if (e.target !== e.source) m.get(e.target)?.push(e);
      }
      return m;
    }, []);
  const modules = useMemo(
    () =>
      [
        ...new Set(
          data.nodes.map((n) => n.physiological_pillar).filter(Boolean),
        ),
      ].sort(),
    [],
  );
  const catalog = data.nodes
    .filter(
      (n) =>
        (module === "all" || n.physiological_pillar === module) &&
        (entityFilter === "all" || entityType(n) === entityFilter) &&
        [n.id, n.name, n.symbol, ...(n.aliases || []), ...(n.legacy_ids || [])]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)) ||
        label(a).localeCompare(label(b)),
    );
  const shownNodes = useMemo(() => {
    const ids = new Set([
      root,
      ...(incident.get(root) || []).flatMap((e) => [e.source, e.target]),
    ]);
    return data.nodes.filter(
      (n) =>
        (scope === "neighbors"
          ? ids.has(n.id)
          : module === "all" || n.physiological_pillar === module) &&
        (incident.get(n.id)?.length || 0) >= degree,
    );
  }, [root, scope, module, degree]);
  const ids = new Set(shownNodes.map((n) => n.id));
  const shownEdges = data.edges.filter(
    (e) =>
      ids.has(e.source) &&
      ids.has(e.target) &&
      matchesEvidence(e, review) &&
      (species === "all" ||
        (data.contexts.find((c) => c.context_id === e.context_id)?.species ||
          "unknown") === species),
  );
  function select(n: Entity) {
    setSelected(n);
    setEdge(null);
    setTab("overview");
  }
  function explore(n: Entity) {
    select(n);
    setRoot(n.id);
    setScope("neighbors");
    setCatalogOpen(false);
  }
  function inspectEdge(e: Edge) {
    setEdge(e);
    setTab("evidence");
    setRight(true);
    if (narrow) setInspectorOpen(true);
  }
  const connections = incident.get(selected.id) || [];
  const catalogPane = (
    <aside className="catalog-pane">
      <div className="panel-title">
        <h2>Explore biology</h2>
        <span>{data.nodes.length}</span>
      </div>
      <div className="search-field">
        <Search size={15} />
        <input
          aria-label="Find entity"
          placeholder="Symbol, compound or accession…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={13} />
          </button>
        )}
      </div>
      <select
        aria-label="Biological module"
        value={module}
        onChange={(e) => {
          setModule(e.target.value);
          setScope("all");
        }}
      >
        <option value="all">All biological modules</option>
        {modules.map((m) => (
          <option key={m} value={m}>
            {human(m)}
          </option>
        ))}
      </select>
      <select
        aria-label="Entity type"
        className="entity-type-filter"
        value={entityFilter}
        onChange={(e) => setEntityFilter(e.target.value)}
      >
        <option value="all">All entity types</option>
        {[...new Set(data.nodes.map(entityType))].sort().map((type) => (
          <option key={type} value={type}>
            {human(type)}
          </option>
        ))}
      </select>
      <div className="list-label">
        <span>{catalog.length} results</span>
        <span>Relations</span>
      </div>
      <div className="entity-list">
        {catalog.map((n) => (
          <button
            key={n.id}
            className={`entity-row ${selected.id === n.id ? "selected" : ""}`}
            aria-label={`Select ${label(n)} · ${entityType(n)} · ${n.taxon || "unknown"}`}
            aria-pressed={selected.id === n.id}
            onClick={() => explore(n)}
          >
            <i style={{ background: appearance(n)[0] }} />
            <span className="entity-copy">
              <strong title={n.name}>{label(n)}</strong>
              <small>
                {entityType(n)} · {n.taxon || "—"}
              </small>
            </span>
            {pinned.includes(n.id) ? <Pin size={12} /> : null}
            <span className="degree">{incident.get(n.id)?.length}</span>
          </button>
        ))}
        {!catalog.length && <p className="muted">No matching entities.</p>}
      </div>
      <div className="catalog-bottom">
        <span className="palette-dots">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Osteoclast collection</span>
      </div>
    </aside>
  );
  const inspector = (
    <aside className="inspector-pane">
      <div className="entity-heading">
        <div className="eyebrow">
          {entityType(selected)} <span>·</span>{" "}
          {selected.taxon || "Unknown species"}
        </div>
        <div className="entity-title">
          <h2>{label(selected)}</h2>
          <Tool
            label={pinned.includes(selected.id) ? "Unpin entity" : "Pin entity"}
            active={pinned.includes(selected.id)}
            onClick={() =>
              setPinned((p) =>
                p.includes(selected.id)
                  ? p.filter((v) => v !== selected.id)
                  : [...p, selected.id],
              )
            }
          >
            <Pin />
          </Tool>
        </div>
        <p>{selected.name}</p>
      </div>
      <Tabs className="inspector-tabs" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
        </TabsList>
        <div className="inspector-scroll">
          <TabsContent value="overview">
            <Fields
              values={{
                Identifier: selected.id,
                Species: selected.taxon,
                Roles: selected.roles?.join(", "),
                Module: selected.physiological_pillar,
                Compartment: selected.compartment,
              }}
            />
            <Button
              className="explore-action"
              variant="outline"
              size="sm"
              onClick={() => {
                explore(selected);
                setView("graph");
              }}
            >
              Explore neighborhood <ArrowUpRight />
            </Button>
            <div className="section-heading">
              <h3>Relationships</h3>
              <span>{connections.length}</span>
            </div>
            <div className="connection-list">
              {connections.map((e) => (
                <button key={e.edge_id} onClick={() => inspectEdge(e)}>
                  <span className="connection-top">
                    <span>
                      {e.source === selected.id ? "→" : "←"}{" "}
                      {label(
                        map.get(
                          e.source === selected.id ? e.target : e.source,
                        )!,
                      )}
                    </span>
                    <ChevronRight size={14} />
                  </span>
                  <span className="connection-meta">
                    {human(e.relation).toLowerCase()}
                    <span
                      className={`status ${evidenceLabel(e).toLowerCase()}`}
                    >
                      {evidenceLabel(e)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <details>
              <summary>Entity fields</summary>
              <pre>{JSON.stringify(selected, null, 2)}</pre>
            </details>
          </TabsContent>
          <TabsContent value="evidence">
            {edge ? (
              <>
                <button
                  className="back-link"
                  onClick={() => {
                    setEdge(null);
                  }}
                >
                  ← All relationships
                </button>
                <div className="claim-heading">
                  <h3>
                    {label(map.get(edge.source)!)} →{" "}
                    {label(map.get(edge.target)!)}
                  </h3>
                  <span>
                    {human(edge.relation).toLowerCase()} ·{" "}
                    {edge.sign === 1
                      ? "positive"
                      : edge.sign === -1
                        ? "negative"
                        : "unsigned"}
                  </span>
                </div>
                <EvidenceView key={edge.edge_id} edge={edge} data={data} />
              </>
            ) : (
              <>
                <div className="section-heading">
                  <h3>Relationships</h3>
                  <span>{connections.length}</span>
                </div>
                {connections.map((e) => (
                  <button
                    className="evidence-choice"
                    key={e.edge_id}
                    onClick={() => inspectEdge(e)}
                  >
                    <strong>
                      {label(map.get(e.source)!)} → {label(map.get(e.target)!)}
                    </strong>
                    <span>
                      {human(e.relation).toLowerCase()} ·{" "}
                      {e.evidence?.length || 0} records
                    </span>
                    <span
                      className={`status ${evidenceLabel(e).toLowerCase()}`}
                    >
                      {evidenceLabel(e)}
                    </span>
                  </button>
                ))}
              </>
            )}
          </TabsContent>
          <TabsContent value="structure">
            <Fields
              values={{
                "KG species": selected.taxon,
                "Identity status": selected.identity_status,
                "Structure mapping":
                  metadata.mapping ||
                  (structureOptions(selected).length
                    ? "Candidate"
                    : "Unavailable"),
                ...(Object.keys(metadata).length
                  ? {
                      Source: metadata.source,
                      Accession: metadata.accession,
                      Origin: metadata.origin,
                      "Source species": metadata.sourceSpecies,
                      Atoms: metadata.atoms,
                    }
                  : {}),
              }}
            />
            {structureOptions(selected).map((o) => (
              <a
                className="structure-source-link"
                href={safeLink(o.url)}
                target="_blank"
                rel="noreferrer"
                key={o.id}
              >
                <Atom size={15} />
                {o.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
            {!structureOptions(selected).length && (
              <p className="muted">No structure recorded.</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setView("structure");
                setInspectorOpen(false);
              }}
            >
              Open structure <ArrowUpRight />
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
  return (
    <TooltipProvider delayDuration={250}>
      <div className="app">
        <header className="app-header">
          <a className="brand" href="index.html">
            <span className="brand-icon" />
            <span>
              Osteoclast<small>Drug discovery atlas</small>
            </span>
          </a>
          <Tabs value={view} onValueChange={setView} className="view-tabs">
            <TabsList aria-label="Workspace view">
              <TabsTrigger value="graph">
                <Network size={15} />
                Graph
              </TabsTrigger>
              <TabsTrigger value="structure">
                <Atom size={15} />
                Structure
              </TabsTrigger>
              <TabsTrigger value="split">
                <Columns2 size={15} />
                Split
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <button className="command-trigger" onClick={() => setCommand(true)}>
            <Search size={15} />
            <span>Search the atlas</span>
            <kbd>Ctrl K</kbd>
          </button>
        </header>
        <div className="workspace-heading">
          <div className="heading-left">
            <Tool
              label="Toggle entity catalog"
              onClick={() =>
                narrow ? setCatalogOpen(true) : setLeft((v) => !v)
              }
            >
              {left ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Tool>
            <span className="breadcrumb">Molecular atlas</span>
            <ChevronRight size={13} />
            <h1>
              {scope === "neighbors"
                ? label(map.get(root)!)
                : module === "all"
                  ? "All entities"
                  : human(module)}
            </h1>
          </div>
          <div className="heading-right">
            <span className="small-count">
              {data.nodes.length} entities · {data.edges.length} relationships
            </span>
            <Tool
              label="Toggle inspector"
              onClick={() =>
                narrow ? setInspectorOpen(true) : setRight((v) => !v)
              }
            >
              {right ? <PanelRightClose /> : <PanelRightOpen />}
            </Tool>
          </div>
        </div>
        <main className="workspace">
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="osteoclast-panels"
          >
            {!narrow && left && (
              <>
                <ResizablePanel
                  id="catalog"
                  order={1}
                  defaultSize={19}
                  minSize={15}
                  maxSize={30}
                >
                  {catalogPane}
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel id="canvas" order={2} minSize={30} defaultSize={53}>
              <section className="stage">
                {view !== "structure" && (
                  <div className="stage-tools">
                    <div className="scope-switch">
                      <Button
                        variant={scope === "neighbors" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setRoot(selected.id);
                          setScope("neighbors");
                        }}
                      >
                        Local network
                      </Button>
                      <Button
                        variant={scope === "all" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setScope("all")}
                      >
                        Full network
                      </Button>
                    </div>
                    <div className="filter-compact">
                      <select
                        aria-label="Evidence filter"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      >
                        <option value="all">All evidence</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="pending">Pending</option>
                        <option value="quarantined">Quarantined</option>
                        <option value="eligible">Strict experimental</option>
                      </select>
                      <Button
                        variant={showFilters ? "secondary" : "ghost"}
                        size="icon"
                        aria-label="More filters"
                        aria-expanded={showFilters}
                        onClick={() => setShowFilters((v) => !v)}
                      >
                        <Filter />
                      </Button>
                    </div>
                  </div>
                )}
                {showFilters && view !== "structure" && (
                  <div className="filter-row">
                    <label>
                      Evidence species
                      <select
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                      >
                        <option value="all">All species</option>
                        {[
                          ...new Set(
                            data.contexts.map((c) => c.species || "unknown"),
                          ),
                        ]
                          .sort()
                          .map((s) => (
                            <option key={s} value={s}>
                              {human(s)}
                            </option>
                          ))}
                      </select>
                    </label>
                    <label>
                      Minimum relationships
                      <input
                        type="number"
                        min={0}
                        max={data.edges.length}
                        value={degree}
                        onChange={(e) =>
                          setDegree(Math.max(0, Number(e.target.value) || 0))
                        }
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDegree(0);
                        setSpecies("all");
                        setReview("all");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                )}
                <div className={`viewports ${view === "split" ? "split" : ""}`}>
                  <div
                    className={`graph-view ${view === "structure" ? "view-hidden" : ""}`}
                  >
                    <Graph
                      nodes={shownNodes}
                      edges={shownEdges}
                      root={root}
                      selected={selected.id}
                      onSelect={select}
                      onExplore={explore}
                      onEdge={inspectEdge}
                      selectedEdge={edge?.edge_id}
                      layoutKey={`${root}:${scope}:${module}`}
                    />
                  </div>
                  <div
                    className={`structure-view ${view === "graph" ? "view-hidden" : ""}`}
                  >
                    <Structure entity={selected} onMetadata={setMetadata} />
                  </div>
                </div>
                {view !== "structure" && (
                  <footer className="stage-footer">
                    <div className="sign-legend">
                      <span>
                        <i className="positive" />
                        Positive
                      </span>
                      <span>
                        <i className="negative" />
                        Negative
                      </span>
                      <span>
                        <i />
                        Unsigned
                      </span>
                    </div>
                    <details className="legend-details">
                      <summary>Legend</summary>
                      <div>
                        <strong>Entity types</strong>
                        {[
                          "Protein",
                          "Enzyme role",
                          "TF role",
                          "Gene",
                          "RNA",
                          "Compound",
                          "Reaction",
                          "Pathway",
                        ].map((v, i) => (
                          <span key={v}>
                            <i
                              style={{
                                background: [
                                  "#47ad85",
                                  "#e76560",
                                  "#247f99",
                                  "#bb8139",
                                  "#d2a019",
                                  "#c79b22",
                                  "#5b929e",
                                  "#478d70",
                                ][i],
                              }}
                            />
                            {v}
                          </span>
                        ))}
                        <strong>Evidence</strong>
                        <span>Solid · reviewed passage</span>
                        <span>Dashed · pending</span>
                        <span>Dotted · quarantined</span>
                      </div>
                    </details>
                  </footer>
                )}
              </section>
            </ResizablePanel>
            {!narrow && right && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  id="inspector"
                  order={3}
                  defaultSize={28}
                  minSize={22}
                  maxSize={42}
                >
                  {inspector}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </main>
        <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
          <DialogContent className="side-dialog">
            <DialogTitle className="sr-only">Entity catalog</DialogTitle>
            <DialogDescription className="sr-only">
              Find biological entities
            </DialogDescription>
            {catalogPane}
          </DialogContent>
        </Dialog>
        <Dialog open={inspectorOpen} onOpenChange={setInspectorOpen}>
          <DialogContent className="side-dialog">
            <DialogTitle className="sr-only">Entity inspector</DialogTitle>
            <DialogDescription className="sr-only">
              Entity, evidence and structure details
            </DialogDescription>
            {inspector}
          </DialogContent>
        </Dialog>
        <Dialog open={command} onOpenChange={setCommand}>
          <DialogContent className="command-dialog">
            <DialogTitle className="sr-only">Find an entity</DialogTitle>
            <DialogDescription className="sr-only">
              Search symbols, aliases and identifiers
            </DialogDescription>
            <Command>
              <CommandInput placeholder="Search entities, aliases, identifiers…" />
              <CommandList>
                <CommandEmpty>No matching entities.</CommandEmpty>
                <CommandGroup heading="Entities">
                  {data.nodes.map((n) => (
                    <CommandItem
                      key={n.id}
                      value={[
                        n.id,
                        n.name,
                        n.symbol,
                        ...(n.aliases || []),
                        ...(n.legacy_ids || []),
                      ].join(" ")}
                      onSelect={() => {
                        explore(n);
                        setCommand(false);
                      }}
                    >
                      <i
                        className="entity-dot"
                        style={{ background: appearance(n)[0] }}
                      />
                      <span className="command-copy">
                        <strong>{label(n)}</strong>
                        <small>{n.name}</small>
                      </span>
                      <span className="command-type">
                        {entityType(n)} · {n.taxon || "—"}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
class Boundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="empty-state">
        <h1>Viewer unavailable</h1>
        <Button onClick={() => location.reload()}>Reload</Button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <Boundary>
    <App />
  </Boundary>,
);
