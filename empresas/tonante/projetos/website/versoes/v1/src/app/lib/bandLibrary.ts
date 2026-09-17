/* bandLibrary — quem o cliente quer tocar.
 *
 * Portado do gameLibrary.ts do PCYES v3, que é o arquivo que faz o quiz de lá
 * parecer caro: cada jogo carrega capa, duas cores da marca e um `weight`, e o
 * grid de pôsteres sai de graça. Lá o `weight` é um eixo só porque performance
 * é um número (FPS). Timbre não é, então aqui o peso virou `som`, com quatro
 * eixos.
 *
 * Serve dois lugares, igual ao original: o passo "quem você quer tocar" do quiz
 * e o bloco "o que dá pra tocar com isso" na PDP do kit. Uma fonte, dois usos —
 * se divergirem, o quiz promete um som que o kit não entrega.
 *
 * CAPAS: cada banda aponta para a capa de um álbum real em
 * `public/bandas/{id}.jpg`, baixada da iTunes Search API (artwork 600x600) e,
 * para o que a Apple não licencia no Brasil (Nevermind, Is This It, Sigh No
 * More, For Emma), da Cover Art Archive via MusicBrainz. São arquivos locais
 * de propósito: hotlink de arte de álbum quebra sem aviso.
 *
 * `cover` segue opcional no tipo e o card ainda cai no fallback tipográfico
 * (nome sobre bg1→bg2) se a imagem falhar — ver BandTile. Para trocar a capa de
 * uma banda basta substituir o arquivo; o caminho não muda.
 *
 * bg1/bg2 continuam valendo: são a cor de carregamento atrás da capa e o
 * fallback. Arte de álbum é material protegido — isto é protótipo. */

export type Genero =
  | "rock"
  | "folk"
  | "samba"
  | "gospel"
  | "mpb"
  | "blues"
  | "sertanejo"
  | "pop";

export type Corda = "nylon" | "aco" | "ambos";
export type Captacao = "nenhuma" | "passiva" | "single" | "humbucker";
export type NivelMao = "facil" | "medio" | "dificil";
export type Ataque = "suave" | "brilhante" | "agressivo";

export interface Som {
  /** Nylon x aço é o eixo que mais muda o produto recomendado. */
  corda: Corda;
  /** O que o som pede de captação. "nenhuma" = acústico puro dá conta. */
  captacao: Captacao;
  /** Quão difícil é tocar aquele repertório de verdade. */
  nivel: NivelMao;
  /** Como a mão ataca a corda: dedo macio, palheta brilhante, palheta brava. */
  ataque: Ataque;
}

export interface Band {
  id: string;
  name: string;
  alias?: string[];
  /** Opcional. Ver o aviso CAPAS no topo. */
  cover?: string;
  /** As duas cores do card. bg1 é o fundo, bg2 o degradê e o texto contrasta. */
  bg1: string;
  bg2: string;
  genero: Genero;
  /** Não vira UI. Existe para explicar o resultado: "Ramones, punk, por isso…". */
  subgenero: string;
  som: Som;
  /** Aparece no card, abaixo do nome. Curto. */
  tag: string;
  /** Famílias de instrumento onde essa banda faz sentido como referência. */
  instrumentos: Instrumento[];
}

export type Instrumento =
  | "violao"
  | "guitarra"
  | "baixo"
  | "viola"
  | "ukulele"
  | "bateria"
  | "teclado"
  | "sopro"
  /* Voz não é linha de banda como as outras: quase toda banda daqui tem
     alguém cantando, então nenhuma `Band` declara "voz" em `instrumentos`.
     O tipo existe porque quem canta escolhe kit como todo mundo (o
     montador já trata voz como família); quem pergunta por banda de voz
     usa o acervo inteiro, não este filtro. */
  | "voz";

export const GENEROS: { id: Genero; label: string }[] = [
  { id: "rock", label: "Rock" },
  { id: "mpb", label: "MPB" },
  { id: "gospel", label: "Gospel" },
  { id: "sertanejo", label: "Sertanejo" },
  { id: "samba", label: "Samba" },
  { id: "folk", label: "Folk" },
  { id: "blues", label: "Blues e jazz" },
  { id: "pop", label: "Pop" },
];

