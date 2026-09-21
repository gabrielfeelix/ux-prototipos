# Sistema de botões — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir os 4 sistemas de botão concorrentes por um primitivo único `Button` com dois eixos (hierarquia × intenção), onde todo botão de ação tem hover e pressed de cor.

**Architecture:** Um `Button.tsx` em `section/`, montado em `cva` com `compoundVariants` para cada par hierarquia×intent. As cores saem de tokens novos no `theme.css` (rampa de 3 degraus por intent), nunca de gradiente. `CTAButton`, `GhostButton`, `QuickAddButton`, `.btn-tonante` e `primaryButtonClass` viram wrappers finos durante a migração e são deletados no fim. Uma rota de showcase serve de superfície de verificação visual.

**Tech Stack:** React 19, Vite 6, Tailwind v4, `class-variance-authority`, react-router 7, lucide-react. **Sem framework de teste** — verificação é `npm run typecheck` + `npm run build` + conferência visual na rota de showcase, seguindo a convenção dos planos anteriores deste repo.

**Spec:** `docs/superpowers/specs/2026-09-21-sistema-de-botoes-design.md`

## Global Constraints

- Tailwind v4.1.12. `outline-none` vive na camada `utilities` e vence `@layer base` — nunca usar sem repor foco na mesma classe.
- Tema travado em claro (`ThemeProvider.tsx:35`). Não existe token set escuro; contexto sobre foto/stage é a prop `onDark`.
- Alvo de toque mínimo 44px em viewport `<768px`, independente do `size`.
- Raio: pílula (`rounded-pill`) em todo botão de ação. `--radius-button` fica só para controle que encosta em input.
- Cor sólida, nunca `background-image`, em qualquer estado de botão.
- `scale` é reforço; todo estado precisa de mudança de **cor** também.
- Copy de interface nunca usa travessão (regra do projeto).
- Commits em português, formato `tipo(tonante): frase no presente`.

**Verification convention:** cada task termina com `npm run typecheck` (limpo), `npm run build` (sucesso), conferência visual dos pontos listados, e commit.

---

### Task 1: Tokens da rampa de cor

**Files:**
- Modify: `src/styles/theme.css` (bloco de cor, após a linha 148 `--gradient-buy`)

**Interfaces:**
- Produces: `--btn-neutral`, `--btn-neutral-hover`, `--btn-neutral-press`, `--btn-danger`, `--btn-danger-hover`, `--btn-danger-press`, `--btn-danger-tint`, `--btn-danger-tint-press`, `--btn-brand-edge`, `--btn-brand-edge-hover`, `--btn-brand-ink`, `--btn-brand-ink-press`, `--btn-brand-tint`, `--btn-brand-tint-press`, `--btn-disabled-bg`, `--btn-disabled-ink`. Consumidos pela Task 2.

- [ ] **Step 1: Adicionar o bloco de tokens**

Inserir em `src/styles/theme.css`, logo após a linha `--gradient-buy:` (~148):

```css
  /* ===================================================================
     BOTÕES — rampa de 3 degraus por intenção (repouso / hover / pressed).
     Cor sólida, nunca gradiente: CSS não anima entre dois background-image,
     e era essa a razão de `brand` e `preorder` não terem hover nenhum.
     Contraste medido com texto branco: neutral 18.88:1, danger 6.54:1,
     buy 2.60:1 no repouso (decisão registrada na linha 140) subindo para
     4.64:1 no pressed. Âmbar não preenche botão — ver spec §4.2.
     =================================================================== */
  --btn-neutral:            #111111;
  --btn-neutral-hover:      #2b2b2b;
  --btn-neutral-press:      #000000;

  --btn-danger:             #b3261e;
  --btn-danger-hover:       #9a2019;
  --btn-danger-press:       #821b15;
  --btn-danger-tint:        rgba(179, 38, 30, 0.07);
  --btn-danger-tint-press:  rgba(179, 38, 30, 0.14);
  --btn-danger-edge:        rgba(179, 38, 30, 0.35);

  /* brand só existe como contorno. A borda leva o âmbar da marca (3.42:1,
     acima do mínimo 3:1 de WCAG 1.4.11 para componente); o texto desce um
     degrau para #965a00 (5.59:1) e passa em texto normal. */
  --btn-brand-edge:         #C87800;
  --btn-brand-edge-hover:   #b06a00;
  --btn-brand-ink:          #965a00;
  --btn-brand-ink-press:    #7a4900;
  --btn-brand-tint:         rgba(200, 120, 0, 0.08);
  --btn-brand-tint-press:   rgba(200, 120, 0, 0.16);

  --btn-disabled-bg:        var(--edge-subtle);
  --btn-disabled-ink:       var(--ink-subtle);
```

- [ ] **Step 2: Expor no `@theme` do Tailwind**

