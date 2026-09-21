/**
 * Busca do catálogo Tonante — um único motor para todas as superfícies
 * (sugestões do header, modal de busca, barra v2 e a página de produtos).
 *
 * O que ele resolve, além do `includes()` que existia antes:
 *
 * 1. Relevância por contexto. Quem digita "guitarras" quer guitarras, não
 *    encordoamento para guitarra nem cabo de guitarra. A categoria do produto
 *    e a primeira palavra do nome pesam muito mais que uma menção no meio do
 *    título, então o instrumento sobe e o acessório fica atrás.
 * 2. Erro de digitação. "guitara", "guitarrrra", "suprote", "encordamento" e
 *    "violaum" caem na palavra certa via distância de Damerau-Levenshtein
 *    (troca, inserção, remoção e transposição de letras) sobre o vocabulário
 *    extraído do próprio catálogo.
 * 3. Sinônimo e apelido. "baixo"/"bass", "capo"/"capotraste", "tuner"/
 *    "afinador", "pick"/"palheta", "bag"/"capa", "p10"/"cabo".
 * 4. Plural e acento. "violões" → "violao", "cordas" → "corda".
 * 5. Palavra colada ou partida. "contra baixo" vira "contrabaixo" e
 *    "capotraste" continua achando "capo traste".
 *
 * A saída também informa a correção aplicada (`correctedQuery`), para a
 * interface poder dizer "mostrando resultados para guitarra".
 */

import type { Product } from "../components/productsData";

/* ────────────────────────────── normalização ────────────────────────────── */

/** Minúsculas, sem acento, sem espaço sobrando. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Palavras que não ajudam a discriminar produto. */
const STOPWORDS = new Set([
  "a", "as", "o", "os", "de", "da", "do", "das", "dos", "e", "em", "para",
  "pra", "p", "por", "com", "sem", "no", "na", "nos", "nas", "um", "uma",
  "the", "of", "c",
]);

/** Quebra em palavras (letras e números), já normalizadas. */
function tokenize(value: string): string[] {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
}

/** "guitarrrra" → "guitarra": corta repetição de 3+ para 2, e de 2 para 1. */
function collapseRuns(word: string): string[] {
  const twice = word.replace(/(.)\1{2,}/g, "$1$1");
  const once = word.replace(/(.)\1+/g, "$1");
  const out = [twice];
  if (once !== twice) out.push(once);
  return out;
}

/** Singular aproximado do português: violões → violao, cordas → corda. */
function singularize(word: string): string[] {
  if (word.length < 4) return [];
  const rules: [RegExp, string][] = [
    [/oes$/, "ao"],   // violoes → violao
    [/aes$/, "ao"],
    [/ais$/, "al"],   // cristais → cristal
    [/eis$/, "el"],
    [/ois$/, "ol"],
    [/ns$/, "m"],     // homens → homem
    [/res$/, "r"],    // mulheres → mulher
    [/es$/, ""],      // cabos? (cobre "pedes" → "ped", inofensivo)
    [/s$/, ""],       // cordas → corda
  ];
  const out: string[] = [];
  for (const [re, rep] of rules) {
    if (re.test(word)) {
      const candidate = word.replace(re, rep);
      if (candidate.length >= 3 && !out.includes(candidate)) out.push(candidate);
    }
  }
  return out;
}

/* ────────────────────────────── vocabulário ─────────────────────────────── */

/**
 * Apelido → palavra do catálogo. Chave e valor sempre normalizados. O valor
 * pode não existir no catálogo (aí o termo simplesmente não acha nada, que é
 * o comportamento honesto).
 */
