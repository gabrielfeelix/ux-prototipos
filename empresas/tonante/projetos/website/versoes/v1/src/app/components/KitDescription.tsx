/* A PDP do kit — os blocos que só existem quando o produto é um "Pronto pra
 * Tocar".
 *
 * Molde: SetupDescription do PCYES v3 (ProductPage.tsx:2675). O gate é o mesmo:
 * produto normal nunca entra aqui, e o kit nunca cai na descrição padrão.
 *
 * Traduções que mudaram de natureza, não só de assunto:
 *
 *   v3                              aqui
 *   vídeo + régua de números        cena + timbre tocável
 *   "o que roda nessa máquina"      "o que dá pra tocar com isso"
 *   FPS calculado por tier          veredito calculado pelo `som` da banda
 *
 * A régua de FPS virou som porque é a informação honesta do domínio: ninguém
 * compra violão para atingir um número. */

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Check, ChevronDown, Minus, Volume2, X } from "lucide-react";
import {
  KIT_SEED,
  bandasDoKit,
  getKitSeed,
  kitHero,
  type BandaNoKit,
  type KitSeed,
  type Veredito,
} from "../lib/kits";
import { playSample, stopSample } from "../lib/timbre";
import type { Product } from "./productsData";

const AUDIO_DA_FAMILIA: Record<string, string> = {
  violao: "violao-aco",
  guitarra: "guitarra",
  baixo: "baixo",
  viola: "viola",
  ukulele: "ukulele",
  bateria: "bateria",
  teclado: "teclado",
  sopro: "flauta",
};

const CENAS: Record<string, { titulo: string; texto: string; foto: string }> = {
  quarto: {
    titulo: "No quarto, às onze da noite",
    texto:
      "É onde a maior parte das horas acontece: sem plateia, sem pressa, no volume que não acorda ninguém. Um kit que só funciona no palco fica guardado seis dias por semana.",
    foto: "/cenas/quarto.png",
  },
  igreja: {
    titulo: "Na igreja, toda semana",
    texto:
      "Tocar ligado na mesa muda o que importa: o que você precisa é ser ouvido sem microfonia e se ouvir no retorno. Instrumento bonito que não resolve isso vira problema do operador de som.",
    foto: "/cenas/igreja.png",
  },
  palco: {
    titulo: "No palco, com hora marcada",
    texto:
      "Aqui nada pode falhar e ninguém vai esperar você resolver. Cabo reserva não é exagero: é a diferença entre um susto de dez segundos e um show interrompido.",
    foto: "/cenas/palco.png",
  },
};

export function isKitDescription(product: Pick<Product, "id">): boolean {
  return !!getKitSeed(product.id);
}

export function KitDescription({ product }: { product: Product }) {
  const seed = getKitSeed(product.id);
  if (!seed) return null;

  return (
    <div className="space-y-20 py-4 lg:space-y-28">
      <PraQuemE seed={seed} />
      <PorQueEssasPecas seed={seed} />
      <Cenas seed={seed} />
      <OQueDaPraTocar seed={seed} />
      <EssaOuAVizinha seed={seed} product={product} />
      <Faq seed={seed} />
    </div>
  );
}

/* ——— pra quem é ——————————————————————————————————————————————————————— */

function PraQuemE({ seed }: { seed: KitSeed }) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
      <div>
        <p className="text-[0.875rem] text-foreground/55">Pra quem é</p>
        <h2
          className="mt-3 max-w-[20ch] text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.015em] text-foreground"
          style={{ fontFamily: "var(--font-family-figtree)" }}
        >
          {seed.praQuem.titulo}
        </h2>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-foreground/70">
          {seed.praQuem.texto}
        </p>
      </div>
      {/* Único bloco full-bleed da página: o macro preenche o quadro inteiro,
          sem respiro, porque é o contraponto ao branco de tudo em volta. */}
      <div className="overflow-hidden rounded-[var(--radius-card-lg)] bg-[#FAF8F5]">
        <img
          src={`/kits/quem/${seed.key}.png`}
          alt=""
          loading="lazy"
          className="aspect-square w-full object-cover"
          onError={esconder}
        />
      </div>
    </section>
  );
}

