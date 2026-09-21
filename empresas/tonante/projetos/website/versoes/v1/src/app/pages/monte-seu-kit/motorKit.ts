/* motorKit — o motor do guia, esticado para oito famílias e para o gosto.
 *
 * O motor original (pages/guia/motor.ts) continua valendo e é reaproveitado
 * onde dá: FAIXAS e cordaDoProduto são dele. O que muda aqui é o que entra:
 *
 *   antes  instrumento (3) + estilos com peso escalar
 *   agora  família (8) + bandas, cada uma com quatro eixos de `som`
 *
 * A troca importa porque timbre não é um número. No PCYES v3 o `weight` de um
 * jogo é um eixo só e funciona, porque performance é FPS. Aqui Fleet Foxes e
 * Mumford & Sons são os dois folk e pedem violões diferentes — um eixo não
 * separa os dois, quatro separam.
 *
 * Continua sendo PONTUAÇÃO, não filtro: quem não bate desce, ninguém some.
 * Lista vazia no fim de um quiz é a pior tela possível. */

import { allProducts, type Product } from "../../components/productsData";
import { getVisibleCatalogProducts } from "../../components/productPresentation";
import { getProductAttributes } from "../../components/productAttributes";
import { cordaDoProduto } from "../guia/motor";
import { tipoDoProduto } from "../../v2/curadoria";
import {
  somMedio,
  type Band,
  type Captacao,
  type Instrumento,
  type Som,
} from "../../lib/bandLibrary";
import { KIT_SEED, getKitProductId, type KitSeed } from "../../lib/kits";

export type Nivel = "primeiro" | "retomando" | "toco";
export type Onde = "casa" | "igreja" | "palco" | "estudio";

export interface RespostasKit {
  instrumento?: Instrumento;
  bands?: string[];
  nivel?: Nivel;
  onde?: Onde;
  /** Faixas de preço marcadas. Vazio, ou ausente, é "tanto faz". */
  faixas?: FaixaPreco[];
}

export interface Familia {
  id: Instrumento;
  label: string;
  /** Uma linha sobre o que esse instrumento é, para quem não sabe. */
  hint: string;
  foto: string;
  /** Pasta em public/audio — o hover toca isso. Voz não tem amostra. */
  audio?: string;
}

export const FAMILIAS: Familia[] = [
  { id: "violao", label: "Violão", hint: "O mais comum, e o que mais perdoa erro", foto: "/categorias/violao.webp", audio: "violao-nylon" },
  { id: "guitarra", label: "Guitarra", hint: "Precisa de amplificador pra existir", foto: "/categorias/guitarra.webp", audio: "guitarra" },
  { id: "baixo", label: "Contrabaixo", hint: "Quatro cordas graves, o chão da banda", foto: "/categorias/contrabaixo.webp", audio: "baixo" },
  { id: "viola", label: "Viola caipira", hint: "Dez cordas, afinação própria, som de raiz", foto: "/categorias/viola.webp", audio: "viola" },
  { id: "ukulele", label: "Ukulele", hint: "Pequeno, quatro cordas, aprende rápido", foto: "/categorias/ukulele.webp", audio: "ukulele" },
  { id: "bateria", label: "Bateria", hint: "Ocupa espaço e faz barulho. Vale a pena", foto: "/categorias/bateria.webp", audio: "bateria" },
  { id: "teclado", label: "Teclado", hint: "A porta de entrada mais fácil pra harmonia", foto: "/categorias/teclado.webp", audio: "teclado" },
  /* Quem canta é o caso que faltava: o quiz perguntava "que instrumento você
     quer tocar?" e não tinha resposta pra quem já toca com a voz. O montador
     já resolveu isso (família "voz", trilho Microfone › Cabo XLR › Pedestal),
     e aqui a escolha vira microfone em vez de instrumento. Sem amostra de
     áudio: timbre de voz é a do cliente, não a de um arquivo nosso. */
  { id: "voz", label: "Voz", hint: "Canta, com ou sem instrumento na mão", foto: "/categorias/microfone.webp" },
  /* Sopro saiu do quiz: um produto só (a flauta) não sustenta uma família
     inteira de pergunta. Continua existindo como instrumento e em
     bandLibrary, só não abre mais caminho aqui. */
];

