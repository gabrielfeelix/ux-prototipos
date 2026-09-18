import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ctaVariants, Eyebrow, SectionHeader, RosetaIcon, StringDivider } from "../components/section";
import { FotoSlot } from "./lp/FotoSlot";
import { Foto } from "./lp/Foto";
import { HeroInstitucional } from "./lp/HeroInstitucional";
import { DiaADiaScroll } from "./lp/DiaADiaScroll";

/* TrabalheConoscoPage — /trabalhe-conosco. Rota nova: no Tonante ela não
 * existia, e na PCYES a página é um bloco estático que joga o candidato pro
 * portal de carreiras do Grupo Oderço.
 *
 * Aqui o assunto é outro. A PCYES monta e distribui; a Tonante FABRICA. Então
 * a página não fala de vale-refeição primeiro, fala de ofício: quem trabalha
 * aqui faz instrumento com a mão. O bento de ofícios é a dobra principal, e a
 * lista de benefício vem depois dela, não antes.
 *
 * A página não tem formulário nem lista de vaga: o processo seletivo é do
 * Grupo Oderço e vive no portal dele (ver o comentário em PORTAL, no fim do
 * arquivo). Aqui fica só o convite. */

const FIGTREE = "var(--font-family-figtree)";
const INTER = "var(--font-family-inter)";
const STAGE = "#121213";
/* ver o comentário em POÇO_ESCURO, dentro do CardFlutuante */
const POCO_ESCURO = "#17171a";
/* A dobra do grupo é a única da página que sai do preto e do branco: ali quem
   fala é a holding, não a Tonante, e a troca de cor avisa isso sem precisar
   escrever.

   O azul oficial do Oderço é #005AFF (tirado do logo). Chapado numa faixa
   inteira ele fica duro e industrial, então ele não é o fundo: é a LUZ. O
   fundo é uma noite azul profunda, e o #005AFF entra como um brilho vindo do
   alto à direita, do lado de onde a fachada pega sol. A foto por cima em
   `luminosity` só empresta forma e textura, nunca cor própria. */
const ODERCO_NOITE =
  "radial-gradient(118% 86% at 76% -6%, rgba(0,90,255,0.50) 0%, rgba(0,74,214,0.20) 42%, rgba(0,40,120,0) 66%)," +
  "linear-gradient(180deg, #06142f 0%, #0a1f4a 44%, #061029 100%)";

/* Números do GRUPO, não da Tonante — são os mesmos que a página da PCYES
   publica. A idade da Tonante (setenta anos, 1954) já é dita no hero e no
   rodapé, e misturar as duas contagens na mesma fileira confunde: a Tonante é
   mais velha que o grupo que a comprou. */
const NUMEROS_GRUPO = [
  { valor: "+35", rotulo: "anos de história do grupo" },
  { valor: "+200", rotulo: "colaboradores no time" },
  { valor: "1988", rotulo: "onde tudo começou" },
  { valor: "100%", rotulo: "brasileira, feita em Maringá" },
];

/* Benefício tem nome e tem explicação. Só o nome ("Wellhub", "PLR") não diz
 * nada pra quem está de fora, e é esse o público da página. A explicação é
 * literal de propósito: quem lê está decidindo se manda currículo, não está
 * lendo anúncio.
 *
 * `img` é a foto que sobe no card flutuante quando o mouse encosta no item
 * (ver CardFlutuante). Item sem `img` mostra o poço vazio, com o rótulo do
 * que entra ali. */