`theme.css` tem um bloco que republica tokens para o Tailwind (por volta da
linha 419, onde estão `--shadow-brand-cta` etc). Adicionar ali:

```css
  --color-btn-neutral: var(--btn-neutral);
  --color-btn-danger: var(--btn-danger);
  --color-btn-brand-edge: var(--btn-brand-edge);
  --color-btn-brand-ink: var(--btn-brand-ink);
```

- [ ] **Step 3: Verificar** — `npm run build` → sucesso. Nada muda visualmente ainda (tokens sem consumidor).

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat(tonante): cada intenção de botão ganha uma rampa de três cores"
```

---

### Task 2: O primitivo `Button`

**Files:**
- Create: `src/app/components/section/Button.tsx`
- Modify: `src/app/components/section/index.ts` (exportar)

**Interfaces:**
- Consumes: tokens da Task 1.
- Produces:
  ```ts
  type ButtonHierarchy = "primary" | "secondary" | "tertiary" | "ghost";
  type ButtonIntent = "neutral" | "buy" | "danger" | "brand";
  type ButtonSize = "sm" | "md" | "lg";
  // props: hierarchy?, intent?, size?, block?, onDark?, iconOnly?, loading?,
  //        as?: "button" | "link" | "span", + props nativas de cada um
  export function Button(props): JSX.Element
  export { buttonVariants }
  ```
  Defaults: `hierarchy="primary"`, `intent="neutral"`, `size="md"`.

- [ ] **Step 1: Criar `Button.tsx`**

```tsx
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
        md: "h-11 px-7 text-[15px]",
        lg: "h-[52px] px-9 text-[16px]",
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

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type Shared = ButtonVariantProps & {
  /** troca o conteúdo por um spinner, trava a largura e marca aria-busy */
  loading?: boolean;
  children?: ReactNode;
};

type AsButton = Shared & ComponentProps<"button"> & { as?: "button" };
type AsLink = Shared & Omit<LinkProps, "className"> & { as: "link"; className?: string };
/** `as="span"` para quando o botão já está dentro de um <Link> (banner
    inteiro clicável): <a> dentro de <a> é HTML inválido. Nesse caso o foco é
    do <Link> pai, então as classes de foco saem daqui. */
type AsSpan = Shared & ComponentProps<"span"> & { as: "span" };

export type ButtonProps = AsButton | AsLink | AsSpan;

const FOCUS_CLASSES =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

function Spinner() {
  return <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />;
}

export function Button(props: ButtonProps) {
  const { hierarchy, intent, size, block, iconOnly, onDark, loading, children } = props;
  const classes = buttonVariants({
    hierarchy, intent, size, block, iconOnly, onDark,
    spanHover: props.as === "span",
  });
  const body = loading ? <Spinner /> : children;

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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(classes, FOCUS_CLASSES, className)}
    >
      {body}
    </button>
  );
}

export { buttonVariants };
```

- [ ] **Step 2: Exportar no barril**

`src/app/components/section/index.ts` — adicionar na primeira linha do bloco,
acima de `CTAButton` (o novo vem primeiro; os velhos saem na Task 9):

```ts
export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";
```

- [ ] **Step 3: Verificar** — `npm run typecheck` limpo e `npm run build` com
sucesso. O componente ainda não tem consumidor: o que se verifica aqui é que a
união discriminada `AsButton | AsLink | AsSpan` compila e que o `cn` não
derruba as cores (`[color:#fff]` sobrevive ao `tailwind-merge`, `text-[#fff]`
não — ver `CTAButton.tsx:24`).

- [ ] **Step 4: Commit**

```bash
git add src/app/components/section/Button.tsx src/app/components/section/index.ts
git commit -m "feat(tonante): nasce o botão único, com hierarquia e intenção separadas"
```

---

### Task 3: Showcase em `/ds/botoes`

A superfície de verificação de todas as tasks seguintes. Sem ela, cada
migração vira conferência caso a caso nas páginas reais, e estado como
`pressed` e `loading` não aparece em print.

**Files:**
- Create: `src/app/pages/ds/BotoesPage.tsx`
- Modify: `src/app/routes.tsx` (registrar a rota)

**Interfaces:**
- Consumes: `Button` da Task 2.
- Produces: rota `/ds/botoes`. Nenhum código de produção depende dela.

- [ ] **Step 1: Criar a página**

`src/app/pages/ds/BotoesPage.tsx`. Estrutura obrigatória, de cima para baixo:

1. **Matriz principal** — uma linha por hierarquia (`primary`, `secondary`,
   `tertiary`, `ghost`), uma coluna por intent (`neutral`, `buy`, `danger`,
   `brand`). As seis combinações que a §5 do spec proíbe aparecem como célula
   vazia com o texto "não existe", não como botão. A matriz documenta a regra
   tanto quanto a exibe.
