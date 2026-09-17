import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, ChevronLeft, ChevronRight, Download, FileText, ArrowUpRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { driverEntries, driverCategories, type DriverEntry } from "../components/driversData";

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

const ALL_CATEGORIES = "__all__";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/* ═══════════════════════════════════════════════════════
   DRIVER CARD
   ═══════════════════════════════════════════════════════ */

function DriverCard({ entry, index }: { entry: DriverEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 11) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/drivers-e-manuais/${entry.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-28px_rgba(200, 120, 0,0.45)]"
      >
        {/* Image */}
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06) 0%, transparent 55%), linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          <ImageWithFallback
            src={entry.image}
            alt={entry.name}
            className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <span
            /* Tinta escura sobre o véu preto lia como cinza sujo — sobre
               fundo escuro a fonte é branca, e a borda acompanha. */
            className="absolute left-3.5 top-3.5 inline-flex w-fit items-center rounded-full border border-white/20 bg-black/55 px-2.5 py-1 [color:#fff] backdrop-blur"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-caption)",
              letterSpacing: "0.16em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {entry.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <p
            className="text-foreground/35"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", letterSpacing: "0.06em" }}
          >
            MODELO {entry.model}
          </p>
          <p
            className="line-clamp-2 text-foreground transition-colors group-hover:text-foreground/80"
            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-base)", fontWeight: 500, lineHeight: 1.32 }}
          >
            {entry.name}
          </p>

          <div className="mt-auto flex items-center gap-3 pt-1 text-foreground/45">
            <span className="inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
              <Download size={12} /> Driver
            </span>
            <span className="text-foreground/15">·</span>
            <span className="inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
              <FileText size={12} /> Manual
            </span>
          </div>

          <span
            /* No hover o fundo vira âmbar e a fonte vai a branco — tinta
               escura sobre laranja é herança do tema antigo. */
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground/[0.05] px-4 py-2.5 text-foreground transition-colors group-hover:bg-primary group-hover:[color:#fff]"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
          >
            Ver downloads <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export function DriversManuaisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [pageSize, setPageSize] = useState<PageSize>(12);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return driverEntries.filter((entry) => {
      if (category !== ALL_CATEGORIES && entry.category !== category) return false;
      if (!query) return true;
      const haystack = normalize(`${entry.name} ${entry.model} ${entry.category}`);
      return haystack.includes(query);
    });
  }, [searchQuery, category]);

  /* Reset to page 1 whenever filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(pageCount, page)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-[152px] md:pt-[182px]" style={{ background: "var(--surface-0)" }}>
        <div className="mx-auto max-w-[1434px] px-5 pb-12 md:px-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[640px]"
          >
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 [color:#fff]"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.18em",
                fontWeight: 700,
                boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
              }}
            >
              <Download size={11} /> DOWNLOADS
            </span>
            <h1
              className="mt-5 text-foreground"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Drivers e Manuais
            </h1>
            <p
              className="mt-4 text-foreground/55"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: 1.6 }}
            >
              Mantenha firmware, drivers e softwares dos seus produtos PCYES sempre atualizados. Encontre seu
              equipamento, baixe a versão mais recente e tenha o manual oficial sempre à mão.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Toolbar + grid ── */}
      <section style={{ background: "var(--surface-0)" }} className="min-h-screen">
        <div className="mx-auto max-w-[1434px] px-5 pb-24 md:px-12">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-foreground/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-[380px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por nome, modelo ou categoria…"
                className="h-11 w-full rounded-[var(--radius-card-sm)] border border-foreground/10 bg-white/[0.03] pl-10 pr-3 text-foreground transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:outline-none"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                aria-label="Buscar driver ou manual"
              />
            </div>

            {/* Selects */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-2 text-foreground/55"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
              >
                <span className="hidden sm:inline">Categoria:</span>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    className="h-11 min-w-[170px] rounded-[var(--radius-card-sm)] border-foreground/10 bg-white/[0.03] text-foreground"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                  >
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CATEGORIES}>Todas as categorias</SelectItem>
                    {driverCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className="flex items-center gap-2 text-foreground/55"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
              >
                <span className="hidden sm:inline">Exibir:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value) as PageSize)}
                >
                  <SelectTrigger
                    className="h-11 min-w-[78px] rounded-[var(--radius-card-sm)] border-foreground/10 bg-white/[0.03] text-foreground"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Result count */}
          <p
            className="mt-6 text-foreground/55"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
          >
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>

          {/* Grid / empty state */}
          {paginated.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((entry, index) => (
                <DriverCard key={entry.slug} entry={entry} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-foreground/10 bg-white/[0.03] px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground/40">
                <Search size={22} />
              </div>
              <p
                className="mt-5 text-foreground"
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-lg)", fontWeight: 500 }}
              >
                Nenhum produto encontrado
              </p>
              <p
                className="mt-2 max-w-[380px] text-foreground/50"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", lineHeight: 1.5 }}
              >
                Tente outro termo de busca ou selecione uma categoria diferente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategory(ALL_CATEGORIES);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] px-5 py-2.5 text-foreground transition-colors hover:bg-foreground/[0.1]"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: 600 }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-14 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border border-foreground/10 text-foreground/50 transition-all hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                const isCurrent = page === currentPage;
                const isNearCurrent = Math.abs(page - currentPage) <= 1;
                const isEdge = page === 1 || page === pageCount;
                if (!isNearCurrent && !isEdge) {
                  if (page === 2 || page === pageCount - 1) {
                    return (
                      <span
                        key={page}
                        className="px-1 text-foreground/25"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                      >
                        …
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border transition-all ${
                      isCurrent
                        ? "border-foreground bg-foreground font-bold text-background"
                        : "border-foreground/10 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)" }}
                    aria-label={`Página ${page}`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border border-foreground/10 text-foreground/50 transition-all hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
                aria-label="Próxima página"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
