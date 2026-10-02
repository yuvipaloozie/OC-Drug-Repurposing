import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, LoaderCircle, Atom } from "lucide-react";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Tool, WorkbenchToolbar } from "./workbench-toolbar";
import { structureOptions, type Entity } from "../lib/model";
declare global {
  interface Window {
    $3Dmol: any;
  }
}
let library: Promise<void> | undefined;
function loadLibrary() {
  if (window.$3Dmol) return Promise.resolve();
  return (library ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "assets/vendor/3Dmol-min.js";
    s.onload = () => resolve();
    s.onerror = () => {
      library = undefined;
      s.remove();
      reject(new Error("3D renderer unavailable."));
    };
    document.head.append(s);
  }));
}
export function Structure({
  entity,
  onMetadata,
}: {
  entity: Entity;
  onMetadata: (data: Record<string, any>) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    viewer = useRef<any>(null),
    abort = useRef<AbortController | null>(null),
    serial = useRef(0);
  const options = structureOptions(entity),
    [source, setSource] = useState(0),
    [state, setState] = useState("idle"),
    [error, setError] = useState(""),
    [style, setStyle] = useState("cartoon"),
    [color, setColor] = useState("teal"),
    [ligands, setLigands] = useState(true),
    [chain, setChain] = useState("all"),
    [chains, setChains] = useState<string[]>([]);
  const option = options[source];
  useEffect(() => {
    serial.current++;
    abort.current?.abort();
    viewer.current?.removeAllSurfaces();
    viewer.current?.clear();
    setSource(0);
    setState("idle");
    setError("");
    setChain("all");
    setChains([]);
    setStyle(entity.type.includes("compound") ? "sticks" : "cartoon");
    setColor("teal");
    onMetadata({});
  }, [entity.id]);
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      viewer.current?.resize();
      viewer.current?.render();
    });
    ro.observe(host.current!);
    return () => {
      ro.disconnect();
      serial.current++;
      abort.current?.abort();
      viewer.current?.clear();
      viewer.current = null;
    };
  }, []);
  function render() {
    const v = viewer.current;
    if (!v || state !== "ready") return;
    v.removeAllSurfaces();
    v.setStyle({}, {});
    const selection = chain === "all" ? {} : { chain };
    const coloring =
      color === "confidence" && option?.kind === "alphafold"
        ? {
            colorscheme: {
              prop: "b",
              gradient: new window.$3Dmol.Gradient.RWB(50, 100),
            },
          }
        : color === "chain"
          ? { colorscheme: "chain" }
          : { color: "#419b91" };
    if (style === "surface") {
      v.addSurface(
        window.$3Dmol.SurfaceType.VDW,
        { opacity: 0.85, ...coloring },
        selection,
      ).then(() => v.render());
      v.setStyle(selection, { cartoon: coloring });
    } else if (style === "sticks") {
      v.setStyle(selection, {
        stick: { radius: 0.17, colorscheme: "Jmol" },
        sphere: { scale: 0.22, colorscheme: "Jmol" },
      });
    } else v.setStyle(selection, { cartoon: coloring });
    if (ligands && option?.kind !== "sdf")
      v.setStyle(
        { ...selection, hetflag: true },
        { stick: { radius: 0.17, colorscheme: "Jmol" } },
      );
    v.render();
  }
  useEffect(render, [style, color, ligands, chain, state]);
  async function load() {
    if (!option) return;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const run = ++serial.current;
    const timer = setTimeout(() => controller.abort(), 25000);
    setState("loading");
    setError("");
    viewer.current?.removeAllSurfaces();
    viewer.current?.clear();
    onMetadata({});
    try {
      await loadLibrary();
      let url =
          option.kind === "sdf"
            ? option.metadata.sdf_url
            : `https://files.rcsb.org/download/${option.id}.pdb`,
        sourceSpecies = "",
        description = "";
      if (option.kind === "alphafold") {
        const r = await fetch(
          `https://alphafold.ebi.ac.uk/api/prediction/${option.id}`,
          { signal: controller.signal },
        );
        if (!r.ok) throw new Error("Model unavailable from AlphaFold.");
        const entries = await r.json();
        const entry = entries.find(
          (v: any) => v.uniprotAccession === option.id,
        );
        if (!entry?.pdbUrl) throw new Error("No coordinates available.");
        const u = new URL(entry.pdbUrl);
        if (u.protocol !== "https:" || u.hostname !== "alphafold.ebi.ac.uk")
          throw new Error("Unsupported coordinate source.");
        url = u.href;
        sourceSpecies = entry.organismScientificName || "";
        description = entry.uniprotDescription || "";
      }
      const r = await fetch(url, { signal: controller.signal });
      if (!r.ok) throw new Error("Coordinate download failed.");
      const text = await r.text();
      if (run !== serial.current) return;
      if (!viewer.current)
        viewer.current = window.$3Dmol.createViewer(host.current, {
          backgroundColor: "#faf6e9",
          antialias: true,
        });
      const v = viewer.current,
        model = v.addModel(text, option.kind === "sdf" ? "sdf" : "pdb"),
        atoms = model.selectedAtoms({});
      if (!atoms.length) throw new Error("No atoms in the coordinate file.");
      setChains([
        ...new Set<string>(atoms.map((a: any) => a.chain).filter(Boolean)),
      ]);
      v.resize();
      v.zoomTo();
      setState("ready");
      onMetadata({
        source: option.label,
        accession: option.id,
        origin:
          option.kind === "alphafold"
            ? "Predicted"
            : option.kind === "sdf"
              ? "Computed"
              : "Experimental",
        sourceSpecies: sourceSpecies || "Unknown",
        description,
        atoms: atoms.length,
        mapping: "Candidate",
        method: option.metadata?.method,
        confidence:
          option.kind === "alphafold" &&
          atoms.some((a: any) => Number.isFinite(a.b)),
      });
    } catch (e: any) {
      if (run === serial.current) {
        viewer.current?.clear();
        setState("error");
        setError(e.name === "AbortError" ? "Request timed out." : e.message);
      }
    } finally {
      clearTimeout(timer);
    }
  }
  return (
    <div className="structure-pane">
      <div className="structure-controls">
        <label className="sr-only" htmlFor="structure-source">
          Structure source
        </label>
        <select
          id="structure-source"
          value={source}
          disabled={!options.length}
          onChange={(e) => {
            serial.current++;
            abort.current?.abort();
            viewer.current?.removeAllSurfaces();
            viewer.current?.clear();
            setSource(Number(e.target.value));
            setState("idle");
            setColor("teal");
            setChain("all");
            setChains([]);
            onMetadata({});
          }}
        >
          {options.length ? (
            options.map((o, i) => (
              <option key={o.id} value={i}>
                {o.label}
              </option>
            ))
          ) : (
            <option>No structure</option>
          )}
        </select>
        <Button
          size="sm"
          onClick={load}
          disabled={!option || state === "loading"}
        >
          {state === "loading" ? <LoaderCircle className="spin" /> : null}
          {state === "ready" ? "Reload" : "Load structure"}
        </Button>
      </div>
      <div className="molecule-area">
        <div className="molecule-host" ref={host} />
        {state !== "ready" && (
          <div className="empty-state">
            <Atom size={38} />
            <strong>
              {state === "loading"
                ? "Loading structure"
                : state === "error"
                  ? error
                  : option
                    ? "Structure ready to load"
                    : "No structure available"}
            </strong>
            {state === "error" && (
              <Button variant="outline" size="sm" onClick={load}>
                Retry
              </Button>
            )}
          </div>
        )}
        {state === "ready" && (
          <>
            <div className="molecule-options">
              <ToggleGroup
                type="single"
                value={style}
                onValueChange={(v) => v && setStyle(v)}
                aria-label="Molecular representation"
              >
                {(option?.kind === "sdf"
                  ? ["sticks", "surface"]
                  : ["cartoon", "sticks", "surface"]
                ).map((v) => (
                  <ToggleGroupItem key={v} value={v} aria-label={v}>
                    {v[0].toUpperCase() + v.slice(1)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <select
                aria-label="Molecule color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="teal">Teal</option>
                <option value="chain">By chain</option>
                {option?.kind === "alphafold" && (
                  <option value="confidence">Confidence</option>
                )}
              </select>
              {chains.length > 1 && (
                <select
                  aria-label="Chain"
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                >
                  <option value="all">All chains</option>
                  {chains.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              )}
              {option?.kind !== "sdf" && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={ligands}
                    onChange={(e) => setLigands(e.target.checked)}
                  />
                  Ligands
                </label>
              )}
            </div>
            <div className="canvas-tools">
              <WorkbenchToolbar label="Structure tools">
                <Tool
                  label="Reset structure view"
                  onClick={() => {
                    viewer.current.zoomTo();
                    viewer.current.render();
                  }}
                >
                  <RotateCcw />
                </Tool>
                <Tool
                  label="Export structure PNG"
                  onClick={() => {
                    viewer.current.render();
                    const a = document.createElement("a");
                    a.href = viewer.current.pngURI();
                    a.download = `${option?.id}.png`;
                    a.click();
                  }}
                >
                  <Download />
                </Tool>
              </WorkbenchToolbar>
            </div>
            {color === "confidence" && (
              <div className="confidence-key">
                pLDDT <span />
                50–100
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
