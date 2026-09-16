import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SeloTonante } from "./section";

// StoryBand — faixa de herança 1954 (V3 §7.1): headline + timeline de 5 atos.
// Stage escuro quente, glow âmbar, símbolo gigante, headline serif com acento.
// Fatos do dossiê PLANO-V3 §2 — nada inventado.
const TIMELINE = [
  { year: "1954", text: "Dois irmãos portugueses abrem a Ao Rei dos Violões na Lapa, São Paulo. Violões feitos à mão." },
  { year: "Anos 60", text: "A Jovem Guarda explode e a Tonante é a guitarra que o Brasil consegue pagar. O rock entra nas garagens." },
  { year: "1974", text: "A fábrica cresce e muda para Itupeva. Cedro, ipê e o braço grosso que não empena." },
  { year: "2007", text: "A fábrica para. A memória, não: fãs e colecionadores mantêm a marca viva." },
  { year: "2021", text: "A Tonante volta com o Grupo Oderço. Feita de Histórias, desde 1954." },
];

export function StoryBand() {
  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-md)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div
          data-keep-dark
          className="grain relative overflow-hidden"
          style={{
            borderRadius: "var(--radius-card-xl)",
            background: "linear-gradient(120deg, #131314, #1f1f21)",
            color: "#ffffff",
            padding: "clamp(34px,6vw,72px)",
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{ right: "-4%", bottom: "-30%", width: 480, height: 480, background: "radial-gradient(circle, rgba(200,120,0,.30), transparent 65%)" }}
          />
          <img
            src="/brand/tonante-symbol-amber.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute hidden select-none lg:block"
            style={{ right: "6%", top: "50%", transform: "translateY(-50%)", width: 220, opacity: 0.35 }}
          />
          <SeloTonante
            variant="70"
            tone="light"
            rotate
            size={104}
            className="absolute z-[3] hidden lg:inline-block"
            style={{ right: "clamp(28px,5vw,64px)", top: "clamp(28px,5vw,56px)", opacity: 0.92 }}
          />
          <div className="relative z-[2]">
            <div style={{ maxWidth: 640 }}>
              <p className="label" style={{ color: "var(--amber)", marginBottom: 18 }}>
                Nossa história · desde 1954
              </p>
              <h2
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(30px,4.6vw,54px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", margin: 0 }}
              >
                O primeiro violão
                <br />
                <span style={{ fontStyle: "italic", color: "var(--amber)" }}>de gerações.</span>
              </h2>
              <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "17px", lineHeight: 1.65, color: "#d6d6d6", margin: "20px 0 0", maxWidth: 520 }}>
                Dois irmãos, uma oficina na Lapa e um plano: música para todos. Setenta anos
                depois, a história continua, e ela passa pelas suas mãos.
              </p>
            </div>

            {/* timeline — 5 atos (V3 §7.1), linha-corda com nós */}
            <div className="shelf-track mt-10 flex gap-0 overflow-x-auto pb-1 md:grid md:grid-cols-5" style={{ scrollbarWidth: "none" }}>
              {TIMELINE.map((t, i) => (
                <div key={t.year} className="relative min-w-[195px] flex-shrink-0 pr-6 md:min-w-0">
                  {/* corda + nó */}
                  <div className="relative flex items-center" aria-hidden="true">
                    <span className="block h-[9px] w-[9px] flex-shrink-0 rounded-full" style={{ background: "var(--amber)", boxShadow: "0 0 0 3px rgba(17, 17, 17, 0.08)" }} />
                    {i < TIMELINE.length - 1 ? (
                      <span className="block h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(200,120,0,0.55), rgba(255,255,255,0.14))" }} />
                    ) : (
                      <span className="block h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(200,120,0,0.55), transparent)" }} />
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(26px,2.4vw,34px)", fontWeight: 700, color: "var(--amber)", margin: "14px 0 0", lineHeight: 1 }}>
                    {t.year}
                  </p>
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 13.5, lineHeight: 1.5, color: "#d6d6d6", margin: "8px 0 0", maxWidth: 230 }}>
                    {t.text}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/quem-somos"
              className="mt-9 inline-flex items-center gap-2 rounded-pill cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--primary)", color: "#fff", padding: "15px 28px", fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: "16px" }}
            >
              Conheça a história completa <ArrowRight size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
