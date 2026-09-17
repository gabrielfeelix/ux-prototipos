import type { SVGProps } from "react";

/**
 * Token de fidelidade Tonante — "Tons" (programa de pontos, irmão do PCYES Coin
 * mas com identidade própria). Visual: PALHETA de violão âmbar, em vez de moeda
 * (ownable, músico, não-gamer). Nome do componente mantido p/ compat de imports.
 */
export function PcyesCoin({
  size = 18,
  ...rest
}: { size?: number } & Omit<SVGProps<SVGSVGElement>, "width" | "height" | "viewBox">) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden {...rest}>
      <defs>
        <linearGradient id="tnpick-grad-shared" x1="20%" y1="8%" x2="80%" y2="95%">
          <stop offset="0%" stopColor="#fde0a3" />
          <stop offset="48%" stopColor="#e08c12" />
          <stop offset="100%" stopColor="#a05f00" />
        </linearGradient>
        <radialGradient id="tnpick-shine-shared" cx="34%" cy="24%" r="42%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* palheta: topo arredondado, ponta inferior */}
      <path
        d="M16 3.4C9.7 3.4 5 7.2 5 12.6c0 6 6.6 12.4 11 16 4.4-3.6 11-10 11-16 0-5.4-4.7-9.2-11-9.2Z"
        fill="url(#tnpick-grad-shared)"
        stroke="#7c4a00"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* "T" sutil gravado */}
      <text
        x="16"
        y="16.6"
        textAnchor="middle"
        fontFamily="var(--font-family-figtree), system-ui, sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#7c4a00"
        fillOpacity="0.55"
        letterSpacing="-0.04em"
      >
        T
      </text>
      <ellipse cx="12" cy="10" rx="4" ry="2.6" fill="url(#tnpick-shine-shared)" />
    </svg>
  );
}
