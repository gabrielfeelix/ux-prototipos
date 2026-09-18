import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Minus, Mic, Plus, Square } from "lucide-react";
import { CTAButton, Eyebrow } from "../../components/section";
import {
  centsEntre, dedilhar, escutar, freqDe, latinoDe, letraDe, segurar,
  type ParadaDaEscuta, type Voz,
} from "../../lib/tuner";
import { INSTRUMENTOS, acharInstrumento, ordinalDaCorda } from "./afinacoes";
import { Headstock } from "./Headstock";
import { FAMILIAS, FamiliaCard } from "../../v2/EncordoamentosV2";
import { Regua } from "./Regua";
import { Seletor } from "./Seletor";

/* AfinadorPage — /afinador.
 *
 * O site inteiro é branco; esta página é escura de propósito. O afinador não é
 * uma seção da loja, é um aparelho: escurecer o fundo separa o momento (você
 * parou de comprar, você está afinando) e é a única forma de a corda acesa e a
 * agulha da régua terem contraste pra brilhar.
 *
 * Três modos, e eles resolvem três situações diferentes:
 *   tocar    — palhetada que decai, pra comparar de ouvido;
 *   contínuo — nota que não morre, pra afinar sem ficar reclicando;
 *   ouvir    — microfone, autocorrelação, régua em cents.
 * No modo ouvir clicar numa corda TRAVA o alvo em vez de tocar: se a página
 * emitisse som com o microfone aberto, ela se ouviria e mediria a si mesma. */

const MODOS = [
  { id: "tocar", nome: "Tocar" },
  { id: "continuo", nome: "Contínuo" },
  { id: "ouvir", nome: "Ouvir" },
] as const;
type Modo = (typeof MODOS)[number]["id"];

const FUNDO = "#141210";

