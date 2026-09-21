/* Esqueletos — o que ocupa o lugar de algo que ainda está vindo.
 *
 * São peças de layout, não de conteúdo: repetem a caixa, não o texto. Por
 * isso servem em qualquer página, e o mesmo <EsqueletoVitrine> vale pra home,
 * pro catálogo e pra busca.
 *
 * Quando NÃO usar: se o dado é local e síncrono, o esqueleto renderiza por
 * zero milissegundo e tudo o que ele faz é piscar. Na loja o que espera é
 * imagem (remota) e código de rota (chunk), nunca o catálogo, que vem junto
 * com o bundle. A regra prática é: só entra esqueleto onde existe uma espera
 * de verdade, medida.
 *
 * A pintura fica na classe `.tn-skel` (styles/theme.css), que também respeita
 * prefers-reduced-motion. */

function Bloco({ className = "", escuro = false }: { className?: string; escuro?: boolean }) {
  return <div className={`tn-skel${escuro ? " tn-skel-escuro" : ""} rounded-[6px] ${className}`} />;
}

/** Card de produto: foto quadrada, duas linhas de nome, preço. */
export function EsqueletoCard() {
  return (
    <div className="flex flex-col">
      <Bloco className="aspect-square w-full rounded-[10px]" />
      <Bloco className="mt-3.5 h-4 w-3/4" />
      <Bloco className="mt-2 h-4 w-1/2" />
      <Bloco className="mt-3 h-6 w-2/5" />
    </div>
  );
}

