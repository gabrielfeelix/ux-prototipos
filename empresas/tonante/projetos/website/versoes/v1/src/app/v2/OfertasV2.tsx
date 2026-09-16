"use client";

import { useMemo } from "react";
import { BannerShelf, type ShelfBanner } from "./BannerShelf";
import { allProducts, type Product } from "../components/productsData";
import { getCatalogHref, getVisibleCatalogProducts } from "../components/productPresentation";
import { primeiroInstrumento } from "./curadoria";
import { formatBRL, getPixPrice } from "../components/productEnhancements";

/* OfertasV2 — prateleira com banner fixo à direita + trilho de produtos.
   O desenho mora em BannerShelf; aqui fica só o recorte.

   Esta dobra fala com UM público: quem nunca tocou. Antes era um segundo
   "Mais vendidos" — a home já tem um logo abaixo, e os dois brigavam pelos
   mesmos produtos. Público é recorte que a prova social não cobre, e o banner
   só funciona quando tem uma promessa própria pra carregar. */

const BANNER: Omit<ShelfBanner, "headline"> = {
  eyebrow: "Para quem está começando",
  /* o header já diz "Seu primeiro violão"; a arte carrega o preço, que é o
     que trava a decisão de quem nunca comprou instrumento. O valor entra em
     runtime, do menor preço da própria seleção. */
  title: "Seu primeiro violão",
  sub: "Chega afinado e regulado de fábrica, com garantia Tonante de 1 ano.",
  cta: "Ver violões de estudo",
  href: getCatalogHref({ category: "Violões" }),
  art: "/ofertas/primeiro-violao.jpg",
  focus: "center 30%",
  img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=85&auto=format&fit=crop",
};

interface OfertasV2Props {
  /** seleção vinda da home (ver v2/curadoria.ts). Sem ela, cai nos violões de
      entrada do catálogo — a seção nunca aparece vazia. */
  productIds?: number[];
}

export function OfertasV2({ productIds }: OfertasV2Props) {
  const itens = useMemo(() => {
    const visivel = getVisibleCatalogProducts(allProducts);
    const escolhidos = (productIds ?? [])
      .map((id) => visivel.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return escolhidos.length > 0 ? escolhidos : primeiroInstrumento(12);
  }, [productIds]);

  /* mesmo preço que o card mostra (pix), senão a arte promete um valor e o
     primeiro card ao lado dela mostra outro. */
  const menorPreco = useMemo(
    () => (itens.length ? formatBRL(Math.min(...itens.map((p) => getPixPrice(p)))) : "R$ 399"),
    [itens],
  );

  return <BannerShelf banner={{ ...BANNER, headline: `A partir de ${menorPreco}` }} itens={itens} side="right" />;
}
