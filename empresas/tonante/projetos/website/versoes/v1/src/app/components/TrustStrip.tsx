import { Truck, CreditCard, ShieldCheck, RefreshCcw, type LucideIcon } from "lucide-react";

// ValueStrip — faixa de vantagens (porta _ref/src/home.jsx ValueStrip):
// 4 células em linha, divisórias hairline, ícone âmbar + título + subtítulo.
type Item = { icon: LucideIcon; title: string; sub: string };

const items: Item[] = [
  { icon: Truck, title: "Frete grátis", sub: "acima de R$ 299" },
  { icon: CreditCard, title: "Até 10x", sub: "sem juros" },
  { icon: ShieldCheck, title: "Garantia", sub: "2 anos Tonante" },
  { icon: RefreshCcw, title: "Troca fácil", sub: "até 30 dias" },
];

export function TrustStrip() {
  return (
    <section className="px-5 md:px-12" style={{ background: "var(--surface-0)", paddingTop: "28px", paddingBottom: "8px" }}>
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        {/* faixa clara — divisórias hairline sobre o fundo da página */}
        <div
          className="grid grid-cols-2 overflow-hidden md:grid-cols-4"
          style={{ gap: "1px", background: "var(--border)", borderRadius: "var(--radius-card-lg)" }}
        >
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3.5 px-5 py-6" style={{ background: "var(--surface-0)" }}>
              <Icon size={26} strokeWidth={1.6} style={{ color: "var(--amber-text)", flexShrink: 0 }} />
              <div className="min-w-0">
                <div style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 700, lineHeight: 1.2, color: "var(--ink-strong)" }}>
                  {title}
                </div>
                <div style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--ink-muted)" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
