import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router";
import { getCategoryFromSlug } from "../lib/slug";
import { searchProducts } from "../lib/productSearch";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal, ArrowUpDown, ChevronDown, Grid3X3, LayoutList,
  Heart, ShoppingBag, Star, X, ArrowUpRight, ChevronLeft,
  ChevronRight, Check, Eye, Minus, Plus,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useTheme } from "./ThemeProvider";
import { Footer } from "./Footer";
import { ProductCard } from "./ProductCard";
import { CompareBar, CompareToggle, COMPARE_MAX, compareTypeOf } from "./CompareBar";
import { getInstallmentCount, getInstallmentValue, getPixPrice, formatBRL } from "./productEnhancements";
import { fotoFit, isFotoAmbientada } from "./photoBackdrop";
import { allProducts, allTags as productTags, brands as productBrands, categories as productCategories, type Product } from "./productsData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  getCatalogHref,
  getProductImages,
  getProductColorLabels,
  getPrimaryProductImage,
  getProductSubcategory,
  getProductSwatches,
  getVisibleCatalogProducts,
} from "./productPresentation";
import { getPreOrderInfo } from "./PreOrderData";
import { Button, DiscountBadge, PreOrderPill } from "./section";
import { SEO } from "./SEO";
import { getCategoryUrl } from "../lib/slug";
import { CategorySeoBlock } from "./CategorySeoBlock";

const categoryMap: Record<string, string> = {
  ...Object.fromEntries(productCategories.map((category) => [category, category])),
  "Coolers": "Refrigeração",
  "Linha BrTT": "Periféricos",
};
// Tags em destaque Tonante (chips "Destaques").
const allTags = productTags.filter((tag) =>
  ["Nylon", "Aço", "Eletroacústico", "Acústico", "Humbucker", "Single-coil", "6 cordas", "4 cordas", "Capotraste", "Afinador", "Palheta"].includes(tag),
);
// Chips de categoria em destaque — vazio na Tonante (as 6 categorias já estão na sidebar).
const featuredCategoryFilters: Array<{ label: string; matches: (product: Product) => boolean }> = [];
const featuredCategoryRoutes: Record<string, { category: string; subcategory: string }> = {};
// Acabamentos/tons de instrumento (filtro de cor).
const colorFilters = [
  { label: "Natural", color: "#c9a06a" },
  { label: "Spruce", color: "#d2a86a" },
  { label: "Mogno", color: "#6e4220" },
  { label: "Sunburst", color: "#b5793c" },
  { label: "Preto", color: "#111111" },
  { label: "Branco", color: "#f6f6f6" },
  { label: "Cherry", color: "#7e3a24" },
  { label: "Azul", color: "#3f6e8c" },
  { label: "Prata", color: "#bcbcbc" },
];
function normalizeFilterKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function getFeaturedCategoryLabel(value: string) {
  return featuredCategoryFilters.find((filter) => normalizeFilterKey(filter.label) === normalizeFilterKey(value))?.label ?? "";
}
// Products with real images only — filters out placeholder category images
const validProducts = getVisibleCatalogProducts(allProducts);
const productById = new Map<number, Product>(allProducts.map((product) => [product.id, product]));
const productSwatchesById: Record<number, ReturnType<typeof getProductSwatches>> = {};
const productColorLabelsById: Record<number, string[]> = {};
const productVariantByColor: Record<number, Record<string, Product>> = {};

validProducts.forEach((product) => {
  const directColorLabels = getProductColorLabels(product);
  const swatches = getProductSwatches(product);
  const colorLabels = new Set(directColorLabels);
  const variantsByColor: Record<string, Product> = {};

  directColorLabels.forEach((label) => {
    variantsByColor[label] = product;
  });

  swatches.forEach((swatch) => {
    colorLabels.add(swatch.label);
    const variant = productById.get(swatch.productId);
    if (variant) variantsByColor[swatch.label] = variant;
  });

  productSwatchesById[product.id] = swatches;
  productColorLabelsById[product.id] = Array.from(colorLabels);
  productVariantByColor[product.id] = variantsByColor;
});

function productMatchesColor(product: Product, label: string) {
  return productColorLabelsById[product.id]?.includes(label) ?? false;
}

function getProductSwatchesCached(product: Product) {
  return productSwatchesById[product.id] ?? [];
}

function getProductVariantByColor(product: Product, label: string) {
  return productVariantByColor[product.id]?.[label] ?? null;
}

const PAGE_SIZE_OPTIONS = [16, 24, 36] as const;
const sortOptions = [
  { label: "Relevância", value: "relevance" },
  { label: "Mais vendidos", value: "bestselling" },
  { label: "A – Z", value: "az" },
  { label: "Z – A", value: "za" },
  { label: "Menor preço", value: "price-asc" },
  { label: "Maior preço", value: "price-desc" },
  { label: "Mais avaliados", value: "rating" },
  { label: "Maior desconto", value: "discount" },
];
const brandsList = productBrands;
const GLOBAL_MIN = 0;
const GLOBAL_MAX = 15000;

function getDiscount(p: Product) {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

/* O verde é do PIX e só dele — mesmo token do ProductCardV2 e do botão
   Comprar. Ver --buy-green em styles/theme.css. */
const BUY_GREEN = "var(--buy-green)";

function ListStars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={13} strokeWidth={0} fill={i <= Math.round(rating) ? "#f0a020" : "rgba(51,51,51,.18)"} />
        ))}
      </span>
      <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "#8a8a8a" }}>
        ({reviews})
      </span>
    </span>
  );
}

/* Preço em três andares, na mesma ordem em que a decisão acontece e com os
   mesmos tamanhos do card de grade: de quanto era → quanto é no PIX
   → como parcela. A lista mostrava só o preço de tabela e escondia o PIX
   dentro de "No PIX ou 2x de…", que dizia as duas coisas e nenhuma direito:
   o valor grande era o cheio e o do PIX não aparecia em lugar nenhum. */
function ListPrice({ product, align = "left" }: { product: Product; align?: "left" | "right" }) {
  const discount = getDiscount(product);
  const parcelas = getInstallmentCount(product.priceNum);
  const valorParcela = getInstallmentValue(product.priceNum);
  return (
    <div className={align === "right" ? "flex flex-col items-end" : ""}>
      {/* a linha do riscado ocupa altura MESMO sem desconto: na lista, um
          produto sem promoção subia o preço 17px e a coluna inteira saía em
          serra. O traço só é desenhado quando existe preço antigo. */}
      <div
        className="num"
        style={{
          fontFamily: "var(--font-family-inter)",
          fontSize: "13px",
          color: "#8a8a8a",
          textDecoration: discount > 0 && product.oldPriceNum ? "line-through" : "none",
          lineHeight: 1.3,
          minHeight: "17px",
        }}
      >
        {discount > 0 && product.oldPriceNum ? formatBRL(product.oldPriceNum) : "\u00a0"}
      </div>
      <div className={`flex flex-wrap items-baseline gap-x-2 ${align === "right" ? "justify-end" : ""}`}>
        {/* mesma regra do card da grade: em promoção o valor grande vem
            verde, fora dela fica escuro. Ver ProductCardV2. */}
        <span
          className="num"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", color: discount > 0 ? BUY_GREEN : "var(--ink-strong)" }}
        >
          {formatBRL(getPixPrice(product))}
        </span>
        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600, color: BUY_GREEN, whiteSpace: "nowrap" }}>
          no PIX
        </span>
      </div>
      {/* sai em todo produto, inclusive quando o plano dá 1x (parcela mínima
          de R$50, ver productEnhancements): "sem juros no cartão" é
          informação de pagamento, não só de parcelamento. */}
      <div className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "#6b6b6b", marginTop: "3px", lineHeight: 1.3 }}>
        {parcelas}x de {formatBRL(valorParcela)} sem juros no cartão
      </div>
    </div>
  );
}

function getSwitchBadgeInfo(product: Product) {
  const normalized = `${product.badge ?? ""} ${product.name}`.toLowerCase();
  if (!normalized.includes("switch")) return null;
  if (normalized.includes("blue")) return { src: "/switches/blue-switch.png", label: product.badge ?? "Blue Switch" };
  if (normalized.includes("red")) return { src: "/switches/red-dragon.png", label: product.badge ?? "Red Switch" };
  if (normalized.includes("brown")) return { src: "/switches/brown-switch1.png", label: product.badge ?? "Brown Switch" };
  return null;
}

