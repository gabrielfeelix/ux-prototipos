/* kits — os oito "Pronto pra Tocar".
 *
 * Molde: SETUP_SEED do PCYES v3 (src/app/lib/setups.ts). Lá o cliente decidiu
 * que build pronta é PRODUTO, não carrinho montado: compra em um clique, tem
 * PDP, entra na busca e no comparador. Mesmo padrão aqui — foi o que o Gabriel
 * escolheu quando perguntei.
 *
 * A grade é 3 perfis × 3 faixas com um buraco assumido: "quem tá começando" na
 * faixa Avançado é uma contradição, e inventar um quarto perfil só pra fechar a
 * grade seria decorar, não desenhar. São oito.
 *
 * O veredito de "o que dá pra tocar com isso" é CALCULADO do `som` da banda
 * contra o kit, nunca digitado por kit. Se fosse digitado, dois kits vizinhos
 * diriam coisas diferentes sobre a mesma banda e ninguém saberia qual está
 * certo. Mesma regra que o v3 escreve no topo do SetupWorkloadsBlock. */

import type { Product } from "../components/productsData";
import { BANDS, type Band, type Captacao, type Corda, type Instrumento } from "./bandLibrary";

export type Faixa = "Entrada" | "Intermediário" | "Avançado";
export type Perfil = "comecando" | "igreja" | "fora-de-casa";

export const PERFIS: { id: Perfil; label: string; sub: string }[] = [
  { id: "comecando", label: "Quem tá começando", sub: "Primeiro instrumento, primeiro acorde" },
  { id: "igreja", label: "Quem toca na igreja", sub: "Ligado na mesa, semana após semana" },
  { id: "fora-de-casa", label: "Quem toca fora de casa", sub: "Ensaio, bar, palco" },
];

/** Uma peça do kit. `busca` resolve a foto real no catálogo. */
export interface Peca {
  slot: string;
  modelo: string;
  descricao: string;
  /** Termos que acham o produto real no catálogo, em ordem de preferência. */
  busca: string[];
}

export interface KitSeed {
  key: string;
  perfil: Perfil;
  faixa: Faixa;
  name: string;
  tagline: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  /** Família do instrumento base — vira faceta na listagem. */
  instrumento: Instrumento;
  /** O que o kit entrega de som. É contra isto que a banda é medida. */
  entrega: { corda: Corda; captacao: Captacao };
  pecas: Peca[];
  /** "Pra quem é" — o primeiro bloco da PDP. */
  praQuem: { titulo: string; texto: string };
  /** Três motivos, um por peça que decide o kit. */
  porque: { slot: string; titulo: string; texto: string }[];
  /** Cenas de uso, na ordem em que aparecem. */
  cenas: ("quarto" | "igreja" | "palco")[];
  faq: { p: string; r: string }[];
  /** Fora da vitrine enquanto falta arte. O kit continua existindo (o id é
      posicional e não pode andar), só não aparece no catálogo. */
  oculto?: boolean;
}

