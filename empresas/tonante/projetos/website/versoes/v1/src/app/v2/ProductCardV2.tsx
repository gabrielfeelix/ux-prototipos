"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, Star, Play, Square } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../components/CartContext";
import { type Product } from "../components/productsData";
import { getPrimaryProductImage, getProductImagesRanked, getProductSwatches, getSwatchImage, upgradeProductImage } from "../components/productPresentation";
import { allProducts } from "../components/productsData";
import { FRAMING_POR_FOTO, INSTRUMENT_FRAMING, FRAMING_PADRAO } from "./instrumentFraming";
import { tipoDoProduto } from "./curadoria";
import { isFotoAmbientada, isFotoDesproporcional } from "../components/photoBackdrop";
import { getPixPrice, formatBRL, getInstallmentCount, getInstallmentValue } from "../components/productEnhancements";
import { getProductUrl } from "../lib/slug";
import { getPreOrderInfo } from "../components/PreOrderData";
import { PreOrderPill } from "../components/section";
import { playStrum, stopStrum, presetForProduct } from "../lib/strum";
import { sampleForProduct, playSample, stopSample } from "../lib/timbre";

/* ProductCardV2 — card do teste /v2 (referência: tema Helix).
   Foto numa caixa cinza-clara sem borda, badges no topo, ações que só
   aparecem no hover, e fora da caixa: miniaturas, nome e preço. */

/* um verde só na página, vindo do token de compra: selo de desconto, "à vista
   no PIX" e botão Comprar agora. Ver --buy-green em styles/theme.css. */
