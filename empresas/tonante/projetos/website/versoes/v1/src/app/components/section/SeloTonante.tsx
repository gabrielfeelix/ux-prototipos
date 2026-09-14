"use client";

import { useId, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * SeloTonante — carimbo/selo circular de luthier (assinatura Tonante §3.2).
 * Borda dupla, texto circular ("TONANTE · DESDE 1954 ·") via <textPath>, centro
 * com glifo/numeral. Variantes: "rei" (Rei dos Violões), "70" (70 anos),
 * "destaque" (Destaque da semana — substitui o antigo "Drop do dia").
 * `rotate` liga giro lento contínuo (60s) — usar só em destaque/hero.
 * `tone="light"` p/ superfícies escuras (stage/footer). reduced-motion: sem giro.
 */
type Variant = "rei" | "70" | "destaque";
type Tone = "ink" | "light";

const RING: Record<Variant, string> = {
  rei: "TONANTE · O REI DOS VIOLÕES · DESDE 1954 · ",
  "70": "TONANTE · 70 ANOS DE MÚSICA · 1954 · ",
  destaque: "TONANTE · DESTAQUE DA SEMANA · 1954 · ",
};

export function SeloTonante({
  variant = "rei",
  size = 120,
  rotate = false,
  tone = "ink",
  className = "",
  style,
}: {
  variant?: Variant;
  size?: number;
  rotate?: boolean;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const spin = rotate && !reduce;

  const fg = tone === "light" ? "#ffffff" : "var(--ink-strong)";
  const accent = "var(--amber)";
  const ringPathId = `selo-ring-${id}`;

  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size, lineHeight: 0, ...style }}
      role="img"
      aria-label={RING[variant].replace(/ · $/, "").replace(/·/g, "—")}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          {/* círculo p/ o texto correr (raio 38) */}
          <path id={ringPathId} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>

        {/* bordas duplas */}
        <circle cx="50" cy="50" r="48" stroke={fg} strokeWidth="1" opacity="0.85" />
        <circle cx="50" cy="50" r="44.5" stroke={accent} strokeWidth="1.4" />

        {/* anel de texto giratório */}
        <motion.g
          style={{ transformOrigin: "50px 50px" }}
          animate={spin ? { rotate: 360 } : { rotate: 0 }}
          transition={spin ? { duration: 60, ease: "linear", repeat: Infinity } : { duration: 0 }}
        >
          <text
            fill={fg}
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "7px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <textPath href={`#${ringPathId}`} startOffset="0%">
              {RING[variant]}
            </textPath>
          </text>
        </motion.g>

        {/* centro por variante */}
        <SeloCenter variant={variant} fg={fg} accent={accent} />
      </svg>
    </span>
  );
}

function SeloCenter({ variant, fg, accent }: { variant: Variant; fg: string; accent: string }) {
  if (variant === "70") {
    return (
      <g textAnchor="middle">
        <text
          x="50"
          y="56"
          fill={fg}
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "30px", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          70
        </text>
        <text
          x="50"
          y="66"
          fill={accent}
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.3em" }}
        >
          ANOS
        </text>
      </g>
    );
  }
  if (variant === "destaque") {
    return (
      <g textAnchor="middle">
        <path
          d="M50 38 l3.1 6.3 6.9 1 -5 4.9 1.2 6.9 -6.2-3.3 -6.2 3.3 1.2-6.9 -5-4.9 6.9-1 z"
          fill={accent}
        />
        <text
          x="50"
          y="64"
          fill={fg}
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.22em" }}
        >
          DESTAQUE
        </text>
      </g>
    );
  }
  // "rei" — coroa simples + ano
  return (
    <g textAnchor="middle">
      <path
        d="M40 52 l2-9 4 5 4-7 4 7 4-5 2 9 z"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="62"
        fill={fg}
        style={{ fontFamily: "var(--font-family-figtree)", fontSize: "9px", fontWeight: 700, fontStyle: "italic" }}
      >
        1954
      </text>
    </g>
  );
}
