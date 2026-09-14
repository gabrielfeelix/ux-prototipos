import { allProducts } from "../components/productsData";
import { getVisibleCatalogProducts } from "../components/productPresentation";

/* Campanhas da home — o primeiro carrossel depois do hero é o primeiro
   contato: ele oferta, não cataloga. Por isso não tem filtro nem aba; ele
   carrega UMA campanha por vez ("Mês do Músico", "Aniversário Tonante",
   "Back to 70's"…).

   Pra trocar a campanha do ar, mude ATIVA. Pra criar uma nova, some um item
   em CAMPANHAS com os ids escolhidos a dedo ou uma regra de seleção. */

export type Campanha = {
  key: string;
  eyebrow: string;
  title: string;
  href: string;
  produtos: number[];
};

const catalogo = getVisibleCatalogProducts(allProducts);
const porRelevancia = [...catalogo].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
const ids = (lista: typeof catalogo, n = 12) => lista.slice(0, n).map((p) => p.id);

export const CAMPANHAS: Campanha[] = [
  {
    key: "mes-do-musico",
    eyebrow: "Mês do Músico",
    title: "Preço de quem vive de música",
    href: "/produtos?promo=1",
    // seleção provisória: maior desconto real do catálogo
    produtos: ids(
      [...catalogo]
        .filter((p) => p.oldPriceNum && p.oldPriceNum > p.priceNum)
        .sort((a, b) => (b.oldPriceNum! - b.priceNum) / b.oldPriceNum! - (a.oldPriceNum! - a.priceNum) / a.oldPriceNum!),
    ),
  },
  {
    key: "aniversario-tonante",
    eyebrow: "70 anos Tonante",
    title: "A seleção de aniversário",
    href: "/produtos",
    produtos: ids(porRelevancia),
  },
  {
    key: "back-to-70s",
    eyebrow: "Back to 70's",
    title: "O timbre que atravessou gerações",
    href: "/produtos",
    produtos: ids(porRelevancia.filter((p) => ["Violões", "Guitarras", "Contrabaixos"].includes(p.category))),
  },
];

/** Campanha no ar agora. */
export const CAMPANHA_ATIVA = CAMPANHAS[0];