export const KIT_SEED: KitSeed[] = [
  {
    key: "primeiro-acorde",
    perfil: "comecando",
    faixa: "Entrada",
    name: "Primeiro Acorde",
    tagline: "Violão de nylon · tudo que falta pra começar hoje",
    description:
      "O kit que existe pra você não desistir na segunda semana. Nylon machuca menos o dedo, o afinador tira a desculpa de que está soando errado, e a correia deixa tocar em pé sem apoiar no joelho.",
    price: 749,
    oldPrice: 869,
    rating: 4.8,
    reviews: 412,
    badge: "MAIS VENDIDO",
    instrumento: "violao",
    entrega: { corda: "nylon", captacao: "nenhuma" },
    pecas: [
      { slot: "Violão", modelo: "Tonante Lorenzzo Clássico 39\"", descricao: "Nylon, tampo de spruce, corpo menor. Cabe no colo de quem nunca segurou um.", busca: ["violão clássico", "lorenzzo", "nylon"] },
      { slot: "Afinador", modelo: "Afinador de clipe", descricao: "Prende na cabeça do braço e mostra a nota. Violão desafinado soa errado mesmo quando o acorde está certo.", busca: ["afinador"] },
      { slot: "Correia", modelo: "Correia de tecido", descricao: "Pra tocar em pé desde o começo, em vez de aprender torto sentado.", busca: ["correia"] },
      { slot: "Palhetas", modelo: "Cartela de palhetas", descricao: "Finas, que é o que a mão iniciante aguenta sem travar a levada.", busca: ["palheta"] },
    ],
    praQuem: {
      titulo: "Pra quem nunca tocou e não quer errar na primeira compra",
      texto:
        "A maioria desiste do violão no primeiro mês, e quase nunca por falta de talento: é o dedo que dói e o som que não sai. Nylon resolve o dedo. O afinador resolve o som. O resto é você.",
    },
    porque: [
      { slot: "Violão", titulo: "Nylon, não aço", texto: "Corda de nylon tem metade da tensão da de aço. Nas primeiras semanas isso é a diferença entre praticar meia hora e parar em dez minutos." },
      { slot: "Afinador", titulo: "Tira a dúvida do som", texto: "Quem está começando não distingue acorde errado de violão desafinado. O afinador elimina metade das possibilidades." },
      { slot: "Correia", titulo: "Postura desde o início", texto: "Corrigir postura depois é mais difícil que aprender certo. A correia custa pouco e economiza esse retrabalho." },
    ],
    cenas: ["quarto"],
    faq: [
      { p: "Serve pra criança?", r: "Serve a partir dos 8 anos. O corpo 39\" é menor que o violão comum, e o nylon não machuca a mão pequena." },
      { p: "Dá pra tocar sertanejo nele?", r: "Dá, mas o nylon entrega um som mais redondo e menos brilhante. Se o plano é sertanejo desde já, o Primeiro Palco é o kit certo." },
      { p: "Preciso de mais alguma coisa?", r: "Não. Sai da caixa afinável, tocável e transportável." },
    ],
  },
  {
    key: "primeiro-palco",
    perfil: "comecando",
    faixa: "Intermediário",
    name: "Primeiro Palco",
    tagline: "Violão de aço com captação · pronto pra ligar na mesa",
    description:
      "Pra quem já passou da fase de aprender os acordes e começou a ser chamado pra tocar. Aço brilha no meio de outras pessoas cantando, e a captação dispensa o microfone na frente do tampo.",
    price: 1349,
    oldPrice: 1549,
    rating: 4.8,
    reviews: 236,
    instrumento: "violao",
    entrega: { corda: "aco", captacao: "passiva" },
    pecas: [
      { slot: "Violão", modelo: "Tonante Coral Eletroacústico 41\"", descricao: "Aço, tampo cheio, captação com equalizador embutido.", busca: ["violão elétrico", "coral", "eletroacústico"] },
      { slot: "Cabo", modelo: "Cabo P10 de 3 metros", descricao: "Liga o violão na mesa ou na caixa ativa. Três metros dá pra andar sem arrancar.", busca: ["cabo p10", "cabo"] },
      { slot: "Correia", modelo: "Correia de couro", descricao: "Aguenta o peso do violão de tampo cheio por duas horas de pé.", busca: ["correia couro", "correia"] },
      { slot: "Afinador", modelo: "Afinador de clipe", descricao: "Afinar entre uma música e outra sem depender do som da sala.", busca: ["afinador"] },
    ],
    praQuem: {
      titulo: "Pra quem já toca em casa e começou a ser chamado pra tocar fora",
      texto:
        "A primeira vez que alguém pede pra você tocar num aniversário, numa roda, num culto, o violão acústico puro some no meio do barulho. Captação não é luxo, é ser ouvido.",
    },
    porque: [
      { slot: "Violão", titulo: "Aço projeta mais", texto: "Corda de aço tem mais brilho e mais volume que nylon. No meio de gente cantando junto, é o que sobra." },
      { slot: "Violão", titulo: "Captação embutida", texto: "Um cabo resolve. Sem microfone na frente do tampo, sem microfonia, sem depender de quem opera o som." },
      { slot: "Cabo", titulo: "Três metros, não um", texto: "Cabo curto prende você ao pedestal. Três metros é o mínimo pra se mexer sem derrubar nada." },
    ],
    cenas: ["quarto", "igreja"],
    faq: [
      { p: "Funciona sem ligar o cabo?", r: "Funciona. Eletroacústico é um violão acústico normal que também aceita cabo: em casa você toca desligado." },
      { p: "Preciso trocar a corda pra nylon?", r: "Não dá. O braço e o tampo são calculados pra tensão de aço; nylon nele fica frouxo e sem volume." },
      { p: "Precisa de amplificador?", r: "Não, se a igreja ou a casa de show já tem mesa. Se você quer autonomia, o kit Ministério inclui o amplificador." },
    ],
  },
  {
    key: "louvor",
    perfil: "igreja",
    faixa: "Entrada",
    name: "Louvor",
    tagline: "Violão de nylon com captação · ministração e ensaio",
    description:
      "O kit do violão que fica na igreja. Nylon pro som ficar macio embaixo da voz, captação pra entrar na mesa, e suporte pra não passar a semana encostado na parede.",
    price: 1149,
    rating: 4.7,
    reviews: 158,
    instrumento: "violao",
    entrega: { corda: "nylon", captacao: "passiva" },
    pecas: [
      { slot: "Violão", modelo: "Tonante Lorenzzo Eletroacústico Nylon", descricao: "Nylon com captação. O som redondo que não briga com a voz da congregação.", busca: ["violão elétrico nylon", "lorenzzo", "clássico"] },
      { slot: "Suporte", modelo: "Suporte de chão dobrável", descricao: "Violão em pé ao lado do púlpito, não deitado no banco nem encostado na parede.", busca: ["suporte violão", "suporte"] },
      { slot: "Cabo", modelo: "Cabo P10 de 3 metros", descricao: "Uma ponta no violão, outra na mesa. Nada mais.", busca: ["cabo p10", "cabo"] },
    ],
    praQuem: {
      titulo: "Pra quem ministra com o violão embaixo da voz",
      texto:
        "Na ministração o violão não é o solista, é o chão. Nylon entrega isso melhor que aço: preenche sem cortar, sustenta sem chamar atenção.",
    },
    porque: [
      { slot: "Violão", titulo: "Nylon não briga com a voz", texto: "O brilho do aço disputa a mesma faixa da voz na mesa. Nylon senta embaixo e deixa a letra passar." },
      { slot: "Violão", titulo: "Captação sem microfone", texto: "Microfone na frente do tampo devolve o retorno da caixa e microfoniza. Cabo não." },
      { slot: "Suporte", titulo: "O violão mora lá", texto: "Instrumento de igreja passa a semana no salão. Suporte é o que impede a queda que custa o tampo." },
    ],
    cenas: ["igreja"],
    faq: [
      { p: "Dá pra usar em casa também?", r: "Dá. Desligado ele é um violão de nylon comum." },
      { p: "Serve pra louvor mais agitado?", r: "Serve, mas se a banda tem bateria e guitarra, o aço do kit Ministério corta melhor." },
      { p: "O suporte cabe na mochila?", r: "Cabe. É dobrável e pesa pouco mais de meio quilo." },
    ],
  },
  {
    key: "ministerio",
    perfil: "igreja",
    faixa: "Intermediário",
    name: "Ministério",
    tagline: "Violão de aço com captação e amplificador próprio",
    description:
      "Pra quem toca toda semana e cansou de depender de quem opera o som. O amplificador dá o seu próprio retorno; a captação dá a linha pra mesa. Você ouve o que está tocando.",
    price: 2290,
    oldPrice: 2590,
    rating: 4.9,
    reviews: 187,
    badge: "MAIS PEDIDO",
    instrumento: "violao",
    entrega: { corda: "aco", captacao: "passiva" },
    pecas: [
      { slot: "Violão", modelo: "Tonante Coral Eletroacústico 41\"", descricao: "Aço com equalizador embutido. Corta no meio da banda inteira.", busca: ["violão elétrico", "coral", "eletroacústico"] },
      { slot: "Amplificador", modelo: "Amplificador para violão", descricao: "Seu retorno, no seu volume, independente da mesa.", busca: ["amplificador", "cubo"] },
      { slot: "Cabo", modelo: "Cabo P10 de 3 metros", descricao: "Violão ao amplificador; a saída de linha vai pra mesa.", busca: ["cabo p10", "cabo"] },
      { slot: "Correia", modelo: "Correia de couro", descricao: "Duas horas de pé sem o ombro reclamar.", busca: ["correia couro", "correia"] },
    ],
    praQuem: {
      titulo: "Pra quem toca toda semana e precisa se ouvir",
      texto:
        "O problema de quem toca em igreja raramente é o instrumento, é não ouvir o próprio som no retorno. Amplificador resolve isso sem pedir nada a ninguém.",
    },
    porque: [
      { slot: "Amplificador", titulo: "Retorno que é seu", texto: "Mesa dá o retorno que sobra. O amplificador ao seu lado dá o retorno que você escolhe." },
      { slot: "Violão", titulo: "Aço pra cortar a banda", texto: "Com bateria e teclado tocando junto, o nylon some. O aço tem o brilho que atravessa." },
      { slot: "Correia", titulo: "Couro, não tecido", texto: "Tampo cheio é pesado. Couro distribui o peso; tecido corta o ombro." },
    ],
    cenas: ["igreja", "palco"],
    faq: [
      { p: "O amplificador substitui a mesa?", r: "Em sala pequena, sim. Em salão grande ele vira seu retorno e a saída de linha alimenta a mesa." },
      { p: "Dá pra ligar microfone nele?", r: "Dá. O amplificador de violão tem canal de microfone, então serve pra você cantar e tocar sozinho." },
      { p: "É pesado pra carregar?", r: "Cerca de sete quilos. Cabe no porta-malas e se leva numa mão." },
    ],
  },
  {
    key: "culto-cheio",
    perfil: "igreja",
    faixa: "Avançado",
    oculto: true,
    name: "Culto Cheio",
    tagline: "Violão, microfone e amplificador · você canta e toca sozinho",
    description:
      "O kit de quem conduz sozinho: violão na captação, voz no microfone condensador, tudo no mesmo amplificador. Chega, liga dois cabos e o culto começa.",
    price: 3490,
    oldPrice: 3890,
    rating: 4.9,
    reviews: 94,
    instrumento: "violao",
    entrega: { corda: "aco", captacao: "passiva" },
    pecas: [
      { slot: "Violão", modelo: "Tonante Coral Eletroacústico 41\"", descricao: "Aço com equalizador. A base de tudo.", busca: ["violão elétrico", "coral", "eletroacústico"] },
      { slot: "Microfone", modelo: "Microfone condensador com pedestal", descricao: "Voz com corpo, sem precisar colar a boca na cápsula.", busca: ["microfone condensador", "microfone"] },
      { slot: "Amplificador", modelo: "Amplificador para violão com dois canais", descricao: "Um canal pro violão, outro pra voz. Uma tomada só.", busca: ["amplificador", "cubo"] },
      { slot: "Cabos", modelo: "Dois cabos P10 de 3 metros", descricao: "Um pro violão, um pro microfone.", busca: ["cabo p10", "cabo"] },
    ],
    praQuem: {
      titulo: "Pra quem conduz o louvor sozinho, do começo ao fim",
      texto:
        "Quando não há banda, tudo depende de duas coisas soarem bem ao mesmo tempo: a voz e o violão. Este kit é essas duas coisas resolvidas com dois cabos.",
    },
    porque: [
      { slot: "Microfone", titulo: "Condensador, não dinâmico", texto: "Condensador pega o corpo da voz de meio metro de distância: você canta olhando pra congregação, não pro microfone." },
      { slot: "Amplificador", titulo: "Dois canais, uma tomada", texto: "Voz e violão com volume independente sem precisar de mesa nem de operador." },
      { slot: "Violão", titulo: "Equalizador no instrumento", texto: "Ajustar grave e agudo na hora, sem atravessar o salão pra mexer em outro aparelho." },
    ],
    cenas: ["igreja", "palco"],
    faq: [
      { p: "Precisa de mesa de som?", r: "Não. O amplificador de dois canais é a mesa, pra este tamanho de sala." },
      { p: "O microfone pega o som do violão junto?", r: "Pega um pouco, e isso ajuda. Se atrapalhar, afaste o pedestal meio metro do tampo." },
      { p: "Dá pra gravar com esse microfone?", r: "Dá, com uma interface. Ele é condensador, que é o tipo usado em gravação." },
    ],
  },
  {
    key: "ensaio",
    perfil: "fora-de-casa",
    faixa: "Entrada",
    name: "Ensaio",
    tagline: "Guitarra e amplificador de estudo · pra tocar todo dia",
    description:
      "Guitarra, amplificador pequeno, cabo e correia. O suficiente pra ensaiar em casa no volume que não briga com o vizinho, e pra levar pro ensaio da banda.",
    price: 1890,
    rating: 4.7,
    reviews: 203,
    instrumento: "guitarra",
    entrega: { corda: "aco", captacao: "single" },
    pecas: [
      { slot: "Guitarra", modelo: "Tonante Stratocaster SSS", descricao: "Três captadores single, o desenho mais versátil que existe.", busca: ["guitarra", "stratocaster", "sss"] },
      { slot: "Amplificador", modelo: "Amplificador de estudo", descricao: "Volume de quarto com o timbre de volume de palco.", busca: ["amplificador", "cubo"] },
      { slot: "Cabo", modelo: "Cabo P10 de 3 metros", descricao: "Guitarra ao amplificador.", busca: ["cabo p10", "cabo"] },
      { slot: "Correia", modelo: "Correia de couro", descricao: "Ensaiar sentado e tocar em pé pedem a mesma altura.", busca: ["correia couro", "correia"] },
    ],
    praQuem: {
      titulo: "Pra quem quer tocar guitarra todo dia sem incomodar ninguém",
      texto:
        "Guitarra sem amplificador é um instrumento mudo. O de estudo resolve isso no volume de apartamento, e ainda vai pro ensaio da banda dentro do carro.",
    },
    porque: [
      { slot: "Guitarra", titulo: "Três single, não dois humbucker", texto: "SSS cobre limpo, blues, pop e rock. Humbucker é mais especializado, bom depois que você já sabe o que quer." },
      { slot: "Amplificador", titulo: "Pequeno de propósito", texto: "Amplificador grande em quarto toca sempre no volume errado. O de estudo soa bem onde você realmente vai usar." },
      { slot: "Cabo", titulo: "Blindado", texto: "Cabo ruim chia e capta rádio. Num sinal de guitarra, o cabo é parte do timbre." },
    ],
    cenas: ["quarto"],
    faq: [
      { p: "Dá pra tocar com fone?", r: "Dá. O amplificador tem saída de fone e corta o alto-falante." },
      { p: "Serve pra tocar em banda?", r: "Pra ensaio, sim. Pra palco com bateria acústica, o kit Bar tem a potência que falta." },
      { p: "Vem com pedal?", r: "Não. O amplificador já tem distorção, então pedal é a próxima compra, não a primeira." },
    ],
  },
  {
    key: "bar",
    perfil: "fora-de-casa",
    faixa: "Intermediário",
    name: "Bar",
    tagline: "Guitarra e combo · volume de banda inteira",
    description:
      "O kit do músico que toca em bar, casamento e festa. Combo com potência pra atravessar uma bateria acústica, e suporte pra guitarra não ficar no chão entre um set e outro.",
    price: 3290,
    oldPrice: 3690,
    rating: 4.8,
    reviews: 141,
    instrumento: "guitarra",
    entrega: { corda: "aco", captacao: "single" },
    pecas: [
      { slot: "Guitarra", modelo: "Tonante Stratocaster SSS", descricao: "Versátil o bastante pra tocar quatro horas de repertório variado.", busca: ["guitarra", "stratocaster", "sss"] },
      { slot: "Amplificador", modelo: "Combo de médio porte", descricao: "Potência pra passar por cima da bateria sem estourar.", busca: ["amplificador", "cubo"] },
      { slot: "Cabos", modelo: "Dois cabos P10", descricao: "Um em uso, um reserva. Cabo falha sempre no meio da música.", busca: ["cabo p10", "cabo"] },
      { slot: "Suporte", modelo: "Suporte de chão dobrável", descricao: "Entre um set e outro a guitarra fica em pé, não no chão do bar.", busca: ["suporte guitarra", "suporte"] },
    ],
    praQuem: {
      titulo: "Pra quem toca a noite inteira e recebe por isso",
      texto:
        "Em bar ninguém passa som. Você chega, liga e toca quatro horas. O que importa é o equipamento não falhar e ter volume sobrando.",
    },
    porque: [
      { slot: "Amplificador", titulo: "Potência sobrando", texto: "Amplificador no talo distorce e esquenta. Um combo maior no meio do volume soa melhor e dura mais." },
      { slot: "Cabos", titulo: "Dois, não um", texto: "Cabo é a peça que mais falha e a mais barata de duplicar. O reserva já vem no kit." },
      { slot: "Suporte", titulo: "A guitarra sai do chão", texto: "Guitarra no chão de bar é guitarra pisada. O suporte custa menos que um reparo de braço." },
    ],
    cenas: ["palco"],
    faq: [
      { p: "Dá pra microfonar o combo?", r: "Dá, e é o normal em casa com PA. Sem PA, ele se vira sozinho." },
      { p: "Cabe no carro?", r: "Cabe no porta-malas de um hatch, com a guitarra no banco de trás." },
      { p: "Serve pra ensaiar em casa?", r: "Serve, mas sobra volume. Pra quarto, o kit Ensaio é o certo." },
    ],
  },
  {
    key: "palco",
    perfil: "fora-de-casa",
    faixa: "Avançado",
    name: "Palco",
    tagline: "Guitarra, cabeçote e caixa · o setup que não pede licença",
    description:
      "Cabeçote e caixa separados, pedal na frente e cabo reserva. É o kit de quem tem hora marcada, passagem de som e não pode depender do backline da casa.",
    price: 6490,
    oldPrice: 7190,
    rating: 4.9,
    reviews: 68,
    instrumento: "guitarra",
    entrega: { corda: "aco", captacao: "humbucker" },
    pecas: [
      { slot: "Guitarra", modelo: "Tonante Telecaster", descricao: "Ataque seco e definido. A guitarra que atravessa mixagem cheia.", busca: ["guitarra", "telecaster"] },
      { slot: "Amplificador", modelo: "Cabeçote e caixa", descricao: "Cabeçote e caixa separados: o timbre não muda quando a casa muda.", busca: ["amplificador", "cubo"] },
      { slot: "Pedal", modelo: "Pedal de efeito", descricao: "O timbre sujo que é seu, não o do amplificador emprestado.", busca: ["pedal"] },
      { slot: "Cabos", modelo: "Três cabos P10", descricao: "Guitarra, pedal e cabeçote, mais o reserva.", busca: ["cabo p10", "cabo"] },
      { slot: "Correia", modelo: "Correia de couro larga", descricao: "Guitarra pesada, hora e meia de show.", busca: ["correia couro", "correia"] },
    ],
    praQuem: {
      titulo: "Pra quem tem hora marcada no palco",
      texto:
        "Quando o show é seu, o backline da casa é uma aposta. Levar o próprio cabeçote é a diferença entre soar como você e soar como o que estava lá.",
    },
    porque: [
      { slot: "Amplificador", titulo: "Cabeçote separado da caixa", texto: "O timbre mora no cabeçote. Levando ele, você soa igual em qualquer casa, mesmo usando a caixa de lá." },
      { slot: "Guitarra", titulo: "Telecaster corta", texto: "O ataque seco da Telecaster acha espaço numa mixagem com teclado, baixo e bateria. Guitarra gorda some." },
      { slot: "Pedal", titulo: "Seu timbre sujo", texto: "Distorção de amplificador emprestado é loteria. O pedal é o timbre que você já sabe como responde." },
    ],
    cenas: ["palco"],
    faq: [
      { p: "Preciso levar a caixa sempre?", r: "Não. Muitas casas têm caixa; levando o cabeçote, o essencial do seu som vai junto." },
      { p: "Dá pra usar em ensaio?", r: "Dá, mas é muito volume pra sala pequena. A maioria usa o Ensaio em casa e este no palco." },
      { p: "Cabe num carro comum?", r: "Cabe, com o banco traseiro rebatido. Cabeçote e caixa se separam pra carregar." },
    ],
  },
];

