import type { Product } from "./productsData";
import { getProductAttributes, type ProductAttributes } from "./productAttributes";
import { getProductImages } from "./productPresentation";
import { getPapelDaFoto } from "./photoRoles";

/* productStory — a descrição da PDP, montada produto a produto.
 *
 * O problema que isto resolve: a descrição era um template fixo com três
 * blocos de texto iguais em todos os 315 produtos e sempre as três PRIMEIRAS
 * fotos da galeria — que são justamente os planos abertos de estúdio, o
 * instrumento inteiro, pequeno e longe. As fotos boas (macro do cavalete, do
 * EQ, da junta do braço, e as ambientadas do site institucional) ficavam no
 * fim do array e nunca apareciam.
 *
 * Aqui a foto é escolhida pelo PAPEL (photoRoles.ts, medido offline) e o texto
 * sai dos atributos reais do produto (productAttributes + specs do catálogo).
 * Nada de claim que o dado não sustenta: se não sabemos o tampo, o bloco de
 * madeira não existe.
 *
 * Irmãos que valem o mesmo tanto e não sobrepõem: photoBackdrop (fundo branco
 * ou ambientada, pra decidir contain/cover) e photoRoles (pra que serve a foto).
 */

export type FormatoDeBloco = "cena" | "detalhe";

/* Que foto casa com cada bloco de texto. A sessão de estúdio da Tonante numera
   os macros na mesma ordem em toda linha: os primeiros são tampo, boca e
   cavalete; os últimos são o painel do EQ e a saída do cabo. Então o bloco de
   eletrônica pede o macro de MAIOR número e o de madeira, o de menor — sem
   precisar reconhecer o que está na foto. */
type PreferenciaDeFoto = "cena" | "macroInicial" | "macroFinal";

interface TextoDeBloco {
  titulo: string;
  texto: string;
  prefere: PreferenciaDeFoto;
}

export interface BlocoEditorial {
  id: string;
  titulo: string;
  texto: string;
  foto?: string;
  formato: FormatoDeBloco;
}

export interface HistoriaDoProduto {
  /** parágrafo de abertura, abaixo do "Sobre o produto" */
  abertura: string;
  /** 3 a 4 chips curtos com o que importa de cara */
  destaques: { label: string; value: string }[];
  /** blocos com foto — cena (ambientada, preenche) ou detalhe (macro) */
  blocos: BlocoEditorial[];
  /** macros pra grade "de perto" */
  detalhes: string[];
  /** planos abertos pra tira "de todos os ângulos" */
  angulos: string[];
  /** panorâmica do site institucional, quando existe */
  faixa?: string;
  /** ficha técnica consolidada (specs do catálogo + atributos derivados) */
  ficha: { label: string; value: string }[];
  /** legenda da grade de detalhes — some quando não há grade */
  legendaDetalhes?: string;
}

/* ─────────────────────────────────────────────────────────
   Vocabulário
   ───────────────────────────────────────────────────────── */

/** O que cada madeira faz com o som. Frase curta, sem adjetivo solto. */
const TIMBRE_DA_MADEIRA: Record<string, string> = {
  Spruce: "o spruce é a madeira que mais projeta: ataque rápido e agudo aberto, do tipo que atravessa uma roda de violão",
  Mahogany: "o mogno puxa pros médios — timbre quente e redondo, que acompanha voz sem brigar com ela",
  Zebrawood: "o zebrano tem veio listrado que ninguém confunde e resposta seca, boa pra dedilhado",
  Walnut: "a nogueira fica no meio do caminho: o brilho do spruce com o corpo do mogno",
  Sapele: "o sapele é primo do mogno, com um brilho a mais nos agudos",
  Basswood: "o basswood é leve e equilibrado, sem pico de frequência pra atrapalhar",
  Cedro: "o cedro responde rápido no dedo, com médios doces e ataque macio",
  Dao: "o dao tem veio marcante e resposta equilibrada de ponta a ponta",
  KOA: "o koa começa brilhante e vai encorpando conforme o instrumento é tocado",
  Maple: "o maple é firme e definido, com sustain longo",
};

/** Como o corpo muda o resultado. */
const CORPO_POR_TAMANHO: Record<string, string> = {
  "41": "corpo 41\", o tamanho cheio — é dele que sai o grave",
  "40": "corpo 40\", um palmo menor que o folk tradicional e mais confortável sentado",
  "39": "corpo 39\" clássico, de braço largo e postura tradicional",
  "38": "corpo 38\", enxuto de segurar",
  "36": "corpo 36\", mini de verdade: cabe no banco de trás e no colo de quem tem mão pequena",
  "34": "corpo 34\", formato baby — leva na mochila",
  "30": "corpo 30\", feito pra mão de criança",
};

const ACABAMENTOS: Record<string, string> = {
  fosco: "acabamento fosco, que não marca digital",
  gloss: "acabamento gloss, brilhante e espelhado",
  satin: "acabamento satin, entre o fosco e o brilho",
};

