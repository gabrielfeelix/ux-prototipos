import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ArrowRight, Check, Guitar, Music2, Home, Church, Mic2, Radio,
  Sparkles, RotateCcw, Headphones,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { ProductCardV2 } from "../v2/ProductCardV2";
import { getCatalogHref } from "../components/productPresentation";
import {
  ESTILOS, montarPerfil, recomendar,
  type Faixa, type Instrumento, type Nivel, type Onde, type Respostas,
} from "./guia/motor";

/* Guia do Instrumento — o quiz do "Monte seu PC" (PCYES v3) adaptado pra
   música: mesma espinha (passos encadeados, histórico pra voltar, recomendação
   pontuada no fim), outro domínio. Vive na identidade da home v2: fundo branco,
   pílula preta, âmbar como acento, Fraunces no título. */

type PassoId = "instrumento" | "nivel" | "estilos" | "onde" | "faixa" | "resultado";

const INSTRUMENTOS: { id: Instrumento; label: string; sub: string; icon: typeof Guitar }[] = [
  { id: "violao", label: "Violão", sub: "Nylon ou aço, do primeiro acorde ao palco", icon: Guitar },
  { id: "guitarra", label: "Guitarra", sub: "Elétrica, pra quem vai plugar", icon: Music2 },
  { id: "baixo", label: "Contrabaixo", sub: "O chão da banda", icon: Radio },
];

const NIVEIS: { id: Nivel; label: string; sub: string }[] = [
  { id: "primeiro", label: "É o meu primeiro", sub: "Nunca toquei, ou tô começando agora" },
  { id: "retomando", label: "Tô voltando a tocar", sub: "Já toquei um tempo e parei" },
  { id: "toco", label: "Toco há anos", sub: "Sei o que quero ouvir do instrumento" },
];

const ONDES: { id: Onde; label: string; sub: string; icon: typeof Home }[] = [
  { id: "casa", label: "Em casa", sub: "Sozinho, ou pra roda de amigos", icon: Home },
  { id: "igreja", label: "Na igreja", sub: "Ligado na mesa de som", icon: Church },
  { id: "palco", label: "No palco", sub: "Bar, evento, show", icon: Mic2 },
  { id: "estudio", label: "Em estúdio", sub: "Gravação e ensaio", icon: Headphones },
];

const FAIXAS_UI: { id: Faixa; label: string; sub: string }[] = [
  { id: "ate-400", label: "Até R$ 400", sub: "Primeiro instrumento" },
  { id: "400-600", label: "R$ 400 a R$ 600", sub: "O degrau mais procurado" },
  { id: "600-900", label: "R$ 600 a R$ 900", sub: "Tampo e acabamento melhores" },
  { id: "sem-limite", label: "Me mostra o melhor", sub: "Sem faixa de preço" },
];

/* ─────────────────────────── peças ─────────────────────────── */

function Progresso({ atual, total, onVoltar, eyebrow, titulo, subtitulo }: {
  atual: number; total: number; onVoltar?: () => void;
  eyebrow: string; titulo: string; subtitulo: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="mb-6 flex items-center gap-4">
        {onVoltar && (
          <button onClick={onVoltar} aria-label="Voltar"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-2)]"
            style={{ border: "1px solid var(--edge)", color: "var(--ink-strong)" }}
          ><ArrowLeft size={16} /></button>
        )}
        {/* Régua de passos em vez de "2/5" só: a barra diz de relance quanto
            falta, o número confirma. Uma coisa só nunca responde as duas. */}
        <div className="flex flex-1 items-center gap-3">
          <span className="flex flex-1 gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className="h-[3px] flex-1 rounded-full transition-all duration-400"
                style={{ background: i < atual ? "var(--primary)" : "var(--edge)" }} />
            ))}
          </span>
          <span className="shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", fontWeight: 600, color: "var(--ink-subtle)", fontVariantNumeric: "tabular-nums" }}>
            {atual} de {total}
          </span>
        </div>
      </div>

      <p className="pb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-text)" }}>
        {eyebrow}
      </p>
      <h1 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink-strong)" }}>
        {titulo}
      </h1>
      <p className="max-w-[640px] pt-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", lineHeight: 1.6, color: "var(--ink-muted)" }}>
        {subtitulo}
      </p>
    </div>
  );
}