export const NIVEIS: { id: Nivel; label: string; sub: string; icone: string }[] = [
  { id: "primeiro", label: "É o meu primeiro", sub: "Nunca toquei, ou toquei muito pouco", icone: "sprout" },
  { id: "retomando", label: "Tô voltando", sub: "Já toquei e parei; a mão lembra", icone: "rotate" },
  { id: "toco", label: "Toco faz tempo", sub: "Sei o que quero, quero o instrumento certo", icone: "flame" },
];

export const ONDES: { id: Onde; label: string; sub: string; icone: string }[] = [
  { id: "casa", label: "Em casa", sub: "Sozinho, ou pra quem mora comigo", icone: "casa" },
  { id: "igreja", label: "Na igreja", sub: "Ligado na mesa, toda semana", icone: "igreja" },
  { id: "palco", label: "No palco", sub: "Bar, festa, show", icone: "palco" },
  { id: "estudio", label: "Gravando", sub: "Quarto, estúdio, internet", icone: "microfone" },
];

/* ——— faixa de preço, tirada do catálogo ——————————————————————————————
 *
 * Faixa escrita à mão mente. "Até R$ 400" num quiz de contrabaixo é pergunta
 * sem resposta: o mais barato da loja custa R$ 609. Bateria é pior — as seis
 * saem pelo mesmo preço, e quatro pílulas fingem uma escolha que não existe.
 * E "me mostra o melhor" não é faixa de preço, é outra pergunta enfiada na
 * mesma linha.
 *
 * Então a faixa nasce do catálogo da família escolhida: corta nos vãos reais
 * de preço (que é onde as linhas de produto trocam de patamar), arredonda o
 * corte pra um número que se fala em voz alta, e mostra quantos modelos caem
 * em cada uma. Onde não há vão, não há pergunta. */

export interface FaixaPreco {
  id: string;
  min: number;
  /** Infinity na última faixa. */
  max: number;
  label: string;
  /** Quantos modelos em estoque caem aqui. Vai impresso na pílula. */
  modelos: number;
}

const emReais = (v: number) => Math.round(v).toLocaleString("pt-BR");
const precoCurto = (v: number) => `R$ ${emReais(v)}`;

/* O primeiro número redondo dentro do vão (a, b]. Mais graúdo primeiro: entre
   699,90 e 1499,90 o corte é 1000, não 700. */
function corteRedondo(a: number, b: number): number {
  for (const passo of [1000, 500, 250, 200, 100, 50, 25, 10, 5]) {
    const v = Math.ceil((a + 0.01) / passo) * passo;
    if (v > a && v <= b) return v;
  }
  return Math.ceil(b);
}

function precosDaFamilia(f: Instrumento): number[] {
  return produtosDaFamilia(f)
    .filter((p) => p.inStock !== false && (p.priceNum ?? 0) > 0)
    .map((p) => p.priceNum)
    .sort((a, b) => a - b);
}

export function faixasDaFamilia(f: Instrumento): FaixaPreco[] {
  const precos = precosDaFamilia(f);
  const n = precos.length;
  /* Pouca coisa, ou tudo custando quase a mesma coisa: perguntar preço aqui só
     inventa uma escolha. A tela mostra a régua e segue. */
  if (n < 6 || precos[n - 1] / precos[0] < 1.8) return [];

  const quantosCortes = n >= 24 ? 3 : n >= 10 ? 2 : 1;
  /* Faixa com um ou dois modelos é armadilha: a pessoa marca e recebe uma
     vitrine que cabe numa linha. Toda faixa precisa sustentar uma lista. */
  const minimoPorFaixa = Math.max(3, Math.floor(n * 0.12));

  const vaos: { i: number; razao: number }[] = [];
  for (let i = 0; i < n - 1; i++) {
    if (precos[i + 1] > precos[i]) vaos.push({ i, razao: precos[i + 1] / precos[i] });
  }
  vaos.sort((a, b) => b.razao - a.razao);

  const cortesEm: number[] = [];
  for (const vao of vaos) {
    if (cortesEm.length === quantosCortes) break;
    const proposta = [...cortesEm, vao.i].sort((a, b) => a - b);
    const tamanhos = proposta.map((idx, k) => idx - (k ? proposta[k - 1] : -1));
    tamanhos.push(n - 1 - proposta[proposta.length - 1]);
    if (tamanhos.every((t) => t >= minimoPorFaixa)) cortesEm.push(vao.i);
    cortesEm.sort((a, b) => a - b);
  }
  if (!cortesEm.length) return [];

  const faixas: FaixaPreco[] = [];
  let inicio = 0;
  for (const i of cortesEm) {
    const corte = corteRedondo(precos[i], precos[i + 1]);
    if (corte <= inicio) continue;
    faixas.push({
      id: `ate-${corte}`,
      min: inicio,
      max: corte,
      label: inicio === 0 ? `Até ${precoCurto(corte)}` : `${precoCurto(inicio)} a ${emReais(corte)}`,
      modelos: precos.filter((v) => v >= inicio && v < corte).length,
    });
    inicio = corte;
  }
  faixas.push({
    id: `de-${inicio}`,
    min: inicio,
    max: Infinity,
    label: `${precoCurto(inicio)} ou mais`,
    modelos: precos.filter((v) => v >= inicio).length,
  });
  return faixas;
}

