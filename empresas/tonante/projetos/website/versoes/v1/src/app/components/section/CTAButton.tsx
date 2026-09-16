import type { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../ui/utils";

/**
 * CTAButton — botao de acao principal do DS.
 *
 * Taxonomia (Figma 1:1):
 *   variant = cor/intencao:  buy (verde) · preorder (laranja) · brand (vermelho)
 *   size    = dimensao:      sm (cards pequenos) · md (cards normais) · lg (blocos de compra)
 *   block   = largura total
 *   as      = "button" (default) | "link" (navega via react-router, visual identico)
 *
 * Estados de cor moram no variant: `buy` tem repouso, hover e pressed via
 * token (--buy-green, --buy-green-hover, --buy-green-press).
 *
 * Forma unica: pilha (rounded-pill). A sombra deriva de variant+size.
 * Onde um consumidor precisa de sombra fora do padrao do tamanho, sobrescreva via className.
 */
const ctaVariants = cva(
  // [color:#fff] e não text-[#fff]: tailwind-merge não distingue arbitrários
  // text-* (cor vs tamanho) e o text-[var(--text-sm)] do size engolia a cor —
  // todo CTA ficava com fonte ink sobre âmbar.
  "inline-flex items-center justify-center gap-2 rounded-pill [color:#fff] [&_svg]:text-[#fff] whitespace-nowrap font-bold transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.97] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* verde CHAPADO, não gradiente: background-image não transiciona, e
           sem transição o hover trocava de cor num corte seco. Cor sólida
           anima, e o botão ganha os três estados que o clique pede —
           repouso, hover e pressed. */
        buy: "[background-color:var(--buy-green)] hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)] tracking-[0.04em]",
        preorder: "[background-image:var(--gradient-preorder-orange)] tracking-[0.04em]",
        brand: "[background-image:var(--gradient-brand)] tracking-[0.05em] uppercase",
      },
      size: {
        sm: "h-10 px-6 text-[var(--text-caption)]",
        md: "h-11 px-8 text-[var(--text-caption)]",
        lg: "h-12 px-10 text-[var(--text-sm)]",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // buy (verde)
      { variant: "buy", size: ["sm", "md"], class: "shadow-[var(--shadow-buy-cta-sm)]" },
      { variant: "buy", size: "lg", class: "shadow-[var(--shadow-buy-cta)]" },
      // preorder (laranja)
      { variant: "preorder", size: ["sm", "md"], class: "shadow-[var(--shadow-preorder-pill)]" },
      { variant: "preorder", size: "lg", class: "shadow-[var(--shadow-preorder-cta)]" },
      // brand (vermelho)
      { variant: "brand", size: ["sm", "md"], class: "shadow-[var(--shadow-brand-pill)]" },
      { variant: "brand", size: "lg", class: "shadow-[var(--shadow-brand-cta)]" },
    ],
    defaultVariants: { variant: "buy", size: "md", block: false },
  }
);

type CTAVariantProps = VariantProps<typeof ctaVariants>;

type CTAButtonAsButton = CTAVariantProps &
  ComponentProps<"button"> & { as?: "button"; children?: ReactNode };

type CTAButtonAsLink = CTAVariantProps &
  Omit<LinkProps, "className"> & { as: "link"; className?: string; children?: ReactNode };

type CTAButtonProps = CTAButtonAsButton | CTAButtonAsLink;

// cor inline: garante texto branco contra qualquer merge/remap de classe
const WHITE = { color: "#fff" } as const;

export function CTAButton(props: CTAButtonProps) {
  if (props.as === "link") {
    const { as: _as, variant, size, block, className, style, ...rest } = props;
    return <Link {...rest} style={{ ...WHITE, ...style }} className={cn(ctaVariants({ variant, size, block, className }))} />;
  }
  const { as: _as, variant, size, block, className, style, ...rest } = props;
  return <button {...rest} style={{ ...WHITE, ...style }} className={cn(ctaVariants({ variant, size, block, className }))} />;
}

export { ctaVariants };
