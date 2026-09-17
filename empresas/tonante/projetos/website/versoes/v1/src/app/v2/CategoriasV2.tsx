"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router";
import { allProducts } from "../components/productsData";
import { getPrimaryProductImage, getCatalogHref } from "../components/productPresentation";

/* CategoriasV2 — "Compre por categoria".
   Grade de 6 por linha com a arte dentro de um tile e o nome embaixo.
   `art` aponta para /categorias/<slug>.png; enquanto a arte final não
   existe, cai no produto mais bem avaliado da categoria.

   Três variantes, trocáveis por `?cat=`:
     soft   (padrão) — tile quadrado, raio 8px igual à caixa de foto do
                       ProductCardV2. Em repouso não tem contorno nem
                       sombra; a sombra em camadas (--shadow-tile-hover)
                       só entra no hover.
     circle          — o círculo com hairline, versão anterior.
     card            — card retangular com borda, primeira versão. */

const fallback = (category: string, subMatch?: string) => {
  const pool = allProducts.filter(
    (p) => p.category === category && (!subMatch || p.name.toLowerCase().includes(subMatch.toLowerCase())),
  );
  const best = [...pool].sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)[0];
  return getPrimaryProductImage(best ?? allProducts[0]);
};

/* Instrumento é alto e fino: em `contain` ele vira um palito no card.
   `crop` enquadra o corpo (parte mais larga) e deixa o braço sair pra fora.

   As artes de estúdio (set/2026) já vêm quadradas, com o produto na escala certa
   e sombra de contato no chão branco, então elas entram sem crop, zoom ou flip —
   recortar de novo cortaria a sombra, que é metade do desenho da foto. As props
   continuam aqui para quando alguma categoria voltar a usar arte recortada. */
type Cat = {
  label: string;
  art: string;
  href: string;
  fallbackImg: string;
  crop?: boolean;
  /** ponto de ampliação — "50% 70%" fica no corpo do instrumento */
  focus?: string;
  /** quanto ampliar a partir do ponto focal (braço sai do quadro) */
  zoom?: number;
  /** ajuste fino do tamanho da arte sem crop (1 = padrão) */
  artScale?: number;
  /** espelha a arte — todo instrumento aponta pra direita no grid */
  flip?: boolean;
  /** recentraliza a arte no círculo, em % do quadro (já contando o zoom) */
  offsetX?: number;
};

const CATS: Cat[] = [
  /* 1ª linha — instrumentos, na ordem de tamanho do catálogo */
  { label: "Violões", art: "/categorias/violao.png", href: getCatalogHref({ category: "Violões" }), fallbackImg: fallback("Violões") },
  { label: "Guitarras", art: "/categorias/guitarra-eletrica.png", href: getCatalogHref({ category: "Guitarras" }), fallbackImg: fallback("Guitarras", "star light") },
  { label: "Contrabaixos", art: "/categorias/contrabaixo.png", href: getCatalogHref({ category: "Contrabaixos" }), fallbackImg: fallback("Contrabaixos") },
  /* Baterias é linha própria da Tonante (Sonora) e não aparecia na home */
  { label: "Baterias", art: "/categorias/bateria.png", href: getCatalogHref({ category: "Baterias" }), fallbackImg: fallback("Baterias") },
  /* Violas e ukuleles moram dentro de "Violões": sem vitrine aqui ninguém acha */
  { label: "Violas", art: "/categorias/viola.png", href: getCatalogHref({ category: "Violões", search: "viola caipira" }), fallbackImg: fallback("Violões", "viola ") },
  { label: "Ukuleles", art: "/categorias/ukulele.png", href: getCatalogHref({ category: "Violões", search: "ukulele" }), fallbackImg: fallback("Violões", "ukulele") },

  /* 2ª linha — o que se compra junto do instrumento */
  { label: "Cordas & Encordoamentos", art: "/categorias/encordoamento.png", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), fallbackImg: fallback("Cordas & Encordoamentos") },
  { label: "Suportes & Pedestais", art: "/categorias/suporte.png", href: getCatalogHref({ category: "Suportes" }), fallbackImg: fallback("Suportes") },
  { label: "Correias", art: "/categorias/correias.png", href: getCatalogHref({ category: "Acessórios", search: "correia" }), fallbackImg: fallback("Acessórios", "correia") },
  { label: "Cabos", art: "/categorias/cabos.png", href: getCatalogHref({ category: "Acessórios", search: "cabo" }), fallbackImg: fallback("Acessórios", "shogun") },
  /* a arte de microfone estava no card genérico "Acessórios"; é aqui que ela conta uma história */
  { label: "Microfones", art: "/categorias/microfone.png", href: getCatalogHref({ category: "Acessórios", search: "microfone" }), fallbackImg: fallback("Acessórios", "microfone") },
  { label: "Palhetas", art: "/categorias/palhetas.png", href: getCatalogHref({ category: "Acessórios", search: "palheta" }), fallbackImg: fallback("Acessórios", "palheta") },
];

type Variant = "soft" | "circle" | "card";

