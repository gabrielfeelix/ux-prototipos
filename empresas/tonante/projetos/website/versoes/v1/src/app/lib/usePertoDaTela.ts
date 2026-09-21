import { useEffect, useRef, useState } from "react";

/**
 * Avisa quando um elemento chega perto da dobra, e nunca mais desavisa.
 *
 * Existe porque trabalho caro amarrado ao `mount` custa o catálogo inteiro de
 * uma vez. Na home são seis vitrines de oito cards: o que só é visto depois de
 * rolar não pode competir por banda com o que está na primeira tela.
 *
 * A margem de 400px é o adiantamento: o trabalho começa antes de o elemento
 * aparecer, então em rolagem normal ele já está pronto quando chega. Uma vez
 * ligado, fica ligado — desligar de volta faria a foto sumir ao rolar pra
 * longe e recarregar ao voltar.
 *
 * Sem IntersectionObserver (navegador antigo, teste em jsdom) o estado nasce
 * ligado: melhor carregar demais do que não carregar.
 */
export function usePertoDaTela<T extends Element>(margem = "400px") {
  const ref = useRef<T | null>(null);
  const [perto, setPerto] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (perto) return;
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setPerto(true);
          obs.disconnect();
        }
      },
      { rootMargin: margem },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [perto, margem]);

  return [ref, perto] as const;
}
