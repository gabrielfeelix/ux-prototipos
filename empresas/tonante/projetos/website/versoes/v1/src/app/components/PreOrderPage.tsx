"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Rocket,
  Clock,
  Zap,
  ShieldCheck,
  ChevronRight,
  Flame,
  Search,
  X,
  TrendingUp,
  Filter,
  ArrowDownUp,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./section";
import { Footer } from "./Footer";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";
import { PRE_ORDER_ITEMS } from "./PreOrderData";
import type { PreOrderInfo } from "./PreOrderData";

const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const delta = Math.max(0, target - now);
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
    delta,
  };
}

function formatReleaseDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function parsePrice(s?: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

type SortKey = "soonest" | "most-reserved" | "price-asc" | "price-desc";
type DeliveryFilter = "all" | "month" | "quarter" | "later";

function PreOrderCard({ info }: { info: PreOrderInfo }) {
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === info.productId);
  const { days, hours, minutes, seconds, delta } = useCountdown(info.releaseDate);
  if (!product) return null;

  const reservedPct = Math.min(100, Math.round((info.reservedUnits / info.totalUnits) * 100));
  const image = getPrimaryProductImage(product);
  const isHot = reservedPct >= 70;
  const isImminent = delta > 0 && delta < 30 * 86_400_000;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/produto/${product.id}`)}
      style={{
        borderRadius: "var(--radius-card-lg)",
        background: "linear-gradient(135deg, #120608 0%, #1a080b 50%, #120608 100%)",
        border: "1px solid rgba(17, 17, 17, 0.08)",
        boxShadow: "var(--shadow-pop)",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* subtle red accent (hover reveals more) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 85% 0%, rgba(17, 17, 17, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0">
        {/* image */}
        <div
          className="relative h-[260px] md:h-full overflow-hidden"
          style={{ background: "rgba(var(--foreground-rgb), 0.04)" }}
        >
          <ImageWithFallback
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: "#e08c12",
              color: "#fff",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <Rocket size={11} strokeWidth={2.4} />
            Pré-venda
          </span>

          {isHot && (
            <motion.span
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2 py-1"
              style={{
                background: "rgba(20,8,5,0.78)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(250,204,21,0.35)",
                color: "#facc15",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <Flame size={10} strokeWidth={2.4} />
              Esgotando
            </motion.span>
          )}
        </div>

        {/* details */}
        <div className="p-5 md:p-7 flex flex-col">
          <p
            className="text-ink-subtle mb-2"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {product.category}
          </p>
          <h3
            className="text-ink-strong mb-3 line-clamp-2"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "var(--text-xl)",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.22,
            }}
          >
            {product.name}
          </h3>

          <p
            className="text-ink-muted mb-5"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.55,
            }}
          >
            {info.highlight}
          </p>

          {/* countdown row */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {[
              { v: days, l: "D" },
              { v: hours, l: "H" },
              { v: minutes, l: "M" },
              { v: seconds, l: "S" },
            ].map((unit) => (
              <div
                key={unit.l}
                className="flex items-baseline justify-center gap-1 py-2"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                  borderRadius: "var(--radius-card-sm)",
                }}
              >
                <span
                  className="text-ink-strong tabular-nums"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                  }}
                >
                  {pad(unit.v)}
                </span>
                <span
                  className="text-ink-subtle"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                  }}
                >
                  {unit.l}
                </span>
              </div>
            ))}
          </div>

          {/* progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-ink-muted"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Reservas
              </span>
              <span
                className="text-ink-strong tabular-nums"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 700,
                }}
              >
                {reservedPct}%
              </span>
            </div>
            <div
              className="relative h-1.5 w-full overflow-hidden"
              style={{ background: "rgba(var(--foreground-rgb), 0.06)", borderRadius: "var(--radius-pill)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${reservedPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-y-0 left-0"
                style={{
                  background: "linear-gradient(90deg, #e08c12 0%, #ff7a3d 100%)",
                  borderRadius: "var(--radius-pill)",
                }}
              />
            </div>
          </div>

          {/* footer row */}
          <div className="flex flex-col items-stretch gap-3 mt-auto pt-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-ink-subtle mb-1"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {isImminent ? "Em breve" : "Entrega"} · {formatReleaseDate(info.releaseDate)}
              </p>
              <p
                className="text-ink-strong leading-none"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                }}
              >
                {info.preOrderPrice ?? product.price}
              </p>
            </div>
            {/* <a> dentro de <a> é inválido: o card inteiro já é o Link, então
                aqui o botão é span e os estados vêm do group do pai. */}
            <Button
              as="span"
              hierarchy="primary"
              intent="buy"
              size="lg"
              className="w-full px-6 transition-all duration-300 group-hover:translate-x-0.5 md:w-auto"
            >
              Reservar
              <ChevronRight size={14} strokeWidth={2.4} />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function HeroSection({
  featured,
}: {
  featured?: {
    name: string;
    category: string;
    image: string;
    price: string;
    highlight: string;
  };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.4]);
  const floatY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: "60vh",
        background: "var(--surface-0)",
      }}
    >
      {/* subtle red glow top-right (PCYES identity) */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y, opacity }}
      >
        <div
          className="absolute"
          style={{
            top: "-25%",
            right: "-20%",
            width: "70%",
            height: "90%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.08) 0%, rgba(200, 120, 0,0.025) 40%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-20%",
            left: "-12%",
            width: "45%",
            height: "55%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.04) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />
      </motion.div>

      {/* bottom fade to background */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--color-background) 100%)",
        }}
      />

      {/* featured product floating */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: floatY }}
          className="pointer-events-none hidden lg:block absolute top-1/2 right-[5%] xl:right-[8%] -translate-y-1/2 z-10"
        >
          {/* glow behind - sutil */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 65%, rgba(17, 17, 17, 0.07) 0%, rgba(17, 17, 17, 0.02) 40%, transparent 70%)",
              filter: "blur(60px)",
              transform: "scale(1.1)",
            }}
          />
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
            style={{
              width: "clamp(360px, 32vw, 480px)",
              height: "clamp(360px, 32vw, 480px)",
            }}
          >
            <ImageWithFallback
              src={featured.image}
              alt={featured.name}
              className="w-full h-full object-contain"
              style={{
                filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.22))",
              }}
            />
            {/* floating info card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-6 -left-6 pointer-events-auto"
              style={{
                background: "rgba(20,5,7,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(200, 120, 0,0.25)",
                borderRadius: "var(--radius-card-md)",
                padding: "14px 18px",
                boxShadow: "0 20px 50px -16px rgba(200, 120, 0,0.4)",
                maxWidth: "260px",
              }}
            >
              <p
                className="text-ink-muted mb-1"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Destaque · {featured.category}
              </p>
              <p
                className="text-ink-strong mb-1.5 line-clamp-1"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {featured.name}
              </p>
              <p
                className="text-[#ff7770]"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {featured.price}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <div
        className="relative max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col justify-center"
        style={{ minHeight: "60vh", paddingTop: "48px", paddingBottom: "56px" }}
      >
        {/* breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-7"
        >
          <Link
            to="/"
            className="text-ink-subtle hover:text-ink transition-colors"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          <span className="text-ink-subtle" style={{ fontSize: "var(--text-caption)" }}>/</span>
          <span
            className="text-ink-muted"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
          >
            Pré-venda
          </span>
        </motion.div>

        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-5"
        >
          <span
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(17, 17, 17, 0.08)",
              border: "1px solid rgba(200, 120, 0,0.25)",
              color: "#ff7770",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "#e08c12", animationDuration: "2.4s", opacity: 0.7 }}
              />
              <span
                className="relative rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#e08c12",
                  boxShadow: "0 0 8px rgba(200, 120, 0,0.9)",
                }}
              />
            </span>
            Pré-venda PCYES
          </span>
        </motion.div>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 max-w-[900px]"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "clamp(32px, 6vw, 76px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            color: "#fff",
          }}
        >
          O futuro do hardware,
          <br />
          <span
            style={{
              backgroundImage:
                "linear-gradient(120deg, #ffffff 0%, #a0a0a8 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            antes de todo mundo.
          </span>
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-ink-muted max-w-[580px] mb-12"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Lançamentos exclusivos, edições limitadas e tecnologia de ponta em
          primeira mão. Reserve sem custo, pague apenas no despacho.
        </motion.p>

        {/* feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2.5 mb-14"
        >
          {[
            { icon: ShieldCheck, label: "Cancelamento livre" },
            { icon: Clock, label: "Sem cobrança até envio" },
            { icon: Zap, label: "Entrega prioritária" },
          ].map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-ink transition-all hover:text-ink-strong hover:bg-white/[0.04]"
              style={{
                background: "rgba(var(--foreground-rgb), 0.02)",
                border: "1px solid rgba(var(--foreground-rgb), 0.07)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-ink-muted">
                <f.icon size={13} strokeWidth={2} />
              </span>
              {f.label}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

function FiltersBar({
  categories,
  activeCategory,
  setActiveCategory,
  delivery,
  setDelivery,
  sort,
  setSort,
  search,
  setSearch,
  resultCount,
}: {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  delivery: DeliveryFilter;
  setDelivery: (v: DeliveryFilter) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  search: string;
  setSearch: (v: string) => void;
  resultCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const deliveryLabels: Record<DeliveryFilter, string> = {
    all: "Todas",
    month: "Este mês",
    quarter: "Próx. 3 meses",
    later: "Mais tarde",
  };
  const sortLabels: Record<SortKey, string> = {
    soonest: "Lançamento mais próximo",
    "most-reserved": "Mais reservados",
    "price-asc": "Menor preço",
    "price-desc": "Maior preço",
  };

  const activeFilters =
    (activeCategory !== "all" ? 1 : 0) +
    (delivery !== "all" ? 1 : 0) +
    (search.trim().length > 0 ? 1 : 0);

  return (
    <div
      className="sticky z-40"
      style={{
        top: "64px",
        background: "rgba(7,7,8,0.78)",
        backdropFilter: "blur(24px) saturate(140%)",
        borderBottom: "1px solid rgba(var(--foreground-rgb), 0.05)",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* search */}
          <div
            className="flex items-center gap-2.5 px-4 h-11 md:h-10 w-full md:w-auto md:flex-1 md:min-w-[200px] md:max-w-[320px] transition-colors focus-within:border-edge-strong"
            style={{
              background: "rgba(var(--foreground-rgb), 0.025)",
              border: "1px solid rgba(var(--foreground-rgb), 0.06)",
              borderRadius: "var(--radius-card-sm)",
            }}
          >
            <Search size={14} className="text-ink-subtle" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar lançamento..."
              className="preorder-field bg-transparent outline-none flex-1 text-ink-strong placeholder:text-ink-subtle"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="flex items-center justify-center h-11 w-11 md:h-auto md:w-auto text-ink-subtle hover:text-ink-strong cursor-pointer"
              >
                <X size={13} strokeWidth={2.2} />
              </button>
            )}
          </div>

          {/* desktop chips */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap">
            {["all", ...categories].map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 h-10 rounded-full transition-all cursor-pointer"
                  style={{
                    background: isActive ? "rgba(var(--foreground-rgb), 0.08)" : "transparent",
                    border: isActive
                      ? "1px solid rgba(var(--foreground-rgb), 0.18)"
                      : "1px solid rgba(var(--foreground-rgb), 0.07)",
                    color: isActive ? "#fff" : "rgba(var(--foreground-rgb), 0.6)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 500,
                  }}
                >
                  {cat === "all" ? "Todas" : cat}
                </button>
              );
            })}
          </div>

          {/* mobile filter toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 h-11 md:h-10 px-3.5 rounded-full text-ink cursor-pointer"
            style={{
              background: "rgba(var(--foreground-rgb), 0.025)",
              border: "1px solid rgba(var(--foreground-rgb), 0.07)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
            <Filter size={13} strokeWidth={2.2} />
            Filtros
            {activeFilters > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                style={{
                  background: "#e08c12",
                  color: "#fff",
                  fontSize: "var(--text-caption)",
                  fontWeight: 700,
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>

          <div className="hidden md:block md:flex-1" />

          {/* sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="preorder-field appearance-none h-11 md:h-10 pl-9 pr-9 rounded-full text-ink cursor-pointer hover:text-ink-strong transition-colors"
              style={{
                background: "rgba(var(--foreground-rgb), 0.025)",
                border: "1px solid rgba(var(--foreground-rgb), 0.07)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
              }}
            >
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <option key={k} value={k} style={{ background: "var(--surface-0)", color: "#fff" }}>
                  {sortLabels[k]}
                </option>
              ))}
            </select>
            <ArrowDownUp
              size={13}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
          </div>
        </div>

        {/* secondary row: delivery + count */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span
            className="text-ink-subtle mr-1"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Entrega
          </span>
          {(Object.keys(deliveryLabels) as DeliveryFilter[]).map((d) => {
            const isActive = delivery === d;
            return (
              <button
                key={d}
                onClick={() => setDelivery(d)}
                className="px-3 h-11 md:h-7 rounded-full transition-all cursor-pointer"
                style={{
                  background: isActive ? "rgba(var(--foreground-rgb), 0.06)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(var(--foreground-rgb), 0.14)"
                    : "1px solid rgba(var(--foreground-rgb), 0.05)",
                  color: isActive ? "#fff" : "rgba(var(--foreground-rgb), 0.5)",
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                }}
              >
                {deliveryLabels[d]}
              </button>
            );
          })}

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden w-full overflow-hidden"
              >
                <div className="flex items-center gap-2 flex-wrap mt-2 pt-2 border-t border-edge-subtle">
                  {["all", ...categories].map((cat) => {
                    const isActive = cat === activeCategory;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className="px-3 h-11 rounded-full transition-all cursor-pointer"
                        style={{
                          background: isActive ? "rgba(var(--foreground-rgb), 0.08)" : "transparent",
                          border: isActive
                            ? "1px solid rgba(var(--foreground-rgb), 0.18)"
                            : "1px solid rgba(var(--foreground-rgb), 0.06)",
                          color: isActive ? "#fff" : "rgba(var(--foreground-rgb), 0.55)",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          fontWeight: 500,
                        }}
                      >
                        {cat === "all" ? "Todas" : cat}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1" />

          <span
            className="inline-flex items-center gap-1.5 text-ink-muted tabular-nums"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
            <TrendingUp size={11} strokeWidth={2} className="text-ink-subtle" />
            {resultCount} {resultCount === 1 ? "produto" : "produtos"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PreOrderPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [delivery, setDelivery] = useState<DeliveryFilter>("all");
  const [sort, setSort] = useState<SortKey>("soonest");
  const [search, setSearch] = useState<string>("");

  const enriched = useMemo(() => {
    return PRE_ORDER_ITEMS.map((info) => {
      const product = allProducts.find((p) => p.id === info.productId);
      return { info, product };
    }).filter((x) => x.product);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    enriched.forEach((x) => x.product && set.add(x.product.category));
    return Array.from(set);
  }, [enriched]);

  const featured = useMemo(() => {
    if (!enriched.length) return undefined;
    const chair = enriched.find((x) => x.info.productId === 446) ?? enriched[0];
    if (!chair?.product) return undefined;
    return {
      name: chair.product.name,
      category: chair.product.category,
      image: getPrimaryProductImage(chair.product),
      price: chair.info.preOrderPrice ?? chair.product.price,
      highlight: chair.info.highlight,
    };
  }, [enriched]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const month = 30 * 86_400_000;
    const quarter = 90 * 86_400_000;

    let list = enriched.filter(({ info, product }) => {
      if (!product) return false;
      if (activeCategory !== "all" && product.category !== activeCategory) return false;

      if (delivery !== "all") {
        const delta = new Date(info.releaseDate).getTime() - now;
        if (delivery === "month" && delta > month) return false;
        if (delivery === "quarter" && (delta <= month || delta > quarter)) return false;
        if (delivery === "later" && delta <= quarter) return false;
      }

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${product.name} ${product.category} ${info.highlight}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "soonest":
          return (
            new Date(a.info.releaseDate).getTime() - new Date(b.info.releaseDate).getTime()
          );
        case "most-reserved":
          return (
            b.info.reservedUnits / b.info.totalUnits -
            a.info.reservedUnits / a.info.totalUnits
          );
        case "price-asc":
          return parsePrice(a.info.preOrderPrice ?? a.product!.price) -
            parsePrice(b.info.preOrderPrice ?? b.product!.price);
        case "price-desc":
          return parsePrice(b.info.preOrderPrice ?? b.product!.price) -
            parsePrice(a.info.preOrderPrice ?? a.product!.price);
        default:
          return 0;
      }
    });

    return list;
  }, [enriched, activeCategory, delivery, search, sort]);

  const clearFilters = () => {
    setActiveCategory("all");
    setDelivery("all");
    setSearch("");
    setSort("soonest");
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection featured={featured} />

      <FiltersBar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        delivery={delivery}
        setDelivery={setDelivery}
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        resultCount={filtered.length}
      />

      {/* grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 md:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p
              className="text-ink-subtle mb-2"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Catálogo
            </p>
            <h2
              className="text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(24px, 2.6vw, 34px)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              Lançamentos em pré-venda
            </h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 md:py-24 text-center"
            style={{
              background: "rgba(var(--foreground-rgb), 0.015)",
              border: "1px dashed rgba(var(--foreground-rgb), 0.08)",
              borderRadius: "var(--radius-card-lg)",
            }}
          >
            <Search size={28} className="text-ink-subtle mb-5" strokeWidth={1.6} />
            <h3
              className="text-ink-strong mb-2"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
            >
              Nenhum lançamento encontrado
            </h3>
            <p
              className="text-ink-muted mb-6 max-w-[400px]"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.55,
              }}
            >
              Tente ajustar os filtros ou voltar para ver todos os lançamentos disponíveis.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 h-11 md:h-10 rounded-full text-ink-strong cursor-pointer transition-colors hover:bg-white/95"
              style={{
                background: "#fff",
                color: "#0a0a0c",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
            {filtered.map(({ info }) => (
              <PreOrderCard key={info.productId} info={info} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
