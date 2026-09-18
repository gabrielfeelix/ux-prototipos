import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ctaVariants, Eyebrow } from "../../components/section";
import { Foto } from "./Foto";

/* HeroInstitucional — a abertura padrão das páginas institucionais.
 *
 * Nasceu na página de artistas e virou regra: toda landing institucional abre
 * assim. A receita é curta e é ela que faz a página parecer uma capa e não um
 * cabeçalho de formulário:
 *
 *   1. A FOTO É A DOBRA INTEIRA, sangrando de ponta a ponta, atrás do texto.
 *      Não é um bloco ao lado da tipografia.
 *   2. VÉU EM GRADIENTE NA HORIZONTAL, forte do lado do texto e quase nada do
 *      lado do assunto. É ele que garante contraste mesmo quando a foto muda,
 *      e é por isso que o assunto da foto tem que estar à DIREITA do quadro
 *      (ver `focus`).
 *   3. Título em Fraunces grande, em duas ou três linhas, com medida em rem.
 *      Medida em `ch` não funciona aqui: `ch` usa a fonte do CORPO, e o título
 *      sai uma palavra por linha.
 *   4. Um CTA âmbar e um link de texto com filete, nunca dois botões.
 *
 * `veu` regula a força: fotos já escuras (palco) pedem "leve", fotos claras e
 * uniformes (parede de loja, galpão com claraboia) pedem "forte", senão o
 * título branco encosta no branco da foto. */

type HeroInstitucionalProps = {
  eyebrow: string;
  titulo: ReactNode;
  texto: ReactNode;
  src: string;
  alt: string;
  /** object-position da foto. O assunto precisa sobrar do lado direito. */
  focus?: string;
  veu?: "leve" | "forte";
  cta: { label: string; href: string; externo?: boolean };
  link?: { label: string; href: string; externo?: boolean };
  /** âncora invisível no fim da seção, pro link secundário ter destino */
  ancora?: string;
};

const VEU = {
  leve: "linear-gradient(90deg, rgba(10,10,11,0.86) 0%, rgba(10,10,11,0.62) 46%, rgba(10,10,11,0.18) 100%)",
  forte: "linear-gradient(90deg, rgba(10,10,11,0.94) 0%, rgba(10,10,11,0.78) 46%, rgba(10,10,11,0.34) 100%)",
};

export function HeroInstitucional({
  eyebrow,
  titulo,
  texto,
  src,
  alt,
  focus = "72% center",
  veu = "leve",
  cta,
  link,
  ancora,
}: HeroInstitucionalProps) {
  const externo = (e?: boolean) => (e ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <section className="relative overflow-hidden" style={{ background: "#121213" }}>
      <div className="absolute inset-0">
        <Foto
          src={src}
          alt={alt}
          ratio="auto"
          focus={focus}
          eager
          style={{ height: "100%", width: "100%", borderRadius: 0, aspectRatio: "auto" }}
        />
        <div aria-hidden className="absolute inset-0" style={{ background: VEU[veu] }} />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1280px] flex-col justify-center px-5 py-24 md:px-12 lg:min-h-[86vh]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[min(100%,54rem)]"
        >
          <Eyebrow style={{ color: "var(--amber-bright)" }}>{eyebrow}</Eyebrow>
          <h1
            className="mt-5"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(2.5rem, 5.2vw, 4.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "#fff",
            }}
          >
            {titulo}
          </h1>
          <p
            className="mt-7 max-w-[46ch]"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "clamp(1rem, 1.25vw, 1.1875rem)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {texto}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {/* âncora na própria página: <Link to="#x"> do react-router trata o
                "#" como segmento de rota e sai da página */}
            <a
              href={cta.href}
              {...externo(cta.externo)}
              className={ctaVariants({ variant: "brand", size: "lg" })}
              style={{ color: "#fff" }}
            >
              {cta.label}
            </a>
            {link && (
              <a
                href={link.href}
                {...externo(link.externo)}
                className="group inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {link.label}
                {link.externo ? (
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="block h-px w-6 origin-left transition-transform duration-500 ease-out group-hover:scale-x-150"
                    style={{ background: "var(--amber-bright)" }}
                  />
                )}
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {ancora && <span id={ancora} className="block" style={{ scrollMarginTop: "var(--header-h, 96px)" }} />}
    </section>
  );
}
