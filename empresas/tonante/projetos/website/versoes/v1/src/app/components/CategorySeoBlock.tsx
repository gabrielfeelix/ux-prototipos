import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Subset de markdown suportado pelo bloco SEO:
 *   - `## Titulo`  => h2
 *   - `### Titulo` => h3
 *   - `**bold**`   => <strong>
 *   - linha simples => parágrafo
 *
 * Em produção, esse content viraria CMS / editor rich text. O parser
 * abaixo demonstra a capacidade no protótipo.
 */
type SeoNode =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string };

type SeoEntry = {
  title: string;
  /** Forma nova: lista de nodes tipados (h2/h3/p). */
  nodes?: SeoNode[];
  /** Forma legada: lista de parágrafos. Mantida para backward compat. */
  paragraphs?: string[];
};

function parseInlineBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i} className="text-foreground/85 font-semibold">{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

/* Os rótulos que chegam aqui vêm de três lugares: categoria do catálogo,
   subcategoria e tag em destaque. Os plurais da vitrine da home ("Violas",
   "Cabos") não são categorias — são tags no singular. O alias costura os
   dois vocabulários. */
const ALIASES: Record<string, string> = {
  "Violão": "Violões",
  "Guitarra": "Guitarras",
  "Contrabaixo": "Contrabaixos",
  "Baixo": "Contrabaixos",
  "Bateria": "Baterias",
  "Violas": "Viola",
  "Viola Caipira": "Viola",
  "Ukuleles": "Ukulele",
  "Cordas": "Cordas & Encordoamentos",
  "Encordoamento": "Cordas & Encordoamentos",
  "Encordoamentos": "Cordas & Encordoamentos",
  "Suportes & Pedestais": "Suportes",
  "Pedestais": "Suportes",
  "Suporte": "Suportes",
  "Cabos": "Cabo",
  "Microfones": "Microfone",
  "Palhetas": "Palheta",
  "Correias": "Correia",
  "Afinadores": "Afinador",
  "Acessório": "Acessórios",
};

const SEO: Record<string, SeoEntry> = {
  default: {
    title: "Sobre os Produtos Tonante",
    paragraphs: [
      "A Tonante fabrica instrumentos musicais no Brasil desde 1954. O catálogo da loja oficial reúne violões de nylon e de aço, violas, cavacos, ukuleles, guitarras, contrabaixos, baterias acústicas e a linha completa de cordas, suportes e acessórios de palco e estúdio.",
      "Todo instrumento Tonante sai da fábrica afinado e conferido, com garantia de 2 anos contra defeitos de fabricação, nota fiscal e envio para todo o país. As marcas parceiras do catálogo passam pela curadoria Tonante: só entra o que a gente usaria no próprio palco.",
    ],
  },
  "Violões": {
    title: "Sobre os Violões Tonante",
    nodes: [
      { type: "p", text: "O **violão Tonante** é o instrumento que abriu a fábrica em 1954 e continua sendo o centro do catálogo. A linha vai do infantil 1/2 e 3/4 ao eletroacústico de palco, em versões com cordas de nylon e de aço, tampo natural ou acabamento preto." },
      { type: "h3", text: "Violões de nylon" },
      { type: "p", text: "Braço mais largo, tensão mais baixa e timbre redondo: é o violão de **estudo clássico**, de MPB e de quem está começando. A pisada leve poupa os dedos nas primeiras semanas, quando a mão ainda não tem calo." },
      { type: "h3", text: "Violões de aço" },
      { type: "p", text: "Projeção maior e ataque mais definido, para **folk, country, gospel e roda de violão**. Nos modelos cutaway o recorte libera as casas agudas, e os eletroacústicos trazem captação com equalizador embutido para ligar direto na mesa." },
      { type: "h3", text: "Violas, cavacos e ukuleles" },
      { type: "p", text: "A mesma oficina que faz os violões produz a **viola caipira** de 10 cordas, o cavaco de 4 cordas e os ukuleles soprano e concert. São instrumentos de corpo menor, indicados para quem toca em pé, viaja com o instrumento ou tem mão pequena." },
      { type: "h2", text: "Garantia e atendimento" },
      { type: "p", text: "Cada violão é afinado, conferido e embalado na fábrica antes de sair. Compre violão Tonante direto da loja oficial com **garantia de 2 anos** contra defeitos de fabricação, nota fiscal, atendimento por WhatsApp e envio para todo o Brasil." },
    ],
  },
  "Guitarras": {
    title: "Sobre as Guitarras Tonante",
    paragraphs: [
      "A guitarra elétrica Tonante chega em duas famílias: a linha Cecille, de corpo TL, com ataque seco e brilho de ponte que sustenta country, blues e pop; e a linha Star Light, de configuração SS, mais versátil entre limpo cristalino e crunch. As cores vão de Cobalt Blue e Azure a Sangria e Polar White.",
      "Toda guitarra Tonante sai da fábrica com escala regulada, tastos nivelados e captação testada no amplificador. Compre guitarra elétrica direto da loja oficial com garantia de 2 anos contra defeitos de fabricação, nota fiscal e envio para todo o Brasil.",
    ],
  },
  "Contrabaixos": {
    title: "Sobre os Contrabaixos Tonante",
    paragraphs: [
      "O contrabaixo elétrico Tonante vem nas linhas Jazzmine e Theodor, em versões de 4 e 5 cordas. O Jazzmine tem timbre mais articulado, bom para slap e para gravação; o Theodor entrega fundamental mais grossa, do tipo que preenche o palco atrás da banda. Acabamentos Deep Dark, Sunset e Yellow Cake.",
      "Escala longa, braço regulado de fábrica e captação conferida no amplificador antes do envio. Compre contrabaixo Tonante na loja oficial com garantia de 2 anos contra defeitos de fabricação, nota fiscal e entrega em todo o território nacional.",
    ],
  },
  "Baterias": {
    title: "Sobre as Baterias Tonante Sonora",
    paragraphs: [
      "A bateria acústica Tonante Sonora tem cascos em 6 folhas de poplar, que dão ressonância profunda e equilibrada, com ferragens dimensionadas para aguentar estrada. A configuração padrão traz bumbo 22×16\", caixa 14×5,5\" e tons de 10×7\" e 12×8\", nos acabamentos Black Sparkle e Grey Sparkle.",
      "É um kit que atende apresentação ao vivo, estúdio e sala de ensaio sem trocar de pele. Compre bateria Tonante Sonora na loja oficial com garantia de 2 anos contra defeitos de fabricação, nota fiscal e frete para todo o Brasil.",
    ],
  },
  "Cordas & Encordoamentos": {
    title: "Sobre Cordas e Encordoamentos",
    paragraphs: [
      "O encordoamento é a peça que mais muda o som do instrumento e a única que se troca sozinha. O catálogo Tonante cobre jogos para violão de nylon e de aço, viola de 10 cordas, cavaco, ukulele, guitarra e contrabaixo de 4 e 5 cordas, em bronze 85/15, níquel e aço, com calibres de .009 a .052.",
      "Corda mais leve pede menos força e facilita bend; corda mais pesada sustenta afinação grave e projeta mais. Compre encordoamento na loja oficial Tonante, com jogos das nossas linhas e das marcas parceiras que passam pela curadoria da casa, e receba em todo o Brasil.",
    ],
  },
  "Suportes": {
    title: "Sobre Suportes e Pedestais",
    paragraphs: [
      "Instrumento apoiado no canto da parede cai. A linha de suportes Tonante reúne suporte de chão para violão e guitarra, suporte em X simples e duplo para teclado, pedestal de microfone reto e girafa com cachimbo, pedestal para caixa de som, tripé de caixa, estante para partitura e banquetas para piano e teclado.",
      "São peças em aço com pintura preta, reguláveis em altura e dobráveis nos modelos de viagem, pensadas para montar e desmontar toda semana. Compre suporte e pedestal na loja oficial Tonante com nota fiscal e envio para todo o Brasil.",
    ],
  },
  "Acessórios": {
    title: "Sobre Acessórios Tonante",
    paragraphs: [
      "São os itens pequenos que decidem o ensaio: palheta, correia, cabo P10, cabo de microfone XLR, afinador cromático, capotraste, abafador anti-feedback, apoio de pé para violonista, adaptador P2/P10 e capa para transporte.",
      "Aqui convivem a linha Tonante e as marcas parceiras selecionadas pela casa — Ibox, Angel, Ninja Cable, entre outras. Compre acessórios para instrumento na loja oficial com nota fiscal, estoque atualizado e frete para todo o Brasil.",
    ],
  },
  "Viola": {
    title: "Sobre as Violas Tonante",
    paragraphs: [
      "A viola caipira Tonante tem 10 cordas em 5 pares e corpo menor que o do violão, o que deixa o timbre mais agudo e brilhante — o som do sertanejo raiz, da folia de reis e da moda de viola. As versões acústica e eletroacústica vêm em acabamento natural ou preto, e a eletroacústica liga direto na mesa.",
      "Vem da mesma oficina dos violões, afinada em cebolão e conferida antes do envio. Compre viola caipira na loja oficial Tonante com garantia de 2 anos contra defeitos de fabricação, nota fiscal e entrega em todo o Brasil.",
    ],
  },
  "Ukulele": {
    title: "Sobre os Ukuleles Tonante",
    paragraphs: [
      "O ukulele Tonante da linha Haka vem nos tamanhos soprano e concert, em mahogany e KOA. O soprano é o mais compacto e o mais agudo, bom para viagem e para mão pequena; o concert tem corpo e escala maiores, com nota mais cheia e mais espaço entre os trastes.",
      "São 4 cordas de nylon e tensão baixa, o que torna o ukulele o instrumento de corda mais rápido de aprender — os primeiros acordes saem no mesmo dia. Compre ukulele na loja oficial Tonante com garantia de 2 anos, nota fiscal e envio para todo o Brasil.",
    ],
  },
  "Cabo": {
    title: "Sobre Cabos para Instrumento",
    paragraphs: [
      "Cabo ruim chia, oxida e falha no meio do show. O catálogo Tonante traz cabo de guitarra P10/P10 com plugue reto e 90°, nos comprimentos de 3,05 m, 4,57 m e 6,10 m, em capa de PVC ou revestimento têxtil, e cabo de microfone XLR macho/fêmea nas mesmas medidas.",
      "Condutor de 0,20 mm e 0,30 mm, blindagem contra ruído e solda reforçada no plugue, que é onde o cabo costuma morrer. Marcas parceiras selecionadas pela curadoria Tonante — Angel, Ninja Cable e outras. Compre cabo com nota fiscal e frete para todo o Brasil.",
    ],
  },
  "Microfone": {
    title: "Sobre Microfones e Pedestais",
    paragraphs: [
      "A linha de microfone do catálogo Tonante cobre voz ao vivo, ensaio e gravação caseira, com os pedestais e cabos XLR que fazem o conjunto funcionar: pedestal reto, girafa com cachimbo, cachimbo avulso, cabo XLR macho/fêmea e adaptadores.",
      "Quem canta e toca junto resolve o palco com um girafa e um cabo de 6,10 m — sobra fio para andar. Compre microfone, pedestal e cabo na loja oficial Tonante, com marcas parceiras selecionadas pela casa, nota fiscal e envio para todo o Brasil.",
    ],
  },
  "Palheta": {
    title: "Sobre Palhetas",
    paragraphs: [
      "A palheta muda o ataque antes de qualquer pedal. As finas, de 0,46 mm a 0,73 mm, flexionam e favorecem levada de acompanhamento; as médias e grossas, de 0,88 mm a 1,0 mm, dão ataque firme para solo, riff e baixo.",
      "O catálogo tem cartelas e pacotes de 20 peças — palheta é item de consumo, sempre desaparece uma antes do show. Compre palheta na loja oficial Tonante, de marcas parceiras selecionadas pela curadoria da casa, com frete para todo o Brasil.",
    ],
  },
  "Correia": {
    title: "Sobre Correias",
    paragraphs: [
      "A correia sustenta o instrumento na altura em que a sua mão trabalha. O catálogo traz modelos em couro e em nylon acolchoado, com ajuste de comprimento para violão, guitarra e contrabaixo, e presilha para violão sem strap button.",
      "Correia larga distribui o peso e é o que salva as costas em show longo, principalmente com contrabaixo. Compre correia na loja oficial Tonante, de marcas parceiras selecionadas pela casa, com nota fiscal e envio para todo o Brasil.",
    ],
  },
  "Afinador": {
    title: "Sobre Afinadores",
    paragraphs: [
      "O afinador cromático digital Tonante lê qualquer nota e serve para violão, viola, cavaco, ukulele, guitarra e contrabaixo. Prende na pala e trabalha por vibração, então afina no meio do barulho da passagem de som, quando afinar de ouvido não é opção.",
      "Disponível em preto, branco, azul e vermelho, com bateria inclusa. Compre afinador na loja oficial Tonante, de marcas parceiras selecionadas pela curadoria da casa, com nota fiscal e frete para todo o Brasil.",
    ],
  },
};

/* Do mais específico para o mais genérico: busca ("viola caipira") vence
   subcategoria, que vence tag em destaque, que vence a categoria. */
function resolveContent(category: string, subcategory: string, featured: string, search = ""): SeoEntry {
  const keys = [search, subcategory, featured, category].filter(Boolean);
  for (const raw of keys) {
    const key = ALIASES[raw] ?? ALIASES[titleCase(raw)] ?? raw;
    if (SEO[key]) return SEO[key];
    const byTitle = SEO[titleCase(key)];
    if (byTitle) return byTitle;
  }
  return SEO.default;
}

/** "viola caipira" chega em minúsculas pela URL; as chaves são capitalizadas. */
function titleCase(raw: string) {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Normaliza qualquer entry para a forma `nodes[]`. */
function normalizeNodes(entry: SeoEntry): SeoNode[] {
  if (entry.nodes && entry.nodes.length > 0) return entry.nodes;
  if (entry.paragraphs) return entry.paragraphs.map((text) => ({ type: "p" as const, text }));
  return [];
}

export function CategorySeoBlock({
  categoryLabel,
  subcategoryLabel,
  featuredLabel,
  searchLabel = "",
}: {
  categoryLabel: string;
  subcategoryLabel: string;
  featuredLabel: string;
  /** termo de busca da URL — é o que a vitrine da home usa para viola, ukulele, cabo… */
  searchLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const content = resolveContent(categoryLabel, subcategoryLabel, featuredLabel, searchLabel);
  const nodes = normalizeNodes(content);
  const hasMore = nodes.length > 1;

  return (
    <section
      className="mt-12 md:mt-16 mb-4"
      aria-labelledby="category-seo-title"
    >
      <div
        className="rounded-2xl border p-6 md:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(17, 17, 17, 0.05) 0%, rgba(255,255,255,0.02) 60%)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <h2
          id="category-seo-title"
          className="mb-6"
          style={{
            fontFamily: "var(--font-family-figtree)",
            fontSize: "clamp(20px, 2.4vw, 28px)",
            fontWeight: 700,
            color: "#c87800",
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
          }}
        >
          {content.title}
        </h2>

        <div className="space-y-4">
          {nodes.map((node, i) => {
            const hideOnMobileWhenCollapsed = i > 0 && !expanded ? "hidden md:block" : "";
            if (node.type === "h2") {
              return (
                <h2
                  key={i}
                  className={`mt-6 first:mt-0 text-foreground ${hideOnMobileWhenCollapsed}`}
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(18px, 2vw, 22px)",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {parseInlineBold(node.text)}
                </h2>
              );
            }
            if (node.type === "h3") {
              return (
                <h3
                  key={i}
                  className={`mt-4 first:mt-0 text-foreground/85 ${hideOnMobileWhenCollapsed}`}
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(15px, 1.6vw, 18px)",
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {parseInlineBold(node.text)}
                </h3>
              );
            }
            return (
              <p
                key={i}
                className={hideOnMobileWhenCollapsed}
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  lineHeight: 1.65,
                  color: "rgba(var(--foreground-rgb), 0.72)",
                }}
              >
                {parseInlineBold(node.text)}
              </p>
            );
          })}
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 md:hidden inline-flex items-center gap-2 min-h-[44px] hover:underline transition-colors"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "#c87800",
              letterSpacing: "0.02em",
            }}
            aria-expanded={expanded}
          >
            {expanded ? "Ler menos" : "Ler mais"}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </section>
  );
}
