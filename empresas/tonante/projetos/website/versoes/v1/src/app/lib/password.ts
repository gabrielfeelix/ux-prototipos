/* Regra de senha do cadastro, PF e PJ: oito caracteres e ao menos três das
   quatro classes.

   Escolhida por ser o default do Magento 2 — minimum_password_length=8 e
   required_character_classes_number=3 — que é pra onde este protótipo vai. O
   front descreve o que o servidor já faz, sem config extra.

   Sabendo que é regra deprecada: NIST SP 800-63B e OWASP ASVS mandam não impor
   composição, porque ela prevê o comportamento em vez de aumentar entropia
   (Senha@123 passa nos quatro tipos e está em todo vazamento). O substituto é
   comprimento maior + blocklist de senhas vazadas. Se um dia trocar, mexe aqui
   e nos dois campos de config do Magento juntos. */

export const PASSWORD_MIN_LENGTH = 8;
const REQUIRED_KINDS = 3;

/** Texto de apoio abaixo do campo. Mesma frase serve de mensagem de erro. */
export const PASSWORD_HINT =
  "Mínimo 8 caracteres, com 3 destes: minúscula, maiúscula, número, símbolo.";

const KINDS = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/];

/** Quantas das quatro classes a senha usa. */
export function passwordKindCount(password: string): number {
  return KINDS.filter((re) => re.test(password)).length;
}

/** Mensagem de erro, ou null se a senha passa. */
export function passwordIssue(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return PASSWORD_HINT;
  if (passwordKindCount(password) < REQUIRED_KINDS) return PASSWORD_HINT;
  return null;
}
