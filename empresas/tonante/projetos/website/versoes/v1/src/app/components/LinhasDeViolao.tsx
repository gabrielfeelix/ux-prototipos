"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Eye, Volume2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { getPrimaryProductImage } from "./productPresentation";
import { SeloTonante } from "./section";
import { playStrum } from "../lib/strum";

// LinhasDeViolao — "Cada violão, uma experiência" (porta _ref/src/home_sections.jsx).
// Palco imersivo por linha + seletor de linhas.
type Line = { name: string; vibe: string; tone: [string, string]; desc: string };
const LINES: Line[] = [
  { name: "Coral", vibe: "Calor de roda de bar", tone: ["#b5793c", "#6e4220"], desc: "Madeira escura, som encorpado. A linha que aquece qualquer roda e pede uma canção de boteco." },
  { name: "Volcano", vibe: "Energia que erupciona", tone: ["#d2a86a", "#9a6a33"], desc: "Eletroacústico pronto para o palco. Projeção potente para quem toca para ser ouvido." },
  { name: "Etna", vibe: "Intensidade premium", tone: ["#b5793c", "#6e4220"], desc: "O topo da linha. Madeiras nobres e um som que preenche o ambiente do primeiro acorde." },
  { name: "Ônix", vibe: "Elegância na escuridão", tone: ["#3a352f", "#16130f"], desc: "Preto acetinado, atitude pura. Para quem quer presença no visual e no timbre." },
  { name: "Citrino", vibe: "Brilho jovem", tone: ["#c9a06a", "#8a5e2c"], desc: "Leve e claro, fácil de tocar. O som que combina com o primeiro show e o primeiro amor." },
  { name: "Lorenzzo", vibe: "Tradição clássica", tone: ["#c9a06a", "#8a5e2c"], desc: "Nylon atemporal. O clássico que ensinou gerações inteiras a tocar." },
];

const violoes = allProducts.filter((p) => p.category === "Violões");
const findProd = (name: string) =>
  violoes.find((p) => p.name.toLowerCase().includes(name.toLowerCase())) ?? violoes[0] ?? allProducts[0];

