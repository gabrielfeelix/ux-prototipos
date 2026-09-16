"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Plus, Check, ShoppingBag, Guitar, Music, Mic, type LucideIcon } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { type Product } from "./productsData";
import { catalogo, peso, tipoDoProduto } from "../v2/curadoria";
import { getPrimaryProductImage } from "./productPresentation";
import { getPixPrice, formatBRL } from "./productEnhancements";

// MonteSeuKit — combo builder (porta _ref/src/home_sections.jsx FeaturedEssentials).
// Presets clicáveis (§6.9) pré-populam base + add-ons. 8% off no kit.
//
// A base TEM que ser instrumento. Procurar "Violão" pelo nome devolvia
// "Suporte Para Guitarra, Baixo e Violão" — o kit iniciante abria com um
// suporte preto no lugar do violão. Agora a base sai da curadoria (categoria
// + apelo visual, ver v2/curadoria.ts) e o nome só desempata entre candidatos
// que já são instrumento.
const porApelo = (lista: Product[]) => [...lista].sort((a, b) => peso(b) - peso(a));

/** Melhor instrumento da categoria; `preferir` puxa um modelo específico pra frente. */
function baseInstrumento(categoria: string, preferir: string[] = []) {
  const candidatos = porApelo(
    catalogo.filter((p) => p.category === categoria && tipoDoProduto(p) === "instrumento"),
  );
  for (const kw of preferir) {
    const hit = candidatos.find((p) => p.name.toLowerCase().includes(kw.toLowerCase()));
    if (hit) return hit;
  }
  return candidatos[0];
}

/** Microfone de verdade — "Cabo Para Microfone" não serve de base do kit estúdio. */
function baseMicrofone() {
  return porApelo(catalogo.filter((p) => tipoDoProduto(p) === "microfone"))[0];
}

function resolveAddons(groups: string[][], exclude: Product): Product[] {
  const out: Product[] = [];
  for (const g of groups) {
    const hit = porApelo(catalogo).find(
      (p) =>
        g.some((k) => p.name.toLowerCase().includes(k.toLowerCase())) &&
        p.id !== exclude.id &&
        !out.some((o) => o.id === p.id),
    );
    if (hit) out.push(hit);
  }
  return out;
}

type Preset = { key: string; label: string; desc: string; icon: LucideIcon; base: Product; addons: Product[] };

/* Os add-ons são o que o instrumento PEDE junto — e o catálogo não tem capa,
   então o kit iniciante fecha com afinador, correia e palheta. */
const RECEITAS = [
  { key: "iniciante", label: "Tô começando agora", desc: "Kit Iniciante: para dar os primeiros acordes", icon: Guitar,
    base: () => baseInstrumento("Violões", ["Lorenzzo", "Clássico"]),
    groups: [["Afinador"], ["Correia"], ["Palheta"]] },
  { key: "palco", label: "Toco ao vivo", desc: "Kit Palco: pronto para subir no palco", icon: Music,
    base: () => baseInstrumento("Guitarras", ["Cecille", "Les Paul", "Strato"]),
    groups: [["Cabo DE Guitarra", "Cabo P10", "Cabo"], ["Correia"], ["Afinador"]] },
  { key: "estudio", label: "Gravo em casa", desc: "Kit Estúdio: grave com qualidade", icon: Mic,
    base: () => baseMicrofone(),
    groups: [["Cabo DE Microf", "Cabo Para Microf", "Cabo"], ["Pedestal", "Suporte"], ["Damper", "Plug"]] },
];

const PRESETS: Preset[] = RECEITAS.map((r) => {
  const base = r.base() ?? catalogo[0];
  return { key: r.key, label: r.label, desc: r.desc, icon: r.icon, base, addons: resolveAddons(r.groups, base) };
});

