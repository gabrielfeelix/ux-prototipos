import { useCallback, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./section/SectionHeader";
import { CarouselNavButton } from "./section/CarouselNavButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";

// EncordoamentosShowcase — "Qual corda é a sua?" (V3 §5, ref SG Strings).
// Cards-pôster por família: calibre gigante, frase de uso, cor da família
// (paleta --tone-* da casa), produto REAL do catálogo. Educação + venda.

type Family = {
  key: string;
  productId: number;
  /** calibre destaque — direto do nome do produto, não inventado */
  gauge: string;
  gaugeNote: string;
  title: string;
  use: string;
  pills: string[];
  /** gradiente da família — topo escuro (texto branco AA), base na cor */
  from: string;
  to: string;
};

const FAMILIES: Family[] = [
  {
    key: "nylon",
    productId: 139,
    gauge: "029 / 044",
    gaugeNote: "tensão alta",
    title: "Nylon para violão",
    use: "Macia para os dedos: clássico, bossa e roda de sala.",
    pills: ["6 cordas", "cobre prata", "p/ iniciante"],
    from: "#5d3f1a",
    to: "#9c7138",
  },
  {
    key: "bronze",
    productId: 140,
    gauge: "011 / 052",
    gaugeNote: "aço bronze 85/15",
    title: "Aço para violão",
    use: "Brilho e projeção: folk, roda e palco.",
    pills: ["6 cordas", "bronze 85/15", "som brilhante"],
    from: "#6f4214",
    to: "#c9863f",
  },
  {
    key: "guitarra",
    productId: 141,
    gauge: "009 / 042",
    gaugeNote: "níquel plated steel",
    title: "Níquel para guitarra",
    use: "Ataque rápido e bend fácil: do ensaio ao solo.",
    pills: ["6 cordas", "extra light", "bend fácil"],
    from: "#16130f",
    to: "#4a443c",
  },
  {
    key: "baixo",
    productId: 145,
    gauge: "040 / 095",
    gaugeNote: "níquel plated steel",
    title: "Níquel para baixo",
    use: "Grave firme e definido: para segurar o groove.",
    pills: ["4 cordas", "light", "groove"],
    from: "#3f2310",
    to: "#7d4a28",
  },
  {
    key: "viola",
    productId: 258,
    gauge: "Cebolão Ré",
    gaugeNote: "afinação tradicional · 10 cordas",
    title: "Viola caipira",
    use: "O som do interior do Brasil: afinação cebolão, a mais usada na viola.",
    pills: ["10 cordas", "níquel", "tensão média"],
    from: "#6f4f1e",
    to: "#b08948",
  },
];

/** textura de cordas verticais — 6 linhas, espessuras crescentes (mizinha→bordão) */
function StringsTexture() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 300 420">
      {[0.6, 0.9, 1.3, 1.8, 2.4, 3].map((w, i) => (
        <line key={i} x1={46 + i * 42} y1="0" x2={46 + i * 42} y2="420" stroke="#fff" strokeWidth={w} opacity={0.09} />
      ))}
    </svg>
  );
}