const ALIASES: Record<string, string> = {
  // instrumentos
  guitar: "guitarra",
  guitars: "guitarra",
  guita: "guitarra",
  gitarra: "guitarra",
  guitarrra: "guitarra",
  eletrica: "eletrica",
  bass: "contrabaixo",
  basses: "contrabaixo",
  baixo: "contrabaixo",
  baixos: "contrabaixo",
  contrabaixos: "contrabaixo",
  jazzbass: "jazz",
  precisionbass: "precision",
  violaum: "violao",
  violaun: "violao",
  violoes: "violao",
  acustico: "violao",
  acustica: "violao",
  uke: "ukulele",
  cavaco: "cavaquinho",

  // cordas
  encordoamentos: "encordoamento",
  encordamento: "encordoamento",
  encordoamneto: "encordoamento",
  strings: "corda",
  string: "corda",
  jogodecordas: "encordoamento",

  // acessórios
  capo: "capotraste",
  capotrastes: "capotraste",
  braçadeira: "capotraste",
  pick: "palheta",
  picks: "palheta",
  plectro: "palheta",
  palhetas: "palheta",
  tuner: "afinador",
  afinacao: "afinador",
  afinadores: "afinador",
  strap: "correia",
  alca: "correia",
  bag: "capa",
  gigbag: "capa",
  case: "capa",
  estojo: "capa",
  banco: "banqueta",
  jack: "cabo",
  p10: "cabo",
  cabos: "cabo",
  cable: "cabo",
  mute: "abafador",
  abafadores: "abafador",

  // suportes
  suportes: "suporte",
  apoio: "suporte",
  pedestal: "suporte",
  estante: "suporte",
  tripe: "tripe",
  tripes: "tripe",

  // materiais / marcas
  aco: "aco",
  niquel: "niquel",
  nylon: "nylon",
  daddario: "addario",
  dadario: "addario",
  santoangelo: "angelo",
};

/**
 * Palavra → categorias que aquela palavra realmente designa. É daqui que sai
 * o desempate entre "guitarra o instrumento" e "guitarra a peça de reposição".
 */
const CATEGORY_INTENT: Record<string, string[]> = {
  guitarra: ["Guitarras"],
  violao: ["Violões"],
  contrabaixo: ["Contrabaixos"],
  encordoamento: ["Cordas & Encordoamentos"],
  corda: ["Cordas & Encordoamentos"],
  suporte: ["Suportes"],
  tripe: ["Suportes"],
  acessorio: ["Acessórios"],
  acessorios: ["Acessórios"],
  kit: ["Pronto pra Tocar"],
  kits: ["Pronto pra Tocar"],
  instrumento: ["Violões", "Guitarras", "Contrabaixos"],
  instrumentos: ["Violões", "Guitarras", "Contrabaixos"],
};

interface Vocabulary {
  /** Todas as palavras do catálogo + as chaves de apelido. */
  words: Set<string>;
  /** Palavras agrupadas por letra inicial, para podar o cálculo de distância. */
  byInitial: Map<string, string[]>;
  /**
   * Em quantos produtos cada palavra aparece. Desempata o que "vio" quer
   * dizer: violão (75 produtos) na frente de viola (uma dúzia).
   */
  frequency: Map<string, number>;
}

const vocabularyCache = new WeakMap<object, Vocabulary>();

function buildVocabulary(products: Product[]): Vocabulary {
  const words = new Set<string>();
  const frequency = new Map<string, number>();

  for (const product of products) {
    const seen = new Set<string>();
    const fields = [
      product.name,
      product.category,
      product.subcategory,
      product.brand,
      ...(product.tags ?? []),
    ];
    for (const field of fields) {
      if (!field) continue;
      for (const token of tokenize(field)) {
        if (token.length < 2 || STOPWORDS.has(token)) continue;
        words.add(token);
        seen.add(token);
      }
    }
    for (const token of seen) frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  for (const key of Object.keys(ALIASES)) words.add(key);
  for (const key of Object.keys(CATEGORY_INTENT)) words.add(key);

  const byInitial = new Map<string, string[]>();
  for (const word of words) {
    const initial = word[0];
    const bucket = byInitial.get(initial);
    if (bucket) bucket.push(word);
    else byInitial.set(initial, [word]);
  }

  return { words, byInitial, frequency };
}

function getVocabulary(products: Product[]): Vocabulary {
  const cached = vocabularyCache.get(products);
  if (cached) return cached;
  const built = buildVocabulary(products);
  vocabularyCache.set(products, built);
  return built;
}

/* ──────────────────────────── distância de edição ───────────────────────── */

/**
 * Damerau-Levenshtein com teto: devolve `limit + 1` assim que passa do teto.
 * Cobre troca ("guitarrs"), falta ("guitara"), sobra ("guitarraa") e
 * inversão de vizinhas ("suprote").
 */
function editDistance(a: string, b: string, limit: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > limit) return limit + 1;

  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) rows.push(new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    let rowBest = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, rows[i - 2][j - 2] + 1);
      }
      rows[i][j] = value;
      if (value < rowBest) rowBest = value;
    }
    if (rowBest > limit) return limit + 1;
  }

  return rows[a.length][b.length];
}

