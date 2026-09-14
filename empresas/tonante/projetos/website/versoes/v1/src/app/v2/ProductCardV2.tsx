"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, Star, Play, Square } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../components/CartContext";
import { type Product } from "../components/productsData";
import { getPrimaryProductImage, getProductImagesRanked, getProductSwatches, upgradeProductImage } from "../components/productPresentation";
import { allProducts } from "../components/productsData";
import { INSTRUMENT_FRAMING, FRAMING_PADRAO } from "./instrumentFraming";
import { getPixPrice, formatBRL } from "../components/productEnhancements";
import { getProductUrl } from "../lib/slug";
import { playStrum, stopStrum, presetForProduct } from "../lib/strum";

/* ProductCardV2 — card do teste /v2 (referência: tema Helix).
   Foto numa caixa cinza-clara sem borda, badges no topo, ações que só
   aparecem no hover, e fora da caixa: miniaturas, nome e preço. */

const GREEN = "#127a45";

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={13} strokeWidth={0} fill={i <= Math.round(rating) ? "#f0a020" : "rgba(51,51,51,.18)"} />
        ))}
      </span>
      <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "#8a8a8a" }}>
        ({reviews})
      </span>
    </span>
  );
}

interface ProductCardV2Props {
  product: Product;
  href?: string;
  rank?: number;
  onAdd?: (product: Product) => void;
  className?: string;
  style?: React.CSSProperties;
  /** "catalog" libera o espiar (olho); na home o card fica limpo */
  context?: "home" | "catalog";
}

