import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, ChevronDown, Truck,
  Check, Share2, MapPin, CreditCard, Banknote, QrCode,
  Loader2, ArrowUpRight, Zap, X, Clock, Info,
  Rocket, CalendarDays, ShieldCheck,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";
import {
  getCatalogHref, getProductImages, getPrimaryProductImage,
  getProductSubcategory, getProductSwatches,
  getVisibleCatalogProducts,
} from "./productPresentation";
import { toast } from "sonner";
import { getInstallmentCount, getInstallmentValue } from "./productEnhancements";
import { getPreOrderInfo } from "./PreOrderData";
import type { PreOrderInfo } from "./PreOrderData";
import { PreOrderBanner, useCountdown } from "./PreOrderBanner";
import { CTAButton, DiscountBadge, QtyStepper } from "./section";
import { SEO } from "./SEO";
import { getProductSlug, getProductUrl } from "../lib/slug";
import { isFotoAmbientada } from "./photoBackdrop";
import { QuadroFoto } from "./QuadroFoto";
import { TimbrePlayer } from "./TimbrePlayer";
import { ProductCard } from "./ProductCard";
import { LuthierBlock } from "./ProductMusicBlocks";

/* ── helpers ─────────────────────────────────────────── */

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

const pad = (n: number) => String(n).padStart(2, "0");

function getRemainingUnits(product: { id: number; inStock?: boolean; reviews?: number; rating?: number }) {
  if (product.inStock === false) return 0;

  const reviewSeed = product.reviews ?? 0;
  const ratingSeed = Math.round((product.rating ?? 0) * 10);
  return 4 + ((product.id * 7 + reviewSeed + ratingSeed) % 9);
}

function getStockLabel(product: { id: number; inStock?: boolean; reviews?: number; rating?: number }) {
  const remainingUnits = getRemainingUnits(product);
  if (remainingUnits <= 0) return "Sem estoque";
  if (remainingUnits === 1) return "1 unidade restante";
  return `${remainingUnits} unidades restantes`;
}

/* ── shipping mock ─────────────────────────────────────── */

type ShippingOption = {
  id: string;
  name: string;
  price: string;
  isFree: boolean;
  days: string;
};

function calcShipping(digits: string, productPrice: number): ShippingOption[] {
  const seed = parseInt(digits.slice(0, 3)) || 10;
  const options: ShippingOption[] = [];

  if (productPrice >= 299) {
    options.push({
      id: "free",
      name: "Frete Grátis",
      price: "R$ 0,00",
      isFree: true,
      days: `${6 + (seed % 4)} dias úteis`,
    });
  }

  options.push({
    id: "pac",
    name: "Correios PAC",
    price: `R$ ${(14.9 + (seed % 6)).toFixed(2).replace(".", ",")}`,
    isFree: false,
    days: `${10 + (seed % 5)} dias úteis`,
  });

  options.push({
    id: "sedex",
    name: "SEDEX",
    price: `R$ ${(29.9 + (seed % 8)).toFixed(2).replace(".", ",")}`,
    isFree: false,
    days: `${2 + (seed % 3)} dias úteis`,
  });

  return options;
}

/* ═══════════════════════════════════════════════════════
   GALLERY
   ═══════════════════════════════════════════════════════ */

