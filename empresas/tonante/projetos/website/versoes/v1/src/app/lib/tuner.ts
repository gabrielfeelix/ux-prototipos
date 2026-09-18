/* tuner — matemática de afinação e motor de áudio do Afinador Tonante.
 *
 * Fica separado de `strum.ts` de propósito: lá o objetivo é soar bonito (um
 * acorde de vitrine, frequências fixas). Aqui o objetivo é soar CERTO — nota
 * única, frequência derivada do lá de referência que o visitante escolheu.
 *
 * Toda nota é guardada como número MIDI, não como Hz. Hz depende do lá de
 * referência (440 padrão, 432 e 415 barroco existem); MIDI não depende de
 * nada. Guardar Hz obrigaria a recalcular a tabela inteira a cada mudança. */

export const LETRAS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
/* O brasileiro aprende dó-ré-mi e lê a cifra em letra. A página mostra os
   dois: letra grande (é o que está escrito no afinador de pedal) e o nome
   falado embaixo, que é como o professor pede a corda. */
export const LATINOS = ["dó", "dó#", "ré", "ré#", "mi", "fá", "fá#", "sol", "sol#", "lá", "lá#", "si"];

export const A4_MIDI = 69;

export function freqDe(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - A4_MIDI) / 12);
}
export function letraDe(midi: number): string {
  return LETRAS[((Math.round(midi) % 12) + 12) % 12];
}
export function latinoDe(midi: number): string {
  return LATINOS[((Math.round(midi) % 12) + 12) % 12];
}
export function oitavaDe(midi: number): number {
  return Math.floor(Math.round(midi) / 12) - 1;
}
/** Distância em cents de `hz` até `alvo`. Positivo = acima (apertar demais). */
export function centsEntre(hz: number, alvo: number): number {
  return 1200 * Math.log2(hz / alvo);
}

/* ── contexto de áudio ──────────────────────────────────────────────────── */

let ctx: AudioContext | null = null;
/** AudioContext único da página. Só nasce no primeiro gesto do visitante. */
export function contexto(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export type Voz = { parar: () => void };

/* ── corda dedilhada (Karplus-Strong) ───────────────────────────────────── */

const cache = new Map<string, AudioBuffer>();

/* Ruído → linha de atraso → média móvel. `brilho` de 0 a 1 filtra a excitação
   antes de entrar no anel: nylon é opaco, aço de guitarra é vidro.
   O decaimento é calculado por SEGUNDO, não por volta do anel — senão a corda
   aguda morre em meio segundo e o bordão fica ressoando dez. */
function bufferDeCorda(c: AudioContext, hz: number, seg: number, brilho: number): AudioBuffer {
  const chave = `${hz.toFixed(2)}:${seg}:${brilho}`;
  const pronto = cache.get(chave);
  if (pronto) return pronto;

  const sr = c.sampleRate;
  const N = Math.max(2, Math.round(sr / hz));
  const total = Math.round(sr * seg);
  const buf = c.createBuffer(1, total, sr);
  const out = buf.getChannelData(0);

  // excitação: ruído passado por um polo simples (quanto menor o brilho, mais escuro)
  const anel = new Float32Array(N);
  const a = 0.15 + brilho * 0.8;
  let z = 0;
  for (let i = 0; i < N; i++) {
    z += a * (Math.random() * 2 - 1 - z);
    anel[i] = z;
  }
  // normaliza a excitação: o polo derruba a energia e o bordão saía inaudível
  let pico = 1e-6;
  for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(anel[i]));
  for (let i = 0; i < N; i++) anel[i] /= pico;

  const rho = Math.pow(0.0015, 1 / (seg * sr)); // amplitude → 0.0015 ao fim de `seg`
  let i = 0;
  for (let n = 0; n < total; n++) {
    const atual = anel[i];
    const prox = anel[(i + 1) % N];
    out[n] = atual;
    anel[i] = (atual + prox) * 0.5 * rho;
    i = (i + 1) % N;
  }
  cache.set(chave, buf);
  return buf;
}

/** Uma palhetada na frequência exata. `onFim` dispara quando o som acaba. */
export function dedilhar(hz: number, brilho: number, onFim: () => void): Voz {
  const c = contexto();
  const seg = hz < 90 ? 4.2 : hz < 200 ? 3.6 : 2.8;

  const fonte = c.createBufferSource();
  fonte.buffer = bufferDeCorda(c, hz, seg, brilho);

  const corpo = c.createBiquadFilter();
  corpo.type = "lowpass";
  corpo.frequency.value = 900 + brilho * 5200;
  corpo.Q.value = 0.5;

  const saida = c.createGain();
  saida.gain.value = 0.62;

  fonte.connect(corpo);
  corpo.connect(saida);
  saida.connect(c.destination);
  fonte.start();

  const t = window.setTimeout(onFim, seg * 1000);
  let morto = false;
  const parar = () => {
    if (morto) return;
    morto = true;
    window.clearTimeout(t);
    // rampa de 60ms: cortar o gain em seco estala no alto-falante
    const agora = c.currentTime;
    saida.gain.cancelScheduledValues(agora);
    saida.gain.setValueAtTime(saida.gain.value, agora);
    saida.gain.linearRampToValueAtTime(0.0001, agora + 0.06);
    window.setTimeout(() => { try { fonte.stop(); } catch { /* já parou */ } }, 90);
    onFim();
  };
  return { parar };
}