/** Quanto erro se tolera conforme o tamanho da palavra digitada. */
function distanceBudget(word: string): number {
  if (word.length <= 3) return 0;
  if (word.length <= 5) return 1;
  return 2;
}

/* ─────────────────────────── preparação da query ────────────────────────── */

type MatchKind = "exact" | "prefix" | "fuzzy";

interface QueryToken {
  /** Como o usuário digitou (normalizado). */
  raw: string;
  /** Formas aceitas para casar com o texto do produto. */
  forms: string[];
  formSet: Set<string>;
  /**
   * Formas aceitas como começo de palavra. É o que faz a busca responder
   * enquanto a pessoa ainda digita: "g", "gu" e "guitarr" já acham guitarra.
   */
  prefixes: string[];
  /** Palavra canônica escolhida, usada para intenção e para o "quis dizer". */
  canonical: string;
  kind: MatchKind;
  intent: string[];
  /** Fator de confiança do casamento. */
  weight: number;
}

export interface PreparedQuery {
  raw: string;
  tokens: QueryToken[];
  /** Consulta reescrita quando houve correção de digitação. */
  correctedQuery?: string;
  /** Categorias que a consulta designa, na ordem em que apareceram. */
  intentCategories: string[];
  /**
   * Categorias do substantivo principal da consulta. Em português o núcleo vem
   * primeiro e o resto qualifica: em "cordas para guitarra" o usuário quer
   * cordas; em "guitarra" quer guitarra. Produto fora daqui vai para o fim.
   */
  primaryCategories: string[];
}

const KIND_WEIGHT: Record<MatchKind, number> = { exact: 1, prefix: 0.85, fuzzy: 0.65 };

/** Variações de escrita de um token, antes de olhar o vocabulário. */
function tokenForms(token: string): string[] {
  const forms = new Set<string>([token]);
  for (const collapsed of collapseRuns(token)) forms.add(collapsed);
  for (const form of [...forms]) {
    for (const singular of singularize(form)) forms.add(singular);
  }
  for (const form of [...forms]) {
    const alias = ALIASES[form];
    if (alias) forms.add(alias);
  }
  /* Só o que foi digitado pode ter menos de 3 letras. Forma derivada curta
     (o "z" que sobra de "zzz", o "a" de "aaa") casaria com meio catálogo. */
  return [...forms].filter((form) => form === token || form.length >= 3);
}

