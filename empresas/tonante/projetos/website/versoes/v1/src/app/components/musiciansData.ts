// musiciansData — Músicos Tonante (V3 §4.4).
// ⚠️ PLACEHOLDER: nomes, fotos, vídeos e depoimentos são fictícios/banco de
// imagem, apenas para demonstração de layout. Trocar pelo elenco real
// (assets Oderço) antes de qualquer publicação.
export interface Musician {
  id: string;
  name: string;
  city?: string;
  role: string;
  /** retrato 3:4 — tratado P&B via CSS no card */
  photo: string;
  /** mp4 vertical 9:16; ausente → modal mostra a foto grande */
  video?: string;
  quote: string;
  instagram?: string;
  /** instrumento que usa → lookup em productsData */
  productId?: number;
  /** fallback de texto quando productId não resolve */
  instrumentLabel: string;
}

const u = (id: string) => `https://images.unsplash.com/${id}?w=720&q=80&auto=format&fit=crop`;

/* Os arquivos reais moram em `public/musicos/`, um par por músico nomeado pelo
   `id` daqui: `<id>.mp4` (reel 9:16, H.264) e `<id>.jpg` (poster). Servidos em
   `/musicos/<id>.mp4`. Requisitos de codec, corte e peso: public/musicos/LEIA-ME.md.
   Ex.: photo: "/musicos/rafael-monteiro.jpg", video: "/musicos/rafael-monteiro.mp4". */

// Vídeos de amostra (paisagem, cropados pelo card 4:5) — só pra demo.
const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const SAMPLE_VIDEO_2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";

