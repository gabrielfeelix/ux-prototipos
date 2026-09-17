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

import { type Product } from "../../components/productsData";
import { catalogo, peso, tipoDoProduto } from "../../v2/curadoria";

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
  | "outro";

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const temTag = (p: Product, tag: string) =>
  (p.tags ?? []).some((t) => semAcento(t) === semAcento(tag));

/** Família do instrumento escolhido. Tag primeiro, nome como desempate. */
export function familiaDoInstrumento(p: Product): Familia {
  const n = semAcento(p.name);
  if (p.category === "Baterias" || /\bbateria\b/.test(n)) return "bateria";
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

export type SlotId = "instrumento" | "cordas" | "ligar" | "afinar" | "segurar" | "tocar";

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
    id: "tocar",
    titulo: "Pra tocar e conservar",
    sub: "Palheta, limpeza, o que sobra na mochila.",
    curto: "Extras",
    max: 3,
  },
];

/** Passos visíveis dado o que já foi escolhido. "Pra ligar" some no acústico. */
export function slotsVisiveis(instrumento: Product | null): Slot[] {
  return SLOTS.filter((s) => {
    if (s.id === "ligar") return instrumento ? temCaptacao(instrumento) : false;
    return true;
  });
}

/* ——— peças de cada passo ——————————————————————————————————————————————— */

const ordenar = (lista: Product[]) =>
  [...lista].sort((a, b) => Number(b.inStock ?? true) - Number(a.inStock ?? true) || peso(b) - peso(a));

const CATEGORIAS_INSTRUMENTO = ["Violões", "Guitarras", "Contrabaixos", "Baterias"];

/** Famílias oferecidas no primeiro passo, na ordem em que a loja vende. */
export const FAMILIAS_OFERECIDAS: { id: Familia; label: string }[] = [
  { id: "violao-nylon", label: "Violão de nylon" },
  { id: "violao-aco", label: "Violão de aço" },
  { id: "guitarra", label: "Guitarra" },
  { id: "baixo", label: "Contrabaixo" },
  { id: "ukulele", label: "Ukulele" },
  { id: "viola", label: "Viola" },
  { id: "bateria", label: "Bateria" },
];

export function instrumentosDisponiveis(familia: Familia | null): Product[] {
  const todos = ordenar(
    catalogo.filter(
      (p) => tipoDoProduto(p) === "instrumento" && CATEGORIAS_INSTRUMENTO.includes(p.category),
    ),
  );
  if (!familia) return todos;
  return todos.filter((p) => familiaDoInstrumento(p) === familia);
}

/** Peças de um passo, já filtradas pelo instrumento escolhido. */
export function pecasDoSlot(slot: SlotId, instrumento: Product | null): Product[] {
  if (slot === "instrumento") return instrumentosDisponiveis(null);

  const fam = instrumento ? familiaDoInstrumento(instrumento) : null;
  const n = (p: Product) => semAcento(p.name);

  if (slot === "cordas") {
    const cordas = catalogo.filter((p) => tipoDoProduto(p) === "cordas");
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

  if (slot === "ligar") return ordenar(catalogo.filter((p) => tipoDoProduto(p) === "cabo"));

  if (slot === "afinar")
    return ordenar(
      catalogo.filter((p) => {
        if (tipoDoProduto(p) !== "acessorio") return false;
        if (/\bafinador|metronomo\b/.test(n(p))) return true;
        /* Capotraste é peça de braço de violão e guitarra. Em baixo e bateria
           não existe onde encaixar. */
        if (/\bcapotraste\b/.test(n(p)))
          return fam === null || ["violao-nylon", "violao-aco", "guitarra", "viola"].includes(fam);
        return false;
      }),
    );

  if (slot === "segurar")
    return ordenar(
      catalogo.filter((p) => {
        const t = tipoDoProduto(p);
        if (t === "suporte") {
          /* Suporte de microfone e de teclado existem no catálogo e não têm o
             que fazer no kit de quem escolheu um violão. */
          if (/\bmicrofone\b/.test(n(p))) return false;
          if (/\bteclado|piano\b/.test(n(p)) && fam !== "bateria") return false;
          return true;
        }
        return t === "acessorio" && /\bcorreia|talabarte|strap\b/.test(n(p));
      }),
    );

  /* tocar */
  return ordenar(
    catalogo.filter((p) => {
      const t = tipoDoProduto(p);
      if (t === "manutencao") return true;
      if (t !== "acessorio") return false;
      if (/\bafinador|metronomo|capotraste|correia|talabarte\b/.test(n(p))) return false;
      /* Palheta em baixo é escolha de estilo; em bateria, não é peça. */
      if (/\bpalheta\b/.test(n(p))) return fam !== "bateria";
      return true;
    }),
  );
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
