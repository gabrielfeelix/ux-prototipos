"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { allProducts } from "../components/productsData";
import { getPrimaryProductImage, getCatalogHref } from "../components/productPresentation";

/* CategoriasV2 — "Compre por categoria" (referência: tema Local).
   Card branco, arte centralizada com sombra de contato, nome embaixo.
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
};

const CATS: Cat[] = [
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Violões", art: "/categorias/violao.png", href: getCatalogHref({ category: "Violões" }), fallbackImg: fallback("Violões") },
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Guitarras", art: "/categorias/guitarra.png", href: getCatalogHref({ category: "Guitarras" }), fallbackImg: fallback("Guitarras") },
  { crop: true, focus: "50% 100%", zoom: 1.4, label: "Contrabaixos", art: "/categorias/contrabaixo.png", href: getCatalogHref({ category: "Contrabaixos" }), fallbackImg: fallback("Contrabaixos") },
  { artScale: 0.85, label: "Cordas & Encordoamentos", art: "/categorias/encordoamento.png", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), fallbackImg: fallback("Cordas & Encordoamentos") },
  { label: "Acessórios", art: "/categorias/microfone.png", href: getCatalogHref({ category: "Acessórios" }), fallbackImg: fallback("Acessórios") },
  { label: "Suportes", art: "/categorias/suporte.png", href: getCatalogHref({ category: "Suportes" }), fallbackImg: fallback("Suportes") },
  { label: "Afinadores", art: "/categorias/afinadores.png", href: getCatalogHref({ category: "Acessórios", search: "afinador" }), fallbackImg: fallback("Acessórios", "afinador") },
  { label: "Capas & Bags", art: "/categorias/capas.png", href: getCatalogHref({ category: "Acessórios", search: "capa" }), fallbackImg: fallback("Acessórios", "capa") },
  { label: "Palhetas", art: "/categorias/palhetas.png", href: getCatalogHref({ category: "Acessórios", search: "palheta" }), fallbackImg: fallback("Acessórios", "palheta") },
  { label: "Cabos", art: "/categorias/cabos.png", href: getCatalogHref({ category: "Acessórios", search: "cabo" }), fallbackImg: fallback("Acessórios", "cabo") },
  { label: "Correias", art: "/categorias/correias.png", href: getCatalogHref({ category: "Acessórios", search: "correia" }), fallbackImg: fallback("Acessórios", "correia") },
  { label: "Microfones", art: "/categorias/microfones.png", href: getCatalogHref({ category: "Acessórios", search: "microfone" }), fallbackImg: fallback("Acessórios", "microfone") },
];

const PER_PAGE = 6;

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
            ? `flex aspect-square w-full ${cat.crop ? "items-end" : "items-center"} justify-center overflow-hidden rounded-full p-6 transition-shadow hover:shadow-[var(--shadow-card)]`
            : "flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden"
        }
        style={round ? { background: "#ffffff", border: "1px solid var(--border)" } : undefined}
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
                transform: `translateY(-3%) scale(${(cat.zoom ?? 1.4) * (round ? 1.18 : 1) * (hover ? 1.06 : 1)})`,
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
              transform: `scale(${(cat.artScale ?? 1) * (hover ? 1.06 : 1)})`,
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
  const [page, setPage] = useState(0);
  const pages = Math.ceil(CATS.length / PER_PAGE);

  return (
    <section className="px-5 py-14 md:px-12" style={{ background: "#ffffff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <h2
          className="mb-7"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(26px,3vw,34px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink-strong)", margin: 0 }}
        >
          Compre por categoria
        </h2>

        {/* trilho deslizante: a troca de página desliza em vez de trocar seco */}
        <div className="mt-7 overflow-hidden">
          <div
            className="flex"
            style={{
              width: `${pages * 100}%`,
              transform: `translateX(-${page * (100 / pages)}%)`,
              // ease-in-out longo: entra acelerando e assenta devagar
              transition: "transform .85s cubic-bezier(.65,0,.25,1)",
            }}
          >
            {Array.from({ length: pages }).map((_, pi) => (
              <div
                key={pi}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
                style={{ width: `${100 / pages}%` }}
                aria-hidden={pi !== page}
              >
                {CATS.slice(pi * PER_PAGE, pi * PER_PAGE + PER_PAGE).map((c) => (
                  <CatCard key={c.label} cat={c} round={round} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setPage((i) => (i - 1 + pages) % pages)} aria-label="Categorias anteriores" className="cursor-pointer" style={{ color: "var(--ink-strong)" }}>
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Página ${i + 1}`}
                  aria-current={i === page}
                  className="cursor-pointer rounded-pill"
                  style={{
                    height: 5, width: i === page ? 34 : 5,
                    background: i === page ? "var(--ink-strong)" : "rgba(17,17,17,0.25)",
                    transition: "width .3s ease, background .3s ease",
                  }}
                />
              ))}
            </div>
            <button onClick={() => setPage((i) => (i + 1) % pages)} aria-label="Próximas categorias" className="cursor-pointer" style={{ color: "var(--ink-strong)" }}>
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