function CatCard({ cat, variant }: { cat: Cat; variant: Variant }) {
  const [src, setSrc] = useState(cat.art);
  const [hover, setHover] = useState(false);

  const soft = variant === "soft";
  const circle = variant === "circle";
  /* soft e circle compartilham o layout (moldura quadrada + nome fora);
     só mudam raio, contorno e sombra. */
  const bare = soft || circle;

  return (
    /* na variante card a altura é fixa: a arte tem teto e sempre sobra
       respiro entre ela e as bordas; o nome ocupa uma faixa de 2 linhas,
       então 1 ou 2 linhas não mudam a altura do card. */
    <Link
      to={cat.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        bare
          ? "group/cat flex flex-col items-center"
          : "group/cat flex h-[220px] flex-col items-center px-4 py-5 transition-shadow hover:shadow-[var(--shadow-card)] md:h-[250px]"
      }
      style={bare ? undefined : { background: "#ffffff", border: "1px solid var(--border)", borderRadius: "10px" }}
    >
      {/* artes alinhadas pela base: todas apoiam na mesma linha logo acima do
         nome; a sobra fica em cima */}
      <div
        className={
          bare
            ? `flex aspect-square w-full ${cat.crop ? "items-end" : "items-center"} justify-center overflow-hidden ${circle ? "rounded-full" : ""}`
            : "flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden"
        }
        style={
          soft
            /* em repouso o tile não tem contorno nem sombra: a grade é só
               arte sobre branco, e a moldura aparece no hover. A sombra
               cresce do nada e o tile sobe 2px, então o cartão "levanta"
               em vez de piscar. */
            ? {
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: hover ? "var(--shadow-tile-hover)" : "none",
                transform: hover ? "translateY(-2px)" : "none",
                transition: "box-shadow .35s var(--ease), transform .35s var(--ease)",
              }
            : circle
              /* a arte de estúdio já traz o próprio fundo; o círculo só precisa
                 de um contorno pra não sumir na página branca */
              ? { background: "#ffffff", border: "1px solid var(--edge)", transition: "border-color .35s var(--ease)" }
              : undefined
        }
      >
        {cat.crop ? (
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={src}
              alt=""
              aria-hidden="true"
              onError={() => setSrc(cat.fallbackImg)}
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                mixBlendMode: "multiply",
                /* sobe um pouco pra sombra de contato não encostar na borda */
                transform: `translate(${cat.offsetX ?? 0}%, -3%) scale(${(cat.zoom ?? 1.4) * (bare ? 1.18 : 1) * (hover ? 1.06 : 1)})${cat.flip ? " scaleX(-1)" : ""}`,
                transformOrigin: cat.focus ?? "50% 70%",
                transition: "transform .5s var(--ease)",
              }}
            />
          </div>
        ) : (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            onError={() => setSrc(cat.fallbackImg)}
            /* na moldura a foto preenche tudo (object-cover): com `contain` o
               quadrado branco da arte aparecia recortado contra o fundo do
               card, e lia como imagem cortada do lado direito. */
            className={
              bare
                ? "h-full w-full object-cover object-center"
                : "max-h-[92%] w-auto max-w-[80%] object-contain object-bottom"
            }
            style={{
              mixBlendMode: bare ? undefined : "multiply",
              transform: `translateX(${cat.offsetX ?? 0}%) scale(${(cat.artScale ?? 1) * (hover ? 1.06 : 1)})${cat.flip ? " scaleX(-1)" : ""}`,
              transformOrigin: bare ? "50% 50%" : "50% 100%",
              transition: "transform .5s var(--ease)",
            }}
          />
        )}
      </div>
      {/* O nome reage junto do tile, mas atrasado: o tile levanta, o nome
         acompanha 40ms depois e o sublinhado abre por último. Escalonar
         assim faz o conjunto ler como um movimento só, com causa e efeito,
         em vez de três coisas piscando ao mesmo tempo. */}
      <span
        className={
          bare
            ? "mt-3.5 flex h-11 w-full items-start justify-center"
            : "flex h-11 w-full items-center justify-center"
        }
        style={
          bare
            ? {
                transform: hover ? "translateY(-1px)" : "none",
                transition: "transform .35s var(--ease) 40ms",
              }
            : undefined
        }
      >
        {/* line-clamp traz overflow:hidden, que corta o sublinhado na altura
           da linha: os 4px de padding dão o respiro que ele precisa. */}
        <span
          className="line-clamp-2 text-center"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 500, lineHeight: 1.25, color: "var(--ink-strong)", paddingBottom: bare ? "4px" : undefined }}
        >
          {/* sublinhado como background animável em vez de border: cresce do
             centro, para na largura real do texto (não do card) e, com
             box-decoration-break: clone, sublinha cada linha do rótulo de
             duas linhas. Peso da fonte não muda — mudaria o reflow. */}
          <span
            style={
              bare
                ? {
                    backgroundImage: "linear-gradient(currentColor, currentColor)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "50% 100%",
                    backgroundSize: hover ? "100% 1.5px" : "0% 1.5px",
                    paddingBottom: "2.5px",
                    WebkitBoxDecorationBreak: "clone",
                    boxDecorationBreak: "clone",
                    transition: "background-size .42s var(--ease) 60ms",
                  }
                : undefined
            }
          >
            {cat.label}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function CategoriasV2() {
  /* tile quadrado com sombra é o padrão; ?cat=circle volta ao círculo com
     hairline e ?cat=card à primeira versão em card retangular */
  const param = new URLSearchParams(useLocation().search).get("cat");
  const variant: Variant = param === "card" ? "card" : param === "circle" ? "circle" : "soft";

  return (
    <section className="px-5 py-14 md:px-12" style={{ background: "#ffffff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <h2
          className="mb-7"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(26px,3vw,34px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink-strong)", margin: 0 }}
        >
          Compre por categoria
        </h2>

        {/* grade única: as 12 categorias de uma vez, 6 por linha */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
          {CATS.map((c) => (
            <CatCard key={c.label} cat={c} variant={variant} />
          ))}
        </div>

      </div>
    </section>
  );
}
