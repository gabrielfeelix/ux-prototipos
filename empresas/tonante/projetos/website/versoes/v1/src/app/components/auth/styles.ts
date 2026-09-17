/* Vocabulário visual único do fluxo de conta — login, cadastro PF, cadastro PJ
   e recuperação de senha dividem o mesmo campo, a mesma pílula e o mesmo
   caption. Tokens da Tonante: campo em --surface-2 com raio de botão (10px),
   CTA em pílula preta (a mesma do header), âmbar só como acento (foco, link,
   régua da aba ativa). */

export const inputClass =
  "w-full border py-3.5 pl-11 pr-4 transition-[border-color,background-color,box-shadow] duration-200 focus:outline-none";

export const inputStyle = {
  borderRadius: "var(--radius-button)",
  borderColor: "var(--edge)",
  background: "var(--surface-2)",
  color: "var(--ink-strong)",
  fontFamily: "var(--font-family-inter)",
  fontSize: "15px",
} as const;

/* Sem ícone à esquerda (sobrenome, confirmar senha): o padding volta ao normal. */
export const inputNoIconClass = `${inputClass} pl-4`;

export const iconClass = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2";
export const iconStyle = { color: "var(--ink-subtle)" } as const;

export const captionStyle = {
  fontFamily: "var(--font-family-inter)",
  fontSize: "13px",
  color: "var(--ink-muted)",
} as const;

export const errorStyle = {
  fontFamily: "var(--font-family-inter)",
  fontSize: "13px",
  color: "var(--destructive)",
} as const;

/* Pílula preta: é o mesmo botão de "Entrar" do header e do carrinho. O âmbar
   fica de fora porque aqui ele já trabalha como acento — dois âmbares na mesma
   tela e nenhum dos dois quer dizer nada. */
export const primaryButtonClass =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-pill py-3.5 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export const primaryButtonStyle = {
  background: "var(--ink-strong)",
  color: "#ffffff",
  fontFamily: "var(--font-family-inter)",
  fontSize: "15px",
  fontWeight: 600,
  boxShadow: "var(--shadow-brand-cta-sm)",
} as const;

export const ghostButtonClass =
  "flex cursor-pointer items-center justify-center gap-1.5 transition-colors duration-200";

/* Foco visível sem depender de :focus-visible em cada campo: uma regra só,
   herdada do ring âmbar do tema. */
export const fieldFocusClass =
  "focus:border-[rgba(17,17,17,0.30)] focus:bg-white focus:ring-[3px] focus:ring-[rgba(200,120,0,0.16)]";

export const titleStyle = {
  fontFamily: "var(--font-family-figtree)",
  fontSize: "22px",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  color: "var(--ink-strong)",
} as const;
