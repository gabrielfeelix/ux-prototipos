/* afinacoes — o catálogo de instrumentos e afinações do Afinador Tonante.
 *
 * Nota é sempre número MIDI (ver `lib/tuner.ts`). A ordem de `cordas` é da
 * mais GRAVE para a mais AGUDA, que é a ordem em que elas aparecem no desenho
 * da cabeça (bordão à esquerda) e a ordem em que "Afinar tudo" percorre.
 *
 * O que separa este afinador dos gringos é a metade de baixo desta lista:
 * viola caipira com os cebolões, cavaquinho e bandolim. Afinador de site
 * internacional trata viola de dez cordas como curiosidade; aqui ela é o
 * instrumento que o cliente da Tonante tem em casa. */

export type Corda = {
  midi: number;
  /** segunda corda da mesma ordem (viola, bandolim, 12 cordas). */
  parceira?: number;
};

export type Afinacao = {
  id: string;
  nome: string;
  /** frase curta que diz quando usar — aparece embaixo do seletor. */
  nota?: string;
  cordas: Corda[];
};

export type Instrumento = {
  id: string;
  nome: string;
  /** tarraxas metade de cada lado, ou todas no mesmo lado (baixo). */
  cabeca: "dividida" | "inline";
  /** 0 = nylon opaco, 1 = aço de guitarra. Afeta timbre e cor da corda. */
  brilho: number;
  /** quantas ordens, contadas do bordão, são entorchadas (cor de bronze). */
  entorchadas: number;
  /** busca do encordoamento correspondente no catálogo. */
  buscaCorda: string;
  afinacoes: Afinacao[];
};

const c = (midi: number, parceira?: number): Corda => ({ midi, parceira });

