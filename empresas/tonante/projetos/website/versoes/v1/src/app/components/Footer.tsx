import { Link, useLocation } from "react-router";
import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, ChevronDown } from "lucide-react";
import { SOCIAL_LINKS, type SocialLabel } from "./socialLinks";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getCatalogHref } from "./productPresentation";
import { useIsMobile } from "./ui/use-mobile";

// Footer "stage" — tratamento escuro (var(--stage)) com glow âmbar e grão,
// portado da referência de marca (_ref). Statement serif + headers âmbar +
// bandeiras reais (translúcidas) sob "Pague com" e cluster de certificados.
const brandLogoWhite = "/brand/tonante-wordmark-white.png";
const brandLogoDark = "/brand/tonante-wordmark-dark.png";
const paymentMethodsImage = "/img/pagamentos.png";

const footerColumns = [
  {
    title: "Loja",
    links: [
      { label: "Violões", href: getCatalogHref({ category: "Violões" }) },
      { label: "Guitarras", href: getCatalogHref({ category: "Guitarras" }) },
      { label: "Contrabaixos", href: getCatalogHref({ category: "Contrabaixos" }) },
      { label: "Acessórios", href: getCatalogHref({ category: "Acessórios" }) },
      { label: "Cordas & Encordoamentos", href: getCatalogHref({ category: "Cordas & Encordoamentos" }) },
      { label: "Suportes", href: getCatalogHref({ category: "Suportes" }) },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "F.A.Q", href: "/faq" },
      { label: "Drivers e Manuais", href: "/drivers-e-manuais" },
      { label: "Fale Conosco", href: "/fale-conosco" },
      { label: "Pedidos", href: "/perfil" },
      { label: "Garantia, Trocas e Devoluções", href: "/politica-de-garantia" },
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
      { label: "Termos de uso", href: "/termos-de-uso" },
    ],
  },
  {
    title: "A Tonante",
    links: [
      { label: "Nossa História", href: "/quem-somos" },
      { label: "Onde Encontrar", href: "/onde-encontrar" },
      { label: "Seja um Influenciador", href: "/influenciadores" },
      { label: "Seja um Revendedor", href: "/revendedor" },
    ],
  },
] as const;

const certifications: { label: string; href?: string; image: string }[] = [
  {
    label: "RA 1000",
    href: "https://www.reclameaqui.com.br/empresa/tonante/",
    image: "https://www.insiderstore.com.br/cdn/shop/files/SELO-RA_1.png?v=1773463245&width=140",
  },
  {
    label: "Loja Protegida",
    image: "https://www.insiderstore.com.br/cdn/shop/files/Image_52_2x_85487a22-7eb0-4ae3-a7d7-75cc3910f11f.png?v=1773456501&width=140",
  },
  {
    label: "GPTW",
    image: "https://www.oderco.com.br/media/wysiwyg/Selo-Ranking-Paran_-2025.png",
  },
  {
    label: "ABNT",
    image: "https://www.oderco.com.br/media/wysiwyg/image_3.png",
  },
] as const;

function SocialIcon({ label }: { label: SocialLabel }) {
  switch (label) {
    case "Instagram":
      return <Instagram size={18} strokeWidth={1.8} />;
    case "Facebook":
      return <Facebook size={18} strokeWidth={1.8} />;
    case "YouTube":
      return <Youtube size={18} strokeWidth={1.8} />;
    default:
      return <Linkedin size={18} strokeWidth={1.8} />;
  }
}

