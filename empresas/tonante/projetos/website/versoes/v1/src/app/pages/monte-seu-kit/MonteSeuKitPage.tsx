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

interface Caminho {
  id: string;
  titulo: string;
  texto: string;
  foto: string;
  destino: string;
  destaque?: boolean;
}

const CAMINHOS: Caminho[] = [
  {
    id: "ajuda",
    titulo: "Me ajuda a escolher",
    texto: "Quatro perguntas sobre o que você quer tocar. No fim, os instrumentos que fazem esse som.",
    foto: "/monte-seu-kit/ajuda.png",
    destino: "/monte-seu-kit/ajuda",
    destaque: true,
  },
  {
    id: "montar",
    titulo: "Quero montar meu kit",
    texto: "Você escolhe o instrumento e as peças, uma a uma. A gente avisa se algo não combina.",
    foto: "/monte-seu-kit/montar.png",
    destino: "/monte-seu-kit/montar",
  },
  {
    id: "pronto",
    titulo: "Já tá pronto, quero levar",
    texto: "Oito kits fechados, do primeiro violão ao palco. Chega, liga e toca.",
    foto: "/monte-seu-kit/pronto.png",
    destino: "/pronto-pra-tocar",
  },
];

export function MonteSeuKitPage() {
  const navigate = useNavigate();
  const [ativo, setAtivo] = useState<string | null>("ajuda");

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <header className="mx-auto max-w-[46ch] text-center">
          <h1
            className="text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] tracking-[-0.02em] text-foreground"
            style={{ fontFamily: "var(--font-family-figtree)" }}
          >
            Instrumento não se escolhe por ficha técnica.
          </h1>
          <p className="mx-auto mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-foreground/70">
            Se escolhe pelo som que você quer fazer. Diga por onde prefere
            começar e a gente chega lá junto.
          </p>
        </header>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
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
