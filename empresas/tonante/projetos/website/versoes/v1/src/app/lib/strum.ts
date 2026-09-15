import type { Product } from "../components/productsData";

/* strum — dedilhado sintetizado Karplus-Strong (V3 §8.1).
   Extraído de LinhasDeViolao; vira a fonte única de timbre simulado do site.
   Zero assets: ruído → delay line → média móvel; brilho via lowpass.
   Honestidade: TODO player que usa isto rotula "timbre simulado". */

export type Strum = { notes: number[]; cutoff: number; gapMs: number; dur: number };

export const STRUMS: Record<string, Strum> = {
  //                 E2     B2      E3      G3   B3      E4
  Coral:    { notes: [82.41, 123.47, 164.81, 196, 246.94, 329.63], cutoff: 1900, gapMs: 85,  dur: 3.0 }, // Em encorpado
  Volcano:  { notes: [82.41, 123.47, 164.81, 207.65, 246.94, 329.63], cutoff: 3600, gapMs: 45, dur: 3.0 }, // E maior, ataque de palco
  Etna:     { notes: [130.81, 164.81, 196, 246.94, 329.63], cutoff: 2600, gapMs: 70, dur: 3.4 },          // Cmaj7 premium
  "Ônix":   { notes: [110, 164.81, 220, 261.63, 329.63], cutoff: 2000, gapMs: 60, dur: 3.0 },             // Am atitude
  Citrino:  { notes: [146.83, 220, 293.66, 369.99], cutoff: 4200, gapMs: 38, dur: 2.6 },                  // D claro e rápido
  Lorenzzo: { notes: [110, 164.81, 220, 261.63, 329.63, 261.63], cutoff: 1500, gapMs: 150, dur: 3.6 },    // Am dedilhado nylon
  // presets por categoria (PDP)
  Guitarra: { notes: [82.41, 123.47, 164.81, 207.65, 246.94, 329.63], cutoff: 5200, gapMs: 30, dur: 2.6 }, // E aberto brilhante
  Baixo:    { notes: [41.2, 55, 73.42, 98], cutoff: 760, gapMs: 220, dur: 3.8 },                           // E1-A1-D2-G2 groove
  // viola caipira: 10 cordas em 5 pares, cebolao mi (E-B-G#-E-B), oitavas nos bordoes
  Viola:    { notes: [123.47, 246.94, 164.81, 329.63, 207.65, 246.94, 329.63], cutoff: 5400, gapMs: 26, dur: 2.4 },
  // ukulele soprano: GCEA reentrante, 4ª corda aguda
  Ukulele:  { notes: [392, 261.63, 329.63, 440], cutoff: 5600, gapMs: 24, dur: 1.9 },
  // cavaquinho: 4 cordas de aço, DGBD, brilhante e curto
  Cavaco:   { notes: [293.66, 392, 493.88, 587.33], cutoff: 6400, gapMs: 20, dur: 1.7 },
};

let audioCtx: AudioContext | null = null;
const pluckCache = new Map<string, AudioBuffer>();
// um som por vez no site inteiro (V3 §8.1)
let currentCancel: (() => void) | null = null;

function pluckBuffer(ctx: AudioContext, freq: number, dur: number): AudioBuffer {
  const key = `${freq.toFixed(2)}:${dur}`;
  const hit = pluckCache.get(key);
  if (hit) return hit;
  const sr = ctx.sampleRate;
  const N = Math.max(2, Math.round(sr / freq));
  const len = Math.round(sr * dur);
  const buf = ctx.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  const ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1; // excitação
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const cur = ring[idx];
    const nxt = ring[(idx + 1) % N];
    out[i] = cur;
    ring[idx] = (cur + nxt) * 0.5 * 0.9965; // média móvel + decaimento
    idx = (idx + 1) % N;
  }
  pluckCache.set(key, buf);
  return buf;
}

/** Para qualquer timbre em execução (sintetizado). */
export function stopStrum() {
  currentCancel?.();
  currentCancel = null;
}

/** Toca o preset; retorna cancel. Sempre interrompe o anterior. */
export function playStrum(presetKey: string, onEnd: () => void): () => void {
  stopStrum();
  const s = STRUMS[presetKey] ?? STRUMS.Coral;
  audioCtx ??= new AudioContext();
  const ctx = audioCtx;
  if (ctx.state === "suspended") void ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.55;
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = s.cutoff;
  tone.Q.value = 0.4;
  const comp = ctx.createDynamicsCompressor();
  tone.connect(master); master.connect(comp); comp.connect(ctx.destination);

  const sources: AudioBufferSourceNode[] = [];
  const t0 = ctx.currentTime + 0.04;
  s.notes.forEach((f, i) => {
    const src = ctx.createBufferSource();
    src.buffer = pluckBuffer(ctx, f, s.dur);
    const g = ctx.createGain();
    g.gain.value = 0.34;
    src.connect(g); g.connect(tone);
    src.start(t0 + (i * s.gapMs) / 1000);
    sources.push(src);
  });
  const totalMs = s.notes.length * s.gapMs + s.dur * 1000;
  const timer = setTimeout(() => { currentCancel = null; onEnd(); }, Math.min(totalMs, 4200));
  const cancel = () => {
    clearTimeout(timer);
    sources.forEach((src) => { try { src.stop(); } catch { /* já parou */ } });
    onEnd();
  };
  currentCancel = cancel;
  return cancel;
}

/** Duração estimada do preset (p/ rótulo "· 0:03"). */
export function strumDurationSec(presetKey: string): number {
  const s = STRUMS[presetKey] ?? STRUMS.Coral;
  return Math.min(4.2, (s.notes.length * s.gapMs) / 1000 + s.dur);
}

const LINE_KEYS = ["Coral", "Volcano", "Etna", "Ônix", "Citrino", "Lorenzzo"] as const;

/** Preset de timbre por produto. null = produto não "soa" (suporte, cabo...). */
export function presetForProduct(p: Pick<Product, "name" | "category">): string | null {
  const n = p.name.toLowerCase();
  // linha explícita no nome ganha
  for (const k of LINE_KEYS) {
    if (n.includes(k.toLowerCase()) || (k === "Ônix" && n.includes("onix"))) return k;
  }
  // viola caipira e ukulele vivem dentro de "Violões" mas não soam como violão.
  // \bviola\b nao casa com "violao"/"violão" (letra seguinte e' de palavra).
  if (/\bviolas?\b/.test(n)) return "Viola";
  if (n.includes("ukulele")) return "Ukulele";
  if (n.includes("cavac") || n.includes("cavaq")) return "Cavaco";
  switch (p.category) {
    case "Violões":
      return n.includes("nylon") ? "Lorenzzo" : "Coral";
    case "Guitarras":
      return "Guitarra";
    case "Contrabaixos":
      return "Baixo";
    case "Cordas & Encordoamentos":
      if (n.includes("baixo")) return "Baixo";
      if (n.includes("guitarra")) return "Guitarra";
      if (n.includes("nylon")) return "Lorenzzo";
      if (n.includes("cavaco")) return "Cavaco";
      return "Volcano"; // aço p/ violão
    default:
      return null; // suportes, acessórios, microfones: sem timbre
  }
}
