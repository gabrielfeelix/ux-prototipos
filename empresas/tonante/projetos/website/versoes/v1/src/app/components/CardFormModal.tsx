import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useTheme } from "./ThemeProvider";
import type { UserCard } from "./AuthContext";
import { CreditCard } from "lucide-react";
import { CardBrandLogo } from "./CardBrandLogo";

const BRAND_THEMES: Record<string, string> = {
  visa: "linear-gradient(135deg, #1a1f71 0%, #2a3392 50%, #1a1f71 100%)",
  mastercard: "linear-gradient(135deg, #1a1a1c 0%, #28282b 60%, #1a1a1c 100%)",
  amex: "linear-gradient(135deg, #006FCF 0%, #0085D1 50%, #006FCF 100%)",
  americanexpress: "linear-gradient(135deg, #006FCF 0%, #0085D1 50%, #006FCF 100%)",
  elo: "linear-gradient(135deg, #1a1a1c 0%, #28282b 60%, #1a1a1c 100%)",
  hipercard: "linear-gradient(135deg, #5a0d10 0%, #7B1418 60%, #5a0d10 100%)",
  discover: "linear-gradient(135deg, #ff6000 0%, #ff8534 50%, #ff6000 100%)",
};

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: UserCard | null;
  onSubmit: (data: Omit<UserCard, "id">) => void;
}

const EMPTY = { brand: "", number: "", name: "", expiry: "", cvv: "", isDefault: false };

function detectBrand(num: string): string {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6(?:011|5)/.test(d)) return "Discover";
  if (/^(?:4011|4312|4389|4514|4573|5041|5066|5067|6362|6363|6504|6505|6506|6507|6509|6516|6550)/.test(d)) return "Elo";
  if (/^(606282|3841)/.test(d)) return "Hipercard";
  return "";
}

function maskCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}
function maskExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function CardFormModal({ open, onClose, initial, onSubmit }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [data, setData] = useState(EMPTY);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setData({ brand: initial.brand, number: `•••• •••• •••• ${initial.last4}`, name: initial.name, expiry: initial.expiry, cvv: "", isDefault: initial.isDefault });
      } else {
        setData(EMPTY);
      }
      setIsFlipped(false);
    }
  }, [open, initial]);

  const brand = useMemo(() => initial ? initial.brand : detectBrand(data.number), [data.number, initial]);
  const digitsCount = data.number.replace(/\D/g, "").length;
  const numberValid = !!initial || digitsCount >= 15;
  const valid = numberValid && !!data.name && data.expiry.length === 5 && data.cvv.length >= 3;

  const last4 = (() => {
    if (initial) return initial.last4;
    const digits = data.number.replace(/\D/g, "");
    return digits.slice(-4) || "••••";
  })();

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit({
      brand: brand || "",
      last4,
      name: data.name.toUpperCase(),
      expiry: data.expiry,
      isDefault: data.isDefault,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    padding: "11px 13px",
    borderRadius: "var(--radius-card-sm)",
    border: isDark ? "1px solid rgba(var(--foreground-rgb), 0.08)" : "1px solid rgba(0,0,0,0.08)",
    background: isDark ? "rgba(var(--foreground-rgb), 0.03)" : "rgba(0,0,0,0.02)",
    fontFamily: "var(--font-family-inter)",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: isDark ? "#fafafa" : "#0a0a0a",
    width: "100%",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontFamily: "var(--font-family-inter)",
    fontSize: "var(--text-caption)",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: isDark ? "rgba(var(--foreground-rgb), 0.55)" : "rgba(0,0,0,0.55)",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="!max-w-[560px] !p-0 !gap-0 !border-0"
        style={{
          background: "var(--surface-1)",
          borderRadius: "var(--radius-card-lg)",
          overflow: "hidden",
          color: isDark ? "#fafafa" : "#0a0a0a",
        }}
      >
        <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: isDark ? "1px solid rgba(var(--foreground-rgb), 0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(17, 17, 17, 0.08)" }}>
            <CreditCard size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 600, color: isDark ? "#fafafa" : "#0a0a0a" }}>
              {initial ? "Editar cartão" : "Adicionar cartão"}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: isDark ? "rgba(var(--foreground-rgb), 0.55)" : "rgba(0,0,0,0.55)" }}>
              Os dados ficam salvos para agilizar o checkout.
            </DialogDescription>
          </div>
        </div>

        {/* ─── Card preview com flip 3D ─── */}
        <div className="px-6 pt-5 pb-2 flex justify-center" style={{ perspective: 1200 }}>
          <div
            className="relative w-full max-w-[340px]"
            style={{
              aspectRatio: "1.586 / 1",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRENTE */}
            <div
              className="absolute inset-0 p-5 flex flex-col justify-between"
              style={{
                backfaceVisibility: "hidden",
                borderRadius: 16,
                background: BRAND_THEMES[brand.toLowerCase().replace(/\s+/g, "")] ?? "linear-gradient(135deg, #1a1a1c 0%, #28282b 60%, #1a1a1c 100%)",
                border: "1px solid rgba(var(--foreground-rgb), 0.12)",
                boxShadow: "var(--shadow-float)",
                transition: "background 0.4s ease",
              }}
            >
              <div className="flex items-start justify-between">
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.6)" }}>
                  {data.isDefault ? "PADRÃO" : " "}
                </span>
                {brand ? (
                  <CardBrandLogo brand={brand} style={{ width: 48, height: 30, borderRadius: 5, overflow: "hidden", display: "block" }} />
                ) : (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "rgba(var(--foreground-rgb), 0.08)",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                    color: "rgba(var(--foreground-rgb), 0.6)",
                    letterSpacing: "0.1em",
                  }}>-</span>
                )}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "rgba(var(--foreground-rgb), 0.95)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {data.number || "•••• •••• •••• ••••"}
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.45)" }}>NOME</p>
                  <p className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: "rgba(var(--foreground-rgb), 0.92)", letterSpacing: "0.04em", marginTop: 3 }}>
                    {data.name.toUpperCase() || "SEU NOME"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.45)" }}>VALIDADE</p>
                  <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 600, color: "rgba(var(--foreground-rgb), 0.92)", marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
                    {data.expiry || "MM/AA"}
                  </p>
                </div>
              </div>
            </div>

            {/* VERSO */}
            <div
              className="absolute inset-0 flex flex-col"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: 16,
                background: "linear-gradient(135deg, #1a1a1c 0%, #28282b 60%, #1a1a1c 100%)",
                border: "1px solid rgba(var(--foreground-rgb), 0.12)",
                boxShadow: "var(--shadow-float)",
              }}
            >
              <div className="mt-6 h-10 w-full" style={{ background: "rgba(0,0,0,0.6)" }} />
              <div className="flex-1 px-5 pt-6 flex flex-col justify-center gap-2">
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(var(--foreground-rgb), 0.55)" }}>
                  CÓDIGO DE SEGURANÇA (CVV)
                </span>
                <div
                  className="self-end flex items-center px-4"
                  style={{
                    height: 36,
                    minWidth: 80,
                    borderRadius: 6,
                    background: "rgba(var(--foreground-rgb), 0.92)",
                    color: "#1a1a1c",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-base)",
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.18em",
                  }}
                >
                  {data.cvv || "•••"}
                </div>
              </div>
              <div className="px-5 pb-3">
                <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", color: "rgba(var(--foreground-rgb), 0.45)" }}>
                  Esse código está atrás do seu cartão, ao lado da assinatura.
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="px-6 pt-3 pb-5 grid grid-cols-12 gap-4"
        >
          <div className="col-span-12">
            <label style={labelStyle}>Número do cartão <span style={{ color: "var(--primary)" }}>*</span></label>
            <input
              autoFocus={!initial}
              style={inputStyle}
              placeholder="0000 0000 0000 0000"
              value={data.number}
              onChange={(e) => setData((d) => ({ ...d, number: initial ? d.number : maskCardNumber(e.target.value) }))}
              onFocus={() => setIsFlipped(false)}
              inputMode="numeric"
              disabled={!!initial}
            />
          </div>
          <div className="col-span-12">
            <label style={labelStyle}>Nome impresso no cartão <span style={{ color: "var(--primary)" }}>*</span></label>
            <input
              style={inputStyle}
              placeholder="JOÃO DA SILVA"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              onFocus={() => setIsFlipped(false)}
            />
          </div>
          <div className="col-span-7">
            <label style={labelStyle}>Validade <span style={{ color: "var(--primary)" }}>*</span></label>
            <input
              style={inputStyle}
              placeholder="MM/AA"
              value={data.expiry}
              onChange={(e) => setData((d) => ({ ...d, expiry: maskExpiry(e.target.value) }))}
              onFocus={() => setIsFlipped(false)}
              inputMode="numeric"
            />
          </div>
          <div className="col-span-5">
            <label style={labelStyle}>CVV <span style={{ color: "var(--primary)" }}>*</span></label>
            <input
              style={inputStyle}
              placeholder="123"
              value={data.cvv}
              onChange={(e) => setData((d) => ({ ...d, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              inputMode="numeric"
              maxLength={4}
            />
          </div>

          <label className="col-span-12 flex items-center gap-2.5 cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              checked={data.isDefault}
              onChange={(e) => setData((d) => ({ ...d, isDefault: e.target.checked }))}
              className="accent-primary"
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", color: isDark ? "rgba(var(--foreground-rgb), 0.8)" : "rgba(0,0,0,0.8)" }}>
              Definir como cartão padrão
            </span>
          </label>

          <div className="col-span-12 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tonante-ghost min-h-[44px] px-5 py-2 md:min-h-0"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="btn-tonante min-h-[44px] px-5 py-2 md:min-h-0"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 700 }}
            >
              {initial ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