/** Cores publicadas no catálogo — usadas na copy e na ficha. */
const CORES = [
  "Clear Natural", "Dark Spruce", "Dark Wood", "Blue Wood", "Nude Wood",
  "Snow White", "Polar White", "Olympic White", "Deep Dark", "Lipstick Red",
  "Blue Ocean", "Cobalt Blue", "Red Sunset", "Yellow Cake", "Black Sparkle",
  "Grey Sparkle", "Blue Sparkle", "Wine Sparkle", "Coffee Sparkle", "Red Apple",
  "Satin Black", "Metallic Blue", "Red Berry", "Sunburst", "Sunset", "Sangria",
  "Merlot", "Tobacco", "Vanilla", "Azure", "Natural", "Brown", "Preto", "Branco",
];

/* ─────────────────────────────────────────────────────────
   Utilitários
   ───────────────────────────────────────────────────────── */

/** Escolha estável por produto: irmãos de linha não repetem a mesma frase. */
function variante<T>(opcoes: T[], p: Product): T {
  return opcoes[p.id % opcoes.length];
}

function detectaCor(nome: string): string | undefined {
  return CORES.find((c) => new RegExp(`\\b${c}\\b`, "i").test(nome));
}

/* Cor que deixa o veio aparecer (verniz translúcido) versus cor sólida, que
   cobre a madeira. Muda a frase do acabamento: não dá pra elogiar o veio de
   uma guitarra Snow White. */
const CORES_TRANSLUCIDAS = [
  "Natural", "Clear Natural", "Dark Wood", "Blue Wood", "Nude Wood", "Dark Spruce",
  "Sunburst", "Sunset", "Red Sunset", "Tobacco", "Brown", "Sangria", "Merlot", "Mahogany",
];

function corTranslucida(cor?: string): boolean {
  if (!cor) return true;
  return CORES_TRANSLUCIDAS.some((c) => c.toLowerCase() === cor.toLowerCase());
}

function detectaAcabamento(nome: string): string | undefined {
  const m = /\b(fosco|gloss|satin)\b/i.exec(nome);
  return m ? m[1].toLowerCase() : undefined;
}

function ehTonante(p: Product): boolean {
  return (p.brand ?? "").toLowerCase() === "tonante";
}

function ehUkulele(p: Product): boolean {
  return /ukulele/i.test(p.name);
}

function ehInfantil(p: Product): boolean {
  return /infantil|\b3\/4\b|\b1\/2\b|\b1\/4\b/i.test(p.name);
}

/** "O Coral 41\"" / "A Valentine's" — como o texto chama o produto. */
function apelido(p: Product, a: ProductAttributes): string {
  const feminino = /guitarra|bateria|viola\b/i.test(p.name);
  const artigo = feminino ? "A" : "O";
  if (a.linha) {
    const tamanho = a.tamanho && !ehUkulele(p) ? ` ${a.tamanho}` : "";
    return `${artigo} ${a.linha}${tamanho}`;
  }
  if (ehUkulele(p)) return "Este ukulele";
  const generico: Record<string, string> = {
    "Violões": "Este violão",
    "Guitarras": "Esta guitarra",
    "Contrabaixos": "Este contrabaixo",
    "Baterias": "Esta bateria",
  };
  return generico[p.category] ?? `${artigo === "A" ? "Esta" : "Este"} ${p.category.toLowerCase()}`;
}

function juntaFrases(partes: (string | undefined)[]): string {
  const limpas = partes.filter(Boolean) as string[];
  return limpas.join(" ");
}

