import { CardVariantProvider } from "../components/CardVariantContext";
import { HeroBannersV2 } from "./HeroBannersV2";
import { CategoriasV2 } from "./CategoriasV2";
import { OfertasV2 } from "./OfertasV2";
import { ProductShelf } from "../components/ProductShelf";
import { MonteSeuKit } from "../components/MonteSeuKit";
import { EncordoamentosV2 } from "./EncordoamentosV2";
import { Video70Anos } from "./Video70Anos";
import { MusicosTonante } from "../components/MusicosTonante";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";
import { getCatalogHref } from "../components/productPresentation";
import { CAMPANHA_ATIVA } from "./campanhas";
import {
  acessoriosDeTocar,
  idsDe,
  lancamentos,
  maisVendidos,
  primeiroInstrumento,
  resumoDeItens,
} from "./curadoria";

/* HomeV2 — home do site.

   Cada dobra comercial responde UMA pergunta de quem está comprando, e
   nenhuma repete a pergunta da outra:

     hero          o que a marca está anunciando
     promoção      o que está barato agora            → preço
     categorias    onde fica o que eu quero           → navegação
     primeiro viol. nunca toquei, por onde começo     → público
     70 anos       posso confiar nessa loja           → marca
     mais vendidos o que os outros estão levando      → prova social
     cordas        o que eu recompro                  → recompra
     kit           leva tudo junto e paga menos       → combo
     linhas        qual violão combina comigo         → marca
     acessórios    o que falta pra eu tocar hoje      → anexo

   Duas regras que a home tinha quebrado, e que sustentam o resto:

   1. TÍTULO ÓBVIO. O título diz a oferta, não o nome interno da campanha.
      "Mês do Músico / Preço de quem vive de música" não informa nem o que
      está barato nem quanto; "Promoção / Até 30% off em violão, guitarra e
      contrabaixo" informa. Nome de campanha vive no eyebrow.

   2. VITRINE DE INSTRUMENTO. Ordenar o catálogo por review devolve corda,
      cabo e suporte de parede — os itens mais comprados e os mais feios. As
      seleções vêm de v2/curadoria.ts, que pesa apelo visual junto com prova
      social e limita quantos itens de cada tipo entram na mesma fileira.
      Suporte aparece; só não abre a dobra nem ocupa quatro cards seguidos.

   Nada de produto repetido entre dobras: cada seleção recebe em `exceto` o
   que já foi mostrado acima dela. */

const promoIds = CAMPANHA_ATIVA.produtos;

const iniciantes = primeiroInstrumento(12, 1200, promoIds);
const iniciantesIds = idsDe(iniciantes);

const usadosAteAqui = [...promoIds, ...iniciantesIds];

const topIds = idsDe(maisVendidos(12, usadosAteAqui));
const novidadesIds = idsDe(lancamentos(8, [...usadosAteAqui, ...topIds]));
const acessorios = acessoriosDeTocar(10, [...usadosAteAqui, ...topIds, ...novidadesIds]);
const acessoriosIds = idsDe(acessorios);
/* título lido da própria grade — ver resumoDeItens em v2/curadoria.ts */
const acessoriosResumo = resumoDeItens(acessorios, 3);
const acessoriosMenorPreco = Math.min(...acessorios.map((p) => p.priceNum));

export function HomeV2() {
  return (
    <CardVariantProvider variant="v2">
      <div style={{ background: "#ffffff" }}>
        {/* 1. anúncio — única dobra sem produto */}
        <HeroBannersV2 />

        {/* 2. preço: a oferta no ar, dita em uma linha */}
        <ProductShelf
          label={CAMPANHA_ATIVA.eyebrow}
          title={CAMPANHA_ATIVA.title}
          subtitle={CAMPANHA_ATIVA.subtitle}
          href={CAMPANHA_ATIVA.href}
          ctaLabel={CAMPANHA_ATIVA.ctaLabel}
          productIds={CAMPANHA_ATIVA.produtos}
          emphasizeDiscount
        />

        {/* 3. navegação por categoria */}
        <CategoriasV2 />

        {/* 4. público: quem nunca tocou — banner + trilho de violão de estudo */}
        <OfertasV2 productIds={iniciantesIds} />

        {/* 5. institucional: respiro, cor e história */}
        <Video70Anos />

        {/* 6. prova social — o que sai mais / o que acabou de chegar */}
        <ProductShelf
          label="Mais vendidos"
          title="Os mais vendidos da semana"
          productIds={topIds}
          href="/produtos"
          ctaLabel="Ver o catálogo"
          showRanking
          tabs={[
            {
              tabLabel: "Mais vendidos",
              eyebrow: "Mais vendidos",
              title: "Os mais vendidos da semana",
              subtitle: "O que mais saiu da loja nos últimos sete dias.",
              productIds: topIds,
              showRanking: true,
            },
            {
              tabLabel: "Chegou agora",
              eyebrow: "Novidades",
              title: "Chegou agora na Tonante",
              subtitle: "Últimos modelos a entrar no catálogo, ainda em primeiro lote.",
              productIds: novidadesIds,
            },
          ]}
        />

        {/* 7. recompra: cordas */}
        <EncordoamentosV2 />

        {/* 8. combo — instrumento + o que ele pede junto */}
        <MonteSeuKit />

        {/* 9. anexo — ticket baixo, grid de varredura (ninguém leva uma
               palheta só). Microfone e afinador abrem; suporte entra no fim. */}
        <ProductShelf
          label="Acessórios"
          title={`Leva junto: ${acessoriosResumo}`}
          subtitle={`O que falta pra você tocar hoje. A partir de ${acessoriosMenorPreco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}, com frete grátis acima de R$ 299.`}
          href={getCatalogHref({ category: "Acessórios" })}
          ctaLabel="Ver todos os acessórios"
          productIds={acessoriosIds}
          layout="grid"
        />

        {/* 10. marca + captura */}
        <MusicosTonante />
        <Newsletter />
        <Footer />
      </div>
    </CardVariantProvider>
  );
}