const BENEFICIOS = [
  {
    grupo: "Saúde e bem-estar",
    itens: [
      {
        nome: "Assistência médica Unimed",
        texto: "Plano coparticipativo, com a mensalidade paga pela empresa.",
        foto: "Consulta médica, atendimento acolhedor",
        src: "/lp/ben-unimed.webp",
      },
      {
        nome: "Assistência odontológica",
        texto: "Consulta, limpeza e tratamento, com extensão para dependentes.",
        foto: "Atendimento odontológico",
        src: "/lp/ben-odonto.webp",
      },
      {
        nome: "Convênio com farmácia",
        texto: "Desconto em medicamentos, com pagamento descontado em folha.",
        foto: "Balcão de farmácia, medicamento na mão",
        src: "/lp/ben-farmacia.webp",
      },
      {
        nome: "Wellhub",
        texto: "Acesso a academias, estúdios e aplicativos de treino pelo país.",
        foto: "Pessoa treinando em academia",
        src: "/lp/ben-wellhub.webp",
      },
    ],
  },
  {
    grupo: "No dia a dia",
    itens: [
      {
        nome: "Horário comercial",
        texto: "De segunda a sexta, sem escala de fim de semana.",
        foto: "Relógio de ponto / entrada da fábrica pela manhã",
        src: "/lp/ben-horario.webp",
      },
      {
        nome: "Refeitório da casa",
        texto: "Almoço preparado na hora, no refeitório da própria fábrica.",
        foto: "Refeitório da fábrica na hora do almoço",
        src: "/lp/ben-refeitorio.webp",
      },
      {
        nome: "Transporte",
        texto: "Vale transporte ou ônibus fretado, conforme a sua escolha.",
        foto: "Ônibus fretado chegando na fábrica",
        src: "/lp/ben-transporte.webp",
      },
      {
        nome: "Café durante o expediente",
        texto: "Café e lanche disponíveis ao longo de todo o turno.",
        foto: "Copa da fábrica, café sendo servido",
        src: "/lp/ben-cafe.webp",
      },
    ],
  },
  {
    grupo: "Pra crescer junto",
    itens: [
      {
        nome: "PLR",
        texto: "Participação nos lucros, paga quando a empresa bate as metas do ano.",
        foto: "Time reunido comemorando resultado",
        src: "/lp/ben-plr.webp",
      },
      {
        nome: "Mixtra",
        texto: "Plataforma de descontos do grupo, em lojas, cursos e serviços.",
        foto: "Celular com a plataforma de descontos aberta",
        src: "/lp/ben-mixtra.webp",
      },
      /* O desconto de colaborador já foi uma dobra inteira desta página, com
         quatro poços de produto, um por marca do grupo. Virou bullet: a dobra
         inteira era um anúncio grande pra dizer uma frase, e quebrava a
         leitura entre a lista de benefícios e o dia a dia. Aqui ele fica ao
         lado dos outros, que é o que ele é. */
      {
        nome: "Desconto de colaborador",
        texto: "Preço de quem é de casa no catálogo do grupo, de violão a notebook, parcelado em folha.",
        foto: "Produtos das marcas do grupo: violão, headset e notebook",
        src: "/lp/ben-desconto.webp",
      },
      {
        nome: "Recrutamento interno",
        texto: "Vaga nova é divulgada primeiro para quem já trabalha no grupo.",
        foto: "Colaborador subindo a escada do escritório do grupo",
        src: "/lp/ben-crescer.webp",
      },
    ],
  },
];


/* ─────────────────────────── página ─────────────────────────── */

export function TrabalheConoscoPage() {
  return (
    <>
      <SEO
        title="Trabalhe conosco"
        description="Trabalhe na Tonante, em Maringá: uma das empresas do Grupo Oderço, com benefícios do grupo e vagas no portal de carreiras."
      />
      <div style={{ background: "#ffffff" }}>
        {/* o galpão tem claraboia e estoura no canto esquerdo: véu forte */}
        <HeroInstitucional
          eyebrow="Trabalhe conosco"
          titulo="Tem muita gente por trás de cada instrumento."
          texto="Produção, expedição, vendas, administrativo: a Tonante tem setenta anos de Maringá e muitas funções diferentes dentro da mesma fábrica. As vagas são do Grupo Oderço e passam por aqui."
          src="/lp/atelie-corpos.webp"
          alt="Corpos de violão alinhados no ateliê da fábrica em Maringá"
          focus="70% 58%"
          veu="forte"
          cta={{ label: "Ver vagas abertas", href: PORTAL, externo: true }}
          link={{ label: "Conhecer o Grupo Oderço", href: GRUPO, externo: true }}
        />
        <Orgulho />
        <GrupoOderco />
        <Beneficios />
        <DiaADiaScroll />
        <Fecho />
      </div>
      <Footer />
    </>
  );
}

/* ── 2. o selo ────────────────────────────────────────────────── */

