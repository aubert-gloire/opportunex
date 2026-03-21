/**
 * OpportuneX Logo — inline SVG component
 *
 * Props:
 *   variant   'dark' | 'light'   — navy vs white
 *   size      'sm' | 'md' | 'lg' — controls overall scale
 *   markOnly  boolean            — render just the OX circle mark
 */
const Logo = ({ variant = 'dark', size = 'md', markOnly = false }) => {
  const ink = variant === 'light' ? '#FFFFFF' : '#1E3A5F';
  const muted = variant === 'light' ? 'rgba(255,255,255,0.35)' : '#d6d3d1';
  const sub = variant === 'light' ? 'rgba(255,255,255,0.45)' : '#a8a29e';

  const scale = { sm: 0.72, md: 1, lg: 1.4 }[size] ?? 1;

  // Mark geometry — circle + inscribed X
  // Circle: cx=24, cy=24, r=21.5 inside a 48×48 canvas
  // X endpoints: 24 ± 21.5×cos(45°) = 24 ± 15.2 → (8.8, 8.8) → (39.2, 39.2)
  const Mark = () => (
    <svg
      width={Math.round(48 * scale)}
      height={Math.round(48 * scale)}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21.5" stroke={ink} strokeWidth="1.5" />
      <line x1="8.8"  y1="8.8"  x2="39.2" y2="39.2" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="39.2" y1="8.8"  x2="8.8"  y2="39.2" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  if (markOnly) return <Mark />;

  // Full horizontal lockup
  const markW   = Math.round(48 * scale);
  const markH   = Math.round(48 * scale);
  const gap     = Math.round(16 * scale);
  const sepX    = markW + gap;
  const textX   = sepX + Math.round(10 * scale);
  const fSize   = Math.round(22 * scale);
  const subSize = Math.round(7.5 * scale);
  const baseY   = Math.round(markH / 2 + fSize * 0.37);
  const subY    = Math.round(baseY + subSize + 2 * scale);
  const totalW  = textX + Math.round(190 * scale);
  const totalH  = Math.max(markH, subY + 4);

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      aria-label="OpportuneX"
    >
      {/* ── Circle mark ── */}
      <circle
        cx={Math.round(markW / 2)}
        cy={Math.round(markH / 2)}
        r={Math.round(21.5 * scale)}
        stroke={ink}
        strokeWidth="1.5"
      />
      <line
        x1={Math.round((24 - 15.2) * scale)} y1={Math.round((24 - 15.2) * scale)}
        x2={Math.round((24 + 15.2) * scale)} y2={Math.round((24 + 15.2) * scale)}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round"
      />
      <line
        x1={Math.round((24 + 15.2) * scale)} y1={Math.round((24 - 15.2) * scale)}
        x2={Math.round((24 - 15.2) * scale)} y2={Math.round((24 + 15.2) * scale)}
        stroke={ink} strokeWidth="1.5" strokeLinecap="round"
      />

      {/* ── Separator ── */}
      <line
        x1={sepX} y1={Math.round(markH * 0.2)}
        x2={sepX} y2={Math.round(markH * 0.8)}
        stroke={muted} strokeWidth="0.75"
      />

      {/* ── Wordmark: "Opportune" italic serif + "X" sans medium ── */}
      <text
        x={textX}
        y={baseY}
        fontFamily="'EB Garamond', Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize={fSize}
        fill={ink}
        letterSpacing="-0.3"
      >
        Opportune
        <tspan
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontStyle="normal"
          fontWeight="500"
          fontSize={fSize}
          letterSpacing="0"
        >X</tspan>
      </text>

      {/* ── Sub-label ── */}
      {size !== 'sm' && (
        <text
          x={textX}
          y={subY}
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="400"
          fontSize={subSize}
          fill={sub}
          letterSpacing={Math.round(2.5 * scale * 10) / 10}
        >
          CAREERS PLATFORM · RWANDA
        </text>
      )}
    </svg>
  );
};

export default Logo;
