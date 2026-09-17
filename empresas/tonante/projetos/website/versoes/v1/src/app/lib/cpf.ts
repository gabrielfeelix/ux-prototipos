/* CPF: máscara e dígito verificador locais. Diferente do CNPJ, não há consulta
   externa — a Receita não expõe CPF em API pública, então o cálculo dos dois
   dígitos é toda a validação que dá pra fazer no cliente. */

/** Só os dígitos, no máximo 11. */
export function stripCpf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Formata progressivamente enquanto digita: 000.000.000-00 */
export function formatCpf(value: string): string {
  const d = stripCpf(value);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/* Mesma soma ponderada mod 11 do CNPJ, com pesos decrescentes a partir do
   tamanho do bloco: 10..2 para o primeiro dígito, 11..2 para o segundo. */
function checkDigit(digits: string): number {
  const weight = digits.length + 1;
  const sum = digits.split("").reduce((acc, n, i) => acc + Number(n) * (weight - i), 0);
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

export function isValidCpf(value: string): boolean {
  const d = stripCpf(value);
  if (d.length !== 11) return false;
  /* 111.111.111-11 e os outros dez repetidos passam no cálculo mas não existem. */
  if (/^(\d)\1{10}$/.test(d)) return false;
  return checkDigit(d.slice(0, 9)) === Number(d[9]) && checkDigit(d.slice(0, 10)) === Number(d[10]);
}
