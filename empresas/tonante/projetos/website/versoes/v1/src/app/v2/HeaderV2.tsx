"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  User, ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, ChevronRight as Arrow,
  Instagram, Facebook, Youtube, Store, Headphones, Truck, CreditCard, Guitar,
  Heart, Package, LogOut, HelpCircle, Hand, MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { MusicianStoryModal } from "../components/MusicianStoryModal";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useFavorites } from "../components/FavoritesContext";
import { getCatalogHref, getPrimaryProductImage, getVisibleCatalogProducts } from "../components/productPresentation";
import { allProducts, type Product } from "../components/productsData";
import { getProductUrl } from "../lib/slug";
import { SearchBar } from "../components/SearchBar";
import { SOCIAL_LINKS, type SocialLabel } from "../components/socialLinks";

/* Ícone de cada perfil da faixa preta. A lista em si vive em
   components/socialLinks.ts — aqui só o desenho. */
const ICONE_SOCIAL: Record<SocialLabel, LucideIcon> = {
  Instagram,
  Facebook,
  YouTube: Youtube,
};

/* HeaderV2 — cabeçalho do site (referência: tema Local/Shopify).
   3 faixas: utilitária escura (social + avisos rotativos + ajuda),
   principal (logo · busca · conta · carrinho) e navegação
   (categorias à esquerda · dois serviços à direita).

   Os três painéis (mega menu, conta, carrinho) abrem no hover com atraso de
   fechamento — sem isso o painel some ao atravessar o vão entre o gatilho e
   ele. Todos são renderizados como filhos diretos do <header>: a faixa de
   navegação usa overflow:hidden pra animar o colapso no scroll e recortava
   qualquer dropdown ancorado lá dentro. */

type Aviso = { icon: LucideIcon; strong: string; rest: string };
const AVISOS: Aviso[] = [
  { icon: Truck, strong: "Frete grátis", rest: "acima de R$ 299 · todo o Brasil" },
  { icon: CreditCard, strong: "Até 10x sem juros", rest: "ou 7% OFF no PIX" },
  { icon: Guitar, strong: "Setup de fábrica", rest: "chega afinado e regulado" },
];

const CATEGORIAS = [
  { label: "Violões", category: "Violões" },
  { label: "Guitarras", category: "Guitarras" },
  { label: "Contrabaixos", category: "Contrabaixos" },
  { label: "Baterias", category: "Baterias" },
  { label: "Cordas", category: "Cordas & Encordoamentos" },
  { label: "Acessórios", category: "Acessórios" },
  { label: "Suportes", category: "Suportes" },
];

/* depois das categorias, os atalhos que não são catálogo */
const NAV = [
  { label: "Ofertas", href: "/produtos?promo=1" },
  { label: "Monte seu kit", href: "/produtos" },
];

/* Conteúdo do mega menu derivado do catálogo — subcategorias reais e os
   destaques mais avaliados de cada categoria. */
const catalog = getVisibleCatalogProducts(allProducts);
const norm = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* tags que são família de produto, não tipo — não viram bolha de subcategoria */
const TAGS_FORA = new Set(["cabo", "cabos", "acessorios", "suportes", "capa", "microfone", "baterias"]);

const MEGA = CATEGORIAS.map(({ label, category }) => {
  const scope = catalog.filter((p) => p.category === category);

  // "Por tipo" sai das tags reais do catálogo (Nylon, Aço, Eletroacústico…),
  // fora as que só repetem o nome da categoria.
  const freq = new Map<string, number>();
  for (const p of scope) {
    for (const t of p.tags ?? []) {
      if (norm(t) === norm(label) || norm(t) === norm(category)) continue;
      if (TAGS_FORA.has(norm(t))) continue;
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
  }
  const tipos = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t, n]) => {
      // foto da bolha: o produto mais avaliado que carrega a tag
      const capa = [...scope]
        .filter((p) => (p.tags ?? []).some((x) => norm(x) === norm(t)))
        .sort((a, b) => (b.reviews ?? 0) * (b.rating ?? 0) - (a.reviews ?? 0) * (a.rating ?? 0))[0];
      return { label: t, count: n, href: getCatalogHref({ category, search: t }), img: capa ? getPrimaryProductImage(capa) : "" };
    });

  // marcas só aparecem onde há mais de uma (instrumento é tudo Tonante)
  const marcas = [...new Set(scope.map((p) => p.brand).filter(Boolean) as string[])];

  const destaques = [...scope].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 2);

  return {
    label,
    category,
    href: getCatalogHref({ category }),
    count: scope.length,
    tipos,
    marcas: marcas.length > 1 ? marcas.slice(0, 6).map((b) => ({ label: b, href: getCatalogHref({ category, search: b }) })) : [],
    destaques: destaques as Product[],
  };
});

