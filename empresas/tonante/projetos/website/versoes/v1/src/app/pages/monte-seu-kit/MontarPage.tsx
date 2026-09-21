/* MontarPage — montar o kit peça por peça.
 *
 * O que existia aqui era a vitrine de combos da home (components/MonteSeuKit):
 * três receitas fixas com toggle de add-on. A entrada do fluxo promete outra
 * coisa — "você escolhe o instrumento e o que vai junto, e a gente avisa se
 * alguma peça não combina" — e quem clicava em "peça por peça" caía numa tela
 * onde não escolhia peça nenhuma. Agora a tela entrega a promessa. A seção
 * continua viva na home, que é de onde ela veio.
 *
 * A forma é a do "monte seu setup" do PCYES v3: wizard por passo, resumo fixo
 * do lado, checagem de compatibilidade com atalho pra corrigir, revisão no fim.
 * O vocabulário é nosso: o passo é o que a peça faz pelo músico, não a
 * categoria da loja, e a única regra dura é a que estraga instrumento de
 * verdade (aço em braço de nylon). Ver pecasKit.ts para o porquê de cada slot.
 *
 * Estado mora aqui, em useState, como no v3. Não há persistência: kit montado
 * é decisão de sessão, e salvar em localStorage sem uma tela de "meus kits" só
 * cria estado fantasma que ninguém consegue apagar. */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useCart } from "../../components/CartContext";
import { Footer } from "../../components/Footer";
import { type Product } from "../../components/productsData";
import { getPrimaryProductImage } from "../../components/productPresentation";
import {
  formatBRL,
  getInstallmentCount,
  getInstallmentValue,
  getPixPrice,
} from "../../components/productEnhancements";
import { PaymentModal } from "../../components/ProductPage";
import {
  DESCONTO_KIT,
  FAMILIAS_OFERECIDAS,
  LABEL_FAMILIA,
  type Familia,
  type Recado,
  type Selecao,
  type Slot,
  type SlotId,
  checarKit,
  familiaDoInstrumento,
  instrumentosDisponiveis,
  dependenciasDoMicrofone,
  fotoLimpaDoProduto,
  pecasDoSlot,
  selecaoVazia,
  slotsVisiveis,
  totaisDoKit,
} from "./pecasKit";

const DISPLAY = { fontFamily: "var(--font-family-figtree)" } as const;
const CORPO = { fontFamily: "var(--font-family-inter)" } as const;

/* Bloco de apoio: o mesmo degradê neutro do resumo do carrinho e do checkout
   (CartPage:184). Cartão aqui é definido por borda e sombra, não por cor de
   fundo — a loja não tem superfície bege. */
const CARTAO = {
  borderRadius: "var(--radius-card-xl)",
  background: "var(--surface-1)",
  border: "1px solid var(--edge-subtle)",
  boxShadow: "var(--shadow-card)",
} as const;

/* Etiqueta de seção no idioma da casa: caixa alta, tracking largo, barra dupla. */
const CAPTION = {
  fontFamily: "var(--font-family-inter)",
  fontSize: "var(--text-caption)",
  fontWeight: 700,
  letterSpacing: "0.3em",
} as const;

