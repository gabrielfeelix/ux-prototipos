import { ShoppingBag } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "./Button";

type QuickAddButtonProps = Omit<ComponentProps<"button">, "color"> & { label?: ReactNode };

/**
 * Wrapper fino sobre o Button enquanto a migração corre. Era um botão à parte,
 * com gradiente próprio e hover só de escala: nas grades onde ele vivia, o
 * único botão de compra do site sem retorno de cor ao passar o mouse.
 *
 * Some na limpeza final; os consumidores passam a chamar o Button direto.
 */
export function QuickAddButton({ label = "Adicionar", className, ...props }: QuickAddButtonProps) {
  return (
    <Button hierarchy="primary" intent="buy" size="lg" block className={className} {...props}>
      <ShoppingBag size={17} strokeWidth={2} />
      {label}
    </Button>
  );
}
