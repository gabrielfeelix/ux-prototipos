/* pecasKit — as peças, os passos e o que combina com o quê.
 *
 * O "monte seu setup" do PCYES v3 é um wizard por categoria: o usuário escolhe
 * uma peça por passo, a sidebar mostra o que já entrou e um motor avisa quando
 * duas peças brigam (socket errado, fonte fraca). A ideia serve aqui, mas o
 * vocabulário não: instrumento não tem socket, tem corda, captação e braço.
 *
 * Duas diferenças de fundo em relação ao v3:
 *
 * 1. Lá o passo é a categoria do site. Aqui o passo é o que a peça FAZ pelo
 *    músico ("pra afinar", "pra segurar"), porque o catálogo não tem taxonomia
 *    de subcategoria confiável — `subcategory` aparece em uma dúzia de itens.
 *    Quem separa as peças é `tipoDoProduto` (v2/curadoria.ts), que já lê o nome
 *    e sabe que "Cabo Para Microfone" é cabo, não microfone.
 *
 * 2. Lá a compatibilidade é heurística de regex sobre nome de peça, e metade
 *    dela é decorativa (o check térmico devolve "ok" fixo). Aqui só existe
 *    regra onde existe verdade musical: encordoamento de aço em violão de
 *    nylon é o caso que estraga instrumento de verdade — o braço do clássico
 *    não tem tensor pra segurar a tração do aço. Essa é `erro`. O resto é
 *    `aviso`, e aviso não bloqueia ninguém.
 *
 * O catálogo manda no fluxo: não existe slot de amplificador porque a Tonante
 * não vende amplificador (a única "caixa amplificada" do catálogo é PA, não
 * cubo de guitarra). Inventar o passo deixaria um passo vazio ou, pior, um
 * cabo de PA vendido como cubo. */

import { isFotoAmbientada } from "../../components/photoBackdrop";
import { getProductImages } from "../../components/productPresentation";
import { type Product } from "../../components/productsData";
import { isKitProduct } from "../../lib/kits";
import { catalogo, peso, tipoDoProduto } from "../../v2/curadoria";

/* ——— quem pode entrar no kit ——————————————————————————————————————————— */

/** Foto do produto sem cenário atrás.
 *
 * No montador os cards ficam em grade estreita, e foto ambientada (fundo preto
 * do catálogo antigo, mesa de estúdio, arte de kit) desenha um retângulo escuro
 * no meio de uma fileira de recortes brancos. `photoBackdrop` já sabe quais
 * fotos têm cenário — a classificação é offline porque o CDN não manda CORS.
 * Sem nenhuma foto limpa, o produto fica fora: é melhor não oferecer a peça do
 * que sujar a etapa inteira com ela. */
export function fotoLimpaDoProduto(p: Product): string | null {
  return getProductImages(p).find((img) => !isFotoAmbientada(img)) ?? null;
}

/** O que pode ser oferecido no montador.
 *
 * Kit pronto é produto fechado, não peça: oferecer "Kit Primeiro Acorde" dentro
 * do passo de extras vende um kit dentro do outro, e o preço do kit inteiro
 * entra na conta como se fosse uma palheta. */
export function pecaElegivel(p: Product): boolean {
  if (isKitProduct(p)) return false;
  return fotoLimpaDoProduto(p) !== null;
}

/** Catálogo do montador: sem kit pronto, sem foto com fundo. */
const pool = catalogo.filter(pecaElegivel);

/* ——— famílias ————————————————————————————————————————————————————————— */

/** O que o instrumento pede de corda. É o eixo que gera erro de verdade. */
export type Familia =
  | "violao-nylon"
  | "violao-aco"
  | "guitarra"
  | "baixo"
  | "viola"
  | "ukulele"
  | "bateria"
  | "cavaco"
  | "banjo"
  | "teclado"
  /* Quem canta também monta kit, e o microfone é o instrumento dele. */
  | "voz"
  | "outro";

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const temTag = (p: Product, tag: string) =>
  (p.tags ?? []).some((t) => semAcento(t) === semAcento(tag));

