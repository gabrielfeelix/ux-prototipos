"use client";

import { useEffect, useMemo, useState } from "react";
import { Rocket, Lock, CalendarDays, Sparkles, ShieldCheck } from "lucide-react";
import type { PreOrderInfo } from "./PreOrderData";
import { Button } from "./section";
import { formatBRL, getInstallmentCount, getInstallmentValue } from "./productEnhancements";

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

/** "R$ 1.234,56" de volta para número: o banner recebe preço já formatado. */
function paraNumero(brl: string) {
  const n = Number(brl.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
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
  /* o preço que vale é o de pré-venda quando existe; o cheio fica riscado */
  const precoPreVenda = paraNumero(info.preOrderPrice ?? productPrice);
  const precoPix = Math.round(precoPreVenda * 0.9 * 100) / 100;
  const parcelas = getInstallmentCount(precoPreVenda);
  const valorParcela = getInstallmentValue(precoPreVenda);
  const reservedPct = Math.min(100, Math.round((info.reservedUnits / info.totalUnits) * 100));
  const remaining = Math.max(0, info.totalUnits - info.reservedUnits);

  return (
    <div
      className="relative overflow-hidden"
      data-purchase-card="product-page"
      style={{
        // irmão do StickyPriceCard: branco, borda + sombra suave. O tema
        // "espaço" (gradiente vinho + starfield) vinha do template PCYES e
        // deixava a tinta escura da Tonante ilegível sobre fundo escuro.
        borderRadius: variant === "hero" ? "var(--radius-card-xl)" : "var(--radius-card-lg)",
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 18px 44px -30px rgba(17,17,17,0.28)",
      }}
    >
      {/* banho âmbar no topo — marca "pré-venda" sem escurecer o card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "140px",
          background:
            "linear-gradient(180deg, rgba(200, 120, 0, 0.09) 0%, rgba(200, 120, 0, 0) 100%)",
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
            className="inline-flex items-center gap-1 text-ink-subtle"
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
            className="inline mr-1.5 -mt-0.5"
            style={{ color: "var(--amber)" }}
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
                    background: "var(--well)",
                    border: "1px solid rgba(17, 17, 17, 0.07)",
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
          <CalendarDays size={13} strokeWidth={2.2} style={{ color: "var(--amber-deep)" }} />
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
              Reservas
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
              background: "rgba(17, 17, 17, 0.08)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${reservedPct}%`,
                background:
                  "linear-gradient(90deg, var(--amber-bright) 0%, var(--amber) 100%)",
                borderRadius: "var(--radius-pill)",
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
            background: "var(--well)",
            border: "1px solid rgba(17, 17, 17, 0.07)",
            borderRadius: "var(--radius-card-md)",
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
          {/* mesma leitura de preço do card e da PDP: o número grande é o do
              PIX, em verde, e a parcela vem logo abaixo. Antes era só o valor
              de pré-venda e uma linha dizendo "pagamento parcelado", que não
              informava nem o desconto nem em quantas vezes cabia. */}
          <div className="flex items-baseline gap-2">
            <span
              className="leading-none num"
              style={{
                color: "var(--buy-green)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "clamp(26px, 3vw, 30px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {formatBRL(precoPix)}
            </span>
            <span
              style={{
                color: "var(--buy-green)",
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
              }}
            >
              no PIX
            </span>
            {/* riscado é sempre o preço cheio: é dele que o desconto de
                pré-venda e o do PIX se medem. O valor no cartão aparece na
                linha de parcelas logo abaixo. */}
            <span
              className="line-through text-ink-subtle"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
              }}
            >
              {productPrice}
            </span>
          </div>
          <p
            className="text-ink-muted mt-1 num"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
            }}
          >
            ou {parcelas}x de {formatBRL(valorParcela)} sem juros
          </p>
        </div>

        {/* CTA */}
        {/* pré-venda deixou de ter cor própria: o laranja competia com o âmbar
            da marca e prometia uma ação diferente da que é. O rótulo e o
            foguete dizem que é reserva; o verde diz que é compra. */}
        <Button
          hierarchy="primary"
          intent="buy"
          size="lg"
          block
          onClick={onReserve}
          disabled={remaining <= 0}
        >
          <Rocket size={15} strokeWidth={2.4} />
          {remaining > 0 ? "Comprar agora" : "Esgotado"}
        </Button>

        {/* guarantees */}
        <div className="mt-4 flex items-start gap-2">
          <ShieldCheck size={13} className="mt-0.5 flex-shrink-0" strokeWidth={2.2} style={{ color: "var(--amber-deep)" }} />
          <p
            className="text-ink-muted"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              lineHeight: 1.5,
            }}
          >
            Você pode cancelar a reserva a qualquer momento antes do envio.
          </p>
        </div>
      </div>
    </div>
  );
}

export { PreOrderPill as PreOrderBadge } from "./section/PreOrderPill";
