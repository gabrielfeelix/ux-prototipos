import { Suspense, lazy, type ComponentType } from "react";
import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import {
  EsqueletoAfinador,
  EsqueletoCarrinho,
  EsqueletoCheckout,
  EsqueletoPDP,
  EsqueletoPagina,
  EsqueletoPerfil,
} from "./components/Esqueletos";
import { HomeV2 } from "./v2/HomeV2";

/* Todas as rotas eram importadas aqui em cima, o que punha as ~30 páginas do
   site num arquivo só: 2,37 MB (518 KB comprimidos) que a pessoa precisava
   baixar e interpretar antes de ver qualquer pixel da home. Quem entrava só
   pra olhar um violão pagava pelo checkout, pelo afinador e pelo monte-seu-kit.
   Agora cada página é um pedaço à parte, buscado quando alguém vai até ela.

   A home fica de fora: é o destino mais comum e o primeiro a pintar, então
   um segundo pedido só pra ela seria uma viagem de ida e volta antes do
   banner. Ela continua junto do bundle inicial, de propósito. */

/** Envolve a página preguiçosa no esqueleto.
 *
 * O terceiro argumento é o esqueleto da rota. O padrão desenha título e uma
 * grade de cards, que é o formato do catálogo e da maioria das páginas; a PDP
 * não tem grade nenhuma e passa o seu (`EsqueletoPDP`). Um esqueleto que
 * promete a página errada é pior que nenhum: a pessoa vê uma vitrine piscando
 * e recebe uma foto única. */
function carregar(
  importar: () => Promise<{ [k: string]: unknown }>,
  nome: string,
  Esqueleto: ComponentType = EsqueletoPagina,
) {
  const Pagina = lazy(async () => {
    const mod = await importar();
    return { default: mod[nome] as ComponentType };
  });
  return (
    <Suspense fallback={<Esqueleto />}>
      <Pagina />
    </Suspense>
  );
}

const basename =
  import.meta.env.BASE_URL === "/"
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, Component: HomeV2 },

      /* Home anterior (v1) preservada em /legado — mantém Navbar/AnnouncementBar. */
      { path: "legado", element: carregar(() => import("./components/HomePage"), "HomePage") },
      { path: "produtos", element: carregar(() => import("./components/ProductsPage"), "ProductsPage") },
      /* mesma vitrine, filtro de promoção ligado pela rota (ver ehOfertas) */
      { path: "ofertas", element: carregar(() => import("./components/ProductsPage"), "ProductsPage") },
      { path: "produto/:id", element: carregar(() => import("./components/ProductPage"), "ProductPage", EsqueletoPDP) },
      { path: "carrinho", element: carregar(() => import("./components/CartPage"), "CartPage", EsqueletoCarrinho) },
      { path: "checkout", element: carregar(() => import("./components/CheckoutPage"), "CheckoutPage", EsqueletoCheckout) },
      { path: "pre-venda", element: carregar(() => import("./components/PreOrderPage"), "PreOrderPage") },
      { path: "perfil", element: carregar(() => import("./components/ProfilePage"), "ProfilePage", EsqueletoPerfil) },
      { path: "influenciadores", element: carregar(() => import("./pages/ArtistasPage"), "ArtistasPage") },
      { path: "revendedor", element: carregar(() => import("./pages/RevendaPage"), "RevendaPage") },
      { path: "trabalhe-conosco", element: carregar(() => import("./pages/TrabalheConoscoPage"), "TrabalheConoscoPage") },
      { path: "fale-conosco", element: carregar(() => import("./components/pages/ContactPage"), "ContactPage") },
      { path: "onde-encontrar", element: carregar(() => import("./components/pages/StoreLocatorPage"), "StoreLocatorPage") },
      { path: "maringa-fc", element: carregar(() => import("./components/pages/MaringaFCCollabPage"), "MaringaFCCollabPage") },
      { path: "monte-seu-kit", element: carregar(() => import("./pages/monte-seu-kit/MonteSeuKitPage"), "MonteSeuKitPage") },
      { path: "monte-seu-kit/ajuda", element: carregar(() => import("./pages/monte-seu-kit/AjudaPage"), "AjudaPage") },
      { path: "monte-seu-kit/montar", element: carregar(() => import("./pages/monte-seu-kit/MontarPage"), "MontarPage") },
      { path: "drivers-e-manuais", element: carregar(() => import("./pages/DriversManuaisPage"), "DriversManuaisPage") },
      { path: "drivers-e-manuais/:slug", element: carregar(() => import("./pages/DriverDetailPage"), "DriverDetailPage") },
      { path: "comparar", element: carregar(() => import("./pages/ComparePage"), "ComparePage") },
      { path: "faq", element: carregar(() => import("./pages/FaqPage"), "FaqPage") },
      { path: "afinador", element: carregar(() => import("./pages/afinador/AfinadorPage"), "AfinadorPage", EsqueletoAfinador) },

      /* Showcase do sistema de botões. Rota de desenvolvimento: não é linkada
         em lugar nenhum e não entra no sitemap. Precisa ficar acima do bloco
         de ":category/:subcategory", que engoliria /ds/botoes. */
      { path: "ds/botoes", element: carregar(() => import("./pages/ds/BotoesPage"), "BotoesPage") },
      /* O guia antigo virou o passo do quiz novo. A rota fica de pé porque
         ela foi divulgada e existe link pra ela na home. */
      { path: "guia", loader: () => redirect("/monte-seu-kit/ajuda") },
      { path: "quem-somos", element: carregar(() => import("./pages/QuemSomosPage"), "QuemSomosPage") },
      { path: "politica-de-privacidade", element: carregar(() => import("./pages/PrivacyPage"), "PrivacyPage") },
      { path: "politica-de-garantia", element: carregar(() => import("./pages/WarrantyPage"), "WarrantyPage") },
      { path: "termos-de-uso", element: carregar(() => import("./pages/TermsPage"), "TermsPage") },

      /* ── Semantic URL routes (A1) ──
         Order matters: static paths above are matched first by react-router.
         Dynamic segments below resolve via getCategoryFromSlug() inside the
         page component; unknown slugs render an empty result set.
         Examples:
           /perifericos                    -> ProductsPage (Periféricos)
           /perifericos/mouses             -> ProductsPage (Periféricos / Mouses)
           /perifericos/pcyes/mouse-vert   -> ProductPage  (no subcategory)
           /perifericos/mouses/pcyes/mv01  -> ProductPage  (full slug path)  */
      { path: ":category", element: carregar(() => import("./components/ProductsPage"), "ProductsPage") },
      { path: ":category/:subcategory", element: carregar(() => import("./components/ProductsPage"), "ProductsPage") },
      { path: ":category/:brand/:slug", element: carregar(() => import("./components/ProductPage"), "ProductPage", EsqueletoPDP) },
      { path: ":category/:subcategory/:brand/:slug", element: carregar(() => import("./components/ProductPage"), "ProductPage", EsqueletoPDP) },
    ],
  },
], { basename });
