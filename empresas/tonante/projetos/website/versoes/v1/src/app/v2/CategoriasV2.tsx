"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router";
import { allProducts } from "../components/productsData";
import { getPrimaryProductImage, getCatalogHref } from "../components/productPresentation";

/* CategoriasV2 — "Compre por categoria".
   Grade de 6 por linha: círculo cinza com a arte dentro e o nome embaixo.
   `art` aponta para /categorias/<slug>.png; enquanto a arte final não
   existe, cai no produto mais bem avaliado da categoria. */

const fallback = (category: string, subMatch?: string) => {
  const pool = allProducts.filter(
    (p) => p.category === category && (!subMatch || p.name.toLowerCase().includes(subMatch.toLowerCase())),
  );
  const best = [...pool].sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)[0];
  return getPrimaryProductImage(best ?? allProducts[0]);
};

/* Instrumento é alto e fino: em `contain` ele vira um palito no card.
   `crop` enquadra o corpo (parte mais larga) e deixa o braço sair pra fora. */
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
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Violões", art: "/categorias/violao.png", href: getCatalogHref({ category: "Violões" }), fallbackImg: fallback("Violões") },
  /* /categorias/guitarra.png é um contrabaixo preto (4 cordas, 4 tarraxas em
     linha, corpo Jazz Bass) — mesmo instrumento do card ao lado. Até a arte
     certa existir, cai na foto de uma guitarra de verdade do catálogo. */
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Guitarras", art: "/categorias/guitarra-eletrica.png", href: getCatalogHref({ category: "Guitarras" }), fallbackImg: fallback("Guitarras", "star light") },
  { crop: true, focus: "50% 100%", zoom: 1.4, flip: true, offsetX: 3.5, label: "Contrabaixos", art: "/categorias/contrabaixo.png", href: getCatalogHref({ category: "Contrabaixos" }), fallbackImg: fallback("Contrabaixos") },
  /* Baterias é linha própria da Tonante (Sonora) e não aparecia na home */
  { label: "Baterias", art: "/categorias/bateria.png", href: getCatalogHref({ category: "Baterias" }), fallbackImg: fallback("Baterias") },
  /* Violas e ukuleles moram dentro de "Violões": sem vitrine aqui ninguém acha */
  { crop: true, focus: "50% 100%", zoom: 1.4, offsetX: 8, label: "Violas", art: "/categorias/viola.png", href: getCatalogHref({ category: "Violões", search: "viola caipira" }), fallbackImg: fallback("Violões", "viola ") },
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Ukuleles", art: "/categorias/ukulele.png", href: getCatalogHref({ category: "Violões", search: "ukulele" }), fallbackImg: fallback("Violões", "ukulele") },

  /* 2ª linha — o que se compra junto do instrumento */
  { artScale: 0.85, label: "Cordas & Encordoamentos", art: "/categorias/encordoamento.png", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), fallbackImg: fallback("Cordas & Encordoamentos") },
  { label: "Suportes & Pedestais", art: "/categorias/suporte.png", href: getCatalogHref({ category: "Suportes" }), fallbackImg: fallback("Suportes") },
  { label: "Correias", art: "/categorias/correias.png", href: getCatalogHref({ category: "Acessórios", search: "correia" }), fallbackImg: fallback("Acessórios", "correia") },
  { label: "Cabos", art: "/categorias/cabos.png", href: getCatalogHref({ category: "Acessórios", search: "cabo" }), fallbackImg: fallback("Acessórios", "shogun") },
  /* a arte de microfone estava no card genérico "Acessórios"; é aqui que ela conta uma história */
  { label: "Microfones", art: "/categorias/microfone.png", href: getCatalogHref({ category: "Acessórios", search: "microfone" }), fallbackImg: fallback("Acessórios", "microfone") },
  { label: "Palhetas", art: "/categorias/palhetas.png", href: getCatalogHref({ category: "Acessórios", search: "palheta" }), fallbackImg: fallback("Acessórios", "palheta") },
];

function CatCard({ cat, round }: { cat: Cat; round: boolean }) {
  const [src, setSrc] = useState(cat.art);
  const [hover, setHover] = useState(false);

  return (
    /* altura fixa: a arte tem teto e sempre sobra respiro entre ela e as
       bordas; o nome ocupa uma faixa de 2 linhas, então 1 ou 2 linhas não
       mudam a altura do card. */
    <Link
      to={cat.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        round
          ? "group/cat flex flex-col items-center"
          : "group/cat flex h-[220px] flex-col items-center px-4 py-5 transition-shadow hover:shadow-[var(--shadow-card)] md:h-[250px]"
      }
      style={round ? undefined : { background: "#ffffff", border: "1px solid var(--border)", borderRadius: "10px" }}
    >
      {/* artes alinhadas pela base: todas apoiam na mesma linha logo acima do
         nome; a sobra fica em cima */}
      <div
        className={
          round
            ? `flex aspect-square w-full ${cat.crop ? "items-end" : "items-center"} justify-center overflow-hidden rounded-full p-6 transition-colors`
            : "flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden"
        }
        style={
          round
            ? { background: "var(--surface-2)" }
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
                transform: `translate(${cat.offsetX ?? 0}%, -3%) scale(${(cat.zoom ?? 1.4) * (round ? 1.18 : 1) * (hover ? 1.06 : 1)})${cat.flip ? " scaleX(-1)" : ""}`,
                transformOrigin: cat.focus ?? "50% 70%",
                transition: "transform .45s ease-out",
              }}
            />
          </div>
        ) : (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            onError={() => setSrc(cat.fallbackImg)}
            className={`max-h-[86%] w-auto max-w-[70%] object-contain ${round ? "object-center" : "object-bottom"}`}
            style={{
              mixBlendMode: "multiply",
              transform: `translateX(${cat.offsetX ?? 0}%) scale(${(cat.artScale ?? 1) * (hover ? 1.06 : 1)})${cat.flip ? " scaleX(-1)" : ""}`,
              transformOrigin: round ? "50% 50%" : "50% 100%",
              transition: "transform .45s ease-out",
            }}
          />
        )}
      </div>
      <span
        className={
          round
            ? "mt-3 flex h-11 w-full items-start justify-center text-center line-clamp-2"
            : "flex h-11 w-full items-center justify-center text-center line-clamp-2"
        }
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 500, lineHeight: 1.25, color: "var(--ink-strong)" }}
      >
        {cat.label}
      </span>
    </Link>
  );
}

export function CategoriasV2() {
  // círculo é o padrão; /?cat=card volta à versão em card retangular
  const round = new URLSearchParams(useLocation().search).get("cat") !== "card";

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
            <CatCard key={c.label} cat={c} round={round} />
          ))}
        </div>

      </div>
    </section>
  );
}
