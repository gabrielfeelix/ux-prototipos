import { allProducts, type Product } from "../components/productsData";
import { getPrimaryProductImage, getVisibleCatalogProducts } from "../components/productPresentation";
import { getVariantInfo } from "../components/productVariants";

/* curadoria — QUEM aparece nas dobras comerciais da home.

   O catálogo ordenado por review devolve corda, cabo e suporte de parede:
   são os itens que todo mundo compra e avalia, e são também os mais feios da
   vitrine. Uma home que abre com quatro caixas pretas não vende instrumento.

   Aqui cada produto ganha dois números:

     apelo   o quanto ele segura uma vitrine (violão 100 → suporte 10)
     peso    apelo + prova social + foto oficial, já com o sorteio do dia

   e as dobras pedem seleções por intenção (`promocoes`, `maisVendidos`,
   `acessoriosDeTocar`) em vez de fatiar o catálogo cru. O sorteio muda a
   vitrine todo dia sem deixar item feio subir: ele desempata dentro da mesma
   faixa de apelo, nunca entre faixas. */

export type TipoDeProduto =
  | "instrumento"
  | "microfone"
  | "acessorio"
  | "cordas"
  | "cabo"
  | "manutencao"
  | "suporte";

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const CATEGORIAS_INSTRUMENTO = ["Violões", "Guitarras", "Contrabaixos", "Baterias"];

/* Ordem importa: "Cabo Para Microfone" é cabo, não microfone; "Suporte Para
   Violão" é suporte, não instrumento. Casa a regra mais específica primeiro.
   Todo padrão aceita plural — "Roldanas Cromadas P/ Correias" já entrou como
   acessório uma vez por causa do "s", e virou parafuso no meio da vitrine. */
const REGRAS: { tipo: TipoDeProduto; re: RegExp }[] = [
  { tipo: "suporte", re: /\b(suporte|pedestal|tripe|estante|banqueta|apoio|roldana|garra|parafuso|strap ?lock)s?\b/ },
  { tipo: "cabo", re: /\b(cabo|plug|adaptador|conector)s?\b/ },
  { tipo: "cordas", re: /\b(corda|encordoamento|jogo)s?\b/ },
  { tipo: "manutencao", re: /\b(polidor|limpador|cera|oleo|condicionador|kit de limpeza)s?\b/ },
  { tipo: "microfone", re: /\bmicrofones?\b/ },
  { tipo: "acessorio", re: /\b(afinador|capotraste|palheta|correia|talabarte|damper|metronomo|pedal|abafador)s?\b/ },
];

/* Nome que ABRE com o instrumento é o instrumento, e nenhuma palavra depois
   muda isso. Sem esta linha, "Contrabaixo Elétrico - Theodor - Nude Wood - 5
   Cordas" batia na regra de `cordas` e saía da vitrine sem enquadramento — o
   único instrumento pequeno no meio de violões e guitarras do mesmo tamanho.
   O acessório sempre nomeia a si mesmo primeiro ("Encordoamento ... P/ Violão",
   "Suporte De Parede P/ Violao"), então a ordem dá conta dos dois casos. */
const INSTRUMENTO_NO_INICIO =
  /^(violao|violoes|guitarra|guitarras|contrabaixo|contrabaixos|baixo|cavaco|cavaquinho|viola|ukulele|banjo|bandolim|flauta|teclado|bateria)\b/;

export function tipoDoProduto(p: Product): TipoDeProduto {
  const nome = semAcento(p.name);
  if (INSTRUMENTO_NO_INICIO.test(nome)) return "instrumento";
  for (const { tipo, re } of REGRAS) if (re.test(nome)) return tipo;
  if (CATEGORIAS_INSTRUMENTO.includes(p.category)) return "instrumento";
  if (/\b(violao|guitarra|contrabaixo|baixo|cavaco|cavaquinho|viola|ukulele|banjo|bandolim|flauta|teclado|bateria)\b/.test(nome))
    return "instrumento";
  return "acessorio";
}

/** O quanto o produto segura uma vitrine. Foto bonita = venda o resto. */
const APELO: Record<TipoDeProduto, number> = {
  instrumento: 100,
  microfone: 70,
  acessorio: 45,
  cordas: 30,
  manutencao: 20,
  cabo: 15,
  suporte: 10,
};

export const apeloVisual = (p: Product) => APELO[tipoDoProduto(p)];

