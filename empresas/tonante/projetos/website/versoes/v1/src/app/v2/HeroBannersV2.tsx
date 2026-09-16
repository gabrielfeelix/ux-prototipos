"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCatalogHref } from "../components/productPresentation";

/* HeroBannersV2 — mesmos banners da v1, porém full-bleed (sem margem,
   sem raio, sem sombra) e mais altos, como no tema Local. */
type Slide = { img: string; href: string; alt: string };

const SLIDES: Slide[] = [
  { img: "/assets/banner-1-home.png", href: getCatalogHref({ category: "Guitarras" }), alt: "Edição 70 anos Tonante: guitarras" },
  { img: "/assets/banner-2-home.png", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), alt: "Novidades e reposições: encordoamentos Tonante" },
  { img: "/assets/banner-3-home.png", href: "/produtos", alt: "Lançamento linha HAKA: ukulele Tonante" },
];

export function HeroBannersV2() {
  const [idx, setIdx] = useState(0);
  // altura = tudo o que sobra da 1ª dobra abaixo do header, medido de verdade
  // (o header tem 3 faixas e muda de altura em breakpoint).
  const [headerH, setHeaderH] = useState(178);
  const n = SLIDES.length;

  useEffect(() => {
    const measure = () => {
      // mede o spacer (altura constante), não o header, que colapsa ao rolar
      const h = document.querySelector("[data-v2-header-spacer]")?.getBoundingClientRect().height;
      if (h) setHeaderH(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5600);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#ffffff" }}>
      <div className="relative w-full" style={{ height: `max(420px, calc(100svh - ${headerH}px))` }}>
        {SLIDES.map((s, i) => {
          const on = i === idx;
          return (
            <Link
              key={s.img}
              to={s.href}
              className="absolute inset-0"
              style={{ opacity: on ? 1 : 0, transition: "opacity .6s ease", pointerEvents: on ? "auto" : "none", zIndex: on ? 2 : 1 }}
              aria-hidden={!on}
              tabIndex={on ? 0 : -1}
            >
              <img src={s.img} alt={s.alt} className="h-full w-full object-cover" />
            </Link>
          );
        })}

        <button
          onClick={() => setIdx((i) => (i - 1 + n) % n)}
          aria-label="Banner anterior"
          className="absolute left-5 top-1/2 z-[5] hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full md:flex"
          style={{ background: "rgba(20,18,16,0.32)", border: "1px solid rgba(255,255,255,0.35)", color: "#ffffff", backdropFilter: "blur(6px)" }}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => setIdx((i) => (i + 1) % n)}
          aria-label="Próximo banner"
          className="absolute right-5 top-1/2 z-[5] hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full md:flex"
          style={{ background: "rgba(20,18,16,0.32)", border: "1px solid rgba(255,255,255,0.35)", color: "#ffffff", backdropFilter: "blur(6px)" }}
        >
          <ChevronRight size={22} />
        </button>

        {/* paginação dentro do banner — cápsula glass pra ler sobre qualquer arte */}
        <div className="absolute inset-x-0 bottom-6 z-[5] flex justify-center">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5"
            style={{ background: "rgba(20,18,16,0.30)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: "var(--radius-pill)", backdropFilter: "blur(8px)" }}
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.img}
                onClick={() => setIdx(i)}
                aria-label={`Ir para o banner ${i + 1}`}
                aria-current={i === idx}
                className="cursor-pointer rounded-pill"
                style={{
                  height: 6,
                  width: i === idx ? 30 : 6,
                  background: i === idx ? "#ffffff" : "rgba(255,255,255,0.5)",
                  transition: "width .3s ease, background .3s ease",
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
