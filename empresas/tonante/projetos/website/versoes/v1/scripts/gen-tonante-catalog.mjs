// Gera src/app/components/productsData.ts (catálogo Tonante completo) a partir de:
//  - produtos_tonante_sem-preco.csv (LISTA-MÃE: 282 produtos — sku, nome, imagem; SEM preço)
//  - _ref/src/catalog_data.js (TONANTE_REAL: HTML da esteira + ficha + galeria p/ ~43 SKUs)
//  - _ref/src/data.js (TONANTE_DATA: 22 curados — preço/rating/badge reais)
//  - produtos_tonante_com_imagens.csv (imagens extras por SKU)
// Preço: inventado determinístico por categoria (faixa plausível) + "de/por" em parte.
// Categoria: inferida do nome (a coluna do CSV é toda "Musical").
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

// ---- fontes JS ----
global.window = {};
require(path.join(root, '_ref/src/catalog_data.js'));
require(path.join(root, '_ref/src/data.js'));
const DATA = global.window.TONANTE_DATA;
const REAL = global.window.TONANTE_REAL || [];
const realBySku = {}; REAL.forEach((r) => { realBySku[r.sku] = r; });
const curatedBySku = {}; DATA.products.forEach((p) => { if (p.sku) curatedBySku[p.sku] = p; });

// ---- CSV simples com aspas (RFC4180) ----
function parseCsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c === '\r') { /* skip */ }
    else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift().map((h) => h.trim());
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, k) => [h, (r[k] || '').trim()])));
}

const master = parseCsv(path.join(root, 'produtos_tonante_sem-preco.csv'));

// imagens extras por SKU
const imagesBySku = {};
for (const r of parseCsv(path.join(root, 'produtos_tonante_com_imagens.csv'))) {
  const s = r.sku, u = r.cdn;
  if (s && u) (imagesBySku[s] ||= []).push(u);
}

