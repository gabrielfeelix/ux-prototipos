"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { Heart, Eye, ShoppingBag, Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts, type Product } from "./productsData";
import { getProductSwatches, getPrimaryProductImage } from "./productPresentation";
import { getProductAttributes } from "./productAttributes";
import { getInstallmentCount, getInstallmentValue, getLuthier } from "./productEnhancements";
import { TimbrePlayer } from "./TimbrePlayer";
import { getCardSpecs } from "./productAttributes";
import { Button, DiscountBadge } from "./section";
import { useFavorites } from "./FavoritesContext";
import { useCardVariant } from "./CardVariantContext";
import { type CompareCardState } from "./CompareBar";
import { ProductCardV2 } from "../v2/ProductCardV2";

/**
 * ProductCard — card de produto Tonante (porta o design do protótipo de marca
 * em _ref/src/components.jsx: card creme, badge brick, botão Comprar âmbar no
 * hover, preço em Bodoni com PIX). Mantém a API do template (variant, rank,
 * swatches, favorite, hoverMedia, onAdd).
 */

type ProductCardVariant = "shelf" | "grid";

const fmtBRL = (n: number) =>
  "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  href?: string;
  rank?: number;
  swatches?: boolean;
  favorite?: boolean;
  hoverMedia?: ReactNode;
  emphasizeDiscount?: boolean;
  onAdd?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
  compare?: CompareCardState;
  className?: string;
  style?: CSSProperties;
}

/* Wrapper de variante: dentro de /v2 (CardVariantProvider) o card assume o
   formato em teste; no resto do site segue o card clássico da v1. */
export function ProductCard(props: ProductCardProps) {
  const variant = useCardVariant();
  if (variant === "v2") {
    const { product, href, rank, onAdd, className, style, compare } = props;
    // o card da v2 não tem moldura: descarta o realce de borda/sombra que a
    // prateleira aplica no #1 (isso é linguagem do card clássico)
    const { borderColor: _b, boxShadow: _s, border: _br, background: _bg, ...cleanStyle } = style ?? {};
    return <ProductCardV2 product={product} href={href} rank={rank} onAdd={onAdd} className={className} style={cleanStyle} compare={compare} />;
  }
  return <ProductCardClassic {...props} />;
}