2. **Tamanhos** — `sm` / `md` / `lg` lado a lado, com a altura anotada embaixo
   (36 / 44 / 52). Serve para flagrar override de `h-*` vindo de `className`.
3. **Os seis estados** — rest, hover, pressed, focus-visible, disabled,
   loading. Hover e pressed não dá para forçar por prop: a coluna leva a
   instrução "passe o mouse" / "segure o clique". `focus-visible` ganha um
   botão com `autoFocus` ou a instrução de chegar por Tab. `disabled` e
   `loading` são props de verdade.
4. **Modificadores** — `block`, `iconOnly` (nos três tamanhos) e `loading` com
   rótulo longo, para provar que a largura não pula quando o texto vira
   spinner.
5. **Bloco `onDark`** — repete a matriz dentro de um contêiner
   `[background-color:var(--stage)]` e de outro com foto de fundo. É onde
   `secondary onDark` (o antigo `GhostButton onPhoto`) é conferido.
6. **Bloco `as="span"`** — um `<Link className="group">` envolvendo um
   `Button as="span"`, ao lado de um `Button as="span"` **sem** `group` no
   pai. O primeiro reage ao passar o mouse em qualquer ponto do cartão; o
   segundo fica inerte. É a demonstração do bug do `BannerShelf` e da correção.

Convenções: a página não entra no `RootLayout` com header e footer completos
se isso atrapalhar a leitura, mas **precisa** herdar o `theme.css`. Rótulos em
português, sem travessão. Fundo neutro claro, cada bloco com um `<h2>` e uma
linha de legenda explicando o que se olha ali.

- [ ] **Step 2: Registrar a rota**

`src/app/routes.tsx`. **A posição importa:** `/ds/botoes` tem dois segmentos e
seria capturado por `{ path: ":category/:subcategory" }`. Entrar junto das
rotas estáticas, antes do bloco "Semantic URL routes" — por exemplo logo após
a linha do `afinador`:

```tsx
      /* Showcase do sistema de botões. Rota de desenvolvimento: não é
         linkada em lugar nenhum e não entra no sitemap. Precisa ficar acima
         do bloco de ":category/:subcategory", que engoliria /ds/botoes. */
      { path: "ds/botoes", element: carregar(() => import("./pages/ds/BotoesPage"), "BotoesPage") },
```

- [ ] **Step 3: Verificar**

- `npm run typecheck` limpo, `npm run build` com sucesso.
- `npm run dev` e abrir `/ds/botoes`: as 10 combinações válidas renderizam, as
  6 inválidas aparecem como célula vazia.
- Passar o mouse em um botão de cada hierarquia: **a cor muda**, não só a
  escala. Segurar o clique: a cor muda de novo.
- Tab pela página: anel de foco visível em todo botão, inclusive nos `onDark`.
- DevTools com `prefers-reduced-motion: reduce`: a escala some, a cor fica.
- Estreitar para 375px: nenhum botão abaixo de 44px de altura, nem os `sm`.
- Print dos blocos principais para o Gabriel.

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/ds/BotoesPage.tsx src/app/routes.tsx
git commit -m "feat(tonante): o sistema de botões ganha uma página onde dá pra ver todos"
```

---

### Task 4: Carrinho e checkout (prioridade 1)

O passo mais crítico do funil é o que mais troca de vocabulário: o carrinho
tem **dois "Finalizar compra" diferentes** (`:1003` cru com hover de escala,
`:1221` `CTAButton` com três estados) e 4 botões pintados com
`--gradient-brand`, o marrom que abriu esta frente.

**Files:**
- Modify: `src/app/components/CartPage.tsx`
- Modify: `src/app/components/CartDrawer.tsx`
- Modify: `src/app/components/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `Button`.
- Produces: nenhuma API nova. `CheckoutPage` deixa de importar `CTAButton`.

- [ ] **Step 1: `CartPage.tsx`**

Mapeamento do spec §11, tabela "Compra e conversão". Um a um:

| Linha | Hoje | Alvo |
|---|---|---|
| `:258` "Explorar produtos" | `--gradient-brand` | `primary/neutral lg` |
| `:317` "Limpar" | raw, hover cor | `ghost/danger sm` |
| `:357` "Escolher brinde" | `--gradient-brand` | `secondary/neutral md` |
| `:820` "Aplicar" cupom | `--gradient-brand` | `primary/neutral sm` |
| `:1003` "Finalizar compra" desktop | raw `--gradient-buy` | `primary/buy lg block` |
| `:1169` "Selecionar presente" | `--gradient-brand` | `primary/neutral md` |
| `:1221` "Finalizar compra" mobile | `CTAButton buy md` | `primary/buy lg block` |

Os números de linha são do estado de 21/09 e **vão andar** conforme a edição
avança; conferir pelo rótulo, não pela linha. Ao trocar, apagar também o
`className` de altura, raio, sombra e hover que sobrava em cada um: se ficar
`h-12` ou `rounded-[10px]` no `className`, o `tailwind-merge` deixa vencer e o
tamanho do primitivo é ignorado.

