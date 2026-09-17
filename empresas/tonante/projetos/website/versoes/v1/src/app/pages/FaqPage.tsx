import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

type FaqItem = { q: string; a: string };
type FaqCategory = { id: string; label: string; items: FaqItem[] };

const faqCategories: FaqCategory[] = [
  {
    id: "pedidos",
    label: "Pedidos",
    items: [
      {
        q: "Como trocar um item de um pedido?",
        a: "A troca de itens só pode ser efetuada enquanto o pedido ainda estiver em produção ou separação. Após esse estágio, o pedido segue para o envio e não é mais possível alterá-lo.",
      },
      {
        q: "Qual o prazo para o envio após o meu pedido ser aprovado?",
        a: "O prazo para o envio é de até 2 dias úteis após a aprovação do pagamento. Depois disso, o prazo de entrega varia conforme a transportadora escolhida e a sua região.",
      },
      {
        q: "Como rastrear minha compra?",
        a: "Você pode acompanhar o pedido pela área \"Minha Conta\", pelo link de rastreio enviado por e-mail ou diretamente no site da transportadora responsável.",
      },
      {
        q: "O produto acompanha Nota Fiscal?",
        a: "Sim. Todos os produtos Tonante são enviados acompanhados da Nota Fiscal eletrônica, garantindo a procedência e a cobertura da garantia.",
      },
      {
        q: "Por que não estou conseguindo rastrear meu pedido?",
        a: "As atualizações de rastreio podem levar até 48h após a postagem para aparecerem no sistema da transportadora. Se após esse período o status continuar indisponível, entre em contato com o nosso SAC.",
      },
      {
        q: "Posso alterar o endereço da entrega?",
        a: "A alteração de endereço só é possível antes da finalização da compra. Caso o pedido já tenha sido fechado, é necessário cancelá-lo e refazê-lo com o endereço correto.",
      },
      {
        q: "Qual a empresa responsável pela entrega da minha compra?",
        a: "A entrega é feita pelos Correios ou por uma transportadora parceira. No momento da compra, você escolhe entre as opções de frete disponíveis para o seu endereço.",
      },
      {
        q: "Como solicito a segunda via do DANFE?",
        a: "Basta solicitar ao nosso SAC. A cópia do DANFE é enviada por e-mail assim que o pedido é faturado.",
      },
    ],
  },
  {
    id: "pagamentos",
    label: "Pagamentos",
    items: [
      {
        q: "Quais as formas de pagamento disponíveis?",
        a: "Aceitamos cartão de crédito em até 10x (com parcela mínima de R$50), transferência bancária à vista e PIX por meio de QR code.",
      },
      {
        q: "Qual o prazo para confirmar o pagamento do meu pedido?",
        a: "Pagamentos no cartão de crédito são confirmados na hora. Já a transferência bancária pode levar até 2 dias úteis para ser identificada e aprovada.",
      },
      {
        q: "Meu pedido não foi aprovado, o que faço?",
        a: "Toda compra passa por uma análise da plataforma de pagamento. Em caso de recusa, recomendamos entrar em contato com a operadora do seu cartão ou com o seu banco para verificar o motivo.",
      },
      {
        q: "É possível alterar a forma de pagamento após concluir o pedido?",
        a: "Não. Por motivos de segurança, a forma de pagamento não pode ser alterada após o fechamento do pedido. Caso precise trocá-la, será necessário cancelar e refazer a compra.",
      },
    ],
  },
  {
    id: "devolucao",
    label: "Devolução",
    items: [
      {
        q: "Qual o prazo para devolver um produto por arrependimento?",
        a: "Você tem até 7 dias corridos, contados a partir da data de recebimento do produto, para solicitar a devolução por arrependimento.",
      },
      {
        q: "Quais são as condições para devolver um produto?",
        a: "O produto deve ser devolvido sem sinais de uso, acompanhado de todos os acessórios e com a embalagem original intacta.",
      },
      {
        q: "Como solicitar a devolução de um produto?",
        a: "Entre em contato com o nosso SAC informando o motivo da devolução, o número da nota fiscal e enviando fotos ou vídeos do produto. A equipe orientará os próximos passos.",
      },
      {
        q: "Quem paga o frete de devolução?",
        a: "A Tonante disponibiliza a postagem reversa via PAC dos Correios, sem nenhum custo de frete para o cliente.",
      },
      {
        q: "Em quanto tempo recebo o reembolso após a devolução?",
        a: "Para pagamentos no cartão de crédito, o estorno é solicitado imediatamente à operadora. Nos demais meios de pagamento, o reembolso é processado em até 5 dias úteis.",
      },
      {
        q: "Posso devolver apenas parte de um pedido ou kit?",
        a: "Não. Kits devem ser devolvidos por completo, e não aceitamos devoluções parciais de itens que compõem um mesmo conjunto.",
      },
      {
        q: "Preciso incluir algum documento na devolução?",
        a: "Sim. A cópia da nota fiscal, com o motivo da devolução informado, deve acompanhar o produto no envio de retorno.",
      },
    ],
  },
  {
    id: "garantia",
    label: "Garantia / RMA",
    items: [
      {
        q: "Qual o prazo de garantia dos produtos Tonante?",
        a: "Todos os produtos Tonante contam com garantia legal de 90 dias corridos contra defeitos de fabricação.",
      },
      {
        q: "Qual o prazo de garantia dos instrumentos da marca Tonante?",
        a: "Os instrumentos da marca Tonante têm garantia de 1 ou 2 anos, conforme a linha, válida exclusivamente contra defeitos de fabricação.",
      },
      {
        q: "Meu produto está com problema/defeito. Como proceder?",
        a: "Entre em contato com o nosso SAC com a descrição do defeito, o número da nota fiscal e fotos do produto. O retorno da nossa equipe acontece em até 2 dias úteis.",
      },
      {
        q: "Quanto tempo a Tonante tem para analisar o meu produto?",
        a: "Todo produto devolvido por alegação de defeito passa por uma análise técnica, que é concluída em até 30 dias corridos a partir do recebimento.",
      },
      {
        q: "O prazo da garantia venceu, o que faço?",
        a: "Mesmo fora da garantia, você pode entrar em contato com o nosso SAC por e-mail para conhecer as opções de atendimento e reparo disponíveis.",
      },
      {
        q: "O que a garantia cobre e o que ela não cobre?",
        a: "A garantia cobre exclusivamente defeitos de fabricação do instrumento. Não estão cobertos casos de mau uso, regulagem inadequada, desgaste natural de cordas e trastes, exposição a umidade ou calor excessivo.",
      },
      {
        q: "Como é o envio do produto para garantia?",
        a: "Quando o defeito é confirmado, o envio e o retorno do produto são feitos via PAC dos Correios, sem custo de frete por conta da Tonante.",
      },
      {
        q: "Comprei um kit e um dos itens apresentou defeito, preciso enviar o kit inteiro?",
        a: "Sim. Kits devem ser devolvidos por completo para análise, mesmo que apenas um dos itens do conjunto apresente defeito.",
      },
      {
        q: "Quando recebo o produto trocado ou o reembolso pela garantia?",
        a: "A troca é realizada somente após a análise técnica confirmar o defeito de fabricação e havendo disponibilidade do produto em estoque.",
      },
    ],
  },
];

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>(faqCategories[0].id);
  const [query, setQuery] = useState<string>("");

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const visibleCategories = useMemo<FaqCategory[]>(() => {
    if (!isSearching) {
      return faqCategories.filter((category) => category.id === activeCategory);
    }
    return faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.q.toLowerCase().includes(normalizedQuery) ||
            item.a.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategory, isSearching, normalizedQuery]);

  const totalMatches = useMemo(
    () => visibleCategories.reduce((sum, category) => sum + category.items.length, 0),
    [visibleCategories],
  );

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden border-b border-edge-subtle"
        style={{ background: "var(--surface-0)" }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-40%",
            right: "-10%",
            width: "55%",
            height: "140%",
            background:
              "radial-gradient(circle, rgba(200, 120, 0, 0.07) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />

        <div className="relative mx-auto max-w-[1180px] px-5 pb-12 pt-10 md:px-10 md:pb-16 md:pt-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[560px]"
            >
              <span
                className="text-primary"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.24em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Central de ajuda
              </span>

              <h1
                className="mt-4 text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.04,
                }}
              >
                Perguntas frequentes
              </h1>

              <p
                className="mt-4 text-ink-muted"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.65,
                }}
              >
                Pedidos, pagamentos, devoluções e garantia — respondidos em um
                lugar só. Se a sua dúvida não estiver aqui, a gente responde.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="w-full md:max-w-[340px]"
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
                  size={17}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar uma dúvida..."
                  aria-label="Buscar nas perguntas frequentes"
                  className="h-12 w-full border border-edge bg-surface-2 pl-11 pr-4 text-ink-strong placeholder:text-ink-subtle outline-none transition-colors focus:border-primary"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-base)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tópicos (esquerda) + Respostas (direita) ── */}
      <section
        className="relative pb-20 pt-10 md:pb-28 md:pt-14"
        style={{ background: "var(--surface-0)" }}
      >
        <div className="mx-auto max-w-[1180px] px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-[236px_1fr] md:gap-16">
            {/* ── Rail de tópicos ── */}
            <aside className="md:sticky md:top-[176px] md:self-start">
              <p
                className="text-ink-subtle"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.24em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Tópicos
              </p>

              <nav className="mt-4 border-t border-edge-subtle">
                {faqCategories.map((category) => {
                  const isActive = !isSearching && category.id === activeCategory;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveCategory(category.id);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={
                        "relative flex w-full cursor-pointer items-center justify-between border-b border-edge-subtle py-3.5 text-left transition-all " +
                        (isActive
                          ? "pl-4 text-ink-strong"
                          : "pl-0 text-ink-muted hover:pl-2 hover:text-ink-strong")
                      }
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary transition-all"
                        style={{
                          width: isActive ? "2px" : "0px",
                          height: isActive ? "18px" : "0px",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-base)",
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        {category.label}
                      </span>
                      <span
                        className="text-ink-subtle"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {category.items.length}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* ── Cartão de suporte ── */}
              <div
                className="mt-8 border border-edge p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <h2
                  className="text-ink-strong"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  Ainda com dúvida?
                </h2>
                <p
                  className="mt-2 text-ink-muted"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                  }}
                >
                  Fale com quem entende de instrumento. A gente responde em até 2
                  dias úteis.
                </p>
                <Link
                  to="/fale-conosco"
                  className="mt-4 inline-flex items-center gap-1.5 text-primary transition-all hover:gap-2.5"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                  }}
                >
                  Falar com a gente
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>

            {/* ── Respostas ── */}
            <div className="min-w-0">
              {isSearching && (
                <p
                  className="mb-6 text-ink-muted"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {totalMatches === 0
                    ? `Nenhum resultado para "${query}".`
                    : `${totalMatches} ${
                        totalMatches === 1
                          ? "resultado encontrado"
                          : "resultados encontrados"
                      } para "${query}".`}
                </p>
              )}

              <motion.div
                key={isSearching ? `search-${normalizedQuery}` : activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                {visibleCategories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-baseline justify-between gap-4 pb-4">
                      <h2
                        className="text-ink-strong"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "clamp(24px, 3vw, 30px)",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                        }}
                      >
                        {category.label}
                      </h2>
                      <span
                        className="shrink-0 text-ink-subtle"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-caption)",
                          letterSpacing: "0.18em",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {category.items.length}{" "}
                        {category.items.length === 1 ? "pergunta" : "perguntas"}
                      </span>
                    </div>

                    <Accordion type="single" collapsible className="border-t border-edge">
                      {category.items.map((item, index) => (
                        <AccordionItem
                          key={item.q}
                          value={`${category.id}-${index}`}
                          className="border-b border-edge-subtle last:border-b-0"
                        >
                          <AccordionTrigger
                            className="group w-full py-5 text-ink-strong hover:no-underline [&>svg]:hidden"
                            style={{
                              fontFamily: "var(--font-family-figtree)",
                              fontSize: "17px",
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              lineHeight: 1.35,
                            }}
                          >
                            <span className="pr-6 transition-colors group-hover:text-primary">
                              {item.q}
                            </span>
                            <span
                              aria-hidden
                              className="mt-0.5 shrink-0 text-ink-subtle transition-all duration-200 group-hover:text-primary group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary"
                              style={{
                                fontFamily: "var(--font-family-inter)",
                                fontSize: "20px",
                                fontWeight: 400,
                                lineHeight: 1,
                              }}
                            >
                              +
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6 pr-10">
                            <p
                              className="text-ink-muted"
                              style={{
                                fontFamily: "var(--font-family-inter)",
                                fontSize: "var(--text-base)",
                                lineHeight: 1.7,
                              }}
                            >
                              {item.a}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
