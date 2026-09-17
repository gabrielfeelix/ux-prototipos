import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Mail, MapPin, Lock, User, Phone, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, AlertCircle, RotateCw, Check } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { CnpjLookupError, formatCnpj, lookupCnpj, stripCnpj, toTitleCase, type CnpjLookupResult } from "../../lib/cnpj";
import { PASSWORD_HINT, passwordIssue } from "../../lib/password";
import { formatPhone } from "../../lib/phone";
import { useAuth, type CompanyRegistration } from "../AuthContext";
import {
  captionStyle, errorStyle, fieldFocusClass, iconClass, iconStyle, inputClass,
  inputNoIconClass, inputStyle, primaryButtonClass, primaryButtonStyle,
} from "./styles";

const STEP_LABELS = ["Sua empresa", "Dados da empresa", "Seus dados", "Seu acesso"];

/* Segmentação nossa. O CNAE diz o que a empresa declara à Receita; isto diz o
   que ela faz com o instrumento Tonante, que é o que decide a condição
   comercial — loja não compra como escola, e escola não compra como estúdio. */
const RAMOS = [
  "Loja de instrumentos musicais",
  "Escola de música / conservatório",
  "Estúdio de gravação ou ensaio",
  "Luthier / assistência técnica",
  "Igreja / ministério de música",
  "Produtora ou casa de shows",
  "Distribuidor",
  "Uso interno da empresa",
  "Outro",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block pb-1.5" style={{ ...captionStyle, fontSize: "12.5px", fontWeight: 600, color: "var(--ink-muted)" }}>
      {children}
    </span>
  );
}

interface RegisterCompanyFormProps {
  submitting: boolean;
  onSubmit: (data: CompanyRegistration) => void;
  onGoToLogin: () => void;
}

/* Quatro passos: o CNPJ, o que a Receita respondeu sobre ele, quem é a pessoa,
   e o acesso. Nada do que vem da Receita é editável — razão social, endereço,
   IE e CNAE são dado fiscal, não preferência do usuário. */