export const BANDS: Band[] = [
  /* ——— rock ——— */
  { id: "ramones", name: "Ramones", genero: "rock", subgenero: "punk", cover: "/bandas/ramones.jpg",
    bg1: "#E8E3D3", bg2: "#1A1A1A", tag: "Punk de três acordes",
    som: { corda: "aco", captacao: "humbucker", nivel: "facil", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "pink-floyd", name: "Pink Floyd", alias: ["floyd"], genero: "rock", subgenero: "progressivo", cover: "/bandas/pink-floyd.jpg",
    bg1: "#0B0B0B", bg2: "#6E4AA6", tag: "Solo longo, espaço",
    som: { corda: "aco", captacao: "single", nivel: "dificil", ataque: "suave" },
    instrumentos: ["guitarra", "baixo", "teclado"] },
  { id: "legiao", name: "Legião Urbana", alias: ["legiao", "renato russo"], genero: "rock", subgenero: "rock brasileiro", cover: "/bandas/legiao.jpg",
    bg1: "#1F3A5F", bg2: "#C9C2B4", tag: "Violão e verso",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "baixo"] },
  { id: "titas", name: "Titãs", alias: ["titas"], genero: "rock", subgenero: "rock brasileiro", cover: "/bandas/titas.jpg",
    bg1: "#B3231F", bg2: "#151515", tag: "Rock de porão",
    som: { corda: "aco", captacao: "humbucker", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "capital", name: "Capital Inicial", genero: "rock", subgenero: "rock brasileiro", cover: "/bandas/capital.jpg",
    bg1: "#2A2A2A", bg2: "#D4622A", tag: "Refrão de estádio",
    som: { corda: "aco", captacao: "humbucker", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "strokes", name: "The Strokes", alias: ["strokes"], genero: "rock", subgenero: "indie", cover: "/bandas/strokes.jpg",
    bg1: "#171717", bg2: "#C43B2E", tag: "Indie seco",
    som: { corda: "aco", captacao: "single", nivel: "medio", ataque: "brilhante" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "arctic", name: "Arctic Monkeys", alias: ["arctic"], genero: "rock", subgenero: "indie", cover: "/bandas/arctic.jpg",
    bg1: "#101820", bg2: "#8A8F98", tag: "Riff grave",
    som: { corda: "aco", captacao: "humbucker", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "fresno", name: "Fresno", genero: "rock", subgenero: "emo", cover: "/bandas/fresno.jpg",
    bg1: "#1B1B2F", bg2: "#E0446D", tag: "Emo brasileiro",
    som: { corda: "aco", captacao: "humbucker", nivel: "facil", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "charlie-brown", name: "Charlie Brown Jr.", alias: ["cbjr", "chorao"], genero: "rock", subgenero: "rap rock", cover: "/bandas/charlie-brown.jpg",
    bg1: "#0F3D2E", bg2: "#F2B705", tag: "Skate e peso",
    som: { corda: "aco", captacao: "humbucker", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "nirvana", name: "Nirvana", genero: "rock", subgenero: "grunge", cover: "/bandas/nirvana.jpg",
    bg1: "#1A1A1A", bg2: "#D9C441", tag: "Grunge sujo",
    som: { corda: "aco", captacao: "humbucker", nivel: "facil", ataque: "agressivo" },
    instrumentos: ["guitarra", "baixo", "bateria"] },
  { id: "queen", name: "Queen", genero: "rock", subgenero: "rock clássico", cover: "/bandas/queen.jpg",
    bg1: "#12142B", bg2: "#D4AF37", tag: "Coro e ópera",
    som: { corda: "aco", captacao: "humbucker", nivel: "dificil", ataque: "brilhante" },
    instrumentos: ["guitarra", "teclado", "baixo"] },
  { id: "led", name: "Led Zeppelin", alias: ["led zepelin"], genero: "rock", subgenero: "rock clássico", cover: "/bandas/led.jpg",
    bg1: "#2B1B12", bg2: "#C87800", tag: "Riff de blues pesado",
    som: { corda: "ambos", captacao: "humbucker", nivel: "dificil", ataque: "agressivo" },
    instrumentos: ["guitarra", "violao", "baixo", "bateria"] },

  /* ——— mpb ——— */
  { id: "joao-gilberto", name: "João Gilberto", alias: ["bossa"], genero: "mpb", subgenero: "bossa nova", cover: "/bandas/joao-gilberto.jpg",
    bg1: "#F3EFE6", bg2: "#2E6E5B", tag: "Batida de bossa",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "dificil", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "tom-jobim", name: "Tom Jobim", alias: ["jobim", "antonio carlos"], genero: "mpb", subgenero: "bossa nova", cover: "/bandas/tom-jobim.jpg",
    bg1: "#E9E4D6", bg2: "#1F5673", tag: "Harmonia rica",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "dificil", ataque: "suave" },
    instrumentos: ["violao", "teclado"] },
  { id: "caetano", name: "Caetano Veloso", alias: ["caetano"], genero: "mpb", subgenero: "tropicália", cover: "/bandas/caetano.jpg",
    bg1: "#F0E7DA", bg2: "#B5472A", tag: "Voz e violão",
    som: { corda: "nylon", captacao: "passiva", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "gil", name: "Gilberto Gil", alias: ["gil"], genero: "mpb", subgenero: "tropicália", cover: "/bandas/gil.jpg",
    bg1: "#1E5631", bg2: "#F2C14E", tag: "Ritmo na mão direita",
    som: { corda: "nylon", captacao: "passiva", nivel: "dificil", ataque: "brilhante" },
    instrumentos: ["violao"] },
  { id: "chico", name: "Chico Buarque", alias: ["chico"], genero: "mpb", subgenero: "mpb clássica", cover: "/bandas/chico.jpg",
    bg1: "#EDE8DC", bg2: "#3B3B3B", tag: "Letra e harmonia",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "djavan", name: "Djavan", genero: "mpb", subgenero: "mpb moderna", cover: "/bandas/djavan.jpg",
    bg1: "#123B47", bg2: "#E0A458", tag: "Acorde estranho, bonito",
    som: { corda: "nylon", captacao: "passiva", nivel: "dificil", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "marisa", name: "Marisa Monte", genero: "mpb", subgenero: "mpb moderna", cover: "/bandas/marisa.jpg",
    bg1: "#F2E9E4", bg2: "#9A3B5C", tag: "Voz limpa, violão claro",
    som: { corda: "nylon", captacao: "passiva", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "los-hermanos", name: "Los Hermanos", alias: ["hermanos"], genero: "mpb", subgenero: "indie mpb", cover: "/bandas/los-hermanos.jpg",
    bg1: "#1D3557", bg2: "#E6C79C", tag: "Acorde simples, alma",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao", "guitarra"] },
  { id: "tim-maia", name: "Tim Maia", genero: "mpb", subgenero: "soul", cover: "/bandas/tim-maia.jpg",
    bg1: "#4A1C1C", bg2: "#E8B04B", tag: "Groove e sopro",
    som: { corda: "aco", captacao: "single", nivel: "medio", ataque: "brilhante" },
    instrumentos: ["baixo", "teclado", "sopro", "guitarra"] },

  /* ——— gospel ——— */
  { id: "hillsong", name: "Hillsong", genero: "gospel", subgenero: "worship", cover: "/bandas/hillsong.jpg",
    bg1: "#101B2D", bg2: "#3E7CB1", tag: "Worship de palco",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "teclado", "bateria"] },
  { id: "gabriela-rocha", name: "Gabriela Rocha", genero: "gospel", subgenero: "worship br", cover: "/bandas/gabriela-rocha.jpg",
    bg1: "#2B1B3D", bg2: "#C9A227", tag: "Voz e congregação",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "teclado"] },
  { id: "fernandinho", name: "Fernandinho", genero: "gospel", subgenero: "worship br", cover: "/bandas/fernandinho.jpg",
    bg1: "#14302B", bg2: "#D9A441", tag: "Louvor congregacional",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "teclado"] },
  { id: "diante-do-trono", name: "Diante do Trono", alias: ["ddt", "ana paula valadao"], genero: "gospel", subgenero: "worship br", cover: "/bandas/diante-do-trono.jpg",
    bg1: "#1B2A4A", bg2: "#E4C16F", tag: "Igreja cheia",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "teclado", "bateria"] },
  { id: "morada", name: "Morada", genero: "gospel", subgenero: "worship indie", cover: "/bandas/morada.jpg",
    bg1: "#23313A", bg2: "#A8C0A0", tag: "Arranjo enxuto",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao", "guitarra", "teclado"] },
  { id: "isaias-saad", name: "Isaías Saad", genero: "gospel", subgenero: "worship br", cover: "/bandas/isaias-saad.jpg",
    bg1: "#1A1A2E", bg2: "#C87800", tag: "Ministração longa",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao", "teclado"] },

  /* ——— sertanejo ——— */
  { id: "chitaozinho", name: "Chitãozinho & Xororó", alias: ["chitaozinho"], genero: "sertanejo", subgenero: "sertanejo raiz", cover: "/bandas/chitaozinho.jpg",
    bg1: "#3D2B1F", bg2: "#D9A441", tag: "Viola e dupla",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "brilhante" },
    instrumentos: ["viola", "violao"] },
  { id: "almir-sater", name: "Almir Sater", genero: "sertanejo", subgenero: "viola caipira", cover: "/bandas/almir-sater.jpg",
    bg1: "#2F3A1F", bg2: "#C9A227", tag: "Viola de dez cordas",
    som: { corda: "aco", captacao: "passiva", nivel: "dificil", ataque: "brilhante" },
    instrumentos: ["viola", "violao"] },
  { id: "marilia", name: "Marília Mendonça", genero: "sertanejo", subgenero: "feminejo", cover: "/bandas/marilia.jpg",
    bg1: "#2A1B2E", bg2: "#E0446D", tag: "Sofrência",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "teclado"] },
  { id: "jorge-mateus", name: "Jorge & Mateus", genero: "sertanejo", subgenero: "sertanejo universitário", cover: "/bandas/jorge-mateus.jpg",
    bg1: "#1B2A3A", bg2: "#E8C34A", tag: "Universitário",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "teclado"] },
  { id: "henrique-juliano", name: "Henrique & Juliano", genero: "sertanejo", subgenero: "sertanejo moderno", cover: "/bandas/henrique-juliano.jpg",
    bg1: "#22303C", bg2: "#D98F4E", tag: "Arena e PA",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "bateria"] },
  { id: "michel-telo", name: "Michel Teló", genero: "sertanejo", subgenero: "sertanejo pop", cover: "/bandas/michel-telo.jpg",
    bg1: "#2E2233", bg2: "#F2A65A", tag: "Sanfona e refrão",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "teclado"] },

  /* ——— samba ——— */
  { id: "cartola", name: "Cartola", genero: "samba", subgenero: "samba de raiz", cover: "/bandas/cartola.jpg",
    bg1: "#EDE4D3", bg2: "#2E5E3E", tag: "Samba canção",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao", "ukulele"] },
  { id: "paulinho-viola", name: "Paulinho da Viola", genero: "samba", subgenero: "samba de raiz", cover: "/bandas/paulinho-viola.jpg",
    bg1: "#E8DFCB", bg2: "#1F4E5F", tag: "Violão de sete",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "dificil", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "zeca", name: "Zeca Pagodinho", alias: ["zeca"], genero: "samba", subgenero: "pagode", cover: "/bandas/zeca.jpg",
    bg1: "#1E4023", bg2: "#E0B04B", tag: "Roda de samba",
    som: { corda: "nylon", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "ukulele"] },
  { id: "fundo-de-quintal", name: "Fundo de Quintal", genero: "samba", subgenero: "pagode", cover: "/bandas/fundo-de-quintal.jpg",
    bg1: "#2B3A2B", bg2: "#D9B25F", tag: "Cavaco e tantã",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "brilhante" },
    instrumentos: ["ukulele", "violao"] },
  { id: "jorge-aragao", name: "Jorge Aragão", genero: "samba", subgenero: "samba", cover: "/bandas/jorge-aragao.jpg",
    bg1: "#33241B", bg2: "#C87800", tag: "Partido alto",
    som: { corda: "nylon", captacao: "passiva", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao", "ukulele"] },

  /* ——— folk ——— */
  { id: "fleet-foxes", name: "Fleet Foxes", genero: "folk", subgenero: "folk barroco", cover: "/bandas/fleet-foxes.jpg",
    bg1: "#E3E0D3", bg2: "#4A6B52", tag: "Voz em camadas",
    som: { corda: "aco", captacao: "nenhuma", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "mumford", name: "Mumford & Sons", alias: ["mumford"], genero: "folk", subgenero: "folk rock", cover: "/bandas/mumford.jpg",
    bg1: "#241C16", bg2: "#C08A3E", tag: "Palhetada corrida",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["violao", "baixo", "bateria"] },
  { id: "bon-iver", name: "Bon Iver", genero: "folk", subgenero: "folk intimista", cover: "/bandas/bon-iver.jpg",
    bg1: "#1C2228", bg2: "#8FA6A6", tag: "Quarto e reverb",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "suave" },
    instrumentos: ["violao", "teclado"] },
  { id: "bob-dylan", name: "Bob Dylan", alias: ["dylan"], genero: "folk", subgenero: "folk clássico", cover: "/bandas/bob-dylan.jpg",
    bg1: "#E6DCC8", bg2: "#5A4632", tag: "Violão e gaita",
    som: { corda: "aco", captacao: "nenhuma", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "sopro"] },
  { id: "tiago-iorc", name: "Tiago Iorc", genero: "folk", subgenero: "folk br", cover: "/bandas/tiago-iorc.jpg",
    bg1: "#EDE6DA", bg2: "#A8582E", tag: "Voz e dedilhado",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao"] },

  /* ——— blues e jazz ——— */
  { id: "bb-king", name: "B.B. King", genero: "blues", subgenero: "blues elétrico", cover: "/bandas/bb-king.jpg",
    bg1: "#1A1208", bg2: "#C9A227", tag: "Bend e vibrato",
    som: { corda: "aco", captacao: "humbucker", nivel: "dificil", ataque: "brilhante" },
    instrumentos: ["guitarra"] },
  { id: "srv", name: "Stevie Ray Vaughan", alias: ["srv", "stevie"], genero: "blues", subgenero: "blues texano", cover: "/bandas/srv.jpg",
    bg1: "#22160F", bg2: "#B5472A", tag: "Strato brava",
    som: { corda: "aco", captacao: "single", nivel: "dificil", ataque: "agressivo" },
    instrumentos: ["guitarra"] },
  { id: "wes", name: "Wes Montgomery", alias: ["wes"], genero: "blues", subgenero: "jazz", cover: "/bandas/wes.jpg",
    bg1: "#12212B", bg2: "#C08A3E", tag: "Polegar e oitava",
    som: { corda: "aco", captacao: "humbucker", nivel: "dificil", ataque: "suave" },
    instrumentos: ["guitarra"] },
  { id: "miles", name: "Miles Davis", genero: "blues", subgenero: "jazz modal", cover: "/bandas/miles.jpg",
    bg1: "#0E1116", bg2: "#5C7C8A", tag: "Trompete e silêncio",
    som: { corda: "ambos", captacao: "nenhuma", nivel: "dificil", ataque: "suave" },
    instrumentos: ["sopro", "teclado", "baixo"] },
  { id: "baden", name: "Baden Powell", genero: "blues", subgenero: "samba jazz", cover: "/bandas/baden.jpg",
    bg1: "#1E2A22", bg2: "#D9A441", tag: "Nylon virtuoso",
    som: { corda: "nylon", captacao: "nenhuma", nivel: "dificil", ataque: "agressivo" },
    instrumentos: ["violao"] },

  /* ——— pop ——— */
  { id: "taylor", name: "Taylor Swift", alias: ["taylor"], genero: "pop", subgenero: "pop folk", cover: "/bandas/taylor.jpg",
    bg1: "#F0E4E9", bg2: "#6E5A7A", tag: "Violão e refrão",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "teclado"] },
  { id: "ed-sheeran", name: "Ed Sheeran", alias: ["sheeran"], genero: "pop", subgenero: "pop acústico", cover: "/bandas/ed-sheeran.jpg",
    bg1: "#F2E8DC", bg2: "#C0442E", tag: "Loop e percussão no tampo",
    som: { corda: "aco", captacao: "passiva", nivel: "medio", ataque: "agressivo" },
    instrumentos: ["violao"] },
  { id: "anavitoria", name: "Anavitória", genero: "pop", subgenero: "pop br", cover: "/bandas/anavitoria.jpg",
    bg1: "#F3ECE0", bg2: "#8C9E6E", tag: "Dueto e violão",
    som: { corda: "nylon", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao"] },
  { id: "melim", name: "Melim", genero: "pop", subgenero: "pop br", cover: "/bandas/melim.jpg",
    bg1: "#E9EDF0", bg2: "#3E7CB1", tag: "Leve e solar",
    som: { corda: "nylon", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao", "ukulele"] },
  { id: "jack-johnson", name: "Jack Johnson", genero: "pop", subgenero: "pop praia", cover: "/bandas/jack-johnson.jpg",
    bg1: "#E7E2CF", bg2: "#4E7A54", tag: "Praia e batida solta",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "suave" },
    instrumentos: ["violao", "ukulele"] },
  { id: "coldplay", name: "Coldplay", genero: "pop", subgenero: "pop rock", cover: "/bandas/coldplay.jpg",
    bg1: "#12203A", bg2: "#E8C34A", tag: "Arena e piano",
    som: { corda: "aco", captacao: "passiva", nivel: "facil", ataque: "brilhante" },
    instrumentos: ["violao", "guitarra", "teclado"] },
];

export function bandsPorGenero(g: Genero): Band[] {
  return BANDS.filter((b) => b.genero === g);
}

export function bandsPorInstrumento(i: Instrumento): Band[] {
  return BANDS.filter((b) => b.instrumentos.includes(i));
}

export function acharBand(id: string): Band | undefined {
  return BANDS.find((b) => b.id === id);
}

/** Busca por nome ou apelido, sem acento e sem caixa. */
export function buscarBands(termo: string, universo: Band[] = BANDS): Band[] {
  const t = normalizar(termo);
  if (!t) return universo;
  return universo.filter(
    (b) =>
      normalizar(b.name).includes(t) ||
      normalizar(b.subgenero).includes(t) ||
      normalizar(b.tag).includes(t) ||
      (b.alias ?? []).some((a) => normalizar(a).includes(t)),
  );
}

export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/* A moda de cada eixo. Empate resolve pela banda marcada primeiro, que é a que
   o cliente pensou antes — ordem de clique é informação, não ruído. */
export function somMedio(bands: Band[]): Som | undefined {
  if (!bands.length) return undefined;
  const moda = <K extends keyof Som>(campo: K): Som[K] => {
    const contagem = new Map<Som[K], number>();
    for (const b of bands) {
      const v = b.som[campo];
      contagem.set(v, (contagem.get(v) ?? 0) + 1);
    }
    let melhor = bands[0].som[campo];
    let max = 0;
    for (const b of bands) {
      const v = b.som[campo];
      const n = contagem.get(v) ?? 0;
      if (n > max) {
        max = n;
        melhor = v;
      }
    }
    return melhor;
  };
  return {
    corda: moda("corda"),
    captacao: moda("captacao"),
    nivel: moda("nivel"),
    ataque: moda("ataque"),
  };
}