export function LinhasDeViolao() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const L = LINES[sel];
  const [a, b] = L.tone;
  const prod = useMemo(() => findProd(L.name), [L.name]);

  // troca de linha interrompe o estado "tocando" (o som decai sozinho)
  useEffect(() => {
    cancelRef.current?.();
    setPlaying(false);
  }, [sel]);

  const hear = () => {
    if (playing) return;
    cancelRef.current?.();
    setPlaying(true);
    cancelRef.current = playStrum(L.name, () => setPlaying(false));
  };

  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-lg)" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-7 text-center">
          <p className="label" style={{ color: "var(--amber-deep)", marginBottom: 12 }}>
            Conheça as linhas
          </p>
          <h2 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
            Cada violão, uma <span style={{ fontStyle: "italic", color: "var(--amber)" }}>experiência</span>
          </h2>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "16.5px", color: "var(--ink-soft)", maxWidth: 520, margin: "12px auto 0" }}>
            As linhas de violão da Tonante têm nome, personalidade e som próprio. Escolha a sua vibe.
          </p>
        </div>

        {/* palco */}
        <div
          data-keep-dark
          className="grain relative grid grid-cols-1 items-center overflow-hidden md:grid-cols-[1.2fr_0.8fr]"
          style={{ borderRadius: "var(--radius-card-xl)", minHeight: 440, background: `radial-gradient(120% 130% at 80% 15%, ${a}, ${b})`, color: "#fff", transition: "background .6s ease" }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.45), transparent 60%)" }} />
          <img src="/brand/tonante-symbol-white.png" alt="" aria-hidden="true" className="pointer-events-none absolute select-none" style={{ right: "4%", bottom: "-18%", width: "42%", opacity: 0.12 }} />
          {/* Selo "Rei dos Violões" — manual p.5: uso sancionado em material de violões */}
          <SeloTonante variant="rei" tone="light" rotate size={92} className="absolute right-6 top-6 z-[3] hidden lg:block" />
          <div className="relative z-[2] p-7 md:p-[clamp(34px,5vw,64px)]">
            <span className="label" style={{ color: "rgba(255,255,255,.85)" }}>
              Linha {L.name} · {L.vibe}
            </span>
            <h3 style={{ fontFamily: "var(--font-family-figtree)", fontStyle: "italic", fontWeight: 800, fontSize: "clamp(48px,8vw,100px)", lineHeight: 0.86, margin: "14px 0 0" }}>
              {L.name}
            </h3>
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "18px", color: "rgba(255,255,255,.92)", maxWidth: 420, margin: "18px 0 0", lineHeight: 1.55 }}>
              {L.desc}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/produto/${prod.id}`)}
                className="inline-flex items-center gap-2 rounded-pill cursor-pointer"
                style={{ background: "#fff", color: "var(--ink-strong)", padding: "14px 26px", fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "15.5px" }}
              >
                Conhecer a {L.name} <ArrowRight size={17} strokeWidth={2.4} style={{ color: "var(--amber-deep)" }} />
              </button>
              <button
                onClick={() => navigate(`/produto/${prod.id}`)}
                className="inline-flex items-center gap-2 rounded-pill cursor-pointer"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.3)", padding: "14px 22px", fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: "15px" }}
              >
                <Eye size={17} /> Espiar
              </button>
              <button
                onClick={hear}
                aria-pressed={playing}
                aria-label={`Ouvir o timbre da linha ${L.name}`}
                className="inline-flex items-center gap-2 rounded-pill cursor-pointer"
                style={{
                  background: playing ? "var(--amber)" : "rgba(255,255,255,.14)",
                  color: "#fff",
                  border: `1px solid ${playing ? "var(--amber)" : "rgba(255,255,255,.3)"}`,
                  padding: "14px 22px", fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: "15px",
                  transition: "background .25s ease, border-color .25s ease",
                }}
              >
                <Volume2 size={17} /> {playing ? "Tocando…" : "Ouvir"}
              </button>
            </div>
          </div>
          {/* produto */}
          <div className="relative z-[2] hidden place-items-center p-8 md:grid">
            <div className="relative overflow-hidden" style={{ width: "min(80%, 240px)", transform: "rotate(-4deg)", borderRadius: "var(--radius-card-lg)", background: "linear-gradient(160deg,#f7f7f7,#ececec)", boxShadow: "0 22px 40px -20px rgba(0,0,0,0.42)" }}>
              <div className="relative aspect-[3/4]">
                <ImageWithFallback src={getPrimaryProductImage(prod)} alt={prod.name} className="absolute inset-0 h-full w-full object-contain p-4" style={{ mixBlendMode: "multiply" }} />
              </div>
            </div>
          </div>
        </div>

        {/* seletor */}
        <div className="no-bar mt-4 flex gap-2.5 overflow-x-auto pb-1">
          {LINES.map((l, i) => {
            const on = i === sel;
            const [la, lb] = l.tone;
            const lprod = findProd(l.name);
            return (
              <button
                key={l.name}
                onClick={() => setSel(i)}
                className="flex flex-shrink-0 items-center gap-3 cursor-pointer"
                style={{
                  minWidth: 150,
                  padding: "12px 16px",
                  borderRadius: "var(--radius-card-sm)",
                  border: `1.5px solid ${on ? "var(--ink-strong)" : "var(--border)"}`,
                  background: on ? "var(--ink-strong)" : "var(--surface-1)",
                  color: on ? "var(--background)" : "var(--ink-strong)",
                  transition: "all .2s",
                }}
              >
                {/* disco da cor da linha + violão saindo por cima. Núcleo claro
                    atrás garante contraste do violão (multiply) mesmo em discos
                    escuros como Ônix. */}
                <span className="relative flex h-[46px] w-11 flex-shrink-0 items-end justify-center">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 h-[32px] w-[32px] -translate-x-1/2 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 38% 28%, ${la}, ${lb})`,
                      boxShadow: on
                        ? "0 0 0 2px var(--background), 0 4px 9px -3px rgba(0,0,0,.55)"
                        : "0 2px 6px -2px rgba(0,0,0,.32)",
                    }}
                  />
                  {/* halo claro p/ o violão ler sobre qualquer tom */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[3px] left-1/2 h-[26px] w-[26px] -translate-x-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.45) 55%, transparent 75%)" }}
                  />
                  <img
                    src={getPrimaryProductImage(lprod)}
                    alt=""
                    aria-hidden="true"
                    className="relative z-[1] h-[54px] w-auto object-contain object-bottom"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </span>
                <span className="text-left">
                  <span style={{ fontFamily: "var(--font-family-figtree)", display: "block", fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>{l.name}</span>
                  <span style={{ fontSize: "11.5px", opacity: 0.7 }}>{l.vibe}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
