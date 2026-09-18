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

/* ── corda dedilhada (Karplus-Strong estendido) ─────────────────────────── */

/* O Karplus-Strong cru (ruído → atraso → média móvel) soa plástico. Duas
 * correções de Jaffe & Smith (1983) entraram; uma terceira foi testada e caiu.
 *
 *  1. POSIÇÃO DA PALHETADA. Palhetar a β do comprimento da corda anula os
 *     harmônicos múltiplos de 1/β. É por isso que perto da boca soa redondo e
 *     perto do cavalete soa nasal. Um filtro pente na excitação faz isso, em
 *     quatro linhas.
 *  2. ATRASO FRACIONÁRIO. Este não é timbre, é afinação, e cobriu um erro que
 *     existia calado: a média móvel do laço soma meia amostra ao período, e
 *     meia amostra pesa pouco num bordão de 538 amostras (1,6 cents) e muito
 *     numa prima de 67 (13 cents). O mi do bandolim saía baixo. Agora a fração
 *     é compensada na leitura do anel, por interpolação.
 *  3. DISPERSÃO (rejeitada). A ideia era um allpass no laço para simular a
 *     rigidez da corda, que faz os parciais subirem progressivamente. Medido:
 *     um allpass de primeira ordem desloca TODOS os parciais igual (+4 cents no
 *     2º e no 12º), ou seja, não produz inarmonicidade nenhuma — só desafina.
 *     E desafinava feio: 41 cents no mi do bandolim. Inarmonicidade de verdade
 *     pediria uma cascata de allpasses, e num afinador o preço de errar a nota
 *     é alto demais para um ganho de timbre que quase não se ouve num violão.
 *
 * `gerarCorda` é pura (recebe taxa de amostragem, devolve Float32Array) de
 * propósito: assim dá pra medir a frequência e os parciais do resultado num
 * teste, fora do navegador. */

export type Corpo = {
  /** 0 = nylon opaco, 1 = aço de guitarra. Controla o corte do filtro. */
  brilho: number;
  /** Onde se palheta, em fração do comprimento da corda (0.08 a 0.3). */
  palhetada: number;
};

export function gerarCorda(sr: number, hz: number, seg: number, corpo: Corpo): Float32Array {
  const L = sr / hz;                 // período desejado, em amostras
  const alvo = L - 0.5;              // 0.5 é o atraso de fase da média móvel do laço
  /* Interpolar com a posição SEGUINTE do anel dá atraso N−frac, não N+frac: a
     casa idx+1 é mais nova que idx, não mais velha. Daí `ceil` e não `floor` —
     com floor a corda saía até 43 cents alta, e quanto mais aguda, pior. */
  const N = Math.max(2, Math.ceil(alvo));
  const frac = Math.max(0, Math.min(0.999, N - alvo));

  // excitação: ruído passado por um polo (quanto menor o brilho, mais escuro)
  const anel = new Float32Array(N);
  const a = 0.15 + corpo.brilho * 0.8;
  let z = 0;
  for (let i = 0; i < N; i++) {
    z += a * (Math.random() * 2 - 1 - z);
    anel[i] = z;
  }
  // filtro pente = posição da palhetada
  const d = Math.max(1, Math.min(N - 1, Math.round(corpo.palhetada * N)));
  for (let i = N - 1; i >= d; i--) anel[i] -= anel[i - d];
  // normaliza: o polo e o pente derrubam a energia e o bordão saía inaudível
  let pico = 1e-6;
  for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(anel[i]));
  for (let i = 0; i < N; i++) anel[i] /= pico;

  const total = Math.round(sr * seg);
  const out = new Float32Array(total);
  const rho = Math.pow(0.0015, 1 / (seg * sr)); // amplitude → 0.0015 ao fim de `seg`
  let idx = 0;
  let anterior = 0;
  for (let n = 0; n < total; n++) {
    const i0 = anel[idx];
    const i1 = anel[(idx + 1) % N];
    const lido = i0 + (i1 - i0) * frac;    // atraso N−frac: é o que afina a corda
    out[n] = lido;
    anel[idx] = (lido + anterior) * 0.5 * rho; // filtro do laço: agudo morre antes
    anterior = lido;
    idx = (idx + 1) % N;
  }
  return out;
}

