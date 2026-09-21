import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Download, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../../components/section";

/**
 * Showcase do sistema de botões — rota de desenvolvimento, não linkada.
 *
 * Existe para que hover, pressed, foco e loading possam ser conferidos num
 * lugar só. Sem ela, cada migração das tasks seguintes viraria conferência
 * caso a caso nas páginas reais, e estado que só aparece com o mouse em cima
 * não aparece em print nenhum.
 *
 * As seis combinações que o sistema proíbe aparecem como célula vazia. A
 * matriz documenta a regra tanto quanto exibe os botões.
 */

const HIERARQUIAS = ["primary", "secondary", "tertiary", "ghost"] as const;
const INTENCOES = ["neutral", "buy", "danger", "brand"] as const;

type Hierarquia = (typeof HIERARQUIAS)[number];
type Intencao = (typeof INTENCOES)[number];

/** As dez combinações válidas. O resto é célula vazia. Spec §5. */
const PERMITIDO: Record<Hierarquia, Record<Intencao, boolean>> = {
  primary: { neutral: true, buy: true, danger: true, brand: false },
  secondary: { neutral: true, buy: false, danger: true, brand: true },
  tertiary: { neutral: true, buy: false, danger: true, brand: false },
  ghost: { neutral: true, buy: false, danger: true, brand: false },
};

const ROTULO: Record<Intencao, string> = {
  neutral: "Continuar",
  buy: "Comprar agora",
  danger: "Remover",
  brand: "Conheça a história",
};

