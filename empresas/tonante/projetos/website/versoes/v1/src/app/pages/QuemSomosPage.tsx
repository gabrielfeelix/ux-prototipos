import { Link } from "react-router";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ProductCard } from "../components/ProductCard";
import { SeloTonante } from "../components/section";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { allProducts } from "../components/productsData";

const FIGTREE = "var(--font-family-figtree)";
const INTER = "var(--font-family-inter)";

/**
 * QuemSomosPage — "Setenta anos em seis capítulos" (V3 §7.2).
 * Long-form editorial scroll-telling com a história REAL da Tonante
 * (dossiê PLANO-V3 §2, com fontes). Ritmo: dark → claro → âmbar → claro →
 * dark → claro. Nenhum artista inventado; depoimento real anonimizado.
 */

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};
const viewportOnce = { once: true, amount: 0.3 } as const;

function ChapterEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className="inline-flex w-fit items-center gap-2 uppercase"
      style={{
        fontFamily: INTER,
        fontSize: "var(--text-eyebrow)",
        letterSpacing: "0.28em",
        fontWeight: 700,
        color: light ? "var(--amber-bright)" : "var(--amber-deep)",
      }}
    >
      <span className="h-px w-6" style={{ background: "currentColor", opacity: 0.6 }} />
      {children}
    </span>
  );
}

// fecho comercial: as linhas vivas de hoje (ids reais do catálogo)
const CONTINUE_IDS = [52, 25, 13]; // Coral · Lorenzzo · Valentine's