function getProductAboutBullets(product: Product) {
  return product.features?.length
    ? product.features
    : (product.description ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

/* ═══════════════════════════════════════════════════════
   PRICE RANGE SLIDER
   ═══════════════════════════════════════════════════════ */

function PriceRangeSlider({
  min, max, minBound = GLOBAL_MIN, maxBound = GLOBAL_MAX, onMinChange, onMaxChange, onApply,
}: {
  min: number; max: number;
  minBound?: number; maxBound?: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  onApply: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const range = Math.max(1, maxBound - minBound);
  const safeMin = Math.max(minBound, Math.min(min, maxBound));
  const safeMax = Math.min(maxBound, Math.max(max, minBound));

  const minPct = ((safeMin - minBound) / range) * 100;
  const maxPct = ((safeMax - minBound) / range) * 100;

  // Extract an X coordinate from either a mouse or touch event (native or React).
  const getClientX = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ): number | null => {
    if ("touches" in e) {
      const t = e.touches[0] ?? e.changedTouches[0];
      return t ? t.clientX : null;
    }
    return e.clientX;
  };

  const getPctFromEvent = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = getClientX(e);
    if (x == null) return 0;
    return Math.max(0, Math.min(1, (x - rect.left) / rect.width));
  };

  const handlePointerDown = (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    // Only call preventDefault for mouse — React onTouchStart is passive so it
    // would be ignored (and warn). Page-scroll prevention is handled by the
    // non-passive touchmove listener below.
    if (!("touches" in e)) e.preventDefault();
    setDragging(thumb);
    const pct = getPctFromEvent(e);
    const val = Math.round(minBound + pct * range);
    if (thumb === "min") onMinChange(Math.min(val, max));
    else onMaxChange(Math.max(val, min));
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      // Stop the page from scrolling while a thumb is being dragged by touch.
      if ("touches" in e) e.preventDefault();
      // If the X coordinate can't be read (e.g. degenerate touch event with
      // empty touches), do nothing — never snap the thumb to 0.
      if (getClientX(e) == null) return;
      const pct = getPctFromEvent(e);
      const val = Math.round(minBound + pct * range);
      if (dragging === "min") onMinChange(Math.min(val, max));
      else onMaxChange(Math.max(val, min));
    };
    const handleUp = () => { setDragging(null); onApply(); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    window.addEventListener("touchcancel", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("touchcancel", handleUp);
    };
  }, [dragging, min, max, minBound, range, onMinChange, onMaxChange, onApply]);

  const formatBRL = (v: number) =>
    `R$ ${Math.round(v).toLocaleString("pt-BR")}`;

  return (
    <div className="space-y-4 mt-2">
      {/* Slider track */}
      <div className="px-3 py-3">
      <div ref={trackRef} className="relative h-2 bg-foreground/[0.08] rounded-full cursor-pointer select-none">
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-primary"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb — 44px hit area, 20px visible circle */}
        <div
          onMouseDown={handlePointerDown("min")}
          onTouchStart={handlePointerDown("min")}
          className="absolute top-1/2 w-11 h-11 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `${minPct}%`, touchAction: "none" }}
          aria-label="Preço mínimo"
          role="slider"
        >
          <div className="w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md" />
        </div>
        {/* Max thumb — 44px hit area, 20px visible circle */}
        <div
          onMouseDown={handlePointerDown("max")}
          onTouchStart={handlePointerDown("max")}
          className="absolute top-1/2 w-11 h-11 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `${maxPct}%`, touchAction: "none" }}
          aria-label="Preço máximo"
          role="slider"
        >
          <div className="w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md" />
        </div>
      </div>
      </div>
      {/* Min / Max inputs */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.06em" }}>MÍN</label>
          <input
            type="text" inputMode="numeric" value={formatBRL(safeMin)}
            onChange={(e) => onMinChange(Math.max(minBound, Math.min(parseInt(e.target.value.replace(/\D/g, "")) || minBound, max)))}
            onBlur={onApply}
            className="w-full min-h-[44px] border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
          />
        </div>
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.06em" }}>MÁX</label>
          <input
            type="text" inputMode="numeric" value={formatBRL(safeMax)}
            onChange={(e) => onMaxChange(Math.min(maxBound, Math.max(parseInt(e.target.value.replace(/\D/g, "")) || maxBound, min)))}
            onBlur={onApply}
            className="w-full min-h-[44px] border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  /* Echo-guard: the query string this component last wrote to the URL itself.
     The URL→state effect skips re-hydrating when it sees its own echo, which
     stops the URL↔state sync from ping-ponging (URL/cursor flicker). */
  const lastWrittenSearchRef = useRef<string | null>(null);
  /**
   * Supports both URL shapes:
   *   /produtos?category=Periféricos&subcategory=Mouses  (legacy)
   *   /perifericos/mouses/                               (semantic, A1)
   * The slug route resolves through getCategoryFromSlug(); falls back
   * to the title-cased slug when no explicit mapping exists.
   */
  const routeParams = useParams();
  const slugCategory = routeParams.category
    ? getCategoryFromSlug(routeParams.category) ?? routeParams.category
    : "";
  const slugSubcategory = routeParams.subcategory ?? "";

  const initialCategory = slugCategory || searchParams.get("category") || "";
  const initialSubcategory = slugSubcategory || searchParams.get("subcategory") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialFeaturedCategory = initialCategory ? getFeaturedCategoryLabel(initialCategory) : "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialCategory && !initialFeaturedCategory ? new Set([categoryMap[initialCategory] ?? initialCategory]) : new Set()
  );
  const [selectedFeaturedCategories, setSelectedFeaturedCategories] = useState<Set<string>>(
    initialFeaturedCategory ? new Set([initialFeaturedCategory]) : new Set()
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(
    initialSubcategory ? new Set([initialSubcategory]) : new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(GLOBAL_MIN);
  const [priceMax, setPriceMax] = useState(GLOBAL_MAX);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState<Set<number>>(new Set());
  const [selectedRatings, setSelectedRatings] = useState<Set<number>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(16);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<number, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  /* ── Comparador ─────────────────────────────────────────────────────
     Até 3 produtos, todos do MESMO tipo (subcategoria, senão categoria):
     comparar violão com capa devolveria uma tabela meio vazia. Ver
     CompareBar.tsx. */
  const compareNavigate = useNavigate();
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [compareCollapsed, setCompareCollapsed] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, brands: true, tags: true, price: true, color: true, rating: true, promo: true, attributes: true, sizes: true,
  });

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const activeCategoryLabel = initialCategory ? categoryMap[initialCategory] ?? initialCategory : "";
  const isSubcategoryRoute = Boolean(activeCategoryLabel && initialSubcategory);

  useEffect(() => {
    // Skip if this searchParams change is our own echo (state→URL write below).
    // Re-hydrating here would recreate the filter Sets and bounce back into the
    // state→URL effect — the ping-pong that made the URL/cursor flicker.
    if (searchParams.toString() === lastWrittenSearchRef.current) return;

    // Prefer slug route params; fall back to querystring (legacy).
    const cat = slugCategory || searchParams.get("category") || "";
    const subcat = slugSubcategory || searchParams.get("subcategory") || "";
    const featuredCat = cat ? getFeaturedCategoryLabel(cat) : "";
    setSelectedCategories(cat && !featuredCat ? new Set([categoryMap[cat] ?? cat]) : new Set());
    setSelectedFeaturedCategories(featuredCat ? new Set([featuredCat]) : new Set());
    setSelectedSubcategories(subcat ? new Set([subcat]) : new Set());

    const sq = searchParams.get("search");
    setSearchQuery(sq ?? "");

    // Filtros adicionais via querystring (deeplink + share + back button friendly)
    const pMin = Number(searchParams.get("precoMin"));
    const pMax = Number(searchParams.get("precoMax"));
    setPriceMin(Number.isFinite(pMin) && pMin > 0 ? pMin : GLOBAL_MIN);
    setPriceMax(Number.isFinite(pMax) && pMax > 0 ? pMax : GLOBAL_MAX);

    setOnlyDiscount(searchParams.get("promo") === "1");

    const tag = searchParams.get("tag");
    setSelectedTags(tag ? new Set(tag.split(",").filter(Boolean)) : new Set());

    const marcas = searchParams.get("marcas");
    setSelectedBrands(marcas ? new Set(marcas.split(",").filter(Boolean)) : new Set());

    const atributos = searchParams.get("atributos");
    setSelectedAttributes(atributos ? new Set(atributos.split(",").filter(Boolean)) : new Set());
  }, [searchParams, slugCategory, slugSubcategory]);

  /* ── Sync filter state -> URL querystring (B4) ──
     Writes precoMin/precoMax/promo/marcas/atributos when active so URLs
     are shareable + back/forward buttons restore filter state.
     `replace: true` keeps history clean. */
  useEffect(() => {
    const sp = new URLSearchParams(searchParams);

    if (priceMin > GLOBAL_MIN) sp.set("precoMin", String(priceMin));
    else sp.delete("precoMin");

    if (priceMax < GLOBAL_MAX) sp.set("precoMax", String(priceMax));
    else sp.delete("precoMax");

    if (onlyDiscount) sp.set("promo", "1");
    else sp.delete("promo");

    if (selectedBrands.size > 0) sp.set("marcas", [...selectedBrands].join(","));
    else sp.delete("marcas");

    if (selectedAttributes.size > 0) sp.set("atributos", [...selectedAttributes].join(","));
    else sp.delete("atributos");

    // Only call setSearchParams if anything actually changed to avoid loops.
    const next = sp.toString();
    const current = searchParams.toString();
    if (next !== current) {
      // Record our own write so the URL→state effect ignores the echo.
      lastWrittenSearchRef.current = next;
      setSearchParams(sp, { replace: true });
    }
  }, [priceMin, priceMax, onlyDiscount, selectedBrands, selectedAttributes, searchParams, setSearchParams]);

  /* ── Scroll to top on category change ── */
  const mainRef = useRef<HTMLDivElement>(null);
  const itemsPerPageDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialCategory, initialSubcategory]);

  /* ── Helpers ── */
  const toggleSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, val: T) => {
    setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });
  };
  const toggleCategory = (cat: string) => {
    const isSelected = selectedCategories.has(cat);
    toggleSet(setSelectedCategories, cat);
    setSelectedFeaturedCategories(new Set());
    if (isSelected) {
      // Clear subcategories belonging to this category when deselecting
      const catSubcatSet = new Set(validProducts.filter((p) => p.category === cat).map(getProductSubcategory));
      setSelectedSubcategories((prev) => { const n = new Set(prev); catSubcatSet.forEach((sc) => n.delete(sc)); return n; });
      const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("subcategory"); setSearchParams(sp, { replace: true });
    }
  };
  const toggleFeaturedCategory = (label: string) => {
    const route = featuredCategoryRoutes[label];
    if (route) {
      setSearchParams(new URLSearchParams(getCatalogHref(route).split("?")[1]), { replace: false });
      return;
    }

    toggleSet(setSelectedFeaturedCategories, label);
    setSelectedCategories(new Set());
    setSelectedSubcategories(new Set());
    const sp = new URLSearchParams(searchParams);
    sp.delete("category");
    sp.delete("subcategory");
    setSearchParams(sp, { replace: true });
  };
  const toggleColor = (label: string) => {
    setSelectedColors((prev) => (prev.has(label) ? new Set() : new Set([label])));
  };
  const toggleSection = (key: string) => setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const getColorMatchedProduct = (product: Product) => {
    const manualVariantId = selectedVariantIds[product.id];
    if (manualVariantId) {
      const manualVariant = productById.get(manualVariantId);
      if (manualVariant) return manualVariant;
    }

    const selectedColor = [...selectedColors].find((color) => productMatchesColor(product, color));
    if (!selectedColor) return product;

    return getProductVariantByColor(product, selectedColor) ?? product;
  };

  const clearAll = () => {
    setSelectedCategories(new Set()); setSelectedFeaturedCategories(new Set()); setSelectedSubcategories(new Set()); setSelectedTags(new Set()); setSelectedAttributes(new Set()); setSelectedBrands(new Set()); setSelectedSizes(new Set()); setSelectedColors(new Set());
    setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); setOnlyDiscount(false); setSelectedDiscounts(new Set()); setSelectedRatings(new Set());
    setInStockOnly(false); setSearchQuery(""); setSelectedVariantIds({});
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("subcategory"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  /* Quando a busca corrige um erro de digitação, a página diz o que foi
     entendido em vez de fingir que o usuário digitou certo. */
  const searchCorrection = useMemo(
    () => (searchQuery ? searchProducts(validProducts, searchQuery, { limit: 1 }).correctedQuery : undefined),
    [searchQuery],
  );

  const productsWithoutPriceFilter = useMemo(() => {
    let result = [...validProducts];
    if (searchQuery) {
      /* O motor já devolve em ordem de relevância; os filtros abaixo só
         removem itens, então a ordem sobrevive até a ordenação final. */
      result = searchProducts(result, searchQuery, { vocabularySource: validProducts }).items;
    }
    if (selectedCategories.size > 0) result = result.filter((p) => selectedCategories.has(p.category));
    if (selectedFeaturedCategories.size > 0) {
      result = result.filter((p) =>
        featuredCategoryFilters.some((filter) => selectedFeaturedCategories.has(filter.label) && filter.matches(p))
      );
    }
    if (selectedSubcategories.size > 0) result = result.filter((p) => selectedSubcategories.has(getProductSubcategory(p)));
    if (selectedTags.size > 0) result = result.filter((p) => p.tags.some((t) => selectedTags.has(t)));
    if (selectedAttributes.size > 0) {
      result = result.filter((p) => {
        const haystack = [
          ...(p.tags ?? []),
          ...(p.features ?? []),
          ...(p.specs ?? []).map((s) => s.value),
          p.name,
        ].join(" ").toLowerCase();
        return [...selectedAttributes].every((attr) => haystack.includes(attr.toLowerCase()));
      });
    }
    if (selectedBrands.size > 0) result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    if (selectedSizes.size > 0) {
      result = result.filter((p) => {
        const haystack = [
          ...(p.tags ?? []),
          ...(p.features ?? []),
          p.name,
        ].join(" ").toLowerCase();
        return [...selectedSizes].every((s) => haystack.includes(s.toLowerCase()));
      });
    }
    if (onlyDiscount) result = result.filter((p) => getDiscount(getColorMatchedProduct(p)) > 0);
    if (selectedDiscounts.size > 0) {
      const minSelected = Math.min(...selectedDiscounts);
      result = result.filter((p) => getDiscount(getColorMatchedProduct(p)) >= minSelected);
    }
    if (selectedRatings.size > 0) {
      result = result.filter((p) => {
        for (const r of selectedRatings) {
          if (p.rating >= r && p.rating < r + 0.5) return true;
          if (r === 5 && p.rating >= 4.95) return true;
        }
        return false;
      });
    }
    if (inStockOnly) result = result.filter((p) => p.inStock !== false);

    return result;
  }, [selectedCategories, selectedFeaturedCategories, selectedSubcategories, selectedTags, selectedAttributes, selectedBrands, selectedSizes, onlyDiscount, selectedDiscounts, selectedRatings, inStockOnly, searchQuery]);

  const priceBounds = useMemo(() => {
    const productsForPrice = selectedColors.size > 0
      ? productsWithoutPriceFilter.filter((p) => [...selectedColors].some((color) => productMatchesColor(p, color)))
      : productsWithoutPriceFilter;

    if (productsForPrice.length === 0) return { min: GLOBAL_MIN, max: GLOBAL_MAX };

    const prices = productsForPrice.map((product) => getColorMatchedProduct(product).priceNum);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return { min: Math.max(GLOBAL_MIN, min), max: Math.max(GLOBAL_MIN, max) };
  }, [productsWithoutPriceFilter, selectedColors]);

  useEffect(() => {
    setPriceMin((prev) => Math.max(priceBounds.min, Math.min(prev, priceBounds.max)));
    setPriceMax((prev) => Math.min(priceBounds.max, Math.max(prev, priceBounds.min)));
  }, [priceBounds.min, priceBounds.max]);

  const priceFilterActive = priceMin > priceBounds.min || priceMax < priceBounds.max;

  const activeFilterCount = selectedCategories.size + selectedFeaturedCategories.size + selectedSubcategories.size + selectedTags.size + selectedAttributes.size + selectedBrands.size + selectedSizes.size + selectedColors.size
    + (priceFilterActive ? 1 : 0) + (onlyDiscount ? 1 : 0)
    + selectedDiscounts.size
    + selectedRatings.size + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

  const productsBeforeColorFilter = useMemo(() => {
    let result = [...productsWithoutPriceFilter];
    if (priceMin > priceBounds.min) result = result.filter((p) => getColorMatchedProduct(p).priceNum >= priceMin);
    if (priceMax < priceBounds.max) result = result.filter((p) => getColorMatchedProduct(p).priceNum <= priceMax);

    return result;
  }, [productsWithoutPriceFilter, priceMin, priceMax, priceBounds.min, priceBounds.max]);

  /* ── Atributos: derived from products that pass current category/subcategory ── */
  const availableAttributes = useMemo(() => {
    const scope = validProducts.filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false;
      if (selectedFeaturedCategories.size > 0 && !featuredCategoryFilters.some((f) => selectedFeaturedCategories.has(f.label) && f.matches(p))) return false;
      if (selectedSubcategories.size > 0 && !selectedSubcategories.has(getProductSubcategory(p))) return false;
      return true;
    });
    if (scope.length === 0) return [] as Array<{ label: string; count: number }>;

    const categoryLabels = new Set(productCategories.map((c) => c.toLowerCase()));
    const subcategoryLabels = new Set(scope.map((p) => getProductSubcategory(p).toLowerCase()));
    const brandLabels = new Set(productBrands.map((b) => b.toLowerCase()));

    const counts = new Map<string, number>();
    scope.forEach((p) => {
      const seen = new Set<string>();
      (p.tags ?? []).forEach((tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase();
        if (categoryLabels.has(key)) return;
        if (subcategoryLabels.has(key)) return;
        if (brandLabels.has(key)) return;
        if (seen.has(key)) return;
        seen.add(key);
        counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
      });

      if (p.category === "Cadeiras") {
        const featureSeen = new Set<string>();
        const addOnce = (label: string) => {
          const k = label.toLowerCase();
          if (featureSeen.has(k)) return;
          featureSeen.add(k);
          counts.set(label, (counts.get(label) ?? 0) + 1);
        };
        (p.features ?? []).forEach((feature) => {
          const text = feature.toLowerCase();
          const peso = text.match(/(\d{2,3})\s*kg/);
          if (peso) addOnce(`Suporta ${peso[1]} kg`);
          if (/bra[çc]o/.test(text)) {
            const braco = text.match(/(\d)\s*d/);
            if (braco) addOnce(`Apoio de braço ${braco[1]}D`);
          }
          if (/base.*nylon|nylon.*base/.test(text)) addOnce("Base em nylon");
          if (/base.*alumínio|aluminio.*base/.test(text)) addOnce("Base em alumínio");
          if (/base.*aço|aço.*base/.test(text)) addOnce("Base em aço");
          const incl = text.match(/inclina[çc][ãa]o.*?(\d{2,3})/);
          if (incl) addOnce(`Inclinação ${incl[1]}°`);
          const classe = text.match(/classe\s*(\d)/);
          if (classe) addOnce(`Pistão Classe ${classe[1]}`);
          if (/tecido linho/.test(text)) addOnce("Tecido linho");
          if (/couro sintético|couro/.test(text)) addOnce("Couro sintético");
          if (/almofada lombar/.test(text)) addOnce("Almofada lombar");
        });
      }
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .filter((entry) => entry.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 24);
  }, [selectedCategories, selectedFeaturedCategories, selectedSubcategories]);

  /* Tags em destaque que EXISTEM no recorte aberto: a lista era fixa, então a
     vitrine de Guitarras oferecia "Nylon" e "Palheta" — chips que só levavam a
     zero resultado. */
  const availableTags = useMemo(() => {
    const scope = validProducts.filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false;
      if (selectedFeaturedCategories.size > 0 && !featuredCategoryFilters.some((f) => selectedFeaturedCategories.has(f.label) && f.matches(p))) return false;
      if (selectedSubcategories.size > 0 && !selectedSubcategories.has(getProductSubcategory(p))) return false;
      return true;
    });
    const presentes = new Set(scope.flatMap((p) => (p.tags ?? []).map((t) => t.trim())));
    return allTags.filter((tag) => presentes.has(tag));
  }, [selectedCategories, selectedFeaturedCategories, selectedSubcategories]);

  // tag escolhida numa categoria não pode continuar marcada em outra que não a tem
  useEffect(() => {
    const disponiveis = new Set(availableTags);
    setSelectedTags((prev) => {
      const next = new Set([...prev].filter((t) => disponiveis.has(t)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableTags]);

  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    productsBeforeColorFilter.forEach((p) => {
      if (!p.brand) return;
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [productsBeforeColorFilter]);

  useEffect(() => {
    const available = new Set(availableBrands.map((b) => b.label));
    setSelectedBrands((prev) => {
      const next = new Set([...prev].filter((b) => available.has(b)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableBrands]);

  const availableSizes = useMemo(() => {
    const SIZE_REGEXES: RegExp[] = [
      /^\d{2,3}%(\s+\w+)?$/,
      /^(TKL|Full Size|Compact|Mini)$/i,
      /^(Mid Tower|Full Tower|Mini ITX|Micro ATX|ATX)$/i,
      /^\d+"$/,
      /^\d{1,3}\s*(polegadas?|metros?|m|cm|mm|kg|GB|TB|W)$/i,
    ];
    const counts = new Map<string, number>();
    productsBeforeColorFilter.forEach((p) => {
      const seen = new Set<string>();
      (p.tags ?? []).forEach((tag) => {
        const t = tag.trim();
        if (!t || t.length > 22) return;
        if (!SIZE_REGEXES.some((re) => re.test(t))) return;
        const key = t.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        counts.set(t, (counts.get(t) ?? 0) + 1);
      });
    });
    return [...counts.entries()]
      .filter(([, c]) => c >= 2)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 14);
  }, [productsBeforeColorFilter]);

  useEffect(() => {
    const available = new Set(availableSizes.map((s) => s.label));
    setSelectedSizes((prev) => {
      const next = new Set([...prev].filter((s) => available.has(s)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableSizes]);

  useEffect(() => {
    const available = new Set(availableAttributes.map((a) => a.label));
    setSelectedAttributes((prev) => {
      const next = new Set([...prev].filter((label) => available.has(label)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableAttributes]);

  const availableColorFilters = useMemo(() => (
    colorFilters
      .map((filter) => ({
        ...filter,
        count: productsBeforeColorFilter.filter((product) => productMatchesColor(product, filter.label)).length,
      }))
      .filter((filter) => filter.count > 0)
  ), [productsBeforeColorFilter]);

  useEffect(() => {
    const availableLabels = new Set(availableColorFilters.map((filter) => filter.label));
    setSelectedColors((prev) => {
      const next = new Set([...prev].filter((color) => availableLabels.has(color)));
      return next.size === prev.size ? prev : next;
    });
  }, [availableColorFilters]);

  const compareType = compareItems.length ? compareTypeOf(compareItems[0]) : null;

  useEffect(() => {
    if (!compareNotice) return;
    const t = window.setTimeout(() => setCompareNotice(null), 5000);
    return () => window.clearTimeout(t);
  }, [compareNotice]);

  const compareStateFor = (product: Product) => ({
    active: compareMode,
    selected: compareItems.some((p) => p.id === product.id),
    disabled:
      (compareType !== null && compareType !== compareTypeOf(product)) ||
      compareItems.length >= COMPARE_MAX,
    onToggle: () => toggleCompare(product),
  });

  const toggleCompare = useCallback((product: Product) => {
    setCompareItems((current) => {
      if (current.some((p) => p.id === product.id)) {
        return current.filter((p) => p.id !== product.id);
      }
      if (current.length >= COMPARE_MAX) {
        setCompareNotice(`A comparação cabe ${COMPARE_MAX} produtos. Remova um para entrar com outro.`);
        return current;
      }
      if (current.length && compareTypeOf(current[0]) !== compareTypeOf(product)) {
        setCompareNotice(`Só dá para comparar produtos do mesmo tipo. Escolha outro item de ${compareTypeOf(current[0])}.`);
        return current;
      }
      setCompareNotice(null);
      setCompareCollapsed(false);
      setCompareMode(true);
      return [...current, product];
    });
  }, []);

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let result = [...productsBeforeColorFilter];
    if (selectedColors.size > 0) result = result.filter((p) => [...selectedColors].some((color) => productMatchesColor(p, color)));

    /* Ordena pelo produto que o card mostra (a variante de cor escolhida), não
       pelo item base: na vitrine de uma cor só, os dois divergem e a ordem saía
       diferente dos preços visíveis. E todo critério cai no nome como desempate
       — dentro de uma categoria vários itens têm o mesmo preço, e sem desempate
       a lista voltava na mesma ordem, parecendo que o seletor não fez nada. */
    const pelaCor = new Map(result.map((p) => [p.id, getColorMatchedProduct(p)]));
    const visivel = (p: Product) => pelaCor.get(p.id) ?? p;
    const porNome = (a: Product, b: Product) => visivel(a).name.localeCompare(visivel(b).name, "pt-BR");

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => visivel(a).priceNum - visivel(b).priceNum || porNome(a, b)); break;
      case "price-desc": result.sort((a, b) => visivel(b).priceNum - visivel(a).priceNum || porNome(a, b)); break;
      case "rating": result.sort((a, b) => visivel(b).rating - visivel(a).rating || visivel(b).reviews - visivel(a).reviews || porNome(a, b)); break;
      case "discount": result.sort((a, b) => getDiscount(visivel(b)) - getDiscount(visivel(a)) || porNome(a, b)); break;
      case "bestselling": result.sort((a, b) => visivel(b).reviews - visivel(a).reviews || porNome(a, b)); break;
      case "az": result.sort((a, b) => porNome(a, b)); break;
      case "za": result.sort((a, b) => porNome(b, a)); break;
    }
    return result;
  }, [productsBeforeColorFilter, selectedColors, sortBy, selectedVariantIds]);

  /* ── Reset page when filters change ── */
  useEffect(() => { setCurrentPage(1); }, [filtered, itemsPerPage]);

  useEffect(() => {
    if (!itemsPerPageDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!itemsPerPageDropdownRef.current?.contains(event.target as Node)) {
        setItemsPerPageDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [itemsPerPageDropdownOpen]);

  /* O seletor de ordem só fechava clicando de novo no próprio botão: clicar em
     qualquer outro canto da página deixava o menu aberto por cima da vitrine.
     Esc fecha junto, mesma regra do "Mostrar:". */
  useEffect(() => {
    if (!sortDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!sortDropdownRef.current?.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortDropdownOpen(false);
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortDropdownOpen]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileFiltersOpen]);

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilterPills = (
    <>
      {searchQuery && <FilterPill label={`"${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
      {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
      {[...selectedFeaturedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleFeaturedCategory(c)} />)}
      {[...selectedSubcategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleSet(setSelectedSubcategories, c)} />)}
      {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
      {[...selectedSizes].map((s) => <FilterPill key={`size-${s}`} label={s} onRemove={() => toggleSet(setSelectedSizes, s)} />)}
      {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
      {[...selectedAttributes].map((a) => <FilterPill key={`attr-${a}`} label={a} onRemove={() => toggleSet(setSelectedAttributes, a)} />)}
      {[...selectedColors].map((color) => <FilterPill key={color} label={color} onRemove={() => toggleColor(color)} />)}
      {priceFilterActive && <FilterPill label={`R$ ${priceMin} – R$ ${priceMax}`} onRemove={() => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }} />}
      {onlyDiscount && <FilterPill label="Promoção" onRemove={() => setOnlyDiscount(false)} />}
      {[...selectedDiscounts].sort((a, b) => a - b).map((d) => (
        <FilterPill key={`disc-${d}`} label={`${d}% OFF`} onRemove={() => setSelectedDiscounts((prev) => { const n = new Set(prev); n.delete(d); return n; })} />
      ))}
      {[...selectedRatings].sort((a, b) => b - a).map((r) => (
        <FilterPill key={`rating-${r}`} label={`${r} ⭐`} onRemove={() => setSelectedRatings((prev) => { const n = new Set(prev); n.delete(r); return n; })} />
      ))}
      {inStockOnly && <FilterPill label="Em estoque" onRemove={() => setInStockOnly(false)} />}
      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="inline-flex items-center text-foreground/50 hover:text-foreground underline px-2 py-1 min-h-[44px] lg:min-h-0 text-[var(--text-caption)] font-inter transition-colors">Limpar tudo</button>
      )}
    </>
  );

  /* ── Apply filters with loading ── */
  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  /* ── Add to cart with toast ── */
  const handleAddToCart = useCallback((product: typeof allProducts[0]) => {
    addItem(product);
    toast.success(`${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: product.price,
      duration: 2500,
    });
  }, [addItem]);

  /* ── Image carousel ── */
  const getImageIndex = (imageKey: string | number, max: number) => Math.min(activeImageIndex[String(imageKey)] ?? 0, max - 1);
  const setImageIdx = (imageKey: string | number, idx: number, max: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [String(imageKey)]: Math.max(0, Math.min(idx, max - 1)) }));
  };

  /* ═══════════════════════════════════════════════════════
     FILTER SIDEBAR CONTENT
     ═══════════════════════════════════════════════════════ */

  const filterSidebar = (
    <div className="space-y-1 pr-2">
      {/* Categorias — hierarchical */}
      {isSubcategoryRoute ? (
        <div className="border-b border-foreground/5 pb-5">
          <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em" }}>
            FAMÍLIA ATUAL
          </p>
          <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600 }}>
            {initialSubcategory}
          </p>
          <p className="mt-1 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
            Filtros limitados a {activeCategoryLabel} / {initialSubcategory}.
          </p>
          <Link
            to={getCatalogHref({ category: activeCategoryLabel })}
            className="mt-3 inline-flex text-primary transition-opacity hover:opacity-75"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
          >
            Ver {activeCategoryLabel}
          </Link>
        </div>
      ) : (
        <FilterSection title="Categorias" expanded={expandedSections.categories} onToggle={() => toggleSection("categories")}>
          {featuredCategoryFilters.map(({ label, matches }) => {
            const route = featuredCategoryRoutes[label];
            const isSelected = selectedFeaturedCategories.has(label) || Boolean(route && selectedCategories.has(route.category) && selectedSubcategories.has(route.subcategory));
            const catCount = validProducts.filter(matches).length;
            return (
              <button
                key={label}
                onClick={() => toggleFeaturedCategory(label)}
                className="flex w-full items-center justify-between gap-3 py-2 min-h-[44px] lg:min-h-0 text-left group/item cursor-pointer"
              >
                <span
                  className={`transition-colors flex-1 ${isSelected ? "text-foreground font-medium" : "text-foreground/72 group-hover/item:text-foreground"}`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                >
                  {label}
                </span>
                <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                  ({catCount})
                </span>
              </button>
            );
          })}
        </FilterSection>
      )}

      {availableBrands.length > 1 && (
        <FilterSection title="Marca" expanded={expandedSections.brands} onToggle={() => toggleSection("brands")}>
          <div className="space-y-1 pt-1 max-h-[260px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {availableBrands.map(({ label, count }) => {
              const active = selectedBrands.has(label);
              return (
                <label key={label} className="flex items-center gap-3 py-1.5 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
                  <input type="checkbox" className="hidden" checked={active} onChange={() => toggleSet(setSelectedBrands, label)} />
                  <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
                    {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1 truncate" title={label} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                    {label}
                  </span>
                  <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>({count})</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {availableSizes.length > 0 && (
        <FilterSection title="Tamanho" expanded={expandedSections.sizes} onToggle={() => toggleSection("sizes")}>
          <div className="flex flex-wrap gap-2 pt-1">
            {availableSizes.map(({ label, count }) => {
              const active = selectedSizes.has(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleSet(setSelectedSizes, label)}
                  className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] lg:min-h-0 border transition-colors ${active ? "border-foreground/30 bg-foreground/5 text-foreground" : "border-foreground/10 text-foreground/55 hover:border-foreground/25"}`}
                  style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  aria-pressed={active}
                >
                  {label}
                  <span className="text-foreground/30" style={{ fontSize: "var(--text-caption)" }}>({count})</span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {availableAttributes.length > 0 && (
        <FilterSection title="Atributos" expanded={expandedSections.attributes} onToggle={() => toggleSection("attributes")}>
          <div className="space-y-1 pt-1 max-h-[260px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {availableAttributes.map(({ label, count }) => {
              const active = selectedAttributes.has(label);
              return (
                <label key={label} className="flex items-center gap-3 py-1.5 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
                  <input type="checkbox" className="hidden" checked={active} onChange={() => toggleSet(setSelectedAttributes, label)} />
                  <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
                    {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1 truncate" title={label} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                    {label}
                  </span>
                  <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>({count})</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Preço" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        <PriceRangeSlider
          min={priceMin} max={priceMax}
          minBound={priceBounds.min} maxBound={priceBounds.max}
          onMinChange={setPriceMin} onMaxChange={setPriceMax}
          onApply={applyFilters}
        />
      </FilterSection>

      {availableColorFilters.length > 0 && (
        <FilterSection title="Cor" expanded={expandedSections.color} onToggle={() => toggleSection("color")}>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {availableColorFilters.map(({ label, color, count }) => {
            const active = selectedColors.has(label);
            const isLight = label === "Branco" || label === "Amarelo";
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleColor(label)}
                className="relative flex items-center justify-center p-1.5 lg:p-0 -m-1.5 lg:m-0 cursor-pointer group/swatch"
                title={`${label} (${count})`}
                aria-label={`${label} (${count})`}
                aria-pressed={active}
              >
                <span
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 group-hover/swatch:scale-110 flex-shrink-0 ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  style={{
                    backgroundColor: color,
                    borderColor: active ? "var(--primary)" : (isLight ? "rgba(0,0,0,0.14)" : "rgba(var(--foreground-rgb), 0.16)"),
                    boxShadow: active ? "0 8px 20px rgba(200, 120, 0,0.26)" : "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                >
                  {active && (
                    <Check
                      size={14}
                      className={isLight ? "text-black" : "text-ink-strong"}
                      strokeWidth={3}
                    />
                  )}
                </span>
              </button>
            );
            })}
          </div>
        </FilterSection>
      )}

      {/* Promoção */}
      <FilterSection title="Promoção" expanded={expandedSections.promo} onToggle={() => toggleSection("promo")}>
        <label className="flex items-center gap-3 py-2 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={onlyDiscount} onChange={() => setOnlyDiscount(!onlyDiscount)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${onlyDiscount ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
            {onlyDiscount && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Em promoção</span>
        </label>
        {[10, 20, 30, 40].map((pct) => {
          const count = productsBeforeColorFilter.filter((pr) => getDiscount(getColorMatchedProduct(pr)) >= pct).length;
          const active = selectedDiscounts.has(pct);
          return (
            <label key={pct} className="flex items-center gap-3 py-2 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggleSet(setSelectedDiscounts, pct)} />
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>A partir de {pct}% OFF</span>
              <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Tags */}
      {availableTags.length > 0 && (
      <FilterSection title="Tags" expanded={expandedSections.tags} onToggle={() => toggleSection("tags")}>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`flex items-center px-4 py-2 min-h-[44px] lg:min-h-0 border transition-colors ${active ? "border-foreground/30 bg-foreground/5 text-foreground" : "border-foreground/10 text-foreground/50 hover:border-foreground/25"
                  }`}
                style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
              >{tag}</button>
            );
          })}
        </div>
      </FilterSection>
      )}

      {/* Avaliação */}
      <FilterSection title="Avaliação" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
        {[5, 4.5, 4, 3.5, 3].map((r) => {
          const active = selectedRatings.has(r);
          return (
            <label key={r} className="flex items-center gap-3 py-2 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggleSet(setSelectedRatings, r)} />
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-foreground text-foreground" />
                <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>{r}</span>
              </div>
            </label>
          );
        })}
      </FilterSection>

      {/* Em estoque */}
      <div>
        <label className="flex items-center gap-3 py-2 min-h-[44px] lg:min-h-0 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${inStockOnly ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "var(--radius)" }}>
            {inStockOnly && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={"var(--surface-0)"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Em estoque</span>
        </label>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div ref={mainRef} className="min-h-dvh" style={{ background: "var(--surface-0)" }}>
      <SEO
        title={
          activeCategoryLabel
            ? initialSubcategory
              ? `${initialSubcategory} ${activeCategoryLabel}`
              : `${activeCategoryLabel}`
            : "Produtos"
        }
        description={
          activeCategoryLabel
            ? `Veja todos os produtos da categoria ${activeCategoryLabel}${initialSubcategory ? ` / ${initialSubcategory}` : ""} na PCYES. Frete grátis acima de R$ 299, até 10x sem juros.`
            : "Tudo que conecta gente à música, num só lugar, com garantia oficial e frete grátis acima de R$ 299."
        }
        canonicalPath={
          activeCategoryLabel
            ? getCategoryUrl(activeCategoryLabel, initialSubcategory || undefined)
            : "/produtos"
        }
        ogType="website"
        robots={activeFilterCount > 0 ? "noindex" : "index"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pcyes.com.br/" },
            ...(activeCategoryLabel
              ? [{ "@type": "ListItem", position: 2, name: activeCategoryLabel, item: `https://pcyes.com.br${getCategoryUrl(activeCategoryLabel)}` }]
              : [{ "@type": "ListItem", position: 2, name: "Produtos", item: "https://pcyes.com.br/produtos" }]),
            ...(initialSubcategory
              ? [{ "@type": "ListItem", position: 3, name: initialSubcategory }]
              : []),
          ],
        }}
      />
      {/* ── Breadcrumb strip ── */}
      <nav aria-label="Breadcrumb" className="px-5 md:px-8 py-3" style={{ background: "var(--surface-1)" }}>
        <ol style={{ maxWidth: "1680px", margin: "0 auto" }} className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="text-foreground/40 hover:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Home</Link>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-foreground/20" style={{ fontSize: "var(--text-caption)" }}>›</span>
            {activeCategoryLabel ? (
              <Link to={getCatalogHref({ category: activeCategoryLabel })} className="text-foreground/40 hover:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                {activeCategoryLabel}
              </Link>
            ) : (
              <span aria-current={initialSubcategory ? undefined : "page"} className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                Produtos
              </span>
            )}
          </li>
          {initialSubcategory && (
            <li className="flex items-center gap-2">
              <span className="text-foreground/20" style={{ fontSize: "var(--text-caption)" }}>›</span>
              <span aria-current="page" className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                {initialSubcategory}
              </span>
            </li>
          )}
        </ol>
      </nav>

      {/* ── Main Content — Insider layout ── */}
      <div className="px-5 md:px-8 py-6">
        <div style={{ maxWidth: "1680px", margin: "0 auto" }}>
          {/* ── Page H1 (E-EAT, first fold) ── */}
          <header className="mb-6 md:mb-8">
            <h1
              className="text-foreground"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {initialSubcategory
                ? `${initialSubcategory} ${activeCategoryLabel}`
                : activeCategoryLabel || "Todos os produtos"}
            </h1>
            <p
              className="mt-2 text-foreground/55"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.5,
                maxWidth: "640px",
              }}
            >
              {activeCategoryLabel
                ? `Confira a linha completa de ${initialSubcategory ? `${initialSubcategory.toLowerCase()} ${activeCategoryLabel.toLowerCase()}` : activeCategoryLabel.toLowerCase()} Tonante. Garantia oficial, frete grátis acima de R$ 299, até 10x sem juros.`
                : "Tudo que conecta gente à música, num só lugar, com garantia oficial e frete grátis acima de R$ 299."}
            </p>
          </header>

          {/* ── Top control bar — full width above sidebar+grid ── */}
          {/* No celular esta barra gruda logo abaixo do header (--header-h):
              filtro e ordenação são o controle da página e sumiam depois da
              primeira fileira de produtos. Comparar, "mostrar N" e o botão de
              grade/lista ficam só no desktop — são controles de mesa. */}
          {/* A sombra sólida pra cima (sem desfoque, cor do fundo) é um
              pedaço de fundo que sobe 48px além da barra. Ela existe por
              causa da fresta: `--header-h` é escrito por um ResizeObserver,
              que roda depois do layout, então enquanto o header encolhe a
              barra fica sempre um quadro atrás dele e abria até 21px de vão —
              por onde passavam pedaços de foto de produto, que era o vulto.
              Como o header é z-40 e a barra z-30, esse pedaço vive escondido
              sob o header e só aparece exatamente no tamanho da fresta.
              No desktop a barra não é sticky e não há o que cobrir. */}
          <div
            className="sticky z-30 -mx-5 mb-6 flex flex-row flex-wrap items-center justify-between gap-3 border-b border-foreground/10 bg-[var(--background)] px-5 py-3 shadow-[0_-48px_0_var(--background)] md:px-8 lg:static lg:mx-0 lg:gap-4 lg:px-0 lg:pb-4 lg:pt-0 lg:shadow-none xl:flex-nowrap"
            style={{ top: "var(--header-h, 120px)" }}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-3 lg:gap-4">
              <button onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 min-h-[44px] border border-foreground/15 text-foreground/70 hover:text-foreground transition-colors"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
              >
                <SlidersHorizontal size={14} /> Filtros
                {activeFilterCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center font-bold" style={{ fontSize: "var(--text-caption)" }}>{activeFilterCount}</span>
                )}
              </button>
              {/* a contagem sai da barra grudada no celular: com ela, filtro e
                  ordenação não cabiam na mesma linha e a barra virava duas.
                  Ela reaparece logo acima da grade. */}
              <span className="hidden text-foreground/60 lg:inline" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                Mostrando <span className="text-foreground font-semibold">{filtered.length}</span> {filtered.length === 1 ? "produto" : "produtos"}
                {searchCorrection && (
                  <> para <span className="text-foreground font-semibold">{searchCorrection}</span></>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap">
              {/* Comparar — liga o modo e sobe a barra do comparador */}
              <button
                onClick={() => {
                  setCompareMode((on) => {
                    if (on) { setCompareItems([]); setCompareNotice(null); }
                    return !on;
                  });
                }}
                aria-pressed={compareMode}
                className="hidden min-h-[44px] cursor-pointer items-center gap-2 border px-4 py-2 transition-colors lg:flex lg:min-h-0"
                style={{
                  borderRadius: "var(--radius-pill)",
                  borderColor: "var(--ink-strong)",
                  background: compareMode ? "transparent" : "var(--ink-strong)",
                  color: compareMode ? "var(--ink-strong)" : "#ffffff",
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                }}
              >
                <Scale size={14} strokeWidth={1.9} />
                {compareMode ? "Cancelar" : "Comparar"}
              </button>

              {/* Sort */}
              <div ref={sortDropdownRef} className="relative">
                <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex min-h-[44px] cursor-pointer items-center gap-2 text-foreground/50 transition-colors hover:text-foreground/80 lg:min-h-0"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                >
                  <ArrowUpDown size={14} />
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.15 }}
                      className="absolute left-0 right-auto sm:left-auto sm:right-0 top-full mt-3 border border-foreground/10 shadow-xl z-30 min-w-[200px] max-w-[calc(100vw-32px)] py-2"
                      style={{ borderRadius: "var(--radius-card)", background: "var(--surface-1)" }}
                    >
                      {sortOptions.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                          className={`w-full cursor-pointer px-4 py-2.5 text-left transition-colors ${sortBy === opt.value ? "text-foreground bg-foreground/[0.06]" : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                        >{opt.label}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div ref={itemsPerPageDropdownRef} className="relative hidden items-center gap-2 text-foreground/70 lg:flex" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                <span>Mostrar:</span>
                <button
                  type="button"
                  onClick={() => setItemsPerPageDropdownOpen((prev) => !prev)}
                  className={`relative inline-flex h-9 min-h-[44px] lg:min-h-0 min-w-[62px] items-center justify-between gap-2 rounded-[var(--radius-card-sm)] border px-3 transition-all cursor-pointer ${
                    itemsPerPageDropdownOpen
                      ? "border-primary/50 bg-foreground/[0.06] text-foreground shadow-[0_0_0_1px_rgba(17, 17, 17, 0.08)]"
                      : "border-foreground/10 bg-foreground/[0.03] text-foreground hover:border-foreground/20"
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={itemsPerPageDropdownOpen}
                  aria-label="Quantidade de produtos por página"
                >
                  <span>{itemsPerPage}</span>
                  <ChevronDown size={13} className={`text-foreground/45 transition-transform duration-200 ${itemsPerPageDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {itemsPerPageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-30 mt-3 min-w-[120px] overflow-hidden border border-edge-subtle shadow-[var(--shadow-pop)]"
                      style={{ borderRadius: "var(--radius-card-sm)", background: "var(--surface-1)" }}
                    >
                      <div className="border-b border-edge-subtle px-3 py-2 text-[var(--text-caption)] uppercase tracking-[0.14em] text-ink-subtle">
                        Itens por p&aacute;gina
                      </div>
                      <div className="p-2">
                        {PAGE_SIZE_OPTIONS.map((option) => {
                          const active = option === itemsPerPage;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setItemsPerPage(option);
                                setItemsPerPageDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-[var(--radius-card-sm)] px-3 py-2.5 text-left transition-colors cursor-pointer ${
                                /* text-[var(--surface-0)] e não text-white: o reskin claro
                                   reescreve .text-white pra tinta preta (theme.css, regra
                                   [data-page-light-scope]), e o número sumia dentro da
                                   faixa preta do item marcado. O hover também era branco
                                   sobre branco — virou tinta translúcida. */
                                active
                                  ? "bg-[var(--ink-strong)] text-[var(--surface-0)]"
                                  : "text-ink hover:bg-foreground/[0.05] hover:text-ink-strong"
                              }`}
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                              role="option"
                              aria-selected={active}
                            >
                              <span>{option}</span>
                              {active && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid / List */}
              <div className="hidden overflow-hidden border border-foreground/10 lg:flex" style={{ borderRadius: "var(--radius-button)" }}>
                {/* O hover era só de cor do ícone (40% -> 60% de opacidade) e não
                   dava pra perceber qual dos dois o mouse estava pegando. Agora
                   o fundo também reage, inclusive no lado já ativo. */}
                <button onClick={() => setGridMode("grid")}
                  className={`cursor-pointer p-2 transition-colors ${gridMode === "grid" ? "bg-foreground/[0.08] text-foreground hover:bg-foreground/10" : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground/70"}`}
                  aria-label="Visualização em grade"
                  aria-pressed={gridMode === "grid"}
                ><Grid3X3 size={16} /></button>
                <button onClick={() => setGridMode("list")}
                  className={`cursor-pointer p-2 transition-colors ${gridMode === "list" ? "bg-foreground/[0.08] text-foreground hover:bg-foreground/10" : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground/70"}`}
                  aria-label="Visualização em lista"
                  aria-pressed={gridMode === "list"}
                ><LayoutList size={16} /></button>
              </div>
            </div>
          </div>

          {/* Active filter pills row */}
          {activeFilterCount > 0 && (
            <div className="mb-6 flex min-w-0 flex-wrap items-center gap-2">
              {activeFilterPills}
            </div>
          )}

          <div className="flex gap-8 lg:gap-14">
            {/* ── Sidebar (Insider: narrow, left-aligned, auto-height) ── */}
            <aside className="hidden lg:block w-[240px] xl:w-[280px] flex-shrink-0">
              {filterSidebar}
            </aside>

            {/* ── Products area ── */}
            <div className="flex-1 min-w-0">
              {filtered.length > 0 && (
                <p
                  className="mb-4 text-foreground/55 lg:hidden"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                >
                  <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "produto" : "produtos"}
                </p>
              )}
              {/* ── Products Area ── */}
              {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/[0.05] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-foreground/30" />
                  </div>
                  <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-medium)" }}>Nenhum produto encontrado</p>
                  <p className="text-foreground/50 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)" }}>Tente ajustar os filtros ou mudar os termos de busca.</p>
                  <Button hierarchy="secondary" intent="neutral" size="md" onClick={clearAll}>
                    Limpar filtros
                  </Button>
                </motion.div>
              ) : (
                <div className={`relative transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                  {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-start justify-center pt-32">
                      <div className="w-10 h-10 border-4 border-foreground/10 border-t-foreground rounded-full animate-spin shadow-lg" />
                    </div>
                  )}
                  {gridMode === "grid" ? (
                    <div className="grid gap-x-4 sm:gap-x-6 gap-y-8 md:gap-y-14 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, i) => (
                      <motion.div
                        key={`grid-${product.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.35) }}
                      >
                        <ProductCard
                          product={product}
                          variant="grid"
                          swatches
                          favorite
                          onAdd={handleAddToCart}
                          compare={compareStateFor(product)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── LIST VIEW ── */
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, i) => {
                      const displayProduct = getColorMatchedProduct(product);
                      const discount = getDiscount(displayProduct);
                      return (
                        <motion.div key={`list-${product.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.02 }}
                          className="group relative flex flex-row sm:items-center gap-4 sm:gap-5 border border-foreground/10 hover:border-foreground/20 p-3 sm:p-4 transition-all duration-300"
                          style={{ borderRadius: "var(--radius-card)" }}
                        >
                          <Link to={`/produto/${displayProduct.id}`} className={`w-[104px] h-[104px] sm:w-[140px] sm:h-[140px] flex-shrink-0 overflow-hidden relative block transition-all ${displayProduct.inStock === false ? 'opacity-60 grayscale-[0.5]' : ''}`} style={{ borderRadius: "8px", background: "var(--gradient-photo)" }}>
                            {/* a caixa é cinza (--gradient-photo, igual à da grade) e
                               a foto de estúdio traz o próprio fundo branco: sem
                               `multiply` o quadrado da foto aparece dentro do
                               cinza. Foto ambientada tem cenário até a borda —
                               essa preenche o quadro e não recebe blend, senão o
                               cenário escurece. Mesma regra do ProductCardV2. */}
                            {isFotoAmbientada(getPrimaryProductImage(displayProduct)) ? (
                              <ImageWithFallback src={getPrimaryProductImage(displayProduct)} alt={displayProduct.name} loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center p-2 sm:p-3">
                                <ImageWithFallback src={getPrimaryProductImage(displayProduct)} alt={displayProduct.name} loading="lazy" decoding="async" className="h-full w-full object-contain group-hover:scale-[0.97] transition-transform duration-700" style={{ mixBlendMode: "multiply" }} />
                              </div>
                            )}
                            {/* mesmo selo do card de grade: pill verde do PIX com
                               "-8%". O anterior era um retângulo âmbar com "8% OFF",
                               que não existe em nenhum outro lugar da loja. */}
                            {discount > 0 && (
                              <span className="num absolute top-2 left-2 rounded-pill px-2.5 py-1" style={{ background: BUY_GREEN, color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700 }}>
                                -{discount}%
                              </span>
                            )}
                          </Link>

                          {/* miolo: o que o produto é. O preço saiu daqui e foi
                             para a coluna da direita no desktop — a linha tinha
                             1350px e amontoava tudo nos primeiros 500. */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 sm:mb-2 pr-10 sm:pr-0">
                              <span className="text-foreground/40 uppercase font-semibold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.05em" }}>{displayProduct.category}</span>
                              {displayProduct.brand && <span className="text-foreground/30 font-medium truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>· {displayProduct.brand}</span>}
                            </div>
                            <Link to={`/produto/${displayProduct.id}`}>
                              <p className="line-clamp-2 text-foreground group-hover:text-foreground/70 transition-colors mb-2 text-base sm:text-lg pr-10 sm:pr-0" style={{ fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>
                                {displayProduct.name}
                              </p>
                            </Link>
                            {/* na grade a avaliação fica sob o nome; aqui a linha
                               tem folga sobrando e ela cabe no mesmo lugar. */}
                            <ListStars rating={displayProduct.rating} reviews={displayProduct.reviews} />

                            {/* mobile: preço e CTA empilhados sob a informação */}
                            <div className="sm:hidden mt-2.5">
                              <ListPrice product={displayProduct} />
                            </div>
                            <Button
                              hierarchy="primary"
                              intent="buy"
                              size="lg"
                              block
                              onClick={() => handleAddToCart(displayProduct)}
                              className="sm:hidden mt-2.5 flex"
                            >
                              <ShoppingBag size={14} strokeWidth={2} />
                              Comprar
                            </Button>
                            {compareMode && (
                            <CompareToggle
                              selected={compareItems.some((p) => p.id === product.id)}
                              disabled={
                                (compareType !== null && compareType !== compareTypeOf(product)) ||
                                compareItems.length >= COMPARE_MAX
                              }
                              onToggle={() => toggleCompare(product)}
                            />
                            )}
                          </div>

                          {/* Favorite — absolute top-right on mobile, inline column on desktop */}
                          <button onClick={() => toggleFavorite(displayProduct.id)}
                            className="absolute top-2.5 right-2.5 sm:hidden w-9 h-9 border border-foreground/15 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground transition-all bg-black/30 backdrop-blur-md cursor-pointer"
                            aria-label={isFavorite(displayProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                          ><Heart size={15} className={isFavorite(displayProduct.id) ? "fill-red-500 text-red-500" : ""} strokeWidth={2} /></button>

                          {/* desktop: preço e botão na MESMA coluna, um em cima
                             do outro. O preço morava numa coluna própria, centrado
                             na altura da linha, e sobrava solto no meio do caminho
                             entre o nome e o botão — lido nem como parte da
                             informação, nem como parte da decisão. */}
                          <div className="hidden sm:flex sm:flex-col items-end justify-between gap-3 flex-shrink-0 self-stretch" style={{ minWidth: "248px" }}>
                            <button onClick={() => toggleFavorite(displayProduct.id)}
                              className="w-10 h-10 border border-foreground/15 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all bg-foreground/[0.02] cursor-pointer"
                              aria-label={isFavorite(displayProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            ><Heart size={16} className={isFavorite(displayProduct.id) ? "fill-red-500 text-red-500" : ""} strokeWidth={2} /></button>
                            <div className="flex w-full flex-col items-end gap-2.5">
                            <ListPrice product={displayProduct} align="right" />
                            <Button
                              hierarchy="primary"
                              intent="buy"
                              size="lg"
                              block
                              onClick={() => handleAddToCart(displayProduct)}
                              className="min-w-[212px]"
                            >
                              <ShoppingBag size={14} strokeWidth={2} />
                              Comprar
                            </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
                </div>
              )}

              {/* ── Pagination ── */}
              {pageCount > 1 && (
                <>
                  {/* Desktop Pagination */}
                  <div className="hidden md:flex items-center justify-center gap-1.5 mt-14 mb-2">
                    <button
                      onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === 1}
                      className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                      style={{ borderRadius: "var(--radius-button)" }}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                      const isCurrent = page === currentPage;
                      const isNearCurrent = Math.abs(page - currentPage) <= 1;
                      const isEdge = page === 1 || page === pageCount;
                      if (!isNearCurrent && !isEdge) {
                        if (page === 2 || page === pageCount - 1) {
                          return <span key={page} className="text-foreground/25 px-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>…</span>;
                        }
                        return null;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => { setCurrentPage(page); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className={`w-9 h-9 flex items-center justify-center border transition-all ${isCurrent ? "border-foreground bg-foreground text-background font-bold" : "border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30"}`}
                          style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                          aria-label={`Página ${page}`}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => { setCurrentPage((p) => Math.min(pageCount, p + 1)); mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === pageCount}
                      className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                      style={{ borderRadius: "var(--radius-button)" }}
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  {/* No celular não há "página 3 de 20": o dedo continua a
                      lista. Cada toque traz mais 16 e o rodapé diz onde está. */}
                  <div className="mt-10 mb-4 flex flex-col items-center gap-3 md:hidden">
                    <span
                      className="text-foreground/50"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                    >
                      {paginatedProducts.length} de {filtered.length} produtos
                    </span>
                    <Button
                      hierarchy="secondary"
                      intent="neutral"
                      size="lg"
                      block
                      onClick={() => setItemsPerPage((n) => (n + 16) as typeof itemsPerPage)}
                    >
                      Carregar mais
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── SEO content block (per category) ── */}
          {/* a vitrine da home manda "viola caipira", "ukulele", "cabo" etc.
             por ?search= dentro de Violões/Acessórios; sem passar o termo,
             todas essas entradas caíam no texto genérico da categoria */}
          <CategorySeoBlock
            categoryLabel={activeCategoryLabel}
            subcategoryLabel={initialSubcategory}
            featuredLabel={[...selectedFeaturedCategories][0] ?? ""}
            searchLabel={searchQuery}
          />
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              /* z-96: acima do banner de cookies (80) e do WhatsApp (90), que
                 são fixos no pé da tela e cobriam o botão de aplicar */
              className="fixed bottom-0 left-0 top-0 z-[96] w-[320px] max-w-[85vw] overflow-y-auto p-6"
              style={{ background: "var(--surface-1)", borderRight: `1px solid ${isDark ? "rgba(var(--foreground-rgb), 0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-foreground/70 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-bold)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors p-2" aria-label="Fechar filtros"><X size={20} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-4 mt-8 bg-inherit">
                <Button
                  hierarchy="primary"
                  intent="neutral"
                  size="md"
                  block
                  onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}
                >
                  <Check size={16} />
                  Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProduct && (() => {
          const quickViewImages = getProductImages(quickViewProduct);
          const quickViewImageIndex = getImageIndex(quickViewProduct.id, quickViewImages.length);
          const quickViewDiscount = getDiscount(quickViewProduct);
          const quickViewBullets = getProductAboutBullets(quickViewProduct).slice(0, 6);
          const quickViewSwatches = getProductSwatches(quickViewProduct);

          return (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[1040px] md:max-w-[95vw] md:max-h-[90vh] z-50 overflow-y-auto p-6 md:p-8 shadow-[var(--shadow-pop)]"
              style={{ background: "var(--surface-0)", borderRadius: "var(--radius-card-lg)", border: "1px solid rgba(var(--foreground-rgb), 0.06)" }}
            >
              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-ink-muted hover:text-ink-strong hover:bg-white/8 transition-colors z-20 cursor-pointer"
                aria-label="Fechar"
              ><X size={20} /></button>

              <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                {/* Left: thumbs + main image */}
                <div className="flex gap-3">
                  {quickViewImages.length > 1 && (
                    <div className="flex flex-col gap-2 w-[68px] md:w-[76px] flex-shrink-0">
                      {quickViewImages.slice(0, 5).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.preventDefault(); setImageIdx(quickViewProduct.id, idx, quickViewImages.length); }}
                          className="aspect-square overflow-hidden transition-all cursor-pointer"
                          style={{
                            borderRadius: "var(--radius-card-sm)",
                            background: "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.06) 0%, rgba(var(--foreground-rgb), 0.02) 100%)",
                            border: idx === quickViewImageIndex
                              ? "2px solid rgba(200, 120, 0,0.85)"
                              : "1px solid rgba(var(--foreground-rgb), 0.06)",
                          }}
                          aria-label={`Imagem ${idx + 1}`}
                        >
                          <ImageWithFallback src={img} alt={`thumb ${idx + 1}`} {...fotoFit(img, { padding: "p-2", semMultiply: true })} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className="relative flex-1 aspect-square overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-card-md)",
                      background: "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.10) 0%, rgba(var(--foreground-rgb), 0.03) 100%)",
                      border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                      boxShadow: "var(--shadow-card-hairline)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.06) 0%, transparent 55%)", borderRadius: "var(--radius-card-md)" }}
                    />
                    <ImageWithFallback
                      src={quickViewImages[quickViewImageIndex]}
                      alt={quickViewProduct.name}
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 h-full w-full object-contain p-8"
                    />
                    {quickViewDiscount > 0 && (
                      <span
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 text-ink-strong"
                        style={{
                          background: "var(--gradient-brand)",
                          borderRadius: "var(--radius-pill)",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          fontWeight: "700",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {quickViewDiscount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: info */}
                <div className="flex flex-col">
                  <p className="uppercase mb-3 tracking-[0.18em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "var(--primary)" }}>
                    {quickViewProduct.category}
                  </p>
                  <h3 className="text-ink-strong mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                    {quickViewProduct.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-5">
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-ink font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>{quickViewProduct.rating}</span>
                    <span className="text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>({quickViewProduct.reviews} avaliações)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.01em" }}>
                      {quickViewProduct.price}
                    </p>
                    {quickViewProduct.oldPrice && (
                      <p className="line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", color: "rgba(var(--foreground-rgb), 0.35)" }}>
                        {quickViewProduct.oldPrice}
                      </p>
                    )}
                  </div>

                  {(() => {
                    const stockLeft = ((quickViewProduct.id * 7) % 13) + 2;
                    const urgent = stockLeft <= 5;
                    return (
                      <div className="mb-5 flex items-center gap-2">
                        <span className={`relative flex h-2 w-2`}>
                          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${urgent ? "bg-[#e08c12]" : "bg-emerald-500"}`} />
                          <span className={`relative inline-flex h-2 w-2 rounded-full ${urgent ? "bg-[#e08c12]" : "bg-emerald-500"}`} />
                        </span>
                        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: urgent ? "#ff5a52" : "rgba(var(--foreground-rgb), 0.85)" }}>
                          {urgent ? `Últimas ${stockLeft} unidades em estoque` : `${stockLeft} em estoque · envio em 24h úteis`}
                        </span>
                      </div>
                    );
                  })()}

                  {quickViewSwatches.length > 1 && (
                    <div className="mb-6">
                      <p className="mb-2.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500, color: "rgba(var(--foreground-rgb), 0.6)" }}>
                        Cores:
                      </p>
                      <div className="flex items-center gap-2">
                        {quickViewSwatches.map((sw) => (
                          <button
                            key={sw.productId}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const variant = productById.get(sw.productId) ?? null;
                              if (variant) setQuickViewProduct(variant);
                            }}
                            className="h-4 w-4 rounded-full cursor-pointer transition-all hover:scale-110"
                            style={{
                              backgroundColor: sw.color,
                              border: sw.productId === quickViewProduct.id ? "2px solid rgba(200, 120, 0,0.9)" : "1px solid rgba(var(--foreground-rgb), 0.22)",
                              boxShadow: sw.productId === quickViewProduct.id ? "0 0 10px rgba(200, 120, 0,0.5)" : "none",
                            }}
                            title={sw.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {quickViewBullets.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.55)" }}>
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        SOBRE O PRODUTO
                      </h4>
                      <ul className="space-y-2.5">
                        {quickViewBullets.map((bullet, index) => (
                          <motion.li
                            key={`${quickViewProduct.id}-${index}-${bullet.slice(0, 20)}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, delay: Math.min(index, 5) * 0.025 }}
                            className="flex items-start gap-3"
                          >
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-foreground/[0.08] flex items-center justify-center mt-0.5">
                              <Check size={9} className="text-primary" strokeWidth={2.5} />
                            </span>
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.6", color: "rgba(var(--foreground-rgb), 0.7)" }}>
                              {bullet}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    hierarchy="primary"
                    intent="buy"
                    size="lg"
                    block
                    onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                    className="mt-auto"
                  >
                    <ShoppingBag size={16} strokeWidth={2} />
                    Comprar
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
          );
        })()}
      </AnimatePresence>

      {/* ── Comparador (barra inferior) ── */}
      <CompareBar
        open={compareMode || compareItems.length > 0}
        items={compareItems}
        collapsed={compareCollapsed}
        onToggleCollapsed={() => setCompareCollapsed((v) => !v)}
        onRemove={(id) => setCompareItems((c) => c.filter((p) => p.id !== id))}
        onClear={() => { setCompareItems([]); setCompareNotice(null); setCompareMode(false); }}
        onStart={() => compareNavigate(`/comparar?ids=${compareItems.map((p) => p.id).join(",")}`)}
        notice={compareNotice}
      />
      {/* respiro pra barra não comer a paginação nem o rodapé */}
      {(compareMode || compareItems.length > 0) && (
        <div aria-hidden style={{ height: compareCollapsed ? 84 : 196 }} />
      )}

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function FilterSection({ title, expanded = true, onToggle, children }: { title: string; expanded?: boolean; onToggle?: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(expanded);
  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);
  const toggle = onToggle ?? (() => setOpen(!open));
  return (
    <div className="border-b border-foreground/5 py-4 last:border-0">
      <button onClick={toggle} className="flex items-center justify-between w-full mb-1 group outline-none" aria-expanded={open}>
        <span className="text-foreground/80 tracking-[0.08em] font-bold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>{title.toUpperCase()}</span>
        <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-3 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] lg:min-h-0 bg-foreground/[0.06] text-foreground/80 border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.08] transition-colors font-medium"
      style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
      aria-label={`Remover filtro ${label}`}
    >
      {label} <X size={12} className="opacity-60" />
    </button>
  );
}