export function MonteSeuKit() {
  const { addItem } = useCart();
  const [presetIdx, setPresetIdx] = useState(0);
  const active = PRESETS[presetIdx];
  const base = active.base;
  const addons = active.addons;

  const [sel, setSel] = useState<number[]>(active.addons.map((a) => a.id));
  const chosen = addons.filter((a) => sel.includes(a.id));
  const toggle = (id: number) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const choosePreset = (i: number) => {
    setPresetIdx(i);
    setSel(PRESETS[i].addons.map((a) => a.id));
  };

  const full = base.priceNum + chosen.reduce((s, a) => s + a.priceNum, 0);
  const combo = Math.round(full * 0.92 * 100) / 100;
  const save = Math.round((full - combo) * 100) / 100;

  const addKit = () => {
    [base, ...chosen].forEach((p) => addItem({ id: p.id, name: p.name, price: p.price, image: getPrimaryProductImage(p) }));
  };

  return (
    <section
      className="px-5 md:px-12"
      style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingTop: 44, paddingBottom: 44 }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1680px" }}>
        <div className="mb-7">
          <p className="label" style={{ color: "var(--amber-deep)", marginBottom: 12 }}>
            Combo Tonante
          </p>
          <h2 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px,3.8vw,48px)", fontWeight: 700, lineHeight: 1, margin: 0 }}>
            Monte seu <span style={{ fontStyle: "italic", color: "var(--amber)" }}>kit</span>
          </h2>
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", color: "var(--ink-soft)", maxWidth: 460, margin: "10px 0 0" }}>
            Comece com o instrumento e adicione os essenciais. Levando junto,{" "}
            <strong style={{ color: "var(--amber-deep)" }}>8% off</strong> no kit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
          {/* rail de contexto — pergunta + 3 opções empilhadas (radiogroup).
              Tabs horizontais não liam como seletor; vertical + pergunta lê. */}
          <div>
            <h3 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: 700, color: "var(--ink-strong)", margin: 0 }}>
              Qual é o seu contexto?
            </h3>
            <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", color: "var(--ink-soft)", margin: "6px 0 0" }}>
              Escolha uma opção e a gente monta o kit.
            </p>
            <div role="radiogroup" aria-label="Qual é o seu contexto?" className="mt-4 flex flex-col gap-2.5">
              {PRESETS.map((p, i) => {
                const on = i === presetIdx;
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choosePreset(i)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-all"
                    style={{
                      background: "var(--surface-1)",
                      border: `1.5px solid ${on ? "var(--amber)" : "var(--edge)"}`,
                      borderRadius: "var(--radius-card-md)",
                      boxShadow: on ? "0 0 0 3px rgba(17, 17, 17, 0.08)" : "none",
                    }}
                  >
                    <span
                      className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full"
                      style={{ border: `1.5px solid ${on ? "var(--amber)" : "#d4d4d4"}`, background: "var(--surface-1)" }}
                    >
                      {on && <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "var(--amber)" }} />}
                    </span>
                    <span
                      className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                      style={{ background: on ? "var(--amber)" : "var(--surface-2)", color: on ? "#fff" : "var(--amber-deep)" }}
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block" style={{ fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "14.5px", lineHeight: 1.2, color: "var(--ink-strong)" }}>
                        {p.label}
                      </span>
                      <span className="mt-0.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--ink-muted)" }}>
                        {p.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* kit resultante */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,280px)_auto_1fr]">
              {/* base */}
              <article className="flex flex-col gap-3" style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-card-lg)", padding: 16 }}>
                <span className="label" style={{ color: "var(--amber-deep)" }}>
                  Instrumento base
                </span>
                <Link to={`/produto/${base.id}`} className="relative block overflow-hidden rounded-[12px]" style={{ background: "var(--well)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                  <div className="relative aspect-[4/3]">
                    <ImageWithFallback src={getPrimaryProductImage(base)} alt={base.name} className="absolute inset-0 h-full w-full object-contain p-4" style={{ mixBlendMode: "multiply" }} />
                  </div>
                </Link>
                <div>
                  <Link to={`/produto/${base.id}`} className="text-ink-strong line-clamp-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, lineHeight: 1.35 }}>
                    {base.name}
                  </Link>
                  <div className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-price-lg)", fontWeight: 700, color: "var(--amber-deep)", marginTop: 4 }}>
                    {formatBRL(getPixPrice(base))}
                  </div>
                </div>
              </article>

              {/* plus */}
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--ink-strong)", color: "var(--background)" }}>
                <Plus size={20} strokeWidth={2.4} />
              </div>

              {/* add-ons */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {addons.map((a) => {
                  const on = sel.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      className="relative flex cursor-pointer flex-col overflow-hidden text-left"
                      style={{
                        background: "var(--surface-1)",
                        border: `1.5px solid ${on ? "var(--amber)" : "var(--border)"}`,
                        borderRadius: "var(--radius-card-md)",
                        transition: "border-color .2s",
                      }}
                    >
                      {/* well no topo, flush nos cantos (card clipa) — sem borda
                          âmbar vazando atrás da imagem */}
                      <div className="relative aspect-square" style={{ background: "var(--well)" }}>
                        <ImageWithFallback src={getPrimaryProductImage(a)} alt={a.name} className="absolute inset-0 h-full w-full object-contain p-3" style={{ mixBlendMode: "multiply" }} />
                        <span
                          className="absolute right-2.5 top-2.5 grid h-[26px] w-[26px] place-items-center rounded-full"
                          style={{ background: on ? "var(--amber)" : "rgba(255,255,255,0.92)", border: `1.5px solid ${on ? "var(--amber)" : "#d6d6d6"}`, color: on ? "#fff" : "var(--muted)", boxShadow: "0 2px 6px -2px rgba(17,17,17,0.25)" }}
                        >
                          {on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} strokeWidth={2.6} />}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 p-3">
                        <div className="line-clamp-2 text-ink-strong" style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600, fontSize: "13px", lineHeight: 1.2 }}>
                          {a.name}
                        </div>
                        <div style={{ fontFamily: "var(--font-family-inter)", fontSize: "12.5px", color: "var(--amber-deep)" }}>
                          + {formatBRL(getPixPrice(a))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* resumo (claro) */}
            <div
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              style={{ background: "var(--surface-1)", border: "1.5px solid #d6d6d6", borderRadius: "var(--radius-card-md)" }}
            >
              <div>
                <div className="num" style={{ fontSize: "var(--text-meta)", color: "var(--ink-meta)", textDecoration: "line-through" }}>
                  {formatBRL(full)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>{formatBRL(combo)}</span>
                  <span className="num" style={{ fontSize: "11.5px", color: "var(--amber-deep)", fontWeight: 700 }}>economize {formatBRL(save)}</span>
                </div>
              </div>
              <button
                onClick={addKit}
                className="inline-flex items-center gap-2 rounded-pill cursor-pointer"
                style={{ background: "var(--primary)", color: "#fff", padding: "13px 24px", fontFamily: "var(--font-family-inter)", fontWeight: 700, fontSize: "14.5px", boxShadow: "var(--shadow-buy-cta-sm)" }}
              >
                <ShoppingBag size={16} strokeWidth={2.2} /> Adicionar kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