export const MUSICIANS: Musician[] = [
  {
    id: "rafael-monteiro",
    name: "Rafael Monteiro",
    city: "São Paulo · SP",
    role: "Violonista",
    photo: u("photo-1510915361894-db8b60106cb1"),
    video: SAMPLE_VIDEO,
    quote:
      "Meu primeiro violão foi um Tonante emprestado do meu tio. Vinte anos depois, subo no palco com um Coral — fechou um ciclo.",
    instagram: "@rafamonteiro.violao",
    productId: 52,
    instrumentLabel: "Violão Coral",
  },
  {
    id: "luiza-ferraz",
    name: "Luiza Ferraz",
    city: "Belo Horizonte · MG",
    role: "Guitarrista",
    photo: u("photo-1516924962500-2b4b3b99ea02"),
    video: SAMPLE_VIDEO_2,
    quote:
      "A Valentine's tem o timbre que eu procurei em guitarra importada e não achei. E ainda conta uma história que é nossa.",
    instagram: "@luizaferraz.gtr",
    productId: 13,
    instrumentLabel: "Guitarra Valentine's",
  },
  {
    /* Único com material real: o vídeo saiu do institucional da Tonante
       (Conceito.mp4, trecho 14,7s–17,7s), já recortado em 4:5 pro card. Nome,
       cidade, depoimento e @ continuam fictícios. */
    id: "andre-batista",
    name: "André Batista",
    city: "Curitiba · PR",
    role: "Violeiro",
    photo: "/musicos/andre-batista.jpg",
    video: "/musicos/andre-batista.mp4",
    quote:
      "Viola é instrumento de quem tem paciência. Afina diferente, pensa diferente — e quando abre, abre bonito.",
    instagram: "@andrebatista.viola",
    productId: 221,
    instrumentLabel: "Viola Tonante Black",
  },
  {
    /* Material real: MVI_9386, trecho 2s–20s. O arquivo veio deitado (4K em
       paisagem, sem metadado de rotação), então foi girado 90° anti-horário
       antes do recorte 4:5. O áudio NÃO é o da câmera: é gravacao-violao.wav,
       cortado no mesmo offset de 2s, que é como ele foi gravado.
       ⚠️ PLACEHOLDER: nome, cidade, depoimento e @ são fictícios — o músico
       não foi identificado. */
    id: "thiago-nunes",
    name: "Thiago Nunes",
    city: "Goiânia · GO",
    role: "Violonista",
    photo: "/musicos/thiago-nunes.jpg",
    video: "/musicos/thiago-nunes.mp4",
    quote:
      "Comprei pelo som e fiquei pelo desenho da madeira. Não tem dois iguais — o meu tem um veio que corta o tampo inteiro.",
    instagram: "@thiagonunes.violao",
    productId: 285,
    instrumentLabel: "Violão Zebrano Cutaway",
  },
  {
    /* Material real: vídeo "Alfredo - Jacksons five", do início até 47,5s —
       depois disso entra a cartela de marca, que em loop não serve. Tinha
       pillarbox (conteúdo útil 1010x1846+36+30), removido no recorte.
       A guitarra é a Edição 70 Anos Metallic Blue do catálogo (id 277): corpo
       offset, dois humbuckers e blocos de madrepérola batem com o vídeo.
       ⚠️ Alfredo é pessoa real identificada pelo nome do arquivo: cidade e @
       ficaram vazios e o depoimento é PLACEHOLDER. */
    id: "alfredo",
    name: "Alfredo",
    role: "Guitarrista",
    photo: "/musicos/alfredo.jpg",
    video: "/musicos/alfredo.mp4",
    quote: "PLACEHOLDER — depoimento a colher com o músico.",
    productId: 277,
    instrumentLabel: "Guitarra 70 Anos Metallic Blue",
  },
  {
    /* Material real: vídeo "Paulo André - Billie jean", trecho 20s–28s, cortado
       em 4:5 acima da legenda queimada. O instrumento é o Jazzmine Yellow Cake
       do catálogo (id 19) — bate com o do vídeo: corpo creme, escudo branco,
       4 cordas.
       ⚠️ Paulo André é pessoa real identificada pelo nome do arquivo, então
       cidade e @ ficaram vazios e o depoimento abaixo é PLACEHOLDER: nada disso
       pode ir ao ar sem ele dizer. O depoimento só aparece no modal, que hoje
       está fora de uso. */
    id: "paulo-andre",
    name: "Paulo André",
    role: "Baixista",
    photo: "/musicos/paulo-andre.jpg",
    video: "/musicos/paulo-andre.mp4",
    quote: "PLACEHOLDER — depoimento a colher com o músico.",
    productId: 19,
    instrumentLabel: "Contrabaixo Jazzmine",
  },
  {
    /* Material real: mesmo institucional da Tonante (Conceito.mp4), trecho
       18,0s–19,85s — a cena da feira, que termina em 19,95s. Nome, cidade,
       depoimento e @ são fictícios. */
    id: "rogerio-alves",
    name: "Rogério Alves",
    city: "São Paulo · SP",
    role: "Cavaquinista",
    photo: "/musicos/rogerio-alves.jpg",
    video: "/musicos/rogerio-alves.mp4",
    quote:
      "Toco onde der: feira, calçada, quintal. Cavaquinho tem que caber embaixo do braço e aguentar o dia inteiro.",
    instagram: "@rogerioalves.cavaco",
    productId: 284,
    instrumentLabel: "Cavaquinho Tonante Natural",
  },
  {
    id: "camila-rocha",
    name: "Camila Rocha",
    city: "Recife · PE",
    role: "Professora de violão",
    photo: u("photo-1525201548942-d8732f6617a0"),
    video: SAMPLE_VIDEO,
    quote:
      "Todo semestre vejo alunos começarem num Lorenzzo. O nylon macio segura o aluno nos três primeiros meses — o resto é história.",
    instagram: "@camilarocha.aulas",
    productId: 25,
    instrumentLabel: "Violão Lorenzzo",
  },
  {
    id: "diego-santana",
    name: "Diego Santana",
    city: "Rio de Janeiro · RJ",
    role: "Guitarrista de estúdio",
    photo: u("photo-1471478331149-c72f17e33c73"),
    quote:
      "A Star Light virou minha guitarra de sessão. Vintage no visual, estável na afinação — o engenheiro de som agradece.",
    instagram: "@diegosantana.studio",
    productId: 38,
    instrumentLabel: "Guitarra Star Light",
  },
  {
    id: "marina-lopes",
    name: "Marina Lopes",
    city: "Porto Alegre · RS",
    role: "Cantora e compositora",
    photo: u("photo-1493225457124-a3eb161ffa5f"),
    video: SAMPLE_VIDEO_2,
    quote:
      "Componho no Ônix. O som encorpado preenche a sala sozinho — voz e violão, mais nada. É disso que minha música precisa.",
    instagram: "@marinalopes.mus",
    productId: 62,
    instrumentLabel: "Violão Ônix",
  },
];