function Secao({
  titulo,
  legenda,
  children,
}: {
  titulo: string;
  legenda: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[var(--edge-subtle)] py-14">
      <h2 className="text-[22px] font-semibold [color:var(--ink-strong)]">{titulo}</h2>
      <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed [color:var(--ink-muted)]">
        {legenda}
      </p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Nota({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.08em] [color:var(--ink-subtle)]">
      {children}
    </span>
  );
}

/** Uma célula da matriz: o botão, ou o aviso de que a combinação não existe. */
function Celula({ hierarchy, intent }: { hierarchy: Hierarquia; intent: Intencao }) {
  if (!PERMITIDO[hierarchy][intent]) {
    return (
      <div className="flex h-11 items-center justify-center rounded-pill border border-dashed border-[var(--edge-subtle)] text-[11px] uppercase tracking-[0.08em] [color:var(--ink-subtle)]">
        não existe
      </div>
    );
  }
  return (
    <div className="flex h-11 items-center">
      <Button hierarchy={hierarchy} intent={intent}>
        {ROTULO[intent]}
      </Button>
    </div>
  );
}

function Matriz({ onDark = false }: { onDark?: boolean }) {
  const corTitulo = onDark ? "[color:rgba(255,255,255,0.92)]" : "[color:var(--ink-strong)]";
  const corRotulo = onDark ? "[color:rgba(255,255,255,0.55)]" : "[color:var(--ink-subtle)]";

  return (
    <div className="min-w-[860px]">
      <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-x-6 gap-y-5">
        <div />
        {INTENCOES.map((intent) => (
          <div key={intent} className={`text-[11px] uppercase tracking-[0.08em] ${corRotulo}`}>
            {intent}
          </div>
        ))}

        {HIERARQUIAS.map((hierarchy) => (
          <Fileira
            key={hierarchy}
            hierarchy={hierarchy}
            onDark={onDark}
            corTitulo={corTitulo}
          />
        ))}
      </div>
    </div>
  );
}

function Fileira({
  hierarchy,
  onDark,
  corTitulo,
}: {
  hierarchy: Hierarquia;
  onDark: boolean;
  corTitulo: string;
}) {
  return (
    <>
      <div className={`flex h-11 items-center text-[13px] font-semibold ${corTitulo}`}>
        {hierarchy}
      </div>
      {INTENCOES.map((intent) =>
        onDark ? (
          <div key={intent} className="flex h-11 items-center">
            {PERMITIDO[hierarchy][intent] ? (
              <Button hierarchy={hierarchy} intent={intent} onDark>
                {ROTULO[intent]}
              </Button>
            ) : (
              <div className="flex h-11 w-full items-center justify-center rounded-pill border border-dashed border-[rgba(255,255,255,0.18)] text-[11px] uppercase tracking-[0.08em] [color:rgba(255,255,255,0.4)]">
                não existe
              </div>
            )}
          </div>
        ) : (
          <Celula key={intent} hierarchy={hierarchy} intent={intent} />
        )
      )}
    </>
  );
}

export function BotoesPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 py-16">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] [color:var(--btn-brand-ink)]">
          Design system
        </p>
        <h1 className="mt-3 text-[38px] leading-[1.1] font-semibold [color:var(--ink-strong)]">
          Botões
        </h1>
        <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed [color:var(--ink-muted)]">
          Dois eixos. <strong>Hierarquia</strong> é quanto peso o botão tem na tela.{" "}
          <strong>Intenção</strong> é o que ele significa. O que fica de fora é tão
          importante quanto o que entra: âmbar nunca preenche um botão, verde só é
          primário, e todo estado muda de cor, não só de escala.
        </p>
      </header>

      <Secao
        titulo="A matriz"
        legenda="Quatro hierarquias por quatro intenções dão dezesseis combinações, e só dez existem. As outras seis aparecem vazias de propósito: se a combinação está tracejada aqui, ela não deve aparecer no site."
      >
        <div className="overflow-x-auto pb-2">
          <Matriz />
        </div>
      </Secao>

      <Secao
        titulo="Tamanhos"
        legenda="Três alturas, e o rótulo anda junto com elas. Se um botão sair com altura diferente, é className sobrando por cima do primitivo: o tailwind-merge deixa o h-* do consumidor vencer sem avisar."
      >
        <div className="flex flex-wrap items-end gap-8">
          {(["sm", "md", "lg"] as const).map((size, i) => (
            <div key={size} className="flex flex-col gap-3">
              <Button size={size}>Continuar</Button>
              <Nota>
                {size} · {[36, 44, 52][i]}px · rótulo {[13, 15, 16][i]}px
              </Nota>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] [color:var(--ink-muted)]">
          Abaixo de 768px de largura nenhum botão fica com menos de 44px, nem os{" "}
          <code className="text-[12px]">sm</code>. Estreite a janela para conferir.
        </p>
      </Secao>

      <Secao
        titulo="Os seis estados"
        legenda="Repouso, hover, pressed, foco, desabilitado e carregando. Hover e pressed não dá para forçar por prop: passe o mouse e segure o clique. O importante é que a cor mude nos dois, porque em prefers-reduced-motion a escala some e só sobra ela."
      >
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col gap-3">
            <Button>Continuar</Button>
            <Nota>repouso</Nota>
          </div>
          <div className="flex flex-col gap-3">
            <Button>Continuar</Button>
            <Nota>passe o mouse</Nota>
          </div>
          <div className="flex flex-col gap-3">
            <Button>Continuar</Button>
            <Nota>segure o clique</Nota>
          </div>
          <div className="flex flex-col gap-3">
            <Button>Continuar</Button>
            <Nota>chegue por Tab</Nota>
          </div>
          <div className="flex flex-col gap-3">
            <Button disabled>Continuar</Button>
            <Nota>desabilitado</Nota>
          </div>
          <div className="flex flex-col gap-3">
            <Button loading>Continuar</Button>
            <Nota>carregando</Nota>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end gap-8">
          {(["secondary", "tertiary", "ghost"] as const).map((hierarchy) => (
            <div key={hierarchy} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button hierarchy={hierarchy}>Continuar</Button>
                <Button hierarchy={hierarchy} disabled>
                  Continuar
                </Button>
                <Button hierarchy={hierarchy} loading>
                  Continuar
                </Button>
              </div>
              <Nota>{hierarchy} · repouso, desabilitado, carregando</Nota>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Modificadores"
        legenda="block ocupa a linha inteira, iconOnly vira quadrado da mesma altura, e loading troca o conteúdo por um spinner. No loading a largura não pode pular: o rótulo longo abaixo é o teste."
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Button block intent="buy" size="lg">
              <ShoppingCart className="size-[18px]" />
              Comprar agora
            </Button>
            <Button block hierarchy="secondary" size="lg">
              Continuar comprando
            </Button>
            <Nota>block</Nota>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-3">
              <Button iconOnly size="sm" aria-label="Favoritar">
                <Heart className="size-4" />
              </Button>
              <Button iconOnly size="md" aria-label="Favoritar">
                <Heart className="size-[18px]" />
              </Button>
              <Button iconOnly size="lg" aria-label="Favoritar">
                <Heart className="size-5" />
              </Button>
              <Button iconOnly hierarchy="secondary" aria-label="Baixar">
                <Download className="size-[18px]" />
              </Button>
              <Button iconOnly hierarchy="ghost" intent="danger" aria-label="Remover">
                <Trash2 className="size-[18px]" />
              </Button>
            </div>
            <Nota>iconOnly · sm, md, lg</Nota>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Finalizar compra e pagar no PIX</Button>
              <Button loading>Finalizar compra e pagar no PIX</Button>
            </div>
            <Nota>a largura não pode mudar entre os dois</Nota>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button as="link" to="/produtos" hierarchy="secondary">
                Ver o catálogo
                <ArrowRight className="size-4" />
              </Button>
              <Button as="link" to="/produtos" intent="buy">
                Comprar agora
              </Button>
            </div>
            <Nota>as=&quot;link&quot; · vira &lt;Link&gt; e mantém o foco</Nota>
          </div>
        </div>
      </Secao>

      <Secao
        titulo="Comprar no celular: qual altura"
        legenda="Decidido em 21/09: comprar em card é lg, 52px com rótulo de 16px. O que estava lá antes era 14px dentro de 44px, logo abaixo de um preço em 20px e de um nome de produto em 16px — a ação era o texto mais fraco do card, e a altura encostava no piso de acessibilidade (44pt da Apple, 48dp do Material), que é a medida de um botão de fechar. A comparação fica registrada aqui."
      >
        <div className="flex flex-wrap gap-6">
          {[
            { altura: 44, fonte: 14, nome: "antes", nota: "piso de acessibilidade" },
            { altura: 48, fonte: 15, nome: "48 · 15px", nota: "mínimo do Material" },
            { altura: 52, fonte: 16, nome: "lg · escolhido", nota: "bloco de compra do spec" },
          ].map((op) => (
            <div key={op.altura} className="w-[172px]">
              <div className="rounded-card-md border border-[var(--edge-subtle)] p-3">
                <div className="mb-3 h-[86px] rounded-card-sm [background-color:var(--surface-glass)]" />
                <p
                  className="leading-[1.4] [color:#333]"
                  style={{ fontSize: "16px", fontWeight: 500 }}
                >
                  Violão Elétrico Misti 40&quot;
                </p>
                <p
                  className="mt-2 [color:#333]"
                  style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  R$ 518,85
                </p>
                <p className="mt-[3px] [color:#6b6b6b]" style={{ fontSize: "12.5px" }}>
                  10x de R$ 57,65 sem juros
                </p>
                <button
                  type="button"
                  className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-pill [background-color:var(--buy-green)] [color:#fff] transition-colors hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)]"
                  style={{
                    height: `${op.altura}px`,
                    fontSize: `${op.fonte}px`,
                    fontWeight: 600,
                    fontFamily: "var(--font-family-inter)",
                  }}
                >
                  Comprar agora
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <Nota>{op.nome}</Nota>
                <span className="text-[12px] [color:var(--ink-muted)]">{op.nota}</span>
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Sobre fundo escuro"
        legenda="onDark é contexto, não hierarquia: o tema do site é travado em claro, mas existem seções sobre o palco escuro e sobre foto. Repare que da segunda linha para baixo a intenção deixa de pintar: sobre escuro, secondary, tertiary e ghost são sempre translúcidos brancos, porque qualquer tinta ali briga com a foto. Só o primary continua dizendo a intenção, e o texto nunca muda de cor no hover, senão a fonte escurece no meio da transição e o botão some."
      >
        <div className="rounded-card-lg [background-color:var(--stage)] p-10">
          <div className="overflow-x-auto pb-2">
            <Matriz onDark />
          </div>
        </div>

        <div
          className="mt-8 rounded-card-lg bg-cover bg-center p-10"
          style={{ backgroundImage: "url(/cenas/palco.png)" }}
        >
          <div className="flex flex-wrap gap-4">
            <Button onDark size="lg">
              Ver a coleção
            </Button>
            <Button onDark hierarchy="secondary" size="lg">
              Conhecer a linha
            </Button>
            <Button onDark hierarchy="tertiary" size="lg">
              Ouvir como soa
            </Button>
            <Button onDark hierarchy="ghost" size="lg">
              Agora não
            </Button>
          </div>
          <p className="mt-6 text-[13px] [color:rgba(255,255,255,0.7)]">
            Sobre foto o secondary ganha desfoque atrás, que é o que separa a borda do
            que estiver passando embaixo dela.
          </p>
        </div>
      </Secao>

      <Secao
        titulo='Dentro de um link: as="span"'
        legenda='Quando o cartão inteiro já é um link, o botão não pode ser outro link: <a> dentro de <a> é inválido. Ele vira span, e os estados passam a vir do pai. O cartão da esquerda tem group no Link e o botão reage junto; o da direita não tem, e o botão fica inerte. É o bug que o banner da home tem hoje.'
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/produtos"
            className="group block rounded-card-lg [background-color:var(--stage)] p-8 transition-transform duration-200 ease-[var(--ease)] hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            <p className="text-[18px] font-semibold [color:#fff]">Com group no Link</p>
            <p className="mt-2 mb-6 text-[13px] [color:rgba(255,255,255,0.65)]">
              Passe o mouse em qualquer canto do cartão.
            </p>
            <Button as="span" hierarchy="secondary" onDark>
              Ver a linha
            </Button>
          </Link>

          <Link
            to="/produtos"
            className="block rounded-card-lg [background-color:var(--stage)] p-8 transition-transform duration-200 ease-[var(--ease)] hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            <p className="text-[18px] font-semibold [color:#fff]">Sem group no Link</p>
            <p className="mt-2 mb-6 text-[13px] [color:rgba(255,255,255,0.65)]">
              O cartão cresce e o botão não acompanha.
            </p>
            <Button as="span" hierarchy="secondary" onDark>
              Ver a linha
            </Button>
          </Link>
        </div>
      </Secao>
    </div>
  );
}