/** Família do instrumento escolhido. Tag primeiro, nome como desempate. */
export function familiaDoInstrumento(p: Product): Familia {
  const n = semAcento(p.name);
  /* Microfone e teclado não têm categoria própria no ERP: os dois moram em
     "Acessórios" junto com palheta e afinador. O nome é o dado confiável. */
  if (tipoDoProduto(p) === "microfone") return "voz";
  if (/^(teclado|piano)/.test(n)) return "teclado";
  if (p.category === "Baterias" || /\bbateria\b/.test(n)) return "bateria";
  if (/^cavaco|^cavaquinho/.test(n)) return "cavaco";
  if (/\bukulele\b/.test(n) || temTag(p, "Ukulele")) return "ukulele";
  if (/\bviola\b/.test(n) && !/\bviolao/.test(n)) return "viola";
  if (p.category === "Contrabaixos" || /\b(contrabaixo|baixo)\b/.test(n)) return "baixo";
  if (p.category === "Guitarras" || /\bguitarra\b/.test(n)) return "guitarra";
  if (/\bviolao/.test(n) || p.category === "Violões") {
    /* Nylon é o default do violão de estudo, mas só quando alguém disse nylon.
       Chutar errado aqui é o que faz o motor recomendar corda que arrebenta o
       braço, então sem sinal explícito o violão entra como aço, que é o caso
       em que a corda errada só soa mal em vez de quebrar. */
    if (/\bnylon\b/.test(n) || temTag(p, "Nylon") || /\bclassico\b/.test(n) || temTag(p, "Clássico"))
      return "violao-nylon";
    return "violao-aco";
  }
  return "outro";
}

/** Instrumento que sai som pela tomada — muda quais passos aparecem. */
export function temCaptacao(p: Product): boolean {
  const n = semAcento(p.name);
  if (temTag(p, "Eletroacústico") || /\beletroacustico\b/.test(n)) return true;
  if (/\beletric[ao]\b/.test(n)) return true;
  const f = familiaDoInstrumento(p);
  return f === "guitarra" || f === "baixo";
}

export const LABEL_FAMILIA: Record<Familia, string> = {
  "violao-nylon": "violão de nylon",
  "violao-aco": "violão de aço",
  guitarra: "guitarra",
  baixo: "contrabaixo",
  viola: "viola caipira",
  ukulele: "ukulele",
  bateria: "bateria",
  cavaco: "cavaquinho",
  banjo: "banjo",
  teclado: "teclado",
  voz: "microfone",
  outro: "instrumento",
};

/* ——— encordoamento ———————————————————————————————————————————————————— */

/** Pra que instrumento é o jogo de cordas. Lê o nome, que é onde está o dado. */
export function familiaDaCorda(p: Product): Familia {
  const n = semAcento(p.name);
  /* Cavaco e banjo não são vendidos como instrumento aqui, mas o encordoamento
     deles está no catálogo — e um jogo de cavaco de quatro cordas passou batido
     como "genérico" num kit de violão até esta linha existir. */
  if (/\bcavaco|cavaquinho\b/.test(n)) return "cavaco";
  if (/\bbanjo|bandolim\b/.test(n)) return "banjo";
  if (/\bukulele\b/.test(n)) return "ukulele";
  if (/\bviola\b/.test(n) && !/\bviolao/.test(n)) return "viola";
  if (/\b(baixo|bass)\b/.test(n)) return "baixo";
  if (/\bguitarra\b/.test(n)) return "guitarra";
  if (/\bviolao/.test(n)) return /\bnylon\b/.test(n) ? "violao-nylon" : "violao-aco";
  if (/\bnylon\b/.test(n)) return "violao-nylon";
  if (/\baco\b/.test(n)) return "violao-aco";
  return "outro";
}

