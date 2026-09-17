"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Ticket,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  Check,
  ChevronLeft,
  Gift,
  Loader2,
  Coins,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CTAButton } from "./section";
import { PcyesCoin } from "./PcyesCoin";
import { useCart } from "./CartContext";
import { useCheckoutPrefs } from "./CheckoutPrefsContext";
import { Footer } from "./Footer";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";

const POINT_BRL = 0.1; // valor de 1 Ton Point em reais (igual ao perfil)

const COUPONS: Record<string, number> = {
  TONANTE10: 10,
  AFINADO20: 20,
  BEMVINDO: 15,
};

const GIFT_THRESHOLD = 950;

function parseBRL(s: string): number {
  return Number(s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
}

function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, setGiftItem } = useCart();
  const navigate = useNavigate();
  const { appliedCoupon, setAppliedCoupon, pointsApplied, setPointsApplied, pointsToUse, setPointsToUse } = useCheckoutPrefs();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<{ id: string; label: string; eta: string; price: number }[] | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftDismissed, setGiftDismissed] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);

  const giftItem = items.find((item) => item.isGift) ?? null;
  const paidItems = items.filter((item) => !item.isGift);
  const giftOptions = useMemo(() => {
    const cats = new Set<string>();
    return getVisibleCatalogProducts(allProducts)
      .sort((a, b) => a.priceNum - b.priceNum)
      .filter((p) => {
        if (cats.has(p.category)) return false;
        cats.add(p.category);
        return true;
      })
      .slice(0, 3);
  }, []);

  // Ton Points (state vem do context)
  const userPoints = 480;

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.isGift) return sum;
        return sum + parseBRL(item.price) * item.quantity;
      }, 0),
    [items],
  );

  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
  const discountValue = (subtotal * discountPct) / 100;
  const freeShipping = subtotal >= 299;
  const shippingPrice = freeShipping
    ? 0
    : shippingOptions && selectedShipping
    ? shippingOptions.find((o) => o.id === selectedShipping)?.price ?? 0
    : 0;
  // 1 pt = R$ 0,10 (mesma conversão exibida no perfil) e o resgate cobre no
  // máximo 30% do pedido. O teto vira múltiplo de 10 pra casar com o step.
  const maxPointsRedeem = Math.min(
    userPoints,
    Math.floor(((subtotal - discountValue) * 0.3) / POINT_BRL / 10) * 10,
  );
  const pointsValue = pointsApplied ? Math.min(pointsToUse, maxPointsRedeem) * POINT_BRL : 0;
  const baseAfterPoints = subtotal - discountValue + shippingPrice - pointsValue;
  const pixDiscount = baseAfterPoints * 0.1;
  const giftProgress = Math.min(100, (subtotal / GIFT_THRESHOLD) * 100);
  const giftUnlocked = subtotal >= GIFT_THRESHOLD;
  const total = baseAfterPoints;
  const totalPix = total - pixDiscount;

  useEffect(() => {
    if (!giftUnlocked && giftItem) {
      setGiftItem(null);
      setGiftModalOpen(false);
      setGiftDismissed(false);
      return;
    }
    if (!giftUnlocked) {
      setGiftDismissed(false);
      setGiftModalOpen(false);
      return;
    }
    if (giftUnlocked && !giftItem && !giftDismissed && paidItems.length > 0) {
      setGiftModalOpen(true);
    }
  }, [giftDismissed, giftItem, giftUnlocked, paidItems.length, setGiftItem]);

  const confirmGift = () => {
    const product = giftOptions.find((g) => g.id === selectedGiftId);
    if (!product) return;
    setGiftItem({
      id: product.id,
      name: product.name,
      price: "R$ 0,00",
      image: getPrimaryProductImage(product),
      isGift: true,
      originalPrice: product.price,
    });
    setGiftModalOpen(false);
    setSelectedGiftId(null);
  };

  useEffect(() => {
    const d = cep.replace(/\D/g, "");
    if (d.length !== 8 || freeShipping) {
      setShippingOptions(null);
      setSelectedShipping(null);
      return;
    }
    setCepLoading(true);
    const t = setTimeout(() => {
      setShippingOptions([
        { id: "pac", label: "PAC Econômico", eta: "7 dias úteis", price: 14.9 },
        { id: "sedex", label: "Sedex Expresso", eta: "2 dias úteis", price: 35.9 },
        { id: "today", label: "Mesmo dia · só capitais", eta: "Hoje", price: 59.9 },
      ]);
      setSelectedShipping("sedex");
      setCepLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [cep, freeShipping]);

  useEffect(() => {
    if (pointsToUse > maxPointsRedeem) setPointsToUse(maxPointsRedeem);
  }, [maxPointsRedeem, pointsToUse]);

  const handleApplyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) {
      setAppliedCoupon(c);
      setCouponError("");
      setCouponOpen(false);
    } else {
      setCouponError("Cupom inválido");
      setAppliedCoupon(null);
    }
  };

  const formatCep = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };

  /* Cartão da casa: superfície branca definida por borda e sombra, igual ao
     checkout e à PDP. O cinza translúcido veio da página herdada e era o que
     deixava o carrinho todo chapado. */
  const mobileBarRef = useRef<HTMLDivElement | null>(null);

  /* A barra fixa se mede e publica a altura: `--cart-bar-h` é o respiro da
     página e `--fab-lift` é como o botão de WhatsApp e o banner de cookies
     sabem subir. Sem isso o WhatsApp sentava em cima do CTA. No desktop a
     barra é `lg:hidden` e mede zero, então nada acontece. */
  useEffect(() => {
    const raiz = document.documentElement;
    const barra = mobileBarRef.current;
    if (!barra) return;
    const medir = () => {
      const h = Math.round(barra.getBoundingClientRect().height);
      raiz.style.setProperty("--cart-bar-h", `${h}px`);
      raiz.style.setProperty("--fab-lift", h > 0 ? `${h}px` : "0px");
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(barra);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
      raiz.style.setProperty("--cart-bar-h", "0px");
      raiz.style.setProperty("--fab-lift", "0px");
    };
  }, []);

  const cardBg = "var(--surface-1)";
  const cardBorder = "1px solid var(--border)";

  if (items.length === 0) {
    return (
      <>
        <div className="pt-6 md:pt-[88px]" style={{ background: "var(--surface-0)", minHeight: "calc(100vh - 200px)" }}>
          <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 py-24 text-center">
            <div
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.08) 0%, rgba(var(--foreground-rgb), 0.02) 100%)",
                border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                boxShadow: "inset 0 1px 0 rgba(var(--foreground-rgb), 0.06)",
              }}
            >
              <ShoppingBag size={36} strokeWidth={1.5} className="text-ink-subtle" />
            </div>
            <p
              className="mb-3 text-primary"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.3em" }}
            >
              // CARRINHO VAZIO
            </p>
            <h1
              className="mb-3 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              Seu carrinho ainda tá zerado
            </h1>
            <p
              className="mb-8 max-w-md text-ink-muted"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.5 }}
            >
              Bora montar seu setup? Tem drop novo e promoções imperdíveis esperando.
            </p>
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-ink-strong transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "var(--gradient-brand)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                boxShadow: "var(--shadow-brand-cta)",
              }}
            >
              Explorar produtos
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="pt-6 md:pt-[88px]" style={{ background: "var(--surface-0)", minHeight: "100vh" }}>
        <div className="mx-auto max-w-[1320px] px-5 py-8 pb-24 md:px-8 md:py-10 lg:pb-10">
          {/* Breadcrumb */}
          <Link
            to="/produtos"
            className="mb-6 inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink min-h-[44px] md:min-h-0"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Continuar comprando
          </Link>

          {/* Header */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p
                className="mb-2 text-primary"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.3em" }}
              >
                // SEU CARRINHO
              </p>
              <h1
                className="text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                }}
              >
                {items.length} {items.length === 1 ? "item selecionado" : "itens selecionados"}
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 cursor-pointer text-ink-subtle transition-colors hover:text-ink min-h-[44px] md:min-h-0"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
            >
              <Trash2 size={13} strokeWidth={2} />
              Limpar
            </button>
          </div>

          {/* Gift unlocked CTA (after threshold) */}
          {giftUnlocked && !giftItem && (
            <div
              className="mb-6 flex flex-wrap items-center justify-between gap-3 overflow-hidden p-4 md:p-5"
              style={{
                borderRadius: "var(--radius-card-md)",
                background: "linear-gradient(135deg, rgba(17, 17, 17, 0.08) 0%, rgba(17, 17, 17, 0.04) 100%)",
                border: "1px solid rgba(200, 120, 0,0.32)",
                boxShadow: "0 18px 38px -16px rgba(200, 120, 0,0.45)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-ink-strong"
                  style={{
                    background: "var(--gradient-brand)",
                    boxShadow: "0 8px 20px -4px rgba(200, 120, 0,0.55)",
                  }}
                >
                  <Gift size={16} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Brinde desbloqueado
                  </p>
                  <p className="text-ink-strong" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                    Escolha um presente cortesia PCYES.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setGiftDismissed(false); setGiftModalOpen(true); }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 text-ink-strong transition-transform hover:scale-[1.03] active:scale-[0.98] min-h-[44px] md:min-h-0"
                style={{
                  background: "var(--gradient-brand)",
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  boxShadow: "0 12px 26px -10px rgba(200, 120, 0,0.6)",
                }}
              >
                <Gift size={13} strokeWidth={2.4} />
                Escolher brinde
              </button>
            </div>
          )}

          {giftUnlocked && giftItem && (
            <div
              className="mb-6 flex flex-wrap items-center justify-between gap-3 overflow-hidden p-4 md:p-5"
              style={{
                borderRadius: "var(--radius-card-md)",
                background: "linear-gradient(135deg, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 100%)",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-ink-strong"
                  style={{ background: "var(--gradient-buy)" }}
                >
                  <Check size={16} strokeWidth={2.4} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#22c55e" }}>
                    Brinde no carrinho
                  </p>
                  <p className="text-ink-strong" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                    {giftItem.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setGiftItem(null); setGiftDismissed(false); setGiftModalOpen(true); }}
                className="inline-flex items-center cursor-pointer text-ink-muted transition-colors hover:text-ink-strong min-h-[44px] px-3 md:min-h-0 md:px-0"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Trocar
              </button>
            </div>
          )}

          {/* Gift progress bar */}
          {!giftUnlocked && (
            <div
              className="mb-6 overflow-hidden p-4 md:p-5"
              style={{ borderRadius: "var(--radius-card-md)", background: cardBg, border: cardBorder }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-strong"
                    style={{
                      background: "var(--gradient-brand)",
                      boxShadow: "var(--shadow-medallion)",
                    }}
                  >
                    <Gift size={15} strokeWidth={2.2} />
                  </div>
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "rgba(var(--foreground-rgb), 0.78)" }}>
                    Falta <span className="text-ink-strong font-bold">{formatBRL(GIFT_THRESHOLD - subtotal)}</span> para desbloquear um brinde
                  </p>
                </div>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(var(--foreground-rgb), 0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${giftProgress}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: "linear-gradient(90deg, #22c55e 0%, #34d399 100%)",
                    boxShadow: "0 0 12px rgba(34,197,94,0.5)",
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            {/* Items column */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const unit = item.isGift ? 0 : parseBRL(item.price);
                  return (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22 }}
                      className="relative flex gap-4 overflow-hidden p-4 md:gap-5 md:p-5"
                      style={{
                        borderRadius: "var(--radius-card-md)",
                        background: cardBg,
                        border: cardBorder,
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden md:h-[120px] md:w-[120px]"
                        style={{
                          borderRadius: "var(--radius-card-sm)",
                          /* prata da casa (mesma moldura da sidebar do carrinho e
                             do resumo do checkout). Com `multiply` o fundo branco
                             do PNG do produto encosta na moldura em vez de virar
                             um quadrado branco dentro do cartão. */
                          background: "var(--gradient-photo)",
                          border: "1px solid var(--border)",
                          boxShadow: "var(--shadow-card-hairline)",
                        }}
                      >
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2.5 md:p-3"
                          style={{ mixBlendMode: "multiply" }}
                        />
                        {item.isGift && (
                          <span
                            className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 text-ink-strong"
                            style={{
                              padding: "3px 7px",
                              borderRadius: "var(--radius-card)",
                              background: "var(--gradient-brand)",
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-caption)",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              boxShadow: "0 4px 12px -2px rgba(200, 120, 0,0.5)",
                            }}
                          >
                            <Gift size={9} strokeWidth={2.4} />
                            Brinde
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/produto/${item.id}`}
                            className="text-ink-strong transition-colors hover:text-primary line-clamp-2"
                            style={{
                              fontFamily: "var(--font-family-figtree)",
                              fontSize: "var(--text-base)",
                              fontWeight: 600,
                              lineHeight: 1.25,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.cartKey)}
                            className="flex h-11 w-11 md:h-8 md:w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-white/[0.06] hover:text-primary"
                            aria-label="Remover item"
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                          {/* Qty */}
                          {!item.isGift ? (
                            <div
                              className="inline-flex items-center overflow-hidden"
                              style={{
                                borderRadius: "var(--radius-card-sm)",
                                border: "1px solid rgba(var(--foreground-rgb), 0.1)",
                                background: "var(--surface-2)",
                              }}
                            >
                              <button
                                onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                className="flex h-11 w-11 md:h-8 md:w-8 cursor-pointer items-center justify-center text-ink-muted transition-colors hover:bg-white/[0.05] hover:text-ink-strong"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span
                                className="flex h-11 w-9 md:h-8 md:w-9 items-center justify-center text-ink-strong tabular-nums"
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                className="flex h-11 w-11 md:h-8 md:w-8 cursor-pointer items-center justify-center text-ink-muted transition-colors hover:bg-white/[0.05] hover:text-ink-strong"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                          ) : (
                            <span
                              className="text-ink-subtle"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                            >
                              Cortesia PCYES
                            </span>
                          )}

                          {/* Price */}
                          <div className="text-right">
                            {item.isGift ? (
                              <>
                                {item.originalPrice && (
                                  <p
                                    className="line-through"
                                    style={{
                                      fontFamily: "var(--font-family-inter)",
                                      fontSize: "var(--text-caption)",
                                      color: "rgba(var(--foreground-rgb), 0.3)",
                                    }}
                                  >
                                    {item.originalPrice}
                                  </p>
                                )}
                                <p
                                  style={{
                                    fontFamily: "var(--font-family-figtree)",
                                    fontSize: "var(--text-lg)",
                                    fontWeight: 800,
                                    color: "#22c55e",
                                    letterSpacing: "-0.015em",
                                  }}
                                >
                                  R$ 0,00
                                </p>
                              </>
                            ) : (
                              <>
                                <p
                                  className="text-ink-strong"
                                  style={{
                                    fontFamily: "var(--font-family-figtree)",
                                    fontSize: "var(--text-lg)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.015em",
                                  }}
                                >
                                  {formatBRL(unit * item.quantity)}
                                </p>
                                {item.quantity > 1 && (
                                  <p
                                    className="text-ink-subtle"
                                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                                  >
                                    {item.quantity}× {formatBRL(unit)}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary column */}
            <div className="lg:sticky lg:top-[150px] lg:self-start">
              <div
                className="relative overflow-hidden p-6"
                style={{
                  borderRadius: "var(--radius-card-lg)",
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  className="mb-5 text-primary"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.3em" }}
                >
                  // RESUMO DO PEDIDO
                </p>

                {/* Shipping (acima do cupom — frete grátis ou cálculo) */}
                {freeShipping ? (
                  <div
                    className="mb-3 flex items-center gap-2.5 rounded-card-sm p-3"
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    <Truck size={15} strokeWidth={2.2} className="text-green-400 flex-shrink-0" />
                    <div>
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "#22c55e", letterSpacing: "0.01em" }}>
                        Frete grátis desbloqueado
                      </p>
                      <p className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", marginTop: "1px" }}>
                        Calculado direto no checkout
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Truck size={13} className="text-ink-muted" strokeWidth={2} />
                      <span
                        className="text-ink-muted tracking-wide"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}
                      >
                        Calcular frete
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Digite seu CEP"
                        value={cep}
                        onChange={(e) => setCep(formatCep(e.target.value))}
                        className="w-full px-3.5 py-2.5 pr-9 text-ink-strong placeholder:text-ink-subtle focus:outline-none transition-all cart-field"
                        aria-label="CEP para cálculo de frete"
                        style={{
                          borderRadius: "var(--radius-card-sm)",
                          border: "1px solid rgba(var(--foreground-rgb), 0.1)",
                          background: "var(--surface-2)",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                        }}
                      />
                      {cepLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-ink-muted" />}
                    </div>
                    <AnimatePresence>
                      {shippingOptions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-3 space-y-1.5 overflow-hidden"
                        >
                          {shippingOptions.map((opt) => {
                            const active = selectedShipping === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => setSelectedShipping(opt.id)}
                                className="flex w-full items-center gap-2.5 rounded-[var(--radius-card-sm)] px-3 py-2 text-left transition-colors min-h-[44px] md:min-h-0"
                                style={{
                                  background: active ? "rgba(34,197,94,0.06)" : "rgba(var(--foreground-rgb), 0.02)",
                                  border: active ? "1.5px solid rgba(34,197,94,0.5)" : "1px solid rgba(var(--foreground-rgb), 0.06)",
                                }}
                              >
                                <span
                                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                  style={{
                                    background: active ? "var(--gradient-buy)" : "transparent",
                                    border: active ? "none" : "1.5px solid rgba(var(--foreground-rgb), 0.2)",
                                  }}
                                >
                                  {active && <Check size={9} strokeWidth={3} className="text-ink-strong" />}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-ink-strong" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                                    {opt.label}
                                  </p>
                                  <p className="text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                                    {opt.eta}
                                  </p>
                                </div>
                                <p className="flex-shrink-0 text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-sm)", fontWeight: 800 }}>
                                  {formatBRL(opt.price)}
                                </p>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Coupon */}
                <button
                  onClick={() => setCouponOpen((v) => !v)}
                  className={`mb-3 flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors ${
                    appliedCoupon ? "rounded-card-sm border border-green-500/25 bg-green-500/[0.06]" : "rounded-card-sm border border-edge-subtle hover:border-edge hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {appliedCoupon ? (
                      <Check size={14} className="text-green-500" strokeWidth={2.4} />
                    ) : (
                      <Ticket size={14} className="text-ink-muted" strokeWidth={2} />
                    )}
                    <span
                      className={appliedCoupon ? "text-green-400" : "text-ink-muted"}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: appliedCoupon ? 700 : 600 }}
                    >
                      {appliedCoupon ? `Cupom ${appliedCoupon} aplicado` : "Tenho um cupom"}
                    </span>
                    {appliedCoupon && (
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "rgba(34,197,94,0.75)" }}>
                        −{discountPct}%
                      </span>
                    )}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: appliedCoupon ? "rgba(34,197,94,0.75)" : "rgba(var(--foreground-rgb), 0.4)" }}
                  >
                    {appliedCoupon ? "Alterar" : couponOpen ? "Fechar" : "Adicionar"}
                  </span>
                </button>

                <AnimatePresence>
                  {couponOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: PCYES10"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          className="flex-1 px-3.5 py-2.5 text-ink-strong placeholder:text-ink-subtle focus:outline-none transition-all cart-field"
                          style={{
                            borderRadius: "var(--radius-card-sm)",
                            border: "1px solid rgba(var(--foreground-rgb), 0.1)",
                            background: "var(--surface-2)",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-sm)",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                          }}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!coupon.trim()}
                          className="cursor-pointer rounded-[var(--radius-card-sm)] px-4 py-2.5 text-ink-strong transition-transform hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px] md:min-h-0"
                          style={{
                            background: "var(--gradient-brand)",
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-caption)",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            boxShadow: "var(--shadow-brand-cta-sm)",
                          }}
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && (
                        <p
                          className="mb-3 text-primary"
                          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                        >
                          {couponError}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ton Points */}
                <div
                  className={`mb-5 overflow-hidden rounded-card-sm transition-colors ${
                    pointsApplied
                      ? "border border-yellow-300/40 bg-yellow-300/[0.05]"
                      : "border border-edge-subtle hover:border-yellow-300/35 hover:bg-yellow-300/[0.05]"
                  }`}
                >
                  <button
                    onClick={() => setPointsApplied((v) => !v)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3"
                    aria-expanded={pointsApplied}
                  >
                    <span className="flex items-center gap-2">
                      <PcyesCoin size={20} />
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: pointsApplied ? "var(--amber-deep)" : "rgba(var(--foreground-rgb), 0.78)" }}>
                        Ton Points
                      </span>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: "rgba(var(--foreground-rgb), 0.4)" }}>
                        {userPoints} pts
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        color: pointsApplied ? "var(--amber-deep)" : "rgba(var(--foreground-rgb), 0.45)",
                        textTransform: "uppercase",
                      }}
                    >
                      {pointsApplied ? "Aplicado" : "Usar"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {pointsApplied && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t px-3 pb-3 pt-3" style={{ borderColor: "rgba(200,120,0,0.2)" }}>
                          <div className="mb-2.5 flex items-center justify-between gap-3">
                            <NumberStepper
                              value={pointsToUse}
                              onChange={setPointsToUse}
                              min={0}
                              max={maxPointsRedeem}
                              step={10}
                              accent="var(--primary)"
                              ariaLabel="Quantidade de pontos a usar"
                            />
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "rgba(var(--foreground-rgb), 0.5)", fontWeight: 600 }}>
                              de {maxPointsRedeem} disponíveis
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={maxPointsRedeem}
                            step={10}
                            value={pointsToUse}
                            onChange={(e) => setPointsToUse(Number(e.target.value))}
                            aria-label="Slider quantidade de pontos"
                            className="w-full"
                            style={{
                              accentColor: "var(--amber-deep)",
                            }}
                          />
                          <p className="mt-2 text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                            Você vai economizar <span style={{ color: "var(--amber-deep)", fontWeight: 800 }}>{formatBRL(pointsValue)}</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/5 mb-4" />

                {/* Totals */}
                <div className="mb-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                      Subtotal
                    </span>
                    <span className="text-ink" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                      {formatBRL(subtotal)}
                    </span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "#22c55e", fontWeight: 600 }}>
                        Cupom {appliedCoupon}
                      </span>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "#22c55e", fontWeight: 700 }}>
                        −{formatBRL(discountValue)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                      Frete
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        color: freeShipping || (selectedShipping && shippingPrice === 0) ? "#22c55e" : "rgba(var(--foreground-rgb), 0.85)",
                      }}
                    >
                      {freeShipping ? "GRÁTIS" : selectedShipping ? formatBRL(shippingPrice) : "-"}
                    </span>
                  </div>
                  {pointsValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "var(--amber-deep)", fontWeight: 600 }}>
                        Ton Points
                      </span>
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "var(--amber-deep)", fontWeight: 700 }}>
                        −{formatBRL(pointsValue)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mb-5 rounded-[var(--radius-card-sm)] p-4" style={{ background: "var(--surface-2)", border: "1px solid rgba(var(--foreground-rgb), 0.06)" }}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                      Total
                    </span>
                    <span className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                      {formatBRL(total)}
                    </span>
                  </div>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "#22c55e" }}>
                      no PIX
                    </span>
                    <span style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 800, color: "#22c55e", letterSpacing: "-0.02em" }}>
                      {formatBRL(totalPix)}
                    </span>
                  </div>
                  <p className="text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                    ou 10× de {formatBRL(total / 10)} sem juros
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="mb-3 hidden w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-ink-strong transition-transform hover:scale-[1.02] active:scale-[0.98] lg:inline-flex"
                  style={{
                    background: "var(--gradient-buy)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "var(--shadow-buy-cta)",
                  }}
                >
                  <Lock size={14} strokeWidth={2.4} />
                  Finalizar compra
                </button>

                <div className="flex items-center justify-center gap-1.5 text-ink-subtle" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                  <ShieldCheck size={12} strokeWidth={2} />
                  Compra 100% segura · criptografia SSL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {giftModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); setSelectedGiftId(null); }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md md:items-center md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-auto max-h-[92dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-[28px] md:max-h-[calc(100dvh-3rem)] md:rounded-[var(--radius-card-xl)]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                boxShadow: "var(--shadow-float)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-edge-subtle px-6 py-6 md:px-9 md:py-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Gift size={14} strokeWidth={2.2} />
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.3em" }}>
                        // BRINDE DESBLOQUEADO
                      </span>
                    </div>
                    <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                      Escolha seu presente
                    </h3>
                    <p className="mt-3 max-w-[560px] text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "clamp(12px, 3.4vw, 14px)", lineHeight: 1.6 }}>
                      Você atingiu {formatBRL(GIFT_THRESHOLD)}. Selecione um produto para entrar no carrinho com selo de presente e valor zerado.
                    </p>
                  </div>
                  <button
                    onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); }}
                    className="flex h-11 w-11 md:h-10 md:w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink-strong"
                    aria-label="Fechar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-9 md:py-8">
                <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                  {giftOptions.map((product) => {
                    const isSelected = selectedGiftId === product.id;
                    return (
                      <button
                        key={`gift-option-${product.id}`}
                        onClick={() => setSelectedGiftId(product.id)}
                        aria-pressed={isSelected}
                        className="group relative flex flex-row cursor-pointer overflow-hidden text-left transition-all duration-300 md:block"
                        style={{
                          borderRadius: "var(--radius-card-lg)",
                          background: "var(--surface-1)",
                          border: isSelected ? "1.5px solid rgba(200, 120, 0,0.7)" : "1px solid var(--border)",
                          boxShadow: isSelected
                            ? "0 24px 60px -20px rgba(200, 120, 0,0.35), inset 0 1px 0 rgba(var(--foreground-rgb), 0.05)"
                            : "var(--shadow-card)",
                        }}
                      >
                        <div
                          className="relative h-[132px] w-[132px] flex-shrink-0 overflow-hidden border-r border-edge-subtle md:h-[210px] md:w-full md:border-r-0 md:border-b"
                          style={{ background: "var(--gradient-photo)" }}
                        >
                          <ImageWithFallback
                            src={getPrimaryProductImage(product)}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] md:p-6"
                            style={{ mixBlendMode: "multiply" }}
                          />
                          <div
                            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-ink-strong md:left-4 md:top-4 md:h-9 md:w-9"
                            style={{
                              background: "var(--gradient-brand)",
                              boxShadow: "var(--shadow-medallion)",
                            }}
                          >
                            <Gift size={12} strokeWidth={2.2} className="md:hidden" />
                            <Gift size={14} strokeWidth={2.2} className="hidden md:block" />
                          </div>
                          {isSelected && (
                            <div
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-ink-strong md:right-4 md:top-4 md:h-9 md:w-9"
                              style={{
                                background: "var(--gradient-brand)",
                                boxShadow: "var(--shadow-medallion)",
                              }}
                            >
                              <Check size={13} strokeWidth={2.4} className="md:hidden" />
                              <Check size={15} strokeWidth={2.4} className="hidden md:block" />
                            </div>
                          )}
                        </div>
                        <div className="relative flex flex-1 flex-col px-4 py-4 md:px-5 md:py-5">
                          <p
                            className="line-clamp-2 text-ink-strong"
                            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(14px, 3.8vw, 17px)", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" }}
                          >
                            {product.name}
                          </p>
                          <div className="mt-3 flex items-baseline gap-2 md:mt-4">
                            <span className="line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "rgba(var(--foreground-rgb), 0.32)" }}>
                              {product.price}
                            </span>
                            <span
                              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(16px, 4.6vw, 22px)", fontWeight: 700, color: "#22c55e", letterSpacing: "-0.015em" }}
                            >
                              R$ 0,00
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-4 md:mt-4 md:pt-0">
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.4)" }}>
                              PRESENTE PCYES
                            </span>
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.12em", color: isSelected ? "var(--primary)" : "rgba(var(--foreground-rgb), 0.45)" }}>
                              {isSelected ? "SELECIONADO" : "SELECIONAR"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-edge-subtle px-6 py-5 md:px-9 md:py-6">
                <button
                  onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); setSelectedGiftId(null); }}
                  className="inline-flex items-center cursor-pointer text-ink-muted transition-colors hover:text-ink min-h-[44px] px-3 md:min-h-0 md:px-0"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  Agora não
                </button>
                <button
                  onClick={confirmGift}
                  disabled={!selectedGiftId}
                  className="cursor-pointer rounded-full px-7 py-3 text-ink-strong transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100 min-h-[44px] md:min-h-0"
                  style={{
                    background: "var(--gradient-brand)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    boxShadow: "var(--shadow-brand-cta)",
                  }}
                >
                  Selecionar presente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra fixa do celular. Era uma barra #0e0e0e com texto `text-ink-strong`
          (que no tema claro é escuro): o total sumia dentro dela. E em z-40 o
          botão de WhatsApp (90) sentava em cima do CTA, cortando "Finalizar
          compra" pela metade. Agora ela é superfície, como a da PDP e a do
          checkout, e sobe para z-[95]. */}
      <div ref={mobileBarRef} className="fixed bottom-0 left-0 right-0 z-[95] lg:hidden">
        <div
          className="flex items-center gap-3 border-t border-edge px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(20px)",
            paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            boxShadow: "0 -10px 30px -22px rgba(17,17,17,0.55)",
          }}
        >
          <div className="flex-1 min-w-0">
            <p
              className="text-ink-muted"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}
            >
              Total
            </p>
            <p
              className="num text-ink-strong"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-price-lg)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1 }}
            >
              {formatBRL(total)}
            </p>
          </div>
          {/* mesmo botão de compra do resto do site: --buy-green chapado. Era um
              <button> à parte com var(--gradient-buy), que é outro verde. */}
          <CTAButton onClick={() => navigate("/checkout")} variant="buy" size="md" className="shrink-0">
            <Lock size={13} strokeWidth={2.6} />
            Finalizar compra
          </CTAButton>
        </div>
      </div>

      <Footer />
      {/* Respiro da barra fixa depois do rodapé: antes o fim do rodapé ficava
          escondido atrás dela. */}
      <div className="lg:hidden" style={{ height: "var(--cart-bar-h, 72px)" }} aria-hidden="true" />
    </>
  );
}

