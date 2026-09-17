import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { allProducts } from "./productsData";
import { getPrimaryProductImage, upgradeProductImage } from "./productPresentation";

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  isDefault: boolean;
}

export interface UserCard {
  id: string;
  brand: string;
  last4: string;
  name: string;
  expiry: string;
  isDefault: boolean;
}

export interface OrderHistory {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  /* productId liga o item ao catálogo: é o que faz "Comprar de novo" e o
     clique na foto caírem na PDP certa em vez de numa busca por nome. */
  items: { productId?: number; name: string; qty: number; price: string; image: string; variant?: string }[];
  total: string;
  tracking?: string;
  paymentMethod?: string;
  history?: OrderHistory[];
  /* Rota do pedido: de onde saiu, pra onde vai e quando chega. A tela de
     pedidos mostra os três na mesma linha, como uma passagem. */
  origin?: string;
  destination?: string;
  estimatedArrival?: string;
}

export interface PcyesPointsTx {
  id: string;
  date: string;
  type: "earn" | "spend" | "expire" | "bonus";
  amount: number;
  description: string;
  orderId?: string;
  expiresAt?: string;
}

export type AccountType = "pf" | "pj";

export interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  /* Vem da Receita e não é editável pelo usuário: é o endereço fiscal, e a
     entrega da conta PJ só vai pra ele. */
  endereco: {
    logradouro: string;
    complemento?: string;
    bairro: string;
    cep: string;
    municipio: string;
    uf: string;
  };
  inscricaoEstadual?: string;
  atividadePrincipal: { codigo: string; descricao: string };
  /* Segmentação nossa, não da Receita: o CNAE diz o que a empresa declara à
     Receita, isso diz o que ela faz com o instrumento Tonante. */
  ramoAtividade: string;
}

export interface PersonRegistration {
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  /** Único campo opcional do cadastro PF — vem vazio quando não preenchido. */
  phone: string;
  password: string;
}

export interface CompanyRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  company: CompanyData;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  accountType: AccountType;
  company?: CompanyData;
  birthday?: string;
  updatedAt?: string;
  avatar?: string;
  pcyesPoints?: number;
  pcyesPointsHistory?: PcyesPointsTx[];
  addresses: UserAddress[];
  cards: UserCard[];
  orders: Order[];
}

interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  register: (data: PersonRegistration) => Promise<void>;
  registerCompany: (data: CompanyRegistration) => Promise<void>;
  /** true quando já existe conta para esse CNPJ. */
  isCnpjRegistered: (cnpj: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  /* Address helpers — quando isDefault=true entra, todos outros viram false. */
  addAddress: (data: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, data: Partial<Omit<UserAddress, "id">>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  /* Card helpers — mesma semântica do default. */
  addCard: (data: Omit<UserCard, "id">) => void;
  updateCard: (id: string, data: Partial<Omit<UserCard, "id">>) => void;
  removeCard: (id: string) => void;
  setDefaultCard: (id: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "register";
  setAuthModalTab: (tab: "login" | "register") => void;
  /* Qual aba do cadastro abre. O login ignora isso — o tipo da conta já está
     na conta, e perguntar aqui só faria a pessoa errar. */
  authModalKind: AccountType;
  setAuthModalKind: (kind: AccountType) => void;
  authRedirect: string | null;
  setAuthRedirect: (path: string | null) => void;
  promptLogin: (redirectTo?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/* Pedidos do protótipo montados a partir do catálogo real: o item guarda só
   o id e a quantidade, e nome, preço e foto saem de productsData. Antes o mock
   trazia mouse e gabinete da PCYES escritos à mão — além de não ser Tonante,
   preço e foto envelheciam sozinhos quando o catálogo mudava. */
function itemPedido(id: number, qty = 1, variant?: string) {
  const p = allProducts.find((x) => x.id === id);
  return {
    productId: id,
    name: p?.name ?? "Produto Tonante",
    qty,
    price: p?.price ?? "R$ 0,00",
    /* A foto passa pelo mesmo caminho do card da vitrine: `p.image` cru às
       vezes é o placeholder do Magento ou um banner de campanha. */
    image: p ? upgradeProductImage(getPrimaryProductImage(p)) : "",
    variant,
  };
}

function totalPedido(itens: { price: string; qty: number }[]) {
  const soma = itens.reduce((acc, i) => {
    const n = Number(i.price.replace(/[^\d,]/g, "").replace(",", "."));
    return acc + (Number.isFinite(n) ? n * i.qty : 0);
  }, 0);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(soma);
}

function pedido(cfg: {
  id: string;
  date: string;
  status: Order["status"];
  itens: ReturnType<typeof itemPedido>[];
  paymentMethod?: string;
  tracking?: string;
  destination?: string;
  estimatedArrival?: string;
  history?: OrderHistory[];
}): Order {
  return {
    id: cfg.id,
    date: cfg.date,
    status: cfg.status,
    items: cfg.itens,
    total: totalPedido(cfg.itens),
    paymentMethod: cfg.paymentMethod,
    tracking: cfg.tracking,
    /* Tudo sai da fábrica em Maringá — é de lá que a Tonante despacha desde
       1954, e a linha de rota do pedido começa nesse endereço. */
    origin: "Maringá, PR · Fábrica Tonante",
    destination: cfg.destination ?? "Casa · Maringá, PR",
    estimatedArrival: cfg.estimatedArrival,
    history: cfg.history,
  };
}

function montarPedidos(): Order[] {
  return [
    pedido({
      id: "TON-2026-004",
      date: "2026-04-08",
      status: "shipped",
      paymentMethod: "Pix",
      tracking: "TN480291744BR",
      estimatedArrival: "12 de abril",
      itens: [
        itemPedido(48, 1, "Abalone 41\" · Natural"),
        itemPedido(253, 1, "Preto"),
      ],
      history: [
        { status: "shipped", date: "2026-04-10 08:20", description: "O pedido está em trânsito para sua cidade." },
        { status: "shipped", date: "2026-04-09 17:05", description: "O pedido foi coletado pela transportadora." },
        { status: "processing", date: "2026-04-08 11:40", description: "Pagamento confirmado via Pix." },
        { status: "processing", date: "2026-04-08 11:32", description: "Pedido recebido." },
      ],
    }),
    pedido({
      id: "TON-2026-003",
      date: "2026-04-05",
      status: "shipped",
      paymentMethod: "Cartão de Crédito (Visa •••• 4242)",
      tracking: "TN480288119BR",
      estimatedArrival: "11 de abril",
      destination: "Trabalho · Maringá, PR",
      itens: [
        itemPedido(203, 1, "Couro argentino · Preta"),
        itemPedido(254, 2, "Aço bronze · 0.010"),
        itemPedido(251, 1, "Prata"),
      ],
      history: [
        { status: "shipped", date: "2026-04-07 09:15", description: "O pedido foi coletado pela transportadora." },
        { status: "processing", date: "2026-04-05 14:02", description: "Pagamento confirmado." },
        { status: "processing", date: "2026-04-05 13:58", description: "Pedido recebido." },
      ],
    }),
    pedido({
      id: "TON-2026-002",
      date: "2026-03-28",
      status: "delivered",
      paymentMethod: "Cartão de Crédito (Visa •••• 4242)",
      tracking: "TN480271003BR",
      itens: [itemPedido(6, 1, "Tubular · dobrável")],
      history: [
        { status: "delivered", date: "2026-04-02 14:20", description: "O pedido foi entregue com sucesso." },
        { status: "shipped", date: "2026-03-31 10:30", description: "O pedido saiu para entrega." },
        { status: "processing", date: "2026-03-29 09:15", description: "Pagamento confirmado e pedido em separação." },
        { status: "processing", date: "2026-03-28 15:40", description: "Pedido recebido." },
      ],
    }),
    pedido({
      id: "TON-2026-001",
      date: "2026-02-20",
      status: "delivered",
      paymentMethod: "Pix",
      tracking: "TN480219884BR",
      itens: [
        itemPedido(213, 1, "Talabarte · Preta"),
        itemPedido(163, 1, "CS-14 EP · Natural"),
      ],
      history: [
        { status: "delivered", date: "2026-02-25 16:05", description: "O pedido foi entregue com sucesso." },
        { status: "shipped", date: "2026-02-23 08:10", description: "O pedido saiu para entrega." },
        { status: "processing", date: "2026-02-20 19:30", description: "Pagamento confirmado via Pix." },
      ],
    }),
    pedido({
      id: "TON-2026-005",
      date: "2026-04-02",
      status: "cancelled",
      paymentMethod: "Cartão de Crédito (Visa •••• 4242)",
      itens: [itemPedido(162, 1, "CS-14 EP · Preto")],
      history: [
        { status: "cancelled", date: "2026-04-03 10:12", description: "Pedido cancelado a pedido do cliente. Estorno em até 5 dias." },
        { status: "processing", date: "2026-04-02 20:45", description: "Pedido recebido." },
      ],
    }),
  ];
}

const MOCK_USER: UserData = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(44) 99999-8888",
  cpf: "123.456.789-00",
  accountType: "pf",
  birthday: "1996-08-22",
  updatedAt: "2026-03-15T10:30:00",
  pcyesPoints: 480,
  pcyesPointsHistory: [
    { id: "tx-006", date: "2026-04-05 22:35", type: "earn", amount: 60, description: "Compra: Violão Lorenzzo Eletroacústico", orderId: "TON-2026-004", expiresAt: "2027-04-05" },
    { id: "tx-005", date: "2026-04-02 12:15", type: "earn", amount: 50, description: "Compra: Correia + Encordoamentos", orderId: "TON-2026-003", expiresAt: "2027-04-02" },
    { id: "tx-004", date: "2026-03-28 15:45", type: "earn", amount: 19, description: "Compra: Suporte de parede", orderId: "TON-2026-002", expiresAt: "2027-03-28" },
    { id: "tx-003", date: "2026-03-22 10:00", type: "bonus", amount: 100, description: "Bônus: aniversário Tonante", expiresAt: "2026-06-22" },
    { id: "tx-002", date: "2026-03-15 14:20", type: "spend", amount: -80, description: "Resgate aplicado em pedido anterior" },
    { id: "tx-001", date: "2026-02-20 09:00", type: "bonus", amount: 250, description: "Bônus de boas-vindas", expiresAt: "2026-08-20" },
  ],
  addresses: [
    { id: "1", label: "Casa", street: "Av. Paranavaí", number: "1906", complement: "Sala 3", neighborhood: "Parque Industrial", city: "Maringá", state: "PR", cep: "87070-130", isDefault: true },
    { id: "2", label: "Trabalho", street: "Rua Santos Dumont", number: "500", neighborhood: "Centro", city: "Maringá", state: "PR", cep: "87013-000", isDefault: false },
  ],
  cards: [
    { id: "1", brand: "Visa", last4: "4242", name: "JOAO SILVA", expiry: "12/28", isDefault: true },
    { id: "2", brand: "Mastercard", last4: "8888", name: "JOAO SILVA", expiry: "06/27", isDefault: false },
  ],
  orders: montarPedidos(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [authModalKind, setAuthModalKind] = useState<AccountType>("pf");
  const [authRedirect, setAuthRedirect] = useState<string | null>(null);

  const promptLogin = useCallback((redirectTo?: string) => {
    setAuthModalTab("login");
    setAuthRedirect(redirectTo ?? null);
    setAuthModalOpen(true);
  }, []);

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(MOCK_USER);
    setAuthModalOpen(false);
  }, []);

  const socialLogin = useCallback(async (_provider: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(MOCK_USER);
    setAuthModalOpen(false);
  }, []);

  /* Diferente do login, o cadastro não fecha o modal: quem fecha é o AuthModal,
     depois de mostrar a tela de sucesso. Sumir na hora deixa a pessoa sem saber
     se a conta saiu. */
  const register = useCallback(async (data: PersonRegistration) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      ...MOCK_USER,
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      accountType: "pf",
      company: undefined,
    });
  }, []);

  /* Protótipo: na loja real isso vira consulta ao cliente por CNPJ. Estes dois
     números existem pra dar como testar a tela de "já cadastrado". */
  const isCnpjRegistered = useCallback(async (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, "");
    await new Promise((r) => setTimeout(r, 300));
    return ["11222333000181", "19131243000197"].includes(digits);
  }, []);

  const registerCompany = useCallback(async (data: CompanyRegistration) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      ...MOCK_USER,
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      accountType: "pj",
      company: data.company,
    });
  }, []);

  const logout = useCallback(() => { setUser(null); setAuthRedirect(null); }, []);

  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  }, []);

  /* ─── Address helpers ─── */
  const addAddress = useCallback((data: Omit<UserAddress, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const id = `addr-${Date.now()}`;
      const becomingDefault = data.isDefault || prev.addresses.length === 0;
      const next: UserAddress[] = prev.addresses.map((a) => ({ ...a, isDefault: becomingDefault ? false : a.isDefault }));
      next.push({ ...data, id, isDefault: becomingDefault });
      return { ...prev, addresses: next };
    });
  }, []);

  const updateAddress = useCallback((id: string, data: Partial<Omit<UserAddress, "id">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const setNewDefault = data.isDefault === true;
      const next = prev.addresses.map((a) => {
        if (a.id === id) return { ...a, ...data };
        return setNewDefault ? { ...a, isDefault: false } : a;
      });
      return { ...prev, addresses: next };
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const removed = prev.addresses.find((a) => a.id === id);
      let next = prev.addresses.filter((a) => a.id !== id);
      /* Quando remove o default, promove o primeiro que sobrou pra default. */
      if (removed?.isDefault && next.length > 0) {
        next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
      }
      return { ...prev, addresses: next };
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setUser((prev) => prev ? { ...prev, addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })) } : prev);
  }, []);

  /* ─── Card helpers ─── */
  const addCard = useCallback((data: Omit<UserCard, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const id = `card-${Date.now()}`;
      const becomingDefault = data.isDefault || prev.cards.length === 0;
      const next: UserCard[] = prev.cards.map((c) => ({ ...c, isDefault: becomingDefault ? false : c.isDefault }));
      next.push({ ...data, id, isDefault: becomingDefault });
      return { ...prev, cards: next };
    });
  }, []);

  const updateCard = useCallback((id: string, data: Partial<Omit<UserCard, "id">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const setNewDefault = data.isDefault === true;
      const next = prev.cards.map((c) => {
        if (c.id === id) return { ...c, ...data };
        return setNewDefault ? { ...c, isDefault: false } : c;
      });
      return { ...prev, cards: next };
    });
  }, []);

  const removeCard = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const removed = prev.cards.find((c) => c.id === id);
      let next = prev.cards.filter((c) => c.id !== id);
      if (removed?.isDefault && next.length > 0) {
        next = next.map((c, i) => ({ ...c, isDefault: i === 0 }));
      }
      return { ...prev, cards: next };
    });
  }, []);

  const setDefaultCard = useCallback((id: string) => {
    setUser((prev) => prev ? { ...prev, cards: prev.cards.map((c) => ({ ...c, isDefault: c.id === id })) } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user,
      login, socialLogin, register, registerCompany, isCnpjRegistered, logout, updateUser,
      addAddress, updateAddress, removeAddress, setDefaultAddress,
      addCard, updateCard, removeCard, setDefaultCard,
      authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab,
      authModalKind, setAuthModalKind,
      authRedirect, setAuthRedirect, promptLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
