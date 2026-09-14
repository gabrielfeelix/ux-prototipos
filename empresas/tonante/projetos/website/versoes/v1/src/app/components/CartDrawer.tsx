import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { X, ShoppingBag, Trash2, Truck, Tag, Check, ChevronDown, Gift } from "lucide-react";
import { useCart } from "./CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { PcyesCoin } from "./PcyesCoin";
import { useCheckoutPrefs } from "./CheckoutPrefsContext";
import { BrindePill, QtyStepper } from "./section";

const MOCK_SHIPPING: Record<string, { name: string; price: number; days: string }[]> = {
  default: [
    { name: "PAC", price: 18.9, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 32.5, days: "3-5 dias úteis" },
  ],
  free: [
    { name: "Frete Grátis (PAC)", price: 0, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 24.9, days: "3-5 dias úteis" },
  ],
};

const COUPONS: Record<string, number> = {
  TONANTE10: 10, PROMO20: 20, BEMVINDO: 15,
};

const GIFT_THRESHOLD = 950;
const FREE_SHIPPING_THRESHOLD = 299;

const USER_PCYES_POINTS = 480;

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, lastAdded, setGiftItem, clearCart } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const navigate = useNavigate();
  const { pointsApplied, setPointsApplied } = useCheckoutPrefs();

  const [shippingOpen, setShippingOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftDismissed, setGiftDismissed] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);

  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<typeof MOCK_SHIPPING.default | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const parsePrice = (p: string) => parseFloat(p.replace("R$ ", "").replace(".", "").replace(",", "."));
  const formatPrice = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;
  const formatInt = (n: number) => n.toLocaleString("pt-BR");

  const paidItems = items.filter((item) => !item.isGift);
  const giftItem = items.find((item) => item.isGift) ?? null;
  const subtotal = paidItems.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
  const discountValue = subtotal * (discountPct / 100);
  const shippingCost = selectedShipping !== null && shippingOptions ? shippingOptions[selectedShipping].price : 0;
  const maxPointsRedeem = Math.min(USER_PCYES_POINTS, Math.floor((subtotal - discountValue) * 0.3));
  const pointsValue = pointsApplied ? maxPointsRedeem : 0;
  const total = Math.max(0, subtotal - discountValue + shippingCost - pointsValue);
  const giftUnlocked = subtotal >= GIFT_THRESHOLD;
  const giftProgress = Math.min(100, (subtotal / GIFT_THRESHOLD) * 100);
  const remainingForGift = Math.max(0, GIFT_THRESHOLD - subtotal);
  const freeShipUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const giftOptions = useMemo(
    () => {
      const uniqueCategories = new Set<string>();
      return getVisibleCatalogProducts(allProducts)
        .sort((a, b) => a.priceNum - b.priceNum)
        .filter((product) => {
          if (uniqueCategories.has(product.category)) return false;
          uniqueCategories.add(product.category);
          return true;
        })
        .slice(0, 3);
    },
    [],
  );

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

  const handleCepSearch = () => {
    if (cep.replace(/\D/g, "").length < 8) return;
    setLoadingCep(true);
    setSelectedShipping(null);
    setTimeout(() => {
      setShippingOptions(subtotal >= 299 ? MOCK_SHIPPING.free : MOCK_SHIPPING.default);
      setLoadingCep(false);
    }, 1200);
  };

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

  const confirmGift = () => {
    const product = giftOptions.find((item) => item.id === selectedGiftId);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] flex w-full max-w-[460px] flex-col overflow-hidden"
            style={{
              background: isDark ? "#161617" : "white",
              borderTopLeftRadius: "var(--radius-card-lg)",
              borderBottomLeftRadius: "var(--radius-card-lg)",
              borderLeft: "1px solid rgba(var(--foreground-rgb), 0.06)",
              boxShadow: "var(--shadow-drawer-side)",
            }}
          >
            <div className="flex items-center justify-between border-b border-foreground/5 px-7 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-foreground" strokeWidth={1.5} />
                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Carrinho</span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground" style={{ borderRadius: "var(--radius-pill)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>{totalItems}</span>
                <span className="flex items-center gap-1 px-2 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "rgba(17, 17, 17, 0.08)", color: "var(--amber-deep)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
                  <PcyesCoin size={14} />
                  {formatInt(USER_PCYES_POINTS)}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar carrinho"
                className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-foreground/5 cursor-pointer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Barra de frete grátis (CRO §6.17) — meta R$ 299 */}
            {paidItems.length > 0 && (
              <div className="border-b border-foreground/5 px-7 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Truck size={15} className="text-primary" strokeWidth={2} />
                  {freeShipUnlocked ? (
                    <span className="num text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>
                      🎉 Você ganhou frete grátis!
                    </span>
                  ) : (
                    <span className="num text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                      Faltam <strong style={{ color: "var(--amber-deep)" }}>{formatPrice(remainingForFreeShip)}</strong> para frete grátis
                    </span>
                  )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${freeShipProgress}%`, background: "var(--gradient-buy)" }}
                    role="progressbar"
                    aria-valuenow={Math.round(freeShipProgress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progresso para frete grátis"
                  />
                </div>
              </div>
            )}

            {paidItems.length > 0 && (
              <div className="border-b border-foreground/5 px-7 py-3">
                <div className={`flex items-center gap-2.5 rounded-card-md border px-3.5 py-2.5 ${giftUnlocked ? "border-foreground/10 bg-foreground/[0.04]" : "border-foreground/8 bg-foreground/[0.03]"}`}>
                  <Gift size={16} className="flex-shrink-0 text-primary" strokeWidth={2} />
                  <p className="flex-1 text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.35 }}>
                    {giftUnlocked
                      ? giftItem
                        ? "Brinde selecionado ✓"
                        : "Brinde desbloqueado! Escolha o seu presente."
                      : <>Faltam <strong style={{ color: "var(--amber-deep)" }}>{formatPrice(remainingForGift)}</strong> para um brinde grátis</>}
                  </p>
                  {giftUnlocked && (
                    <button
                      onClick={() => { setGiftDismissed(false); setGiftModalOpen(true); }}
                      className="flex-shrink-0 text-primary hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "700", letterSpacing: "0.06em" }}
                    >
                      {giftItem ? "TROCAR" : "ESCOLHER"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-7 py-5" style={{ scrollbarWidth: "none" }}>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                    <ShoppingBag size={28} className="text-foreground/20" strokeWidth={1} />
                  </div>
                  <p className="text-foreground/60 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Carrinho vazio</p>
                  <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.cartKey} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }}
                        className={`flex gap-4 p-3.5 border ${lastAdded?.cartKey === item.cartKey ? "border-foreground/10 bg-foreground/[0.04]" : item.isGift ? "border-foreground/10 bg-foreground/[0.04]" : "border-edge-subtle bg-surface-1"} transition-colors duration-700`}
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <div className="w-[84px] flex-shrink-0 self-stretch overflow-hidden relative min-h-[84px]" style={{ borderRadius: "var(--radius)", background: "var(--well)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-contain p-2.5" style={{ mixBlendMode: "multiply" }} />
                          {item.isGift && (
                            <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                              <Gift size={13} />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="truncate text-foreground mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" }}>{item.name}</p>
                              {item.isGift && <BrindePill />}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.isGift && item.originalPrice && (
                                <p className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{item.originalPrice}</p>
                              )}
                              <p className={item.isGift ? "text-primary" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: item.isGift ? "600" : "400" }}>
                                {item.price}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            {item.isGift ? (
                              <div className="flex items-center gap-2 text-primary/80">
                                <Gift size={13} />
                                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "600", letterSpacing: "0.08em" }}>
                                  1 item gratuito
                                </span>
                              </div>
                            ) : (
                              <QtyStepper
                                size="sm"
                                value={item.quantity}
                                onChange={(next) => updateQuantity(item.cartKey, next)}
                              />
                            )}
                            <button onClick={() => item.isGift ? setGiftItem(null) : removeItem(item.cartKey)} aria-label={item.isGift ? "Remover brinde" : `Remover ${item.name}`} className="text-foreground/20 hover:text-primary transition-colors cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-foreground/5 px-7 py-5 space-y-3 max-h-[55vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div>
                  <button onClick={() => setCouponOpen(!couponOpen)}
                    className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer group transition-colors ${
                      appliedCoupon ? "rounded-[var(--radius-card-sm)] border border-green-500/20 bg-green-500/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {appliedCoupon ? (
                        <Check size={13} className="text-green-500" />
                      ) : (
                        <Tag size={12} className="text-foreground/45" />
                      )}
                      <span
                        className={appliedCoupon ? "text-green-400" : "text-foreground/65 group-hover:text-foreground/85 transition-colors"}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: appliedCoupon ? 600 : 600 }}
                      >
                        {appliedCoupon ? `Cupom ${appliedCoupon} aplicado` : "Cupom de desconto"}
                      </span>
                      {appliedCoupon && (
                        <span className="text-green-500/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
                          −{discountPct}%
                        </span>
                      )}
                    </div>
                    <span
                      className={appliedCoupon ? "text-green-500/70" : "text-foreground/35 group-hover:text-foreground/55 transition-colors"}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                    >
                      {appliedCoupon ? "Alterar" : <ChevronDown size={11} className={`transition-transform duration-300 ${couponOpen ? "rotate-180" : ""}`} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {couponOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between px-3 py-2 border border-green-500/20 bg-green-500/5" style={{ borderRadius: "var(--radius-button)" }}>
                              <div className="flex items-center gap-2">
                                <Check size={13} className="text-green-500" />
                                <span className="text-green-400" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-medium)" }}>{appliedCoupon}</span>
                                <span className="text-green-500/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>(-{discountPct}%)</span>
                              </div>
                              <button onClick={() => { setAppliedCoupon(null); setCoupon(""); }} aria-label="Remover cupom" className="text-foreground/30 hover:text-foreground transition-colors cursor-pointer"><X size={13} aria-hidden="true" /></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Ex: TONANTE10" value={coupon}
                                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                  className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }} />
                                <button onClick={handleApplyCoupon} disabled={!coupon.trim()}
                                  className="px-3 py-2 text-foreground/30 hover:text-foreground/60 transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                                >Aplicar</button>
                              </div>
                              {couponError && <p className="text-primary mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{couponError}</p>}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-foreground/5" />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Subtotal</span>
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>{formatPrice(subtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Desconto ({discountPct}%)</span>
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>-{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Frete</span>
                    <span className="text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>Calculado no checkout</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "var(--ink-meta)" }}>Total</span>
                  <span className="text-foreground num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-xl)", fontWeight: 700 }}>{formatPrice(total)}</span>
                </div>

                <button
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-4 transition-transform hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: "var(--gradient-buy)",
                    color: "#fff",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    boxShadow: "var(--shadow-buy-cta-sm)",
                  }}
                  onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                  aria-label="Finalizar pedido"
                ><ShoppingBag size={17} strokeWidth={2} /> Finalizar pedido</button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center border border-foreground/12 bg-transparent text-foreground/55 hover:text-foreground/85 hover:border-foreground/22 transition-colors cursor-pointer rounded-full"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, minHeight: "44px" }}
                >Continuar comprando</button>
                <div className="flex items-center justify-center pt-1">
                  <button
                    onClick={() => clearCart()}
                    className="inline-flex items-center gap-1 text-foreground/30 hover:text-primary transition-colors cursor-pointer"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                    aria-label="Limpar carrinho"
                  >
                    <Trash2 size={12} strokeWidth={2} />
                    Limpar carrinho
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {giftModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); setSelectedGiftId(null); }}
                className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-md p-0 md:items-center md:p-6"
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
                          Você atingiu {formatPrice(GIFT_THRESHOLD)}. Selecione um produto pra entrar no carrinho com selo de presente e valor zerado.
                        </p>
                      </div>
                      <button onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); }} aria-label="Fechar oferta de brinde" className="flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:text-ink-strong hover:bg-white/[0.06] cursor-pointer flex-shrink-0">
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
                        className="group relative flex flex-row overflow-hidden text-left transition-all duration-300 cursor-pointer md:block"
                        style={{
                          borderRadius: "var(--radius-card-lg)",
                          background: "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.06) 0%, rgba(var(--foreground-rgb), 0.02) 100%)",
                          border: isSelected ? "1.5px solid rgba(200, 120, 0,0.7)" : "1px solid rgba(var(--foreground-rgb), 0.08)",
                          boxShadow: isSelected
                            ? "0 24px 60px -20px rgba(200, 120, 0,0.35), inset 0 1px 0 rgba(var(--foreground-rgb), 0.05)"
                            : "var(--shadow-card-hairline)",
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.05) 0%, transparent 55%)",
                            borderRadius: "var(--radius-card-lg)",
                          }}
                        />
                        <div
                          className="relative h-[132px] w-[132px] flex-shrink-0 overflow-hidden border-r border-edge-subtle md:h-[210px] md:w-full md:border-r-0 md:border-b"
                          style={{ background: "radial-gradient(circle at top, rgba(17, 17, 17, 0.08) 0%, transparent 60%)" }}
                        >
                          <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] md:p-6" />
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
                          <p className="line-clamp-2 text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(14px, 3.8vw, 17px)", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                            {product.name}
                          </p>
                          <div className="mt-3 flex items-baseline gap-2 md:mt-4">
                            <span className="line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "rgba(var(--foreground-rgb), 0.32)" }}>
                              {product.price}
                            </span>
                            <span style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(16px, 4.6vw, 22px)", fontWeight: 700, color: "#22c55e", letterSpacing: "-0.015em" }}>
                              R$ 0,00
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-4 md:mt-4 md:pt-0">
                            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.4)" }}>
                              PRESENTE TONANTE
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
                      className="cursor-pointer rounded-full px-7 py-3 text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100 min-h-[44px] md:min-h-0"
                      style={{
                        background: "var(--gradient-buy)",
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
        </>
      )}
    </AnimatePresence>
  );
}
