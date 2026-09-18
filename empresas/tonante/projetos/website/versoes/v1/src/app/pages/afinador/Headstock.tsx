import { useEffect, useMemo, useRef } from "react";
import { freqDe, latinoDe, letraDe } from "../../lib/tuner";
import { ordinalDaCorda, type Corda, type Instrumento } from "./afinacoes";

/* Headstock — a cabeça do instrumento desenhada, e não uma fileira de círculos.
 *
 * É o herói da página: o visitante clica na TARRAXA, não num botão. Por isso a
 * geometria é feita a sério — as tarraxas ficam metade de cada lado (ou todas
 * do mesmo lado, no baixo), a pestana tem a largura do espaçamento real das
 * cordas, e os trastes seguem a regra dos 18 (posição = escala × (1 − 2^(−k/12))),
 * que é como um luthier marca o braço de verdade. Ordem dupla (viola, bandolim,
 * doze cordas) desenha dois fios e duas tarraxas, porque é o que existe.
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
const VB_H = 800;
const CX = VB_W / 2;
const Y_TOPO = 30;
const Y_PESTANA = 268;
const Y_BRACO_FIM = 604;
const ESCALA = 900; // comprimento de escala virtual, em unidades do viewBox

export type Geo = ReturnType<typeof calcularGeo>;

function calcularGeo(inst: Instrumento, cordas: Corda[], a4: number) {
  const n = cordas.length;
  const temPar = cordas.some((c) => c.parceira !== undefined);
  const passo = Math.min(34, 140 / Math.max(1, n - 1));
  const meioPar = temPar ? passo * 0.17 : 0;
  const leque = 1.5; // o braço alarga descendo, então as cordas abrem junto

  const ordens = cordas.map((corda, i) => {
    const centro = CX + (i - (n - 1) / 2) * passo;
    const centroFim = CX + (i - (n - 1) / 2) * passo * leque;
    const notas = corda.parceira !== undefined ? [corda.midi, corda.parceira] : [corda.midi];
    const fios = notas.map((midi, k) => {
      const desvio = notas.length > 1 ? (k === 0 ? -meioPar : meioPar) : 0;
      const entorchada = i < inst.entorchadas;
      return {
        midi,
        xNut: centro + desvio,
        xFim: centroFim + desvio * leque,
        // bordão é mais grosso que primeira: a espessura desenha a hierarquia
        larg: Math.max(1.1, Math.min(4.3, 1.0 + (76 - midi) / 53 * 3.2)),
        cor: entorchada ? "#C2934F" : "#E8E2D2",
      };
    });
    return {
      indice: i,
      centro,
      centroFim,
      fios,
      hz: freqDe(corda.midi, a4),
      letra: letraDe(corda.midi),
      latino: latinoDe(corda.midi),
      ordinal: ordinalDaCorda(i, n),
      /* faixa clicável: metade do passo pra cada lado, e o leque embaixo é
         mais largo, então a faixa acompanha a maior das duas medidas */
      banda: { x: centroFim - (passo * leque) / 2, w: passo * leque },
    };
  });

  /* tarraxas: uma por FIO. Na cabeça dividida a metade grave fica à esquerda,
     com a ordem mais grave no topo — que é como o instrumento é montado. */
  const todosFios = ordens.flatMap((o) => o.fios.map((f, k) => ({ ordem: o.indice, fio: k, xNut: f.xNut })));
  const total = todosFios.length;
  const porLado = inst.cabeca === "inline" ? total : Math.ceil(total / 2);
  const faixaY: [number, number] = [Y_TOPO + 48, Y_PESTANA - 44];
  const disponivel = faixaY[1] - faixaY[0];
  const passoY = Math.min(76, porLado > 1 ? disponivel / (porLado - 1) : 0);
  const alturaCol = passoY * (porLado - 1);
  const y0 = faixaY[0] + (disponivel - alturaCol) / 2;

  const tarraxas = todosFios.map((f, idx) => {
    const esquerda = inst.cabeca === "inline" || idx < porLado;
    const lado: -1 | 1 = esquerda ? -1 : 1;
    // do lado direito a contagem sobe de baixo pra cima, espelhando o esquerdo
    const pos = esquerda ? idx : total - 1 - idx;
    return {
      ordem: f.ordem,
      fio: f.fio,
      lado,
      eixoX: CX + lado * 28,
      y: y0 + pos * passoY,
      xNut: f.xNut,
    };
  });

  const spanNut = Math.max(...ordens.flatMap((o) => o.fios.map((f) => f.xNut))) -
    Math.min(...ordens.flatMap((o) => o.fios.map((f) => f.xNut)));
  const wPestana = spanNut + 46;
  const wTopo = spanNut + 74;
  const wBracoTopo = spanNut + 26;
  const wBracoFim = spanNut * leque + 32;

  const trastes = Array.from({ length: 9 }, (_, k) => Y_PESTANA + ESCALA * (1 - Math.pow(2, -(k + 1) / 12)))
    .filter((y) => y < Y_BRACO_FIM - 6);

  return { n, ordens, tarraxas, wPestana, wTopo, wBracoTopo, wBracoFim, trastes, temPar };
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
  onTocar: (indice: number) => void;
  fundo?: string;
};

