"use client";

import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getCatalogHref } from "./productPresentation";
import { formatBRL } from "./productEnhancements";

// Categories — "O que você toca hoje?" (porta _ref/src/home.jsx Categories +
// CategoryCard): grid com card grande (Violões) + fotos representativas, overlay
// escuro, "N produtos" + nome serif + blurb + seta.

type Cat = { label: string; blurb: string };
const CATS: Cat[] = [
  { label: "Violões", blurb: "A alma da Tonante desde 1954." },
  { label: "Guitarras", blurb: "Para quem leva o palco a sério." },
  { label: "Contrabaixos", blurb: "O peso certo do groove." },
  { label: "Acessórios", blurb: "O que completa o seu som." },
  { label: "Cordas & Encordoamentos", blurb: "O toque que muda tudo." },
  { label: "Suportes", blurb: "Seu instrumento sempre seguro." },
];

// Fotos de banco (Unsplash) por categoria — lifestyle profissional.
const IMG: Record<string, string> = {
  "Violões": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=85&auto=format&fit=crop",
  "Guitarras": "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=1200&q=85&auto=format&fit=crop",
  "Contrabaixos": "https://images.unsplash.com/photo-1564264764238-7e04d6b46f9c?w=1200&q=85&auto=format&fit=crop",
  "Acessórios": "https://images.unsplash.com/photo-1648828714555-ac6529ff120c?w=1200&q=85&auto=format&fit=crop",
  "Cordas & Encordoamentos": "https://images.unsplash.com/photo-1522008224169-e5992bed5fae?w=1200&q=85&auto=format&fit=crop",
  "Suportes": "https://images.unsplash.com/photo-1550985616-10810253b84d?w=1200&q=85&auto=format&fit=crop",
};

const meta = (label: string) => {
  const ps = allProducts.filter((p) => p.category === label && p.priceNum > 0);
  return {
    count: ps.length,
    photo: IMG[label] ?? "",
    fromPrice: ps.length ? Math.min(...ps.map((p) => p.priceNum)) : 0,
  };
};

function CategoryCard({ cat, big, spanClass = "" }: { cat: Cat; big?: boolean; spanClass?: string }) {
  const [hover, setHover] = useState(false);
  const { count, photo, fromPrice } = meta(cat.label);
  return (
    <Link
      to={getCatalogHref({ category: cat.label })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative flex flex-col justify-end overflow-hidden ${spanClass}`}
      style={{
        borderRadius: "var(--radius-card-lg)",
        minHeight: big ? 320 : 200,
        padding: 24,
        color: "#fff",
        background: "radial-gradient(120% 120% at 75% 10%, #b5793c, #6e4220)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "transform .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {photo && (
        <ImageWithFallback
          src={photo}
          alt={cat.label}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
        />
      )}
      <div className="grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          // scrim duplo: faixa inferior + lateral esquerda (onde o texto vive) —
          // garante AA mesmo sobre fotos claras (ex.: Suportes).
          background: photo
            ? "linear-gradient(90deg, rgba(20,16,12,.55) 0%, rgba(20,16,12,.18) 38%, rgba(20,16,12,0) 60%), linear-gradient(180deg, rgba(20,16,12,0) 38%, rgba(20,16,12,.38) 68%, rgba(20,16,12,.78) 100%)"
            : "transparent",
        }}
      />
      {!photo && (
        <img
          src="/brand/tonante-symbol-white.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute select-none"
          style={{ right: -20, top: -20, width: big ? 200 : 130, opacity: 0.18, transform: hover ? "rotate(8deg)" : "none", transition: "transform .5s" }}
        />
      )}
      <div className="relative z-[2]">
        <span className="label" style={{ color: "rgba(255,255,255,.85)", fontSize: "var(--text-eyebrow)" }}>
          {count} produtos
        </span>
        <div style={{ fontFamily: "var(--font-family-figtree)", fontSize: big ? "44px" : "26px", fontWeight: 700, lineHeight: 1, margin: "8px 0 6px" }}>
          {cat.label}
        </div>
        <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "rgba(255,255,255,.9)" }}>
          {cat.blurb}
          <ArrowRight size={16} style={{ transform: hover ? "translateX(4px)" : "none", transition: "transform .3s" }} />
        </div>
        {fromPrice > 0 && (
          <div
            className="num mt-3 inline-flex items-center rounded-pill"
            style={{
              fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", fontWeight: 600,
              color: "#fff", background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)",
              padding: "4px 11px", backdropFilter: "blur(4px)",
            }}
          >
            a partir de {formatBRL(fromPrice)}
          </div>
        )}
      </div>
    </Link>
  );
}

export function CategoryShowcase() {
  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-lg)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="label" style={{ color: "var(--amber-deep)", marginBottom: 12 }}>
              Navegue por família
            </p>
            <h2 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
              O que você toca hoje?
            </h2>
          </div>
          <Link to="/produtos" className="hidden items-center gap-2 md:inline-flex" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, color: "var(--ink-strong)" }}>
            Ver tudo <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[minmax(196px,1fr)]">
          {CATS.map((c, i) => {
            // grid editorial: Violões 2×2 dominante; Suportes faixa larga no rodapé.
            const spanClass =
              i === 0 ? "col-span-2 md:row-span-2" : i === 5 ? "col-span-2 md:col-span-4" : "";
            return <CategoryCard key={c.label} cat={c} big={i === 0} spanClass={spanClass} />;
          })}
        </div>
      </div>
    </section>
  );
}