- [ ] **Step 2: `CartDrawer.tsx`**

`:446` "Continuar comprando" → `secondary/neutral lg block`;
`:451` "Revisar pedido" → `primary/buy lg block`;
`:466` "Limpar carrinho" → `ghost/danger sm`;
`:603` "Adicionar presente" (`CTAButton buy md`) → `primary/buy md`.

- [ ] **Step 3: `CheckoutPage.tsx`**

Troca mecânica dos 11 `CTAButton`: `variant="ink"` → `hierarchy="primary"
intent="neutral"`, `variant="buy"` → `hierarchy="primary" intent="buy"`.
`:1696` "Voltar" (raw com hover de fundo) → `ghost/neutral md`. Remover o
import de `CTAButton` do arquivo.

- [ ] **Step 4: Verificar**

- `npm run typecheck` limpo, `npm run build` com sucesso.
- `grep -n "gradient-brand" src/app/components/CartPage.tsx` → nenhum botão.
- `grep -n "CTAButton" src/app/components/CheckoutPage.tsx` → 0.
- Percorrer o funil no navegador: produto → carrinho → drawer → checkout. Os
  dois "Finalizar compra" (desktop e mobile, estreitar a janela) têm agora o
  mesmo verde, a mesma altura e o mesmo hover.
- Print do carrinho desktop, do carrinho mobile e do drawer.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/CartPage.tsx src/app/components/CartDrawer.tsx src/app/components/CheckoutPage.tsx
git commit -m "fix(tonante): o carrinho e o checkout passam a falar a mesma língua de botão"
```

---

### Task 5: PDP e catálogo (prioridade 2)

Onde vivem os cinco desenhos diferentes de "Comprar" e o "Adicionar à sacola"
âmbar sem hover nenhum.

**Files:**
- Modify: `src/app/components/ProductPage.tsx`
- Modify: `src/app/components/ProductCard.tsx`
- Modify: `src/app/v2/ProductCardV2.tsx`
- Modify: `src/app/components/ProductsPage.tsx`
- Modify: `src/app/pages/ComparePage.tsx`
- Modify: `src/app/components/CompareBar.tsx`
- Modify: `src/app/components/KitDescription.tsx`
- Modify: `src/app/components/PreOrderBanner.tsx`
- Modify: `src/app/components/PreOrderPage.tsx`
- Modify: `src/app/components/section/QuickAddButton.tsx` (vira wrapper fino)

**Interfaces:**
- Consumes: `Button`.
- Produces: `QuickAddButton` passa a renderizar `Button primary buy sm block`
  por dentro, mantendo a assinatura. Os consumidores (`PopularGrid`,
  `ProductCarousel`) não mudam nesta task; o componente só é deletado na
  Task 9, e `PopularGrid` é código morto de qualquer jeito.

- [ ] **Step 1: `ProductPage.tsx`**

`:921` sticky, `:1269` mobile, `:2843` sticky mobile → todos
`primary/buy lg block`. No `:2843` sai o `h-12` forçado no `className`.
No `:1269`, **"Reservar" continua verde**: pré-venda é estado do produto, o
rótulo muda e a cor não (spec §4.2). O laranja da campanha vive no
`PreOrderPill` ao lado.
`:1577` "Escrever uma avaliação" → `secondary/neutral md block`;
`:1959` "Enviar Avaliação" → `primary/neutral md block`;
`:2188` "Ver descrição completa" → `tertiary/neutral md block`.

- [ ] **Step 2: Cards**

`ProductCard.tsx:459` "Adicionar à sacola" → `primary/buy md block`;
`:471` "Ver página completa" → `ghost/neutral md block`.
`ProductCardV2.tsx:308` desktop → `primary/buy lg block`; `:422` mobile →
`primary/buy lg block`. **Comprar em card é sempre `lg`**: em `md` o rótulo
fica mais fraco que o nome do produto e a altura encosta no piso de toque.
As duas medidas do card já foram subidas para 52/16 na conferência de 21/09;
aqui é só trocar o `<button>` cru pelo primitivo, sem mexer no tamanho.

- [ ] **Step 3: `ProductsPage.tsx`**

`:1509` "Limpar filtros" → `secondary/neutral md`;
`:1601` "Comprar" lista mobile → `primary/buy lg block`;
`:1637` "Comprar" lista desktop → `primary/buy md`;
`:1720` "Carregar mais" → `secondary/neutral lg block`;
`:1772` "Mostrar N resultados" → `primary/neutral md block`;
`:1968` "Comprar" quick view → `primary/buy lg block`.

- [ ] **Step 4: Comparador, kit e pré-venda**

`ComparePage.tsx:131` "Ver o catálogo" → `primary/neutral md`;
`:263` "Comprar agora" → `primary/buy lg block`.
`CompareBar.tsx:276` "Limpar" → `ghost/neutral sm`;
`:284` "Comparar agora" → `primary/neutral md`.
`KitDescription.tsx:169` "Ouvir como soa" → `primary/neutral lg block`;
`:332` "Comparar os kits" → `secondary/neutral md` (é `Link`, então
`as="link"`).
`PreOrderBanner.tsx:313` "Comprar agora" → `primary/buy lg block`, com o
`PreOrderPill` ao lado carregando o laranja.
`PreOrderPage.tsx:300` "Reservar" — hoje é um `<span>` sem estado nenhum —
vira `primary/buy md` de verdade; `:1065` "Limpar filtros" →
`secondary/neutral md`.

- [ ] **Step 5: `QuickAddButton` vira wrapper**

Manter a assinatura pública e trocar o corpo por `Button hierarchy="primary"
intent="buy" size="lg" block`. Some o `--gradient-buy` e o hover de escala
sozinho. Comentário no topo dizendo que o arquivo é ponte e sai na Task 9.

- [ ] **Step 6: Verificar**

- `npm run typecheck` limpo, `npm run build` com sucesso.
- Os cinco "Comprar" (PDP sticky, card desktop, card mobile, lista, quick
  view) lado a lado: mesmo verde, mesmo hover, mesma pílula.
- `ProductCard` "Adicionar à sacola": antes hover NADA, agora muda de cor.
- `grep -rn "gradient-buy" src/app/components/ProductsPage.tsx` → nenhum botão.
- Print do catálogo em grade, do catálogo em lista, do card mobile e da PDP.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/ProductPage.tsx src/app/components/ProductCard.tsx src/app/v2/ProductCardV2.tsx src/app/components/ProductsPage.tsx src/app/pages/ComparePage.tsx src/app/components/CompareBar.tsx src/app/components/KitDescription.tsx src/app/components/PreOrderBanner.tsx src/app/components/PreOrderPage.tsx src/app/components/section/QuickAddButton.tsx
git commit -m "fix(tonante): existe um só jeito de comprar, e ele responde ao mouse"
```

