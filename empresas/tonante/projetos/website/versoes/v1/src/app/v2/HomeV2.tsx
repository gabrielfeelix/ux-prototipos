import { CardVariantProvider } from "../components/CardVariantContext";
import { HeroBannersV2 } from "./HeroBannersV2";
import { CategoriasV2 } from "./CategoriasV2";
import { OfertasV2 } from "./OfertasV2";
import { ProductShelf } from "../components/ProductShelf";
import { MonteSeuKit } from "../components/MonteSeuKit";
import { LinhasDeViolao } from "../components/LinhasDeViolao";
import { EncordoamentosV2 } from "./EncordoamentosV2";
import { Video70Anos } from "./Video70Anos";
import { MusicosTonante } from "../components/MusicosTonante";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";
import { allProducts } from "../components/productsData";
import { getVisibleCatalogProducts } from "../components/productPresentation";
import { CAMPANHA_ATIVA } from "./campanhas";

/* HomeV2 — home do site.

   Ritmo da página: o visitante tem que estar quase sempre com produto na
   tela. A cada bloco comercial (carrossel, prateleira, categorias) segue um
   bloco institucional, que serve de respiro, dá cor à página e ainda empurra
   pra algo que vende.

     hero → carrossel → categorias → ofertas
     → INSTITUCIONAL (história)
     → top da semana → encordoamentos → combo
     → INSTITUCIONAL (linhas)
     → carrossel → músicos → newsletter                                  */

const catalogo = getVisibleCatalogProducts(allProducts);
const INSTRUMENTOS = ["Violões", "Guitarras", "Contrabaixos"];

const porReviews = [...catalogo].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
const bestSellerIds = porReviews.slice(0, 10).map((p) => p.id);

const novidades = catalogo.filter((p) => p.badge === "Novidade");
const newArrivalIds = (novidades.length >= 6 ? novidades : porReviews.slice(10, 16)).slice(0, 6).map((p) => p.id);

/* Carrossel 2 (antes dos músicos) — o que completa a compra: cordas,
   acessórios e suportes. Ticket baixo, alto anexo. */
const completeIds = [...catalogo]
  .filter((p) => !INSTRUMENTOS.includes(p.category))
  .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
  .slice(0, 10)
  .map((p) => p.id);

export function HomeV2() {
  return (
    <CardVariantProvider variant="v2">
      <div style={{ background: "#ffffff" }}>
        {/* 1. anúncio — única dobra sem produto */}
        <HeroBannersV2 />

        {/* 2. campanha no ar — primeiro contato oferta, não cataloga.
               Sem abas: uma campanha por vez (ver v2/campanhas.ts). */}
        <ProductShelf
          label={CAMPANHA_ATIVA.eyebrow}
          title={CAMPANHA_ATIVA.title}
          productIds={CAMPANHA_ATIVA.produtos}
          emphasizeDiscount
        />

        {/* 3. navegação por categoria */}
        <CategoriasV2 />

        {/* 4. comercial pesado — banner + trilho */}
        <OfertasV2 />

        {/* 5. institucional: respiro, cor e história */}
        <Video70Anos />

        {/* 6. prateleira de mais vendidos */}
        <ProductShelf
          label="Mais vendidos"
          title="Top da semana"
          productIds={bestSellerIds}
          showRanking
          tabs={[
            { tabLabel: "Mais vendidos", eyebrow: "Mais vendidos", title: "Top da semana", productIds: bestSellerIds, showRanking: true },
            { tabLabel: "Lançamentos", eyebrow: "Lançamentos", title: "Recém-chegados", productIds: newArrivalIds },
          ]}
        />

        {/* 7. cordas */}
        <EncordoamentosV2 />

        {/* 8. comercial — combo (seção vai ser refeita) */}
        <MonteSeuKit />

        {/* 9. institucional: as linhas Tonante */}
        <LinhasDeViolao />

        {/* 10. último carrossel — o que completa a compra */}
        <ProductShelf
          label="Completa o setup"
          title="Cordas, acessórios e suportes"
          productIds={completeIds}
        />

        {/* 11. marca + captura */}
        <MusicosTonante />
        <Newsletter />
        <Footer />
      </div>
    </CardVariantProvider>
  );
}
