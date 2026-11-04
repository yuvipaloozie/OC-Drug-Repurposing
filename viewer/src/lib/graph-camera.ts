export function fitCamera(
  points: { x: number; y: number }[],
  size: { w: number; h: number },
  maxZoom: number,
  horizontalPadding: number,
) {
  if (!points.length) return null;
  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity;
  for (const point of points) {
    x0 = Math.min(x0, point.x - 115);
    x1 = Math.max(x1, point.x + 115);
    y0 = Math.min(y0, point.y - 55);
    y1 = Math.max(y1, point.y + 55);
  }
  const k = Math.min(
    maxZoom,
    (size.w - horizontalPadding) / (x1 - x0),
    (size.h - 125) / (y1 - y0),
  );
  return {
    k,
    x: size.w / 2 - ((x0 + x1) * k) / 2,
    y: (size.h - 60) / 2 - ((y0 + y1) * k) / 2,
  };
}
