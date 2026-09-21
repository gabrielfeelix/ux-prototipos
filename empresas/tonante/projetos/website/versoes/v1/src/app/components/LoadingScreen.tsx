"use client";

import { useEffect, useState } from "react";
import { EqualizerWave } from "./section";

/* ---------------------------------------------------------------------------
   Tela de carregamento da Tonante.

   A âncora visual é a mesma onda sonora da newsletter (EqualizerWave): som é a
   assinatura da marca, então "esperando" vira "tocando" em vez de spinner
   genérico. Wordmark em cima, onda no meio, "Carregando" embaixo.

   Tudo em CSS — nada de motion/react aqui. A tela precisa aparecer e sumir
   mesmo se o JS de animação engasgar no boot; com CSS o pior caso é ela
   aparecer sem transição, não ficar presa.

   LoadingScreen  → a tela em si; serve de fallback de <Suspense>, de estado de
                    rota e de overlay. Reutilizável, sem lógica de tempo.
   BootLoader     → cobre o boot do app: segura a tela até o window.load com um
                    piso de tempo (evita flash), depois some.
   --------------------------------------------------------------------------- */

export function LoadingScreen({
  message = "Carregando",
  /** true = cobre a viewport (fixed). false = ocupa o bloco onde for montada. */
  fullscreen = true,
  className = "",
}: {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`${fullscreen ? "fixed inset-0 z-[120]" : "relative w-full"} flex flex-col items-center justify-center px-6 ${className}`}
      style={{
        background: "var(--surface-0)",
        minHeight: fullscreen ? undefined : "60vh",
      }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{ animation: "tn-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        {/* width/height do arquivo (1148×475) reservam o espaço: a wordmark
            entra sem empurrar a onda pra baixo. fetchpriority high + preload no
            index.html garantem que ela chegue antes do resto. */}
        <img
          src="/brand/tonante-wordmark-dark.png"
          alt="Tonante"
          width={1148}
          height={475}
          {...{ fetchpriority: "high" }}
          decoding="sync"
          className="h-11 md:h-14"
          style={{ width: "auto", aspectRatio: "1148 / 475" }}
        />

        {/* onda sonora — mesma da newsletter, em escala maior */}
        <div className="mt-8 mb-7 flex justify-center">
          <EqualizerWave bars={32} height={40} barWidth={4} gap={4} className="md:hidden" />
          <EqualizerWave bars={52} height={56} barWidth={4} gap={4} className="hidden md:flex" />
        </div>

        <span
          className="flex items-center"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-meta)",
          }}
        >
          {message}
          <span aria-hidden="true" className="ml-[1px] inline-flex">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ animation: `tn-dot 1.2s ease-in-out ${i * 0.16}s infinite` }}>
                .
              </span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}

const FADE_MS = 480;

/* A marca aparece uma vez por aba, no primeiro carregamento. */
const JA_VIU = "tonante:boot-visto";

function jaViuNestaAba() {
  try {
    return sessionStorage.getItem(JA_VIU) === "1";
  } catch {
    return false; // aba anônima com storage bloqueado: mostra, não quebra
  }
}

/**
 * Overlay de boot: a marca cobrindo a tela enquanto o site monta.
 *
 * Ele saía no evento `window.load`, que é o mais tarde possível: o `load` só
 * dispara quando a última imagem da página termina. A home pedia ~190 fotos,
 * então o `load` não chegava nunca dentro do teto, o teto de 6 s estourava, e
 * o que a pessoa via eram seis segundos de "CARREGANDO…" com o scroll travado.
 * Era esse o travamento — e a ironia é que a página por baixo já estava
 * pronta e utilizável quase o tempo todo.
 *
 * Agora ele não espera imagem nenhuma. Cada imagem tem o seu próprio
 * esqueleto (ver components/Esqueletos e figma/ImageWithFallback), então a
 * página pode aparecer com buracos preenchidos e ir completando à vista.
 * O overlay serve só ao instante de marca: um piso curto pra não piscar, um
 * teto baixo pra nunca ser ele o gargalo, e uma vez só por aba — voltar pra
 * home depois de navegar não merece outra tela de abertura.
 */
export function BootLoader({
  minDurationMs = 900,
  maxDurationMs = 2200,
}: {
  minDurationMs?: number;
  maxDurationMs?: number;
}) {
  const [phase, setPhase] = useState<"visible" | "fading" | "done">(() =>
    jaViuNestaAba() ? "done" : "visible",
  );

  useEffect(() => {
    if (phase === "done") return;
    const start = performance.now();
    const timers: number[] = [];
    let encerrado = false;

    const finish = () => {
      if (encerrado) return;
      encerrado = true;
      try {
        sessionStorage.setItem(JA_VIU, "1");
      } catch {
        /* storage bloqueado: só não lembra entre páginas */
      }
      const elapsed = performance.now() - start;
      timers.push(
        window.setTimeout(() => {
          setPhase("fading");
          timers.push(window.setTimeout(() => setPhase("done"), FADE_MS));
        }, Math.max(0, minDurationMs - elapsed)),
      );
    };

    /* Assim que o React chegou até aqui, o primeiro quadro já foi pintado por
       baixo do overlay. Daí em diante o piso é o único motivo de continuar. */
    finish();

    // teto de segurança, caso o piso mude e algo o segure
    timers.push(window.setTimeout(finish, maxDurationMs));

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [minDurationMs, maxDurationMs, phase]);

  // enquanto a tela cobre tudo, trava o scroll do body
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[120]"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        pointerEvents: phase === "fading" ? "none" : undefined,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <LoadingScreen />
    </div>
  );
}
