"use client";

import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, X } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../components/CartContext";
import { allProducts, type Product } from "../components/productsData";
import { getPrimaryProductImage } from "../components/productPresentation";
import { isFotoAmbientada } from "../components/photoBackdrop";
import { getHistoriaDoProduto } from "../components/productStory";
import { getPixPrice, formatBRL, getInstallmentCount, getInstallmentValue } from "../components/productEnhancements";
import { compareTypeOf, COMPARE_MAX } from "../components/CompareBar";
import { getProductUrl } from "../lib/slug";

/* Comparador (ref: Gibson/Epiphone, layout nosso).
   Três colunas verticais com a ficha lado a lado. A linha que MUDA entre os
   produtos é a única que interessa — ela ganha marcador âmbar e existe um
   filtro "só o que difere", senão a tabela vira parede de texto igual. */

type Column = { product: Product; ficha: { label: string; value: string }[]; abertura: string; destaques: { label: string; value: string }[] };

function Foto({ product }: { product: Product }) {
  const src = getPrimaryProductImage(product);
  const ambientada = isFotoAmbientada(src);
  return (
    <div
      className="relative aspect-square w-full overflow-hidden"
      style={{ borderRadius: "var(--radius-card)", background: "var(--gradient-photo)" }}
    >
      <ImageWithFallback
        src={src}
        alt={product.name}
        className={`absolute inset-0 h-full w-full ${ambientada ? "object-cover" : "object-contain p-[8%]"}`}
        style={ambientada ? undefined : { mixBlendMode: "multiply" }}
      />
    </div>
  );
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  const ids = useMemo(
    () =>
      (params.get("ids") || "")
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
        .slice(0, COMPARE_MAX),
    [params],
  );

  const columns = useMemo<Column[]>(
    () =>
      ids
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .map((product) => {
          const historia = getHistoriaDoProduto(product);
          return {
            product,
            ficha: historia.ficha.length ? historia.ficha : product.specs ?? [],
            abertura: historia.abertura,
            destaques: historia.destaques,
          };
        }),
    [ids],
  );

  /* união das linhas na ordem em que aparecem no primeiro produto — coluna
     sem aquela linha mostra "—", nunca some (senão as colunas desalinham) */
  const rows = useMemo(() => {
    const labels: string[] = [];
    columns.forEach((c) => c.ficha.forEach((f) => { if (!labels.includes(f.label)) labels.push(f.label); }));
    return labels.map((label) => {
      const values = columns.map((c) => c.ficha.find((f) => f.label === label)?.value ?? "—");
      const differs = new Set(values).size > 1;
      return { label, values, differs };
    });
  }, [columns]);

  const visibleRows = onlyDiff ? rows.filter((r) => r.differs) : rows;
  const tipo = columns.length ? compareTypeOf(columns[0].product) : "";

  const remove = (id: number) => {
    const rest = ids.filter((x) => x !== id);
    if (!rest.length) return navigate(-1);
    setParams({ ids: rest.join(",") }, { replace: true });
  };

  const buy = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: getPrimaryProductImage(product) });
    setAdded(product.id);
    window.setTimeout(() => setAdded((v) => (v === product.id ? null : v)), 2200);
  };

  const gridCols = {
    gridTemplateColumns: `minmax(132px, 172px) repeat(${Math.max(columns.length, 1)}, minmax(230px, 1fr))`,
  } as const;

  if (!columns.length) {
    return (
      <>
        <SEO title="Comparar produtos" robots="noindex" />
        <div className="mx-auto max-w-[1180px] px-5 py-24 text-center md:px-10">
          <h1
            className="text-ink-strong"
            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Nada para comparar ainda
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.65 }}>
            Escolha até três produtos do mesmo tipo no catálogo e volte aqui.
          </p>
          <Link
            to="/produtos"
            className="mt-7 inline-flex h-11 items-center gap-2 px-6"
            style={{ borderRadius: "var(--radius-pill)", background: "var(--primary)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600 }}
          >
            Ver o catálogo
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Comparar produtos" robots="noindex" description="Compare instrumentos Tonante lado a lado: ficha técnica, preço e destaques." />

      <section className="border-b border-edge-subtle" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-ink-muted transition-colors hover:text-ink-strong"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}
          >
            <ArrowLeft size={15} /> Voltar ao catálogo
          </button>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.24em", fontWeight: 600, textTransform: "uppercase" }}>
                Comparador
              </span>
              <h1
                className="mt-3 text-ink-strong"
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 }}
              >
                {columns.length} {tipo.toLowerCase()} lado a lado
              </h1>
            </div>

            {/* filtro: a graça da comparação é o que difere */}
            <button
              type="button"
              onClick={() => setOnlyDiff((v) => !v)}
              aria-pressed={onlyDiff}
              className="inline-flex cursor-pointer items-center gap-2.5 border px-4 py-2.5 transition-colors"
              style={{
                borderRadius: "var(--radius-pill)",
                borderColor: onlyDiff ? "var(--primary)" : "var(--edge)",
                color: onlyDiff ? "var(--primary)" : "var(--ink-muted)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "13.5px",
                fontWeight: 600,
              }}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: onlyDiff ? "var(--primary)" : "var(--edge-strong)" }}
              />
              Só o que difere
            </button>
          </div>
        </div>
      </section>

      <section className="pb-24" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px]">
              {/* ── cabeçalho das colunas ── */}
              <div className="grid gap-x-6 pt-10" style={gridCols}>
                <div />
                {columns.map(({ product }) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-full flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`Tirar ${product.name} da comparação`}
                      className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full transition-colors"
                      style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink-strong)", boxShadow: "0 2px 8px rgba(17,17,17,0.12)" }}
                    >
                      <X size={15} strokeWidth={2} />
                    </button>

                    <Link to={getProductUrl(product)} className="block">
                      <Foto product={product} />
                    </Link>

                    {product.brand && (
                      <p className="mt-4 text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", letterSpacing: "0.16em", fontWeight: 600, textTransform: "uppercase" }}>
                        {product.brand}
                      </p>
                    )}
                    <Link to={getProductUrl(product)} className="mt-1.5 block">
                      <h2
                        className="text-ink-strong transition-colors hover:text-primary"
                        style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}
                      >
                        {product.name}
                      </h2>
                    </Link>

                    <span className="mt-2 flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={12} strokeWidth={0} fill={i <= Math.round(product.rating) ? "#f0a020" : "rgba(17,17,17,.18)"} />
                        ))}
                      </span>
                      <span className="num text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        ({product.reviews})
                      </span>
                    </span>

                    <p className="num mt-auto pt-4 text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em" }}>
                      {formatBRL(getPixPrice(product))}
                      <span className="ml-1.5 text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 500 }}>
                        no PIX
                      </span>
                    </p>
                    <p className="num mt-1 text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                      ou {getInstallmentCount(product.priceNum)}x de {formatBRL(getInstallmentValue(product.priceNum))}
                    </p>

                    {/* uma ação só: "Comprar agora" põe no carrinho, igual ao card */}
                    <button
                      type="button"
                      onClick={() => buy(product)}
                      className="mt-5 flex h-12 w-full shrink-0 cursor-pointer items-center justify-center transition-[background-color,transform] active:scale-[0.98]"
                      style={{
                        borderRadius: "var(--radius-pill)",
                        background: added === product.id ? "var(--ink-strong)" : "var(--buy-green)",
                        color: "#ffffff",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "14.5px",
                        fontWeight: 600,
                      }}
                    >
                      {added === product.id ? "No carrinho ✓" : "Comprar agora"}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* ── sobre ── */}
              <Group title="Sobre" />
              <div className="grid gap-x-6 border-b border-edge-subtle py-6" style={gridCols}>
                <div />
                {columns.map(({ product, abertura }) => (
                  <p key={product.id} className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", lineHeight: 1.65 }}>
                    {abertura}
                  </p>
                ))}
              </div>

              {/* ── destaques ── */}
              {columns.some((c) => c.destaques.length > 0) && (
                <>
                  <Group title="Destaques" />
                  <div className="grid gap-x-6 border-b border-edge-subtle py-6" style={gridCols}>
                    <div />
                    {columns.map(({ product, destaques }) => (
                      <ul key={product.id} className="space-y-2.5">
                        {destaques.map((d) => (
                          <li key={d.label} className="flex gap-2.5">
                            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", lineHeight: 1.5 }}>
                              <span className="text-ink-strong" style={{ fontWeight: 600 }}>{d.label}</span>
                              <span className="text-ink-muted"> · {d.value}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </>
              )}

              {/* ── ficha técnica ── */}
              <Group title="Ficha técnica" count={visibleRows.length} />
              {visibleRows.length === 0 ? (
                <p className="py-8 text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                  Nenhuma diferença de ficha entre esses produtos — o que muda é acabamento e preço.
                </p>
              ) : (
                visibleRows.map((row) => (
                  <div key={row.label} className="grid items-center gap-x-6 border-b border-edge-subtle py-4" style={gridCols}>
                    <div className="flex items-center gap-2">
                      {/* marcador da linha que difere */}
                      <span
                        aria-hidden
                        className="h-[14px] w-[2px] shrink-0"
                        style={{ background: row.differs ? "var(--primary)" : "transparent" }}
                      />
                      <span className="text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
                        {row.label}
                      </span>
                    </div>
                    {row.values.map((value, i) => (
                      <span
                        key={`${row.label}-${i}`}
                        className={value === "—" ? "text-ink-subtle" : "text-ink-strong"}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.5, fontWeight: row.differs && value !== "—" ? 600 : 400 }}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Group({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-3 pt-12">
      <h2
        className="text-ink-strong"
        style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      {count !== undefined && (
        <span className="num text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.18em", fontWeight: 600, textTransform: "uppercase" }}>
          {count} {count === 1 ? "linha" : "linhas"}
        </span>
      )}
    </div>
  );
}
