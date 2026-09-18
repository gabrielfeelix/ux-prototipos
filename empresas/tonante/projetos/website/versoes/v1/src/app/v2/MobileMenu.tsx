"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  X, ChevronRight, ChevronLeft, User, Heart, Package, LogOut, HelpCircle,
  Store, Compass, Tag, Headphones, Instagram, Facebook, Youtube,
  type LucideIcon,
} from "lucide-react";
import { DiapasaoIcon } from "../components/section";
import { useAuth } from "../components/AuthContext";
import { useFavorites } from "../components/FavoritesContext";
import { SOCIAL_LINKS, type SocialLabel } from "../components/socialLinks";

const ICONE_SOCIAL: Record<SocialLabel, LucideIcon> = { Instagram, Facebook, YouTube: Youtube };

/* Menu do celular — gaveta que entra pela esquerda, do mesmo lado do botão
   que a abre. Dois níveis: a lista de categorias e, dentro de cada uma, os
   tipos e marcas daquela categoria. O drill-down existe porque o mega menu do
   desktop mostra tudo de uma vez numa grade de seis colunas: no celular isso
   vira uma lista de setenta linhas e ninguém acha nada.

   Toda linha tem 56px de altura e texto de 16px: é o alvo confortável de
   toque e a fonte que o iOS não tenta ampliar. */

export type CategoriaMenu = {
  label: string;
  href: string;
  count: number;
  tipos: { label: string; href: string; count: number }[];
  marcas: { label: string; href: string }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  categorias: CategoriaMenu[];
};

