import { Instagram } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// RealMusicians — "Tonante por aí": fotos de músicos (banco de imagens, cara de
// IG), cards do mesmo tamanho rolando lentamente em marquee infinito.
type Shot = { photo: string; handle: string };
const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;

const SHOTS: Shot[] = [
  { photo: u("photo-1575395861912-72095f32b495"), handle: "@joaoviolao" },
  { photo: u("photo-1584402617825-1a58712ae0b0"), handle: "@bandadaesquina" },
  { photo: u("photo-1706664771939-8e34bcd218c8"), handle: "@luiza.strings" },
  { photo: u("photo-1749720773756-d3462e733167"), handle: "@studio.norte" },
  { photo: u("photo-1505841993706-c8d90b412bc4"), handle: "@pedro.live" },
];

function Card({ s, seed }: { s: Shot; seed: number }) {
  // rotação fixa por índice (estável entre renders, sem flicker) — foto impressa
  const rot = (((seed * 37) % 5) - 2) * 0.75; // -1,5° .. +1,5°
  return (
    <div className="flex-shrink-0" style={{ transform: `rotate(${rot}deg)` }}>
      <div style={{ background: "var(--surface-1)", padding: 6, borderRadius: 14, boxShadow: "0 16px 34px -14px rgba(17,17,17,0.38)" }}>
        <div className="relative overflow-hidden" style={{ width: 268, height: 330, borderRadius: 9 }}>
          <ImageWithFallback src={s.photo} alt={s.handle} className="absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.45) 100%)" }} />
          <div className="absolute bottom-3 left-3 z-[2] inline-flex items-center gap-1.5 rounded-pill" style={{ background: "rgba(17,17,17,0.45)", backdropFilter: "blur(6px)", padding: "5px 11px", color: "#fff" }}>
            <Instagram size={14} strokeWidth={1.8} />
            <span style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: "13px" }}>{s.handle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RealMusicians() {
  const loop = [...SHOTS, ...SHOTS];
  return (
    <section style={{ background: "var(--surface-0)", paddingTop: "var(--space-section-md)", overflow: "hidden" }}>
      <div className="mx-auto w-full px-5 md:px-12" style={{ maxWidth: "1680px" }}>
        <div className="mb-8">
          <p className="label" style={{ color: "var(--amber-deep)", marginBottom: 12 }}>
            Tonante por aí
          </p>
          <h2 className="text-ink-strong" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
            Músicos de verdade, palcos de verdade
          </h2>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", color: "var(--ink-soft)", margin: "14px 0 0" }}>
            Apareça aqui, use{" "}
            <strong style={{ color: "var(--amber-deep)", fontWeight: 700 }}>#FeitaDeHistorias</strong>
          </p>
        </div>
      </div>

      {/* marquee */}
      <div className="tonante-marquee" style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
        <div className="tonante-marquee-track flex gap-5" style={{ width: "max-content" }}>
          {loop.map((s, i) => (
            <Card key={i} s={s} seed={i % SHOTS.length} />
          ))}
        </div>
      </div>

      <style>{`
        .tonante-marquee-track { animation: tonante-marquee 38s linear infinite; }
        .tonante-marquee:hover .tonante-marquee-track { animation-play-state: paused; }
        @keyframes tonante-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .tonante-marquee-track { animation: none; } }
      `}</style>
    </section>
  );
}
