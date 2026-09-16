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
          className="absolute top-[20px] left-[10%] h-[2px] bg-primary transition-all duration-1000 block z-0"
          style={{ width: `${(currentIndex / 3) * 80}%` }} 
        />
      )}
      
      {steps.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isCancelled = status === "cancelled";
        
        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
              isActive ? (isCancelled ? "bg-red-500 text-ink-strong" : "bg-primary text-ink-strong shadow-lg shadow-primary/20") 
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
  { key: "points",    icon: Sparkles,        label: "PCYES Points",    short: "Points"      },
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

const TIERS = [
  { level: 1, name: "Recruta",  minOrders: 0,  benefit: "Cupom 5% boas-vindas" },
  { level: 2, name: "Soldado",  minOrders: 2,  benefit: "Frete grátis acima de R$199" },
  { level: 3, name: "Veterano", minOrders: 5,  benefit: "Acesso antecipado a pré-vendas" },
  { level: 4, name: "Elite",    minOrders: 10, benefit: "Cashback 2% + brindes exclusivos" },
  { level: 5, name: "Lendário", minOrders: 20, benefit: "Concierge dedicado + early access GPUs" },
];

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
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <User size={40} className="text-foreground/30 mx-auto mb-6" />
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-light)" }}>
            Acesse sua conta
          </h2>
          <p className="text-foreground/50 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.7" }}>
            Faça login para acessar seus pedidos, favoritos e informações.
          </p>
          <button onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}
          >Entrar na minha conta</button>
        </div>
      </div>
    );
  }

  const favoriteProducts = getVisibleCatalogProducts(allProducts).filter((p) => favorites.has(p.id));

  const activeOrders = user.orders.filter((o) => o.status === "processing" || o.status === "shipped").length;
  const tier = getTier(user.orders.length);

  return (
    <div className="">
      {/* Header */}
      <div className="px-5 md:px-8 pt-9 pb-8" style={{ background: "var(--surface-1)" }}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-8 md:gap-8">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-[78px] h-[78px] rounded-full bg-foreground/[0.06] flex items-center justify-center border border-foreground/10" style={{ boxShadow: "0 0 0 4px rgba(17, 17, 17, 0.04)" }}>
                <span className="text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: 600 }}>
                  {user.name.charAt(0)}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-primary text-primary-foreground flex items-center gap-0.5" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.06em", boxShadow: "0 4px 12px rgba(200, 120, 0,0.4)" }}>
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
            <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "linear-gradient(135deg, rgba(250,204,21,0.10) 0%, rgba(180,83,9,0.04) 100%)" : "linear-gradient(135deg, rgba(250,204,21,0.16) 0%, rgba(180,83,9,0.06) 100%)", border: "1px solid rgba(250,204,21,0.28)" }}>
              <PcyesCoin size={28} />
              <div>
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#facc15" }}>PCYES Points</p>
                <p style={{ fontFamily: "var(--font-family-figtree)", fontWeight: 700, lineHeight: 1.1, color: "#facc15", textShadow: "0 0 18px rgba(250,204,21,0.35)", fontSize: "var(--text-lg)" }} className="sm:text-[var(--text-xl)]">
                  {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 py-10">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10">
          {/* Sidebar — vertical on desktop, horizontal scrollable tab bar on mobile */}
          <aside className="w-full lg:w-[230px] flex-shrink-0">
            {/* Mobile horizontal scroll: CSS mask handles the right-edge fade
                so it follows the viewport regardless of container padding.
                Desktop reverts to a vertical sidebar via `lg:` resets.    */}
            <nav
              className="profile-tabs flex flex-row gap-2 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 lg:block lg:space-y-0.5 lg:overflow-visible [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] lg:[mask-image:none]"
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
                    borderRadius: "var(--radius-card-sm)",
                    background: activeTab === tab.key
                      ? (isDark ? "linear-gradient(90deg, rgba(17, 17, 17, 0.08) 0%, rgba(17, 17, 17, 0.04) 100%)" : "linear-gradient(90deg, rgba(17, 17, 17, 0.08) 0%, rgba(17, 17, 17, 0.02) 100%)")
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
                style={{ borderRadius: "var(--radius-card-sm)", fontFamily: "var(--font-family-inter)", fontWeight: 500 }}
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
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Visão Geral</h2>

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
                              ? "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(var(--foreground-rgb), 0.02) 60%)"
                              : "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(0,0,0,0.015) 60%)",
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
                              Que tal um upgrade no setup?
                            </p>
                          </div>
                          <Link to="/produtos" className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
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
                    const eta = nextOrder.status === "shipped" ? "Chega quinta, 18/Abr · em 3 dias" : "Previsão: 22/Abr · em 7 dias";
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
                              <div key={i} className="w-12 h-12 flex-shrink-0 overflow-hidden border border-foreground/8" style={{ borderRadius: "var(--radius-card-sm)", background: "var(--surface-1)" }}>
                                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {nextOrder.items.length > 3 && (
                              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-foreground/60" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
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
                              className="absolute top-[11px] left-[6%] h-[2px] bg-primary transition-all duration-1000 z-0"
                              style={{ width: `${(stageIdx / 3) * 88}%` }}
                            />
                            {stages.map((stg, idx) => {
                              const isActive = idx <= stageIdx;
                              const isCurrent = idx === stageIdx;
                              return (
                                <div key={stg.key} className="flex flex-col items-center flex-1 relative z-10">
                                  <div className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 mb-1.5 ${
                                    isActive ? "bg-primary text-ink-strong" : "bg-foreground/8 text-foreground/30"
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
                          <div className="px-5 py-3 border-t border-foreground/6 flex items-center gap-2" style={{ background: isDark ? "rgba(var(--foreground-rgb), 0.015)" : "rgba(0,0,0,0.01)" }}>
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
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[44px] md:min-h-0 gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            <Truck size={13} /> Rastrear pedido
                          </button>
                          <button
                            onClick={() => setProfileTab("help")}
                            className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all cursor-pointer"
                            style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                          >
                            <HelpCircle size={13} /> Ajuda
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card Tier / Benefícios + Missões */}
                  {(() => {
                    const missions = [
                      { done: !!user.phone, label: "Adicionar telefone", action: () => setProfileTab("data") },
                      { done: !!user.birthday, label: "Cadastrar data de nascimento", action: () => setProfileTab("data") },
                      { done: user.addresses.length > 0, label: "Cadastrar endereço de entrega", action: () => setProfileTab("addresses") },
                      { done: user.cards.length > 0, label: "Salvar cartão para checkout rápido", action: () => setProfileTab("cards") },
                      ...(user.orders.filter((o) => o.status === "delivered").length > 0
                        ? [{ done: false, label: "Avaliar pedidos entregues", action: () => setProfileTab("orders") }]
                        : []),
                    ];
                    const missionsDone = missions.filter((m) => m.done).length;
                    const missionsPending = missions.filter((m) => !m.done);
                    const missionBoost = missionsDone * 0.5;
                    const effectiveOrders = user.orders.length + missionBoost;
                    const dynamicTier = getTier(effectiveOrders);

                    return (
                  <div className="mb-3 overflow-hidden" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                    {/* Título da seção (contextualiza o card pra novos usuários) */}
                    <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3" style={{ borderBottom: isDark ? "1px solid rgba(var(--foreground-rgb), 0.04)" : "1px solid rgba(0,0,0,0.04)" }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                          Seu nível PCYES
                        </p>
                        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "rgba(56,189,248,0.85)", fontWeight: 600 }}>
                          · Comprando e completando missões você sobe
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3 px-5 pt-4 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(56,189,248,0.12)" }}>
                          <Sparkles size={16} style={{ color: "#38bdf8", fill: "rgba(56,189,248,0.2)" }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600 }}>{dynamicTier.current.name}</span>
                            <span className="px-2 py-0.5 text-ink-strong" style={{ borderRadius: "var(--radius-pill)", background: "linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.08em" }}>NV. {dynamicTier.current.level}</span>
                          </div>
                          <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            {dynamicTier.next
                              ? `${dynamicTier.ordersToNext.toFixed(1).replace(".0", "")} ${dynamicTier.ordersToNext === 1 ? "ponto" : "pontos"} para o ${dynamicTier.next.name}`
                              : "Você atingiu o nível máximo!"}
                          </p>
                        </div>
                      </div>
                      {dynamicTier.next && (
                        <div className="text-right">
                          <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Próximo</p>
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>{dynamicTier.next.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress bar XP (cyan/azul, não compete com primary nem com points dourados) */}
                    <div className="px-5 pb-4">
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: isDark ? "rgba(var(--foreground-rgb), 0.06)" : "rgba(0,0,0,0.06)" }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(dynamicTier.progress, dynamicTier.next ? 0.22 : 1) * 100}%`, background: "linear-gradient(90deg, #0ea5e9 0%, #38bdf8 50%, #67e8f9 100%)", boxShadow: "0 0 10px rgba(56,189,248,0.45)" }} />
                      </div>
                      <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                        {user.orders.length} {user.orders.length === 1 ? "pedido" : "pedidos"} · {missionsDone} {missionsDone === 1 ? "missão" : "missões"} concluída{missionsDone === 1 ? "" : "s"}
                        {missionBoost > 0 && <span style={{ color: "#38bdf8" }}> · +{missionBoost} XP de bônus</span>}
                      </p>
                    </div>

                    {/* Missões pendentes — completar acelera o nível */}
                    {missionsPending.length > 0 && (
                      <div className="px-5 pb-4">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Missões para avançar</p>
                          <span className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            {missionsDone}/{missions.length} · +0.5 XP cada
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {missionsPending.slice(0, 3).map((task, i) => (
                            <button key={i} onClick={task.action}
                              className="group/task cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] md:min-h-0 transition-all hover:bg-white/[0.025]"
                              style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.015)" : "rgba(0,0,0,0.01)", border: "1px solid rgba(56,189,248,0.10)" }}
                            >
                              <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors group-hover/task:border-sky-400" style={{ borderColor: "rgba(56,189,248,0.4)" }} />
                              <p className="text-foreground/80 flex-1 text-left" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 500 }}>{task.label}</p>
                              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.06em", color: "#38bdf8" }}>+0.5 XP</span>
                              <ChevronRight size={13} className="text-foreground/35 group-hover/task:text-sky-400 group-hover/task:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefícios desbloqueados / próximos - lista flat */}
                    <div className="px-5 pb-5">
                      <p className="text-foreground/65 mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        Benefícios
                      </p>
                      <div className="space-y-1">
                        {TIERS.map((t) => {
                          const unlocked = user.orders.length >= t.minOrders;
                          const isCurrent = t.level === dynamicTier.current.level;
                          return (
                            <div key={t.level} className="flex items-center gap-2.5 py-1.5">
                              {unlocked ? (
                                <Check size={13} className="text-green-500 flex-shrink-0" />
                              ) : (
                                <div className="w-[13px] h-[13px] rounded-full border border-foreground/25 flex-shrink-0" />
                              )}
                              <p className={`${unlocked ? "text-foreground" : "text-foreground/35"} flex-1 min-w-0`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: isCurrent ? 600 : 500 }}>
                                {t.benefit}
                              </p>
                              <span className={`${unlocked ? "text-green-500" : "text-foreground/30"} flex-shrink-0`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "0.04em" }}>
                                {unlocked ? t.name : `${t.name} · ${t.minOrders}+`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Callout PCYES Points */}
                    {(user.pcyesPoints ?? 0) > 0 && (
                      <button onClick={() => setProfileTab("points")}
                        className="group cursor-pointer w-full flex items-center gap-3 px-5 py-3 transition-all hover:brightness-110"
                        style={{ borderTop: "1px solid rgba(250,204,21,0.18)", background: "linear-gradient(90deg, rgba(250,204,21,0.06) 0%, rgba(180,83,9,0.02) 100%)" }}
                      >
                        <PcyesCoin size={22} />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                            Você tem <span style={{ color: "#facc15" }}>{(user.pcyesPoints ?? 0).toLocaleString("pt-BR")} pts</span> para usar no próximo pedido
                          </p>
                          <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            Vale R$ {((user.pcyesPoints ?? 0) * 0.1).toFixed(2).replace(".", ",")} em desconto
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-foreground/40 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}
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
                        borderRadius: "var(--radius-card-sm)",
                        background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)",
                        border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)",
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
                      <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>{user.orders.length} pedidos</p>
                      <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{activeOrders > 0 ? `${activeOrders} em andamento` : "Todos entregues"}</p>
                    </button>

                    {/* Favoritos */}
                    <button
                      onClick={() => setProfileTab("favorites")}
                      className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.025] profile-card"
                      style={{
                        borderRadius: "var(--radius-card-sm)",
                        background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)",
                        border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)",
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
                      <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>{favoriteProducts.length} {favoriteProducts.length === 1 ? "produto" : "produtos"}</p>
                      <p className="text-foreground/60 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>No seu stash</p>
                    </button>

                    {/* Endereço padrão */}
                    {user.addresses[0] && (
                      <button
                        onClick={() => setProfileTab("addresses")}
                        className="group cursor-pointer text-left p-5 transition-all hover:bg-white/[0.025] profile-card"
                        style={{
                          borderRadius: "var(--radius-card-sm)",
                          background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)",
                          border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)",
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
                            borderRadius: "var(--radius-card-sm)",
                            background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)",
                            border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)",
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

                    {/* PCYES Points card no grid */}
                    {(user.pcyesPoints ?? 0) > 0 && (
                      <button onClick={() => setProfileTab("points")}
                        className="group cursor-pointer text-left p-5 transition-all relative overflow-hidden md:col-span-2"
                        style={{
                          borderRadius: "var(--radius-card-sm)",
                          background: "linear-gradient(135deg, rgba(250,204,21,0.08) 0%, rgba(180,83,9,0.04) 50%, rgba(17, 17, 17, 0.02) 100%)",
                          border: "1px solid rgba(250,204,21,0.28)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <PcyesCoin size={44} />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#facc15" }}>PCYES Points</p>
                            <div className="flex items-baseline gap-2">
                              <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 700, color: "#facc15", textShadow: "0 0 18px rgba(250,204,21,0.4)" }}>
                                {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                              </p>
                              <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                = R$ {((user.pcyesPoints ?? 0) * 0.1).toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                            <p className="text-foreground/60 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Use no próximo pedido · Ver histórico e como ganhar mais</p>
                          </div>
                          <ChevronRight size={16} className="text-foreground/40 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Atalhos rápidos */}
                  <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-5" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(17, 17, 17, 0.04)" : "rgba(17, 17, 17, 0.03)", border: "1px solid rgba(17, 17, 17, 0.08)" }}>
                    <div className="flex items-center gap-3">
                      <Sparkles size={18} className="text-primary" />
                      <div>
                        <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                          Próxima missão
                        </p>
                        <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                          Upgrades sugeridos baseado no seu setup atual
                        </p>
                      </div>
                    </div>
                    <Link to="/produtos" className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>
                      Ver produtos
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {!selectedOrderId ? (
                    <>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
                        <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Meus Pedidos</h2>
                        <div className="flex flex-wrap gap-2">
                          <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground hover:text-foreground transition-colors text-[var(--text-caption)] cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontWeight: 600 }}>Todos</button>
                          <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/60 hover:text-foreground/80 transition-colors text-[var(--text-caption)] cursor-pointer" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontWeight: 600 }}>Em andamento</button>
                          <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/60 hover:text-foreground/80 transition-colors text-[var(--text-caption)] cursor-pointer" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontWeight: 600 }}>Entregues</button>
                        </div>
                      </div>
                      {user.orders.length === 0 ? (
                        <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                          <Package size={28} className="text-foreground/35 mx-auto mb-4" />
                          <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum pedido ainda</p>
                          <p className="text-foreground/40 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Quando você fizer um pedido, ele aparece aqui.</p>
                          <Link to="/produtos" className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Explorar produtos</Link>
                        </div>
                      ) : (
                      <div className="space-y-3">
                        {user.orders.map((order) => {
                          const s = STATUS_MAP[order.status];
                          const datePtBr = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
                          const lastEvent = order.history?.[0];
                          const isDelivered = order.status === "delivered";
                          const isShipped = order.status === "shipped";
                          const isProcessing = order.status === "processing";
                          const isCancelled = order.status === "cancelled";
                          const deliveredDate = isDelivered ? datePtBr(lastEvent?.date.split(" ")[0] || order.date) : null;
                          const returnDeadline = isDelivered ? datePtBr(new Date(new Date(lastEvent?.date.split(" ")[0] || order.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) : null;
                          const statusLineColor = isDelivered ? "text-green-500" : isShipped ? "text-blue-400" : isProcessing ? "text-yellow-500" : "text-red-400";
                          const statusLineText = isDelivered
                            ? `Entregue em ${deliveredDate} · Devolução grátis até ${returnDeadline}`
                            : isShipped
                            ? `Chega quinta, 18/Abr · em 3 dias`
                            : isProcessing
                            ? `Preparando seu pedido · Previsão: 22/Abr`
                            : `Cancelado em ${datePtBr(lastEvent?.date.split(" ")[0] || order.date)}`;
                          const StatusLineIcon = isDelivered ? Check : isShipped ? Truck : isProcessing ? Clock : XIcon;
                          const firstItem = order.items[0];
                          const extraItems = order.items.length - 1;
                          const paymentShort = order.paymentMethod?.split(" (")[0] || "Cartão";
                          return (
                            <div key={order.id}
                              onClick={() => setSelectedOrderId(order.id)}
                              className="group order-card cursor-pointer relative overflow-hidden"
                              style={{
                                borderRadius: "var(--radius-card-sm)",
                                background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)",
                                border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)",
                              }}
                            >
                              {/* Header: identidade + status + total */}
                              <div className="flex flex-wrap items-center gap-3 px-4 pt-4 pb-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg} ${s.color}`}>
                                  <s.icon size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>Pedido {order.id}</p>
                                    <span className="text-foreground/40">·</span>
                                    <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                      {new Date(order.date).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <p className="text-foreground/50 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                    {order.items.length} {order.items.length === 1 ? "item" : "itens"} · {paymentShort}
                                  </p>
                                </div>
                                <span className={`px-2.5 py-1 flex-shrink-0 ${s.bg} ${s.color}`} style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                  {s.label}
                                </span>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 600 }}>{order.total}</p>
                                </div>
                              </div>

                              {/* Produto: thumb + nome inline */}
                              <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: isDark ? "1px solid rgba(var(--foreground-rgb), 0.04)" : "1px solid rgba(0,0,0,0.04)" }}>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <div className="w-14 h-14 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius-card-sm)", background: "var(--surface-1)" }}>
                                    <ImageWithFallback src={firstItem.image} alt={firstItem.name} className="w-full h-full object-cover" />
                                  </div>
                                  {order.items.slice(1, 3).map((item, i) => (
                                    <div key={i} className="w-10 h-10 overflow-hidden border border-foreground/5" style={{ borderRadius: "var(--radius-card)", background: "var(--surface-1)" }}>
                                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                  {extraItems > 2 && (
                                    <div className="w-10 h-10 flex items-center justify-center text-foreground/55" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                      +{extraItems - 2}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-foreground truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>
                                    {firstItem.name}
                                  </p>
                                  {extraItems > 0 && (
                                    <p className="text-foreground/55 mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>+ {extraItems} {extraItems === 1 ? "outro item" : "outros itens"}</p>
                                  )}
                                </div>
                              </div>

                              {/* Status line contextual */}
                              <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderTop: isDark ? "1px solid rgba(var(--foreground-rgb), 0.04)" : "1px solid rgba(0,0,0,0.04)", background: isDark ? "rgba(var(--foreground-rgb), 0.015)" : "rgba(0,0,0,0.01)" }}>
                                <StatusLineIcon size={13} className={`${statusLineColor} flex-shrink-0`} />
                                <p className={`${statusLineColor} truncate`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                  {statusLineText}
                                </p>
                              </div>

                              {/* CTAs contextuais */}
                              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 py-3" style={{ borderTop: isDark ? "1px solid rgba(var(--foreground-rgb), 0.04)" : "1px solid rgba(0,0,0,0.04)" }}>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {isDelivered && (
                                    <>
                                      <button onClick={(e) => { e.stopPropagation(); addItem({ ...firstItem, id: firstItem.name, price: firstItem.price, originalPrice: firstItem.price, category: "", brand: "", description: "", rating: 5, reviews: 0, images: [firstItem.image] } as any); }}
                                        className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer"
                                        style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                        <ShoppingBag size={12} /> Comprar de novo
                                      </button>
                                      {reviewedOrders.has(order.id) ? (
                                        <span className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 text-green-500"
                                          style={{ borderRadius: "var(--radius-card)", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.18)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                          <Check size={12} /> Avaliado
                                        </span>
                                      ) : (
                                        <button onClick={(e) => { e.stopPropagation(); setReviewOrderId(order.id); }}
                                          className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/70 hover:text-yellow-400 transition-all cursor-pointer"
                                          style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                          <Star size={12} /> Avaliar
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {isShipped && (
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                                      className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 text-blue-400 hover:brightness-110 transition-all cursor-pointer"
                                      style={{ borderRadius: "var(--radius-card)", background: "rgba(96,165,250,0.10)", border: "1px solid rgba(96,165,250,0.22)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                      <Truck size={12} /> Rastrear pedido
                                    </button>
                                  )}
                                  {isProcessing && (
                                    <button onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                      style={{ borderRadius: "var(--radius-card)", background: "rgba(239,68,68,0.06)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                      <XIcon size={12} /> Cancelar
                                    </button>
                                  )}
                                  {isCancelled && (
                                    <button onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 px-3 py-1.5 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer"
                                      style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                      <ShoppingBag size={12} /> Comprar de novo
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                                  className="inline-flex items-center gap-1 min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/70 hover:text-primary transition-all flex-shrink-0 cursor-pointer"
                                  style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                                >
                                  Ver detalhes <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      )}
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
                            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/80 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-caption)" }}>
                              <Receipt size={14} /> Nota Fiscal
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/80 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-caption)" }}>
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
                                        i === 0 ? "bg-primary" : "bg-foreground/10"
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
                            
                            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3" style={{ borderRadius: "var(--radius)" }}>
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
                      <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>PCYES Points</h2>
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>1 pt = R$ 0,10 · Use até 30% por pedido</p>
                    </div>

                    {/* Hero saldo */}
                    <div className="relative mb-3 overflow-hidden p-6" style={{ borderRadius: "var(--radius-card-md)", background: "linear-gradient(135deg, rgba(250,204,21,0.10) 0%, rgba(180,83,9,0.05) 50%, rgba(17, 17, 17, 0.03) 100%)", border: "1px solid rgba(250,204,21,0.28)" }}>
                      <div className="flex items-center gap-4 mb-4">
                        <PcyesCoin size={56} />
                        <div className="flex-1">
                          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#facc15" }}>Saldo disponível</p>
                          <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-h3)", fontWeight: 700, lineHeight: 1, color: "#facc15", textShadow: "0 0 24px rgba(250,204,21,0.4)" }}>
                            {(user.pcyesPoints ?? 0).toLocaleString("pt-BR")}
                          </p>
                          <p className="text-foreground/65 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            Equivale a <span className="text-foreground font-semibold">R$ {((user.pcyesPoints ?? 0) * 0.1).toFixed(2).replace(".", ",")}</span> em desconto
                          </p>
                        </div>
                      </div>

                      {nextExpiring && daysToExpire > 0 && daysToExpire <= 60 && (
                        <div className="flex items-center gap-2 p-3 mt-3" style={{ borderRadius: "var(--radius-card-sm)", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
                          <AlertCircle size={14} className="text-yellow-500 flex-shrink-0" />
                          <p className="text-yellow-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                            {nextExpiring.amount} pts vencem em {daysToExpire} {daysToExpire === 1 ? "dia" : "dias"} · {new Date(nextExpiring.expiresAt!).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      <div className="p-4" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Acumulado</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {totalEarned} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                      <div className="p-4" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Resgatado</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {totalSpent} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                      <div className="p-4 col-span-2 md:col-span-1" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                        <p className="text-foreground/55 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Próximo pedido pode usar até</p>
                        <p className="text-foreground flex items-baseline gap-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 600 }}>
                          {Math.min(user.pcyesPoints ?? 0, 480)} <span className="text-foreground/55" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>pts</span>
                        </p>
                      </div>
                    </div>

                    {/* Como funciona */}
                    <div className="p-5 mb-3" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Como ganhar mais</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                          { icon: ShoppingBag, title: "Cada compra", desc: "1 pt a cada R$ 10 gastos" },
                          { icon: Star, title: "Avaliar produtos", desc: "+5 pts por avaliação" },
                          { icon: Share2, title: "Indicar amigos", desc: "+50 pts quando o amigo compra" },
                        ].map((item) => (
                          <div key={item.title} className="flex items-start gap-2.5 p-3" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.015)" : "rgba(0,0,0,0.01)" }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(250,204,21,0.12)" }}>
                              <item.icon size={13} style={{ color: "#facc15" }} />
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
                    <div className="overflow-hidden" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
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
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Favoritos</h2>
                    {favSubTab === "products" && favoriteProducts.length > 0 && (
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{favoriteProducts.length} {favoriteProducts.length === 1 ? "produto" : "produtos"}</p>
                    )}
                    {favSubTab === "setups" && savedBuilds.length > 0 && (
                      <p className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{savedBuilds.length} {savedBuilds.length === 1 ? "setup salvo" : "setups salvos"}</p>
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
                      <Package size={13} /> Setups
                      {savedBuilds.length > 0 && (
                        <span className="ml-1 rounded-full bg-foreground/[0.08] px-1.5 text-primary tabular-nums" style={{ fontSize: "var(--text-caption)", fontWeight: 700 }}>{savedBuilds.length}</span>
                      )}
                    </button>
                  </div>

                  {favSubTab === "setups" && (
                    <div>
                      {savedBuilds.length === 0 ? (
                        <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                          <Package size={28} className="text-foreground/30 mx-auto mb-4" />
                          <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum setup salvo ainda</p>
                          <p className="text-foreground/45 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Monte sua build e clique em "Salvar" para guardar aqui.</p>
                          <Link to="/monte-seu-pc" className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>Montar PC</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {savedBuilds.map((b) => (
                            <div key={b.id} className="overflow-hidden transition-all" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                              <div className="flex items-start justify-between gap-3 border-b border-foreground/[0.06] p-4">
                                <div className="min-w-0">
                                  <p className="uppercase text-foreground/40 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.18em", fontWeight: 700 }}>
                                    SETUP PCYES · {formatRelTime(b.savedAt)}
                                  </p>
                                  <h3 className="truncate text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "-0.01em" }}>{b.name}</h3>
                                  <p className="mt-1 text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{b.items.length} {b.items.length === 1 ? "peça" : "peças"}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => askConfirm({
                                    title: "Apagar setup",
                                    description: `Remover "${b.name}" dos seus setups salvos?`,
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
                                  to="/monte-seu-pc"
                                  className="inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 rounded-full bg-primary px-3.5 py-2 text-primary-foreground transition-all hover:brightness-110"
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
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <Heart size={28} className="text-foreground/30 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum favorito ainda</p>
                      <p className="text-foreground/45 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Clique no coração nos produtos para salvá-los aqui.</p>
                      <Link to="/produtos" className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>Ver produtos</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {favoriteProducts.map((product) => {
                        const hasDiscount = !!product.oldPrice;
                        const inStock = product.inStock !== false;
                        return (
                          <div key={product.id} className="group overflow-hidden transition-all" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                            <Link to={`/produto/${product.id}`} className="deal-card-img block relative aspect-square overflow-hidden transition-all duration-300" style={{
                              /* Visual match com ProductCard do ProductShelf: gradient + inner shine. */
                              background: isDark
                                ? "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.10) 0%, rgba(var(--foreground-rgb), 0.03) 100%)"
                                : "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)",
                            }}>
                              {isDark && (
                                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.06) 0%, transparent 55%)" }} />
                              )}
                              <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className={`w-full h-full object-contain p-5 group-hover:scale-[1.05] transition-transform duration-500 relative z-[1] ${!inStock ? "opacity-50" : ""}`} />
                              {/* Badges sobre imagem */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {hasDiscount && (
                                  <span className="px-1.5 py-0.5 bg-primary text-primary-foreground flex items-center gap-0.5" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.04em" }}>
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
                                className={`w-full min-h-[44px] md:min-h-0 py-1.5 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${inStock ? "bg-primary text-primary-foreground hover:brightness-110" : "bg-foreground/8 text-foreground/40 cursor-not-allowed"}`}
                                style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
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
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Endereços</h2>
                    <button onClick={() => setAddressModal({ open: true, editing: null })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3.5 py-1.5 text-primary hover:brightness-110 transition-all cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: "rgba(17, 17, 17, 0.08)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar</button>
                  </div>
                  {user.addresses.length === 0 ? (
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <MapPin size={28} className="text-foreground/35 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum endereço cadastrado</p>
                      <p className="text-foreground/40 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Adicione um endereço para receber seus pedidos.</p>
                      <button onClick={() => setAddressModal({ open: true, editing: null })} className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar endereço</button>
                    </div>
                  ) : (
                  <div className="space-y-2">
                    {user.addresses.map((a) => (
                      <div key={a.id} className="flex items-start justify-between gap-4 p-4" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: a.isDefault ? "1px solid rgba(200, 120, 0,0.25)" : (isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)") }}>
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(17, 17, 17, 0.08)" }}>
                            <MapPin size={15} className="text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{a.label}</span>
                              {a.isDefault && <span className="px-2 py-0.5 bg-foreground/[0.06] text-primary flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><Check size={9} /> PADRÃO</span>}
                            </div>
                            <p className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: "1.55" }}>
                              {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""} · {a.neighborhood}<br />{a.city}/{a.state}
                            </p>
                            <p className="mt-1.5 text-foreground/50 font-mono" style={{ fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "0.04em" }}>
                              CEP {a.cep}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          {!a.isDefault && (
                            <button onClick={() => setDefaultAddress(a.id)} className="inline-flex items-center gap-1 min-h-[44px] md:min-h-0 px-3 py-1.5 text-primary hover:brightness-110 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: "rgba(17, 17, 17, 0.08)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Tornar padrão</button>
                          )}
                          <button onClick={() => setAddressModal({ open: true, editing: a })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/70 hover:text-foreground transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Editar</button>
                          {user.addresses.length > 1 && (
                            <button onClick={() => askConfirm({
                              title: `Remover endereço "${a.label}"?`,
                              description: `${a.street}, ${a.number} · ${a.city}/${a.state}. Essa ação não pode ser desfeita.`,
                              confirmLabel: "Remover endereço",
                              destructive: true,
                              action: () => removeAddress(a.id),
                            })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/55 hover:text-red-400 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.02)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Remover</button>
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
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Dados Pessoais</h2>
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
                      <div className="flex items-center gap-3 p-4 mb-3" style={{ borderRadius: "var(--radius-card-sm)", background: "linear-gradient(135deg, rgba(17, 17, 17, 0.06) 0%, rgba(var(--foreground-rgb), 0.02) 60%)", border: "1px solid rgba(17, 17, 17, 0.08)" }}>
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

                  <div className="p-5" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
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
                        <input value={user.cpf} disabled className="w-full text-foreground placeholder:text-foreground/40 focus:outline-none transition-all opacity-60 cursor-not-allowed profile-field" style={{ padding: "11px 13px", borderRadius: "var(--radius-card-sm)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)", background: isDark ? "rgba(var(--foreground-rgb), 0.015)" : "rgba(0,0,0,0.015)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 500 }} />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                      <button onClick={() => updateUser({ updatedAt: new Date().toISOString() })} className="w-full md:w-auto min-h-[44px] md:min-h-0 px-5 py-2.5 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                      >Salvar alterações</button>
                      <button className="w-full md:w-auto min-h-[44px] md:min-h-0 px-4 py-2.5 text-foreground/65 hover:text-foreground transition-all cursor-pointer"
                        style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                      >Cancelar</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "cards" && (
                <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Cartões salvos</h2>
                    <button onClick={() => setCardModal({ open: true, editing: null })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3.5 py-1.5 text-primary hover:brightness-110 transition-all cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: "rgba(17, 17, 17, 0.08)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar</button>
                  </div>
                  {user.cards.length === 0 ? (
                    <div className="text-center py-20 px-6" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <CreditCard size={28} className="text-foreground/35 mx-auto mb-4" />
                      <p className="text-foreground/55 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Nenhum cartão salvo</p>
                      <p className="text-foreground/40 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Adicione para checkout mais rápido. Seus dados ficam criptografados.</p>
                      <button onClick={() => setCardModal({ open: true, editing: null })} className="inline-flex items-center justify-center min-h-[44px] md:min-h-0 px-4 py-2 bg-primary text-primary-foreground hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>+ Adicionar cartão</button>
                    </div>
                  ) : (
                  <div className="space-y-2">
                    {user.cards.map((c) => {
                      const [mm, yy] = c.expiry.split("/").map((s) => parseInt(s, 10));
                      const expDate = new Date(2000 + (yy ?? 0), (mm ?? 1) - 1, 1);
                      const today = new Date(2026, 4, 18);
                      const monthsLeft = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());
                      const isExpired = monthsLeft < 0;
                      const isExpiringSoon = !isExpired && monthsLeft <= 3;
                      return (
                        <div key={c.id} className="flex items-center gap-4 p-4" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: c.isDefault ? "1px solid rgba(200, 120, 0,0.25)" : (isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)") }}>
                          <CardBrandLogo brand={c.brand} className="flex-shrink-0" style={{ width: "44px", height: "28px", borderRadius: "var(--radius)", overflow: "hidden", display: "block", objectFit: "cover" }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <p className="text-foreground font-mono" style={{ fontSize: "var(--text-sm)", fontWeight: 600, letterSpacing: "0.05em" }}>•••• {c.last4}</p>
                              {c.isDefault && <span className="px-2 py-0.5 bg-foreground/[0.06] text-primary flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><Check size={9} /> PADRÃO</span>}
                              {isExpired && <span className="px-2 py-0.5 bg-red-500/15 text-red-400 flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><AlertCircle size={9} /> VENCIDO</span>}
                              {isExpiringSoon && <span className="px-2 py-0.5 bg-yellow-500/15 text-yellow-500 flex items-center gap-1" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.08em" }}><AlertCircle size={9} /> VENCE EM BREVE</span>}
                            </div>
                            <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{c.name} · Validade {c.expiry}</p>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {!c.isDefault && (
                              <button onClick={() => setDefaultCard(c.id)} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-primary hover:brightness-110 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: "rgba(17, 17, 17, 0.08)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Tornar padrão</button>
                            )}
                            <button onClick={() => setCardModal({ open: true, editing: c })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/70 hover:text-foreground transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.04)" : "rgba(0,0,0,0.04)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Editar</button>
                            <button onClick={() => askConfirm({
                              title: `Remover cartão •••• ${c.last4}?`,
                              description: `${c.brand || "Cartão"} · ${c.name} · Validade ${c.expiry}. Você precisará adicioná-lo de novo se quiser usar.`,
                              confirmLabel: "Remover cartão",
                              destructive: true,
                              action: () => removeCard(c.id),
                            })} className="inline-flex items-center min-h-[44px] md:min-h-0 px-3 py-1.5 text-foreground/60 hover:text-red-400 transition-colors cursor-pointer" style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.02)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Remover</button>
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
                  <h2 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Ajuda e Suporte</h2>

                  {/* Contato direto destaque */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="group cursor-pointer flex items-center gap-3 p-4 transition-all hover:bg-white/[0.025] profile-card"
                      style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.18)" }}
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
                      style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}
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
                      { title: "E-mail", desc: "suporte@pcyes.com.br · resposta em até 24h", icon: Info },
                    ].map((item) => (
                      <button key={item.title} className="group cursor-pointer w-full flex items-center gap-4 p-4 transition-all hover:bg-white/[0.025] profile-card"
                        style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}
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
                  <h2 className="text-foreground mb-5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Privacidade e Segurança</h2>

                  {/* 2FA toggle destaque */}
                  <div className="flex items-center gap-4 p-4 mb-3" style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.18)" }}>
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
                    <button className="inline-flex items-center min-h-[44px] md:min-h-0 px-3.5 py-1.5 bg-green-500 text-ink-strong hover:brightness-110 transition-all cursor-pointer flex-shrink-0" style={{ borderRadius: "var(--radius-card)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>Ativar</button>
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
                        style={{ borderRadius: "var(--radius-card-sm)", background: isDark ? "rgba(var(--foreground-rgb), 0.02)" : "rgba(0,0,0,0.015)", border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}
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
