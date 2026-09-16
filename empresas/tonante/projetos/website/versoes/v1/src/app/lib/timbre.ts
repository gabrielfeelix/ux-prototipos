import type { Product } from "../components/productsData";

/* timbre — amostras REAIS por família de instrumento (V3 §8.1).
   Complementa strum.ts: quando existe amostra, ela ganha do sintetizado.

   Procedência: todos os arquivos vêm do Wikimedia Commons em CC0 ou domínio
   público (uso comercial liberado, atribuição não obrigatória). Ver
   public/audio/CREDITOS.json para origem, licença e ponto de corte de cada um.

   Honestidade: NÃO são gravações dos instrumentos da Tonante. São amostras de
   referência do tipo de instrumento. O player rotula como tal — só
   product.audioSample pode ser anunciado como "gravado com este modelo". */

export type Family =
  | "violao-nylon"
  | "violao-aco"
  | "viola"
  | "ukulele"
  | "cavaco"
  | "guitarra"
  | "baixo"
  | "bateria"
  | "teclado"
  | "flauta";

/* Cavaquinho em domínio público não existe — o acervo do Commons para
   "cavaquinho" são gravações de choro de 1908-1913, conjunto inteiro em
   cilindro de cera, inservíveis. O cavaco empresta as amostras de bandolim:
   corda de aço, corpo pequeno, ataque brilhante — o vizinho mais próximo. */
const DIR: Record<Family, string> = {
  "violao-nylon": "violao-nylon",
  "violao-aco": "violao-aco",
  viola: "viola",
  ukulele: "ukulele",
  cavaco: "viola",
  guitarra: "guitarra",
  baixo: "baixo",
  bateria: "bateria",
  teclado: "teclado",
  flauta: "flauta",
};

/** Quantos arquivos existem em public/audio/<pasta>/. */
const POOL: Record<Family, number> = {
  "violao-nylon": 20,
  "violao-aco": 4,
  viola: 4,
  ukulele: 4,
  cavaco: 4,
  guitarra: 2,
  baixo: 2,
  bateria: 4,
  teclado: 4,
  flauta: 3,
};

/** Família sonora do produto. null = não emite som (suporte, cabo, estante). */
export function familyForProduct(p: Pick<Product, "name" | "category">): Family | null {
  const n = p.name.toLowerCase();

  // viola caipira e ukulele moram dentro de "Violões" mas não soam como violão.
  // \bviolas?\b não casa com "violao"/"violão" — a letra seguinte é de palavra.
  if (/\bviolas?\b/.test(n)) return "viola";
  if (n.includes("ukulele")) return "ukulele";
  if (n.includes("cavac") || n.includes("cavaq")) return "cavaco";

  /* Bateria, teclado e flauta não têm categoria própria no catálogo (a flauta e
     os Casiotone moram em "Acessórios"), então a família vem do nome. O guarda
     abaixo evita que acessório que só cita o instrumento — suporte de teclado,
     banqueta de piano, kit de microfone para bateria — ganhe som. */
  if (!/suporte|banqueta|pedestal|estante|microfone|capa\b|bag\b|cabo|apoio/.test(n)) {
    if (n.includes("bateria")) return "bateria";
    if (n.includes("teclado") || n.includes("piano")) return "teclado";
    if (n.includes("flauta")) return "flauta";
  }

  switch (p.category) {
    case "Violões":
      return n.includes("nylon") || n.includes("lorenzzo") || n.includes("clássic") || n.includes("classic")
        ? "violao-nylon"
        : "violao-aco";
    case "Baterias":
      return "bateria";
    case "Guitarras":
      return "guitarra";
    case "Contrabaixos":
      return "baixo";
    case "Cordas & Encordoamentos":
      if (n.includes("baixo")) return "baixo";
      if (n.includes("guitarra")) return "guitarra";
      if (n.includes("nylon")) return "violao-nylon";
      if (n.includes("violao") || n.includes("violão")) return "violao-aco";
      return null; // encordoamento de bandolim, banjo etc.: sem amostra própria
    default:
      return null;
  }
}

/* FNV-1a de 32 bits. Escolha estável: o mesmo produto recebe sempre a mesma
   amostra, em qualquer render, sessão ou máquina. Math.random daria som
   diferente a cada clique — leitura de site quebrado, não de variedade. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Caminho da amostra do produto, ou null se a família não tiver acervo. */
export function sampleForProduct(p: Pick<Product, "id" | "name" | "category">): string | null {
  const fam = familyForProduct(p);
  if (!fam) return null;
  const n = POOL[fam];
  if (!n) return null;
  const idx = (hash(`${p.id}-${p.name}`) % n) + 1;
  return `/audio/${DIR[fam]}/${String(idx).padStart(2, "0")}.mp3`;
}

/* Um áudio por página. O synth já tem o seu mata-mata em strum.ts; aqui vale
   o mesmo contrato para as amostras, senão o play do card e o da PDP tocam
   juntos e viram ruído. */
let tocando: HTMLAudioElement | null = null;

export function stopSample() {
  if (tocando) { tocando.pause(); tocando = null; }
}

/** Toca a amostra e devolve o cancelador (mesma assinatura de playStrum). */
export function playSample(src: string, onEnd: () => void): () => void {
  stopSample();
  const audio = new Audio(src);
  tocando = audio;
  audio.onended = () => { if (tocando === audio) tocando = null; onEnd(); };
  void audio.play();
  return () => { audio.pause(); if (tocando === audio) tocando = null; };
}
