interface SparklineProps {
  points: number[];
  band?: [number, number];
  height?: number;
  className?: string;
  /** Highlight the readings that fall outside the reference band. */
  markOutOfBand?: boolean;
}

/**
 * Minimal trend line. Renders the raw series only — any interpretation of the
 * shape belongs to a separate, clearly-labelled highlight.
 */
export function Sparkline({
  points,
  band,
  height = 44,
  className = "",
  markOutOfBand = true,
}: SparklineProps) {
  const width = 220;
  const pad = 4;
  const values = band ? [...points, band[0], band[1]] : points;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const x = (i: number) => pad + (i / Math.max(points.length - 1, 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

  const path = points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const outside = band
    ? points.map((v, i) => ({ v, i })).filter(({ v }) => v < band[0] || v > band[1])
    : [];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-11 w-full ${className}`}
      role="img"
      aria-label="Trend line"
    >
      {band ? (
        <rect
          x={0}
          y={y(band[1])}
          width={width}
          height={Math.max(y(band[0]) - y(band[1]), 1)}
          className="fill-ink"
          opacity={0.06}
        />
      ) : null}
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-ink" vectorEffect="non-scaling-stroke" />
      {markOutOfBand
        ? outside.map(({ v, i }) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={2.6} className="fill-alarm" />
          ))
        : null}
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r={2.6} className="fill-ink" />
    </svg>
  );
}
