import type { Product } from "./productsData";

/* productsExtra — produtos que ainda não existem no catálogo da Oderço.
 *
 * `productsData.ts` é despejo do Magento: tudo lá é real. Este arquivo é o
 * oposto — itens montados à mão pra sustentar uma seção do site enquanto o
 * produto de verdade não entra na base. Fica separado justamente pra ninguém
 * confundir dado inventado com dado do ERP, e pra apagar o arquivo inteiro
 * quando o catálogo alcançar.
 *
 * ⚠️ PLACEHOLDER: preço, SKU, avaliações, specs e foto são fabricados.
 *    Trocar por dado real antes de qualquer publicação.
 */
export const extraProducts: Product[] = [
  {
    id: 284,
    sku: "CT1954NT",
    name: "Cavaquinho Tonante Natural - Tampo Sólido - CT1954NT",
    price: "R$ 749,90",
    priceNum: 749.9,
    oldPrice: "R$ 899,90",
    oldPriceNum: 899.9,
    rating: 4.7,
    reviews: 41,
    category: "Violões",
    subcategory: "Cavaquinho",
    tags: ["Violões", "Cavaquinho", "Acústico", "4 cordas"],
    /* Foto tirada do vídeo institucional (public/musicos/Conceito.mp4, 19,0s).
       Não é foto de catálogo: tem fundo de feira e o músico em quadro. */
    image: "/produtos/cavaquinho-tonante-natural.jpg",
    images: ["/produtos/cavaquinho-tonante-natural.jpg"],
    brand: "Tonante",
    inStock: true,
    description:
      "Cavaquinho Tonante em acabamento natural acetinado, com aro e fundo em tom avermelhado. Corpo compacto, quatro cordas e projeção de sobra pra tocar na roda sem amplificação.",
    specs: [
      { label: "SKU", value: "CT1954NT" },
      { label: "Categoria", value: "Violões" },
      { label: "Marca", value: "Tonante" },
      { label: "Cordas", value: "4" },
      { label: "Acabamento", value: "Natural acetinado" },
      { label: "Garantia", value: "2 anos contra defeitos de fabricação" },
      { label: "Origem", value: "Brasil · tradição desde 1954" },
    ],
    seoSlug: "cavaquinho-tonante-natural-tampo-solido-ct1954nt",
    productUrl: "https://tonante.com.br/cavaquinho-tonante-natural-tampo-solido-ct1954nt",
  },
  {
    id: 285,
    sku: "VTZ1954ZB",
    name: "Violão Aço Eletroacústico Tonante - Zebrano - Cutaway - VTZ1954ZB",
    price: "R$ 2.149,90",
    priceNum: 2149.9,
    rating: 4.9,
    reviews: 28,
    category: "Violões",
    tags: ["Violões", "Aço", "Eletroacústico", "Acústico"],
    /* Foto tirada do vídeo MVI_9386 (8s). Não é foto de catálogo. */
    image: "/produtos/violao-tonante-zebrano.jpg",
    images: ["/produtos/violao-tonante-zebrano.jpg"],
    brand: "Tonante",
    inStock: true,
    description:
      "Violão de aço eletroacústico com tampo em zebrano, cutaway e equalizador embutido. O desenho do veio faz cada peça sair diferente da outra.",
    specs: [
      { label: "SKU", value: "VTZ1954ZB" },
      { label: "Categoria", value: "Violões" },
      { label: "Marca", value: "Tonante" },
      { label: "Cordas", value: "6 (aço)" },
      { label: "Tampo", value: "Zebrano" },
      { label: "Garantia", value: "2 anos contra defeitos de fabricação" },
      { label: "Origem", value: "Brasil · tradição desde 1954" },
    ],
    seoSlug: "violao-aco-eletroacustico-tonante-zebrano-cutaway-vtz1954zb",
    productUrl: "https://tonante.com.br/violao-aco-eletroacustico-tonante-zebrano-cutaway-vtz1954zb",
  },
];