const KIT_ID_BASE = 90000;

export const CATEGORIA_KIT = "Pronto pra Tocar";
export const TAG_KIT = "Kit";

const brl = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const LABEL_INSTRUMENTO: Record<Instrumento, string> = {
  violao: "Violão",
  guitarra: "Guitarra",
  baixo: "Contrabaixo",
  viola: "Viola",
  ukulele: "Ukulele",
  bateria: "Bateria",
  teclado: "Teclado",
  sopro: "Sopro",
  voz: "Voz",
};

/* O id é posicional (base + índice), então o oculto precisa continuar no
   KIT_SEED e sair só depois do map — filtrar antes andaria com o id de todos
   os kits seguintes e quebraria link já compartilhado. */
export const kitProducts: Product[] = KIT_SEED.map((seed, i) => ({
  id: KIT_ID_BASE + i + 1,
  sku: `KIT-${seed.key.toUpperCase()}`,
  name: `Kit ${seed.name}`,
  price: brl(seed.price),
  priceNum: seed.price,
  oldPrice: seed.oldPrice ? brl(seed.oldPrice) : undefined,
  oldPriceNum: seed.oldPrice,
  rating: seed.rating,
  reviews: seed.reviews,
  category: CATEGORIA_KIT,
  subcategory: LABEL_INSTRUMENTO[seed.instrumento],
  tags: [CATEGORIA_KIT, TAG_KIT, seed.faixa, LABEL_INSTRUMENTO[seed.instrumento]],
  image: `/kits/tall/${seed.key}.png`,
  images: [`/kits/tall/${seed.key}.png`, `/kits/wide/${seed.key}.png`],
  badge: seed.badge,
  brand: "Tonante",
  inStock: true,
  description: seed.description,
  seoSlug: `kit-${seed.key}`,
  specs: seed.pecas.map((p) => ({ label: p.slot, value: p.modelo })),
  features: seed.porque.map((p) => p.titulo),
})).filter((_, i) => !KIT_SEED[i].oculto);