function Orgulho() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1100px] items-center gap-x-16 gap-y-10 lg:grid-cols-[auto_minmax(0,1fr)]">
        {/* o selo vive num well cinza, o mesmo fundo das fotos de catálogo.
            Na PCYES ele vem girado -3deg; aqui não: a página inteira é reta e
            um único elemento torto lê como acidente. */}
        <div
          className="flex w-full items-center justify-center p-10 lg:w-[260px]"
          style={{ background: "var(--gradient-photo)", borderRadius: "var(--radius-card-lg)" }}
        >
          <img
            src="https://www.oderco.com.br/media/wysiwyg/Selo-Ranking-Paran_-2025.png"
            alt="Selo das Melhores Empresas para Trabalhar no Paraná 2025"
            loading="lazy"
            style={{ width: "150px", height: "auto" }}
          />
        </div>

        <div>
          <Eyebrow>Orgulho nosso</Eyebrow>
          <h2
            className="mt-5 max-w-[22rem] md:max-w-[36rem]"
            style={{
              fontFamily: FIGTREE,
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Um bom lugar pra trabalhar. Oficialmente.
          </h2>
          <p
            className="mt-6 max-w-[52ch]"
            style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(17,17,17,0.62)" }}
          >
            O grupo tem o selo Great Place To Work há quatro anos e, em 2025, entrou no ranking das
            Melhores Empresas Para Trabalhar no Paraná. A nota do selo vem de uma pesquisa anônima,
            respondida por quem trabalha no grupo.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 3. o grupo (faixa azul) ──────────────────────────────────── */

function GrupoOderco() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-12 lg:py-32" style={{ background: ODERCO_NOITE }}>
      {/* A fachada entra por cima do azul, não no lugar dele: a foto ocupa o
          terço de cima e se dissolve no chapado antes de chegar nos números.
          O tingimento é o próprio azul da marca por cima da imagem, então céu
          e concreto viram matéria do mesmo azul em vez de uma foto colada
          numa faixa colorida. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ height: "72%" }}>
        {/* `luminosity` joga fora a cor da foto e mantém só o claro e o escuro
            dela: o concreto e o céu passam a ser feitos do azul do fundo, em
            vez de uma foto azulada colada por cima. A máscara dissolve a
            imagem antes de ela chegar nos números, então não existe uma borda
            onde a foto acaba. */}
        <img
          src="/lp/oderco-fachada.webp"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          style={{
            objectPosition: "4% 44%",
            mixBlendMode: "luminosity",
            opacity: 0.34,
            filter: "contrast(1.08) brightness(0.92)",
            maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.25) 74%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.25) 74%, transparent 100%)",
          }}
        />
      </div>

      {/* filete do azul da marca no topo: é o único lugar onde o #005AFF
          aparece puro, e é o que assina a faixa */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, rgba(0,90,255,0) 0%, #005AFF 42%, rgba(0,90,255,0) 100%)" }}
      />

      <div ref={ref} className="relative mx-auto max-w-[1280px]">
        <div className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            {/* a logo entra no lugar do eyebrow: nesta dobra quem fala é o
                grupo, e a assinatura dele diz isso mais rápido que uma linha
                de texto em caixa alta */}
            <img
              src="/lp/oderco-branco.png"
              alt="Grupo Oderço"
              loading="lazy"
              style={{ height: "30px", width: "auto" }}
            />
            <h2
              className="mt-7 max-w-[20rem] md:max-w-[32rem]"
              style={{
                fontFamily: FIGTREE,
                fontSize: "clamp(2rem, 3.4vw, 3rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              A Tonante é uma das empresas do Grupo Oderço.
            </h2>
          </div>

          <div>
            <p
              className="max-w-[54ch]"
              style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(255,255,255,0.88)" }}
            >
              O grupo começou em 1988 e não parou mais de crescer. Hoje são mais de duzentas pessoas
              em Maringá, entre a distribuidora, a PCYES e a fábrica de instrumentos.
            </p>
            <p
              className="mt-5 max-w-[54ch]"
              style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}
            >
              Na prática, é a estrutura de uma empresa grande com a decisão tomada perto: a direção
              do grupo trabalha em Maringá, no mesmo lugar que o time.
            </p>
            <a
              href={GRUPO}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2"
              style={{ fontFamily: INTER, fontSize: "var(--text-sm)", fontWeight: 700, color: "#fff" }}
            >
              Conhecer o Grupo Oderço
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {NUMEROS_GRUPO.map((n, i) => (
            <motion.div
              key={n.rotulo}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  fontFamily: FIGTREE,
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                }}
              >
                {n.valor}
              </span>
              <p
                className="mt-3 max-w-[20ch]"
                style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.5, color: "rgba(255,255,255,0.7)" }}
              >
                {n.rotulo}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. benefícios ────────────────────────────────────────────── */

/* CardFlutuante — o card de imagem que sobe junto do cursor quando o mouse
 * encosta num benefício.
 *
 * Três decisões que fazem o efeito não incomodar:
 *
 *   1. Ele é `position: fixed` e mora fora da lista, num só lugar da seção.
 *      Um card por item viraria doze nós animando ao mesmo tempo.
 *   2. Ele segue o cursor com mola, não colado. Colado o card vira um cursor
 *      gigante e a lista fica impossível de ler.
 *   3. `pointer-events: none`, sempre. O card passa por cima do texto e não
 *      pode roubar o próprio hover que o criou — senão ele pisca.
 *
 * Só existe no ponteiro fino (mouse). Em telas de toque não há hover: lá a
 * lista fica como está, e nenhuma informação se perde, porque o card é
 * ilustração e não conteúdo. */

type Alvo = { nome: string; foto: string; src?: string };

const CARD_W = 296;

function CardFlutuante({ alvo, x, y }: { alvo: Alvo | null; x: number; y: number }) {
  /* A terceira coluna encosta na borda direita da tela: com o card sempre à
     direita do cursor, ele saía cortado pela janela. Quando não cabe, ele
     troca de lado e passa a nascer à esquerda do ponteiro. */
  const larguraJanela = typeof window === "undefined" ? 1440 : window.innerWidth;
  const cabeDireita = x + 26 + CARD_W + 24 <= larguraJanela;
  const destinoX = cabeDireita ? x + 26 : x - CARD_W - 26;

  return (
    <AnimatePresence>
      {alvo && (
        <motion.div
          key="card"
          aria-hidden
          className="pointer-events-none fixed z-50 hidden lg:block"
          style={{ left: 0, top: 0, width: CARD_W }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, x: destinoX, y: y - 118 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
          transition={{
            opacity: { duration: 0.18 },
            scale: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            x: { type: "spring", stiffness: 260, damping: 28, mass: 0.6 },
            y: { type: "spring", stiffness: 260, damping: 28, mass: 0.6 },
          }}
        >
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "var(--radius-card-lg)",
              background: STAGE,
              boxShadow: "0 24px 60px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            {alvo.src ? (
              <Foto src={alvo.src} alt="" ratio="4/3" style={{ borderRadius: 0 }} />
            ) : (
              /* POÇO_ESCURO: o tom vem daqui e não do `tone="dark"` do
                 FotoSlot. O theme.css tem uma tabela de reskin que, dentro de
                 [data-page-light-scope], pinta de branco com !important
                 qualquer style inline com rgb(26,26,28) — que é exatamente o
                 #1a1a1c do poço escuro. #17171a fica fora da tabela. */
              <FotoSlot
                ratio="4/3"
                tone="dark"
                label={alvo.foto}
                style={{ borderRadius: 0, background: POCO_ESCURO }}
              />
            )}
            <p
              className="px-4 py-3"
              style={{
                fontFamily: INTER,
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {alvo.nome}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Beneficios() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [alvo, setAlvo] = useState<Alvo | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /* O ponteiro é lido no contêiner inteiro, uma vez, em vez de um handler por
     item: doze onMouseMove disparando a cada pixel derrubam o scroll. */
  const mover = (e: React.MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <section className="px-5 py-24 md:px-12 lg:py-32" style={{ background: "#fafafa" }}>
      <CardFlutuante alvo={alvo} x={pos.x} y={pos.y} />
      <div ref={ref} className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Benefícios"
          title={
            <>
              A gente cuida de quem
              <br />
              faz a Tonante acontecer.
            </>
          }
          size="lg"
          weight={500}
        />
        <p
          className="mt-5 max-w-[52ch]"
          style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.65, color: "rgba(17,17,17,0.62)" }}
        >
          Os benefícios são os do Grupo Oderço, iguais para todas as empresas, mais alguns que só
          existem aqui dentro da fábrica. Passe o mouse em cada um para ver.
        </p>

        {/* O título de cada grupo era um rótulo de 12px em caixa alta, do
            tamanho de legenda: três colunas de letrinha cinza, sem nenhuma
            âncora pro olho. Agora ele é display, com um filete âmbar por cima
            que cresce da esquerda quando a dobra entra. A seção passa a ter
            três pontos de entrada em vez de nenhum. */}
        <div
          className="mt-16 grid gap-x-12 gap-y-16 lg:mt-24 lg:grid-cols-3"
          onMouseMove={mover}
          onMouseLeave={() => setAlvo(null)}
        >
          {BENEFICIOS.map((b, col) => (
            <div key={b.grupo}>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, delay: col * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block h-[2px] w-full origin-left"
                style={{ background: "var(--amber)" }}
              />
              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: col * 0.12 + 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6"
                style={{
                  fontFamily: FIGTREE,
                  fontSize: "clamp(1.5rem, 2.1vw, 2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                }}
              >
                {b.grupo}
              </motion.h3>

              <ul className="mt-8">
                {b.itens.map((item, i) => {
                  const ativo = alvo?.nome === item.nome;
                  return (
                    <motion.li
                      key={item.nome}
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: col * 0.12 + 0.2 + i * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onMouseEnter={() => setAlvo(item)}
                      className="flex items-start gap-3 px-3 py-4 transition-colors duration-200"
                      style={{
                        borderTop: "1px solid rgba(17,17,17,0.08)",
                        /* o item sob o cursor levanta do fundo cinza: sem
                           isso o card flutua sem origem, e não fica claro de
                           qual linha ele saiu */
                        background: ativo ? "rgba(255,255,255,0.9)" : "transparent",
                        borderRadius: ativo ? "10px" : "0",
                        marginLeft: "-12px",
                        marginRight: "-12px",
                      }}
                    >
                      {/* roseta no lugar de check genérico: é o marcador da casa */}
                      <RosetaIcon size={13} className="mt-1 shrink-0" />
                      <div>
                        <p style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600, color: "rgb(17,17,17)" }}>
                          {item.nome}
                        </p>
                        <p
                          className="mt-1 max-w-[36ch]"
                          style={{
                            fontFamily: INTER,
                            fontSize: "0.875rem",
                            lineHeight: 1.55,
                            color: "rgba(17,17,17,0.55)",
                          }}
                        >
                          {item.texto}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6. fecho ─────────────────────────────────────────────────── */

/* O processo seletivo é do Grupo Oderço, não da Tonante: vaga, triagem e
   banco de currículo vivem no portal do grupo. Um formulário próprio aqui
   duplicaria o ATS e o candidato mandaria currículo pra um e-mail que ninguém
   lê. Então a página é o convite e o portal é o processo — mesma divisão que a
   PCYES faz em cms/trabalhe-conosco.html. */
const PORTAL = "https://www.oderco.com.br/trabalheconosco";
const GRUPO = "https://www.oderco.com.br/sobre-a-empresa";

function Fecho() {
  return (
    <section className="px-5 pb-28 md:px-12 lg:pb-36">
      <div className="mx-auto max-w-[1200px]">
        {/* O fecho era um cartão escuro, e vinha logo depois do depoimento
            escuro e logo antes do rodapé escuro: três blocos pretos separados
            por dois vãos brancos finos, que na rolagem lê como frame cortado,
            não como ritmo. Aqui ele é claro, e a página volta a alternar. */}
        <StringDivider />
        <div className="flex flex-col items-center px-6 pt-20 text-center lg:pt-24">
          <Eyebrow>Vagas abertas</Eyebrow>
          <h2
            className="mt-6 max-w-[20rem] md:max-w-[34rem]"
            style={{
              fontFamily: FIGTREE,
              fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Encontre a sua vaga.
          </h2>
          <p
            className="mt-6 max-w-[46ch]"
            style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.65, color: "rgba(17,17,17,0.62)" }}
          >
            As vagas da Tonante ficam no portal de carreiras do Grupo Oderço, junto com as das outras
            empresas. No portal dá para filtrar por cidade e por área, e cadastrar seu currículo no
            banco de talentos.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <a
              href={PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaVariants({ variant: "brand", size: "lg" })}
              style={{ color: "#fff" }}
            >
              Ver vagas abertas
            </a>
            <a
              href={GRUPO}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2"
              style={{ fontFamily: INTER, fontSize: "var(--text-sm)", fontWeight: 600, color: "rgba(17,17,17,0.7)" }}
            >
              Conhecer o Grupo Oderço
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
