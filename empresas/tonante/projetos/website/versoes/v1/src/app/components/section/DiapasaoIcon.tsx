import type { CSSProperties } from "react";

/**
 * DiapasaoIcon — o garfo de afinação. Ícone do Afinador no header.
 *
 * Não existe diapasão no lucide, e nenhum ícone de lá serve: `Music` é
 * catálogo, `AudioWaveform` é player, `Gauge` é painel de carro. O diapasão é
 * literalmente o objeto que dá o lá — quem toca reconhece na hora. Desenhado
 * na mesma grade 24 e na mesma espessura dos ícones vizinhos do header, senão
 * ele destoa da fileira.
 */
export function DiapasaoIcon({
  size = 20,
  strokeWidth = 1.8,
  className = "",
  style,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* as duas hastes e o U que as une */}
      <path d="M8.5 3v8.5a3.5 3.5 0 0 0 7 0V3" />
      {/* o cabo, que é por onde se segura e onde o som passa pro tampo */}
      <path d="M12 15v6" />
      {/* a vibração */}
      <path d="M5.2 6.2c-.7.9-.7 2.7 0 3.6" opacity="0.55" />
      <path d="M18.8 6.2c.7.9.7 2.7 0 3.6" opacity="0.55" />
    </svg>
  );
}
