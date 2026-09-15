/**
 * URL slug utilities for category, subcategory, brand and product names.
 *
 * Stage 1 of A1 (semantic URLs). Read-only — no routes or links change yet.
 *
 * `slugify` converts PT-BR strings to URL-safe lowercase hyphenated form,
 * stripping diacritics and non-alphanumerics. Category and subcategory
 * have explicit overrides for canonical readable slugs ("Periféricos"
 * -> "perifericos", "SSD e HD" -> "ssd-e-hd").
 */
import type { Product } from "../components/productsData";

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Explicit category -> slug map. Keeps slugs short and stable across renames. */
export const CATEGORY_TO_SLUG: Record<string, string> = {
  "Violões":                  "violoes",
  "Guitarras":                "guitarras",
  "Contrabaixos":             "contrabaixos",
  "Baterias":                 "baterias",
  "Acessórios":               "acessorios",
  "Cordas & Encordoamentos":  "cordas-encordoamentos",
  "Suportes":                 "suportes",
};

/** Reverse map: slug -> original category label (for routing). */
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_SLUG).map(([cat, slug]) => [slug, cat])
);

export function getCategorySlug(category: string): string {
  return CATEGORY_TO_SLUG[category] ?? slugify(category);
}

export function getCategoryFromSlug(slug: string): string | null {
  return SLUG_TO_CATEGORY[slug] ?? null;
}

/** Subcategory slugs are derived (no fixed list). Pure slugify. */
export function getSubcategorySlug(subcategory: string): string {
  return slugify(subcategory);
}

/** Brand slug. Defaults to slugified brand name; falls back to "pcyes". */
export function getBrandSlug(brand?: string): string {
  return slugify(brand && brand.trim() ? brand : "tonante");
}

/**
 * Product slug. Uses `seoSlug` field when present, otherwise slugifies
 * the product name. SKU is appended when the result would collide.
 */
export function getProductSlug(product: Pick<Product, "name" | "seoSlug" | "sku">): string {
  if (product.seoSlug && product.seoSlug.trim()) return slugify(product.seoSlug);
  const fromName = slugify(product.name);
  return fromName || (product.sku ? `produto-${slugify(product.sku)}` : "produto");
}

/** Build a canonical URL path for a product. */
export function getProductUrl(product: Pick<Product, "name" | "category" | "subcategory" | "brand" | "seoSlug" | "sku" | "id">): string {
  const cat = getCategorySlug(product.category);
  const sub = product.subcategory ? getSubcategorySlug(product.subcategory) : "";
  const brand = getBrandSlug(product.brand);
  const slug = getProductSlug(product);
  return sub
    ? `/${cat}/${sub}/${brand}/${slug}/`
    : `/${cat}/${brand}/${slug}/`;
}

/** Build a canonical URL path for a category (and optional subcategory). */
export function getCategoryUrl(category: string, subcategory?: string): string {
  const cat = getCategorySlug(category);
  if (subcategory) {
    const sub = getSubcategorySlug(subcategory);
    return `/${cat}/${sub}/`;
  }
  return `/${cat}/`;
}
