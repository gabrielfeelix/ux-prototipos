"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";

const MESSAGES = [
  "Feita de Histórias desde 1954 — o Rei dos Violões",
  "Frete grátis acima de R$ 299 para todo o Brasil",
  "Até 10x sem juros em toda a loja",
  "Garantia Tonante de 2 anos em todos os instrumentos",
];

// Stage escuro Tonante — bar fica FORA do light-scope, então usa cores
// explícitas (creme/âmbar sobre ink) em vez dos tokens de texto (que são escuros).
const CREAM = "#ffffff";
const CREAM_MUTED = "rgba(255,255,255,0.62)";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty("--announce-h", dismissed ? "0px" : "40px");
  }, [dismissed]);

  useEffect(() => () => {
    document.documentElement.style.setProperty("--announce-h", "0px");
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Aviso"
      className="fixed inset-x-0 top-0 z-[60] w-full overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #131314 0%, #1f1f21 50%, #131314 100%)",
        borderBottom: "1px solid rgba(17, 17, 17, 0.08)",
      }}
    >
      {/* fio âmbar sutil nas bordas */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{ background: "linear-gradient(180deg, transparent, rgba(200,120,0,0.55), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{ background: "linear-gradient(180deg, transparent, rgba(200,120,0,0.55), transparent)" }}
      />

      <div className="relative mx-auto flex max-w-[1760px] items-center justify-between gap-3 px-5 py-[10px] md:px-8">
        <button
          onClick={() => setIdx((i) => (i - 1 + MESSAGES.length) % MESSAGES.length)}
          className="hidden transition-colors md:inline"
          aria-label="Anúncio anterior"
          style={{ color: CREAM_MUTED, fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
        >
          ‹
        </button>

        <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
          <Link
            to="/produtos"
            key={idx}
            className="line-clamp-1 text-center transition-opacity"
            style={{
              color: CREAM,
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              animation: "fadeSlide 0.45s ease",
            }}
          >
            {MESSAGES[idx]}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => (i + 1) % MESSAGES.length)}
            className="hidden transition-colors md:inline"
            aria-label="Próximo anúncio"
            style={{ color: CREAM_MUTED, fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
          >
            ›
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar aviso"
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: CREAM_MUTED }}
          >
            <X size={11} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