/** Uma fileira de cards, do tamanho das vitrines da home. */
export function EsqueletoVitrine({ cards = 4 }: { cards?: number }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <Bloco className="h-7 w-56" />
      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {Array.from({ length: cards }, (_, i) => (
          <EsqueletoCard key={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * Fallback de rota: o que aparece enquanto o código da página é baixado.
 *
 * Desenha o formato comum a quase toda página da loja — faixa de título e
 * um corpo — em vez de uma página em branco ou de um spinner centralizado.
 * O spinner diz "espere"; o esqueleto diz "é aqui que vai ficar", e é o que
 * faz a navegação parecer instantânea mesmo quando não é.
 */
export function EsqueletoPagina() {
  return (
    <main className="min-h-[70vh] bg-white" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando a página</span>
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Bloco className="h-9 w-2/5 max-w-[420px]" />
        <Bloco className="mt-4 h-4 w-3/5 max-w-[620px]" />
        <Bloco className="mt-2.5 h-4 w-2/5 max-w-[420px]" />
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <EsqueletoCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

/**
 * Fallback da página de produto.
 *
 * A PDP não tem grade nenhuma: abre com uma foto quadrada grande, uma coluna
 * de thumbs à esquerda dela a partir de `md`, a ficha ao lado e um card de
 * compra de 360px na direita a partir de `lg`. O esqueleto genérico desenhava
 * oito cards, então quem abria um produto via uma vitrine piscando e depois
 * um layout que não tinha nada a ver. As medidas aqui são as mesmas do
 * ProductPage (`lg:grid-cols-[minmax(0,1fr)_360px]`, galeria `lg:w-[56%]`,
 * thumb de 68px) de propósito: se lá mudar, aqui tem que mudar junto.
 *
 * No celular o card de compra não existe como coluna — o fluxo empilha foto,
 * ficha e preço —, então a coluna da direita fica escondida abaixo de `lg` e
 * o bloco de preço entra embaixo da ficha.
 */
export function EsqueletoPDP() {
  return (
    <main className="min-h-[70vh] bg-white" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando o produto</span>

      {/* breadcrumb */}
      <div className="px-5 md:px-8 pt-5">
        <Bloco className="h-3 w-2/3 max-w-[420px]" />
      </div>

      <div className="px-5 md:px-8 pt-6 pb-24">
        <div className="mx-auto grid max-w-[1760px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
          <div className="min-w-0">
            <div className="flex flex-col items-start gap-6 lg:flex-row xl:gap-8">
              {/* galeria: thumbs + foto quadrada */}
              <div className="w-full flex-shrink-0 lg:w-[56%] xl:w-[58%]">
                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-4">
                  <div className="hidden md:flex md:flex-col md:gap-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Bloco key={i} className="h-[68px] w-[68px] rounded-[10px] xl:h-[78px] xl:w-[78px]" />
                    ))}
                  </div>
                  <Bloco className="aspect-square w-full rounded-[12px] md:flex-1" />
                </div>
              </div>

              {/* ficha */}
              <div className="w-full min-w-0">
                <Bloco className="h-3 w-24" />
                <Bloco className="mt-4 h-7 w-11/12" />
                <Bloco className="mt-2.5 h-7 w-3/5" />
                <Bloco className="mt-5 h-4 w-40" />
                <div className="mt-8 space-y-3">
                  <Bloco className="h-4 w-full" />
                  <Bloco className="h-4 w-11/12" />
                  <Bloco className="h-4 w-4/5" />
                </div>
              </div>
            </div>
          </div>

          {/* card de compra: coluna própria no desktop, empilhado no celular */}
          <div className="w-full">
            <Bloco className="h-9 w-2/5 max-w-[200px]" />
            <Bloco className="mt-3 h-4 w-3/5 max-w-[260px]" />
            <Bloco className="mt-6 h-12 w-full rounded-pill" />
            <Bloco className="mt-3 h-12 w-full rounded-pill" />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Carrinho, checkout, perfil e afinador ───────────────────────────────
 *
 * As quatro caíam no esqueleto genérico, que desenha uma grade de oito cards
 * de produto. Nenhuma das quatro tem grade de produto. Cada uma ganha aqui a
 * sua forma, com as medidas copiadas da página real — quando a página mudar
 * de largura de coluna, o esqueleto tem que mudar junto ou volta a mentir. */

/** Bloco de resumo do pedido: mesma coluna de 380px do carrinho e do checkout. */
function EsqueletoResumo() {
  return (
    <div className="w-full rounded-[16px] border border-black/5 p-6">
      <Bloco className="h-3 w-32" />
      <Bloco className="mt-6 h-11 w-full rounded-[10px]" />
      <Bloco className="mt-3 h-11 w-full rounded-[10px]" />
      <Bloco className="mt-6 h-px w-full" />
      <div className="mt-6 space-y-3">
        <Bloco className="h-3.5 w-full" />
        <Bloco className="h-3.5 w-4/5" />
        <Bloco className="h-3.5 w-3/5" />
      </div>
      <Bloco className="mt-6 h-16 w-full rounded-[12px]" />
      <Bloco className="mt-4 h-12 w-full rounded-pill" />
    </div>
  );
}

/**
 * Fallback do carrinho.
 *
 * Duas colunas a partir de `lg` (lista de itens + resumo de 380px), uma só no
 * celular, com o resumo embaixo. Cada item é uma faixa larga com a foto
 * quadrada à esquerda — nada a ver com a grade de cards do catálogo.
 */
export function EsqueletoCarrinho() {
  return (
    <main className="min-h-[70vh] bg-white pt-6 md:pt-[88px]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando o carrinho</span>
      <div className="mx-auto w-full max-w-[1320px] px-5 py-8 pb-24 md:px-8 md:py-10 lg:pb-10">
        <Bloco className="h-3.5 w-48" />
        <div className="mb-8 mt-6 flex items-center justify-between">
          <Bloco className="h-7 w-56" />
          <Bloco className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-4 rounded-[16px] border border-black/5 p-4 md:gap-5 md:p-5">
                <Bloco className="h-[100px] w-[100px] flex-shrink-0 rounded-[10px] md:h-[120px] md:w-[120px]" />
                <div className="min-w-0 flex-1">
                  <Bloco className="h-4 w-4/5" />
                  <Bloco className="mt-2.5 h-4 w-2/5" />
                  <Bloco className="mt-6 h-9 w-32 rounded-pill" />
                </div>
              </div>
            ))}
          </div>
          <EsqueletoResumo />
        </div>
      </div>
    </main>
  );
}

/**
 * Fallback do checkout.
 *
 * O que identifica a página é a trilha de quatro etapas no topo; embaixo, o
 * card do formulário da etapa ativa e o mesmo resumo de 380px do carrinho.
 */
export function EsqueletoCheckout() {
  return (
    <main className="min-h-[70vh] bg-white pt-0 md:pt-[88px]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando o checkout</span>
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-8 pt-3 md:px-8 md:py-6">
        <Bloco className="h-3.5 w-44" />
        <Bloco className="mt-6 h-3 w-24" />
        <Bloco className="mt-3 h-8 w-72 max-w-full" />

        {/* trilha das quatro etapas: bolinha de 32px e o fio entre elas */}
        <div className="mb-8 mt-6 flex items-center gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex min-w-0 flex-1 items-center gap-3">
              <Bloco className="h-8 w-8 flex-shrink-0 rounded-full" />
              <Bloco className="hidden h-3.5 w-20 md:block" />
              {i < 3 && <Bloco className="h-px min-w-[16px] flex-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div className="rounded-[16px] border border-black/5 p-6 md:p-8">
            <Bloco className="h-6 w-60 max-w-full" />
            <Bloco className="mt-3 h-3.5 w-80 max-w-full" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={i === 0 ? "sm:col-span-2" : undefined}>
                  <Bloco className="h-3 w-24" />
                  <Bloco className="mt-2 h-11 w-full rounded-[10px]" />
                </div>
              ))}
            </div>
            <Bloco className="mt-8 h-12 w-full rounded-pill sm:w-52" />
          </div>
          <EsqueletoResumo />
        </div>
      </div>
    </main>
  );
}

/**
 * Fallback do perfil.
 *
 * Faixa de cabeçalho com avatar redondo e as três estatísticas, depois
 * sidebar de 292px (que no celular vira fita de abas) e, no conteúdo, o card
 * grande do pedido em rota sobre quatro cards menores.
 */
export function EsqueletoPerfil() {
  return (
    <main className="min-h-[70vh] bg-white" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando o perfil</span>

      <div className="px-5 pb-8 pt-9 md:px-8" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto flex max-w-[1520px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Bloco className="h-[78px] w-[78px] flex-shrink-0 rounded-full" />
            <div>
              <Bloco className="h-6 w-48" />
              <Bloco className="mt-2.5 h-3.5 w-36" />
              <Bloco className="mt-2 h-3.5 w-56 max-w-full" />
            </div>
          </div>
          <div className="flex gap-8">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i}>
                <Bloco className="h-6 w-10" />
                <Bloco className="mt-2 h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1520px] flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row">
        {/* celular: fita de abas rolável. desktop: card de navegação. */}
        <div className="flex gap-2 overflow-hidden lg:hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <Bloco key={i} className="h-[60px] w-[72px] flex-shrink-0 rounded-[12px]" />
          ))}
        </div>
        <div className="hidden w-[292px] flex-shrink-0 rounded-[16px] border border-black/5 p-5 lg:block">
          <Bloco className="h-4 w-32" />
          <div className="mt-6 space-y-2.5">
            {Array.from({ length: 9 }, (_, i) => (
              <Bloco key={i} className="h-10 w-full rounded-pill" />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <Bloco className="h-7 w-44" />
          <div className="mt-6 rounded-[16px] border border-black/5 p-6 sm:p-7">
            <Bloco className="h-6 w-2/3 max-w-[420px]" />
            <div className="mt-6 flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Bloco key={i} className="h-[5px] flex-1 rounded-pill" />
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Bloco key={i} className="h-14 w-14 rounded-[10px]" />
              ))}
            </div>
            <Bloco className="mt-6 h-11 w-44 rounded-pill" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-[16px] border border-black/5 p-5">
                <Bloco className="h-3.5 w-32" />
                <div className="mt-4 flex gap-2">
                  {Array.from({ length: 4 }, (_, j) => (
                    <Bloco key={j} className="h-12 w-12 rounded-[8px]" />
                  ))}
                </div>
                <Bloco className="mt-4 h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Fallback do afinador.
 *
 * Única página de palco escuro do site: um esqueleto claro aqui daria um
 * flash branco antes de a página pintar o fundo `#141210`, então o fundo vem
 * junto e os blocos usam a variante escura.
 *
 * A peça dominante é o desenho da cabeça do instrumento, um SVG retrato de
 * 420x760 (~0,55:1). No celular o console de controles vem antes dele.
 */
