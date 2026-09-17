/* Quiz — "me ajuda a escolher".
 *
 * Quatro passos, não seis. O PCYES v3 tem dois ou três (MonteSeuPcPage.tsx:1809)
 * e é por isso que ninguém abandona no meio; seis telas de formulário matam
 * qualquer vontade de comprar.
 *
 * Máquina de estados por pilha, igual ao QuizFlow do v3: voltar é pop, nunca
 * recalcular caminho. Assim o botão Voltar diz a verdade mesmo quando o passo
 * seguinte depende do anterior.
 *
 * O passo do gosto junta gênero e banda numa tela só. Duas telas separadas
 * (gênero, depois banda) foi a primeira ideia e ela alonga o fluxo sem ganhar
 * precisão: quem escolhe "Ramones" já disse "rock" e já disse "punk". */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  Church,
  Flame,
  Headphones,
  House,
  Mic,
  RotateCcw,
  Speaker,
  Sprout,
  Volume2,
} from "lucide-react";
import { ProductCardV2 } from "../../v2/ProductCardV2";
import { playSample, stopSample } from "../../lib/timbre";
import {
  BANDS,
  GENEROS,
  acharBand,
  buscarBands,
  type Band,
  type Genero,
} from "../../lib/bandLibrary";
import type { Faixa } from "../guia/motor";
import {
  FAIXAS_LABEL,
  FAMILIAS,
  NIVEIS,
  ONDES,
  kitSugerido,
  montarPerfilKit,
  recomendarKit,
  type Nivel,
  type Onde,
  type RespostasKit,
} from "./motorKit";
import { kitHero } from "../../lib/kits";
import { Footer } from "../../components/Footer";

type Passo = "instrumento" | "gosto" | "nivel" | "contexto" | "resultado";

const TOTAL = 4;
const ORDEM: Passo[] = ["instrumento", "gosto", "nivel", "contexto"];

export function AjudaPage() {
  const navigate = useNavigate();
  const [pilha, setPilha] = useState<Passo[]>(["instrumento"]);
  const [r, setR] = useState<RespostasKit>({});
  const passo = pilha[pilha.length - 1];

  const avancar = (proximo: Passo, patch: Partial<RespostasKit> = {}) => {
    setR((atual) => ({ ...atual, ...patch }));
    setPilha((p) => [...p, proximo]);
  };
  const voltar = () => setPilha((p) => (p.length > 1 ? p.slice(0, -1) : p));

  useEffect(() => () => stopSample(), []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [passo]);

  const indice = ORDEM.indexOf(passo);

  return (
    <>
    <main className="min-h-[70vh] bg-white">
      <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => (pilha.length > 1 ? voltar() : navigate("/monte-seu-kit"))}
            className="inline-flex items-center gap-2 text-[0.9375rem] text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          {indice >= 0 && (
            <span className="text-[0.8125rem] text-foreground/50">
              {indice + 1} de {TOTAL}
            </span>
          )}
        </div>

        {indice >= 0 && <Progresso indice={indice} />}

        <div key={passo} className="quiz-passo mt-10">
          {passo === "instrumento" && (
            <PassoInstrumento onPick={(id) => avancar("gosto", { instrumento: id })} />
          )}
          {passo === "gosto" && (
            <PassoGosto
              instrumento={r.instrumento!}
              escolhidas={r.bands ?? []}
              onChange={(bands) => setR((a) => ({ ...a, bands }))}
              onNext={() => avancar("nivel")}
            />
          )}
          {passo === "nivel" && <PassoNivel onPick={(id) => avancar("contexto", { nivel: id })} />}
          {passo === "contexto" && (
            <PassoContexto
              onDone={(onde, faixa) => avancar("resultado", { onde, faixa })}
            />
          )}
          {passo === "resultado" && <Resultado r={r} />}
        </div>
      </div>

      <style>{`
        .quiz-passo { animation: quizIn 320ms cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes quizIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .quiz-passo { animation: none; } }
      `}</style>
    </main>
    <Footer />
    </>
  );
}

