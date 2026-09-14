import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { LifeBuoy, Search, MessageCircle, ArrowRight } from "lucide-react";
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
        a: "Sim. Todos os produtos PCYES são enviados acompanhados da Nota Fiscal eletrônica, garantindo a procedência e a cobertura da garantia.",
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
        a: "A PCYES disponibiliza a postagem reversa via PAC dos Correios, sem nenhum custo de frete para o cliente.",
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
        q: "Qual o prazo de garantia dos produtos PCYES?",
        a: "Todos os produtos PCYES contam com garantia legal de 90 dias corridos contra defeitos de fabricação.",
      },
      {
        q: "Qual o prazo de garantia das placas de vídeo da marca PCYES?",
        a: "As placas de vídeo da marca PCYES têm garantia de 1 ou 2 anos, conforme o modelo, válida exclusivamente contra defeitos de fabricação.",
      },
      {
        q: "Meu produto está com problema/defeito. Como proceder?",
        a: "Entre em contato com o nosso SAC com a descrição do defeito, o número da nota fiscal e fotos do produto. O retorno da nossa equipe acontece em até 2 dias úteis.",
      },
      {
        q: "Quanto tempo a PCYES tem para analisar o meu produto?",
        a: "Todo produto devolvido por alegação de defeito passa por uma análise técnica, que é concluída em até 30 dias corridos a partir do recebimento.",
      },
      {
        q: "O prazo da garantia venceu, o que faço?",
        a: "Mesmo fora da garantia, você pode entrar em contato com o nosso SAC por e-mail para conhecer as opções de atendimento e reparo disponíveis.",
      },
      {
        q: "O que a garantia cobre e o que ela não cobre?",
        a: "A garantia cobre exclusivamente defeitos de fabricação do hardware. Não estão cobertos casos de mau uso, instalação inadequada, desgaste natural, contato com líquidos e perda de dados.",
      },
      {
        q: "Como é o envio do produto para garantia?",
        a: "Quando o defeito é confirmado, o envio e o retorno do produto são feitos via PAC dos Correios, sem custo de frete por conta da PCYES.",
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
        className="relative overflow-hidden border-b border-edge-subtle pt-[152px] md:pt-[182px]"
        style={{ background: "var(--surface-0)" }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-25%",
            right: "-18%",
            width: "65%",
            height: "120%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.08) 0%, rgba(200, 120, 0,0.025) 40%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-30%",
            left: "-12%",
            width: "45%",
            height: "70%",
            background:
              "radial-gradient(circle, rgba(17, 17, 17, 0.04) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />

        <div className="relative mx-auto max-w-[1434px] px-5 pb-16 pt-12 text-center md:px-12 md:pb-20 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex justify-center"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.2em",
                fontWeight: 700,
                boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
              }}
            >
              <LifeBuoy size={11} /> CENTRAL DE AJUDA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-ink-strong"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(38px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            Perguntas{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #ffffff 0%, #a0a0a8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Frequentes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-[560px] text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-base)",
              lineHeight: 1.6,
            }}
          >
            Encontre respostas rápidas sobre pedidos, pagamentos, devoluções e
            garantia. Se ainda ficar com dúvida, é só falar com a gente.
          </motion.p>

          {/* ── Search ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mx-auto mt-8 w-full max-w-[520px]"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar uma dúvida..."
                aria-label="Buscar nas perguntas frequentes"
                className="h-12 w-full rounded-full border border-edge bg-white/[0.03] pl-11 pr-4 text-ink-strong placeholder:text-ink-subtle outline-none transition-colors focus:border-primary/50"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-base)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Categories + Q&A ── */}
      <section
        className="relative pb-20 pt-12 md:pb-28 md:pt-16"
        style={{ background: "var(--surface-0)" }}
      >
        <div className="mx-auto max-w-3xl px-5 md:px-12">
          {/* Category pill toggle — hidden while searching */}
          {!isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex flex-wrap justify-center gap-2"
            >
              {faqCategories.map((category) => {
                const isActive = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={
                      "cursor-pointer rounded-full border px-4 py-2 transition-all " +
                      (isActive
                        ? "border-primary/60 bg-foreground/[0.06] text-ink-strong"
                        : "border-edge bg-white/[0.03] text-foreground/60 hover:border-edge-strong hover:text-ink-strong")
                    }
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                    }}
                  >
                    {category.label}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Search results counter */}
          {isSearching && (
            <p
              className="mb-8 text-center text-foreground/60"
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

          {/* Q&A accordions */}
          <motion.div
            key={isSearching ? `search-${normalizedQuery}` : activeCategory}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {visibleCategories.map((category) => (
              <div key={category.id}>
                {isSearching && (
                  <p
                    className="mb-3 uppercase text-primary"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "var(--text-caption)",
                      letterSpacing: "0.22em",
                      fontWeight: 700,
                    }}
                  >
                    {category.label}
                  </p>
                )}
                <Accordion
                  type="single"
                  collapsible
                  className="overflow-hidden rounded-2xl border border-foreground/10 bg-white/[0.03]"
                >
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={item.q}
                      value={`${category.id}-${index}`}
                      className="border-foreground/10 px-5"
                    >
                      <AccordionTrigger
                        className="py-5 text-ink-strong hover:no-underline"
                        style={{
                          fontFamily: "var(--font-family-figtree)",
                          fontSize: "var(--text-base)",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-foreground/60">
                        <p
                          style={{
                            fontFamily: "var(--font-family-inter)",
                            fontSize: "var(--text-base)",
                            lineHeight: 1.65,
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

          {/* ── Still need help card ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-14 overflow-hidden rounded-2xl border border-foreground/10 bg-white/[0.03] p-8 text-center md:p-10"
          >
            <div
              className="pointer-events-none absolute"
              style={{
                top: "-60%",
                left: "50%",
                width: "60%",
                height: "180%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(circle, rgba(17, 17, 17, 0.08) 0%, transparent 65%)",
                filter: "blur(70px)",
              }}
            />
            <div className="relative">
              <div className="mb-5 flex justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.06] text-primary">
                  <MessageCircle size={22} />
                </span>
              </div>
              <h2
                className="text-ink-strong"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(24px, 3vw, 30px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Ainda precisa de ajuda?
              </h2>
              <p
                className="mx-auto mt-3 max-w-[440px] text-foreground/60"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-base)",
                  lineHeight: 1.6,
                }}
              >
                Nossa equipe de atendimento está pronta para resolver qualquer
                dúvida que não foi respondida por aqui.
              </p>
              <Link
                to="/fale-conosco"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-ink-strong transition-all hover:brightness-110"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  boxShadow: "0 12px 30px -10px rgba(200, 120, 0,0.55)",
                }}
              >
                Fale Conosco
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
