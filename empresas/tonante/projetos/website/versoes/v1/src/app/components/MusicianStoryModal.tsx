import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { X, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MUSICIANS } from "./musiciansData";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";

/* MusicianStoryModal — o modal-palco do músico: vídeo vertical 9:16, o
   depoimento e o instrumento que ele toca. Saiu do card em set/2026 — o card
   do feed agora é só comercial (miniatura → PDP, botão → carrinho) e nada nele
   abre este modal. O componente fica exportado à espera de um gatilho próprio
   (um "ver a história" no card ou na PDP). */
export function MusicianStoryModal({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (next: number) => void }) {
  const m = MUSICIANS[index];
  const product = m.productId ? allProducts.find((p) => p.id === m.productId) : undefined;
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % MUSICIANS.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + MUSICIANS.length) % MUSICIANS.length);
      // focus-trap simples: Tab circula dentro do painel
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], video, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [index, onClose, onNav]);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`História de ${m.name}`}
      data-keep-dark
      style={{ background: "rgba(17,17,19,0.93)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[960px] flex-col overflow-y-auto md:flex-row md:items-stretch md:gap-10 md:overflow-visible"
        style={{ borderRadius: 20 }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-1 right-1 z-[5] flex h-11 w-11 items-center justify-center rounded-full md:-right-2 md:-top-2"
          style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer" }}
        >
          <X size={18} />
        </button>

        {/* vídeo vertical 9:16 (ou foto grande quando não há vídeo) */}
        <div className="mx-auto w-full max-w-[300px] flex-shrink-0 md:mx-0 md:max-w-[340px]" style={{ marginTop: 44 }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: "9 / 16", borderRadius: 16, background: "#000", maxHeight: "80vh" }}>
            {m.video ? (
              <video
                key={m.id}
                src={m.video}
                poster={m.photo}
                controls
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
                aria-label={`Vídeo de ${m.name}`}
              />
            ) : (
              <ImageWithFallback src={m.photo} alt={`${m.name} — ${m.role}`} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(1)" }} />
            )}
          </div>
        </div>

        {/* conteúdo */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-7 md:py-10">
          <p className="label" style={{ color: "var(--amber-bright)", marginBottom: 14 }}>Músico Tonante</p>
          <h3 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px,3.4vw,40px)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.01em", color: "#fff", margin: 0 }}>
            {m.name}
          </h3>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 14, color: "rgba(255,255,255,0.60)", margin: "8px 0 0" }}>
            {m.role}{m.city ? ` · ${m.city}` : ""}
          </p>

          <blockquote style={{ margin: "26px 0 0", padding: 0 }}>
            <p style={{ fontFamily: "var(--font-family-figtree)", fontStyle: "italic", fontSize: "clamp(18px,2vw,22px)", lineHeight: 1.4, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              <span aria-hidden="true" style={{ color: "var(--amber-bright)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.18em", marginRight: 6 }}>“</span>
              {m.quote}
              <span aria-hidden="true" style={{ color: "var(--amber-bright)", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.18em", marginLeft: 6 }}>”</span>
            </p>
          </blockquote>

          {/* instrumento — mini-card comercial → PDP */}
          {product && (
            <div style={{ marginTop: 30 }}>
              <p className="label" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>Toca com</p>
              <Link
                to={`/produto/${product.id}`}
                onClick={onClose}
                className="group/prod flex items-center gap-4 transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 10, textDecoration: "none", maxWidth: 420 }}
              >
                <span className="relative block flex-shrink-0 overflow-hidden" style={{ width: 72, height: 72, borderRadius: 10, background: "var(--well)" }}>
                  <ImageWithFallback src={getPrimaryProductImage(product)} alt="" className="absolute inset-0 h-full w-full object-contain p-1.5" style={{ mixBlendMode: "multiply" }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate" style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: 14.5, color: "#fff" }}>{product.name}</span>
                  <span className="num block" style={{ fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: 16, color: "var(--amber-bright)", marginTop: 3 }}>{product.price}</span>
                </span>
                <ChevronRight size={18} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between" style={{ marginTop: 30 }}>
            {m.instagram ? (
              <a
                href={`https://instagram.com/${m.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-pill"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "8px 16px", color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-family-inter)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              >
                <Instagram size={14} /> {m.instagram}
              </a>
            ) : <span />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNav((index - 1 + MUSICIANS.length) % MUSICIANS.length)}
                aria-label="Músico anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => onNav((index + 1) % MUSICIANS.length)}
                aria-label="Próximo músico"
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