/* Card de escolha. Em repouso não tem sombra — é o tile da home: branco sobre
   branco, definido pela borda. A sombra só aparece no hover, e aí ela é a
   resposta ao ponteiro, não decoração. */
function Escolha({ label, sub, icon: Icon, ativo, onClick }: {
  label: string; sub: string; icon?: typeof Guitar; ativo?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={ativo}
      className="group flex w-full cursor-pointer flex-col items-start gap-3 p-5 text-left transition-[border-color,box-shadow,transform] duration-250 hover:-translate-y-0.5 hover:shadow-[var(--shadow-tile-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
      style={{
        borderRadius: "var(--radius-card-xl)",
        border: `1px solid ${ativo ? "var(--ink-strong)" : "var(--edge)"}`,
        background: "#ffffff",
        boxShadow: ativo ? "var(--shadow-tile-hover)" : undefined,
      }}
    >
      {Icon && (
        <span className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-250"
          style={{ background: ativo ? "var(--ink-strong)" : "rgba(200,120,0,0.10)", color: ativo ? "#ffffff" : "var(--amber-deep)" }}>
          <Icon size={19} strokeWidth={1.8} />
        </span>
      )}
      <span className="block">
        <span className="block" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "19px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>
          {label}
        </span>
        <span className="block pt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: 1.5, color: "var(--ink-muted)" }}>
          {sub}
        </span>
      </span>
    </button>
  );
}

/* Estilo é multi-escolha, então vira chip e não card: card grande repetido oito
   vezes vira parede, e a pessoa ainda tem que marcar mais de um. */
function Chip({ label, hint, ativo, onClick }: { label: string; hint: string; ativo: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={ativo}
      className="flex cursor-pointer items-center gap-2.5 rounded-pill px-4 py-3 transition-[border-color,background-color,transform] duration-200 active:scale-[0.98]"
      style={{
        border: `1px solid ${ativo ? "var(--ink-strong)" : "var(--edge)"}`,
        background: ativo ? "var(--ink-strong)" : "#ffffff",
        color: ativo ? "#ffffff" : "var(--ink-strong)",
      }}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors duration-200"
        style={{ border: `1.5px solid ${ativo ? "#ffffff" : "var(--edge-strong)"}`, background: ativo ? "#ffffff" : "transparent" }}>
        {ativo && <Check size={10} strokeWidth={3} style={{ color: "var(--ink-strong)" }} />}
      </span>
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: ativo ? "rgba(255,255,255,0.6)" : "var(--ink-subtle)" }}>
        {hint}
      </span>
    </button>
  );
}

const anim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

/* ─────────────────────────── página ─────────────────────────── */

