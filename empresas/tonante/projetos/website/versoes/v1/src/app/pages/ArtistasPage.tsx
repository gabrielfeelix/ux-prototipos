import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { MusicosTonante } from "../components/MusicosTonante";
import { CTAButton, ctaVariants, Eyebrow, SectionHeader, FieldLabel, FieldInput, EqualizerWave } from "../components/section";
import { FotoSlot } from "./lp/FotoSlot";
import { Foto } from "./lp/Foto";
import { HeroInstitucional } from "./lp/HeroInstitucional";

/* ArtistasPage — "Seja um artista Tonante" (/influenciadores).
 *
 * A rota /influenciadores existia servindo a landing da PCYES crua
 * (DynamicHtmlPage → /pages/influenciadores.html): creator de e-sport, vermelho
 * PCYES, carrossel de streamer. Esta é a versão da casa.
 *
 * Duas decisões que valem pras três landings novas:
 *
 * 1. A PROVA JÁ EXISTE. A dobra "quem está no time" é o <MusicosTonante> da
 *    home, com os cinco músicos reais que já foram filmados. Carrossel de foto
 *    genérica ao lado de vídeo de gente de verdade seria uma piora.
 * 2. BENEFÍCIO É FOTO, NÃO ÍCONE. A PCYES resolve as vantagens em cinco cards
 *    de ícone SVG. Aqui cada uma é uma foto no formato do card do Monte seu
 *    kit: poço de foto, filete embaixo, título, uma frase. O filete é a única
 *    coisa que se move.
 *
 * As fotos ainda não existem: cada uma está num <FotoSlot> do tamanho final,
 * com o número do prompt do plano de imagens. Trocar por <img> não mexe no
 * layout. */

const FIGTREE = "var(--font-family-figtree)";
const INTER = "var(--font-family-inter)";
const STAGE = "#121213";

/* ─────────────────────────── conteúdo ─────────────────────────── */

const RECEBE = [
  {
    titulo: "O instrumento na sua mão",
    texto: "Você escolhe no catálogo e ele fica com você enquanto durar a parceria. Sem aluguel, sem depósito.",
    src: "/lp/violao-estudio.webp",
    alt: "Violão de aço sobre fundo cinza de estúdio",
  },
  {
    titulo: "Cachê por campanha",
    texto: "Lançamento tem verba. Combinado antes, pago em trinta dias, sem permuta disfarçada.",
    src: "/lp/estudio-gravacao.webp",
    alt: "Estúdio pequeno com microfone e violão apoiado na cadeira",
  },
  {
    titulo: "Gravação na fábrica",
    texto: "Um dia em Maringá com a nossa equipe de vídeo. Você sai com o material, não só a gente.",
    src: "/lp/atelie-corpos.webp",
    alt: "Corpos de violão alinhados no ateliê da fábrica",
    focus: "center 58%",
  },
  {
    titulo: "Seu nome onde a gente aparece",
    texto: "Site, embalagem, feira e as lojas que revendem Tonante. Quem toca com a gente aparece com a gente.",
    src: "/lp/parede-loja.webp",
    alt: "Parede de uma loja de instrumentos com violões e guitarras",
  },
];

const PASSOS = [
  {
    n: "01",
    titulo: "Você se inscreve",
    texto: "O formulário aqui embaixo leva uns três minutos. Precisa de um link com você tocando.",
  },
  {
    n: "02",
    titulo: "A gente conversa",
    texto: "Uma chamada de meia hora. Falamos do que você quer tocar e do que a gente precisa mostrar.",
  },
  {
    n: "03",
    titulo: "Seis meses juntos",
    texto: "Contrato curto de propósito. No fim dos seis meses os dois decidem se continua.",
  },
];

const CRITERIOS = [
  {
    titulo: "Você toca de verdade",
    texto: "O vídeo mais importante da sua inscrição é o que tem só você e o instrumento.",
  },
  {
    titulo: "Seu público te escuta",
    texto: "Mil pessoas que respondem valem mais que cem mil que passam o dedo. A gente olha comentário, não número.",
  },
  {
    titulo: "Dá pra trabalhar junto",
    texto: "Prazo combinado, material entregue, conversa aberta quando algo não couber.",
  },
];

const INSTRUMENTOS = ["Violão", "Guitarra", "Contrabaixo", "Ukulele", "Cavaquinho", "Outro"];

