import { useCallback, useEffect, useRef } from "react";

/**
 * Scrollbar que aparece ao rolar e some sozinha.
 *
 * O elemento fica com `.scroll-fade` (polegar transparente em repouso) e ganha
 * `.is-scrolling` enquanto há rolagem. Quem anima é o CSS — aqui só entra a
 * marcação e o temporizador, porque o navegador não expõe "parou de rolar".
 *
 * Uso: `<div ref={useFadingScrollbar()} className="overflow-y-auto scroll-fade">`
 */
export function useFadingScrollbar<T extends HTMLElement = HTMLDivElement>(hideAfterMs = 700) {
  const ref = useRef<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("scroll-fade");

    const onScroll = () => {
      el.classList.add("is-scrolling");
      clear();
      timer.current = setTimeout(() => el.classList.remove("is-scrolling"), hideAfterMs);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clear();
    };
  }, [hideAfterMs, clear]);

  return ref;
}

/**
 * Trava a rolagem da página enquanto um overlay está aberto.
 *
 * Compensa a largura da barra do navegador com padding, senão o conteúdo
 * inteiro salta uns 15px no instante em que o overlay abre.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement: html } = document;
    const prev = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      padding: body.style.paddingRight,
    };
    const gap = window.innerWidth - html.clientWidth;

    /* Os dois: dependendo do layout quem rola é o <html>, e travar só o
       <body> deixa a roda do mouse continuar movendo a página atrás. */
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.padding;
    };
  }, [locked]);
}