/* Qual fatia do catálogo é cada família. Viola e ukulele moram dentro de
   "Violões" e só se distinguem por tag — herança do ERP, não decisão nossa. */
export function produtosDaFamilia(f: Instrumento): Product[] {
  /* Acessório não é resposta pra "qual instrumento é o meu". Sem esse corte, o
     abafador de R$ 21 e o cabo de R$ 48 entram na conta e sujam as duas coisas
     que saem daqui: a recomendação e a faixa de preço. */
  return universoDaFamilia(f).filter((p) => f === "voz" || tipoDoProduto(p) === "instrumento");
}

function universoDaFamilia(f: Instrumento): Product[] {
  const visiveis = getVisibleCatalogProducts(allProducts);
  const semTag = (p: Product, t: string) => !p.tags.includes(t);

  switch (f) {
    case "violao":
      return visiveis.filter(
        (p) => p.category === "Violões" && semTag(p, "Viola Caipira") && semTag(p, "Ukulele"),
      );
    case "guitarra":
      return visiveis.filter((p) => p.category === "Guitarras");
    case "baixo":
      return visiveis.filter((p) => p.category === "Contrabaixos");
    case "bateria":
      return visiveis.filter((p) => p.category === "Baterias");
    case "viola":
      return visiveis.filter((p) => p.tags.includes("Viola Caipira"));
    case "ukulele":
      return visiveis.filter((p) => p.tags.includes("Ukulele"));
    case "teclado": {
      /* Suporte, banqueta e capa citam "teclado" no nome mas não são o
         instrumento; tipoDoProduto já resolve isso (caem como "suporte").
         Some ainda o filtro por nome pra não pegar acessório nenhum que por
         acaso comece com a palavra. */
      const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      return visiveis.filter((p) => {
        const nome = semAcento(p.name);
        return tipoDoProduto(p) === "instrumento" && (nome.startsWith("teclado") || nome.startsWith("piano"));
      });
    }
    case "voz":
      /* Pra quem canta, o "instrumento" é o microfone. Plug e adaptador não
         entram: são peça de bancada, não o que se leva pro palco. */
      return visiveis.filter((p) => tipoDoProduto(p) === "microfone");
    default:
      return [];
  }
}

/* O porquê deixou de ser string solta. Uma lista de frases é um bloco de
   texto que ninguém lê depois de responder quatro telas; cada motivo tem uma
   cara (as capas que a pessoa marcou, o ícone do lugar onde ela toca, a
   etiqueta de preço) e é isso que faz o resultado parecer resposta, não
   relatório. `bands` preenchido manda a página desenhar as capas no lugar do
   ícone. */
export interface Porque {
  /** Chave do mapa de ícones da página. */
  icone: string;
  texto: string;
  bands?: Band[];
}

export interface PerfilKit {
  instrumento: Instrumento;
  som: Som;
  precisaCaptacao: boolean;
  faixas: FaixaPreco[];
  titulo: string;
  porques: Porque[];
  /** As bandas que o cliente marcou, na ordem de clique. */
  bands: Band[];
}

const LABEL: Record<Instrumento, string> = Object.fromEntries(
  FAMILIAS.map((f) => [f.id, f.label]),
) as Record<Instrumento, string>;

/* Sem banda marcada, o perfil ainda precisa existir. O default sai do nível e
   do lugar, que é exatamente o que o guia antigo fazia — o gosto é tempero,
   não pré-requisito. */
