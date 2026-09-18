import { useEffect, useMemo, useRef, useState } from "react";
import { freqDe, latinoDe, letraDe } from "../../lib/tuner";
import { ordinalDaCorda, type Corda, type Instrumento } from "./afinacoes";

/* Headstock — a cabeça do instrumento desenhada, e não uma fileira de círculos.
 *
 * É o herói da página: o visitante clica na CORDA, não num botão. Por isso a
 * geometria é feita a sério:
 *
 *  · paleta FENDADA, com dois rasgos verticais e os eixos dentro deles. É a
 *    cabeça do violão de nylon, que é o carro-chefe da casa. Também resolve um
 *    problema de desenho: com o eixo no meio da paleta, a haste até o botão
 *    atravessava a madeira inteira e o conjunto virava uma escada. Na peça real
 *    a haste está ESCONDIDA dentro da madeira — só se vê o eixo e o botão.
 *  · trastes na regra dos 18 (posição = escala × (1 − 2^(−k/12))), que é como o
 *    luthier marca o braço;
 *  · ordem dupla (viola, bandolim, doze cordas) desenha dois fios e dois eixos,
 *    porque é o que existe no instrumento.
 *
 * A corda vibra de verdade: primeiro modo em bezier quadrática, amplitude
 * amortecida, mais uma "aura" que é o envelope do movimento — é ela que lê como
 * borrão de corda tocada. O laço roda em rAF e escreve direto no atributo `d`;
 * passar por estado do React a 60fps derruba a página.
 *
 * Os alvos de clique NÃO são elementos SVG: são <button> em HTML posicionados
 * por porcentagem em cima do desenho. Botão de verdade ganha foco, rótulo e
 * tecla de espaço de graça; <rect role="button"> não ganha nada disso. */

const VB_W = 420;
const VB_H = 760;
const CX = VB_W / 2;
const Y_TOPO = 34;
const Y_PESTANA = 272;
const Y_BRACO_FIM = 596;
const ESCALA = 900;   // comprimento de escala virtual, em unidades do viewBox
const LEQUE = 1.32;   // o braço alarga descendo; mais que isso vira leque de mão

type Geo = ReturnType<typeof calcularGeo>;

