import type { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../ui/utils";

/**
 * GhostButton — CTA transparente para uso SOBRE foto.
 *
 * O CTAButton do DS é chapado (verde/laranja/vermelho) e some quando entra numa
 * arte cheia de cor: vira mais uma mancha na foto. Aqui o botão é só contorno,
 * e o preenchimento só chega no hover — a foto continua sendo o assunto e o
 * clique ainda tem os três estados.
 *
 * Estados
 *   repouso  borda branca translúcida, fundo com um véu (a arte atravessa)
 *   hover    o véu clareia e a borda fecha em branco — o texto NUNCA muda de
 *            cor: inverter pra fundo branco jogava a fonte pro escuro e, sobre
 *            foto, o botão sumia no meio da troca
 *   pressed  véu mais claro ainda e encolhe 1%, pra o clique ter peso
 *
 * variant = onde ele pousa:
 *   onPhoto  (padrão) branco sobre foto escura
 *   onLight  ink sobre fundo claro — mesmo desenho, contraste invertido
 */
const ghostVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 rounded-pill whitespace-nowrap text-center font-semibold [font-family:var(--font-family-inter)] outline-none transition-[background-color,color,border-color,transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-[3px] focus-visible:ring-white/60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* backdrop-blur leve: sobre foto clara o texto branco só se sustenta
           se o vidro segurar alguma coisa atrás dele. */
        onPhoto:
          "border-[1.5px] border-white/85 bg-white/10 [color:#fff] backdrop-blur-[2px] hover:border-white hover:bg-white/22 active:scale-[0.99] active:bg-white/32",
        onLight:
          "border-[1.5px] border-[var(--ink-strong)]/85 bg-transparent [color:var(--ink-strong)] hover:border-[var(--ink-strong)] hover:bg-[var(--ink-strong)]/8 active:scale-[0.99] active:bg-[var(--ink-strong)]/14",
      },
      size: {
        sm: "h-10 px-6 text-[13px]",
        md: "h-12 px-8 text-[14px]",
        lg: "h-[52px] px-10 text-[15px]",
      },
    },
    defaultVariants: { variant: "onPhoto", size: "md" },
  }
);

type GhostVariantProps = VariantProps<typeof ghostVariants>;

type GhostAsButton = GhostVariantProps & ComponentProps<"button"> & { as?: "button"; children?: ReactNode };
type GhostAsLink = GhostVariantProps &
  Omit<LinkProps, "className"> & { as: "link"; className?: string; children?: ReactNode };
/** `as="span"` para quando o botão já está dentro de um <Link> (banner clicável
    inteiro): nesse caso um <a> dentro de outro <a> seria HTML inválido. */
type GhostAsSpan = GhostVariantProps & ComponentProps<"span"> & { as: "span"; children?: ReactNode };

type GhostButtonProps = GhostAsButton | GhostAsLink | GhostAsSpan;

export function GhostButton(props: GhostButtonProps) {
  if (props.as === "link") {
    const { as: _as, variant, size, className, ...rest } = props;
    return <Link {...rest} className={cn(ghostVariants({ variant, size, className }))} />;
  }
  if (props.as === "span") {
    const { as: _as, variant, size, className, ...rest } = props;
    return <span {...rest} className={cn(ghostVariants({ variant, size, className }))} />;
  }
  const { as: _as, variant, size, className, ...rest } = props;
  return <button {...rest} className={cn(ghostVariants({ variant, size, className }))} />;
}

export { ghostVariants };