/** Lista em português: "a, b e c". */
function lista(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? "";
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/* ─────────────────────────────────────────────────────────
   Abertura — o parágrafo que substitui a primeira linha da description
   ───────────────────────────────────────────────────────── */

function aberturaViolao(p: Product, a: ProductAttributes): string {
  const nome = apelido(p, a);
  const corda = a.corda ?? (/nylon/i.test(p.name) ? "Nylon" : undefined);
  const tampo = a.tampo ? TIMBRE_DA_MADEIRA[a.tampo] : undefined;
  const corpo = a.tamanho ? CORPO_POR_TAMANHO[a.tamanho.replace(/"/g, "")] : undefined;

  if (ehUkulele(p)) {
    const porte = /concert/i.test(p.name) ? "concert, um pouco maior e mais grave que o soprano" : "soprano, o tamanho clássico do ukulele";
    return juntaFrases([
      `${nome} é ${porte}.`,
      tampo ? `No tampo, ${tampo}.` : undefined,
      "Quatro cordas de nylon, afinação GCEA e nenhuma desculpa pra não começar hoje.",
    ]);
  }

  if (ehInfantil(p)) {
    return juntaFrases([
      `${nome} é um violão de tamanho reduzido, feito pra mão que ainda está crescendo.`,
      corda === "Nylon" ? "Corda de nylon, que é macia e não machuca a ponta do dedo na primeira semana." : undefined,
      corpo ? `É ${corpo}.` : undefined,
      "Muita gente aqui começou exatamente assim.",
    ]);
  }

  /* eletroacústico aparece de duas formas no catálogo: "EQ 3 Bandas" nos
     nossos, e só "CEQ" no código do modelo de terceiros — o parser resolve os
     dois em a.tipo, então a abertura olha para ele, não só para a.eq */
  const plugavel = Boolean(a.eq) || a.tipo === "Eletroacústico";
  const papel = plugavel
    ? variante([
        "é pra quem toca pra fora de casa",
        "sai da sala e vai pro palco sem trocar de instrumento",
        "é feito pra ser ligado",
      ], p)
    : variante([
        "é de sala, de roda e de estudo",
        "é o acústico puro: sem cabo, sem bateria, sem pré",
        "é pra tocar sentado, sem depender de tomada",
      ], p);

  return juntaFrases([
    `${nome} ${papel}.`,
    tampo ? `${tampo.charAt(0).toUpperCase()}${tampo.slice(1)}.` : undefined,
    corpo ? `É ${corpo}${a.cutaway ? ", com cutaway pra alcançar as casas agudas sem torcer o pulso" : ""}.` : undefined,
    a.eq
      ? `O pré-amplificador de ${a.eq.replace(/^EQ /, "")} resolve o som na mesa ou no amplificador.`
      : plugavel
        ? "Tem captação embutida: liga direto na mesa ou no amplificador, sem microfone na frente."
        : undefined,
    corda === "Nylon" && !plugavel ? "Corda de nylon: toque macio, timbre redondo." : undefined,
  ]);
}

function aberturaGuitarra(p: Product, a: ProductAttributes): string {
  const nome = apelido(p, a);
  const cor = detectaCor(p.name);
  const modelo = /\bST\b|strato/i.test(p.name)
    ? "no formato strato, o mais versátil que existe"
    : /\bTL\b|tele/i.test(p.name)
      ? "no formato tele, de ataque seco e agudo cortante"
      : undefined;
  const captacao = a.config === "SSS"
    ? "Três single-coils: do limpo cristalino ao crunch, passando por todo blues que você já ouviu."
    : a.config === "SS"
      ? "Dois captadores, cinco posições de uso real — nada de chave sobrando."
      : a.config
        ? `Configuração ${a.config}.`
        : undefined;

  if (/70 aniversário|70 anos/i.test(p.name)) {
    return juntaFrases([
      `${nome} é a edição que a Tonante fez pros próprios 70 anos.`,
      cor ? `Acabamento ${cor}, série comemorativa.` : undefined,
      captacao,
      "Quem comprou o primeiro instrumento com a gente há trinta anos vai reconhecer o logo na cabeça.",
    ]);
  }

  return juntaFrases([
    `${nome} é guitarra ${modelo ?? "elétrica"}.`,
    captacao,
    cor ? `Acabamento ${cor}.` : undefined,
    variante([
      "Chega afinada, com ação regulada de fábrica — plugou, tocou.",
      "Sai da caixa regulada: ação baixa, traste nivelado, tarraxa firme.",
      "Vem pronta pra plugar no amplificador e começar o ensaio.",
    ], p),
  ]);
}

function aberturaContrabaixo(p: Product, a: ProductAttributes): string {
  const nome = apelido(p, a);
  const cordas = a.cordas ?? 4;
  const familia = /jazzmine/i.test(p.name)
    ? "Dois single-coils no estilo JB: grave articulado, que aparece na mistura sem empurrar ninguém."
    : /theodor/i.test(p.name)
      ? "Captação no estilo PB: grave grosso e encorpado, o som que segura a banda por baixo."
      : undefined;
  return juntaFrases([
    `${nome} é contrabaixo de ${cordas} cordas${cordas === 5 ? " — a quinta abre o Si grave, que muda o repertório inteiro" : ""}.`,
    familia,
    detectaCor(p.name) ? `Acabamento ${detectaCor(p.name)}.` : undefined,
    variante([
      "Braço fino, tarraxa blindada e tensor dual action pra manter a regulagem.",
      "Corpo leve pra aguentar show inteiro em pé.",
      "Escala em rosewood e trastes jumbo, que facilitam a mão esquerda.",
    ], p),
  ]);
}

function aberturaBateria(p: Product): string {
  const cor = detectaCor(p.name);
  return juntaFrases([
    "A Sonora é a bateria acústica da Tonante: cascos em poplar, ferragem própria e todas as peças que faltam em kit de entrada.",
    cor ? `Acabamento ${cor}.` : undefined,
    "Serve pra sala de ensaio, estúdio pequeno e primeiro show — que costuma ser o mesmo lugar.",
  ]);
}

function aberturaAcessorio(p: Product, a: ProductAttributes): string {
  const marca = ehTonante(p) ? "Tonante" : p.brand;
  if (/palheta/i.test(p.name)) {
    return juntaFrases([
      `Palheta ${a.espessura ? `de ${a.espessura}` : ""}${a.quantidade ? `, pacote com ${a.quantidade}` : ""}.`,
      a.espessura && parseFloat(a.espessura) >= 1
        ? "Espessura firme: ataque definido, boa pra solo e pra baixo."
        : "Espessura fina: flexível, boa pra batida de violão e acompanhamento.",
      "Palheta some — por isso vem em pacote.",
    ]);
  }
  if (/cabo/i.test(p.name)) {
    return juntaFrases([
      `Cabo ${a.conectores ?? "P10"}${a.comprimento ? ` de ${a.comprimento}` : ""}.`,
      /textil|angel tx/i.test(p.name) ? "Capa têxtil, que embola menos no chão do palco." : "Blindagem contra ruído de fonte e lâmpada.",
      a.comprimento && parseFloat(a.comprimento) >= 4.5
        ? "Comprimento de palco: dá pra andar."
        : "Comprimento de ensaio e estúdio.",
    ]);
  }
  if (/microfone/i.test(p.name)) {
    return `Microfone ${marca ?? ""} para captação direta — voz, instrumento e transmissão ao vivo.`.replace(/\s+/g, " ");
  }
  if (/capotraste|capo/i.test(p.name)) {
    return "Capotraste de mola: prende firme sem desafinar, muda de casa com uma mão só.";
  }
  if (/afinador/i.test(p.name)) {
    return "Afinador de clipe: prende na cabeça do instrumento e lê pela vibração, mesmo com barulho em volta.";
  }
  if (/abafador|anti-feedback/i.test(p.name)) {
    return "Abafador de boca: mata o feedback do violão eletroacústico em palco alto, sem mudar a afinação.";
  }
  return juntaFrases([
    `${p.name}.`,
    ehTonante(p)
      ? "Item de catálogo Tonante, testado no mesmo padrão dos instrumentos."
      : `${marca} é marca parceira: entra no catálogo só o que a gente usaria no próprio palco.`,
  ]);
}

function aberturaCordas(p: Product, a: ProductAttributes): string {
  const alvo = a.alvo ?? "violão";
  const material = a.material;
  return juntaFrases([
    `Encordoamento para ${alvo.toLowerCase()}${a.gauge ? `, calibre ${a.gauge}` : ""}${material ? `, em ${material.toLowerCase()}` : ""}.`,
    material === "Nylon"
      ? "Nylon é corda de violão clássico: toque macio e timbre redondo."
      : material === "Aço"
        ? "Aço projeta mais e marca o ataque — é a corda do violão folk."
        : material === "Níquel"
          ? "Níquel é o padrão de guitarra: brilho controlado e vida longa."
          : undefined,
    "Corda é consumível: trocar a cada 2 a 3 meses muda mais o som que qualquer pedal.",
  ]);
}

function aberturaSuporte(p: Product, a: ProductAttributes): string {
  const tipo = a.tipoSuporte;
  const mapa: Record<string, string> = {
    Parede: "Suporte de parede: tira o instrumento do chão e transforma ele em objeto de sala.",
    Cavalete: "Cavalete de chão: apoia o instrumento no intervalo sem encostar na parede.",
    Girafa: "Pedestal girafa: alcança a altura e o ângulo que o microfone precisa.",
    Tripé: "Pedestal de tripé: base firme, altura regulável, dobra pra transportar.",
    Triplo: "Suporte triplo: três instrumentos em pé, ocupando o espaço de um.",
    Tubular: "Estrutura tubular, que aguenta peso sem entortar.",
    Estante: "Estante de partitura: altura e inclinação reguláveis, dobra e vai junto.",
  };
  return juntaFrases([
    tipo ? mapa[tipo] : "Suporte para instrumento.",
    a.dobravel ? "Dobrável, cabe no bag junto com o resto." : undefined,
    "Instrumento encostado na parede cai — é sempre assim que quebra.",
  ]);
}

function abertura(p: Product, a: ProductAttributes): string {
  /* o catálogo guarda abafador de boca dentro de "Violões" porque é pra violão;
     copy de instrumento não serve pra ele */
  if (/abafador|anti-feedback|capotraste|afinador|palheta|correia|encordoament/i.test(p.name)
      && p.category !== "Cordas & Encordoamentos") {
    return aberturaAcessorio(p, a);
  }
  switch (p.category) {
    case "Violões": return aberturaViolao(p, a);
    case "Guitarras": return /cabo/i.test(p.name) ? aberturaAcessorio(p, a) : aberturaGuitarra(p, a);
    case "Contrabaixos": return aberturaContrabaixo(p, a);
    case "Baterias": return aberturaBateria(p);
    case "Cordas & Encordoamentos": return aberturaCordas(p, a);
    case "Suportes": return aberturaSuporte(p, a);
    default: return aberturaAcessorio(p, a);
  }
}

/* ─────────────────────────────────────────────────────────
   Blocos editoriais
   ───────────────────────────────────────────────────────── */

function blocosDeInstrumento(p: Product, a: ProductAttributes): TextoDeBloco[] {
  const blocos: TextoDeBloco[] = [];
  /* casa o rótulo inteiro, não um pedaço: "Corpo" não pode pegar
     "Formato do Corpo", que é shape e não madeira */
  const spec = (label: string) => p.specs?.find((s) => new RegExp(`^${label}$`, "i").test(s.label.trim()))?.value;
  const acustico = p.category === "Violões";

  if (p.category === "Baterias") return blocosDeBateria(p);

  /* 1. madeira / construção — só existe se soubermos a madeira */
  const tampo = a.tampo ?? spec("Tampo");
  const caixa = spec("Lateral e Fundo") ?? spec("Corpo");
  if (tampo || caixa) {
    const solido = /sólido|solido/i.test(p.name) || /sólido/i.test(String(tampo));
    blocos.push({
      prefere: "macroInicial",
      titulo: acustico
        ? (solido ? "Tampo sólido, não laminado" : "A madeira decide o timbre")
        : "O corpo",
      texto: juntaFrases([
        acustico && tampo ? `Tampo em ${String(tampo).replace(/ sólido/i, "")}${solido ? " maciço" : ""}.` : undefined,
        a.tampo && TIMBRE_DA_MADEIRA[a.tampo] ? `${TIMBRE_DA_MADEIRA[a.tampo].charAt(0).toUpperCase()}${TIMBRE_DA_MADEIRA[a.tampo].slice(1)}.` : undefined,
        caixa ? (acustico ? `Lateral e fundo em ${caixa}.` : `Corpo em ${caixa}.`) : undefined,
        !acustico && caixa && TIMBRE_DA_MADEIRA[caixa]
          ? `${TIMBRE_DA_MADEIRA[caixa].charAt(0).toUpperCase()}${TIMBRE_DA_MADEIRA[caixa].slice(1)}.`
          : undefined,
        solido
          ? "Madeira maciça abre com o tempo: o violão de daqui a cinco anos soa melhor que o de hoje."
          : "Cada peça é conferida antes da montagem — veio torto ou mancha de cola não passa.",
      ]),
    });
  }

  /* 2. mão esquerda — braço, escala, trastes */
  const braco = spec("Braço");
  const escala = spec("Escala");
  const trastes = spec("Trastes");
  {
    blocos.push({
      prefere: "cena",
      titulo: "O que a mão esquerda sente",
      texto: juntaFrases([
        braco ? `Braço em ${braco}${escala ? ` e escala em ${escala}` : ""}.` : escala ? `Escala em ${escala}.` : undefined,
        trastes ? `${trastes} trastes, nivelados e com as pontas rebaixadas.` : "Trastes nivelados e com as pontas rebaixadas, que é o detalhe que separa instrumento bom de instrumento barato.",
        spec("Tensor") ? `Tensor ${spec("Tensor")!.toLowerCase()}: dá pra corrigir a curvatura nos dois sentidos conforme o clima muda.` : "A ação sai regulada de fábrica e o tensor permite ajuste fino depois.",
        a.cutaway ? "O cutaway libera as casas do fim da escala." : undefined,
      ]),
    });
  }

  /* 3. eletrônica — só quando existe */
  const captacao = spec("Captadores") ?? spec("Captação");
  if (a.eq || captacao) {
    blocos.push({
      prefere: "macroFinal",
      titulo: a.eq ? "Ligado na mesa" : "A captação",
      texto: juntaFrases([
        a.eq ? `Pré-amplificador de ${a.eq.replace(/^EQ /, "")} embutido na lateral, ao alcance da mão direita enquanto você toca.` : undefined,
        captacao ? `${captacao}.` : undefined,
        spec("Controles") ? `Controles: ${spec("Controles")!.toLowerCase()}.` : undefined,
        a.eq ? "Saída P10 na base do corpo — o mesmo cabo de guitarra serve." : undefined,
      ]),
    });
  }

  /* 4. acabamento e cor */
  const cor = detectaCor(p.name) ?? spec("Cor");
  const acab = detectaAcabamento(p.name) ?? spec("Acabamento");
  if (cor || acab) {
    const chaveAcab = String(acab ?? "").toLowerCase();
    blocos.push({
      prefere: "cena",
      titulo: "Acabamento",
      texto: juntaFrases([
        cor ? `Cor ${cor}.` : undefined,
        ACABAMENTOS[chaveAcab] ? `${ACABAMENTOS[chaveAcab].charAt(0).toUpperCase()}${ACABAMENTOS[chaveAcab].slice(1)}.` : acab ? `Acabamento ${acab}.` : undefined,
        spec("Marcações") ? `Marcações em ${spec("Marcações")!.toLowerCase()}.` : undefined,
        spec("Pestana") || spec("Rastilho")
          ? `Pestana e rastilho em ${(spec("Pestana") ?? spec("Rastilho"))!.toLowerCase()}, que transmite melhor a vibração que o plástico.`
          : undefined,
        !spec("Marcações") && !spec("Pestana") && !spec("Rastilho")
          ? variante(
              corTranslucida(cor)
                ? [
                    "O verniz é conferido na luz rasante antes de embalar: risco, bolha e casca de laranja não passam.",
                    "A cor é aplicada em demãos finas, pra não afogar o veio da madeira.",
                    "Tarraxa, botão de correia e parafuso saem apertados no torque de fábrica.",
                  ]
                : [
                    "Cor sólida, lixada entre demãos e polida no fim — sem casca de laranja na curva do corpo.",
                    "O verniz é conferido na luz rasante antes de embalar: risco e bolha não passam.",
                    "Tarraxa, botão de correia e parafuso saem apertados no torque de fábrica.",
                  ],
              p,
            )
          : undefined,
      ]),
    });
  }

  return blocos.filter((b) => b.texto.trim().length > 0);
}

/** Bateria não tem tampo nem braço: o que interessa é casco, ferragem e kit. */
function blocosDeBateria(p: Product): TextoDeBloco[] {
  const spec = (label: string) => p.specs?.find((s) => new RegExp(`^${label}$`, "i").test(s.label.trim()))?.value;
  const pecas = [spec("Bumbo") && `bumbo ${spec("Bumbo")}`, spec("Caixa") && `caixa ${spec("Caixa")}`, spec("Tons") && `tons ${spec("Tons")}`]
    .filter(Boolean) as string[];
  return [
    {
      prefere: "cena",
      titulo: "Cascos em poplar",
      texto: "Seis folhas de poplar por casco, prensadas e com o aro torneado no mesmo ângulo em todas as peças. O resultado é uma ressonância funda e parelha — afinou uma vez, fica.",
    },
    {
      prefere: "cena",
      titulo: "O que vem no kit",
      texto: juntaFrases([
        pecas.length ? `${lista(pecas).charAt(0).toUpperCase()}${lista(pecas).slice(1)}.` : undefined,
        "Vem com máquina de hi-hat, pedal de bumbo, banco, estantes e pratos — o kit que dá pra sentar e tocar no mesmo dia, sem lista de compra extra.",
      ]),
    },
    {
      prefere: "cena",
      titulo: "Ferragem que aguenta ensaio",
      texto: "Tubo duplo nas estantes, borboleta de aperto grande e memory lock onde importa. Ferragem fina é o que entrega kit de entrada — essa não é.",
    },
  ];
}

function blocosDeAcessorio(p: Product, a: ProductAttributes): TextoDeBloco[] {
  const blocos: TextoDeBloco[] = [];
  const nome = p.name.toLowerCase();

  /* "O que vem" só aparece quando o nome do produto realmente diz o que vem —
     bloco de spec vazio é pior que bloco nenhum. */
  if (a.quantidade || a.espessura || a.comprimento || a.conectores || a.gauge) {
    blocos.push({
      prefere: "macroInicial",
      titulo: "O que vem",
      texto: juntaFrases([
        a.quantidade ? `Pacote com ${a.quantidade}.` : undefined,
        a.espessura ? `Espessura ${a.espessura}.` : undefined,
        a.comprimento ? `Comprimento ${a.comprimento}.` : undefined,
        a.conectores ? `Conectores ${a.conectores}.` : undefined,
        a.gauge ? `Calibre ${a.gauge}.` : undefined,
        a.material ? `Material: ${a.material.toLowerCase()}.` : undefined,
      ]),
    });
  }

  if (p.category === "Cordas & Encordoamentos") {
    blocos.push({
      prefere: "cena",
      titulo: "Quando trocar",
      texto: "Corda velha perde harmônico, desafina nas casas altas e escurece o ataque. Quem toca todo dia troca por mês; quem toca no fim de semana, a cada três. Trocar o jogo inteiro de uma vez mantém a tensão equilibrada no braço.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: "Sai da embalagem afinando",
      texto: juntaFrases([
        a.material === "Nylon"
          ? "Nylon estica: depois de montar, deixe o instrumento afinado por um dia e reafine algumas vezes até estabilizar."
          : "Corda com alma de aço estabiliza rápido — esticar cada corda com a mão depois de montar adianta o processo.",
        "Cada corda vem em sachê próprio, identificada, pra não montar na ordem errada.",
      ]),
    });
    return blocos;
  }

  if (p.category === "Suportes") {
    blocos.push({
      prefere: "cena",
      titulo: "Onde encostar não é opção",
      texto: "Instrumento encostado na parede escorrega, e é assim que a maioria quebra o braço. O apoio distribui o peso no ponto certo e o contato é sempre em borracha ou espuma, que não reage com o verniz.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: a.dobravel ? "Monta e desmonta sem ferramenta" : "Firme onde precisa ser",
      texto: a.dobravel
        ? "Dobra pra caber no bag e volta a montar com a mão, sem chave nem parafuso solto pra perder no caminho do show."
        : "Tubo e solda dimensionados pro peso do instrumento, com regulagem que trava — não é o suporte que cede no meio do ensaio.",
    });
    return blocos;
  }

  if (/palheta/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "A espessura muda o ataque",
      texto: a.espessura && parseFloat(a.espessura) >= 1
        ? "Palheta grossa quase não flexiona: o ataque sai definido e o volume, parelho. É a escolha de quem toca solo, riff pesado e baixo."
        : "Palheta fina flexiona no ataque e suaviza o acento — é o que dá aquela batida uniforme no acompanhamento de violão.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: "Compre sempre mais de uma",
      texto: "Palheta cai no meio do show, some dentro do violão, vira brinquedo de cachorro. Por isso vem em pacote — deixe uma no bag, uma no bolso e uma no suporte do microfone.",
    });
    return blocos;
  }

  if (/cabo/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "Blindagem é o que separa cabo bom de cabo ruim",
      texto: "Malha de cobre em volta do condutor é o que barra o zumbido de fonte chaveada, dimmer de luz e lâmpada de LED — o chiado que aparece só quando você liga o instrumento na casa de show.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: a.comprimento && parseFloat(a.comprimento) >= 4.5 ? "Comprimento de palco" : "Comprimento de ensaio",
      texto: juntaFrases([
        a.comprimento ? `${a.comprimento} de cabo.` : undefined,
        parseFloat(a.comprimento ?? "0") >= 4.5
          ? "Dá pra andar até a boca do palco sem arrancar o amplificador junto."
          : "Sobra o suficiente pra sentar, levantar e virar de lado sem tensionar o plugue.",
        "Enrole em laçada larga na hora de guardar: dobra fechada é o que rompe a malha por dentro.",
      ]),
    });
    return blocos;
  }

  if (/capotraste|capo\b/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "Muda de tom sem mudar de acorde",
      texto: "Sobe a tonalidade da música pro lugar onde a sua voz fica confortável, mantendo as mesmas formas de acorde. É o acessório que mais resolve problema por menos dinheiro.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: "Pressão certa, sem desafinar",
      texto: "Mola calibrada pra prender a corda no traste sem puxar a afinação pra cima. Borracha na base, que não marca o braço nem encardece o verniz claro.",
    });
    return blocos;
  }

  if (/afinador/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "Lê pela vibração, não pelo som",
      texto: "O clipe prende na cabeça do instrumento e capta a vibração da madeira, então funciona com barulho em volta — passagem de som, aula com a turma inteira tocando, rua.",
    });
    blocos.push({
      prefere: "macroFinal",
      titulo: "Afinar é o primeiro hábito",
      texto: "Instrumento desafinado ensina o ouvido errado. Cinco segundos antes de começar resolvem — e é por isso que o afinador tem que ficar preso no bag, não na gaveta.",
    });
    return blocos;
  }

  if (/abafador|anti-feedback/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "Mata a microfonia sem mudar a afinação",
      texto: "Em palco alto, o violão eletroacústico entra em realimentação pela boca. O abafador fecha essa boca e corta o grave que realimenta, sem mexer nas cordas nem no ajuste do EQ.",
    });
    return blocos;
  }

  if (/microfone/.test(nome)) {
    blocos.push({
      prefere: "cena",
      titulo: "Plug and play",
      texto: "Conecta na USB e o computador reconhece sem driver. Serve pra voz, amplificador microfonado, live e gravação caseira.",
    });
    return blocos;
  }

  /* genérico: item de parceiro. Melhor dizer isso do que inventar spec. */
  blocos.push({
    prefere: "cena",
    titulo: ehTonante(p) ? "Catálogo Tonante" : `Por que ${p.brand ?? "essa marca"} entra aqui`,
    texto: ehTonante(p)
      ? "Item da linha própria, conferido no mesmo padrão dos instrumentos que saem da fábrica."
      : `Mais de meio século de música dá critério: ${p.brand ?? "a marca"} entra no catálogo porque passa no teste de uso — o que a gente não usaria no próprio palco não fica na prateleira.`,
  });
  return blocos;
}

