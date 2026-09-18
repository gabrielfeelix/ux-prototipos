import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import {
  CTAButton,
  ctaVariants,
  Eyebrow,
  SectionHeader,
  FieldLabel,
  FieldInput,
  StringDivider,
} from "../components/section";
import { FotoSlot } from "./lp/FotoSlot";
import { Foto } from "./lp/Foto";
import { HeroInstitucional } from "./lp/HeroInstitucional";

/* RevendaPage — "Seja um revendedor" (/revendedor).
 *
 * Substitui a landing da PCYES injetada crua. O esqueleto comercial é o mesmo
 * porque funciona (hero → números → razões → bastidor → formulário), com três
 * diferenças que vêm do público:
 *
 * 1. O ATALHO DE CNPJ FICA. Na PCYES existe um link que pula o formulário e
 *    abre direto o cadastro PJ. Quem já decidiu não deveria preencher nove
 *    campos de novo, então o atalho foi mantido no hero.
 * 2. RAZÃO É BENTO, NÃO CARD DE ÍCONE. Quatro razões em bento assimétrico:
 *    três com foto, uma só tipográfica. A que não tem foto é a de margem, que
 *    é número e não imagem.
 * 3. FAQ ANTES DO FORMULÁRIO. Pedido mínimo, prazo e frete são as perguntas
 *    que o lojista faz ANTES de mandar o CNPJ. Sem elas na página, ele manda
 *    a pergunta pelo WhatsApp em vez de preencher.
 *
 * As fotos estão em <FotoSlot> até as imagens chegarem. */

const FIGTREE = "var(--font-family-figtree)";
const INTER = "var(--font-family-inter)";
const STAGE = "#121213";

/* Números de protótipo. Antes de ir pro ar, conferir com o comercial. */
const NUMEROS = [
  { valor: 70, sufixo: "", rotulo: "anos fazendo instrumento" },
  { valor: 300, prefixo: "+", rotulo: "modelos no catálogo" },
  { valor: 27, rotulo: "estados atendidos" },
  { valor: 1200, prefixo: "+", rotulo: "lojas revendem Tonante" },
];

const ETAPAS = [
  { n: "01", titulo: "Pedido", texto: "Portal próprio, com preço de revenda e estoque em tempo real." },
  { n: "02", titulo: "Produção", texto: "Se o modelo não está em estoque, ele entra na linha da semana seguinte." },
  { n: "03", titulo: "Expedição", texto: "Embalagem de transporte própria, com proteção de braço e cavalete." },
  { n: "04", titulo: "Chegada", texto: "Prazo médio de sete dias úteis para o Sul e Sudeste." },
];

const FAQ = [
  {
    p: "Qual é o pedido mínimo?",
    r: "Seis instrumentos no primeiro pedido, misturando modelos como você quiser. Nos pedidos seguintes não há mínimo.",
  },
  {
    p: "Em quanto tempo chega?",
    r: "Sete dias úteis para Sul e Sudeste, até quinze para Norte e Nordeste, contando da confirmação do pagamento.",
  },
  {
    p: "Quem paga o frete?",
    r: "Acima de vinte instrumentos o frete é por nossa conta para todo o Brasil. Abaixo disso, entra no pedido com valor fechado antes de você confirmar.",
  },
  {
    p: "Como funciona a garantia para o lojista?",
    r: "Dois anos contra defeito de fabricação. Peça com defeito a gente troca por unidade nova sem esperar análise, e a análise a gente faz aqui depois.",
  },
  {
    p: "Tem exclusividade de território?",
    r: "Em cidades de até cem mil habitantes, sim, enquanto o lojista mantiver o giro combinado. Em capitais, não.",
  },
];

const TIPOS = [
  "Loja de instrumentos musicais",
  "Escola de música",
  "Luthier ou oficina",
  "E-commerce",
  "Distribuidor",
  "Outro",
];

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

/* ─────────────────────────── página ─────────────────────────── */

