"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getCatalogHref } from "./productPresentation";

// Hero — carrossel de banners (artes full-bleed dos designers em /assets).
// Um banner por vez com crossfade + setas + dots + pause.
type Slide = { img: string; href: string; alt: string };

const slides: Slide[] = [
  { img: "/assets/banner-1-home.png", href: getCatalogHref({ category: "Guitarras" }), alt: "Edição 70 anos Tonante — guitarras" },
  { img: "/assets/banner-2-home.png", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), alt: "Novidades e reposições — encordoamentos Tonante" },
  { img: "/assets/banner-3-home.png", href: "/produtos", alt: "Lançamento linha HAKA — ukulele Tonante" },
];

export function HeroSection() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5200);
    return () => clearInterval(t);
  }, [paused, n]);

  const goTo = (i: number) => setIdx((i + n) % n);

  return (
    <section
      className="px-5 pt-[calc(70px+var(--announce-h))] md:px-12 md:pt-[calc(150px+var(--announce-h))] notebook:pt-[calc(100px+var(--announce-h))]"
      style={{ background: "var(--surface-0)" }}
    >
      <div className="relative mx-auto" style={{ maxWidth: "1680px" }}>
        {/* palco — aspecto da arte (597/250 ≈ 2.39:1), mas capado pela altura da
            viewport p/ banner + chips de categoria caberem na 1ª dobra em
            qualquer monitor. Reserva = header+pt (≈190) + dots (≈44) + chips
            (≈84) + respiro. object-cover apara o excedente vertical. */}
        <div
          className="relative mx-auto w-full overflow-hidden max-h-[calc(100svh-230px)] md:max-h-[calc(100svh-340px)]"
          style={{ aspectRatio: "597 / 250", borderRadius: "var(--radius-card-xl)", boxShadow: "var(--shadow-card)" }}
        >
          {slides.map((s, i) => {
            const isActive = i === idx;
            return (
              <Link
                key={i}
                to={s.href}
                className="absolute inset-0"
                style={{ opacity: isActive ? 1 : 0, transition: "opacity .6s ease", pointerEvents: isActive ? "auto" : "none", zIndex: isActive ? 2 : 1 }}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <img src={s.img} alt={s.alt} className="h-full w-full object-cover" />
              </Link>
            );
          })}

          {/* setas */}
          <button
            onClick={() => goTo(idx - 1)}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 z-[5] hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full md:flex"
            style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--ink-strong)", boxShadow: "var(--shadow-card)" }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => goTo(idx + 1)}
            aria-label="Próximo banner"
            className="absolute right-4 top-1/2 z-[5] hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full md:flex"
            style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", color: "var(--ink-strong)", boxShadow: "var(--shadow-card)" }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* dots + pause */}
        <div className="mt-5 flex items-center justify-center gap-3.5">
          <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Reproduzir" : "Pausar"} className="grid place-items-center cursor-pointer" style={{ color: "var(--muted)" }}>
            {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Banner ${i + 1}`}
                className="h-[9px] rounded-full transition-all cursor-pointer"
                style={{ width: i === idx ? 28 : 9, background: i === idx ? "var(--amber)" : "#d6d6d6", padding: 0, border: "none" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
