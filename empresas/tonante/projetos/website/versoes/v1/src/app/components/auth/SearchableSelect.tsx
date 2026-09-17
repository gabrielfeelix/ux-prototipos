import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { captionStyle, inputStyle } from "./styles";

export interface SelectOption {
  value: string;
  label: string;
  /** Texto secundário, ex.: o código do CNAE. */
  hint?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  searchPlaceholder?: string;
  ariaLabel: string;
  /** Abaixo disso a busca não aparece: filtrar 7 itens curtos custa mais
   *  tempo que ler os 7, e o campo ainda rouba 40px de altura. */
  searchThreshold?: number;
}

/* Escrito à mão em vez de um select de biblioteca: aquele renderiza num portal
   e sumia atrás do modal, virava pra cima quando faltava espaço e pintava o
   item ativo com uma cor que não existe em nenhum outro lugar do fluxo. Este
   abre dentro do próprio modal — sem portal não há z-index pra brigar. */
export function SearchableSelect({
  value, onChange, options, placeholder, searchPlaceholder = "Pesquisar…", ariaLabel, searchThreshold = 8,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const showSearch = options.length >= searchThreshold;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => `${o.label} ${o.hint ?? ""}`.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => { setHighlight(0); }, [query, open]);

  useEffect(() => {
    if (!open) return;
    if (showSearch) searchRef.current?.focus();

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, showSearch]);

  const choose = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      /* Sem isto o Escape sobe até o focus trap do modal e fecha o modal
         inteiro, em vez de só a lista. */
      e.stopPropagation();
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlight((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + filtered.length) % Math.max(filtered.length, 1);
      });
      return;
    }
    if (e.key === "Enter" && open) {
      e.preventDefault();
      const option = filtered[highlight];
      if (option) choose(option);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button" role="combobox" aria-expanded={open} aria-controls={listId} aria-label={ariaLabel}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-2 border py-3.5 pl-4 pr-3 text-left transition-colors duration-200"
        style={{ ...inputStyle, borderColor: open ? "rgba(17,17,17,0.30)" : "var(--edge)", background: open ? "#ffffff" : "var(--surface-2)" }}
      >
        {/* Campo preenchido tem que parecer preenchido: é assim que o telefone
            e o e-mail ao lado se comportam. */}
        <span className="flex-1 truncate" style={{ color: selected ? "var(--ink-strong)" : "var(--ink-subtle)" }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={15} aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--ink-subtle)" }} />
      </button>

      <AnimatePresence initial={false}>
        {/* Flutua sobre os campos de baixo em vez de empurrá-los: expandindo
            embutido, abrir a lista esticava o modal e o botão de continuar
            saía da tela. */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-1.5"
          >
            <div className="overflow-hidden border"
              style={{ borderRadius: "var(--radius-card-md)", borderColor: "var(--edge)", background: "#ffffff", boxShadow: "var(--shadow-float)" }}>
              {showSearch && (
                <div className="relative border-b" style={{ borderColor: "var(--edge-subtle)" }}>
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-subtle)" }} aria-hidden="true" />
                  <input
                    ref={searchRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder} aria-label={`Pesquisar em ${ariaLabel}`}
                    className="w-full bg-transparent py-2.5 pl-9 pr-3 focus:outline-none"
                    style={{ ...captionStyle, color: "var(--ink-strong)" }}
                  />
                </div>
              )}

              {/* Teto de 150px: ~3 itens visíveis, com o quarto cortado no meio
                  pra deixar claro que rola. */}
              <ul id={listId} role="listbox" aria-label={ariaLabel} className="max-h-[150px] overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <li className="px-4 py-3" style={{ ...captionStyle, color: "var(--ink-subtle)" }}>Nada encontrado.</li>
                )}
                {filtered.map((option, i) => {
                  const active = option.value === value;
                  return (
                    <li key={option.value} role="option" aria-selected={active}>
                      <button type="button" onClick={() => choose(option)} onMouseEnter={() => setHighlight(i)}
                        className="flex w-full cursor-pointer items-start gap-2 px-4 py-2.5 text-left transition-colors duration-150"
                        style={{ background: i === highlight ? "var(--surface-2)" : "transparent" }}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block" style={{ ...captionStyle, color: active ? "var(--ink-strong)" : "var(--ink-muted)", fontWeight: active ? 600 : 400 }}>
                            {option.label}
                          </span>
                          {option.hint && (
                            <span className="block pt-0.5" style={{ ...captionStyle, fontSize: "12px", color: "var(--ink-subtle)" }}>{option.hint}</span>
                          )}
                        </span>
                        {active && <Check size={14} className="mt-px shrink-0" style={{ color: "var(--amber-text)" }} aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
