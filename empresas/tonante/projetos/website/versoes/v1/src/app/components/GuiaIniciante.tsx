"use client";

import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getCatalogHref } from "./productPresentation";
import { SeloTonante } from "./section";

// Destino do CTA: catálogo de Violões (63 itens, não-vazio). O catálogo NÃO tem
// tag "iniciante" nos produtos (só em descrições) — curadoria de uma tag
// iniciante é decisão do Gabriel; quando existir, trocar p/ ?tag=Iniciantes.
const GUIA_HREF = getCatalogHref({ category: "Violões" });

/**
 * GuiaIniciante — banner educacional (§6.13). Captura o maior segmento (1º violão).
 * CTA → /produtos?tag=iniciante (catálogo já tem produtos com a tag). A página de
 * guia completa fica no backlog (§9.5); o banner já entrega valor de conversão.
 */
const heroProduct =
  allProducts.find((p) => p.category === "Violões" && /nylon|lorenzzo|cl[aá]ssico/i.test(p.name)) ??
  allProducts.find((p) => p.category === "Violões") ??
  allProducts[0];

const BULLETS = [
  "O tamanho certo pra você",
  "Nylon ou aço? A gente explica",
  "Já sai com o kit completo",
];

export function GuiaIniciante() {
  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-md)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div
          data-keep-dark
          className="grain grid grid-cols-1 overflow-hidden md:grid-cols-2"
          style={{ borderRadius: "var(--radius-card-xl)", background: "linear-gradient(120deg, #1f1f21, #131314)", color: "#fff" }}
        >
          {/* copy */}
          <div className="relative z-[2] flex flex-col justify-center p-8 md:p-[clamp(34px,5vw,64px)]">
            <span className="label" style={{ color: "var(--amber)" }}>Guia do primeiro violão</span>
            <h2 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.02em", margin: "14px 0 0" }}>
              Primeiro violão?{" "}
              <span style={{ fontStyle: "italic", color: "var(--amber)" }}>A gente te guia.</span>
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15.5px", color: "rgba(255,255,255,.9)" }}>
                  <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--amber)", color: "#fff" }}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              to={GUIA_HREF}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--primary)", color: "#fff", padding: "14px 26px", fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "15.5px", boxShadow: "var(--shadow-buy-cta-sm)" }}
            >
              Ver violões para começar <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
          </div>

          {/* imagem + selo */}
          <div className="relative grid min-h-[300px] place-items-center p-8">
            <span
              className="absolute right-6 top-6 z-[3] rounded-pill"
              style={{ background: "var(--amber)", color: "#fff", fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", padding: "6px 13px", boxShadow: "var(--shadow-medallion)" }}
            >
              Guia grátis
            </span>
            <div
              className="relative overflow-hidden"
              style={{ width: "min(72%, 250px)", transform: "rotate(-3deg)", borderRadius: "var(--radius-card-lg)", background: "linear-gradient(160deg,#f7f7f7,#ececec)", boxShadow: "0 22px 40px -20px rgba(0,0,0,0.42)" }}
            >
              <div className="relative aspect-[3/4]">
                <ImageWithFallback
                  src={getPrimaryProductImage(heroProduct)}
                  alt={heroProduct.name}
                  className="absolute inset-0 h-full w-full object-contain p-4"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            </div>
            {/* Selo "Rei dos Violões" carimbado sobre o canto do card (manual p.5) */}
            <SeloTonante
              variant="rei"
              tone="light"
              size={84}
              className="absolute bottom-6 left-6 z-[3] hidden lg:block"
              style={{ transform: "rotate(-8deg)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
