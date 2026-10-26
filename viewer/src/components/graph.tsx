import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize, Focus, Download } from "lucide-react";
import {
  appearance,
  label,
  entityType,
  flags,
  type Entity,
  type Edge,
} from "../lib/model";
import { Tool, WorkbenchToolbar } from "./workbench-toolbar";
type Point = { id: string; x: number; y: number };
const layoutCache = new Map<string, Record<string, Point>>();
export function Graph({
  nodes,
  edges,
  root,
  selected,
  onSelect,
  onExplore,
  onEdge,
  selectedEdge,
  layoutKey,
}: {
  nodes: Entity[];
  edges: Edge[];
  root: string;
  selected: string;
  onSelect: (n: Entity) => void;
  onExplore: (n: Entity) => void;
  onEdge: (e: Edge) => void;
  selectedEdge?: string;
  layoutKey: string;
}) {
  const frame = useRef<HTMLDivElement>(null),
    svg = useRef<SVGSVGElement>(null),
    drag = useRef<any>(null),
    moved = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 }),
    [camera, setCamera] = useState({ x: 400, y: 300, k: 1 }),
    [positions, setPositions] = useState<Record<string, Point>>({});
  const [spacing, setSpacing] = useState(1);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const nodeLabels = useMemo(
    () => new Map(nodes.map((n) => [n.id, label(n)])),
    [nodes],
  );
  const edgeOffsets = useMemo(() => {
    const groups = new Map<string, Edge[]>();
    for (const e of edges) {
      const key = JSON.stringify([e.source, e.target]);
      const group = groups.get(key) || [];
      group.push(e);
      groups.set(key, group);
    }
    const result = new Map<string, number>();
    for (const group of groups.values())
      group.forEach((e, i) =>
        result.set(e.edge_id, (i - (group.length - 1) / 2) * 34),
      );
    return result;
  }, [edges]);
  const signature = nodes.map((n) => n.id).join("|");
  const [layout, setLayout] = useState<Record<string, Point>>({});
  const [layingOut, setLayingOut] = useState(false);
  const [connectionMode, setConnectionMode] = useState("selected");
  const shownEdges = useMemo(
    () =>
      nodes.length > 30 && connectionMode === "selected"
        ? edges.filter(
            (e) =>
              e.source === selected ||
              e.target === selected ||
              e.edge_id === selectedEdge,
          )
        : edges,
    [nodes.length, edges, connectionMode, selected, selectedEdge],
  );
  useEffect(() => {
    const key = `${signature}:${layoutKey}:${spacing}`;
    let cancelled = false;
    function commit(result: Record<string, Point>) {
      if (cancelled) return;
      if (layoutCache.size >= 12)
        layoutCache.delete(layoutCache.keys().next().value!);
      layoutCache.set(key, result);
      setLayout(result);
      setLayingOut(false);
    }
    const cached = layoutCache.get(key);
    if (cached) {
      setLayout(cached);
      setLayingOut(false);
      return;
    }
    if (nodes.length < 18 && nodes.some((n) => n.id === root)) {
      const rest = nodes.filter((n) => n.id !== root);
      commit(
        Object.fromEntries(
          nodes.map((n) => {
            const i = rest.findIndex((v) => v.id === n.id);
            const angle =
              (i * Math.PI * 2) / Math.max(1, rest.length) - Math.PI / 2;
            const r = (Math.max(245, rest.length * 38) * spacing) / 1.5;
            return [
              n.id,
              {
                id: n.id,
                x: i < 0 ? 0 : Math.cos(angle) * r,
                y: i < 0 ? 0 : Math.sin(angle) * r * 0.8,
              },
            ];
          }),
        ),
      );
      return;
    }

    setLayingOut(true);
    setPositions({});
    let worker: Worker | undefined;
    const fallback = () => {
      // Bounded grid fallback if a browser cannot start a worker.
      const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length * 1.5)));
      commit(
        Object.fromEntries(
          nodes.map((n, i) => [
            n.id,
            {
              id: n.id,
              x: (i % cols) * 260 * spacing,
              y: Math.floor(i / cols) * 120 * spacing,
            },
          ]),
        ),
      );
    };
    try {
      worker = new Worker(
        new URL("../lib/graph-layout.worker.ts", import.meta.url),
        { type: "module" },
      );
      worker.onmessage = (e) => {
        commit(e.data);
        worker?.terminate();
      };
      worker.onerror = () => {
        worker?.terminate();
        fallback();
      };
      worker.postMessage({
        ids: nodes.map((n) => n.id),
        edges: edges.map((e) => ({ source: e.source, target: e.target })),
        spacing,
      });
    } catch {
      fallback();
    }
    return () => {
      cancelled = true;
      worker?.terminate();
    };
    // Evidence filters retain geometry; changing network or spacing starts a new layout.
  }, [signature, layoutKey, spacing]);
  useEffect(() => setPositions(layout), [layout]);
  useLayoutEffect(() => {
    const el = frame.current!;
    const ro = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fit = () => {
    const p = Object.values(positions);
    if (!p.length) return;
    const x0 = Math.min(...p.map((p) => p.x)) - 115,
      x1 = Math.max(...p.map((p) => p.x)) + 115,
      y0 = Math.min(...p.map((p) => p.y)) - 55,
      y1 = Math.max(...p.map((p) => p.y)) + 55;
    const k = Math.min(
      1.15,
      (size.w - 60) / (x1 - x0),
      (size.h - 125) / (y1 - y0),
    );
    setCamera({
      k,
      x: size.w / 2 - ((x0 + x1) * k) / 2,
      y: (size.h - 60) / 2 - ((y0 + y1) * k) / 2,
    });
  };
  const lastFit = useRef<{
    layout: typeof layout;
    w: number;
    h: number;
  } | null>(null);
  useEffect(() => {
    if (size.w < 1 || size.h < 1) return;
    const prev = lastFit.current;
    if (!prev || prev.layout !== layout) {
      const p = Object.values(layout);
      if (!p.length) return;
      const x0 = Math.min(...p.map((p) => p.x)) - 115,
        x1 = Math.max(...p.map((p) => p.x)) + 115,
        y0 = Math.min(...p.map((p) => p.y)) - 55,
        y1 = Math.max(...p.map((p) => p.y)) + 55;
      const k = Math.min(
        1.1,
        (size.w - 50) / (x1 - x0),
        (size.h - 125) / (y1 - y0),
      );
      setCamera({
        k,
        x: size.w / 2 - ((x0 + x1) * k) / 2,
        y: (size.h - 60) / 2 - ((y0 + y1) * k) / 2,
      });
    } else
      setCamera((c) => ({
        ...c,
        x: c.x + (size.w - prev.w) / 2,
        y: c.y + (size.h - prev.h) / 2,
      }));
    lastFit.current = { layout, w: size.w, h: size.h };
  }, [layout, size]);
  function zoom(f: number, x = size.w / 2, y = size.h / 2) {
    setCamera((c) => {
      const k = Math.max(0.005, Math.min(3, c.k * f));
      return { k, x: x - ((x - c.x) * k) / c.k, y: y - ((y - c.y) * k) / c.k };
    });
  }
  useEffect(() => {
    const el = frame.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);
  function start(e: React.PointerEvent, id?: string) {
    if (e.button !== 0) return;
    e.stopPropagation();
    moved.current = false;
    drag.current = {
      id,
      x: e.clientX,
      y: e.clientY,
      c: cameraRef.current,
      p: id ? positions[id] : null,
    };
    svg.current?.setPointerCapture(e.pointerId);
  }
  function path(e: Edge, index: number) {
    const a = positions[e.source],
      b = positions[e.target];
    if (!a || !b) return "";
    if (a === b)
      return `M${a.x + 100},${a.y} C${a.x + 170},${a.y - 120} ${a.x - 70},${a.y - 110} ${a.x},${a.y - 31}`;
    const dx = b.x - a.x,
      dy = b.y - a.y,
      t = Math.min(
        0.45,
        106 / (Math.abs(dx) || 0.001),
        36 / (Math.abs(dy) || 0.001),
      );
    const offset = edgeOffsets.get(e.edge_id) || 0;
    const d = Math.hypot(dx, dy) || 1;
    return `M${a.x + dx * t},${a.y + dy * t} Q${(a.x + b.x) / 2 - (dy / d) * offset},${(a.y + b.y) / 2 + (dx / d) * offset} ${b.x - dx * t},${b.y - dy * t}`;
  }
  function exportSvg() {
    if (!svg.current) return;
    const copy = svg.current.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", String(size.w));
    copy.setAttribute("height", String(size.h));
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(copy)], {
        type: "image/svg+xml",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "osteoclast-graph.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const scene = useMemo(
    () => (
      <>
        {shownEdges.map((e, i) => {
          const geometry = path(e, i);
          const f = flags(e),
            color =
              e.sign === 1 ? "#549984" : e.sign === -1 ? "#dd7772" : "#939e98",
            type =
              e.sign === 1
                ? "positive"
                : e.sign === -1
                  ? "negative"
                  : "unknown";
          return (
            <g
              key={e.edge_id}
              role="button"
              tabIndex={0}
              aria-label={`${e.relation}: ${nodeLabels.get(e.source)} to ${nodeLabels.get(e.target)}`}
              onClick={() => onEdge(e)}
              onKeyDown={(v) => {
                if (v.key === "Enter" || v.key === " ") {
                  v.preventDefault();
                  onEdge(e);
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <path
                d={geometry}
                fill="none"
                stroke="transparent"
                strokeWidth={10}
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={geometry}
                fill="none"
                stroke={selectedEdge === e.edge_id ? "#217e98" : color}
                strokeWidth={selectedEdge === e.edge_id ? 3 : 1.3}
                opacity={0.7}
                vectorEffect="non-scaling-stroke"
                strokeDasharray={
                  e.status === "quarantined"
                    ? "2 5"
                    : f.reviewed
                      ? undefined
                      : "6 4"
                }
                markerEnd={`url(#arrow-${type})`}
              />
              <title>{e.relation}</title>
            </g>
          );
        })}
        {nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const [color, fill] = appearance(n),
            text = label(n);
          const boundary = text.lastIndexOf(" ", 23);
          const split =
            text.length > 24 ? (boundary > 9 ? boundary : 23) : text.length;
          const firstLine = text.slice(0, split);
          const remainder = text.slice(split).trim();
          return (
            <g
              key={n.id}
              className="graph-node"
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${text}`}
              transform={`translate(${p.x},${p.y})`}
              onPointerDown={(e) => start(e, n.id)}
              onClick={() => {
                if (!moved.current) onSelect(n);
              }}
              onDoubleClick={() => onExplore(n)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.shiftKey ? onExplore(n) : onSelect(n);
                } else if (e.key.startsWith("Arrow")) {
                  e.preventDefault();
                  setPositions((v) => ({
                    ...v,
                    [n.id]: {
                      ...p,
                      x:
                        p.x +
                        (e.key === "ArrowRight"
                          ? 20
                          : e.key === "ArrowLeft"
                            ? -20
                            : 0),
                      y:
                        p.y +
                        (e.key === "ArrowDown"
                          ? 20
                          : e.key === "ArrowUp"
                            ? -20
                            : 0),
                    },
                  }));
                }
              }}
            >
              <rect
                x="-100"
                y="-31"
                width="200"
                height="62"
                rx="8"
                fill={n.id === selected ? "#eef1cf" : fill}
                stroke={n.id === selected ? "#7d942d" : "#d6d7c3"}
                strokeWidth={n.id === selected ? 2 : 1}
              />
              <rect x="-87" y="-14" width="7" height="7" fill={color} />
              <text
                x="-73"
                y={text.length > 24 ? -12 : -7}
                fontFamily="DM Sans Variable,Segoe UI,sans-serif"
                fontSize="13"
                fontWeight="600"
                fill="#253b30"
              >
                {firstLine}
              </text>
              {text.length > 24 && (
                <text
                  x="-86"
                  y="3"
                  fontFamily="DM Sans Variable,Segoe UI,sans-serif"
                  fontSize="11"
                  fill="#253b30"
                >
                  {remainder.length > 28
                    ? remainder.slice(0, 27) + "…"
                    : remainder}
                </text>
              )}
              <text
                x="-86"
                y={text.length > 24 ? 21 : 15}
                fontFamily="DM Sans Variable,Segoe UI,sans-serif"
                fontSize="10"
                fill="#65766c"
              >
                {entityType(n)}
                {n.taxon ? " · " + n.taxon : ""}
              </text>
              <title>
                {n.name} · {entityType(n)} · {n.taxon || "unknown"}
              </title>
            </g>
          );
        })}
      </>
    ),
    [
      nodes,
      shownEdges,
      positions,
      selected,
      selectedEdge,
      onSelect,
      onExplore,
      onEdge,
      edgeOffsets,
      nodeLabels,
    ],
  );
  return (
    <div className="graph-canvas" ref={frame}>
      <svg
        ref={svg}
        aria-label="Biological relationship graph"
        onPointerDown={(e) => start(e)}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x,
            dy = e.clientY - d.y;
          if (Math.hypot(dx, dy) > 3) moved.current = true;
          if (d.id)
            setPositions((p) => ({
              ...p,
              [d.id]: {
                ...p[d.id],
                x: d.p.x + dx / camera.k,
                y: d.p.y + dy / camera.k,
              },
            }));
          else setCamera({ ...d.c, x: d.c.x + dx, y: d.c.y + dy });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <defs>
          {[
            ["positive", "#549984"],
            ["negative", "#dd7772"],
            ["unknown", "#939e98"],
          ].map(([id, color]) => (
            <marker
              key={id}
              id={`arrow-${id}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path
                d={id === "negative" ? "M8 0 L8 10" : "M0 0 L9 5 L0 10"}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
              />
            </marker>
          ))}
        </defs>
        <g transform={`translate(${camera.x},${camera.y}) scale(${camera.k})`}>
          {scene}
        </g>
      </svg>
      {!nodes.length && (
        <div className="empty-state">No entities match these filters.</div>
      )}
      {layingOut && (
        <div className="layout-status" role="status">
          Arranging network…
        </div>
      )}
      {nodes.length > 18 && (
        <div className="graph-display-controls">
          {nodes.length > 30 && (
            <label>
              Connections
              <select
                aria-label="Connection display"
                value={connectionMode}
                onChange={(e) => setConnectionMode(e.target.value)}
              >
                <option value="selected">Selected entity</option>
                <option value="all">All relationships</option>
              </select>
            </label>
          )}
          <label className="graph-spacing">
            Spacing
            <select
              aria-label="Graph spacing"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
            >
              <option value={1}>Standard</option>
              <option value={1.5}>Relaxed</option>
              <option value={2}>Spacious</option>
            </select>
          </label>
        </div>
      )}
      <div className="canvas-tools">
        <WorkbenchToolbar label="Graph tools">
          <Tool label="Zoom out" onClick={() => zoom(0.8)}>
            <ZoomOut />
          </Tool>
          <span className="zoom-value">{Math.round(camera.k * 100)}%</span>
          <Tool label="Zoom in" onClick={() => zoom(1.25)}>
            <ZoomIn />
          </Tool>
          <span className="tool-divider" />
          <Tool label="Fit graph" onClick={fit}>
            <Maximize />
          </Tool>
          <Tool
            label="Focus selected entity"
            onClick={() => {
              const p = positions[selected];
              if (p)
                setCamera({ k: 1, x: size.w / 2 - p.x, y: size.h / 2 - p.y });
            }}
          >
            <Focus />
          </Tool>
          <Tool label="Export graph SVG" onClick={exportSvg}>
            <Download />
          </Tool>
        </WorkbenchToolbar>
      </div>
      <div className="canvas-caption">
        {nodes.length} entities <span>·</span> {edges.length} relationships
        {shownEdges.length !== edges.length && (
          <span>· {shownEdges.length} shown</span>
        )}
      </div>
    </div>
  );
}