export function ProductCardV2({ product: base, href, rank, onAdd, className = "", style, context = "home" }: ProductCardV2Props) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  /* As miniaturas são VARIANTES de acabamento (branca, preta, natural…),
     não fotos extras: cada uma é outro produto da mesma família. Clicar
     troca o produto exibido — nome, preço e link inclusive. */
  const swatches = getProductSwatches(base);
  const [variantId, setVariantId] = useState(base.id);
  const p = (variantId !== base.id ? allProducts.find((x) => x.id === variantId) : undefined) ?? base;
  const [shot, setShot] = useState(0);
  const [ctaHover, setCtaHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  // só instrumento toca timbre; corda/acessório não
  const isInstrument = ["Violões", "Guitarras", "Contrabaixos"].includes(p.category);
  const preset = isInstrument ? presetForProduct(p) : null;

  const to = href ?? getProductUrl(p);
  const primary = getPrimaryProductImage(p);
  /* Mede a URL em tamanho cheio porque é essa que o ImageWithFallback acaba
     exibindo — medir a thumb daria uma proporção que não é a de tela. */
  const candidates = [...new Set(getProductImagesRanked(p).map(upgradeProductImage))].slice(0, 4);
  /* Só packshot entra: fotos contextuais (banner de campanha, foto de cena)
     vêm em formato panorâmico e estouram a caixa quadrada do card. Mede a
     proporção real no load e descarta o que não for ~quadrado. */
  // guarda a proporção junto: é ela que decide o enquadramento na hora de exibir
  const [thumbs, setThumbs] = useState<{ src: string; ratio: number }[]>([{ src: primary, ratio: 1 }]);

  useEffect(() => {
    let alive = true;
    /* Mede cada candidata: descarta o que não couber na caixa e, entre as
       que couberem, prioriza a de maior resolução — a thumb 300x300 do
       Magento só entra se não houver original. Instrumento aceita retrato
       (o enquadramento é por corte); acessório precisa ser ~quadrado. */
    const [min, max] = isInstrument ? [0.3, 1.5] : [0.7, 1.4];
    Promise.all(
      candidates.map(
        (src) =>
          new Promise<{ src: string; ratio: number; area: number } | null>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const ratio = img.naturalWidth / img.naturalHeight;
              resolve(
                ratio >= min && ratio <= max
                  ? { src, ratio, area: img.naturalWidth * img.naturalHeight }
                  : null,
              );
            };
            img.onerror = () => resolve(null);
            img.src = src;
          }),
      ),
    ).then((list) => {
      if (!alive) return;
      const ok = (list.filter(Boolean) as { src: string; ratio: number; area: number }[])
        .sort((a, b) => b.area - a.area)
        .map(({ src, ratio }) => ({ src, ratio }));
      setThumbs(ok.length ? ok.slice(0, 3) : [{ src: primary, ratio: 1 }]);
      setShot(0);
    });
    return () => {
      alive = false;
    };
  }, [p.id]);
  const discount = p.oldPriceNum ? Math.round((1 - p.priceNum / p.oldPriceNum) * 100) : 0;
  const isNew = p.badge?.toLowerCase().includes("nov");

  const foto = thumbs[shot] ?? { src: primary, ratio: 1 };
  /* Instrumento entra sempre enquadrado no corpo, com `contain` + origem na
     base. O zoom não é fixo: cada foto tem margem branca diferente (o
     instrumento ocupa de 23% a 100% da largura do quadro), então o fator vem
     da tabela medida em instrumentFraming — é o que faz violão e guitarra
     terminarem do mesmo tamanho na tela. Foto deitada não recebe zoom. */
  const zoomNoCorpo = isInstrument && foto.ratio <= 1.2;
  const [zoom, dy] = INSTRUMENT_FRAMING[p.id] ?? FRAMING_PADRAO;

  const add = () => {
    if (onAdd) return onAdd(p);
    addItem({ id: p.id, name: p.name, price: p.price, image: primary });
  };

  return (
    <article className={`group/card flex flex-col ${className}`} style={style}>
      {/* caixa da foto */}
      <div
        className="relative overflow-hidden"
        style={{
          // cinza neutro (sem amarelo): o bege anterior encardia contra o branco da página
          background: "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)",
          borderRadius: "8px",
        }}
      >
        {/* badges */}
        <div className="absolute left-3 top-3 z-[2] flex flex-col items-start gap-1.5">
          {rank && (
            <span className="num rounded-pill px-2.5 py-1" style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 700 }}>
              #{rank}
            </span>
          )}
          {discount > 0 && (
            <span className="num rounded-pill px-3 py-1.5" style={{ background: GREEN, color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
          {isNew && (
            <span className="rounded-pill px-2.5 py-1" style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Novo
            </span>
          )}
        </div>

        {/* instrumento: ouvir o timbre. catálogo: espiar. home não-instrumento: nada */}
        {preset ? (
          <button
            onClick={() => {
              if (playing) {
                stopStrum();
                setPlaying(false);
                return;
              }
              setPlaying(true);
              playStrum(preset, () => setPlaying(false));
            }}
            aria-label={playing ? `Parar o timbre de ${p.name}` : `Ouvir o timbre de ${p.name}`}
            aria-pressed={playing}
            className="absolute right-3 top-3 z-[2] grid h-9 w-9 translate-x-2 cursor-pointer place-items-center rounded-full opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-0 group-hover/card:opacity-100"
            style={{
              background: playing ? "var(--ink-strong)" : "#ffffff",
              color: playing ? "#ffffff" : "var(--ink-strong)",
              opacity: playing ? 1 : undefined,
            }}
          >
            {playing ? <Square size={13} strokeWidth={2.6} fill="currentColor" /> : <Play size={15} strokeWidth={2} fill="currentColor" />}
          </button>
        ) : context === "catalog" ? (
          <button
            onClick={() => navigate(to)}
            aria-label={`Espiar ${p.name}`}
            className="absolute right-3 top-3 z-[2] grid h-9 w-9 translate-x-2 cursor-pointer place-items-center rounded-full opacity-0 transition-[opacity,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-0 group-hover/card:opacity-100"
            style={{ background: "#ffffff", color: "var(--ink-strong)" }}
          >
            <Eye size={16} strokeWidth={1.8} />
          </button>
        ) : null}

        {/* Instrumento: a foto é vertical e o corpo (tampo) é o que vende —
            enquadra nele com zoom, deixando o braço sair pelo topo, igual aos
            círculos de categoria. Acessório/corda é foto quadrada: cabe inteira. */}
        <Link to={to} className="block">
          <div className="relative aspect-square overflow-hidden">
            <ImageWithFallback
              src={foto.src}
              alt={p.name}
              className={`absolute inset-0 h-full w-full object-contain transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                zoomNoCorpo ? "origin-bottom group-hover/card:scale-105" : `group-hover/card:scale-[1.05] ${isInstrument ? "p-[6%]" : "p-[20%]"}`
              }`}
              style={{
                mixBlendMode: "multiply",
                ...(zoomNoCorpo ? { transform: `translateY(${dy}%) scale(${zoom})` } : null),
              }}
            />
          </div>
        </Link>

        {/* ação — aparece no hover, flutuando dentro da caixa */}
        <button
          onClick={add}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="absolute inset-x-3 bottom-3 z-[2] flex h-12 translate-y-2.5 cursor-pointer items-center justify-center rounded-pill opacity-0 transition-[opacity,translate,background-color,color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100"
          style={{
            background: ctaHover ? "var(--ink-strong)" : "#ffffff",
            color: ctaHover ? "#ffffff" : "var(--ink-strong)",
            padding: "6px 10px",
            fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600,
          }}
        >
          Comprar agora
        </button>
      </div>

      {/* variantes de acabamento — cada miniatura é outro produto */}
      {swatches.length > 1 && (
        <div className="mt-3.5 flex items-center gap-2">
          {swatches.map((v) => {
            const on = v.productId === p.id;
            return (
              <button
                key={v.productId}
                onClick={() => { setVariantId(v.productId); setShot(0); }}
                aria-label={`Ver acabamento ${v.label}`}
                aria-pressed={on}
                title={v.label}
                className="relative h-10 w-10 cursor-pointer overflow-hidden transition-[outline-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
                style={{
                  background: "linear-gradient(158deg, #fbfbfc, #eaecee)",
                  borderRadius: "8px",
                  outline: on ? "1.5px solid var(--ink-strong)" : "1px solid var(--edge)",
                  outlineOffset: "-1.5px",
                }}
              >
                <ImageWithFallback src={v.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1" style={{ mixBlendMode: "multiply" }} />
              </button>
            );
          })}
        </div>
      )}

      <Link
        to={to}
        className="mt-3.5 line-clamp-2"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 400, lineHeight: 1.4, color: "#333333" }}
      >
        {p.name}
      </Link>

      <div className="mt-2">
        <Stars rating={p.rating} reviews={p.reviews} />
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className="num"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", color: discount > 0 ? GREEN : "#333333" }}
        >
          {formatBRL(getPixPrice(p))}
        </span>
        {p.oldPriceNum && (
          <span className="num" style={{ fontSize: "14px", color: "#8a8a8a", textDecoration: "line-through" }}>
            {formatBRL(p.oldPriceNum)}
          </span>
        )}
      </div>
    </article>
  );
}
