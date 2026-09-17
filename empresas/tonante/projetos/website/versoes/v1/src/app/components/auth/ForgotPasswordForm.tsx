import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Loader2, ArrowRight, ArrowLeft, AlertCircle, Check } from "lucide-react";
import {
  captionStyle, errorStyle, fieldFocusClass, ghostButtonClass, iconClass, iconStyle,
  inputClass, inputStyle, primaryButtonClass, primaryButtonStyle, titleStyle,
} from "./styles";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

/* Duas telas: pede o e-mail e confirma que o link saiu. A senha nova não é
   definida aqui — o link do e-mail leva pra /redefinir-senha, que é onde o
   token é conferido. Quem redefine sem token só precisaria adivinhar o e-mail
   de alguém, então a etapa fora do navegador é a segurança do fluxo. */
export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
    } catch {
      setError("Não deu pra enviar agora. Tenta de novo em instantes.");
    } finally {
      setLoading(false);
    }
  };

  /* Confirma o envio sem confirmar a conta. Dizer "e-mail não cadastrado"
     transformaria esta tela num verificador de quem compra na Tonante: bastaria
     enfileirar endereços e ler a resposta. O "se existir" custa uma linha e
     fecha isso. */
  if (sent) {
    return (
      <div className="px-8 pb-8 pt-2 text-center">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(18,146,76,0.12)", color: "var(--buy-green)" }}
        ><Check size={22} aria-hidden="true" /></motion.span>
        <p style={{ ...titleStyle, fontSize: "18px" }}>E-mail enviado</p>
        <p className="px-2 pt-1.5" style={{ ...captionStyle, lineHeight: 1.65 }}>
          Se existir uma conta em {email}, o link para definir uma nova senha está a caminho.
          Confira também o spam.
        </p>
        <button type="button" onClick={onBackToLogin}
          className={`${ghostButtonClass} mx-auto mt-6`}
          style={{ ...captionStyle, color: "var(--ink-subtle)" }}
        ><ArrowLeft size={13} aria-hidden="true" />Voltar pro login</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-8 pb-8">
      <p className="pb-1" style={{ ...captionStyle, lineHeight: 1.6 }}>
        Digite o e-mail da sua conta. Enviamos um link para você definir uma nova senha.
      </p>

      <div className="relative">
        <Mail size={16} className={iconClass} style={iconStyle} aria-hidden="true" />
        <input type="email" placeholder="E-mail" value={email} required autoFocus
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          className={`${inputClass} ${fieldFocusClass}`} style={inputStyle} />
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2" style={errorStyle}>
          <AlertCircle size={14} className="mt-px shrink-0" aria-hidden="true" />{error}
        </p>
      )}

      <button type="submit" disabled={loading} className={primaryButtonClass} style={primaryButtonStyle}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : (
          <>Enviar link<ArrowRight size={15} aria-hidden="true" /></>
        )}
      </button>

      <button type="button" onClick={onBackToLogin}
        className={`${ghostButtonClass} w-full pt-1`}
        style={{ ...captionStyle, color: "var(--ink-subtle)" }}
      ><ArrowLeft size={13} aria-hidden="true" />Voltar pro login</button>
    </form>
  );
}
