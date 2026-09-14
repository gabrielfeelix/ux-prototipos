import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Check, Facebook, Instagram, Youtube } from "lucide-react";

/* WelcomePopup — captura de e-mail da primeira visita.
   Deixou de ser modal centralizado em set/2026: agora é um cartão horizontal
   encostado no canto inferior direito, que chega deslizando da direita. Assim
   ele pede o e-mail sem tapar a página que o visitante veio ver. */

// ⚠️ PLACEHOLDER: banco de imagem até chegar a foto do elenco real (Oderço).
const FOTO = "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=720&q=80&auto=format&fit=crop";

/** Logo do X (ex-Twitter) — lucide não tem; SVG mínimo. */
function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Rabisco à mão sob o desconto. Âmbar sólido — é elemento gráfico, não fundo. */
function Rabisco() {
  return (
    <svg
      viewBox="0 0 160 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: "absolute", left: 0, right: 0, bottom: -9, width: "100%", height: 12 }}
    >
      <path
        d="M3 9.2c22-5.4 47-7.4 78-6.2 26 1 44 3.6 76 7.8"
        fill="none"
        stroke="var(--amber-deep)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WelcomePopup() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // conta páginas vistas na sessão (mobile só dispara a partir da 2ª)
  useEffect(() => {
    const n = Number(sessionStorage.getItem("tn-views") || "0") + 1;
    sessionStorage.setItem("tn-views", String(n));
  }, [location.pathname]);

  // Trigger §6.16: scroll ≥40% OU 20s (o que vier primeiro); NUNCA com cookie
  // consent aberto (espera fechar + 5s); mobile só a partir da 2ª página.
  useEffect(() => {
    if (!mounted) return;
    if (sessionStorage.getItem("pcyes-welcome")) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const views = Number(sessionStorage.getItem("tn-views") || "1");
    if (isMobile && views < 2) return;

    let done = false;
    let t20: ReturnType<typeof setTimeout> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;
    let delay: ReturnType<typeof setTimeout> | undefined;
    let onScroll: (() => void) | undefined;

    const show = () => {
      if (done) return;
      done = true;
      cleanupListeners();
      setVisible(true);
    };
    const cleanupListeners = () => {
      if (t20) clearTimeout(t20);
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
    const consentClosed = () => !!localStorage.getItem("pcyes-cookies");
    const arm = () => {
      t20 = setTimeout(show, 20000);
      onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= 0.4) show();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    if (consentClosed()) {
      arm();
    } else {
      poll = setInterval(() => {
        if (consentClosed()) {
          if (poll) clearInterval(poll);
          delay = setTimeout(arm, 5000); // espera consent fechar + 5s
        }
      }, 1000);
    }

    return () => {
      cleanupListeners();
      if (poll) clearInterval(poll);
      if (delay) clearTimeout(delay);
    };
  }, [mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    sessionStorage.setItem("pcyes-welcome", "seen");
    setTimeout(() => setVisible(false), 2500);
  };

  const dismiss = () => { sessionStorage.setItem("pcyes-welcome", "seen"); setVisible(false); };

  return (
    <AnimatePresence>
      {mounted && visible && (
        <>
          {/* Véu leve, sem blur: escurece a página o bastante pro cartão saltar,
              sem esconder o que o visitante estava lendo. Clique fora fecha. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[75]"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={dismiss}
          />

          <motion.div
            /* chega deslizando da direita, com a curva padrão do site */
            initial={{ opacity: 0, x: 48, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, y: 16, scale: 0.98 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Cadastro na newsletter"
            className="fixed z-[76] bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6"
          >
            <div
              className="relative grid w-full grid-cols-1 overflow-hidden md:w-[790px] md:grid-cols-[309px_1fr]"
              style={{
                background: "#ffffff",
                borderRadius: 20,
                boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={dismiss}
                aria-label="Fechar"
                className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-2)]"
                style={{ background: "#ffffff", border: "1px solid var(--border)", color: "var(--ink-strong)" }}
              >
                <X size={18} strokeWidth={1.9} />
              </button>

              {/* foto — some no mobile, onde o cartão vira barra no rodapé */}
              <div className="relative hidden md:block" style={{ background: "var(--surface-2)" }}>
                <img src={FOTO} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>

              <div className="flex flex-col justify-center px-7 py-8 md:px-10 md:py-9">
                {!submitted ? (
                  <>
                    <p className="label" style={{ color: "var(--amber-text)", margin: 0 }}>
                      Primeira compra?
                    </p>

                    <h3
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: "clamp(24px, 2.4vw, 31px)",
                        fontWeight: 700,
                        lineHeight: 1.12,
                        letterSpacing: "-0.015em",
                        color: "var(--ink-strong)",
                        margin: "12px 0 0",
                      }}
                    >
                      Cadastre-se e ganhe{" "}
                      <span style={{ position: "relative", whiteSpace: "nowrap" }}>
                        10% OFF
                        <Rabisco />
                      </span>{" "}
                      na primeira compra
                    </h3>

                    <form onSubmit={handleSubmit} className="relative" style={{ marginTop: 26 }}>
                      <input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Seu e-mail"
                        className="w-full transition-colors focus:outline-none"
                        style={{
                          background: "#ffffff",
                          border: "1px solid var(--edge-strong)",
                          borderRadius: 999,
                          padding: "16px 62px 16px 22px",
                          fontFamily: "var(--font-family-inter)",
                          fontSize: 14.5,
                          color: "var(--ink-strong)",
                        }}
                      />
                      <button
                        type="submit"
                        aria-label="Cadastrar"
                        /* preto, não âmbar: CTA de ação no site é sempre preto */
                        className="absolute right-[7px] top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-[scale] duration-200 hover:scale-105 active:scale-95"
                        style={{ background: "#111111", color: "#ffffff", border: "none" }}
                      >
                        <ArrowRight size={18} strokeWidth={2.2} />
                      </button>
                    </form>

                    <p
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        color: "var(--ink-soft)",
                        margin: "16px 0 0",
                      }}
                    >
                      Lançamentos, promoções e cupons antes de todo mundo. Sem spam, cancele quando quiser.
                    </p>

                    <div className="flex items-center gap-4" style={{ marginTop: 20 }}>
                      {[
                        { Icon: Facebook, label: "Facebook", href: "#" },
                        { Icon: XLogo, label: "X", href: "#" },
                        { Icon: Instagram, label: "Instagram", href: "#" },
                        { Icon: Youtube, label: "YouTube", href: "#" },
                      ].map(({ Icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="transition-opacity duration-200 hover:opacity-60"
                          style={{ color: "var(--ink-strong)" }}
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ background: "rgba(34,197,94,0.12)" }}
                    >
                      <Check size={26} className="text-green-600" strokeWidth={2.4} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-family-figtree)",
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1.12,
                        color: "var(--ink-strong)",
                        margin: "18px 0 0",
                      }}
                    >
                      Cadastro realizado!
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: 14.5,
                        lineHeight: 1.6,
                        color: "var(--ink-soft)",
                        margin: "10px 0 0",
                      }}
                    >
                      Use o cupom <strong style={{ color: "var(--amber-text)" }}>BEMVINDO</strong> na sua primeira compra.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
