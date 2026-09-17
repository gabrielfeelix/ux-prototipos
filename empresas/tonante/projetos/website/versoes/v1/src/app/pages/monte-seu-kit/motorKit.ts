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
import { cordaDoProduto, FAIXAS, type Faixa } from "../guia/motor";
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
  faixa?: Faixa;
}

export interface Familia {
  id: Instrumento;
  label: string;
  /** Uma linha sobre o que esse instrumento é, para quem não sabe. */
  hint: string;
  foto: string;
  /** Pasta em public/audio — o hover toca isso. */
  audio: string;
}

export const FAMILIAS: Familia[] = [
  { id: "violao", label: "Violão", hint: "O mais comum, e o que mais perdoa erro", foto: "/categorias/violao.png", audio: "violao-nylon" },
  { id: "guitarra", label: "Guitarra", hint: "Precisa de amplificador pra existir", foto: "/categorias/guitarra.png", audio: "guitarra" },
  { id: "baixo", label: "Contrabaixo", hint: "Quatro cordas graves, o chão da banda", foto: "/categorias/contrabaixo.png", audio: "baixo" },
  { id: "viola", label: "Viola caipira", hint: "Dez cordas, afinação própria, som de raiz", foto: "/categorias/viola.png", audio: "viola" },
  { id: "ukulele", label: "Ukulele", hint: "Pequeno, quatro cordas, aprende rápido", foto: "/categorias/ukulele.png", audio: "ukulele" },
  { id: "bateria", label: "Bateria", hint: "Ocupa espaço e faz barulho. Vale a pena", foto: "/categorias/bateria.png", audio: "bateria" },
  { id: "teclado", label: "Teclado", hint: "A porta de entrada mais fácil pra harmonia", foto: "/categorias/teclado.png", audio: "teclado" },
  { id: "sopro", label: "Sopro", hint: "Sax e flauta: melodia com o fôlego", foto: "/categorias/sopro.png", audio: "flauta" },
];

export const NIVEIS: { id: Nivel; label: string; sub: string }[] = [
  { id: "primeiro", label: "É o meu primeiro", sub: "Nunca toquei, ou toquei muito pouco" },
  { id: "retomando", label: "Tô voltando", sub: "Já toquei e parei; a mão lembra" },
  { id: "toco", label: "Toco faz tempo", sub: "Sei o que quero, quero o instrumento certo" },
];

export const ONDES: { id: Onde; label: string; sub: string }[] = [
  { id: "casa", label: "Em casa", sub: "Sozinho, ou pra quem mora comigo" },
  { id: "igreja", label: "Na igreja", sub: "Ligado na mesa, toda semana" },
  { id: "palco", label: "No palco", sub: "Bar, festa, show" },
  { id: "estudio", label: "Gravando", sub: "Quarto, estúdio, internet" },
];

export const FAIXAS_LABEL: { id: Faixa; label: string }[] = [
  { id: "ate-400", label: "Até R$ 400" },
  { id: "400-600", label: "R$ 400 a 600" },
  { id: "600-900", label: "R$ 600 a 900" },
  { id: "sem-limite", label: "Me mostra o melhor" },
];

/* Qual fatia do catálogo é cada família. Viola e ukulele moram dentro de
   "Violões" e só se distinguem por tag — herança do ERP, não decisão nossa. */
export function produtosDaFamilia(f: Instrumento): Product[] {
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
    /* Teclado e sopro ainda não têm catálogo. A tela continua navegável e o
       resultado assume isso em voz alta em vez de devolver grid vazio. */
    default:
      return [];
  }
}

export interface PerfilKit {
  instrumento: Instrumento;
  som: Som;
  precisaCaptacao: boolean;
  faixa: { min: number; max: number };
  titulo: string;
  porques: string[];
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
  const faixa = FAIXAS[r.faixa ?? "sem-limite"];
  const porques: string[] = [];

  const som = somMedio(bandsSelecionadas) ?? somPadrao(instrumento, nivel, onde);

  if (bandsSelecionadas.length) {
    const nomes = bandsSelecionadas.slice(0, 3).map((b) => b.name);
    const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}` : nomes[0];
    porques.push(
      som.corda === "nylon"
        ? `Você marcou ${lista} — repertório de dedilhado, onde o nylon dá o corpo quente e a mão não sofre.`
        : som.corda === "aco"
          ? `Você marcou ${lista} — repertório de palhetada, que pede o brilho e a projeção da corda de aço.`
          : `Você marcou ${lista} — repertório que vai bem nos dois tipos de corda.`,
    );
    if (som.nivel === "dificil" && nivel === "primeiro") {
      porques.push(
        "Esse repertório é difícil de verdade. O instrumento abaixo dá conta — a curva está na mão, e ela vem com o tempo.",
      );
    }
  }

  const precisaCaptacao = onde !== "casa";
  porques.push(
    onde === "igreja"
      ? "Tocar na igreja é tocar ligado na mesa: sem captação, sobra microfone na frente e sobra microfonia."
      : onde === "palco"
        ? "No palco o instrumento precisa sair na caixa de som. Captação resolve com um cabo."
        : onde === "estudio"
          ? "Gravando, a captação dá a segunda via do som — o microfone e a linha juntos."
          : "Pra tocar em casa, captação é peso e preço que você não usa. Acústico puro soa melhor pelo mesmo dinheiro.",
  );

  if (nivel === "toco") {
    porques.push("Você já toca: a seleção começa pelas linhas de tampo melhor, não pelo mais barato.");
  }

  const titulo =
    instrumento === "violao"
      ? `Violão de ${som.corda === "nylon" ? "nylon" : "aço"}${precisaCaptacao ? " com captação" : ""}`
      : LABEL[instrumento];

  return { instrumento, som, precisaCaptacao, faixa, titulo, porques, bands: bandsSelecionadas };
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
    if (temCaptacao(p) === perfil.precisaCaptacao) pontos += 3;

    const preco = p.priceNum ?? 0;
    if (preco >= perfil.faixa.min && preco <= perfil.faixa.max) pontos += 3;
    else {
      const distancia = preco > perfil.faixa.max ? preco - perfil.faixa.max : perfil.faixa.min - preco;
      pontos -= Math.min(4, distancia / 150);
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

  const faixaAlvo =
    r.faixa === "ate-400" || r.faixa === "400-600"
      ? "Entrada"
      : r.faixa === "600-900"
        ? "Intermediário"
        : "Avançado";

  const perfilAlvo =
    r.onde === "igreja" ? "igreja" : r.nivel === "primeiro" ? "comecando" : "fora-de-casa";

  const candidatos = KIT_SEED.filter(
    (k) => k.perfil === perfilAlvo && k.instrumento === perfil.instrumento,
  );
  if (!candidatos.length) return null;

  const exato = candidatos.find((k) => k.faixa === faixaAlvo);
  const seed = exato ?? candidatos[0];
  const id = getKitProductId(seed.key);
  return id ? { seed, id } : null;
}
