import { useEffect, useRef, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Foto } from "./Foto";
import { FotoSlot } from "./FotoSlot";

/* DiaADiaScroll — a dobra do time, contada pela rolagem.
 *
 * Substitui o grid fixo de fotos. São dois movimentos encadeados dentro de uma
 * seção alta com miolo grudado (sticky), na linha do que a Apple faz nas
 * páginas de produto:
 *
 *   ATO 1 (0 → 0.46 da rolagem da seção)
 *   O título entra sozinho no centro. As fotos nascem quase no meio da tela,
 *   pequenas, e vão crescendo e se afastando pra fora enquanto aparecem e
 *   somem. Cada uma tem o seu próprio par de janelas de opacidade, então elas
 *   não piscam juntas — é isso que faz parecer respiração e não carrossel.
 *
 *   ATO 2 (0.5 → 0.9)
 *   Um cartão abre do tamanho de um ponto até a panorâmica inteira. O truque é
 *   que NADA dentro dele escala: o conteúdo já nasce no tamanho final e o
 *   cartão é uma máscara que cresce por cima. Por isso o texto aparece
 *   recortado pelo círculo, em corpo cheio, em vez de crescer junto (que é o
 *   efeito barato e o que denuncia a imitação).
 *
 * Tudo que anima é `transform`, `opacity` ou dimensão em porcentagem de um
 * wrapper de tamanho fixo. Nada anima largura em px, que forçaria layout a
 * cada quadro.
 *
 * Com `prefers-reduced-motion` a seção vira o grid estático de antes: mesma
 * informação, sem movimento nenhum. */

/* O `useScroll({ target })` do motion mede errado dentro deste site: o
   RootLayout tem `overflow-x-clip` e, pela especificação, um eixo `clip` com o
   outro `visible` promove o outro a `auto` — o div vira contêiner de rolagem
   aos olhos do motion, que passa a medir a seção contra ele em vez da janela.
   O progresso saía quase o dobro do real (0.25 de rolagem lia 0.49).

   Aqui a conta é direta e não depende de quem o motion elege como contêiner:
   quanto da seção já passou pelo topo da janela, dividido pelo quanto ela tem
   pra passar. */
function useProgressoDaSecao(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progresso = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let quadro = 0;

    const medir = () => {
      const r = el.getBoundingClientRect();
      const percurso = r.height - window.innerHeight;
      if (percurso > 0) progresso.set(Math.min(1, Math.max(0, -r.top / percurso)));
      quadro = requestAnimationFrame(medir);
    };

    /* Por que rAF e não `window.addEventListener("scroll")`:
       evento de rolagem só chega em quem rola. Neste site quem rola nem sempre
       é a janela — o RootLayout tem `overflow-x-clip`, e pela especificação um
       eixo `clip` com o outro `visible` promove o outro a `auto`, então o
       contêiner de rolagem pode ser aquele div. Com o ouvinte na janela o
       progresso ficava parado em 0 e a dobra passava em branco até alguma
       outra coisa (um resize, uma imagem carregando) forçar uma medição, e aí
       a seção aparecia no meio, já quase no fim da animação. Medir a cada
       quadro não depende de saber quem rola.

       O laço só roda com a seção por perto: fora disso o observador desliga e
       não sobra nenhum rAF girando à toa no resto da página. */
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !quadro) {
          quadro = requestAnimationFrame(medir);
        } else if (!entrada.isIntersecting && quadro) {
          cancelAnimationFrame(quadro);
          quadro = 0;
        }
      },
      { rootMargin: "40% 0px" },
    );
    observador.observe(el);

    return () => {
      observador.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [progresso, ref]);

  return progresso;
}

type Cena = {
  label: string;
  ratio: string;
  /** posição final, em % da metade da tela (100 = borda) */
  x: number;
  y: number;
  /** largura final em vw */
  w: number;
  /** quando aparece e quando some, na linha do tempo da seção */
  entra: number;
  sai: number;
  src?: string;
  alt?: string;
};