/* ─────────────────────────────────────────────────────────
   Destaques e ficha
   ───────────────────────────────────────────────────────── */

function destaques(p: Product, a: ProductAttributes): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const add = (label: string, value?: string | number | false) => {
    if (!value && value !== 0) return;
    if (out.some((o) => o.label === label)) return;
    out.push({ label, value: String(value) });
  };
  const spec = (label: string) => p.specs?.find((s) => new RegExp(`^${label}$`, "i").test(s.label.trim()))?.value;

  switch (p.category) {
    case "Violões":
      add("Tamanho", a.tamanho);
      add("Tampo", a.tampo ?? spec("Tampo"));
      add("Corda", a.corda);
      add("Eletrônica", a.eq ? a.eq.replace(/^EQ /, "EQ ") : undefined);
      break;
    case "Guitarras":
      add("Captação", a.config);
      add("Cordas", a.cordas ? `${a.cordas} cordas` : undefined);
      add("Cor", detectaCor(p.name));
      add("Escala", spec("Escala"));
      break;
    case "Contrabaixos":
      add("Cordas", a.cordas ? `${a.cordas} cordas` : undefined);
      add("Captação", spec("Captação"));
      add("Corpo", spec("Corpo"));
      add("Escala", spec("Escala"));
      break;
    case "Baterias":
      add("Bumbo", spec("Bumbo"));
      add("Caixa", spec("Caixa"));
      add("Tons", spec("Tons"));
      add("Cor", spec("Cor") ?? detectaCor(p.name));
      break;
    case "Cordas & Encordoamentos":
      add("Para", a.alvo);
      add("Material", a.material);
      add("Calibre", a.gauge);
      break;
    case "Suportes":
      add("Tipo", a.tipoSuporte);
      add("Dobrável", a.dobravel ? "Sim" : undefined);
      add("Para", a.alvo);
      break;
    default:
      add("Espessura", a.espessura);
      add("Quantidade", a.quantidade);
      add("Comprimento", a.comprimento);
      add("Conectores", a.conectores);
  }
  /* garantia de 2 anos em palheta e corda é ruído: consumível não volta pra
     assistência. Fica só nos instrumentos e nos suportes. */
  if (!["Acessórios", "Cordas & Encordoamentos"].includes(p.category)) {
    add("Garantia", "2 anos");
  }
  return out.slice(0, 4);
}

