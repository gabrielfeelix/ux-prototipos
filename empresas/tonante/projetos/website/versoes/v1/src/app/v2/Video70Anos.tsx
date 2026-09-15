import { useEffect, useRef } from "react";
import { Link } from "react-router";

/* Video70Anos — a faixa institucional da home, no lugar da StoryBand.
   Ocupa a largura inteira, sem card e sem texto: o vídeo é o conteúdo. Uma
   vinheta fraca segura as bordas e o quadro inteiro leva pra seleção de
   aniversário. Sem parallax: o vídeo fica fixo e centrado na caixa.

   Fonte: "Guitarra 70 anos - Horizontal.mp4" (94 MB, 1920×1080), reencodado
   pra 1600×900 sem áudio — 5,5 MB. Autoplay só existe mudo, e o arquivo fica
   atrás de vinheta e em movimento, então bitrate de vitrine seria desperdício. */

// A "seção de comemoração": as três guitarras da Edição 70 Aniversário.
// Não existe landing dedicada ainda; a busca resolve os três produtos.
const DESTINO = "/produtos?search=" + encodeURIComponent("Edição 70 Aniversário");

export function Video70Anos() {
  const secRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // fora da tela o vídeo pausa: são 5 MB decodificando à toa no meio da home
  useEffect(() => {
    const el = secRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const p = v.play();
          if (p) p.catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={secRef} className="w-full" style={{ marginTop: "var(--space-section-md)" }}>
      <Link
        to={DESTINO}
        aria-label="Ver a seleção de aniversário de 70 anos da Tonante"
        className="group/v70 relative block w-full overflow-hidden"
        style={{ height: "clamp(420px, 72vh, 800px)", background: "#0b0b0c" }}
      >
        <video
          ref={videoRef}
          src="/home/guitarra-70-anos.mp4"
          poster="/home/guitarra-70-anos.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          /* fixo e centrado na caixa: sem parallax, por decisão do Gabriel —
             o plano do vídeo já tem movimento próprio e os dois competiam. */
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* vinheta fraca — segura as bordas sem escurecer o meio do quadro */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 150px 36px rgba(0,0,0,0.42)" }}
        />
      </Link>
    </section>
  );
}
