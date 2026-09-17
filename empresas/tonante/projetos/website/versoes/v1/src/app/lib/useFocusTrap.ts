import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Prende o foco dentro de um diálogo enquanto ele está aberto.
 *
 * Sem isso, quem navega por teclado sai do modal com Tab e continua tabulando
 * na página atrás — que está visualmente coberta —, ficando com o foco num
 * lugar que não dá para ver (WCAG 2.4.3 / 2.1.2).
 *
 * Cobre o ciclo completo:
 *  - guarda quem tinha o foco antes de abrir;
 *  - move o foco para dentro ao abrir;
 *  - circula Tab/Shift+Tab entre o primeiro e o último focáveis;
 *  - fecha no Escape;
 *  - devolve o foco ao elemento de origem ao fechar.
 *
 * Uso:
 *   const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);
 *   <div ref={ref} role="dialog" aria-modal="true" aria-label="…">
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onClose?: () => void,
) {
  const containerRef = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    // Foca o primeiro elemento útil; se não houver, o próprio container.
    const first = focusables()[0];
    if (first) {
      first.focus();
    } else {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      /* Select, dropdown e popover do Radix abrem num portal fora do container.
         Enquanto um deles está aberto ele é quem manda no teclado: sem esta
         saída, o Escape que deveria só fechar a lista fechava o modal inteiro,
         e o Tab puxava o foco de volta pra dentro do diálogo. */
      if (document.querySelector("[data-radix-popper-content-wrapper]")) return;

      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && (current === firstItem || !container.contains(current))) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && current === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [active, onClose]);

  return containerRef;
}