export function MobileMenu({ open, onClose, categorias }: Props) {
  const { isLoggedIn, user, setAuthModalOpen, setAuthModalTab, logout } = useAuth();
  const { count: favoritos } = useFavorites();
  /* Acima do banner de cookies (z-80) e do botão de WhatsApp (z-90): os dois
     são fixos no rodapé da tela e cobriam o pé da gaveta. */
  /* null = lista de categorias; string = dentro de uma categoria */
  const [aberta, setAberta] = useState<string | null>(null);

  /* Ao fechar, a gaveta ainda está animando pra fora: voltar ao nível 1 na
     hora faria o conteúdo trocar na frente do usuário. Espera a saída. */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setAberta(null), 320);
    return () => clearTimeout(t);
  }, [open]);

  /* Trava a rolagem do fundo enquanto a gaveta está aberta — sem isso o dedo
     rola a página atrás do menu. */
  useEffect(() => {
    if (!open) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = antes; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cat = categorias.find((c) => c.label === aberta) ?? null;

  return (
    <>
      {/* véu */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-[95] md:hidden"
        style={{
          background: "rgba(17,17,17,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .3s ease",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className="fixed inset-y-0 left-0 z-[96] flex w-[min(88vw,400px)] flex-col md:hidden"
        style={{
          background: "#ffffff",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          /* fechada, a gaveta fica fora da tela mas continua na árvore: sem
             `visibility: hidden` os links dela seguem alcançáveis pelo Tab e
             o leitor de tela lê um menu que ninguém vê. A visibilidade só
             desliga quando a animação de saída termina. */
          visibility: open ? "visible" : "hidden",
          transition: "transform .32s cubic-bezier(0.22,1,0.36,1), visibility 0s linear " + (open ? "0s" : ".32s"),
          boxShadow: open ? "0 0 60px -10px rgba(17,17,17,0.45)" : "none",
        }}
      >
        {/* topo: volta (dentro de categoria) ou marca, e o X */}
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b pl-2 pr-2" style={{ borderColor: "var(--border)" }}>
          {cat ? (
            <button
              onClick={() => setAberta(null)}
              className="flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 active:bg-[var(--surface-2)]"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 600, color: "var(--ink-strong)" }}
            >
              <ChevronLeft size={20} strokeWidth={2.2} />
              {cat.label}
            </button>
          ) : (
            <Link to="/" onClick={onClose} className="flex min-h-11 items-center pl-2" aria-label="Tonante, início">
              <img src="/brand/tonante-wordmark-dark.png" alt="Tonante" className="h-8" style={{ width: "auto" }} />
            </Link>
          )}
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full active:bg-[var(--surface-2)]"
            style={{ color: "var(--ink-strong)" }}
          >
            <X size={22} strokeWidth={1.9} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {cat ? (
            /* ── nível 2: dentro da categoria ───────────────────── */
            <div className="pb-8">
              <Linha to={cat.href} onNavigate={onClose} destaque>
                Ver tudo em {cat.label}
                <span className="num ml-auto" style={{ fontSize: "14px", color: "var(--ink-subtle)" }}>{cat.count}</span>
              </Linha>

              {cat.tipos.length > 0 && (
                <>
                  <Titulo>Por tipo</Titulo>
                  {cat.tipos.map((t) => (
                    <Linha key={t.label} to={t.href} onNavigate={onClose}>
                      {t.label}
                      <span className="num ml-auto" style={{ fontSize: "14px", color: "var(--ink-subtle)" }}>{t.count}</span>
                    </Linha>
                  ))}
                </>
              )}

              {cat.marcas.length > 0 && (
                <>
                  <Titulo>Marcas</Titulo>
                  {cat.marcas.map((b) => (
                    <Linha key={b.label} to={b.href} onNavigate={onClose}>{b.label}</Linha>
                  ))}
                </>
              )}
            </div>
          ) : (
            /* ── nível 1 ────────────────────────────────────────── */
            <div className="pb-10">
              {/* conta: o que sumia por completo no celular */}
              <div className="border-b px-4 py-4" style={{ borderColor: "var(--border)" }}>
                {isLoggedIn ? (
                  <Link
                    to="/perfil"
                    onClick={onClose}
                    className="flex items-center gap-3"
                  >
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full" style={{ background: "var(--ink-strong)", color: "#fff" }}>
                      <User size={20} strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: 700, color: "var(--ink-strong)" }}>
                        Olá, {user?.name.split(" ")[0]}
                      </span>
                      <span className="block truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", color: "var(--ink-muted)" }}>
                        {user?.email}
                      </span>
                    </span>
                    <ChevronRight size={18} strokeWidth={2} className="ml-auto flex-shrink-0" style={{ color: "var(--ink-subtle)" }} />
                  </Link>
                ) : (
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => { setAuthModalTab("login"); setAuthModalOpen(true); onClose(); }}
                      className="h-12 flex-1 cursor-pointer rounded-pill active:scale-[0.98]"
                      style={{ background: "var(--ink-strong)", color: "#fff", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600 }}
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => { setAuthModalTab("register"); setAuthModalOpen(true); onClose(); }}
                      className="h-12 flex-1 cursor-pointer rounded-pill active:scale-[0.98]"
                      style={{ border: "1px solid var(--edge)", color: "var(--ink-strong)", fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: 600 }}
                    >
                      Criar conta
                    </button>
                  </div>
                )}
              </div>

              <Titulo>Categorias</Titulo>
              {categorias.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setAberta(c.label)}
                  className="flex min-h-[56px] w-full cursor-pointer items-center gap-3 px-5 text-left transition-colors active:bg-[var(--surface-2)]"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: 500, color: "var(--ink-strong)" }}
                >
                  {c.label}
                  <span className="num ml-auto" style={{ fontSize: "14px", color: "var(--ink-subtle)" }}>{c.count}</span>
                  <ChevronRight size={18} strokeWidth={2} style={{ color: "var(--ink-subtle)" }} />
                </button>
              ))}

              <Titulo>Descobrir</Titulo>
              <Linha to="/produtos?promo=1" onNavigate={onClose} icon={Tag}>Ofertas</Linha>
              <Linha to="/monte-seu-kit" onNavigate={onClose} icon={Compass}>Nós te ajudamos a escolher</Linha>
              <Linha to="/onde-encontrar" onNavigate={onClose} icon={Store}>Lojas para experimentar</Linha>

              <Titulo>Sua conta</Titulo>
              <Linha to="/perfil?tab=favoritos" onNavigate={onClose} icon={Heart}>
                Favoritos
                {favoritos > 0 && (
                  <span className="num ml-auto grid h-6 min-w-6 place-items-center rounded-full px-1.5" style={{ background: "var(--ink-strong)", color: "#fff", fontSize: "12px", fontWeight: 700 }}>
                    {favoritos}
                  </span>
                )}
              </Linha>
              {isLoggedIn && <Linha to="/perfil?tab=pedidos" onNavigate={onClose} icon={Package}>Meus pedidos</Linha>}

              <Titulo>Ajuda</Titulo>
              <Linha to="/faq" onNavigate={onClose} icon={HelpCircle}>Dúvidas frequentes</Linha>
              <Linha to="/afinador" onNavigate={onClose} icon={DiapasaoIcon}>Afinador</Linha>
              <Linha to="/fale-conosco" onNavigate={onClose} icon={Headphones}>Fale com a gente</Linha>

              {isLoggedIn && (
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="mt-2 flex min-h-[56px] w-full cursor-pointer items-center gap-3 px-5 text-left active:bg-[var(--surface-2)]"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", color: "var(--ink-muted)" }}
                >
                  <LogOut size={19} strokeWidth={1.8} style={{ opacity: 0.7 }} /> Sair
                </button>
              )}

              {/* social: 44px de alvo, não os 16px da faixa preta */}
              <div className="mt-4 flex items-center gap-1 border-t px-3 pt-3" style={{ borderColor: "var(--border)" }}>
                {SOCIAL_LINKS.map(({ label, href }) => {
                  const Icon = ICONE_SOCIAL[label];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Tonante no ${label}`}
                      className="grid h-11 w-11 place-items-center rounded-full active:bg-[var(--surface-2)]"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-5 pb-1 pt-5"
      style={{ fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-subtle)" }}
    >
      {children}
    </p>
  );
}

function Linha({
  to, onNavigate, children, icon: Icon, destaque = false,
}: {
  to: string; onNavigate: () => void; children: React.ReactNode;
  /* aceita ícone nosso (DiapasaoIcon) além dos do lucide — mesma assinatura */
  icon?: LucideIcon | React.ComponentType<{ size?: number; strokeWidth?: number }>;
  destaque?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex min-h-[56px] items-center gap-3 px-5 transition-colors active:bg-[var(--surface-2)]"
      style={{
        fontFamily: "var(--font-family-inter)",
        fontSize: "16px",
        fontWeight: destaque ? 700 : 500,
        color: "var(--ink-strong)",
      }}
    >
      {Icon && <Icon size={19} strokeWidth={1.8} style={{ opacity: 0.65, flexShrink: 0 }} />}
      {children}
    </Link>
  );
}
