import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { Download, ArrowUpRight, ArrowLeft, ShieldCheck, FileBox } from "lucide-react";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getDriverBySlug, type DriverFile } from "../components/driversData";

const DOWNLOADS_ANCHOR = "downloads";

/* Format an ISO yyyy-mm-dd date to pt-BR dd/mm/aaaa */
function formatDatePtBR(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

/* ═══════════════════════════════════════════════════════
   DOWNLOAD CARD
   ═══════════════════════════════════════════════════════ */

function DownloadCard({
  kind,
  file,
  title,
  description,
}: {
  kind: "driver" | "manual";
  file: DriverFile;
  title: string;
  description: string;
}) {
  const [downloaded, setDownloaded] = useState(false);
  const isPdf = file.format === "PDF";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-foreground/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20">
      {/* Format chip */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            fontFamily: "var(--font-family-inter)",
            fontSize: "var(--text-caption)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            ...(isPdf
              ? {
                  background: "rgba(17, 17, 17, 0.08)",
                  color: "var(--primary)",
                  border: "1px solid rgba(200, 120, 0,0.32)",
                }
              : {
                  background: "rgba(var(--foreground-rgb), 0.07)",
                  color: "rgb(var(--foreground-rgb))",
                  border: "1px solid rgba(var(--foreground-rgb), 0.12)",
                }),
          }}
        >
          <FileBox size={12} />
          {file.format}
        </span>
        <span
          className="text-foreground/40"
          style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
        >
          {file.sizeLabel}
        </span>
      </div>

      {/* Title + description */}
      <p
        className="mt-5 text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 500, lineHeight: 1.25 }}
      >
        {title}
      </p>
      <p
        className="mt-2 text-foreground/55"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.55 }}
      >
        {description}
      </p>

      {/* Meta */}
      <p
        className="mt-4 text-foreground/40"
        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}
      >
        Última atualização: {formatDatePtBR(file.updatedAt)}
      </p>

      {/* Download button */}
      <button
        type="button"
        onClick={() => setDownloaded(true)}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
          kind === "driver"
            ? "bg-primary [color:#fff]"
            : "border border-foreground/15 bg-foreground/[0.04] text-foreground hover:border-foreground/30"
        }`}
        style={{
          fontFamily: "var(--font-family-inter)",
          fontSize: "var(--text-sm)",
          fontWeight: 700,
          letterSpacing: "0.02em",
          ...(kind === "driver"
            ? { boxShadow: "0 12px 28px -10px rgba(200, 120, 0,0.55)" }
            : {}),
        }}
        aria-label={`Baixar ${title}`}
      >
        <Download size={15} />
        {downloaded ? "Download iniciado" : `Baixar ${kind === "driver" ? "driver" : "manual"}`}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NOT FOUND STATE
   ═══════════════════════════════════════════════════════ */

function DriverNotFound() {
  return (
    <>
      <section className="pt-10 md:pt-14" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto flex min-h-[52vh] max-w-[1434px] flex-col items-center justify-center px-5 py-24 text-center md:px-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground/40">
            <FileBox size={26} />
          </div>
          <h1
            className="mt-6 text-foreground"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(28px, 4vw, 38px)",
              fontWeight: 500,
            }}
          >
            Produto não encontrado
          </h1>
          <p
            className="mt-3 max-w-[440px] text-foreground/55"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.6 }}
          >
            Não localizamos drivers ou manuais para este produto. Ele pode ter sido movido ou o endereço está
            incorreto.
          </p>
          <Link
            to="/drivers-e-manuais"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 [color:#fff] transition-transform hover:scale-[1.03]"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              boxShadow: "0 12px 28px -10px rgba(200, 120, 0,0.55)",
            }}
          >
            <ArrowLeft size={15} /> Voltar para Drivers e Manuais
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export function DriverDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getDriverBySlug(slug) : undefined;

  if (!entry) {
    return <DriverNotFound />;
  }

  const scrollToDownloads = () => {
    document.getElementById(DOWNLOADS_ANCHOR)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── Breadcrumb ── */}
      <section className="pt-10 md:pt-14" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1434px] px-5 md:px-12">
          <nav aria-label="breadcrumb">
            <ol
              className="flex flex-wrap items-center gap-2 text-foreground/40"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
            >
              <li>
                <Link to="/" className="transition-colors hover:text-foreground/80">
                  Início
                </Link>
              </li>
              <li aria-hidden className="text-foreground/20">
                ›
              </li>
              <li>
                <Link to="/drivers-e-manuais" className="transition-colors hover:text-foreground/80">
                  Drivers e Manuais
                </Link>
              </li>
              <li aria-hidden className="text-foreground/20">
                ›
              </li>
              <li className="line-clamp-1 text-foreground/70" aria-current="page">
                {entry.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ── Split hero ── */}
      <section style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1434px] px-5 py-10 md:px-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square overflow-hidden rounded-2xl border border-foreground/10"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%), linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              }}
            >
              <ImageWithFallback
                src={entry.image}
                alt={entry.name}
                className="h-full w-full object-contain p-10 md:p-14"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 [color:#fff]"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.16em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
                  }}
                >
                  {entry.category}
                </span>
                <span
                  className="text-foreground/35"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.05em" }}
                >
                  MODELO {entry.model}
                </span>
              </div>

              <h1
                className="mt-5 text-foreground"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {entry.name}
              </h1>

              <p
                className="mt-4 text-foreground/60"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.6 }}
              >
                {entry.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToDownloads}
                  /* Texto branco sobre o âmbar, como no Newsletter: a tinta
                     escura sobre laranja é herança do tema antigo. A sombra
                     tingida de laranja saiu junto — dava ar de banner de
                     promoção a um botão que só leva pro download. */
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    color: "#ffffff",
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <Download size={15} /> Ver downloads
                </button>
                <Link
                  to={`/produto/${entry.productId}`}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.04] px-6 py-3 text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/[0.07]"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
                >
                  Página do Produto <ArrowUpRight size={15} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Downloads ── */}
      <section id={DOWNLOADS_ANCHOR} className="scroll-mt-[160px]" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1434px] px-5 pb-16 md:px-12 md:pb-20">
          <div className="border-t border-foreground/10 pt-12">
            <h2
              className="text-foreground"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(26px, 3.4vw, 36px)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Drivers e Manuais
            </h2>
            <p
              className="mt-3 max-w-[560px] text-foreground/55"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}
            >
              Baixe a versão mais recente do driver e o manual oficial deste produto. Recomendamos sempre
              instalar a última atualização disponível.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <DownloadCard
                kind="driver"
                file={entry.driver}
                title={`Driver: ${entry.name}`}
                description="Software completo de instalação e configuração do produto."
              />
              <DownloadCard
                kind="manual"
                file={entry.manual}
                title={`Manual do Usuário: ${entry.name}`}
                description="Guia oficial com instruções de uso, especificações e cuidados."
              />
            </div>

            {/* Closing note */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-foreground/10 bg-white/[0.03] p-5">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.08] text-primary">
                <ShieldCheck size={16} />
              </div>
              <p
                className="text-foreground/55"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}
              >
                A PCYES recomenda manter drivers e firmware sempre atualizados para garantir desempenho,
                estabilidade e compatibilidade com as últimas versões do seu sistema operacional. Baixe os
                arquivos apenas pelos canais oficiais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
