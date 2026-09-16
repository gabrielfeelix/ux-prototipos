import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

/* Video70Anos — a faixa institucional da home, no lugar da StoryBand.
   Ocupa a largura inteira e o vídeo é o conteúdo: em repouso não há texto
   nenhum, só uma vinheta fraca segurando as bordas. Sem parallax: o vídeo fica
   fixo e centrado na caixa.

   Fonte: "Guitarra 70 anos - Horizontal.mp4" (94 MB, 1920×1080), reencodado
   pra 1600×900 com AAC 96k — 7,4 MB. A versão anterior tinha sido reencodada
   SEM áudio, o que deixaria o botão de som sem função; o bruto em
   assets-fonte/ tem a faixa. O vídeo fica atrás de vinheta e em movimento,
   então bitrate de vitrine seria desperdício.

   Dois comportamentos:

   1. Toca sozinho enquanto QUALQUER parte da faixa estiver na tela e só pausa
      quando ela sai inteira (threshold 0). O critério é de propósito: pausar
      com a faixa meio visível cortava o movimento na frente do visitante.
   2. Com o mouse em cima, o quadro escurece e sobe a chamada dos 70 anos com
      dois botões. Tirou o mouse, o texto some e o vídeo continua rodando —
      hover não interrompe a reprodução. */

// A "seção de comemoração": as três guitarras da Edição 70 Aniversário.
// Não existe landing dedicada ainda; a busca resolve os três produtos.
const DESTINO = "/produtos?search=" + encodeURIComponent("Edição 70 Aniversário");

const SUAVE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function Video70Anos() {
  const secRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [comSom, setComSom] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  /* Fora da tela o vídeo pausa: são 5 MB decodificando à toa no meio da home.
     threshold 0 = toca com um pixel visível, pausa só quando some inteiro. */
  useEffect(() => {
    const el = secRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const p = v.play();
          if (p) p.catch(() => {}); // autoplay bloqueado: fica no poster
        } else {
          v.pause();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* O som é sempre escolha do visitante: o vídeo nasce mudo porque autoplay
     com áudio o browser barra. */
  const alternarSom = () => {
    const v = videoRef.current;
    if (!v) return;
    const novo = !comSom;
    v.muted = !novo;
    if (novo) {
      const p = v.play();
      if (p) p.catch(() => {});
    }
    setComSom(novo);
  };

  return (
    <section ref={secRef} className="w-full" style={{ marginTop: "var(--space-section-md)" }}>
      <div
        className="group/v70 relative w-full overflow-hidden"
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
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* vinheta fraca — segura as bordas sem escurecer o meio do quadro */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 150px 36px rgba(0,0,0,0.42)" }}
        />

        {/* o quadro inteiro continua clicável; os botões ficam por cima dele */}
        <Link
          to={DESTINO}
          aria-label="Ver a seleção de aniversário de 70 anos da Tonante"
          className="absolute inset-0 z-[1]"
        />

        {/* véu do hover — escurece o suficiente pro texto branco se sustentar
            sem apagar o que está acontecendo no vídeo */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-[500ms] group-hover/v70:opacity-100"
          style={{ background: "rgba(8,7,6,0.46)", transitionTimingFunction: SUAVE }}
        />

        {/* chamada + botões: sobem 14px enquanto aparecem, na curva do resto do
            site. Os botões voltam a receber clique só quando o bloco está
            visível — senão viram alvo invisível sobre o vídeo. */}
        <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center">
          <div
            className="translate-y-[14px] opacity-0 transition-[translate,opacity] duration-[520ms] group-hover/v70:translate-y-0 group-hover/v70:opacity-100"
            style={{ transitionTimingFunction: SUAVE }}
          >
            <p
              className="label"
              style={{ color: "var(--amber-bright)", margin: 0, textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
            >
              Edição 70 Aniversário
            </p>
            <h2
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.4vw, 52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: "14px 0 0",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              }}
            >
              Setenta anos fazendo instrumento
              <br className="hidden sm:block" /> para quem faz música.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "clamp(14px, 1.2vw, 17px)",
                color: "rgba(255,255,255,0.86)",
                margin: "14px auto 0",
                maxWidth: 560,
                lineHeight: 1.5,
                textShadow: "0 1px 12px rgba(0,0,0,0.5)",
              }}
            >
              Três guitarras comemorativas, feitas para marcar os 70 anos de uma
              fábrica que começou em 1954 e nunca parou.
            </p>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 translate-y-[18px] opacity-0 transition-[translate,opacity] duration-[520ms] group-hover/v70:pointer-events-auto group-hover/v70:translate-y-0 group-hover/v70:opacity-100"
            style={{ transitionTimingFunction: SUAVE, transitionDelay: "70ms" }}
          >
            <Link
              to={DESTINO}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              className="rounded-pill flex h-12 items-center gap-2 px-7 transition-colors duration-200"
              style={{
                background: ctaHover ? "var(--ink-strong)" : "#ffffff",
                color: ctaHover ? "#ffffff" : "var(--ink-strong)",
                fontFamily: "var(--font-family-inter)",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              Ver coleção
              <ArrowRight size={17} strokeWidth={2.2} />
            </Link>

            <button
              type="button"
              onClick={alternarSom}
              aria-pressed={comSom}
              aria-label={comSom ? "Desligar o som do vídeo" : "Ativar o som do vídeo"}
              className="rounded-pill flex h-12 cursor-pointer items-center gap-2 px-6 transition-colors duration-200 hover:bg-white/15"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "#ffffff",
                backdropFilter: "blur(6px)",
                fontFamily: "var(--font-family-inter)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {comSom ? <Volume2 size={17} strokeWidth={2.1} /> : <VolumeX size={17} strokeWidth={2.1} />}
              {comSom ? "Som ligado" : "Ativar som"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
