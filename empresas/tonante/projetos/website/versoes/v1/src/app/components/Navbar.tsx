'use client';

import React, { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, ShoppingBag, User, Menu, X, Clock, TrendingUp, ArrowUpRight, Heart, ChevronRight, ChevronLeft, ChevronDown, Download, FileText, Sparkles, Grid2x2, Box, Monitor, Cpu, Radio, Globe2, MapPin, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { allProducts, type Product } from "./productsData";
import { ThemeToggle } from "./ThemeToggle";
import { getCatalogHref, getPrimaryProductImage, getProductSubcategory, getProductSwatches, getVisibleCatalogProducts } from "./productPresentation";
import { matchesSearchQuery } from "../lib/searchMatch";

// Header ainda usa surface escura (reskin p/ creme = Fase 3) → wordmark branco.
const TONANTE_LOGO = "/brand/tonante-wordmark-dark.png";

// ─── Mega Menu Data ──────────────────────────────────────────────────────────

interface ProductCard { id: number; name: string; subtitle: string; image: string; price: string; badge?: string }
interface LayoutCard { label: string; desc: string; href: string; image?: string }
interface DownloadItem { name: string; version: string; date: string; href: string }

type RightPanel =
  | { type: "products"; title: string; products: ProductCard[] }
  | { type: "layouts"; title: string; layouts: LayoutCard[] }
  | { type: "featured"; title: string; image: string; name: string; desc: string; href: string }
  | { type: "downloads"; title: string; items: DownloadItem[] };

interface MegaSubItem { label: string; href: string; right: RightPanel }
interface MegaMenu { title: string; subItems: MegaSubItem[] }

const megaMenus: Record<string, MegaMenu> = {
  violoes: {
    title: "Violões",
    subItems: [
      {
        label: "Nylon / Clássico",
        href: getCatalogHref({ category: "Violões", subcategory: "Nylon" }),
        right: {
          type: "layouts", title: "Violões de nylon",
          layouts: [
            { label: "Para iniciantes", desc: "Braço macio e timbre redondo pra começar", href: getCatalogHref({ category: "Violões", subcategory: "Nylon" }) },
            { label: "Erudito / concerto", desc: "Projeção e dedilhado pro repertório clássico", href: getCatalogHref({ category: "Violões", subcategory: "Nylon" }) },
            { label: "Natural", desc: "Leve, claro e fácil de tocar", href: getCatalogHref({ category: "Violões", subcategory: "Nylon" }) },
          ],
        },
      },
      {
        label: "Aço / Folk",
        href: getCatalogHref({ category: "Violões", subcategory: "Aço" }),
        right: {
          type: "layouts", title: "Violões de aço",
          layouts: [
            { label: "Tampo maciço", desc: "Som encorpado que envelhece bonito", href: getCatalogHref({ category: "Violões", subcategory: "Aço" }) },
            { label: "Eletroacústico", desc: "Captação ativa pra sair do quarto pro palco", href: getCatalogHref({ category: "Violões", subcategory: "Eletroacústico" }) },
            { label: "Black / acetinado", desc: "Elegância escura no visual e no som", href: getCatalogHref({ category: "Violões", subcategory: "Aço" }) },
          ],
        },
      },
      {
        label: "Linhas Tonante",
        href: getCatalogHref({ category: "Violões" }),
        right: {
          type: "layouts", title: "Conheça as linhas",
          layouts: [
            { label: "Coral", desc: "Folk de tampo maciço, o mais vendido", href: getCatalogHref({ category: "Violões" }) },
            { label: "Volcano", desc: "Eletroacústico com afinador embutido", href: getCatalogHref({ category: "Violões" }) },
            { label: "Etna", desc: "Topo de linha, madeiras selecionadas", href: getCatalogHref({ category: "Violões" }) },
            { label: "Citrino", desc: "Clássico natural, leve e versátil", href: getCatalogHref({ category: "Violões" }) },
          ],
        },
      },
    ],
  },
  guitarras: {
    title: "Guitarras",
    subItems: [
      {
        label: "Por formato",
        href: getCatalogHref({ category: "Guitarras" }),
        right: {
          type: "layouts", title: "Formatos",
          layouts: [
            { label: "Les Paul", desc: "Corpo encorpado, peso e sustain", href: getCatalogHref({ category: "Guitarras" }) },
            { label: "Stratocaster", desc: "Versatilidade do limpo ao crocante", href: getCatalogHref({ category: "Guitarras" }) },
            { label: "Edição comemorativa", desc: "70 anos Tonante, acabamento exclusivo", href: getCatalogHref({ category: "Guitarras" }) },
          ],
        },
      },
      {
        label: "Por captação",
        href: getCatalogHref({ category: "Guitarras" }),
        right: {
          type: "layouts", title: "Captação",
          layouts: [
            { label: "Humbucker", desc: "Presença e calor pra ganho alto", href: getCatalogHref({ category: "Guitarras" }) },
            { label: "Single-coil", desc: "Brilho e definição clássicos", href: getCatalogHref({ category: "Guitarras" }) },
            { label: "HSS", desc: "O melhor dos dois mundos", href: getCatalogHref({ category: "Guitarras" }) },
          ],
        },
      },
    ],
  },
  contrabaixos: {
    title: "Contrabaixos",
    subItems: [
      {
        label: "JazzMine",
        href: getCatalogHref({ category: "Contrabaixos" }),
        right: {
          type: "layouts", title: "Linha JazzMine",
          layouts: [
            { label: "4 cordas", desc: "O groove clássico, versátil pra tudo", href: getCatalogHref({ category: "Contrabaixos" }) },
            { label: "5 cordas", desc: "Grave estendido pra estúdio e palco", href: getCatalogHref({ category: "Contrabaixos" }) },
          ],
        },
      },
      {
        label: "Theodor",
        href: getCatalogHref({ category: "Contrabaixos" }),
        right: {
          type: "layouts", title: "Linha Theodor",
          layouts: [
            { label: "4 cordas", desc: "Corpo encorpado, presença no mix", href: getCatalogHref({ category: "Contrabaixos" }) },
            { label: "5 cordas", desc: "Peso e definição pro peso do groove", href: getCatalogHref({ category: "Contrabaixos" }) },
          ],
        },
      },
    ],
  },
  cordas: {
    title: "Cordas & Encordoamentos",
    subItems: [
      {
        label: "Violão",
        href: getCatalogHref({ category: "Cordas & Encordoamentos" }),
        right: {
          type: "layouts", title: "Cordas de violão",
          layouts: [
            { label: "Aço", desc: "Brilho e projeção pro folk", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
            { label: "Nylon", desc: "Timbre redondo e macio", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
          ],
        },
      },
      {
        label: "Guitarra",
        href: getCatalogHref({ category: "Cordas & Encordoamentos" }),
        right: {
          type: "layouts", title: "Cordas de guitarra",
          layouts: [
            { label: "Níquel", desc: "Bends macios, afinação estável", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
            { label: "Diversos calibres", desc: "Do 009 ao 011, seu ataque", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
          ],
        },
      },
      {
        label: "Contrabaixo",
        href: getCatalogHref({ category: "Cordas & Encordoamentos" }),
        right: {
          type: "layouts", title: "Cordas de baixo",
          layouts: [
            { label: "4 cordas", desc: "Grave firme e duradouro", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
            { label: "5 cordas", desc: "Tensão equilibrada no Si grave", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
          ],
        },
      },
    ],
  },
  acessorios: {
    title: "Acessórios",
    subItems: [
      {
        label: "Cordas & Encordoamentos",
        href: getCatalogHref({ category: "Cordas & Encordoamentos" }),
        right: {
          type: "layouts", title: "Cordas por instrumento",
          layouts: [
            { label: "Violão", desc: "Timbre equilibrado e durável", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
            { label: "Guitarra", desc: "Bends macios, afinação estável", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
            { label: "Ukulele & Viola", desc: "Do som tropical ao ponteado caipira", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
          ],
        },
      },
      {
        label: "Suportes & Estantes",
        href: getCatalogHref({ category: "Suportes" }),
        right: {
          type: "layouts", title: "Sempre seguro",
          layouts: [
            { label: "Suporte de instrumento", desc: "Violão e guitarra sempre em pé", href: getCatalogHref({ category: "Suportes" }) },
            { label: "Teclado & caixa", desc: "Suportes em X e tripés ajustáveis", href: getCatalogHref({ category: "Suportes" }) },
            { label: "Banquetas", desc: "Conforto do ensaio ao show", href: getCatalogHref({ category: "Suportes" }) },
          ],
        },
      },
      {
        label: "Essenciais",
        href: getCatalogHref({ category: "Acessórios" }),
        right: {
          type: "layouts", title: "O que completa o som",
          layouts: [
            { label: "Capotraste", desc: "Muda o tom sem mudar o jeito de tocar", href: getCatalogHref({ category: "Acessórios" }) },
            { label: "Afinadores & palhetas", desc: "Precisão e ataque na medida", href: getCatalogHref({ category: "Acessórios" }) },
          ],
        },
      },
    ],
  },
};

interface NavItem { label: string; href?: string; mega?: string; emphasis?: "green" | "build" }

// Mapa mega-key → categoria, p/ preencher os círculos do mega com fotos reais.
const MEGA_CATEGORY: Record<string, string> = {
  violoes: "Violões",
  guitarras: "Guitarras",
  contrabaixos: "Contrabaixos",
  cordas: "Cordas & Encordoamentos",
  acessorios: "Acessórios",
};

const navItems: NavItem[] = [
  { label: "Loja", href: "/produtos" },
  { label: "Violões", mega: "violoes", href: getCatalogHref({ category: "Violões" }) },
  { label: "Guitarras", mega: "guitarras", href: getCatalogHref({ category: "Guitarras" }) },
  { label: "Contrabaixos", mega: "contrabaixos", href: getCatalogHref({ category: "Contrabaixos" }) },
  { label: "Acessórios", mega: "acessorios", href: getCatalogHref({ category: "Acessórios" }) },
  { label: "Cordas & Encordoamentos", mega: "cordas", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
  { label: "Suportes", href: getCatalogHref({ category: "Suportes" }) },
];

const trending = ["Violão Coral", "Guitarra Cecille", "Capotraste", "Afinador"];
const recent = ["Violões eletroacústicos", "Cordas de nylon"];

const mostSearchedKeywords = ["Violões", "Guitarras", "Contrabaixos", "Cordas", "Capotraste", "Afinadores", "Suportes", "Palhetas"];
const mostSearchedProductIds: number[] = [];

const searchCategories = ["Todas as categorias", "Violões", "Guitarras", "Contrabaixos", "Acessórios"];

const isPlaceholderHref = (href?: string) => !href || href === "#";
const resolveMenuHref = (href?: string) => (isPlaceholderHref(href) ? "/produtos" : href);
const visibleCatalogProducts = getVisibleCatalogProducts(allProducts);
const getCatalogProduct = (id: number) => visibleCatalogProducts.find((product) => product.id === id);

function normalizeMenuValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productMatchesMenuValue(product: Product, value: string) {
  const normalized = normalizeMenuValue(value);
  return (
    normalizeMenuValue(product.category) === normalized ||
    normalizeMenuValue(product.subcategory ?? "") === normalized ||
    normalizeMenuValue(getProductSubcategory(product)) === normalized
  );
}

function getProductsForMenuHref(href?: string) {
  if (!href?.startsWith("/produtos")) return [];

  const [, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  const category = params.get("category");
  const subcategory = params.get("subcategory");

  if (!category && !subcategory) return visibleCatalogProducts.slice(0, 7);

  return visibleCatalogProducts.filter((product) => {
    if (category && !productMatchesMenuValue(product, category)) return false;
    if (subcategory && !productMatchesMenuValue(product, subcategory)) return false;
    return true;
  });
}

function productToMenuCard(product: Product): ProductCard {
  return {
    id: product.id,
    name: product.name,
    subtitle: getProductSubcategory(product),
    image: getPrimaryProductImage(product),
    price: product.price,
    badge: product.badge,
  };
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState<"main" | "region" | "category">("main");
  const [mobileActiveMega, setMobileActiveMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState(searchCategories[0]);
  const [searchCategoryOpen, setSearchCategoryOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [promoHovered, setPromoHovered] = useState(false);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [desktopCatOpen, setDesktopCatOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { isLoggedIn, setAuthModalOpen } = useAuth();
  const { count: favCount } = useFavorites();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  // Countdown
  useEffect(() => {
    const target = new Date(); target.setHours(23, 59, 59, 999);
    const targetTime = target.getTime();
    const tick = () => {
      const diff = Math.max(0, targetTime - Date.now());
      if (diff <= 0) { setPromoDismissed(true); return; }
      setCountdown({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 60;
      setScrolled(s);
      if (!s) setDesktopCatOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) { setMobileMenuView("main"); setMobileActiveMega(null); }
  }, [mobileOpen]);

  useEffect(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(null);
    setSearchPanelOpen(false);
    setSearchCategoryOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p); }
      if (e.key === "Escape") {
        if (searchOpen) { setSearchOpen(false); setSearchQuery(""); }
        if (searchPanelOpen) { setSearchPanelOpen(false); setSearchCategoryOpen(false); searchInputRef.current?.blur(); }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, searchPanelOpen]);

  useEffect(() => { if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100); else setSearchQuery(""); }, [searchOpen]);

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

  useEffect(() => {
    if (searchPanelOpen) setSearchCategoryOpen(false);
  }, [searchPanelOpen]);

  const searchCategoryMatch = useMemo(() => {
    const map: Record<string, string[]> = {
      "Hardware": ["Hardware"],
      "Periféricos": ["Periféricos"],
      "Computadores": ["Computadores"],
      "PC Gamer": ["Computadores"],
    };
    return map[searchCategory] ?? [];
  }, [searchCategory]);

  const mostSearchedProducts = useMemo(() => {
    if (searchCategoryMatch.length === 0) {
      const byIds = mostSearchedProductIds
        .map((id) => visibleCatalogProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      if (byIds.length) return byIds;
      // fallback: mais avaliados do catálogo (mostSearchedProductIds está vazio)
      return [...visibleCatalogProducts]
        .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
        .slice(0, 5);
    }
    return visibleCatalogProducts
      .filter((p) => searchCategoryMatch.includes(p.category))
      .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      .slice(0, 5);
  }, [searchCategoryMatch]);

  const displayedKeywords = useMemo(() => {
    const keywords: Record<string, string[]> = {
      "Hardware": ["Memória DDR5", "Memória DDR4", "Placa-mãe", "SSDs", "Hardware PCYES"],
      "Periféricos": ["Headsets", "Teclados", "Mouses", "Mousepads", "Fone Gamer"],
      "Computadores": ["PC Gamer", "Mini PC", "Setup completo", "Monitores", "Gabinetes"],
      "PC Gamer": ["Setup completo", "Placas de Vídeo", "Gabinete Gamer", "Monitor Gamer", "Headset Gamer"],
    };
    return keywords[searchCategory] ?? mostSearchedKeywords;
  }, [searchCategory]);

  // Auto-select first subitem when mega menu changes
  useEffect(() => {
    if (activeMega) {
      const menu = megaMenus[activeMega];
      if (menu?.subItems?.[0]) setActiveSubItem(menu.subItems[0].label);
    } else {
      setActiveSubItem(null);
    }
  }, [activeMega]);

  const showExpanded = true;
  const showPromoBanner = false;
  const promoTop = (promoDismissed || !showExpanded || !showPromoBanner) ? 0 : 36;
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const searchResults = searchQuery.trim().length > 0
    ? visibleCatalogProducts
      .filter((p) => matchesSearchQuery([p.name, p.category, p.subcategory, p.brand], searchQuery))
      .slice(0, 8)
    : [];

  const handleMegaEnter = (mega: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    if (activeMega && activeMega !== mega) {
      setActiveMega(mega);
    } else if (!activeMega) {
      megaTimeout.current = setTimeout(() => setActiveMega(mega), 400);
    }
  };
  const handleMegaLeave = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    megaTimeout.current = setTimeout(() => setActiveMega(null), 200);
  };
  const closeMegaMenu = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(null);
  };

  const getMegaCategoryImage = (sub: MegaSubItem) => {
    const productImage = getProductsForMenuHref(sub.href)[0];
    if (productImage) return getPrimaryProductImage(productImage);
    if (sub.right.type === "featured") return sub.right.image;
    if (sub.right.type === "layouts") return sub.right.layouts.find((layout) => layout.image)?.image;
    if (sub.right.type === "products") return sub.right.products[0]?.image;
    return undefined;
  };

  const handleUserClick = () => { if (isLoggedIn) navigate("/perfil"); else setAuthModalOpen(true); };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchQuery.trim();
    if (!value) return;
    setSearchOpen(false);
    navigate(`/produtos?search=${encodeURIComponent(value)}`);
  };

  // Header Tonante é creme (light-only) — texto/ícones usam tokens ink (escuros).
  const iconColor = showExpanded
    ? (promoHovered ? "text-ink hover:text-ink-strong" : "text-ink hover:text-ink-strong")
    : "text-ink-strong/62 hover:text-ink-strong";
  const navTextColor = showExpanded
    ? (promoHovered ? "text-ink hover:text-ink-strong" : "text-ink hover:text-ink-strong")
    : "text-ink-muted hover:text-ink-strong";
  const categoryLinkColor = showExpanded
    ? "text-ink hover:text-ink-strong"
    : "text-ink-muted hover:text-ink-strong";

  const tooltipContentClass =
    "!bg-surface-1 !rounded-md border border-edge-subtle px-2.5 py-1.5 text-[var(--text-caption)] font-medium tracking-normal text-ink shadow-md [&>span]:hidden";

  const renderIcons = () => (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Abrir busca" className={`relative w-10 h-10 items-center justify-center transition-colors cursor-pointer ${!showExpanded ? "flex lg:hidden" : "flex"} ${iconColor}`}>
              <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className={tooltipContentClass}>Buscar</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => navigate("/perfil?tab=favorites")} aria-label={`Favoritos${favCount > 0 ? ` (${favCount})` : ""}`} className={`relative w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
              <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
              <AnimatePresence>
                {favCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                    style={{ fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}
                  ><span className="text-primary-foreground">{favCount}</span></motion.span>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className={tooltipContentClass}>Favoritos</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex"><ThemeToggle showExpanded={showExpanded} navbarIsDark={isDark} /></span>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className={tooltipContentClass}>Tema</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleUserClick} aria-label={isLoggedIn ? "Minha conta" : "Entrar"} className={`relative w-10 h-10 flex items-center justify-center transition-colors cursor-pointer group ${iconColor}`}>
              {/* Gamer scan-frame corners */}
              <span className="absolute top-1.5 left-1.5 w-[9px] h-[9px] border-t border-l border-current opacity-30 group-hover:opacity-65 transition-opacity duration-200 pointer-events-none" />
              <span className="absolute top-1.5 right-1.5 w-[9px] h-[9px] border-t border-r border-current opacity-30 group-hover:opacity-65 transition-opacity duration-200 pointer-events-none" />
              <span className="absolute bottom-1.5 left-1.5 w-[9px] h-[9px] border-b border-l border-current opacity-30 group-hover:opacity-65 transition-opacity duration-200 pointer-events-none" />
              <span className="absolute bottom-1.5 right-1.5 w-[9px] h-[9px] border-b border-r border-current opacity-30 group-hover:opacity-65 transition-opacity duration-200 pointer-events-none" />
              {isLoggedIn ? (
                <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-primary" style={{ fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}>J</span>
                </span>
              ) : <User size={20} strokeWidth={1.5} />}
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className={tooltipContentClass}>{isLoggedIn ? "Minha conta" : "Entrar"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => setCartOpen(true)} aria-label={`Carrinho${totalItems > 0 ? ` (${totalItems} ${totalItems === 1 ? "item" : "itens"})` : ""}`} className={`relative w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
              <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                    style={{ fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}
                  ><span className="text-primary-foreground">{totalItems}</span></motion.span>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className={tooltipContentClass}>Carrinho</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  // ─── Right Panel Renderer ──────────────────────────────────────────────────
  const renderRightPanel = (panel: RightPanel) => {
    const panelHeader = (title: string, hint: string) => (
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary/80">
            <Sparkles size={12} />
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "600", letterSpacing: "0.18em" }}>
              ACESSO RÁPIDO
            </span>
          </div>
          <h4 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: "600", lineHeight: 1 }}>
            {title}
          </h4>
          <p className="mt-2 max-w-[560px] text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
            {hint}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveMega(null)}
          className="hidden xl:flex items-center gap-2 rounded-full border border-foreground/8 bg-foreground/[0.03] px-3 py-2 text-foreground/45 transition-colors hover:border-foreground/16 hover:text-foreground"
        >
          <X size={12} />
          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "600", letterSpacing: "0.14em" }}>
            FECHAR
          </span>
        </button>
      </div>
    );

    const elevatedCardClass = "group relative grid h-full min-h-[270px] grid-rows-[150px_auto] overflow-hidden rounded-[var(--radius-card-xl)] border border-foreground/8 bg-linear-to-b from-foreground/[0.05] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/10 hover:shadow-[0_24px_80px_rgba(17, 17, 17, 0.08)]";
    const layoutElevatedCardClass = "group relative grid h-full min-h-[290px] grid-rows-[170px_auto] overflow-hidden rounded-[var(--radius-card-xl)] border border-foreground/8 bg-linear-to-b from-foreground/[0.05] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/10 hover:shadow-[0_24px_80px_rgba(17, 17, 17, 0.08)]";

    const showcaseCard = (
      href: string,
      title: string,
      subtitle: string,
      image: string | undefined,
      meta?: string,
      badge?: string,
    ) => {
      const catalogProduct = href.startsWith("/produto/")
        ? getCatalogProduct(Number(href.split("/").pop()))
        : undefined;
      const visualSrc = catalogProduct ? getPrimaryProductImage(catalogProduct) : image;

      return (
      <Link to={resolveMenuHref(href)} onClick={() => setActiveMega(null)} className={elevatedCardClass}>
        {badge && (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-primary px-2.5 py-1 text-primary-foreground shadow-[0_0_15px_rgba(200, 120, 0,0.5)]"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.08em" }}>
            {badge}
          </span>
        )}
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[var(--radius-card-lg)] border border-foreground/8 bg-foreground/[0.04] px-4 py-5 transition-colors group-hover:bg-foreground/[0.02]">
          <div className="absolute inset-4 rounded-full bg-foreground/[0.06] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          {visualSrc ? (
            <ImageWithFallback
              src={visualSrc}
              alt={title}
              className="relative h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-card-md border border-foreground/8 bg-background/60">
              <Box size={34} className="text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex h-full flex-col justify-end pt-4">
          {meta && (
            <span className="mb-2 text-foreground/40 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.05em" }}>
              {meta}
            </span>
          )}
          <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.05 }}>
            {title}
          </p>
          {subtitle && (
            <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      </Link>
    )};

    const compactLinkCard = (
      href: string,
      title: string,
      subtitle: string,
      icon?: ReactNode,
    ) => (
      <Link
        to={href}
        onClick={() => setActiveMega(null)}
        className="group flex h-full rounded-card-lg border border-foreground/8 bg-foreground/[0.03] px-4 py-4 transition-all duration-300 hover:border-foreground/10 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17, 17, 17, 0.08)]"
      >
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-foreground/8 bg-background/70 text-primary/75 transition-colors duration-300 group-hover:bg-primary group-hover:text-ink-strong">
            {icon ?? <ArrowUpRight size={15} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground/85 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "600" }}>
              {title}
            </p>
            <p className="mt-1 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.45 }}>
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    );

    const getIconForConceptual = (index: number) => {
      const icons = [<Monitor size={80} />, <Cpu size={80} />, <Box size={80} />, <Radio size={80} />, <Grid2x2 size={80} />];
      return icons[index % icons.length];
    };

    const conceptualLinkCard = (
      href: string,
      title: string,
      subtitle: string,
      icon: ReactNode,
    ) => (
      <Link
        to={href}
        onClick={() => setActiveMega(null)}
        className="group relative overflow-hidden flex h-full flex-col rounded-card-lg border border-foreground/8 bg-foreground/[0.03] px-5 py-5 transition-all duration-300 hover:border-foreground/10 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(17, 17, 17, 0.08)]"
      >
        <div className="absolute -bottom-6 -right-6 text-foreground opacity-[0.03] transition-all duration-500 group-hover:text-primary group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-6">
          {icon}
        </div>
        <div className="relative z-10 flex flex-col items-start gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-foreground/8 bg-background/70 text-primary/80 transition-all duration-500 group-hover:bg-primary group-hover:text-ink-strong group-hover:scale-110">
            {icon ? React.cloneElement(icon as React.ReactElement, { size: 18 }) : <ArrowUpRight size={22} />}
          </div>
          <div className="mt-2">
            <p className="text-foreground/90 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", fontWeight: "600" }}>
              {title}
            </p>
            <p className="mt-1.5 text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    );

    const showcaseLayoutCard = (
      href: string,
      title: string,
      subtitle: string,
      image?: string,
      meta?: string,
    ) => (
      <Link to={resolveMenuHref(href)} onClick={() => setActiveMega(null)} className={layoutElevatedCardClass}>
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[var(--radius-card-lg)] border border-foreground/8 bg-foreground/[0.035] px-4 py-4 transition-colors group-hover:bg-foreground/[0.02]">
          <div className="absolute inset-3 rounded-full bg-foreground/[0.06] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          {image ? (
            <ImageWithFallback
              src={image}
              alt={title}
              className="relative h-[132px] w-auto max-w-[92%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-card-md border border-foreground/8 bg-background/60">
              <Grid2x2 size={34} className="text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex h-full flex-col justify-end pt-4">
          {meta && (
            <span className="mb-2 text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "600", letterSpacing: "0.14em" }}>
              {meta}
            </span>
          )}
          <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.05 }}>
            {title}
          </p>
          <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>
      </Link>
    );

    const containerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.04 } }
    };
    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    if (panel.type === "products") {
      const resolvedProducts = getProductsForMenuHref(activeSubData?.href).slice(0, 7).map(productToMenuCard);
      const menuProducts = resolvedProducts.length > 0 ? resolvedProducts : panel.products.filter((product) => getCatalogProduct(product.id));
      const featured = menuProducts.slice(0, 3);
      const quick = menuProducts.slice(3, 7);
      
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Produtos em destaque acima e atalhos rápidos abaixo, com uma leitura mais estável e visualmente forte.")}
          </motion.div>
          {featured.length > 0 && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {featured.map((p) => (
                <motion.div key={`${p.id}-${p.subtitle}`} variants={itemVariants} className="min-h-[190px]">
                  {showcaseCard(`/produto/${p.id}`, p.name, p.subtitle, p.image, p.price, p.badge)}
                </motion.div>
              ))}
            </div>
          )}
          <div className={`mt-5 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 ${quick.length > 0 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
            {quick.map((p) => (
              <motion.div key={`quick-${p.id}-${p.subtitle}`} variants={itemVariants}>
                {compactLinkCard(`/produto/${p.id}`, p.name, `${p.subtitle} · ${p.price}`, <ArrowUpRight size={15} />)}
              </motion.div>
            ))}
            <motion.div variants={itemVariants} className={quick.length === 0 ? "xl:col-start-2 xl:col-span-1" : ""}>
              <Link
                to={resolveMenuHref(activeSubData?.href)}
                onClick={() => setActiveMega(null)}
                className="group flex h-full min-h-[90px] flex-col justify-center rounded-card-lg border border-foreground/10 bg-foreground/[0.04] px-5 py-4 transition-all duration-300 hover:bg-foreground/[0.06] hover:shadow-[0_8px_24px_rgba(17, 17, 17, 0.08)] hover:-translate-y-0.5"
              >
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.18em" }}>
                  EXPLORAR
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.1 }}>
                  Ver toda a coleção
                </p>
                <div className="mt-2 flex items-center gap-2 text-primary/80 group-hover:text-primary transition-colors">
                  <span style={{ fontSize: "var(--text-caption)", fontWeight: "500" }}>Acessar catálogo</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    if (panel.type === "layouts") {
      const hasImages = panel.layouts.some((l) => l.image);
      if (hasImages) {
        const featured = panel.layouts.slice(0, 3);
        const quick = panel.layouts.slice(3, 8);
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
            <motion.div variants={itemVariants}>
              {panelHeader(panel.title, "Subcategorias visuais com imagem forte e cartões elevados para acelerar o reconhecimento do formato ideal.")}
            </motion.div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {featured.map((l) => (
                <motion.div key={l.label} variants={itemVariants} className="min-h-[190px]">
                  {showcaseLayoutCard(l.href, l.label, l.desc, l.image, "SUBCATEGORIA")}
                </motion.div>
              ))}
            </div>
            <div className="mt-5 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quick.map((l) => (
                <motion.div key={`layout-${l.label}`} variants={itemVariants}>
                  {compactLinkCard(l.href, l.label, l.desc, <Grid2x2 size={15} />)}
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="rounded-card-lg border border-dashed border-foreground/15 bg-transparent px-5 py-4 flex flex-col justify-center">
                <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.16em" }}>
                  COMO ESCOLHER
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.1 }}>
                  Navegue pelo formato que combina com o seu setup
                </p>
              </motion.div>
            </div>
          </motion.div>
        );
      }
      const conceptualGridClass = panel.layouts.length <= 4 ? "grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2" : "grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3";
      
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Uma estrutura fixa e previsível para categorias conceituais, com blocos rápidos em vez de listas soltas.")}
          </motion.div>
          <div className={conceptualGridClass}>
            {panel.layouts.map((l, index) => (
              <motion.div key={l.label} variants={itemVariants}>
                {conceptualLinkCard(
                  l.href,
                  l.label,
                  l.desc,
                  getIconForConceptual(index),
                )}
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
              <Link
                to={resolveMenuHref(activeSubData?.href)}
                onClick={() => setActiveMega(null)}
                className="group flex h-full min-h-[110px] flex-col justify-center rounded-card-lg border border-foreground/10 bg-foreground/[0.04] px-6 py-5 transition-all duration-300 hover:bg-foreground/[0.06] hover:shadow-[0_12px_32px_rgba(17, 17, 17, 0.08)] hover:-translate-y-0.5"
              >
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.18em" }}>
                  VER TUDO
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.05 }}>
                  Abrir categoria completa
                </p>
                <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
                  Continue a exploração com todos os filtros e produtos disponíveis.
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary group-hover:text-primary transition-colors">
                  <span style={{ fontSize: "var(--text-caption)", fontWeight: "600" }}>Acessar</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    if (panel.type === "featured") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Destacamos o universo da categoria com uma peça principal e um acesso mais elegante para continuar a navegação.")}
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            <Link to={resolveMenuHref(panel.href)} onClick={() => setActiveMega(null)} className="group grid h-full min-h-[360px] grid-cols-1 gap-5 overflow-hidden rounded-[var(--radius-card-xl)] border border-foreground/8 bg-linear-to-br from-foreground/[0.04] via-transparent to-primary/[0.06] p-6 transition-all duration-500 hover:border-foreground/10 hover:shadow-[0_24px_80px_rgba(17, 17, 17, 0.08)] xl:grid-cols-[1.1fr_1fr]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.18em" }}>
                      DESTAQUE ESPECIAL
                    </p>
                  </div>
                  <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-h3)", fontWeight: "700", lineHeight: 0.95 }}>
                    {panel.name}
                  </p>
                  <p className="mt-5 max-w-[460px] text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.6 }}>
                    {panel.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary mt-6">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "700", letterSpacing: "0.12em" }}>
                    EXPLORAR UNIVERSO
                  </span>
                  <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              <div className="relative flex min-h-[260px] items-center justify-center rounded-[var(--radius-card-xl)] border border-foreground/8 bg-background/60 p-6 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-foreground/[0.06] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <ImageWithFallback src={panel.image} alt={panel.name} className="relative z-10 h-full max-h-[320px] w-auto max-w-[120%] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.18)] transition-transform duration-700 group-hover:scale-[1.1] group-hover:-translate-x-2 group-hover:-translate-y-2" loading="eager" referrerPolicy="no-referrer" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      );
    }

    if (panel.type === "downloads") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Documentos e drivers organizados em cards estáveis, evitando aquele sobe-e-desce de altura a cada categoria.")}
          </motion.div>
          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {panel.items.map((item) => {
              const isPdf = item.name.toLowerCase().includes("manual") || item.name.toLowerCase().includes("guia");
              const badgeText = isPdf ? "PDF" : "EXE";
              
              const innerCard = (
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-card-md border border-foreground/8 bg-background/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-foreground/[0.06]">
                      {isPdf
                        ? <FileText size={22} className="text-primary/75 group-hover:text-primary transition-colors" />
                        : <Download size={22} className="text-primary/75 group-hover:text-primary transition-colors" />
                      }
                    </div>
                    <span className="px-2 py-0.5 rounded text-foreground/40 bg-foreground/5 border border-foreground/10" style={{ fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.1em" }}>
                      {badgeText}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground/85 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", fontWeight: "600", lineHeight: 1.45 }}>
                      {item.name}
                    </p>
                    <p className="mt-2 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
                      {item.version} · {item.date}
                    </p>
                  </div>
                </div>
              );

              return isPlaceholderHref(item.href) ? (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="group rounded-[var(--radius-card-xl)] border border-foreground/8 bg-foreground/[0.03] px-6 py-5 transition-all duration-300 hover:border-foreground/10 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(17, 17, 17, 0.05)] cursor-pointer"
                >
                  {innerCard}
                </motion.div>
              ) : (
                <motion.a
                  key={item.name}
                  variants={itemVariants}
                  href={item.href}
                  className="group rounded-[var(--radius-card-xl)] border border-foreground/8 bg-foreground/[0.03] px-6 py-5 transition-all duration-300 hover:border-foreground/10 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17, 17, 17, 0.08)]"
                >
                  {innerCard}
                </motion.a>
              )
            })}
            <motion.div variants={itemVariants}>
              <Link to="/drivers-e-manuais" onClick={() => setActiveMega(null)} className="group flex h-full min-h-[140px] flex-col justify-center rounded-[var(--radius-card-xl)] border border-foreground/10 bg-foreground/[0.04] px-6 py-5 transition-all duration-300 hover:bg-foreground/[0.06] hover:shadow-[0_12px_32px_rgba(17, 17, 17, 0.08)] hover:-translate-y-0.5">
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.18em" }}>
                  CENTRAL DE SUPORTE
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "600", lineHeight: 1.1 }}>
                  Ver todos os downloads
                </p>
                <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}>
                  Acesse a biblioteca completa de drivers, manuais e utilitários.
                </p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return null;
  };
  const activeMegaData = activeMega ? megaMenus[activeMega] : null;
  const activeSubData = activeMegaData?.subItems.find((s) => s.label === activeSubItem);

  return (
    <>
      {/* Header wrapper with unified hover */}
      <div className="fixed left-0 right-0 z-50" style={{ top: "var(--announce-h, 40px)" }} onMouseEnter={() => setPromoHovered(true)} onMouseLeave={() => setPromoHovered(false)}>
        {/* Promo banner */}
        <AnimatePresence>
          {!promoDismissed && showExpanded && showPromoBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`transition-all duration-500 cursor-pointer ${isDark ? "bg-white" : "bg-black"}`}
            >
              <div className="flex items-center justify-center h-[36px] px-4 relative">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 border transition-colors duration-500 ${isDark
                    ? "border-black/20 text-black"
                    : "border-edge-strong text-ink-strong"
                    }`}
                    style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.08em" }}>PROMO</span>
                  <span className={`tracking-[0.12em] transition-colors duration-500 ${isDark
                    ? "text-black/70"
                    : "text-ink"
                    }`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)" }}>PROMO DO DIA: FRETE GRÁTIS</span>
                  <span className={`tracking-[0.12em] transition-colors duration-500 ${isDark
                    ? "text-black/70"
                    : "text-ink"
                    }`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)" }}>
                    {countdown.h.toString().padStart(2, "0")}:{countdown.m.toString().padStart(2, "0")}:{countdown.s.toString().padStart(2, "0")}
                  </span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setPromoDismissed(true); }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 cursor-pointer ${isDark
                    ? "text-black/40 hover:text-black/60"
                    : "text-ink-subtle hover:text-ink-muted"
                    }`}
                ><X size={12} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main nav */}
        <nav className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(var(--foreground-rgb), 0.10)",
          }}
	        >
	          {/* Mobile header */}
	          <div
	            className="flex lg:hidden items-center justify-between px-4 transition-all duration-500"
	            style={{ height: scrolled ? 60 : 64 }}
	          >
	            <button
	              className={`relative z-10 flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
	              onClick={() => setMobileOpen(!mobileOpen)}
	              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
	            >
	              {mobileOpen ? <X size={23} strokeWidth={1.7} /> : <Menu size={23} strokeWidth={1.7} />}
	            </button>

	            <AnimatePresence mode="wait" initial={false}>
	              {scrolled ? (
		                <motion.form
		                  key="mobile-search"
		                  onSubmit={handleSearchSubmit}
		                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
		                  animate={{ opacity: 1, y: 0, scale: 1 }}
		                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
		                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
		                  className="relative mx-2 min-w-0 flex-1"
		                >
		                  <div className="flex h-10 items-center overflow-hidden rounded-[var(--radius-card)] border border-edge bg-surface-3 shadow-sm backdrop-blur-xl">
		                    <Search size={16} className="ml-3 flex-shrink-0 text-ink-muted" strokeWidth={1.8} />
		                    <input
		                      value={searchQuery}
		                      onChange={(e) => setSearchQuery(e.target.value)}
		                      placeholder="Buscar"
		                      className="h-full min-w-0 flex-1 bg-transparent px-2 text-ink-strong outline-none placeholder:text-ink-strong/48"
		                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
		                    />
		                    {searchQuery && (
		                      <button
		                        type="button"
		                        onClick={() => setSearchQuery("")}
		                        className="flex h-full w-8 items-center justify-center text-ink-muted"
		                        aria-label="Limpar busca"
		                      >
		                        <X size={13} />
		                      </button>
		                    )}
		                  </div>
		                  <AnimatePresence>
		                    {searchQuery.trim().length > 0 && (
		                      <motion.div
		                        initial={{ opacity: 0, y: -6, scale: 0.985 }}
		                        animate={{ opacity: 1, y: 0, scale: 1 }}
		                        exit={{ opacity: 0, y: -6, scale: 0.985 }}
		                        transition={{ duration: 0.16 }}
		                        className="absolute -left-12 -right-12 top-[46px] z-[80] max-h-[58vh] overflow-y-auto rounded-card-sm border border-edge bg-surface-0/98 p-2 shadow-[var(--shadow-pop)] backdrop-blur-2xl"
		                      >
		                        {searchResults.length > 0 ? (
		                          <>
		                            <p className="px-2 pb-2 pt-1 text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
		                              {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""}
		                            </p>
		                            {searchResults.map((product) => (
		                              <Link
		                                key={product.id}
		                                to={`/produto/${product.id}`}
		                                onClick={() => setSearchQuery("")}
		                                className="group flex items-center gap-3 rounded-[var(--radius-card-sm)] p-2.5 transition-colors hover:bg-white/[0.06]"
		                              >
		                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-white/[0.04]">
		                                  <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="h-full w-full object-cover" />
		                                </div>
		                                <div className="min-w-0 flex-1">
		                                  <p className="line-clamp-2 text-ink-strong/86 transition-colors group-hover:text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-sm)", fontWeight: 600, lineHeight: 1.15 }}>
		                                    {product.name}
		                                  </p>
		                                  <p className="mt-1 truncate text-ink-strong/36" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
		                                    {product.category}
		                                  </p>
		                                </div>
		                                <span className="flex-shrink-0 text-ink-strong/58" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
		                                  {product.price}
		                                </span>
		                              </Link>
		                            ))}
		                          </>
		                        ) : (
		                          <div className="px-4 py-5 text-center">
		                            <p className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
		                              Nenhum produto encontrado
		                            </p>
		                          </div>
		                        )}
		                      </motion.div>
		                    )}
		                  </AnimatePresence>
		                </motion.form>
	              ) : (
	                <motion.div
	                  key="mobile-logo"
	                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
	                  animate={{ opacity: 1, y: 0, scale: 1 }}
	                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
	                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
	                  className="pointer-events-none absolute left-1/2 top-1/2 w-[150px] -translate-x-1/2 -translate-y-1/2"
	                >
	                  <Link to="/" className="pointer-events-auto block">
	                    <img src={TONANTE_LOGO} alt="Tonante" className="mx-auto h-[30px] w-auto object-contain" />
	                  </Link>
	                </motion.div>
	              )}
	            </AnimatePresence>

	            <div className="relative z-10 flex items-center justify-end gap-1">
	              {!scrolled && (
	                <button
	                  onClick={() => setSearchOpen(!searchOpen)}
	                  className={`flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
	                  aria-label="Buscar"
	                >
	                  <Search size={20} strokeWidth={1.6} />
	                </button>
	              )}
	              <button
	                onClick={() => setCartOpen(true)}
	                className={`relative flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
	                aria-label="Abrir carrinho"
	              >
	                <ShoppingBag size={20} strokeWidth={1.6} />
	                <AnimatePresence>
	                  {totalItems > 0 && (
	                    <motion.span
	                      initial={{ scale: 0 }}
	                      animate={{ scale: 1 }}
	                      exit={{ scale: 0 }}
	                      className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1"
	                      style={{ fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}
	                    >
	                      <span className="text-primary-foreground">{totalItems}</span>
	                    </motion.span>
	                  )}
	                </AnimatePresence>
	              </button>
	            </div>
	          </div>

          {/* Top row — desktop */}
          <div
            className="max-w-[1760px] mx-auto px-5 md:px-8 hidden lg:flex relative items-center transition-all duration-500"
            style={{ height: showExpanded ? 96 : 92 }}
          >
            {/* Left: logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex-shrink-0">
                <img src={TONANTE_LOGO} alt="Tonante" className="h-[34px] w-auto object-contain" />
              </Link>
            </div>

            {/* Search (absolute center) */}
            <div ref={searchPanelRef} className="absolute left-1/2 -translate-x-1/2 w-full max-w-[680px]">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full"
              >
                <div
                  className="flex h-[44px] items-center overflow-hidden rounded-full border-[1.5px] transition-all"
                  style={{
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
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
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
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
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
                      className={`absolute -right-12 top-1/2 z-[61] flex h-10 w-10 -translate-y-1/2 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
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
                      className="absolute left-1/2 top-[58px] z-[60] w-[min(1320px,calc(100vw-64px))] -translate-x-1/2 overflow-hidden rounded-card-lg shadow-[var(--shadow-pop)]"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid rgba(var(--foreground-rgb), 0.08)",
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
                                        background: "var(--well)",
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
                                        background: "var(--well)",
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

            {/* Right icons */}
            <TooltipProvider delayDuration={200}>
              <div className="ml-auto flex flex-shrink-0 items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/fale-conosco")}
                      className={`relative flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
                      aria-label="Ajuda"
                    >
                      <HelpCircle size={20} strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className={tooltipContentClass}>Ajuda</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/perfil?tab=favorites")}
                      className={`relative flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
                      aria-label="Favoritos"
                    >
                      <Heart size={20} strokeWidth={1.5} />
                      <AnimatePresence>
                        {favCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-primary-foreground"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            {favCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className={tooltipContentClass}>Favoritos</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex"><ThemeToggle showExpanded={showExpanded} navbarIsDark={isDark} /></span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className={tooltipContentClass}>Tema</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleUserClick}
                      className={`relative flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
                      aria-label={isLoggedIn ? "Conta" : "Login"}
                    >
                      {isLoggedIn ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>J</span>
                      ) : (
                        <User size={20} strokeWidth={1.5} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className={tooltipContentClass}>{isLoggedIn ? "Minha conta" : "Entrar"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCartOpen(true)}
                      className={`relative flex h-10 w-10 items-center justify-center transition-colors cursor-pointer ${iconColor}`}
                      aria-label="Carrinho"
                    >
                      <ShoppingBag size={20} strokeWidth={1.5} />
                      <AnimatePresence>
                        {totalItems > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-primary-foreground"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            {totalItems}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className={tooltipContentClass}>Carrinho</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Category links (expanded or desktop hamburger open) */}
          <div
            className="hidden md:flex items-center justify-center gap-0 overflow-hidden transition-all duration-300"
            style={{
              maxHeight: (showExpanded || desktopCatOpen) ? 50 : 0,
              opacity: searchPanelOpen ? 0 : ((showExpanded || desktopCatOpen) ? 1 : 0),
              paddingBottom: (showExpanded || desktopCatOpen) ? 14 : 0,
              pointerEvents: searchPanelOpen ? "none" : ((showExpanded || desktopCatOpen) ? "auto" : "none"),
            }}
          >
            {navItems.map((item) => {
              const hasMega = !!item.mega;
              const isActiveItem = activeMega === item.mega;
              const isGreen = item.emphasis === "green";
              const isBuild = item.emphasis === "build";
              const baseClass = `relative flex items-center gap-1 px-4 py-1.5 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-primary after:transition-transform after:duration-300 ${
                isActiveItem
                  ? "text-foreground after:scale-x-100"
                  : `${isGreen || isBuild ? "" : categoryLinkColor} after:scale-x-0 hover:after:scale-x-100`
              }`;
              const customStyle: React.CSSProperties = {
                fontFamily: "var(--font-family-inter)",
                fontSize: "16px", // +2px (era 14/--text-sm) — pedido Gabriel
                fontWeight: isBuild ? 700 : 500,
              };
              if (isGreen) {
                customStyle.color = "#34d399";
              }
              if (isBuild) {
                customStyle.color = "#e08c12";
                customStyle.letterSpacing = "0.02em";
              }
              const content = (
                <>
                  <span>{item.label}</span>
                  {hasMega && (
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${isActiveItem ? "rotate-180" : ""}`}
                    />
                  )}
                </>
              );
              const cls = `${baseClass} cursor-pointer`;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => {
                    if (hasMega) handleMegaEnter(item.mega!);
                    else closeMegaMenu();
                  }}
                  onMouseLeave={handleMegaLeave}
                >
                  {!isPlaceholderHref(item.href) ? (
                    <Link
                      to={resolveMenuHref(item.href)}
                      onClick={closeMegaMenu}
                      className={cls}
                      style={customStyle}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      onClick={closeMegaMenu}
                      className={cls}
                      style={customStyle}
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── Mega Menu ──────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {activeMega && activeMegaData && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 z-[52] overflow-hidden border-t border-foreground/5 shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
                style={{ backgroundColor: isDark ? "rgba(18,18,19,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(34px)" }}
                onMouseEnter={() => handleMegaEnter(activeMega)} onMouseLeave={handleMegaLeave}
              >
                <div className="mx-auto max-w-[1180px] px-5 py-6 md:px-8">
                  <div className="flex items-start justify-center gap-5 overflow-x-auto pb-1 md:gap-7 xl:gap-9">
                    {activeMegaData.subItems.map((sub, subIdx) => {
                      const megaCat = MEGA_CATEGORY[activeMega ?? ""];
                      const catPhotos = megaCat
                        ? allProducts.filter((p) => p.category === megaCat && p.image?.startsWith("http"))
                        : [];
                      const image =
                        getMegaCategoryImage(sub) ??
                        catPhotos[subIdx % (catPhotos.length || 1)]?.image;
                      const href = resolveMenuHref(sub.href);
                      return (
                        <Link
                          key={sub.label}
                          to={href}
                          onClick={closeMegaMenu}
                          onMouseEnter={() => setActiveSubItem(sub.label)}
                          className="group flex min-w-[122px] flex-col items-center gap-3 pt-2 text-center outline-none"
                        >
                          {/* disco quente + violão saindo por cima (3D). Imagem
                              JPEG fundo-branco usa multiply p/ sumir o branco
                              sobre o disco claro e o painel creme; profundidade
                              vem da sombra do disco (drop-shadow viraria retângulo
                              numa imagem opaca). */}
                          <span className="relative flex h-[128px] w-[120px] items-end justify-center">
                            <span
                              aria-hidden="true"
                              className="absolute bottom-0 left-1/2 h-[96px] w-[96px] -translate-x-1/2 rounded-full transition-transform duration-300 group-hover:scale-105"
                              style={{
                                background: "radial-gradient(circle at 50% 38%, rgba(17, 17, 17, 0.08), rgba(17, 17, 17, 0.06) 70%)",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 24px -10px rgba(17,17,17,0.42)",
                              }}
                            />
                            {image ? (
                              <ImageWithFallback
                                src={image}
                                alt={sub.label}
                                className="relative z-[1] h-[118px] w-auto max-w-[112%] object-contain object-bottom transition-transform duration-300 group-hover:-translate-y-2.5 group-hover:scale-[1.06]"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            ) : (
                              <span className="relative z-[1] mb-2 grid h-[88px] w-[88px] place-items-center">
                                <Grid2x2 size={34} className="text-foreground/35 transition-colors group-hover:text-primary" strokeWidth={1.5} />
                              </span>
                            )}
                          </span>
                          <span
                            className="max-w-[130px] text-foreground/78 transition-colors group-hover:text-foreground"
                            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600, lineHeight: 1.1 }}
                          >
                            {sub.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-surface-0 text-ink-strong"
            onClick={() => setSearchOpen(false)}
          >
            <div
              ref={searchDropdownRef}
              className="relative mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col px-4 py-4 sm:px-6 md:px-8 md:py-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-12 items-center justify-between md:h-14">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/[0.05] hover:text-ink-strong"
                  aria-label="Fechar busca"
                >
                  <X size={21} strokeWidth={1.6} />
                </button>
                <Link to="/" onClick={() => setSearchOpen(false)} className="absolute left-1/2 block -translate-x-1/2">
                  <img src={TONANTE_LOGO} alt="Tonante" className="h-[25px] w-auto object-contain md:h-[32px]" />
                </Link>
                <span className="h-10 w-10" aria-hidden="true" />
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-8 w-full md:mt-14">
                <div className="mx-auto flex w-full max-w-[920px] items-center gap-3 border-b border-edge pb-3 md:gap-5 md:pb-5">
                  <Search size={22} className="flex-shrink-0 text-ink-muted md:h-7 md:w-7" strokeWidth={1.45} />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produtos, categorias..."
                    className="min-w-0 flex-1 bg-transparent text-ink-strong outline-none placeholder:text-ink-strong/34"
                    style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 7vw, 46px)", fontWeight: 500, lineHeight: 1.05 }}
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-ink-muted transition-colors hover:bg-white/[0.09] hover:text-ink-strong"
                      aria-label="Limpar busca"
                    >
                      <X size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="hidden rounded-full bg-primary px-5 py-2 text-ink-strong transition-opacity hover:opacity-90 md:block"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}
                    >
                      BUSCAR
                    </button>
                  )}
                </div>
              </form>

              <div className="mx-auto mt-8 w-full max-w-[920px] pb-20 md:mt-11">
                {searchQuery.trim().length === 0 ? (
                  <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
                    <section>
                      <div className="mb-4 flex items-center gap-2">
                        <TrendingUp size={13} className="text-primary" />
                        <span className="tracking-[0.18em] text-ink-strong/38" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}>TENDENCIAS</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {trending.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSearchQuery(t)}
                            className="rounded-full border border-edge-subtle bg-white/[0.055] px-4 py-2.5 text-ink-strong/64 transition-colors hover:border-primary/40 hover:bg-white/[0.08] hover:text-ink-strong"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 650 }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="mt-9 border-t border-edge-subtle pt-7">
                        <div className="mb-4 flex items-center gap-2">
                          <Search size={13} className="text-ink-strong/28" />
                          <span className="tracking-[0.18em] text-ink-strong/34" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}>ATALHOS</span>
                        </div>
                        {["Water coolers", "Gabinetes", "Perifericos", "Hardware"].map((item) => (
                          <Link
                            key={item}
                            to={`/produtos?search=${encodeURIComponent(item)}`}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center justify-between border-b border-edge-subtle py-4 text-ink-strong/72 transition-colors hover:text-ink-strong"
                            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600 }}
                          >
                            <span>{item}</span>
                            <ArrowUpRight size={16} className="text-ink-strong/22 transition-colors group-hover:text-primary" />
                          </Link>
                        ))}
                      </div>
                    </section>

                    <section className="border-t border-edge-subtle pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                      <div className="mb-4 flex items-center gap-2">
                        <Clock size={13} className="text-ink-strong/28" />
                        <span className="tracking-[0.18em] text-ink-strong/34" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}>RECENTES</span>
                      </div>
                      <div className="space-y-1">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setSearchQuery(r)}
                            className="flex w-full items-center gap-3 rounded-[var(--radius-card)] py-3 text-left text-ink-strong/48 transition-colors hover:bg-white/[0.035] hover:px-3 hover:text-ink-strong/76"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", fontWeight: 650 }}
                          >
                            <Clock size={13} className="text-ink-strong/22" />
                            {r}
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <p className="mb-5 tracking-[0.16em] text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}>
                      {searchResults.length} RESULTADO{searchResults.length !== 1 ? "S" : ""}
                    </p>
                    <div className="grid gap-2">
                      {searchResults.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.16, delay: i * 0.025 }}
                        >
                          <Link
                            to={`/produto/${product.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center gap-4 border-b border-edge-subtle py-3.5 transition-colors hover:border-foreground/10 md:gap-5 md:py-4"
                          >
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[var(--radius-card-sm)] bg-white/[0.05] md:h-[76px] md:w-[76px]">
                              <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-ink-strong/88 transition-colors group-hover:text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(15px, 4vw, 19px)", fontWeight: 650, lineHeight: 1.15 }}>
                                {product.name}
                              </p>
                              <p className="mt-1 text-ink-strong/34" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                {product.category}
                              </p>
                            </div>
                            <span className="hidden flex-shrink-0 text-ink-strong/58 md:block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 750 }}>
                              {product.price}
                            </span>
                            <ArrowUpRight size={16} className="flex-shrink-0 text-ink-strong/24 transition-colors group-hover:text-primary" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-edge pt-9 text-left">
                    <p className="text-ink-strong/76" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 650 }}>Nenhum resultado</p>
                    <p className="mt-2 max-w-[420px] text-ink-strong/38" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Tente buscar por categoria, produto ou linha PCYES.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-background"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuView === "region" ? (
                <motion.div
                  key="mobile-region"
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 24, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  <div className="flex h-16 items-center gap-4 border-b border-foreground/8 px-5">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="flex h-10 w-10 items-center justify-center text-foreground/60"
                      aria-label="Voltar ao menu"
                    >
                      <ChevronLeft size={20} strokeWidth={1.6} />
                    </button>
                    <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600 }}>
                      Região e idioma
                    </p>
                  </div>

                  <div className="px-6 py-7">
                    <p className="mb-5 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.55 }}>
                      Escolha a loja mais próxima para ver disponibilidade, frete e atendimento local.
                    </p>
                    {[
                      { flag: "BR", title: "Brasil", detail: "Português" },
                      { flag: "AR", title: "Argentina", detail: "Español" },
                      { flag: "CL", title: "Chile", detail: "Español" },
                    ].map((region) => (
                      <button
                        key={region.title}
                        className="flex w-full items-center gap-4 border-b border-foreground/7 py-4 text-left"
                        onClick={() => setMobileMenuView("main")}
                      >
                        <span className="flex h-8 w-10 items-center justify-center rounded-[var(--radius-card)] bg-foreground/[0.04] text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
                          {region.flag}
                        </span>
                        <span className="text-foreground/76" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", fontWeight: 500 }}>
                          {region.title} · <span className="text-foreground/42">{region.detail}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : mobileMenuView === "category" && mobileActiveMega ? (
                <motion.div
                  key={`mobile-category-${mobileActiveMega}`}
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 24, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  {/* Breadcrumb header */}
                  <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-foreground/8 px-5">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-foreground/60"
                      aria-label="Voltar ao menu"
                    >
                      <ChevronLeft size={20} strokeWidth={1.6} />
                    </button>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="flex-shrink-0 text-foreground/38" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                        Menu
                      </span>
                      <ChevronRight size={12} className="flex-shrink-0 text-foreground/25" />
                      <span className="truncate text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600 }}>
                        {megaMenus[mobileActiveMega]?.title}
                      </span>
                    </div>
                  </div>

                  {/* Subcategory list */}
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="border-b border-foreground/8">
                      {megaMenus[mobileActiveMega]?.subItems.map((sub, i) => (
                        <motion.div
                          key={sub.label}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.18 }}
                        >
                          <Link
                            to={resolveMenuHref(sub.href)}
                            onClick={() => { setMobileOpen(false); setMobileMenuView("main"); setMobileActiveMega(null); }}
                            className="flex min-h-[56px] w-full items-center justify-between border-b border-foreground/7 px-7 last:border-b-0"
                          >
                            <span className="text-foreground/74" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", fontWeight: 500 }}>
                              {sub.label}
                            </span>
                            <ChevronRight size={16} className="flex-shrink-0 text-foreground/28" strokeWidth={1.5} />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <div className="px-7 py-5">
                      <Link
                        to={resolveMenuHref(navItems.find((n) => n.mega === mobileActiveMega)?.href)}
                        onClick={() => { setMobileOpen(false); setMobileMenuView("main"); setMobileActiveMega(null); }}
                        className="flex items-center gap-1.5 text-primary transition-opacity hover:opacity-75"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                      >
                        <span>Ver tudo em {megaMenus[mobileActiveMega]?.title}</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-main"
                  initial={{ x: -18, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -18, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  <div className="flex h-16 items-center justify-between border-b border-foreground/8 px-5">
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="flex h-10 w-10 items-center justify-center text-foreground/64"
                      aria-label="Fechar menu"
                    >
                      <X size={20} strokeWidth={1.55} />
                    </button>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="absolute left-1/2 -translate-x-1/2">
                      <img src={TONANTE_LOGO} alt="Tonante" className="h-[26px] w-auto object-contain" />
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                      className="flex h-10 w-10 items-center justify-center text-foreground/64"
                      aria-label="Buscar"
                    >
                      <Search size={19} strokeWidth={1.55} />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="border-b border-foreground/8">
                      {navItems.map((item, i) => {
                        const isGreen = item.emphasis === "green";
                        const isBuild = item.emphasis === "build";
                        const labelStyle: React.CSSProperties = {
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-base)",
                          fontWeight: isBuild ? 700 : 500,
                        };
                        if (isGreen) labelStyle.color = "#34d399";
                        if (isBuild) {
                          labelStyle.color = "#e08c12";
                          labelStyle.letterSpacing = "0.02em";
                        }
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.025, duration: 0.18 }}
                          >
                            <button
                              onClick={() => {
                                if (item.mega) {
                                  setMobileActiveMega(item.mega);
                                  setMobileMenuView("category");
                                } else {
                                  navigate(resolveMenuHref(item.href));
                                  setMobileOpen(false);
                                }
                              }}
                              className="flex min-h-[58px] w-full items-center justify-between border-b border-foreground/7 px-7 text-left last:border-b-0"
                            >
                              <span
                                className={isGreen || isBuild ? "" : "text-foreground/74"}
                                style={labelStyle}
                              >
                                {item.label}
                              </span>
                              {item.mega && <ChevronRight size={17} className="text-foreground/32" strokeWidth={1.5} />}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="bg-foreground/[0.025] px-7 py-4">
                      {[
                        { icon: Heart, label: "Lista de desejos", action: () => navigate("/perfil?tab=favorites"), badge: favCount },
                        { icon: User, label: isLoggedIn ? "Minha conta" : "Login", action: handleUserClick },
                        { icon: MapPin, label: "Onde comprar", action: () => navigate("/onde-encontrar") },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            onClick={() => { item.action(); setMobileOpen(false); }}
                            className="flex w-full items-center gap-4 py-3.5 text-left"
                          >
                            <span className="relative flex h-8 w-8 items-center justify-center text-foreground/45">
                              <Icon size={17} strokeWidth={1.45} />
                              {!!item.badge && item.badge > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-primary-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
                                  {item.badge}
                                </span>
                              )}
                            </span>
                            <span className="text-foreground/78" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setMobileMenuView("region")}
                      className="flex w-full items-center gap-4 px-7 py-5 text-left"
                    >
                      <span className="flex h-8 w-8 items-center justify-center text-foreground/45">
                        <Globe2 size={17} strokeWidth={1.45} />
                      </span>
                      <span className="text-foreground/78" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                        Brasil · Português
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