function resolveToken(token: string, vocab: Vocabulary): QueryToken {
  const forms = tokenForms(token);
  /* O token cru sempre vale como começo de palavra, inclusive com uma letra
     só. As formas com repetição colapsada só valem a partir de 3 letras: sem
     isso, "zzz" viraria o prefixo "z" e traria Zebra e Zinco. */
  const prefixes = [token, ...collapseRuns(token).filter((form) => form.length >= 3)];

  // 1. Palavra que já existe no catálogo (ou apelido conhecido).
  for (const form of forms) {
    if (vocab.words.has(form)) {
      const canonical = ALIASES[form] ?? form;
      return buildToken(token, forms, prefixes, canonical, "exact");
    }
  }

  // 2. Começo de palavra: "guit" acha "guitarra", "encord" acha
  //    "encordoamento". Escolhe a palavra mais curta que começa igual.
  let best: string | undefined;
  let bestFrequency = -1;
  for (const form of prefixes.length > forms.length ? prefixes : forms) {
    const bucket = vocab.byInitial.get(form[0]) ?? [];
    for (const word of bucket) {
      if (word.length <= form.length || !word.startsWith(form)) continue;
      const frequency = vocab.frequency.get(word) ?? 0;
      // Mais produtos primeiro; empate fica com a palavra mais curta.
      if (frequency > bestFrequency || (frequency === bestFrequency && best !== undefined && word.length < best.length)) {
        bestFrequency = frequency;
        best = word;
      }
    }
  }
  if (best) return buildToken(token, [...forms, best], prefixes, ALIASES[best] ?? best, "prefix");

  // 3. Palavra inteira digitada errado: vizinha mais próxima do catálogo.
  const whole = nearestWord(forms, vocab, (word) => word);
  if (whole) return buildToken(token, [...forms, whole], prefixes, ALIASES[whole] ?? whole, "fuzzy");

  // 4. Começo de palavra digitado errado — o caso de quem para no meio:
  //    "supro" de "suporte", "guitr" de "guitarra". Compara o que foi
  //    digitado com o pedaço do mesmo tamanho de cada palavra do catálogo.
  const partial = nearestWord(
    forms.filter((form) => form.length >= 4),
    vocab,
    (word, form) => word.slice(0, form.length),
    (form) => (form.length <= 5 ? 1 : 2),
  );
  if (partial) {
    return buildToken(token, [...forms, partial], [...prefixes], ALIASES[partial] ?? partial, "fuzzy");
  }

  // 5. Desconhecido: tenta como pedaço de texto mesmo.
  return buildToken(token, forms, prefixes, token, "exact");
}

/**
 * Palavra do catálogo mais próxima das formas digitadas. `target` escolhe o
 * que entra na comparação (a palavra inteira, ou só o começo dela, do tamanho
 * do que foi digitado). Empate fica com a palavra mais curta, que é a mais
 * genérica — "suporte" antes de "suportes".
 */
function nearestWord(
  forms: string[],
  vocab: Vocabulary,
  target: (word: string, form: string) => string,
  budgetOf: (form: string) => number = distanceBudget,
): string | undefined {
  let bestWord: string | undefined;
  let bestDistance = Infinity;

  for (const form of forms) {
    const budget = budgetOf(form);
    if (budget === 0) continue;
    const bucket = vocab.byInitial.get(form[0]) ?? [];
    for (const word of bucket) {
      const candidate = target(word, form);
      if (candidate.length < form.length) continue;
      if (Math.abs(candidate.length - form.length) > budget) continue;
      const distance = editDistance(form, candidate, budget);
      if (distance > budget) continue;
      if (distance < bestDistance || (distance === bestDistance && bestWord !== undefined && word.length < bestWord.length)) {
        bestDistance = distance;
        bestWord = word;
      }
    }
  }

  return bestWord;
}

/**
 * Palavra de categoria que começa igual ao que foi digitado. Serve para
 * "guit" (que existe no catálogo como abreviação em "Cabo de Guit.") continuar
 * significando guitarra, e para "encord" significar encordoamento.
 */
function intentByPrefix(forms: string[]): string | undefined {
  for (const form of forms) {
    if (form.length < 3) continue;
    for (const key of Object.keys(CATEGORY_INTENT)) {
      if (key.startsWith(form)) return key;
    }
  }
  return undefined;
}

function buildToken(
  raw: string,
  forms: string[],
  prefixes: string[],
  canonical: string,
  kind: MatchKind,
): QueryToken {
  const allForms = new Set(forms);
  allForms.add(canonical);
  if (!CATEGORY_INTENT[canonical]) {
    const byPrefix = intentByPrefix([...allForms, ...prefixes]);
    if (byPrefix) {
      allForms.add(byPrefix);
      canonical = byPrefix;
    }
  }
  const formSet = new Set(allForms);
  return {
    raw,
    forms: [...allForms],
    formSet,
    prefixes: [...new Set(prefixes)].filter((prefix) => prefix.length >= 1),
    canonical,
    kind,
    intent: CATEGORY_INTENT[canonical] ?? [],
    weight: KIND_WEIGHT[kind],
  };
}