/** Foto da sessão oficial Tonante (local) bate qualquer JPEG do CDN antigo. */
const temFotoOficial = (p: Product) => getPrimaryProductImage(p).startsWith("/produtos/");

export const descontoPct = (p: Product) =>
  p.oldPriceNum && p.oldPriceNum > p.priceNum ? (p.oldPriceNum - p.priceNum) / p.oldPriceNum : 0;

/* ---------- sorteio do dia ---------------------------------------------- */

/* Uma semente por dia: a vitrine muda de manhã, e não a cada render (dois
   renders com listas diferentes piscariam produto na tela). */
const semente = Math.floor(Date.now() / 86_400_000);

function aleatorio(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const sorteio = (p: Product) => aleatorio(p.id * 7919 + semente);

/* ---------- peso ---------------------------------------------------------- */

const provaSocial = (p: Product) => Math.log10(1 + (p.reviews ?? 0)) * (p.rating ?? 4) * 4;

/** apelo + prova social + foto oficial, desempatado pelo sorteio do dia. */
export function peso(p: Product) {
  return apeloVisual(p) + provaSocial(p) + (temFotoOficial(p) ? 15 : 0) + sorteio(p) * 18;
}

/* ---------- famílias de cor ---------------------------------------------- */

const CORES =
  /\b(preto|preta|branco|branca|vermelho|vermelha|azul|verde|amarelo|amarela|roxo|roxa|rosa|prata|prateado|champanhe|natural|marrom|cinza|dourado|fosco|brilhante|bege|creme|lisa|liso|clara|claro|escura|escuro|cromada|cromado)\b/g;

/* productVariants é a fonte boa, mas só cobre as famílias que o gerador casou
   nome a nome — "Palheta Ibox 1.0MM Preto" e "Palheta Ibox 1.00MM Azul"
   escaparam por causa do zero a mais, e a home mostrava as duas coladas. O
   fallback normaliza número, tira cor e tira código de modelo. */
function chaveDeFamilia(p: Product) {
  const oficial = getVariantInfo(p.sku)?.family;
  if (oficial) return oficial;
  const base = semAcento(p.name)
    .replace(/(\d+)[.,](\d+)/g, (_, a, b) => String(parseFloat(`${a}.${b}`)))
    .replace(CORES, " ")
    /* código de modelo: token que mistura letra e dígito (PLP100BK, TN36P) */
    .replace(/\b(?=[a-z0-9-]*[a-z])(?=[a-z0-9-]*\d)[a-z0-9-]{4,}\b/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${p.category}::${base}`;
}

/* ---------- seleção ------------------------------------------------------- */

export const catalogo = getVisibleCatalogProducts(allProducts);

const porId = new Map(allProducts.map((p) => [p.id, p]));

interface SelecaoOpts {
  /** de onde tirar (default: catálogo visível inteiro) */
  pool?: Product[];
  /** quantos cards */
  n: number;
  /** teto por tipo — evita a fileira de quatro cabos pretos */
  maxPorTipo?: Partial<Record<TipoDeProduto, number>>;
  /** teto por categoria — evita a fileira de quatro violões iguais */
  maxPorCategoria?: number;
  /** teto por substantivo do item ("correia", "palheta") — mais fino que tipo:
      três correias de modelos diferentes ainda leem como a mesma vitrine */
  maxPorItem?: number;
  /** só entra quem tiver esse apelo mínimo */
  minApelo?: number;
  /** ids que não podem repetir (a home não mostra o mesmo card duas vezes) */
  exceto?: number[];
  /** revezar categoria card a card, pra variedade já aparecer sem rolar */
  intercalar?: boolean;
}

/** Melhores N por peso, respeitando os tetos. */
export function selecionar({
  pool = catalogo,
  n,
  maxPorTipo = {},
  maxPorCategoria,
  maxPorItem,
  minApelo = 0,
  exceto = [],
  intercalar = false,
}: SelecaoOpts) {
  const bloqueados = new Set(exceto);
  const usadosTipo: Partial<Record<TipoDeProduto, number>> = {};
  const usadosCat: Record<string, number> = {};
  const usadosItem: Record<string, number> = {};
  /* uma peça por família de cor: a palheta azul e a preta são o mesmo produto,
     e o card já traz as cores em swatch. Dois cards iguais lado a lado leem
     como catálogo mal montado.

     `exceto` bloqueia a família junto com o id, e não só o id: a home mostrava
     a Strato Snow White em "Chegou agora" e a Strato Deep Dark em "Mais
     vendidos", duas dobras coladas com a mesma guitarra — e o mesmo com a
     bateria Sonora, Wine Sparkle em cima e Blue Sparkle embaixo. Entre dobras
     a repetição salta mais, porque o olho compara foto com foto. */
  const familias = new Set<string>();
  for (const id of exceto) {
    const anterior = porId.get(id);
    if (anterior) familias.add(chaveDeFamilia(anterior));
  }
  const out: Product[] = [];

  const fila = pool
    .filter((p) => !bloqueados.has(p.id) && apeloVisual(p) >= minApelo)
    .sort((a, b) => peso(b) - peso(a));

  for (const p of fila) {
    if (out.length >= n) break;
    const tipo = tipoDoProduto(p);
    const teto = maxPorTipo[tipo];
    const usado = usadosTipo[tipo] ?? 0;
    if (teto !== undefined && usado >= teto) continue;
    const usadoCat = usadosCat[p.category] ?? 0;
    if (maxPorCategoria !== undefined && usadoCat >= maxPorCategoria) continue;
    const item = nomeDeItem(p);
    if (item && maxPorItem !== undefined) {
      const usadoItem = usadosItem[item] ?? 0;
      if (usadoItem >= maxPorItem) continue;
      usadosItem[item] = usadoItem + 1;
    }
    const familia = chaveDeFamilia(p);
    if (familias.has(familia)) continue;
    familias.add(familia);
    usadosTipo[tipo] = usado + 1;
    usadosCat[p.category] = usadoCat + 1;
    out.push(p);
  }
  return intercalar ? revezarCategorias(out) : out;
}

/* Ordenar por peso agrupa por categoria — violão tem mais review e mais foto
   oficial, então os quatro primeiros cards são quatro violões e o título que
   prometia "violão, guitarra e contrabaixo" mente na primeira tela. Round-robin
   entre as categorias resolve sem mexer em quem foi selecionado. */
function revezarCategorias(lista: Product[]) {
  const filas = new Map<string, Product[]>();
  for (const p of lista) {
    const fila = filas.get(p.category) ?? [];
    fila.push(p);
    filas.set(p.category, fila);
  }
  const ordem = [...filas.values()].sort((a, b) => peso(b[0]) - peso(a[0]));
  const out: Product[] = [];
  while (out.length < lista.length) {
    for (const fila of ordem) {
      const p = fila.shift();
      if (p) out.push(p);
    }
  }
  return out;
}

export const idsDe = (lista: Product[]) => lista.map((p) => p.id);

/* ---------- seleções que a home consome --------------------------------- */

const comDesconto = catalogo.filter((p) => descontoPct(p) > 0);

/** Promoção: instrumento na frente, desconto de verdade, nada de suporte. */
export function promocoes(n = 12, exceto: number[] = []) {
  return selecionar({
    pool: comDesconto,
    n,
    minApelo: APELO.cordas,
    maxPorTipo: { cordas: 2, acessorio: 3, microfone: 2 },
    maxPorCategoria: 5,
    intercalar: true,
    exceto,
  });
}

/** Maior desconto da seleção, pra estampar no título ("até 30% off"). */
export function maiorDesconto(lista: Product[]) {
  return Math.round(Math.max(0, ...lista.map(descontoPct)) * 100);
}

/** Mais vendidos — prova social pesada, mas vitrine de instrumento.
 *  A dobra numera os cards (#1, #2, #3), e número dá manchete: com o piso em
 *  `cordas` o pódio saía "#3 Encordoamento de Nylon", um saquinho preto no
 *  lugar mais visível da home. Corda tem a própria dobra logo abaixo, então
 *  aqui entra só o que sustenta pódio — instrumento e microfone. */
export function maisVendidos(n = 12, exceto: number[] = []) {
  return selecionar({
    pool: catalogo,
    n,
    minApelo: APELO.microfone,
    /* um microfone só: `intercalar` reveza CATEGORIA, e microfone e viola
       moram os dois em "Acessórios" — dois microfones caíam em #2 e #4 sem o
       revezamento perceber. */
    maxPorTipo: { microfone: 1 },
    maxPorCategoria: 5,
    intercalar: true,
    exceto,
  });
}

/** Chegou agora — badge Novidade quando houver, senão instrumento de peso.
 *  A dobra virou banner + trilho (ver v2/NovidadesV2), e banner cobra vitrine:
 *  ao lado de uma arte de página inteira, microfone e afinador leem como
 *  sobra de estoque. Só instrumento entra, revezando categoria pra fileira
 *  não abrir com três violões iguais. */
/** Abaixo disso a dobra não se sustenta sozinha e o catálogo completa. */
const MIN_LANCAMENTOS = 5;

export function lancamentos(n = 9, exceto: number[] = []) {
  /* Teto por categoria mais alto que nas outras dobras: o que está marcado
     como novidade é um recorte pequeno, e a promoção do dia — que escolhe
     antes — leva famílias inteiras junto. Com teto 4 sobrava menos de uma
     fileira de marcados e a dobra completava com catálogo, sem a pill. */
  const opcoes = { minApelo: APELO.instrumento, maxPorCategoria: 6, intercalar: true } as const;
  const novos = catalogo.filter((p) => p.badge === "Novidade");
  const marcados = selecionar({ pool: novos, n, ...opcoes, exceto });
  /* Fileira mais curta é melhor que fileira mentirosa: a dobra promete "chegou
     agora" e o card estampa a pill NOVIDADE, então quem entra aqui tem que
     estar marcado como novidade no catálogo. Antes ela completava com o
     catálogo geral pra fechar nove cards e metade vinha sem pill.
     O trilho mostra três por vez — sete cards rolam igual. */
  if (marcados.length >= MIN_LANCAMENTOS) return marcados;
  /* Só quando quase não há novidade marcada (loja recém-montada) é que o
     catálogo entra, pra dobra não sumir da home. */
  return [
    ...marcados,
    ...selecionar({ pool: catalogo, n: n - marcados.length, ...opcoes, exceto: [...exceto, ...idsDe(marcados)] }),
  ];
}

/** Instrumentos por categoria (violão, guitarra, contrabaixo). */
export function instrumentos(n = 12, categorias = CATEGORIAS_INSTRUMENTO, exceto: number[] = []) {
  return selecionar({
    pool: catalogo.filter((p) => categorias.includes(p.category) && tipoDoProduto(p) === "instrumento"),
    n,
    exceto,
  });
}

/** Primeiro instrumento: violão de entrada, ordenado por preço. */
export function primeiroInstrumento(n = 12, teto = 1200, exceto: number[] = []) {
  const bloqueados = new Set(exceto);
  return catalogo
    .filter(
      (p) =>
        p.category === "Violões" &&
        tipoDoProduto(p) === "instrumento" &&
        p.priceNum <= teto &&
        !bloqueados.has(p.id),
    )
    .sort((a, b) => peso(b) - peso(a))
    .slice(0, n)
    .sort((a, b) => a.priceNum - b.priceNum);
}

/** O que se leva junto pra tocar hoje: microfone, afinador, correia, palheta,
    cabo — nessa ordem de apelo. Suporte entra, mas por último e pouco. */
export function acessoriosDeTocar(n = 10, exceto: number[] = []) {
  return selecionar({
    pool: catalogo.filter((p) => tipoDoProduto(p) !== "instrumento"),
    n,
    /* suporte fora: a grade é "o que falta pra tocar hoje", e o que o catálogo
       tem de suporte é parafuso, roldana e banqueta — peça de ferragem no meio
       de palheta e correia derruba a dobra inteira. Suporte tem a própria
       categoria no menu. */
    maxPorTipo: { microfone: 2, acessorio: 4, cordas: 2, cabo: 1, suporte: 0, manutencao: 1 },
    maxPorItem: 2,
    intercalar: true,
    exceto,
  });
}

/* Grade de acessórios da home — seleção fixa, não sorteada.

   `acessoriosDeTocar` sorteia dentro das regras e servia enquanto a dobra era
   um trilho pequeno. Com a grade grande ao lado da arte, cada foto passou a
   pesar: cartela de blister, ferragem preta e embalagem poluída derrubavam a
   dobra inteira. Estes oito têm foto limpa e cor, um por família: microfone,
   correia, encordoamento, afinador, capotraste, manutenção, cabo e palheta.
   Correia é o que o catálogo tem de mais bonito, e por isso puxava a grade
   inteira pra ela — fica uma só, pra a dobra parecer a categoria e não uma
   vitrine de correias. */
const ACESSORIOS_BONITOS = [129, 208, 139, 260, 275, 266, 96, 88];

export function acessoriosBonitos() {
  const achados = ACESSORIOS_BONITOS.map((id) => catalogo.find((p) => p.id === id)).filter(
    Boolean,
  ) as Product[];
  // se algum sair do catálogo, a grade completa com o sorteio de sempre
  const faltam = ACESSORIOS_BONITOS.length - achados.length;
  return faltam === 0
    ? achados
    : [...achados, ...acessoriosDeTocar(faltam, achados.map((p) => p.id))];
}

/* ---------- título que descreve a seleção ------------------------------- */

const PALAVRA_CATEGORIA: Record<string, string> = {
  "Violões": "violão",
  "Guitarras": "guitarra",
  "Contrabaixos": "contrabaixo",
  "Baterias": "bateria",
  "Cordas & Encordoamentos": "corda",
  "Suportes": "suporte",
};

const PALAVRA_TIPO: Record<TipoDeProduto, string> = {
  instrumento: "instrumento",
  microfone: "microfone",
  acessorio: "acessório",
  cordas: "corda",
  cabo: "cabo",
  manutencao: "acessório",
  suporte: "suporte",
};

/** "violão, guitarra e contrabaixo" — o que a seleção REALMENTE tem.
 *  Título escrito à mão envelhece junto com o estoque: promete contrabaixo
 *  e a fileira mostra cavaco. Aqui a frase sai da própria lista. */
/* Categoria não basta: cavaco e ukulele moram em "Acessórios" e virariam
   "instrumento" no título. O nome diz melhor o que a foto mostra. */
const NOMES_DE_INSTRUMENTO: { palavra: string; re: RegExp }[] = [
  { palavra: "violão", re: /\bviolao/ },
  { palavra: "guitarra", re: /\bguitarra/ },
  { palavra: "contrabaixo", re: /\b(contrabaixo|baixo)/ },
  { palavra: "cavaco", re: /\bcavaco|cavaquinho/ },
  { palavra: "ukulele", re: /\bukulele/ },
  { palavra: "viola", re: /\bviola\b/ },
  { palavra: "bateria", re: /\bbateria/ },
  { palavra: "teclado", re: /\bteclado/ },
];

export function resumoDaSelecao(lista: Product[], quantos = 3) {
  const contagem = new Map<string, number>();
  for (const p of lista) {
    const nome = semAcento(p.name);
    const instrumento =
      tipoDoProduto(p) === "instrumento"
        ? NOMES_DE_INSTRUMENTO.find(({ re }) => re.test(nome))?.palavra
        : undefined;
    const palavra = instrumento ?? PALAVRA_CATEGORIA[p.category] ?? PALAVRA_TIPO[tipoDoProduto(p)];
    contagem.set(palavra, (contagem.get(palavra) ?? 0) + 1);
  }
  const palavras = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantos)
    .map(([palavra]) => palavra);
  if (palavras.length <= 1) return palavras[0] ?? "instrumento";
  return `${palavras.slice(0, -1).join(", ")} e ${palavras[palavras.length - 1]}`;
}

/* Substantivo concreto do acessório — "palheta", "correia", "cabo". Serve
   pro título da dobra de anexo: dizer "afinador, correia e palheta" com a
   grade cheia de microfone é a mesma promessa quebrada de sempre. */
const NOMES_DE_ITEM: { palavra: string; re: RegExp }[] = [
  { palavra: "microfone", re: /\bmicrofone/ },
  { palavra: "afinador", re: /\bafinador/ },
  { palavra: "correia", re: /\b(correia|talabarte)/ },
  { palavra: "palheta", re: /\bpalheta/ },
  { palavra: "capotraste", re: /\bcapotraste/ },
  { palavra: "corda", re: /\b(corda|encordoamento)/ },
  { palavra: "cabo", re: /\bcabo/ },
  { palavra: "suporte", re: /\b(suporte|pedestal|estante|tripe|banqueta|roldana|parafuso)/ },
];

/** Substantivo do item, quando reconhecido ("correia", "palheta", "cabo"). */
export function nomeDeItem(p: Product) {
  const nome = semAcento(p.name);
  return NOMES_DE_ITEM.find(({ re }) => re.test(nome))?.palavra;
}

export function resumoDeItens(lista: Product[], quantos = 4) {
  const contagem = new Map<string, number>();
  for (const p of lista) {
    const nome = semAcento(p.name);
    const achado = NOMES_DE_ITEM.find(({ re }) => re.test(nome));
    if (achado) contagem.set(achado.palavra, (contagem.get(achado.palavra) ?? 0) + 1);
  }
  const palavras = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantos)
    .map(([palavra]) => palavra);
  if (palavras.length <= 1) return palavras[0] ?? "acessório";
  return `${palavras.slice(0, -1).join(", ")} e ${palavras[palavras.length - 1]}`;
}