/* As quatro posições foram escolhidas pra formar um X em volta do título e
   nunca cruzar a linha dele: duas em cima, duas embaixo, nenhuma no centro. */
const CENAS: Cena[] = [
  {
    label: "Duas pessoas conferindo um instrumento",
    src: "/lp/dupla-conferindo.webp",
    alt: "Dois funcionários conferindo o braço de um violão na bancada",
    ratio: "4/3",
    x: 58,
    y: -58,
    w: 19,
    entra: 0.02,
    sai: 0.42,
  },
  {
    label: "Café da tarde no refeitório",
    src: "/lp/cafe-refeitorio.webp",
    alt: "Três funcionários tomando café no refeitório da fábrica",
    ratio: "4/3",
    x: -56,
    y: 56,
    w: 18,
    entra: 0.1,
    sai: 0.44,
  },
  {
    label: "Alguém tocando no fim do turno",
    src: "/lp/tocando-fim-turno.webp",
    alt: "Funcionário tocando violão no fim do expediente",
    ratio: "3/4",
    x: 63,
    y: 44,
    w: 14,
    entra: 0.14,
    sai: 0.45,
  },
  {
    label: "Aula de música na fábrica",
    src: "/lp/aula-musica.webp",
    alt: "Funcionários em círculo com violões no fim do expediente",
    ratio: "4/3",
    x: -62,
    y: -54,
    w: 16,
    entra: 0.16,
    sai: 0.46,
  },
];

const TITULO = "Um lugar que parece de casa.";

