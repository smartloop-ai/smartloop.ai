import { type ReactNode } from 'react';

// The DOCENT banner exactly as the CLI draws it (smartloop-cli src/main.rs):
// half-block characters, each cell two pixels tall. Kept as the same strings
// so the two stay easy to compare.
const BANNER = [
  '█▀▀▀▄ ▄▀▀▀▄ ▄▀▀▀▀ █▀▀▀▀ █▄  █ ▀▀█▀▀',
  '█   █ █   █ █     █▀▀▀  █ ▀▄█   █',
  '▀▀▀▀   ▀▀▀   ▀▀▀▀ ▀▀▀▀▀ ▀   ▀   ▀',
];

// A terminal cell is about 0.6em wide and 1.3em tall, so each half is close
// to square; these keep that proportion.
const CELL_W = 6;
const HALF_H = 6.5;

// Horizontal runs of lit pixels, so neighbouring cells draw as one rect and
// no hairline seams show between them.
function runs(): { x: number; y: number; w: number }[] {
  const out: { x: number; y: number; w: number }[] = [];
  BANNER.forEach((line, row) => {
    const chars = [...line];
    for (const half of [0, 1] as const) {
      const lit = (c: string) => c === '█' || (half === 0 ? c === '▀' : c === '▄');
      let start = -1;
      chars.forEach((c, col) => {
        if (lit(c) && start < 0) start = col;
        if (!lit(c) && start >= 0) {
          out.push({ x: start, y: row * 2 + half, w: col - start });
          start = -1;
        }
      });
      if (start >= 0) out.push({ x: start, y: row * 2 + half, w: chars.length - start });
    }
  });
  return out;
}

const RUNS = runs();
const COLS = Math.max(...BANNER.map((l) => [...l].length));

export default function DocentLogo({ height = 48 }: { height?: number }): ReactNode {
  const vw = COLS * CELL_W;
  const vh = BANNER.length * 2 * HALF_H;
  return (
    <svg
      role="img"
      aria-label="Docent"
      viewBox={`0 0 ${vw} ${vh}`}
      height={height}
      width={(height * vw) / vh}
      shapeRendering="crispEdges"
      style={{ display: 'block', fill: 'var(--sl-accent)' }}
    >
      {RUNS.map((r, i) => (
        <rect key={i} x={r.x * CELL_W} y={r.y * HALF_H} width={r.w * CELL_W} height={HALF_H} />
      ))}
    </svg>
  );
}
