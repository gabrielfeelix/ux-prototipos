import { allProducts, type Product } from "./productsData";
import { getCategoryUrl } from "../lib/slug";
import { getOfficialGallery } from "./productGalleries";
import { isFotoAmbientada } from "./photoBackdrop";
import { getVariantInfo } from "./productVariants";

export interface CatalogHrefParams {
  category?: string;
  subcategory?: string;
  search?: string;
}

export interface ProductSwatch {
  color: string;
  label: string;
  productId: number;
  image: string;
  name: string;
}

export interface ProductHoverMedia {
  type: "video" | "image";
  src: string;
}

const COLOR_RULES = [
  { keywords: ["black", "preto", "vulcan"], color: "#18181b", label: "Preto" },
  { keywords: ["white", "branco", "ghost"], color: "#f4f4f5", label: "Branco" },
  { keywords: ["red", "vermelho", "magma"], color: "#dc2626", label: "Vermelho" },
  { keywords: ["blue", "azul", "cobalt", "colbat"], color: "#2563eb", label: "Azul" },
  { keywords: ["green", "verde", "mint"], color: "#65a30d", label: "Verde" },
  { keywords: ["purple", "roxo"], color: "#9333ea", label: "Roxo" },
  { keywords: ["yellow", "amarela", "amarelo"], color: "#eab308", label: "Amarelo" },
  { keywords: ["brown", "marrom"], color: "#92400e", label: "Marrom" },
  { keywords: ["pink", "rosa"], color: "#ec4899", label: "Rosa" },
  { keywords: ["silver", "prata"], color: "#a1a1aa", label: "Prata" },
];

const GENERIC_TOKENS = new Set([
  "pcyes",
  "gamer",
  "gaming",
  "ergonomica",
  "ergonômica",
  "vidro",
  "temperado",
  "lateral",
  "pc",
  "yes",
  "mm",
  "rgb",
  "argb",
  "wireless",
  "sem",
  "fio",
  "usb",
  "series",
]);

const hoverVideos: Partial<Record<number, string>> = {};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

/* Tipo real do produto, lido do nome — o que decide se dois itens são
 * comparáveis entre si. A categoria não serve pra isso: em "Violões" moram
 * violão, cavaco e ukulele, e comparar os três lado a lado devolve uma tabela
 * que não responde pergunta nenhuma. Acessório vem primeiro porque o nome dele
 * cita o instrumento ("Cabo de Guitarra", "Capa para Violão") e cairia na
 * família errada se a ordem fosse outra. */
const TIPOS_TONANTE: [string[], string][] = [
  /* Primeiro o que É acessório de outra coisa: o nome desses cita o produto
     que eles servem ("Cabo de Microfone", "Suporte Para Guitarra"), então se a
     família do instrumento viesse antes, o acessório entraria nela. */
  [["cabo "], "Cabos"],
  [["plug ", "adaptador "], "Conectores"],
  [["capa ", "bag ", "case "], "Capas e Bags"],
  [["pedestal"], "Pedestais"],
  [["estante para partitura"], "Estantes de Partitura"],
  [["banqueta"], "Banquetas"],
  [["suporte"], "Suportes"],
  [["apoio de pe"], "Apoios"],
  [["abafador", "anti-feedback", "damper"], "Abafadores"],
  [["encordoamento", "corda "], "Cordas"],
  [["polidor", "cera ", "condicionador", "oleo de", "limpador", "lubrificante"], "Limpeza e Manutenção"],
  [["palheta"], "Palhetas"],
  [["capotraste"], "Capotrastes"],
  [["correia"], "Correias"],
  [["afinador", "diapasao"], "Afinadores"],
  [["pedal"], "Pedais"],
  [["caixa amplificada", "caixa de som"], "Caixas de Som"],
  [["amplificador", "cubo "], "Amplificadores"],
  [["microfone"], "Microfones"],
  [["flauta"], "Flautas"],
  [["cavaco", "cavaquinho"], "Cavacos"],
  [["ukulele"], "Ukuleles"],
  [["guitarra"], "Guitarras"],
  /* "viola " com espaço: sem ele a regra comeria "violao", que começa igual. */
  [["viola ", "viola-"], "Violas"],
  [["violao"], "Violões"],
  [["contrabaixo"], "Contrabaixos"],
  [["bateria"], "Baterias"],
];

