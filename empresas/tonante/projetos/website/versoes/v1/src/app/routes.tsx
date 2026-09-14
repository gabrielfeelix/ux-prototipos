import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ProductPage } from "./components/ProductPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { PreOrderPage } from "./components/PreOrderPage";
import { ProfilePage } from "./components/ProfilePage";
import { InfluencersPage } from "./components/pages/InfluencersPage";
import { ResellerPage } from "./components/pages/ResellerPage";
import { ContactPage } from "./components/pages/ContactPage";
import { StoreLocatorPage } from "./components/pages/StoreLocatorPage";
import { MaringaFCCollabPage } from "./components/pages/MaringaFCCollabPage";
import { MonteSeuPcPage } from "./pages/MonteSeuPcPage";
import { DriversManuaisPage } from "./pages/DriversManuaisPage";
import { DriverDetailPage } from "./pages/DriverDetailPage";
import { FaqPage } from "./pages/FaqPage";
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
      { path: "influenciadores", Component: InfluencersPage },
      { path: "revendedor", Component: ResellerPage },
      { path: "fale-conosco", Component: ContactPage },
      { path: "onde-encontrar", Component: StoreLocatorPage },
      { path: "maringa-fc", Component: MaringaFCCollabPage },
      { path: "monte-seu-pc", Component: MonteSeuPcPage },
      { path: "drivers-e-manuais", Component: DriversManuaisPage },
      { path: "drivers-e-manuais/:slug", Component: DriverDetailPage },
      { path: "faq", Component: FaqPage },
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
