"use client";

import { SectionHeader } from "../components/section/SectionHeader";
import { GhostButton } from "../components/section/GhostButton";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardV2 } from "./ProductCardV2";
import type { Product } from "../components/productsData";

/* BannerShelf — dobra de banner fixo + trilho de produtos.

   Duas dobras da home usam esse mesmo desenho e alternam o lado do banner:
   "Seu primeiro violão" (banner à esquerda) e "Chegou agora" (banner à
   direita). Alternar o lado dá ritmo à página — duas prateleiras idênticas
   seguidas leem como a mesma seção repetida.

   O banner tem a altura do card (aspect 436/556) e só aparece no desktop: no
   mobile ele roubaria a primeira tela inteira do trilho. As setas surgem no
   hover da dobra. */

export type ShelfBanner = {
  eyebrow: string;
  /** título da seção, fora da arte */
  title: string;
  /** manchete sobre a arte — o número ou o selo que trava a decisão */
  headline: string;
  sub: string;
  cta: string;
  href: string;
  /** art: arte final em /ofertas/<key>.jpg; img: foto provisória */
  art: string;
  img: string;
  /** object-position do recorte, para o assunto não sair no corte */
  focus?: string;
};

interface BannerShelfProps {
  banner: ShelfBanner;
  itens: Product[];
  /** lado do banner no desktop */
  side?: "left" | "right";
  /** escurece a arte quando a foto é clara demais pro texto branco */
  overlay?: string;
  background?: string;
}

const OVERLAY_PADRAO = "linear-gradient(180deg, rgba(20,18,16,.10) 40%, rgba(20,18,16,.62) 100%)";

function BannerArt({ art, img, focus }: { art: string; img: string; focus?: string }) {
  const [src, setSrc] = useState(art);
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      onError={() => setSrc(img)}
      style={{ objectPosition: focus ?? "center" }}
      /* zoom no hover do banner inteiro, como no card de produto. Anima
         `scale` e não `transform`: o Tailwind v4 escreve a escala na
         propriedade `scale`, que `transition-transform` não alcança. */
      className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/banner:scale-[1.06]"
    />
  );
}

export function BannerShelf({
  banner,
  itens,
  side = "left",
  overlay = OVERLAY_PADRAO,
  background = "#ffffff",
}: BannerShelfProps) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

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
  }, [itens]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  const seta: CSSProperties = {
    background: "#ffffff",
    border: "1px solid var(--border)",
    color: "var(--ink-strong)",
    boxShadow: "0 8px 24px -14px rgba(17,17,17,.5)",
  };

  return (
    <section className="px-5 py-20 md:px-12" style={{ background }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-8">
          <SectionHeader eyebrow={banner.eyebrow} title={banner.title} size="lg" weight={700} />
        </div>

        {/* banner + trilho — `flex-row-reverse` joga o banner pro outro lado
            sem mexer na ordem do DOM: o trilho continua vindo antes na leitura
            e no tab, que é a ordem que importa pra quem navega por teclado. */}
        <div className={`group/shelf relative flex gap-6 ${side === "right" ? "lg:flex-row-reverse" : ""}`}>
          {/* banner — mesma altura dos cards */}
          <Link
            to={banner.href}
            className="group/banner relative hidden w-[26%] min-w-[320px] flex-shrink-0 self-start overflow-hidden lg:block"
            style={{ borderRadius: "8px", aspectRatio: "436 / 556" }}
          >
            <BannerArt art={banner.art} img={banner.img} focus={banner.focus} />
            <div className="absolute inset-0" style={{ background: overlay }} />
            {/* texto centralizado no rodapé, como na referência */}
            <div className="relative flex h-full flex-col items-center justify-end px-7 pb-9 text-center">
              <h3 style={{ fontFamily: "var(--font-family-inter)", fontSize: "24px", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {banner.headline}
              </h3>
              <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "rgba(255,255,255,.92)", margin: "10px 0 0", lineHeight: 1.45 }}>
                {banner.sub}
              </p>
              {/* mesmo CTA fantasma da dobra de acessórios — o link sublinhado
                  que morava aqui não tinha área de clique nem estado de pressed */}
              <GhostButton as="span" size="sm" className="mt-5 w-full">
                {banner.cta}
              </GhostButton>
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
              style={seta}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Próximo"
              disabled={!canNext}
              className="absolute right-3 top-[38%] z-[3] hidden h-11 w-11 translate-x-2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/shelf:translate-x-0 group-hover/shelf:opacity-100 disabled:cursor-default disabled:opacity-0 lg:flex"
              style={seta}
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