export function getProductSubcategory(product: Pick<Product, "name" | "category" | "subcategory">) {
  const name = normalizeText(product.name);
  const category = normalizeText(product.category);
  const rawSubcategory = product.subcategory ? normalizeText(product.subcategory) : "";
  const searchable = `${name} ${rawSubcategory}`;

  for (const [chaves, tipo] of TIPOS_TONANTE) {
    if (includesAny(`${searchable} `, chaves)) return tipo;
  }

  if (includesAny(searchable, ["teclado", "keyboard"])) return "Teclados";
  if (includesAny(searchable, ["mousepad", "mouse pad", "desk mat"])) return "Mousepads";
  if (includesAny(searchable, ["mouse"])) return "Mouses";
  if (includesAny(searchable, ["headset", "fone"])) return "Headsets";
  if (includesAny(searchable, ["microfone", "placa de captura", "captura", "webcam"])) return product.subcategory ?? "Streaming";
  if (includesAny(searchable, ["mini computador", "mini pc"])) return "Mini Computadores";
  if (includesAny(searchable, ["pcyes one", "all in one"])) return "All in One";
  if (includesAny(searchable, ["cadeira gamer"])) return "Cadeiras Gamer";
  if (includesAny(searchable, ["cadeira ergonomica", "cadeira ergonomica", "ergonomica"])) return "Cadeiras Ergonômicas";
  if (includesAny(searchable, ["cadeira office"])) return "Cadeiras Office";
  if (includesAny(searchable, ["water cooler"])) return "Water Coolers";
  if (includesAny(searchable, ["cooler fan"])) return "Cooler Fans";
  if (includesAny(searchable, ["cooler"])) return "Coolers";
  if (includesAny(searchable, ["gabinete"])) return "Gabinetes";
  if (includesAny(searchable, ["placa de video", "geforce", "radeon"])) return "Placas de Vídeo";
  if (includesAny(searchable, ["ssd", "hd ", "memoria", "memória"])) return product.subcategory ?? "Armazenamento";
  if (includesAny(searchable, ["fonte"])) return "Fontes";
  if (includesAny(searchable, ["monitor"])) return "Monitores";

  if (product.subcategory) return product.subcategory;
  if (category) return product.category;
  return "Produtos";
}

/* Placeholder do Magento: o CDN responde 200 com o logo cinza da plataforma
   (1.692 bytes, 262x262), então nem a URL nem o status denunciam — só o
   conteúdo. Estes três foram achados baixando a foto principal dos 282
   produtos e agrupando por hash md5; os arquivos batem byte a byte.
   Se aparecer outro produto sem foto na vitrine, é o mesmo procedimento:
   baixar, comparar o hash com os daqui, e acrescentar a URL na lista. */
const FOTOS_PLACEHOLDER_MAGENTO = [
  /* 10 · Suporte de Parede Para Guitarra, Baixo e Violão */
  "/1/0/106946-17523128018929446.jpeg",
  /* 77 · Suporte Triplo Para Guitarra, Baixo e Violão */
  "/1/4/146108-17459061237573801.jpeg",
  /* 274 · Capotraste Para Violao em Alumínio - Preto */
  "/1/-/1-17522997159603437.jpeg",
];

export function isPlaceholderProductImage(image?: string) {
  if (!image) return true;

  const normalized = image.toLowerCase();
  return (
    normalized.startsWith("/home/") ||
    normalized.includes("category-") ||
    normalized.includes("release-keyboard-context") ||
    FOTOS_PLACEHOLDER_MAGENTO.some((trecho) => normalized.includes(trecho))
  );
}

