"use client";

import { useMemo } from "react";
import { BannerShelf, type ShelfBanner } from "./BannerShelf";
import { allProducts, type Product } from "../components/productsData";
import { getVisibleCatalogProducts } from "../components/productPresentation";
import { lancamentos, resumoDaSelecao } from "./curadoria";

/* NovidadesV2 — mesma dobra de banner + trilho do primeiro violão, com o
   banner do outro lado.

   Assume o recorte que antes era a aba "Chegou agora" de "Mais vendidos".
   Aba escondia o lote novo atrás de um clique e ainda deixava o título da
   dobra mentindo conforme a aba ativa; dobra própria mostra os dois de uma
   vez.

   Banner à esquerda, e o do primeiro violão à direita: as duas dobras usam o
   mesmo desenho e ficam separadas pelo vídeo dos 70 anos, então espelhar o
   lado dá ritmo em vez de repetir a mesma prateleira. A arte é escura de
   propósito — cai entre duas dobras brancas e marca a quebra. */

const BANNER: Omit<ShelfBanner, "headline"> = {
  eyebrow: "Novidades",
  title: "Chegou agora na Tonante",
  sub: "Últimos modelos a entrar no catálogo, ainda em primeiro lote.",
  cta: "Ver o catálogo completo",
  href: "/produtos",
  art: "/ofertas/novidades.jpg",
  focus: "center 35%",
  img: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=1200&q=85&auto=format&fit=crop",
};

interface NovidadesV2Props {
  /** seleção vinda da home (ver v2/curadoria.ts). Sem ela, cai nos
      lançamentos do catálogo — a seção nunca aparece vazia. */
  productIds?: number[];
}

export function NovidadesV2({ productIds }: NovidadesV2Props) {
  const itens = useMemo(() => {
    const visivel = getVisibleCatalogProducts(allProducts);
    const escolhidos = (productIds ?? [])
      .map((id) => visivel.find((p) => p.id === id))
      .filter(Boolean) as Product[];
    return escolhidos.length > 0 ? escolhidos : lancamentos(9);
  }, [productIds]);

  /* a manchete conta o que a própria fileira tem, como o preço conta na dobra
     do primeiro violão: "9 violões, guitarras e contrabaixos" envelhece junto
     com o estoque em vez de mentir um número escrito à mão. */
  const headline = useMemo(
    () => `${itens.length} ${itens.length === 1 ? "modelo novo" : "modelos novos"}`,
    [itens],
  );

  /* resumoDaSelecao devolve minúscula ("violão, guitarra e contrabaixo"), e
     aqui a frase começa com ela. */
  const resumo = useMemo(() => {
    const s = resumoDaSelecao(itens, 3);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [itens]);

  return (
    <BannerShelf
      banner={{ ...BANNER, headline, sub: `${resumo} que acabaram de entrar no catálogo.` }}
      itens={itens}
      side="left"
      /* foto escura: o degradê padrão não precisa pesar tanto, mas o rodapé
         ainda precisa segurar texto branco. */
      overlay="linear-gradient(180deg, rgba(20,18,16,.22) 35%, rgba(20,18,16,.72) 100%)"
    />
  );
}