export function Footer() {
  const { pathname } = useLocation();
  /* No celular as colunas de links nascem fechadas (ver .footer-col no
     theme.css); a partir de 768px o <details> fica aberto e o resumo perde a
     seta e o clique. */
  const isMobile = useIsMobile();
  const isCheckout = pathname === "/checkout";

  if (isCheckout) {
    return (
      <footer className="bg-[#f5f5f5] border-t border-foreground/10 text-foreground py-12 mt-auto">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="Tonante">
              <ImageWithFallback src={brandLogoDark} alt="Tonante" className="h-[34px] w-auto object-contain" />
            </Link>
            <p className="max-w-md text-[var(--text-sm)] text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", lineHeight: "1.6" }}>
              Desde 1954, a Tonante conecta pessoas à música. Violões, guitarras, contrabaixos e acessórios feitos para fazer parte da história de cada artista.
            </p>
            <div className="flex flex-col items-center gap-2 pt-4">
              <span className="label" style={{ color: "var(--amber-deep)", fontSize: 10 }}>Pague com</span>
              <ImageWithFallback src={paymentMethodsImage} alt="Formas de pagamento: Visa, Mastercard, Amex, Hipercard, Elo, Pix e Boleto" className="h-7 w-auto max-w-full object-contain" />
            </div>
            <p className="text-foreground/40 mt-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
              &copy; {new Date().getFullYear()} Tonante | Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      data-keep-dark
      className="grain relative overflow-hidden"
      style={{ background: "var(--stage)", color: "#ffffff", marginTop: 8 }}
    >
      {/* glow âmbar superior-direito */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ right: "-6%", top: "-30%", width: 520, height: 520, background: "radial-gradient(circle, rgba(17, 17, 17, 0.08), transparent 70%)" }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1434px] px-5 pt-[72px] pb-10 md:px-12 xl:px-0">
        {/* manifesto — reforço de marca no fim do funil (V3 §7.3, ref Izzo) */}
        <div
          className="mb-14 flex flex-col items-center pb-14 text-center"
          style={{ borderBottom: "1px solid rgba(255,255,255,.12)" }}
        >
          <img
            src="/brand/tonante-symbol-amber.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-auto select-none object-contain"
            style={{ opacity: 0.9 }}
          />
          <p
            className="m-0 mt-6 max-w-[640px]"
            style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(20px, 2.4vw, 28px)", lineHeight: 1.4, color: "#ffffff" }}
          >
            Desde 1954, a Tonante é o primeiro acorde de milhões de brasileiros.
            <br />
            <em style={{ color: "var(--amber)" }}>Feita de Histórias. Feita para tocar.</em>
          </p>
          <Link
            to="/quem-somos"
            className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 transition-colors"
            style={{ color: "#cabfae", fontFamily: "var(--font-family-inter)", fontSize: 14, fontWeight: 600 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#cabfae"; }}
          >
            Nossa história →
          </Link>
        </div>

        {/* topo: marca + 3 colunas */}
        <div className="grid grid-cols-1 gap-y-0 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          {/* marca + statement + social */}
          <div>
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity" aria-label="Tonante">
              <ImageWithFallback src={brandLogoWhite} alt="Tonante" className="h-[40px] w-auto object-contain" />
            </Link>
            <p className="serif mt-6 max-w-[280px]" style={{ fontSize: 22, lineHeight: 1.3, color: "#ffffff" }}>
              Feita de Histórias.<br />Desde 1954.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tonante no ${social.label}`}
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors md:h-[42px] md:w-[42px]"
                  style={{ border: "1px solid rgba(255,255,255,.18)", color: "#ffffff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,120,0,.6)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "#ffffff"; }}
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* colunas de links — no celular cada uma vira uma sanfona: abertas,
              as quatro listas somam quase mil pixels de rodapé que ninguém
              lê de cabo a rabo. No desktop o <details> fica sempre aberto
              (open={} via CSS) e o marcador some. */}
          {footerColumns.map((col) => (
            <details
              key={col.title}
              className="footer-col border-t border-white/10 md:border-0"
              open={!isMobile}
            >
              <summary
                className="label flex cursor-pointer list-none items-center justify-between py-4 md:cursor-default md:py-0"
                style={{ color: "var(--amber)", minHeight: 52 }}
              >
                {col.title}
                <ChevronDown
                  size={16}
                  strokeWidth={2.2}
                  className="fc-seta transition-transform duration-200 md:hidden"
                  style={{ color: "var(--amber)" }}
                />
              </summary>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 pb-5 md:pb-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="inline-flex min-h-[32px] items-center transition-colors"
                      style={{ color: "#cabfae", fontSize: 14.5, fontFamily: "var(--font-family-inter)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#cabfae"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* banda: pague com (esq) · certificados (dir) — padrão espelhado */}
        <div
          className="mt-14 flex flex-col gap-8 pt-7 lg:flex-row lg:items-start lg:justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}
        >
          {/* Pague com — bandeiras reais, suavizadas (translúcidas) no dark */}
          <div>
            <p className="label mb-3" style={{ color: "var(--amber)" }}>Pague com</p>
            <ImageWithFallback
              src={paymentMethodsImage}
              alt="Formas de pagamento: Visa, Mastercard, Amex, Hipercard, Elo, Pix e Boleto"
              className="h-8 w-auto max-w-full object-contain"
              style={{ opacity: 0.86 }}
            />
          </div>

          {/* Certificados — selos em chips claros (logos coloridos legíveis no dark) */}
          <div className="lg:text-right">
            <p className="label mb-3 inline-flex items-center gap-1.5" style={{ color: "var(--amber)" }}>
              <ShieldCheck size={13} strokeWidth={2.2} /> Certificados
            </p>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {certifications.map((cert) => {
                const chip = (
                  <span
                    className="inline-flex h-[60px] items-center justify-center rounded-xl px-4"
                    style={{ background: "rgba(255,255,255,.93)", border: "1px solid rgba(255,255,255,.14)" }}
                  >
                    <ImageWithFallback src={cert.image} alt={cert.label} className="h-10 w-auto max-w-[104px] object-contain" />
                  </span>
                );
                return cert.href ? (
                  <a key={cert.label} href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={cert.label} className="transition-opacity hover:opacity-80">
                    {chip}
                  </a>
                ) : (
                  <span key={cert.label} aria-label={cert.label}>{chip}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* linha legal */}
        <div
          className="mt-8 flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}
        >
          <p style={{ fontFamily: "var(--font-family-inter)", fontSize: 12.5, color: "rgba(233,225,212,.55)", lineHeight: 1.6 }}>
            <strong style={{ color: "rgba(233,225,212,.72)", fontWeight: 700 }}>Tonante · Grupo Oderço</strong>
            {" · "}Oderço Distribuidora de Eletrônicos LTDA · CNPJ 09.301.845/0001-91
            <br className="hidden md:block" />
            {" "}Av. Paranavaí, 1906 - Maringá - PR · &copy; {new Date().getFullYear()} Tonante · Todos os direitos reservados.
          </p>
          <p className="serif shrink-0" style={{ fontSize: 13, color: "rgba(233,225,212,.5)", whiteSpace: "nowrap" }}>
            Feita de Histórias · Desde 1954
          </p>
        </div>
      </div>
    </footer>
  );
}
