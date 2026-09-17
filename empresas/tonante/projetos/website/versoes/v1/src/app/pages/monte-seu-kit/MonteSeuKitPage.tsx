/* Tela de entrada do Monte seu kit — três caminhos.
 *
 * Molde: WelcomeScreen do PCYES v3 (MonteSeuPcPage.tsx:3651). Mesma ideia de
 * três portas, arte diferente: lá são ilustrações SVG "blueprint", aqui é
 * fotografia de estúdio, porque instrumento se vende pelo objeto.
 *
 * O terceiro caminho NÃO abre tela própria — navega pra listagem de kits. É o
 * que o v3 fez quando migrou "builds prontas" pro catálogo: uma vitrine de
 * produto que já existe ganha busca, filtro e comparador de graça. */

import { useNavigate } from "react-router";
import { useState } from "react";
import { EqualizerWave } from "../../components/section/EqualizerWave";

interface Caminho {
  id: string;
  titulo: string;
  texto: string;
  foto: string;
  destino: string;
  destaque?: boolean;
}

/* Os três rótulos precisam dizer O QUE VOLTA, não o que o cliente sente. Os
   primeiros diziam "me ajuda a escolher" e "quero montar meu kit": os dois
   soam a mesma coisa, e nenhum avisa que um devolve um instrumento e os outros
   dois devolvem um kit. */
const CAMINHOS: Caminho[] = [
  {
    id: "ajuda",
    titulo: "Achar meu instrumento",
    texto:
      "Quatro perguntas sobre o que você quer tocar. No fim, os instrumentos que fazem esse som — só o instrumento.",
    foto: "/monte-seu-kit/ajuda.png",
    destino: "/monte-seu-kit/ajuda",
    destaque: true,
  },
  {
    id: "montar",
    titulo: "Montar um kit peça por peça",
    texto:
      "Você escolhe o instrumento e o que vai junto: cabo, correia, afinador, suporte. A gente avisa se alguma peça não combina.",
    foto: "/monte-seu-kit/montar.png",
    destino: "/monte-seu-kit/montar",
  },
  {
    id: "pronto",
    titulo: "Levar um kit já montado",
    texto:
      "Kits fechados, do primeiro violão ao palco, com preço único. Chega, liga e toca.",
    foto: "/monte-seu-kit/pronto.png",
    destino: "/pronto-pra-tocar",
  },
];

export function MonteSeuKitPage() {
  const navigate = useNavigate();
  const [ativo, setAtivo] = useState<string | null>("ajuda");

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-9 sm:px-6 lg:px-8 lg:pt-12">
        {/* A medida vai em px, não em ch: `ch` no <header> usa a fonte do CORPO,
            não a do display, e 46ch dava uns 370px — o título quebrava em duas
            palavras por linha e virava poema. */}
        <header className="mx-auto max-w-[920px] text-center">
          <h1
            className="text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.04] tracking-[-0.022em] text-foreground"
            style={{ fontFamily: "var(--font-family-figtree)" }}
          >
            Por onde você quer começar?
          </h1>
          {/* A onda entra no lugar da linha de apoio: ela já diz "som" sem
              precisar escrever, e escolher pelo som é o assunto da página. */}
          <EqualizerWave bars={56} height={26} className="mt-8" />
        </header>

        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {CAMINHOS.map((c) => (
            <CaminhoCard
              key={c.id}
              caminho={c}
              ativo={ativo === c.id}
              onEnter={() => setAtivo(c.id)}
              onLeave={() => setAtivo(null)}
              onPick={() => navigate(c.destino)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function CaminhoCard({
  caminho,
  ativo,
  onEnter,
  onLeave,
  onPick,
}: {
  caminho: Caminho;
  ativo: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-ativo={ativo ? "" : undefined}
      className="group block w-full cursor-pointer text-left focus:outline-none"
    >
      {/* A foto é o card. Sem caixa, sem borda, sem sombra: o recorte do
          estúdio já é a moldura, e um retângulo em volta dele só rouba luz. */}
      <div className="relative overflow-hidden rounded-[var(--radius-card-lg)] bg-[#FAF8F5]">
        <img
          src={caminho.foto}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {caminho.destaque && (
          <span className="absolute left-4 top-4 rounded-[var(--radius-pill)] bg-white/90 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-amber-text backdrop-blur-sm">
            Mais escolhido
          </span>
        )}
      </div>

      {/* O filete é o único elemento que se move sozinho: cresce sob o card em
          foco e some nos outros. Um sinal, não três animações concorrendo. */}
      <span
        aria-hidden
        className="mt-6 block h-px w-full origin-left bg-foreground/15 transition-transform duration-500 ease-out group-hover:scale-y-[3] group-hover:bg-[var(--amber)] group-focus-visible:scale-y-[3] group-focus-visible:bg-[var(--amber)] motion-reduce:transition-none"
      />

      <h2
        className="mt-5 text-[1.5rem] leading-tight tracking-[-0.01em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        {caminho.titulo}
      </h2>
      <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-foreground/65">
        {caminho.texto}
      </p>
    </button>
  );
}