---

### Task 6: Perfil, auth e modais (prioridade 3)

Mata dois dos quatro sistemas paralelos: o CSS global `.btn-tonante` e a
constante `primaryButtonClass`.

**Files:**
- Modify: `src/app/components/ProfilePage.tsx` (21× `.btn-tonante`, 6× ghost)
- Modify: `src/app/components/AuthModal.tsx`
- Modify: `src/app/components/auth/ForgotPasswordForm.tsx`
- Modify: `src/app/components/auth/RegisterCompanyForm.tsx`
- Modify: `src/app/components/auth/SocialButtons.tsx`
- Modify: `src/app/components/auth/styles.ts` (esvaziar o bloco de botão)
- Modify: `src/app/components/AddressFormModal.tsx`
- Modify: `src/app/components/CardFormModal.tsx`
- Modify: `src/app/components/ConfirmDialog.tsx`
- Modify: `src/app/components/ReviewModal.tsx`
- Modify: `src/styles/theme.css` (remover `.btn-tonante` e `-ghost`, 912-934)

**Interfaces:**
- Consumes: `Button`.
- Produces: `auth/styles.ts` deixa de exportar `primaryButtonClass` e
  `primaryButtonStyle`. Conferir com `grep -rn "primaryButton" src` que
  sobrou zero consumidor **antes** de apagar.

- [ ] **Step 1: `ProfilePage.tsx`**

As 21 ocorrências de `.btn-tonante` → `primary/neutral`; as 6 de
`.btn-tonante-ghost` → `secondary/neutral`. O tamanho segue o contexto: `md`
por padrão, `sm` dentro de linha de tabela ou de cartão denso.
Casos próprios: `:1228` "Cancelar Pedido" (`bg-red-500/5` inventado na hora) →
`secondary/danger md`; `:1647` e `:1788` "Remover" → `ghost/danger sm`;
`:1885` "Ativar" 2FA (verde, sem raio nenhum) → `primary/neutral sm` — verde
aqui era ruído: ativar 2FA não é comprar.

- [ ] **Step 2: Auth**

`AuthModal.tsx:338` "Entrar"/"Criar conta" → `primary/neutral lg block`;
`ForgotPasswordForm.tsx:82` "Enviar link" → idem;
`RegisterCompanyForm.tsx:386` "Continuar" → idem, `:380` "Voltar" →
`secondary/neutral lg`;
`SocialButtons.tsx:24` "Continuar com Google" → `secondary/neutral lg block`
(o ícone do Google fica, só o chrome do botão muda).
Todo formulário com envio assíncrono passa a usar `loading` em vez do texto
"Enviando..." trocado na mão, quando já existir estado de envio no arquivo.
Depois, apagar o bloco de botão de `auth/styles.ts`.