/** Lê a consulta do usuário e resolve cada palavra contra o catálogo. */
export function prepareQuery(query: string, products: Product[]): PreparedQuery | null {
  const raw = normalizeSearchText(query);
  if (!raw) return null;

  const vocab = getVocabulary(products);
  const allTokens = tokenize(raw);
  const useful = allTokens.filter((token) => !STOPWORDS.has(token) || /^\d+$/.test(token));
  // Se a pessoa digitou só "c" ou "de", é isso que ela tem: busca com o que veio.
  const rawTokens = useful.length > 0 ? useful : allTokens;
  if (rawTokens.length === 0) return null;

  // "contra baixo" → "contrabaixo", "capo traste" → "capotraste".
  const merged: string[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const pair = rawTokens[i] + (rawTokens[i + 1] ?? "");
    if (rawTokens[i + 1] && (vocab.words.has(pair) || ALIASES[pair])) {
      merged.push(pair);
      i++;
    } else {
      merged.push(rawTokens[i]);
    }
  }

  const tokens = merged.map((token) => resolveToken(token, vocab));

  const corrected = tokens.map((token) => (token.kind === "fuzzy" ? token.canonical : token.raw));
  const correctedQuery = tokens.some((token) => token.kind === "fuzzy") ? corrected.join(" ") : undefined;

  const intentCategories: string[] = [];
  for (const token of tokens) {
    for (const category of token.intent) {
      if (!intentCategories.includes(category)) intentCategories.push(category);
    }
  }

  const primaryToken = tokens.find((token) => token.intent.length > 0);
  const primaryCategories = primaryToken ? primaryToken.intent : [];

  return { raw, tokens, correctedQuery, intentCategories, primaryCategories };
}

/* ───────────────────────────────── score ────────────────────────────────── */

const FIELD_SCORE = {
  /** Categoria do núcleo da consulta. */
  primaryCategory: 500,
  /** Categoria de uma palavra que só qualifica o núcleo. */
  intentCategory: 80,
  /** Primeira palavra do nome — é o tipo do produto ("Ukulele Concerto"). */
  nameHead: 200,
  /** Segunda palavra do nome ("Encordoamento Ukulele"). */
  nameHeadSecond: 120,
  /** A palavra saiu igual da mão do usuário, não de um sinônimo. */
  literalHead: 60,
  sku: 350,
  category: 60,
  brand: 45,
  subcategory: 30,
  nameWord: 30,
  tag: 22,
  namePartial: 10,
  description: 4,
} as const;

interface ProductIndex {
  category: string;
  categoryWords: string[];
  brand: string;
  brandWords: string[];
  subcategory: string;
  subcategoryWords: string[];
  name: string;
  /** Duas primeiras palavras úteis do nome, com a posição de cada uma. */
  head: Map<string, number>;
  nameWords: string[];
  nameWordSet: Set<string>;
  tags: string;
  tagWords: string[];
  description: string;
  sku: string;
}

const indexCache = new WeakMap<Product, ProductIndex>();

function getIndex(product: Product): ProductIndex {
  const cached = indexCache.get(product);
  if (cached) return cached;

  const nameTokens = tokenize(product.name).filter((token) => !STOPWORDS.has(token));
  const tagsText = (product.tags ?? []).map((tag) => normalizeSearchText(tag)).join(" | ");
  const built: ProductIndex = {
    category: normalizeSearchText(product.category),
    categoryWords: tokenize(product.category),
    brand: normalizeSearchText(product.brand ?? ""),
    brandWords: tokenize(product.brand ?? ""),
    subcategory: normalizeSearchText(product.subcategory ?? ""),
    subcategoryWords: tokenize(product.subcategory ?? ""),
    name: normalizeSearchText(product.name),
    head: new Map(nameTokens.slice(0, 2).map((token, position) => [token, position])),
    nameWords: nameTokens,
    nameWordSet: new Set(nameTokens),
    tags: tagsText,
    tagWords: tokenize(tagsText),
    description: normalizeSearchText(product.description ?? ""),
    sku: normalizeSearchText(product.sku ?? ""),
  };
  indexCache.set(product, built);
  return built;
}