export function GuiaPage() {
  const [historico, setHistorico] = useState<PassoId[]>(["instrumento"]);
  const [r, setR] = useState<Respostas>({});
  const passo = historico[historico.length - 1];

  /* Guitarra e baixo pulam o repertório: no catálogo deles o estilo não muda
     nenhum atributo, e pergunta que não muda a resposta é pedágio. */
  const total = (r.instrumento ?? "violao") === "violao" ? 5 : 4;
  const numero = Math.min(historico.length, total);

  const avancar = (p: PassoId) => setHistorico((h) => [...h, p]);
  const voltar = () => setHistorico((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const refazer = () => { setR({}); setHistorico(["instrumento"]); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const escolheInstrumento = (id: Instrumento) => { setR((p) => ({ ...p, instrumento: id })); avancar("nivel"); };
  const escolheNivel = (id: Nivel) => {
    setR((p) => ({ ...p, nivel: id }));
    avancar((r.instrumento ?? "violao") === "violao" ? "estilos" : "onde");
  };
  const alternaEstilo = (id: string) => setR((p) => {
    const atual = p.estilos ?? [];
    return { ...p, estilos: atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id] };
  });
  const escolheOnde = (id: Onde) => { setR((p) => ({ ...p, onde: id })); avancar("faixa"); };
  const escolheFaixa = (id: Faixa) => { setR((p) => ({ ...p, faixa: id })); avancar("resultado"); };

  const perfil = useMemo(() => montarPerfil(r), [r]);
  const sugeridos = useMemo(() => (passo === "resultado" ? recomendar(perfil) : []), [passo, perfil]);
  const estilosMarcados = (r.estilos ?? []).length;

  return (
    <>
      <SEO
        title="Guia: encontre seu instrumento"
        description="Responda cinco perguntas sobre o que você toca e onde toca. A Tonante indica o violão certo — nylon ou aço, com ou sem captação — e mostra os modelos."
        canonicalPath="/guia"
      />

      <div style={{ background: "#ffffff" }}>
        <div className="mx-auto w-full px-5 py-10 md:px-12 md:py-16" style={{ maxWidth: "1180px" }}>
          <AnimatePresence mode="wait">
            {passo === "instrumento" && (
              <motion.div key="instrumento" {...anim}>
                <Progresso atual={1} total={total}
                  eyebrow="Guia Tonante"
                  titulo="Vamos achar o seu instrumento."
                  subtitulo="Cinco perguntas sobre o que você toca e onde toca. No fim a gente diz qual é o seu e por quê — sem empurrar o mais caro."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {INSTRUMENTOS.map((i) => (
                    <Escolha key={i.id} label={i.label} sub={i.sub} icon={i.icon} onClick={() => escolheInstrumento(i.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {passo === "nivel" && (
              <motion.div key="nivel" {...anim}>
                <Progresso atual={2} total={total} onVoltar={voltar}
                  eyebrow="Sua mão"
                  titulo="Você já toca?"
                  subtitulo="Isso muda mais coisa do que parece: mão nova sofre menos com corda de nylon, e quem já toca ouve diferença de tampo."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {NIVEIS.map((n) => (
                    <Escolha key={n.id} label={n.label} sub={n.sub} onClick={() => escolheNivel(n.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {passo === "estilos" && (
              <motion.div key="estilos" {...anim}>
                <Progresso atual={3} total={total} onVoltar={voltar}
                  eyebrow="Seu repertório"
                  titulo="O que você toca?"
                  subtitulo="Marque quantos quiser. É o repertório que decide a corda — dedilhado pede nylon, palhetada pede aço."
                />
                <div className="flex flex-wrap gap-2.5">
                  {ESTILOS.map((e) => (
                    <Chip key={e.id} label={e.label} hint={e.hint}
                      ativo={(r.estilos ?? []).includes(e.id)} onClick={() => alternaEstilo(e.id)} />
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button onClick={() => avancar("onde")}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-pill px-8 py-3.5 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, boxShadow: "var(--shadow-brand-cta-sm)" }}
                  >
                    Continuar<ArrowRight size={15} />
                  </button>
                  {/* Pular é resposta válida: quem não sabe o que toca ainda cai
                      na regra do nível, e obrigar a marcar inventaria um dado. */}
                  <button onClick={() => avancar("onde")}
                    className="cursor-pointer transition-colors duration-200 hover:text-[var(--ink-strong)]"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "var(--ink-subtle)" }}
                  >
                    {estilosMarcados > 0 ? `${estilosMarcados} marcado${estilosMarcados > 1 ? "s" : ""}` : "Ainda não sei — pular"}
                  </button>
                </div>
              </motion.div>
            )}

            {passo === "onde" && (
              <motion.div key="onde" {...anim}>
                <Progresso atual={total - 1} total={total} onVoltar={voltar}
                  eyebrow="Seu palco"
                  titulo="Onde você vai tocar?"
                  subtitulo="É o que decide se você precisa de captação. Quem toca só em casa paga por uma eletrônica que nunca vai ligar."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {ONDES.map((o) => (
                    <Escolha key={o.id} label={o.label} sub={o.sub} icon={o.icon} onClick={() => escolheOnde(o.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {passo === "faixa" && (
              <motion.div key="faixa" {...anim}>
                <Progresso atual={total} total={total} onVoltar={voltar}
                  eyebrow="Seu investimento"
                  titulo="Quanto você quer investir?"
                  subtitulo="A faixa não corta a lista: ela ordena. Se o instrumento certo pra você estiver um degrau acima, a gente mostra e diz o porquê."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {FAIXAS_UI.map((f) => (
                    <Escolha key={f.id} label={f.label} sub={f.sub} onClick={() => escolheFaixa(f.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {passo === "resultado" && (
              <motion.div key="resultado" {...anim}>
                <div className="mb-8 flex items-center gap-4">
                  <button onClick={voltar} aria-label="Voltar"
                    className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-2)]"
                    style={{ border: "1px solid var(--edge)", color: "var(--ink-strong)" }}
                  ><ArrowLeft size={16} /></button>
                  <button onClick={refazer}
                    className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-[var(--ink-strong)]"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "var(--ink-subtle)" }}
                  ><RotateCcw size={13} />Refazer o guia</button>
                </div>

                {/* O veredito antes dos produtos: a pessoa respondeu cinco
                    perguntas, merece a resposta em uma frase antes da vitrine. */}
                <div className="overflow-hidden"
                  style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--edge-subtle)", background: "var(--surface-2)" }}>
                  <div className="px-6 py-7 md:px-9 md:py-9">
                    <p className="flex items-center gap-2 pb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-text)" }}>
                      <Sparkles size={13} />O seu é
                    </p>
                    <h1 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink-strong)" }}>
                      {perfil.titulo}
                    </h1>

                    <ul className="mt-6 grid gap-3 md:grid-cols-2">
                      {perfil.porques.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                            style={{ background: "rgba(200,120,0,0.14)", color: "var(--amber-deep)" }}>
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", lineHeight: 1.6, color: "var(--ink-muted)" }}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-6 mt-12 flex items-end justify-between gap-4">
                  <div>
                    <h2 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>
                      Os que combinam com você
                    </h2>
                    <p className="pt-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", color: "var(--ink-muted)" }}>
                      Em ordem de encaixe com as suas respostas — o primeiro é o mais próximo.
                    </p>
                  </div>
                  <Link to={getCatalogHref({ category: perfil.instrumento === "violao" ? "Violões" : perfil.instrumento === "guitarra" ? "Guitarras" : "Contrabaixos" })}
                    className="hidden shrink-0 items-center gap-1.5 transition-colors duration-200 hover:text-[var(--amber-text)] md:flex"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600, color: "var(--ink-strong)" }}
                  >Ver todos<ArrowRight size={15} /></Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sugeridos.map((p, i) => (
                    <ProductCardV2 key={p.id} product={p} context="catalog" rank={i === 0 ? 1 : undefined} />
                  ))}
                </div>

                {/* O atendimento humano saiu do header e caiu aqui, que é onde
                    ele faz falta de verdade: depois da recomendação, pra quem
                    continuou em dúvida. */}
                <div className="mt-12 flex flex-col items-start gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between md:px-9"
                  style={{ borderRadius: "var(--radius-card-xl)", border: "1px solid var(--edge-subtle)", background: "#ffffff" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "19px", fontWeight: 700, color: "var(--ink-strong)" }}>
                      Ainda na dúvida entre dois?
                    </p>
                    <p className="pt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", color: "var(--ink-muted)" }}>
                      Fala com quem toca. A gente responde qual dos dois soa mais perto do que você quer.
                    </p>
                  </div>
                  <Link to="/fale-conosco"
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-pill px-7 py-3.5 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600 }}
                  >Falar com um músico<ArrowRight size={15} /></Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
