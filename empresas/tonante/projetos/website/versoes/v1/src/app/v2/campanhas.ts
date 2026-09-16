import { promocoes, maiorDesconto, instrumentos, idsDe, resumoDaSelecao } from "./curadoria";

/* Campanhas da home — o primeiro carrossel depois do hero é o primeiro
   contato: ele oferta, não cataloga. Por isso não tem filtro nem aba; ele
   carrega UMA campanha por vez.

   Regra de título: quem chega tem que entender a oferta lendo UMA linha, sem
   saber o calendário da loja. "Mês do Músico / Preço de quem vive de música"
   não diz o que está barato nem quanto. "Promoção / Até 30% off em violão,
   guitarra e contrabaixo" diz. Nome de campanha, quando existir, vive no
   eyebrow — nunca no lugar da oferta.

   Pra trocar a campanha do ar, mude CAMPANHA_ATIVA. */

export type Campanha = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  produtos: number[];
};

/* Seleção da promoção: desconto real, instrumento na frente, teto por tipo
   (ver v2/curadoria.ts) — é o que tira cabo e suporte da primeira dobra. */
const emPromocao = promocoes(12);
const pctPromo = maiorDesconto(emPromocao);
/* o título lê a própria seleção: prometer "contrabaixo" com a fileira cheia
   de cavaco é o mesmo erro de "Mês do Músico", só que mais caro. */
/* lê só os primeiros cards: é o que está na tela quando alguém lê o título.
   Prometer microfone porque ele existe no fim do trilho é o mesmo vazio. */
const oQueTem = resumoDaSelecao(emPromocao.slice(0, 5));

export const CAMPANHAS: Campanha[] = [
  {
    key: "promocao",
    eyebrow: "Promoção",
    title: `Até ${pctPromo}% off em ${oQueTem}`,
    subtitle: "Desconto à vista e em até 10x sem juros. Enquanto durar o estoque.",
    ctaLabel: "Ver todas as promoções",
    href: "/produtos?promo=1",
    produtos: idsDe(emPromocao),
  },
  {
    key: "aniversario-tonante",
    eyebrow: "70 anos Tonante",
    title: "Os instrumentos da edição de aniversário",
    subtitle: "Séries comemorativas e clássicos da casa, em quantidade limitada.",
    ctaLabel: "Ver a seleção de aniversário",
    href: "/produtos",
    produtos: idsDe(instrumentos(12)),
  },
  {
    key: "back-to-70s",
    eyebrow: "Back to 70's",
    title: "Violões e guitarras com timbre de estúdio antigo",
    subtitle: "Madeiras escuras, som encorpado: o que a Tonante faz desde 1954.",
    ctaLabel: "Ver instrumentos",
    href: "/produtos",
    produtos: idsDe(instrumentos(12, ["Violões", "Guitarras", "Contrabaixos"])),
  },
];

/** Campanha no ar agora. */
export const CAMPANHA_ATIVA = CAMPANHAS[0];
