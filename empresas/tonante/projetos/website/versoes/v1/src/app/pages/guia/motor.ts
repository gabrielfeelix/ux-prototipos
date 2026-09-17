/* Motor do Guia do Instrumento — puro, sem React.
 *
 * Portado do quiz do "Monte seu PC" (PCYES v3): mesma mecânica de perguntas
 * encadeadas com pontuação no fim, outro domínio. Lá a pergunta era o jogo e a
 * resposta era a GPU; aqui a pergunta é o repertório e a resposta é a corda.
 *
 * A recomendação é explicável de propósito: cada resposta vira um ponto que o
 * resultado consegue citar de volta ("você marcou bossa, por isso nylon"). Quiz
 * que não sabe dizer por que recomendou é horóscopo. */

import { allProducts, type Product } from "../../components/productsData";
import { getProductAttributes } from "../../components/productAttributes";
import { getVisibleCatalogProducts } from "../../components/productPresentation";
import { getVariantInfo } from "../../components/productVariants";

export type Instrumento = "violao" | "guitarra" | "baixo";
export type Nivel = "primeiro" | "retomando" | "toco";
export type Onde = "casa" | "igreja" | "palco" | "estudio";
export type Faixa = "ate-400" | "400-600" | "600-900" | "sem-limite";
export type Corda = "Nylon" | "Aço";

export interface Respostas {
  instrumento?: Instrumento;
  nivel?: Nivel;
  estilos?: string[];
  onde?: Onde;
  faixa?: Faixa;
}

export interface Estilo {
  id: string;
  label: string;
  /* Puxa pra nylon (negativo) ou pro aço (positivo). O peso é o quanto o
     repertório manda no instrumento: choro é nylon quase por definição, gospel
     é aço por causa do PA da igreja, MPB dá pros dois. */
  peso: number;
  hint: string;
}

export const ESTILOS: Estilo[] = [
  { id: "sertanejo", label: "Sertanejo", peso: 2, hint: "Aço, voz e violão" },
  { id: "gospel", label: "Gospel / louvor", peso: 2, hint: "Igreja e PA" },
  { id: "rock", label: "Rock / pop", peso: 2, hint: "Palhetada firme" },
  { id: "samba", label: "Samba / pagode", peso: 1, hint: "Levada e ritmo" },
  { id: "mpb", label: "MPB / bossa", peso: -1, hint: "Dedilhado e harmonia" },
  { id: "classico", label: "Clássico / erudito", peso: -3, hint: "Nylon, partitura" },
  { id: "blues", label: "Blues / jazz", peso: 1, hint: "Improviso" },
  { id: "worship-fingerstyle", label: "Fingerstyle", peso: 0, hint: "Dedo, sem palheta" },
];

export const FAIXAS: Record<Faixa, { min: number; max: number }> = {
  "ate-400": { min: 0, max: 400 },
  "400-600": { min: 400, max: 600 },
  "600-900": { min: 600, max: 900 },
  "sem-limite": { min: 0, max: Infinity },
};

const CATEGORIA: Record<Instrumento, string> = {
  violao: "Violões",
  guitarra: "Guitarras",
  baixo: "Contrabaixos",
};

/* O catálogo chama de "Elétrico" o violão com captação — jargão da casa, herdado
   do ERP. Fora do violão a palavra quer dizer outra coisa, então a leitura de
   captação mora aqui e não no parser de atributos. */
function temCaptacao(p: Product): boolean {
  const attrs = getProductAttributes(p);
  return attrs.tipo === "Eletroacústico" || /el[eé]trico|eletro|\bc?eq\b/i.test(p.name);
}

/* Nome nem sempre diz a corda: "Violão Elétrico Coral 41" é aço e não escreve
   isso em lugar nenhum. Clássico é nylon por definição; o resto do violão na
   Tonante é aço. */
export function cordaDoProduto(p: Product): Corda {
  const attrs = getProductAttributes(p);
  if (attrs.corda === "Nylon" || attrs.corda === "Aço") return attrs.corda;
  return attrs.tipo === "Clássico" || /cl[aá]ssico|nylon/i.test(p.name) ? "Nylon" : "Aço";
}

export interface Perfil {
  instrumento: Instrumento;
  /** Só faz sentido no violão — guitarra e baixo não escolhem corda aqui. */
  corda?: Corda;
  precisaCaptacao: boolean;
  faixa: { min: number; max: number };
  titulo: string;
  /** Uma frase por resposta que pesou. É o "porquê" que o resultado mostra. */
  porques: string[];
}

