import type { Product } from "./productsData";

/* productsExtra — produtos que existem na Oderço mas ficaram fora do dump.
 *
 * `productsData.ts` é despejo do Magento e não traz tudo: item fora de estoque
 * não entra. Este arquivo cobre o que a loja precisa mostrar e o dump não tem.
 * Fica separado pra ninguém confundir com o despejo e pra sumir quando um novo
 * dump alcançar.
 *
 * Regerar um item daqui: o GraphQL público da Oderço responde por SKU —
 *   curl -s https://www.oderco.com.br/graphql -H 'Content-Type: application/json' \
 *     -d '{"query":"{products(search:\"CP111630\",pageSize:1){items{sku name url_key price_range{minimum_price{final_price{value}}} stock_status media_gallery{url position} description{html}}}}"}'
 */
export const extraProducts: Product[] = [
  {
    /* Violão do vídeo do Thiago Nunes. É produto de verdade da Oderço
       (CP111630) — a busca por "zebrano" não achava porque no catálogo o tampo
       se chama "Zebra". Dados puxados do GraphQL da Oderço em 15/09/2026.
       ⚠️ A Oderço marca OUT_OF_STOCK hoje; aqui fica `inStock: true` porque o
       protótipo precisa vender o card do músico. Conferir antes de publicar. */
    id: 285,
    /* SKU do ERP, como no resto do catálogo — é ele que casa com a galeria
       oficial em productGalleries.ts (public/produtos/oficial/111630/). */
    sku: "CP111630",
    name: 'Violão Elétrico Safira 41" - Tampo em Zebra - EQ 4 Bandas - Fosco - VSZ1954N41Z',
    price: "R$ 489,90",
    priceNum: 489.90,
    rating: 4.9,
    reviews: 28,
    category: "Violões",
    tags: ["Violões", "Aço", "Eletroacústico", "Acústico"],
    /* Fotos de estúdio do site oficial, baixadas por scripts/fotos-oficiais.py.
       A galeria completa vem de productGalleries.ts pelo SKU; aqui fica só a
       foto de capa. */
    image: "/produtos/oficial/111630/111630_2.webp",
    images: ["/produtos/oficial/111630/111630_2.webp"],
    brand: "Tonante",
    inStock: true,
    description:
      "Os violões da linha Safira somam Spruce, Sapele, Walnut e Zebra num instrumento de som quente, com graves cheios e médios definidos. O braço dá acesso confortável aos 20 trastes e o pré-amplificador ALT-3 de 4 bandas, com afinador, resolve o palco.",
    specs: [
      { label: "SKU", value: "VSZ1954N41Z" },  // código de fábrica, o do ERP é CP111630
      { label: "Categoria", value: "Violões" },
      { label: "Marca", value: "Tonante" },
      { label: "Tamanho", value: '41"' },
      { label: "Shape", value: "Folk com cutaway" },
      { label: "Tampo", value: "Zebra" },
      { label: "Lateral e fundo", value: "Linden" },
      { label: "Braço", value: "Mahogany" },
      { label: "Escala e cavalete", value: "Rosewood" },
      { label: "Pestana e rastilho", value: "Osso" },
      { label: "Equalizador", value: "4 bandas com afinador" },
      { label: "Acabamento", value: "Fosco" },
      { label: "Garantia", value: "2 anos contra defeitos de fabricação" },
      { label: "Origem", value: "Brasil · tradição desde 1954" },
    ],
    seoSlug: "violao-eletrico-safira-41-tampo-em-zebra-eq-4-bandas-fosco-vsz1954n41z",
    productUrl:
      "https://www.oderco.com.br/viol-o-eletrico-safira-41-tampo-em-zebra-eq-4-bandas-fosco-vsz1954n41z-cp111630",
  },
];
