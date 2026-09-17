import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, IdCard, Phone, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useFocusTrap } from "../lib/useFocusTrap";
import { useAuth, type AccountType, type CompanyRegistration, type PersonRegistration } from "./AuthContext";
import { toTitleCase } from "../lib/cnpj";
import { formatCpf, isValidCpf } from "../lib/cpf";
import { PASSWORD_HINT, passwordIssue } from "../lib/password";
import { formatPhone, isValidPhone } from "../lib/phone";
import { SocialButtons } from "./auth/SocialButtons";
import { RegisterCompanyForm } from "./auth/RegisterCompanyForm";
import { ForgotPasswordForm } from "./auth/ForgotPasswordForm";
import {
  captionStyle, errorStyle, fieldFocusClass, iconClass, iconStyle, inputClass,
  inputNoIconClass, inputStyle, primaryButtonClass, primaryButtonStyle, titleStyle,
} from "./auth/styles";

const ACCOUNT_TABS: { kind: AccountType; label: string }[] = [
  { kind: "pf", label: "Pessoa Física" },
  { kind: "pj", label: "Pessoa Jurídica" },
];

export function AuthModal() {
  const {
    authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab,
    authModalKind, setAuthModalKind,
    login, socialLogin, register, registerCompany, authRedirect, setAuthRedirect,
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ kind: AccountType; name: string } | null>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  /* O tipo de conta só existe no cadastro. Login é por e-mail e senha — a conta
     já sabe se é PF ou PJ, e perguntar aqui só faria o usuário errar. */
  const isCompanyRegister = authModalTab === "register" && authModalKind === "pj";

  const afterAuth = useCallback(() => {
    if (authRedirect) { const dest = authRedirect; setAuthRedirect(null); navigate(dest); }
  }, [authRedirect, setAuthRedirect, navigate]);

  /* Fecha o modal e leva pro destino que interrompeu o cadastro. Sai daqui e
     não do AuthContext porque a tela de sucesso precisa ficar no ar antes. */
  const finishRegister = useCallback(() => {
    setSuccess(null);
    setAuthModalOpen(false);
    afterAuth();
  }, [setAuthModalOpen, afterAuth]);

  /* Sair da tela de sucesso nunca é desistir: a conta já existe e o destino
     ainda vale, então ✕, Esc e clique no overlay levam pro mesmo lugar que a
     espera levaria. */
  const closeModal = useCallback(() => {
    if (success) { finishRegister(); return; }
    setAuthModalOpen(false);
    setAuthRedirect(null);
  }, [success, finishRegister, setAuthModalOpen, setAuthRedirect]);
  const dialogRef = useFocusTrap<HTMLDivElement>(authModalOpen, closeModal);

  useEffect(() => {
    if (!authModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [authModalOpen]);

  /* Uma batida de 1,9s: dá pra ler duas linhas curtas e não vira pedágio. */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(finishRegister, 1900);
    return () => clearTimeout(t);
  }, [success, finishRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authModalTab === "register") {
      if (!isValidCpf(cpf)) { setError("CPF inválido. Confira os números."); return; }
      /* Celular é opcional, mas meio celular não é: só cobra quem começou. */
      if (phone && !isValidPhone(phone)) { setError("Celular incompleto. Use DDD e 9 dígitos."); return; }
      const weak = passwordIssue(password);
      if (weak) { setError(weak); return; }
    }

    setLoading(true);
    try {
      if (authModalTab === "login") {
        await login(email, password);
        afterAuth();
      } else {
        await register({ firstName, lastName, cpf: formatCpf(cpf), email, phone, password } satisfies PersonRegistration);
        setSuccess({ kind: "pf", name: firstName.trim() });
      }
    } finally { setLoading(false); }
  };

  const handleCompanySubmit = async (data: CompanyRegistration) => {
    setLoading(true);
    try {
      await registerCompany(data);
      setSuccess({ kind: "pj", name: toTitleCase(data.company.razaoSocial) });
    } finally { setLoading(false); }
  };

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider);
    try {
      await socialLogin(provider);
      afterAuth();
    }
    finally { setSocialLoading(null); }
  };

  const reset = () => { setEmail(""); setPassword(""); setFirstName(""); setLastName(""); setCpf(""); setPhone(""); setError(null); setSuccess(null); setShowPassword(false); setForgotPassword(false); };
  const dismiss = () => { if (success) { finishRegister(); return; } setAuthModalOpen(false); setAuthRedirect(null); reset(); };

  /* Genérico nas duas abas do cadastro: a tab ativa já diz qual é, e trocar o
     título junto fazia o header pular a cada clique. */
  const title = success ? null : forgotPassword ? "Recuperar senha" : authModalTab === "login" ? "Bem-vindo de volta" : "Crie sua conta";

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Véu de tinta, não preto puro: a página da Tonante é branca, e um
              70% preto por cima dela lê como apagão. */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] backdrop-blur-[6px]"
            style={{ background: "rgba(17,17,17,0.45)" }}
            onClick={dismiss} />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4"
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Entrar ou criar conta"
              className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto"
              style={{
                borderRadius: "var(--radius-card-xl)",
                background: "#ffffff",
                border: "1px solid var(--edge-subtle)",
                boxShadow: "var(--shadow-float)",
              }}
            >
              {/* Header */}
              <div className="relative px-8 pb-6 pt-8 text-center">
                <button onClick={dismiss}
                  aria-label="Fechar"
                  className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-2)]"
                  style={{ color: "var(--ink-subtle)" }}
                ><X size={16} aria-hidden="true" /></button>

                <div className="mb-5">
                  <img src="/brand/tonante-wordmark-dark.png" alt="Tonante" className="mx-auto h-[26px] w-auto object-contain" />
                </div>
                {/* Título em Fraunces: é a voz da marca na home, e aqui ele
                    substitui o subtítulo cinza que não dizia nada. */}
                {title && <p style={titleStyle}>{title}</p>}
              </div>

              {/* Tipo de conta — só no cadastro. Fica visível em vez de escondido
                  atrás de um link porque a escolha muda o preço da loja inteira.
                  Sublinhado âmbar em vez de pílula preenchida: com fill ele
                  virava sósia dos botões de provedor logo abaixo, e um é modo,
                  o outro é ação. Tab sublinhada lê como navegação. */}
              {authModalTab === "register" && !forgotPassword && !success && (
                <div className="border-b" style={{ borderColor: "var(--edge-subtle)" }}>
                  <div role="tablist" aria-label="Tipo de conta" className="flex items-center justify-center gap-8">
                    {ACCOUNT_TABS.map(({ kind, label }) => {
                      const active = authModalKind === kind;
                      return (
                        <button key={kind} type="button" role="tab" aria-selected={active}
                          onClick={() => { setAuthModalKind(kind); reset(); }}
                          className="relative cursor-pointer pb-3 transition-colors duration-200"
                          style={{
                            fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600,
                            color: active ? "var(--ink-strong)" : "var(--ink-subtle)",
                          }}
                        >
                          {label}
                          {active && (
                            <motion.span layoutId="account-kind-underline"
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute -bottom-px left-0 right-0 h-[2px]"
                              style={{ background: "var(--primary)" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No login o header já dá o respiro; no cadastro quem separa é a
                  régua das tabs, então o corpo precisa do próprio topo. */}
              <div className={authModalTab === "register" && !success ? "pt-6" : ""}>
              {success ? (
                /* A conta já existe e a pessoa já está logada — isto é aviso,
                   não etapa. Sem botão: qualquer coisa clicável aqui vira
                   pedágio no fim de um formulário que a pessoa acabou de
                   preencher. */
                <div role="status" className="px-8 pb-8 pt-2 text-center">
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: "rgba(18,146,76,0.12)", color: "var(--buy-green)" }}
                  ><Check size={22} aria-hidden="true" /></motion.span>
                  {/* Mesmo título nos dois. "Revenda" seria palavra que a pessoa
                      nunca viu no fluxo, e "pessoa jurídica" só repete a aba que
                      ela acabou de clicar — a razão social logo abaixo já diz
                      que a conta é da empresa. */}
                  <p style={{ ...titleStyle, fontSize: "18px" }}>Conta criada</p>
                  {/* No PF a segunda linha cumprimenta; no PJ ela confirma qual
                      empresa entrou, que é o dado que a pessoa quer conferir. */}
                  <p className="pt-1.5" style={captionStyle}>
                    {success.kind === "pj" ? success.name : `Boas-vindas, ${success.name}.`}
                  </p>
                  {/* Só quando houve desvio: sem isso o salto pro checkout
                      parece o modal fazendo algo por conta própria. */}
                  {authRedirect && (
                    <p className="pt-3" style={{ ...captionStyle, color: "var(--ink-subtle)" }}>
                      Levando você de volta…
                    </p>
                  )}
                </div>
              ) : forgotPassword ? (
                <ForgotPasswordForm onBackToLogin={() => setForgotPassword(false)} />
              ) : isCompanyRegister ? (
                <RegisterCompanyForm submitting={loading} onSubmit={handleCompanySubmit} onGoToLogin={() => { setAuthModalTab("login"); reset(); }} />
              ) : (
                <>
                  <SocialButtons loadingProvider={socialLoading} onSelect={handleSocial} />

                  {/* Divider */}
                  <div className="flex items-center gap-4 px-8 py-5">
                    <div className="h-px flex-1" style={{ background: "var(--edge-subtle)" }} />
                    <span style={{ ...captionStyle, fontSize: "12px", color: "var(--ink-subtle)" }}>ou</span>
                    <div className="h-px flex-1" style={{ background: "var(--edge-subtle)" }} />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3 px-8 pb-8">
                    {authModalTab === "register" && (
                      <>
                        {/* Nome e sobrenome separados porque é assim que a nota
                            fiscal pede — dividir uma string depois erra em nome
                            composto. */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="relative">
                            <User size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
                            <input type="text" placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                              className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
                          </div>
                          <input type="text" placeholder="Sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                            className={`${inputNoIconClass} ${fieldFocusClass}`} style={inputStyle} />
                        </div>
                        {/* Tabular-nums porque CPF é conferido dígito a dígito. */}
                        <div className="relative">
                          <IdCard size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
                          <input type="text" inputMode="numeric" placeholder="CPF" value={cpf} required
                            aria-label="CPF" aria-invalid={cpf.length === 14 && !isValidCpf(cpf)}
                            onChange={(e) => { setCpf(formatCpf(e.target.value)); setError(null); }}
                            className={`${inputClass} ${fieldFocusClass}`}
                            style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }} />
                        </div>
                      </>
                    )}
                    <div className="relative">
                      <Mail size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
                      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
                    </div>
                    {/* Opcional de verdade: serve pra aviso de entrega, não pra
                        autenticar. Quem não quiser dar o número passa direto. */}
                    {authModalTab === "register" && (
                      <div className="relative">
                        <Phone size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
                        <input type="tel" inputMode="numeric" placeholder="Celular (opcional)" value={phone}
                          aria-label="Celular (opcional)"
                          onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(null); }}
                          className={`${inputClass} ${fieldFocusClass}`}
                          style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }} />
                      </div>
                    )}
                    <div className="relative">
                      <Lock size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
                      <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} required
                        className={`${inputClass} ${fieldFocusClass} pr-11`} style={inputStyle} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-3)]"
                        style={{ color: "var(--ink-subtle)" }}
                      >{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>

                    {/* Some quando o erro aparece: a regra e a mensagem são a
                        mesma frase, e cinza logo acima do vermelho lê como bug. */}
                    {authModalTab === "register" && !error && (
                      <p style={{ ...captionStyle, fontSize: "12.5px", color: "var(--ink-subtle)" }}>{PASSWORD_HINT}</p>
                    )}

                    {error && (
                      <p role="alert" className="flex items-start gap-2" style={errorStyle}>
                        <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />{error}
                      </p>
                    )}

                    {authModalTab === "login" && (
                      <div className="text-right">
                        <button type="button" onClick={() => setForgotPassword(true)}
                          className="cursor-pointer transition-colors duration-200 hover:text-[var(--amber-text)]"
                          style={{ ...captionStyle, color: "var(--ink-subtle)" }}
                        >Esqueceu a senha?</button>
                      </div>
                    )}

                    <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
                      {loading ? <Loader2 size={16} className="animate-spin" /> : (
                        <>{authModalTab === "login" ? "Entrar" : "Criar conta"}<ArrowRight size={15} aria-hidden="true" /></>
                      )}
                    </button>

                    {authModalTab === "register" && (
                      <p className="pt-1 text-center" style={{ ...captionStyle, fontSize: "12px", color: "var(--ink-subtle)" }}>
                        Ao criar a conta você aceita os{" "}
                        <a href="/termos-de-uso" target="_blank" className="underline transition-colors hover:text-[var(--amber-text)]">Termos de Uso</a>{" "}
                        e a{" "}
                        <a href="/politica-de-privacidade" target="_blank" className="underline transition-colors hover:text-[var(--amber-text)]">Política de Privacidade</a>.
                      </p>
                    )}
                  </form>
                </>
              )}
              </div>

              {!forgotPassword && !success && (
                <p className="px-8 pb-8 text-center" style={{ ...captionStyle, fontSize: "14px" }}>
                  {authModalTab === "login" ? "Não tem conta? " : "Já tem conta? "}
                  <button type="button" onClick={() => { setAuthModalTab(authModalTab === "login" ? "register" : "login"); reset(); }}
                    className="cursor-pointer underline-offset-2 hover:underline"
                    style={{ color: "var(--amber-text)", fontWeight: 600 }}
                  >{authModalTab === "login" ? "Cadastre-se" : "Faça login"}</button>
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
