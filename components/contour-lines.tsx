/**
 * ContourLines: faint map-style contour rings drawn behind the home hero.
 * The paths are computed at build time (server component), so no JavaScript
 * ships to the browser. Purely decorative: hidden from screen readers.
 * If it breaks, the hero simply has a plain background.
 */

type Point = [number, number];

function ring(cx: number, cy: number, radius: number, seed: number): Point[] {
  const points: Point[] = [];
  const steps = 48;
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble =
      1 +
      0.09 * Math.sin(3 * t + seed * 0.45) +
      0.05 * Math.sin(5 * t - seed * 0.3) +
      0.03 * Math.cos(7 * t + seed);
    points.push([cx + Math.cos(t) * radius * wobble * 1.25, cy + Math.sin(t) * radius * wobble]);
  }
  return points;
}

/** Closed Catmull-Rom spline through the points, as cubic Bézier segments. */
function smoothPath(points: Point[]): string {
  const n = points.length;
  const fmt = (v: number) => v.toFixed(1);
  let d = `M${fmt(points[0][0])},${fmt(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`;
  }
  return `${d}Z`;
}

const PATHS = Array.from({ length: 11 }, (_, k) => smoothPath(ring(820, 260, 40 + k * 38, k + 1)));

export function ContourLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {PATHS.map((d, i) => (
          <path key={i} d={d} opacity={1 - i * 0.06} />
        ))}
      </g>
    </svg>
  );
}
