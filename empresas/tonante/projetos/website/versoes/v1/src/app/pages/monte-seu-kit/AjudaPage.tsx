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
  Music,
  RotateCcw,
  Speaker,
  Sprout,
  Tag,
  TrendingUp,
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
import {
  FAMILIAS,
  NIVEIS,
  ONDES,
  faixasDaFamilia,
  kitSugerido,
  montarPerfilKit,
  recomendarKit,
  type FaixaPreco,
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
  const sair = () => (pilha.length > 1 ? voltar() : navigate("/monte-seu-kit"));

  /* O avanço é do passo, mas o botão é da página. Antes cada tela desenhava o
     seu: sobrava um "Voltar" sozinho em cima e um "Continuar" sozinho embaixo,
     em cantos trocados, e a pessoa tinha que caçar qual dos dois existia ali.
     Agora o par nasce junto, na mesma barra, repetida em cima e embaixo — quem
     decidiu no primeiro card não rola até o fim, e quem rolou não volta ao topo.
     Instrumento e nível não entram: ali o clique no card já avança, e um
     "Continuar" apagado ao lado só promete uma etapa que não existe. */
  const acao =
    passo === "gosto"
      ? { label: "Continuar", ativo: true, onClick: () => avancar("nivel") }
      : passo === "contexto"
        ? {
            label: "Ver o resultado",
            ativo: !!r.onde,
            onClick: () => avancar("resultado"),
          }
        : undefined;

  return (
    <>
    <main className="min-h-[70vh] bg-white">
      <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <BarraNav
          onVoltar={sair}
          contador={indice >= 0 ? `${indice + 1} de ${TOTAL}` : undefined}
          acao={acao}
        />

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
            />
          )}
          {passo === "nivel" && <PassoNivel onPick={(id) => avancar("contexto", { nivel: id })} />}
          {passo === "contexto" && (
            <PassoContexto
              instrumento={r.instrumento!}
              onde={r.onde ?? null}
              faixas={r.faixas ?? []}
              onOnde={(onde) => setR((a) => ({ ...a, onde }))}
              onFaixas={(faixas) => setR((a) => ({ ...a, faixas }))}
            />
          )}
          {passo === "resultado" && <Resultado r={r} />}
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-6">
          <BarraNav onVoltar={sair} acao={acao} />
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

/* Grade de três colunas, não flex: com justify-between o contador escorrega
   pro lado que estiver vazio, e o "3 de 4" some do meio quando o passo não tem
   botão. A ação fica sempre na direita, que é onde a mão volta a cada passo. */
