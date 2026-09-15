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
import { SectionHeader, CarouselNavButton } from "./section";
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
}: ProductShelfProps) {
  const isGrid = layout === "grid";
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

        <div className="relative">
          {!isGrid && navBtn(() => scrollByCards(-1), !canPrev, "Anterior", "left")}
          {!isGrid && navBtn(() => scrollByCards(1), !canNext, "Próximo", "right")}
          <div
            ref={scrollRef}
            className={
              isGrid
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
      </div>
    </section>
  );
}
