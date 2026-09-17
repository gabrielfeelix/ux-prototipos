"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, X, ArrowUpRight, ChevronDown, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { type Product } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { getPixPrice, formatBRL, getInstallmentCount, getInstallmentValue } from "./productEnhancements";
import { matchesSearchQuery } from "../lib/searchMatch";

/* SearchBar — barra de busca + painel "mais buscados" do header.
   Extraída do Navbar (v1) para poder ser reusada pelo HeaderV2 sem
   duplicar markup: as duas versões abrem exatamente o mesmo painel. */

const mostSearchedKeywords = ["Violões", "Guitarras", "Contrabaixos", "Cordas", "Capotraste", "Afinadores", "Suportes", "Palhetas"];
const mostSearchedProductIds: number[] = [];
const searchCategories = ["Todas as categorias", "Violões", "Guitarras", "Contrabaixos", "Acessórios"];

const visibleCatalogProducts = getVisibleCatalogProducts();

/* CardBusca — card do painel de busca. Repete a anatomia da vitrine da home
   (ProductCardV2): selo de desconto no verde de compra, estrelas com a
   contagem de avaliações e o preço em três andares — de quanto era, quanto é
   no PIX, em quantas vezes no cartão. Sem as bolinhas de cor: no
   painel não há espaço pra escolher acabamento, e o clique já leva pra PDP. */
function CardBusca({ p, fundo, onNavigate }: { p: Product; fundo: string; onNavigate: () => void }) {
  const img = getPrimaryProductImage(p);
  const discount = p.oldPriceNum ? Math.round((1 - p.priceNum / p.oldPriceNum) * 100) : 0;
  /* parcela sobre o preço de cartão, não sobre o do PIX — mesma regra do card
     da vitrine, senão a parcela prometeria um total que o checkout não cobra. */
  const parcelas = getInstallmentCount(p.priceNum);
  const valorParcela = getInstallmentValue(p.priceNum);
  return (
    <Link to={`/produto/${p.id}`} onClick={onNavigate} className="group block">
      <div
        className="relative aspect-square overflow-hidden transition-all"
        style={{
          background: fundo,
          borderRadius: "var(--radius-card-md)",
          border: "1px solid var(--border)",
        }}
      >
        {discount > 0 && (
          <span
            className="num absolute left-3 top-3 z-10 rounded-full px-2.5 py-1"
            style={{
              background: "var(--buy-green)",
              color: "#fff",
              fontFamily: "var(--font-family-inter)",
              fontSize: "12px",
              fontWeight: 700,
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
      <span className="mt-2 flex items-center gap-1.5">
        <span className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} strokeWidth={0} fill={i <= Math.round(p.rating) ? "#f0a020" : "rgba(51,51,51,.18)"} />
          ))}
        </span>
        <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "#8a8a8a" }}>
          ({p.reviews})
        </span>
      </span>
      {/* riscado ocupa altura mesmo sem promoção: numa fileira mista os cards
          com desconto empurrariam o preço pra baixo e a linha desalinharia. */}
      <div
        className="num mt-1.5"
        style={{
          fontFamily: "var(--font-family-inter)",
          fontSize: "12px",
          color: "#8a8a8a",
          textDecoration: discount > 0 && p.oldPriceNum ? "line-through" : "none",
          lineHeight: 1.3,
          minHeight: "16px",
        }}
      >
        {discount > 0 && p.oldPriceNum ? formatBRL(p.oldPriceNum) : "\u00a0"}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <span
          className="num"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.01em", color: "#333333" }}
        >
          {formatBRL(getPixPrice(p))}
        </span>
        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 600, color: "var(--buy-green)", whiteSpace: "nowrap" }}>
          no PIX
        </span>
      </div>
      {/* coluna do painel é mais estreita que a da vitrine (5 cards em
          1320px): 11px é o tamanho em que a linha inteira ainda cabe sem
          truncar — "no cartão" cortado tirava justamente o que a linha diz.
          No celular a coluna tem ~165px e nem 11px cabe: lá a linha quebra em
          duas em vez de vazar por cima do card vizinho. */}
      <div className="num whitespace-normal md:whitespace-nowrap" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", color: "#6b6b6b", marginTop: "3px", lineHeight: 1.3 }}>
        {parcelas}x de {formatBRL(valorParcela)} sem juros no cartão
      </div>
    </Link>
  );
}