export function DiaADiaScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const scrollYProgress = useProgressoDaSecao(ref);

  if (reduzir) return <Estatico />;

  return (
    <section ref={ref} className="relative" style={{ height: "280vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5 md:px-12">
        <Titulo progresso={scrollYProgress} />

        {CENAS.map((c) => (
          <Cena key={c.label} cena={c} progresso={scrollYProgress} />
        ))}

        <CartaoQueAbre progresso={scrollYProgress} />
      </div>
    </section>
  );
}

/* ── o título ─────────────────────────────────────────────────── */

function Titulo({ progresso }: { progresso: MotionValue<number> }) {
  /* Ela desmaia devagar por baixo do cartão que cresce, e não some antes dele
     nascer. No trecho 0.44 → 0.62 as duas frases dividem a tela: uma já
     apagando, a outra aparecendo recortada pelo círculo. */
  const opacity = useTransform(progresso, [0, 0.46, 0.62, 0.74], [1, 0.9, 0.34, 0]);
  const scale = useTransform(progresso, [0, 0.74], [1, 1.12]);
  const blur = useTransform(progresso, [0.5, 0.74], [0, 5]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.h2
      style={{
        opacity,
        scale,
        filter,
        fontFamily: "var(--font-family-figtree)",
        fontSize: "clamp(2rem, 5.2vw, 4.5rem)",
        lineHeight: 1.05,
        letterSpacing: "-0.025em",
        fontWeight: 500,
        textAlign: "center",
        maxWidth: "20ch",
        position: "relative",
        zIndex: 2,
      }}
    >
      {TITULO}
    </motion.h2>
  );
}

/* ── cada foto do ato 1 ───────────────────────────────────────── */

function Cena({ cena, progresso }: { cena: Cena; progresso: MotionValue<number> }) {
  const { entra, sai, x, y, w } = cena;
  const meio = (entra + sai) / 2;

  /* A foto percorre o caminho inteiro do centro pra borda ao longo da sua
     própria janela, e não da seção toda: é o que faz as quatro se moverem em
     velocidades diferentes sem precisar de delay. */
  const avanco = useTransform(progresso, [entra, sai], [0, 1], { clamp: true });
  const px = useTransform(avanco, (v) => `${x * v * 0.5}vw`);
  const py = useTransform(avanco, (v) => `${y * v * 0.42}vh`);
  const scale = useTransform(avanco, [0, 1], [0.32, 1]);
  const opacity = useTransform(
    progresso,
    [entra, entra + (meio - entra) * 0.55, sai - 0.06, sai],
    [0, 1, 1, 0],
  );
  /* desfoque some junto com a entrada: a foto "resolve" conforme chega */
  const filter = useTransform(avanco, [0, 0.45, 1], ["blur(6px)", "blur(0px)", "blur(0px)"]);

  return (
    <motion.div
      style={{ x: px, y: py, scale, opacity, filter, position: "absolute", width: `${w}vw`, zIndex: 1 }}
      aria-hidden
    >
      {cena.src ? (
        <Foto src={cena.src} alt={cena.alt ?? ""} ratio={cena.ratio} />
      ) : (
        <FotoSlot ratio={cena.ratio} label={cena.label} />
      )}
    </motion.div>
  );
}

/* ── o cartão que abre ────────────────────────────────────────── */

/* Medidas finais do cartão. Ficam aqui porque o conteúdo interno precisa nascer
   EXATAMENTE nelas: é isso que segura o texto em corpo cheio enquanto a
   máscara ainda é um ponto. */
const CARD_W = "min(1600px, 94vw)";
const CARD_H = "min(78svh, 760px)";

function CartaoQueAbre({ progresso }: { progresso: MotionValue<number> }) {
  /* Três tempos: ponto (0.50), cresce (até 0.86), respira até o fim da seção.
     A largura abre um pouco antes da altura, senão o cartão vira um quadrado
     que estica, e o olho lê "redimensionou" em vez de "abriu". */
  const largura = useTransform(progresso, [0.44, 0.58, 0.84], ["3%", "26%", "100%"]);
  const altura = useTransform(progresso, [0.44, 0.62, 0.88], ["4%", "30%", "100%"]);
  const raio = useTransform(progresso, [0.44, 0.68, 0.9], ["50%", "14%", "1.8%"]);
  const opacity = useTransform(progresso, [0.41, 0.46], [0, 1]);
  /* a linha de apoio só acende quando o cartão já tem largura pra ela caber */
  const apoio = useTransform(progresso, [0.62, 0.76], [0, 1]);

  return (
    <motion.div
      style={{
        opacity,
        width: CARD_W,
        height: CARD_H,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          width: largura,
          height: altura,
          borderRadius: raio,
          overflow: "hidden",
          position: "relative",
          background: "#121213",
        }}
      >
        {/* conteúdo em tamanho final, centrado: a máscara cresce por cima dele */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: CARD_W,
            height: CARD_H,
          }}
        >
          <img
            src="/lp/time-inteiro.webp"
            alt="O time da fábrica reunido na frente do galpão no fim da tarde"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.66) 0%, rgba(10,10,11,0.46) 52%, rgba(10,10,11,0.64) 100%)" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-[4.5rem] text-center">
            <h3
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(2rem, 5vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                fontWeight: 500,
                color: "#fff",
                maxWidth: "16ch",
                textShadow: "0 2px 24px rgba(10,10,11,0.4)",
              }}
            >
              Feita por gente que toca.
            </h3>
            <motion.p
              className="mt-6 max-w-[46ch]"
              style={{
                opacity: apoio,
                fontFamily: "var(--font-family-inter)",
                fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.86)",
                textShadow: "0 1px 12px rgba(10,10,11,0.55)",
              }}
            >
              Quem trabalha com instrumento acaba tocando junto. É o que mais acontece aqui depois
              das seis.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── versão sem movimento ─────────────────────────────────────── */

function Estatico() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <h2
          className="max-w-[20rem] md:max-w-[34rem]"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            fontWeight: 500,
          }}
        >
          {TITULO}
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {CENAS.map((c) => (
            <FotoSlot key={c.label} ratio={c.ratio} label={c.label} />
          ))}
          <Foto
            src="/lp/time-inteiro.webp"
            alt="O time da fábrica reunido na frente do galpão no fim da tarde"
            ratio="2/1"
            className="lg:col-span-3"
          />
        </div>
      </div>
    </section>
  );
}