export function MontarPage() {
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();

  const [sel, setSel] = useState<Selecao>(selecaoVazia);
  const [indice, setIndice] = useState(0);
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [busca, setBusca] = useState("");
  const [revisando, setRevisando] = useState(false);

  const instrumento = sel.instrumento[0] ?? null;
  const passos = useMemo(() => slotsVisiveis(instrumento, familia), [instrumento, familia]);
  const passo = passos[Math.min(indice, passos.length - 1)];
  const recados = useMemo(() => checarKit(sel, revisando), [sel, revisando]);
  const totais = useMemo(() => totaisDoKit(sel), [sel]);
  const temErro = recados.some((r) => r.gravidade === "erro");

  /* A tela de entrada é montada do catálogo, não de lista escrita à mão: a
     família só aparece se existir instrumento dela em estoque, e o número de
     etapas vem do trilho medido no instrumento mais representativo. Assim
     ninguém clica em "Sopro" e cai num passo com uma flauta. */
  const familias = useMemo(
    () =>
      FAMILIAS_OFERECIDAS.map((f) => {
        const exemplos = instrumentosDisponiveis(f.id);
        return {
          ...f,
          exemplo: exemplos[0] ?? null,
          modelos: exemplos.length,
          etapas: exemplos[0] ? slotsVisiveis(exemplos[0]).length : 0,
        };
      }).filter((f) => f.exemplo !== null),
    [],
  );

  const escolherFamilia = (f: Familia) => {
    setFamilia(f);
    setBusca("");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const opcoes = useMemo(() => {
    const base =
      passo.id === "instrumento"
        ? instrumentosDisponiveis(familia)
        : pecasDoSlot(passo.id, instrumento);
    const q = busca.trim().toLowerCase();
    return q ? base.filter((p) => p.name.toLowerCase().includes(q)) : base;
  }, [passo.id, familia, instrumento, busca]);

  const irPara = (i: number) => {
    setIndice(Math.max(0, Math.min(i, passos.length - 1)));
    setBusca("");
    setRevisando(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const avancar = () => {
    if (indice >= passos.length - 1) {
      setRevisando(true);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    irPara(indice + 1);
  };

  const escolher = (p: Product) => {
    setSel((atual) => {
      const jaTem = atual[passo.id].some((x) => x.id === p.id);
      if (jaTem) return { ...atual, [passo.id]: atual[passo.id].filter((x) => x.id !== p.id) };
      /* Trocar o instrumento no meio do caminho NÃO apaga o resto. O v3 limpa
         tudo que dependia da CPU trocada, e faz sentido lá: ninguém enxerga um
         socket errado. Aqui a incompatibilidade tem nome e o cliente entende
         ("esse jogo é de aço e o seu violão é de nylon"), então é melhor
         mostrar o problema do que sumir com cinco escolhas sem explicação.
         checarKit() acusa, e o recado leva de volta ao passo. */
      if (passo.id === "instrumento") return { ...atual, instrumento: [p] };
      const lista = [...atual[passo.id], p];
      return { ...atual, [passo.id]: lista.slice(-passo.max) };
    });
  };

  /* A dependência do microfone entra em slot que não é o passo atual (o cabo
     vai pro "ligar", o pedestal pro "segurar"), então ela não passa por
     `escolher`, que é sempre do passo aberto. */
  const adicionarEm = (slot: SlotId, p: Product) =>
    setSel((atual) =>
      atual[slot].some((x) => x.id === p.id)
        ? atual
        : { ...atual, [slot]: [...atual[slot], p] },
    );

  const remover = (slot: SlotId, id: number) =>
    setSel((atual) => ({ ...atual, [slot]: atual[slot].filter((p) => p.id !== id) }));

  const corrigir = (slot: SlotId) => {
    const i = passos.findIndex((s) => s.id === slot);
    if (i >= 0) irPara(i);
  };

  const fecharKit = () => {
    totais.itens.forEach((p) =>
      addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        image: getPrimaryProductImage(p),
        cartKey: `kit-${p.id}`,
      }),
    );
    setIsOpen(true);
  };

  return (
    <>
      <main className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 pb-32 pt-8 sm:px-6 lg:px-8 lg:pb-24">
          <div className="flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() =>
                revisando
                  ? setRevisando(false)
                  : indice > 0
                    ? irPara(indice - 1)
                    : navigate("/monte-seu-kit")
              }
              className="inline-flex items-center gap-2 text-[0.9375rem] text-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            {/* Antes da família não há trilho, e o contador ficava anunciando
                "1 de 5" ao lado de uma tela que não é etapa de coisa nenhuma. */}
            {(familia || revisando) && (
              <span className="text-[0.8125rem] text-foreground/50">
                {revisando ? "Revisão" : `${indice + 1} de ${passos.length}`}
              </span>
            )}
          </div>

          {/* A trilha só faz sentido depois da família: antes disso ela mostraria
              etapas que talvez nem existam no trilho do instrumento escolhido. */}
          {familia && (
            <Trilha passos={passos} indice={revisando ? passos.length : indice} sel={sel} onIr={irPara} />
          )}

          {!familia && !revisando ? (
            <EscolhaDeFamilia familias={familias} onEscolher={escolherFamilia} />
          ) : revisando ? (
            <Revisao
              sel={sel}
              passos={passos}
              recados={recados}
              totais={totais}
              temErro={temErro}
              onCorrigir={corrigir}
              onRemover={remover}
              onFechar={fecharKit}
            />
          ) : (
            <div className="mt-10 gap-10 lg:grid lg:grid-cols-[1fr_320px]">
              <div>
                <h1
                  className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.06] tracking-[-0.02em] text-foreground"
                  style={DISPLAY}
                >
                  {passo.titulo}
                </h1>
                <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-foreground/65">
                  {passo.id === "instrumento" && instrumento
                    ? `Escolhido: ${instrumento.name}. Pode trocar: o resto do kit continua aí, e a gente avisa se alguma peça deixar de servir.`
                    : passo.sub}
                </p>

                {passo.id === "instrumento" && familia && (
                  <button
                    type="button"
                    onClick={() => { setFamilia(null); setSel(selecaoVazia()); setIndice(0); }}
                    className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-foreground/[0.12] px-4 py-2 text-[0.875rem] text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {FAMILIAS_OFERECIDAS.find((f) => f.id === familia)?.label ?? LABEL_FAMILIA[familia]}
                    <span className="text-foreground/40">trocar</span>
                  </button>
                )}

                <div className="mt-7 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar nesta etapa"
                      className="h-11 w-full rounded-[var(--radius-pill)] border border-foreground/[0.12] bg-white pl-11 pr-4 text-[0.9375rem] text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground/35"
                    />
                  </div>
                  <span className="hidden shrink-0 text-[0.8125rem] text-foreground/45 sm:block">
                    {opcoes.length} {opcoes.length === 1 ? "opção" : "opções"}
                  </span>
                </div>

                {opcoes.length === 0 ? (
                  <p className="mt-10 max-w-[46ch] text-[0.9375rem] leading-relaxed text-foreground/60">
                    Nada nesta etapa combina com o que você escolheu até agora. Pode seguir sem essa
                    peça — o kit fecha do mesmo jeito.
                  </p>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {opcoes.slice(0, 24).map((p) => (
                      <PecaTile
                        key={p.id}
                        produto={p}
                        marcada={sel[passo.id].some((x) => x.id === p.id)}
                        onClick={() => escolher(p)}
                      />
                    ))}
                  </div>
                )}

                {passo.id === "cantar" && sel.cantar.length > 0 && (
                  <DependenciasDoMic
                    mic={sel.cantar[0]}
                    sel={sel}
                    onAdicionar={adicionarEm}
                  />
                )}
              </div>

              <aside className="mt-12 lg:mt-0">
                {/* Rolar pra cima revela de novo a barra de avisos + header +
                    menu de categorias; com offset menor essa pilha comia o
                    topo do painel. Este valor é a pilha inteira, com folga. */}
                <div className="lg:sticky lg:top-[228px] lg:self-start">
                  <Resumo
                    passos={passos}
                    sel={sel}
                    totais={totais}
                    recados={recados}
                    onIr={corrigir}
                    onRemover={remover}
                    acao={{
                      rotulo: indice >= passos.length - 1 ? "Revisar o kit" : "Continuar",
                      bloqueado: passo.obrigatorio && sel[passo.id].length === 0,
                      onAvancar: avancar,
                      onPular: passo.obrigatorio ? undefined : avancar,
                    }}
                  />
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* Barra fixa: no mobile o resumo não cabe ao lado, então o total e o
            avanço moram no rodapé, como no v3. */}
        {!revisando && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
              <div>
                <p className="text-[0.75rem] text-foreground/55">
                  {totais.itens.length} {totais.itens.length === 1 ? "peça" : "peças"} no kit
                </p>
                <p
                  className="num"
                  style={{ ...CORPO, fontSize: "17px", fontWeight: 700, color: "#333333" }}
                >
                  {formatBRL(totais.comDesconto)}
                </p>
              </div>
              <button
                type="button"
                disabled={passo.obrigatorio && sel[passo.id].length === 0}
                onClick={avancar}
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-foreground px-6 text-[0.9375rem] font-semibold [color:#fff] disabled:opacity-30"
              >
                {indice >= passos.length - 1 ? "Revisar" : "Continuar"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

/* ——— o que o microfone arrasta atrás ————————————————————————————————————— */

/* Dependência mostrada no lugar onde ela nasce.
 *
 * Microfone com fio sem cabo XLR não liga em nada, e sem pedestal ocupa a mão
 * que ia tocar. Empurrar isso pra dois passos adiante é como vender impressora
 * e só falar do cabo na entrega: aqui as duas peças aparecem no instante em que
 * o microfone é escolhido, com o preço na frente e uma ação só pra aceitar as
 * duas. Quem não quer, ignora e segue. */
function DependenciasDoMic({
  mic,
  sel,
  onAdicionar,
}: {
  mic: Product;
  sel: Selecao;
  onAdicionar: (slot: SlotId, p: Product) => void;
}) {
  const { cabo, pedestal } = useMemo(() => dependenciasDoMicrofone(mic), [mic]);
  const faltando = [
    cabo && !sel.ligar.some((p) => p.id === cabo.id)
      ? { slot: "ligar" as SlotId, produto: cabo, papel: "Cabo XLR pra ligar na mesa" }
      : null,
    pedestal && !sel.segurar.some((p) => p.id === pedestal.id)
      ? { slot: "segurar" as SlotId, produto: pedestal, papel: "Pedestal pra deixar as mãos livres" }
      : null,
  ].filter((x): x is { slot: SlotId; produto: Product; papel: string } => x !== null);

  if (faltando.length === 0) return null;

  return (
    <div className="mt-8 p-5" style={CARTAO}>
      <p className="text-[0.9375rem] font-semibold text-foreground" style={DISPLAY}>
        {mic.name.split(" - ")[0]} precisa de mais isto
      </p>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/60">
        Sem essas peças o microfone chega e não funciona. Dá pra escolher outro modelo
        nas etapas seguintes.
      </p>

      <ul className="mt-4 space-y-2">
        {faltando.map(({ slot, produto, papel }) => (
          <li key={produto.id} className="flex items-center gap-3">
            <span
              className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px]"
              style={{ background: "var(--well)" }}
            >
              <ImageWithFallback
                src={fotoLimpaDoProduto(produto) ?? getPrimaryProductImage(produto)}
                alt=""
                className="h-full w-full object-contain p-1 mix-blend-multiply"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] text-foreground/85">{papel}</span>
              <span className="num block text-[0.75rem] text-foreground/55">
                {produto.name.split(" - ")[0]} · {formatBRL(getPixPrice(produto))}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onAdicionar(slot, produto)}
              className="shrink-0 rounded-[var(--radius-pill)] border border-foreground/[0.14] px-4 py-2 text-[0.8125rem] font-semibold text-foreground transition-colors hover:border-foreground/40"
            >
              Adicionar
            </button>
          </li>
        ))}
      </ul>

      {faltando.length > 1 && (
        <button
          type="button"
          onClick={() => faltando.forEach(({ slot, produto }) => onAdicionar(slot, produto))}
          className="mt-4 inline-flex h-11 items-center rounded-[var(--radius-pill)] bg-foreground px-6 text-[0.875rem] font-semibold [color:#fff] transition-opacity hover:opacity-90"
        >
          Adicionar os dois
        </button>
      )}
    </div>
  );
}

/* ——— escolha de família ————————————————————————————————————————————————— */

/* Primeira tela do montador.
 *
 * Antes a família era um filtro em pílula ao lado de 78 violões: o cliente
 * escolhia o instrumento antes de saber que a escolha muda o kit inteiro. Como
 * o trilho de etapas depende da família, ela virou a pergunta de abertura, com
 * foto e com o número de etapas visível — a pessoa sabe no que está entrando
 * antes do primeiro clique. */
function EscolhaDeFamilia({
  familias,
  onEscolher,
}: {
  familias: {
    id: Familia;
    label: string;
    hint: string;
    arte?: string;
    exemplo: Product | null;
    modelos: number;
    etapas: number;
  }[];
  onEscolher: (f: Familia) => void;
}) {
  return (
    <div className="mt-10">
      <h1
        className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.06] tracking-[-0.02em] text-foreground"
        style={DISPLAY}
      >
        O que você toca?
      </h1>
      <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-foreground/65">
        O resto do kit é montado em cima dessa escolha. Cada instrumento pede peças
        diferentes, então as etapas mudam conforme o que você tocar.
      </p>

      {/* As 10 famílias cabem em duas fileiras de cinco na largura cheia da
          página; presas em 900px sobrava um vazio à direita da tela. */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {familias.map((f) => {
          const foto = f.arte ?? (f.exemplo ? fotoLimpaDoProduto(f.exemplo) : null);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onEscolher(f.id)}
              className="group overflow-hidden p-3 text-left transition-shadow hover:shadow-[var(--shadow-tile-hover)]"
              style={CARTAO}
            >
              <span
                className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[10px]"
                style={{ background: "var(--well)" }}
              >
                {foto && (
                  <ImageWithFallback
                    src={foto}
                    alt=""
                    className="h-full w-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </span>
              <span className="block text-[0.9375rem] font-semibold text-foreground" style={DISPLAY}>
                {f.label}
              </span>
              <span className="mt-0.5 block text-[0.75rem] leading-snug text-foreground/60">
                {f.hint}
              </span>
              <span className="mt-2 block text-[0.75rem] text-foreground/45">
                {f.etapas} etapas · {f.modelos} {f.modelos === 1 ? "modelo" : "modelos"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— trilha ——————————————————————————————————————————————————————————— */

function Trilha({
  passos,
  indice,
  sel,
  onIr,
}: {
  passos: Slot[];
  indice: number;
  sel: Selecao;
  onIr: (i: number) => void;
}) {
  return (
    <ol className="mt-6 flex gap-1.5 overflow-x-auto pb-1">
      {passos.map((s, i) => {
        const feito = sel[s.id].length > 0;
        const atual = i === indice;
        return (
          <li key={s.id} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onIr(i)}
              className="group w-full text-left"
              aria-current={atual ? "step" : undefined}
            >
              <span
                className={`block h-1 rounded-full transition-colors ${
                  atual ? "bg-[var(--amber)]" : feito ? "bg-foreground/45" : "bg-foreground/[0.12]"
                }`}
              />
              <span
                className={`mt-2 flex items-center gap-1.5 whitespace-nowrap text-[0.75rem] transition-colors ${
                  atual ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/75"
                }`}
              >
                {feito && <Check className="h-3 w-3 text-[var(--amber)]" strokeWidth={3} />}
                {s.curto}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ——— peças ———————————————————————————————————————————————————————————— */

function PecaTile({
  produto,
  marcada,
  onClick,
}: {
  produto: Product;
  marcada: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={marcada}
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card-md)] border bg-white p-3 text-left transition-shadow ${
        marcada
          ? "border-[var(--amber)] shadow-[inset_0_0_0_1px_var(--amber)]"
          : "border-foreground/10 hover:shadow-[var(--shadow-tile-hover)]"
      }`}
    >
      <div
        className="relative aspect-square overflow-hidden rounded-[var(--radius-card-sm)]"
        style={{ background: "var(--gradient-photo)" }}
      >
        <ImageWithFallback
          src={fotoLimpaDoProduto(produto) ?? getPrimaryProductImage(produto)}
          alt={produto.name}
          className="h-full w-full object-contain p-3 mix-blend-multiply"
        />
        <span
          className={`absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
            marcada ? "bg-[var(--amber)] [color:#fff]" : "bg-white/90 text-foreground/45"
          }`}
        >
          {marcada ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-[0.8125rem] leading-snug text-foreground/85">
        {produto.name}
      </p>
      {/* Preço igual ao do card de produto (v2/ProductCardV2): valor em tinta
          normal, "no PIX" em verde. O verde é do PIX e só dele. */}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
        <span
          className="num"
          style={{ ...CORPO, fontSize: "17px", fontWeight: 700, letterSpacing: "-0.01em", color: "#333333" }}
        >
          {formatBRL(getPixPrice(produto))}
        </span>
        <span
          style={{ ...CORPO, fontSize: "11.5px", fontWeight: 600, color: "var(--buy-green)", whiteSpace: "nowrap" }}
        >
          no PIX
        </span>
      </div>
    </button>
  );
}

/* ——— resumo ——————————————————————————————————————————————————————————— */

function Resumo({
  passos,
  sel,
  totais,
  recados,
  onIr,
  onRemover,
  acao,
}: {
  passos: Slot[];
  sel: Selecao;
  totais: ReturnType<typeof totaisDoKit>;
  recados: Recado[];
  onIr: (slot: SlotId) => void;
  onRemover: (slot: SlotId, id: number) => void;
  /* As ações moram dentro do painel porque ele é a única coisa que acompanha
     a rolagem: com "Continuar" solto acima da grade, trocar de etapa exigia
     voltar ao topo depois de olhar 22 violões. */
  acao?: {
    rotulo: string;
    bloqueado: boolean;
    onAvancar: () => void;
    onPular?: () => void;
  };
}) {
  const etapasFeitas = passos.filter((s) => sel[s.id].length > 0).length;
  /* O cartão nunca passa da janela: a moldura recebe a altura do wrapper sticky
     e só a lista encolhe. Cabeçalho, total, recados e os dois botões ficam
     sempre visíveis, mesmo em tela de 800px de altura. */
  return (
    <div className="flex flex-col overflow-hidden lg:max-h-[calc(100vh-252px)]" style={CARTAO}>
      <div className="flex shrink-0 items-baseline justify-between gap-3 px-5 pt-5">
        <h2 className="text-foreground" style={{ ...DISPLAY, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em" }}>
          Seu kit
        </h2>
        <span className="text-[0.75rem] text-foreground/45" style={CORPO}>
          {etapasFeitas} de {passos.length} etapas
        </span>
      </div>

      {/* Com kit cheio + recados o painel passava da viewport e o botão saía
          da tela; a lista rola dentro do cartão e as ações ficam sempre à mão. */}
      <ul className="mt-4 min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain">
        {passos.map((s) => {
          const itens = sel[s.id];
          if (itens.length === 0)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onIr(s.id)}
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-foreground/[0.03]"
                  style={{ borderTop: "1px solid var(--edge-subtle)" }}
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-[8px]"
                    style={{ background: "var(--surface-2)" }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-foreground/50">{s.curto}</span>
                  <span className="shrink-0 text-[0.75rem] text-foreground/40">a escolher</span>
                </button>
              </li>
            );
          return itens.map((p) => {
            /* Cabo XLR e pedestal existem por causa do microfone. Listados soltos
               no meio do kit, parecem escolha independente e o cliente tira um
               dos dois sem saber que está desmontando o microfone. */
            const doMicrofone =
              (s.id === "ligar" || s.id === "segurar") &&
              sel.cantar.length > 0 &&
              /\bxlr|microfone\b/.test(p.name.toLowerCase());
            return (
            <li
              key={p.id}
              className="flex items-center gap-3 py-2.5 pr-5"
              style={{
                borderTop: doMicrofone ? undefined : "1px solid var(--edge-subtle)",
                paddingLeft: doMicrofone ? 40 : 20,
              }}
            >
              <span
                className="h-9 w-9 shrink-0 overflow-hidden rounded-[8px]"
                style={{ background: "var(--well)" }}
              >
                <ImageWithFallback
                  src={fotoLimpaDoProduto(p) ?? getPrimaryProductImage(p)}
                  alt=""
                  className="h-full w-full object-contain p-1 mix-blend-multiply"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] text-foreground/85">{p.name}</span>
                <span className="num block text-foreground/50" style={{ ...CORPO, fontSize: "12px" }}>
                  {formatBRL(getPixPrice(p))}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemover(s.id, p.id)}
                aria-label={`Tirar ${p.name} do kit`}
                className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/35 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
            );
          });
        })}
      </ul>

      {recados.length > 0 && (
        <div className="shrink-0 space-y-2 px-5 py-4" style={{ borderTop: "1px solid var(--edge-subtle)" }}>
          {recados.map((r, i) => (
            <Recadinho key={i} recado={r} onIr={onIr} />
          ))}
        </div>
      )}

      <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid var(--edge-subtle)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[0.8125rem] text-foreground/60" style={CORPO}>Kit fechado</span>
          <span
            className="num text-foreground"
            style={{ ...DISPLAY, fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {formatBRL(totais.comDesconto)}
          </span>
        </div>
        {totais.economia > 0 && (
          <p className="mt-1 text-right text-[0.75rem] text-[var(--buy-green)]" style={CORPO}>
            {Math.round(DESCONTO_KIT * 100)}% off, você economiza {formatBRL(totais.economia)}
          </p>
        )}
      </div>

      {acao && (
        <div className="shrink-0 px-5 pb-5">
          <button
            type="button"
            disabled={acao.bloqueado}
            onClick={acao.onAvancar}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-foreground text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {acao.rotulo}
            <ArrowRight className="h-4 w-4" />
          </button>
          {acao.onPular && (
            <button
              type="button"
              onClick={acao.onPular}
              className="mt-1 inline-flex h-11 w-full items-center justify-center text-[0.875rem] text-foreground/55 transition-colors hover:text-foreground"
            >
              Pular esta etapa
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Recadinho({ recado, onIr }: { recado: Recado; onIr: (slot: SlotId) => void }) {
  const erro = recado.gravidade === "erro";
  /* Mesmo padrão dos avisos do carrinho: cor da marca a 8% de fundo, borda a
     30%, texto na cor cheia. Vermelho é o do desconto (--gradient-discount),
     âmbar é o acento da marca. */
  return (
    <div
      className="rounded-[var(--radius-card-sm)] p-3 text-[0.8125rem] leading-relaxed"
      style={{
        background: erro ? "rgba(179,38,30,0.08)" : "rgba(200,120,0,0.08)",
        border: `1px solid ${erro ? "rgba(179,38,30,0.3)" : "rgba(200,120,0,0.3)"}`,
        color: erro ? "#b3261e" : "var(--amber-deep)",
      }}
    >
      <span className="flex gap-2">
        <TriangleAlert className="mt-[0.15em] h-3.5 w-3.5 shrink-0" />
        <span>
          {recado.texto}{" "}
          <button
            type="button"
            onClick={() => onIr(recado.slot)}
            className="font-semibold underline underline-offset-2"
          >
            Trocar
          </button>
        </span>
      </span>
    </div>
  );
}

/* ——— revisão ——————————————————————————————————————————————————————————— */

function Revisao({
  sel,
  passos,
  recados,
  totais,
  temErro,
  onCorrigir,
  onRemover,
  onFechar,
}: {
  sel: Selecao;
  passos: Slot[];
  recados: Recado[];
  totais: ReturnType<typeof totaisDoKit>;
  temErro: boolean;
  onCorrigir: (slot: SlotId) => void;
  onRemover: (slot: SlotId, id: number) => void;
  onFechar: () => void;
}) {
  const instrumento = sel.instrumento[0] ?? null;
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  /* O PIX incide sobre o preço já com o desconto de kit: é isso que ele paga,
     e é o número que a manchete do card mostra. */
  const pixDoKit = Math.round(totais.comDesconto * 0.9 * 100) / 100;
  const parcelas = getInstallmentCount(totais.comDesconto);
  const valorDaParcela = getInstallmentValue(totais.comDesconto);
  return (
    <div className="mt-10 gap-10 lg:grid lg:grid-cols-[1fr_320px]">
      <div>
        <p className="text-[0.875rem] text-foreground/55">O que vai na caixa</p>
        <h1
          className="mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
          style={DISPLAY}
        >
          {instrumento
            ? `Seu kit de ${LABEL_FAMILIA[familiaDoInstrumento(instrumento)]}`
            : "Seu kit"}
        </h1>

        <ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
          {passos.map((s) =>
            sel[s.id].map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-4">
                <span
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-card-sm)]"
                  style={{ background: "var(--gradient-photo)" }}
                >
                  <ImageWithFallback
                    src={fotoLimpaDoProduto(p) ?? getPrimaryProductImage(p)}
                    alt=""
                    className="h-full w-full object-contain p-2 mix-blend-multiply"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.75rem] uppercase tracking-[0.08em] text-foreground/45">
                    {s.curto}
                  </span>
                  <span className="mt-0.5 block text-[0.9375rem] leading-snug text-foreground">
                    {p.name}
                  </span>
                </span>
                <span
                  className="num shrink-0 text-right"
                  style={{ ...CORPO, fontSize: "15px", fontWeight: 700, color: "#333333" }}
                >
                  {formatBRL(p.priceNum)}
                </span>
                {/* Mesma lixeira do carrinho e do painel lateral: tirar peça é
                    sempre o mesmo gesto, em qualquer uma das três telas. */}
                <button
                  type="button"
                  onClick={() => onRemover(s.id, p.id)}
                  aria-label={`Tirar ${p.name} do kit`}
                  className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/35 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            )),
          )}
        </ul>

        <section className="mt-10">
          <h2 className="text-[1.125rem] text-foreground" style={DISPLAY}>
            O que a gente conferiu
          </h2>
          {recados.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-foreground/70">
              <Check className="h-4 w-4 text-[var(--buy-green)]" strokeWidth={3} />
              Tudo combina: as peças falam a mesma língua do seu instrumento.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {recados.map((r, i) => (
                <Recadinho key={i} recado={r} onIr={onCorrigir} />
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="mt-12 lg:mt-0">
        <div className="relative overflow-hidden p-5 lg:sticky lg:top-[228px] lg:self-start" style={CARTAO}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.875rem] text-foreground">Kit fechado</span>
            <span className="text-[0.75rem] text-foreground/50" style={CORPO}>
              {totais.itens.length} {totais.itens.length === 1 ? "peça" : "peças"}
            </span>
          </div>

          {/* Mesma hierarquia do card de compra da PDP: o preço que ele
              realmente paga no PIX é a manchete, e o resto explica. */}
          <p
            className="num mt-2 leading-none text-foreground"
            style={{ ...CORPO, fontSize: "32px", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            {formatBRL(pixDoKit)}
          </p>
          <p className="mt-1.5 text-[0.8125rem] text-foreground/60" style={CORPO}>
            no <span className="font-semibold" style={{ color: "var(--buy-green)" }}>PIX</span> com{" "}
            <span className="font-semibold" style={{ color: "var(--buy-green)" }}>10% de desconto</span>
          </p>

          <div className="my-3 h-px bg-foreground/[0.08]" />

          <p className="text-[0.8125rem] leading-relaxed text-foreground/65" style={CORPO}>
            ou <span className="font-semibold text-foreground">{formatBRL(totais.comDesconto)}</span> em até{" "}
            <span className="num font-semibold text-foreground">
              {parcelas}× {formatBRL(valorDaParcela)}
            </span>{" "}
            sem juros
          </p>
          <button
            type="button"
            onClick={() => setPagamentoAberto(true)}
            className="mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Ver opções de pagamento
            <ArrowUpRight className="h-3 w-3" />
          </button>

          <div className="my-3 h-px bg-foreground/[0.08]" />

          <dl className="space-y-1.5 text-[0.8125rem]" style={CORPO}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-foreground/55">Soma das peças</dt>
              <dd className="num text-foreground/55 line-through">{formatBRL(totais.cheio)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-foreground/70">
                Desconto de kit ({Math.round(DESCONTO_KIT * 100)}%)
              </dt>
              <dd className="num text-foreground/70">-{formatBRL(totais.economia)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-foreground/70">Desconto do PIX (10%)</dt>
              <dd className="num text-foreground/70">-{formatBRL(totais.comDesconto - pixDoKit)}</dd>
            </div>
            <div
              className="flex items-baseline justify-between gap-3 pt-1.5"
              style={{ borderTop: "1px solid var(--edge-subtle)" }}
            >
              <dt className="font-semibold text-[var(--buy-green)]">Você economiza</dt>
              <dd className="num font-semibold text-[var(--buy-green)]">
                {formatBRL(totais.cheio - pixDoKit)}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={temErro || totais.itens.length === 0}
            onClick={onFechar}
            className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] text-[16px] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--buy-green)", boxShadow: "var(--shadow-buy-cta-sm)" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Levar o kit
          </button>
          {temErro ? (
            <p className="mt-3 text-center text-[0.75rem] leading-relaxed" style={{ color: "#b3261e" }}>
              Tem peça que não serve no seu instrumento. Troque antes de fechar.
            </p>
          ) : (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.75rem] text-foreground/55" style={CORPO}>
              <Check className="h-3.5 w-3.5 text-[var(--buy-green)]" strokeWidth={3} />
              Peças em estoque, envio em 24h úteis
            </p>
          )}
        </div>
      </aside>

      <PaymentModal
        open={pagamentoAberto}
        onClose={() => setPagamentoAberto(false)}
        priceNum={totais.comDesconto}
      />
    </div>
  );
}