function BarraNav({
  onVoltar,
  contador,
  acao,
}: {
  onVoltar: () => void;
  contador?: string;
  acao?: { label: string; ativo: boolean; onClick: () => void };
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <button
        type="button"
        onClick={onVoltar}
        className="inline-flex w-fit items-center gap-2 text-[0.9375rem] text-foreground/60 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
      <span className="text-[0.8125rem] text-foreground/50">{contador}</span>
      {acao ? (
        <button
          type="button"
          disabled={!acao.ativo}
          onClick={acao.onClick}
          className="h-12 justify-self-end rounded-[var(--radius-pill)] bg-foreground px-8 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {acao.label}
        </button>
      ) : (
        <span aria-hidden />
      )}
    </div>
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
      {/* "Que instrumento" deixou de servir quando voz entrou na grade: quem
          canta não toca instrumento nenhum. Mesma pergunta do montador. */}
      <Titulo sub="Passe o mouse pra ouvir como cada um soa.">O que você toca?</Titulo>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
        {FAMILIAS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => { parar(); onPick(f.id); }}
            onMouseEnter={() => f.audio && tocar(f.id, f.audio)}
            onMouseLeave={parar}
            onFocus={() => f.audio && tocar(f.id, f.audio)}
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
}: {
  instrumento: (typeof FAMILIAS)[number]["id"];
  escolhidas: string[];
  onChange: (ids: string[]) => void;
}) {
  const [genero, setGenero] = useState<Genero | null>(null);
  const [termo, setTermo] = useState("");

  /* Nenhuma banda declara "voz" em `instrumentos`, e nem deveria: quase todas
     têm alguém cantando. Filtrar por isso devolveria lista vazia, que é a pior
     tela do quiz. Pra quem canta, o acervo inteiro é o universo. */
  const universo = useMemo(
    () => (instrumento === "voz" ? BANDS : BANDS.filter((b) => b.instrumentos.includes(instrumento))),
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

      {!escolhidas.length && (
        <p className="mt-10 text-[0.875rem] text-foreground/55">
          Pode seguir sem marcar ninguém.
        </p>
      )}
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
  preco: <Tag className="h-5 w-5" />,
  curva: <TrendingUp className="h-5 w-5" />,
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

/* As faixas saem do catálogo da família escolhida (motorKit.faixasDaFamilia),
   não de uma lista fixa. Três consequências na tela:
     · quem escolheu contrabaixo não vê "até R$ 400", porque não existe;
     · quem escolheu bateria não vê a pergunta, e a tela fica só com o lugar;
     · a faixa vira caixa de seleção, não pílula única: "de 400 a 600, ou
       de 900 a 1300" é uma resposta legítima e antes não cabia.
   Marcar deixou de ser obrigatório: não marcar nada é "tanto faz", que é o
   que "me mostra o melhor" tentava dizer e dizia errado. */
function PassoContexto({
  instrumento,
  onde,
  faixas: escolhidas,
  onOnde,
  onFaixas,
}: {
  instrumento: (typeof FAMILIAS)[number]["id"];
  onde: Onde | null;
  faixas: FaixaPreco[];
  onOnde: (onde: Onde) => void;
  onFaixas: (faixas: FaixaPreco[]) => void;
}) {
  const faixas = useMemo(() => faixasDaFamilia(instrumento), [instrumento]);

  const marcadas = escolhidas.map((f) => f.id);
  const alternar = (id: string) =>
    onFaixas(
      marcadas.includes(id)
        ? escolhidas.filter((f) => f.id !== id)
        : faixas.filter((f) => marcadas.includes(f.id) || f.id === id),
    );

  return (
    <>
      <Titulo sub="Depois disso a gente mostra o que faz sentido pra você.">
        {faixas.length ? "Onde você vai tocar, e quanto quer investir?" : "Onde você vai tocar?"}
      </Titulo>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ONDES.map((o) => (
          <Cartao key={o.id} titulo={o.label} sub={o.sub} icone={o.icone} ativo={onde === o.id} onClick={() => onOnde(o.id)} />
        ))}
      </div>

      {faixas.length > 0 && (
        <div className="mt-12">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">Quanto você quer investir?</h2>
          <p className="mt-1 text-[0.875rem] text-foreground/60">
            Marque quantas faixas quiser. Sem marcar nenhuma, a gente mostra a linha inteira.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {faixas.map((f) => (
              <ChipFaixa
                key={f.id}
                faixa={f}
                marcada={marcadas.includes(f.id)}
                onClick={() => alternar(f.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* Quadrado, não redondo: o círculo já é o "marcada" do card de banda, que é
   escolha de gosto. Aqui é caixa de seleção e precisa parecer uma — o cliente
   tem que ver de relance que pode marcar mais de uma. A contagem ao lado é o
   que impede a faixa vazia: o número está impresso antes do clique. */
function ChipFaixa({
  faixa,
  marcada,
  onClick,
}: {
  faixa: FaixaPreco;
  marcada: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="checkbox"
      aria-checked={marcada}
      className={`inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-pill)] px-4 text-[0.875rem] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-2 ${
        marcada
          ? "bg-foreground [color:#fff]"
          : "border border-foreground/12 text-foreground/75 hover:border-foreground/35 hover:text-foreground"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-[5px] border transition-colors ${
          marcada ? "border-white bg-white" : "border-foreground/25"
        }`}
      >
        {marcada && <Check className="h-3 w-3 text-foreground" strokeWidth={3.5} />}
      </span>
      <span className="font-semibold">{faixa.label}</span>
      <span className={marcada ? "[color:rgba(255,255,255,0.55)]" : "text-foreground/45"}>
        {faixa.modelos} {faixa.modelos === 1 ? "modelo" : "modelos"}
      </span>
    </button>
  );
}

/* As capas empilhadas do lado do "você marcou": em miniatura o nome não cabe,
   mas a arte a pessoa reconhece de longe. Sem capa, sobra o degradê da banda
   com a inicial, que é o mesmo fallback do card grande. */
function Capinhas({ bands }: { bands: Band[] }) {
  const mostra = bands.slice(0, 3);
  return (
    <span className="flex shrink-0 -space-x-3.5">
      {mostra.map((b) => (
        <span
          key={b.id}
          title={b.name}
          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[12px] ring-2 ring-white"
          style={{ background: `linear-gradient(155deg, ${b.bg1} 0%, ${b.bg2} 100%)` }}
        >
          {b.cover ? (
            <img
              src={b.cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span
              className="text-[0.8125rem] font-semibold [color:#fff]"
              style={{ fontFamily: "var(--font-family-figtree)" }}
            >
              {b.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
      ))}
      {bands.length > mostra.length && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-foreground text-[0.75rem] font-semibold [color:#fff] ring-2 ring-white">
          +{bands.length - mostra.length}
        </span>
      )}
    </span>
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

      {/* Cada motivo vira um cartão com cara própria: as capas que a pessoa
          marcou, o ícone do lugar onde ela toca, a etiqueta do preço. Bolinha
          e texto corrido diziam o mesmo, mas ninguém lia. */}
      <ul className="mt-9 grid gap-4 sm:grid-cols-2">
        {perfil.porques.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-[var(--radius-card-lg)] border border-foreground/10 bg-white p-5"
          >
            {p.bands?.length ? (
              <Capinhas bands={p.bands} />
            ) : (
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--amber)]/12 text-amber-text"
              >
                {ICONES[p.icone] ?? <Music className="h-5 w-5" />}
              </span>
            )}
            <p className="text-[0.9375rem] leading-relaxed text-foreground/75">{p.texto}</p>
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
        /* Fallback defensivo: hoje toda família oferecida no quiz tem
           catálogo, mas se algum filtro devolver lista vazia (categoria sem
           estoque, por exemplo), dizer isso é melhor que um grid vazio
           deixando o cliente achar que a tela quebrou. */
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