function ficha(p: Product, a: ProductAttributes): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const add = (label: string, value?: string | number) => {
    if (!value && value !== 0) return;
    if (out.some((o) => o.label.toLowerCase() === label.toLowerCase())) return;
    out.push({ label, value: String(value) });
  };

  /* atributos derivados do nome entram primeiro: são os que o comprador
     procura e o dump do Magento quase nunca traz */
  add("Tamanho", a.tamanho);
  add("Tampo", a.tampo);
  add("Cordas", a.cordas ? `${a.cordas} cordas` : undefined);
  add("Tipo de corda", a.corda);
  add("Equalizador", a.eq?.replace(/^EQ /, ""));
  add("Cutaway", a.cutaway ? "Sim" : undefined);
  add("Configuração", a.config);
  add("Cor", detectaCor(p.name));
  add("Acabamento", detectaAcabamento(p.name));
  add("Espessura", a.espessura);
  add("Quantidade", a.quantidade);
  add("Comprimento", a.comprimento);
  add("Conectores", a.conectores);
  add("Calibre", a.gauge);
  add("Material", a.material);
  add("Tipo de suporte", a.tipoSuporte);

  for (const s of p.specs ?? []) {
    if (/^detalhes$/i.test(s.label)) continue;
    add(s.label, s.value);
  }
  add("Marca", p.brand);
  add("SKU", p.sku);
  return out;
}

