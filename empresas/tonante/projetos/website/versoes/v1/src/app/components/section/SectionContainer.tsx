import type { CSSProperties, ReactNode } from "react";

type Width = "1200" | "1600" | "1760";
type Pad = "sm" | "md" | "lg" | "xl";

const WIDTHS: Record<Width, string> = {
  "1200": "1200px",
  "1600": "1600px",
  "1760": "1760px",
};

const PADDINGS: Record<Pad, string> = {
  sm: "var(--space-section-sm)",
  md: "var(--space-section-md)",
  lg: "var(--space-section-lg)",
  xl: "var(--space-section-xl)",
};

type SectionContainerProps = {
  children: ReactNode;
  id?: string;
  maxWidth?: Width;
  paddingY?: Pad;
  background?: string;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
};

export function SectionContainer({
  children,
  id,
  maxWidth = "1600",
  paddingY = "md",
  background,
  className = "",
  innerClassName = "",
  style,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`relative px-5 md:px-12 ${className}`}
      style={{
        paddingTop: PADDINGS[paddingY],
        paddingBottom: PADDINGS[paddingY],
        background,
        ...style,
      }}
    >
      <div className={`mx-auto w-full ${innerClassName}`} style={{ maxWidth: WIDTHS[maxWidth] }}>
        {children}
      </div>
    </section>
  );
}