// ---- helpers ----
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); };
const brl = (n) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = (s) => String(s || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function cleanName(raw) {
  let s = raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s*-\s*\d+\s*$/, '').trim();
  s = s.replace(/\s{2,}/g, ' ');
  return s.split(' ').map((w) => /\d/.test(w) || (w.length <= 3 && w === w.toUpperCase() && /[A-Z]/.test(w))
    ? w
    : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

// categoria inferida do nome. Ordem importa: encordoamento/suporte ANTES dos
// instrumentos (cujo nome traz "X cordas" e não deve cair em "Cordas").
// `acc` é a lista do que É acessório mesmo citando o instrumento no nome:
// "Cabo de Guitarra" caía em Guitarras e ficava na vitrine junto das guitarras,
// onde o comparador o colocava lado a lado com um instrumento.
function classify(name) {
  const n = name.toUpperCase();
  const acc = /SUPORTE|PAREDE|\bCAPA\b|\bBAG\b|\bCASE\b|CAPOTRASTE|\bCABO\b|\bPLUG\b|ADAPTADOR|ABAFADOR|ANTI-?FEEDBACK|DAMPER|MICROFONE|PALHETA|CORREIA|AFINADOR|POLIDOR|LIMPADOR|LUBRIFICANTE|CONDICIONADOR|APOIO/;
  if (/ENCORD|JOGO\s+DE\s+CORDAS|CORDA\s+(AVULSA|SOLTA)|CORDAS?\s+(PARA|P\/|DE)\b/.test(n)) return 'Cordas & Encordoamentos';
  if (/SUPORTE|PEDESTAL|ESTANTE|BANQUETA|TRIP[EÉ]|PARTITURA|CAVALETE|\bRACK\b/.test(n)) return 'Suportes';
  if (/VIOL[AÃ]O|UKULELE|CAVAQUINHO|VIOLA\s+CAIPIRA/.test(n) && !acc.test(n)) return 'Violões';
  if (/GUITARRA/.test(n) && !acc.test(n)) return 'Guitarras';
  if (/CONTRABAIXO|\bBAIXO\b/.test(n) && !acc.test(n)) return 'Contrabaixos';
  return 'Acessórios'; // palheta, capotraste, afinador, cabo, microfone, capa, etc.
}

// faixa de preço plausível por categoria (centavos terminando em ,90)
const RANGE = {
  'Violões': [690, 3200], 'Guitarras': [1490, 4400], 'Contrabaixos': [1590, 4200],
  'Cordas & Encordoamentos': [25, 95], 'Suportes': [69, 460], 'Acessórios': [15, 340],
};
function genPrice(sku, cat) {
  const h = hash(sku + ':p'); const [lo, hi] = RANGE[cat] || [40, 300];
  const raw = lo + (h % (hi - lo));
  return Math.max(lo, Math.round(raw / 10) * 10 - 0.10); // ...,90
}

// tags por palavra-chave do nome
const TAGWORDS = [
  ['Nylon', /NYLON/], ['Aço', /\bA[ÇC]O\b/], ['Eletroacústico', /ELETROAC/], ['Acústico', /AC[UÚ]STIC/],
  ['Clássico', /CL[AÁ]SSIC/], ['Humbucker', /HUMBUCKER/], ['Single-coil', /SINGLE|\bSSS\b|\bSSH\b/],
  ['6 cordas', /6\s*CORDAS|\bST\b|\bTL\b/], ['4 cordas', /4\s*CORDAS/], ['5 cordas', /5\s*CORDAS/],
  ['Dobrável', /DOBR[AÁ]VEL/], ['Tampo maciço', /MACI[ÇC]O/], ['Níquel', /N[IÍ]QUEL/], ['Bronze', /BRONZE/],
  ['Ukulele', /UKULELE/], ['Viola', /\bVIOLA\b/], ['Microfone', /MICROFONE/], ['Capotraste', /CAPOTRASTE/],
  ['Afinador', /AFINADOR/], ['Palheta', /PALHETA/], ['Cabo', /\bCABO\b/], ['Capa', /\bCAPA\b|\bBAG\b/],
];
function tagsFor(name, cat) {
  const n = name.toUpperCase(); const t = new Set([cat]);
  for (const [tag, re] of TAGWORDS) if (re.test(n)) t.add(tag);
  return [...t];
}

function buildHtml(name, cat, real) {
  const parts = ['<section class="produto-descricao">'];
  if (real) {
    if (real.focusTitle) parts.push(`<h2>${esc(real.focusTitle)}</h2>`);
    else parts.push(`<h2>Conheça o ${esc(name)}</h2>`);
    if (real.focusText) parts.push(`<p>${esc(real.focusText)}</p>`);
    if (real.blocoTitle) parts.push(`<h3>${esc(real.blocoTitle)}</h3>`);
    if (real.blocoText) parts.push(`<p>${esc(real.blocoText)}</p>`);
    if (real.bannerTitle) parts.push(`<h3>${esc(real.bannerTitle)}</h3>`);
    if (real.bannerText) parts.push(`<p>${esc(real.bannerText)}</p>`);
  } else {
    parts.push(`<h2>${esc(name)}</h2>`);
    parts.push(`<p>Parte da linha Tonante de ${esc(cat.toLowerCase())}, o ${esc(name)} carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p>`);
    parts.push(`<h3>Cuidado de quem entende</h3>`);
    parts.push(`<p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p>`);
    parts.push(`<h3>Pronto para tocar</h3>`);
    parts.push(`<p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>`);
  }
  return parts.join('');
}

function specsFor(name, cat, sku, real) {
  if (real && real.ficha && real.ficha.length) {
    const s = real.ficha.map((f) => ({ label: f.k, value: f.v }));
    if (!s.some((x) => x.label === 'SKU')) s.unshift({ label: 'SKU', value: sku });
    return s;
  }
  return [
    { label: 'SKU', value: sku },
    { label: 'Categoria', value: cat },
    { label: 'Marca', value: 'Tonante' },
    { label: 'Garantia', value: '2 anos contra defeitos de fabricação' },
    { label: 'Origem', value: 'Brasil · tradição desde 1954' },
  ];
}

// ---- monta produtos ----
const products = master.map((row, i) => {
  const sku = row.sku;
  const name = cleanName(row.nome);
  const cat = classify(name);
  const real = realBySku[sku] || null;
  const curated = curatedBySku[sku] || null;
  const h = hash(sku);

  // imagens: principal do master + extras (CSV/REAL), dedupe, cap 6
  let images = [row.cdn].filter(Boolean);
  if (imagesBySku[sku]) images.push(...imagesBySku[sku]);
  if (real) images.push(real.hero, real.specImg, ...(real.galeria || []), ...(real.lateral || []));
  images = [...new Set(images.filter(Boolean))].slice(0, 6);
  const image = images[0] || row.cdn;

  // preço: curado > inventado
  let priceNum = curated ? curated.price : genPrice(sku, cat);
  let oldPriceNum = curated && curated.old ? curated.old : null;
  if (!oldPriceNum && (h % 100) < 32) { // ~32% ganham "de/por"
    const factor = 1.12 + ((h >> 3) % 23) / 100; // 1.12–1.34
    oldPriceNum = Math.round((priceNum * factor) / 10) * 10 - 0.10;
  }

  const rating = curated ? curated.rating : (44 + (h % 6)) / 10; // 4.4–4.9
  const reviews = curated ? curated.reviews : 18 + (h % 470);
  const badge = curated && curated.badge ? curated.badge
    : (oldPriceNum ? 'Oferta' : ((h % 100) < 10 ? 'Novidade' : null));

  const seoSlug = slug(name + ' ' + sku);
  const out = {
    id: i + 1,
    sku,
    name,
    price: brl(priceNum),
    priceNum,
    rating,
    reviews,
    category: cat,
    subcategory: curated ? curated.form : undefined,
    tags: tagsFor(name, cat),
    brand: 'Tonante',
    image,
    images,
    inStock: true,
    description: curated ? curated.desc : `${name} — tradição Tonante desde 1954.`,
    htmlDescription: buildHtml(name, cat, real),
    features: real && real.ficha && real.ficha.length
      ? real.ficha.slice(0, 6).map((f) => `${f.k}: ${f.v}`)
      : [tagsFor(name, cat).slice(1, 4).join(' · ') || cat, 'Acabamento Tonante de fábrica', 'Garantia de 2 anos', 'Tradição brasileira desde 1954'],
    specs: specsFor(name, cat, sku, real),
    seoSlug,
    productUrl: `https://tonante.com.br/${seoSlug}`,
  };
  if (oldPriceNum && oldPriceNum > priceNum) { out.oldPrice = brl(oldPriceNum); out.oldPriceNum = oldPriceNum; }
  if (badge) out.badge = badge;
  return out;
});

const allTags = [...new Set(products.flatMap((p) => p.tags))];
const categories = ['Violões', 'Guitarras', 'Contrabaixos', 'Acessórios', 'Cordas & Encordoamentos', 'Suportes'];

const header = `export interface Product {
  id: number;
  sku?: string;
  name: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  oldPriceNum?: number;
  rating: number;
  reviews: number;
  category: string;
  subcategory?: string;
  tags: string[];
  image: string;
  badge?: string;
  brand?: string;
  inStock?: boolean;
  description?: string;
  htmlDescription?: string;
  seoSlug?: string;
  productUrl?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  images?: string[];
}

`;

const wrapper = `
export const allProducts: Product[] = rawProducts;

export const categories = ${JSON.stringify(categories)};
export const allTags = ${JSON.stringify(allTags)};
export const brands = ["Tonante"];
`;

const body = `const rawProducts: Product[] = ${JSON.stringify(products, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'src/app/components/productsData.ts'), header + body + wrapper, 'utf8');

const byCat = {};
products.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
const real = products.filter((p) => realBySku[p.sku]).length;
const withOld = products.filter((p) => p.oldPriceNum).length;
console.log(`OK — ${products.length} produtos | ${allTags.length} tags`);
console.log('por categoria:', byCat);
console.log(`com HTML real (esteira): ${real} | com preço curado: ${products.filter(p => curatedBySku[p.sku]).length} | em oferta: ${withOld}`);
