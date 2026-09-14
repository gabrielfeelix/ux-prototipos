import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";

type LegalSection = {
  id: string;
  heading: string;
  body: string[];
};

type LegalPageLayoutProps = {
  badge: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

/* Splits a section's body strings into renderable blocks: consecutive
   lines starting with "- " collapse into a single bulleted list. */
type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

function toBlocks(body: string[]): Block[] {
  const blocks: Block[] = [];
  for (const line of body) {
    if (line.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "list") {
        last.items.push(line.slice(2));
      } else {
        blocks.push({ kind: "list", items: [line.slice(2)] });
      }
    } else {
      blocks.push({ kind: "paragraph", text: line });
    }
  }
  return blocks;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

export function LegalPageLayout({
  badge,
  title,
  updatedAt,
  intro,
  sections,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-200px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-[152px] md:pt-[182px]">
        {/* Subtle red radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(17, 17, 17, 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1434px] px-5 pb-14 md:px-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="max-w-3xl"
          >
            <span
              className="inline-flex w-fit items-center rounded-full bg-primary px-2.5 py-1 text-ink-strong"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                letterSpacing: "0.18em",
                fontWeight: 700,
                boxShadow: "0 6px 22px -4px rgba(200, 120, 0,0.55)",
              }}
            >
              {badge}
            </span>

            <h1
              className="mt-6 text-[var(--text-2xl)] leading-[1.1] tracking-tight text-foreground md:text-[52px]"
              style={{ fontFamily: "var(--font-family-figtree)", fontWeight: 500 }}
            >
              {title}
            </h1>

            <p
              className="mt-4 text-foreground/45"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-sm)",
                letterSpacing: "0.02em",
              }}
            >
              Atualizado em {updatedAt}
            </p>

            <p
              className="mt-5 text-foreground/65"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-base)",
                lineHeight: 1.65,
              }}
            >
              {intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="mx-auto max-w-[1434px] px-5 pb-24 md:px-12 md:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          {/* Section navigation */}
          <nav className="lg:sticky lg:top-[140px] lg:h-fit" aria-label="Seções">
            <p
              className="mb-4 text-foreground/35"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "var(--text-caption)",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              NESTA PÁGINA
            </p>
            <ul className="flex flex-col">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block border-l py-2 pl-4 transition-colors duration-200 ${
                        isActive
                          ? "border-primary text-foreground"
                          : "border-foreground/10 text-foreground/50 hover:border-foreground/30 hover:text-foreground/80"
                      }`}
                      style={{
                        fontFamily: "var(--font-family-inter)",
                        fontSize: "var(--text-sm)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {section.heading}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="max-w-3xl">
            {sections.map((section, index) => (
              <motion.article
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: easeOut, delay: Math.min(index * 0.04, 0.2) }}
                className="scroll-mt-[140px] border-b border-foreground/10 py-10 first:pt-0 last:border-b-0"
              >
                <h2
                  className="text-[var(--text-xl)] leading-[1.25] text-foreground md:text-[var(--text-2xl)]"
                  style={{ fontFamily: "var(--font-family-figtree)", fontWeight: 500 }}
                >
                  {section.heading}
                </h2>

                <div className="mt-5 flex flex-col gap-4">
                  {toBlocks(section.body).map((block, blockIndex) =>
                    block.kind === "list" ? (
                      <ul key={blockIndex} className="flex flex-col gap-2.5">
                        {block.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex gap-3 text-foreground/65"
                            style={{
                              fontFamily: "var(--font-family-inter)",
                              fontSize: "var(--text-base)",
                              lineHeight: 1.65,
                            }}
                          >
                            <span
                              aria-hidden
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={blockIndex}
                        className="text-foreground/65"
                        style={{
                          fontFamily: "var(--font-family-inter)",
                          fontSize: "var(--text-base)",
                          lineHeight: 1.7,
                        }}
                      >
                        {block.text}
                      </p>
                    ),
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