/** Peso de cada jeito de casar: palavra inteira, começo de palavra, miolo. */
const HIT_FACTOR = { word: 1, prefix: 0.85, partial: 0.6 } as const;

type Hit = keyof typeof HIT_FACTOR | null;

/**
 * Casa um token contra um campo. Palavra inteira vale mais que começo de
 * palavra, que vale mais que menção no meio do texto. O começo de palavra é o
 * que sustenta a busca enquanto a pessoa digita.
 */
function fieldHit(words: string[], text: string, token: QueryToken): Hit {
  if (words.length === 0 && !text) return null;

  for (const word of words) {
    if (token.formSet.has(word)) return "word";
  }

  for (const prefix of token.prefixes) {
    for (const word of words) {
      if (word.length > prefix.length && word.startsWith(prefix)) return "prefix";
    }
  }

  if (text) {
    for (const form of token.forms) {
      if (form.length >= 3 && text.includes(form)) return "partial";
    }
  }

  return null;
}

/** Aplica o peso do tipo de casamento sobre a nota do campo. */
function hitScore(hit: Hit, score: number): number {
  return hit ? score * HIT_FACTOR[hit] : 0;
}

/**
 * Pontos de um produto para a consulta. `0` significa fora do resultado.
 * Cada palavra da consulta precisa achar alguma coisa (E, não OU): quem busca
 * "encordoamento guitarra" não quer ver guitarra sem corda nem corda de baixo.
 */
export function scoreProduct(product: Product, prepared: PreparedQuery): number {
  return evaluateProduct(product, prepared).score;
}

interface Evaluation {
  score: number;
  /** Quantas palavras da consulta acharam algo neste produto. */
  matched: number;
}

function evaluateProduct(product: Product, prepared: PreparedQuery): Evaluation {
  const index = getIndex(product);
  const { primaryCategories } = prepared;
  let total = 0;
  let matched = 0;

  for (const token of prepared.tokens) {
    let tokenScore = 0;

    if (index.sku && token.formSet.has(index.sku)) tokenScore += FIELD_SCORE.sku;

    if (token.intent.includes(product.category)) {
      tokenScore += token.intent === primaryCategories
        ? FIELD_SCORE.primaryCategory
        : FIELD_SCORE.intentCategory;
    }

    // Primeira palavra do nome é o tipo do produto: "Ukulele Concerto" é um
    // ukulele, "Encordoamento Ukulele" é um encordoamento.
    let headPosition: number | undefined;
    let headHit: Hit = null;
    for (const [word, position] of index.head) {
      const hit: Hit = token.formSet.has(word)
        ? "word"
        : token.prefixes.some((prefix) => word.length > prefix.length && word.startsWith(prefix))
          ? "prefix"
          : null;
      if (!hit) continue;
      if (headPosition === undefined || position < headPosition) {
        headPosition = position;
        headHit = hit;
      }
    }
    if (headPosition !== undefined) {
      tokenScore += hitScore(headHit, headPosition === 0 ? FIELD_SCORE.nameHead : FIELD_SCORE.nameHeadSecond);
      // "pedestal" e "suporte" levam à mesma categoria, mas quem digitou
      // "pedestal" quer ver pedestal primeiro.
      if (index.head.has(token.raw)) tokenScore += FIELD_SCORE.literalHead;
    }

    tokenScore += hitScore(fieldHit(index.categoryWords, index.category, token), FIELD_SCORE.category);
    tokenScore += hitScore(fieldHit(index.brandWords, index.brand, token), FIELD_SCORE.brand);
    tokenScore += hitScore(fieldHit(index.subcategoryWords, index.subcategory, token), FIELD_SCORE.subcategory);
    tokenScore += hitScore(fieldHit(index.tagWords, index.tags, token), FIELD_SCORE.tag);

    const nameHit = fieldHit(index.nameWords, index.name, token);
    if (nameHit === "partial") tokenScore += FIELD_SCORE.namePartial;
    else tokenScore += hitScore(nameHit, FIELD_SCORE.nameWord);

    if (tokenScore === 0) {
      const descriptionHit = fieldHit([], index.description, token);
      if (descriptionHit) tokenScore += FIELD_SCORE.description;
    }

    if (tokenScore === 0) continue;
    matched++;
    total += tokenScore * token.weight;
  }

  if (matched === 0) return { score: 0, matched: 0 };

  // Consulta inteira aparecendo literalmente no nome ganha um empurrão.
  if (prepared.tokens.length > 1 && index.name.includes(prepared.raw)) total += 120;

  // Fora da categoria que a consulta pediu: entra, mas atrás de tudo.
  if (primaryCategories.length > 0 && !primaryCategories.includes(product.category)) {
    total *= 0.35;
  }

  // Desempates suaves: disponível, bem avaliado, com histórico de avaliação.
  if (product.inStock !== false) total += 12;
  total += Math.min(product.rating ?? 0, 5) * 2;
  total += Math.min(product.reviews ?? 0, 400) * 0.02;

  return { score: total, matched };
}