function ProductGallery({ images, name, isDark }: { images: string[]; name: string; isDark: boolean }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  const ambientadaAtiva = isFotoAmbientada(images[active]);

  return (
    <div className="flex w-full flex-col items-stretch gap-4 overflow-visible md:flex-row md:items-start md:gap-4">
      {images.length > 1 && (
        <div className="hidden md:flex md:flex-col md:gap-3 md:max-h-[640px] md:overflow-y-auto md:pr-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={`vthumb-${i}`}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-[68px] h-[68px] xl:w-[78px] xl:h-[78px] overflow-hidden border transition-all cursor-pointer ${i === active ? "border-primary ring-1 ring-primary/35" : "border-foreground/10 hover:border-foreground/30"}`}
              style={{ borderRadius: "var(--radius-card)", background: "var(--surface-3)" }}
              aria-label={`Ver imagem ${i + 1}`}
            >
              {/* Regra do quadro (vale aqui e na foto grande): recorte de
                  estúdio aparece inteiro e o branco dele some no fundo do
                  card; foto ambientada PREENCHE o quadro, senão o corte da
                  foto fica visível dentro dele. */}
              <ImageWithFallback
                src={img}
                alt={`${name} ${i + 1}`}
                className={
                  isFotoAmbientada(img)
                    ? "w-full h-full object-cover"
                    : "w-full h-full object-contain p-1.5"
                }
                style={isFotoAmbientada(img) || isDark ? undefined : { mixBlendMode: "multiply" }}
              />
            </button>
          ))}
        </div>
      )}
      <div
        className="relative w-full max-w-full md:flex-1 aspect-square overflow-hidden group cursor-zoom-in"
        style={{
          borderRadius: "var(--radius-card-lg)",
          background: isDark
            ? "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.10) 0%, rgba(var(--foreground-rgb), 0.03) 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)",
          border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.08)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(var(--foreground-rgb), 0.05), 0 24px 60px -20px rgba(0,0,0,0.4)"
            : "inset 0 1px 0 rgba(var(--foreground-rgb), 0.6), 0 24px 60px -20px rgba(0,0,0,0.08)",
        }}
        onClick={() => setZoomed(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.06) 0%, transparent 55%)",
            borderRadius: "var(--radius-card-lg)",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
            /* O `multiply` da foto precisa de algo opaco atrás pra sumir com o
               branco do recorte. Enquanto o motion anima o fade ele isola o
               grupo, e aí o blend achava só transparência: o fundo da foto
               virava um quadrado branco que só sumia quando a animação
               terminava. Pintar aqui o mesmo cinza do quadro — opaco, não em
               alpha — resolve no primeiro quadro e não depende do tempo da
               animação. Foto ambientada cobre isto tudo. */
            style={
              isDark || ambientadaAtiva
                ? undefined
                : { isolation: "isolate", background: "linear-gradient(135deg, #f5f5f5 0%, #fcfcfc 100%)" }
            }
          >
            <QuadroFoto
              src={images[active]}
              alt={name}
              padding="p-4 md:p-5"
              semMultiply={isDark}
              className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
	            <button
	              onClick={(e) => { e.stopPropagation(); prev(); }}
	              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 md:w-9 md:h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-black/45 hover:text-ink-strong md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
	              aria-label="Imagem anterior"
	            >
              <ChevronLeft size={17} />
            </button>
	            <button
	              onClick={(e) => { e.stopPropagation(); next(); }}
	              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 md:w-9 md:h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-black/45 hover:text-ink-strong md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
	              aria-label="Próxima imagem"
	            >
              <ChevronRight size={17} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <span
            className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/30 backdrop-blur-md text-ink opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderRadius: "var(--radius-pill)", fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)" }}
          >
            {active + 1} / {images.length}
          </span>
        )}
      </div>

	      {images.length > 1 && (
	        <div className="relative z-10 flex items-center justify-center gap-2 md:hidden" aria-label="Indicadores da galeria">
	          {images.map((_, i) => (
	            <button
	              key={i}
	              onClick={() => setActive(i)}
	              className={`h-2.5 w-2.5 rounded-full border transition-all ${
	                i === active
	                  ? "border-foreground bg-foreground"
	                  : "border-foreground/70 bg-transparent"
	              }`}
	              aria-label={`Ver imagem ${i + 1}`}
	              aria-current={i === active ? "true" : undefined}
	            />
	          ))}
	        </div>
	      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 cursor-zoom-out"
              onClick={() => setZoomed(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-16 md:inset-10 md:px-12 md:py-10"
              onClick={() => setZoomed(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
                className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-ink backdrop-blur-md transition-colors hover:bg-white/16 hover:text-ink-strong md:right-6 md:top-6"
                aria-label="Fechar imagem ampliada"
              >
                <X size={18} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink backdrop-blur-md transition-colors hover:bg-white/16 hover:text-ink-strong md:left-6 md:h-12 md:w-12"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink backdrop-blur-md transition-colors hover:bg-white/16 hover:text-ink-strong md:right-6 md:h-12 md:w-12"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <img
                src={images[active]}
                alt={name}
                className="max-h-full max-w-full object-contain"
                style={{ borderRadius: "var(--radius-card)" }}
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md md:bottom-6">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActive(i); }}
                      className={`h-2.5 w-2.5 rounded-full border transition-all ${
                        i === active ? "border-edge bg-white" : "border-edge-strong bg-transparent"
                      }`}
                      aria-label={`Ver imagem ${i + 1}`}
                      aria-current={i === active ? "true" : undefined}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COUNTDOWN — promo timer
   ═══════════════════════════════════════════════════════ */

function CountdownTimer() {
  const target = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 0);
    return t.getTime();
  }, []);

  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const TimeBox = ({ value }: { value: string }) => (
    <span
      className="inline-flex items-center justify-center min-w-[26px] px-1.5 py-1 bg-foreground text-background font-bold tabular-nums"
      style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
    >
      {value}
    </span>
  );

  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 border border-foreground/10 bg-foreground/[0.04]"
      style={{ borderRadius: "var(--radius-button)" }}
    >
      <Clock size={13} className="text-primary flex-shrink-0" strokeWidth={2} />
      <span
        className="text-foreground/65 font-medium flex-1 truncate"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
      >
        Oferta encerra em
      </span>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <TimeBox value={pad(time.h)} />
        <span className="text-foreground/30 font-bold mx-0.5">:</span>
        <TimeBox value={pad(time.m)} />
        <span className="text-foreground/30 font-bold mx-0.5">:</span>
        <TimeBox value={pad(time.s)} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AUTO SHIPPING CALCULATOR
   ═══════════════════════════════════════════════════════ */

function AutoShippingCalculator({ productPrice }: { productPrice: number }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setOptions(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOptions(null);
    const timer = setTimeout(() => {
      setOptions(calcShipping(digits, productPrice));
      setLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [cep, productPrice]);

  const digits = cep.replace(/\D/g, "");
  const showHint = digits.length > 0 && digits.length < 8 && !loading;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={13} className="text-foreground/40" strokeWidth={1.8} />
        <span
          className="text-foreground/60 font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.08em" }}
        >
          CONSULTAR FRETE
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          className="w-full text-foreground placeholder-foreground/35 px-4 py-3 pr-11 focus:outline-none transition-all"
          style={{
            // input claro padrão da casa — foco âmbar (era cinza escuro + foco verde)
            borderRadius: "var(--radius-card-sm)",
            border: "1px solid var(--border)",
            background: "#fff",
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-sm)",
            letterSpacing: "0.02em",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--amber)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 size={15} className="animate-spin text-primary" />
          ) : digits.length === 8 && options ? (
            <Check size={15} className="text-green-500" />
          ) : (
            <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
              {digits.length}/8
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-foreground/40 mt-2"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            Digite os 8 dígitos para ver as opções
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {options && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5">
              {options.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Truck
                      size={13}
                      className={opt.isFree ? "text-green-500" : "text-foreground/35"}
                      strokeWidth={1.8}
                    />
                    <div className="min-w-0">
                      <p
                        className={`truncate ${opt.isFree ? "text-green-500 font-semibold" : "text-foreground/75 font-medium"}`}
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                      >
                        {opt.name}
                      </p>
                      <p
                        className="text-foreground/40"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                      >
                        {opt.days}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 ml-3 ${opt.isFree ? "text-green-500 font-bold" : "text-foreground font-semibold"}`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                  >
                    {opt.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAYMENT MODAL
   ═══════════════════════════════════════════════════════ */

function PaymentModal({ open, onClose, priceNum }: { open: boolean; onClose: () => void; priceNum: number }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  const pixPrice = priceNum * 0.9;
  const installments = Array.from({ length: getInstallmentCount(priceNum) }, (_, i) => ({
    n: i + 1,
    value: priceNum / (i + 1),
  }));

  // portal: o card de compra é sticky + overflow-hidden — sem portal o fixed
  // quebra (modal renderizava preso no meio da página)
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110]"
            style={{ background: "rgba(17,17,19,0.68)", backdropFilter: "blur(5px)" }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[111] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="pointer-events-auto w-full max-w-[520px] overflow-hidden rounded-t-[20px] md:rounded-[18px]"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-float)",
                maxHeight: "min(85vh, 720px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-6 py-4 border-b border-foreground/8"
                style={{ borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}
              >
                <h3
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 500 }}
                >
                  Formas de pagamento
                </h3>
                <button
                  onClick={onClose}
                  className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-foreground/8 text-foreground/45 hover:text-foreground transition-all cursor-pointer"
                  aria-label="Fechar"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-5 space-y-6" style={{ maxHeight: "calc(85vh - 64px)" }}>
                {/* PIX */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/12 flex items-center justify-center flex-shrink-0">
                      <QrCode size={16} className="text-green-500" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                      >
                        PIX
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                      >
                        Aprovação imediata
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 font-bold flex-shrink-0"
                      style={{ borderRadius: "var(--radius)", fontSize: "var(--text-caption)", fontFamily: "var(--font-family-inter)", background: "rgba(17, 17, 17, 0.08)", color: "var(--amber-deep)" }}
                    >
                      10% OFF
                    </span>
                  </header>
                  <div
                    className="flex items-baseline justify-between px-4 py-3"
                    style={{ borderRadius: "var(--radius-button)", background: "rgba(17, 17, 17, 0.05)", border: "1px solid rgba(17, 17, 17, 0.08)" }}
                  >
                    <span
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                    >
                      Total à vista
                    </span>
                    <span
                      className="num"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--amber-deep)" }}
                    >
                      {formatBRL(pixPrice)}
                    </span>
                  </div>
                </section>

                {/* Cartão */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                      <CreditCard size={16} className="text-primary" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                      >
                        Cartão de crédito
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                      >
                        Visa · Master · Elo · Amex · Hipercard
                      </p>
                    </div>
                  </header>
                  <div
                    className="overflow-hidden border border-foreground/8"
                    style={{ borderRadius: "var(--radius-button)" }}
                  >
                    <div className="grid grid-cols-2 divide-x divide-foreground/6">
                      <div className="divide-y divide-foreground/6">
                        {installments.slice(0, 6).map((inst) => (
                          <div
                            key={inst.n}
                            className="flex items-center justify-between px-3.5 py-2.5"
                          >
                            <span
                              className="text-foreground/45 font-medium"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                            >
                              {inst.n}×
                            </span>
                            <span
                              className="text-foreground font-semibold tabular-nums"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                            >
                              {formatBRL(inst.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="divide-y divide-foreground/6">
                        {installments.slice(6).map((inst) => (
                          <div
                            key={inst.n}
                            className="flex items-center justify-between px-3.5 py-2.5"
                          >
                            <span
                              className="text-foreground/45 font-medium"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                            >
                              {inst.n}×
                            </span>
                            <span
                              className="text-foreground font-semibold tabular-nums"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                            >
                              {formatBRL(inst.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p
                    className="text-foreground/40 mt-2.5 flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    <Info size={11} strokeWidth={1.8} />
                    Todas as parcelas sem juros
                  </p>
                </section>

                {/* Boleto */}
                <section>
                  <header className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                      <Banknote size={16} className="text-foreground/55" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-foreground font-semibold"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                      >
                        Boleto bancário
                      </h4>
                      <p
                        className="text-foreground/45"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                      >
                        Vencimento em 3 dias úteis
                      </p>
                    </div>
                  </header>
                  <div
                    className="flex items-baseline justify-between px-4 py-3 border border-foreground/8 bg-foreground/[0.02]"
                    style={{ borderRadius: "var(--radius-button)" }}
                  >
                    <span
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-foreground num"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-lg)", fontWeight: 700 }}
                    >
                      {formatBRL(priceNum)}
                    </span>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ═══════════════════════════════════════════════════════
   STICKY PRICE CARD
   ═══════════════════════════════════════════════════════ */

type StickyCardProps = {
  product: any;
  qty: number;
  setQty: (q: number) => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  addedToCart: boolean;
  pixPrice: number;
  installment: number;
  discount: number;
};

function StickyPriceCard({
  product, qty, setQty, onBuyNow, onAddToCart, addedToCart, pixPrice, installment, discount,
}: StickyCardProps) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const inStock = product.inStock !== false;
  const stockLabel = getStockLabel(product);

  return (
    <>
      <div
        className="p-5 lg:p-6 relative overflow-hidden"
        data-purchase-card="product-page"
        style={{
          // card branco premium — borda + sombra suave, sem véu nem glow PCYES
          borderRadius: "var(--radius-card-lg)",
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 18px 44px -30px rgba(17,17,17,0.28)",
        }}
      >
        {/* Promo Timer */}
        <div className="relative mb-5">
          <CountdownTimer />
        </div>

        {/* Price block */}
        <div className="relative mb-5">
          {product.oldPrice && (
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="line-through leading-none"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: "rgba(var(--foreground-rgb), 0.38)" }}
              >
                {product.oldPrice}
              </span>
              {discount > 0 && <DiscountBadge percent={discount} size="sm" />}
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-foreground leading-none num"
              style={{
                // preço é balcão, não palco: Hanken tabular (V2 §2.2)
                fontFamily: "var(--font-family-inter)",
                fontSize: "clamp(28px, 3vw, 32px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {formatBRL(pixPrice)}
            </span>
          </div>

          <p
            className="text-foreground/55 mb-2.5"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            no <span className="font-semibold" style={{ color: "var(--amber-deep)" }}>PIX</span> com{" "}
            <span className="font-semibold" style={{ color: "var(--amber-deep)" }}>10% de desconto</span>
          </p>

          <div className="h-px bg-foreground/6 my-3" />

          <p
            className="text-foreground/65"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: "1.55" }}
          >
            ou <span className="text-foreground font-semibold">{product.price}</span> em até{" "}
            <span className="text-foreground font-semibold num">{getInstallmentCount(product.priceNum)}× {formatBRL(installment)}</span> sem juros
          </p>

          <button
            onClick={() => setPaymentOpen(true)}
            className="mt-2.5 inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
          >
            Ver opções de pagamento
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`relative flex w-2 h-2`}>
            {inStock && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-65 animate-ping" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${inStock ? "bg-green-500" : "bg-foreground/30"}`} />
          </span>
          <span
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: inStock ? "var(--ink-meta)" : "var(--ink-subtle)" }}
          >
            {inStock ? `${stockLabel} · envio em 24h` : "Sem estoque"}
          </span>
        </div>

        {/* Qty selector */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-foreground/55 font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.08em" }}
          >
            QUANTIDADE
          </span>
          <QtyStepper value={qty} onChange={setQty} disabled={!inStock} />
        </div>

        {/* CTAs */}
        <div className="relative flex flex-col gap-2 mb-5">
          <CTAButton
            variant="buy"
            size="lg"
            block
            onClick={onBuyNow}
            disabled={!inStock}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} strokeWidth={2.2} />
            Comprar agora
          </CTAButton>
        </div>

        <div className="h-px bg-foreground/6 mb-5" />

        {/* Shipping */}
        <div className="mb-5">
          <AutoShippingCalculator productPrice={product.priceNum} />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        priceNum={product.priceNum}
      />
    </>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function formatPreOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function MobilePurchaseFlow({
  product, qty, setQty, onBuyNow, pixPrice, installment, discount, onSeeDescription, shippingRef, preOrderInfo,
}: StickyCardProps & { onSeeDescription: () => void; shippingRef?: React.RefObject<HTMLDivElement>; preOrderInfo?: PreOrderInfo | null }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const inStock = product.inStock !== false;
  const stockLabel = getStockLabel(product);

  const isPreOrder = !!preOrderInfo;
  const countdown = useCountdown(preOrderInfo?.releaseDate ?? new Date().toISOString());
  const reservedPct = preOrderInfo
    ? Math.min(100, Math.round((preOrderInfo.reservedUnits / preOrderInfo.totalUnits) * 100))
    : 0;
  const remaining = preOrderInfo
    ? Math.max(0, preOrderInfo.totalUnits - preOrderInfo.reservedUnits)
    : 0;
  const preOrderSoldOut = isPreOrder && remaining <= 0;
  const buyDisabled = isPreOrder ? preOrderSoldOut : !inStock;

  return (
    <section className="order-4 lg:hidden w-full mt-2 mb-10" data-purchase-card="mobile-product-flow">
      <div className="py-5 border-y border-foreground/8">
        {isPreOrder && (
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{
                background: "var(--gradient-preorder-orange)",
                color: "#fff",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                boxShadow: "var(--shadow-brand-pill)",
              }}
            >
              <Rocket size={11} strokeWidth={2.6} />
              Pré-venda
            </span>
            <span
              className="text-foreground/45"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {preOrderInfo!.highlight}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mb-3">
          {isPreOrder ? (
            <span />
          ) : product.oldPrice ? (
            <div className="flex items-center gap-2">
              <span
                className="text-foreground/35 line-through"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                {product.oldPrice}
              </span>
              {discount > 0 && <DiscountBadge percent={discount} size="sm" style={{ fontSize: "var(--text-caption)" }} />}
            </div>
          ) : <span />}

          {isPreOrder ? (
            <span
              className="text-[#f97316]"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
            >
              {preOrderSoldOut ? "Reservas esgotadas" : "Reserva garantida"}
            </span>
          ) : (
            <span
              className={inStock ? "text-green-500" : "text-foreground/45"}
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
            >
              {inStock ? stockLabel : "Sem estoque"}
            </span>
          )}
        </div>

        <div className="mb-3">
          {isPreOrder ? (
            <>
              <p
                className="text-foreground/45 mb-1"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Preço de pré-venda
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-foreground leading-none num"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "clamp(30px, 8vw, 38px)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {preOrderInfo!.preOrderPrice ?? product.price}
                </span>
                {preOrderInfo!.preOrderPrice && preOrderInfo!.preOrderPrice !== product.price && (
                  <span
                    className="line-through text-foreground/35"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                  >
                    {product.price}
                  </span>
                )}
              </div>
              <p
                className="text-foreground/60 mt-1"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.55" }}
              >
                Pagamento parcelado · sem cobrança até o envio
              </p>
            </>
          ) : (
            <>
              <p
                className="text-foreground leading-none mb-2 num"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "clamp(30px, 8vw, 38px)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {formatBRL(pixPrice)}
              </p>
              <p
                className="text-foreground/60"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.55" }}
              >
                à vista no <span className="text-[#4CAF50] font-bold">PIX</span> com{" "}
                <span className="text-[#4CAF50] font-bold">10% de desconto</span>
              </p>
            </>
          )}
        </div>

        {!isPreOrder && (
          <p
            className="text-foreground/68 mb-3"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.6" }}
          >
            ou <span className="text-foreground font-bold">{product.price}</span> em até{" "}
            <span className="text-foreground font-bold num">{getInstallmentCount(product.priceNum)}x de {formatBRL(installment)}</span> sem juros no cartão
          </p>
        )}

        {!isPreOrder && (
          <button
            onClick={() => setPaymentOpen(true)}
            className="mb-5 inline-flex items-center gap-1 text-foreground underline underline-offset-4 decoration-foreground/30 cursor-pointer"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
          >
            Ver opções de pagamento
            <ArrowUpRight size={12} />
          </button>
        )}

        {isPreOrder && (
          <div className="mt-4 mb-5">
            {/* countdown */}
            <p
              className="text-foreground/45 mb-2"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {countdown.isLive ? "Já disponível" : "Lança em"}
            </p>
            {!countdown.isLive && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { v: countdown.days, l: "Dias" },
                  { v: countdown.hours, l: "Horas" },
                  { v: countdown.minutes, l: "Min" },
                  { v: countdown.seconds, l: "Seg" },
                ].map((unit) => (
                  <div
                    key={unit.l}
                    className="flex flex-col items-center justify-center py-2.5"
                    style={{
                      background: "rgba(var(--foreground-rgb), 0.04)",
                      border: "1px solid rgba(249,115,22,0.18)",
                      borderRadius: "var(--radius-card-sm)",
                    }}
                  >
                    <span
                      className="text-foreground tabular-nums leading-none"
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {pad2(unit.v)}
                    </span>
                    <span
                      className="text-foreground/40 mt-1"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-caption)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {unit.l}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* release date */}
            <div className="flex items-center gap-2 mt-4">
              <CalendarDays size={13} className="text-foreground/55" strokeWidth={2.2} />
              <span
                className="text-foreground/65"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
              >
                Entrega prevista:{" "}
                <span className="text-foreground">{formatPreOrderDate(preOrderInfo!.releaseDate)}</span>
              </span>
            </div>

            {/* reservations progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-foreground/55"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  // RESERVAS
                </span>
                <span
                  className="text-foreground tabular-nums"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
                >
                  {preOrderInfo!.reservedUnits.toLocaleString("pt-BR")} / {preOrderInfo!.totalUnits.toLocaleString("pt-BR")}
                </span>
              </div>
              <div
                className="relative h-2 w-full overflow-hidden"
                style={{ background: "rgba(var(--foreground-rgb), 0.08)", borderRadius: "var(--radius-pill)" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${reservedPct}%`,
                    background: "var(--gradient-buy)",
                    borderRadius: "var(--radius-pill)",
                  }}
                />
              </div>
              <p
                className="text-foreground/45 mt-1.5"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                {remaining > 0
                  ? `Restam ${remaining.toLocaleString("pt-BR")} reservas`
                  : "Reservas esgotadas"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span
            className="text-foreground/50 font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.08em" }}
          >
            QUANTIDADE
          </span>
          <QtyStepper
            value={qty}
            onChange={setQty}
            size="lg"
            shape="pill"
            disabled={isPreOrder ? preOrderSoldOut : !inStock}
          />
        </div>

        <CTAButton
          variant={isPreOrder ? "preorder" : "buy"}
          size="lg"
          block
          onClick={onBuyNow}
          disabled={buyDisabled}
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          {isPreOrder ? (
            <><Rocket size={15} strokeWidth={2.4} className="flex-shrink-0" /> {preOrderSoldOut ? "Esgotado" : "Comprar agora"}</>
          ) : (
            <><Zap size={15} strokeWidth={2.4} fill="currentColor" className="flex-shrink-0" /> Comprar agora</>
          )}
        </CTAButton>

        {isPreOrder && (
          <div className="mt-4 flex items-start gap-2">
            <ShieldCheck size={13} className="text-[#22c55e] mt-0.5 flex-shrink-0" strokeWidth={2.2} />
            <p
              className="text-foreground/55"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", lineHeight: 1.5 }}
            >
              Você pode cancelar a reserva a qualquer momento antes do envio.
              Cobrança só acontece no despacho do produto.
            </p>
          </div>
        )}
      </div>

      <div ref={shippingRef} className="py-5 border-b border-foreground/8" data-mobile-shipping-checkpoint>
        <AutoShippingCalculator productPrice={product.priceNum} />
      </div>

      <div className="py-5 border-b border-foreground/8">
        <AboutProduct product={product} onSeeDescription={onSeeDescription} />
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        priceNum={product.priceNum}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   ABOUT PRODUCT (middle column bullets + ver mais)
   ═══════════════════════════════════════════════════════ */

function AboutProduct({ product, onSeeDescription }: { product: any; onSeeDescription: () => void }) {
  const bullets: string[] = product.features?.length
    ? product.features
    : (product.description ?? "")
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);

  if (!bullets.length) return null;

  return (
    <section>
      <p className="label mb-4" style={{ color: "var(--amber-deep)" }}>
        Sobre o produto
      </p>

      <ul key={product.id} className="space-y-3">
        {bullets.map((bullet, i) => (
          <motion.li
            key={`${i}-${bullet.slice(0, 20)}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: Math.min(i, 5) * 0.025 }}
            className="flex items-start gap-3"
          >
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-foreground/[0.06] flex items-center justify-center mt-1">
              <Check size={9} className="text-primary" strokeWidth={2.5} />
            </span>
            <span
              className="text-foreground/65 leading-relaxed"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: "1.65" }}
            >
              {bullet}
            </span>
          </motion.li>
        ))}
      </ul>

      <button
        onClick={onSeeDescription}
        className="mt-4 inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600 }}
      >
        Ver mais
        <ChevronRight size={13} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
      </button>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   REVIEWS SECTION
   ═══════════════════════════════════════════════════════ */

function ReviewsSection({ product, isDark }: { product: any; isDark: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<"recent" | "relevant" | "photos">("recent");
  const [activeStarFilter, setActiveStarFilter] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{ reviewIndex: number; imageIndex: number } | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");

  // reviews ilustrativas de loja de música (substituem as do template PCYES
  // que falavam de setup/cabo/monitor com foto de PC)
  const reviews = [
    {
      id: 1,
      user: "Ricardo M.",
      rating: 5,
      date: "24 Mar 2026",
      comment: "Acabamento impecável e o som é quente, encorpado. Regulagem veio boa de fábrica — afinei e já saí tocando. Recomendo demais.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505841993706-c8d90b412bc4?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 12
    },
    {
      id: 2,
      user: "Juliana S.",
      rating: 5,
      date: "15 Mar 2026",
      comment: "Chegou super rápido e muito bem embalado, com proteção nas tarraxas. A cor ao vivo é ainda mais bonita que nas fotos.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 8
    },
    {
      id: 3,
      user: "Fabio L.",
      rating: 4,
      date: "02 Mar 2026",
      comment: "Ótimo custo-benefício pra quem está começando. Só troquei as cordas por um encordoamento mais leve e ficou perfeito pros meus alunos.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 4
    },
    {
      id: 4,
      user: "Marina A.",
      rating: 5,
      date: "21 Fev 2026",
      comment: "Toco em roda de samba todo fim de semana e ele aguenta firme. Projeção ótima, não some no meio dos outros instrumentos.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1549213783-8284d0336c4f?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 19
    },
    {
      id: 5,
      user: "Pedro C.",
      rating: 5,
      date: "08 Fev 2026",
      comment: "Meu primeiro instrumento foi um Tonante nos anos 90. Comprei esse pro meu filho começar — a história continua na família.",
      verified: true,
      likes: 7
    },
    {
      id: 6,
      user: "Camila R.",
      rating: 4,
      date: "19 Jan 2026",
      comment: "Instrumento muito bom pelo preço. O braço é confortável e ficou estável depois da primeira semana de afinação. Valeu cada centavo.",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1584402617825-1a58712ae0b0?q=80&w=900&auto=format&fit=crop",
      ],
      likes: 5
    },
  ];

  const mediaReviews = reviews.filter((review) => review.images?.length);
  const customerPhotos = mediaReviews.flatMap((review) =>
    review.images!.map((image, imageIndex) => ({
      image,
      imageIndex,
      reviewIndex: reviews.findIndex((item) => item.id === review.id),
      review,
    })),
  );
  const sortedReviews = activeFilter === "photos"
    ? mediaReviews
    : activeFilter === "relevant"
      ? [...reviews].sort((a, b) => b.likes - a.likes)
      : [...reviews].sort((a, b) => a.id - b.id);
  const filteredReviews = activeStarFilter ? sortedReviews.filter(r => r.rating === activeStarFilter) : sortedReviews;
  const reviewsPerPage = 4;
  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));
  const visibleReviews = filteredReviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);
  const selectedReview = selectedMedia ? reviews[selectedMedia.reviewIndex] : null;
  const selectedImage = selectedReview?.images?.[selectedMedia?.imageIndex ?? 0];

  const openMedia = (reviewIndex: number, imageIndex: number) => {
    setSelectedMedia({ reviewIndex, imageIndex });
  };

  const moveMedia = (direction: 1 | -1) => {
    if (!selectedMedia) return;
    const images = reviews[selectedMedia.reviewIndex]?.images ?? [];
    if (images.length <= 1) return;
    const nextImageIndex = (selectedMedia.imageIndex + direction + images.length) % images.length;
    setSelectedMedia({ reviewIndex: selectedMedia.reviewIndex, imageIndex: nextImageIndex });
  };

  const moveReview = (direction: 1 | -1) => {
    if (!selectedMedia) return;
    const reviewOrder = mediaReviews.map((review) => reviews.findIndex((item) => item.id === review.id));
    const currentIndex = reviewOrder.indexOf(selectedMedia.reviewIndex);
    const nextIndex = (currentIndex + direction + reviewOrder.length) % reviewOrder.length;
    setSelectedMedia({ reviewIndex: reviewOrder[nextIndex], imageIndex: 0 });
  };

  const goToReviewPage = (page: number) => {
    setReviewPage(page);
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const filters = [
    { key: "recent" as const, label: "Recentes" },
    { key: "relevant" as const, label: "Mais relevantes" },
    { key: "photos" as const, label: "Com fotos" },
  ];

  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(e.target as Node)) {
        setRatingDropdownOpen(false);
      }
    };
    if (ratingDropdownOpen) window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [ratingDropdownOpen]);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 border-t border-foreground/5 bg-foreground/[0.01] scroll-mt-[96px]">
      <div className="max-w-[1760px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Summary */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-2xl)", fontWeight: 600 }}>
              Avaliações de Clientes
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-foreground" style={{ fontSize: "var(--text-h2)", fontWeight: 700, fontFamily: "var(--font-family-figtree)" }}>
                {product.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} fill="currentColor" />
                  ))}
                </div>
                <p className="text-foreground/45" style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-family-inter)" }}>
                  {product.reviews} avaliações
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = star === 5 ? 85 : star === 4 ? 12 : 1;
                return (
                  <button key={star} onClick={() => { setActiveStarFilter(activeStarFilter === star ? null : star); setReviewPage(1); }} className={`flex w-full items-center gap-3 p-1.5 rounded transition-colors cursor-pointer ${activeStarFilter === star ? 'bg-foreground/[0.06]' : 'hover:bg-foreground/5'}`}>
                    <span className="text-foreground/45 min-w-[12px]" style={{ fontSize: "var(--text-caption)", fontWeight: 600 }}>{star}</span>
                    <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-[#FFB800]"
                      />
                    </div>
                    <span className="text-foreground/30 min-w-[32px] text-right" style={{ fontSize: "var(--text-caption)" }}>{percentage}%</span>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setReviewModalOpen(true)} className="w-full mt-10 py-3.5 border border-foreground/10 hover:border-foreground/25 text-foreground transition-all font-semibold cursor-pointer" style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-sm)" }}>
              Escrever uma avaliação
            </button>
          </div>

          {/* List */}
          <div className="flex-1">
            <div className="mb-8 pb-5 border-b border-foreground/5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setActiveFilter(filter.key);
                        setReviewPage(1);
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                        activeFilter === filter.key
                          ? "bg-foreground text-background"
                          : "bg-foreground/5 text-foreground/45 hover:text-foreground hover:bg-foreground/10"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div ref={ratingDropdownRef} className="relative ml-auto">
                  <button
                    onClick={() => setRatingDropdownOpen((v) => !v)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      activeStarFilter
                        ? "bg-foreground/[0.08] text-primary border border-primary/35"
                        : "bg-foreground/5 text-foreground/65 hover:text-foreground hover:bg-foreground/10 border border-transparent"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={ratingDropdownOpen}
                  >
                    {activeStarFilter ? (
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} className="fill-current" /> {activeStarFilter} estrelas
                      </span>
                    ) : (
                      "Qualificação"
                    )}
                    <ChevronDown size={13} className={`transition-transform ${ratingDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {ratingDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-30 mt-2 min-w-[180px] overflow-hidden rounded-card-sm border border-edge shadow-[var(--shadow-pop)]"
                        style={{ background: "var(--surface-2)" }}
                        role="listbox"
                      >
                        <button
                          onClick={() => { setActiveStarFilter(null); setReviewPage(1); setRatingDropdownOpen(false); }}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                            activeStarFilter === null ? "bg-foreground/[0.08] text-primary" : "text-ink hover:bg-white/[0.06] hover:text-ink-strong"
                          }`}
                        >
                          Todas
                          {activeStarFilter === null && <Check size={13} />}
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <button
                            key={star}
                            onClick={() => { setActiveStarFilter(activeStarFilter === star ? null : star); setReviewPage(1); setRatingDropdownOpen(false); }}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                              activeStarFilter === star ? "bg-foreground/[0.08] text-primary" : "text-ink hover:bg-white/[0.06] hover:text-ink-strong"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Star size={12} className="fill-[#FFB800] text-[#FFB800]" />
                              {star} {star === 1 ? "estrela" : "estrelas"}
                            </span>
                            {activeStarFilter === star && <Check size={13} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {customerPhotos.map((photo) => (
                  <button
                    key={`${photo.review.id}-${photo.imageIndex}`}
                    onClick={() => openMedia(photo.reviewIndex, photo.imageIndex)}
                    className="group relative h-20 w-20 flex-shrink-0 overflow-hidden border border-foreground/8 bg-foreground/5 cursor-pointer"
                    style={{ borderRadius: "var(--radius-card)" }}
                    aria-label={`Abrir foto da avaliação de ${photo.review.user}`}
                  >
                    <img
                      src={photo.image}
                      alt={`Foto enviada por ${photo.review.user}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10 divide-y divide-foreground/[0.03]">
              {visibleReviews.map((rev) => {
                const reviewIndex = reviews.findIndex((item) => item.id === rev.id);
                return (
                <div key={rev.id} className="pt-10 first:pt-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-foreground/40">
                        {rev.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-foreground font-semibold" style={{ fontSize: "var(--text-sm)" }}>{rev.user}</span>
                          {rev.verified && <Check size={12} className="text-green-500" strokeWidth={3} />}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className={i < rev.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-foreground/25" style={{ fontSize: "var(--text-caption)" }}>{rev.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/75 leading-relaxed mb-4" style={{ fontSize: "var(--text-base)", fontFamily: "var(--font-family-inter)" }}>
                    {rev.comment}
                  </p>

                  {rev.images && (
                    <div className="flex gap-2 mb-4">
                      {rev.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => openMedia(reviewIndex, i)}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-foreground/5 cursor-pointer"
                          aria-label={`Abrir foto ${i + 1} da avaliação de ${rev.user}`}
                        >
                          <img src={img} alt={`Foto da avaliação de ${rev.user}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <button className="inline-flex items-center gap-2 min-h-[44px] md:min-h-0 text-foreground/30 hover:text-foreground transition-colors" style={{ fontSize: "var(--text-caption)" }}>
                    Útil? ({rev.likes})
                  </button>
                </div>
              )})}
            </div>

            {filteredReviews.length > reviewsPerPage && (
              <div className="mt-12 flex items-center justify-between gap-4">
                <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                  Página {reviewPage} de {totalReviewPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToReviewPage(Math.max(1, reviewPage - 1))}
                    disabled={reviewPage === 1}
                    className="h-11 md:h-9 px-4 border border-foreground/10 text-foreground/55 transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/55 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalReviewPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToReviewPage(page)}
                      className={`h-11 w-11 md:h-9 md:w-9 transition-colors cursor-pointer ${
                        page === reviewPage
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/5 text-foreground/45 hover:bg-foreground/10 hover:text-foreground"
                      }`}
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800 }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToReviewPage(Math.min(totalReviewPages, reviewPage + 1))}
                    disabled={reviewPage === totalReviewPages}
                    className="h-11 md:h-9 px-4 border border-foreground/10 text-foreground/55 transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/55 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700 }}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMedia && selectedReview && selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedMedia(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-4 z-50 mx-auto flex max-w-[980px] items-start justify-center pointer-events-none md:inset-8 md:items-center md:overflow-hidden"
            >
              <div
                className="grid w-full max-h-[calc(100vh-32px)] overflow-y-auto md:max-h-[88vh] md:overflow-hidden border border-edge shadow-[var(--shadow-pop)] pointer-events-auto md:grid-cols-[minmax(0,1.2fr)_360px]"
                style={{
                  borderRadius: "var(--radius-card-md)",
                  background: isDark ? "rgba(16,16,17,0.98)" : "rgba(var(--foreground-rgb), 0.98)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative min-h-[320px] bg-black md:min-h-[560px]">
                  <img src={selectedImage} alt={`Foto enviada por ${selectedReview.user}`} className="h-full w-full object-contain" />
                  {(selectedReview.images?.length ?? 0) > 1 && (
                    <>
                      <button
                        onClick={() => moveMedia(-1)}
                        className="absolute left-4 top-1/2 flex h-11 w-11 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-ink-strong backdrop-blur-md transition-colors hover:bg-black/55"
                        aria-label="Foto anterior desta avaliação"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => moveMedia(1)}
                        className="absolute right-4 top-1/2 flex h-11 w-11 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-ink-strong backdrop-blur-md transition-colors hover:bg-black/55"
                        aria-label="Próxima foto desta avaliação"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                <aside className="flex md:max-h-[88vh] flex-col p-5 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-foreground font-semibold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}>
                        {selectedReview.user}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < selectedReview.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"} />
                          ))}
                        </div>
                        <span className="text-foreground/30" style={{ fontSize: "var(--text-caption)" }}>{selectedReview.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-foreground/45 transition-colors hover:bg-foreground/8 hover:text-foreground"
                      aria-label="Fechar foto"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-foreground/70 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.7 }}>
                    {selectedReview.comment}
                  </p>

                  <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {selectedReview.images?.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setSelectedMedia({ reviewIndex: selectedMedia.reviewIndex, imageIndex: index })}
                        className={`h-14 w-14 flex-shrink-0 overflow-hidden border transition-all ${
                          index === selectedMedia.imageIndex ? "border-primary opacity-100" : "border-foreground/10 opacity-45 hover:opacity-80"
                        }`}
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            </motion.div>
            {mediaReviews.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[55] pointer-events-none"
              >
                <button
                  onClick={() => moveReview(-1)}
                  className="hidden md:flex pointer-events-auto absolute left-5 top-1/2 h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-[var(--shadow-pop)] transition-transform hover:scale-105 hover:bg-white md:left-[7vw] cursor-pointer"
                  aria-label="Avaliação anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => moveReview(1)}
                  className="hidden md:flex pointer-events-auto absolute right-5 top-1/2 h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-[var(--shadow-pop)] transition-transform hover:scale-105 hover:bg-white md:right-[7vw] cursor-pointer"
                  aria-label="Próxima avaliação"
                >
                  <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setReviewModalOpen(false)}
            />
            <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center pointer-events-none md:p-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="pointer-events-auto w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-background border border-foreground/10 shadow-[var(--shadow-pop)] p-6 rounded-t-[20px] md:rounded-[var(--radius-card-lg)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600 }}>
                    Escrever Avaliação
                  </h3>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-foreground/8 text-foreground/45 hover:text-foreground transition-all cursor-pointer"
                  >
                    <X size={16} strokeWidth={1.8} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-foreground/70 mb-2" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Nota</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110 p-1.5 md:p-0 -m-1.5 md:m-0"
                        >
                          <Star size={28} className={star <= newReviewRating ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/20"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-foreground/70 mb-2" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Seu comentário</label>
                    <textarea
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Conte-nos o que achou do produto..."
                      className="w-full h-32 border border-foreground/12 bg-transparent text-foreground placeholder-foreground/30 p-3 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                      style={{ borderRadius: "var(--radius-card)", fontSize: "var(--text-sm)" }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newReviewRating === 0) {
                        toast.error("Por favor, selecione uma nota.");
                        return;
                      }
                      if (!newReviewText.trim()) {
                        toast.error("Por favor, escreva um comentário.");
                        return;
                      }
                      toast.success("Avaliação enviada com sucesso!");
                      setReviewModalOpen(false);
                      setNewReviewRating(0);
                      setNewReviewText("");
                    }}
                    className="w-full mt-4 py-3 bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 cursor-pointer"
                    style={{ borderRadius: "var(--radius-button)", fontSize: "var(--text-sm)" }}
                  >
                    Enviar Avaliação
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STANDARD PRODUCT DESCRIPTION
   ═══════════════════════════════════════════════════════ */

function ProductStandardDescription({ product, images }: { product: any; images: string[] }) {
  const primaryImage = images[0] ?? getPrimaryProductImage(product);
  const secondaryImage = images[1] ?? primaryImage;
  const tertiaryImage = images[2] ?? secondaryImage;
  const specs = product.specs?.length
    ? product.specs
    : [
        { label: "Categoria", value: product.category },
        { label: "Modelo", value: product.sku ? String(product.sku) : product.name },
        { label: "Marca", value: product.brand ?? "PCYES" },
      ];

  const lead = product.description?.split("\n").find((item: string) => item.trim()) ??
    `${product.name} foi desenvolvido para entregar desempenho, acabamento e confiabilidade no uso diário.`;

  const productImageBg = {
    background: "linear-gradient(160deg, #f7f7f7, #ececec)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-card-hairline)",
  } as const;

  return (
    <section className="pb-20 border-t border-foreground/5">
      <div className="mx-auto mt-10 max-w-[1120px]">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "var(--radius-card-xl)",
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <section className="px-6 py-10 text-center md:px-10 md:py-14">
            <p className="label mb-4" style={{ color: "var(--amber-deep)" }}>
              {product.category}
            </p>
            <h3 className="mx-auto max-w-[820px] text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 5vw, 52px)", lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.04em" }}>
              Sobre o produto
            </h3>
            <p className="mx-auto mt-5 max-w-[820px] text-foreground/65" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.65 }}>
              {lead}
            </p>
            <div className="relative mt-9 flex min-h-[360px] items-center justify-center overflow-hidden p-8" style={{ borderRadius: "var(--radius-card-xl)", ...productImageBg }}>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.06) 0%, transparent 55%)",
                  borderRadius: "var(--radius-card-xl)",
                }}
              />
              <QuadroFoto src={primaryImage} alt={product.name} />
            </div>
          </section>

          <section className="border-t border-edge-subtle px-6 py-10 md:px-10">
            {/* trio editorial limpo — imagem no well + texto em ink; zero overlay
                escuro/textShadow (PCYES). Copy neutra de loja de música. */}
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="flex flex-col overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
                <div className="relative min-h-[300px] flex-1" style={{ background: "var(--well)" }}>
                  <QuadroFoto src={secondaryImage} alt={`${product.name} em destaque`} padding="p-8" />
                </div>
                <div className="p-7">
                  <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 2.6vw, 28px)", lineHeight: 1.1, fontWeight: 700 }}>
                    Acabamento Tonante de fábrica
                  </h3>
                  <p className="mt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.65, color: "var(--ink-soft)" }}>
                    Materiais selecionados e conferência peça a peça antes do envio — o padrão da
                    casa desde 1954.
                  </p>
                </div>
              </article>

              <div className="grid gap-6">
                <article className="relative flex min-h-[240px] items-center overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
                  <div className="max-w-full p-7 md:max-w-[55%]">
                    <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.12, fontWeight: 700 }}>
                      Do ensaio ao palco
                    </h3>
                    <p className="mt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6, color: "var(--ink-soft)" }}>
                      Pensado pro dia a dia de quem toca: resistente na estrada, bonito de perto e
                      fácil de manter.
                    </p>
                  </div>
                  <div className="absolute inset-y-3 right-3 hidden w-[42%] md:block" style={{ background: "var(--well)", borderRadius: "var(--radius-card-md)" }}>
                    <QuadroFoto src={tertiaryImage} alt={`${product.name} detalhe`} padding="p-4" />
                  </div>
                </article>

                <article className="relative flex min-h-[240px] items-center overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
                  <div className="max-w-full p-7 md:max-w-[55%]">
                    <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.12, fontWeight: 700 }}>
                      Garantia e suporte de verdade
                    </h3>
                    <p className="mt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6, color: "var(--ink-soft)" }}>
                      2 anos de garantia, atendimento brasileiro e a tradição de quem é o primeiro
                      instrumento de gerações.
                    </p>
                  </div>
                  <div className="absolute inset-y-3 right-3 hidden w-[42%] md:block" style={{ background: "var(--well)", borderRadius: "var(--radius-card-md)" }}>
                    <QuadroFoto src={primaryImage} alt={`${product.name} em uso`} padding="p-4" />
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="border-t border-edge-subtle px-6 py-10 md:px-10">
            <div className="grid gap-7 md:grid-cols-2">
              {[primaryImage, secondaryImage].map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "var(--radius-card-lg)", ...productImageBg }}>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 30% 25%, rgba(var(--foreground-rgb), 0.06) 0%, transparent 55%)",
                      borderRadius: "var(--radius-card-lg)",
                    }}
                  />
                  <QuadroFoto src={image} alt={`${product.name} galeria ${index + 1}`} padding="p-6" />
                </div>
              ))}
            </div>
          </section>

          {/* vídeo placeholder do template removido — volta quando houver
              gravação real do produto (campo futuro, ex. videoUrl) */}

          <section className="border-t border-edge-subtle px-6 py-10 md:px-10">
            <article className="relative overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
              <div className="relative z-10 w-full p-7 md:w-[60%] md:p-9">
                <p className="label mb-4" style={{ color: "var(--amber-deep)" }}>
                  Ficha técnica
                </p>
                <h3 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(26px, 3.4vw, 34px)", lineHeight: 1.08, fontWeight: 700 }}>
                  Especificações técnicas
                </h3>
                <dl className="mt-6 grid gap-3">
                  {specs.slice(0, 8).map((spec: { label: string; value: string }) => (
                    <div key={spec.label} className="grid gap-2 border-b pb-3 sm:grid-cols-[170px_1fr]" style={{ borderColor: "var(--border)" }}>
                      <dt style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-meta)" }}>
                        {spec.label}
                      </dt>
                      <dd style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink-strong)" }}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="absolute inset-y-4 right-4 hidden w-[35%] md:block" style={{ background: "var(--well)", borderRadius: "var(--radius-card-md)" }}>
                <QuadroFoto src={tertiaryImage} alt={`${product.name} especificações`} padding="p-6" />
              </div>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProductPage() {
  /**
   * Supports both legacy and semantic URLs:
   *   /produto/:id                           (legacy id-based)
   *   /:category/:brand/:slug                (slug, no subcategory)
   *   /:category/:subcategory/:brand/:slug   (slug with subcategory)
   * The slug-based lookups go through getProductSlug() to match the
   * canonical form. If `id` is provided it wins; otherwise the slug is
   * resolved against the catalog.
   */
  const params = useParams();
  const navigate = useNavigate();
  const product = params.id
    ? allProducts.find((p) => p.id === Number(params.id))
    : params.slug
      ? allProducts.find((p) => getProductSlug(p) === params.slug)
      : undefined;
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  const relatedRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const mobileShippingRef = useRef<HTMLDivElement>(null);
  const relatedInView = useInView(relatedRef, { once: true, amount: 0.1 });

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDescription = () => {
    descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const updateStickyCta = () => {
      const shippingEl = mobileShippingRef.current;
      if (!shippingEl || window.innerWidth >= 1024) {
        setShowMobileStickyCta(false);
        return;
      }

      setShowMobileStickyCta(shippingEl.getBoundingClientRect().top < window.innerHeight - 180);
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);
    return () => {
      window.removeEventListener("scroll", updateStickyCta);
      window.removeEventListener("resize", updateStickyCta);
    };
  }, [product?.id]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [product?.id]);

  /* A1 stage 5 — redirect legacy /produto/:id URL to the semantic slug
     form once the product is resolved. Uses navigate(..., { replace }) so
     the back button skips the legacy URL. Server-side 301 will be added
     to vercel.json in a follow-up; for now this gives bookmarks and
     external links a graceful upgrade. */
  useEffect(() => {
    if (!product) return;
    if (!params.id) return; // already on the canonical route
    const canonical = getProductUrl(product);
    if (window.location.pathname !== canonical) {
      navigate(canonical, { replace: true });
    }
  }, [product, params.id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p
          className="text-foreground/30"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-light)" }}
        >
          Produto não encontrado
        </p>
        <Link
          to="/produtos"
          className="px-6 py-3 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
          style={{
            borderRadius: "var(--radius-button)",
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  const productSubcategory = getProductSubcategory(product);
  const galleryImages = getProductImages(product);
  const visibleProducts = getVisibleCatalogProducts(allProducts);
  const swatches = getProductSwatches(product);

  const related = visibleProducts
    .filter((p) => p.category === product.category && getProductSubcategory(p) === productSubcategory && p.id !== product.id)
    .slice(0, 5);
  if (related.length < 5) {
    const extras = visibleProducts
      .filter((p) => p.category === product.category && p.id !== product.id && !related.find((r) => r.id === p.id))
      .slice(0, 5 - related.length);
    related.push(...extras);
  }

  const discount = product.oldPriceNum && product.oldPriceNum > product.priceNum
    ? Math.round(((product.oldPriceNum - product.priceNum) / product.oldPriceNum) * 100)
    : 0;

  const pixPrice = product.priceNum * 0.9;
  const installmentN = getInstallmentCount(product.priceNum);
  const installment = getInstallmentValue(product.priceNum);
  const preOrderInfo = getPreOrderInfo(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getPrimaryProductImage(product),
      });
    }
    setAddedToCart(true);
    toast.success(`${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: `${qty}× adicionado ao carrinho`,
      duration: 2500,
    });
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getPrimaryProductImage(product),
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(window.location.href).then(() => toast.success("Link copiado!"));
  };

  const liked = isFavorite(product.id);

  return (
    <div className="">
      <SEO
        title={product.name}
        description={`Compre ${product.name} na PCYES. ${product.price ? `Por ${product.price}.` : ""} Frete grátis acima de R$ 299, até 10x sem juros.`}
        canonicalPath={getProductUrl(product)}
        image={getPrimaryProductImage(product)}
        ogType="product"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: getPrimaryProductImage(product),
            sku: product.sku ? String(product.sku) : undefined,
            brand: { "@type": "Brand", name: "PCYES" },
            category: product.category,
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: product.priceNum,
              availability:
                product.inStock === false
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
              url: `https://pcyes.com.br${getProductUrl(product)}`,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pcyes.com.br/" },
              { "@type": "ListItem", position: 2, name: product.category, item: `https://pcyes.com.br${getCatalogHref({ category: product.category })}` },
              { "@type": "ListItem", position: 3, name: productSubcategory, item: `https://pcyes.com.br${getCatalogHref({ category: product.category, subcategory: productSubcategory })}` },
              { "@type": "ListItem", position: 4, name: product.name },
            ],
          },
        ]}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-5 md:px-8 pt-2 pb-2 lg:pt-6 lg:pb-2">
        <ol className="max-w-[1760px] mx-auto flex items-center gap-1.5 flex-wrap">
          {[
            { label: "Home", to: "/" },
            { label: product.category, to: getCatalogHref({ category: product.category }) },
            { label: productSubcategory, to: getCatalogHref({ category: product.category, subcategory: productSubcategory }) },
          ].map((crumb, i) => (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-foreground/15" style={{ fontSize: "var(--text-caption)" }}>›</span>}
              <Link
                to={crumb.to}
                className="text-foreground/35 hover:text-foreground/65 transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
              >
                {crumb.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="text-foreground/15" style={{ fontSize: "var(--text-caption)" }}>›</span>
            <span
              aria-current="page"
              className="text-foreground/55 truncate max-w-[200px] md:max-w-[260px]"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
            >
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Main PDP */}
      <div className="px-5 md:px-8 pt-2 pb-24 lg:pt-6">
        <div className="max-w-[1760px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] items-start gap-6 xl:gap-8">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 w-full lg:order-none lg:w-[56%] xl:w-[58%] flex-shrink-0"
          >
            <ProductGallery images={galleryImages} name={product.name} isDark={isDark} />
          </motion.div>

          {swatches.length > 1 && (
            <div className="order-3 lg:hidden w-full">
              <p
                className="text-foreground/55 mb-2.5 font-semibold tracking-wide"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.1em" }}
              >
                COR · <span className="text-foreground/40 font-medium tracking-normal normal-case">
                  {swatches.find((s) => s.productId === product.id)?.label}
                </span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {swatches.map((sw) => (
                  <button
                    key={sw.productId}
                    title={sw.label}
                    onClick={() => navigate(`/produto/${sw.productId}`)}
                    className={`relative h-14 w-14 flex-shrink-0 overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                      sw.productId === product.id ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ borderRadius: 8, background: "var(--well)", border: sw.productId === product.id ? "1.5px solid var(--ink-strong)" : "1px solid var(--border)" }}
                    aria-label={sw.label}
                  >
                    <QuadroFoto src={sw.image} alt={sw.label} padding="p-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <MobilePurchaseFlow
            product={product}
            qty={qty}
            setQty={setQty}
            onBuyNow={handleBuyNow}
            pixPrice={pixPrice}
            installment={installment}
            discount={discount}
            onSeeDescription={scrollToDescription}
            shippingRef={mobileShippingRef}
            preOrderInfo={preOrderInfo}
          />

          {/* Middle column: title, rating, share/like, description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="order-1 w-full lg:order-none lg:flex-1 min-w-0"
          >
            {/* Brand + badges row */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {product.brand && (
                  <span
                    className="text-foreground/45 font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.14em" }}
                  >
                    {product.brand}
                  </span>
                )}
                {product.brand && product.badge && <span className="text-foreground/15">·</span>}
                {product.badge && (
                  <span
                    className="px-2 py-0.5 bg-foreground/[0.06] text-primary font-bold"
                    style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Like + Share */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    liked
                      ? "bg-red-500/10 text-red-500"
                      : "text-foreground/35 hover:text-foreground/70 hover:bg-foreground/5"
                  }`}
                  aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart size={15} className={liked ? "fill-red-500" : ""} strokeWidth={1.7} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full text-foreground/35 hover:text-foreground/70 hover:bg-foreground/5 transition-all duration-300 cursor-pointer"
                  aria-label="Compartilhar"
                >
                  <Share2 size={15} strokeWidth={1.7} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-foreground mb-4 leading-[1.12]"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(22px, 2.6vw, 32px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5 mb-6 flex-wrap">
              <div
                className="inline-flex items-center gap-0.5 cursor-pointer group min-h-[44px] md:min-h-0"
                onClick={scrollToReviews}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-[#FFB800] text-[#FFB800]" : "text-foreground/12"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span
                className="inline-flex items-center min-h-[44px] md:min-h-0 text-foreground/70 font-semibold tabular-nums cursor-pointer hover:text-[#FFB800] transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                onClick={scrollToReviews}
              >
                {product.rating.toFixed(1)}
              </span>
              <span className="text-foreground/15">·</span>
              <span
                className="inline-flex items-center min-h-[44px] md:min-h-0 text-foreground/45 hover:text-foreground/65 cursor-pointer transition-colors"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                onClick={scrollToReviews}
              >
                {product.reviews} avaliações
              </span>
              {product.sku && (
                <>
                  <span className="text-foreground/15">·</span>
                  <span
                    className="text-foreground/30"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
                  >
                    SKU {product.sku}
                  </span>
                </>
              )}
            </div>

            {/* Color swatches */}
            {swatches.length > 1 && (
              <div className="hidden lg:block mb-6">
                <p
                  className="text-foreground/55 mb-2.5 font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.1em" }}
                >
                  COR · <span className="text-foreground/40 font-medium tracking-normal normal-case">
                    {swatches.find((s) => s.productId === product.id)?.label}
                  </span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {swatches.map((sw) => (
                    <button
                      key={sw.productId}
                      title={sw.label}
                      onClick={() => navigate(`/produto/${sw.productId}`)}
                      className={`relative h-14 w-14 flex-shrink-0 overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                        sw.productId === product.id ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""
                      }`}
                      style={{ borderRadius: 8, background: "var(--well)", border: sw.productId === product.id ? "1.5px solid var(--ink-strong)" : "1px solid var(--border)" }}
                      aria-label={sw.label}
                    >
                      <QuadroFoto src={sw.image} alt={sw.label} padding="p-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* "Ouça este instrumento" — junto da decisão: cor → timbre → sobre */}
            <TimbrePlayer product={product} className="mb-6" />

            <div className="h-px bg-foreground/6 mb-6" />

            {/* About / bullets */}
            <div className="hidden lg:block">
              <AboutProduct product={product} onSeeDescription={scrollToDescription} />
            </div>
          </motion.div>
            </div>
          </div>

            {/* Purchase card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden w-full lg:col-start-2 lg:row-start-1 lg:block lg:sticky lg:top-[190px] lg:self-start"
            >
              {preOrderInfo ? (
                <PreOrderBanner
                  info={preOrderInfo}
                  productPrice={product.price}
                  onReserve={handleBuyNow}
                />
              ) : (
                <StickyPriceCard
                  product={product}
                  qty={qty}
                  setQty={setQty}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAdd}
                  addedToCart={addedToCart}
                  pixPrice={pixPrice}
                  installment={installment}
                  discount={discount}
                />
              )}
            </motion.div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div ref={descriptionRef} className="scroll-mt-[96px]">
              <ProductStandardDescription product={product} images={galleryImages} />
              {/* autoria (V3 §8.2) — só renderiza quando há luthier */}
              <LuthierBlock product={product} />
            </div>

      {/* Reviews Section */}
      <div ref={reviewsRef}>
        <ReviewsSection product={product} isDark={isDark} />
      </div>
          </div>
        </div>

      {/* Related products — full width below grid (sticky card stops here) */}
      {related.length > 0 && (
        <div ref={relatedRef} className="py-20 border-t border-foreground/5">
          <div className="max-w-[1760px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <p
                  className="mb-3 label"
                  style={{ color: "var(--amber-deep)" }}
                >
                  Você também vai gostar
                </p>
                <h2
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}
                >
                  Produtos Relacionados
                </h2>
              </div>
              <Link
                to={getCatalogHref({ category: product.category, subcategory: productSubcategory })}
                className="hidden md:flex items-center gap-2 text-foreground/30 hover:text-foreground/60 transition-colors duration-300"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
              >
                Ver todos <ArrowUpRight size={14} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {related.map((rProduct, i) => (
                <motion.div
                  key={rProduct.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  {/* card padrão da casa (v3) — consistência com home/listagem */}
                  <ProductCard
                    product={rProduct}
                    onAdd={(p) => {
                      addItem({ id: p.id, name: p.name, price: p.price, image: getPrimaryProductImage(p) });
                      toast.success("Adicionado!");
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Mobile sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-all duration-300 ${
        showMobileStickyCta ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}>
        <div
          className="px-4 py-3 flex items-center gap-3 border-t border-foreground/10"
          style={{ background: isDark ? "rgba(16,16,17,0.95)" : "rgba(var(--foreground-rgb), 0.95)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-foreground/45 text-xs truncate" style={{ fontFamily: "var(--font-family-inter)" }}>
              {product.name.split(" ").slice(0, 5).join(" ")}…
            </p>
            <p className="text-foreground font-bold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)" }}>
              {preOrderInfo
                ? (preOrderInfo.preOrderPrice ?? formatBRL(pixPrice))
                : formatBRL(pixPrice)}{" "}
              {preOrderInfo ? (
                <span className="text-[#f97316] text-xs font-normal">pré-venda</span>
              ) : (
                <span className="text-[#4CAF50] text-xs font-normal">no PIX</span>
              )}
            </p>
          </div>
          <button
            onClick={handleBuyNow}
            disabled={preOrderInfo ? (preOrderInfo.reservedUnits >= preOrderInfo.totalUnits) : (product.inStock === false)}
            className="px-5 py-3 flex items-center gap-2 font-semibold transition-all cursor-pointer disabled:opacity-40 text-white"
            style={{
              borderRadius: "var(--radius-button)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              whiteSpace: "nowrap",
              background: preOrderInfo
                ? "var(--gradient-preorder-orange)"
                : "var(--gradient-buy)",
            }}
          >
            {preOrderInfo ? (
              preOrderInfo.reservedUnits >= preOrderInfo.totalUnits ? (
                <>Esgotado</>
              ) : (
                <><Rocket size={14} strokeWidth={2.4} /> Comprar agora</>
              )
            ) : (
              <><Zap size={14} fill="currentColor" /> Comprar agora</>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