const GREEN = "var(--buy-green)";

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
  /* Produto sem irmã de cor ainda mostra UMA miniatura: a dele. A fileira
     deixa de ser um buraco de 40px reservado e passa a dizer a mesma coisa
     nos dois casos — "este é o acabamento" —, com a anatomia do card igual
     da primeira à última coluna. */
  const acabamentos = swatches.length > 1
    ? swatches
    : [{ color: "", label: base.name, productId: base.id, image: getSwatchImage(base), name: base.name }];
  const [variantId, setVariantId] = useState(base.id);
  const p = (variantId !== base.id ? allProducts.find((x) => x.id === variantId) : undefined) ?? base;
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(false);
  /* Uma pergunta só, usada em duas decisões: som e enquadramento. Bateria,
     teclado, flauta, cavaco, viola e ukulele moram em "Acessórios" no dump do
     ERP — tratados pela categoria, ficavam mudos e ainda apareciam em
     miniatura no meio do branco ao lado de um violão. Corda, cabo e suporte
     seguem sem play. Ver v2/curadoria.ts e instrumentFraming.ts. */
  const isInstrument = tipoDoProduto(p) === "instrumento";
  /* Amostra real (Wikimedia CC0, ver lib/timbre) ganha do synth; gravação do
     próprio modelo, quando existir, ganha das duas. */
  const amostra = isInstrument ? (p.audioSample ?? sampleForProduct(p)) : null;
  const preset = isInstrument && !amostra ? presetForProduct(p) : null;

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
  /* parcelamento sobre o preço de cartão (priceNum), não sobre o do PIX: PIX é
     à vista, e mostrar a parcela do valor com desconto de PIX prometeria um
     total que o checkout não cobra. */
  const parcelas = getInstallmentCount(p.priceNum);
  const valorParcela = getInstallmentValue(p.priceNum);
  const isNew = p.badge?.toLowerCase().includes("nov");
  /* Pré-venda é estado do produto, não recorte de vitrine: vem de
     PreOrderData (os mesmos itens que abrem card com timer na PDP). Quando
     tem pré-venda, ela manda — o produto ainda não está à venda, e anunciar
     "Novidade" ao lado seria oferecer duas coisas diferentes no mesmo card. */
  const preOrder = getPreOrderInfo(p.id);

  const foto = thumbs[shot] ?? { src: primary, ratio: 1 };
  /* Instrumento entra sempre enquadrado no corpo, com `contain` + origem na
     base. O zoom não é fixo: cada foto tem margem branca diferente (o
     instrumento ocupa de 23% a 100% da largura do quadro), então o fator vem
     da tabela medida em instrumentFraming — é o que faz violão e guitarra
     terminarem do mesmo tamanho na tela. Foto deitada não recebe zoom. */
  /* Foto ambientada tem cenário até a borda: preenche o quadro, senão o corte
     dela aparece dentro do card. Só recorte de estúdio recebe enquadramento e
     `multiply` — ver photoBackdrop.ts. */
  const ambientada = isFotoAmbientada(foto.src);
  /* Ambientada muito estreita ou muito deitada: preencher por corte amplia
     tanto que vira tira borrada — a própria foto desfocada faz o fundo e ela
     aparece inteira por cima (mesmo tratamento da PDP). */
  const desproporcional = ambientada && isFotoDesproporcional(foto.src);
  const zoomNoCorpo = isInstrument && foto.ratio <= 1.2 && !ambientada;
  /* Medida da foto EXIBIDA, não do produto: o card troca de foto (a de maior
     resolução que couber, miniatura clicada, variante de cor) e cada uma tem
     margem branca própria — com a medida do produto, a guitarra do 70
     Aniversário recebia o zoom de outra foto e saía cortada. */
  const [zoom, dy] = FRAMING_POR_FOTO[foto.src] ?? INSTRUMENT_FRAMING[p.id] ?? FRAMING_PADRAO;

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
          {/* ordem: o que o produto É (pré-venda, novidade) antes de quanto
              ele custa — o desconto fecha a pilha, encostado na foto. */}
          {preOrder ? (
            <PreOrderPill info={preOrder} />
          ) : isNew ? (
            <span className="rounded-pill px-2.5 py-1" style={{ backgroundImage: "var(--gradient-novelty-blue)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Novidade
            </span>
          ) : null}
          {discount > 0 && (
            <span className="num rounded-pill px-3 py-1.5" style={{ background: GREEN, color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* instrumento: ouvir o timbre. catálogo: espiar. home não-instrumento: nada */}
        {amostra || preset ? (
          <button
            onClick={() => {
              if (playing) {
                stopStrum();
                stopSample();
                setPlaying(false);
                return;
              }
              stopStrum();
              stopSample();
              setPlaying(true);
              if (amostra) playSample(amostra, () => setPlaying(false));
              else if (preset) playStrum(preset, () => setPlaying(false));
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
            {desproporcional && (
              <ImageWithFallback
                src={foto.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-125 object-cover"
                style={{ filter: "blur(28px) saturate(1.1)", opacity: 0.85 }}
              />
            )}
            <ImageWithFallback
              src={foto.src}
              alt={p.name}
              className={`absolute inset-0 h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                desproporcional
                  ? "object-contain group-hover/card:scale-[1.05]"
                  : ambientada
                  ? "object-cover group-hover/card:scale-[1.05]"
                  : `object-contain ${zoomNoCorpo ? "origin-bottom group-hover/card:scale-105" : `group-hover/card:scale-[1.05] ${isInstrument ? "p-[6%]" : "p-[20%]"}`}`
              }`}
              style={
                ambientada
                  ? undefined
                  : {
                      mixBlendMode: "multiply",
                      ...(zoomNoCorpo ? { transform: `translateY(${dy}%) scale(${zoom})` } : null),
                    }
              }
            />
          </div>
        </Link>

        {/* ação — aparece no hover, flutuando dentro da caixa */}
        {/* verde de compra, os mesmos três estados do CTA da PDP (tokens
            --buy-green*). O hover do CARD revela o botão; o hover do BOTÃO
            escurece — dois gestos diferentes, e por isso o `translate/opacity`
            fica em group-hover e a cor em hover próprio. */}
        <button
          onClick={add}
          className="absolute inset-x-3 bottom-3 z-[2] flex h-12 translate-y-2.5 cursor-pointer items-center justify-center rounded-pill opacity-0 transition-[opacity,translate,background-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100 [background-color:var(--buy-green)] hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)] active:scale-[0.98]"
          style={{
            color: "#ffffff",
            padding: "6px 10px",
            fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600,
          }}
        >
          Comprar agora
        </button>
      </div>

      {/* variantes de acabamento — cada miniatura é outro produto. A fileira
          existe em todo card, com uma miniatura no mínimo: além de manter
          nome e preço na mesma altura em toda a fileira (cada card mede a
          própria coluna), o card de produto sem irmã de cor deixa de parecer
          um card quebrado ao lado dos que têm três. */}
      <div className="mt-3.5 flex items-center gap-2">
        {acabamentos.map((v) => {
          const on = v.productId === p.id;
          const unico = acabamentos.length === 1;
          return (
            <button
              key={v.productId}
              disabled={unico}
              onClick={() => { setVariantId(v.productId); setShot(0); }}
              aria-label={unico ? `Acabamento ${v.label}` : `Ver acabamento ${v.label}`}
              aria-pressed={on}
              title={v.label}
              className={`relative h-10 w-10 overflow-hidden transition-[outline-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${unico ? "cursor-default" : "cursor-pointer hover:scale-[1.06]"}`}
              style={{
                background: "linear-gradient(158deg, #fbfbfc, #eaecee)",
                borderRadius: "8px",
                /* selecionada: a mesma tinta quente do --ink-soft, só que
                   fraca. Contorno cheio brigava com a foto do instrumento
                   dentro de 40px; a não-selecionada fica em --edge (0.12),
                   então a distância entre os dois estados se mantém. */
                outline: on ? "1.35px solid rgba(79, 70, 60, 0.4)" : "1px solid var(--edge)",
                outlineOffset: "-1.35px",
              }}
            >
              <ImageWithFallback src={v.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1" style={{ mixBlendMode: "multiply" }} />
            </button>
          );
        })}
      </div>

      {/* uma linha e trunca: nome de catálogo de instrumento vem com modelo,
          medida e código ("Violão Elétrico Ámbar 41" - Folk - Tampo em Mogno -
          EQ 5 Bandas"), e duas linhas deixavam cada card de uma altura — a
          fileira inteira desalinha no preço. O nome completo está na PDP. */}
      <Link
        to={to}
        className="mt-3.5 truncate"
        title={p.name}
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 500, lineHeight: 1.4, color: "#333333" }}
      >
        {p.name}
      </Link>

      <div className="mt-2">
        <Stars rating={p.rating} reviews={p.reviews} />
      </div>

      {/* bloco de preço em três andares, na ordem em que a decisão acontece:
          de quanto era → quanto é à vista → como parcela. O verde é do PIX e
          só dele; o desconto já se anuncia no riscado e no selo sobre a foto,
          então o valor grande fica em tinta normal e o olho não disputa. */}
      <div className="mt-1.5">
        {/* A linha do riscado ocupa altura MESMO sem desconto: numa fileira
            mista, os cards com promoção empurravam o preço 17px pra baixo e a
            linha de preço da dobra voltava a ficar em serra — o mesmo defeito
            que a faixa de variantes tinha. */}
        <div className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "#8a8a8a", textDecoration: "line-through", lineHeight: 1.3, minHeight: "17px" }}>
          {discount > 0 && p.oldPriceNum ? formatBRL(p.oldPriceNum) : "\u00a0"}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span
            className="num"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", color: "#333333" }}
          >
            {formatBRL(getPixPrice(p))}
          </span>
          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600, color: GREEN, whiteSpace: "nowrap" }}>
            à vista no PIX
          </span>
        </div>
        {/* a linha sai em TODO card, inclusive quando o plano dá 1x (parcela
            mínima de R$50, ver productEnhancements): card sem ela ficava mais
            baixo que o vizinho e a fileira desalinhava de novo — e o "sem
            juros no cartão" é informação de pagamento, não só de parcelamento. */}
        <div className="num truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "#6b6b6b", marginTop: "3px", lineHeight: 1.3 }}>
          {parcelas}x de {formatBRL(valorParcela)} sem juros no cartão
        </div>
      </div>
    </article>
  );
}
