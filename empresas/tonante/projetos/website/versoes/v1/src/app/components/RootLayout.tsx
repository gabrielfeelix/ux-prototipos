import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { CartProvider } from "./CartContext";
import { CheckoutPrefsProvider } from "./CheckoutPrefsContext";
import { AuthProvider } from "./AuthContext";
import { FavoritesProvider } from "./FavoritesContext";
import { CartDrawer } from "./CartDrawer";
import { AuthModal } from "./AuthModal";
import { CookieConsent } from "./CookieConsent";
import { WelcomePopup } from "./WelcomePopup";
import { Navbar } from "./Navbar";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderV2 } from "../v2/HeaderV2";
import { WhatsAppFab } from "./WhatsAppFab";
import { ThemeProvider } from "./ThemeProvider";
import { BootLoader } from "./LoadingScreen";

export function RootLayout() {
  const { pathname } = useLocation();
  // HeaderV2 é o cabeçalho do site inteiro (já inclui a faixa de avisos).
  // Só /legado — a home antiga — segue com Navbar + AnnouncementBar.
  const isLegacyChrome = pathname === "/legado" || pathname.startsWith("/legado/");
  const hideHeader = pathname === "/checkout" || pathname === "/monte-seu-pc";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      {/* tela de carregamento do boot — onda sonora da marca */}
      <BootLoader />
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <CheckoutPrefsProvider>
              <div className="min-h-dvh bg-background text-foreground overflow-x-clip transition-colors duration-300">
                {/* WCAG 2.4.1 Bypass Blocks — first focusable element jumps to main content. */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink-strong focus:shadow-lg focus:outline-none"
                >
                  Pular para o conteúdo principal
                </a>
                {isLegacyChrome && <AnnouncementBar />}
                {!hideHeader && (isLegacyChrome ? <Navbar /> : <HeaderV2 />)}
                <div data-page-light-scope className="contents">
                  {pathname !== "/checkout" && <CartDrawer />}
                  <AuthModal />
                  <WelcomePopup />
                  <CookieConsent />
                  {/* atendimento humano — fora do checkout, pra não disputar com o pagamento */}
                  {pathname !== "/checkout" && <WhatsAppFab />}
                  <main id="main-content" tabIndex={-1} className="outline-none">
                    <Outlet />
                  </main>
                </div>
              </div>
            </CheckoutPrefsProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