/* ——— passos ——————————————————————————————————————————————————————————— */

export type SlotId =
  | "instrumento"
  | "cordas"
  | "ligar"
  | "afinar"
  | "segurar"
  | "cantar"
  | "tocar";

export interface Slot {
  id: SlotId;
  /** Título do passo. Diz o que a peça faz, não a categoria da loja. */
  titulo: string;
  /** Linha de apoio: por que esse passo existe. */
  sub: string;
  /** Rótulo curto pro stepper e pro resumo. */
  curto: string;
  /** Quantas peças cabem. 1 = escolha única, >1 = o passo aceita conjunto. */
  max: number;
  /** Sem isso não existe kit. Só o instrumento é obrigatório. */
  obrigatorio?: boolean;
}

export const SLOTS: Slot[] = [
  {
    id: "instrumento",
    titulo: "O instrumento",
    sub: "Tudo que vem depois é escolhido em cima dele.",
    curto: "Instrumento",
    max: 1,
    obrigatorio: true,
  },
  {
    id: "cordas",
    titulo: "Cordas de reserva",
    sub: "Corda arrebenta na véspera do show. Sempre.",
    curto: "Cordas",
    max: 1,
  },
  {
    id: "ligar",
    titulo: "Pra ligar",
    sub: "Seu instrumento tem captação: sem cabo, ele não sai do lugar.",
    curto: "Cabo",
    max: 1,
  },
  {
    id: "afinar",
    titulo: "Pra afinar e transpor",
    sub: "Afinador e capotraste. O ouvido vem depois.",
    curto: "Afinação",
    max: 2,
  },
  {
    id: "segurar",
    titulo: "Pra segurar",
    sub: "Correia pra tocar em pé, suporte pra guardar sem apoiar na parede.",
    curto: "Apoio",
    max: 2,
  },
  {
    id: "cantar",
    titulo: "Pra cantar junto",
    sub: "Quem toca e canta precisa de microfone. Se você só toca, pule.",
    curto: "Voz",
    max: 1,
  },
  {
    id: "tocar",
    titulo: "Pra tocar e conservar",
    sub: "Palheta, limpeza, o que sobra na mochila.",
    curto: "Extras",
    max: 3,
  },
];

const POR_ID = new Map(SLOTS.map((s) => [s.id, s]));

/* Trilho por família.
 *
 * Antes a lista de passos era fixa com uma exceção solta ("Pra ligar" só
 * aparecia com captação). Isso não escala: bateria não tem corda nem
 * capotraste, teclado não tem nenhum dos dois, e microfone é o instrumento
 * inteiro de quem canta. Quem manda no fluxo é o instrumento escolhido, então
 * cada família declara a própria sequência e o resto do código só lê a tabela. */
const TRILHO_CORDAS: SlotId[] = [
  "instrumento",
  "cordas",
  "ligar",
  "afinar",
  "segurar",
  "cantar",
  "tocar",
];

const TRILHOS: Record<Familia, SlotId[]> = {
  "violao-nylon": TRILHO_CORDAS,
  "violao-aco": TRILHO_CORDAS,
  guitarra: TRILHO_CORDAS,
  baixo: TRILHO_CORDAS,
  viola: TRILHO_CORDAS,
  ukulele: TRILHO_CORDAS,
  cavaco: TRILHO_CORDAS,
  banjo: TRILHO_CORDAS,
  /* Bateria não afina com afinador de clipe e não sai por cabo: o que ela pede
     é onde sentar, o que abafar e microfone pra gravar. */
  bateria: ["instrumento", "segurar", "cantar", "tocar"],
  teclado: ["instrumento", "ligar", "segurar", "cantar", "tocar"],
  /* No kit de voz o microfone É o instrumento; cabo e pedestal deixam de ser
     acessório e passam a ser o que faz ele funcionar. */
  voz: ["instrumento", "ligar", "segurar", "tocar"],
  outro: TRILHO_CORDAS,
};

