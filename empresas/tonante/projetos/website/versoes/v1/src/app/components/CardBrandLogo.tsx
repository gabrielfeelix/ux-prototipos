import visaLogo from "./icons/visa-logo.svg";
import mastercardLogo from "./icons/mastercard-logo.svg";
import amexLogo from "./icons/amex-logo.svg";
import discoverLogo from "./icons/discover-logo.svg";

const LOGOS: Record<string, string> = {
  visa: visaLogo,
  mastercard: mastercardLogo,
  amex: amexLogo,
  americanexpress: amexLogo,
  discover: discoverLogo,
};

const FALLBACK_COLORS: Record<string, string> = {
  elo: "linear-gradient(135deg, #00A4E0 0%, #FFC72C 50%, #EF4123 100%)",
  hipercard: "linear-gradient(135deg, #C8202F 0%, #7B1418 100%)",
  cartão: "linear-gradient(135deg, #404044 0%, #1a1a1c 100%)",
  cartao: "linear-gradient(135deg, #404044 0%, #1a1a1c 100%)",
  "": "linear-gradient(135deg, #404044 0%, #1a1a1c 100%)",
};

export function CardBrandLogo({ brand, className, style }: { brand: string; className?: string; style?: React.CSSProperties }) {
  const key = brand.toLowerCase().replace(/\s+/g, "");
  const src = LOGOS[key];
  if (src) {
    return <img src={src} alt={brand} className={className} style={style} />;
  }
  const bg = FALLBACK_COLORS[key] ?? "linear-gradient(135deg, #404044 0%, #1a1a1c 100%)";
  const label = brand && brand.toLowerCase() !== "cartão" && brand.toLowerCase() !== "cartao"
    ? brand
    : "-";
  return (
    <div className={className} style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
      <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(var(--foreground-rgb), 0.95)", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
        {label}
      </span>
    </div>
  );
}