export function Headstock({ instrumento, cordas, a4, tocando, foco, cents, onTocar, fundo = "#141210" }: Props) {
  const geo = useMemo(() => calcularGeo(instrumento, cordas, a4), [instrumento, cordas, a4]);
  const fiosRef = useRef<(SVGPathElement | null)[]>([]);
  const aurasRef = useRef<(SVGPathElement | null)[]>([]);
  const uid = useMemo(() => `hs-${Math.random().toString(36).slice(2, 8)}`, []);

  /* ── vibração ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fios = fiosRef.current;
    const auras = aurasRef.current;
    const repouso = () => {
      fios.forEach((p) => p?.setAttribute("d", p.dataset.repouso ?? ""));
      auras.forEach((p) => { if (p) p.style.opacity = "0"; });
    };
    if (tocando === null) { repouso(); return; }

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) { repouso(); return; }

    const alvos: { i: number; amp0: number }[] = [];
    let base = 0;
    geo.ordens.forEach((o) => {
      o.fios.forEach((f) => {
        if (o.indice === tocando) alvos.push({ i: base, amp0: 6 + f.larg * 1.6 });
        base += 1;
      });
    });

    const t0 = performance.now();
    let raf = 0;
    const laco = (agora: number) => {
      const t = (agora - t0) / 1000;
      const decai = Math.exp(-t / 1.15);
      let vivo = false;
      alvos.forEach(({ i, amp0 }) => {
        const amp = amp0 * decai;
        if (amp > 0.25) vivo = true;
        const desl = amp * Math.sin(t * Math.PI * 2 * 7.5);
        const p = fios[i];
        const aura = auras[i];
        if (p) {
          const g = p.dataset;
          const meio = Number(g.meiox) + desl;
          p.setAttribute("d", `${g.cabeca} Q ${meio} ${g.meioy} ${g.fimx} ${Y_BRACO_FIM}`);
        }
        if (aura) {
          const g = aura.dataset;
          const mx = Number(g.meiox);
          aura.setAttribute(
            "d",
            `M ${g.nutx} ${Y_PESTANA} Q ${mx - amp} ${g.meioy} ${g.fimx} ${Y_BRACO_FIM} Q ${mx + amp} ${g.meioy} ${g.nutx} ${Y_PESTANA} Z`,
          );
          aura.style.opacity = String(Math.min(0.42, amp / 14));
        }
      });
      if (!vivo) { repouso(); return; }
      raf = requestAnimationFrame(laco);
    };
    raf = requestAnimationFrame(laco);
    return () => { cancelAnimationFrame(raf); repouso(); };
  }, [tocando, geo]);

  const aceso = (i: number) => i === tocando || i === foco;

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 440, aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={`${uid}-pa`} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#4A3522" />
            <stop offset="45%" stopColor="#3A2817" />
            <stop offset="100%" stopColor="#23180E" />
          </linearGradient>
          <linearGradient id={`${uid}-braco`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#241A0F" />
            <stop offset="38%" stopColor="#191108" />
            <stop offset="100%" stopColor="#120C06" />
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fundo} stopOpacity="0" />
            <stop offset="100%" stopColor={fundo} stopOpacity="1" />
          </linearGradient>
          <radialGradient id={`${uid}-halo`}>
            <stop offset="0%" stopColor="#E08C12" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E08C12" stopOpacity="0" />
          </radialGradient>
          <marker id={`${uid}-ponta`} viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#F0B24A" />
          </marker>
        </defs>

        {/* ── paleta ─────────────────────────────────────────────────── */}
        <path
          d={paletaPath(geo.wTopo, geo.wPestana)}
          fill={`url(#${uid}-pa)`}
          stroke="rgba(255,238,210,0.13)"
          strokeWidth="1"
        />
        {/* rasgo central da paleta: é onde os eixos das tarraxas moram */}
        <path
          d={paletaPath(geo.wTopo - 96, geo.wPestana - 88, 22)}
          fill="#150E07"
          opacity="0.55"
        />

        {/* ── braço + escala ─────────────────────────────────────────── */}
        <path
          d={`M ${CX - geo.wBracoTopo / 2} ${Y_PESTANA} L ${CX + geo.wBracoTopo / 2} ${Y_PESTANA} L ${CX + geo.wBracoFim / 2} ${Y_BRACO_FIM} L ${CX - geo.wBracoFim / 2} ${Y_BRACO_FIM} Z`}
          fill={`url(#${uid}-braco)`}
        />
        {geo.trastes.map((y, k) => {
          const t = (y - Y_PESTANA) / (Y_BRACO_FIM - Y_PESTANA);
          const w = geo.wBracoTopo + (geo.wBracoFim - geo.wBracoTopo) * t;
          return (
            <g key={y}>
              <line x1={CX - w / 2} y1={y} x2={CX + w / 2} y2={y} stroke="#9A907F" strokeWidth="2.4" opacity="0.85" />
              <line x1={CX - w / 2} y1={y - 1.1} x2={CX + w / 2} y2={y - 1.1} stroke="#E3DAC6" strokeWidth="0.7" opacity="0.5" />
              {/* marcações de escala nas casas 3, 5, 7 e 9 */}
              {[2, 4, 6, 8].includes(k) && (
                <circle cx={CX} cy={(y + (geo.trastes[k - 1] ?? Y_PESTANA)) / 2} r="4.6" fill="#CFC5AE" opacity="0.5" />
              )}
            </g>
          );
        })}

        {/* pestana */}
        <rect x={CX - geo.wBracoTopo / 2 - 3} y={Y_PESTANA - 7} width={geo.wBracoTopo + 6} height="9" rx="2.5" fill="#EFE4CB" />
        <rect x={CX - geo.wBracoTopo / 2 - 3} y={Y_PESTANA - 7} width={geo.wBracoTopo + 6} height="3" rx="1.5" fill="#FFF9EC" opacity="0.8" />

        {/* ── tarraxas ───────────────────────────────────────────────── */}
        {geo.tarraxas.map((t, i) => {
          const ativa = aceso(t.ordem);
          const bx = CX + t.lado * (geo.wTopo / 2 + 13);
          return (
            <g key={i}>
              {ativa && <circle cx={t.eixoX} cy={t.y} r="26" fill={`url(#${uid}-halo)`} />}
              {/* haste até o botão, na borda da paleta */}
              <line x1={t.eixoX} y1={t.y} x2={bx} y2={t.y} stroke="#6E6152" strokeWidth="3.6" strokeLinecap="round" />
              <rect x={t.lado < 0 ? bx - 12 : bx} y={t.y - 6.5} width="12" height="13" rx="3" fill={ativa ? "#E8C98A" : "#BCA981"} />
              {/* eixo: o cilindro em que a corda dá voltas */}
              <circle cx={t.eixoX} cy={t.y} r="7.4" fill="#8B7B65" />
              <circle cx={t.eixoX} cy={t.y} r="7.4" fill="none" stroke={ativa ? "#F0B24A" : "#D6C6A6"} strokeWidth={ativa ? 2 : 1.2} />
              <circle cx={t.eixoX} cy={t.y} r="2.6" fill="#2A2116" />
              {/* seta: pra que lado girar. Só no modo de escuta e só se desafinou */}
              {ativa && cents !== null && Math.abs(cents) > 5 && (
                <path
                  d={setaDeGiro(t.eixoX, t.y, cents < 0 ? 1 : -1)}
                  fill="none"
                  stroke="#F0B24A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd={`url(#${uid}-ponta)`}
                />
              )}
            </g>
          );
        })}

        {/* ── cordas ─────────────────────────────────────────────────── */}
        <g>
          {geo.ordens.flatMap((o) =>
            o.fios.map((f, k) => {
              const idx = indiceGlobal(geo, o.indice, k);
              const t = geo.tarraxas[idx];
              const cabeca = `M ${t.eixoX} ${t.y} L ${f.xNut} ${Y_PESTANA}`;
              const repouso = `${cabeca} Q ${(f.xNut + f.xFim) / 2} ${(Y_PESTANA + Y_BRACO_FIM) / 2} ${f.xFim} ${Y_BRACO_FIM}`;
              const ativa = aceso(o.indice);
              return (
                <g key={`${o.indice}-${k}`}>
                  <path
                    ref={(el) => { aurasRef.current[idx] = el; }}
                    data-nutx={f.xNut}
                    data-meiox={(f.xNut + f.xFim) / 2}
                    data-meioy={(Y_PESTANA + Y_BRACO_FIM) / 2}
                    data-fimx={f.xFim}
                    fill={f.cor}
                    style={{ opacity: 0, transition: "opacity .18s linear" }}
                  />
                  <path
                    ref={(el) => { fiosRef.current[idx] = el; }}
                    data-repouso={repouso}
                    data-cabeca={cabeca}
                    data-meiox={(f.xNut + f.xFim) / 2}
                    data-meioy={(Y_PESTANA + Y_BRACO_FIM) / 2}
                    data-fimx={f.xFim}
                    d={repouso}
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
        </g>

        {/* o braço não termina: dissolve no fundo da página */}
        <rect x="0" y={Y_BRACO_FIM - 108} width={VB_W} height="112" fill={`url(#${uid}-fade)`} />

        {/* ── nomes das notas ────────────────────────────────────────── */}
        {geo.ordens.map((o) => {
          const ativa = aceso(o.indice);
          return (
            <g key={o.indice} style={{ transition: "opacity .2s linear" }} opacity={foco === null || ativa ? 1 : 0.42}>
              <text
                x={o.centroFim}
                y={Y_BRACO_FIM + 62}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: geo.n > 6 ? 34 : 40,
                  fontWeight: 500,
                  fill: ativa ? "#F5C061" : "#F2EAD9",
                  transition: "fill .2s linear",
                }}
              >
                {o.letra}
              </text>
              <text
                x={o.centroFim}
                y={Y_BRACO_FIM + 84}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 12, fontWeight: 600, fill: "rgba(242,234,217,0.62)" }}
              >
                {o.ordinal} · {o.latino}
              </text>
              <text
                x={o.centroFim}
                y={Y_BRACO_FIM + 103}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 11, fill: "rgba(242,234,217,0.34)" }}
              >
                {o.hz.toFixed(2)} Hz
              </text>
            </g>
          );
        })}
      </svg>

      {/* alvos reais: um botão por ordem, cobrindo a coluna inteira */}
      {geo.ordens.map((o) => (
        <button
          key={o.indice}
          type="button"
          onClick={() => onTocar(o.indice)}
          aria-label={`${o.ordinal} corda, ${o.latino} ${o.letra}, ${o.hz.toFixed(2)} hertz`}
          aria-pressed={tocando === o.indice}
          className="absolute rounded-[14px] transition-colors duration-200"
          style={{
            left: `${(o.banda.x / VB_W) * 100}%`,
            width: `${(o.banda.w / VB_W) * 100}%`,
            top: `${(Y_TOPO / VB_H) * 100}%`,
            height: `${((VB_H - Y_TOPO - 6) / VB_H) * 100}%`,
            background: "transparent",
            cursor: "pointer",
            outlineOffset: 2,
          }}
        />
      ))}
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
function paletaPath(wTopo: number, wPestana: number, recuo = 0): string {
  const yT = Y_TOPO + recuo;
  const yN = Y_PESTANA - recuo * 0.4;
  const r = Math.min(26, wTopo / 4);
  return [
    `M ${CX - wPestana / 2} ${yN}`,
    `C ${CX - wPestana / 2 - 7} ${yN - 74}, ${CX - wTopo / 2 - 5} ${yT + 102}, ${CX - wTopo / 2} ${yT + r}`,
    `Q ${CX - wTopo / 2} ${yT}, ${CX - wTopo / 2 + r} ${yT}`,
    `L ${CX + wTopo / 2 - r} ${yT}`,
    `Q ${CX + wTopo / 2} ${yT}, ${CX + wTopo / 2} ${yT + r}`,
    `C ${CX + wTopo / 2 + 5} ${yT + 102}, ${CX + wPestana / 2 + 7} ${yN - 74}, ${CX + wPestana / 2} ${yN}`,
    "Z",
  ].join(" ");
}

/** Arco de 200° em volta do eixo. `sentido` 1 = horário (apertar). */
function setaDeGiro(cx: number, cy: number, sentido: 1 | -1): string {
  const r = 15;
  const a0 = sentido === 1 ? -0.5 : Math.PI + 0.5;
  const a1 = sentido === 1 ? Math.PI + 0.2 : -0.2;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M ${p(a0)} A ${r} ${r} 0 1 ${sentido === 1 ? 1 : 0} ${p(a1)}`;
}
