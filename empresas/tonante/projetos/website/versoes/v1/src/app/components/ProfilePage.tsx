import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Package, Heart, MapPin, User, CreditCard, HelpCircle, Shield, LogOut,
  ChevronRight, Truck, Check, Clock, X as XIcon, Star, ShoppingBag, Trash2,
  ArrowLeft, Copy, Receipt, Info, Share2, AlertCircle, PackageCheck,
  LayoutDashboard, Sparkles, LayoutGrid
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useAuth, type Order, type UserAddress, type UserCard } from "./AuthContext";
import { AddressFormModal } from "./AddressFormModal";
import { FieldInput } from "./section";
import { CardFormModal } from "./CardFormModal";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { CardBrandLogo } from "./CardBrandLogo";
import { PcyesCoin } from "./PcyesCoin";
import { ConfirmDialog } from "./ConfirmDialog";
import { ReviewModal } from "./ReviewModal";

function OrderStatusTimeline({ status }: { status: Order["status"] }) {
  const steps = [
    { key: "received", label: "Recebido", icon: Clock },
    { key: "processing", label: "Preparando", icon: Check },
    { key: "shipped", label: "Em Trânsito", icon: Truck },
    { key: "delivered", label: "Entregue", icon: PackageCheck },
  ];

  const getStatusIndex = (s: string) => {
    if (s === "cancelled") return -1;
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "processing") return 1;
    return 0;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="relative flex justify-between items-start mb-12 mt-4 px-2 sm:px-4">
      <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-foreground/5 block z-0" />
      {currentIndex >= 0 && (
        <div
          className="absolute top-[20px] left-[10%] h-[2px] block z-0 transition-all duration-1000"
          style={{ width: `${(currentIndex / 3) * 80}%`, background: "var(--ink-strong)" }}
        />
      )}
      
      {steps.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isCancelled = status === "cancelled";
        
        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
              isActive ? (isCancelled ? "bg-red-500 text-white" : "bg-[var(--ink-strong)] text-white") 
              : "bg-foreground/5 text-foreground/35"
            }`}>
              <step.icon size={18} className={isCurrent ? "animate-pulse" : ""} />
            </div>
            <p className={`text-[var(--text-caption)] sm:text-[var(--text-caption)] text-center font-medium leading-tight ${
              isActive ? "text-foreground" : "text-foreground/35"
            }`} style={{ fontFamily: "var(--font-family-inter)" }}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

type Tab = "overview" | "orders" | "points" | "favorites" | "addresses" | "data" | "cards" | "help" | "privacy";

const TABS: { key: Tab; icon: typeof Package; label: string; short: string }[] = [
  { key: "overview",  icon: LayoutDashboard, label: "Visão Geral",     short: "Visão"       },
  { key: "orders",    icon: Package,         label: "Meus Pedidos",    short: "Pedidos"     },
  { key: "points",    icon: Sparkles,        label: "Ton Points",    short: "Points"      },
  { key: "favorites", icon: Heart,           label: "Favoritos",       short: "Favoritos"   },
  { key: "addresses", icon: MapPin,          label: "Endereços",       short: "Endereços"   },
  { key: "data",      icon: User,            label: "Dados Pessoais",  short: "Dados"       },
  { key: "cards",     icon: CreditCard,      label: "Cartões",         short: "Cartões"     },
  { key: "help",      icon: HelpCircle,      label: "Ajuda e Suporte", short: "Ajuda"       },
  { key: "privacy",   icon: Shield,          label: "Privacidade",     short: "Privacidade" },
];

const STATUS_MAP = {
  processing: { label: "Preparando", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  shipped: { label: "A caminho", color: "text-blue-400", bg: "bg-blue-400/10", icon: Truck },
  delivered: { label: "Entregue", color: "text-green-500", bg: "bg-green-500/10", icon: Check },
  cancelled: { label: "Cancelado", color: "text-red-400", bg: "bg-red-400/10", icon: XIcon },
};

/* Abas da lista de pedidos. "A caminho" junta preparando e em trânsito: pra
   quem comprou, as duas respondem a mesma pergunta — ainda não chegou. */
type OrderFilter = "shipping" | "delivered" | "cancelled";

const ORDER_FILTERS: { key: OrderFilter; label: string; vazio: string; match: (s: Order["status"]) => boolean }[] = [
  { key: "shipping",  label: "A caminho",  vazio: "a caminho",  match: (s) => s === "shipped" || s === "processing" },
  { key: "delivered", label: "Entregues",  vazio: "entregue",   match: (s) => s === "delivered" },
  { key: "cancelled", label: "Cancelados", vazio: "cancelado",  match: (s) => s === "cancelled" },
];

/* Ponto colorido + rótulo, do jeito da referência: a cor fica no ponto de
   7px e o texto continua em tinta, então o status se lê sem gritar. */
const STATUS_DOT: Record<Order["status"], { dot: string; text: string }> = {
  processing: { dot: "#d08700", text: "#8a6200" },
  shipped:    { dot: "#c87800", text: "#8a5200" },
  delivered:  { dot: "#12924c", text: "#0b6333" },
  cancelled:  { dot: "#b3261e", text: "#8a1d17" },
};

/* Os níveis contam uma carreira de músico, do primeiro acorde ao palco: as
   patentes militares que estavam aqui ("Recruta", "Soldado", "Veterano") vieram
   da PCYES e não dizem nada pra quem compra violão. */
const TIERS = [
  { level: 1, name: "Primeiro Acorde", minOrders: 0,  benefit: "Cupom 5% de boas-vindas" },
  { level: 2, name: "Roda de Violão",  minOrders: 2,  benefit: "Frete grátis acima de R$ 199" },
  { level: 3, name: "Palco Aberto",    minOrders: 5,  benefit: "Acesso antecipado a pré-vendas" },
  { level: 4, name: "Estrada",         minOrders: 10, benefit: "Cashback 2% + brindes exclusivos" },
  { level: 5, name: "Mestre Luthier",  minOrders: 20, benefit: "Atendimento dedicado + edições limitadas antes de todos" },
];

/* A referência abre o painel com uma saudação; aqui ela segue o relógio de
   quem está olhando em vez de um "Olá" fixo. */
/* "2026-04-02 14:20" e "2026-04-02" entram igual e saem como 02/04. */
function dataCurta(d: string) {
  const dia = new Date(d.split(" ")[0] + "T12:00:00");
  return Number.isNaN(dia.getTime()) ? "" : dia.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function getTier(ordersCount: number) {
  const current = [...TIERS].reverse().find((t) => ordersCount >= t.minOrders) ?? TIERS[0];
  const next = TIERS.find((t) => t.minOrders > ordersCount);
  const progress = next
    ? Math.min(1, (ordersCount - current.minOrders) / (next.minOrders - current.minOrders))
    : 1;
  const ordersToNext = next ? next.minOrders - ordersCount : 0;
  return { current, next, progress, ordersToNext };
}

export function ProfilePage() {
  const {
    user, isLoggedIn, setAuthModalOpen, logout, updateUser,
    addAddress, updateAddress, removeAddress, setDefaultAddress,
    addCard, updateCard, removeCard, setDefaultCard,
  } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = TABS.some((tab) => tab.key === searchParams.get("tab")) ? searchParams.get("tab") as Tab : "overview";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [favSubTab, setFavSubTab] = useState<"products" | "setups">("products");
  const [savedBuilds, setSavedBuilds] = useState<Array<{
    id: string;
    name: string;
    selections: Record<string, string[]>;
    total: number;
    savedAt: number;
    items: Array<{ category: string; name: string; price: number; image?: string }>;
  }>>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("shipping");
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; description?: string; confirmLabel?: string; action?: () => void; destructive?: boolean }>({ open: false, title: "" });
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
  const askConfirm = (cfg: { title: string; description?: string; confirmLabel?: string; action: () => void; destructive?: boolean }) =>
    setConfirmState({ open: true, ...cfg });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, open: false }));
  /* Modal state — controla qual modal está aberto e qual item editar (null = novo). */
  const [addressModal, setAddressModal] = useState<{ open: boolean; editing: UserAddress | null }>({ open: false, editing: null });
  const [cardModal, setCardModal] = useState<{ open: boolean; editing: UserCard | null }>({ open: false, editing: null });
  const setProfileTab = (tab: Tab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === "overview") next.delete("tab");
    else next.set("tab", tab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (TABS.some((tab) => tab.key === tabParam)) {
      setActiveTab(tabParam as Tab);
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== "favorites") return;
    try {
      const raw = window.localStorage.getItem("pcyes-saved-builds");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedBuilds(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [activeTab]);

  const deleteSavedBuild = (id: string) => {
    const next = savedBuilds.filter((b) => b.id !== id);
    setSavedBuilds(next);
    try {
      window.localStorage.setItem("pcyes-saved-builds", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const formatRelTime = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins} min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} dia${days > 1 ? "s" : ""} atrás`;
    return new Date(ts).toLocaleDateString("pt-BR");
  };

  const formatBRLBuild = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  if (!isLoggedIn || !user) {
    return (
      /* `min-h-screen` aqui somava 100vh ao header e ao footer: a página
         rolava para meia tela de branco. A caixa só precisa de altura para
         não colar no header — o resto é respiro medido. */
      <>
        <div className="flex min-h-[46vh] items-center justify-center px-8 py-20 md:py-28">
        <div className="text-center max-w-md">
          <User size={40} className="text-foreground/30 mx-auto mb-6" />
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-light)" }}>
            Acesse sua conta
          </h2>
          <p className="text-foreground/50 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.7" }}>
            Faça login para acessar seus pedidos, favoritos e informações.
          </p>
          <button onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 btn-tonante transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}
          >Entrar na minha conta</button>
        </div>
        </div>
        {/* o footer vive em cada página, não no RootLayout; este atalho saía
           antes do <Footer /> do fim do arquivo e a página deslogada ficava
           sem rodapé. */}
        <Footer />
      </>
    );
  }

  const favoriteProducts = getVisibleCatalogProducts(allProducts).filter((p) => favorites.has(p.id));

  const activeOrders = user.orders.filter((o) => o.status === "processing" || o.status === "shipped").length;
  const tier = getTier(user.orders.length);

  return (
    <div className="">
      {/* Header */}
      <div className="px-5 md:px-8 pt-9 pb-8" style={{ background: "var(--surface-1)" }}>
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center gap-8 md:gap-8">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-[78px] h-[78px] rounded-full bg-foreground/[0.06] flex items-center justify-center border border-foreground/10" style={{ boxShadow: "0 0 0 4px rgba(17, 17, 17, 0.04)" }}>
                <span className="text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: 600 }}>
                  {user.name.charAt(0)}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.06em" }}>
                <Sparkles size={8} className="fill-white" /> Nv. {tier.current.level}
              </span>
            </div>
            <div>
              <h1 className="text-foreground mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 6vw, 34px)", fontWeight: 600, lineHeight: "1.1" }}>
                E aí, {user.name.split(" ")[0]}
              </h1>
              <p className="text-foreground/60 flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                <span className="text-primary font-semibold">{tier.current.name}</span>
                <span className="text-foreground/35">·</span>
                <span>{user.email}</span>
              </p>
            </div>
          </div>
          <div className="md:ml-auto flex flex-wrap items-center gap-3 md:gap-8">
            <div>
              <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Pedidos</p>
              <p className="text-foreground mt-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>{user.orders.length}</p>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div>
              <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Favoritos</p>
              <p className="text-foreground mt-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>{favorites.size}</p>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5" style={{ borderRadius: "var(--radius-card-md)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
              <PcyesCoin size={28} />
              <div>
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--primary)" }}>Ton Points</p>
                <p style={{ fontFamily: "var(--font-family-figtree)", fontWeight: 700, lineHeight: 1.1, color: "var(--primary)", fontSize: "var(--text-lg)" }} className="sm:text-[var(--text-xl)]">
                  {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 py-10">
        <div className="max-w-[1520px] mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar — vertical on desktop, horizontal scrollable tab bar on mobile */}
          <aside className="w-full lg:w-[292px] flex-shrink-0">
            {/* Mobile horizontal scroll: CSS mask handles the right-edge fade
                so it follows the viewport regardless of container padding.
                Desktop reverts to a vertical sidebar via `lg:` resets.    */}
            {/* Desktop: um cartão só, com a saudação em cima e as abas em
                pílulas — ícone dentro de um círculo e a aba ativa preenchida
                de tinta. A barra rolável de antes continua existindo no
                mobile, onde pílulas empilhadas não cabem. */}
            <div
              className="hidden lg:block"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--edge-subtle)",
                borderRadius: "var(--radius-card-xl)",
                padding: "20px 16px",
                boxShadow: "0 1px 2px rgba(17,17,17,0.03)",
              }}
            >
              <div className="px-2 pb-4">
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--ink-subtle)" }}>
                  {saudacao()},
                </p>
                <p className="mt-0.5 truncate" title={user.name} style={{ fontFamily: "var(--font-family-figtree)", fontSize: "19px", fontWeight: 700, letterSpacing: "-0.015em", color: "var(--ink-strong)" }}>
                  {user.name}
                </p>
              </div>
              <nav className="space-y-1" aria-label="Navegação do perfil">
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setProfileTab(tab.key)}
                      aria-current={active ? "page" : undefined}
                      className="flex w-full cursor-pointer items-center gap-3 transition-colors duration-200"
                      style={{
                        padding: "8px 12px 8px 8px",
                        borderRadius: "var(--radius-pill)",
                        background: active ? "var(--ink-strong)" : "transparent",
                        color: active ? "#ffffff" : "var(--ink-muted)",
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--surface-glass)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span
                        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                        style={{
                          background: active ? "rgba(255,255,255,0.16)" : "var(--well)",
                          border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--edge-subtle)",
                        }}
                      >
                        <tab.icon size={16} aria-hidden="true" />
                      </span>
                      <span className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: active ? 600 : 500 }}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className="my-3 h-px" style={{ background: "var(--edge-subtle)" }} />
              <button
                onClick={logout}
                className="flex w-full cursor-pointer items-center gap-3 transition-colors duration-200"
                style={{ padding: "8px 12px 8px 8px", borderRadius: "var(--radius-pill)", color: "#b3261e" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(179,38,30,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full" style={{ background: "rgba(179,38,30,0.08)", border: "1px solid rgba(179,38,30,0.16)" }}>
                  <LogOut size={16} aria-hidden="true" />
                </span>
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 500 }}>Sair</span>
              </button>
            </div>

            <nav
              className="profile-tabs flex flex-row gap-2 overflow-x-auto -mx-5 px-5 lg:hidden [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)]"
              style={{ scrollbarWidth: "none" }}
              aria-label="Navegação do perfil"
            >
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => setProfileTab(tab.key)}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                  className={`relative flex-shrink-0 lg:flex-shrink
                    flex flex-col items-center justify-center
                    lg:flex-row lg:items-center lg:justify-start
                    gap-0 lg:gap-3
                    min-w-[72px] min-h-[60px] px-2 py-2
                    lg:min-w-0 lg:min-h-0 lg:w-full lg:py-2.5 lg:px-3.5
                    whitespace-nowrap lg:whitespace-normal
                    transition-all duration-200 cursor-pointer
                    ${activeTab === tab.key ? "text-primary" : "text-foreground/60 hover:text-foreground/88"}`}
                  style={{
                    borderRadius: "var(--radius-card-xl)",
                    background: activeTab === tab.key
                      ? "var(--well)"
                      : "transparent",
                    fontFamily: "var(--font-family-inter)",
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    // Active indicator stroke: top on mobile (horizontal tabs),
                    // left on desktop (vertical sidebar).
                    boxShadow: activeTab === tab.key
                      ? "inset 0 2px 0 var(--primary)"
                      : "none",
                  }}
                >
                  <tab.icon size={18} aria-hidden="true" className="lg:hidden mb-1 flex-shrink-0" />
                  <tab.icon size={15} aria-hidden="true" className="hidden lg:block flex-shrink-0" />
                  {/* Mobile: short label below icon */}
                  <span className="lg:hidden text-center leading-tight" style={{ fontSize: "var(--text-caption)" }}>{tab.short}</span>
                  {/* Desktop: full label inline */}
                  <span className="hidden lg:inline" style={{ fontSize: "var(--text-sm)" }}>{tab.label}</span>
                </button>
              ))}
              <div className="hidden lg:block h-px bg-foreground/8 my-3" />
              {/* Logout — same compact tile treatment on mobile */}
              <button onClick={logout}
                aria-label="Sair da conta"
                className="flex-shrink-0 lg:flex-shrink
                  flex flex-col items-center justify-center
                  lg:flex-row lg:items-center lg:justify-start
                  gap-0 lg:gap-3
                  min-w-[72px] min-h-[60px] px-2 py-2
                  lg:min-w-0 lg:min-h-0 lg:w-full lg:py-2.5 lg:px-3.5
                  whitespace-nowrap lg:whitespace-normal
                  text-foreground/50 hover:text-primary transition-all duration-200 cursor-pointer"
                style={{ borderRadius: "var(--radius-card-xl)", fontFamily: "var(--font-family-inter)", fontWeight: 500 }}
              >
                <LogOut size={18} aria-hidden="true" className="lg:hidden mb-1 flex-shrink-0" />
                <LogOut size={15} aria-hidden="true" className="hidden lg:block flex-shrink-0" />
                <span className="lg:hidden text-center leading-tight" style={{ fontSize: "var(--text-caption)" }}>Sair</span>
                <span className="hidden lg:inline" style={{ fontSize: "var(--text-sm)" }}>Sair</span>
              </button>
            </nav>

            {/* Mobile only: "Ver todas as abas" — opens a sheet with the
                full tab grid so the user does not depend on horizontal
                scroll discovery. */}
            <div className="mt-3 flex justify-center lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Ver todas as abas do perfil"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 text-foreground/70 transition-colors hover:text-foreground hover:bg-foreground/[0.06] cursor-pointer"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
                  >
                    <LayoutGrid size={14} aria-hidden="true" />
                    Ver todas as abas
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="border-foreground/10 bg-background">
                  <SheetHeader>
                    <SheetTitle className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600 }}>
                      Áreas do perfil
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-2 grid grid-cols-3 gap-3 p-4">
                    {TABS.map((tab) => {
                      const active = activeTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => {
                            setProfileTab(tab.key);
                            // Close sheet by emitting Escape (Radix listens).
                            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                          }}
                          aria-current={active ? "page" : undefined}
                          className={`flex flex-col items-center justify-center gap-2 min-h-[88px] rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? "border-primary/40 bg-foreground/[0.06] text-primary"
                              : "border-foreground/10 bg-foreground/[0.02] text-foreground/75 hover:border-foreground/20 hover:bg-foreground/[0.05]"
                          }`}
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
                        >
                          <tab.icon size={20} aria-hidden="true" />
                          <span className="text-center leading-tight">{tab.label}</span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                      }}
                      aria-label="Sair da conta"
                      className="flex flex-col items-center justify-center gap-2 min-h-[88px] rounded-xl border border-foreground/10 bg-foreground/[0.02] text-foreground/55 transition-colors hover:border-foreground/10 hover:bg-foreground/[0.04] hover:text-primary cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}
                    >
                      <LogOut size={20} aria-hidden="true" />
                      <span className="text-center leading-tight">Sair</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Visão Geral</h2>

                  {/* Hero card: pedido em rota com timeline anti-ansiedade OU estado de calma */}
                  {(() => {
                    const activeOrdersAll = user.orders.filter((o) => o.status === "shipped" || o.status === "processing");
                    const shippedFirst = [...activeOrdersAll].sort((a, b) => (a.status === "shipped" ? -1 : 1));
                    const nextOrder = shippedFirst[0];
                    const otherActiveCount = activeOrdersAll.length - 1;
                    if (!nextOrder) {
                      return (
                        <div
                          className="relative mb-4 p-5 flex items-center gap-4 overflow-hidden"
                          style={{
                            borderRadius: "var(--radius-card-md)",
                            background: isDark
                              ? "var(--surface)"
                              : "var(--surface)",
                            border: "1px solid rgba(34,197,94,0.18)",
                          }}
                        >
                          <div className="w-11 h-11 rounded-full bg-green-500/12 flex items-center justify-center flex-shrink-0">
                            <Check size={18} className="text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-green-500 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                              Tudo certo
                            </p>
                            <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                              Sem pedidos pendentes
                            </p>
                            <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                              Que tal somar ao seu som?
                            </p>
                          </div>
                          <Link to="/produtos" className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 btn-tonante transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                            Explorar
                          </Link>
                        </div>
                      );
                    }
                    const stages = [
                      { key: "received", label: "Recebido", icon: Clock },
                      { key: "processing", label: "Preparando", icon: Check },
                      { key: "shipped", label: "A caminho", icon: Truck },
                      { key: "delivered", label: "Entregue", icon: PackageCheck },
                    ];
                    const stageIdx = nextOrder.status === "shipped" ? 2 : nextOrder.status === "processing" ? 1 : 0;
                    const eta = nextOrder.estimatedArrival
                      ? `Chega ${nextOrder.estimatedArrival}`
                      : nextOrder.status === "shipped" ? "Em trânsito" : "Em preparação";
                    const lastUpdate = nextOrder.history?.[0];
                    return (
                      <div
                        className="relative mb-4 overflow-hidden"
                        style={{
                          borderRadius: "var(--radius-card-md)",
                          background: isDark
                            ? "rgba(var(--foreground-rgb), 0.02)"
                            : "rgba(0,0,0,0.015)",
                          border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.08)" : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* Header: status + ETA */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-5 pb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                            </span>
                            <span className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                              {nextOrder.status === "shipped" ? "A caminho" : "Preparando loadout"}
                            </span>
                            {otherActiveCount > 0 && (
                              <button
                                onClick={() => setProfileTab("orders")}
                                className="inline-flex items-center min-h-[44px] md:min-h-0 cursor-pointer px-2 py-0.5 text-foreground/70 hover:text-foreground transition-colors gap-1"
                                style={{ borderRadius: "var(--radius-pill)", background: "rgba(var(--foreground-rgb), 0.06)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.06em" }}
                              >
                                +{otherActiveCount} {otherActiveCount === 1 ? "outro pedido" : "outros pedidos"} em rota
                              </button>
                            )}
                          </div>
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                            {eta}
                          </p>
                        </div>

                        {/* Pedido + thumbs */}
                        <div className="flex items-center gap-3 px-5 pb-4">
                          <div className="flex items-center gap-1.5">
                            {nextOrder.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-12 h-12 flex-shrink-0 overflow-hidden border border-foreground/8" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface-1)" }}>
                                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {nextOrder.items.length > 3 && (
                              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-foreground/60" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--well)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                +{nextOrder.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                              Pedido {nextOrder.id}
                            </p>
                            <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                              {nextOrder.items.length} {nextOrder.items.length === 1 ? "item" : "itens"} · {nextOrder.total}
                            </p>
                          </div>
                        </div>

                        {/* Timeline horizontal */}
                        <div className="px-5 pb-4">
                          <div className="relative flex justify-between items-start">
                            <div className="absolute top-[11px] left-[6%] right-[6%] h-[2px] bg-foreground/8 z-0" />
                            <div
                              className="absolute top-[11px] left-[6%] h-[2px] z-0 transition-all duration-1000"
                              style={{ width: `${(stageIdx / 3) * 88}%`, background: "var(--ink-strong)" }}
                            />
                            {stages.map((stg, idx) => {
                              const isActive = idx <= stageIdx;
                              const isCurrent = idx === stageIdx;
                              return (
                                <div key={stg.key} className="flex flex-col items-center flex-1 relative z-10">
                                  <div className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 mb-1.5 ${
                                    isActive ? "bg-[var(--ink-strong)] text-white" : "bg-foreground/8 text-foreground/30"
                                  }`}>
                                    <stg.icon size={11} />
                                    {isCurrent && (
                                      <span className="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping" />
                                    )}
                                  </div>
                                  <p className={`text-center leading-tight ${isActive ? "text-foreground/80" : "text-foreground/40"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: isCurrent ? 700 : 500 }}>
                                    {stg.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Última atualização */}
                        {lastUpdate && (
                          <div className="px-5 py-3 border-t border-foreground/6 flex items-center gap-2" style={{ background: "var(--surface)" }}>
                            <Info size={12} className="text-primary/70 flex-shrink-0" />
                            <p className="text-foreground/65 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                              <span className="text-foreground/85">{lastUpdate.description}</span>
                              <span className="text-foreground/45"> · {lastUpdate.date}</span>
                            </p>
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex items-center gap-2 px-5 py-3 border-t border-foreground/6">
                          <button
                            onClick={() => { setProfileTab("orders"); setSelectedOrderId(nextOrder.id); }}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[44px] md:min-h-0 gap-1.5 px-4 py-2 btn-tonante transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            <Truck size={13} /> Rastrear pedido
                          </button>
                          <button
                            onClick={() => setProfileTab("help")}
                            className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all cursor-pointer"
                            style={{ borderRadius: "var(--radius-card)", background: "var(--well)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            <HelpCircle size={13} /> Ajuda
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Grid de cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Últimos pedidos */}
                    <button
                      onClick={() => setProfileTab("orders")}
                      className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.025] profile-card"
                      style={{
                        borderRadius: "var(--radius-card-xl)",
                        background: "var(--surface)",
                        border: "1px solid var(--edge-subtle)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Últimos pedidos</p>
                        <ChevronRight size={14} className="text-foreground/35 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {user.orders.slice(0, 4).flatMap((o) => o.items).slice(0, 4).map((item, i) => (
                          <div key={i} className="w-12 h-12 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius-card)", background: "var(--surface-1)" }}>
                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>{user.orders.length} pedidos</p>
                      <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{activeOrders > 0 ? `${activeOrders} em andamento` : "Todos entregues"}</p>
                    </button>

                    {/* Favoritos */}
                    <button
                      onClick={() => setProfileTab("favorites")}
                      className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.025] profile-card"
                      style={{
                        borderRadius: "var(--radius-card-xl)",
                        background: "var(--surface)",
                        border: "1px solid var(--edge-subtle)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Favoritos</p>
                        <ChevronRight size={14} className="text-foreground/35 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 min-h-[48px]">
                        {favoriteProducts.slice(0, 4).map((p) => (
                          <div key={p.id} className="w-12 h-12 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius-card)", background: "var(--surface-1)" }}>
                            <ImageWithFallback src={getPrimaryProductImage(p)} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {favoriteProducts.length === 0 && (
                          <Heart size={20} className="text-foreground/30" />
                        )}
                      </div>
                      <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>{favoriteProducts.length} {favoriteProducts.length === 1 ? "produto" : "produtos"}</p>
                      <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Nada salvo ainda</p>
                    </button>

                    {/* Endereço padrão */}
                    {user.addresses[0] && (
                      <button
                        onClick={() => setProfileTab("addresses")}
                        className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.025] profile-card"
                        style={{
                          borderRadius: "var(--radius-card-xl)",
                          background: "var(--surface)",
                          border: "1px solid var(--edge-subtle)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Endereço padrão</p>
                          <ChevronRight size={14} className="text-foreground/35 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-primary/70 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-foreground truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                              {user.addresses[0].label}
                            </p>
                            <p className="text-foreground/60 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                              {user.addresses[0].street}, {user.addresses[0].number} · {user.addresses[0].city}/{user.addresses[0].state}
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Cartão padrão */}
                    {user.cards.find((c) => c.isDefault) && (() => {
                      const c = user.cards.find((c) => c.isDefault)!;
                      return (
                        <button
                          onClick={() => setProfileTab("cards")}
                          className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.01]"
                          style={{
                            borderRadius: "var(--radius-card-xl)",
                            background: "var(--surface)",
                            border: "1px solid var(--edge-subtle)",
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Cartão padrão</p>
                            <ChevronRight size={14} className="text-foreground/35 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex items-start gap-3">
                            <CreditCard size={16} className="text-primary/70 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                                {c.brand} ·••• {c.last4}
                              </p>
                              <p className="text-foreground/60 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                {c.name} · Validade {c.expiry}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })()}

                    {/* Ton Points card no grid */}
                    {(user.pcyesPoints ?? 0) > 0 && (
                      <button onClick={() => setProfileTab("points")}
                        className="group cursor-pointer text-left p-5 transition-all relative overflow-hidden md:col-span-2"
                        style={{
                          borderRadius: "var(--radius-card-xl)",
                          background: "var(--surface)",
                          border: "1px solid var(--edge-subtle)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <PcyesCoin size={44} />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--primary)" }}>Ton Points</p>
                            <div className="flex items-baseline gap-2">
                              <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--primary)" }}>
                                {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                              </p>
                              <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                = R$ {((user.pcyesPoints ?? 0) * 0.1).toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                            <p className="text-foreground/60 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Use no próximo pedido · Ver histórico e como ganhar mais</p>
                          </div>
                          <ChevronRight size={16} className="text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground flex-shrink-0" />
                        </div>
                      </button>
                    )}
                  </div>

                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {!selectedOrderId ? (
                    <>
                      {/* Abas de status em cima da lista, como na referência:
                          cada aba diz quantos pedidos tem, e a seleção filtra
                          de verdade — antes "Todos / Em andamento / Entregues"
                          eram três botões decorativos que não filtravam nada. */}
                      <h2 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Meus Pedidos</h2>
                      <div
                        className="mb-6 grid grid-cols-3 gap-1"
                        role="tablist"
                        aria-label="Filtrar pedidos por status"
                        style={{ background: "var(--surface)", border: "1px solid var(--edge-subtle)", borderRadius: "var(--radius-card-xl)", padding: "6px" }}
                      >
                        {ORDER_FILTERS.map((f) => {
                          const qtd = user.orders.filter((o) => f.match(o.status)).length;
                          const active = orderFilter === f.key;
                          return (
                            <button
                              key={f.key}
                              role="tab"
                              aria-selected={active}
                              onClick={() => setOrderFilter(f.key)}
                              className="flex cursor-pointer items-center justify-center gap-2 transition-colors duration-200"
                              style={{
                                padding: "11px 12px",
                                borderRadius: "var(--radius-card-lg)",
                                background: active ? "var(--well)" : "transparent",
                                color: active ? "var(--ink-strong)" : "var(--ink-subtle)",
                                fontFamily: "var(--font-family-inter)",
                                fontSize: "14.5px",
                                fontWeight: active ? 600 : 500,
                              }}
                            >
                              {f.label}
                              {qtd > 0 && (
                                <span
                                  className="num grid h-[19px] min-w-[19px] place-items-center rounded-full px-1"
                                  style={{
                                    background: active ? "var(--ink-strong)" : "var(--edge-subtle)",
                                    color: active ? "#fff" : "var(--ink-muted)",
                                    fontFamily: "var(--font-family-inter)",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {qtd}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {(() => {
                        const filtro = ORDER_FILTERS.find((f) => f.key === orderFilter) ?? ORDER_FILTERS[0];
                        const pedidos = user.orders.filter((o) => filtro.match(o.status));
                        if (!pedidos.length) {
                          return (
                            <div className="px-6 py-20 text-center" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                              <Package size={28} className="mx-auto mb-4 text-foreground/35" />
                              <p className="mb-2 text-foreground/55" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600 }}>
                                {user.orders.length === 0 ? "Nenhum pedido ainda" : `Nenhum pedido ${filtro.vazio}`}
                              </p>
                              <p className="mb-6 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                {user.orders.length === 0 ? "Quando você fizer um pedido, ele aparece aqui." : "Troque de aba para ver os outros pedidos."}
                              </p>
                              {user.orders.length === 0 && (
                                <Link to="/produtos" className="inline-block px-5 py-2.5 btn-tonante transition-all hover:brightness-110" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Explorar produtos</Link>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div className="space-y-4">
                            {pedidos.map((order) => {
                              const s = STATUS_MAP[order.status];
                              const emRota = order.status === "shipped" || order.status === "processing";
                              return (
                                <div
                                  key={order.id}
                                  style={{ background: "var(--surface)", border: "1px solid var(--edge-subtle)", borderRadius: "var(--radius-card-xl)" }}
                                >
                                  {/* linha 1: número do pedido + status */}
                                  <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                    <Package size={16} className="flex-shrink-0 text-foreground/45" aria-hidden="true" />
                                    <p className="num flex-1 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>
                                      {order.id}
                                    </p>
                                    <span className="flex flex-shrink-0 items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600, color: STATUS_DOT[order.status].text }}>
                                      <span className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: STATUS_DOT[order.status].dot }} />
                                      {s.label}
                                    </span>
                                  </div>

                                  {/* linha 2: a rota do pedido, como uma passagem —
                                      de onde saiu, quando chega, pra onde vai */}
                                  <div className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-center" style={{ borderTop: "1px solid var(--edge-subtle)", paddingTop: "14px" }}>
                                    <span className="flex min-w-0 items-center gap-2">
                                      <MapPin size={13} className="flex-shrink-0 text-foreground/40" aria-hidden="true" />
                                      <span className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--ink-muted)" }}>{order.origin}</span>
                                    </span>
                                    <span className="hidden flex-1 items-center gap-2 sm:flex" aria-hidden="true">
                                      <span className="h-px flex-1" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--edge) 0 3px, transparent 3px 7px)" }} />
                                      <span className="whitespace-nowrap px-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "var(--ink-subtle)" }}>
                                        {emRota && order.estimatedArrival
                                          ? `Chega ${order.estimatedArrival}`
                                          : order.status === "delivered"
                                          ? `Entregue em ${dataCurta(order.history?.find((h) => h.status === "delivered")?.date ?? order.date)}`
                                          : `Cancelado em ${dataCurta(order.history?.find((h) => h.status === "cancelled")?.date ?? order.date)}`}
                                      </span>
                                      <span className="h-px flex-1" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--edge) 0 3px, transparent 3px 7px)" }} />
                                    </span>
                                    <span className="flex min-w-0 items-center justify-end gap-2">
                                      <span className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--ink-muted)" }}>{order.destination}</span>
                                      <MapPin size={13} className="flex-shrink-0 text-foreground/40" aria-hidden="true" />
                                    </span>
                                  </div>

                                  {/* itens: um por linha, com foto, variação e preço —
                                      é o que a referência mostra e o que responde
                                      "o que eu comprei mesmo?" sem abrir detalhes */}
                                  <div className="px-5 pb-4">
                                    <div style={{ border: "1px solid var(--edge-subtle)", borderRadius: "var(--radius-card-lg)", overflow: "hidden" }}>
                                      {order.items.map((item, i) => (
                                        <div
                                          key={`${order.id}-${i}`}
                                          className="flex items-center gap-4 p-3"
                                          style={{ borderTop: i ? "1px solid var(--edge-subtle)" : "none" }}
                                        >
                                          <Link
                                            to={item.productId ? `/produto/${item.productId}` : "/produtos"}
                                            className="block h-[84px] w-[84px] flex-shrink-0 overflow-hidden"
                                            style={{ background: "var(--gradient-photo, var(--well))", borderRadius: "var(--radius-card-md)" }}
                                            aria-label={`Ver ${item.name}`}
                                          >
                                            <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" style={{ mixBlendMode: "multiply" }} />
                                          </Link>
                                          <div className="min-w-0 flex-1">
                                            <Link
                                              to={item.productId ? `/produto/${item.productId}` : "/produtos"}
                                              className="block truncate transition-colors hover:text-primary"
                                              title={item.name}
                                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 500, color: "var(--ink-strong)" }}
                                            >
                                              {item.name}
                                            </Link>
                                            <p className="num mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 700, color: "var(--ink-strong)" }}>
                                              {item.price}
                                              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--ink-subtle)" }}> ×{item.qty}</span>
                                            </p>
                                            {item.variant && (
                                              <p className="mt-0.5 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "var(--ink-subtle)" }}>{item.variant}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* fechamento: total à esquerda, Detalhes à direita */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderTop: "1px solid var(--edge-subtle)" }}>
                                    <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "var(--ink-muted)" }}>
                                      Total: <span className="num" style={{ fontWeight: 700, color: "var(--ink-strong)" }}>{order.total}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {order.status === "delivered" && !reviewedOrders.has(order.id) && (
                                        <button
                                          onClick={() => setReviewOrderId(order.id)}
                                          className="inline-flex cursor-pointer items-center gap-1.5 transition-colors"
                                          style={{ padding: "9px 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--edge)", color: "var(--ink-muted)", fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}
                                        >
                                          <Star size={13} /> Avaliar
                                        </button>
                                      )}
                                      {order.status === "delivered" && reviewedOrders.has(order.id) && (
                                        <span className="inline-flex items-center gap-1.5" style={{ padding: "9px 16px", borderRadius: "var(--radius-pill)", background: "rgba(18,146,76,0.08)", color: "var(--buy-green)", fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>
                                          <Check size={13} /> Avaliado
                                        </span>
                                      )}
                                      <button
                                        onClick={() => setSelectedOrderId(order.id)}
                                        className="inline-flex cursor-pointer items-center gap-1.5 transition-transform active:scale-[0.98]"
                                        style={{ padding: "9px 20px", borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}
                                      >
                                        Detalhes <ChevronRight size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </>
                  ) : (() => {
                    const order = user.orders.find(o => o.id === selectedOrderId);
                    if (!order) return null;
                    const s = STATUS_MAP[order.status];
                    
                    return (
                      <div className="space-y-6">
                        <button 
                          onClick={() => setSelectedOrderId(null)}
                          className="flex items-center gap-2 text-foreground/55 hover:text-primary transition-colors mb-6 group cursor-pointer"
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                        >
                          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar para pedidos
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(18px, 5vw, 24px)", fontWeight: "var(--font-weight-medium)" }}>Pedido {order.id}</h2>
                              <span className={`flex items-center gap-1.5 px-3 py-1 ${s.bg} ${s.color}`} style={{ borderRadius: "var(--radius-pill)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>
                                {s.label}
                              </span>
                            </div>
                            <p className="text-foreground/45" style={{ fontSize: "var(--text-sm)" }}>Realizado em {new Date(order.date).toLocaleDateString("pt-BR")} às 14:30</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 btn-tonante-ghost transition-colors cursor-pointer" style={{ fontSize: "var(--text-caption)" }}>
                              <Receipt size={14} /> Nota Fiscal
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 btn-tonante-ghost transition-colors cursor-pointer" style={{ fontSize: "var(--text-caption)" }}>
                              <Share2 size={14} /> Compartilhar
                            </button>
                          </div>
                        </div>

                        {/* Visual Tracking */}
                        <div className="bg-foreground/[0.02] border border-foreground/5 p-4 md:p-8" style={{ borderRadius: "var(--radius-card)" }}>
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-foreground/88 font-medium" style={{ fontSize: "var(--text-base)" }}>Acompanhamento do Pedido</h3>
                            {order.tracking && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] text-primary border border-foreground/10" style={{ borderRadius: "var(--radius-button)" }}>
                                <Truck size={14} />
                                <span className="font-mono text-[var(--text-caption)] font-bold">{order.tracking}</span>
                                <button onClick={() => { navigator.clipboard.writeText(order.tracking!); }} className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 hover:text-primary/70 transition-colors ml-1 cursor-pointer">
                                  <Copy size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <OrderStatusTimeline status={order.status} />
                          
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <div className="mt-8 p-4 bg-foreground/[0.04] border border-foreground/10 flex items-start gap-3" style={{ borderRadius: "var(--radius)" }}>
                              <Info size={16} className="text-primary mt-0.5" />
                              <div className="text-[var(--text-caption)] text-primary/80 leading-relaxed">
                                Seu pedido está seguindo o cronograma previsto. A data estimada de entrega é <strong>15 de Abril de 2026</strong>.
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Order History */}
                          <div className="lg:col-span-2 space-y-6">
                            <div className="bg-background border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                              <div className="px-6 py-4 border-b border-foreground/5 bg-foreground/[0.01]">
                                <h3 className="text-foreground/80 font-medium" style={{ fontSize: "var(--text-sm)" }}>Histórico de Atualizações</h3>
                              </div>
                              <div className="p-4 md:p-6">
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-foreground/5">
                                  {order.history?.map((event, i) => (
                                    <div key={i} className="relative pl-8">
                                      <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-background flex items-center justify-center z-10 ${
                                        i === 0 ? "bg-[var(--ink-strong)]" : "bg-foreground/10"
                                      }`} />
                                      <div>
                                        <p className={`font-medium mb-1 ${i === 0 ? "text-foreground" : "text-foreground/65"}`} style={{ fontSize: "var(--text-sm)" }}>{event.description}</p>
                                        <p className="text-foreground/45" style={{ fontSize: "var(--text-caption)" }}>{event.date}</p>
                                      </div>
                                    </div>
                                  )) || (
                                    <div className="text-center py-4 text-foreground/45 text-[var(--text-sm)]">
                                      Nenhum histórico disponível para este pedido.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-background border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                              <div className="px-6 py-4 border-b border-foreground/5 bg-foreground/[0.01]">
                                <h3 className="text-foreground/80 font-medium" style={{ fontSize: "var(--text-sm)" }}>Itens do Pedido</h3>
                              </div>
                              <div className="divide-y divide-foreground/5">
                                {order.items.map((item, i) => (
                                  <div key={i} className="p-6 flex items-center gap-4">
                                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius)", background: "var(--surface-1)" }}>
                                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-foreground font-medium mb-1 truncate" style={{ fontSize: "var(--text-sm)" }}>{item.name}</h4>
                                      <p className="text-foreground/45 mb-2" style={{ fontSize: "var(--text-caption)" }}>Quantidade: {item.qty}</p>
                                      <div className="flex items-center gap-2">
                                        <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 text-primary hover:underline font-medium cursor-pointer" style={{ fontSize: "var(--text-caption)" }}>Comprar novamente</button>
                                        <span className="text-foreground/35">•</span>
                                        <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 text-foreground/55 hover:text-foreground/75 transition-colors cursor-pointer" style={{ fontSize: "var(--text-caption)" }}>Ver produto</button>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-foreground font-semibold" style={{ fontSize: "var(--text-base)" }}>{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="p-6 bg-foreground/[0.01] border-t border-foreground/5 space-y-2">
                                <div className="flex justify-between text-[var(--text-sm)] text-foreground/55">
                                  <span>Subtotal</span>
                                  <span>{order.total}</span>
                                </div>
                                <div className="flex justify-between text-[var(--text-sm)] text-foreground/55">
                                  <span>Frete</span>
                                  <span className="text-green-500">Grátis</span>
                                </div>
                                <div className="flex justify-between text-[var(--text-base)] text-foreground font-bold pt-2">
                                  <span>Total</span>
                                  <span>{order.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sidebar Info */}
                          <div className="space-y-6">
                            <div className="bg-background border border-foreground/5 p-6" style={{ borderRadius: "var(--radius-card)" }}>
                              <h3 className="text-foreground/80 font-medium mb-4" style={{ fontSize: "var(--text-sm)" }}>Endereço de Entrega</h3>
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-foreground/35 mt-1" />
                                <div>
                                  <p className="text-foreground/88 font-medium mb-1" style={{ fontSize: "var(--text-sm)" }}>{user.addresses[0].label}</p>
                                  <p className="text-foreground/55 leading-relaxed" style={{ fontSize: "var(--text-caption)" }}>
                                    {user.addresses[0].street}, {user.addresses[0].number}<br />
                                    {user.addresses[0].neighborhood}<br />
                                    {user.addresses[0].city} - {user.addresses[0].state}<br />
                                    CEP {user.addresses[0].cep}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-background border border-foreground/5 p-6" style={{ borderRadius: "var(--radius-card)" }}>
                              <h3 className="text-foreground/80 font-medium mb-4" style={{ fontSize: "var(--text-sm)" }}>Pagamento</h3>
                              <div className="flex items-center gap-3">
                                <CreditCard size={16} className="text-foreground/35" />
                                <p className="text-foreground/75" style={{ fontSize: "var(--text-sm)" }}>{order.paymentMethod || "Cartão de Crédito"}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-foreground/10 hover:border-foreground/30 text-foreground/75 transition-all font-medium cursor-pointer"
                                style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-sm)" }}>
                                <HelpCircle size={16} /> Preciso de ajuda
                              </button>
                              {order.status === "processing" && (
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all font-medium border border-red-500/10 cursor-pointer"
                                  style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-sm)" }}>
                                  Cancelar Pedido
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-start gap-3 p-4" style={{ borderRadius: "var(--radius-card-lg)", background: "var(--well)", border: "1px solid var(--edge-subtle)" }}>
                              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
                              <p className="text-[var(--text-caption)] text-yellow-600 leading-normal">
                                Você tem até 7 dias após o recebimento para solicitar a devolução gratuita.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {activeTab === "points" && (() => {
                const history = user.pcyesPointsHistory ?? [];
                const totalEarned = history.filter((h) => h.amount > 0).reduce((acc, h) => acc + h.amount, 0);
                const totalSpent = -history.filter((h) => h.amount < 0).reduce((acc, h) => acc + h.amount, 0);
                const nextExpiring = history.filter((h) => h.expiresAt && h.amount > 0).sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime())[0];
                const today = new Date(2026, 4, 18);
                const daysToExpire = nextExpiring ? Math.ceil((new Date(nextExpiring.expiresAt!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <motion.div key="points" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                      <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Ton Points</h2>
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>1 pt = R$ 0,10 · Use até 30% por pedido</p>
                    </div>

                    {/* Hero saldo */}
                    <div className="relative mb-3 overflow-hidden p-6" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <div className="flex items-center gap-4 mb-4">
                        <PcyesCoin size={56} />
                        <div className="flex-1">
                          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--primary)" }}>Saldo disponível</p>
                          <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-h3)", fontWeight: 700, lineHeight: 1, color: "var(--primary)" }}>
                            {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                          </p>
                          <p className="text-foreground/65 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            Equivale a <span className="text-foreground font-semibold">R$ {((user.pcyesPoints ?? 0) * 0.1).toFixed(2).replace(".", ",")}</span> em desconto
                          </p>
                        </div>
                      </div>

                      {nextExpiring && daysToExpire > 0 && daysToExpire <= 60 && (
                        <div className="flex items-center gap-2 p-3 mt-3" style={{ borderRadius: "var(--radius-card-xl)", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
                          <AlertCircle size={14} className="text-yellow-500 flex-shrink-0" />
                          <p className="text-yellow-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                            {nextExpiring.amount} pts vencem em {daysToExpire} {daysToExpire === 1 ? "dia" : "dias"} · {new Date(nextExpiring.expiresAt!).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      <div className="p-4" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Acumulado</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {totalEarned} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                      <div className="p-4" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Resgatado</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {totalSpent} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                      <div className="p-4 col-span-2 md:col-span-1" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Próximo pedido pode usar até</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {Math.min(user.pcyesPoints ?? 0, 480)} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                    </div>

                    {/* Como funciona */}
                    <div className="p-5 mb-3" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Como ganhar mais</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                          { icon: ShoppingBag, title: "Cada compra", desc: "1 pt a cada R$ 10 gastos" },
                          { icon: Star, title: "Avaliar produtos", desc: "+5 pts por avaliação" },
                          { icon: Share2, title: "Indicar amigos", desc: "+50 pts quando o amigo compra" },
                        ].map((item) => (
                          <div key={item.title} className="flex items-start gap-2.5 p-3" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)" }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--well)", border: "1px solid var(--edge-subtle)" }}>
                              <item.icon size={13} style={{ color: "var(--primary)" }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                              <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Histórico */}
                    <div className="overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: isDark ? "1px solid rgba(var(--foreground-rgb), 0.04)" : "1px solid rgba(0,0,0,0.04)" }}>
                        <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Histórico</p>
                        <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{history.length} {history.length === 1 ? "transação" : "transações"}</p>
                      </div>
                      {history.length === 0 ? (
                        <div className="text-center py-12 px-6">
                          <PcyesCoin size={40} />
                          <p className="text-foreground/55 mt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Nenhuma transação ainda</p>
                        </div>
                      ) : (
                        <div>
                          {history.map((tx, idx) => {
                            const isPositive = tx.amount > 0;
                            const txDate = new Date(tx.date);
                            const txTypeMap = {
                              earn: { label: "Ganhou", color: "text-green-500" },
                              bonus: { label: "Bônus", color: "text-yellow-500" },
                              spend: { label: "Resgatou", color: "text-foreground/65" },
                              expire: { label: "Expirou", color: "text-red-400" },
                            };
                            const txStyle = txTypeMap[tx.type];
                            return (
                              <div key={tx.id} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: idx > 0 ? (isDark ? "1px solid rgba(var(--foreground-rgb), 0.03)" : "1px solid rgba(0,0,0,0.03)") : undefined }}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isPositive ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.08)" }}>
                                  {isPositive ? <Sparkles size={13} className="text-green-500" /> : <Receipt size={13} className="text-foreground/70" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-foreground truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{tx.description}</p>
                                    <span className={`${txStyle.color} flex-shrink-0`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                      {txStyle.label}
                                    </span>
                                  </div>
                                  <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                    {txDate.toLocaleDateString("pt-BR")} · {txDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                    {tx.expiresAt && isPositive && ` · vence em ${new Date(tx.expiresAt).toLocaleDateString("pt-BR")}`}
                                  </p>
                                </div>
                                <p className={`flex-shrink-0 ${isPositive ? "text-green-500" : "text-foreground/65"}`} style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 700 }}>
                                  {isPositive ? "+" : ""}{tx.amount} <span style={{ fontSize: "var(--text-caption)", fontWeight: 600 }}>pts</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}

              {activeTab === "favorites" && (
                <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Favoritos</h2>
                    {favSubTab === "products" && favoriteProducts.length > 0 && (
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{favoriteProducts.length} {favoriteProducts.length === 1 ? "produto" : "produtos"}</p>
                    )}
                    {favSubTab === "setups" && savedBuilds.length > 0 && (
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{savedBuilds.length} {savedBuilds.length === 1 ? "kit salvo" : "kits salvos"}</p>
                    )}
                  </div>

                  <div className="mb-5 flex items-center gap-1.5 border-b border-foreground/8" role="tablist" aria-label="Sub-categorias de favoritos">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={favSubTab === "products"}
                      onClick={() => setFavSubTab("products")}
                      className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-all ${favSubTab === "products" ? "text-primary border-b-2 border-primary" : "text-foreground/50 border-b-2 border-transparent hover:text-foreground/80"}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "-1px" }}
                    >
                      <Heart size={13} /> Produtos
                      {favoriteProducts.length > 0 && (
                        <span className="ml-1 rounded-full bg-foreground/10 px-1.5 text-foreground/60 tabular-nums" style={{ fontSize: "var(--text-caption)", fontWeight: 700 }}>{favoriteProducts.length}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={favSubTab === "setups"}
                      onClick={() => setFavSubTab("setups")}
                      className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-all ${favSubTab === "setups" ? "text-primary border-b-2 border-primary" : "text-foreground/50 border-b-2 border-transparent hover:text-foreground/80"}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "-1px" }}
                    >
                      <Package size={13} /> Kits salvos
                      {savedBuilds.length > 0 && (
                        <span className="ml-1 rounded-full bg-foreground/[0.08] px-1.5 text-primary tabular-nums" style={{ fontSize: "var(--text-caption)", fontWeight: 700 }}>{savedBuilds.length}</span>
                      )}
                    </button>
                  </div>

                  {favSubTab === "setups" && (
                    <div>
                      {savedBuilds.length === 0 ? (
                        <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                          <Package size={28} className="text-foreground/30 mx-auto mb-4" />
                          <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum kit salvo ainda</p>
                          <p className="text-foreground/45 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Monte sua build e clique em "Salvar" para guardar aqui.</p>
                          <Link to="/monte-seu-kit" className="btn-tonante inline-block px-5 py-2.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}>Montar kit</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {savedBuilds.map((b) => (
                            <div key={b.id} className="overflow-hidden transition-all" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                              <div className="flex items-start justify-between gap-3 border-b border-foreground/[0.06] p-4">
                                <div className="min-w-0">
                                  <p className="uppercase text-foreground/40 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.18em", fontWeight: 700 }}>
                                    KIT TONANTE · {formatRelTime(b.savedAt)}
                                  </p>
                                  <h3 className="truncate text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "-0.01em" }}>{b.name}</h3>
                                  <p className="mt-1 text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{b.items.length} {b.items.length === 1 ? "peça" : "peças"}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => askConfirm({
                                    title: "Apagar kit",
                                    description: `Remover "${b.name}" dos seus kits salvos?`,
                                    confirmLabel: "Apagar",
                                    destructive: true,
                                    action: () => deleteSavedBuild(b.id),
                                  })}
                                  aria-label={`Apagar ${b.name}`}
                                  className="flex h-11 w-11 md:h-8 md:w-8 cursor-pointer items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <div className="space-y-1 p-3 max-h-[180px] overflow-y-auto">
                                {b.items.slice(0, 5).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2.5 rounded-md p-1.5">
                                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-foreground/[0.04]">
                                      {item.image && <img src={item.image} alt="" className="h-full w-full object-contain p-0.5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="uppercase text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.16em", fontWeight: 700 }}>{item.category}</p>
                                      <p className="truncate text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}>{item.name}</p>
                                    </div>
                                    <span className="shrink-0 tabular-nums text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>{formatBRLBuild(item.price)}</span>
                                  </div>
                                ))}
                                {b.items.length > 5 && (
                                  <p className="px-1.5 pt-1 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>+{b.items.length - 5} {b.items.length - 5 === 1 ? "peça" : "peças"}</p>
                                )}
                              </div>
                              <div className="flex items-center justify-between border-t border-foreground/[0.06] bg-foreground/[0.015] px-4 py-3">
                                <div>
                                  <p className="uppercase text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.18em", fontWeight: 700 }}>Total</p>
                                  <p className="text-foreground tabular-nums" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "-0.01em" }}>{formatBRLBuild(b.total)}</p>
                                </div>
                                <Link
                                  to="/monte-seu-kit"
                                  className="btn-tonante inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-2 md:min-h-0"
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                                >
                                  Abrir setup <ChevronRight size={13} />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {favSubTab === "products" && (
                  <>
                  {favoriteProducts.length === 0 ? (
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <Heart size={28} className="text-foreground/30 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum favorito ainda</p>
                      <p className="text-foreground/45 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Clique no coração nos produtos para salvá-los aqui.</p>
                      <Link to="/produtos" className="inline-block px-4 py-2 btn-tonante transition-all" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>Ver produtos</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {favoriteProducts.map((product) => {
                        const hasDiscount = !!product.oldPrice;
                        const inStock = product.inStock !== false;
                        return (
                          <div key={product.id} className="group overflow-hidden transition-all" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                            <Link to={`/produto/${product.id}`} className="deal-card-img block relative aspect-square overflow-hidden transition-all duration-300" style={{ background: "var(--gradient-photo)" }}>
                              <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className={`w-full h-full object-contain p-5 group-hover:scale-[1.05] transition-transform duration-500 relative z-[1] ${!inStock ? "opacity-50" : ""}`} />
                              {/* Badges sobre imagem */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {hasDiscount && (
                                  <span className="flex items-center gap-0.5 px-2 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.04em" }}>
                                    <Sparkles size={8} /> OFERTA
                                  </span>
                                )}
                                {!inStock && (
                                  <span className="px-1.5 py-0.5 bg-foreground/70 text-background" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.04em" }}>
                                    SEM ESTOQUE
                                  </span>
                                )}
                              </div>
                              <button onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                                className="absolute top-2 right-2 w-11 h-11 md:w-7 md:h-7 flex items-center justify-center text-primary hover:bg-black/40 transition-all backdrop-blur-md cursor-pointer"
                                style={{ borderRadius: "var(--radius-card)", background: "rgba(0,0,0,0.3)" }}
                              ><Heart size={12} className="fill-primary" /></button>
                            </Link>
                            <div className="p-3">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1">
                                  <Star size={9} className="fill-primary text-primary" />
                                  <span className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{product.rating}</span>
                                </div>
                                {inStock && (
                                  <span className="flex items-center gap-1 text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.04em" }}>
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                                    </span>
                                    EM ESTOQUE
                                  </span>
                                )}
                              </div>
                              <p className="text-foreground truncate mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>{product.name}</p>
                              <div className="flex items-baseline gap-1.5 mb-3">
                                <p className="text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>{product.price}</p>
                                {hasDiscount && (
                                  <p className="text-foreground/35 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{product.oldPrice}</p>
                                )}
                              </div>
                              <button onClick={() => addItem(product)}
                                disabled={!inStock}
                                className={`w-full min-h-[44px] md:min-h-0 py-1.5 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer "btn-tonante"`}
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                              ><ShoppingBag size={11} /> {inStock ? "Comprar" : "Avisar quando voltar"}</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  </>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Endereços</h2>
                    <button onClick={() => setAddressModal({ open: true, editing: null })} className="btn-tonante inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 px-5 py-2.5 md:min-h-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}><MapPin size={14} /> Adicionar endereço</button>
                  </div>
                  {user.addresses.length === 0 ? (
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <MapPin size={28} className="text-foreground/35 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum endereço cadastrado</p>
                      <p className="text-foreground/40 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Adicione um endereço para receber seus pedidos.</p>
                      <button onClick={() => setAddressModal({ open: true, editing: null })} className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 btn-tonante transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar endereço</button>
                    </div>
                  ) : (
                  <div className="space-y-3">
                    {user.addresses.map((a) => (
                      <div key={a.id} style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                        <div className="flex items-start gap-3 min-w-0 flex-1 p-5">
                          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--well)", border: "1px solid var(--edge-subtle)" }}>
                            <MapPin size={15} style={{ color: "var(--ink-muted)" }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{a.label}</span>
                              {a.isDefault && <span className="flex items-center gap-1 px-2 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}><Check size={9} /> PADRÃO</span>}
                            </div>
                            <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: "1.55" }}>
                              {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""} · {a.neighborhood}<br />{a.city}/{a.state}
                            </p>
                            <p className="mt-1.5 text-foreground/50 font-mono" style={{ fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "0.04em" }}>
                              CEP {a.cep}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--edge-subtle)" }}>
                          {!a.isDefault && (
                            <button onClick={() => setDefaultAddress(a.id)} className="btn-tonante-ghost inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 px-4 md:min-h-0 md:py-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                              <Check size={13} /> Tornar padrão
                            </button>
                          )}
                          <button onClick={() => setAddressModal({ open: true, editing: a })} className="btn-tonante-ghost inline-flex min-h-[40px] cursor-pointer items-center px-4 md:min-h-0 md:py-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                            Editar
                          </button>
                          {user.addresses.length > 1 && (
                            <button onClick={() => askConfirm({
                              title: `Remover endereço "${a.label}"?`,
                              description: `${a.street}, ${a.number} · ${a.city}/${a.state}. Essa ação não pode ser desfeita.`,
                              confirmLabel: "Remover endereço",
                              destructive: true,
                              action: () => removeAddress(a.id),
                            })} className="inline-flex min-h-[40px] cursor-pointer items-center px-4 transition-colors md:min-h-0 md:py-2" style={{ borderRadius: "var(--radius-pill)", color: "#b3261e", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Dados Pessoais</h2>
                    {user.updatedAt && (
                      <p className="text-foreground/55 flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                        <Clock size={11} /> Atualizado em {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>

                  {/* Aniversário destaque se próximo */}
                  {(() => {
                    if (!user.birthday) return null;
                    const today = new Date(2026, 4, 18);
                    const bday = new Date(user.birthday);
                    const thisBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
                    if (thisBday < today) thisBday.setFullYear(today.getFullYear() + 1);
                    const daysToBday = Math.ceil((thisBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysToBday > 30) return null;
                    return (
                      <div className="flex items-center gap-3 p-4 mb-3" style={{ borderRadius: "var(--radius-card-lg)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                        <div className="w-10 h-10 rounded-full bg-foreground/[0.08] flex items-center justify-center flex-shrink-0">
                          <Sparkles size={16} className="text-primary fill-primary/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>Seu aniversário tá chegando 🎂</p>
                          <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            {daysToBday === 0 ? "É hoje!" : `Em ${daysToBday} ${daysToBday === 1 ? "dia" : "dias"} · Tem cupom esperando você`}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-5" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-foreground/60 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Nome completo</label>
                        <FieldInput required value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="profile-field placeholder:text-foreground/40 focus:border-primary/40 transition-all" />
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-foreground/60 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                          E-mail
                          <Check size={11} className="text-green-500" />
                          <span className="text-green-500" style={{ letterSpacing: "0.08em" }}>verificado</span>
                        </label>
                        <FieldInput required type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="profile-field placeholder:text-foreground/40 focus:border-primary/40 transition-all" />
                      </div>
                      <div>
                        <label className="block text-foreground/60 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Telefone</label>
                        <FieldInput type="tel" value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className="profile-field placeholder:text-foreground/40 focus:border-primary/40 transition-all" />
                      </div>
                      <div>
                        <label className="block text-foreground/60 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Data de nascimento</label>
                        <FieldInput type="date" value={user.birthday || ""} onChange={(e) => updateUser({ birthday: e.target.value })} className="profile-field placeholder:text-foreground/40 focus:border-primary/40 transition-all" style={{ colorScheme: isDark ? "dark" : "light" }} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-1.5 text-foreground/60 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                          CPF
                          <Shield size={11} className="text-foreground/45" />
                          <span className="text-foreground/45" style={{ letterSpacing: "0.06em" }}>não editável</span>
                        </label>
                        <input value={user.cpf} disabled className="w-full text-foreground placeholder:text-foreground/40 focus:outline-none transition-all opacity-60 cursor-not-allowed profile-field" style={{ padding: "11px 13px", borderRadius: "var(--radius-card-lg)", border: "1px solid var(--edge-subtle)", background: "var(--well)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 500 }} />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                      <button onClick={() => updateUser({ updatedAt: new Date().toISOString() })} className="btn-tonante w-full min-h-[44px] cursor-pointer px-6 py-2.5 md:w-auto md:min-h-0"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}
                      >Salvar alterações</button>
                      <button className="btn-tonante-ghost w-full min-h-[44px] cursor-pointer px-5 py-2.5 md:w-auto md:min-h-0"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}
                      >Cancelar</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "cards" && (
                <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Cartões salvos</h2>
                    <button onClick={() => setCardModal({ open: true, editing: null })} className="btn-tonante inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 px-5 py-2.5 md:min-h-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 600 }}><CreditCard size={14} /> Adicionar cartão</button>
                  </div>
                  {user.cards.length === 0 ? (
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                      <CreditCard size={28} className="text-foreground/35 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum cartão salvo</p>
                      <p className="text-foreground/40 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Adicione para checkout mais rápido. Seus dados ficam criptografados.</p>
                      <button onClick={() => setCardModal({ open: true, editing: null })} className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 btn-tonante transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar cartão</button>
                    </div>
                  ) : (
                  <div className="space-y-3">
                    {user.cards.map((c) => {
                      const [mm, yy] = c.expiry.split("/").map((s) => parseInt(s, 10));
                      const expDate = new Date(2000 + (yy ?? 0), (mm ?? 1) - 1, 1);
                      const today = new Date(2026, 4, 18);
                      const monthsLeft = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());
                      const isExpired = monthsLeft < 0;
                      const isExpiringSoon = !isExpired && monthsLeft <= 3;
                      return (
                        <div key={c.id} style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}>
                         <div className="flex items-center gap-4 p-5">
                          <CardBrandLogo brand={c.brand} className="flex-shrink-0" style={{ width: "44px", height: "28px", borderRadius: "var(--radius)", overflow: "hidden", display: "block", objectFit: "cover" }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <p className="text-foreground font-mono" style={{ fontSize: "var(--text-sm)", fontWeight: 600, letterSpacing: "0.05em" }}>•••• {c.last4}</p>
                              {c.isDefault && <span className="flex items-center gap-1 px-2 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}><Check size={9} /> PADRÃO</span>}
                              {isExpired && <span className="px-2 py-0.5 bg-red-500/15 text-red-400 flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><AlertCircle size={9} /> VENCIDO</span>}
                              {isExpiringSoon && <span className="px-2 py-0.5 bg-yellow-500/15 text-yellow-500 flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><AlertCircle size={9} /> VENCE EM BREVE</span>}
                            </div>
                            <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{c.name} · Validade {c.expiry}</p>
                          </div>
                         </div>
                          <div className="flex flex-wrap items-center gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--edge-subtle)" }}>
                            {!c.isDefault && (
                              <button onClick={() => setDefaultCard(c.id)} className="btn-tonante-ghost inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 px-4 md:min-h-0 md:py-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                                <Check size={13} /> Tornar padrão
                              </button>
                            )}
                            <button onClick={() => setCardModal({ open: true, editing: c })} className="btn-tonante-ghost inline-flex min-h-[40px] cursor-pointer items-center px-4 md:min-h-0 md:py-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                              Editar
                            </button>
                            <button onClick={() => askConfirm({
                              title: `Remover cartão •••• ${c.last4}?`,
                              description: `${c.brand || "Cartão"} · ${c.name} · Validade ${c.expiry}. Você precisará adicioná-lo de novo se quiser usar.`,
                              confirmLabel: "Remover cartão",
                              destructive: true,
                              action: () => removeCard(c.id),
                            })} className="inline-flex min-h-[40px] cursor-pointer items-center px-4 transition-colors md:min-h-0 md:py-2" style={{ borderRadius: "var(--radius-pill)", color: "#b3261e", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: 600 }}>
                              Remover
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </motion.div>
              )}

              {activeTab === "help" && (
                <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Ajuda e Suporte</h2>

                  {/* Contato direto destaque */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="group cursor-pointer flex items-center gap-3 p-4 transition-all hover:bg-white/[0.025] profile-card"
                      style={{ borderRadius: "var(--radius-card-xl)", background: isDark ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.18)" }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/12">
                        <Share2 size={15} className="text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>WhatsApp</p>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                          </span>
                          <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Online</span>
                        </div>
                        <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Resposta em ~2 minutos</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/35 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
                    </a>
                    <button className="group cursor-pointer flex items-center gap-3 p-4 transition-all hover:bg-white/[0.025] profile-card text-left"
                      style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(17, 17, 17, 0.08)" }}>
                        <User size={15} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>Chat ao vivo</p>
                        <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Seg-Sex 9h-22h · Sáb 10h-18h</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: "Central de Ajuda", desc: "FAQ, tutoriais e respostas rápidas", icon: HelpCircle },
                      { title: "Política de Trocas e Devolução", desc: "Você tem 7 dias após receber", icon: Receipt },
                      { title: "Rastrear Pedido", desc: "Acompanhe sua entrega em tempo real", icon: Truck },
                      { title: "E-mail", desc: "suporte@tonante.com.br · resposta em até 24h", icon: Info },
                    ].map((item) => (
                      <button key={item.title} className="group cursor-pointer w-full flex items-center gap-4 p-4 transition-all hover:bg-white/[0.025] profile-card"
                        style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(17, 17, 17, 0.08)" }}>
                          <item.icon size={15} className="text-primary" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-foreground mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                          <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{item.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Privacidade e Segurança</h2>

                  {/* 2FA toggle destaque */}
                  <div className="flex items-center gap-4 p-4 mb-3" style={{ borderRadius: "var(--radius-card-xl)", background: isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.18)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/12">
                      <Shield size={15} className="text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>Autenticação em 2 fatores</p>
                        <span className="px-2 py-0.5 bg-yellow-500/15 text-yellow-500" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}>RECOMENDADO</span>
                      </div>
                      <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Adicione uma camada extra de segurança ao seu login</p>
                    </div>
                    <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-3.5 py-1.5 bg-green-500 text-ink-strong hover:brightness-110 transition-all cursor-pointer flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Ativar</button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: "Baixar meus dados", desc: "Exporte todas as suas informações (LGPD)", icon: Receipt, danger: false },
                      { title: "Dispositivos conectados", desc: "Veja e gerencie sessões ativas", icon: User, danger: false },
                      { title: "Política de Privacidade", desc: "Como tratamos seus dados pessoais", icon: Shield, danger: false },
                      { title: "Cookies", desc: "Gerencie suas preferências de cookies", icon: Info, danger: false },
                      { title: "Excluir minha conta", desc: "Solicite a remoção permanente dos seus dados", icon: XIcon, danger: true },
                    ].map((item) => (
                      <button key={item.title} className="group cursor-pointer w-full flex items-center gap-4 p-4 transition-all hover:bg-white/[0.025] profile-card"
                        style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface)", border: "1px solid var(--edge-subtle)" }}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.danger ? "rgba(239,68,68,0.08)" : "rgba(17, 17, 17, 0.08)" }}>
                          <item.icon size={15} className={item.danger ? "text-red-400" : "text-primary"} />
                        </div>
                        <div className="text-left flex-1">
                          <p className={`mb-0.5 ${item.danger ? "text-red-400" : "text-foreground"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                          <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{item.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmState.open}
        onClose={closeConfirm}
        onConfirm={() => confirmState.action?.()}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel={confirmState.confirmLabel}
        destructive={confirmState.destructive}
      />
      {(() => {
        const orderToReview = reviewOrderId ? user.orders.find((o) => o.id === reviewOrderId) : null;
        if (!orderToReview) return null;
        return (
          <ReviewModal
            open={!!reviewOrderId}
            onClose={() => setReviewOrderId(null)}
            orderId={orderToReview.id}
            items={orderToReview.items.map((it) => ({ name: it.name, image: it.image, price: it.price }))}
            onSubmit={(review) => {
              setReviewedOrders((prev) => new Set(prev).add(orderToReview.id));
              const base = orderToReview.items.length * 5;
              const mediaBonus = review.media.length > 0 ? 10 : 0;
              const commentBonus = review.comment.trim().length >= 20 ? 5 : 0;
              const earned = base + mediaBonus + commentBonus;
              updateUser({
                pcyesPoints: (user.pcyesPoints ?? 0) + earned,
                pcyesPointsHistory: [
                  { id: `tx-review-${orderToReview.id}-${Date.now()}`, date: new Date().toISOString().replace("T", " ").slice(0, 16), type: "bonus", amount: earned, description: `Avaliação do pedido ${orderToReview.id}${review.media.length > 0 ? " com mídia" : ""}` },
                  ...(user.pcyesPointsHistory ?? []),
                ],
              });
            }}
          />
        );
      })()}
      <Footer />

      {/* ─── Modais ─── */}
      <AddressFormModal
        open={addressModal.open}
        initial={addressModal.editing}
        onClose={() => setAddressModal({ open: false, editing: null })}
        onSubmit={(data) => {
          if (addressModal.editing) updateAddress(addressModal.editing.id, data);
          else addAddress(data);
        }}
      />
      <CardFormModal
        open={cardModal.open}
        initial={cardModal.editing}
        onClose={() => setCardModal({ open: false, editing: null })}
        onSubmit={(data) => {
          if (cardModal.editing) updateCard(cardModal.editing.id, data);
          else addCard(data);
        }}
      />
    </div>
  );
}
