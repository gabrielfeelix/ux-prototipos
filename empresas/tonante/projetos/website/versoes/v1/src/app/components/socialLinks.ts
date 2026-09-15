/* Perfis oficiais da Tonante, lidos do rodapé de tonantebrasil.com.br.
 *
 * São só estes três: o site institucional não tem TikTok nem X, então nenhum
 * dos dois aparece no rodapé nem na faixa do header — link social que não leva
 * a lugar nenhum é pior que ausência dele.
 *
 * Vivem aqui, e não dentro do Footer, porque a faixa preta do HeaderV2 mostra
 * a mesma lista: perfil novo entra num lugar só.
 */
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/tonantebr/" },
  { label: "Facebook", href: "https://www.facebook.com/TONANTEBRASIL/" },
  { label: "YouTube", href: "https://www.youtube.com/c/tonante" },
] as const;

export type SocialLabel = (typeof SOCIAL_LINKS)[number]["label"];
