import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import type { Product } from "./productsData";
import { playStrum, stopStrum, strumDurationSec, presetForProduct } from "../lib/strum";
import { sampleForProduct } from "../lib/timbre";

/* TimbrePlayer — "Ouça este instrumento" (V3 §8.1).
   Fonte em 3 tempos, do mais honesto ao mais genérico:
   1. product.audioSample — gravação do próprio modelo Tonante;
   2. amostra de referência CC0 por família (lib/timbre), sorteio estável;
   3. timbre SIMULADO (Karplus-Strong).
   Cada um tem seu rótulo: só o (1) pode dizer "gravado com este modelo".
   Regras: nunca autoplay; um som por vez (lib garante p/ synth; áudio real
   compartilha o mesmo singleton aqui). */

let currentAudio: HTMLAudioElement | null = null;

// waveform decorativa estática — barras determinísticas (sem Math.random em render)
const BARS = Array.from({ length: 36 }, (_, i) => {
  const a = Math.sin(i * 0.9) * 0.5 + Math.sin(i * 0.37 + 1.4) * 0.5;
  return 0.25 + Math.abs(a) * 0.75;
});

function Waveform({ active, color }: { active: boolean; color: string }) {
  return (
    <svg aria-hidden="true" width="100%" height="28" viewBox="0 0 144 28" preserveAspectRatio="none">
      {BARS.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={14 - (h * 24) / 2}
          width="2.2"
          height={h * 24}
          rx="1.1"
          fill={color}
          opacity={active ? 0.9 : 0.45}
        />
      ))}
    </svg>
  );
}

type Props = {
  product: Product;
  /** compact: só o botão + rótulo curto (quick-view) */
  variant?: "full" | "compact";
  className?: string;
};

export function TimbrePlayer({ product, variant = "full", className = "" }: Props) {
  const preset = presetForProduct(product);
  const ownRecording = product.audioSample ?? null;   // gravação do modelo
  const reference = ownRecording ? null : sampleForProduct(product); // amostra CC0
  const src = ownRecording ?? reference;
  const hasSample = Boolean(src);
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  // desmonte: para tudo que for deste player
  useEffect(() => () => { cancelRef.current?.(); }, []);

  if (!preset && !hasSample) return null;

  const stop = () => {
    cancelRef.current?.();
    cancelRef.current = null;
    setPlaying(false);
  };

  const play = () => {
    if (playing) { stop(); return; }
    // mata qualquer áudio real em curso (synth a lib já mata)
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    stopStrum();
    setPlaying(true);
    if (hasSample) {
      const audio = new Audio(src!);
      currentAudio = audio;
      audio.onended = () => { setPlaying(false); currentAudio = null; };
      void audio.play();
      cancelRef.current = () => { audio.pause(); if (currentAudio === audio) currentAudio = null; };
    } else if (preset) {
      cancelRef.current = playStrum(preset, () => setPlaying(false));
    }
  };

  const label = ownRecording
    ? "Gravado com este modelo"
    : reference
      ? "Amostra de referência"
      : "Timbre simulado";
  const dur = hasSample ? "" : ` · 0:0${Math.round(strumDurationSec(preset ?? "Coral"))}`;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); play(); }}
        aria-label={playing ? "Parar demonstração" : `Ouvir demonstração de ${product.name}`}
        className={`inline-flex items-center gap-2 rounded-pill cursor-pointer transition-colors ${className}`}
        style={{ border: "1px solid var(--edge)", background: playing ? "var(--surface-2)" : "transparent", padding: "6px 12px", fontFamily: "var(--font-family-inter)", fontSize: 12, fontWeight: 600, color: "var(--ink-strong)" }}
      >
        {playing ? <Square size={12} fill="currentColor" strokeWidth={0} /> : <Play size={12} fill="var(--amber-deep)" strokeWidth={0} />}
        Ouvir timbre
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-card-lg)", background: "var(--surface-1)", padding: "14px 18px" }}
    >
      <button
        type="button"
        onClick={play}
        aria-label={playing ? "Parar demonstração" : `Ouvir demonstração de ${product.name}`}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-105"
        style={{ background: "var(--gradient-buy)", color: "#fff", boxShadow: "var(--shadow-buy-cta-sm)" }}
      >
        {playing ? <Square size={16} fill="currentColor" strokeWidth={0} /> : <Play size={18} fill="currentColor" strokeWidth={0} style={{ marginLeft: 2 }} />}
      </button>
      <div className="min-w-0 flex-1">
        <p style={{ fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-strong)", margin: 0 }}>
          Ouça este instrumento
        </p>
        <div className="mt-1.5"><Waveform active={playing} color="var(--amber)" /></div>
        <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 11, color: "var(--ink-meta)", margin: "5px 0 0" }}>
          {label}{dur}
          {reference && " — não é este exemplar"}
          {!hasSample && " — gravações reais em produção"}
        </p>
      </div>
    </div>
  );
}