/* ── nota contínua ──────────────────────────────────────────────────────── */

/* Para afinar de ouvido é melhor um tom que não some. Três parciais em vez de
   senoide pura: senoide sozinha some no meio do barulho do ambiente e é difícil
   de comparar com a corda, que é rica em harmônicos. */
export function segurar(hz: number, brilho: number): Voz {
  const c = contexto();
  const mestre = c.createGain();
  mestre.gain.setValueAtTime(0.0001, c.currentTime);
  mestre.gain.exponentialRampToValueAtTime(0.34, c.currentTime + 0.05);
  mestre.connect(c.destination);

  const pesos = [1, 0.3 + brilho * 0.2, 0.12 + brilho * 0.16];
  const oscs = pesos.map((peso, n) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = hz * (n + 1);
    const g = c.createGain();
    g.gain.value = peso * 0.5;
    o.connect(g);
    g.connect(mestre);
    o.start();
    return o;
  });

  let morto = false;
  return {
    parar: () => {
      if (morto) return;
      morto = true;
      const agora = c.currentTime;
      mestre.gain.cancelScheduledValues(agora);
      mestre.gain.setValueAtTime(mestre.gain.value, agora);
      mestre.gain.exponentialRampToValueAtTime(0.0001, agora + 0.08);
      window.setTimeout(() => oscs.forEach((o) => { try { o.stop(); } catch { /* já parou */ } }), 120);
    },
  };
}

/* ── escuta pelo microfone ──────────────────────────────────────────────── */

/* Autocorrelação no domínio do tempo. A janela de lags é limitada a 32–1024
   amostras (≈43 Hz a 1,4 kHz a 44,1 kHz): varrer o buffer inteiro é O(n²) e
   derruba o frame rate sem ganhar nada — corda de instrumento não passa disso. */
function detectar(buf: Float32Array, sr: number): number | null {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.006) return null; // silêncio: não inventa nota

  const lagMin = 32;
  const lagMax = Math.min(1024, n - 1);
  const c = new Float32Array(lagMax + 1);
  for (let lag = lagMin; lag <= lagMax; lag++) {
    let soma = 0;
    for (let i = 0; i < n - lag; i++) soma += buf[i] * buf[i + lag];
    c[lag] = soma / (n - lag); // normaliza pelo nº de termos, senão lag curto sempre vence
  }

  let melhor = -1;
  let pos = -1;
  for (let lag = lagMin + 1; lag < lagMax; lag++) {
    if (c[lag] > c[lag - 1] && c[lag] >= c[lag + 1] && c[lag] > melhor) {
      melhor = c[lag];
      pos = lag;
    }
  }
  if (pos < 0 || melhor <= 0) return null;

  // interpolação parabólica no pico: sem ela a leitura pula de 10 em 10 cents
  const y0 = c[pos - 1];
  const y1 = c[pos];
  const y2 = c[pos + 1];
  const d = y0 + y2 - 2 * y1;
  const periodo = d !== 0 ? pos - (y2 - y0) / (2 * d) : pos;
  const hz = sr / periodo;
  return hz > 24 && hz < 1500 ? hz : null;
}

export type ParadaDaEscuta = () => void;

/** Liga o microfone e devolve a frequência ~14×/s (null = silêncio). */
export async function escutar(aoDetectar: (hz: number | null) => void): Promise<ParadaDaEscuta> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      // o processamento do navegador é feito pra voz e destrói o sustain da corda
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });
  const c = contexto();
  const fonte = c.createMediaStreamSource(stream);
  const analisador = c.createAnalyser();
  analisador.fftSize = 2048;
  fonte.connect(analisador);

  const buf = new Float32Array(analisador.fftSize);
  let vivo = true;
  const tick = () => {
    if (!vivo) return;
    analisador.getFloatTimeDomainData(buf);
    aoDetectar(detectar(buf, c.sampleRate));
  };
  const timer = window.setInterval(tick, 70);

  return () => {
    vivo = false;
    window.clearInterval(timer);
    try { fonte.disconnect(); } catch { /* já desconectado */ }
    stream.getTracks().forEach((t) => t.stop());
  };
}
