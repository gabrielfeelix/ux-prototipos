"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useCart } from "./CartContext";
import { allProducts, type Product } from "./productsData";
import {
  getPrimaryProductImage,
  getVisibleCatalogProducts,
} from "./productPresentation";
import { CarouselDots } from "./CarouselDots";
import { SectionHeader, CarouselNavButton, GhostButton } from "./section";
import { ProductCard } from "./ProductCard";

export interface ShelfTab {
  /** rótulo do pill de aba */
  tabLabel: string;
  eyebrow: string;
  title: string;
  /** uma linha dizendo o que a seleção entrega (preço, público, prazo) */
  subtitle?: string;
  productIds: number[];
  showRanking?: boolean;
}

interface ProductShelfProps {
  label: string;
  title: string;
  /** uma linha abaixo do título com a proposta da seleção */
  subtitle?: string;
  /** destino do "ver tudo" — sem ele a dobra não tem saída pro catálogo */
  href?: string;
  ctaLabel?: string;
  productIds: number[];
  showRanking?: boolean;
  emphasizeDiscount?: boolean;
  /** Abas alternáveis (ex.: Mais vendidos | Lançamentos). Quando presente,
      eyebrow/título/produtos vêm da aba ativa; props soltas viram fallback. */
  tabs?: ShelfTab[];
  /** "rail" (padrão) é o trilho que rola de lado; "grid" mostra tudo de uma vez,
      em 5 colunas no desktop e 2 no mobile. Grid é pra seção de varredura —
      acessório e corda, que ninguém leva um só — e pra não deixar dois trilhos
      colados na mesma página. */
  layout?: "rail" | "grid";
  /** Só no layout "grid": arte que fica presa (sticky) na metade direita da
      dobra enquanto a grade da esquerda rola. A grade passa a ter 2 colunas —
      a arte come metade da largura, e 5 colunas em 50% viram card de miniatura. */
  stickyBanner?: ShelfStickyBanner;
}

export interface ShelfStickyBanner {
  /** manchete sobre a arte */
  headline: string;
  sub?: string;
  cta: string;
  href: string;
  /** arte final; se faltar, cai em `img` */
  art: string;
  img: string;
  /** escurece a foto quando ela é clara demais para o texto branco */
  overlay?: string;
  /** object-position do recorte. O container é mais alto que a arte 4:5, então
      o corte come topo e base; use isto para manter o assunto no quadro. */
  focus?: string;
}

