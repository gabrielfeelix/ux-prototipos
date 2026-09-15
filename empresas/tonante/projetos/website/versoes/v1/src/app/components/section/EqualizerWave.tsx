/** Onda sonora animada — assinatura "música" da Tonante. Barras âmbar pulsando
    em torno da linha central, com envelope alto no meio e defasagem por barra
    (parece waveform, não gráfico). Decorativo: aria-hidden; congela com
    prefers-reduced-motion (a regra global zera a duração de `tn-eq`). */
export function EqualizerWave({
  bars = 48,
  height = 30,
  barWidth = 3,
  gap = 3,
  className = "",
  style,
}: {
  /** quantidade de barras */
  bars?: number;
  /** altura máxima da barra central, em px */
  height?: number;
  barWidth?: number;
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const center = (bars - 1) / 2;
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center ${className}`}
      style={{ height, gap, ...style }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const d = Math.abs(i - center) / center;          // 0 no centro → 1 nas pontas
        const peak = 0.32 + 0.68 * (1 - d * d);           // envelope: alto no meio
        const dur = 0.85 + ((i * 7) % 5) * 0.13;          // velocidades variadas
        const delay = -(((i * 13) % 9) * 0.11);           // defasagem por barra
        return (
          <span
            key={i}
            style={{
              width: barWidth,
              height: `${Math.round(peak * height)}px`,
              borderRadius: Math.max(1, Math.round(barWidth / 1.5)),
              background: "linear-gradient(180deg, var(--amber-bright) 0%, var(--amber-deep) 100%)",
              transformOrigin: "center",
              animation: `tn-eq ${dur}s ease-in-out ${delay}s infinite`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}