export function RegisterCompanyForm({ submitting, onSubmit, onGoToLogin }: RegisterCompanyFormProps) {
  const { isCnpjRegistered } = useAuth();
  const [step, setStep] = useState(1);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [cnpj, setCnpj] = useState("");
  const [company, setCompany] = useState<CnpjLookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<CnpjLookupError | null>(null);

  const [atividade, setAtividade] = useState("");
  const [ramo, setRamo] = useState("");
  const [phone, setPhone] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* A atividade da Receita já vem escolhida — na maioria das empresas ela é a
     certa, e quem tiver CNAE secundário mais relevante troca no select. */
  useEffect(() => {
    if (company) setAtividade(company.atividadePrincipal.codigo);
  }, [company]);

  const runLookup = async (value: string) => {
    setLookupLoading(true);
    setLookupError(null);
    setAlreadyRegistered(false);
    try {
      const found = await lookupCnpj(value);
      /* Só depois de existir na Receita é que faz sentido perguntar se já tem
         conta — CNPJ inválido nem chega aqui. */
      if (await isCnpjRegistered(found.cnpj)) {
        setAlreadyRegistered(true);
        setCompany(null);
        return;
      }
      setCompany(found);
    } catch (err) {
      setCompany(null);
      setLookupError(err instanceof CnpjLookupError ? err : new CnpjLookupError("Não foi possível consultar esse CNPJ agora.", true));
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCnpjChange = (value: string) => {
    setCnpj(formatCnpj(value));
    setLookupError(null);
    setAlreadyRegistered(false);
    if (company) setCompany(null);
    if (stripCnpj(value).length === 14) void runLookup(value);
  };

  const atividades = company ? [company.atividadePrincipal, ...company.atividadesSecundarias] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) { if (company) setStep(2); return; }
    if (step === 2) {
      if (!ramo) { setError("Escolha o ramo de atividade."); return; }
      setStep(3); return;
    }
    if (step === 3) { setStep(4); return; }

    const weak = passwordIssue(password);
    if (weak) { setError(weak); return; }
    if (password !== confirmation) { setError("As senhas não são iguais."); return; }
    if (!company) return;

    const escolhida = atividades.find((a) => a.codigo === atividade) ?? company.atividadePrincipal;
    onSubmit({
      firstName, lastName, email, phone, password,
      company: {
        cnpj: formatCnpj(company.cnpj),
        razaoSocial: company.razaoSocial,
        nomeFantasia: company.nomeFantasia,
        endereco: company.endereco,
        inscricaoEstadual: company.inscricoesEstaduais[0],
        atividadePrincipal: escolhida,
        ramoAtividade: ramo,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-8 pb-8">
      <div className="flex items-center justify-between pb-1">
        <span style={{ ...captionStyle, fontWeight: 600, color: "var(--ink-muted)" }}>
          {STEP_LABELS[step - 1]}
        </span>
        {/* Régua âmbar: o acento da marca marca onde a pessoa está, e o passo
            vencido fica em âmbar apagado em vez de sumir. */}
        <span className="flex items-center gap-1.5" role="presentation">
          {STEP_LABELS.map((_, i) => (
            <span key={i} className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: i + 1 === step ? 20 : 10,
                background: i + 1 === step ? "var(--primary)" : i + 1 < step ? "rgba(200,120,0,0.38)" : "var(--edge)",
              }} />
          ))}
        </span>
      </div>

      {step === 1 && (
        <>
          <div className="relative">
            <Building2 size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
            <input
              type="text" inputMode="numeric" placeholder="CNPJ" value={cnpj} required autoFocus
              aria-label="CNPJ" aria-invalid={!!lookupError}
              onChange={(e) => handleCnpjChange(e.target.value)}
              className={`${inputClass} ${fieldFocusClass}`}
              style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }}
            />
            {lookupLoading && <Loader2 size={15} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin" style={{ color: "var(--ink-subtle)" }} />}
          </div>

          {lookupError && (
            <div role="alert" className="flex items-start gap-2" style={errorStyle}>
              <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />
              <span className="flex-1">
                {lookupError.message}
                {lookupError.retryable && (
                  <button type="button" onClick={() => void runLookup(cnpj)}
                    className="ml-1.5 inline-flex cursor-pointer items-center gap-1 underline hover:no-underline">
                    <RotateCw size={11} aria-hidden="true" />tentar de novo
                  </button>
                )}
              </span>
            </div>
          )}

          {/* Beco sem saída se não oferecer a saída: quem já tem conta veio
              cadastrar por engano e o que ele precisa é entrar. */}
          {alreadyRegistered && (
            <div role="alert" className="flex items-start gap-2" style={errorStyle}>
              <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />
              <span className="flex-1">
                Esse CNPJ já tem conta na Tonante.
                <button type="button" onClick={onGoToLogin} className="ml-1.5 cursor-pointer underline hover:no-underline">
                  Faça login
                </button>
              </span>
            </div>
          )}

          {company && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 border p-3.5"
              style={{ borderRadius: "var(--radius-button)", borderColor: "var(--edge)", background: "var(--surface-2)" }}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(18,146,76,0.14)", color: "var(--buy-green)" }}>
                <Check size={12} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p style={{ fontFamily: "var(--font-family-inter)", fontSize: "14.5px", fontWeight: 600, color: "var(--ink-strong)" }}>
                  {toTitleCase(company.razaoSocial)}
                </p>
                <p style={{ ...captionStyle, fontSize: "12.5px" }}>
                  {company.situacao} · {company.endereco.municipio}/{company.endereco.uf}
                </p>
              </div>
              <button type="button" onClick={() => { setCompany(null); setCnpj(""); }}
                className="shrink-0 cursor-pointer transition-colors duration-200 hover:text-[var(--amber-text)]"
                style={{ ...captionStyle, color: "var(--ink-subtle)" }}
              >trocar</button>
            </motion.div>
          )}
        </>
      )}

      {step === 2 && company && (
        <>
          {/* Card de verdade, não régua: este bloco é a resposta da Receita, e
              resposta tem borda. Fundo cinza leve o separa do branco do modal
              sem virar mais um campo — campo tem raio de botão e placeholder,
              este tem raio de card e texto pronto. Razão social em Fraunces
              porque é o único dado que a pessoa confere de fato; CNPJ, IE e
              endereço são prova e vão embaixo, em corpo menor. */}
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden border"
            style={{
              borderRadius: "var(--radius-card-lg)",
              borderColor: "var(--edge-subtle)",
              background: "var(--surface-2)",
              boxShadow: "var(--shadow-card-hairline)",
            }}
          >
            <div className="flex items-start gap-3 px-4 pb-3.5 pt-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full"
                style={{ background: "rgba(200,120,0,0.12)", color: "var(--amber-deep)" }}>
                <Building2 size={15} strokeWidth={2} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16.5px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", color: "var(--ink-strong)" }}>
                  {toTitleCase(company.razaoSocial)}
                </p>
                {/* Tabular-nums alinha os dígitos: CNPJ é conferido número a
                    número, não lido como palavra. */}
                {/* CNPJ e IE em linhas próprias: emendados com ponto médio, a
                    IE (que tem até 14 dígitos) quebrava no meio e os dois
                    números viravam um só borrão. */}
                <p className="pt-1" style={{ ...captionStyle, fontSize: "12.5px", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
                  {formatCnpj(company.cnpj)}
                </p>
                {company.inscricoesEstaduais[0] && (
                  <p style={{ ...captionStyle, fontSize: "12.5px", color: "var(--ink-subtle)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
                    IE {company.inscricoesEstaduais[0]}
                  </p>
                )}
              </div>

              {/* Situação em pílula, não em texto solto: é selo de status, e
                  selo tem contorno. */}
              <span className="mt-0.5 flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1"
                style={{ background: "rgba(18,146,76,0.10)", color: "var(--buy-green-deep)", fontFamily: "var(--font-family-inter)", fontSize: "11.5px", fontWeight: 600 }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--buy-green)" }} aria-hidden="true" />
                {toTitleCase(company.situacao)}
              </span>
            </div>

            {/* Endereço num rodapé branco: separa o que a empresa é do lugar
                onde ela recebe, sem precisar de mais uma borda. */}
            <div className="flex items-start gap-2 border-t px-4 py-3"
              style={{ borderColor: "var(--edge-subtle)", background: "#ffffff" }}>
              <MapPin size={13} className="mt-[3px] shrink-0" style={{ color: "var(--ink-subtle)" }} aria-hidden="true" />
              {/* Corre como uma frase só. O travessão separa o local (rua,
                  bairro) da localização (CEP, cidade) — hierarquia maior que a
                  do ponto médio, sem quebrar linha. */}
              <p style={{ ...captionStyle, fontSize: "12.5px", lineHeight: 1.6, color: "var(--ink-subtle)", fontVariantNumeric: "tabular-nums" }}>
                {toTitleCase(company.endereco.logradouro)}
                {company.endereco.complemento ? `, ${toTitleCase(company.endereco.complemento)}` : ""} · {toTitleCase(company.endereco.bairro)} — {company.endereco.cep} · {company.endereco.municipio}/{company.endereco.uf}
              </p>
            </div>
          </motion.div>

          <div>
            <FieldLabel>Atividade principal</FieldLabel>
            <SearchableSelect
              ariaLabel="Atividade principal"
              value={atividade}
              onChange={setAtividade}
              placeholder="Selecione"
              searchPlaceholder="Pesquisar CNAE…"
              options={atividades.map((a) => ({ value: a.codigo, label: a.descricao, hint: a.codigo }))}
            />
          </div>

          <div>
            <FieldLabel>Ramo de atividade</FieldLabel>
            <SearchableSelect
              ariaLabel="Ramo de atividade"
              value={ramo}
              onChange={(v) => { setRamo(v); setError(null); }}
              placeholder="O que sua empresa faz com o instrumento?"
              options={RAMOS.map((r) => ({ value: r, label: r }))}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <User size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
              <input type="text" placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus
                className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
            </div>
            <input type="text" placeholder="Sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} required
              className={`${inputNoIconClass} ${fieldFocusClass}`} style={inputStyle} />
          </div>
          {/* Telefone é contato da pessoa, não da empresa — fica junto do nome
              dela, não no bloco de dados do CNPJ. */}
          <div className="relative">
            <Phone size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
            <input type="tel" inputMode="numeric" placeholder="Celular" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required
              className={`${inputClass} ${fieldFocusClass}`} style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="relative">
            <Mail size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
              className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
          </div>
          <div className="relative">
            <Lock size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
            <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} required minLength={8}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              className={`${inputClass} ${fieldFocusClass} pr-11`} style={inputStyle} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-3)]"
              style={{ color: "var(--ink-subtle)" }}
            >{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
          <div className="relative">
            <Lock size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
            <input type={showPassword ? "text" : "password"} placeholder="Confirmar senha" value={confirmation} required
              onChange={(e) => { setConfirmation(e.target.value); setError(null); }}
              className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
          </div>
          {/* Some quando o erro aparece: a regra e a mensagem são a mesma frase,
              e repetir em cinza logo acima do vermelho lê como bug. */}
          {!error && <p style={{ ...captionStyle, fontSize: "12.5px", color: "var(--ink-subtle)" }}>{PASSWORD_HINT}</p>}
        </>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2" style={errorStyle}>
          <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />{error}
        </p>
      )}

      <div className="flex items-center gap-2.5 pt-1">
        {step > 1 && (
          <button type="button" onClick={() => { setStep(step - 1); setError(null); }}
            aria-label="Voltar"
            className="flex cursor-pointer items-center justify-center rounded-pill px-5 py-3.5 transition-colors duration-200 hover:bg-[var(--surface-3)]"
            style={{ border: "1px solid var(--edge)", color: "var(--ink-muted)" }}
          ><ArrowLeft size={15} aria-hidden="true" /></button>
        )}
        <button type="submit" disabled={submitting || (step === 1 && !company)}
          className={`${primaryButtonClass} flex-1`} style={primaryButtonStyle}
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : (
            <>{step === 4 ? "Criar conta" : "Continuar"}<ArrowRight size={15} aria-hidden="true" /></>
          )}
        </button>
      </div>

      {step === 4 && (
        <p className="pt-1 text-center" style={{ ...captionStyle, fontSize: "12px", color: "var(--ink-subtle)" }}>
          Ao criar a conta você aceita os{" "}
          <a href="/termos-de-uso" target="_blank" className="underline transition-colors hover:text-[var(--amber-text)]">Termos de Uso</a>{" "}
          e a{" "}
          <a href="/politica-de-privacidade" target="_blank" className="underline transition-colors hover:text-[var(--amber-text)]">Política de Privacidade</a>.
        </p>
      )}
    </form>
  );
}
