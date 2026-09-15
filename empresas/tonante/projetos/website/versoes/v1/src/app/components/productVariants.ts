/* productVariants — quais produtos são a mesma peça em cor diferente.
 *
 * GERADO por scripts/variantes.py — não editar à mão.
 *
 * O seletor de cor antes dependia de COLOR_RULES, dez cores genéricas herdadas
 * do protótipo de origem ("preto", "azul", "vermelho"). O catálogo Tonante não
 * fala assim — Deep Dark, Yellow Cake, Merlot, Blue Wood, Coffee Sparkle — então
 * quase nenhuma variante era reconhecida: Jazzmine Yellow Cake e Jazzmine Deep
 * Dark apareciam na prateleira como dois produtos sem relação.
 *
 * Família: dois produtos são variantes quando o nome bate em todos os segmentos
 * menos um, e esse um não é estrutural (4/5 cordas, 40"/41", nº de bandas) nem o
 * código do modelo. O segmento que sobra vira o rótulo — o nome comercial da
 * cor, não uma aproximação.
 *
 * `color` é medido na foto do produto (mediana do que não é fundo branco), que é
 * o único jeito de dar hex a "Merlot". A medição também filtra: família cujas
 * fotos têm a mesma cor não é variação de cor e não entra aqui.
 *
 * 62 produtos em 20 famílias.
 */

export interface VariantInfo {
  /** chave da família — produtos que a compartilham são a mesma peça */
  family: string;
  /** nome comercial da cor, como aparece no nome do produto */
  label: string;
  /** hex medido na foto, para quando não houver imagem */
  color: string;
}