export function hasUsableProductImage(product: Pick<Product, "image" | "images">) {
  if (!isPlaceholderProductImage(product.image)) return true;
  return Boolean(product.images?.some((image) => !isPlaceholderProductImage(image)));
}

export function getPrimaryProductImage(product: Pick<Product, "image" | "images">) {
  return product.images?.find((image) => !isPlaceholderProductImage(image)) ?? product.image;
}

/**
 * A mesma foto existe em tamanho cheio no caminho sem o segmento de cache:
 * .../product/cache/<hash32>/1/1/foo.jpeg  →  .../product/1/1/foo.jpeg
 * (300x300 → 1200x1200, mesmo enquadramento). Quem exibe deve cair de volta
 * na URL original se o arquivo cheio não existir — ver ImageWithFallback.
 */
export function upgradeProductImage(image: string) {
  return image.replace(/\/cache\/[a-f0-9]{32}\//, "/");
}

/**
 * Thumb de 300x300 gerada pelo Magento (`/media/catalog/product/cache/<hash>/`).
 * O mesmo produto costuma ter o original em cdn.oderco.com.br — bem maior.
 * Usar a thumb num card de 370px deixa a foto visivelmente borrada.
 */
export function isLowResProductImage(image: string) {
  return /\/media\/catalog\/product\/cache\//.test(image);
}

/** Mesmas fotos de getProductImages, com os originais na frente das thumbs. */
export function getProductImagesRanked(product: Pick<Product, "image" | "images" | "sku">) {
  const images = getProductImages(product);
  return [...images].sort((a, b) => Number(isLowResProductImage(a)) - Number(isLowResProductImage(b)));
}

export function getProductImages(product: Pick<Product, "image" | "images" | "sku">) {
  const images = product.images?.filter((image) => !isPlaceholderProductImage(image)) ?? [];
  if (!isPlaceholderProductImage(product.image) && !images.includes(product.image)) {
    images.unshift(product.image);
  }

  /* Sessão oficial de estúdio (productGalleries) vem primeiro: são 10+ ângulos
     em 1200x1200 contra a foto única e recortada do dump do Magento. As do dump
     ficam no fim como fallback, sem duplicar o que a sessão já cobre. */
  const official = getOfficialGallery(product.sku);
  if (official.length > 0) {
    return [...official, ...images.filter((image) => !official.includes(image))];
  }

  return images.length > 0 ? images : [product.image];
}

export function getVisibleCatalogProducts(catalog: Product[] = allProducts) {
  return catalog.filter(hasUsableProductImage);
}

/**
 * Catalog URL builder (A1 stage 3).
 *
 * When a `category` is provided, emits the semantic slug form:
 *   /perifericos/
 *   /perifericos/mouses/
 *   /perifericos/mouses/?search=razer
 *
 * When only `search` (or nothing) is provided, falls back to the
 * legacy /produtos surface — there is no slug for "all products".
 */
export function getCatalogHref({ category, subcategory, search }: CatalogHrefParams) {
  if (category) {
    const path = getCategoryUrl(category, subcategory);
    if (search) {
      const sp = new URLSearchParams();
      sp.set("search", search);
      return `${path}?${sp.toString()}`;
    }
    return path;
  }

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const query = params.toString();
  return query ? `/produtos?${query}` : "/produtos";
}

function getColorRule(name: string) {
  const normalized = normalizeText(name);
  return COLOR_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
}

function tokenizeName(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isSwitchContext(tokens: string[], index: number) {
  return tokens[index - 1] === "switch" || tokens[index + 1] === "switch";
}

function getBodyColorLabels(name: string) {
  const tokens = tokenizeName(name);
  const labels = new Set<string>();

  COLOR_RULES.forEach((rule) => {
    tokens.forEach((token, index) => {
      if (!rule.keywords.includes(token)) return;
      if (isSwitchContext(tokens, index)) return;
      labels.add(rule.label);
    });
  });

  return Array.from(labels);
}

export function getProductColorLabels(product: Pick<Product, "name">) {
  return getBodyColorLabels(product.name);
}

function getFamilySignature(product: Pick<Product, "name" | "category">) {
  const normalized = normalizeText(product.name)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .filter((token) => !GENERIC_TOKENS.has(token))
    .filter((token) => !COLOR_RULES.some((rule) => rule.keywords.includes(token)));

  const familyTokens = normalized.slice(0, 2);
  return `${normalizeText(product.category)}::${familyTokens.join("-")}`;
}

export function findProductBySwatch(swatch: ProductSwatch, catalog: Product[] = allProducts) {
  return catalog.find((product) => product.id === swatch.productId) ?? null;
}

/**
 * Foto do produto para o seletor de cor.
 *
 * O swatch é um quadrado de 40px: foto ambientada vira mancha e a cor do
 * instrumento se perde no cenário. Prefere o recorte de estúdio — fundo
 * branco, corpo inteiro — e só cai na foto principal quando o produto não
 * tem nenhum (ver photoBackdrop.ts).
 */
export function getSwatchImage(product: Pick<Product, "image" | "images" | "sku">) {
  const estudio = getProductImages(product).find((image) => !isFotoAmbientada(image));
  return estudio ?? getPrimaryProductImage(product);
}

export function getProductSwatches(
  product: Pick<Product, "id" | "name" | "category" | "sku">,
  catalog: Product[] = allProducts,
): ProductSwatch[] {
  /* productVariants é a fonte boa: famílias medidas no catálogo inteiro, com o
     nome comercial da cor ("Deep Dark", "Merlot"). O caminho abaixo, por
     COLOR_RULES, é herança do protótipo de origem e só reconhece dez cores
     genéricas — fica de reserva para produto que ainda não está na tabela. */
  const info = getVariantInfo(product.sku);
  if (info) {
    const irmaos = catalog.filter((candidate) => {
      const outro = getVariantInfo(candidate.sku);
      return outro?.family === info.family && hasUsableProductImage(candidate);
    });
    const porCor = new Map<string, ProductSwatch>();
    irmaos.forEach((variant) => {
      const dele = getVariantInfo(variant.sku)!;
      if (porCor.has(dele.label)) return;
      porCor.set(dele.label, {
        color: dele.color,
        label: dele.label,
        productId: variant.id,
        image: getSwatchImage(variant),
        name: variant.name,
      });
    });
    if (porCor.size > 1) return Array.from(porCor.values()).slice(0, 8);
  }

  const signature = getFamilySignature(product);
  if (!signature.endsWith("::")) {
    const variants = catalog.filter((candidate) => getFamilySignature(candidate) === signature && hasUsableProductImage(candidate));
    const deduped = new Map<string, ProductSwatch>();

    variants.forEach((variant) => {
      const label = getBodyColorLabels(variant.name)[0];
      const rule = label ? COLOR_RULES.find((item) => item.label === label) : null;
      if (!rule) return;

      deduped.set(rule.label, {
        color: rule.color,
        label: rule.label,
        productId: variant.id,
        image: getSwatchImage(variant),
        name: variant.name,
      });
    });

    if (deduped.size > 1) {
      return Array.from(deduped.values()).slice(0, 6);
    }
  }

  return [];
}

export function getProductHoverMedia(
  product: Pick<Product, "id" | "image" | "images">,
): ProductHoverMedia | null {
  const video = hoverVideos[product.id];
  if (video) {
    return { type: "video", src: video };
  }

  if (product.images && product.images.length > 1) {
    return { type: "image", src: product.images[1] };
  }

  return null;
}
