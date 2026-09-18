import type { CSSProperties } from "react";

/* Foto — a imagem já entregue, no mesmo poço que o <FotoSlot> ocupava.
 *
 * Mesmo raio, mesmo fundo (--gradient-photo aparece enquanto a imagem carrega)
 * e mesmo aspect: trocar um pelo outro não mexe em nada do layout em volta.
 *
 * `focus` é o object-position. Vale sempre conferir: as fotos de fábrica têm o
 * assunto fora do centro, e um corte centralizado joga a mão pra fora do
 * quadro. */

type FotoProps = {
  src: string;
  alt: string;
  /** aspecto CSS, ex.: "4/5", "21/9". "auto" quando a caixa é quem manda. */
  ratio?: string;
  focus?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
};

export function Foto({
  src,
  alt,
  ratio = "4/5",
  focus = "center",
  className = "",
  style,
  eager,
}: FotoProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        borderRadius: "var(--radius-card-lg)",
        background: "var(--gradient-photo)",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: focus }}
      />
    </div>
  );
}