/* O mesmo passo tem nome diferente conforme o instrumento: "pra segurar" é
   correia no violão, banqueta na bateria e suporte em X no teclado. Traduzir
   aqui evita um passo chamado "Apoio" mostrando pedestal de microfone. */
const TEXTO_POR_FAMILIA: Partial<Record<Familia, Partial<Record<SlotId, Partial<Slot>>>>> = {
  bateria: {
    segurar: {
      titulo: "Pra sentar e firmar",
      sub: "Banqueta na altura certa e o que prende o kit no lugar.",
      curto: "Banqueta",
    },
    cantar: {
      titulo: "Pra gravar o kit",
      sub: "Microfone de bateria, se você grava ou toca ligado na mesa.",
      curto: "Microfone",
    },
  },
  teclado: {
    ligar: {
      titulo: "Pra ligar",
      sub: "Cabo pra mesa, pro amplificador ou pra interface.",
      curto: "Cabo",
    },
    segurar: {
      titulo: "Pra apoiar",
      sub: "Suporte em X e banqueta. Teclado no colo não toca.",
      curto: "Suporte",
    },
  },
  voz: {
    instrumento: {
      titulo: "O microfone",
      sub: "Tudo que vem depois é escolhido em cima dele.",
      curto: "Microfone",
    },
    ligar: {
      titulo: "Pra ligar na mesa",
      sub: "Microfone com fio precisa de XLR. Sem cabo ele não liga em nada.",
      curto: "Cabo XLR",
    },
    segurar: {
      titulo: "Pra posicionar",
      sub: "Pedestal deixa as duas mãos livres pra tocar.",
      curto: "Pedestal",
    },
    tocar: {
      titulo: "Pra cuidar do som",
      sub: "O que sobra na mochila de quem canta.",
      curto: "Extras",
    },
  },
};

/** Passo com o texto da família. Sem override, devolve o passo como está. */
export function passoParaFamilia(slot: SlotId, fam: Familia | null): Slot {
  const base = POR_ID.get(slot)!;
  const over = fam ? TEXTO_POR_FAMILIA[fam]?.[slot] : undefined;
  return over ? { ...base, ...over } : base;
}

/* Abaixo disso o passo não vale a rolagem: duas opções não é escolha, é
   obrigação disfarçada. A trava é medida no catálogo em vez de escrita na mão
   porque o estoque muda e ninguém vai lembrar de revisar a tabela. */
const MIN_PECAS = 3;

/** Passos do instrumento escolhido, já sem os que o catálogo não sustenta.
 *
 * `familiaEscolhida` serve pro intervalo entre escolher "Teclado" na primeira
 * tela e escolher o teclado em si: sem ela, a trilha prometia cordas e
 * capotraste pra quem já tinha dito que toca teclado. */
export function slotsVisiveis(
  instrumento: Product | null,
  familiaEscolhida?: Familia | null,
): Slot[] {
  const fam = instrumento ? familiaDoInstrumento(instrumento) : (familiaEscolhida ?? null);
  const trilho = fam ? TRILHOS[fam] : TRILHO_CORDAS;
  /* Sem instrumento escolhido, a trilha é medida no modelo mais representativo
     da família. Medir em cima de algo é o que mantém a trilha do mesmo tamanho
     do começo ao fim: prometer "Cabo XLR" e apagar o passo depois é pior que
     nunca ter prometido. */
  const referencia = instrumento ?? (fam ? instrumentosDisponiveis(fam)[0] ?? null : null);
  if (!referencia) return trilho.map((id) => passoParaFamilia(id, fam));
  return trilho
    .filter((id) => {
      if (id === "instrumento") return true;
      if (id === "ligar" && fam !== "teclado" && fam !== "voz" && !temCaptacao(referencia))
        return false;
      return pecasDoSlot(id, referencia).length >= MIN_PECAS;
    })
    .map((id) => passoParaFamilia(id, fam));
}

