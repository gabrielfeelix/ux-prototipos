"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Plus, Scale, X } from "lucide-react";
import { type Product } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";
import { isFotoAmbientada } from "./photoBackdrop";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* Comparador do catálogo (ref: Gibson/Epiphone, layout nosso).
   Só compara produtos do MESMO tipo — comparar um violão com uma capa não
   responde pergunta nenhuma, e a tabela de specs sairia com metade das linhas
   vazia. O tipo é a subcategoria quando existe (Violão Clássico, Capas), senão
   a categoria. */

export const COMPARE_MAX = 3;

export function compareTypeOf(product: Product): string {
  return (product.subcategory || "").trim() || product.category;
}

/* Botão sob o card. Fora do quadro da foto de propósito: o card já usa os
   quatro cantos da imagem (medalhão, desconto, favoritar, espiar, ouvir o
   timbre) e mais um flutuante ali vira disputa de hover. */
export function CompareToggle({
  selected,
  disabled,
  onToggle,
  className = "",
}: {
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      disabled={disabled && !selected}
      className={`group/cmp inline-flex cursor-pointer items-center gap-2 transition-colors disabled:cursor-not-allowed ${className}`}
      style={{
        fontFamily: "var(--font-family-inter)",
        fontSize: "13px",
        fontWeight: 600,
        color: selected
          ? "var(--primary)"
          : disabled
          ? "var(--ink-subtle)"
          : "var(--ink-muted)",
        opacity: disabled && !selected ? 0.5 : 1,
      }}
    >
      <span
        aria-hidden
        className="grid h-[18px] w-[18px] place-items-center transition-all"
        style={{
          borderRadius: "5px",
          border: `1.5px solid ${selected ? "var(--primary)" : "var(--edge-strong)"}`,
          background: selected ? "var(--primary)" : "transparent",
          color: "#ffffff",
        }}
      >
        {selected ? (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2.5 6.3 4.8 8.6 9.5 3.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      {selected ? "Na comparação" : "Comparar"}
    </button>
  );
}

function Slot({ product, onRemove }: { product?: Product; onRemove?: () => void }) {
  if (!product) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="grid h-[68px] w-[68px] shrink-0 place-items-center"
          style={{
            borderRadius: "8px",
            border: "1px dashed var(--edge-strong)",
            color: "var(--ink-subtle)",
          }}
        >
          <Plus size={16} strokeWidth={1.8} />
        </div>
        <span
          className="text-ink-subtle"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px" }}
        >
          Escolher outro produto
        </span>
      </div>
    );
  }

  const foto = getPrimaryProductImage(product);
  const ambientada = isFotoAmbientada(foto);

  return (
    <div className="flex items-center gap-3">
      {/* mesmo well da vitrine: fundo --gradient-photo e a foto de estúdio em
          multiply, senão o retângulo branco da foto aparece dentro do cinza */}
      <div
        className="relative h-[68px] w-[68px] shrink-0 overflow-hidden"
        style={{ borderRadius: "8px", background: "var(--gradient-photo)" }}
      >
        <ImageWithFallback
          src={foto}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full ${ambientada ? "object-cover" : "object-contain p-[10%]"}`}
          style={ambientada ? undefined : { mixBlendMode: "multiply" }}
        />
      </div>
      <div className="min-w-0">
        <p
          className="line-clamp-2 text-ink-strong"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "13.5px",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 inline-flex cursor-pointer items-center gap-1 text-ink-subtle transition-colors hover:text-ink-strong"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px" }}
        >
          <X size={12} strokeWidth={2} /> Remover
        </button>
      </div>
    </div>
  );
}

export function CompareBar({
  items,
  collapsed,
  onToggleCollapsed,
  onRemove,
  onClear,
  onStart,
  notice,
}: {
  items: Product[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onStart: () => void;
  notice: string | null;
}) {
  const ready = items.length >= 2;
  const slots = Array.from({ length: COMPARE_MAX }, (_, i) => items[i]);

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40"
          style={{
            background: "var(--surface-1)",
            borderTop: "1px solid var(--edge)",
            boxShadow: "0 -14px 40px -22px rgba(17,17,17,0.35)",
          }}
          role="region"
          aria-label="Comparador de produtos"
        >
          <div className="mx-auto w-full max-w-[1680px] px-5 py-4 md:px-12 md:py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="flex cursor-pointer items-center gap-2.5 text-ink-strong"
                aria-expanded={!collapsed}
              >
                <Scale size={17} strokeWidth={1.8} style={{ color: "var(--primary)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "19px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Comparar produtos
                </span>
                <span
                  className="num text-ink-muted"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontVariantNumeric: "tabular-nums" }}
                >
                  {items.length} de {COMPARE_MAX}
                </span>
                <ChevronDown
                  size={16}
                  className="text-ink-subtle transition-transform duration-200"
                  style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
                />
              </button>

              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={onClear}
                  className="cursor-pointer text-ink-muted underline underline-offset-4 transition-colors hover:text-ink-strong"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px" }}
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={onStart}
                  disabled={!ready}
                  className="h-11 cursor-pointer px-6 transition-all disabled:cursor-not-allowed"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    background: ready ? "var(--primary)" : "var(--surface-3)",
                    color: ready ? "#ffffff" : "var(--ink-subtle)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Comparar agora
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    {slots.map((product, i) => (
                      <Slot
                        key={product ? product.id : `empty-${i}`}
                        product={product}
                        onRemove={product ? () => onRemove(product.id) : undefined}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {notice && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 px-4 py-2.5"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid rgba(179,54,31,0.28)",
                    background: "rgba(179,54,31,0.06)",
                    color: "#b3361f",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                  }}
                  role="status"
                >
                  {notice}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
