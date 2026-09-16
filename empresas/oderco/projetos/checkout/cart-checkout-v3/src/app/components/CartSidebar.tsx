import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { formatCurrency } from './cart-data';

const FREE_SHIPPING_THRESHOLD = 800;

/* ── NF badge colours (data fields, not DS tokens) ── */
const NF_COLOR: Record<'PR' | 'ES', { bg: string; fg: string }> = {
  PR: { bg: 'var(--nf-pr)', fg: 'var(--nf-pr-fg)' },
  ES: { bg: 'var(--nf-es)', fg: 'var(--nf-es-fg)' },
};

/* ── Nomes das filiais ── */
const FILIAL_NAME: Record<'PR' | 'ES', string> = {
  PR: 'Paraná',
  ES: 'Espírito Santo',
};

/* ── Helpers ── */
function getFilialKey(filial: string): 'PR' | 'ES' {
  if (filial.includes('ES')) return 'ES';
  return 'PR';
}

/* ── Icons ── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M14 3h7v7" />
      <path d="M21 3L9 15" />
    </svg>
  );
}

/* ── Per-filial free-shipping progress (sits adjacent to each filial group) ── */
function ShippingProgress({ filial, subtotal }: { filial: 'PR' | 'ES'; subtotal: number }) {
  const color = filial === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
  const achieved = subtotal >= FREE_SHIPPING_THRESHOLD;
  const prog = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const left = FREE_SHIPPING_THRESHOLD - subtotal;

  if (achieved) {
    return (
      <div className="px-5 pt-2.5 pb-2 flex items-center gap-1.5"
        style={{ background: 'var(--success-surface)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--success)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
          Frete grátis nesta filial
        </span>
      </div>
    );
  }

  return (
    <div className="px-5 pt-2.5 pb-2.5" style={{ background: 'var(--background)' }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
          Faltam <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(left)}</span> para frete grátis
        </span>
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(prog)}%
        </span>
      </div>
      <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${prog}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ── NF Badge ── */
function NfBadge({ filial }: { filial: 'PR' | 'ES' }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded shrink-0"
      style={{
        width: 22,
        height: 22,
        background: NF_COLOR[filial].bg,
        color: NF_COLOR[filial].fg,
        fontSize: '9px',
        fontWeight: 'var(--font-weight-bold)',
        fontFamily: 'var(--font-red-hat-display)',
        letterSpacing: '0.2px',
      }}
    >
      {filial}
    </span>
  );
}

/* ── Chevron (sanfona v3) ── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Grupo de filial (seção empilhada — usado em v2 e v3) ── */
interface FilialGroupProps {
  filial: 'PR' | 'ES';
  items: CartItemRowProps['item'][];
  subtotal: number;
  /* true quando há 2 notas: mostra header rico + subtotal do grupo */
  multi: boolean;
  /* v3 sanfona: header vira botão, conteúdo colapsa */
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}

function FilialGroup({ filial, items, subtotal, multi, collapsible, collapsed, onToggleCollapse, onRemove, onQtyChange }: FilialGroupProps) {
  const color = filial === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
  const showBody = !collapsible || !collapsed;

  const headerInner = (
    <>
      <NfBadge filial={filial} />
      <div className="flex flex-col">
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color, fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.2 }}>
          Filial {FILIAL_NAME[filial]}
        </span>
        {multi && (
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
            impostos e frete próprios
          </span>
        )}
      </div>
      {/* colapsado mostra subtotal inline; expandido mostra contagem */}
      <span className="ml-auto flex items-center gap-2" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
        {collapsible && collapsed
          ? <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(subtotal)}</span>
          : <span>{items.length} {items.length === 1 ? 'item' : 'itens'}</span>}
        {collapsible && <span style={{ color }}><ChevronIcon open={!collapsed} /></span>}
      </span>
    </>
  );

  return (
    <div id={`filial-sec-${filial}`}>
      {/* Header da filial — sticky; vira botão quando colapsável */}
      {collapsible ? (
        <button
          onClick={onToggleCollapse}
          className="sticky top-0 z-10 w-full flex items-center gap-2.5 px-5 pt-4 pb-3 cursor-pointer border-none text-left"
          style={{ background: 'var(--card)', borderBottom: '1px solid var(--muted)', borderLeft: `3px solid ${color}` }}
        >
          {headerInner}
        </button>
      ) : (
        <div
          className="sticky top-0 z-10 flex items-center gap-2.5 px-5 pt-4 pb-3"
          style={{ background: 'var(--card)', borderBottom: '1px solid var(--muted)', borderLeft: `3px solid ${color}` }}
        >
          {headerInner}
        </div>
      )}

      {showBody && (
        <>
          <ShippingProgress filial={filial} subtotal={subtotal} />
          {items.map((item, idx) => (
            <CartItemRow
              key={item.id}
              item={item}
              filialKey={filial}
              showBadge={false}
              hasDivider={idx < items.length - 1}
              onRemove={onRemove}
              onQtyChange={onQtyChange}
            />
          ))}
          {/* Subtotal do grupo — fecha a conta da filial (só no multi-NF) */}
          {multi && (
            <div className="flex items-baseline justify-between px-5 py-3.5" style={{ background: 'var(--background)', borderTop: '1px solid var(--muted)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                Subtotal Filial {filial}
              </span>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(subtotal)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Resumo de entrega (v5) — split vira consequência, não navegação ── */
function DeliverySummary({ groups }: { groups: { filial: 'PR' | 'ES'; items: unknown[]; subtotal: number }[] }) {
  return (
    <div className="px-5 pt-4 pb-3" style={{ borderTop: '1px solid var(--muted)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2" />
          <path d="M8 4h8l4 4v6a2 2 0 01-2 2h-2" /><circle cx="8" cy="18" r="1.5" /><circle cx="18" cy="16" r="1.5" />
        </svg>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
          RESUMO DE ENTREGA
        </span>
      </div>

      {groups.map(g => {
        const color = g.filial === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
        const achieved = g.subtotal >= FREE_SHIPPING_THRESHOLD;
        const left = FREE_SHIPPING_THRESHOLD - g.subtotal;
        return (
          <div key={g.filial} className="flex items-center gap-2 py-1.5">
            <NfBadge filial={g.filial} />
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color, fontFamily: 'var(--font-red-hat-display)' }}>
              {FILIAL_NAME[g.filial]}
            </span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
              · {g.items.length} {g.items.length === 1 ? 'item' : 'itens'}
            </span>
            <span className="ml-auto flex items-center gap-1" style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
              {achieved ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span style={{ color: 'var(--success)' }}>frete grátis</span>
                </>
              ) : (
                <span style={{ color: 'var(--muted-foreground)' }}>faltam <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(left)}</span></span>
              )}
            </span>
          </div>
        );
      })}

      <div className="flex items-start gap-1.5 mt-2 pt-2.5" style={{ borderTop: '1px dashed var(--muted)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', lineHeight: 1.4 }}>
          {groups.length} entregas separadas — podem chegar em datas diferentes
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  /* ── Group items by filial ── */
  const itemsPR = useMemo(() => items.filter(i => getFilialKey(i.filial) === 'PR'), [items]);
  const itemsES = useMemo(() => items.filter(i => getFilialKey(i.filial) === 'ES'), [items]);
  const hasMultipleNFs = itemsPR.length > 0 && itemsES.length > 0;

  /* ── Subtotals per NF ── */
  const subtotalPR = useMemo(() => itemsPR.reduce((s, i) => s + i.price * i.quantity, 0), [itemsPR]);
  const subtotalES = useMemo(() => itemsES.reduce((s, i) => s + i.price * i.quantity, 0), [itemsES]);

  /* ── Ordem das seções: filial com mais itens primeiro ── */
  const groups = useMemo(() => {
    const g: { filial: 'PR' | 'ES'; items: typeof itemsPR; subtotal: number }[] = [];
    if (itemsPR.length > 0) g.push({ filial: 'PR', items: itemsPR, subtotal: subtotalPR });
    if (itemsES.length > 0) g.push({ filial: 'ES', items: itemsES, subtotal: subtotalES });
    return g.sort((a, b) => b.items.length - a.items.length);
  }, [itemsPR, itemsES, subtotalPR, subtotalES]);

  /* ═══ TESTE A/B — 5 variações de separação PR/ES ═══ */
  const [variant, setVariant] = useState<'v1' | 'v2' | 'v3' | 'v4' | 'v5'>('v1');
  const VARIANT_NAME: Record<typeof variant, string> = {
    v1: 'Tabs', v2: 'Seções + âncora', v3: 'Sanfona', v4: 'Lista + selo', v5: 'Carrinho plano',
  };

  /* v5 — toggle opcional Lista | Por filial (progressive disclosure, default Lista) */
  const [v5Grouped, setV5Grouped] = useState(false);

  /* v1 — tab da filial ativa */
  const [activeTab, setActiveTab] = useState<'PR' | 'ES'>('PR');
  const effectiveTab: 'PR' | 'ES' = activeTab === 'PR'
    ? (itemsPR.length > 0 ? 'PR' : 'ES')
    : (itemsES.length > 0 ? 'ES' : 'PR');

  /* v3 — filiais colapsáveis (default: abertas, itens à vista; user fecha se quiser) */
  const [collapsed, setCollapsed] = useState<Record<'PR' | 'ES', boolean>>({ PR: false, ES: false });
  const toggleCollapse = useCallback((f: 'PR' | 'ES') => {
    setCollapsed(c => ({ ...c, [f]: !c[f] }));
  }, []);

  /* ── Handlers ── */
  const handleCheckout = useCallback(() => {
    closeCart();
    navigate('/carrinho');
  }, [closeCart, navigate]);

  const handleContinue = useCallback(() => {
    closeCart();
  }, [closeCart]);

  /* ── Âncora: rola até a seção da filial (não filtra, só navega) ── */
  const jumpToFilial = useCallback((filial: 'PR' | 'ES') => {
    document.getElementById(`filial-sec-${filial}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50"
            style={{ background: 'var(--overlay-backdrop)' }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(420px, calc(100vw - 20px))',
              background: 'var(--card)',
              boxShadow: 'var(--overlay-shadow-lg)',
              fontFamily: 'var(--font-red-hat-display)',
            }}
          >

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--muted)' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--foreground)' }}><CartIcon /></span>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
                  CARRINHO
                </span>
                {totalItems > 0 && (
                  <span
                    className="rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontFamily: 'var(--font-red-hat-display)',
                      width: 22,
                      height: 22,
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              {/* ═══ SWITCHER DE TESTE (canto direito) — remover antes de subir ═══ */}
              <div className="flex items-center rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid var(--muted)' }}>
                {(['v1', 'v2', 'v3', 'v4', 'v5'] as const).map(v => {
                  const on = variant === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      title={VARIANT_NAME[v]}
                      className="cursor-pointer border-none transition-colors"
                      style={{
                        padding: '4px 8px',
                        background: on ? 'var(--primary)' : 'transparent',
                        color: on ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                        fontSize: 'var(--text-2xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'var(--font-red-hat-display)',
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* legenda da variação ativa — orienta o teste */}
            <div className="px-5 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--muted)', background: 'var(--background)' }}>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                {variant.toUpperCase()} · {VARIANT_NAME[variant]}
              </span>
            </div>

            {/* ── v1: Tabs de filial (filtra o conteúdo) ── */}
            {variant === 'v1' && hasMultipleNFs && (
              <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--muted)' }}>
                {(['PR', 'ES'] as const).map(f => {
                  const isActive = effectiveTab === f;
                  const count = f === 'PR' ? itemsPR.length : itemsES.length;
                  const color = f === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveTab(f)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-none cursor-pointer transition-all"
                      style={{ borderBottom: `2.5px solid ${isActive ? color : 'transparent'}`, background: isActive ? 'var(--background)' : 'transparent', fontFamily: 'var(--font-red-hat-display)' }}
                    >
                      <NfBadge filial={f} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: isActive ? color : 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                        Filial {f}
                      </span>
                      <span className="rounded-full flex items-center justify-center shrink-0"
                        style={{ minWidth: 18, height: 18, padding: '0 5px', background: isActive ? color : 'var(--muted)', color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)', fontSize: 10, fontWeight: 'var(--font-weight-bold)', fontVariantNumeric: 'tabular-nums' }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── v2: Barra de âncoras — mostra que ambas existem + navega ── */}
            {variant === 'v2' && hasMultipleNFs && (
              <div className="flex items-center gap-2 px-4 py-2.5 shrink-0" style={{ borderBottom: '1px solid var(--muted)', background: 'var(--background)' }}>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                  Ir para:
                </span>
                {groups.map(g => {
                  const color = g.filial === 'PR' ? 'var(--nf-pr)' : 'var(--nf-es)';
                  return (
                    <button
                      key={g.filial}
                      onClick={() => jumpToFilial(g.filial)}
                      className="flex items-center gap-1.5 rounded-full cursor-pointer border-none transition-opacity hover:opacity-70"
                      style={{ padding: '4px 10px 4px 6px', background: 'var(--card)', border: `1px solid ${color}` }}
                    >
                      <NfBadge filial={g.filial} />
                      <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', color, fontFamily: 'var(--font-red-hat-display)' }}>
                        Filial {g.filial}
                      </span>
                      <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                        {g.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── v5: toggle Lista | Por filial (progressive disclosure) ── */}
            {variant === 'v5' && hasMultipleNFs && (
              <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: '1px solid var(--muted)', background: 'var(--background)' }}>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                </span>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--muted)' }}>
                  {([['Lista', false], ['Por filial', true]] as const).map(([label, grouped]) => {
                    const on = v5Grouped === grouped;
                    return (
                      <button
                        key={label}
                        onClick={() => setV5Grouped(grouped)}
                        className="cursor-pointer border-none transition-colors"
                        style={{ padding: '4px 10px', background: on ? 'var(--foreground)' : 'transparent', color: on ? 'var(--card)' : 'var(--muted-foreground)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Items list ── */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-10">
                  <div style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="block" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Seu carrinho está vazio
                    </span>
                    <span className="block mt-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      Adicione produtos para continuar
                    </span>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="h-10 px-6 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-red-hat-display)' }}
                  >
                    Ver produtos
                  </button>
                </div>
              ) : !hasMultipleNFs ? (
                /* Filial única — igual em todas as variações */
                <FilialGroup
                  filial={groups[0].filial}
                  items={groups[0].items}
                  subtotal={groups[0].subtotal}
                  multi={false}
                  onRemove={removeItem}
                  onQtyChange={updateQuantity}
                />
              ) : variant === 'v1' ? (
                /* v1 — só a filial da tab ativa (o resto fica escondido) */
                (() => {
                  const g = groups.find(x => x.filial === effectiveTab) ?? groups[0];
                  return (
                    <div>
                      <ShippingProgress filial={g.filial} subtotal={g.subtotal} />
                      {g.items.map((item, idx) => (
                        <CartItemRow key={item.id} item={item} filialKey={g.filial} showBadge={false}
                          hasDivider={idx < g.items.length - 1} onRemove={removeItem} onQtyChange={updateQuantity} />
                      ))}
                    </div>
                  );
                })()
              ) : variant === 'v4' ? (
                /* v4 — lista única misturada, selo PR/ES por item + resumo fixo */
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-2 px-5 py-3" style={{ background: 'var(--card)', borderBottom: '1px solid var(--muted)' }}>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontWeight: 'var(--font-weight-bold)' }}>
                      2 filiais neste carrinho:
                    </span>
                    {groups.map(g => (
                      <span key={g.filial} className="flex items-center gap-1">
                        <NfBadge filial={g.filial} />
                        <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}>
                          {g.items.length}
                        </span>
                      </span>
                    ))}
                  </div>
                  {groups.flatMap(g => g.items).map((item, idx, arr) => (
                    <CartItemRow key={item.id} item={item} filialKey={getFilialKey(item.filial)} showBadge={true}
                      hasDivider={idx < arr.length - 1} onRemove={removeItem} onQtyChange={updateQuantity} />
                  ))}
                </div>
              ) : variant === 'v5' && !v5Grouped ? (
                /* v5 — carrinho plano: lista única, ordem que adicionou, chip de origem por item */
                <div>
                  {items.map((item, idx) => (
                    <CartItemRow key={item.id} item={item} filialKey={getFilialKey(item.filial)} showBadge={true}
                      hasDivider={idx < items.length - 1} onRemove={removeItem} onQtyChange={updateQuantity} />
                  ))}
                </div>
              ) : (
                /* v2 e v3 — seções empilhadas (v3 colapsável); v5+"Por filial" reusa empilhado ── */
                <div>
                  {groups.map((g, gi) => (
                    <div key={g.filial}>
                      {gi > 0 && <div className="h-2" style={{ background: 'var(--muted)' }} />}
                      <FilialGroup
                        filial={g.filial}
                        items={g.items}
                        subtotal={g.subtotal}
                        multi={hasMultipleNFs}
                        collapsible={variant === 'v3'}
                        collapsed={variant === 'v3' && collapsed[g.filial]}
                        onToggleCollapse={() => toggleCollapse(g.filial)}
                        onRemove={removeItem}
                        onQtyChange={updateQuantity}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Bottom section — total único + CTA ── */}
            {items.length > 0 && (
              <div className="shrink-0" style={{ borderTop: '1px solid var(--muted)' }}>
                {/* v5 — resumo de entrega acima do total (split como consequência) */}
                {variant === 'v5' && hasMultipleNFs && <DeliverySummary groups={groups} />}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-baseline justify-between">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                      {hasMultipleNFs ? 'Total dos pedidos' : 'Total'}
                    </span>
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <span className="block mt-1.5" style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)' }}>
                    {hasMultipleNFs
                      ? `${[itemsPR.length > 0, itemsES.length > 0].filter(Boolean).length} filiais · pago separadamente · frete no checkout`
                      : 'Frete calculado no checkout'}
                  </span>
                </div>

                <div className="px-5 pt-2 pb-6 flex flex-col items-center gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full h-12 rounded-xl border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontFamily: 'var(--font-red-hat-display)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Ir para o carrinho
                  </button>
                  <button
                    onClick={handleContinue}
                    className="bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-red-hat-display)',
                    }}
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   CART ITEM ROW
═══════════════════════════════════════════════════════════ */
interface CartItemRowProps {
  item: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number | null;
    quantity: number;
    image: string;
    filial: string;
    unitType: string;
  };
  filialKey: 'PR' | 'ES';
  showBadge: boolean;
  hasDivider: boolean;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}

function CartItemRow({ item, filialKey, showBadge, hasDivider, onRemove, onQtyChange }: CartItemRowProps) {
  return (
    <>
      <div className="flex items-start gap-4 px-5 py-5">
        {/* Product image — 64x64 com respiro melhor */}
        <div
          className="w-[64px] h-[64px] rounded-xl overflow-hidden flex items-center justify-center shrink-0"
          style={{ background: 'var(--background)', border: '1px solid var(--muted)' }}
        >
          {item.image
            ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
            : <PackageIcon />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name + delete */}
          <div className="flex items-start gap-2 justify-between">
            <span
              className="block"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-red-hat-display)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.name}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="bg-transparent border-none cursor-pointer p-1 shrink-0 hover:opacity-60 transition-opacity -mt-0.5"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label="Remover"
            >
              <TrashIcon />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1.5">
            {showBadge && <NfBadge filial={filialKey} />}
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', letterSpacing: '0.3px' }}>
              {item.unitType}
            </span>
          </div>

          {/* Qty controls + price */}
          <div className="flex items-center justify-between mt-3.5 gap-3">
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--muted)' }}
            >
              <button
                onClick={() => onQtyChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity disabled:opacity-30"
                style={{ color: 'var(--foreground)' }}
              >
                <MinusIcon />
              </button>
              <span
                className="w-9 h-9 flex items-center justify-center"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                  borderLeft: '1px solid var(--muted)',
                  borderRight: '1px solid var(--muted)',
                  fontFamily: 'var(--font-red-hat-display)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onQtyChange(item.id, item.quantity + 1)}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
                style={{ color: 'var(--primary)' }}
              >
                <PlusIcon />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {item.oldPrice && (
                <span
                  className="block"
                  style={{ fontSize: 'var(--text-2xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-red-hat-display)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatCurrency(item.oldPrice * item.quantity)}
                </span>
              )}
              <span
                className="block"
                style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: 'var(--font-red-hat-display)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {hasDivider && (
        <div className="mx-5 h-px" style={{ background: 'var(--muted)' }} />
      )}
    </>
  );
}