/** Abre no hover, fecha com atraso — evita piscar ao cruzar o vão até o painel. */
function useHoverPanel(delay = 140) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  return {
    open,
    setOpen: (v: boolean) => { cancel(); setOpen(v); },
    enter: () => { cancel(); setOpen(true); },
    leave: () => { cancel(); timer.current = setTimeout(() => setOpen(false), delay); },
  };
}

export function HeaderV2() {
  const { totalItems, setIsOpen } = useCart();
  const { isLoggedIn, user, setAuthModalOpen, logout } = useAuth();
  const { count: favoritos } = useFavorites();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [aviso, setAviso] = useState(0);
  /* história do músico: o vídeo + depoimento que já existiam no site e não
     tinham gatilho nenhum. Abre pelo ícone de recado da faixa preta. */
  const [historia, setHistoria] = useState<number | null>(null);
  const cats = useHoverPanel();
  const conta = useHoverPanel();
  const [catAtiva, setCatAtiva] = useState(MEGA[0].label);

  /* Headroom: descendo, a faixa de navegação colapsa e ficam só avisos +
     busca/conta/carrinho; subindo, ela volta na hora, sem precisar chegar ao
     topo. Quem rola pra cima está procurando alguma coisa — quase sempre o
     menu —, e obrigar a subir a página inteira pra recuperá-lo é pedágio. */
  const [scrolled, setScrolled] = useState(false);
  const ultimoY = useRef(0);
  /* A faixa volta deslizando por baixo do cursor parado e o browser dispara
     mouseover sozinho: o mega-menu abria na cara de quem só estava rolando
     pra cima. O hover só reabre depois que o mouse se mexer de verdade. */
  const hoverArmado = useRef(true);
  const colapsado = useRef(false);
  // altura do header expandido, reservada no fluxo por um spacer fixo: o
  // header é `fixed`, então colapsar/expandir não muda a altura da página
  // (era isso que fazia o scroll "pular" ao voltar pro topo)
  const [fullH, setFullH] = useState(194);
  const headerRef = useRef<HTMLElement>(null);

  const AvisoIcon = AVISOS[aviso].icon;
  const mega = MEGA.find((m) => m.label === catAtiva) ?? MEGA[0];


  useEffect(() => {
    const t = setInterval(() => setAviso((i) => (i + 1) % AVISOS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (window.scrollY > 0) return; // só mede no topo, com o header inteiro
      const h = headerRef.current?.getBoundingClientRect().height;
      if (h) setFullH(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    ultimoY.current = window.scrollY;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - ultimoY.current;
      // limiar: trackpad e scroll suave mandam deltas de 1-2px e o header
      // ficaria piscando entre os dois estados a cada micro-oscilação
      if (Math.abs(delta) < 8) return;
      ultimoY.current = y;
      // perto do topo o header é sempre inteiro, em qualquer direção
      const colapsa = y > 80 && delta > 0;
      if (colapsado.current && !colapsa) hoverArmado.current = false;
      colapsado.current = colapsa;
      setScrolled(colapsa);
    };
    const rearma = () => { hoverArmado.current = true; };
    colapsado.current = window.scrollY > 80;
    setScrolled(colapsado.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", rearma, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", rearma);
    };
  }, []);

  // Esc fecha qualquer painel aberto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      cats.setOpen(false); conta.setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cats, conta]);

  // navegou: fecha tudo
  useEffect(() => {
    cats.setOpen(false); conta.setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  return (
    <>
    {/* reserva a altura do header expandido — o header em si é fixed */}
    <div data-v2-header-spacer style={{ height: fullH }} aria-hidden="true" />
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40"
      style={{ background: "#ffffff", boxShadow: scrolled ? "0 6px 20px -18px rgba(17,17,17,0.45)" : "none", transition: "box-shadow .25s ease" }}
    >
      {/* faixa utilitária — preta; o aviso é o herói */}
      <div data-keep-dark style={{ background: "var(--ink-strong)" }}>
        <div className="mx-auto flex h-11 w-full items-center gap-4 px-5 md:px-12" style={{ maxWidth: "1680px" }}>
          <div className="flex items-center gap-3.5">
            {/* Recado da Tonante no lugar do Instagram: a faixa levava a três
                perfis externos e nenhum deles trazia o cliente de volta. O
                rodapé continua listando os três. */}
            <button
              type="button"
              onClick={() => setHistoria(0)}
              aria-label="Ver o recado de quem toca Tonante"
              className="cursor-pointer text-white/60 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              <MessageCircle size={16} strokeWidth={1.8} />
            </button>
            {SOCIAL_LINKS.filter(({ label }) => label !== "Instagram").map(({ label, href }) => {
              const Icon = ICONE_SOCIAL[label];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tonante no ${label}`}
                  className="text-white/60 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              );
            })}
          </div>

          <div className="flex flex-1 items-center justify-center gap-3">
            <button
              onClick={() => setAviso((i) => (i - 1 + AVISOS.length) % AVISOS.length)}
              aria-label="Aviso anterior"
              className="hidden cursor-pointer text-white/45 transition-colors duration-200 hover:text-white active:scale-90 sm:block"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex min-w-0 items-center gap-2">
              <AvisoIcon size={15} strokeWidth={1.9} style={{ color: "var(--amber-bright)", flexShrink: 0 }} />
              <span className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "rgba(255,255,255,0.78)" }}>
                <strong style={{ fontWeight: 700, color: "#ffffff" }}>{AVISOS[aviso].strong}</strong>{" "}
                {AVISOS[aviso].rest}
              </span>
            </span>
            <button
              onClick={() => setAviso((i) => (i + 1) % AVISOS.length)}
              aria-label="Próximo aviso"
              className="hidden cursor-pointer text-white/45 transition-colors duration-200 hover:text-white active:scale-90 sm:block"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            to="/fale-conosco"
            className="hidden text-white/75 transition-colors duration-200 hover:text-white sm:block"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
          >
            Central de ajuda
          </Link>
        </div>
      </div>

      {/* faixa principal */}
      <div className="mx-auto flex w-full items-center gap-5 px-5 py-4 md:gap-16 md:px-12" style={{ maxWidth: "1680px" }}>
        <Link to="/" aria-label="Tonante, início" className="flex-shrink-0 transition-opacity duration-200 hover:opacity-70">
          <img src="/brand/tonante-wordmark-dark.png" alt="Tonante" className="h-9 md:h-11" style={{ width: "auto" }} />
        </Link>

        {/* mesma barra + painel "mais buscados" do header da v1 */}
        <div className="hidden min-w-0 flex-1 md:block">
          <SearchBar panelAnchor="viewport" size="lg" />
        </div>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {/* ── utilitários: ajuda · acessibilidade · favoritos ──── */}
          <div className="hidden items-center gap-0.5 md:flex">
            <IconeHeader to="/faq" label="Ajuda" icon={HelpCircle} />
            {/* Mão aberta, não o boneco em cadeira de rodas: é o símbolo que
                os plugins de acessibilidade em português usam e cobre mais
                gente do que o ícone de mobilidade.
                placeholder: o painel de acessibilidade ainda não existe */}
            <IconeHeader label="Acessibilidade" icon={Hand} onClick={() => {}} />
            <IconeHeader to="/perfil?tab=favoritos" label="Favoritos" icon={Heart} badge={favoritos} />
          </div>

          {/* ── conta ───────────────────────────────────────────── */}
          <div className="relative hidden sm:block" onMouseEnter={conta.enter} onMouseLeave={conta.leave}>
            <button
              onClick={() => (isLoggedIn ? navigate("/perfil") : setAuthModalOpen(true))}
              aria-expanded={conta.open}
              aria-haspopup="menu"
              className="inline-flex cursor-pointer items-center gap-2.5 px-7 transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-[var(--surface-2)] hover:shadow-[var(--shadow-card)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-strong)]/25"
              style={{
                height: 52, background: conta.open ? "var(--surface-2)" : "#ffffff",
                border: `1px solid ${conta.open ? "rgba(17,17,17,0.28)" : "var(--edge)"}`,
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, color: "var(--ink-strong)",
              }}
            >
              <User size={18} strokeWidth={2} />
              {isLoggedIn ? user?.name.split(" ")[0] : "Entrar"}
              <ChevronDown size={15} strokeWidth={2.2} className="transition-transform duration-200" style={{ transform: conta.open ? "rotate(180deg)" : "none", opacity: 0.55 }} />
            </button>

            <Painel open={conta.open} className="right-0 w-[276px] p-2">
              {isLoggedIn ? (
                <>
                  <div className="px-3 pb-3 pt-2">
                    <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: 700, color: "var(--ink-strong)" }}>
                      Olá, {user?.name.split(" ")[0]}
                    </p>
                    <p className="truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-muted)" }}>
                      {user?.email}
                    </p>
                  </div>
                  <ItemMenu to="/perfil" icon={User}>Minha conta</ItemMenu>
                  <ItemMenu to="/perfil?tab=pedidos" icon={Package}>Meus pedidos</ItemMenu>
                  <ItemMenu to="/perfil?tab=favoritos" icon={Heart}>Favoritos</ItemMenu>
                  <div className="my-1 h-px" style={{ background: "var(--edge-subtle)" }} />
                  <button
                    onClick={() => { logout(); conta.setOpen(false); }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-[var(--surface-2)]"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", color: "var(--ink-muted)" }}
                  >
                    <LogOut size={16} strokeWidth={1.9} /> Sair
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 pb-3 pt-2">
                    <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: 700, color: "var(--ink-strong)" }}>
                      Bem-vindo à Tonante
                    </p>
                    <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-muted)", lineHeight: 1.45 }}>
                      Acompanhe pedidos, salve favoritos e receba ofertas antes.
                    </p>
                  </div>
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={() => { setAuthModalOpen(true); conta.setOpen(false); }}
                      className="flex-1 cursor-pointer rounded-pill py-2.5 transition-transform duration-150 hover:opacity-90 active:scale-[0.97]"
                      style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600 }}
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => { setAuthModalOpen(true); conta.setOpen(false); }}
                      className="flex-1 cursor-pointer rounded-pill py-2.5 transition-colors duration-150 hover:bg-[var(--surface-2)] active:scale-[0.97]"
                      style={{ border: "1px solid var(--edge)", color: "var(--ink-strong)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: 600 }}
                    >
                      Criar conta
                    </button>
                  </div>
                </>
              )}
            </Painel>
          </div>

          {/* ── carrinho ────────────────────────────────────────── */}
          {/* Sem preço e sem prévia no hover: a intenção é levar pra sidebar,
             que é onde o carrinho tem frete, brinde e cupom. */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems} item(ns)` : ""}`}
            className="group/cart relative grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-full transition-[background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-12px_rgba(17,17,17,0.65)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-strong)]/30 focus-visible:ring-offset-2"
            style={{ background: "var(--ink-strong)", color: "#ffffff" }}
          >
            <ShoppingCart
              size={19}
              strokeWidth={2}
              className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cart:scale-110"
            />
            {/* contagem em bolinha vermelha; sem itens, nada aparece */}
            {totalItems > 0 && (
              <span
                className="num absolute -right-0.5 -top-0.5 grid h-[22px] min-w-[22px] place-items-center rounded-full px-1"
                style={{
                  background: "#e0382b",
                  color: "#fff",
                  fontSize: "11.5px",
                  fontWeight: 800,
                  border: "2px solid #ffffff",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* faixa de navegação — some ao rolar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: scrolled ? "1px solid transparent" : "1px solid var(--border)",
          maxHeight: scrolled ? 0 : 72,
          opacity: scrolled ? 0 : 1,
          overflow: "hidden",
          transition: "max-height .28s ease, opacity .2s ease, border-color .28s ease",
        }}
        aria-hidden={scrolled}
      >
        <div className="mx-auto flex w-full items-center gap-6 overflow-x-auto px-5 py-3 md:px-12" style={{ maxWidth: "1680px" }}>
          {/* categorias direto na faixa: navegar sem passar por dropdown.
             O mega abre no hover e já mostra a categoria apontada. */}
          {MEGA.map((m) => {
            const ativa = cats.open && m.label === catAtiva;
            return (
              <Link
                key={m.label}
                to={m.href}
                onMouseEnter={() => { if (!hoverArmado.current) return; setCatAtiva(m.label); cats.enter(); }}
                onFocus={() => { setCatAtiva(m.label); cats.enter(); }}
                onMouseLeave={cats.leave}
                aria-expanded={ativa}
                className="group/cat relative inline-flex flex-shrink-0 items-center gap-1 py-1 focus-visible:outline-none"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600, color: "var(--ink-strong)" }}
              >
                {m.label}
                <ChevronDown size={14} strokeWidth={2.2} style={{ transform: ativa ? "rotate(180deg)" : "none", transition: "transform .2s", opacity: 0.55 }} />
                <span
                  className="absolute -bottom-0.5 left-0 h-[2px] transition-all duration-250 ease-out group-hover/cat:w-full"
                  style={{ width: ativa ? "100%" : 0, background: "var(--ink-strong)" }}
                />
              </Link>
            );
          })}

          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.href}
              className="group/nav relative flex-shrink-0 py-1 transition-opacity duration-200 focus-visible:outline-none"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 500, color: "var(--ink-strong)" }}
            >
              {n.label}
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 transition-all duration-250 ease-out group-hover/nav:w-full group-focus-visible/nav:w-full" style={{ background: "var(--ink-strong)" }} />
            </Link>
          ))}

          {/* serviços — equivalente ao "picking up / delivery" do Local */}
          <div className="ml-auto hidden items-center gap-8 2xl:flex">
            <ServicoLink to="/onde-encontrar" icon={Store} eyebrow="Quer tocar antes?" label="Lojas para experimentar" />
            <ServicoLink to="/fale-conosco" icon={Headphones} eyebrow="Na dúvida do modelo?" label="Fale com um músico" />
          </div>
        </div>
      </div>

      {/* ── mega menu de categorias ─────────────────────────────
          Fora da faixa colapsável: lá dentro o overflow:hidden recortava. */}
      <div
        onMouseEnter={() => { if (hoverArmado.current) cats.enter(); }}
        onMouseLeave={cats.leave}
        className="absolute inset-x-0 top-full origin-top"
        style={{
          pointerEvents: cats.open ? "auto" : "none",
          opacity: cats.open ? 1 : 0,
          transform: cats.open ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity .18s ease, transform .22s var(--ease)",
        }}
        aria-hidden={!cats.open}
      >
        <div style={{ background: "#ffffff", borderTop: "1px solid var(--border)", boxShadow: "0 24px 48px -32px rgba(17,17,17,0.45)" }}>
          <div className="mx-auto grid w-full gap-8 px-5 py-7 md:grid-cols-[1fr_300px] md:px-12" style={{ maxWidth: "1680px" }}>
            {/* subcategorias da categoria ativa */}
            <div>
              <div className="mb-3 flex items-baseline gap-3">
                <h3 style={{ fontFamily: "var(--font-family-figtree)", fontSize: "19px", fontWeight: 700, color: "var(--ink-strong)" }}>
                  {mega.label}
                </h3>
                <span className="num" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-muted)" }}>
                  {mega.count} produtos
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-5 gap-y-4 sm:grid-cols-6">
                {mega.tipos.map((t) => (
                  <Link key={t.label} to={t.href} className="group/sub flex flex-col items-center gap-2">
                    {/* mesma caixa de foto do painel de busca e do card de
                        produto: quadrada, raio de card, fundo "well" com
                        borda. O círculo era o único lugar da loja que cortava
                        instrumento em redondo — headstock e cutaway sumiam. */}
                    <div
                      className="relative flex aspect-square w-full items-center justify-center overflow-hidden transition-all"
                      style={{
                        background: "var(--well)",
                        borderRadius: "var(--radius-card-md)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {t.img ? (
                        <img
                          src={t.img}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-contain p-[14%] transition-transform duration-300 group-hover/sub:scale-105"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      ) : null}
                    </div>
                    <span
                      className="text-center line-clamp-2"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "13.5px", fontWeight: 500, color: "var(--ink-strong)", lineHeight: 1.25 }}
                    >
                      {t.label}
                    </span>
                  </Link>
                ))}
              </div>

              {mega.marcas.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-subtle)" }}>
                    Marcas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mega.marcas.map((b) => (
                      <Link
                        key={b.label}
                        to={b.href}
                        className="rounded-pill px-3 py-1.5 transition-colors duration-150 hover:bg-[var(--surface-3)]"
                        style={{ background: "var(--surface-2)", fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-strong)" }}
                      >
                        {b.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <Link
                to={mega.href}
                className="mt-4 inline-flex items-center gap-1.5 border-b pb-0.5 transition-colors duration-200 hover:opacity-70"
                style={{ borderColor: "var(--ink-strong)", fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600, color: "var(--ink-strong)" }}
              >
                Ver tudo em {mega.label} <Arrow size={14} strokeWidth={2.4} />
              </Link>
            </div>

            {/* destaques da categoria ativa */}
            <div className="hidden md:block">
              <p className="mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-subtle)" }}>
                Mais procurados
              </p>
              <div className="flex flex-col gap-2">
                {mega.destaques.map((p) => (
                  <Link
                    key={p.id}
                    to={getProductUrl(p)}
                    className="group/dest flex items-center gap-3 rounded-[12px] p-2 transition-colors duration-150 hover:bg-[var(--surface-2)]"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px]" style={{ background: "var(--surface-2)" }}>
                      <img
                        src={getPrimaryProductImage(p)}
                        alt=""
                        className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover/dest:scale-105"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-strong)", lineHeight: 1.35 }}>
                        {p.name}
                      </p>
                      <p className="num mt-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: 700, color: "var(--ink-strong)" }}>
                        {p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    {historia !== null && (
      <MusicianStoryModal index={historia} onClose={() => setHistoria(null)} onNav={setHistoria} />
    )}
    </>
  );
}

/* Ícone utilitário do header: mesma área de clique (44px), mesmo hover. */
function IconeHeader({
  icon: Icon,
  label,
  to,
  onClick,
  badge = 0,
}: {
  icon: LucideIcon;
  label: string;
  to?: string;
  onClick?: () => void;
  badge?: number;
}) {
  const conteudo = (
    <>
      <Icon size={20} strokeWidth={1.8} />
      {badge > 0 && (
        <span
          className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1"
          style={{ background: "var(--ink-strong)", color: "#fff", fontSize: "10px", fontWeight: 800 }}
        >
          {badge}
        </span>
      )}
    </>
  );
  const classe =
    "relative grid h-11 w-11 cursor-pointer place-items-center rounded-full transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--surface-2)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-strong)]/25";
  const estilo = { color: "var(--ink-strong)" };

  return to ? (
    <Link to={to} aria-label={label} title={label} className={classe} style={estilo}>{conteudo}</Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={classe} style={estilo}>{conteudo}</button>
  );
}

/* Painel branco padrão dos dropdowns do header (conta e carrinho): mesma
   entrada, mesma sombra, mesma borda. */
function Painel({ open, className = "", children }: { open: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute top-[calc(100%+10px)] z-50 overflow-hidden ${className}`}
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card-md)",
        boxShadow: "0 22px 44px -28px rgba(17,17,17,0.45)",
        pointerEvents: open ? "auto" : "none",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity .16s ease, transform .2s var(--ease)",
      }}
      aria-hidden={!open}
    >
      {children}
    </div>
  );
}

function ItemMenu({ to, icon: Icon, children }: { to: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--surface-2)]"
      style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", color: "var(--ink-strong)" }}
    >
      <Icon size={16} strokeWidth={1.9} style={{ opacity: 0.7 }} />
      {children}
    </Link>
  );
}

function ServicoLink({ to, icon: Icon, eyebrow, label }: { to: string; icon: LucideIcon; eyebrow: string; label: string }) {
  return (
    <Link to={to} className="group/srv flex items-center gap-2.5">
      <Icon size={26} strokeWidth={1.5} className="transition-transform duration-200 group-hover/srv:scale-110" style={{ color: "var(--ink-strong)", flexShrink: 0 }} />
      <span>
        <span className="block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "var(--ink-muted)" }}>
          {eyebrow}
        </span>
        <span className="relative flex items-center gap-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600, color: "var(--ink-strong)" }}>
          {label}
          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 transition-all duration-250 ease-out group-hover/srv:w-full" style={{ background: "var(--ink-strong)" }} />
        </span>
      </span>
    </Link>
  );
}
