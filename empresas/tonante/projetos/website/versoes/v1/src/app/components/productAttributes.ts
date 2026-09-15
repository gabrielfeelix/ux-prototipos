import type { Product } from "./productsData";

/**
 * productAttributes — deriva atributos REAIS de instrumento a partir do `name`
 * do produto (a fonte de verdade; htmlDescription/features/specs do catálogo são
 * boilerplate). Não-destrutivo: parser puro em runtime, sem mutar productsData.
 *
 * Uso: getCardSpecs(p) → 2-3 chips técnicos p/ a linha de specs do card (§4.2.10);
 * getProductAttributes(p) → objeto completo p/ PDP, tone chips de linha, filtros.
 */

export interface ProductAttributes {
  tipo?: string;        // "Clássico", "Elétrico", "Eletroacústico"
  tamanho?: string;     // '41"'
  corda?: string;       // "Nylon" | "Aço"
  tampo?: string;       // "Spruce", "Mahogany", "Zebrawood"...
  cor?: string;         // "Natural", "Sunset"...
  cordas?: number;      // 4 | 5 | 6 | 12
  linha?: string;       // modelo/linha: "Coral", "Lorenzzo", "Jazzmine"...
  eq?: string;          // "EQ 3 Bandas"
  cutaway?: boolean;
  config?: string;      // guitarra: "SSS" | "SS" | "HSS"...
  espessura?: string;   // palheta: "1.0mm"
  quantidade?: string;  // "20 un"
  comprimento?: string; // cabo: "3,05m"
  conectores?: string;  // "P10/XLR"
  gauge?: string;       // cordas: ".010-.046"
  alvo?: string;        // cordas/suporte alvo: "Violão" | "Guitarra" | "Baixo"
  material?: string;    // cordas: "Aço" | "Nylon" | "Níquel"
  tipoSuporte?: string; // "Parede" | "Cavalete" | "Girafa" | "Tripé"...
  dobravel?: boolean;
}

const TAMPO_MAP: Record<string, string> = {
  spruce: "Spruce",
  mahogany: "Mahogany",
  zebra: "Zebrawood",
  zebrawood: "Zebrawood",
  basswood: "Basswood",
  cedro: "Cedro",
  cedar: "Cedro",
};

/** Linhas conhecidas (modelos de violão/guitarra/baixo Tonante). */
const LINHAS = [
  "Lorenzzo", "Abalone", "Quartzo", "Safira", "Coral", "Onix", "Ônix",
  "Topázio", "Jade", "Ametista", "Rubi", "Esmeralda", "Âmbar", "Ambar",
  "Citrino", "Ágata", "Agata", "Jaspe", "Magma", "Opala", "Granada", "Masaya",
  "Kilauea", "Vesúvio", "Vesuvio", "Etna", "Misti", "Haka",
  "Valentine's", "Valentine", "Cecille", "Star Light", "Muriel's", "Muriel",
  "Jazzmine", "Theodor", "Sonora",
];

function firstMatch(re: RegExp, s: string): string | undefined {
  const m = re.exec(s);
  return m ? m[1] : undefined;
}

