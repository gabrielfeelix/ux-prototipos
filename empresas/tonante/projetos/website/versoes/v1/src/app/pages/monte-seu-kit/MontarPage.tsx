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
  Check,
  Plus,
  Search,
  ShoppingBag,
  TriangleAlert,
  X,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useCart } from "../../components/CartContext";
import { Footer } from "../../components/Footer";
import { type Product } from "../../components/productsData";
import { getPrimaryProductImage } from "../../components/productPresentation";
import { formatBRL, getPixPrice } from "../../components/productEnhancements";
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
  borderRadius: "var(--radius-card-lg)",
  background:
    "linear-gradient(135deg, rgba(var(--foreground-rgb), 0.06) 0%, rgba(var(--foreground-rgb), 0.02) 100%)",
  border: "1px solid rgba(var(--foreground-rgb), 0.08)",
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
  const passos = useMemo(() => slotsVisiveis(instrumento), [instrumento]);
  const passo = passos[Math.min(indice, passos.length - 1)];
  const recados = useMemo(() => checarKit(sel, revisando), [sel, revisando]);
  const totais = useMemo(() => totaisDoKit(sel), [sel]);
  const temErro = recados.some((r) => r.gravidade === "erro");

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
            <span className="text-[0.8125rem] text-foreground/50">
              {revisando ? "Revisão" : `${indice + 1} de ${passos.length}`}
            </span>
          </div>

          <Trilha passos={passos} indice={revisando ? passos.length : indice} sel={sel} onIr={irPara} />

          {/* Avançar mora aqui em cima, ao lado da trilha. Só no rodapé da
              grade obrigava a rolar por 22 violões pra trocar de etapa. */}
          {!revisando && (
            <div className="mt-5 hidden items-center justify-end gap-4 lg:flex">
              {!passo.obrigatorio && (
                <button
                  type="button"
                  onClick={avancar}
                  className="text-[0.875rem] text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Pular esta etapa
                </button>
              )}
              <button
                type="button"
                disabled={passo.obrigatorio && sel[passo.id].length === 0}
                onClick={avancar}
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-foreground px-7 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {indice >= passos.length - 1 ? "Revisar o kit" : "Continuar"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {revisando ? (
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

                {passo.id === "instrumento" && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    <Pilula ativo={familia === null} onClick={() => setFamilia(null)}>
                      Tudo
                    </Pilula>
                    {FAMILIAS_OFERECIDAS.map((f) => (
                      <Pilula key={f.id} ativo={familia === f.id} onClick={() => setFamilia(f.id)}>
                        {f.label}
                      </Pilula>
                    ))}
                  </div>
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

                <div className="mt-10 hidden items-center gap-4 lg:flex">
                  <button
                    type="button"
                    disabled={passo.obrigatorio && sel[passo.id].length === 0}
                    onClick={avancar}
                    className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-pill)] bg-foreground px-8 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {indice >= passos.length - 1 ? "Revisar o kit" : "Continuar"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  {!passo.obrigatorio && (
                    <button
                      type="button"
                      onClick={avancar}
                      className="text-[0.9375rem] text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      Pular esta etapa
                    </button>
                  )}
                </div>
              </div>

              <aside className="mt-12 lg:mt-0">
                {/* 180px = barra de avisos + header + menu de categorias. Com
                    top-24 o resumo sumia atrás do header ao rolar. */}
                <div className="lg:sticky lg:top-[180px] lg:self-start">
                  <Resumo
                    passos={passos}
                    sel={sel}
                    totais={totais}
                    recados={recados}
                    onIr={corrigir}
                    onRemover={remover}
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
          src={getPrimaryProductImage(produto)}
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
          normal, "à vista no PIX" em verde. O verde é do PIX e só dele. */}
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
          à vista no PIX
        </span>
      </div>
    </button>
  );
}

function Pilula({
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
      aria-pressed={ativo}
      className={`h-9 rounded-[var(--radius-pill)] border px-4 text-[0.875rem] transition-colors ${
        ativo
          ? "border-foreground bg-foreground [color:#fff]"
          : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
      }`}
    >
      {children}
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
}: {
  passos: Slot[];
  sel: Selecao;
  totais: ReturnType<typeof totaisDoKit>;
  recados: Recado[];
  onIr: (slot: SlotId) => void;
  onRemover: (slot: SlotId, id: number) => void;
}) {
  return (
    <div className="relative overflow-hidden p-5" style={CARTAO}>
      <p className="mb-4 text-primary" style={CAPTION}>
        // O QUE JÁ ENTROU
      </p>

      <ul className="space-y-3">
        {passos.map((s) => {
          const itens = sel[s.id];
          if (itens.length === 0)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onIr(s.id)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-card-sm)] border border-dashed border-foreground/20 px-3 py-2.5 text-left text-[0.8125rem] text-foreground/45 transition-colors hover:border-foreground/40 hover:text-foreground/70"
                >
                  <span className="h-8 w-8 shrink-0 rounded-[6px] border border-dashed border-foreground/20" />
                  {s.curto} — vazio
                </button>
              </li>
            );
          return itens.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 overflow-hidden rounded-[6px]"
                style={{ background: "var(--gradient-photo)" }}
              >
                <ImageWithFallback
                  src={getPrimaryProductImage(p)}
                  alt=""
                  className="h-full w-full object-contain p-1 mix-blend-multiply"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] text-foreground/85">{p.name}</span>
                <span className="num block text-foreground/55" style={{ ...CORPO, fontSize: "12px" }}>
                  {formatBRL(getPixPrice(p))}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemover(s.id, p.id)}
                aria-label={`Tirar ${p.name} do kit`}
                className="shrink-0 text-foreground/35 transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ));
        })}
      </ul>

      {recados.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-foreground/10 pt-4">
          {recados.map((r, i) => (
            <Recadinho key={i} recado={r} onIr={onIr} />
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-foreground/10 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[0.8125rem] text-foreground/60">Kit fechado</span>
          <span
            className="num"
            style={{ ...CORPO, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", color: "#333333" }}
          >
            {formatBRL(totais.comDesconto)}
          </span>
        </div>
        {totais.economia > 0 && (
          <p className="mt-1 text-right text-[0.75rem] text-[var(--buy-green)]">
            {Math.round(DESCONTO_KIT * 100)}% off — você economiza {formatBRL(totais.economia)}
          </p>
        )}
      </div>
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
                    src={getPrimaryProductImage(p)}
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
                <span className="shrink-0 text-right">
                  <span
                    className="num block"
                    style={{ ...CORPO, fontSize: "15px", fontWeight: 700, color: "#333333" }}
                  >
                    {formatBRL(getPixPrice(p))}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemover(s.id, p.id)}
                    className="mt-1 text-[0.75rem] text-foreground/45 underline-offset-2 hover:text-foreground hover:underline"
                  >
                    tirar
                  </button>
                </span>
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
        <div className="relative overflow-hidden p-5 lg:sticky lg:top-[180px] lg:self-start" style={CARTAO}>
          <div className="flex items-baseline justify-between">
            <span className="text-[0.8125rem] text-foreground/60">Soma das peças</span>
            <span className="num text-foreground/55 line-through" style={{ ...CORPO, fontSize: "13px" }}>
              {formatBRL(totais.cheio)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[0.875rem] text-foreground">Kit fechado</span>
            <span
              className="num"
              style={{ ...CORPO, fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", color: "#333333" }}
            >
              {formatBRL(totais.comDesconto)}
            </span>
          </div>
          <p className="mt-1 text-right text-[0.75rem] text-[var(--buy-green)]">
            {Math.round(DESCONTO_KIT * 100)}% off montando junto
          </p>

          <button
            type="button"
            disabled={temErro || totais.itens.length === 0}
            onClick={onFechar}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--buy-green)", boxShadow: "var(--shadow-buy-cta-sm)" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Levar o kit
          </button>
          {temErro && (
            <p className="mt-3 text-center text-[0.75rem] leading-relaxed" style={{ color: "#b3261e" }}>
              Tem peça que não serve no seu instrumento. Troque antes de fechar.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
