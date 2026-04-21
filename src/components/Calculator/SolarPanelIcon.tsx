type SolarPanelIconProps = {
  className?: string;
};

/**
 * Stylized 3 columns × 6 rows solar panel icon, brand-colored.
 * Uses currentColor so size/color can be controlled with Tailwind utilities.
 */
export function SolarPanelIcon({ className }: SolarPanelIconProps) {
  const cols = 3;
  const rows = 6;
  const cellW = 12;
  const cellH = 8;
  const gap = 1.2;
  const padding = 3;
  const width = cols * cellW + (cols - 1) * gap + padding * 2;
  const height = rows * cellH + (rows - 1) * gap + padding * 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Frame */}
      <rect
        x="0.75"
        y="0.75"
        width={width - 1.5}
        height={height - 1.5}
        rx="2.5"
        fill="currentColor"
        opacity="0.12"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      {/* Cells 3x6 */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={padding + c * (cellW + gap)}
            y={padding + r * (cellH + gap)}
            width={cellW}
            height={cellH}
            rx="1"
            fill="currentColor"
            opacity={0.55 + ((r + c) % 2) * 0.25}
          />
        )),
      )}
    </svg>
  );
}