/* ——— peças de cada passo ——————————————————————————————————————————————— */

const ordenar = (lista: Product[]) =>
  [...lista].sort((a, b) => Number(b.inStock ?? true) - Number(a.inStock ?? true) || peso(b) - peso(a));

const CATEGORIAS_INSTRUMENTO = ["Violões", "Guitarras", "Contrabaixos", "Baterias"];

/** Famílias oferecidas no primeiro passo, na ordem em que a loja vende. */
/* A tela de entrada mostra estas famílias, nesta ordem, com uma frase do que
   o instrumento é pra quem ainda não sabe. `arte` é a ilustração de categoria;
   quando não existe (cavaquinho), o card cai na foto do próprio instrumento.
   Nenhuma família entra aqui sem catálogo que a sustente: teclado tem dois
   Casiotone mais suporte e banqueta, sopro tem uma flauta só e por isso fica
   de fora até a loja passar a vender a linha. */
export const FAMILIAS_OFERECIDAS: {
  id: Familia;
  label: string;
  hint: string;
  arte?: string;
}[] = [
  { id: "violao-nylon", label: "Violão de nylon", hint: "Corda macia, o que perdoa mais no começo", arte: "/categorias/violao.png" },
  { id: "violao-aco", label: "Violão de aço", hint: "Som mais brilhante, pra quem já tem calo", arte: "/categorias/violao-alt-1.png" },
  { id: "guitarra", label: "Guitarra", hint: "Precisa de amplificador pra existir", arte: "/categorias/guitarra.png" },
  { id: "baixo", label: "Contrabaixo", hint: "Quatro cordas graves, o chão da banda", arte: "/categorias/contrabaixo.png" },
  { id: "teclado", label: "Teclado", hint: "A porta de entrada mais fácil pra harmonia", arte: "/categorias/teclado.png" },
  { id: "ukulele", label: "Ukulele", hint: "Pequeno, quatro cordas, aprende rápido", arte: "/categorias/ukulele.png" },
  { id: "viola", label: "Viola caipira", hint: "Dez cordas, afinação própria, som de raiz", arte: "/categorias/viola.png" },
  { id: "cavaco", label: "Cavaquinho", hint: "O agudo que puxa a roda de samba" },
  { id: "bateria", label: "Bateria", hint: "Ocupa espaço e faz barulho. Vale a pena", arte: "/categorias/bateria.png" },
  { id: "voz", label: "Voz", hint: "Canta, com ou sem instrumento na mão", arte: "/categorias/microfone.png" },
];

/** O que conta como instrumento no montador.
 *
 * `CATEGORIAS_INSTRUMENTO` resolve violão, guitarra, baixo e bateria. Teclado e
 * microfone ficaram em "Acessórios" no ERP, então entram por nome: sem isso o
 * montador diria que a loja não vende teclado, o que não é verdade. */
function ehInstrumentoDoMontador(p: Product): boolean {
  const n = semAcento(p.name);
  const t = tipoDoProduto(p);
  /* O kit de 7 microfones é peça de bateria, não o microfone de quem canta. */
  if (t === "microfone") return !/\bbateria\b/.test(n);
  if (t !== "instrumento") return false;
  if (CATEGORIAS_INSTRUMENTO.includes(p.category)) return true;
  return /^(teclado|piano)/.test(n);
}

export function instrumentosDisponiveis(familia: Familia | null): Product[] {
  const todos = ordenar(pool.filter(ehInstrumentoDoMontador));
  if (!familia) return todos;
  return todos.filter((p) => familiaDoInstrumento(p) === familia);
}

/** Quantos instrumentos a família tem de verdade hoje. */
export function totalDaFamilia(f: Familia): number {
  return instrumentosDisponiveis(f).length;
}

/** Peças de um passo, já filtradas pelo instrumento escolhido. */
/* Cabo de instrumento, cabo de microfone e fonte de teclado são três coisas
   com a mesma palavra no nome. Separar por XLR é o que existe de sinal
   confiável: XLR é o conector de microfone, P10 é o de instrumento. */
