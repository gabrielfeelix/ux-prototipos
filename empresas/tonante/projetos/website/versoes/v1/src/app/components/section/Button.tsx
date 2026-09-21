import type { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../ui/utils";

/**
 * Button — o único botão de ação do site.
 *
 * Dois eixos, porque misturar os dois foi o que quebrou o sistema anterior:
 *   hierarchy = quanto peso tem  (primary · secondary · tertiary · ghost)
 *   intent    = o que significa  (neutral · buy · danger · brand)
 *
 * Nem toda combinação existe. Âmbar nunca preenche (lê marrom em área grande),
 * então `brand` só vive em `secondary`. Verde só é `primary`: se "Comprar" não
 * é a ação principal da dobra, não é verde.
 *
 * Todo estado muda COR, não só escala — em prefers-reduced-motion a escala some
 * e antes disso sobravam dezenas de botões sem retorno nenhum ao clique.
 *
 * Controles (stepper, seta de carrossel, chip de filtro) NÃO usam este
 * componente: são seleção, não ação.
 *
 * Cuidado com `tailwind-merge`: ele não separa `text-*` de cor e de tamanho.
 * Cor de texto entra sempre como `[color:#fff]`, nunca `text-[#fff]`, ou o
 * `text-[15px]` do size engole a cor.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap",
    "font-semibold [font-family:var(--font-family-inter)] tracking-[0.01em]",
    "cursor-pointer select-none",
    "transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[var(--ease)]",
    // o foco NÃO entra aqui: `as="span"` não recebe foco e o anel ficaria no
    // elemento errado. Ele é aplicado nos ramos <button> e <Link>.
    "hover:scale-[1.02] active:scale-[0.97]",
    "motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:shadow-none aria-disabled:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // alvo de toque: no celular nada abaixo de 44px, mesmo pedindo size="sm"
    "max-md:min-h-11",
  ].join(" "),
  {
    variants: {
      hierarchy: {
        primary: "border-0 [color:#fff] [&_svg]:text-[#fff]",
        secondary: "border-[1.5px] bg-transparent",
        tertiary: "border-0",
        ghost: "border-0 bg-transparent",
      },
      intent: { neutral: "", buy: "", danger: "", brand: "" },
      size: {
        sm: "h-9 px-5 text-[13px]",
        md: "h-11 px-7 text-[14px]",
        lg: "h-[52px] px-9 text-[15px]",
      },
      block: { true: "w-full", false: "" },
      iconOnly: { true: "px-0 gap-0", false: "" },
      onDark: { true: "", false: "" },
      /* `as="span"` não dispara :hover nem :active sozinho — quem passa o
         mouse é o <Link> pai. É o bug que o GhostButton as="span" tem hoje no
         BannerShelf: o botão fica inerte dentro de um banner que reage.
         Aqui os estados são reemitidos como group-hover/group-active, e o
         consumidor só precisa ter `group` no <Link> que envolve. */
      spanHover: { true: "", false: "" },
    },
    compoundVariants: [
      /* ---- iconOnly: quadrado, largura casa com a altura ---- */
      { iconOnly: true, size: "sm", class: "w-9" },
      { iconOnly: true, size: "md", class: "w-11" },
      { iconOnly: true, size: "lg", class: "w-[52px]" },

      /* ---- PRIMARY (preenchido) ---- */
      {
        hierarchy: "primary", intent: "neutral", onDark: false,
        class:
          "[background-color:var(--btn-neutral)] hover:[background-color:var(--btn-neutral-hover)] active:[background-color:var(--btn-neutral-press)] shadow-[var(--shadow-brand-pill)] disabled:[background-color:var(--btn-disabled-bg)] disabled:[color:var(--btn-disabled-ink)]",
      },
      {
        hierarchy: "primary", intent: "buy", onDark: false,
        class:
          "[background-color:var(--buy-green)] hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)] shadow-[var(--shadow-buy-cta-sm)] disabled:[background-color:var(--btn-disabled-bg)] disabled:[color:var(--btn-disabled-ink)]",
      },
      {
        hierarchy: "primary", intent: "danger", onDark: false,
        class:
          "[background-color:var(--btn-danger)] hover:[background-color:var(--btn-danger-hover)] active:[background-color:var(--btn-danger-press)] shadow-[var(--shadow-brand-pill)] disabled:[background-color:var(--btn-disabled-bg)] disabled:[color:var(--btn-disabled-ink)]",
      },
      // primary sobre escuro: neutral inverte (branco com tinta), buy e danger
      // seguram sozinhos sobre stage/foto e não mudam
      {
        hierarchy: "primary", intent: "neutral", onDark: true,
        class:
          "[background-color:#ffffff] [color:var(--btn-neutral)] [&_svg]:text-[var(--btn-neutral)] hover:[background-color:#f0f0f0] active:[background-color:#e0e0e0]",
      },
      {
        hierarchy: "primary", intent: "buy", onDark: true,
        class:
          "[background-color:var(--buy-green)] hover:[background-color:var(--buy-green-hover)] active:[background-color:var(--buy-green-press)]",
      },
      {
        hierarchy: "primary", intent: "danger", onDark: true,
        class:
          "[background-color:var(--btn-danger)] hover:[background-color:var(--btn-danger-hover)] active:[background-color:var(--btn-danger-press)]",
      },

      /* ---- SECONDARY (contorno) ---- */
      {
        hierarchy: "secondary", intent: "neutral", onDark: false,
        class:
          "[border-color:var(--edge-strong)] [color:var(--ink-strong)] hover:[border-color:var(--ink-strong)] hover:[background-color:var(--surface-glass)] active:[background-color:rgba(17,17,17,0.10)] disabled:[border-color:var(--edge-subtle)] disabled:[color:var(--btn-disabled-ink)]",
      },
      {
        hierarchy: "secondary", intent: "danger", onDark: false,
        class:
          "[border-color:var(--btn-danger-edge)] [color:var(--btn-danger)] hover:[border-color:var(--btn-danger)] hover:[background-color:var(--btn-danger-tint)] active:[background-color:var(--btn-danger-tint-press)]",
      },
      {
        hierarchy: "secondary", intent: "brand", onDark: false,
        class:
          "[border-color:var(--btn-brand-edge)] [color:var(--btn-brand-ink)] hover:[border-color:var(--btn-brand-edge-hover)] hover:[background-color:var(--btn-brand-tint)] active:[background-color:var(--btn-brand-tint-press)] active:[color:var(--btn-brand-ink-press)]",
      },
      // secondary sobre foto: é o antigo GhostButton onPhoto. O texto NUNCA
      // muda de cor — inverter para fundo branco jogava a fonte pro escuro e o
      // botão sumia no meio da transição.
      {
        hierarchy: "secondary", onDark: true,
        class:
          "[border-color:rgba(255,255,255,0.85)] [background-color:rgba(255,255,255,0.10)] [color:#fff] [&_svg]:text-[#fff] backdrop-blur-[2px] hover:[border-color:#ffffff] hover:[background-color:rgba(255,255,255,0.22)] active:[background-color:rgba(255,255,255,0.32)] focus-visible:outline-white/70",
      },

      /* ---- TERTIARY (fundo suave) ---- */
      {
        hierarchy: "tertiary", intent: "neutral", onDark: false,
        class:
          "[background-color:var(--surface-glass)] [color:var(--ink-strong)] hover:[background-color:rgba(17,17,17,0.08)] active:[background-color:rgba(17,17,17,0.12)] disabled:[color:var(--btn-disabled-ink)]",
      },
      {
        hierarchy: "tertiary", intent: "danger", onDark: false,
        class:
          "[background-color:var(--btn-danger-tint)] [color:var(--btn-danger)] hover:[background-color:var(--btn-danger-tint-press)] active:[background-color:rgba(179,38,30,0.20)]",
      },
      {
        hierarchy: "tertiary", onDark: true,
        class:
          "[background-color:rgba(255,255,255,0.10)] [color:#fff] [&_svg]:text-[#fff] hover:[background-color:rgba(255,255,255,0.18)] active:[background-color:rgba(255,255,255,0.26)]",
      },

      /* ---- GHOST (só texto) ---- */
      {
        hierarchy: "ghost", intent: "neutral", onDark: false,
        class:
          "[color:var(--ink-muted)] hover:[color:var(--ink-strong)] hover:[background-color:var(--surface-glass)] active:[background-color:rgba(17,17,17,0.10)] disabled:[color:var(--btn-disabled-ink)]",
      },
      {
        hierarchy: "ghost", intent: "danger", onDark: false,
        class:
          "[color:var(--btn-danger)] hover:[background-color:var(--btn-danger-tint)] active:[background-color:var(--btn-danger-tint-press)]",
      },
      {
        hierarchy: "ghost", onDark: true,
        class:
          "[color:rgba(255,255,255,0.82)] hover:[color:#fff] hover:[background-color:rgba(255,255,255,0.12)] active:[background-color:rgba(255,255,255,0.20)] focus-visible:outline-white/70",
      },

      /* ---- as="span": os estados vêm do <Link> pai ---- */
      {
        hierarchy: "secondary", onDark: true, spanHover: true,
        class:
          "group-hover:[border-color:#ffffff] group-hover:[background-color:rgba(255,255,255,0.22)] group-active:[background-color:rgba(255,255,255,0.32)] group-hover:scale-[1.02] group-active:scale-[0.97] motion-reduce:group-hover:scale-100",
      },
      {
        hierarchy: "secondary", onDark: false, spanHover: true,
        class:
          "group-hover:[border-color:var(--ink-strong)] group-hover:[background-color:var(--surface-glass)] group-active:[background-color:rgba(17,17,17,0.10)] group-hover:scale-[1.02] group-active:scale-[0.97] motion-reduce:group-hover:scale-100",
      },
      // a escala própria some no span: quem cresce é o conjunto, via group
      { spanHover: true, class: "hover:scale-100 active:scale-100" },
    ],
    defaultVariants: {
      hierarchy: "primary",
      intent: "neutral",
      size: "md",
      block: false,
      iconOnly: false,
      onDark: false,
      spanHover: false,
    },
  }
);

