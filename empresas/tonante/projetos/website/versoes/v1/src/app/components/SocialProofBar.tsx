"use client";

import { Star } from "lucide-react";
import { allProducts } from "./productsData";

/**
 * SocialProofBar — faixa de prova social agregada (§6.10). Numerais em Bodoni
 * display + label Hanken. NENHUM número inventado: tudo derivado de productsData
 * em runtime (count e média real) ou de fatos da marca (70 anos, 10x).
 */
const PRODUCT_COUNT = allProducts.length;
const AVG_RATING =
  allProducts.reduce((s, p) => s + (p.rating || 0), 0) / (allProducts.length || 1);

type Stat = { num: string; label: string; sub?: string; star?: boolean };
const STATS: Stat[] = [
  { num: "70", label: "anos de música", sub: "desde 1954" },
  { num: `${PRODUCT_COUNT}`, label: "produtos no catálogo" },
  { num: AVG_RATING.toFixed(2).replace(".", ","), label: "média das avaliações", star: true },
  { num: "10x", label: "sem juros no cartão" },
];

export function SocialProofBar() {
  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div
          className="grid grid-cols-2 gap-y-7 rounded-card-lg border py-8 md:grid-cols-4"
          style={{ background: "var(--surface-1)", borderColor: "var(--edge)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-4 text-center"
              style={{ borderLeft: i % 4 === 0 ? "none" : "1px solid var(--edge)" }}
            >
              <span
                className="inline-flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(34px,4vw,48px)", fontWeight: 700, lineHeight: 1, color: "var(--ink-strong)", letterSpacing: "-0.01em" }}
              >
                {s.star && <Star size={22} fill="var(--amber)" stroke="var(--amber)" />}
                {s.num}
              </span>
              <span
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", fontWeight: 600, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.3 }}
              >
                {s.label}
              </span>
              {s.sub && (
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", color: "var(--ink-meta)", marginTop: 2 }}>
                  {s.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