/* O cache é limitado de propósito. A chave inclui a frequência, e a frequência
   muda a cada passo do lá de referência: sem teto, arrastar o diapasão de 415 a
   466 gera 51 jogos de buffers, e um buffer de bordão (4,2 s a 44,1 kHz) pesa
   ~740 kB. Eram centenas de MB presos na aba. Map preserva ordem de inserção,
   então descartar a primeira chave é descartar a mais antiga. */
const LIMITE_DO_CACHE = 24;
const cache = new Map<string, AudioBuffer>();

function bufferDeCorda(c: AudioContext, hz: number, seg: number, corpo: Corpo): AudioBuffer {
  const chave = `${hz.toFixed(2)}:${seg}:${corpo.brilho}:${corpo.palhetada}`;
  const pronto = cache.get(chave);
  if (pronto) { cache.delete(chave); cache.set(chave, pronto); return pronto; } // usada agora, sai por último

  const dados = gerarCorda(c.sampleRate, hz, seg, corpo);
  const buf = c.createBuffer(1, dados.length, c.sampleRate);
  buf.getChannelData(0).set(dados);

  if (cache.size >= LIMITE_DO_CACHE) {
    const maisVelha = cache.keys().next().value;
    if (maisVelha !== undefined) cache.delete(maisVelha);
  }
  cache.set(chave, buf);
  return buf;
}

