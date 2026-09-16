import { CardVariantProvider } from "../components/CardVariantContext";
import { HeroBannersV2 } from "./HeroBannersV2";
import { CategoriasV2 } from "./CategoriasV2";
import { OfertasV2 } from "./OfertasV2";
import { NovidadesV2 } from "./NovidadesV2";
import { ProductShelf } from "../components/ProductShelf";
import { EncordoamentosV2 } from "./EncordoamentosV2";
import { Video70Anos } from "./Video70Anos";
import { MusicosTonante } from "../components/MusicosTonante";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";
import { getCatalogHref } from "../components/productPresentation";
import { CAMPANHA_ATIVA } from "./campanhas";
import { PRE_ORDER_ITEMS } from "../components/PreOrderData";
import {
  acessoriosBonitos,
  catalogo,
  idsDe,
  selecionar,
  lancamentos,
  maisVendidos,
  primeiroInstrumento,
} from "./curadoria";

/* HomeV2 — home do site.

   Cada dobra comercial responde UMA pergunta de quem está comprando, e
   nenhuma repete a pergunta da outra:

     hero          o que a marca está anunciando
     promoção      o que está barato agora            → preço
     categorias    onde fica o que eu quero           → navegação
     novidades     o que acabou de chegar             → novidade
     70 anos       posso confiar nessa loja           → marca
     primeiro viol. nunca toquei, por onde começo     → público
     pré-venda     o que ainda vai chegar             → antecipação
     cordas        o que eu recompro                  → recompra
     mais vendidos o que os outros estão levando      → prova social
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

/* Ordem de ESCOLHA, que não é a ordem em que as dobras aparecem: quem tem o
   estoque mais estreito escolhe primeiro. Novidade é o que a loja marcou como
   novidade — doze produtos — enquanto "primeiro violão" tem setenta e oito
   violões de entrada pra escolher. Deixando o primeiro violão na frente, ele
   levava quase todos os marcados e a dobra Novidades terminava preenchida
   pelo catálogo geral, sem a pill "Novidade" que o card promete. */
/* Pré-venda sai de PreOrderData, não da curadoria: é uma lista editorial com
   data de lançamento e lote, a mesma que abre o card de reserva na PDP. Sem
   dobra própria, esses seis produtos não apareciam em lugar nenhum da home —
   a pill do card existia e nunca era vista. */
const preVendaTodos = new Set(PRE_ORDER_ITEMS.map((item) => item.productId));
/* Passa pela mesma peneira das outras dobras porque a lista editorial traz a
   Guitarra 70 Anos em três acabamentos: sem deduplicar por família, a fileira
   abria com a mesma guitarra três vezes — e o card já mostra as cores em
   miniatura embaixo da foto. */
const preVendaIds = idsDe(selecionar({ pool: catalogo.filter((p) => preVendaTodos.has(p.id)), n: 12 }));

const novidadesIds = idsDe(lancamentos(9, [...promoIds, ...preVendaIds]));

const iniciantes = primeiroInstrumento(12, 1200, [...promoIds, ...preVendaIds, ...novidadesIds]);
const iniciantesIds = idsDe(iniciantes);

const usadosAteAqui = [...promoIds, ...preVendaIds, ...novidadesIds, ...iniciantesIds];

const topIds = idsDe(maisVendidos(12, usadosAteAqui));
/* seleção fixa, escolhida pela foto — ver ACESSORIOS_BONITOS em v2/curadoria.ts */
const acessoriosIds = idsDe(acessoriosBonitos());

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
          href={CAMPANHA_ATIVA.href}
          ctaLabel={CAMPANHA_ATIVA.ctaLabel}
          productIds={CAMPANHA_ATIVA.produtos}
          emphasizeDiscount
        />

        {/* 3. navegação por categoria */}
        <CategoriasV2 />

        {/* 4. novidade: o lote novo. Era uma aba de "Mais vendidos", e aba
               escondia o recorte atrás de um clique. */}
        <NovidadesV2 productIds={novidadesIds} />

        {/* 5. institucional: respiro, cor e história */}
        <Video70Anos />

        {/* 6. público: quem nunca tocou — banner + trilho de violão de estudo.
               Espelha a dobra de novidades: banner do outro lado, com o vídeo
               entre as duas pra nenhuma leitura ficar repetida. */}
        <OfertasV2 productIds={iniciantesIds} />

        {/* 7. antecipação: o que ainda não saiu da fábrica. Vem logo depois do
               lote que acabou de chegar — as duas dobras contam o mesmo
               calendário, uma do lado de cá e outra do lado de lá. */}
        <ProductShelf
          label="Pré-venda"
          title="Reserve antes de sair da fábrica"
          productIds={preVendaIds}
          href="/pre-venda"
          ctaLabel="Ver todas as pré-vendas"
        />

        {/* 8. recompra: cordas. Sobe pra cima de "Mais vendidos" — pré-venda e
               mais vendidos são duas vitrines de instrumento seguidas, e a
               dobra de corda entre elas troca o assunto antes de cansar. */}
        <EncordoamentosV2 />

        {/* 9. prova social — o que os outros estão levando. Sem abas: sobrou
               um recorte só, e uma aba única é moldura sem função. */}
        <ProductShelf
          label="Mais vendidos"
          title="Os mais vendidos da semana"
          productIds={topIds}
          href="/produtos"
          ctaLabel="Ver o catálogo"
          showRanking
        />

        {/* 10. anexo — ticket baixo, grid de varredura (ninguém leva uma
               palheta só). Microfone e afinador abrem; suporte entra no fim. */}
        <ProductShelf
          label="Para levar junto"
          title="Acessórios para o seu instrumento"
          href={getCatalogHref({ category: "Acessórios" })}
          ctaLabel="Ver todos os acessórios"
          productIds={acessoriosIds}
          layout="grid"
          stickyBanner={{
            headline: "Complete o seu instrumento",
            sub: "Correia, afinador, palheta e cabo escolhidos com a mesma curadoria do violão.",
            cta: "Ver todos os acessórios",
            href: getCatalogHref({ category: "Acessórios" }),
            art: "/ofertas/acessorios.jpg",
            /* os objetos ocupam o terço de cima da foto; centralizado, o corte
               deixava metade da dobra em mesa vazia */
            focus: "center 22%",
            img: "https://images.unsplash.com/photo-1558098329-a11cff621064?w=1400&q=85&auto=format&fit=crop",
          }}
        />

        {/* 11. marca + captura */}
        <MusicosTonante />
        <Newsletter />
        <Footer />
      </div>
    </CardVariantProvider>
  );
}
