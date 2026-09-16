import { Rocket } from "lucide-react";
import type { PreOrderInfo } from "../PreOrderData";

type PreOrderPillProps = {
  info: PreOrderInfo;
  compact?: boolean;
  className?: string;
};

export function PreOrderPill({ info, compact = false, className = "" }: PreOrderPillProps) {
  const release = new Date(info.releaseDate);
  const label = release.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill ${className}`}
      style={{
        background: "var(--gradient-preorder-orange)",
        color: "#fff",
        fontFamily: "var(--font-family-inter)",
        fontSize: compact ? "8.5px" : "9.5px",
        fontWeight: 900,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: compact ? "3px 7px" : "4px 9px",
      }}
    >
      <Rocket size={compact ? 8 : 9} strokeWidth={2.6} />
      Pré-venda · {label}
    </span>
  );
}