function calcularGeo(inst: Instrumento, cordas: Corda[], a4: number) {
  const n = cordas.length;
  const temPar = cordas.some((c) => c.parceira !== undefined);
  const passo = Math.min(34, 160 / Math.max(1, n - 1));
  const meioPar = temPar ? passo * 0.18 : 0;

  const ordens = cordas.map((corda, i) => {
    const centro = CX + (i - (n - 1) / 2) * passo;
    const centroFim = CX + (i - (n - 1) / 2) * passo * LEQUE;
    const notas = corda.parceira !== undefined ? [corda.midi, corda.parceira] : [corda.midi];
    const fios = notas.map((midi, k) => {
      const desvio = notas.length > 1 ? (k === 0 ? -meioPar : meioPar) : 0;
      return {
        midi,
        xNut: centro + desvio,
        xFim: centroFim + desvio * LEQUE,
        // bordão grosso, primeira fina: a espessura desenha a hierarquia sozinha
        larg: Math.max(1.05, Math.min(4, 0.95 + ((76 - midi) / 53) * 3)),
        cor: i < inst.entorchadas ? "#C89A54" : "#EDE7D8",
      };
    });
    return {
      indice: i,
      centroFim,
      fios,
      hz: freqDe(corda.midi, a4),
      letra: letraDe(corda.midi),
      latino: latinoDe(corda.midi),
      ordinal: ordinalDaCorda(i, n),
      banda: { x: centroFim - (passo * LEQUE) / 2, w: passo * LEQUE },
      xRotulo: centroFim, // sobrescrito logo abaixo, na régua dos rótulos
    };
  });

  /* as letras não cabem no espaçamento das cordas: com seis ordens sobra 12px
     entre elas e "EADGBE" lê como palavra. Elas ganham régua própria, aberta na
     largura toda, e um filete liga cada uma à sua corda. */
  const margemRegua = 40;
  ordens.forEach((o, i) => {
    o.xRotulo = n > 1 ? margemRegua + ((VB_W - margemRegua * 2) * i) / (n - 1) : CX;
  });

  const xsNut = ordens.flatMap((o) => o.fios.map((f) => f.xNut));
  const spanNut = Math.max(...xsNut) - Math.min(...xsNut);
  /* a paleta é bem mais larga em cima do que na pestana. Com pouca diferença
     ela lê como caixa; é o flare que dá a silhueta de cabeça de violão. */
  const wPestana = spanNut + 32;
  const wTopo = spanNut + 108;
  const wBracoTopo = spanNut + 22;
  const wBracoFim = spanNut * LEQUE + 30;

  /* rasgos: um de cada lado (ou só um, no baixo). O eixo mora no meio do rasgo. */
  const larguraRasgo = 26;
  const rasgoY: [number, number] = [Y_TOPO + 48, Y_PESTANA - 30];
  const eixoEsq = CX - (wPestana / 2 - larguraRasgo / 2 - 2);
  const eixoDir = CX + (wPestana / 2 - larguraRasgo / 2 - 2);

  /* uma tarraxa por FIO. Na cabeça fendada a metade grave fica no rasgo da
     esquerda, com a ordem mais grave em cima — que é como o instrumento é
     montado; no baixo tudo vai pro mesmo lado. */
  const todosFios = ordens.flatMap((o) => o.fios.map((_, k) => ({ ordem: o.indice, fio: k })));
  const total = todosFios.length;
  const porLado = inst.cabeca === "inline" ? total : Math.ceil(total / 2);
  const vao = rasgoY[1] - rasgoY[0] - 20;
  const passoY = Math.min(64, porLado > 1 ? vao / (porLado - 1) : 0);
  const y0 = rasgoY[0] + 10 + (vao - passoY * (porLado - 1)) / 2;

  const tarraxas = todosFios.map((f, idx) => {
    const esquerda = inst.cabeca === "inline" || idx < porLado;
    const pos = esquerda ? idx : total - 1 - idx;
    return {
      ordem: f.ordem,
      fio: f.fio,
      lado: (esquerda ? -1 : 1) as -1 | 1,
      eixoX: esquerda ? eixoEsq : eixoDir,
      y: y0 + pos * passoY,
    };
  });

  const trastes = Array.from({ length: 10 }, (_, k) => Y_PESTANA + ESCALA * (1 - Math.pow(2, -(k + 1) / 12)))
    .filter((y) => y < Y_BRACO_FIM - 8);

  return {
    n, ordens, tarraxas, trastes,
    wPestana, wTopo, wBracoTopo, wBracoFim,
    larguraRasgo, rasgoY, eixoEsq, eixoDir,
    umRasgo: inst.cabeca === "inline",
  };
}

type Props = {
  instrumento: Instrumento;
  cordas: Corda[];
  a4: number;
  /** ordem que está soando */
  tocando: number | null;
  /** ordem em foco: passo do "afinar tudo" ou corda detectada no microfone */
  foco: number | null;
  /** desvio em cents da ordem em foco, quando o microfone está ligado */
  cents: number | null;
  /** nome da afinação, exibido na tarja quando nenhuma corda está em foco */
  afinacao: string;
  onTocar: (indice: number) => void;
  fundo?: string;
};