export function QuemSomosPage() {
  const continueProducts = CONTINUE_IDS
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SEO
        title="Nossa história desde 1954"
        description="Dois irmãos portugueses, uma oficina na Lapa e o primeiro violão de gerações de brasileiros. Conheça os 70 anos da Tonante."
        canonicalPath="/quem-somos"
      />

      {/* ========== CAP. 0 — ABERTURA: 1954 ========== */}
      <section
        data-keep-dark
        className="grain relative flex min-h-[88vh] items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #131314 30%, #1f1f21 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: "50%", top: "55%", transform: "translate(-50%,-50%)", width: 760, height: 760, background: "radial-gradient(circle, rgba(17, 17, 17, 0.08), transparent 65%)" }}
        />
        <motion.div
          initial="hidden"
          animate="show"
          className="relative z-[2] flex flex-col items-center px-5 text-center"
        >
          <motion.div variants={reveal} custom={0}>
            <SeloTonante variant="rei" tone="light" rotate size={92} />
          </motion.div>
          <motion.h1
            variants={reveal}
            custom={1}
            className="num"
            style={{
              fontFamily: FIGTREE,
              fontSize: "clamp(110px, 24vw, 240px)",
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--amber)",
              margin: "28px 0 0",
            }}
          >
            1954
          </motion.h1>
          <motion.p
            variants={reveal}
            custom={2}
            style={{ fontFamily: FIGTREE, fontStyle: "italic", fontSize: "clamp(19px, 2.6vw, 28px)", color: "#ffffff", margin: "26px 0 0", lineHeight: 1.35 }}
          >
            Dois irmãos. Um plano:
            <br />
            música para todos.
          </motion.p>
          <motion.p
            variants={reveal}
            custom={3}
            style={{ fontFamily: INTER, fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,236,223,0.55)", margin: "48px 0 0" }}
          >
            role para ler a história
          </motion.p>
        </motion.div>
      </section>

      {/* ========== CAP. 1 — A OFICINA DA LAPA (claro) ========== */}
      <section style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-12 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <ChapterEyebrow>Capítulo um · A oficina da Lapa</ChapterEyebrow>
              <h2
                className="mt-6 text-ink-strong"
                style={{ fontFamily: FIGTREE, fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}
              >
                Tonante é sobrenome.
                <br />
                <em style={{ color: "var(--amber-deep)" }}>De família.</em>
              </h2>
              <div className="mt-7 flex flex-col gap-5" style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                <p>
                  Abel e Samuel Tonante chegaram de Portugal nos anos 40 construindo instrumentos
                  à mão. Em <strong style={{ color: "var(--ink-strong)" }}>5 de abril de 1954</strong>, na
                  Rua Gomes Freire, na Lapa, em São Paulo, registraram a oficina com um nome que era
                  um plano de negócios inteiro: <strong style={{ color: "var(--ink-strong)" }}>Ao Rei dos Violões</strong>.
                </p>
                <p>
                  Da Lapa para o Piqueri, do Piqueri para Itupeva, a oficina virou fábrica e a
                  fábrica virou a maior porta de entrada da música brasileira: violões, guitarras,
                  contrabaixos, cavaquinhos, banjos e bandolins ao alcance de quem nunca tinha
                  podido pagar por um instrumento.
                </p>
              </div>
            </motion.div>
            <motion.figure variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce} custom={1} className="m-0">
              <div className="relative overflow-hidden" style={{ borderRadius: "var(--radius-card-xl)", aspectRatio: "4/5", boxShadow: "var(--shadow-card)" }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1505841993706-c8d90b412bc4?w=900&q=80&auto=format&fit=crop"
                  alt="Mãos trabalhando em um violão na oficina"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "grayscale(1) sepia(0.35) contrast(0.95)" }}
                />
              </div>
              <figcaption className="mt-3" style={{ fontFamily: INTER, fontSize: 12, color: "var(--ink-meta)" }}>
                Imagem ilustrativa, acervo histórico em digitalização.
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* ========== CAP. 2 — JOVEM GUARDA (âmbar profundo) ========== */}
      <section
        data-keep-dark
        className="grain relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #4a2a05 0%, #7a4a10 60%, #5d3a08 100%)" }}
      >
        <div className="relative z-[2] mx-auto max-w-[1180px] px-5 py-20 md:px-12 md:py-28">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <ChapterEyebrow light>Capítulo dois · O Brasil liga o som</ChapterEyebrow>
            <h2
              className="mt-6"
              style={{ fontFamily: FIGTREE, fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff" }}
            >
              A guitarra que colocou o rock
              <br />
              nas garagens do Brasil.
            </h2>
            <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <p style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                Anos 60. A Jovem Guarda explode na TV e todo jovem quer montar uma banda, mas
                instrumento importado é artigo de luxo. A Tonante era a guitarra que a classe
                média conseguia pagar. Foi assim que o rock brasileiro começou em milhares de
                garagens: com uma Tonante no colo.
              </p>
              <p style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                O ícone da era foi a <strong style={{ color: "#fff" }}>Finder</strong>, corpo de
                cedro, escala de ipê, captadores Malagoli. Madeira brasileira e o famoso braço
                grosso, feito de propósito para não empenar. Honestidade construtiva, do jeito
                que a casa sempre entendeu qualidade.
              </p>
            </div>
            <blockquote className="m-0 mt-12 max-w-[820px]">
              <p style={{ fontFamily: FIGTREE, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.3, color: "#fff", margin: 0 }}>
                <span aria-hidden="true" style={{ color: "var(--amber-bright)" }}>“</span>
                O primeiro instrumento de muitas pessoas.
                <span aria-hidden="true" style={{ color: "var(--amber-bright)" }}>”</span>
              </p>
              <footer className="mt-4 flex items-center gap-3" style={{ fontFamily: INTER, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                <span className="h-px w-8" style={{ background: "rgba(255,255,255,0.4)" }} />
                Como a marca é lembrada até hoje
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ========== CAP. 3 — A PIADA E A SAUDADE (claro) ========== */}
      <section style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-12 md:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <ChapterEyebrow>Capítulo três · A piada e a saudade</ChapterEyebrow>
              <h2
                className="mt-6 text-ink-strong"
                style={{ fontFamily: FIGTREE, fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}
              >
                O Brasil inteiro tinha uma
                piada sobre a Tonante.
                <br />
                <em style={{ color: "var(--amber-deep)" }}>E uma saudade também.</em>
              </h2>
              <div className="mt-7 flex flex-col gap-5" style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                <p>
                  Diz a lenda que uma Tonante afinada jamais desafina. A gente conhece a piada,
                  e sorri junto. Porque quem zoava era quem tinha tido uma. O primeiro acorde, o
                  primeiro calo no dedo, a primeira música inteira: para milhões de brasileiros,
                  tudo isso aconteceu em cima de uma Tonante.
                </p>
                <p>
                  Marca que riu de si mesma e sobreviveu a tudo tem uma coisa que dinheiro não
                  compra: <strong style={{ color: "var(--ink-strong)" }}>memória afetiva</strong>.
                </p>
              </div>
            </motion.div>
            <motion.blockquote
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              custom={1}
              className="relative m-0 overflow-hidden p-8 md:p-12"
              style={{ borderRadius: "var(--radius-card-xl)", background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <span aria-hidden="true" className="block" style={{ fontFamily: FIGTREE, fontSize: 110, fontWeight: 700, lineHeight: 0.55, color: "var(--amber)", opacity: 0.4 }}>
                “
              </span>
              <p className="mt-3" style={{ fontFamily: FIGTREE, fontStyle: "italic", fontSize: "clamp(20px, 2.2vw, 27px)", lineHeight: 1.4, color: "var(--ink-strong)", margin: 0 }}>
                O Tonante foi o meu primeiro violão. Foi com ele que aprendi os primeiros acordes
                e os primeiros solos, e graças a ele tenho orgulho do violonista que sou hoje.
              </p>
              <footer className="mt-6 flex items-center gap-3" style={{ fontFamily: INTER, fontSize: 13, color: "var(--ink-meta)" }}>
                <span className="h-px w-8" style={{ background: "var(--amber)", opacity: 0.5 }} />
                Depoimento de músico em fórum brasileiro, 2009
              </footer>
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* ========== CAP. 4 — A FÁBRICA PARA, A MÚSICA NÃO (dark) ========== */}
      <section
        data-keep-dark
        className="grain relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #131314 40%, #1f1f21 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ right: "-8%", top: "-20%", width: 560, height: 560, background: "radial-gradient(circle, rgba(17, 17, 17, 0.08), transparent 70%)" }}
        />
        <div className="relative z-[2] mx-auto max-w-[1180px] px-5 py-20 md:px-12 md:py-28">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <ChapterEyebrow light>Capítulo quatro · A travessia</ChapterEyebrow>
            <h2
              className="mt-6"
              style={{ fontFamily: FIGTREE, fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff" }}
            >
              A fábrica parou em 2007.
              <br />
              <em style={{ color: "var(--amber-bright)" }}>A música, não.</em>
            </h2>
            <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <p style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "#d6d6d6", margin: 0 }}>
                Quando o galpão de Itupeva fechou, parte dos funcionários usou o dinheiro da
                rescisão para comprar as máquinas e seguir fabricando instrumentos. A fábrica
                morreu; o ofício, não. E pelo país, colecionadores restaurando Finders antigas
                mantiveram a chama acesa por anos, em fóruns, oficinas e clubes de fãs.
              </p>
              <p style={{ fontFamily: INTER, fontSize: 16.5, lineHeight: 1.7, color: "#d6d6d6", margin: 0 }}>
                Em 2021, o <strong style={{ color: "#fff" }}>Grupo Oderço</strong> trouxe a marca
                de volta: <em>"os instrumentos que marcaram gerações estão de volta, neste
                recomeço, esperamos que vocês construam ainda mais histórias."</em> As primeiras
                guitarras da nova era saíram numeradas com um código que diz tudo:{" "}
                <strong className="num" style={{ color: "var(--amber-bright)" }}>GTRM1954</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== CAP. 5 — CONTINUE A HISTÓRIA (claro, comercial suave) ========== */}
      <section style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-12 md:py-28">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce} className="text-center">
            <ChapterEyebrow>Capítulo cinco · é seu</ChapterEyebrow>
            <h2
              className="mx-auto mt-6 max-w-[18ch] text-ink-strong"
              style={{ fontFamily: FIGTREE, fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Setenta anos depois, a história continua <em style={{ color: "var(--amber-deep)" }}>nas suas mãos.</em>
            </h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {continueProducts.map((p, i) => (
              <motion.div key={p.id} variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce} custom={i}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-10 text-center">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-pill transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--primary)", color: "#fff", padding: "15px 30px", fontFamily: INTER, fontWeight: 700, fontSize: 15.5, boxShadow: "var(--shadow-buy-cta-sm)", textDecoration: "none" }}
            >
              Escrever a minha <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
