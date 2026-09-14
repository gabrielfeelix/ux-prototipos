import type { CSSProperties, ReactNode } from "react";
import { RosetaIcon } from "./RosetaIcon";

type EyebrowProps = {
  children: ReactNode;
  /** undefined → roseta default (§3.3); null → sem ícone; ReactNode → custom. */
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Eyebrow({ children, icon, className = "", style }: EyebrowProps) {
  const resolvedIcon = icon === undefined ? <RosetaIcon size={14} /> : icon;
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      style={{
        fontFamily: "var(--font-family-inter)",
        fontSize: "12.5px",
        fontWeight: 700,
        // 0.3em quebrava a forma da palavra; --amber-text é o âmbar escuro
        // (5:1) que o próprio tema reserva pra texto pequeno
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--amber-text)",
        ...style,
      }}
    >
      {resolvedIcon}
      {children}
    </span>
  );
}