export function Headstock({ instrumento, cordas, a4, tocando, foco, cents, afinacao, onTocar, fundo = "#141210" }: Props) {
  const geo = useMemo(() => calcularGeo(instrumento, cordas, a4), [instrumento, cordas, a4]);
  const fiosRef = useRef<(SVGPathElement | null)[]>([]);
  const aurasRef = useRef<(SVGPathElement | null)[]>([]);
  const uid = useMemo(() => `hs-${Math.random().toString(36).slice(2, 8)}`, []);
  const [focado, setFocado] = useState<number | null>(null);

  /* trocar de instrumento troca a quantidade de fios: sem zerar, os índices
     que sobram apontam pra <path> já desmontados e o laço de vibração escreve
     em nó órfão */
  useEffect(() => {
    fiosRef.current = [];
    aurasRef.current = [];
    setFocado(null);
  }, [geo]);

  /* ── vibração ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fios = fiosRef.current;
    const auras = aurasRef.current;
    const repouso = () => {
      fios.forEach((p) => p && p.setAttribute("d", p.dataset.repouso ?? ""));
      auras.forEach((p) => { if (p) p.style.opacity = "0"; });
    };
    if (tocando === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      repouso();
      return;
    }

    const alvos: { i: number; amp0: number }[] = [];
    let base = 0;
    geo.ordens.forEach((o) => {
      o.fios.forEach((f) => {
        if (o.indice === tocando) alvos.push({ i: base, amp0: 5 + f.larg * 1.5 });
        base += 1;
      });
    });

    const t0 = performance.now();
    let raf = 0;
    const laco = (agora: number) => {
      const t = (agora - t0) / 1000;
      const decai = Math.exp(-t / 1.2);
      let vivo = false;
      alvos.forEach(({ i, amp0 }) => {
        const amp = amp0 * decai;
        if (amp > 0.25) vivo = true;
        const desl = amp * Math.sin(t * Math.PI * 2 * 7.5);
        const p = fios[i];
        const aura = auras[i];
        if (p) {
          const g = p.dataset;
          p.setAttribute("d", `M ${g.nutx} ${Y_PESTANA} Q ${Number(g.meiox) + desl} ${g.meioy} ${g.fimx} ${Y_BRACO_FIM}`);
        }
        if (aura) {
          const g = aura.dataset;
          const mx = Number(g.meiox);
          aura.setAttribute(
            "d",
            `M ${g.nutx} ${Y_PESTANA} Q ${mx - amp} ${g.meioy} ${g.fimx} ${Y_BRACO_FIM} Q ${mx + amp} ${g.meioy} ${g.nutx} ${Y_PESTANA} Z`,
          );
          aura.style.opacity = String(Math.min(0.4, amp / 15));
        }
      });
      if (!vivo) { repouso(); return; }
      raf = requestAnimationFrame(laco);
    };
    raf = requestAnimationFrame(laco);
    return () => { cancelAnimationFrame(raf); repouso(); };
  }, [tocando, geo]);

  const aceso = (i: number) => i === tocando || i === foco;
  const destacada = foco !== null ? geo.ordens[foco] : tocando !== null ? geo.ordens[tocando] : null;

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 480, aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <linearGradient id={`${uid}-madeira`} x1="0" y1="0" x2="1" y2="0.18">
            <stop offset="0%" stopColor="#2A1C10" />
            <stop offset="22%" stopColor="#4B3520" />
            <stop offset="58%" stopColor="#3A2716" />
            <stop offset="100%" stopColor="#23170D" />
          </linearGradient>
          <linearGradient id={`${uid}-braco`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2B1D0F" />
            <stop offset="34%" stopColor="#1D1409" />
            <stop offset="100%" stopColor="#150E06" />
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fundo} stopOpacity="0" />
            <stop offset="100%" stopColor={fundo} stopOpacity="1" />
          </linearGradient>
          <radialGradient id={`${uid}-halo`}>
            <stop offset="0%" stopColor="#E08C12" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#E08C12" stopOpacity="0" />
          </radialGradient>
          <filter id={`${uid}-borrao`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <marker id={`${uid}-ponta`} viewBox="0 0 8 8" refX="4" refY="4" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#F0B24A" />
          </marker>
        </defs>

        {/* ── braço + escala ─────────────────────────────────────────── */}
        <path
          d={`M ${CX - geo.wBracoTopo / 2} ${Y_PESTANA} L ${CX + geo.wBracoTopo / 2} ${Y_PESTANA} L ${CX + geo.wBracoFim / 2} ${Y_BRACO_FIM} L ${CX - geo.wBracoFim / 2} ${Y_BRACO_FIM} Z`}
          fill={`url(#${uid}-braco)`}
        />
        {geo.trastes.map((y, k) => {
          const t = (y - Y_PESTANA) / (Y_BRACO_FIM - Y_PESTANA);
          const w = geo.wBracoTopo + (geo.wBracoFim - geo.wBracoTopo) * t;
          const anterior = geo.trastes[k - 1] ?? Y_PESTANA;
          return (
            <g key={y}>
              {/* marcação de escala nas casas 3, 5, 7 e 9 */}
              {[2, 4, 6, 8].includes(k) && <circle cx={CX} cy={(y + anterior) / 2} r="4.4" fill="#CFC5AE" opacity="0.42" />}
              <line x1={CX - w / 2} y1={y} x2={CX + w / 2} y2={y} stroke="#8F8676" strokeWidth="2.3" opacity="0.8" />
              <line x1={CX - w / 2} y1={y - 1} x2={CX + w / 2} y2={y - 1} stroke="#E3DAC6" strokeWidth="0.7" opacity="0.42" />
            </g>
          );
        })}

        {/* ── paleta ─────────────────────────────────────────────────── */}
        <path d={paletaPath(geo.wTopo, geo.wPestana)} fill="#000" opacity="0.5" transform="translate(0 9)" filter={`url(#${uid}-borrao)`} />
        <path d={paletaPath(geo.wTopo, geo.wPestana)} fill={`url(#${uid}-madeira)`} />
        <path d={paletaPath(geo.wTopo, geo.wPestana)} fill="none" stroke="rgba(255,238,210,0.16)" strokeWidth="1" />
        {/* veio da madeira: três fios finos, o suficiente pra não parecer plástico */}
        {[-0.42, 0, 0.5].map((d, i) => (
          <path
            key={i}
            d={`M ${CX + d * geo.wTopo * 0.36} ${Y_TOPO + 12} C ${CX + d * geo.wTopo * 0.3} ${Y_TOPO + 90}, ${CX + d * geo.wPestana * 0.42} ${Y_PESTANA - 90}, ${CX + d * geo.wPestana * 0.36} ${Y_PESTANA - 6}`}
            stroke="rgba(255,225,180,0.07)"
            strokeWidth="1.4"
            fill="none"
          />
        ))}

        {/* rasgos vazados */}
        {(geo.umRasgo ? [geo.eixoEsq] : [geo.eixoEsq, geo.eixoDir]).map((x) => (
          <g key={x}>
            <rect
              x={x - geo.larguraRasgo / 2}
              y={geo.rasgoY[0]}
              width={geo.larguraRasgo}
              height={geo.rasgoY[1] - geo.rasgoY[0]}
              rx={geo.larguraRasgo / 2}
              fill="#0D0904"
            />
            <rect
              x={x - geo.larguraRasgo / 2}
              y={geo.rasgoY[0]}
              width={geo.larguraRasgo}
              height={geo.rasgoY[1] - geo.rasgoY[0]}
              rx={geo.larguraRasgo / 2}
              fill="none"
              stroke="rgba(255,238,210,0.13)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* pestana */}
        <rect x={CX - geo.wBracoTopo / 2 - 3} y={Y_PESTANA - 8} width={geo.wBracoTopo + 6} height="10" rx="3" fill="#EFE4CB" />
        <rect x={CX - geo.wBracoTopo / 2 - 3} y={Y_PESTANA - 8} width={geo.wBracoTopo + 6} height="3.4" rx="1.7" fill="#FFF9EC" opacity="0.75" />

        {/* ── tarraxas ───────────────────────────────────────────────── */}
        {geo.tarraxas.map((t, i) => {
          const ativa = aceso(t.ordem);
          /* a paleta afina descendo, então a borda muda de x com a altura: sem
             isso o botão da tarraxa de baixo flutua fora da madeira */
          const k = (t.y - Y_TOPO) / (Y_PESTANA - Y_TOPO);
          const larguraAqui = geo.wTopo + (geo.wPestana - geo.wTopo) * (k * k * 0.72 + k * 0.28);
          const bx = CX + t.lado * (larguraAqui / 2);
          return (
            <g key={i}>
              {ativa && <circle cx={t.eixoX} cy={t.y} r="30" fill={`url(#${uid}-halo)`} />}
              {/* botão na lateral: a haste vive dentro da madeira e não se vê */}
              <rect x={t.lado < 0 ? bx - 11 : bx - 3} y={t.y - 4.5} width="14" height="9" rx="3" fill={ativa ? "#E8C98A" : "#A8956F"} />
              <rect x={t.lado < 0 ? bx - 3 : bx - 5} y={t.y - 2.2} width="8" height="4.4" rx="2" fill="#6B5C45" />
              {/* eixo: o cilindro em que a corda dá voltas */}
              <rect x={t.eixoX - 5.5} y={t.y - 9} width="11" height="18" rx="5.5" fill="#8B7B65" />
              <rect
                x={t.eixoX - 5.5} y={t.y - 9} width="11" height="18" rx="5.5"
                fill="none" stroke={ativa ? "#F0B24A" : "#D6C6A6"} strokeWidth={ativa ? 1.8 : 1}
              />
              {ativa && cents !== null && Math.abs(cents) > 5 && (
                <path
                  d={setaDeGiro(t.eixoX, t.y, cents < 0 ? 1 : -1)}
                  fill="none" stroke="#F0B24A" strokeWidth="1.9" strokeLinecap="round"
                  markerEnd={`url(#${uid}-ponta)`}
                />
              )}
            </g>
          );
        })}

        {/* ── cordas ─────────────────────────────────────────────────── */}
        {geo.ordens.flatMap((o) =>
          o.fios.map((f, k) => {
            const idx = indiceGlobal(geo, o.indice, k);
            const t = geo.tarraxas[idx];
            const cabeca = `M ${t.eixoX} ${t.y} L ${f.xNut} ${Y_PESTANA}`;
            const meiox = (f.xNut + f.xFim) / 2;
            const meioy = (Y_PESTANA + Y_BRACO_FIM) / 2;
            const vibrante = `M ${f.xNut} ${Y_PESTANA} Q ${meiox} ${meioy} ${f.xFim} ${Y_BRACO_FIM}`;
            const ativa = aceso(o.indice);
            return (
              <g key={`${o.indice}-${k}`}>
                <path
                  ref={(el) => { aurasRef.current[idx] = el; }}
                  data-nutx={f.xNut} data-meiox={meiox} data-meioy={meioy} data-fimx={f.xFim}
                  fill={f.cor}
                  style={{ opacity: 0, transition: "opacity .18s linear" }}
                />
                {/* o trecho de dentro da paleta vai apagado: ele não vibra e,
                    no brilho cheio, o emaranhado sobre os eixos come o desenho */}
                <path
                  d={cabeca}
                  fill="none"
                  stroke={ativa ? "#FFE3AE" : f.cor}
                  strokeWidth={f.larg * 0.85}
                  strokeLinecap="round"
                  opacity={ativa ? 0.72 : 0.45}
                  style={{ transition: "stroke .2s linear, opacity .2s linear" }}
                />
                <path
                  ref={(el) => { fiosRef.current[idx] = el; }}
                  data-repouso={vibrante} data-nutx={f.xNut} data-meiox={meiox} data-meioy={meioy} data-fimx={f.xFim}
                  d={vibrante}
                  fill="none"
                  stroke={ativa ? "#FFE3AE" : f.cor}
                  strokeWidth={f.larg}
                  strokeLinecap="round"
                  style={{ transition: "stroke .2s linear" }}
                />
              </g>
            );
          }),
        )}

        {/* o braço não termina: dissolve no fundo da página */}
        <rect x="0" y={Y_BRACO_FIM - 110} width={VB_W} height="80" fill={`url(#${uid}-fade)`} />

        {/* ── nomes das notas ────────────────────────────────────────── */}
        {geo.ordens.map((o) => {
          const ativa = aceso(o.indice);
          return (
            <g key={o.indice} opacity={foco === null || ativa ? 1 : 0.38} style={{ transition: "opacity .2s linear" }}>
              <path
                d={`M ${o.centroFim} ${Y_BRACO_FIM - 34} C ${o.centroFim} ${Y_BRACO_FIM + 2}, ${o.xRotulo} ${Y_BRACO_FIM - 2}, ${o.xRotulo} ${Y_BRACO_FIM + 26}`}
                fill="none"
                stroke={ativa ? "#F5C061" : "#F2EAD9"}
                strokeWidth="0.9"
                opacity={ativa ? 0.5 : 0.16}
              />
              <text
                x={o.xRotulo} y={Y_BRACO_FIM + 56} textAnchor="middle"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: geo.n > 6 ? 30 : 36,
                  fontWeight: 500,
                  fill: ativa ? "#F5C061" : "#F2EAD9",
                  transition: "fill .2s linear",
                }}
              >
                {o.letra}
              </text>
              <text
                x={o.xRotulo} y={Y_BRACO_FIM + 76} textAnchor="middle"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 11, fontWeight: 600, fill: "rgba(242,234,217,0.5)" }}
              >
                {o.ordinal}
              </text>
            </g>
          );
        })}

        {/* tarja: uma linha só, centralizada. Antes cada corda carregava o próprio
            Hz e, com seis colunas, os números se atropelavam. */}
        <text
          x={CX} y={Y_BRACO_FIM + 118} textAnchor="middle"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, fontWeight: 600, fill: destacada ? "#F0B24A" : "rgba(242,234,217,0.42)", transition: "fill .2s linear" }}
        >
          {destacada
            ? `${destacada.ordinal} corda · ${destacada.latino} · ${destacada.hz.toFixed(2)} Hz`
            : afinacao}
        </text>
      </svg>

      {/* Alvos reais: um <button> por ordem. Botão de verdade ganha foco,
          rótulo e tecla de espaço de graça; <rect role="button"> não ganha.

          O recorte é um trapézio, não um retângulo: em cima ele acompanha a
          corda (estreita, porque as cordas convergem pra pestana) e embaixo
          acompanha a letra (larga, porque os rótulos têm régua própria). Com
          retângulo o alvo ficava com a largura da corda — 37px no desktop e
          35px no celular, abaixo dos 44px que um dedo pede. O `clip-path`
          também vale pro hit-testing, então os alvos não se sobrepõem. */}
      {geo.ordens.map((o) => {
        const passoRegua = geo.n > 1 ? (VB_W - 80) / (geo.n - 1) : VB_W;
        const reguaEsq = o.xRotulo - passoRegua / 2;
        const reguaDir = o.xRotulo + passoRegua / 2;
        const esq = Math.min(o.banda.x, reguaEsq);
        const dir = Math.max(o.banda.x + o.banda.w, reguaDir);
        const topo = Y_TOPO;
        const fundo = Y_BRACO_FIM + 92;
        const px = (x: number) => `${(((x - esq) / (dir - esq)) * 100).toFixed(2)}%`;
        const py = (y: number) => `${(((y - topo) / (fundo - topo)) * 100).toFixed(2)}%`;
        const yCorda = Y_BRACO_FIM - 24;
        const yLetra = Y_BRACO_FIM + 14;
        return (
          <button
            key={o.indice}
            type="button"
            onClick={() => onTocar(o.indice)}
            aria-label={`${o.ordinal} corda, ${o.latino} ${o.letra}, ${o.hz.toFixed(2)} hertz`}
            aria-pressed={tocando === o.indice}
            className="absolute focus-visible:outline-none"
            style={{
              left: `${(esq / VB_W) * 100}%`,
              width: `${((dir - esq) / VB_W) * 100}%`,
              top: `${(topo / VB_H) * 100}%`,
              height: `${((fundo - topo) / VB_H) * 100}%`,
              cursor: "pointer",
              /* o foco é pintado como fundo, e não como anel: o clip-path
                 recorta outline e box-shadow, então o anel sairia cortado —
                 o véu, além de aparecer, desenha a própria área clicável */
              background: focado === o.indice ? "rgba(240,178,74,0.16)" : "transparent",
              transition: "background-color .15s linear",
              clipPath: `polygon(${px(o.banda.x)} 0%, ${px(o.banda.x + o.banda.w)} 0%, ${px(o.banda.x + o.banda.w)} ${py(yCorda)}, ${px(reguaDir)} ${py(yLetra)}, ${px(reguaDir)} 100%, ${px(reguaEsq)} 100%, ${px(reguaEsq)} ${py(yLetra)}, ${px(o.banda.x)} ${py(yCorda)})`,
            }}
            onFocus={(e) => { if (e.target.matches(":focus-visible")) setFocado(o.indice); }}
            onBlur={() => setFocado((f) => (f === o.indice ? null : f))}
          />
        );
      })}
    </div>
  );
}

