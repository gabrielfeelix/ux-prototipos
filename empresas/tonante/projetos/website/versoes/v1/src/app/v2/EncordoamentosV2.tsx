"use client";

import { useState } from "react";
import { Link } from "react-router";
import { allProducts } from "../components/productsData";
import { getPrimaryProductImage, getCatalogHref } from "../components/productPresentation";

/* EncordoamentosV2 — famílias de corda no padrão "collection card" (referência
   Local): bloco de cor sólida, cena grande do produto e, embaixo, eyebrow +
   nome + botão. Sem pills, sem tabela de specs, sem listra de fundo. */

const findByName = (...kw: string[]) =>
  allProducts.find((p) => kw.every((k) => p.name.toLowerCase().includes(k.toLowerCase())));

export type Familia = {
  key: string;
  eyebrow: string;
  title: string;
  href: string;
  /** amostrado da faixa inferior da arte: a foto tem degradê horizontal,
      então o bloco de texto continua o mesmo degradê e a emenda some */
  bg: string;
  art: string;
  fallbackImg: string;
};

export const FAMILIAS: Familia[] = [
  {
    key: "nylon-violao",
    eyebrow: "Macia para os dedos",
    title: "Nylon para violão",
    href: getCatalogHref({ category: "Cordas & Encordoamentos", search: "nylon" }),
    bg: "linear-gradient(90deg, #e3c19a 0.0%, #e2bd95 12.5%, #dfba91 25.0%, #dcb88f 37.5%, #dab58a 50.0%, #d9b388 62.5%, #d5af84 75.0%, #d2ab81 87.5%, #cfaa80 100.0%)",
    art: "/cordas/nylon-violao.webp",
    fallbackImg: getPrimaryProductImage(findByName("nylon") ?? allProducts[0]),
  },
  {
    key: "aco-violao",
    eyebrow: "Brilho e projeção",
    title: "Aço para violão",
    href: getCatalogHref({ category: "Cordas & Encordoamentos", search: "aço" }),
    bg: "linear-gradient(90deg, #aec0aa 0.0%, #aabda3 12.5%, #a4b99f 25.0%, #a0b49a 37.5%, #9eb298 50.0%, #9aaf95 62.5%, #97ac92 75.0%, #94a98f 87.5%, #8fa58b 100.0%)",
    art: "/cordas/aco-violao.webp",
    fallbackImg: getPrimaryProductImage(findByName("aço", "violão") ?? allProducts[0]),
  },
  {
    key: "niquel-guitarra",
    eyebrow: "Ataque rápido",
    title: "Níquel para guitarra",
    href: getCatalogHref({ category: "Cordas & Encordoamentos", search: "guitarra" }),
    bg: "linear-gradient(90deg, #8dbce8 0.0%, #89bbe6 12.5%, #84b7e4 25.0%, #82b5e2 37.5%, #7cb1e0 50.0%, #79afde 62.5%, #75abdc 75.0%, #76acdc 87.5%, #6fa6d8 100.0%)",
    art: "/cordas/niquel-guitarra.webp",
    fallbackImg: getPrimaryProductImage(findByName("guitarra", "encordoamento") ?? allProducts[0]),
  },
  {
    key: "niquel-baixo",
    eyebrow: "Grave firme",
    title: "Níquel para baixo",
    href: getCatalogHref({ category: "Cordas & Encordoamentos", search: "baixo" }),
    bg: "linear-gradient(90deg, #baa2c6 0.0%, #b89ec3 12.5%, #b69cc1 25.0%, #b298bc 37.5%, #af94b9 50.0%, #a990b5 62.5%, #a98eb3 75.0%, #a68bb1 87.5%, #a187ab 100.0%)",
    art: "/cordas/niquel-baixo.webp",
    fallbackImg: getPrimaryProductImage(findByName("baixo", "encordoamento") ?? allProducts[0]),
  },
];

export function FamiliaCard({ f }: { f: Familia }) {
  const [src, setSrc] = useState(f.art);
  const isFallback = src === f.fallbackImg;
  /* A arte cobre o quadrado inteiro do tile; sem ela sobra um bloco da cor de
     fundo da família, que lê como card vazio e não como card chegando. */
  const [arte, setArte] = useState(false);

  return (
    <Link
      to={f.href}
      className="group/fam flex flex-col overflow-hidden"
      style={{ background: f.bg, borderRadius: "10px" }}
    >
      <div className={`relative w-full ${arte ? "" : "tn-skel"}`} style={{ aspectRatio: "1 / 1" }}>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setSrc(f.fallbackImg)}
          onLoad={() => setArte(true)}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full transition-transform duration-[600ms] ease-out group-hover/fam:scale-[1.04] ${
            isFallback ? "object-contain p-12" : "object-cover"
          }`}
          style={isFallback ? { mixBlendMode: "multiply" } : undefined}
        />
      </div>

      <div className="flex flex-col items-center px-6 pb-8 pt-2 text-center">
        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", color: "rgba(17,17,17,.6)" }}>
          {f.eyebrow}
        </span>
        <h3 style={{ fontFamily: "var(--font-family-inter)", fontSize: "24px", fontWeight: 600, letterSpacing: "-0.01em", color: "#111111", margin: "6px 0 0" }}>
          {f.title}
        </h3>
        <span
          className="mt-5 inline-block rounded-pill transition-colors"
          style={{ background: "var(--ink-strong)", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600 }}
        >
          Ver cordas
        </span>
      </div>
    </Link>
  );
}

export function EncordoamentosV2() {
  return (
    <section className="px-5 py-20 md:px-12" style={{ background: "#ffffff" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <h2 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(26px,3vw,34px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink-strong)", margin: 0 }}>
              Qual corda é a sua?
            </h2>
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", color: "var(--ink-soft)", margin: "8px 0 0" }}>
              Escolha pela família. A gente explica o resto.
            </p>
          </div>
          <Link
            to={getCatalogHref({ category: "Cordas & Encordoamentos" })}
            className="hidden flex-shrink-0 sm:block"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", color: "var(--ink-strong)", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            Ver todas as cordas
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIAS.map((f) => (
            <FamiliaCard key={f.key} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
