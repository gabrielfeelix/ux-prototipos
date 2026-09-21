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
