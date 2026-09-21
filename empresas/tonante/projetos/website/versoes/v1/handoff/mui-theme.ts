/**
 * Ponto de partida do tema MUI da Tonante para o front GraphCommerce.
 *
 * Este arquivo NÃO roda no protótipo (o protótipo é Vite + Tailwind). Ele existe
 * para o time de front: cole em `components/theme.ts` do projeto GraphCommerce,
 * junto com `tokens.ts`, e o tema nasce com os valores certos em vez de serem
 * redigitados a partir de prints.
 *
 * O que o MUI expressa nativamente (palette, typography, shape) está mapeado
 * abaixo. O que ele não tem slot para — gradientes, a rampa de sombras por
 * papel, os tons de madeira — vai em `theme.tonante`, um namespace próprio que
 * fica acessível em qualquer `sx` via `theme.tonante.gradient.buy`.
 *
 * Duas coisas que merecem atenção na revisão de vocês:
 *
 * 1. A escala tipográfica do protótipo tem h1 em 80px, calibrada para a largura
 *    de container de 1760px. O `responsiveVal` do next-ui existe exatamente para
 *    isso; os valores aqui são o topo da escala, não o valor fixo em mobile.
 *
 * 2. `buy-green` (#1bb863) dá 2.8:1 contra texto branco, abaixo do mínimo AA de
 *    4.5:1. É uma decisão de design registrada em src/styles/theme.css, não um
 *    descuido. Se a auditoria de acessibilidade pedir mudança, o degrau
 *    `buy-green-press` (#128646) é o candidato.
 */
import { createTheme, type Theme } from '@mui/material'
import { themeBaseDefaults } from '@graphcommerce/next-ui'
import { color, fontFamily, fontSize, fontWeight, gradient, layout, motion, radius, semantic, shadow } from './tokens'

declare module '@mui/material/styles' {
  interface Theme {
    tonante: {
      gradient: typeof gradient
      shadow: typeof shadow
      semantic: typeof semantic
      layout: typeof layout
      ease: string
    }
  }
  interface ThemeOptions {
    tonante?: Theme['tonante']
  }
}

const sans = fontFamily['font-family-inter']
const display = fontFamily['font-family-figtree']

export const lightTheme: Theme = createTheme({
  ...themeBaseDefaults,

  palette: {
    mode: 'light',
    primary: {
      main: color.primary,
      contrastText: color['primary-foreground'],
      // âmbar não preenche botão: em área grande lê marrom. Ver btn-brand-* nos tokens.
      dark: semantic['amber-deep'],
      light: semantic['amber-bright'],
    },
    secondary: {
      main: color.secondary,
      contrastText: color['secondary-foreground'],
    },
    // verde é exclusivo de ação de compra, nunca de "sucesso" genérico
    success: {
      main: semantic['buy-green'],
      dark: semantic['buy-green-press'],
      contrastText: '#ffffff',
    },
    error: {
      main: color.destructive,
      contrastText: color['destructive-foreground'],
    },
    background: {
      default: color.background,
      paper: color.card,
    },
    text: {
      primary: color.foreground,
      // ink-meta, não muted: preço riscado e reviews precisam de ~6:1
      secondary: semantic['ink-meta'],
      disabled: semantic['ink-subtle'],
    },
    divider: color.border,
  },

  typography: {
    fontFamily: sans,
    // Fraunces só em título. Preço, nome de produto e meta são Hanken:
    // dado de compra é balcão, não palco.
    h1: { fontFamily: display, fontSize: fontSize['text-h1'], fontWeight: fontWeight['font-weight-normal'] },
    h2: { fontFamily: display, fontSize: fontSize['text-h2'], fontWeight: fontWeight['font-weight-normal'] },
    h3: { fontFamily: display, fontSize: fontSize['text-h3'], fontWeight: fontWeight['font-weight-normal'] },
    h4: { fontFamily: display, fontSize: fontSize['text-h4'], fontWeight: fontWeight['font-weight-normal'] },
    h5: { fontFamily: display, fontSize: fontSize['text-xl'], fontWeight: fontWeight['font-weight-medium'] },
    h6: { fontFamily: display, fontSize: fontSize['text-lg'], fontWeight: fontWeight['font-weight-medium'] },
    body1: { fontFamily: sans, fontSize: fontSize['text-base'] },
    body2: { fontFamily: sans, fontSize: fontSize['text-sm'] },
    caption: { fontFamily: sans, fontSize: fontSize['text-caption'] },
    // GraphCommerce chama o preço do card de `subtitle1` no ProductListItem
    subtitle1: {
      fontFamily: sans,
      fontSize: fontSize['text-price-lg'],
      fontWeight: fontWeight['font-weight-semibold'],
      fontVariantNumeric: 'tabular-nums',
    },
    overline: {
      fontFamily: sans,
      fontSize: fontSize['text-eyebrow'],
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },

  shape: { borderRadius: Number.parseInt(radius.radius, 10) },

  tonante: { gradient, shadow, semantic, layout, ease: motion.ease },
})

export default lightTheme