export const VARIANTS: Record<string, VariantInfo> = {
  "CP35892": { family: "acessorios::capotraste para violao em aluminio", label: "Prata", color: "#b0b1ba" },
  "CP35895": { family: "acessorios::capotraste para violao em aluminio", label: "Preto", color: "#202024" },
  "CP338666": { family: "acessorios::capotraste para violao em aluminio-cpt", label: "Prata", color: "#9b9b9b" },
  "CP338667": { family: "acessorios::capotraste para violao em aluminio-cpt", label: "Preto", color: "#323232" },
  "CP314828": { family: "acessorios::cavaco acustico tonante", label: "Natural", color: "#af855f" },
  "CP314831": { family: "acessorios::cavaco acustico tonante", label: "Preto", color: "#2c2c2e" },
  "CP314827": { family: "acessorios::cavaco eletrico tonante", label: "Natural", color: "#af855f" },
  "CP314830": { family: "acessorios::cavaco eletrico tonante", label: "Preto", color: "#2d2e30" },
  "CP314826": { family: "acessorios::viola acustica tonante", label: "Black", color: "#262624" },
  "CP314791": { family: "acessorios::viola acustica tonante", label: "Natural", color: "#e3cc93" },
  "CP314824": { family: "acessorios::viola eletroacustica tonante", label: "Black", color: "#272726" },
  "CP314787": { family: "acessorios::viola eletroacustica tonante", label: "Natural", color: "#e2cc93" },
  "CP107790": { family: "baterias::bateria acustica tonante sonora", label: "Black Sparkle", color: "#2d2d2b" },
  "CP107795": { family: "baterias::bateria acustica tonante sonora", label: "Blue Sparkle", color: "#5d666a" },
  "CP107796": { family: "baterias::bateria acustica tonante sonora", label: "Coffee Sparkle", color: "#6a645e" },
  "CP107791": { family: "baterias::bateria acustica tonante sonora", label: "Grey Sparkle", color: "#5c6061" },
  "CP107793": { family: "baterias::bateria acustica tonante sonora", label: "Red Apple", color: "#742f2b" },
  "CP107794": { family: "baterias::bateria acustica tonante sonora", label: "Wine Sparkle", color: "#432c2d" },
  "CP108179": { family: "contrabaixos::contrabaixo eletrico-jazzmine-4 cordas", label: "Deep Dark", color: "#474443" },
  "CP108180": { family: "contrabaixos::contrabaixo eletrico-jazzmine-4 cordas", label: "Sunset", color: "#975b41" },
  "CP108177": { family: "contrabaixos::contrabaixo eletrico-jazzmine-4 cordas", label: "Yellow Cake", color: "#e2d9cc" },
  "CP111601": { family: "contrabaixos::contrabaixo eletrico-jazzmine-5 cordas", label: "Deep Dark", color: "#474444" },
  "CP111602": { family: "contrabaixos::contrabaixo eletrico-jazzmine-5 cordas", label: "Sunset", color: "#965d40" },
  "CP111599": { family: "contrabaixos::contrabaixo eletrico-jazzmine-5 cordas", label: "Yellow Cake", color: "#dad1b0" },
  "CP108183": { family: "contrabaixos::contrabaixo eletrico-theodor-4 cordas", label: "Deep Dark", color: "#393838" },
  "CP108182": { family: "contrabaixos::contrabaixo eletrico-theodor-4 cordas", label: "Merlot", color: "#d4373e" },
  "CP108181": { family: "contrabaixos::contrabaixo eletrico-theodor-4 cordas", label: "Nude Wood", color: "#f4dc7b" },
  "CP111605": { family: "contrabaixos::contrabaixo eletrico-theodor-5 cordas", label: "Deep Dark", color: "#393939" },
  "CP111604": { family: "contrabaixos::contrabaixo eletrico-theodor-5 cordas", label: "Merlot", color: "#d4383f" },
  "CP111603": { family: "contrabaixos::contrabaixo eletrico-theodor-5 cordas", label: "Nude Wood", color: "#d8ad68" },
  "CP108174": { family: "guitarras::guitarra eletrica cecille-modelo tl", label: "Cobalt Blue", color: "#494a60" },
  "CP108173": { family: "guitarras::guitarra eletrica cecille-modelo tl", label: "Polar White", color: "#d8d6d3" },
  "CP111578": { family: "guitarras::guitarra eletrica cecille-modelo tl", label: "Sangria", color: "#a77e3d" },
  "CP111597": { family: "guitarras::guitarra eletrica star light-ss", label: "Azure", color: "#5db1d8" },
  "CP111595": { family: "guitarras::guitarra eletrica star light-ss", label: "Deep Dark", color: "#404040" },
  "CP111593": { family: "guitarras::guitarra eletrica star light-ss", label: "RED Sunset", color: "#675853" },
  "CP111596": { family: "guitarras::guitarra eletrica star light-ss", label: "Sunset", color: "#745d46" },
  "CP111594": { family: "guitarras::guitarra eletrica star light-ss", label: "Vanilla", color: "#c2c4c0" },
  "CP36755": { family: "guitarras::guitarra eletrica strato muriel s-sss", label: "Deep Dark", color: "#423d3a" },
  "CP36754": { family: "guitarras::guitarra eletrica strato muriel s-sss", label: "Red Berry", color: "#cf2d2c" },
  "CP36757": { family: "guitarras::guitarra eletrica strato muriel s-sss", label: "Snow White", color: "#d8dce5" },
  "CP36756": { family: "guitarras::guitarra eletrica strato muriel s-sss", label: "Sunset", color: "#80513e" },
  "CP360327": { family: "guitarras::guitarra eletrica tonante-edicao 70 aniversario", label: "Metallic Blue", color: "#818e9b" },
  "CP360331": { family: "guitarras::guitarra eletrica tonante-edicao 70 aniversario", label: "Olympic White", color: "#d0c9a9" },
  "CP360326": { family: "guitarras::guitarra eletrica tonante-edicao 70 aniversario", label: "Satin Black", color: "#3c3a3a" },
  "CP108171": { family: "guitarras::guitarra eletrica valentine s-modelo st-sss", label: "Blue Ocean", color: "#73b0d0" },
  "CP108167": { family: "guitarras::guitarra eletrica valentine s-modelo st-sss", label: "Deep Dark", color: "#3d3d3d" },
  "CP108160": { family: "guitarras::guitarra eletrica valentine s-modelo st-sss", label: "Snow White", color: "#c7c5c5" },
  "CP108168": { family: "guitarras::guitarra eletrica valentine s-modelo st-sss", label: "Sunset", color: "#776349" },
  "CP108186": { family: "violoes::violao classico acustico lorenzzo 39-nylon", label: "Brown", color: "#e7c394" },
  "CP108184": { family: "violoes::violao classico acustico lorenzzo 39-nylon", label: "Natural", color: "#f4d5aa" },
  "CP355802": { family: "violoes::violao classico acustico lorenzzo 39-nylon", label: "Sunburst", color: "#974d17" },
  "CP111648": { family: "violoes::violao eletrico coral 40-tampo solido em spruce-eq 3 bandas", label: "Clear Natural", color: "#f0d1a6" },
  "CP111650": { family: "violoes::violao eletrico coral 40-tampo solido em spruce-eq 3 bandas", label: "Dark Spruce", color: "#45433d" },
  "CP111649": { family: "violoes::violao eletrico coral 40-tampo solido em spruce-eq 3 bandas", label: "Dark Wood", color: "#964c3b" },
  "CP111654": { family: "violoes::violao eletrico coral 40-tampo solido em spruce-eq 4 bandas", label: "Blue Wood", color: "#4682a1" },
  "CP111653": { family: "violoes::violao eletrico coral 40-tampo solido em spruce-eq 4 bandas", label: "Sunset", color: "#8a561c" },
  "CP111647": { family: "violoes::violao eletrico coral 41-tampo solido em spruce-eq 3 bandas", label: "Blue Wood", color: "#395b64" },
  "CP111643": { family: "violoes::violao eletrico coral 41-tampo solido em spruce-eq 3 bandas", label: "Clear Natural", color: "#e7c08a" },
  "CP111645": { family: "violoes::violao eletrico coral 41-tampo solido em spruce-eq 3 bandas", label: "Dark Spruce", color: "#41403b" },
  "CP111644": { family: "violoes::violao eletrico coral 41-tampo solido em spruce-eq 3 bandas", label: "Dark Wood", color: "#6e4036" },
  "CP111646": { family: "violoes::violao eletrico coral 41-tampo solido em spruce-eq 3 bandas", label: "Sunset", color: "#a8742b" },
};

/** Família e cor de um SKU, quando ele faz parte de um grupo de variantes. */
export function getVariantInfo(sku?: string): VariantInfo | null {
  if (!sku) return null;
  return VARIANTS[sku] ?? null;
}