function FamilyCard({ f }: { f: Family }) {
  const product = allProducts.find((p) => p.id === f.productId);
  if (!product) return null;
  return (
    <Link
      to={`/produto/${product.id}`}
      className="group relative flex w-[248px] flex-shrink-0 snap-start flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 md:w-[286px]"
      style={{
        borderRadius: "var(--radius-card-xl)",
        background: `linear-gradient(170deg, ${f.from} 0%, ${f.to} 100%)`,
        textDecoration: "none",
        boxShadow: "0 18px 44px -22px rgba(17,17,17,0.40)",
        // altura definida pelo conteúdo (CTA nunca corta); flex stretch iguala os cards
      }}
      aria-label={`${f.title}: ${product.name}`}
    >
      <StringsTexture />

      {/* sem z-index aqui: stacking context isolaria o multiply da imagem
          (blend não atravessaria até o gradiente do card) */}
      <div className="relative flex h-full flex-col items-center px-6 pb-6 pt-7 text-center">
        {/* calibre gigante — o "009/012/010" da ref */}
        <p className="num" style={{ fontFamily: "var(--font-family-inter)", fontWeight: 800, fontSize: "clamp(26px,2.4vw,34px)", letterSpacing: "0.02em", lineHeight: 1, color: "#fff", margin: 0 }}>
          {f.gauge}
        </p>
        <p style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "7px 0 0" }}>
          {f.gaugeNote}
        </p>
        <p style={{ fontFamily: "var(--font-family-figtree)", fontStyle: "italic", fontSize: 17, lineHeight: 1.3, color: "#fff", margin: "12px 0 0" }}>
          {f.title}
        </p>

        {/* "pacote" físico pendurado (ref SG: o pacote branco É o objeto) —
            embalagem legível em qualquer fundo, sem multiply apagado */}
        <div
          className="relative mt-4 w-[54%] transition-transform duration-300 group-hover:scale-[1.04] group-hover:rotate-[2deg]"
          style={{
            aspectRatio: "3 / 3.6",
            background: "#fff",
            borderRadius: 9,
            boxShadow: "0 18px 30px -16px rgba(0,0,0,0.42), 0 2px 5px rgba(0,0,0,0.14)",
            padding: "16px 8px 8px",
          }}
        >
          {/* furo de pendurar do pacote */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[7px] block -translate-x-1/2 rounded-full"
            style={{ width: 9, height: 9, background: f.from, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)" }}
          />
          <div className="relative h-full w-full">
            <ImageWithFallback
              src={getPrimaryProductImage(product)}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-auto w-full">
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, lineHeight: 1.45, color: "rgba(255,255,255,0.92)", margin: "14px 0 0" }}>
            {f.use}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {f.pills.map((p) => (
              <span key={p} className="rounded-pill" style={{ background: "rgba(0,0,0,0.28)", padding: "4px 10px", fontFamily: "var(--font-family-inter)", fontSize: 11, fontWeight: 600, color: "#fff" }}>
                {p}
              </span>
            ))}
          </div>
          {/* CTA: fundo claro translúcido + fonte ink (legível em todo card);
              hover vira branco sólido. Cor inline — classe text-white é
              remapeada pra ink pelo light-scope. */}
          <span
            className="mt-4 inline-flex items-center gap-2 rounded-pill transition-colors group-hover:bg-white"
            style={{ background: "rgba(255,255,255,0.85)", color: "#111111", padding: "9px 20px", fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: 13.5 }}
          >
            <ArrowRight size={15} strokeWidth={2.4} />
            comprar · <span className="num">{product.price}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EncordoamentosShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }, []);

  return (
    <section style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-md)" }}>
      <div className="mx-auto w-full px-5 md:px-12" style={{ maxWidth: "1680px" }}>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <SectionHeader eyebrow="Cordas & Encordoamentos" title="Qual corda é a sua?" size="lg" weight={700} />
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 15, color: "var(--ink-soft)", margin: "14px 0 0" }}>
              A corda certa muda o som. Escolha pela família, a gente explica o resto.
            </p>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/produtos?category=Cordas%20%26%20Encordoamentos"
              style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: 14, color: "var(--amber-deep)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Ver todas →
            </Link>
            <CarouselNavButton direction="left" onClick={() => scrollBy(-1)} />
            <CarouselNavButton direction="right" onClick={() => scrollBy(1)} />
          </div>
        </div>

        <div ref={trackRef} className="shelf-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {FAMILIES.map((f) => (
            <FamilyCard key={f.key} f={f} />
          ))}
        </div>

        {/* mini-guia — educação curta no ponto de decisão (§5.3) */}
        <div className="mt-7 grid grid-cols-1 gap-4 border-t pt-6 md:grid-cols-3" style={{ borderColor: "var(--border)" }}>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, lineHeight: 1.5, color: "var(--ink-meta)", margin: 0 }}>
            <strong style={{ color: "var(--ink-strong)" }}>Calibre</strong> = espessura da corda: quanto maior o número, mais volume e mais tensão.
          </p>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, lineHeight: 1.5, color: "var(--ink-meta)", margin: 0 }}>
            <strong style={{ color: "var(--ink-strong)" }}>Nylon vs aço</strong>: nylon é macio e quente (clássico); aço é brilhante e projetado (folk).
          </p>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, lineHeight: 1.5, color: "var(--ink-meta)", margin: 0 }}>
            Na dúvida?{" "}
            <Link to="/produtos?category=Viol%C3%B5es" style={{ color: "var(--amber-deep)", fontWeight: 700, textDecoration: "none" }}>
              Guia do iniciante →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