function somPadrao(instrumento: Instrumento, nivel: Nivel, onde: Onde): Som {
  const captacao: Captacao = onde === "casa" ? "nenhuma" : "passiva";
  if (instrumento === "guitarra") return { corda: "aco", captacao: "single", nivel: "medio", ataque: "brilhante" };
  if (instrumento === "baixo") return { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "suave" };
  /* Microfone não tem corda nem captação: o eixo que sobra é o ataque, e ele
     sai do lugar onde a pessoa canta. */
  if (instrumento === "voz")
    return { corda: "aco", captacao: "nenhuma", nivel: "medio", ataque: onde === "casa" ? "suave" : "brilhante" };
  return {
    corda: nivel === "primeiro" ? "nylon" : "aco",
    captacao,
    nivel: nivel === "toco" ? "dificil" : "facil",
    ataque: "suave",
  };
}

export function montarPerfilKit(r: RespostasKit, bandsSelecionadas: Band[]): PerfilKit {
  const instrumento = r.instrumento ?? "violao";
  const nivel = r.nivel ?? "primeiro";
  const onde = r.onde ?? "casa";
  const faixas = r.faixas ?? [];
  const porques: Porque[] = [];

  const som = somMedio(bandsSelecionadas) ?? somPadrao(instrumento, nivel, onde);

  const canta = instrumento === "voz";

  if (bandsSelecionadas.length) {
    const nomes = bandsSelecionadas.slice(0, 3).map((b) => b.name);
    const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}` : nomes[0];
    porques.push({
      icone: "bandas",
      bands: bandsSelecionadas,
      texto: canta
        ? `Você marcou ${lista}. O microfone abaixo aguenta esse repertório sem devolver sopro nem chiado.`
        : som.corda === "nylon"
        ? `Você marcou ${lista}. É repertório de dedilhado, onde o nylon dá o corpo quente e a mão não sofre.`
        : som.corda === "aco"
          ? `Você marcou ${lista}. É repertório de palhetada, que pede o brilho e a projeção da corda de aço.`
          : `Você marcou ${lista}. É repertório que vai bem nos dois tipos de corda.`,
    });
    if (som.nivel === "dificil" && nivel === "primeiro") {
      porques.push({
        icone: "curva",
        texto:
          "Esse repertório é difícil de verdade. O instrumento abaixo dá conta: a curva está na mão, e ela vem com o tempo.",
      });
    }
  }

  const precisaCaptacao = onde !== "casa";
  porques.push({
    icone: onde === "igreja" ? "igreja" : onde === "palco" ? "palco" : onde === "estudio" ? "microfone" : "casa",
    texto: canta
      ? onde === "casa"
        ? "Cantando em casa, o microfone é pra ensaiar e gravar. Um modelo de mão já resolve, e o cabo entra no kit."
        : "Cantando fora de casa, o microfone é o seu instrumento: ele precisa chegar na mesa de som, por cabo XLR ou por receptor."
      : onde === "igreja"
      ? "Tocar na igreja é tocar ligado na mesa: sem captação, sobra microfone na frente e sobra microfonia."
      : onde === "palco"
        ? "No palco o instrumento precisa sair na caixa de som. Captação resolve com um cabo."
        : onde === "estudio"
          ? "Gravando, a captação dá a segunda via do som: o microfone e a linha juntos."
          : "Pra tocar em casa, captação é peso e preço que você não usa. Acústico puro soa melhor pelo mesmo dinheiro.",
  });

  if (nivel === "toco") {
    porques.push({
      icone: "flame",
      texto: "Você já toca: a seleção começa pelas linhas de tampo melhor, não pelo mais barato.",
    });
  }

  if (faixas.length) {
    /* O rótulo entra como está escrito na pílula, com o "R$" maiúsculo. */
    const rotulos = faixas.map((f) => f.label);
    const marcadas =
      rotulos.length > 1 ? `${rotulos.slice(0, -1).join(", ")} e ${rotulos.at(-1)}` : rotulos[0];
    porques.push({
      icone: "preco",
      texto: `Você marcou ${marcadas}. A lista começa por aí, e quando o instrumento certo está um degrau acima ele aparece junto, com o porquê.`,
    });
  }

  const titulo =
    canta
      ? "Microfone pra cantar"
      : instrumento === "violao"
      ? `Violão de ${som.corda === "nylon" ? "nylon" : "aço"}${precisaCaptacao ? " com captação" : ""}`
      : LABEL[instrumento];

  return { instrumento, som, precisaCaptacao, faixas, titulo, porques, bands: bandsSelecionadas };
}

function temCaptacao(p: Product): boolean {
  const attrs = getProductAttributes(p);
  return attrs.tipo === "Eletroacústico" || /el[eé]trico|eletro|\bc?eq\b/i.test(p.name);
}

/* Uma linha aparece uma vez. Sem colapsar, o resultado devolve o mesmo violão
   em três cores e parece que o guia só sabe uma resposta. */
function colapsar(produtos: Product[]): Product[] {
  const vistos = new Set<string>();
  return produtos.filter((p) => {
    const chave = p.name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s*[-–]\s*[^-–]+$/, "")
      .trim();
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

export function recomendarKit(perfil: PerfilKit, limite = 6): Product[] {
  const universo = produtosDaFamilia(perfil.instrumento);
  if (!universo.length) return [];

  const cordaAlvo = perfil.som.corda === "nylon" ? "Nylon" : perfil.som.corda === "aco" ? "Aço" : null;

  const pontuado = universo.map((p) => {
    let pontos = 0;

    /* Corda só é critério onde ela varia. Bateria e teclado não têm corda, e
       pontuar isso ali seria ruído com cara de precisão. */
    if (cordaAlvo && (perfil.instrumento === "violao" || perfil.instrumento === "viola")) {
      if (cordaDoProduto(p) === cordaAlvo) pontos += 4;
    }
    /* Captação é eixo de instrumento. Microfone não tem, e pontuar por isso
       premiava o que tivesse "eletro" no nome, que ali não quer dizer nada. */
    if (perfil.instrumento !== "voz" && temCaptacao(p) === perfil.precisaCaptacao) pontos += 3;

    /* Sem faixa marcada, preço não pontua: quem não disse quanto quer gastar
       não deve ser empurrado nem pro mais barato nem pro mais caro. */
    const preco = p.priceNum ?? 0;
    if (perfil.faixas.length) {
      if (perfil.faixas.some((f) => preco >= f.min && preco < f.max)) pontos += 3;
      else {
        const distancia = Math.min(
          ...perfil.faixas.map((f) => (preco >= f.max ? preco - f.max : f.min - preco)),
        );
        pontos -= Math.min(4, distancia / 150);
      }
    }

    if (p.inStock !== false) pontos += 1;
    pontos += (p.rating ?? 0) / 5;

    return { p, pontos };
  });

  return colapsar(
    pontuado
      .sort((a, b) => b.pontos - a.pontos || (a.p.priceNum ?? 0) - (b.p.priceNum ?? 0))
      .map((x) => x.p),
  ).slice(0, limite);
}

/* O kit vence o instrumento solto quando o cliente disse que toca fora de casa:
   ali o problema nunca é só o instrumento, é o cabo que falta e o amplificador
   que não veio. Em casa, kit é peso e preço que ele não usa. */
export function kitSugerido(perfil: PerfilKit, r: RespostasKit): { seed: KitSeed; id: number } | null {
  if (!r.onde || r.onde === "casa") return null;

  /* O teto do que a pessoa marcou decide o kit. Sem marcação, quem decide é o
     nível: começar do zero não pede kit avançado. */
  const teto = r.faixas?.length
    ? Math.max(...r.faixas.map((f) => (f.max === Infinity ? f.min * 2 : f.max)))
    : null;
  const faixaAlvo =
    teto === null
      ? r.nivel === "primeiro"
        ? "Entrada"
        : r.nivel === "retomando"
          ? "Intermediário"
          : "Avançado"
      : teto <= 600
        ? "Entrada"
        : teto <= 1000
          ? "Intermediário"
          : "Avançado";

  const perfilAlvo =
    r.onde === "igreja" ? "igreja" : r.nivel === "primeiro" ? "comecando" : "fora-de-casa";

  const candidatos = KIT_SEED.filter(
    (k) => !k.oculto && k.perfil === perfilAlvo && k.instrumento === perfil.instrumento,
  );
  if (!candidatos.length) return null;

  const exato = candidatos.find((k) => k.faixa === faixaAlvo);
  const seed = exato ?? candidatos[0];
  const id = getKitProductId(seed.key);
  return id ? { seed, id } : null;
}