export function ProductShelf({
  label,
  title,
  subtitle,
  href,
  ctaLabel = "Ver tudo",
  productIds,
  showRanking = false,
  emphasizeDiscount = false,
  tabs,
  layout = "rail",
  stickyBanner,
}: ProductShelfProps) {
  const isGrid = layout === "grid";
  const splitGrid = isGrid && !!stickyBanner;
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();

  const current = tabs?.[activeTab];
  const effectiveEyebrow = current?.eyebrow ?? label;
  const effectiveTitle = current?.title ?? title;
  const effectiveSubtitle = current?.subtitle ?? (tabs ? undefined : subtitle);
  const effectiveIds = current?.productIds ?? productIds;
  // com abas, ranking é decisão da aba (ausente = false); sem abas, da prop
  const effectiveRanking = tabs ? (current?.showRanking ?? false) : showRanking;

  const selectTab = (i: number) => {
    setActiveTab(i);
    scrollRef.current?.scrollTo({ left: 0 });
  };

  const products = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    const resolved = effectiveIds
      .map((id) => visible.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return resolved.length > 0 ? resolved : visible.slice(0, 8);
  }, [effectiveIds]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [products]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width ?? 380;
    const cardWithGap = cardWidth + 24;
    el.scrollBy({ left: dir * cardWithGap * 2, behavior: "smooth" });
  };

  const navBtn = (onClick: () => void, disabled: boolean, label: string, side: "left" | "right") => (
    <CarouselNavButton
      direction={side}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-[228px] -translate-y-1/2 ${side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
    />
  );

  return (
    <section
      ref={ref}
      className="px-5 py-12 md:px-12 md:py-14"
      style={{ background: "var(--surface-0)" }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <SectionHeader eyebrow={effectiveEyebrow} title={effectiveTitle} size="sm" weight={600} />
            {effectiveSubtitle && (
              <p
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "15px",
                  lineHeight: 1.5,
                  color: "var(--ink-soft)",
                  margin: "10px 0 0",
                }}
              >
                {effectiveSubtitle}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
          {href && (
            <Link
              to={href}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-ink-strong"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--ink-soft)",
                textDecoration: "none",
              }}
            >
              {ctaLabel}
              <ArrowRight size={15} />
            </Link>
          )}
          {tabs && tabs.length > 1 && (
            <div role="tablist" aria-label={title} className="flex gap-2">
              {tabs.map((t, i) => {
                const on = i === activeTab;
                return (
                  <button
                    key={t.tabLabel}
                    role="tab"
                    aria-selected={on}
                    onClick={() => selectTab(i)}
                    className="rounded-pill cursor-pointer transition-colors"
                    style={{
                      padding: "9px 18px",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "14px",
                      fontWeight: 600,
                      background: on ? "var(--ink-strong)" : "var(--surface-1)",
                      color: on ? "var(--background)" : "var(--ink-strong)",
                      border: `1.5px solid ${on ? "var(--ink-strong)" : "var(--edge)"}`,
                    }}
                  >
                    {t.tabLabel}
                  </button>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* Com banner sticky a dobra vira duas colunas: a grade ocupa a metade
            da esquerda e rola junto com a página; a arte fica presa na direita
            até a última linha passar. A grade cai pra 2 colunas — em metade da
            largura, 5 colunas virariam miniatura. */}
        <div
          className={
            splitGrid
              /* `flex-row-reverse` põe a arte à esquerda sem mexer na ordem do
                 DOM: a grade continua vindo antes na leitura e no tab. */
              ? "flex flex-col gap-8 lg:flex-row-reverse lg:gap-10"
              : "relative"
          }
        >
          <div className={splitGrid ? "relative min-w-0 flex-1" : "contents"}>
          {!isGrid && navBtn(() => scrollByCards(-1), !canPrev, "Anterior", "left")}
          {!isGrid && navBtn(() => scrollByCards(1), !canNext, "Próximo", "right")}
          <div
            ref={scrollRef}
            className={
              splitGrid
                ? "grid grid-cols-2 gap-4 lg:gap-5"
                : isGrid
                ? "grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5"
                : "shelf-track flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            }
            style={isGrid ? undefined : { scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, i) => {
              const add = (p: Product) =>
                addItem({ id: p.id, name: p.name, price: p.price, image: getPrimaryProductImage(p) });
              return (
                <motion.div
                  key={product.id}
                  /* no grid o card estica até a altura da linha: quem tem
                     swatch de cor é mais alto e, sem isso, os cards da linha
                     terminam em alturas diferentes. */
                  className={isGrid ? "h-full" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.04 * i }}
                >
                  <ProductCard
                    product={product}
                    variant="shelf"
                    swatches
                    favorite
                    rank={effectiveRanking ? i + 1 : undefined}
                    emphasizeDiscount={emphasizeDiscount}
                    className={isGrid ? "h-full w-full" : "snap-start flex-shrink-0"}
                    style={{
                      ...(isGrid ? null : { width: "clamp(264px, 78vw, 380px)" }),
                      // #1 ranqueado ganha a stroke âmbar de destaque (mesma do champion)
                      ...(effectiveRanking && i === 0
                        ? { borderColor: "rgba(200,120,0,0.55)", boxShadow: "var(--shadow-category-active)" }
                        : {}),
                    }}
                    onAdd={add}
                  />
                </motion.div>
              );
            })}
          </div>
          {!isGrid && <CarouselDots trackRef={scrollRef} />}
          </div>

          {stickyBanner && <StickyBanner banner={stickyBanner} />}
        </div>
      </div>
    </section>
  );
}

/* Arte presa na metade direita da dobra em grid.

   `sticky` + `top` do header colapsado: a arte para logo abaixo do menu e
   acompanha a rolagem até a grade da esquerda acabar. Altura em vh (não em
   aspect-ratio) porque o que precisa caber é a tela, não a proporção da foto —
   com aspect fixo a arte estouraria a viewport em telas baixas.

   Só no desktop: no mobile ela roubaria a primeira tela inteira da grade. */
const OVERLAY_STICKY =
  "linear-gradient(180deg, rgba(20,18,16,.12) 0%, rgba(20,18,16,.30) 52%, rgba(20,18,16,.66) 100%)";

function StickyBanner({ banner }: { banner: ShelfStickyBanner }) {
  const [src, setSrc] = useState(banner.art);

  return (
    <aside className="hidden lg:block lg:w-[46%] lg:flex-shrink-0">
      <Link
        to={banner.href}
        className="group/banner relative block overflow-hidden"
        style={{
          position: "sticky",
          /* header v2 colapsado mede 130px e é fixed: grudar antes disso enfia a
             arte por baixo do menu. 140 = 130 do header + 10px de respiro. */
          top: 140,
          height: "calc(100vh - 180px)",
          minHeight: 560,
          borderRadius: "10px",
        }}
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setSrc(banner.img)}
          style={{ objectPosition: banner.focus ?? "center" }}
          className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/banner:scale-[1.05]"
        />
        <div className="absolute inset-0" style={{ background: banner.overlay ?? OVERLAY_STICKY }} />

        <div className="relative flex h-full flex-col justify-center px-10 text-center">
          <h3
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "clamp(28px, 2.2vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#fff",
              margin: 0,
            }}
          >
            {banner.headline}
          </h3>
          {banner.sub && (
            <p
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "15px",
                lineHeight: 1.5,
                color: "rgba(255,255,255,.92)",
                margin: "12px auto 0",
                maxWidth: "36ch",
              }}
            >
              {banner.sub}
            </p>
          )}

          {/* CTA ancorado no rodapé da arte: o texto fica no meio e o botão
              marca a saída sem competir com a manchete. `as="span"` porque o
              banner inteiro já é um link. */}
          <GhostButton as="span" size="lg" className="absolute inset-x-8 bottom-8 w-auto">
            {banner.cta}
          </GhostButton>
        </div>
      </Link>
    </aside>
  );
}