const ehCaboXLR = (nome: string) => /\bxlr\b/.test(nome) || /\bmicrofone\b/.test(nome);

export function pecasDoSlot(slot: SlotId, instrumento: Product | null): Product[] {
  if (slot === "instrumento") return instrumentosDisponiveis(null);

  const fam = instrumento ? familiaDoInstrumento(instrumento) : null;
  const n = (p: Product) => semAcento(p.name);

  if (slot === "cordas") {
    const cordas = pool.filter((p) => tipoDoProduto(p) === "cordas");
    if (!fam) return ordenar(cordas);
    /* A corda do instrumento errado não é "menos relevante", é inútil: some.
       O que fica sem família declarada continua na lista — jogo genérico
       existe, e esconder tudo que o regex não entendeu esvazia o passo. */
    return ordenar(
      cordas.filter((p) => {
        const f = familiaDaCorda(p);
        return f === fam || f === "outro";
      }),
    );
  }

  if (slot === "ligar")
    return ordenar(
      pool.filter((p) => {
        if (tipoDoProduto(p) !== "cabo") return false;
        const nome = n(p);
        /* `tipoDoProduto` chama de cabo tudo que liga alguma coisa. Nesta etapa
           o cliente quer um cabo pronto: plug solto é peça de solda, e
           "Microfone com Cabo USB" é microfone (o nome dele casa a regra de
           cabo antes da de microfone). */
        if (/\bplug|adaptador|conector\b/.test(nome)) return false;
        if (/^microfone/.test(nome)) return false;
        /* Microfone só liga em XLR; instrumento e teclado, em P10. Oferecer o
           cabo do outro é vender peça que não encaixa. */
        return fam === "voz" ? ehCaboXLR(nome) : !ehCaboXLR(nome);
      }),
    );

  if (slot === "afinar")
    return ordenar(
      pool.filter((p) => {
        if (tipoDoProduto(p) !== "acessorio") return false;
        if (/\bafinador|metronomo\b/.test(n(p))) return true;
        /* Capotraste é peça de braço de violão e guitarra. Em baixo e bateria
           não existe onde encaixar. */
        if (/\bcapotraste\b/.test(n(p)))
          return fam === null || ["violao-nylon", "violao-aco", "guitarra", "viola", "cavaco"].includes(fam);
        return false;
      }),
    );

  if (slot === "cantar")
    return ordenar(
      pool.filter((p) => {
        if (tipoDoProduto(p) !== "microfone") return false;
        /* Kit de microfone de bateria é o caso de uso da bateria e só dela:
           num violão, sobra microfone que ninguém vai posicionar. */
        const deBateria = /\bbateria\b/.test(n(p));
        return fam === "bateria" ? true : !deBateria;
      }),
    );

  if (slot === "segurar")
    return ordenar(
      pool.filter((p) => {
        const t = tipoDoProduto(p);
        const nome = n(p);
        const deMicrofone = /\bmicrofone\b/.test(nome);
        const deTeclado = /\bteclado|piano\b/.test(nome);

        /* Quem canta apoia o microfone; quem toca teclado apoia o teclado e
           senta na banqueta. O mesmo passo, peças completamente diferentes. */
        if (fam === "voz") return t === "suporte" && deMicrofone;
        if (fam === "teclado") return t === "suporte" && (deTeclado || /\bbanqueta\b/.test(nome));
        if (fam === "bateria")
          return t === "suporte" && (/\bbanqueta\b/.test(nome) || /\bbateria\b/.test(nome) || /\btripe|estante\b/.test(nome));

        if (t === "suporte") {
          if (deMicrofone) return false;
          if (deTeclado) return false;
          return true;
        }
        return t === "acessorio" && /\bcorreia|talabarte|strap\b/.test(nome);
      }),
    );

  /* tocar */
  return ordenar(
    pool.filter((p) => {
      const t = tipoDoProduto(p);
      if (t === "manutencao") return true;
      if (t !== "acessorio") return false;
      if (/\bafinador|metronomo|capotraste|correia|talabarte\b/.test(n(p))) return false;
      /* Palheta não existe em bateria, teclado nem microfone. */
      if (/\bpalheta\b/.test(n(p))) return fam !== "bateria" && fam !== "teclado" && fam !== "voz";
      return true;
    }),
  );
}