export function montarPerfil(r: Respostas): Perfil {
  const instrumento = r.instrumento ?? "violao";
  const estilos = r.estilos ?? [];
  const onde = r.onde ?? "casa";
  const faixa = FAIXAS[r.faixa ?? "sem-limite"];
  const porques: string[] = [];

  /* Soma dos pesos do repertório. Quem não marcou nada fica em zero e cai na
     regra do nível, que é o desempate mais honesto: mão iniciante sofre menos
     no nylon. */
  const soma = estilos.reduce((acc, id) => acc + (ESTILOS.find((e) => e.id === id)?.peso ?? 0), 0);
  let corda: Corda | undefined;
  if (instrumento === "violao") {
    if (soma > 0) corda = "Aço";
    else if (soma < 0) corda = "Nylon";
    else corda = r.nivel === "primeiro" ? "Nylon" : "Aço";

    const marcados = estilos
      .map((id) => ESTILOS.find((e) => e.id === id))
      .filter((e): e is Estilo => !!e && Math.sign(e.peso) === (corda === "Aço" ? 1 : -1))
      .map((e) => e.label);

    if (marcados.length) {
      porques.push(
        corda === "Aço"
          ? `Você marcou ${marcados.join(" e ")} — repertório de palhetada, que pede corda de aço e o brilho que ela dá.`
          : `Você marcou ${marcados.join(" e ")} — repertório de dedilhado, onde o nylon entrega o corpo quente e a mão não sofre.`,
      );
    } else if (r.nivel === "primeiro") {
      porques.push("É seu primeiro violão: nylon machuca menos o dedo nas primeiras semanas, que é quando a maioria desiste.");
    } else {
      porques.push("Sem estilo marcado, o aço é o mais versátil: atende do sertanejo ao pop sem soar fora de lugar.");
    }
  }

  const precisaCaptacao = onde !== "casa";
  if (precisaCaptacao) {
    porques.push(
      onde === "igreja"
        ? "Tocar na igreja é tocar ligado na mesa: sem captação, sobra microfone na frente e sobra microfonia."
        : onde === "palco"
          ? "No palco o instrumento precisa sair na caixa de som. Eletroacústico resolve com um cabo."
          : "Em estúdio a captação dá a segunda via do som — grava o microfone e a linha juntos.",
    );
  } else {
    porques.push("Pra tocar em casa, captação é peso e preço que você não usa. Acústico puro soa melhor pelo mesmo dinheiro.");
  }

  if (r.nivel === "toco") porques.push("Você já toca: a seleção começa pelas linhas de tampo melhor, não pelo mais barato.");
  if (r.faixa && r.faixa !== "sem-limite") {
    porques.push(`Dentro do que você quer investir — os modelos abaixo respeitam a faixa, sem empurrar o degrau de cima.`);
  }

  const titulo =
    instrumento === "violao"
      ? `Violão de ${corda === "Nylon" ? "nylon" : "aço"}${precisaCaptacao ? " com captação" : ""}`
      : instrumento === "guitarra"
        ? "Guitarra elétrica"
        : "Contrabaixo";

  return { instrumento, corda, precisaCaptacao, faixa, titulo, porques };
}

/* Uma linha aparece uma vez. O mesmo Lorenzzo em sunburst, natural e preto são
   três SKUs da mesma família, e o card já traz as cores em miniatura — sem
   colapsar, a vitrine do resultado devolvia o mesmo violão três vezes e parecia
   que o guia só sabia uma resposta. */
const CORES = new Set([
  "natural", "brown", "preto", "preta", "black", "branco", "branca", "white",
  "sunburst", "sunset", "azul", "blue", "vermelho", "vermelha", "red", "verde",
  "wine", "merlot", "tabaco", "mel", "marrom", "cinza", "prata", "dourado",
  "rosa", "roxo", "laranja", "creme", "ambar", "cherry", "fosco", "satin", "ton",
]);

function chaveDeFamilia(p: Product): string {
  const info = getVariantInfo(p.sku);
  if (info?.family) return info.family;

  /* Sem tabela de variantes, a família sai do nome. Dois lixos atrapalham: a
     cor no fim ("… - Sunburst") e o código de SKU embutido ("TN39NCE",
     "VTL1954SB"), que muda a cada acabamento. A cor sai pela lista; o código
     vira só os dígitos dele, porque é ali que mora o tamanho — TN39 e TN41 são
     modelos diferentes e não podem cair na mesma família. */
  return p.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[\s\-–]+/)
    .map((t) => t.replace(/["'.,]/g, ""))
    .filter(Boolean)
    .map((t) => (/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/.test(t) ? (t.match(/\d+/)?.[0] ?? "") : t))
    .filter((t) => t && !CORES.has(t))
    .join(" ");
}

function colapsarFamilias(produtos: Product[]): Product[] {
  const vistos = new Set<string>();
  return produtos.filter((p) => {
    const familia = chaveDeFamilia(p);
    if (vistos.has(familia)) return false;
    vistos.add(familia);
    return true;
  });
}

/* Pontuação, não filtro: filtro devolve lista vazia quando o catálogo não tem o
   cruzamento exato, e lista vazia no fim de um quiz é a pior tela possível. Aqui
   o que não bate só desce. */
export function recomendar(perfil: Perfil, limite = 6): Product[] {
  const daCategoria = getVisibleCatalogProducts(allProducts).filter(
    (p) => p.category === CATEGORIA[perfil.instrumento],
  );

  const pontuado = daCategoria.map((p) => {
    let pontos = 0;
    if (perfil.corda && cordaDoProduto(p) === perfil.corda) pontos += 4;
    if (temCaptacao(p) === perfil.precisaCaptacao) pontos += 3;

    const preco = p.priceNum ?? 0;
    if (preco >= perfil.faixa.min && preco <= perfil.faixa.max) pontos += 3;
    else {
      /* Fora da faixa desce proporcional à distância: quem estourou por R$ 50
         ainda merece aparecer no fim, quem estourou por R$ 400 não. */
      const distancia = preco > perfil.faixa.max ? preco - perfil.faixa.max : perfil.faixa.min - preco;
      pontos -= Math.min(4, distancia / 150);
    }

    if (p.inStock !== false) pontos += 1;
    pontos += (p.rating ?? 0) / 5;

    return { p, pontos };
  });

  /* Desempate por preço crescente: entre dois igualmente certos, o mais barato
     é o que respeita quem perguntou quanto custa. */
  const ordenado = pontuado
    .sort((a, b) => b.pontos - a.pontos || (a.p.priceNum ?? 0) - (b.p.priceNum ?? 0))
    .map((x) => x.p);

  return colapsarFamilias(ordenado).slice(0, limite);
}
