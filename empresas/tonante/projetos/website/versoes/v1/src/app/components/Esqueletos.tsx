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

function Bloco({ className = "" }: { className?: string }) {
  return <div className={`tn-skel rounded-[6px] ${className}`} />;
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