export function RevendaPage() {
  return (
    <>
      <SEO
        title="Seja um revendedor Tonante"
        description="Revenda instrumentos Tonante na sua loja: catálogo com mais de 300 modelos, margem de fábrica, suporte de luthier e entrega para todo o Brasil."
      />
      <div style={{ background: "#ffffff" }}>
        {/* véu forte: a parede de loja é clara e uniforme, e no véu leve o
            título branco encostava no tampo dos violões */}
        <HeroInstitucional
          eyebrow="Revenda Tonante"
          titulo="Tonante na parede da sua loja."
          texto="Somos fábrica, não importador. O instrumento que chega na sua loja saiu da nossa linha em Maringá, com garantia de dois anos e peça de reposição no mesmo endereço."
          src="/lp/parede-loja.webp"
          alt="Parede de uma loja de instrumentos com violões e guitarras pendurados"
          focus="78% center"
          veu="forte"
          cta={{ label: "Quero revender", href: "#cadastro" }}
          link={{ label: "Já tenho CNPJ, criar conta agora", href: "/perfil" }}
        />
        <Numeros />
        <PorQue />
        <DaFabrica />
        <Bastidor />
        <Perguntas />
        <Formulario />
      </div>
      <Footer />
    </>
  );
}

/* ── 2. números ───────────────────────────────────────────────── */

function Numeros() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section className="px-5 md:px-12">
      <div ref={ref} className="mx-auto max-w-[1440px]">
        <StringDivider />
        <div className="grid gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {NUMEROS.map((n) => (
            <div key={n.rotulo}>
              <span
                style={{
                  fontFamily: FIGTREE,
                  fontSize: "clamp(2.75rem, 4.4vw, 4rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "var(--ink-strong, #111)",
                }}
              >
                {n.prefixo}
                <Contador alvo={n.valor} rodar={inView} />
                {n.sufixo}
              </span>
              <p
                className="mt-3 max-w-[20ch]"
                style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.5, color: "rgba(17,17,17,0.55)" }}
              >
                {n.rotulo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Contador que sobe ao entrar na tela, como o da PCYES. Easing de saída pra
   ele desacelerar no fim em vez de parar em seco. */
function Contador({ alvo, rodar }: { alvo: number; rodar: boolean }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!rodar) return;
    const duracao = 1400;
    const inicio = performance.now();
    let raf = 0;
    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValor(Math.round(alvo * eased));
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo, rodar]);

  return <>{valor.toLocaleString("pt-BR")}</>;
}

/* ── 3. por que revender (bento) ──────────────────────────────── */

function PorQue() {
  return (
    <section className="px-5 py-8 md:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          eyebrow="Por que revender"
          title={
            <>
              Quatro motivos,
              <br />
              nenhum deles vago.
            </>
          }
          size="lg"
          weight={500}
        />

        {/* bento: a razão sem foto (margem) ocupa a coluna estreita e vira
            bloco tipográfico. Foto em tudo deixaria a dobra toda igual. */}
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <BentoFoto
            className="lg:col-span-2"
            ratio="16/9"
            src="/lp/atelie-corpos.webp"
            alt="Ateliê com corpos de violão em suportes de madeira"
            titulo="É fábrica, não é revenda de revenda"
            texto="Você compra de quem faz. Sem intermediário no meio, sem prazo de importação, sem câmbio no preço da semana que vem."
          />
          <BentoTexto
            titulo="Margem combinada por escrito"
            texto="Tabela de revenda fixa por faixa de volume, com preço sugerido de venda. Você sabe a margem antes de fazer o pedido, e ela não muda no meio do trimestre."
            destaque="38% a 52%"
            legenda="margem por faixa de volume"
          />
          <BentoFoto
            ratio="4/3"
            src="/lp/maos-tampo.webp"
            alt="Luthier lixando o tampo de um violão na bancada"
            titulo="Suporte de luthier de verdade"
            texto="Cliente voltou com trasteio? Você fala com quem monta o instrumento, não com um chat."
          />
          <BentoFoto
            className="lg:col-span-2"
            ratio="21/9"
            src="/lp/expedicao.webp"
            alt="Corredor de expedição com caixas de instrumento em prateleira"
            titulo="Entrega que cabe no seu caixa"
            texto="Frete por nossa conta acima de vinte instrumentos e prazo de sete dias úteis para Sul e Sudeste."
          />
        </div>
      </div>
    </section>
  );
}

function BentoFoto({
  ratio,
  foto,
  prompt,
  src,
  alt,
  focus,
  titulo,
  texto,
  className = "",
}: {
  ratio: string;
  foto?: string;
  prompt?: number;
  src?: string;
  alt?: string;
  focus?: string;
  titulo: string;
  texto: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {src ? (
        <Foto src={src} alt={alt ?? ""} ratio={ratio} focus={focus} />
      ) : (
        <FotoSlot ratio={ratio} label={foto ?? ""} prompt={prompt} />
      )}
      <h3
        className="mt-6 text-foreground"
        style={{ fontFamily: FIGTREE, fontSize: "1.5rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}
      >
        {titulo}
      </h3>
      <p
        className="mt-2 max-w-[52ch]"
        style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.6, color: "rgba(17,17,17,0.62)" }}
      >
        {texto}
      </p>
    </div>
  );
}

