import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide,
} from "d3-force";
export type LayoutRequest = {
  ids: string[];
  edges: { source: string; target: string }[];
  spacing: number;
};
export function calculateLayout({ ids, edges, spacing }: LayoutRequest) {
  const points = ids.map((id, i) => ({
    id,
    x: Math.cos(i * 2.4) * Math.sqrt(i + 1) * 160 * spacing,
    y: Math.sin(i * 2.4) * Math.sqrt(i + 1) * 150 * spacing,
  }));
  const sim = forceSimulation(points)
    .force(
      "link",
      forceLink(edges.map((e) => ({ source: e.source, target: e.target })))
        .id((d: any) => d.id)
        .distance(280 * spacing)
        .strength(0.18),
    )
    .force("charge", forceManyBody().strength(-1000 * spacing))
    .force("center", forceCenter())
    .force("x", forceX(0).strength(0.035))
    .force("y", forceY(0).strength(0.055))
    .force("collision", forceCollide(120 * spacing))
    .stop();
  sim.tick(180);
  return Object.fromEntries(points.map((p) => [p.id, { ...p, x: p.x * 1.25 }]));
}
