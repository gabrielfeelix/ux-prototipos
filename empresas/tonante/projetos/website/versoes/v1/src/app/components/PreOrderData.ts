export interface PreOrderInfo {
  productId: number;
  releaseDate: string; // ISO date
  preOrderPrice?: string;
  reservedUnits: number;
  totalUnits: number;
  highlight: string;
}

/* Pré-venda da Tonante: instrumentos que ainda estão saindo da fábrica de
   Maringá. Os ids apontam pro catálogo real e o preço de reserva fica abaixo
   do preço de prateleira — reservar tem que valer a pena.
   (A lista anterior era do template PCYES: ids de PC e copy de hardware, que
   caíam em cima de guitarras.) */
export const PRE_ORDER_ITEMS: PreOrderInfo[] = [
  {
    productId: 276, // Guitarra 70 Anos · Satin Black — R$ 3.989,90
    releaseDate: "2026-11-20T10:00:00",
    preOrderPrice: "R$ 3.649,90",
    reservedUnits: 212,
    totalUnits: 300,
    highlight: "Série 70 anos · 300 unidades numeradas, montadas em Maringá",
  },
  {
    productId: 278, // Guitarra 70 Anos · Olympic White — R$ 3.490,00
    releaseDate: "2026-12-05T10:00:00",
    preOrderPrice: "R$ 3.190,00",
    reservedUnits: 96,
    totalUnits: 300,
    highlight: "Edição 70 anos · corpo em alder e acabamento Olympic White",
  },
  {
    productId: 277, // Guitarra 70 Anos · Metallic — R$ 1.499,90
    releaseDate: "2026-10-28T10:00:00",
    preOrderPrice: "R$ 1.379,90",
    reservedUnits: 341,
    totalUnits: 400,
    highlight: "Edição 70 anos · captação calibrada uma a uma na fábrica",
  },
  {
    productId: 123, // Violão eletroacústico Performance Plus — R$ 898,00
    releaseDate: "2026-10-09T10:00:00",
    preOrderPrice: "R$ 819,00",
    reservedUnits: 148,
    totalUnits: 250,
    highlight: "Primeira leva do Performance Plus · tampo maciço e EQ ativo",
  },
  {
    productId: 44, // Contrabaixo Theodor 5 cordas · Nude Wood — R$ 777,90
    releaseDate: "2026-11-06T10:00:00",
    preOrderPrice: "R$ 709,90",
    reservedUnits: 84,
    totalUnits: 200,
    highlight: "Theodor 5 cordas · lote piloto com escala em jatobá",
  },
  {
    productId: 38, // Guitarra Star Light SS · Red Sunset — R$ 699,90
    releaseDate: "2026-10-16T10:00:00",
    preOrderPrice: "R$ 639,90",
    reservedUnits: 268,
    totalUnits: 400,
    highlight: "Star Light Red Sunset · primeira leva do acabamento vermelho",
  },
];

export function getPreOrderInfo(productId: number): PreOrderInfo | null {
  return PRE_ORDER_ITEMS.find((p) => p.productId === productId) ?? null;
}