- [ ] **Step 3: Modais**

`AddressFormModal.tsx:167` e `CardFormModal.tsx:344` "Salvar" →
`primary/neutral md`; `:159` e `:336` "Cancelar" → `ghost/neutral md`.
`ConfirmDialog.tsx:75` "Confirmar" → `primary/neutral md`, ou
`primary/danger md` quando a ação destrói alguma coisa (é o que o componente
já tenta sinalizar com o vermelho ad-hoc); `:60` "Cancelar" →
`ghost/neutral md`.
`ReviewModal.tsx:269` "Enviar avaliação" → `primary/neutral md`; `:265`
"Cancelar" → `ghost/neutral md`.

- [ ] **Step 4: Apagar o CSS global**

`theme.css:912-934`: remover `.btn-tonante` e `.btn-tonante-ghost`. Antes,
`grep -rn "btn-tonante" src public` para confirmar zero consumidor — inclusive
em `public/pages/*.html`, que têm cascata própria.

- [ ] **Step 5: Verificar**

- `npm run typecheck` limpo, `npm run build` com sucesso.
- `grep -rn "btn-tonante\|primaryButtonClass" src public` → 0.
- Abrir perfil, modal de login, modal de endereço, modal de cartão e o dialog
  de confirmação: todo botão tem hover e pressed de cor.