export const INSTRUMENTOS: Instrumento[] = [
  {
    id: "violao",
    nome: "Violão",
    cabeca: "dividida",
    brilho: 0.34,
    entorchadas: 3,
    buscaCorda: "corda violão",
    afinacoes: [
      {
        id: "padrao",
        nome: "Padrão · mi",
        nota: "A afinação de quase tudo. Se você não sabe qual usar, é esta.",
        cordas: [c(40), c(45), c(50), c(55), c(59), c(64)],
      },
      {
        id: "drop-d",
        nome: "Drop D",
        nota: "Só o bordão desce um tom. Deixa o ré grave soar solto.",
        cordas: [c(38), c(45), c(50), c(55), c(59), c(64)],
      },
      {
        id: "meio-tom",
        nome: "Meio tom abaixo · mi bemol",
        nota: "Alivia a tensão e ajuda quem canta um pouco mais grave.",
        cordas: [c(39), c(44), c(49), c(54), c(58), c(63)],
      },
      {
        id: "dadgad",
        nome: "Ré suspenso · DADGAD",
        nota: "Afinação aberta de dedilhado, muito usada em folk e trilha.",
        cordas: [c(38), c(45), c(50), c(55), c(57), c(62)],
      },
      {
        id: "sol-aberto",
        nome: "Sol aberto",
        nota: "Solta um sol maior com as cordas livres. Terreno de slide.",
        cordas: [c(38), c(43), c(50), c(55), c(59), c(62)],
      },
      {
        id: "doze",
        nome: "Doze cordas · padrão",
        nota: "Cada ordem tem duas cordas. As quatro graves são oitavadas.",
        cordas: [c(40, 52), c(45, 57), c(50, 62), c(55, 67), c(59, 59), c(64, 64)],
      },
    ],
  },
  {
    id: "guitarra",
    nome: "Guitarra",
    cabeca: "dividida",
    brilho: 0.92,
    entorchadas: 3,
    buscaCorda: "corda guitarra",
    afinacoes: [
      {
        id: "padrao",
        nome: "Padrão · mi",
        nota: "A afinação de fábrica de qualquer guitarra de seis cordas.",
        cordas: [c(40), c(45), c(50), c(55), c(59), c(64)],
      },
      {
        id: "drop-d",
        nome: "Drop D",
        nota: "Power chord de um dedo só na sexta corda.",
        cordas: [c(38), c(45), c(50), c(55), c(59), c(64)],
      },
      {
        id: "meio-tom",
        nome: "Meio tom abaixo · mi bemol",
        cordas: [c(39), c(44), c(49), c(54), c(58), c(63)],
      },
      {
        id: "drop-c",
        nome: "Drop C",
        nota: "Tudo um tom abaixo e o bordão em dó. Pede corda mais grossa.",
        cordas: [c(36), c(43), c(48), c(53), c(57), c(62)],
      },
      {
        id: "sete",
        nome: "Sete cordas · si grave",
        cordas: [c(35), c(40), c(45), c(50), c(55), c(59), c(64)],
      },
    ],
  },
  {
    id: "baixo",
    nome: "Baixo",
    cabeca: "inline",
    brilho: 0.4,
    entorchadas: 6,
    buscaCorda: "corda baixo",
    afinacoes: [
      {
        id: "quatro",
        nome: "Quatro cordas · padrão",
        nota: "Mesmas notas das quatro graves do violão, uma oitava abaixo.",
        cordas: [c(28), c(33), c(38), c(43)],
      },
      { id: "drop-d", nome: "Quatro cordas · drop D", cordas: [c(26), c(33), c(38), c(43)] },
      {
        id: "cinco",
        nome: "Cinco cordas · si grave",
        nota: "O si grave abre cinco notas abaixo do mi. Afine sem pressa.",
        cordas: [c(23), c(28), c(33), c(38), c(43)],
      },
      { id: "seis", nome: "Seis cordas · si e dó", cordas: [c(23), c(28), c(33), c(38), c(43), c(48)] },
    ],
  },
  {
    id: "viola",
    nome: "Viola caipira",
    cabeca: "dividida",
    brilho: 0.88,
    entorchadas: 2,
    buscaCorda: "corda viola",
    afinacoes: [
      {
        id: "cebolao-mi",
        nome: "Cebolão em mi",
        nota: "A mais tocada do Brasil. As duas ordens graves são oitavadas.",
        cordas: [c(47, 59), c(52, 40), c(56, 56), c(59, 59), c(64, 64)],
      },
      {
        id: "cebolao-re",
        nome: "Cebolão em ré",
        nota: "Um tom abaixo do cebolão em mi. Mais grave e mais frouxa.",
        cordas: [c(45, 57), c(50, 38), c(54, 54), c(57, 57), c(62, 62)],
      },
      {
        id: "rio-abaixo",
        nome: "Rio abaixo",
        nota: "Sol maior nas cordas soltas. Moda de viola e cateretê.",
        cordas: [c(43, 55), c(50, 38), c(55, 55), c(59, 59), c(62, 62)],
      },
      {
        id: "boiadeira",
        nome: "Boiadeira",
        nota: "Lá maior solto. Boa para pontear em cima da voz.",
        cordas: [c(45, 57), c(52, 40), c(57, 57), c(61, 61), c(64, 64)],
      },
    ],
  },
  {
    id: "cavaquinho",
    nome: "Cavaquinho",
    cabeca: "dividida",
    brilho: 0.95,
    entorchadas: 1,
    buscaCorda: "corda cavaquinho",
    afinacoes: [
      {
        id: "padrao",
        nome: "Padrão · ré sol si ré",
        nota: "A afinação do samba e do choro.",
        cordas: [c(62), c(67), c(71), c(74)],
      },
      {
        id: "guitarra",
        nome: "Ré sol si mi",
        nota: "Copia as quatro cordas agudas do violão. Facilita a passagem.",
        cordas: [c(62), c(67), c(71), c(76)],
      },
    ],
  },
  {
    id: "ukulele",
    nome: "Ukulele",
    cabeca: "dividida",
    brilho: 0.5,
    entorchadas: 0,
    buscaCorda: "corda ukulele",
    afinacoes: [
      {
        id: "sol-agudo",
        nome: "Padrão · sol agudo",
        nota: "A quarta corda é a mais aguda das quatro. É isso mesmo.",
        cordas: [c(67), c(60), c(64), c(69)],
      },
      {
        id: "sol-grave",
        nome: "Sol grave",
        nota: "Troca só a quarta corda e devolve o grave ao instrumento.",
        cordas: [c(55), c(60), c(64), c(69)],
      },
      { id: "baritono", nome: "Barítono · ré sol si mi", cordas: [c(50), c(55), c(59), c(64)] },
    ],
  },
  {
    id: "bandolim",
    nome: "Bandolim",
    cabeca: "dividida",
    brilho: 0.96,
    entorchadas: 2,
    buscaCorda: "corda bandolim",
    afinacoes: [
      {
        id: "padrao",
        nome: "Padrão · sol ré lá mi",
        nota: "Oito cordas em quatro ordens, cada par no uníssono.",
        cordas: [c(55, 55), c(62, 62), c(69, 69), c(76, 76)],
      },
    ],
  },
];

export function acharInstrumento(id: string): Instrumento {
  return INSTRUMENTOS.find((i) => i.id === id) ?? INSTRUMENTOS[0];
}

/** Ordinal falado da corda: a 1ª é a mais aguda, então conta ao contrário. */
export function ordinalDaCorda(indice: number, total: number): string {
  return `${total - indice}ª`;
}
