"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCatalogHref } from "../components/productPresentation";
import { useIsMobile } from "../components/ui/use-mobile";

/* HeroBannersV2 — mesmos banners da v1, porém full-bleed (sem margem,
   sem raio, sem sombra) e mais altos, como no tema Local. */
/** `imgEstreita` é a mesma arte em 960px, para telas de celular. */
type Slide = { img: string; imgEstreita: string; href: string; alt: string };

const SLIDES: Slide[] = [
  { img: "/assets/banner-1-home.webp", imgEstreita: "/assets/banner-1-home-960.webp", href: getCatalogHref({ category: "Guitarras" }), alt: "Edição 70 anos Tonante: guitarras" },
  { img: "/assets/banner-2-home.webp", imgEstreita: "/assets/banner-2-home-960.webp", href: getCatalogHref({ category: "Cordas & Encordoamentos" }), alt: "Novidades e reposições: encordoamentos Tonante" },
  { img: "/assets/banner-3-home.webp", imgEstreita: "/assets/banner-3-home-960.webp", href: "/produtos", alt: "Lançamento linha HAKA: ukulele Tonante" },
];

export function HeroBannersV2() {
  const [idx, setIdx] = useState(0);
  // altura = tudo o que sobra da 1ª dobra abaixo do header, medido de verdade
  // (o header tem 3 faixas e muda de altura em breakpoint).
  const [headerH, setHeaderH] = useState(178);
  /* O banner é a primeira coisa da página e ocupa a dobra inteira. Enquanto
     ele não pinta, o que a pessoa vê é um retângulo branco do tamanho da
     tela, que é exatamente a cara de uma página travada. O esqueleto ocupa
     esse espaço até a arte chegar; como o banner fica por cima, ele some
     sozinho e a animação para junto. */
  const [heroPronto, setHeroPronto] = useState(false);
  const isMobile = useIsMobile();
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
      {/* A arte é 1942×809 (2,4:1). Numa tela de 390px, "cobrir" a dobra
          inteira mostra ~27% da largura: some a manchete, some o botão e fica
          só um pedaço de guitarra. No celular o quadro é mais baixo e ancorado
          à esquerda, que é onde mora o texto da peça. A saída definitiva é
          arte vertical própria — isto é o melhor possível com a que existe. */}
      <div
        className={`relative w-full ${heroPronto ? "" : "tn-skel tn-skel-escuro"}`}
        style={{
          height: isMobile ? "max(340px, 46svh)" : `max(420px, calc(100svh - ${headerH}px))`,
          backgroundColor: heroPronto ? undefined : "#1c1710",
        }}
      >
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
              {/* A arte era PNG de ~3 MB cada, três delas baixando juntas
                  antes de qualquer outra coisa da página: 9,1 MB só na
                  abertura. Em WebP são 588 KB no desktop e 196 KB no celular,
                  com a versão estreita servida por `media` pra tela pequena
                  não pagar por pixel que ela não mostra.
                  O PNG deixou de ser o `src` de reserva e saiu do repositório:
                  todo navegador que o site atende lê WebP desde 2020, e
                  manter os três originais só para um fallback que ninguém
                  alcança custava 9,1 MB de repositório e de deploy.
                  O primeiro banner é o LCP da home: carrega com prioridade.
                  Os outros dois só entram quando o carrossel pedir. */}
              <picture>
                <source media="(max-width: 767px)" srcSet={s.imgEstreita} type="image/webp" />
                <img
                  src={s.img}
                  alt={s.alt}
                  className="h-full w-full object-cover object-[16%_center] md:object-center"
                  loading={i === 0 ? "eager" : "lazy"}
                  /* minúsculo, e por isso espalhado: só o React 19 reconhece a
                     forma camelCase e a repassa ao DOM; no 18 ela vira aviso
                     no console e o atributo não chega. Os tipos do React
                     instalados são os do 19, então o nome em minúscula não
                     passa pela checagem direto no JSX. */
                  {...({ fetchpriority: i === 0 ? "high" : "low" } as Record<string, string>)}
                  decoding={i === 0 ? "sync" : "async"}
                  onLoad={i === 0 ? () => setHeroPronto(true) : undefined}
                  onError={i === 0 ? () => setHeroPronto(true) : undefined}
                />
              </picture>
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