/** Uma palhetada na frequência exata. `onFim` dispara quando o som acaba. */
export function dedilhar(hz: number, corpo: Corpo, onFim: () => void): Voz {
  const c = contexto();
  const seg = hz < 90 ? 4.2 : hz < 200 ? 3.6 : 2.8;

  const fonte = c.createBufferSource();
  fonte.buffer = bufferDeCorda(c, hz, seg, corpo);

  const tampo = c.createBiquadFilter();
  tampo.type = "lowpass";
  tampo.frequency.value = 900 + corpo.brilho * 5200;
  tampo.Q.value = 0.5;

  const saida = c.createGain();
  saida.gain.value = 0.62;

  fonte.connect(tampo);
  tampo.connect(saida);
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

/* Detecção de altura pelo NSDF (McLeod Pitch Method).
 *
 * A autocorrelação crua NÃO serve aqui, e isso custou uma rodada de teste: ela
 * dá um pico igualmente alto no DOBRO do período, então o lá de 110 Hz era lido
 * como 55 Hz — uma oitava abaixo. O NSDF normaliza cada atraso pela energia do
 * trecho comparado e, principalmente, a escolha do pico é a primeira crista
 * acima de 90% da maior, não a maior: é isso que trava a leitura no período
 * fundamental em vez de num múltiplo dele.
 *
 * A correlação sai por FFT, não por força bruta. Wiener-Khinchin: a
 * autocorrelação é a transformada inversa do espectro de potência, ou seja
 * IFFT(|FFT(x)|²). A conta direta custava 4096 × 1470 ≈ 6 milhões de
 * multiplicações por leitura; por FFT são ~320 mil, e o custo deixa de crescer
 * com o número de atrasos procurados. Medido no desktop dava 12 ms, o que num
 * celular quatro vezes mais lento comia 80% do intervalo entre leituras e
 * ameaçava travar a animação da corda.
 *
 * O denominador do NSDF vem da recorrência da seção 6 do paper de McLeod &
 * Wyvill: m(τ) = m(τ−1) − x[τ−1]² − x[W−τ]². Sem ela, somar a energia de cada
 * janela seria O(n) por atraso e devolveria o O(n²) pela porta dos fundos. */
const LAG_MIN = 30;
const LAG_MAX = 1500;
const CORTE_DO_PICO = 0.9;

/* FFT radix-2 iterativa, no lugar. Cabe em trinta linhas e evita arrastar uma
   dependência inteira para uma única conta. */
function fft(re: Float64Array, im: Float64Array, inversa = false): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr;
      const ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }
  for (let passo = 2; passo <= n; passo <<= 1) {
    const ang = ((inversa ? 2 : -2) * Math.PI) / passo;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    const meio = passo >> 1;
    for (let i = 0; i < n; i += passo) {
      let cr = 1;
      let ci = 0;
      for (let j = 0; j < meio; j++) {
        const a = i + j;
        const b = a + meio;
        const vr = re[b] * cr - im[b] * ci;
        const vi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - vr; im[b] = im[a] - vi;
        re[a] += vr;        im[a] += vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
  if (inversa) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}

/* buffers reaproveitados: alocar 8192 amostras doze vezes por segundo dá
   trabalho ao coletor de lixo bem no meio da animação da corda */
let reBuf: Float64Array | null = null;
let imBuf: Float64Array | null = null;

export function detectar(buf: Float32Array, sr: number, faixa?: [number, number]): number | null {
  const n = buf.length;

  // tira o nível DC: microfone de celular costuma ter offset e ele inventa pico em lag 0
  let media = 0;
  for (let i = 0; i < n; i++) media += buf[i];
  media /= n;

  let energia = 0;
  for (let i = 0; i < n; i++) { const v = buf[i] - media; energia += v * v; }
  if (Math.sqrt(energia / n) < 0.006) return null; // silêncio: não inventa nota

  const lagMin = faixa ? Math.max(LAG_MIN, Math.floor(sr / faixa[1])) : LAG_MIN;
  const lagMax = Math.min(LAG_MAX, n - lagMin - 1, faixa ? Math.ceil(sr / faixa[0]) : LAG_MAX);
  if (lagMax <= lagMin + 2) return null;

  /* dobra o tamanho antes de transformar: sem o zero-padding a FFT devolve
     correlação CIRCULAR, em que o fim do trecho conversa com o começo */
  let P = 1;
  while (P < 2 * n) P <<= 1;
  if (!reBuf || reBuf.length !== P) { reBuf = new Float64Array(P); imBuf = new Float64Array(P); }
  const re = reBuf;
  const im = imBuf!;
  re.fill(0); im.fill(0);
  for (let i = 0; i < n; i++) re[i] = buf[i] - media;

  fft(re, im);
  for (let i = 0; i < P; i++) { re[i] = re[i] * re[i] + im[i] * im[i]; im[i] = 0; } // |X|²
  fft(re, im, true);                                                               // volta: r(τ)

  // NSDF com o denominador por recorrência
  const nsdf = new Float64Array(lagMax + 2);
  let m = 2 * re[0];
  for (let lag = 0; lag <= lagMax; lag++) {
    if (m <= 0) break;
    if (lag >= lagMin - 1) nsdf[lag] = (2 * re[lag]) / m;
    const a = buf[lag] - media;
    const b = buf[n - lag - 1] - media;
    m -= a * a + b * b;
  }

  /* cristas: máximo de cada trecho em que o NSDF está positivo */
  const cristas: number[] = [];
  let lag = lagMin + 1;
  while (lag < lagMax) {
    if (nsdf[lag] > 0 && nsdf[lag - 1] <= 0) {         // subiu acima de zero
      let topo = lag;
      while (lag < lagMax && nsdf[lag] > 0) {
        if (nsdf[lag] > nsdf[topo]) topo = lag;
        lag += 1;
      }
      if (topo > lagMin && topo < lagMax) cristas.push(topo);
    }
    lag += 1;
  }
  if (cristas.length === 0) return null;

  const maior = Math.max(...cristas.map((c) => nsdf[c]));
  if (maior < 0.45) return null; // sinal sujo demais pra afirmar uma nota
  const escolhido = cristas.find((c) => nsdf[c] >= maior * CORTE_DO_PICO) ?? cristas[0];

  // interpolação parabólica: sem ela a leitura pula de dez em dez cents
  const y0 = nsdf[escolhido - 1];
  const y1 = nsdf[escolhido];
  const y2 = nsdf[escolhido + 1];
  const d = y0 + y2 - 2 * y1;
  const periodo = d !== 0 ? escolhido - (y2 - y0) / (2 * d) : escolhido;
  const hz = sr / periodo;
  return hz > 24 && hz < 1600 ? hz : null;
}

export type ParadaDaEscuta = () => void;

/** Liga o microfone e devolve a frequência ~12×/s (null = silêncio). */
export async function escutar(
  aoDetectar: (hz: number | null) => void,
  faixa?: [number, number],
): Promise<ParadaDaEscuta> {
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
  analisador.fftSize = 4096;
  fonte.connect(analisador);

  const buf = new Float32Array(analisador.fftSize);
  let vivo = true;
  const tick = () => {
    if (!vivo) return;
    analisador.getFloatTimeDomainData(buf);
    aoDetectar(detectar(buf, c.sampleRate, faixa));
  };
  const timer = window.setInterval(tick, 85);

  return () => {
    vivo = false;
    window.clearInterval(timer);
    try { fonte.disconnect(); } catch { /* já desconectado */ }
    stream.getTracks().forEach((t) => t.stop());
  };
}
