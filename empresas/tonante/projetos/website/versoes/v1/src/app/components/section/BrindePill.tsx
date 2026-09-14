import type { CSSProperties, ReactNode } from "react";

type BrindePillProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function BrindePill({ children = "BRINDE", className = "", style }: BrindePillProps) {
  return (
    <span
      className={`rounded-pill bg-foreground/[0.06] px-2 py-0.5 text-primary ${className}`}
      style={{
        fontFamily: "var(--font-family-inter)",
        fontSize: "var(--text-caption)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
