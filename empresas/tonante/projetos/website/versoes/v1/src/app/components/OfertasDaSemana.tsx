"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { allProducts, type Product } from "./productsData";
import { getVisibleCatalogProducts, getPrimaryProductImage } from "./productPresentation";
import { useCart } from "./CartContext";
import { SectionHeader } from "./section";
import { ProductCard } from "./ProductCard";

/**
 * OfertasDaSemana — funde DropDoDia + FlashDealsStrip (§6.5). UMA temporalidade:
 * semanal. UM único countdown NA SEÇÃO (header) — os produtos usam o ProductCard
 * padrão da casa (v3), consistente com home/listagem/PDP.
 */

function withGuaranteedDiscount(p: Product): Product {
  if (p.oldPriceNum && p.oldPriceNum > p.priceNum) return p;
  const pct = 15 + (p.id % 10);
  const oldPriceNum = Math.round((p.priceNum / (1 - pct / 100)) * 100) / 100;
  return { ...p, oldPriceNum, oldPrice: `R$ ${oldPriceNum.toFixed(2).replace(".", ",")}` };
}

/** Fim da semana comercial: domingo 23:59:59 (hoje, se já for domingo). */
function getWeekEnd() {
  const d = new Date();
  const daysUntilSun = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + daysUntilSun);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(target - now, 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function Countdown({ target }: { target: number }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const units = [
    { label: "dias", value: pad(days) },
    { label: "h", value: pad(hours) },
    { label: "min", value: pad(minutes) },
    { label: "s", value: pad(seconds) },
  ];
  return (
    <div className="inline-flex items-center gap-1.5" role="timer">
      {/* leitor de tela: só muda a cada minuto (sem segundos) → anúncio por minuto */}
      <span className="sr-only" aria-live="polite">
        {`Oferta termina em ${days} dias ${hours} horas e ${minutes} minutos`}
      </span>
      {units.map((u, i) => (
        <span key={u.label} className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span
            className="num inline-flex flex-col items-center justify-center rounded-[10px]"
            style={{
              minWidth: 44, padding: "6px 8px",
              background: "var(--surface-2)", border: "1px solid var(--edge)",
            }}
          >
            <span style={{ fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "18px", lineHeight: 1, color: "var(--ink-strong)" }}>
              {u.value}
            </span>
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-meta)", marginTop: 2 }}>
              {u.label}
            </span>
          </span>
          {i < units.length - 1 && <span style={{ color: "var(--ink-subtle)", fontWeight: 700 }}>:</span>}
        </span>
      ))}
    </div>
  );
}

export function OfertasDaSemana() {
  const { addItem } = useCart();
  const weekEnd = useMemo(() => getWeekEnd(), []);
  const add = (p: Product) =>
    addItem({ id: p.id, name: p.name, price: p.price, image: getPrimaryProductImage(p) });

  const picks = useMemo(() => {
    const visible = getVisibleCatalogProducts(allProducts);
    return [...visible]
      .filter((p) => p.oldPriceNum && p.oldPriceNum > p.priceNum)
      .sort((a, b) => (b.oldPriceNum! - b.priceNum) - (a.oldPriceNum! - a.priceNum))
      .slice(0, 4)
      .map(withGuaranteedDiscount);
  }, []);

  if (picks.length === 0) return null;

  return (
    <section className="px-5 py-12 md:px-12 md:py-16" style={{ background: "var(--surface-0)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <SectionHeader
            eyebrow="OFERTAS DA SEMANA"
            title="O palco é seu"
          />
          {/* countdown ÚNICO da seção (e da página) — sai de dentro dos cards */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, fontWeight: 600, color: "var(--ink-meta)" }}>
                Termina em
              </span>
              <Countdown target={weekEnd} />
            </div>
            <Link
              to="/produtos?promo=1"
              className="group inline-flex items-center gap-1.5 rounded-pill"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600, color: "var(--ink-strong)" }}
            >
              Ver todas
              <ArrowRight size={16} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--amber-deep)" }} />
            </Link>
          </div>
        </div>

        {/* cards padrão da casa — consistência total com home/listagem */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={add} />
          ))}
        </div>
      </div>
    </section>
  );
}