function Progresso({ indice }: { indice: number }) {
  return (
    <div className="mt-5 flex gap-1.5" aria-hidden>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <span
          key={i}
          className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
            i <= indice ? "bg-[var(--amber)]" : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

function Titulo({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <header className="mx-auto max-w-[52ch] text-center">
      <h1
        className="text-[clamp(1.75rem,4.2vw,2.75rem)] leading-[1.08] tracking-[-0.015em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        {children}
      </h1>
      {sub && <p className="mx-auto mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-foreground/65">{sub}</p>}
    </header>
  );
}

/* ——— 1 · instrumento ————————————————————————————————————————————————— */

function PassoInstrumento({ onPick }: { onPick: (id: (typeof FAMILIAS)[number]["id"]) => void }) {
  const [soando, setSoando] = useState<string | null>(null);
  const cancelar = useRef<(() => void) | null>(null);

  /* O card toca o timbre no hover. É a única coisa nesta tela que o v3 não
     tinha e não poderia ter: lá o equivalente seria mostrar FPS, aqui é o som
     de verdade, e o acervo já existia em public/audio. */
  const tocar = (id: string, pasta: string) => {
    cancelar.current?.();
    setSoando(id);
    cancelar.current = playSample(`/audio/${pasta}/01.mp3`, () => setSoando(null));
  };
  const parar = () => {
    cancelar.current?.();
    cancelar.current = null;
    setSoando(null);
  };
  useEffect(() => () => { cancelar.current?.(); stopSample(); }, []);

  return (
    <>
      <Titulo sub="Passe o mouse pra ouvir como cada um soa.">Que instrumento você quer tocar?</Titulo>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
        {FAMILIAS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => { parar(); onPick(f.id); }}
            onMouseEnter={() => tocar(f.id, f.audio)}
            onMouseLeave={parar}
            onFocus={() => tocar(f.id, f.audio)}
            onBlur={parar}
            className="group text-left focus:outline-none"
          >
            {/* Mesma moldura da grade de categorias da home (v2/CategoriasV2,
                variante "soft"): em repouso é só arte sobre branco, e a sombra
                aparece no hover levantando o tile 2px. Fundo bege aqui brigava
                com o recorte de estúdio das fotos, que já são brancas. */}
            <div className="relative overflow-hidden rounded-[8px] bg-white transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-tile-hover)] group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-[var(--shadow-tile-hover)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              <img
                src={f.foto}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-contain p-5"
              />
              {soando === f.id && (
                <span className="absolute bottom-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-amber-text shadow-sm backdrop-blur-sm">
                  <Volume2 className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            <h2 className="mt-4 text-[1.0625rem] font-semibold text-foreground">{f.label}</h2>
            <p className="mt-1 text-[0.8125rem] leading-snug text-foreground/55">{f.hint}</p>
          </button>
        ))}
      </div>
    </>
  );
}

/* ——— 2 · gosto ——————————————————————————————————————————————————————— */

function PassoGosto({
  instrumento,
  escolhidas,
  onChange,
  onNext,
}: {
  instrumento: (typeof FAMILIAS)[number]["id"];
  escolhidas: string[];
  onChange: (ids: string[]) => void;
  onNext: () => void;
}) {
  const [genero, setGenero] = useState<Genero | null>(null);
  const [termo, setTermo] = useState("");

  const universo = useMemo(
    () => BANDS.filter((b) => b.instrumentos.includes(instrumento)),
    [instrumento],
  );
  const generosComBanda = useMemo(
    () => GENEROS.filter((g) => universo.some((b) => b.genero === g.id)),
    [universo],
  );
  const lista = useMemo(() => {
    const porGenero = genero ? universo.filter((b) => b.genero === genero) : universo;
    return buscarBands(termo, porGenero);
  }, [universo, genero, termo]);

  const alternar = (id: string) =>
    onChange(escolhidas.includes(id) ? escolhidas.filter((x) => x !== id) : [...escolhidas, id]);

  return (
    <>
      <Titulo sub="É só pra entender o som que você quer fazer.">
        Quais artistas você ouve?
      </Titulo>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Chip ativo={genero === null} onClick={() => setGenero(null)}>
          Tudo
        </Chip>
        {generosComBanda.map((g) => (
          <Chip key={g.id} ativo={genero === g.id} onClick={() => setGenero(g.id)}>
            {g.label}
          </Chip>
        ))}
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar artista"
          className="ml-auto h-9 w-full rounded-[var(--radius-pill)] border border-foreground/12 bg-white px-4 text-[0.875rem] text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-[var(--amber)] sm:w-56"
        />
      </div>

      {lista.length === 0 ? (
        <p className="mt-10 text-[0.9375rem] text-foreground/60">
          Nada com esse nome por aqui. Tente outro, ou siga sem marcar. O guia
          funciona do mesmo jeito.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {lista.map((b) => (
            <BandTile key={b.id} band={b} marcada={escolhidas.includes(b.id)} onClick={() => alternar(b.id)} />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={onNext}
          className="h-12 rounded-[var(--radius-pill)] bg-foreground px-8 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90"
        >
          {escolhidas.length ? `Continuar com ${escolhidas.length}` : "Continuar"}
        </button>
        {!escolhidas.length && (
          <span className="text-[0.875rem] text-foreground/55">
            Pode seguir sem marcar ninguém.
          </span>
        )}
      </div>
    </>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-[var(--radius-pill)] px-4 text-[0.875rem] transition-colors ${
        ativo
          ? "bg-foreground [color:#fff]"
          : "border border-foreground/12 text-foreground/70 hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* O card da banda é tipográfico por decisão, não por falta: o caminho de uma
   capa de álbum na Wikipedia é um hash que não dá pra deduzir, e sessenta links
   quebrados seriam pior que nenhum. O nome sobre as duas cores da banda é o
   fallback que o v3 só usa quando a logo falha (ProgramTile:1603) — aqui ele é
   o padrão. Quando houver arquivo em /bandas/{id}.jpg, `cover` assume. */
function BandTile({ band, marcada, onClick }: { band: Band; marcada: boolean; onClick: () => void }) {
  /* Com capa de álbum por cima, o texto não pode depender mais do bg1: a foto é
     que está atrás dele. Branco sobre o scrim, sempre. */
  const claro = band.cover ? false : ehClaro(band.bg1);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={marcada}
      className="group relative aspect-square overflow-hidden rounded-[var(--radius-card-md)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-2"
      style={{ background: `linear-gradient(155deg, ${band.bg1} 0%, ${band.bg2} 100%)` }}
    >
      {band.cover && (
        <img
          src={band.cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}
      {/* Scrim: capa de álbum é imprevisível (metade são fotos claras), então o
          nome só se sustenta sobre um degradê fixo no rodapé do card. */}
      {band.cover && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0) 100%)" }}
        />
      )}
      <span
        className={`absolute inset-0 transition-opacity duration-300 ${
          marcada ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ background: "rgba(0,0,0,0.12)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <span
          className={`text-[1.0625rem] leading-[1.1] tracking-[-0.01em] ${claro ? "text-[#111]" : "[color:#fff]"}`}
          style={{ fontFamily: "var(--font-family-figtree)" }}
        >
          {band.name}
        </span>
        <span className={`mt-1 text-[0.75rem] ${claro ? "text-[#111]/65" : "[color:rgba(255,255,255,0.7)]"}`}>
          {band.tag}
        </span>
      </div>
      {marcada && (
        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--amber)] [color:#fff]">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      <span
        className={`pointer-events-none absolute inset-0 rounded-[var(--radius-card-md)] transition-shadow ${
          marcada ? "shadow-[inset_0_0_0_3px_var(--amber)]" : ""
        }`}
      />
    </button>
  );
}

function ehClaro(hex: string): boolean {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

/* ——— 3 · nível ——————————————————————————————————————————————————————— */

function PassoNivel({ onPick }: { onPick: (id: Nivel) => void }) {
  return (
    <>
      <Titulo>Você já toca algum instrumento?</Titulo>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {NIVEIS.map((n) => (
          <Cartao key={n.id} titulo={n.label} sub={n.sub} icone={n.icone} onClick={() => onPick(n.id)} />
        ))}
      </div>
    </>
  );
}


/* Ícone por opção. Estes cards não têm foto — nem faria sentido fotografar
   "tô voltando" — então o ícone é o que dá peso visual e diferencia um card do
   outro num grid de quatro retângulos iguais. */
const ICONES: Record<string, React.ReactNode> = {
  sprout: <Sprout className="h-5 w-5" />,
  rotate: <RotateCcw className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  casa: <House className="h-5 w-5" />,
  igreja: <Church className="h-5 w-5" />,
  palco: <Speaker className="h-5 w-5" />,
  microfone: <Mic className="h-5 w-5" />,
  fone: <Headphones className="h-5 w-5" />,
};

function Cartao({
  titulo,
  sub,
  onClick,
  ativo,
  icone,
}: {
  titulo: string;
  sub: string;
  onClick: () => void;
  ativo?: boolean;
  icone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex items-start gap-4 rounded-[var(--radius-card-lg)] border p-6 text-left transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-tile-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        ativo
          ? "border-[var(--amber)] bg-[var(--amber)]/[0.04]"
          : "border-foreground/12 hover:border-foreground/35"
      }`}
    >
      {icone && ICONES[icone] && (
        <span
          aria-hidden
          className={`mt-0.5 shrink-0 transition-colors ${ativo ? "text-amber-text" : "text-foreground/45"}`}
        >
          {ICONES[icone]}
        </span>
      )}
      <span className="min-w-0">
        <span
          className="block text-[1.25rem] leading-tight text-foreground"
          style={{ fontFamily: "var(--font-family-figtree)" }}
        >
          {titulo}
        </span>
        <span className="mt-2 block text-[0.875rem] leading-relaxed text-foreground/60">{sub}</span>
      </span>
    </button>
  );
}

/* ——— 4 · onde e quanto ——————————————————————————————————————————————— */

function PassoContexto({ onDone }: { onDone: (onde: Onde, faixa: Faixa) => void }) {
  const [onde, setOnde] = useState<Onde | null>(null);
  const [faixa, setFaixa] = useState<Faixa | null>(null);

  return (
    <>
      <Titulo sub="As duas últimas. Depois disso a gente mostra o que faz sentido pra você.">
        Onde você vai tocar, e quanto quer investir?
      </Titulo>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ONDES.map((o) => (
          <Cartao key={o.id} titulo={o.label} sub={o.sub} icone={o.icone} ativo={onde === o.id} onClick={() => setOnde(o.id)} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {FAIXAS_LABEL.map((f) => (
          <Chip key={f.id} ativo={faixa === f.id} onClick={() => setFaixa(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <button
        type="button"
        disabled={!onde || !faixa}
        onClick={() => onde && faixa && onDone(onde, faixa)}
        className="mt-12 h-12 rounded-[var(--radius-pill)] bg-foreground px-8 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Ver o resultado
      </button>
    </>
  );
}

/* ——— resultado ———————————————————————————————————————————————————————— */

function Resultado({ r }: { r: RespostasKit }) {
  const navigate = useNavigate();
  const bands = (r.bands ?? []).map(acharBand).filter((b): b is Band => !!b);
  const perfil = useMemo(() => montarPerfilKit(r, bands), [r, bands]);
  const produtos = useMemo(() => recomendarKit(perfil), [perfil]);
  const kit = useMemo(() => kitSugerido(perfil, r), [perfil, r]);

  return (
    <>
      <p className="text-[0.875rem] text-foreground/55">O que a gente entendeu</p>
      <h1
        className="mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        {perfil.titulo}
      </h1>

      <ul className="mt-8 max-w-[62ch] space-y-3">
        {perfil.porques.map((p, i) => (
          <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-foreground/75">
            <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
            {p}
          </li>
        ))}
      </ul>

      {kit && (
        <section
          className="mt-14 overflow-hidden rounded-[var(--radius-card-lg)]"
          style={{ background: "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.06) 0%, rgba(var(--foreground-rgb), 0.02) 100%)", border: "1px solid rgba(var(--foreground-rgb), 0.08)" }}
        >
          <div className="grid items-center gap-6 sm:grid-cols-[1.1fr_1fr]">
            <div className="p-7 sm:p-9">
              <p className="text-[0.875rem] text-foreground/55">Pelo que você contou, um kit resolve melhor</p>
              <h2
                className="mt-2 text-[1.75rem] leading-tight text-foreground"
                style={{ fontFamily: "var(--font-family-figtree)" }}
              >
                Kit {kit.seed.name}
              </h2>
              <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-foreground/70">
                {kit.seed.praQuem.texto}
              </p>
              <button
                type="button"
                onClick={() => navigate(`/produto/${kit.id}`)}
                className="mt-6 h-11 rounded-[var(--radius-pill)] bg-foreground px-7 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90"
              >
                Ver o kit
              </button>
            </div>
            <img
              src={kitHero(kit.seed.key, "wide")}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
            />
          </div>
        </section>
      )}

      {produtos.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-[1.25rem] text-foreground" style={{ fontFamily: "var(--font-family-figtree)" }}>
            {kit ? "Ou só o instrumento" : "O que faz sentido pra você"}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {produtos.map((p, i) => (
              <ProductCardV2 key={p.id} product={p} context="catalog" rank={i === 0 ? 1 : undefined} />
            ))}
          </div>
        </section>
      ) : (
        /* Teclado e sopro ainda não têm catálogo. Dizer isso é melhor que
           devolver um grid vazio e deixar o cliente achar que quebrou. */
        <section className="mt-16 max-w-[52ch]">
          <h2 className="text-[1.25rem] text-foreground" style={{ fontFamily: "var(--font-family-figtree)" }}>
            Ainda não vendemos esse instrumento
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/70">
            Anotamos seu perfil. Fale com a gente e um músico da loja te indica o
            caminho enquanto a linha não chega.
          </p>
          <button
            type="button"
            onClick={() => navigate("/fale-conosco")}
            className="mt-6 h-11 rounded-[var(--radius-pill)] border border-foreground/15 px-7 text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-foreground/40"
          >
            Falar com um músico
          </button>
        </section>
      )}
    </>
  );
}
