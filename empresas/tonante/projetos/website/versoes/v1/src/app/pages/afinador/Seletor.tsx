import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

/* Seletor — a lista de afinações.
 *
 * Trocou o <select> nativo por um motivo de conteúdo, não de estilo: cada
 * afinação tem uma frase que diz quando usar ("só o bordão desce um tom"), e
 * <option> não aceita duas linhas. A frase dentro da lista é o que faz alguém
 * escolher "Drop D" sabendo o que está escolhendo — no nativo ela só aparecia
 * DEPOIS de escolher, o que é tarde.
 *
 * Teclado igual ao do nativo: setas andam, Home/End vão às pontas, Enter
 * confirma, Esc fecha e devolve o foco ao gatilho. */

export type Opcao = { id: string; nome: string; nota?: string };

type Props = {
  valor: string;
  opcoes: Opcao[];
  onChange: (id: string) => void;
  rotulo: string;
};

export function Seletor({ valor, opcoes, onChange, rotulo }: Props) {
  const [aberto, setAberto] = useState(false);
  const [vao, setVao] = useState<{ altura: number; acima: boolean }>({ altura: 380, acima: false });
  const [cursor, setCursor] = useState(() => Math.max(0, opcoes.findIndex((o) => o.id === valor)));
  const caixa = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const idLista = useId();
  const atual = opcoes.find((o) => o.id === valor) ?? opcoes[0];

  useEffect(() => {
    if (!aberto) return;
    setCursor(Math.max(0, opcoes.findIndex((o) => o.id === valor)));
    const foraDaCaixa = (e: PointerEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("pointerdown", foraDaCaixa);
    return () => document.removeEventListener("pointerdown", foraDaCaixa);
  }, [aberto, opcoes, valor]);

  /* Quanto cabe: a lista aberta sempre coube dentro do max-height, então nunca
   * ganhava scroll — quem cortava os últimos itens era o fim da janela. A altura
   * passa a ser o vão real entre o gatilho e a borda da viewport, e a lista vira
   * pro lado que tem mais espaço. */
  useEffect(() => {
    if (!aberto) return;
    const medir = () => {
      const r = gatilho.current?.getBoundingClientRect();
      if (!r) return;
      const RESPIRO = 16; // margem até a borda da janela
      const GAP = 8; // o mt-2 entre gatilho e lista
      const abaixo = window.innerHeight - r.bottom - GAP - RESPIRO;
      const acima = r.top - GAP - RESPIRO;
      const viraPraCima = abaixo < 240 && acima > abaixo;
      setVao({ altura: Math.max(160, Math.min(380, viraPraCima ? acima : abaixo)), acima: viraPraCima });
    };
    medir();
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", medir, true);
    return () => {
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", medir, true);
    };
  }, [aberto]);

  // o item sob o cursor precisa estar visível: lista de afinação passa de 6 itens
  useEffect(() => {
    if (!aberto) return;
    lista.current?.querySelector<HTMLElement>(`[data-i="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor, aberto]);

  const escolher = (id: string) => {
    onChange(id);
    setAberto(false);
    gatilho.current?.focus();
  };

  const teclado = (e: React.KeyboardEvent) => {
    if (!aberto) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); setAberto(true); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setAberto(false); gatilho.current?.focus(); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(opcoes[cursor].id); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(opcoes.length - 1, c + 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); return; }
    if (e.key === "Home") { e.preventDefault(); setCursor(0); return; }
    if (e.key === "End") { e.preventDefault(); setCursor(opcoes.length - 1); }
  };

  return (
    <div className="relative" ref={caixa}>
      <button
        ref={gatilho}
        type="button"
        onClick={() => setAberto((a) => !a)}
        onKeyDown={teclado}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={rotulo}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B24A]/60"
        style={{
          background: "rgba(0,0,0,0.28)",
          border: `1px solid ${aberto ? "rgba(240,178,74,0.6)" : "rgba(255,238,210,0.16)"}`,
          color: "#F2EAD9",
          fontFamily: "var(--font-family-inter)",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        <span className="truncate">{atual.nome}</span>
        <ChevronDown
          size={17}
          strokeWidth={2}
          style={{ color: "rgba(242,234,217,0.55)", transform: aberto ? "rotate(180deg)" : "none", transition: "transform .2s var(--ease)" }}
        />
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            ref={lista}
            id={idLista}
            role="listbox"
            aria-label={rotulo}
            initial={{ opacity: 0, y: vao.acima ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: vao.acima ? 6 : -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`scroll-palco absolute left-0 right-0 z-40 overflow-y-auto rounded-[12px] p-1.5 ${vao.acima ? "bottom-full mb-2" : "top-full mt-2"}`}
            style={{
              maxHeight: vao.altura,
              background: "#1C1710",
              border: "1px solid rgba(255,238,210,0.16)",
              boxShadow: "0 24px 48px -24px rgba(0,0,0,0.9)",
            }}
          >
            {opcoes.map((o, i) => {
              const escolhido = o.id === valor;
              const sob = i === cursor;
              return (
                <div
                  key={o.id}
                  data-i={i}
                  role="option"
                  aria-selected={escolhido}
                  tabIndex={-1}
                  onPointerEnter={() => setCursor(i)}
                  onClick={() => escolher(o.id)}
                  className="cursor-pointer rounded-[8px] px-3 py-2.5 transition-colors duration-100"
                  style={{ background: sob ? "rgba(240,178,74,0.14)" : "transparent" }}
                >
                  <div className="flex items-start gap-2">
                    <Check
                      size={15}
                      strokeWidth={2.6}
                      className="mt-[3px] shrink-0"
                      style={{ color: "#F0B24A", opacity: escolhido ? 1 : 0 }}
                    />
                    <div className="min-w-0">
                      <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 14.5, fontWeight: escolhido ? 700 : 500, color: "#F2EAD9" }}>
                        {o.nome}
                      </p>
                      {o.nota && (
                        <p className="mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: 12.5, lineHeight: 1.45, color: "rgba(242,234,217,0.48)" }}>
                          {o.nota}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