function detectLinha(name: string): string | undefined {
  for (const l of LINHAS) {
    if (new RegExp(`\\b${l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(name)) {
      return l.replace("Ônix", "Onix").replace("Ambar", "Âmbar").replace("Agata", "Ágata")
        .replace("Vesuvio", "Vesúvio").replace(/^Valentine$/, "Valentine's")
        .replace(/^Muriel$/, "Muriel's");
    }
  }
  return undefined;
}

function detectCordas(name: string): number | undefined {
  const m = /(\d+)\s*[Cc]ordas/.exec(name);
  if (m) return Number(m[1]);
  if (/\b12\s*[Cc]ordas|\bdoze cordas/i.test(name)) return 12;
  return undefined;
}

function parseViolao(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  const lower = name.toLowerCase();
  a.linha = detectLinha(name);
  a.tamanho = firstMatch(/(\d{2})\s*"/, name) ? `${firstMatch(/(\d{2})\s*"/, name)}"` : undefined;
  if (/nylon/i.test(name)) a.corda = "Nylon";
  else if (/\ba[çc]o\b/i.test(name)) a.corda = "Aço";
  /* "CEQ"/"EQ" no código do modelo (GNF3 CEQ, GD1 EQ) também é eletroacústico:
     é como o catálogo de terceiros marca que tem captação. */
  if (/eletro[\s-]?ac[uú]stico|el[eé]trico|\bc?eq\b/i.test(name)) a.tipo = "Eletroacústico";
  else if (/cl[aá]ssico/i.test(name)) a.tipo = "Clássico";
  else if (/ac[uú]stico/i.test(name)) a.tipo = "Acústico";
  for (const k of Object.keys(TAMPO_MAP)) {
    if (lower.includes(k)) { a.tampo = TAMPO_MAP[k]; break; }
  }
  const eq = firstMatch(/eq\s*(\d)\s*bandas/i, name);
  if (eq) a.eq = `EQ ${eq} bandas`;
  if (/cutaway/i.test(name)) a.cutaway = true;
  /* ukulele mora em "Violões" no catálogo, mas tem 4 cordas e nylon sempre */
  if (/ukulele/i.test(name)) {
    a.cordas = detectCordas(name) ?? 4;
    a.corda = "Nylon";
    a.tamanho = undefined;
    return a;
  }
  a.cordas = detectCordas(name) ?? 6;
  return a;
}

function parseGuitarra(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  a.linha = detectLinha(name);
  a.config = firstMatch(/\b(HSS|SSS|HSH|HH|SS|HS)\b/i, name)?.toUpperCase();
  if (/el[eé]trica/i.test(name)) a.tipo = "Elétrica";
  a.cordas = detectCordas(name) ?? 6;
  return a;
}

function parseBaixo(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  a.linha = detectLinha(name);
  a.cordas = detectCordas(name) ?? 4;
  if (/el[eé]trico/i.test(name)) a.tipo = "Elétrico";
  return a;
}

function parseCorda(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  if (/violao|violão/i.test(name)) a.alvo = "Violão";
  else if (/guitarra/i.test(name)) a.alvo = "Guitarra";
  else if (/baixo|contrabaixo/i.test(name)) a.alvo = "Baixo";
  if (/nylon/i.test(name)) a.material = "Nylon";
  else if (/\ba[çc]o\b/i.test(name)) a.material = "Aço";
  else if (/n[ií]quel/i.test(name)) a.material = "Níquel";
  // gauge: range com traço (.010-.046 | 0.029 - 0.044), par pontilhado (.009.042),
  // par com 1 ponto (009.045) ou trio isolado no fim (" 012"). NÃO grudar no modelo.
  const g =
    name.match(/\.?\d{2,3}\s*[-–]\s*\.?\d{2,3}/) ||
    name.match(/\.\d{3}\.\d{3}/) ||
    name.match(/(?:^|\s)\d{3}\.\d{3}\b/) ||
    name.match(/(?:^|\s)(\.?\d{3})(?=\s|$)/);
  a.gauge = g ? g[0].trim() : undefined;
  a.cordas = detectCordas(name);
  return a;
}

function parseSuporte(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  if (/parede|slatwall/i.test(name)) a.tipoSuporte = "Parede";
  else if (/cavalete/i.test(name)) a.tipoSuporte = "Cavalete";
  else if (/girafa/i.test(name)) a.tipoSuporte = "Girafa";
  else if (/trip[ée]|tripod/i.test(name)) a.tipoSuporte = "Tripé";
  else if (/triplo/i.test(name)) a.tipoSuporte = "Triplo";
  else if (/tubular/i.test(name)) a.tipoSuporte = "Tubular";
  else if (/estante|partitura/i.test(name)) a.tipoSuporte = "Estante";
  if (/dobr[aá]vel/i.test(name)) a.dobravel = true;
  if (/guitarra|baixo|viol[aã]o/i.test(name)) a.alvo = "Instrumentos";
  else if (/teclado/i.test(name)) a.alvo = "Teclado";
  else if (/microfone|microf/i.test(name)) a.alvo = "Microfone";
  return a;
}

function parseAcessorio(name: string): ProductAttributes {
  const a: ProductAttributes = {};
  // Espessura só faz sentido p/ palheta (0.5–3mm). Em cabo, "0,20 MM" é bitola, não-spec.
  if (/palheta/i.test(name)) {
    const esp = firstMatch(/(\d[.,]?\d?)\s*mm/i, name);
    if (esp) a.espessura = `${esp.replace(",", ".")}mm`;
  }
  const qtd = firstMatch(/c\/?\s*(\d+)\s*p[cç]s?|(\d+)\s*pe[çc]as/i, name);
  if (qtd) a.quantidade = `${qtd} un`;
  // Cabo: comprimento + conectores
  const comp = firstMatch(/(\d+[.,]\d+)\s*m\b/i, name);
  if (comp) a.comprimento = `${comp.replace(".", ",")}m`;
  const con = name.match(/\b(P10|XLR|P2|RCA)\b/gi);
  if (con && con.length) a.conectores = [...new Set(con.map((c) => c.toUpperCase()))].slice(0, 2).join("/");
  return a;
}

/** Parser principal — despacha por categoria. */
export function getProductAttributes(p: Product): ProductAttributes {
  const name = p.name || "";
  switch (p.category) {
    case "Violões": return parseViolao(name);
    case "Guitarras": return /cabo/i.test(name) ? parseAcessorio(name) : parseGuitarra(name);
    case "Contrabaixos": return parseBaixo(name);
    case "Cordas & Encordoamentos": return parseCorda(name);
    case "Suportes": return parseSuporte(name);
    case "Acessórios": return parseAcessorio(name);
    default: return {};
  }
}

/**
 * getCardSpecs — 2-3 chips técnicos curtos p/ a linha de specs do card.
 * Retorna [] se nada útil for derivável (card oculta a linha — nunca placeholder).
 */
export function getCardSpecs(p: Product): string[] {
  const a = getProductAttributes(p);
  const out: string[] = [];
  const push = (v?: string | number | boolean, label?: string) => {
    if (v === undefined || v === false || v === "") return;
    if (v === true && label) out.push(label);
    else if (typeof v !== "boolean") out.push(String(v));
  };
  switch (p.category) {
    case "Violões":
      push(a.tamanho); push(a.corda); push(a.tampo ?? a.tipo);
      break;
    case "Guitarras":
      if (/cabo/i.test(p.name)) { push(a.comprimento); push(a.conectores); }
      else { push(a.cordas ? `${a.cordas} cordas` : undefined); push(a.config); push(a.tipo); }
      break;
    case "Contrabaixos":
      push(a.cordas ? `${a.cordas} cordas` : undefined); push(a.linha); push(a.tipo);
      break;
    case "Cordas & Encordoamentos":
      push(a.alvo); push(a.material); push(a.gauge);
      break;
    case "Suportes":
      push(a.tipoSuporte); push(a.dobravel, "Dobrável"); push(a.alvo);
      break;
    case "Acessórios":
      push(a.espessura); push(a.quantidade); push(a.comprimento); push(a.conectores);
      break;
  }
  return out.filter(Boolean).slice(0, 3);
}