/* ──────────────────────────────── busca ─────────────────────────────────── */

export interface SearchOptions {
  limit?: number;
  /** Catálogo usado para montar o vocabulário; por padrão, a lista buscada. */
  vocabularySource?: Product[];
}

export interface SearchOutcome {
  items: Product[];
  /** Ordem de relevância por id, para quem precisa reordenar depois. */
  rank: Map<number, number>;
  /** Texto corrigido quando houve erro de digitação ("guitara" → "guitarra"). */
  correctedQuery?: string;
  /** Categorias que a consulta designa. */
  intentCategories: string[];
}

const EMPTY_OUTCOME: SearchOutcome = { items: [], rank: new Map(), correctedQuery: undefined, intentCategories: [] };

/** Produtos que atendem a consulta, do mais relevante para o menos. */
export function searchProducts(
  products: Product[],
  query: string,
  options: SearchOptions = {},
): SearchOutcome {
  const prepared = prepareQuery(query, options.vocabularySource ?? products);
  if (!prepared) return { ...EMPTY_OUTCOME, rank: new Map() };

  const evaluated: { product: Product; score: number; matched: number }[] = [];
  for (const product of products) {
    const { score, matched } = evaluateProduct(product, prepared);
    if (score > 0) evaluated.push({ product, score, matched });
  }

  // Primeiro tenta quem atende a consulta inteira ("encordoamento guitarra" não
  // devolve guitarra sem corda). Se ninguém atende, mostra quem atende mais
  // palavras em vez de deixar a busca vazia.
  const full = evaluated.filter((entry) => entry.matched === prepared.tokens.length);
  const scored = full.length > 0 ? full : evaluated;

  scored.sort((a, b) =>
    b.matched - a.matched ||
    b.score - a.score ||
    (b.product.reviews ?? 0) - (a.product.reviews ?? 0));

  const limited = options.limit ? scored.slice(0, options.limit) : scored;
  const rank = new Map<number, number>();
  limited.forEach((entry, position) => rank.set(entry.product.id, position));

  return {
    items: limited.map((entry) => entry.product),
    rank,
    correctedQuery: prepared.correctedQuery,
    intentCategories: prepared.intentCategories,
  };
}

/** Atalho para as superfícies que só querem a lista pronta. */
export function rankProducts(products: Product[], query: string, limit?: number): Product[] {
  return searchProducts(products, query, { limit }).items;
}