/* ——— o que o microfone arrasta atrás ————————————————————————————————————— */

/** Cabo XLR e pedestal: sem os dois o microfone escolhido não funciona.
 *
 * Isso aparece DENTRO do passo do microfone, na hora em que ele é escolhido,
 * em vez de virar dois passos novos. Quem some com a dependência pra três telas
 * adiante entrega um microfone que não liga em nada, e o cliente descobre isso
 * quando a caixa chega. */
export function dependenciasDoMicrofone(mic: Product | null): { cabo: Product | null; pedestal: Product | null } {
  if (!mic) return { cabo: null, pedestal: null };

  /* A dependência é sugestão automática, então ela tem que ser a peça mais
     barata que resolve — não a mais "relevante" da vitrine. Com o peso normal
     de catálogo, o cabo sugerido era um rolo de 100 metros de R$ 349 pra ligar
     um microfone de R$ 180. */
  const maisBarato = (lista: Product[]) =>
    [...lista].sort((a, b) => a.priceNum - b.priceNum)[0] ?? null;

  /* Microfone sem fio não precisa de cabo: ele já vem com receptor. */
  const semFio = /\bsem ?fio|s\/fio|uhf|lapela\b/.test(semAcento(mic.name));
  const cabo = semFio
    ? null
    : maisBarato(
        pool.filter((p) => {
          if (tipoDoProduto(p) !== "cabo" || !ehCaboXLR(semAcento(p.name))) return false;
          const n = semAcento(p.name);
          /* `tipoDoProduto` chama de "cabo" tudo que liga alguma coisa, plug e
             adaptador incluídos. Sugerir um plug solto de R$ 12 é pior que
             sugerir o rolo caro: o cliente acha que comprou cabo e recebe um
             conector pra soldar. Cabo pronto tem "cabo" no nome, e rolo de 100
             metros é matéria-prima de luthier. */
          /* E "Microfone com Cabo USB PODCAST-400U" é microfone, não cabo: o
             nome dele casa a regra de cabo antes da de microfone. Quem é cabo
             ABRE o nome com "cabo". */
          if (!/^cabo\b/.test(n)) return false;
          return !/\b\d{2,3} ?mt\b|\bbobina\b/.test(n);
        }),
      );
  const pedestal = maisBarato(
    pool.filter((p) => tipoDoProduto(p) === "suporte" && /\bmicrofone\b/.test(semAcento(p.name))),
  );
  return { cabo, pedestal };
}

/* ——— o que combina ————————————————————————————————————————————————————— */

export type Gravidade = "erro" | "aviso";

export interface Recado {
  gravidade: Gravidade;
  /** Uma frase. O usuário lê isso no meio do fluxo, não um parágrafo. */
  texto: string;
  /** Passo pra onde o botão "trocar" leva. */
  slot: SlotId;
}

export type Selecao = Record<SlotId, Product[]>;

export const selecaoVazia = (): Selecao => ({
  instrumento: [],
  cordas: [],
  ligar: [],
  afinar: [],
  segurar: [],
  cantar: [],
  tocar: [],
});

/** Tudo que o kit tem a dizer sobre si. Erro bloqueia o fechamento; aviso não.
 *
 * `fechando` liga os avisos de AUSÊNCIA (falta cabo, falta jogo reserva). Eles
 * só valem quando o kit está pronto: cobrar no meio do caminho uma peça que o
 * passo seguinte ainda vai oferecer é ralhar com quem está obedecendo. */