- "Cancelar Pedido" e "Remover" agora são visivelmente destrutivos sem gritar.
- Print do perfil e do modal de login.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/ProfilePage.tsx src/app/components/AuthModal.tsx src/app/components/auth src/app/components/AddressFormModal.tsx src/app/components/CardFormModal.tsx src/app/components/ConfirmDialog.tsx src/app/components/ReviewModal.tsx src/styles/theme.css
git commit -m "fix(tonante): perfil, login e modais largam o CSS antigo de botão"
```

---

### Task 7: Institucional e ferramentas (prioridade 4)

Aqui entra drivers, que foi a pergunta que abriu tudo: *por que o botão é
marrom e por que não tem hover*. E aqui morrem `CTAButton` e `GhostButton`.

**Files:**
- Modify: `src/app/pages/lp/HeroInstitucional.tsx`
- Modify: `src/app/pages/RevendaPage.tsx`, `ArtistasPage.tsx`,
  `TrabalheConoscoPage.tsx`, `QuemSomosPage.tsx`, `MonteSeuPcPage.tsx`
- Modify: `src/app/pages/afinador/AfinadorPage.tsx`
- Modify: `src/app/pages/DriverDetailPage.tsx`, `DriversManuaisPage.tsx`
- Modify: `src/app/pages/monte-seu-kit/MontarPage.tsx`, `AjudaPage.tsx`
- Modify: `src/app/components/MonteSeuKit.tsx`, `GuiaIniciante.tsx`,
  `Newsletter.tsx`, `StoryBand.tsx`, `MusicosTonante.tsx`,
  `LinhasDeViolao.tsx`, `CookieConsent.tsx`, `WelcomePopup.tsx`,
  `ProductShelf.tsx`
- Modify: `src/app/v2/Video70Anos.tsx`, `HeaderV2.tsx`, `MobileMenu.tsx`,
  `BannerShelf.tsx`

**Interfaces:**
- Consumes: `Button`.
- Produces: `CTAButton` e `GhostButton` sem consumidor ao fim da task.

- [ ] **Step 1: Landings institucionais**

`HeroInstitucional.tsx:112` (usado por Revenda, Artistas e Trabalhe Conosco) —
`CTAButton brand lg` → `primary/neutral lg`. **É a correção central do âmbar:**
a abertura institucional passa a ser preta, e o acento âmbar vira um
`secondary/brand` ao lado quando a tela pedir.
`RevendaPage.tsx:628` e `ArtistasPage.tsx:548`, `:410` → `primary/neutral lg
block`. `TrabalheConoscoPage.tsx:632` "Ver vagas abertas" (`ctaVariants brand
lg`) → `primary/neutral lg`.
`StoryBand.tsx:90` "Conheça a história" e `QuemSomosPage.tsx:325` "Escrever a
minha" → `secondary/brand md`. São os dois lugares onde o âmbar **fica**: como
contorno, que é onde a cor canta.

- [ ] **Step 2: Drivers**

`DriverDetailPage.tsx`: `:94` "Baixar driver" → `primary/neutral md`, "Baixar
manual" → `secondary/neutral md`; `:290` "Ver downloads" →
`primary/neutral md`; `:309` "Página do Produto" → `secondary/neutral md`;
`:149` "Voltar para Drivers" → `secondary/neutral md` (voltar não é a ação
principal da tela; era primário por inércia).
`DriversManuaisPage.tsx:297` "Limpar filtros" → `tertiary/neutral md`.

- [ ] **Step 3: Ferramentas**

`AfinadorPage.tsx:390` "Afinar tudo" → `primary/neutral md block`; `:393`
"Parar" → `secondary/neutral md onDark` (o afinador roda sobre o stage escuro).
`MontarPage.tsx:356` e `:787` "Continuar"/"Revisar" → `primary/neutral md
block`; `:797` "Pular esta etapa" → `ghost/neutral md block`; `:1013` "Levar o
kit" → `primary/buy lg block`.
`AjudaPage.tsx:178` "Continuar" → `primary/neutral lg block`; `:746` "Ver o
kit" → `primary/neutral md`; `:789` "Falar com um músico" →
`secondary/neutral md`.
`MonteSeuKit.tsx:255` "Adicionar kit" → `primary/buy md`.
`MonteSeuPcPage.tsx`: 6× `bg-primary` → `primary/neutral md`; 3×
`--gradient-buy` → `primary/buy lg`.

- [ ] **Step 4: Home, header e avulsos**

`HeaderV2.tsx:448` "Entrar" → `primary/neutral md block`; `:455` "Criar conta"
→ `secondary/neutral md block`. `MobileMenu.tsx:188`/`:195` → idem em `md`.
`WelcomePopup.tsx:217` "Cadastrar" (quadrado de 42px) → `primary/neutral md`
com `iconOnly`.
`GuiaIniciante.tsx:57` "Ver violões para começar" → `primary/neutral md`;
`Newsletter.tsx:141` e `:173` "Assinar" → `primary/neutral md`;
`CookieConsent.tsx:58` "Aceitar" → `primary/neutral sm`, `:54` "Rejeitar" →
`ghost/neutral sm`.
`MusicosTonante.tsx:272` "Comprar agora" → `primary/buy md` (sai o hover
controlado por state em JS);
`LinhasDeViolao.tsx:86` "Conhecer a linha" → `secondary/neutral md onDark`;
`Video70Anos.tsx:159` "Ver coleção" → `secondary/neutral lg onDark`.

- [ ] **Step 5: `as="span"` no `BannerShelf` e no `ProductShelf`**

`BannerShelf.tsx:133` e `ProductShelf.tsx:361` usam `GhostButton as="span"`
dentro de um `<Link>`. Trocar por `Button as="span" hierarchy="secondary"
onDark` e **adicionar `group` ao `<Link>` que envolve** — sem isso os estados
`group-hover:` não disparam e o botão continua inerte, que é o bug de hoje. O
anel de foco sai do `span` e fica no `<Link>`: conferir que o `<Link>` tem
`focus-visible:outline-*` próprio, e acrescentar se não tiver.

- [ ] **Step 6: Verificar**

- `npm run typecheck` limpo, `npm run build` com sucesso.
- `grep -rn "CTAButton\|GhostButton" --include=*.tsx src/app` → só os próprios
  arquivos de definição.
- Abrir `/drivers-e-manuais/:slug`: o botão está **preto**, não marrom, e tem
  hover. É a resposta à pergunta que abriu a frente.
- Abrir Revenda, Artistas e Trabalhe Conosco: abertura preta, acento âmbar só
  como contorno.
- Passar o mouse em qualquer ponto do banner da home: o botão dentro do banner
  reage junto.
- Afinador e Video70Anos: `onDark` legível, texto não some no hover.
- Print de drivers, de uma landing institucional e do banner da home.

- [ ] **Step 7: Commit**

```bash
git add src/app/pages src/app/components src/app/v2
git commit -m "fix(tonante): o botão de drivers fica preto e as landings largam o marrom"
```

---

### Task 8: Foco de teclado

O anel global do `theme.css:557-571` cita WCAG 2.4.7 e é morto em massa por
`outline-none` da camada `utilities` do Tailwind v4, que vence `@layer base`
por ordem de cascata e não por especificidade.

**Files:**
- Modify: todos os arquivos que a varredura listar.

**Interfaces:** nenhuma.

- [ ] **Step 1: Levantar a lista**

```bash
grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible
```

Em 21/09 dava 34; depois dos commits vindos da outra sessão está em **39**.
Rodar de novo antes de começar: o número é o alvo, e ele anda.

- [ ] **Step 2: Corrigir, um por um**

Duas saídas, e a escolha é por caso:

1. **Apagar o `outline-none`** quando não havia motivo para ele. É o caminho
   preferido: o anel global volta sozinho.
2. **Repor na mesma classe** quando o `outline-none` existe para tirar o anel
   feio do navegador de um elemento com chrome próprio:
   `focus-visible:outline-2 focus-visible:outline-offset-2
   focus-visible:outline-[var(--ring)]`.

Concentrações conhecidas: 8 em `MonteSeuPcPage`, 6 em `HeaderV2`, 6 em
`AfinadorPage`, 5 em `AjudaPage`, 4 em `Navbar` — este último é `/legado` e
código morto (`Navbar.tsx:1051`), então **não migrar**, só conferir que o grep
final não conta rota viva. Se o grep não zerar por causa do `/legado`,
documentar a exceção aqui em vez de mexer no arquivo.

Elementos que não são botão (input, select, área rolável com `tabIndex`) também
contam: o critério é receber foco, não ser `<button>`.

- [ ] **Step 3: Verificar**

- `grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible`
  → 0 fora de `/legado`.
- Navegar o site inteiro só de Tab: home, PDP, carrinho, checkout, perfil,
  afinador, monte-seu-kit. Nenhum salto invisível.
- `npm run typecheck` limpo, `npm run build` com sucesso.

- [ ] **Step 4: Commit**

```bash
git add -A src/app
git commit -m "fix(tonante): dá pra ver onde o teclado está em todas as telas"
```

---

### Task 9: Limpeza e documentação

**Files:**
- Delete: `src/app/components/section/CTAButton.tsx`,
  `GhostButton.tsx`, `QuickAddButton.tsx`
- Modify: `src/app/components/section/index.ts`
- Modify: `src/app/components/auth/styles.ts` (se sobrou resto de botão)
- Modify: `src/styles/theme.css` (gradientes de botão)
- Modify: `docs/STATE.md`
- Create: `docs/DECISIONS.md`

- [ ] **Step 1: Conferir que ninguém mais importa**

```bash
grep -rn "CTAButton\|ctaVariants\|GhostButton\|ghostVariants\|QuickAddButton" src
```

Só pode sobrar `PopularGrid.tsx` e `ProductCarousel.tsx` se `QuickAddButton`
ainda estiver de pé. `PopularGrid` é código morto (nenhum import);
`ProductCarousel` precisa trocar para `Button primary buy sm block` direto
antes de apagar o wrapper.

- [ ] **Step 2: Apagar**

Os três arquivos e as linhas correspondentes do `index.ts`.

- [ ] **Step 3: Gradientes**

`--gradient-brand`, `--gradient-buy` e `--gradient-preorder-orange` continuam
existindo, mas só para pill e badge (`PreOrderPill`, `DiscountBadge`).
Conferir com `grep -rn "gradient-brand\|gradient-buy\|gradient-preorder" src`
que nenhum consumidor restante é botão, e acrescentar no comentário do token,
no `theme.css`, que gradiente não entra em botão porque não transiciona.

- [ ] **Step 4: `docs/DECISIONS.md`**

O arquivo ainda não existe. Criar em formato append-only, uma entrada por
decisão, cada uma citando commit, caminho ou número medido. Entradas desta
frente:

- Dois eixos (`hierarchy` × `intent`) em vez de `variant`, e por quê.
- Âmbar nunca preenche botão: `#C87800` chapado lê marrom; como texto dá
  3.42:1 e reprova. `brand` só existe como `secondary`, texto `#965a00`
  (5.59:1).
