import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { X, ShoppingBag, Trash2, Truck, Tag, Check, ChevronDown, Gift } from "lucide-react";
import { useFadingScrollbar, useLockBodyScroll } from "./useFadingScrollbar";
import { useCart } from "./CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "./productPresentation";
import { PcyesCoin } from "./PcyesCoin";
import { useCheckoutPrefs } from "./CheckoutPrefsContext";
import { BrindePill, CTAButton, QtyStepper } from "./section";

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

/* Brinde só em compra grande: a R$ 950 o modal pulava na cara de quem levou
   um violão de estudo, que é a compra mais comum da loja. R$ 7.000 é ticket
   de quem está montando setup — aí o presente soa como agrado, não como
   interrupção. */
const GIFT_THRESHOLD = 7000;
const FREE_SHIPPING_THRESHOLD = 299;

const USER_PCYES_POINTS = 480;

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, setGiftItem, clearCart } = useCart();

  /* Com o painel aberto a página atrás não rola: a roda do mouse pertence à
     lista do carrinho, não ao catálogo embaixo. */
  useLockBodyScroll(isOpen);
  const itemsScrollRef = useFadingScrollbar<HTMLDivElement>();
  const summaryScrollRef = useFadingScrollbar<HTMLDivElement>();
  const giftScrollRef = useFadingScrollbar<HTMLDivElement>();
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

          {/* Painel flutuante, não gaveta colada na borda: sobra um respiro dos
              quatro lados e os cantos arredondam por inteiro, então ele lê como
              algo POR CIMA da página e não como um pedaço dela. No celular a
              folga encolhe — 460px de painel com 16px de cada lado não cabem. */}
          <motion.div initial={{ x: "104%" }} animate={{ x: 0 }} exit={{ x: "104%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-2 right-2 z-[61] flex w-[calc(100%-1rem)] max-w-[520px] flex-col overflow-hidden md:inset-y-4 md:right-4 md:w-full"
            style={{
              background: isDark ? "#161617" : "white",
              borderRadius: "var(--radius-card-xl)",
              boxShadow: "0 32px 80px -24px rgba(17,17,17,.38), 0 4px 16px -8px rgba(17,17,17,.18)",
            }}
          >
            <div className="flex items-center justify-between border-b border-foreground/5 px-7 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-foreground" strokeWidth={1.5} />
                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)" }}>Carrinho</span>
                <span className="num px-2 py-0.5" style={{ borderRadius: "var(--radius-pill)", background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}>{totalItems}</span>
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
                  <Truck size={15} className="text-foreground/55" strokeWidth={2} />
                  {freeShipUnlocked ? (
                    <span className="num text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}>
                      🎉 Você ganhou frete grátis!
                    </span>
                  ) : (
                    <span className="num text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                      Faltam <strong className="num text-ink-strong">{formatPrice(remainingForFreeShip)}</strong> para frete grátis
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
                  <p className="flex-1 text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.35 }}>
                    {giftUnlocked
                      ? giftItem
                        ? "Brinde selecionado ✓"
                        : "Brinde desbloqueado! Escolha o seu presente."
                      : <>Faltam <strong style={{ color: "var(--amber-deep)" }}>{formatPrice(remainingForGift)}</strong> para um brinde grátis</>}
                  </p>
                  {giftUnlocked && (
                    <button
                      onClick={() => { setGiftDismissed(false); setGiftModalOpen(true); }}
                      className="-my-1.5 inline-flex min-h-[36px] flex-shrink-0 items-center rounded-full px-2 text-primary transition-opacity hover:opacity-80 cursor-pointer"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "700", letterSpacing: "0.06em" }}
                    >
                      {giftItem ? "TROCAR" : "ESCOLHER"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={itemsScrollRef} className="scroll-fade min-h-0 flex-1 overflow-y-auto px-7 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                    <ShoppingBag size={28} className="text-foreground/20" strokeWidth={1} />
                  </div>
                  <p className="text-foreground/60 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-medium)" }}>Carrinho vazio</p>
                  <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Sem moldura por item: um card dentro de um painel que já é
                      um card empilha três bordas na mesma vertical. Linha
                      divisória basta pra separar, e a foto continua na sua
                      caixa — ela é o que o olho usa pra achar o item. */}
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.cartKey} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }}
                        className="border-b border-foreground/8 pb-5 last:border-b-0 last:pb-0"
                      >
                        <div
                          /* só o brinde ganha fundo. O realce de "acabou de
                             entrar" ficava 1~2s no item recém-adicionado e lia
                             como hover preso — a animação de entrada da linha
                             já diz o que chegou. */
                          className={`-mx-3 -my-2 flex gap-4 rounded-[10px] px-3 py-2 ${
                            item.isGift ? "bg-foreground/[0.04]" : ""
                          }`}
                        >
                        {/* mesma caixa do card da home: o degradê cinza é o
                            fundo padrão de foto de produto do site, e a caixa
                            lisa do drawer fazia o mesmo instrumento parecer
                            outro recorte. Ver ProductCardV2. */}
                        <div className="w-[84px] flex-shrink-0 self-stretch overflow-hidden relative min-h-[84px]" style={{ borderRadius: "8px", background: "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)" }}>
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
                              <p className="truncate text-foreground mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, lineHeight: 1.4 }}>{item.name}</p>
                              {item.isGift && <BrindePill />}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.isGift && item.originalPrice && (
                                <p className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>{item.originalPrice}</p>
                              )}
                              <p className={item.isGift ? "text-primary" : "text-foreground/65"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: item.isGift ? "600" : "400" }}>
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
                                size="md"
                                value={item.quantity}
                                onChange={(next) => updateQuantity(item.cartKey, next)}
                              />
                            )}
                            <button onClick={() => item.isGift ? setGiftItem(null) : removeItem(item.cartKey)} aria-label={item.isGift ? "Remover brinde" : `Remover ${item.name}`} className="-mr-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground/35 transition-colors hover:bg-foreground/5 hover:text-primary cursor-pointer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div ref={summaryScrollRef} className="scroll-fade flex-shrink-0 border-t border-foreground/5 px-7 py-5 space-y-3 max-h-[58vh] overflow-y-auto">
                {/* O rodapé não rola junto nem se estica: `flex-shrink-0` prende
                    os botões e as bandeiras no fim do painel, e quem cede altura
                    é a lista (min-h-0 acima). Sem isso, lista + rodapé somavam
                    mais que 100% e o CTA caía pra fora da tela. */}
                <div>
                  <button onClick={() => setCouponOpen(!couponOpen)}
                    className={`flex min-h-[40px] items-center justify-between w-full py-2 px-3 cursor-pointer group transition-colors ${
                      appliedCoupon ? "rounded-[var(--radius-card-sm)] border" : ""
                    }`}
                    style={appliedCoupon ? { borderColor: "rgba(18, 146, 76, 0.30)", background: "rgba(18, 146, 76, 0.07)" } : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {appliedCoupon ? (
                        <Check size={13} style={{ color: 'var(--buy-green)' }} />
                      ) : (
                        <Tag size={12} className="text-foreground/45" />
                      )}
                      <span
                        className={appliedCoupon ? "" : "text-foreground/65 group-hover:text-foreground/85 transition-colors"}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700, color: appliedCoupon ? "var(--buy-green-press)" : undefined }}
                      >
                        {appliedCoupon ? `Cupom ${appliedCoupon} aplicado` : "Cupom de desconto"}
                      </span>
                      {appliedCoupon && (
                        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: "var(--buy-green)" }}>
                          −{discountPct}%
                        </span>
                      )}
                    </div>
                    <span
                      className={appliedCoupon ? "" : "text-foreground/35 group-hover:text-foreground/55 transition-colors"}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, color: appliedCoupon ? "var(--buy-green-press)" : undefined, textDecoration: appliedCoupon ? "underline" : undefined, textUnderlineOffset: "3px" }}
                    >
                      {appliedCoupon ? "Alterar" : <ChevronDown size={14} className={`transition-transform duration-300 ${couponOpen ? "rotate-180" : ""}`} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {couponOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between border px-3 py-2" style={{ borderRadius: "var(--radius-button)", borderColor: "rgba(18, 146, 76, 0.30)", background: "rgba(18, 146, 76, 0.07)" }}>
                              <div className="flex items-center gap-2">
                                <Check size={13} style={{ color: "var(--buy-green)" }} />
                                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, color: "var(--buy-green-press)" }}>{appliedCoupon}</span>
                                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "var(--buy-green)" }}>(-{discountPct}%)</span>
                              </div>
                              <button onClick={() => { setAppliedCoupon(null); setCoupon(""); }} aria-label="Remover cupom" className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"><X size={16} aria-hidden="true" /></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Ex: TONANTE10" value={coupon}
                                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                  className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)" }} />
                                <button onClick={handleApplyCoupon} disabled={!coupon.trim()}
                                  className="min-h-[40px] px-3 py-2 text-foreground/60 hover:text-foreground transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
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
                    <span className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Subtotal</span>
                    <span className="text-foreground/75" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>{formatPrice(subtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--buy-green-press)" }}>Desconto ({discountPct}%)</span>
                      <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--buy-green-press)" }}>-{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Frete</span>
                    <span className="text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>Calculado no checkout</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "var(--ink-meta)" }}>Total</span>
                  <span className="text-foreground num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-xl)", fontWeight: 700 }}>{formatPrice(total)}</span>
                </div>

                {/* Dois botões na mesma linha: um embaixo do outro, a ação
                    secundária ganhava a mesma largura da principal e as duas
                    pareciam ter o mesmo peso. Lado a lado, quem manda é a cor. */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-[52px] cursor-pointer items-center justify-center rounded-full border border-foreground/12 bg-transparent px-2 text-center text-foreground/80 transition-colors hover:border-foreground/22 hover:text-foreground"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600 }}
                  >Continuar comprando</button>
                  <button
                    className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full transition-[transform,background-color] duration-200 hover:scale-[1.01] active:scale-[0.98] [background-color:var(--buy-green)] hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)]"
                    style={{
                      color: "#fff",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "15px",
                      fontWeight: 700,
                      boxShadow: "var(--shadow-buy-cta-sm)",
                    }}
                    onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                    aria-label="Revisar pedido"
                  ><ShoppingBag size={17} strokeWidth={2} /> Revisar pedido</button>
                </div>

                <div className="flex items-center justify-center pt-1">
                  <button
                    onClick={() => clearCart()}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-foreground/65 hover:text-primary transition-colors cursor-pointer"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                    aria-label="Limpar carrinho"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Limpar carrinho
                  </button>
                </div>

                {/* Bandeiras por último: é a linha de fecho do painel, a última
                    dúvida antes do checkout ("dá para pagar como?"). Mesma arte
                    do rodapé (/img/pagamentos.png). */}
                <div className="flex justify-center border-t border-foreground/5 pt-4">
                  <ImageWithFallback
                    src="/img/pagamentos.png"
                    alt="Formas de pagamento: Visa, Mastercard, Amex, Hipercard, Elo, Pix e Boleto"
                    className="h-6 w-auto max-w-full object-contain"
                    style={{ opacity: 0.75 }}
                  />
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
                  /* Modal pequeno: são três opções de brinde, não uma vitrine.
                     A versão anterior abria 860px com cards de 210px de foto —
                     tamanho de página de categoria pra uma escolha que se faz
                     num piscar. Aqui cada opção é uma LINHA: foto pequena,
                     nome, R$ 0,00 e o estado de seleção na ponta. */
                  className="flex max-h-[88dvh] w-full max-w-[420px] flex-col overflow-hidden rounded-t-[22px] md:rounded-[var(--radius-card-lg)]"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                    boxShadow: "var(--shadow-float)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-1.5 text-primary">
                        <Gift size={13} strokeWidth={2.4} />
                        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                          Brinde desbloqueado
                        </span>
                      </div>
                      <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "21px", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                        Escolha seu presente
                      </h3>
                      <p className="mt-1.5 text-ink-muted" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: 1.45 }}>
                        Sua compra passou de {formatPrice(GIFT_THRESHOLD)}. Um item entra no carrinho zerado.
                      </p>
                    </div>
                    <button
                      onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); }}
                      aria-label="Fechar oferta de brinde"
                      className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:bg-foreground/5 hover:text-ink-strong"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div ref={giftScrollRef} className="scroll-fade min-h-0 flex-1 overflow-y-auto px-3 pb-2">
                    {giftOptions.map((product, index) => {
                      const isSelected = selectedGiftId === product.id;
                      return (
                        <div key={`gift-option-${product.id}`}>
                          {index > 0 && (
                            <div className="mx-3 h-px" style={{ background: "rgba(var(--foreground-rgb), 0.08)" }} aria-hidden="true" />
                          )}
                        <button
                          onClick={() => setSelectedGiftId(product.id)}
                          aria-pressed={isSelected}
                          className="my-1 flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.05]"
                        >
                          <div
                            className="relative h-14 w-14 flex-shrink-0 overflow-hidden"
                            style={{ borderRadius: "8px", background: "linear-gradient(158deg, #fbfbfc 0%, #f4f5f6 45%, #eaecee 100%)" }}
                          >
                            <ImageWithFallback src={getPrimaryProductImage(product)} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-1.5" style={{ mixBlendMode: "multiply" }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-ink-strong" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 500, lineHeight: 1.35 }}>
                              {product.name}
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "rgba(var(--foreground-rgb), 0.35)", textDecoration: "line-through" }}>
                                {product.price}
                              </span>
                              <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 700, color: "var(--buy-green)" }}>
                                R$ 0,00
                              </span>
                            </div>
                          </div>
                          {/* Estado de seleção como rádio: três linhas iguais e
                              uma escolha só — a marca tem que dizer "esta" sem
                              precisar de palavra. */}
                          <span
                            aria-hidden="true"
                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors"
                            style={{
                              border: isSelected ? "none" : "1.5px solid rgba(var(--foreground-rgb), 0.18)",
                              background: isSelected ? "var(--buy-green)" : "transparent",
                              color: "#fff",
                            }}
                          >
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </span>
                        </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-edge-subtle px-6 py-4">
                    <button
                      onClick={() => { setGiftModalOpen(false); setGiftDismissed(true); setSelectedGiftId(null); }}
                      className="inline-flex min-h-[40px] cursor-pointer items-center text-ink-muted transition-colors hover:text-ink"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
                    >
                      Agora não
                    </button>
                    <CTAButton variant="buy" size="md" onClick={confirmGift} disabled={!selectedGiftId} className="cursor-pointer disabled:cursor-not-allowed">
                      Adicionar presente
                    </CTAButton>
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
