import type { CSSProperties, ReactNode } from "react";
import { RosetaIcon } from "../../components/section/RosetaIcon";

/* FotoSlot — poço de foto vazio, do tamanho exato da foto final.
 *
 * Existe só enquanto as fotos das landing pages não chegam: ocupa o mesmo
 * espaço, o mesmo raio e o mesmo fundo (--gradient-photo) que a foto vai
 * ocupar, e diz por escrito o que entra ali. Quando a imagem chegar, troca
 * <FotoSlot> por <img> com o mesmo aspect e nada de layout se move.
 *
 * `tone="dark"` é pro que fica dentro das faixas #121213: o mesmo poço em
 * negativo, senão um retângulo claro abre um buraco na faixa escura. */

type FotoSlotProps = {
  /** aspecto CSS, ex.: "4/5", "16/9", "1/1" */
  ratio?: string;
  /** o que vai entrar aqui, em uma linha */
  label: string;
  /** número do prompt no plano de imagens, quando houver */
  prompt?: number;
  tone?: "light" | "dark";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function FotoSlot({
  ratio = "4/5",
  label,
  prompt,
  tone = "light",
  className = "",
  style,
  children,
}: FotoSlotProps) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        borderRadius: "var(--radius-card-lg)",
        background: dark ? "#1a1a1c" : "var(--gradient-photo)",
        /* filete: o poço claro sobre página branca some, e some justamente
           quando ele é pequeno (na dobra de rolagem, por exemplo). A foto
           final não precisa dele, mas o vazio precisa. */
        boxShadow: dark
          ? "inset 0 0 0 1px rgba(255,255,255,0.07)"
          : "inset 0 0 0 1px rgba(17,17,17,0.07)",
        ...style,
      }}
    >
      {/* hachura diagonal fraca: o poço precisa ler como "vazio de propósito",
          não como bloco cinza que alguém esqueceu de estilizar */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${
            dark ? "rgba(255,255,255,0.035)" : "rgba(17,17,17,0.028)"
          } 0 1px, transparent 1px 11px)`,
        }}
      />
      <div className="relative flex max-w-[26ch] flex-col items-center gap-2 px-6 text-center">
        <RosetaIcon size={18} color={dark ? "rgba(255,255,255,0.3)" : "rgba(17,17,17,0.22)"} />
        <span
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.42)" : "rgba(17,17,17,0.38)",
          }}
        >
          {label}
        </span>
        {prompt !== undefined && (
          <span
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "11px",
              fontWeight: 600,
              color: dark ? "rgba(255,255,255,0.26)" : "rgba(17,17,17,0.24)",
            }}
          >
            prompt {prompt}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