function ProductCardClassic({
  product,
  href = `/produto/${product.id}`,
  rank,
  swatches = false,
  favorite = false,
  hoverMedia,
  emphasizeDiscount = false,
  onAdd,
  onFavorite,
  className = "",
  style,
}: ProductCardProps) {
  // Favorito é estado global (Set por id) — toggle real add/remove.
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavorited = isFavorite(product.id);
  const [selectedSwatchId, setSelectedSwatchId] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const navigate = useNavigate();

  const swatchList = swatches ? getProductSwatches(product) : [];
  const selectedProduct = selectedSwatchId
    ? allProducts.find((p) => p.id === selectedSwatchId) ?? product
    : product;

  const gallery = selectedProduct.images && selectedProduct.images.length
    ? selectedProduct.images.slice(0, 4)
    : [selectedProduct.image];
  const nImg = gallery.length;
  const image = gallery[((imgIdx % nImg) + nImg) % nImg];

  const oldPriceNum =
    product.oldPriceNum ?? (emphasizeDiscount ? product.priceNum * 1.18 : 0);
  const discount =
    oldPriceNum > product.priceNum
      ? Math.round(((oldPriceNum - product.priceNum) / oldPriceNum) * 100)
      : 0;

  // linha de acabamento (ref Gibson "Iguana Burst"): cor/acabamento do nome,
  // senão a subcategoria/linha.
  const attrs = getProductAttributes(product);
  const finish = attrs.cor || attrs.linha || product.subcategory;
  // usados só no quick-view (espiar) — card resting é minimal
  const eyebrowBase =
    (product.tags || []).filter((t) => t !== product.category).slice(0, 2).join(" · ") ||
    product.subcategory ||
    product.category;
  const eyebrow =
    product.brand && product.brand !== "Tonante" ? `${product.brand} · ${eyebrowBase}` : eyebrowBase;
  const pix = product.priceNum * 0.9;
  const installments = getInstallmentCount(product.priceNum);
  const installmentValue = getInstallmentValue(product.priceNum);
  const cardSpecs = getCardSpecs(product);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    onFavorite?.(product);
  };
  const cycle = (e: React.MouseEvent, d: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + d + nImg) % nImg);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[8px] bg-white transition-shadow duration-300 shadow-[0_1px_3px_-1px_rgba(17,17,17,0.05),0_8px_22px_-12px_rgba(17,17,17,0.13)] hover:shadow-[0_6px_14px_-4px_rgba(17,17,17,0.09),0_18px_36px_-14px_rgba(17,17,17,0.20)] ${className}`}
      style={style}
    >
      <Link to={href} className="flex flex-1 flex-col">
        {/* imagem — well full-bleed lateral (ocupa o card de borda a borda) */}
        <div className="relative">
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)",
            }}
          >
            <ImageWithFallback
              src={image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-contain p-[5%] transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ mixBlendMode: "multiply" }}
            />
            {/* hover-swap: 2ª foto entra em crossfade (só na foto base, não
                durante navegação por chevron) — well opaco cobre a base */}
            {nImg > 1 && imgIdx === 0 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)" }}
              >
                <ImageWithFallback
                  src={gallery[1]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-[5%]"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            )}
            {hoverMedia}

            {/* topo-esquerda: só o medalhão de ranking — badges viraram linha
                tipográfica no conteúdo (ref Gibson "New | Limited"), foto limpa */}
            {rank !== undefined && (
              <div className="absolute left-3.5 top-3.5 z-20">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    // #1 ganha medalhão âmbar (ouro); demais ficam ink
                    background: rank === 1 ? "var(--gradient-brand)" : "var(--ink-strong)",
                    color: rank === 1 ? "#fff" : "var(--background)",
                    boxShadow: rank === 1 ? "var(--shadow-medallion)" : undefined,
                    fontFamily: "var(--font-family-figtree)",
                    fontWeight: 700,
                    fontSize: "15px",
                  }}
                >
                  {rank}
                </span>
              </div>
            )}

            {/* ações topo-direita: favoritar + espiar (hover) */}
            <div className="absolute right-3.5 top-3.5 z-20 flex flex-col gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <button
                onClick={handleFavorite}
                aria-label="Favoritar"
                className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(17,17,17,0.12)] transition-colors cursor-pointer"
                style={{ background: "rgba(255,255,255,0.92)", color: isFavorited ? "#b3361f" : "#111111" }}
              >
                <Heart size={16} strokeWidth={1.8} fill={isFavorited ? "#b3361f" : "none"} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickOpen(true);
                }}
                aria-label="Espiar produto"
                className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(17,17,17,0.12)] cursor-pointer"
                style={{ background: "rgba(255,255,255,0.92)", color: "#111111" }}
              >
                <Eye size={16} strokeWidth={1.8} />
              </button>
            </div>

            {/* setas de imagem (hover, se >1) */}
            {nImg > 1 && (
              <>
                <button
                  onClick={(e) => cycle(e, -1)}
                  aria-label="Imagem anterior"
                  className="absolute left-2 top-[42%] z-20 flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.85)", color: "#111111" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => cycle(e, 1)}
                  aria-label="Próxima imagem"
                  className="absolute right-2 top-[42%] z-20 flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.85)", color: "#111111" }}
                >
                  <ChevronRight size={16} />
                </button>
                {/* dots */}
                <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-1.5">
                  {gallery.map((_, i) => (
                    <span
                      key={i}
                      className="h-[5px] rounded-full transition-all"
                      style={{
                        width: imgIdx % nImg === i ? 14 : 5,
                        background: imgIdx % nImg === i ? "#fff" : "rgba(255,255,255,0.55)",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        {/* conteúdo minimal (ref Gibson): badge → nome → marca → acabamento →
            preço. Sem rating, specs, chips ou PIX — isso vive na PDP. */}
        <div className="flex flex-1 flex-col gap-1 px-3.5 pb-4 pt-1.5">
          {(product.badge || discount > 0 || getLuthier(product)) && (
            <span className="flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 500 }}>
              {product.badge && product.badge !== "Oferta" && (
                <span style={{ color: "var(--amber-deep)" }}>{product.badge}</span>
              )}
              {product.badge && product.badge !== "Oferta" && discount > 0 && (
                <span aria-hidden="true" style={{ color: "var(--edge-strong)" }}>|</span>
              )}
              {(discount > 0 || product.badge === "Oferta") && (
                <span style={{ color: "#b3361f" }}>Oferta{discount > 0 ? ` · -${discount}%` : ""}</span>
              )}
              {getLuthier(product) && (
                <>
                  {(product.badge || discount > 0) && (
                    <span aria-hidden="true" style={{ color: "var(--edge-strong)" }}>|</span>
                  )}
                  <span style={{ color: "var(--amber-deep)" }}>✍ Assinado</span>
                </>
              )}
            </span>
          )}
          <h3
            className="line-clamp-2 text-ink-strong"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: 0,
            }}
          >
            {product.name}
          </h3>
          {product.brand && (
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", color: "var(--ink-meta)" }}>
              {product.brand}
            </span>
          )}
          {finish && (
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", color: "var(--ink-meta)" }}>
              {finish}
            </span>
          )}

          {/* preço — discreto (ref Gibson), sem parcelas no card */}
          <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-3">
            {oldPriceNum > product.priceNum && (
              <span
                className="line-through num"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-meta)" }}
              >
                {product.oldPrice ?? fmtBRL(oldPriceNum)}
              </span>
            )}
            <span
              className="num"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "17px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: discount > 0 ? "var(--amber-deep)" : "var(--ink-strong)",
              }}
            >
              {product.price}
            </span>
          </div>
        </div>
      </Link>

      {/* variantes — miniaturas reais do produto (ref Gibson), não bolinhas */}
      {swatchList.length > 0 && (
        <div className="flex items-center gap-2 px-3.5 pb-4">
          {swatchList.slice(0, 3).map((s) => {
            const variantProduct = allProducts.find((p) => p.id === s.productId);
            const active = selectedSwatchId === s.productId;
            return (
              <button
                key={s.productId}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSwatchId(s.productId === selectedSwatchId ? null : s.productId);
                  setImgIdx(0);
                }}
                className="relative h-11 w-11 flex-shrink-0 overflow-hidden cursor-pointer transition-all hover:scale-105"
                aria-label={s.label}
                aria-pressed={active}
                type="button"
                style={{
                  borderRadius: 6,
                  background: "var(--well)",
                  border: active ? "2px solid var(--ink-soft)" : "1px solid var(--border)",
                }}
              >
                <ImageWithFallback
                  src={variantProduct ? getPrimaryProductImage(variantProduct) : product.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-1"
                  style={{ mixBlendMode: "multiply" }}
                />
              </button>
            );
          })}
          {swatchList.length > 3 && (
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 600, color: "var(--ink-meta)" }}>
              +{swatchList.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Quick view (espiar) — portal no body p/ escapar do transform/overflow do card */}
      {quickOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(17,17,17,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setQuickOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden md:grid-cols-2"
            style={{ background: "var(--surface-1)", borderRadius: "var(--radius-card-xl)", boxShadow: "var(--shadow-float)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickOpen(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full cursor-pointer"
              style={{ background: "rgba(255,255,255,0.92)", color: "#111111", boxShadow: "0 2px 8px rgba(17,17,17,0.12)" }}
            >
              <X size={17} />
            </button>

            {/* imagem */}
            <div className="relative aspect-square md:aspect-auto" style={{ background: "linear-gradient(160deg, #f7f7f7, #ececec)" }}>
              <ImageWithFallback src={image} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-8" style={{ mixBlendMode: "multiply" }} />
              {discount > 0 && (
                <span className="absolute left-5 top-5">
                  <DiscountBadge percent={discount} />
                </span>
              )}
            </div>

            {/* info */}
            <div className="flex flex-col gap-3 p-6 md:p-8">
              <span className="label" style={{ fontSize: "10px", color: "var(--amber-deep)" }}>
                {eyebrow}
              </span>
              <h3 style={{ fontFamily: "var(--font-family-inter)", fontSize: "20px", fontWeight: 700, lineHeight: 1.25, letterSpacing: 0, color: "var(--ink-strong)" }}>
                {product.name}
              </h3>
              {/* demonstração de timbre no espiar (V3 §8.1) */}
              <TimbrePlayer product={product} variant="compact" className="w-fit" />
              <span className="flex items-center gap-1.5">
                <span className="flex" style={{ color: "var(--amber)" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} strokeWidth={1.5} fill={product.rating - i >= 0.5 ? "var(--amber)" : "none"} stroke={product.rating - i >= 0.5 ? "var(--amber)" : "rgba(17,17,17,0.3)"} />
                  ))}
                </span>
                <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", color: "var(--ink-meta)" }}>
                  {product.rating.toFixed(1)} · {product.reviews} avaliações
                </span>
              </span>
              {cardSpecs.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {cardSpecs.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-pill"
                      style={{
                        fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", fontWeight: 600,
                        color: "var(--ink-strong)", background: "var(--surface-2)",
                        border: "1px solid var(--edge)", padding: "3px 10px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {product.description && (
                <p className="line-clamp-4" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  {product.description}
                </p>
              )}
              <div className="mt-auto pt-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  {oldPriceNum > product.priceNum && (
                    <span className="line-through num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", color: "var(--ink-meta)" }}>
                      {product.oldPrice ?? fmtBRL(oldPriceNum)}
                    </span>
                  )}
                  <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-price-xl)", fontWeight: 700, letterSpacing: "-0.01em", color: discount > 0 ? "var(--amber-deep)" : "var(--ink-strong)" }}>
                    {product.price}
                  </span>
                </div>
                <div className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-meta)", color: "var(--ink-soft)", marginTop: 3 }}>
                  No PIX <strong style={{ color: "var(--amber-deep)" }}>{fmtBRL(pix)}</strong> · ou {installments}x de {fmtBRL(installmentValue)}
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {onAdd && (
                  <Button
                    hierarchy="primary"
                    intent="buy"
                    size="lg"
                    block
                    onClick={() => {
                      onAdd(product);
                      setQuickOpen(false);
                    }}
                  >
                    <ShoppingBag size={17} strokeWidth={2} />
                    Adicionar à sacola
                  </Button>
                )}
                <Button
                  hierarchy="ghost"
                  intent="neutral"
                  size="md"
                  block
                  onClick={() => {
                    setQuickOpen(false);
                    navigate(href);
                  }}
                >
                  Ver página completa
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </article>
  );
}