function indiceGlobal(geo: Geo, ordem: number, fio: number): number {
  let i = 0;
  for (const o of geo.ordens) {
    if (o.indice === ordem) return i + fio;
    i += o.fios.length;
  }
  return 0;
}

/** Contorno da paleta: alarga subindo, com cintura leve e topo arredondado. */
function paletaPath(wTopo: number, wPestana: number): string {
  const yT = Y_TOPO;
  const yN = Y_PESTANA;
  const r = Math.min(36, wTopo / 4);
  const wp = wPestana / 2;
  const wt = wTopo / 2;
  /* dois cubics por lado em vez de um: o primeiro é a cintura, quase vertical
     saindo da pestana; o segundo é o ombro, que abre. Com um cubic só a lateral
     saía reta e a paleta lia como trapézio de régua. */
  return [
    `M ${CX - wp} ${yN}`,
    `C ${CX - wp - 4} ${yN - 44}, ${CX - wt + 24} ${yT + 158}, ${CX - wt + 14} ${yT + 116}`,
    `C ${CX - wt + 4} ${yT + 74}, ${CX - wt} ${yT + 54}, ${CX - wt} ${yT + r}`,
    `Q ${CX - wt} ${yT}, ${CX - wt + r} ${yT}`,
    `L ${CX + wt - r} ${yT}`,
    `Q ${CX + wt} ${yT}, ${CX + wt} ${yT + r}`,
    `C ${CX + wt} ${yT + 54}, ${CX + wt - 4} ${yT + 74}, ${CX + wt - 14} ${yT + 116}`,
    `C ${CX + wt - 24} ${yT + 158}, ${CX + wp + 4} ${yN - 44}, ${CX + wp} ${yN}`,
    "Z",
  ].join(" ");
}

/** Arco de ~200° em volta do eixo. `sentido` 1 = horário (apertar). */
function setaDeGiro(cx: number, cy: number, sentido: 1 | -1): string {
  const r = 16;
  const a0 = sentido === 1 ? -0.5 : Math.PI + 0.5;
  const a1 = sentido === 1 ? Math.PI + 0.2 : -0.2;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M ${p(a0)} A ${r} ${r} 0 1 ${sentido === 1 ? 1 : 0} ${p(a1)}`;
}