const kitIds = new Set(kitProducts.map((p) => p.id));

export function isKitProduct(p: Pick<Product, "id">): boolean {
  return kitIds.has(p.id);
}

export function getKitSeed(id: number): KitSeed | undefined {
  const i = id - KIT_ID_BASE - 1;
  return i >= 0 && i < KIT_SEED.length ? KIT_SEED[i] : undefined;
}

export function getKitProductId(key: string): number | undefined {
  const i = KIT_SEED.findIndex((s) => s.key === key);
  return i === -1 ? undefined : KIT_ID_BASE + i + 1;
}

export function kitHero(key: string, variante: "tall" | "wide" = "tall"): string {
  return `/kits/${variante}/${key}.png`;
}

/* ——— veredito: o que dá pra tocar com isso ——————————————————————————— */

export type Veredito = "da-conta" | "apertado" | "nao-e-pra-isso";

export interface BandaNoKit {
  band: Band;
  veredito: Veredito;
  /** Frase curta que explica. Aparece no card. */
  porque: string;
}

const ORDEM_CAPTACAO: Captacao[] = ["nenhuma", "passiva", "single", "humbucker"];

/* Corda é eliminatória e o resto é gradiente. Nylon e aço não se substituem:
   quem quer Ramones num violão de nylon não vai conseguir o som, e dizer que
   "dá, mas apertado" seria mentira educada. */
