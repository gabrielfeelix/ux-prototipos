/* Foco de áudio — um timbre por vez, em qualquer lugar da loja.

   As libs de som (lib/strum, lib/timbre) já cortam o áudio anterior, mas o
   componente que estava tocando nunca ficava sabendo: ele guarda `playing` no
   próprio estado e continuava mostrando o botão de parar. Dava pra ver dois
   cards "tocando" ao mesmo tempo, os dois com quadrado no lugar do play.

   Aqui mora a única referência de quem está com a palavra. Quem começa a tocar
   chama `tomarFoco` com a própria função de soltar (parar o áudio e voltar o
   botão); o anterior é solto na hora. */

let soltarAtual: (() => void) | null = null;

export function tomarFoco(soltar: () => void) {
  if (soltarAtual && soltarAtual !== soltar) soltarAtual();
  soltarAtual = soltar;
}

/** Ao terminar ou ao parar por conta própria: só larga se ainda for o dono. */
export function largarFoco(soltar: () => void) {
  if (soltarAtual === soltar) soltarAtual = null;
}