/* ——— por que essas peças ——————————————————————————————————————————————— */

function PorQueEssasPecas({ seed }: { seed: KitSeed }) {
  return (
    <section>
      <h2
        className="text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.015em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        Por que essas peças
      </h2>
      <div className="mt-9 grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {seed.porque.map((p, i) => (
          <article key={i}>
            <p className="text-[0.8125rem] text-foreground/50">{p.slot}</p>
            <h3 className="mt-2 text-[1.125rem] font-semibold leading-snug text-foreground">
              {p.titulo}
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/65">{p.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ——— cenas + timbre —————————————————————————————————————————————————— */

function Cenas({ seed }: { seed: KitSeed }) {
  const [tocando, setTocando] = useState(false);
  const pasta = AUDIO_DA_FAMILIA[seed.instrumento] ?? "violao-aco";

  const alternar = () => {
    if (tocando) {
      stopSample();
      setTocando(false);
      return;
    }
    setTocando(true);
    playSample(`/audio/${pasta}/01.mp3`, () => setTocando(false));
  };

  return (
    <section className="space-y-14">
      {/* Onde o v3 põe a régua de FPS, aqui vai o som. É a única métrica que um
          instrumento tem e que o cliente entende sem legenda. */}
      <div className="flex flex-wrap items-center gap-6 rounded-[var(--radius-card-lg)] bg-[#FAF8F5] px-7 py-6">
        <button
          type="button"
          onClick={alternar}
          className="inline-flex h-12 items-center gap-3 rounded-[var(--radius-pill)] bg-foreground px-6 text-[0.9375rem] font-semibold [color:#fff] transition-opacity hover:opacity-90"
        >
          <Volume2 className="h-4 w-4" />
          {tocando ? "Parando…" : "Ouvir como soa"}
        </button>
        <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-foreground/65">
          Gravação de referência da família, sem efeito e sem edição. É o ponto
          de partida do que sai deste kit.
        </p>
      </div>

      {seed.cenas.map((c, i) => {
        const cena = CENAS[c];
        const invertido = i % 2 === 1;
        return (
          <article
            key={c}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              invertido ? "lg:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="overflow-hidden rounded-[var(--radius-card-lg)] bg-[#111]">
              <img
                src={cena.foto}
                alt=""
                loading="lazy"
                className="aspect-[2/1] w-full object-cover"
                onError={esconder}
              />
            </figure>
            <div>
              <h3
                className="max-w-[18ch] text-[clamp(1.375rem,2.6vw,1.875rem)] leading-tight tracking-[-0.01em] text-foreground"
                style={{ fontFamily: "var(--font-family-figtree)" }}
              >
                {cena.titulo}
              </h3>
              <p className="mt-4 max-w-[50ch] text-[1rem] leading-relaxed text-foreground/70">
                {cena.texto}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* ——— o que dá pra tocar ————————————————————————————————————————————— */

const ROTULO: Record<Veredito, { texto: string; icone: React.ReactNode; cor: string }> = {
  "da-conta": { texto: "Dá conta", icone: <Check className="h-3 w-3" strokeWidth={3} />, cor: "text-[#1E6B3A]" },
  apertado: { texto: "Dá, mas apertado", icone: <Minus className="h-3 w-3" strokeWidth={3} />, cor: "text-amber-text" },
  "nao-e-pra-isso": { texto: "Não é pra isso", icone: <X className="h-3 w-3" strokeWidth={3} />, cor: "text-foreground/45" },
};

const DESTAQUE = 6;

function OQueDaPraTocar({ seed }: { seed: KitSeed }) {
  const todas = useMemo(() => bandasDoKit(seed), [seed]);
  const [tudo, setTudo] = useState(false);
  const lista = tudo ? todas : todas.slice(0, DESTAQUE);

  if (!todas.length) return null;

  return (
    <section>
      <h2
        className="text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.015em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        O que dá pra tocar com isso
      </h2>
      <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-foreground/65">
        Medido pelo que cada som exige de corda e captação, não pelo que a gente
        gostaria de vender. O que não serve continua na lista, apagado.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {lista.map((b) => (
          <BandaCard key={b.band.id} item={b} />
        ))}
      </div>

      {todas.length > DESTAQUE && (
        <button
          type="button"
          onClick={() => setTudo((v) => !v)}
          className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-foreground transition-opacity hover:opacity-70"
        >
          {tudo ? "Mostrar menos" : `Ver todos os ${todas.length}`}
          <ChevronDown className={`h-4 w-4 transition-transform ${tudo ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  );
}

function BandaCard({ item }: { item: BandaNoKit }) {
  const { band, veredito, porque } = item;
  const r = ROTULO[veredito];
  const apagado = veredito === "nao-e-pra-isso";
  const claro = ehClaro(band.bg1);

  return (
    <article className={apagado ? "opacity-45" : ""}>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card-md)]"
        style={{ background: `linear-gradient(155deg, ${band.bg1} 0%, ${band.bg2} 100%)` }}
      >
        {band.cover && (
          <img src={band.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={esconder} />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-3.5">
          <span
            className={`text-[0.9375rem] leading-[1.15] ${claro ? "text-[#111]" : "[color:#fff]"}`}
            style={{ fontFamily: "var(--font-family-figtree)" }}
          >
            {band.name}
          </span>
        </div>
      </div>
      <p className={`mt-3 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold ${r.cor}`}>
        {r.icone}
        {r.texto}
      </p>
      <p className="mt-1 text-[0.75rem] leading-snug text-foreground/55">{porque}</p>
    </article>
  );
}

/* ——— essa ou a vizinha ————————————————————————————————————————————— */

/* O v3 tinha esta seção e o cliente mandou tirar; o código ficou morto lá
   (SetupStorySections.tsx:7-17). Aqui ela volta porque o Tonante já tem
   /comparar funcionando — é um link, não uma feature nova. */
function EssaOuAVizinha({ seed, product }: { seed: KitSeed; product: Product }) {
  const vizinhas = KIT_SEED.filter((k) => !k.oculto && k.perfil === seed.perfil && k.key !== seed.key);
  if (!vizinhas.length) return null;

  const ids = [product.id, ...vizinhas.map((v) => 90000 + KIT_SEED.findIndex((k) => k.key === v.key) + 1)];

  return (
    <section className="rounded-[var(--radius-card-lg)] border border-foreground/10 px-7 py-8">
      <h2 className="text-[1.25rem] leading-tight text-foreground" style={{ fontFamily: "var(--font-family-figtree)" }}>
        Essa ou a vizinha?
      </h2>
      <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-foreground/65">
        {vizinhas.length === 1
          ? `O kit ${vizinhas[0].name} atende o mesmo perfil numa outra faixa.`
          : `Os kits ${vizinhas.map((v) => v.name).join(" e ")} atendem o mesmo perfil em outras faixas.`}{" "}
        Ver lado a lado costuma decidir mais rápido que ler os dois.
      </p>
      <Link
        to={`/comparar?ids=${ids.join(",")}`}
        className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-pill)] border border-foreground/15 px-7 text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-foreground/40"
      >
        Comparar os kits
      </Link>
    </section>
  );
}

/* ——— faq ———————————————————————————————————————————————————————————— */

function Faq({ seed }: { seed: KitSeed }) {
  const [aberta, setAberta] = useState<number | null>(0);
  return (
    <section>
      <h2
        className="text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.015em] text-foreground"
        style={{ fontFamily: "var(--font-family-figtree)" }}
      >
        Perguntas de quem comprou
      </h2>
      <div className="mt-7 max-w-[68ch] divide-y divide-foreground/10 border-t border-foreground/10">
        {seed.faq.map((f, i) => {
          const ativa = aberta === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setAberta(ativa ? null : i)}
                aria-expanded={ativa}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-[1rem] font-semibold text-foreground">{f.p}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-foreground/50 transition-transform duration-300 ${ativa ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                style={{ gridTemplateRows: ativa ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-[0.9375rem] leading-relaxed text-foreground/70">{f.r}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ——— utilidades ——————————————————————————————————————————————————————— */

function esconder(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
}

function ehClaro(hex: string): boolean {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

export { kitHero };
