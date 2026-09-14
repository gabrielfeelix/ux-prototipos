import { HeroSection } from "./HeroSection";
import { CardVariantProvider } from "./CardVariantContext";
import { TrustStrip } from "./TrustStrip";
import { OfertasDaSemana } from "./OfertasDaSemana";
import { CategoryShowcase } from "./CategoryShowcase";
import { ProductShelf } from "./ProductShelf";
import { MonteSeuKit } from "./MonteSeuKit";
import { LinhasDeViolao } from "./LinhasDeViolao";
import { EncordoamentosShowcase } from "./EncordoamentosShowcase";
import { StoryBand } from "./StoryBand";
import { SocialProofBar } from "./SocialProofBar";
import { MusicosTonante } from "./MusicosTonante";
import { GuiaIniciante } from "./GuiaIniciante";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";
import { SEO } from "./SEO";
import { allProducts } from "./productsData";

// Seleções dinâmicas do catálogo Tonante.
const byReviews = [...allProducts].sort((a, b) => b.reviews - a.reviews);
const bestSellerIds = byReviews.slice(0, 10).map((p) => p.id);
const novelties = [...allProducts].filter((p) => p.badge === "Novidade");
const newArrivalIds = (novelties.length >= 6 ? novelties : byReviews.slice(10, 16))
  .slice(0, 6)
  .map((p) => p.id);

export function HomePage() {
  return (
    <CardVariantProvider variant="classic">
      <SEO
        title="Violões, guitarras, contrabaixos e acessórios"
        description="Loja oficial Tonante. Tradição brasileira desde 1954. Violões, guitarras, contrabaixos, cordas e acessórios. Frete grátis acima de R$ 299. Até 10x sem juros."
        canonicalPath="/"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Tonante",
          url: "https://tonante.com.br",
          logo: "https://tonante.com.br/brand/tonante-wordmark-dark.png",
          sameAs: [
            "https://www.instagram.com/tonanteinstrumentos",
            "https://www.youtube.com/@tonanteinstrumentos",
          ],
        }}
      />
      {/* 1. Hero (carrossel de banners) */}
      <HeroSection />

      {/* 3. Vantagens */}
      <TrustStrip />

      {/* 4. Ofertas da semana (funde Drop do dia + Flash deals; 1 countdown) */}
      <OfertasDaSemana />

      {/* 5. Categorias — O que você toca hoje? */}
      <CategoryShowcase />

      {/* 6. Top da semana (ranked) + Recém-chegados em abas — enxuga 1 dobra */}
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

      {/* 7. Cada violão, uma experiência */}
      <LinhasDeViolao />

      {/* 7b. Qual corda é a sua? — famílias de encordoamento (V3 §5) */}
      <EncordoamentosShowcase />

      {/* 8. Monte seu kit (combo) */}
      <MonteSeuKit />

      {/* 9. Herança 1954 + prova social */}
      <StoryBand />
      <SocialProofBar />

      {/* 10. Músicos Tonante — retratos P&B + modal vídeo/depoimento (V3 §4) */}
      <MusicosTonante />

      {/* 12. Guia do primeiro violão (captura iniciante) */}
      <GuiaIniciante />

      {/* 13. Newsletter + Footer (onda sonora animada substitui o divisor de cordas) */}
      <Newsletter />
      <Footer />
    </CardVariantProvider>
  );
}