function NumberStepper({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  accent = "var(--primary)",
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  step?: number;
  accent?: string;
  ariaLabel?: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div
      className="inline-flex items-stretch overflow-hidden"
      style={{
        borderRadius: "var(--radius-card-sm)",
        background: "rgba(0,0,0,0.3)",
        border: `1px solid ${accent === "#facc15" ? "rgba(250,204,21,0.35)" : accent === "var(--primary)" ? "rgba(200, 120, 0,0.35)" : "rgba(var(--foreground-rgb), 0.12)"}`,
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value.replace(/\D/g, "")) || 0))}
        aria-label={ariaLabel}
        className="w-14 bg-transparent px-2 py-1 text-center text-ink-strong focus:outline-none cart-field"
        style={{
          fontFamily: "var(--font-family-figtree)",
          fontSize: "var(--text-base)",
          fontWeight: 800,
          letterSpacing: "-0.01em",
        }}
      />
      <div className="flex flex-col border-l" style={{ borderColor: "rgba(var(--foreground-rgb), 0.08)" }}>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          aria-label="Aumentar"
          className="flex h-4 w-7 min-h-[24px] min-w-[44px] md:min-h-0 md:min-w-0 items-center justify-center transition-colors hover:bg-white/[0.08]"
          style={{ color: accent }}
        >
          <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="h-px" style={{ background: "rgba(var(--foreground-rgb), 0.08)" }} />
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          aria-label="Diminuir"
          className="flex h-4 w-7 min-h-[24px] min-w-[44px] md:min-h-0 md:min-w-0 items-center justify-center transition-colors hover:bg-white/[0.08]"
          style={{ color: accent }}
        >
          <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