type ButtonVariantProps = Omit<VariantProps<typeof buttonVariants>, "spanHover">;

type Shared = ButtonVariantProps & {
  /** troca o conteúdo por um spinner, trava a largura e marca aria-busy */
  loading?: boolean;
  children?: ReactNode;
};

type AsButton = Shared & Omit<ComponentProps<"button">, "color"> & { as?: "button" };
type AsLink = Shared & Omit<LinkProps, "color"> & { as: "link" };
/** `as="span"` para quando o botão já está dentro de um <Link> (banner
    inteiro clicável): <a> dentro de <a> é HTML inválido. Nesse caso o foco é
    do <Link> pai, então as classes de foco saem daqui. */
type AsSpan = Shared & Omit<ComponentProps<"span">, "color"> & { as: "span" };

export type ButtonProps = AsButton | AsLink | AsSpan;

const FOCUS_CLASSES =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

function Spinner() {
  return <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />;
}

export function Button(props: ButtonProps) {
  const classes = buttonVariants({
    hierarchy: props.hierarchy,
    intent: props.intent,
    size: props.size,
    block: props.block,
    iconOnly: props.iconOnly,
    onDark: props.onDark,
    spanHover: props.as === "span",
  });
  const body = props.loading ? <Spinner /> : props.children;

  if (props.as === "link") {
    const {
      as: _a, hierarchy: _h, intent: _i, size: _s, block: _b, iconOnly: _io,
      onDark: _od, loading: _l, className, children: _c, ...rest
    } = props;
    return (
      <Link {...rest} className={cn(classes, FOCUS_CLASSES, className)}>
        {body}
      </Link>
    );
  }

  if (props.as === "span") {
    const {
      as: _a, hierarchy: _h, intent: _i, size: _s, block: _b, iconOnly: _io,
      onDark: _od, loading: _l, className, children: _c, ...rest
    } = props;
    // sem FOCUS_CLASSES: o <Link> pai é quem recebe o foco.
    // pointer-events-none para o hover do pai atravessar até aqui.
    return (
      <span {...rest} className={cn(classes, "pointer-events-none", className)}>
        {body}
      </span>
    );
  }

  const {
    as: _a, hierarchy: _h, intent: _i, size: _s, block: _b, iconOnly: _io,
    onDark: _od, loading: _l, className, children: _c, disabled, ...rest
  } = props;
  return (
    <button
      {...rest}
      disabled={disabled || props.loading}
      aria-busy={props.loading || undefined}
      className={cn(classes, FOCUS_CLASSES, className)}
    >
      {body}
    </button>
  );
}

export { buttonVariants };