export function AfinadorPage() {
  const [instrumentoId, setInstrumentoId] = useState("violao");
  const [afinacaoId, setAfinacaoId] = useState("padrao");
  const [modo, setModo] = useState<Modo>("tocar");
  const [a4, setA4] = useState(440);

  const instrumento = acharInstrumento(instrumentoId);
  const afinacao = instrumento.afinacoes.find((a) => a.id === afinacaoId) ?? instrumento.afinacoes[0];
  const cordas = afinacao.cordas;

  const [tocando, setTocando] = useState<number | null>(null);
  const [passo, setPasso] = useState<number | null>(null);  // sequência "afinar tudo"
  const [travada, setTravada] = useState<number | null>(null); // alvo fixo no modo ouvir
  const vozes = useRef<Voz[]>([]);

  /* ── som ──────────────────────────────────────────────────────────────── */

  const silenciar = useCallback(() => {
    vozes.current.forEach((v) => v.parar());
    vozes.current = [];
    setTocando(null);
  }, []);

  const tocar = useCallback((i: number) => {
    silenciar();
    const corda = cordas[i];
    if (!corda) return;
    const notas = corda.parceira !== undefined && corda.parceira !== corda.midi
      ? [corda.midi, corda.parceira]
      : [corda.midi];
    setTocando(i);
    if (modo === "continuo") {
      vozes.current = notas.map((m) => segurar(freqDe(m, a4), instrumento.brilho));
      return;
    }
    let restantes = notas.length;
    vozes.current = notas.map((m) =>
      dedilhar(freqDe(m, a4), instrumento.brilho, () => {
        restantes -= 1;
        if (restantes <= 0) setTocando((atual) => (atual === i ? null : atual));
      }),
    );
  }, [cordas, modo, a4, instrumento.brilho, silenciar]);

  const aoClicarCorda = useCallback((i: number) => {
    if (modo === "ouvir") {
      setTravada((atual) => (atual === i ? null : i));
      return;
    }
    if (tocando === i) { silenciar(); return; }
    setPasso(null);
    tocar(i);
  }, [modo, tocando, tocar, silenciar]);

  /* troca de instrumento, afinação, modo ou diapasão: o som velho morre junto */
  useEffect(() => {
    silenciar();
    setPasso(null);
    setTravada(null);
  }, [instrumentoId, afinacaoId, modo, silenciar]);

  useEffect(() => () => { vozes.current.forEach((v) => v.parar()); }, []);

  const trocarInstrumento = (id: string) => {
    setInstrumentoId(id);
    setAfinacaoId(acharInstrumento(id).afinacoes[0].id);
  };

  /* ── sequência "afinar tudo" ──────────────────────────────────────────── */

  const avancar = () => {
    const proximo = passo === null ? 0 : passo + 1;
    if (proximo >= cordas.length) { setPasso(null); silenciar(); return; }
    setPasso(proximo);
    if (modo === "ouvir") { setTravada(proximo); return; }
    tocar(proximo);
  };

  const parar = () => { silenciar(); setPasso(null); setTravada(null); };

  /* 415–466 Hz é a faixa real de diapasão: barroco em baixo, orquestra europeia
     em cima. Fora disso o número deixa de ser afinação e vira erro de digitação. */
  const mexerA4 = (delta: number) => setA4((v) => Math.max(415, Math.min(466, Math.round(v + delta))));

  /* ── microfone ────────────────────────────────────────────────────────── */

  const [escuta, setEscuta] = useState<"desligado" | "pedindo" | "ouvindo" | "negado">("desligado");
  const [hzOuvido, setHzOuvido] = useState<number | null>(null);
  const suavizado = useRef<number | null>(null);
  const ultimoSinal = useRef(0);

  useEffect(() => {
    if (modo !== "ouvir") { setEscuta("desligado"); setHzOuvido(null); return; }
    let parar: ParadaDaEscuta | null = null;
    let vivo = true;
    setEscuta("pedindo");
    escutar((hz) => {
      const agora = performance.now();
      if (hz === null) {
        // 700ms de silêncio antes de apagar: senão a leitura pisca entre palhetadas
        if (agora - ultimoSinal.current > 700) { suavizado.current = null; setHzOuvido(null); }
        return;
      }
      ultimoSinal.current = agora;
      const antes = suavizado.current;
      // salto grande = nota nova, não ruído: começa a média do zero
      suavizado.current = antes === null || hz / antes > 1.35 || antes / hz > 1.35
        ? hz
        : antes + (hz - antes) * 0.4;
      setHzOuvido(suavizado.current);
    })
      .then((p) => { if (vivo) { parar = p; setEscuta("ouvindo"); } else p(); })
      .catch(() => { if (vivo) setEscuta("negado"); });
    return () => { vivo = false; parar?.(); };
  }, [modo]);

  /* qual corda o microfone ouviu, e quanto falta pra ela */
  const leitura = useMemo(() => {
    if (hzOuvido === null) return null;
    const candidatos = travada !== null ? [travada] : cordas.map((_, i) => i);
    let melhor: { indice: number; cents: number } | null = null;
    candidatos.forEach((i) => {
      const alvo = freqDe(cordas[i].midi, a4);
      // dobra e metade entram na conta: autocorrelação erra oitava com frequência
      [hzOuvido, hzOuvido * 2, hzOuvido / 2].forEach((hz) => {
        const c = centsEntre(hz, alvo);
        if (!melhor || Math.abs(c) < Math.abs(melhor.cents)) melhor = { indice: i, cents: c };
      });
    });
    if (!melhor) return null;
    const { indice, cents } = melhor as { indice: number; cents: number };
    if (travada === null && Math.abs(cents) > 120) return null; // longe de tudo: não chuta
    return { indice, cents, midi: cordas[indice].midi };
  }, [hzOuvido, cordas, a4, travada]);

  const foco = modo === "ouvir" ? (leitura?.indice ?? travada ?? passo) : passo;

  /* ── página ───────────────────────────────────────────────────────────── */

  const rotuloSequencia = passo === null
    ? "Afinar tudo"
    : `Próxima corda (${Math.min(passo + 2, cordas.length)} de ${cordas.length})`;

  return (
    <>
      <main style={{ background: FUNDO, color: "#F2EAD9" }}>
        <div className="mx-auto w-full px-5 pb-24 pt-14 md:px-12 md:pb-28 md:pt-20" style={{ maxWidth: 1280 }}>
          <div className="text-center">
          <Eyebrow style={{ color: "#F0B24A" }}>Tonante</Eyebrow>
          <h1
            className="mt-4"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(2.4rem, 5.4vw, 4.25rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "#F8F2E6",
            }}
          >
            Afinador Digital
          </h1>
          <p
            className="mx-auto mt-5 max-w-[52ch]"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "clamp(1rem, 1.2vw, 1.125rem)", lineHeight: 1.6, color: "rgba(242,234,217,0.66)" }}
          >
            Escolha o instrumento, toque a corda e compare de ouvido. Ou ligue o
            microfone e deixe a régua dizer quantos cents faltam.
          </p>
          </div>

          {/* ── instrumentos ─────────────────────────────────────────── */}
          <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
            <div className="flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center">
              {INSTRUMENTOS.map((i) => {
                const ativo = i.id === instrumentoId;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => trocarInstrumento(i.id)}
                    aria-pressed={ativo}
                    className="relative cursor-pointer whitespace-nowrap rounded-pill px-5 py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B24A]/60"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: 14.5,
                      fontWeight: ativo ? 700 : 500,
                      color: ativo ? "#1A1208" : "rgba(242,234,217,0.72)",
                      border: `1px solid ${ativo ? "transparent" : "rgba(255,238,210,0.16)"}`,
                    }}
                  >
                    {ativo && (
                      <motion.span
                        layoutId="pilula-instrumento"
                        className="absolute inset-0 rounded-pill"
                        style={{ background: "linear-gradient(135deg, #F0B24A 0%, #C87800 100%)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className="relative">{i.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_374px] lg:items-start lg:gap-16">
            {/* ── o instrumento ──────────────────────────────────────── */}
            <div className="order-2 lg:order-1">
              <Headstock
                instrumento={instrumento}
                cordas={cordas}
                a4={a4}
                tocando={tocando}
                foco={foco}
                cents={modo === "ouvir" ? leitura?.cents ?? null : null}
                afinacao={afinacao.nome}
                onTocar={aoClicarCorda}
                fundo={FUNDO}
              />
              <p
                className="mx-auto mt-2 max-w-[42ch] text-center"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 13.5, lineHeight: 1.5, color: "rgba(242,234,217,0.45)" }}
              >
                {modo === "ouvir"
                  ? "O microfone escolhe a corda sozinho. Clique numa delas para travar o alvo."
                  : modo === "continuo"
                    ? "Clique na corda para segurar a nota. Clique de novo para parar."
                    : "Clique na corda para ouvir a nota. Clique de novo para parar."}
              </p>
            </div>

            {/* ── console ────────────────────────────────────────────── */}
            <div
              className="order-1 rounded-[16px] p-6 lg:order-2 lg:sticky lg:top-[calc(var(--header-h,120px)+20px)]"
              style={{ background: "rgba(255,247,232,0.045)", border: "1px solid rgba(255,238,210,0.12)" }}
            >
              <Campo rotulo="Afinação">
                <Seletor
                  rotulo="Afinação"
                  valor={afinacao.id}
                  opcoes={instrumento.afinacoes}
                  onChange={setAfinacaoId}
                />
              </Campo>

              <Campo rotulo="Modo" className="mt-6">
                <div className="flex gap-1 rounded-pill p-1" style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,238,210,0.12)" }}>
                  {MODOS.map((m) => {
                    const ativo = m.id === modo;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModo(m.id)}
                        aria-pressed={ativo}
                        className="relative flex-1 cursor-pointer rounded-pill py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B24A]/60"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: 14,
                          fontWeight: ativo ? 700 : 500,
                          color: ativo ? "#1A1208" : "rgba(242,234,217,0.66)",
                        }}
                      >
                        {ativo && (
                          <motion.span
                            layoutId="pilula-modo"
                            className="absolute inset-0 rounded-pill"
                            style={{ background: "#F2EAD9" }}
                            transition={{ type: "spring", stiffness: 480, damping: 40 }}
                          />
                        )}
                        <span className="relative inline-flex items-center justify-center gap-1.5">
                          {m.id === "ouvir" && <Mic size={14} strokeWidth={2.2} />}
                          {m.nome}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Campo>

              <Campo rotulo="Lá de referência" className="mt-6">
                {/* stepper próprio: a setinha nativa do input[type=number] é
                    cinza de sistema, some no fundo escuro e tem alvo de 8px */}
                <div
                  className="flex items-stretch overflow-hidden rounded-[10px]"
                  style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,238,210,0.16)" }}
                >
                  <BotaoPasso rotulo="Um hertz abaixo" onClick={() => mexerA4(-1)}>
                    <Minus size={16} strokeWidth={2.4} />
                  </BotaoPasso>
                  <div className="flex flex-1 items-baseline justify-center gap-1.5 py-3">
                    <input
                      type="number"
                      min={415}
                      max={466}
                      step={1}
                      value={a4}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v) && e.target.value !== "") mexerA4(v - a4);
                      }}
                      aria-label="Frequência do lá de referência, em hertz"
                      className="w-[4.5ch] bg-transparent text-center [appearance:textfield] focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{
                        color: "#F2EAD9",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: 17,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    />
                    <span style={{ fontFamily: "var(--font-family-inter)", fontSize: 12.5, color: "rgba(242,234,217,0.42)" }}>Hz</span>
                  </div>
                  <BotaoPasso rotulo="Um hertz acima" onClick={() => mexerA4(1)}>
                    <Plus size={16} strokeWidth={2.4} />
                  </BotaoPasso>
                </div>
                <div className="mt-2 flex gap-2">
                  {[432, 440, 442].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setA4(v)}
                      aria-pressed={a4 === v}
                      className="flex-1 cursor-pointer rounded-[9px] py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B24A]/60"
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: 13,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        color: a4 === v ? "#1A1208" : "rgba(242,234,217,0.62)",
                        background: a4 === v ? "#F2EAD9" : "transparent",
                        border: `1px solid ${a4 === v ? "transparent" : "rgba(255,238,210,0.16)"}`,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </Campo>

              <div className="mt-7 flex gap-2.5">
                <CTAButton variant="brand" size="md" onClick={avancar} className="flex-1">
                  {rotuloSequencia}
                </CTAButton>
                <button
                  type="button"
                  onClick={parar}
                  aria-label="Parar"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill px-5 transition-colors duration-200 hover:bg-[rgba(255,238,210,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B24A]/60"
                  style={{
                    border: "1px solid rgba(255,238,210,0.24)",
                    color: "#F2EAD9",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: 13.5,
                    fontWeight: 700,
                  }}
                >
                  <Square size={12} strokeWidth={3} fill="currentColor" />
                  Parar
                </button>
              </div>

              {modo === "ouvir" && (
                <div className="mt-6">
                  <Regua
                    cents={leitura?.cents ?? null}
                    nota={leitura ? letraDe(leitura.midi) : null}
                    latino={leitura ? latinoDe(leitura.midi) : null}
                    ordinal={leitura ? ordinalDaCorda(leitura.indice, cordas.length) : null}
                    hz={hzOuvido}
                    estado={escuta}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── corda nova ───────────────────────────────────────────────── */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto w-full px-5 py-16 md:px-12 md:py-20" style={{ maxWidth: 1280 }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[46ch]">
              <h2
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  fontWeight: 500,
                  color: "var(--ink-strong)",
                }}
              >
                Corda gasta não segura afinação.
              </h2>
              <p className="mt-4" style={{ fontFamily: "var(--font-family-inter)", fontSize: 16, lineHeight: 1.6, color: "var(--ink-muted)" }}>
                Se você afina, toca dois minutos e ela cai de novo, o problema
                não é a tarraxa. É o jogo de cordas pedindo troca.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to={`/produtos?search=${encodeURIComponent(instrumento.buscaCorda)}`}
                className="underline-offset-4 hover:underline"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 14.5, fontWeight: 600, color: "var(--ink-strong)" }}
              >
                Ver cordas de {instrumento.nome.toLowerCase()}
              </Link>
              <Link
                to="/monte-seu-kit/ajuda"
                className="underline-offset-4 hover:underline"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: 14.5, fontWeight: 600, color: "var(--ink-muted)" }}
              >
                Não sei qual jogo comprar
              </Link>
            </div>
          </div>

          {/* As quatro famílias são as mesmas da home — mesma arte, mesma cor.
              O que muda aqui é que uma delas responde ao afinador: quem estava
              afinando um baixo vê o jogo de baixo à frente, com o selo. As
              outras três continuam à mão, só recuadas. */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FAMILIAS.map((f) => {
              const combina = f.key === instrumento.familiaCorda;
              return (
                <div
                  key={f.key}
                  className="relative"
                  style={{
                    transform: combina ? "translateY(-10px)" : "none",
                    transition: "transform .45s var(--ease), opacity .3s ease",
                    opacity: combina ? 1 : 0.74,
                  }}
                >
                  {combina && (
                    <span
                      className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-pill px-3.5 py-1.5"
                      style={{
                        background: "var(--ink-strong)",
                        color: "#fff",
                        fontFamily: "var(--font-family-inter)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Combina com {instrumento.nome.toLowerCase()}
                    </span>
                  )}
                  <div
                    className="overflow-hidden rounded-[10px]"
                    style={{
                      boxShadow: combina ? "0 0 0 2px var(--amber)" : "none",
                      borderRadius: 10,
                      transition: "box-shadow .3s ease",
                    }}
                  >
                    <FamiliaCard f={f} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function BotaoPasso({ rotulo, onClick, children }: { rotulo: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="grid w-11 cursor-pointer place-items-center transition-colors duration-150 hover:bg-[rgba(255,238,210,0.09)] active:bg-[rgba(255,238,210,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F0B24A]/60"
      style={{ color: "rgba(242,234,217,0.72)" }}
    >
      {children}
    </button>
  );
}

function Campo({ rotulo, children, className = "" }: { rotulo: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: 13, fontWeight: 600, color: "rgba(242,234,217,0.55)" }}>
        {rotulo}
      </p>
      {children}
    </div>
  );
}
