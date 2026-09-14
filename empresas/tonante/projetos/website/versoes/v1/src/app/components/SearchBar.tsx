"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { type Product } from "./productsData";
import { getPrimaryProductImage, getProductSwatches, getVisibleCatalogProducts } from "./productPresentation";
import { matchesSearchQuery } from "../lib/searchMatch";

/* SearchBar — barra de busca + painel "mais buscados" do header.
   Extraída do Navbar (v1) para poder ser reusada pelo HeaderV2 sem
   duplicar markup: as duas versões abrem exatamente o mesmo painel. */

const mostSearchedKeywords = ["Violões", "Guitarras", "Contrabaixos", "Cordas", "Capotraste", "Afinadores", "Suportes", "Palhetas"];
const mostSearchedProductIds: number[] = [];
const searchCategories = ["Todas as categorias", "Violões", "Guitarras", "Contrabaixos", "Acessórios"];

const visibleCatalogProducts = getVisibleCatalogProducts();

export function SearchBar({
  className = "",
  /** "bar" centraliza o painel na própria barra (v1, barra centralizada);
      "viewport" centraliza na tela (v2, barra deslocada pro lado). */
  panelAnchor = "bar",
  /** "lg" = barra mais alta e fonte maior (header da v2) */
  size = "md",
}: { className?: string; panelAnchor?: "bar" | "viewport"; size?: "md" | "lg" }) {
  const lg = size === "lg";
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState(searchCategories[0]);
  const [searchCategoryOpen, setSearchCategoryOpen] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const [panelTop, setPanelTop] = useState(0);

  useEffect(() => {
    if (panelAnchor !== "viewport" || !searchPanelOpen) return;
    const measure = () => {
      const r = searchPanelRef.current?.getBoundingClientRect();
      if (r) setPanelTop(Math.round(r.bottom + 10));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [panelAnchor, searchPanelOpen]);

  // fecha ao trocar de rota
  useEffect(() => {
    setSearchPanelOpen(false);
    setSearchCategoryOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchPanelOpen) {
        setSearchPanelOpen(false);
        setSearchCategoryOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchPanelOpen]);

  useEffect(() => {
    if (!searchPanelOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        setSearchPanelOpen(false);
        setSearchCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchPanelOpen]);

  const searchCategoryMatch = useMemo(() => {
    const map: Record<string, string[]> = {
      "Violões": ["Violões"],
      "Guitarras": ["Guitarras"],
      "Contrabaixos": ["Contrabaixos"],
      "Acessórios": ["Acessórios"],
    };
    return map[searchCategory] ?? [];
  }, [searchCategory]);

  const mostSearchedProducts = useMemo(() => {
    if (searchCategoryMatch.length === 0) {
      const byIds = mostSearchedProductIds
        .map((id) => visibleCatalogProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      if (byIds.length) return byIds;
      return [...visibleCatalogProducts].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 5);
    }
    return visibleCatalogProducts
      .filter((p) => searchCategoryMatch.includes(p.category))
      .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      .slice(0, 5);
  }, [searchCategoryMatch]);

  const displayedKeywords = mostSearchedKeywords;

  const searchResults = searchQuery.trim().length > 0
    ? visibleCatalogProducts
      .filter((p) => matchesSearchQuery([p.name, p.category, p.subcategory, p.brand], searchQuery))
      .slice(0, 8)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchQuery.trim();
    if (!value) return;
    setSearchPanelOpen(false);
    navigate(`/produtos?search=${encodeURIComponent(value)}`);
  };

  return (
    <div ref={searchPanelRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full"
      >
        <div
          className="flex items-center overflow-hidden rounded-full border-[1.5px] transition-all"
          style={{
            height: lg ? 52 : 44,
            background: "var(--surface-1)",
            borderColor: searchPanelOpen ? "var(--primary)" : "#d6d6d6",
            boxShadow: "none",
          }}
        >
          {/* All categories dropdown */}
          <div className="relative h-full flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchCategoryOpen((p) => !p);
              }}
              className="flex h-full items-center gap-1.5 pl-5 pr-3 text-ink transition-colors hover:text-ink-strong"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: lg ? "15px" : "var(--text-sm)", fontWeight: 600 }}
            >
              <span className="hidden xl:inline">{searchCategory}</span>
              <span className="xl:hidden">Categorias</span>
              <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${searchCategoryOpen ? "rotate-180" : ""}`} />
            </button>
            <span className="absolute right-0 top-1/2 h-5 w-px -translate-y-1/2" style={{ background: "rgba(17,17,17,0.12)" }} />
          </div>

          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchPanelOpen(true)}
            placeholder="O que você está procurando?"
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-ink-strong outline-none placeholder:text-ink-subtle"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: lg ? "15px" : "var(--text-sm)" }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="flex h-full w-9 items-center justify-center text-ink-subtle transition-colors hover:text-ink"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            className={`flex h-full w-12 items-center justify-center transition-colors ${
              searchPanelOpen ? "text-ink-strong" : "text-ink hover:text-ink-strong"
            }`}
            aria-label="Buscar"
          >
            <Search size={18} strokeWidth={searchPanelOpen ? 2.4 : 2} />
          </button>
        </div>

        {/* X close (when panel open) */}
        <AnimatePresence>
          {searchPanelOpen && (
            <motion.button
              key="search-close"
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setSearchPanelOpen(false);
                setSearchQuery("");
                setSearchCategoryOpen(false);
                searchInputRef.current?.blur();
              }}
              className={`absolute -right-12 top-1/2 z-[61] flex h-10 w-10 -translate-y-1/2 items-center justify-center transition-colors cursor-pointer text-ink hover:text-ink-strong`}
              aria-label="Fechar busca"
            >
              <X size={22} strokeWidth={1.7} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Category dropdown */}
        <AnimatePresence>
          {searchCategoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 top-[48px] z-[70] w-[220px] overflow-hidden rounded-[var(--radius-card-sm)] border border-edge bg-surface-0 shadow-[var(--shadow-pop)]"
            >
              {searchCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSearchCategory(cat);
                    setSearchCategoryOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    searchCategory === cat
                      ? "bg-foreground/[0.08] text-ink-strong"
                      : "text-ink hover:bg-white/[0.06] hover:text-ink-strong"
                  }`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 500 }}
                >
                  {cat}
                  {searchCategory === cat && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search panel — most searched products + keywords */}
        <AnimatePresence>
          {searchPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={
                panelAnchor === "viewport"
                  ? "fixed left-1/2 z-[60] w-[min(1320px,calc(100vw-64px))] -translate-x-1/2 overflow-hidden rounded-card-lg shadow-[var(--shadow-pop)]"
                  : "absolute left-1/2 top-[58px] z-[60] w-[min(1320px,calc(100vw-64px))] -translate-x-1/2 overflow-hidden rounded-card-lg shadow-[var(--shadow-pop)]"
              }
              style={{
                background: panelAnchor === "viewport" ? "#ffffff" : "var(--surface-2)",
                border: "1px solid var(--border)",
                ...(panelAnchor === "viewport" ? { top: panelTop } : null),
              }}
            >
              {searchQuery.trim().length === 0 ? (
                <div className="grid grid-cols-[1fr_260px] gap-0">
                  {/* Left: produtos */}
                  <div className="border-r border-edge-subtle px-10 py-9">
                    <h4
                      className="mb-7 text-ink-strong"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-lg)",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Produtos mais buscados
                    </h4>
                    <div className="grid grid-cols-5 gap-6">
                      {mostSearchedProducts.map((p) => {
                        const img = getPrimaryProductImage(p);
                        const swatches = getProductSwatches(p);
                        const hasDiscount = p.oldPriceNum && p.oldPriceNum > p.priceNum;
                        const discount = hasDiscount
                          ? Math.round(((p.oldPriceNum! - p.priceNum) / p.oldPriceNum!) * 100)
                          : 0;
                        return (
                          <Link
                            key={p.id}
                            to={`/produto/${p.id}`}
                            onClick={() => setSearchPanelOpen(false)}
                            className="group block"
                          >
                            <div
                              className="relative aspect-square overflow-hidden transition-all"
                              style={{
                                background: panelAnchor === "viewport"
                                  ? "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)"
                                  : "var(--well)",
                                borderRadius: "var(--radius-card-md)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              {discount > 0 && (
                                <span
                                  className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-ink-strong"
                                  style={{
                                    background: "var(--primary)",
                                    fontFamily: "var(--font-family-inter)",
                                    fontSize: "var(--text-caption)",
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  -{discount}%
                                </span>
                              )}
                              <ImageWithFallback
                                src={img}
                                alt={p.name}
                                className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.06]"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            </div>
                            <p
                              className="mt-4 line-clamp-2 text-ink transition-colors group-hover:text-ink-strong"
                              style={{
                                fontFamily: "var(--font-family-figtree)",
                                fontSize: "var(--text-sm)",
                                fontWeight: 600,
                                lineHeight: 1.3,
                                letterSpacing: "-0.005em",
                              }}
                            >
                              {p.name}
                            </p>
                            <div className="mt-2 flex items-baseline gap-1.5">
                              <span
                                className={hasDiscount ? "" : "text-ink-strong"}
                                style={{
                                  fontFamily: "var(--font-family-figtree)",
                                  fontSize: "var(--text-base)",
                                  fontWeight: 700,
                                  letterSpacing: "-0.01em",
                                  color: hasDiscount ? "var(--primary)" : undefined,
                                }}
                              >
                                {p.price}
                              </span>
                              {hasDiscount && p.oldPrice && (
                                <span
                                  className="line-through text-ink-subtle"
                                  style={{
                                    fontFamily: "var(--font-family-inter)",
                                    fontSize: "var(--text-caption)",
                                  }}
                                >
                                  {p.oldPrice}
                                </span>
                              )}
                            </div>
                            {swatches.length > 0 && (
                              <div className="mt-2.5 flex items-center gap-1.5">
                                {swatches.slice(0, 4).map((s) => (
                                  <span
                                    key={s.productId}
                                    className="inline-block h-3 w-3 rounded-full"
                                    style={{
                                      background: s.color,
                                      border: "1px solid rgba(var(--foreground-rgb), 0.18)",
                                    }}
                                    aria-label={s.label}
                                  />
                                ))}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: keywords */}
                  <div className="px-7 py-9">
                    <h4
                      className="mb-6 text-ink-strong"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-lg)",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Termos mais buscados
                    </h4>
                    <div className="flex flex-col">
                      {displayedKeywords.map((kw) => (
                        <Link
                          key={kw}
                          to={`/produtos?search=${encodeURIComponent(kw)}`}
                          onClick={() => {
                            setSearchPanelOpen(false);
                            setSearchQuery("");
                          }}
                          className="group flex items-center justify-between py-2.5 text-left text-ink transition-colors hover:text-[var(--primary)]"
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-sm)",
                            fontWeight: 500,
                          }}
                        >
                          <span>{kw}</span>
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.8}
                            className="text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--primary)]"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="px-10 py-9">
                  <div className="mb-7 flex items-baseline justify-between">
                    <h4
                      className="text-ink-strong"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-lg)",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Resultados para "{searchQuery}"
                    </h4>
                    <span
                      className="text-ink-muted"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "0.1em" }}
                    >
                      {searchResults.length} {searchResults.length === 1 ? "PRODUTO" : "PRODUTOS"}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-6 max-h-[520px] overflow-y-auto pr-1">
                    {searchResults.map((p) => {
                      const img = getPrimaryProductImage(p);
                      const swatches = getProductSwatches(p);
                      const hasDiscount = p.oldPriceNum && p.oldPriceNum > p.priceNum;
                      const discount = hasDiscount
                        ? Math.round(((p.oldPriceNum! - p.priceNum) / p.oldPriceNum!) * 100)
                        : 0;
                      return (
                        <Link
                          key={p.id}
                          to={`/produto/${p.id}`}
                          onClick={() => {
                            setSearchQuery("");
                            setSearchPanelOpen(false);
                          }}
                          className="group block"
                        >
                          <div
                            className="relative aspect-square overflow-hidden transition-all"
                              style={{
                                background: panelAnchor === "viewport"
                                  ? "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)"
                                  : "var(--well)",
                                borderRadius: "var(--radius-card-md)",
                                border: "1px solid var(--border)",
                              }}
                          >
                            {discount > 0 && (
                              <span
                                className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-ink-strong"
                                style={{
                                  background: "var(--primary)",
                                  fontFamily: "var(--font-family-inter)",
                                  fontSize: "var(--text-caption)",
                                  fontWeight: 700,
                                  letterSpacing: "0.02em",
                                }}
                              >
                                -{discount}%
                              </span>
                            )}
                            <ImageWithFallback
                              src={img}
                              alt={p.name}
                              className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.06]"
                              style={{ mixBlendMode: "multiply" }}
                            />
                          </div>
                          <p
                            className="mt-4 line-clamp-2 text-ink transition-colors group-hover:text-ink-strong"
                            style={{
                              fontFamily: "var(--font-family-figtree)",
                              fontSize: "var(--text-sm)",
                              fontWeight: 600,
                              lineHeight: 1.3,
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {p.name}
                          </p>
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span
                              style={{
                                fontFamily: "var(--font-family-figtree)",
                                fontSize: "var(--text-base)",
                                fontWeight: 700,
                                letterSpacing: "-0.01em",
                                color: hasDiscount ? "var(--primary)" : "#fff",
                              }}
                            >
                              {p.price}
                            </span>
                            {hasDiscount && p.oldPrice && (
                              <span
                                className="line-through text-ink-subtle"
                                style={{
                                  fontFamily: "var(--font-family-inter)",
                                  fontSize: "var(--text-caption)",
                                }}
                              >
                                {p.oldPrice}
                              </span>
                            )}
                          </div>
                          {swatches.length > 0 && (
                            <div className="mt-2.5 flex items-center gap-1.5">
                              {swatches.slice(0, 4).map((s) => (
                                <span
                                  key={s.productId}
                                  className="inline-block h-3 w-3 rounded-full"
                                  style={{
                                    background: s.color,
                                    border: "1px solid rgba(var(--foreground-rgb), 0.18)",
                                  }}
                                  aria-label={s.label}
                                />
                              ))}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-10 py-16 text-center">
                  <p className="text-ink-muted" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600 }}>
                    Nenhum produto encontrado
                  </p>
                  <p className="mt-2 text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                    Tente outro termo ou veja os produtos mais buscados
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
