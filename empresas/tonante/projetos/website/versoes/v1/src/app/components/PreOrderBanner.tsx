"use client";

import { useEffect, useMemo, useState } from "react";
import { Rocket, Lock, CalendarDays, Sparkles, ShieldCheck } from "lucide-react";
import type { PreOrderInfo } from "./PreOrderData";

type Props = {
  info: PreOrderInfo;
  productPrice: string;
  onReserve: () => void;
  variant?: "card" | "hero";
};

const pad = (n: number) => String(n).padStart(2, "0");

export function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const delta = Math.max(0, target - now);
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds, isLive: delta === 0 };
}

function formatReleaseDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function PreOrderBanner({ info, productPrice, onReserve, variant = "card" }: Props) {
  const { days, hours, minutes, seconds, isLive } = useCountdown(info.releaseDate);
  const reservedPct = Math.min(100, Math.round((info.reservedUnits / info.totalUnits) * 100));
  const remaining = Math.max(0, info.totalUnits - info.reservedUnits);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: variant === "hero" ? "24px" : "20px",
        background:
          "linear-gradient(135deg, #1a0608 0%, #2a0a0d 45%, #1a0608 100%)",
        border: "1px solid rgba(200, 120, 0,0.28)",
        boxShadow:
          "inset 0 1px 0 rgba(var(--foreground-rgb), 0.06), 0 30px 80px -24px rgba(200, 120, 0,0.45)",
      }}
    >
      {/* radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 0%, rgba(17, 17, 17, 0.08) 0%, transparent 55%), radial-gradient(circle at 80% 100%, rgba(255,200,90,0.10) 0%, transparent 50%)",
        }}
      />
      {/* starfield */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 22%, #fff 0.5px, transparent 1px), radial-gradient(circle at 38% 78%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 64% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 84% 65%, #fde68a 0.5px, transparent 1px), radial-gradient(circle at 22% 88%, #fff 0.5px, transparent 1px)",
        }}
      />

      <div className="relative p-5 lg:p-6">
        {/* header tag */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: "var(--gradient-preorder-red)",
              color: "#fff",
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              boxShadow: "0 6px 16px -4px rgba(200, 120, 0,0.6)",
            }}
          >
            <Rocket size={11} strokeWidth={2.6} />
            Pré-venda
          </span>
          <span
            className="inline-flex items-center gap-1 text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <Lock size={10} strokeWidth={2.4} />
            Reserva garantida
          </span>
        </div>

        {/* highlight line */}
        <p
          className="text-ink mb-4"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            lineHeight: 1.45,
          }}
        >
          <Sparkles
            size={13}
            className="inline mr-1.5 -mt-0.5 text-[#facc15]"
            strokeWidth={2.4}
          />
          {info.highlight}
        </p>

        {/* countdown */}
        <div className="mb-4">
          <p
            className="text-ink-muted mb-2"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {isLive ? "Já disponível" : "Lança em"}
          </p>
          {!isLive && (
            <div className="grid grid-cols-4 gap-2">
              {[
                { v: days, l: "Dias" },
                { v: hours, l: "Horas" },
                { v: minutes, l: "Min" },
                { v: seconds, l: "Seg" },
              ].map((unit) => (
                <div
                  key={unit.l}
                  className="flex flex-col items-center justify-center py-2.5"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(var(--foreground-rgb), 0.08)",
                    borderRadius: "var(--radius-card-sm)",
                  }}
                >
                  <span
                    className="text-ink-strong tabular-nums leading-none"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "var(--text-xl)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {pad(unit.v)}
                  </span>
                  <span
                    className="text-ink-subtle mt-1"
                    style={{
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "var(--text-caption)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {unit.l}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* release date */}
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={13} className="text-ink-muted" strokeWidth={2.2} />
          <span
            className="text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
            }}
          >
            Entrega prevista: <span className="text-ink-strong">{formatReleaseDate(info.releaseDate)}</span>
          </span>
        </div>

        {/* progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-ink-muted"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // RESERVAS
            </span>
            <span
              className="text-ink-strong tabular-nums"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
              }}
            >
              {info.reservedUnits.toLocaleString("pt-BR")} / {info.totalUnits.toLocaleString("pt-BR")}
            </span>
          </div>
          <div
            className="relative h-2 w-full overflow-hidden"
            style={{
              background: "rgba(var(--foreground-rgb), 0.06)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${reservedPct}%`,
                background:
                  "linear-gradient(90deg, #e08c12 0%, #facc15 100%)",
                borderRadius: "var(--radius-pill)",
                boxShadow: "0 0 16px rgba(200, 120, 0,0.55)",
              }}
            />
          </div>
          <p
            className="text-ink-muted mt-1.5"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
            }}
          >
            {remaining > 0
              ? `Restam ${remaining.toLocaleString("pt-BR")} reservas`
              : "Reservas esgotadas"}
          </p>
        </div>

        {/* price */}
        <div
          className="mb-4 p-3"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(var(--foreground-rgb), 0.06)",
            borderRadius: "var(--radius-card-sm)",
          }}
        >
          <p
            className="text-ink-muted mb-1"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Preço de pré-venda
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-ink-strong leading-none"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "var(--text-2xl)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {info.preOrderPrice ?? productPrice}
            </span>
            {info.preOrderPrice && (
              <span
                className="line-through text-ink-subtle"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-caption)",
                }}
              >
                {productPrice}
              </span>
            )}
          </div>
          <p
            className="text-ink-muted mt-1"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
            }}
          >
            Pagamento parcelado · sem cobrança até o envio
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onReserve}
          disabled={remaining <= 0}
          className="w-full h-12 flex items-center justify-center gap-2 text-ink-strong rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--gradient-preorder-orange)",
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-sm)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            boxShadow: "0 18px 38px -10px rgba(249,115,22,0.65)",
          }}
        >
          <Rocket size={15} strokeWidth={2.4} />
          {remaining > 0 ? "Comprar agora" : "Esgotado"}
        </button>

        {/* guarantees */}
        <div className="mt-4 flex items-start gap-2">
          <ShieldCheck size={13} className="text-[#22c55e] mt-0.5 flex-shrink-0" strokeWidth={2.2} />
          <p
            className="text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              lineHeight: 1.5,
            }}
          >
            Você pode cancelar a reserva a qualquer momento antes do envio.
            Cobrança só acontece no despacho do produto.
          </p>
        </div>
      </div>
    </div>
  );
}

export { PreOrderPill as PreOrderBadge } from "./section/PreOrderPill";