/* ─────────────────────────── página ─────────────────────────── */

export function ArtistasPage() {
  return (
    <>
      <SEO
        title="Seja um artista Tonante"
        description="Programa de artistas Tonante: instrumento, cachê por campanha e gravação na fábrica para músicos que tocam e têm público."
      />
      <div style={{ background: "#ffffff" }}>
        <HeroInstitucional
          eyebrow="Programa de artistas"
          titulo="Você toca. A gente põe o instrumento na sua mão."
          texto="Setenta anos fazendo instrumento no Brasil, e nenhum deles fez som sozinho. O programa de artistas Tonante é para quem toca, ensina ou grava e quer fazer isso com um instrumento nosso."
          src="/lp/palco-violonista.webp"
          alt="Violonista tocando violão de aço em um palco pequeno"
          cta={{ label: "Quero me candidatar", href: "#inscricao" }}
          link={{ label: "Ver quem já está no time", href: "#time" }}
          ancora="time"
        />
        <MusicosTonante />
        <OQueRecebe />
        <ComoFunciona />
        <QuemProcuramos />
        <Formulario />
        <Fecho />
      </div>
      <Footer />
    </>
  );
}

/* ── 3. o que você recebe ─────────────────────────────────────── */

function OQueRecebe() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="A parceria"
          title={
            <>
              O que você recebe,
              <br />
              escrito antes de assinar.
            </>
          }
          size="lg"
          weight={500}
        />
        <p
          className="mt-5 max-w-[52ch]"
          style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.65, color: "rgba(17,17,17,0.6)" }}
        >
          Quatro coisas, as mesmas para todo mundo que entra. O que muda de artista para artista é a
          quantidade de campanha no ano, e isso sai na conversa.
        </p>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {RECEBE.map((item) => (
            <CardFoto key={item.titulo} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardFoto({
  titulo,
  texto,
  foto,
  prompt,
  src,
  alt,
  focus,
}: {
  titulo: string;
  texto: string;
  foto?: string;
  prompt?: number;
  src?: string;
  alt?: string;
  focus?: string;
}) {
  /* mesmo gesto do Monte seu kit: a foto não tem moldura e o filete embaixo é
     o único elemento que reage ao cursor */
  return (
    <div className="group">
      {src ? (
        <Foto src={src} alt={alt ?? ""} ratio="4/5" focus={focus} />
      ) : (
        <FotoSlot ratio="4/5" label={foto ?? ""} prompt={prompt} />
      )}
      <span
        aria-hidden
        className="mt-6 block h-px w-full origin-left bg-foreground/15 transition-transform duration-500 ease-out group-hover:scale-y-[3] group-hover:bg-[var(--amber)] motion-reduce:transition-none"
      />
      <h3
        className="mt-5 text-foreground"
        style={{ fontFamily: FIGTREE, fontSize: "1.375rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}
      >
        {titulo}
      </h3>
      <p
        className="mt-2 max-w-[34ch]"
        style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.6, color: "rgba(17,17,17,0.62)" }}
      >
        {texto}
      </p>
    </div>
  );
}

/* ── 4. como funciona (faixa escura) ──────────────────────────── */

function ComoFunciona() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="px-5 py-24 md:px-12 lg:py-32" style={{ background: STAGE }}>
      <div ref={ref} className="mx-auto max-w-[1280px]">
        <Eyebrow style={{ color: "var(--amber-bright)" }}>Como funciona</Eyebrow>
        <h2
          className="mt-5 max-w-[22rem] md:max-w-[34rem]"
          style={{
            fontFamily: FIGTREE,
            fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          Três passos, nenhum deles longo.
        </h2>

        <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-3">
          {PASSOS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* numeral grande no lugar do card: sem caixa, sem ícone */}
              <span
                aria-hidden
                style={{
                  fontFamily: FIGTREE,
                  fontSize: "clamp(3rem, 5vw, 4.25rem)",
                  lineHeight: 1,
                  color: "var(--amber-bright)",
                  opacity: 0.9,
                }}
              >
                {p.n}
              </span>
              <span
                aria-hidden
                className="mt-6 block h-px w-full"
                style={{ background: "rgba(255,255,255,0.14)" }}
              />
              <h3
                className="mt-5"
                style={{ fontFamily: FIGTREE, fontSize: "1.5rem", lineHeight: 1.2, color: "#fff" }}
              >
                {p.titulo}
              </h3>
              <p
                className="mt-2 max-w-[36ch]"
                style={{
                  fontFamily: INTER,
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {p.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. quem a gente procura ──────────────────────────────────── */

function QuemProcuramos() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <SectionHeader
            eyebrow="Quem a gente procura"
            title={
              <>
                Não é sobre
                <br />
                quantos te seguem.
              </>
            }
            size="lg"
            weight={500}
          />
          <p
            className="mt-6 max-w-[44ch]"
            style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.65, color: "rgba(17,17,17,0.6)" }}
          >
            A gente já fechou parceria com quem tinha mil seguidores e já disse não para quem tinha
            trezentos mil. O que pesa está aqui do lado, nesta ordem.
          </p>
        </div>

        <ul className="flex flex-col">
          {CRITERIOS.map((c, i) => (
            <li
              key={c.titulo}
              className="flex gap-6 py-7"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(17,17,17,0.09)" }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: FIGTREE,
                  fontSize: "1.125rem",
                  color: "var(--amber-deep)",
                  paddingTop: "2px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3
                  className="text-foreground"
                  style={{ fontFamily: FIGTREE, fontSize: "1.375rem", lineHeight: 1.25 }}
                >
                  {c.titulo}
                </h3>
                <p
                  className="mt-2 max-w-[48ch]"
                  style={{
                    fontFamily: INTER,
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "rgba(17,17,17,0.62)",
                  }}
                >
                  {c.texto}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 6. formulário em dois passos ─────────────────────────────── */

function Formulario() {
  const [passo, setPasso] = useState<1 | 2 | "fim">(1);
  const [instrumento, setInstrumento] = useState<string>("Violão");

  return (
    <section
      id="inscricao"
      className="px-5 py-24 md:px-12 lg:py-32"
      style={{ background: "#fafafa", scrollMarginTop: "var(--header-h, 96px)" }}
    >
      <div className="mx-auto max-w-[760px]">
        <div className="text-center">
          <SectionHeader
            eyebrow="Inscrição"
            title={passo === "fim" ? "Recebemos." : "Conta pra gente quem você é."}
            size="lg"
            weight={500}
            align="center"
          />
          {passo !== "fim" && (
            <p
              className="mx-auto mt-5 max-w-[46ch]"
              style={{ fontFamily: INTER, fontSize: "1rem", lineHeight: 1.65, color: "rgba(17,17,17,0.6)" }}
            >
              A gente responde toda inscrição, inclusive as que não seguem adiante. Costuma levar
              duas semanas.
            </p>
          )}
        </div>

        {passo !== "fim" && <ProgressoCordas passo={passo} />}

        <div className="mt-12">
          {passo === 1 && (
            <form
              className="grid gap-6 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPasso(2);
              }}
            >
              <Campo id="nome" label="Nome" required placeholder="Como você assina o seu trabalho" />
              <Campo id="cidade" label="Cidade e estado" required placeholder="Maringá, PR" />
              <Campo id="email" label="E-mail" type="email" required placeholder="voce@email.com" />
              <Campo id="whats" label="WhatsApp" type="tel" required placeholder="(00) 00000-0000" />
              <div className="sm:col-span-2 mt-2">
                <CTAButton type="submit" variant="ink" size="lg" block>
                  Continuar
                </CTAButton>
              </div>
            </form>
          )}

          {passo === 2 && (
            <form
              className="grid gap-6 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPasso("fim");
              }}
            >
              <div className="sm:col-span-2">
                <FieldLabel required>Instrumento principal</FieldLabel>
                <div className="mt-1 flex flex-wrap gap-2">
                  {INSTRUMENTOS.map((i) => {
                    const ativo = instrumento === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInstrumento(i)}
                        aria-pressed={ativo}
                        className="transition-colors duration-200"
                        style={{
                          fontFamily: INTER,
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          padding: "9px 18px",
                          borderRadius: "var(--radius-pill)",
                          border: `1px solid ${ativo ? "var(--amber)" : "rgba(17,17,17,0.12)"}`,
                          background: ativo ? "rgba(200,120,0,0.08)" : "#ffffff",
                          color: ativo ? "var(--amber-deep)" : "rgba(17,17,17,0.7)",
                        }}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor="redes" required>
                  Suas redes
                </FieldLabel>
                <textarea
                  id="redes"
                  required
                  rows={3}
                  placeholder="Cole aqui os links: Instagram, YouTube, TikTok, Spotify"
                  style={{
                    padding: "11px 13px",
                    borderRadius: "var(--radius-card-sm)",
                    border: "1px solid rgba(17,17,17,0.08)",
                    background: "rgba(17,17,17,0.03)",
                    fontFamily: INTER,
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    width: "100%",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <Campo
                id="video"
                label="Um vídeo seu tocando"
                type="url"
                required
                placeholder="Link do vídeo"
              />

              <div>
                <FieldLabel htmlFor="publico">Tamanho do público</FieldLabel>
                <select
                  id="publico"
                  defaultValue=""
                  style={{
                    padding: "11px 13px",
                    borderRadius: "var(--radius-card-sm)",
                    border: "1px solid rgba(17,17,17,0.08)",
                    background: "rgba(17,17,17,0.03)",
                    fontFamily: INTER,
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    width: "100%",
                    outline: "none",
                    height: "44px",
                  }}
                >
                  <option value="">Escolha uma faixa</option>
                  <option>Até 5 mil</option>
                  <option>5 mil a 50 mil</option>
                  <option>50 mil a 500 mil</option>
                  <option>Mais de 500 mil</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor="plano">O que você quer fazer com a gente</FieldLabel>
                <textarea
                  id="plano"
                  rows={3}
                  placeholder="Em duas ou três linhas"
                  style={{
                    padding: "11px 13px",
                    borderRadius: "var(--radius-card-sm)",
                    border: "1px solid rgba(17,17,17,0.08)",
                    background: "rgba(17,17,17,0.03)",
                    fontFamily: INTER,
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    width: "100%",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="flex items-center gap-4 sm:col-span-2 mt-2">
                <button
                  type="button"
                  onClick={() => setPasso(1)}
                  style={{
                    fontFamily: INTER,
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "rgba(17,17,17,0.55)",
                  }}
                >
                  Voltar
                </button>
                <div className="flex-1">
                  <CTAButton type="submit" variant="brand" size="lg" block>
                    Enviar inscrição
                  </CTAButton>
                </div>
              </div>
            </form>
          )}

          {passo === "fim" && (
            <div className="text-center">
              <p
                className="mx-auto max-w-[44ch]"
                style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(17,17,17,0.65)" }}
              >
                Sua inscrição chegou. A gente ouve tudo que vem com vídeo, e volta em até duas
                semanas pelo WhatsApp que você deixou.
              </p>
              <EqualizerWave bars={44} height={22} className="mx-auto mt-10 max-w-[420px]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* O indicador de passo da PCYES são dois círculos numerados com um conector
   que preenche. Aqui as duas etapas são duas cordas: a do passo atual é a
   grossa e âmbar, a outra fica fina e cinza. Mesma informação, vocabulário da
   casa, e nenhum número a mais na tela. */
function ProgressoCordas({ passo }: { passo: 1 | 2 }) {
  return (
    <div className="mx-auto mt-12 flex max-w-[420px] items-center gap-4">
      {([1, 2] as const).map((n) => {
        const ativo = passo === n;
        const feito = passo > n;
        return (
          <div key={n} className="flex flex-1 flex-col gap-2.5">
            <span
              aria-hidden
              className="block w-full rounded-full transition-all duration-500 ease-out"
              style={{
                height: ativo ? "3px" : "1.5px",
                background: ativo || feito ? "var(--amber)" : "rgba(17,17,17,0.14)",
              }}
            />
            <span
              style={{
                fontFamily: INTER,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ativo ? "var(--amber-text)" : "rgba(17,17,17,0.35)",
              }}
            >
              {n === 1 ? "Você" : "Seu som"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Campo({
  id,
  label,
  required,
  ...props
}: { id: string; label: string; required?: boolean } & React.ComponentProps<"input">) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <FieldInput id={id} name={id} required={required} {...props} />
    </div>
  );
}

/* ── 7. fecho ─────────────────────────────────────────────────── */

function Fecho() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-28">
      <div className="mx-auto max-w-[760px] text-center">
        <p
          style={{
            fontFamily: FIGTREE,
            fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            color: "rgba(17,17,17,0.85)",
          }}
        >
          Setenta anos atrás alguém colou o primeiro tampo. O som só existe quando alguém toca.
        </p>
        <EqualizerWave bars={56} height={26} className="mt-10" />
      </div>
    </section>
  );
}