/* ─────────────────────────────────────────────────────────
   Fotos por papel
   ───────────────────────────────────────────────────────── */

/* A sessão do site institucional fotografou a linha inteira e o nome do arquivo
   carrega a cor: `108184-CENTRAL-LORENZZO-39-BROWN-FOSCO.webp` está na pasta do
   Lorenzzo NATURAL. Mostrar a foto do irmão marrom na página do natural é o
   tipo de erro que o visitante percebe antes da gente. Então: se o arquivo
   nomeia uma cor e o produto nomeia outra, a foto sai. */
function corDoArquivo(src: string): string | undefined {
  const arq = src.split("/").pop() ?? "";
  if (!/[A-Z]{3,}/.test(arq)) return undefined; // numerada, sem cor no nome
  const legivel = arq.replace(/[-_]+/g, " ");
  return CORES.find((c) => new RegExp(`\\b${c.replace(/\s+/g, "\\s+")}\\b`, "i").test(legivel));
}

function fotoDeOutraCor(src: string, corDoProduto?: string): boolean {
  if (!corDoProduto) return false;
  const cor = corDoArquivo(src);
  if (!cor) return false;
  return cor.toLowerCase() !== corDoProduto.toLowerCase();
}

/* "111643_14.webp" → 14. Serve pra ordenar a sessão de estúdio: nos macros, os
   primeiros números são tampo/boca/cavalete e os últimos, EQ e saída do cabo.
   Arquivo com nome descritivo (a sessão ambientada) fica no fim, com 999. */
