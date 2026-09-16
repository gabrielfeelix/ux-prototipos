import type { Product } from "./productsData";

/** Discount % from oldPriceNum (real or synthetic). */
export function getDiscountPct(p: Product): number {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

/** Money saved (oldPrice - price). 0 if no discount. */
export function getEconomy(p: Product): number {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round((p.oldPriceNum - p.priceNum) * 100) / 100;
}

/** PIX price = priceNum with 10% extra discount. */
export function getPixPrice(p: Product): number {
  return Math.round(p.priceNum * 0.9 * 100) / 100;
}

/** Format BRL "R$ 1.234,56". */
export function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** 10x installment. */
export function getInstallment(p: Product): number {
  return Math.round((p.priceNum / 10) * 100) / 100;
}

/**
 * Parcelamento padrão da loja (Fase 0 §4.2.7) — fonte ÚNICA da verdade.
 * Política (decisão Gabriel 2026-06-11): até 10x sem juros, parcela mínima R$50.
 * Usar em ProductCard, quick-view, DropDoDia, PDP, CartDrawer — nunca hardcode.
 */
export const MAX_INSTALLMENTS = 10;
export const MIN_INSTALLMENT_VALUE = 50;
export function getInstallmentCount(priceNum: number): number {
  return Math.min(MAX_INSTALLMENTS, Math.max(1, Math.floor(priceNum / MIN_INSTALLMENT_VALUE)));
}

/** Valor de cada parcela no plano padrão. */
export function getInstallmentValue(priceNum: number): number {
  return Math.round((priceNum / getInstallmentCount(priceNum)) * 100) / 100;
}

export type SocialProof = {
  icon: "fire" | "eye" | "zap";
  text: string;
  color: string;
};

/** Deterministic social proof per product. ~60% chance show. */
export function getSocialProof(p: Product): SocialProof | null {
  const hash = (p.id * 31 + 7) % 100;
  if (hash < 40) return null;
  if (hash < 60) {
    const sold = ((p.id * 13) % 40) + 8;
    return { icon: "fire", text: `${sold} vendidos hoje`, color: "#ff7a45" };
  }
  if (hash < 80) {
    const watching = ((p.id * 7) % 18) + 3;
    return { icon: "eye", text: `${watching} olhando agora`, color: "#22c55e" };
  }
  return { icon: "zap", text: "Vendendo rápido", color: "#e08c12" };
}

/** Low stock if hash low. */
export function isLowStock(p: Product): boolean {
  if (p.inStock === false) return false;
  const hash = (p.id * 19 + 11) % 100;
  return hash < 18;
}

/** Stock count for "Últimas X". */
export function getStockCount(p: Product): number {
  return ((p.id * 13) % 5) + 2;
}

/** Heat level for discount badge color. */
export function getDiscountHeat(discount: number): "cold" | "warm" | "hot" | "fire" {
  if (discount >= 40) return "fire";
  if (discount >= 25) return "hot";
  if (discount >= 15) return "warm";
  return "cold";
}

export function getDiscountBg(discount: number): string {
  const h = getDiscountHeat(discount);
  if (h === "fire") return "linear-gradient(135deg, #e08c12 0%, #ff7a45 100%)";
  if (h === "hot") return "linear-gradient(135deg, #f97316 0%, #facc15 100%)";
  if (h === "warm") return "linear-gradient(135deg, #34d399 0%, #10b981 100%)";
  return "linear-gradient(135deg, #34d399 0%, #10b981 100%)";
}

export function getDiscountGlow(discount: number): string {
  const h = getDiscountHeat(discount);
  if (h === "fire") return "0 6px 22px -4px rgba(200, 120, 0,0.7)";
  if (h === "hot") return "0 6px 22px -4px rgba(249,115,22,0.6)";
  return "0 6px 18px -4px rgba(16,185,129,0.55)";
}

/* ── Luthiers / autoria (V3 §8.2) ─────────────────────────────────────────
   ⚠️ PLACEHOLDER: nomes e bios fictícios apenas para demonstração de layout.
   Trocar pelos luthiers reais da Oderço antes de publicar. O campo
   product.luthier (catálogo) tem precedência sobre este mapa. */
export type Luthier = { name: string; title: string; photo?: string; bio?: string };

const LUTHIERS: Record<number, Luthier> = {
  // Violão Clássico Lorenzzo — linha clássica nylon
  25: {
    name: "Mestre Élcio Navarro",
    title: "Luthier responsável · linha Lorenzzo",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80&auto=format&fit=crop",
    bio: "Trinta anos de bancada. Ajusta cada tampo e regula cada braço da linha clássica antes de liberar para o acabamento.",
  },
  // Violão Elétrico Coral
  52: {
    name: "Helena Vasques",
    title: "Luthier · linha Coral",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80&auto=format&fit=crop",
    bio: "Especialista em madeiras escuras e timbre encorpado. Assina a curadoria de tampos da Coral desde o relançamento.",
  },
};

/** Autoria do instrumento: campo do catálogo ganha; senão, mapa local. */
export function getLuthier(p: Product): Luthier | undefined {
  return p.luthier ?? LUTHIERS[p.id];
}
