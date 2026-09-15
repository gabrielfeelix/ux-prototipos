import { ImageWithFallback } from "./figma/ImageWithFallback";
import { isFotoAmbientada, isFotoDesproporcional } from "./photoBackdrop";

/* QuadroFoto — a foto de produto dentro de um quadro, nos três casos.
 *
 *  1. Recorte de estúdio (fundo branco): aparece inteira e o branco some no
 *     fundo do quadro, via `multiply`. É a maioria do catálogo.
 *  2. Ambientada: tem cenário até a borda, então PREENCHE o quadro. Se sobrar
 *     margem, o corte da foto fica visível dentro do card e parece defeito.
 *  3. Ambientada e desproporcional (retrato 240x1167, banner 1200x328): num
 *     quadro quase quadrado, preencher por corte amplia tanto que só sobra uma
 *     tira borrada. Aí a própria foto, desfocada e ampliada, vira o fundo — o
 *     quadro fica cheio — e a foto aparece inteira por cima.
 *
 * Quem sabe em que caso cada arquivo cai é photoBackdrop.ts, medido offline
 * por scripts/classifica-fundo.py: o CDN não manda CORS, então não dá pra
 * olhar pixel no browser.
 *
 * O componente cobre o container (`absolute inset-0`), que precisa ser
 * `position: relative` e, se tiver canto arredondado, `overflow: hidden`.
 */
export function QuadroFoto({
  src,
  alt,
  /* respiro do recorte de estúdio dentro do quadro, ex. "p-6" */
  padding = "",
  /* o fundo do quadro é escuro: `multiply` apagaria a foto */
  semMultiply = false,
  className = "",
  zoom,
}: {
  src: string;
  alt: string;
  padding?: string;
  semMultiply?: boolean;
  className?: string;
  /* transform extra do enquadramento de instrumento (ver instrumentFraming) */
  zoom?: React.CSSProperties;
}) {
  const ambientada = isFotoAmbientada(src);
  const desproporcional = ambientada && isFotoDesproporcional(src);

  if (desproporcional) {
    return (
      <span className={`absolute inset-0 block overflow-hidden ${className}`}>
        <ImageWithFallback
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover"
          style={{ filter: "blur(28px) saturate(1.1)", opacity: 0.85 }}
        />
        <ImageWithFallback src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${ambientada ? "object-cover" : `object-contain ${padding}`} ${className}`}
      style={ambientada || semMultiply ? zoom : { mixBlendMode: "multiply", ...zoom }}
    />
  );
}
