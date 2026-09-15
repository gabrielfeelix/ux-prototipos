"use client";

import { SectionHeader } from "../components/section/SectionHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ProductCardV2 } from "./ProductCardV2";
import { allProducts, type Product } from "../components/productsData";
import { getCatalogHref, getVisibleCatalogProducts } from "../components/productPresentation";
import { primeiroInstrumento } from "./curadoria";
import { formatBRL, getPixPrice } from "../components/productEnhancements";

/* OfertasV2 — prateleira com banner fixo à esquerda + trilho de produtos.
   As setas só aparecem no hover; a barra embaixo mostra a posição do scroll.

   Esta dobra fala com UM público: quem nunca tocou. Antes era um segundo
   "Mais vendidos" — a home já tem um logo abaixo, e os dois brigavam pelos
   mesmos produtos. Público é recorte que a prova social não cobre, e o banner
   só funciona quando tem uma promessa própria pra carregar. */

type Banner = {
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  /** art: arte final em /ofertas/<key>.jpg; img: foto provisória */
  art: string;
  img: string;
};

const BANNER: Banner = {
  eyebrow: "Pra quem está começando",
  /* o header já diz "Seu primeiro violão"; a arte carrega o preço, que é o
     que trava a decisão de quem nunca comprou instrumento. O valor entra em
     runtime, do menor preço da própria seleção. */
  title: "Seu primeiro violão",
  sub: "Chega afinado e regulado de fábrica, com garantia Tonante de 1 ano.",
  cta: "Ver violões de estudo",
  href: getCatalogHref({ category: "Violões" }),
  art: "/ofertas/primeiro-violao.jpg",
  img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=85&auto=format&fit=crop",
};

interface OfertasV2Props {
  /** seleção vinda da home (ver v2/curadoria.ts). Sem ela, cai nos violões de
      entrada do catálogo — a seção nunca aparece vazia. */
  productIds?: number[];
}

function BannerArt({ art, img }: { art: string; img: string }) {
  const [src, setSrc] = useState(art);
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      onError={() => setSrc(img)}
      /* zoom no hover do banner inteiro, como no card de produto. Anima
         `scale` e não `transform`: o Tailwind v4 escreve a escala na
         propriedade `scale`, que `transition-transform` não alcança. */
      className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/banner:scale-[1.06]"
    />
  );
}

export function OfertasV2({ productIds }: OfertasV2Props) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const itens = useMemo(() => {
    const visivel = getVisibleCatalogProducts(allProducts);
    const escolhidos = (productIds ?? [])
      .map((id) => visivel.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return escolhidos.length > 0 ? escolhidos : primeiroInstrumento(12);
  }, [productIds]);

  /* mesmo preço que o card mostra (pix), senão a arte promete um valor e o
     primeiro card ao lado dela mostra outro. */
  const menorPreco = useMemo(
    () => (itens.length ? formatBRL(Math.min(...itens.map((p) => getPixPrice(p)))) : "R$ 399"),
    [itens],
  );

  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  };

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    sync();
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="px-5 py-20 md:px-12" style={{ background: "#ffffff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-8">
          <SectionHeader eyebrow={BANNER.eyebrow} title={BANNER.title} size="lg" weight={700} />
        </div>

        {/* banner + trilho */}
        <div className="group/shelf relative flex gap-6">
          {/* banner — mesma altura dos cards */}
          <Link
            to={BANNER.href}
            className="group/banner relative hidden w-[26%] min-w-[320px] flex-shrink-0 self-start overflow-hidden lg:block"
            style={{ borderRadius: "8px", aspectRatio: "436 / 556" }}
          >
            <BannerArt art={BANNER.art} img={BANNER.img} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,18,16,.10) 40%, rgba(20,18,16,.62) 100%)" }} />
            {/* texto centralizado no rodapé, como na referência */}
            <div className="relative flex h-full flex-col items-center justify-end px-7 pb-9 text-center">
              <h3 style={{ fontFamily: "var(--font-family-inter)", fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                A partir de {menorPreco}
              </h3>
              <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "rgba(255,255,255,.92)", margin: "10px 0 0", lineHeight: 1.45 }}>
                {BANNER.sub}
              </p>
              <span
                className="mt-4 inline-block"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600, color: "#fff", borderBottom: "1px solid rgba(255,255,255,.85)", paddingBottom: 3 }}
              >
                {BANNER.cta}
              </span>
            </div>
          </Link>

          {/* trilho */}
          <div className="relative min-w-0 flex-1">
            <div
              ref={trackRef}
              onScroll={sync}
              className="no-bar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {itens.map((p) => (
                <ProductCardV2
                  key={p.id}
                  product={p}
                  className="flex-shrink-0 snap-start"
                  style={{ width: "calc((100% - 48px) / 3)", minWidth: 280 }}
                />
              ))}
            </div>

            {/* setas — só no hover da seção */}
            <button
              onClick={() => nudge(-1)}
              aria-label="Anterior"
              disabled={!canPrev}
              className="absolute left-3 top-[38%] z-[3] hidden h-11 w-11 -translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shelf:translate-x-0 group-hover/shelf:opacity-100 disabled:cursor-default disabled:opacity-0 lg:flex"
              style={{ background: "#ffffff", border: "1px solid var(--border)", color: "var(--ink-strong)", boxShadow: "0 8px 24px -14px rgba(17,17,17,.5)" }}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Próximo"
              disabled={!canNext}
              className="absolute right-3 top-[38%] z-[3] hidden h-11 w-11 translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shelf:translate-x-0 group-hover/shelf:opacity-100 disabled:cursor-default disabled:opacity-0 lg:flex"
              style={{ background: "#ffffff", border: "1px solid var(--border)", color: "var(--ink-strong)", boxShadow: "0 8px 24px -14px rgba(17,17,17,.5)" }}
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