export function EsqueletoAfinador() {
  return (
    <main className="min-h-screen" aria-busy="true" aria-live="polite" style={{ background: "#141210" }}>
      <span className="sr-only">Carregando o afinador</span>
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-24 pt-14 md:px-12 md:pb-28 md:pt-20">
        <div className="flex flex-col items-center">
          <Bloco escuro className="h-3 w-24" />
          <Bloco escuro className="mt-4 h-9 w-72 max-w-full" />
          <Bloco escuro className="mt-4 h-3.5 w-[520px] max-w-full" />
        </div>

        <div className="mt-10 flex gap-2.5 overflow-hidden lg:justify-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Bloco escuro key={i} className="h-10 w-28 flex-shrink-0 rounded-pill" />
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_374px] lg:items-start lg:gap-16">
          {/* console: acima do instrumento no celular, ao lado dele no desktop */}
          <div className="order-1 w-full rounded-[16px] border border-white/5 p-6 lg:order-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={i ? "mt-5" : undefined}>
                <Bloco escuro className="h-3 w-24" />
                <Bloco escuro className="mt-2.5 h-11 w-full rounded-[10px]" />
              </div>
            ))}
            <Bloco escuro className="mt-7 h-12 w-full rounded-pill" />
            <Bloco escuro className="mt-3 h-12 w-full rounded-pill" />
          </div>

          <div className="order-2 flex justify-center lg:order-1">
            <Bloco escuro className="aspect-[420/760] w-full max-w-[420px] rounded-[20px]" />
          </div>
        </div>
      </div>
    </main>
  );
}
