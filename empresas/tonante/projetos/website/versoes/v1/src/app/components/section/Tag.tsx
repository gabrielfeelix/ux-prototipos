import type { CSSProperties, ReactNode } from "react";

type Variant = "brand" | "neutral";

type TagProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
};

const RECIPES: Record<Variant, CSSProperties> = {
  brand: {
    background: "rgba(17, 17, 17, 0.08)",
    border: "1px solid rgba(200, 120, 0, 0.35)",
    color: "rgba(200, 120, 0, 0.95)",
  },
  neutral: {
    background: "rgba(var(--foreground-rgb), 0.06)",
    border: "1px solid rgba(var(--foreground-rgb), 0.10)",
    color: "rgba(var(--foreground-rgb), 0.75)",
  },
};

export function Tag({ children, variant = "brand", className = "", style }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1.5 text-[var(--text-caption)] font-semibold ${className}`}
      style={{
        fontFamily: "var(--font-family-inter)",
        ...RECIPES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