function numeroDaFoto(src: string): number {
  const arq = src.split("/").pop() ?? "";
  const m = /_(\d+)(?:-\d+)?\.[a-z]+$/i.exec(arq);
  return m ? Number(m[1]) : 999;
}

function separaFotos(p: Product) {
  const cor = detectaCor(p.name) ?? p.specs?.find((s) => /^cor$/i.test(s.label))?.value;
  const todas = getProductImages(p).filter((src) => !fotoDeOutraCor(src, cor));
  const por = (papel: string) => todas.filter((src) => getPapelDaFoto(src) === papel);
  return {
    todas,
    cenas: por("cena"),
    detalhes: por("detalhe"),
    angulos: por("angulo"),
    faixas: por("faixa"),
  };
}

/* ─────────────────────────────────────────────────────────
   Montagem
   ───────────────────────────────────────────────────────── */

export function getHistoriaDoProduto(p: Product): HistoriaDoProduto {
  const a = getProductAttributes(p);
  const fotos = separaFotos(p);
  const ehInstrumento = ["Violões", "Guitarras", "Contrabaixos", "Baterias"].includes(p.category) && !/cabo/i.test(p.name);

  const ehAcessorioDisfarcado = /abafador|anti-feedback|capotraste|afinador|palheta|correia/i.test(p.name);
  const textos = ehInstrumento && !ehAcessorioDisfarcado
    ? blocosDeInstrumento(p, a)
    : blocosDeAcessorio(p, a);

  /* A foto de cada bloco sai da preferência que o texto declarou, e o plano
     aberto NUNCA entra aqui — é ele que fazia a descrição antiga parecer
     catálogo de peça de reposição. Macro sem dono vira grade "de perto". */
  const cenasLivres = [...fotos.cenas];
  const macrosLivres = [...fotos.detalhes].sort((x, y) => numeroDaFoto(x) - numeroDaFoto(y));
  const tira = (lista: string[], daPonta: "inicio" | "fim"): string | undefined =>
    daPonta === "inicio" ? lista.shift() : lista.pop();

  const blocos: BlocoEditorial[] = textos.map((t, i) => {
    let foto: string | undefined;
    if (t.prefere === "cena") {
      foto = tira(cenasLivres, "inicio") ?? tira(macrosLivres, "inicio");
    } else if (t.prefere === "macroFinal") {
      foto = tira(macrosLivres, "fim") ?? tira(cenasLivres, "fim");
    } else {
      foto = tira(macrosLivres, "inicio") ?? tira(cenasLivres, "inicio");
    }
    return {
      id: `${p.id}-${i}`,
      titulo: t.titulo,
      texto: t.texto,
      foto,
      formato: foto && fotos.cenas.includes(foto) ? "cena" : "detalhe",
    };
  });

  const macrosDisponiveis = macrosLivres;

  const legendaDetalhes = macrosDisponiveis.length >= 3
    ? variante([
        "As fotos que a prateleira não mostra: boca, cavalete, junta do braço e a saída do cabo.",
        "De perto é onde o acabamento se entrega — ou se prova.",
        "Os mesmos pontos que a gente confere na fábrica, um por um.",
      ], p)
    : undefined;

  return {
    abertura: abertura(p, a),
    destaques: destaques(p, a),
    blocos,
    detalhes: macrosDisponiveis.slice(0, 6),
    angulos: fotos.angulos.slice(0, 8),
    faixa: fotos.faixas[0],
    ficha: ficha(p, a),
    legendaDetalhes,
  };
}

/** Resumo em uma linha pro topo da PDP (coluna do meio). */
export function getResumoDoProduto(p: Product): string {
  return abertura(p, getProductAttributes(p));
}

export { lista };