export function checarKit(sel: Selecao, fechando = false): Recado[] {
  const recados: Recado[] = [];
  const instrumento = sel.instrumento[0] ?? null;
  if (!instrumento) return recados;

  const fam = familiaDoInstrumento(instrumento);
  const label = LABEL_FAMILIA[fam];

  for (const corda of sel.cordas) {
    const f = familiaDaCorda(corda);
    if (f === "outro") continue;
    if (f === fam) continue;
    /* O caso que estraga instrumento: aço num braço feito pra nylon. */
    if (fam === "violao-nylon" && f === "violao-aco") {
      recados.push({
        gravidade: "erro",
        slot: "cordas",
        texto:
          "Esse encordoamento é de aço e o seu é um violão de nylon: a tração do aço entorta o braço de um clássico. Troque por um jogo de nylon.",
      });
    } else {
      recados.push({
        gravidade: "erro",
        slot: "cordas",
        texto: `Esse jogo é de ${LABEL_FAMILIA[f]} e não serve em ${label}.`,
      });
    }
  }

  /* Microfone com fio e sem cabo XLR é o caso mais caro de descobrir tarde: a
     peça mais visível do kit chega e não liga em nada. */
  const micComFio = sel.cantar.filter((p) => !/\bsem ?fio|s\/fio|uhf|lapela\b/.test(semAcento(p.name)));
  const temCaboPraOferecer = dependenciasDoMicrofone(micComFio[0] ?? null).cabo !== null;
  if (
    micComFio.length > 0 &&
    temCaboPraOferecer &&
    !sel.ligar.some((p) => /\bxlr|microfone\b/.test(semAcento(p.name)))
  ) {
    recados.push({
      gravidade: "aviso",
      slot: "ligar",
      texto: "Microfone com fio precisa de cabo XLR. Sem ele, o microfone não liga na mesa nem na caixa.",
    });
  }

  /* Bateria, teclado e microfone não têm jogo de cordas nem captação pra cobrar:
     o resto das checagens é conversa de instrumento de corda. */
  if (fam === "bateria" || fam === "teclado" || fam === "voz") return recados;

  if (fechando && temCaptacao(instrumento) && sel.ligar.length === 0) {
    recados.push({
      gravidade: "aviso",
      slot: "ligar",
      texto: `Seu ${label} tem captação, mas o kit está sem cabo: assim ele só toca no volume do corpo.`,
    });
  }

  if (!temCaptacao(instrumento) && sel.ligar.length > 0) {
    recados.push({
      gravidade: "aviso",
      slot: "ligar",
      texto: `Seu ${label} não tem captação, então o cabo fica sobrando até você instalar uma.`,
    });
  }

  if (fam === "violao-nylon" && sel.segurar.some((p) => /correia|talabarte/.test(semAcento(p.name)))) {
    recados.push({
      gravidade: "aviso",
      slot: "segurar",
      texto:
        "Violão clássico costuma vir sem pino de correia. Dá pra instalar um na loja, ou usar correia de laço no cabeçote.",
    });
  }

  if (fechando && sel.cordas.length === 0) {
    recados.push({
      gravidade: "aviso",
      slot: "cordas",
      texto: "Sem jogo reserva, a corda que arrebentar te tira de circulação até a próxima ida à loja.",
    });
  }

  return recados;
}

/* ——— preço ———————————————————————————————————————————————————————————— */

/** O kit fecha com 8%, o mesmo desconto dos combos da home. */
export const DESCONTO_KIT = 0.08;

export function totaisDoKit(sel: Selecao) {
  const itens = SLOTS.flatMap((s) => sel[s.id]);
  const cheio = itens.reduce((soma, p) => soma + p.priceNum, 0);
  const comDesconto = cheio * (1 - DESCONTO_KIT);
  return { itens, cheio, comDesconto, economia: cheio - comDesconto };
}