- `preorder` sai como intent: `#e08c12` dá 2.65:1; escurecer até passar em 3:1
  devolve o âmbar da marca. Pré-venda vira estado do produto.
- `buy` mantido em 2.60:1 no repouso, herdando a decisão registrada em
  `theme.css:140`. Não reaberta.
- Cor sólida e nunca gradiente em botão: gradiente não transiciona, e era a
  causa raiz do hover morto.
- Verde só é primário; vermelho é intenção, não hierarquia.
- Controles (stepper, seta de carrossel, chip, aba, swatch, dot, step) ficam
  fora do `Button` e merecem um `Chip`/`Toggle` próprio numa rodada futura.
- Foco declarado na classe do próprio componente porque `outline-none` da
  camada `utilities` do Tailwind v4 vence `@layer base` por ordem de cascata.

- [ ] **Step 5: `docs/STATE.md`**

Atualizar (o arquivo é sobrescrito, não acumula): o sistema de botões agora é
`section/Button.tsx`, dois eixos, showcase em `/ds/botoes`, os quatro sistemas
antigos apagados. Registrar o que **não** foi migrado e continua pendente:
`public/pages/*.html` com o vermelho pcyes, o primitivo `Chip`/`Toggle` dos
controles, e o `/legado`.

- [ ] **Step 6: Verificar contra o critério de pronto do spec §13**

```bash
npm run typecheck
npm run build
grep -rn "bg-primary\|var(--gradient-brand)" --include=*.tsx src/app   # nenhum botão
grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible # 0 fora de /legado
grep -rn "btn-tonante\|primaryButtonClass" src public                   # 0
grep -rn "CTAButton\|GhostButton\|QuickAddButton" src                   # 0
```

Mais a conferência visual final em `/ds/botoes` e um passeio pelo funil
completo. Print para o Gabriel.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(tonante): saem os quatro sistemas de botão que o novo substituiu"
```