function BentoTexto({
  titulo,
  texto,
  destaque,
  legenda,
}: {
  titulo: string;
  texto: string;
  destaque: string;
  legenda: string;
}) {
  return (
    <div
      className="flex flex-col justify-between p-8 lg:p-10"
      style={{ background: STAGE, borderRadius: "var(--radius-card-lg)", minHeight: "320px" }}
    >
      <div>
        <span
          style={{
            fontFamily: FIGTREE,
            fontSize: "clamp(2.25rem, 3.2vw, 3rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--amber-bright)",
          }}
        >
          {destaque}
        </span>
        <p
          className="mt-2"
          style={{
            fontFamily: INTER,
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {legenda}
        </p>
      </div>
      <div className="mt-10">
        <h3  style={{ fontFamily: FIGTREE, fontSize: "1.5rem", lineHeight: 1.2, color: "#fff" }}>
          {titulo}
        </h3>
        <p
          className="mt-2 max-w-[40ch]"
          style={{ fontFamily: INTER, fontSize: "0.9375rem", lineHeight: 1.6, color: "rgba(255,255,255,0.62)" }}
        >
          {texto}
        </p>
      </div>
    </div>
  );
}

/* ── 4. da fábrica pro balcão (faixa escura) ──────────────────── */

function DaFabrica() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="mt-16 px-5 py-24 md:px-12 lg:mt-24 lg:py-32" style={{ background: STAGE }}>
      <div ref={ref} className="mx-auto max-w-[1440px]">
        <Eyebrow style={{ color: "var(--amber-bright)" }}>O caminho do pedido</Eyebrow>
        <h2
          className="mt-5 max-w-[24rem] md:max-w-[38rem]"
          style={{
            fontFamily: FIGTREE,
            fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          Da nossa linha até o seu balcão.
        </h2>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPAS.map((e, i) => (
            <motion.div
              key={e.n}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: INTER,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "var(--amber-bright)",
                }}
              >
                {e.n}
              </span>
              <span
                aria-hidden
                className="mt-4 block h-px w-full"
                style={{ background: "rgba(255,255,255,0.14)" }}
              />
              <h3 className="mt-5" style={{ fontFamily: FIGTREE, fontSize: "1.375rem", lineHeight: 1.2, color: "#fff" }}>
                {e.titulo}
              </h3>
              <p
                className="mt-2 max-w-[32ch]"
                style={{
                  fontFamily: INTER,
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {e.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. bastidor ──────────────────────────────────────────────── */

function Bastidor() {
  return (
    <section className="px-5 py-24 md:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-2">
        <figure>
          <Foto
            src="/lp/estoque-madeira.webp"
            alt="Pilhas de tampos de madeira no estoque da fábrica"
            ratio="3/2"
          />
          <figcaption
            className="mt-4"
            style={{ fontFamily: INTER, fontSize: "0.875rem", color: "rgba(17,17,17,0.5)" }}
          >
            O estoque de madeira. Cada lote descansa oito meses antes de virar tampo.
          </figcaption>
        </figure>
        <figure>
          <Foto
            src="/lp/expedicao.webp"
            alt="Funcionário empurrando um carrinho com caixas no corredor da expedição"
            ratio="3/2"
            focus="center 55%"
          />
          <figcaption
            className="mt-4"
            style={{ fontFamily: INTER, fontSize: "0.875rem", color: "rgba(17,17,17,0.5)" }}
          >
            A expedição. Todo pedido sai daqui com nota, embalagem de transporte e código de rastreio.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ── 6. perguntas ─────────────────────────────────────────────── */

function Perguntas() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section className="px-5 pb-24 md:px-12 lg:pb-32">
      <div className="mx-auto grid max-w-[1440px] gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeader
          eyebrow="Antes de mandar o CNPJ"
          title={
            <>
              As cinco perguntas
              <br />
              que sempre chegam.
            </>
          }
          size="lg"
          weight={500}
        />

        <div>
          {FAQ.map((item, i) => {
            const ativa = aberta === i;
            return (
              <div key={item.p} style={{ borderTop: "1px solid rgba(17,17,17,0.1)" }}>
                <button
                  type="button"
                  onClick={() => setAberta(ativa ? null : i)}
                  aria-expanded={ativa}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    style={{
                      fontFamily: FIGTREE,
                      fontSize: "1.25rem",
                      lineHeight: 1.3,
                      color: ativa ? "var(--amber-deep)" : "rgb(17,17,17)",
                      transition: "color .25s",
                    }}
                  >
                    {item.p}
                  </span>
                  {ativa ? (
                    <Minus size={18} style={{ color: "var(--amber-deep)", flexShrink: 0 }} />
                  ) : (
                    <Plus size={18} style={{ color: "rgba(17,17,17,0.4)", flexShrink: 0 }} />
                  )}
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: ativa ? "1fr" : "0fr",
                    transition: "grid-template-rows .4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      className="max-w-[62ch] pb-7"
                      style={{
                        fontFamily: INTER,
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        color: "rgba(17,17,17,0.62)",
                      }}
                    >
                      {item.r}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid rgba(17,17,17,0.1)" }} />
        </div>
      </div>
    </section>
  );
}

/* ── 7. formulário ────────────────────────────────────────────── */

function Formulario() {
  const [enviado, setEnviado] = useState(false);

  return (
    <section
      id="cadastro"
      className="px-5 py-24 md:px-12 lg:py-32"
      style={{ background: "#fafafa", scrollMarginTop: "var(--header-h, 96px)" }}
    >
      <div className="mx-auto max-w-[860px]">
        <div className="text-center">
          <SectionHeader
            eyebrow="Cadastro de revenda"
            title={enviado ? "Cadastro recebido." : "Manda os dados da sua loja."}
            size="lg"
            weight={500}
            align="center"
          />
          {!enviado && (
            <p
              className="mx-auto mt-5 max-w-[50ch]"
              style={{ fontFamily: INTER, fontSize: "1rem", lineHeight: 1.65, color: "rgba(17,17,17,0.6)" }}
            >
              Um representante da sua região responde em até dois dias úteis com a tabela de revenda
              e o catálogo em PDF.
            </p>
          )}
        </div>

        {enviado ? (
          <p
            className="mx-auto mt-10 max-w-[48ch] text-center"
            style={{ fontFamily: INTER, fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(17,17,17,0.65)" }}
          >
            Chegou aqui. O representante da sua região entra em contato pelo WhatsApp que você
            deixou, em até dois dias úteis.
          </p>
        ) : (
          <form
            className="mt-14 grid gap-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setEnviado(true);
            }}
          >
            <Campo id="razao" label="Razão social" required placeholder="Nome da empresa" />
            <CampoCnpj />
            <Campo id="contato" label="Nome do contato" required placeholder="Quem fala com a gente" />
            <Campo id="email" label="E-mail" type="email" required placeholder="loja@email.com" />
            <Campo id="whats" label="WhatsApp" type="tel" required placeholder="(00) 00000-0000" />
            <Campo id="cidade" label="Cidade" required placeholder="Onde fica a loja" />

            <div>
              <FieldLabel htmlFor="uf" required>
                Estado
              </FieldLabel>
              <select id="uf" required defaultValue="" style={SELECT_STYLE}>
                <option value="" disabled>
                  UF
                </option>
                {UFS.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="tipo" required>
                Tipo de negócio
              </FieldLabel>
              <select id="tipo" required defaultValue="" style={SELECT_STYLE}>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel htmlFor="msg">O que você já vende hoje</FieldLabel>
              <textarea
                id="msg"
                rows={3}
                placeholder="Marcas, faixa de preço, tamanho da loja. Ajuda a montar a primeira proposta."
                style={{ ...SELECT_STYLE, height: "auto", resize: "vertical" }}
              />
            </div>

            <div className="sm:col-span-2 mt-2">
              <CTAButton type="submit" variant="ink" size="lg" block>
                Enviar cadastro
              </CTAButton>
              <p
                className="mt-4 text-center"
                style={{ fontFamily: INTER, fontSize: "0.8125rem", color: "rgba(17,17,17,0.45)" }}
              >
                Seus dados vão só para o time comercial da Tonante.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

const SELECT_STYLE: React.CSSProperties = {
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
};

/* A máscara é a mesma da PCYES: o lojista digita só número e o campo formata.
   Sem isso, metade dos CNPJ chega com ponto no lugar errado. */
function CampoCnpj() {
  const [valor, setValor] = useState("");

  const formatar = (bruto: string) => {
    const d = bruto.replace(/\D/g, "").slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  return (
    <div>
      <FieldLabel htmlFor="cnpj" required>
        CNPJ
      </FieldLabel>
      <FieldInput
        id="cnpj"
        name="cnpj"
        required
        inputMode="numeric"
        placeholder="00.000.000/0000-00"
        value={valor}
        onChange={(e) => setValor(formatar(e.target.value))}
      />
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