export function SearchBar({
  className = "",
  /** "bar" centraliza o painel na própria barra (v1, barra centralizada);
      "viewport" centraliza na tela (v2, barra deslocada pro lado). */
  panelAnchor = "bar",
  /** "lg" = barra mais alta e fonte maior (header da v2) */
  size = "md",
  /** variante do header no celular: sem o seletor de categoria (come 120px
      dos 390 disponíveis) e com fonte de 16px, abaixo disso o iOS dá zoom
      sozinho ao focar o campo. */
  compact = false,
}: { className?: string; panelAnchor?: "bar" | "viewport"; size?: "md" | "lg"; compact?: boolean }) {
  const lg = size === "lg";
  /* fundo da caixa de foto: no painel da v2 (ancorado na viewport) o mesmo
     degradê claro da vitrine; na v1 o poço do tema. */
  const fundoFoto =
    panelAnchor === "viewport"
      ? "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)"
      : "var(--well)";
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
      if (e.key === "Escape" && (searchPanelOpen || searchCategoryOpen)) {
        setSearchPanelOpen(false);
        setSearchCategoryOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchPanelOpen, searchCategoryOpen]);

  useEffect(() => {
    if (!searchPanelOpen && !searchCategoryOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        setSearchPanelOpen(false);
        setSearchCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchPanelOpen, searchCategoryOpen]);

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
            height: compact ? 46 : lg ? 52 : 44,
            background: "var(--surface-1)",
            borderColor: searchPanelOpen ? "var(--primary)" : "#d6d6d6",
            boxShadow: "none",
          }}
        >
          {/* All categories dropdown */}
          {!compact && (
          <div className="relative h-full flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchCategoryOpen((p) => !p);
              }}
              className="flex h-full cursor-pointer items-center gap-1.5 pl-5 pr-3 text-ink transition-colors hover:text-ink-strong"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: lg ? "15px" : "var(--text-sm)", fontWeight: 600 }}
            >
              <span className="hidden xl:inline">{searchCategory}</span>
              <span className="xl:hidden">Categorias</span>
              <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${searchCategoryOpen ? "rotate-180" : ""}`} />
            </button>
            <span className="absolute right-0 top-1/2 h-5 w-px -translate-y-1/2" style={{ background: "rgba(17,17,17,0.12)" }} />
          </div>
          )}

          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchPanelOpen(true)}
            placeholder={compact ? "Buscar instrumento, marca…" : "O que você está procurando?"}
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-ink-strong outline-none placeholder:text-ink-subtle"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: compact ? "16px" : lg ? "15px" : "var(--text-sm)" }}
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
          {searchPanelOpen && !compact && (
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
                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    searchCategory === cat
                      ? "bg-foreground/[0.08] text-ink-strong"
                      : "text-ink hover:bg-[var(--surface-2)] hover:text-ink-strong"
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
                  ? "fixed left-1/2 z-[60] w-[min(1320px,calc(100vw-24px))] max-h-[calc(100dvh-150px)] overflow-y-auto overscroll-contain -translate-x-1/2 rounded-card-lg shadow-[var(--shadow-pop)] md:w-[min(1320px,calc(100vw-64px))] md:max-h-none md:overflow-hidden"
                  : "absolute left-1/2 top-[58px] z-[60] w-[min(1320px,calc(100vw-24px))] max-h-[calc(100dvh-150px)] overflow-y-auto overscroll-contain -translate-x-1/2 rounded-card-lg shadow-[var(--shadow-pop)] md:w-[min(1320px,calc(100vw-64px))] md:max-h-none md:overflow-hidden"
              }
              style={{
                background: panelAnchor === "viewport" ? "#ffffff" : "var(--surface-2)",
                border: "1px solid var(--border)",
                ...(panelAnchor === "viewport" ? { top: panelTop } : null),
              }}
            >
              {searchQuery.trim().length === 0 ? (
                <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_260px]">
                  {/* Left: produtos */}
                  <div className="border-b border-edge-subtle px-5 py-6 md:border-b-0 md:border-r md:px-10 md:py-9">
                    <h4
                      className="mb-5 text-ink-strong md:mb-7"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-lg)",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Produtos mais buscados
                    </h4>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
                      {mostSearchedProducts.map((p) => (
                        <CardBusca
                          key={p.id}
                          p={p}
                          fundo={fundoFoto}
                          onNavigate={() => setSearchPanelOpen(false)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right: keywords */}
                  <div className="px-5 py-6 md:px-7 md:py-9">
                    <h4
                      className="mb-4 text-ink-strong md:mb-6"
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
                <div className="px-5 py-6 md:px-10 md:py-9">
                  <div className="mb-5 flex items-baseline justify-between md:mb-7">
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
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5 md:gap-6 max-h-none md:max-h-[520px] md:overflow-y-auto md:pr-1">
                    {searchResults.map((p) => (
                      <CardBusca
                        key={p.id}
                        p={p}
                        fundo={fundoFoto}
                        onNavigate={() => {
                          setSearchQuery("");
                          setSearchPanelOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center md:px-10 md:py-16">
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
