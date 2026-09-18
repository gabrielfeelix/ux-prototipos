import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductPage } from "./components/ProductPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { PreOrderPage } from "./components/PreOrderPage";
import { ProfilePage } from "./components/ProfilePage";
import { ArtistasPage } from "./pages/ArtistasPage";
import { RevendaPage } from "./pages/RevendaPage";
import { TrabalheConoscoPage } from "./pages/TrabalheConoscoPage";
import { ContactPage } from "./components/pages/ContactPage";
import { StoreLocatorPage } from "./components/pages/StoreLocatorPage";
import { MaringaFCCollabPage } from "./components/pages/MaringaFCCollabPage";
import { MonteSeuKitPage } from "./pages/monte-seu-kit/MonteSeuKitPage";
import { AjudaPage } from "./pages/monte-seu-kit/AjudaPage";
import { MontarPage } from "./pages/monte-seu-kit/MontarPage";
import { DriversManuaisPage } from "./pages/DriversManuaisPage";
import { DriverDetailPage } from "./pages/DriverDetailPage";
import { FaqPage } from "./pages/FaqPage";
import { ComparePage } from "./pages/ComparePage";
import { QuemSomosPage } from "./pages/QuemSomosPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { WarrantyPage } from "./pages/WarrantyPage";
import { TermsPage } from "./pages/TermsPage";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import { HomeV2 } from "./v2/HomeV2";

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
      { path: "legado", Component: HomePage },
      { path: "produtos", Component: ProductsPage },
      { path: "produto/:id", Component: ProductPage },
      { path: "carrinho", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "pre-venda", Component: PreOrderPage },
      { path: "perfil", Component: ProfilePage },
      { path: "influenciadores", Component: ArtistasPage },
      { path: "revendedor", Component: RevendaPage },
      { path: "trabalhe-conosco", Component: TrabalheConoscoPage },
      { path: "fale-conosco", Component: ContactPage },
      { path: "onde-encontrar", Component: StoreLocatorPage },
      { path: "maringa-fc", Component: MaringaFCCollabPage },
      { path: "monte-seu-kit", Component: MonteSeuKitPage },
      { path: "monte-seu-kit/ajuda", Component: AjudaPage },
      { path: "monte-seu-kit/montar", Component: MontarPage },
      { path: "drivers-e-manuais", Component: DriversManuaisPage },
      { path: "drivers-e-manuais/:slug", Component: DriverDetailPage },
      { path: "comparar", Component: ComparePage },
      { path: "faq", Component: FaqPage },
      /* O guia antigo virou o passo do quiz novo. A rota fica de pé porque
         ela foi divulgada e existe link pra ela na home. */
      { path: "guia", loader: () => redirect("/monte-seu-kit/ajuda") },
      { path: "quem-somos", Component: QuemSomosPage },
      { path: "politica-de-privacidade", Component: PrivacyPage },
      { path: "politica-de-garantia", Component: WarrantyPage },
      { path: "termos-de-uso", Component: TermsPage },

      /* ── Semantic URL routes (A1) ──
         Order matters: static paths above are matched first by react-router.
         Dynamic segments below resolve via getCategoryFromSlug() inside the
         page component; unknown slugs render an empty result set.
         Examples:
           /perifericos                    -> ProductsPage (Periféricos)
           /perifericos/mouses             -> ProductsPage (Periféricos / Mouses)
           /perifericos/pcyes/mouse-vert   -> ProductPage  (no subcategory)
           /perifericos/mouses/pcyes/mv01  -> ProductPage  (full slug path)  */
      { path: ":category", Component: ProductsPage },
      { path: ":category/:subcategory", Component: ProductsPage },
      { path: ":category/:brand/:slug", Component: ProductPage },
      { path: ":category/:subcategory/:brand/:slug", Component: ProductPage },
    ],
  },
], { basename });
