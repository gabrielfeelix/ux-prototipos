import { ShoppingBag } from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

type QuickAddButtonProps = ComponentProps<"button"> & { label?: ReactNode };

const BASE_STYLE: CSSProperties = {
  /* pílula e não --radius-button: raio reto é de controle que encosta em
     input; botão de ação é redondo. */
  borderRadius: "var(--radius-pill)",
  fontFamily: "var(--font-family-inter)",
  fontSize: "16px",
  fontWeight: 600,
  background: "var(--gradient-buy)",
  boxShadow: "var(--shadow-buy-cta-sm)",
};

export function QuickAddButton({ label = "Adicionar", className = "", style, ...props }: QuickAddButtonProps) {
  return (
    <button
      {...props}
      className={`h-[52px] w-full text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${className}`}
      style={{ ...BASE_STYLE, ...style }}
    >
      <ShoppingBag size={17} strokeWidth={2} />
      {label}
    </button>
  );
}