export function avaliarBanda(seed: KitSeed, band: Band): BandaNoKit {
  const { corda, captacao } = seed.entrega;
  const b = band.som;

  const cordaBate = b.corda === "ambos" || corda === "ambos" || b.corda === corda;
  if (!cordaBate) {
    return {
      band,
      veredito: "nao-e-pra-isso",
      porque:
        b.corda === "nylon"
          ? "Pede nylon, e este kit é de aço."
          : "Pede aço, e este kit é de nylon.",
    };
  }

  const temMenos = ORDEM_CAPTACAO.indexOf(captacao) < ORDEM_CAPTACAO.indexOf(b.captacao);
  if (temMenos) {
    return {
      band,
      veredito: "apertado",
      porque:
        b.captacao === "humbucker"
          ? "O som pede captador mais grosso do que este kit entrega."
          : "Dá pra tocar, mas o timbre não chega inteiro.",
    };
  }

  if (b.nivel === "dificil" && seed.faixa === "Entrada") {
    return {
      band,
      veredito: "apertado",
      porque: "O instrumento dá conta. A dificuldade está na mão, não no kit.",
    };
  }

  return { band, veredito: "da-conta", porque: `${band.tag}, exatamente o que este kit faz.` };
}

/** Todas as bandas do universo do instrumento do kit, já avaliadas e ordenadas. */
export function bandasDoKit(seed: KitSeed): BandaNoKit[] {
  const peso: Record<Veredito, number> = { "da-conta": 0, apertado: 1, "nao-e-pra-isso": 2 };
  return BANDS.filter((b) => b.instrumentos.includes(seed.instrumento))
    .map((b) => avaliarBanda(seed, b))
    .sort((a, z) => peso[a.veredito] - peso[z.veredito]);
}
