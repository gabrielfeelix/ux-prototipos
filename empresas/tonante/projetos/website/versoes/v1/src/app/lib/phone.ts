/** Formata progressivamente enquanto digita: (00) 00000-0000 */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

/** Celular brasileiro completo: DDD + 9 dígitos. */
export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 11;
}
