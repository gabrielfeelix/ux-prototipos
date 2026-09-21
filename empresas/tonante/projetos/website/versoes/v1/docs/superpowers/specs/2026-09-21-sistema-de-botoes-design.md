# Sistema de botões — spec de design

Data: 2026-09-21. Branch `tonante/website-v1`.
Origem: auditoria de todos os botões do site (21/09), que encontrou 445 `<button>`
crus, 4 sistemas paralelos, 7 tintas de ação, 6 alturas, 13 raios e dezenas de
controles sem hover ou sem pressed.

## 1. Diagnóstico que motiva a mudança

### 1.1 O `variant` de hoje mistura dois conceitos

`CTAButton` expõe `variant: ink | buy | preorder | brand`. Os quatro são
"botão preenchido". Não existe um secundário verde nem um terciário neutro,
então toda ação que não é o CTA principal vira `<button>` cru com classes
escritas na hora. Daí os 445.

### 1.2 Gradiente não transiciona

`brand` e `preorder` usam `background-image`. CSS não anima entre dois
`background-image`, então esses variants ficaram com `hover:scale` e nada de
cor — e todo mundo que copiou o âmbar na mão (`bg-primary`) herdou o mesmo
defeito sem nem o gradiente. `buy` escapou porque foi convertido para cor
sólida com três tokens.

### 1.3 Âmbar chapado lê como marrom

`--primary` = `#C87800`. Em área grande e fundo claro, lê marrom. O repo já
registrou esse diagnóstico duas vezes sem propagar a correção:

- `src/app/components/section/CTAButton.tsx:48` — *"o preto é a cor de ação; o
  âmbar é acento. Um CTA âmbar chapado com texto escuro lia como marrom."*
- `src/styles/theme.css:906` — *"a tela do perfil tinha CTA em âmbar (que sobre
  fundo claro lê como marrom)... Aqui ficam só o sólido de tinta e o de contorno."*

Dar hover ao âmbar resolve o estado, não resolve a leitura.

### 1.4 Quatro sistemas concorrentes

| Sistema | Onde | Alcance | Hover do primário |
|---|---|---|---|
| `CTAButton`/`GhostButton` (cva) | `section/CTAButton.tsx` | 9 e 3 arquivos | cor `#2b2b2b` |
| `.btn-tonante` / `-ghost` (CSS) | `theme.css:912-934` | 4 arquivos, 28 usos | cor `#2b2b2b` |
| `primaryButtonClass` (const) | `auth/styles.ts` | 3 arquivos | `opacity-90` |
| `<button>` cru | espalhado | 445 ocorrências | varia ou inexiste |

Mesma tinta (`--ink-strong`), três animações de hover diferentes.

### 1.5 Foco de teclado quebrado em 34 pontos

`theme.css:557-571` instala o anel global citando WCAG 2.4.7. Tailwind v4 emite
`outline-none` na camada `utilities`, que vence `base` por ordem de cascata.
34 elementos matam o anel sem repor nada — 8 em `MonteSeuPcPage`, 6 em
`HeaderV2`, 6 em `AfinadorPage`, 5 em `AjudaPage`, 4 em `Navbar`.

## 2. Princípio

**Separar hierarquia de intenção.** Hierarquia é quanto peso visual o botão
tem. Intenção é o que ele significa. Dois eixos independentes, matriz
explícita do que é permitido.

## 3. Eixo A — hierarquia

| nível | forma | regra de uso |
|---|---|---|
| `primary` | preenchido, texto branco | 1 por dobra. A ação que a tela existe para provocar |
| `secondary` | contorno 1.5px, fundo transparente | ação alternativa ao lado de um primário |
| `tertiary` | fundo suave `--surface-glass`, sem borda | apoio dentro de barra/card, onde borda polui |
| `ghost` | só texto + ícone, sem fundo nem borda | descartar, cancelar, "agora não" |

## 4. Eixo B — intenção

São **quatro**, não cinco. `preorder` é cortado — ver §4.2.

| intent | repouso | hover | pressed | significado |
|---|---|---|---|---|
| `neutral` | `#111111` | `#2b2b2b` | `#000000` | ação padrão, sem carga |
| `buy` | `#1bb863` | `#169e54` | `#128646` | adiciona ao carrinho / finaliza compra |
| `danger` | `#b3261e` | `#9a2019` | `#821b15` | remove, cancela, exclui |
| `brand` | borda `#C87800`, texto `#965a00` | fundo `rgba(200,120,0,.08)`, borda `#b06a00` | fundo `rgba(200,120,0,.16)`, texto `#7a4900` | campanha institucional |

`buy` já existe em token (`--buy-green`, `-hover`, `-press`). `neutral` existe
dentro do cva de `CTAButton`. `brand` e `danger` precisam da rampa criada —
hoje `--primary` e `--destructive` são valor único, e é exatamente por isso que
não têm hover.

### 4.1 Contraste — medido, não estimado

Texto branco sobre cada preenchimento (WCAG 2.1 relative luminance):

| cor | ratio | veredito |
|---|---|---|
| `#111111` neutral | 18.88:1 | AA texto normal |
| `#b3261e` danger | 6.54:1 | AA texto normal |
| `#1bb863` buy repouso | **2.60:1** | **reprova** |
| `#169e54` buy hover | 3.47:1 | AA texto grande/bold |
| `#128646` buy press | 4.64:1 | AA texto normal |
| `#e08c12` laranja pré-venda | **2.65:1** | **reprova** |
| `#C87800` âmbar da marca | 3.42:1 | AA texto grande/bold |

E o âmbar como **texto** sobre branco: `#C87800` 3.42:1 (reprova para texto
normal), `#b06a00` 4.28:1 (reprova por pouco), `#965a00` 5.59:1 (passa).

Três consequências:

1. **`buy` fica como está.** 2.60:1 no repouso reprova, mas está registrado em
   `theme.css:140` como decisão consciente do Gabriel, o texto é branco bold, e
   a legibilidade **melhora** conforme se interage (hover 3.47, press 4.64).
   Este spec não reabre a decisão; só a herda documentada.
2. **`brand` como `secondary` usa texto `#965a00`, não `#C87800`.** O âmbar da
   marca fica na **borda** (onde 3.42:1 satisfaz o mínimo de 3:1 para
   componente de interface, WCAG 1.4.11) e o texto desce um degrau para passar
   em 4.5:1. É o que torna `secondary/brand` viável.
3. **`preorder` morre como intent.** Ver §4.2.

### 4.2 Por que `preorder` sai da lista

`#e08c12` dá 2.65:1 com texto branco. Para passar em 3:1 teria que escurecer
até `#c87800` — que é exatamente o âmbar da marca, colidindo com `brand`. E aí
cai na mesma armadilha do §1.3: laranja escuro o bastante para ser acessível é
marrom.

A saída é semântica, não cromática: **pré-venda é um estado do produto, não uma
intenção de ação.** O botão continua sendo uma compra — `primary/buy` com
rótulo "Reservar" — e a cor da campanha vive no `PreOrderPill` ao lado, que é
badge decorativo e por isso não tem exigência de contraste de controle.

Ganho colateral: quatro intents em vez de cinco, e um gradiente a menos em
botão.

## 5. A matriz: nem toda combinação existe

|  | neutral | buy | danger | brand |
|---|---|---|---|---|
| `primary` | ✓ | ✓ | ✓ | **✗** |
| `secondary` | ✓ | ✗ | ✓ | ✓ |
| `tertiary` | ✓ | ✗ | ✓ | ✗ |
| `ghost` | ✓ | ✗ | ✓ | ✗ |

Dez combinações válidas, de dezesseis possíveis. Três regras codificadas:

**Âmbar nunca preenche um botão.** `brand` só existe como `secondary` —
contorno e texto âmbar sobre fundo claro, que é onde a cor canta. A abertura de
landing institucional passa a ser `primary/neutral` preto, com um
`secondary/brand` ao lado quando precisar do acento.

**Verde só é primário.** Se "Comprar" não é a ação principal da dobra, não é
verde. Isso mata os cinco desenhos de "Comprar" que existem hoje.

**Vermelho é intenção, não hierarquia.** "Cancelar pedido" hoje é
`bg-red-500/5` inventado na hora; passa a ser `secondary/danger`.

## 6. Estados — os seis, obrigatórios

| estado | regra |
|---|---|
| rest | token do intent |
| hover | **cor sólida do segundo degrau** + `scale(1.02)` |
| pressed | **cor sólida do terceiro degrau** + `scale(0.97)` |
| focus-visible | `outline: 2px solid var(--ring)`, `offset: 2px` — global, nunca `outline-none` |
| disabled | `--edge-subtle` / `--ink-subtle`, `cursor: not-allowed`, sem scale nem sombra |
| loading | spinner no lugar do ícone, largura travada, `aria-busy="true"`, `disabled` |

Duas regras que vêm da auditoria:

**Cor sólida, nunca gradiente.** Gradiente é a causa raiz de todo hover morto.
`--gradient-buy`, `--gradient-brand` e `--gradient-preorder-orange` saem dos
botões e ficam só em pill e badge decorativo (`PreOrderPill`, `DiscountBadge`).

**`scale` é reforço, nunca o estado sozinho.** Em `prefers-reduced-motion` o
scale some (`theme.css:310`), e hoje isso deixa dezenas de botões sem retorno
nenhum ao clique.

## 7. Forma e tamanho

| size | altura | uso |
|---|---|---|
| `sm` | 36px | card denso, linha de tabela. Nunca em mobile |
| `md` | 44px | **padrão.** Mínimo de alvo de toque |
| `lg` | 52px | bloco de compra, CTA de landing |

Ícone puro: quadrados de 36 / 44 / 52. Em viewport `<768px` todo botão é no
mínimo 44px, independente do `size` pedido.

Raio: **pílula em tudo que é botão de ação.** `--radius-button` (10px) e
`--radius-card-sm` ficam reservados para controle que encosta em input —
stepper de quantidade, segmented de grade/lista, select, paginação. Assim a
forma passa a informar a função: botão é redondo, controle é reto.

## 8. Contexto `onDark`

O tema é travado em claro (`ThemeProvider.tsx:35` sempre remove `dark`), mas
existem seções sobre foto e sobre o "dark stage" (`--stage: #131314`). Para
elas, `onDark` é uma **prop de contexto**, não um nível de hierarquia:
sobrescreve os tokens de `secondary` e `ghost` por versões translúcidas
brancas. É o que o `GhostButton variant="onPhoto"` faz hoje, e o comportamento
dele é preservado — inclusive o `backdrop-blur` e a regra de o texto nunca
mudar de cor no hover.

`primary` em `onDark` mantém o intent normal: verde e vermelho funcionam sobre
escuro; `neutral` vira branco com texto escuro.

## 9. Fronteira: o que NÃO entra

`CarouselNavButton` e `QtyStepper` são **controles**, não botões de ação. Não
recebem `hierarchy`/`intent`, continuam com o chrome próprio. Ganham apenas os
estados que faltam (pressed com cor, não só scale).

Chips de filtro, abas, swatches de cor, dots de carrossel e steps de checkout
também ficam fora: são seleção, não ação. Merecem um primitivo próprio
(`Chip`/`Toggle`) numa rodada futura — este spec não os cobre.

O `ui/button.tsx` do shadcn fica, restrito ao uso interno de componentes Radix
que já dependem dele.

## 10. O que morre

| Morre | Vira |
|---|---|
| `CTAButton` (variants ink/buy/preorder/brand) | `Button hierarchy="primary" intent=…` |
| `GhostButton` (onPhoto/onLight) | `Button hierarchy="ghost" onDark` / `hierarchy="secondary"` |
| `.btn-tonante` (`theme.css:912`) | `Button primary neutral` |
| `.btn-tonante-ghost` (`theme.css:927`) | `Button secondary neutral` |
| `primaryButtonClass`/`Style` (`auth/styles.ts`) | `Button primary neutral block` |
| `QuickAddButton` | `Button primary buy size="sm" block` |
| 445 `<button>` crus de ação | `Button` |

## 11. Mapeamento das superfícies

Alvo por arquivo. Os botões de ícone, chips e controles de cada arquivo seguem
a regra da §9 e não estão listados um a um.

### Compra e conversão (prioridade 1)

| Origem | Hoje | Alvo |
|---|---|---|
| `CartPage.tsx:258` "Explorar produtos" | `--gradient-brand`, hover scale | `primary/neutral lg` |
| `CartPage.tsx:357` "Escolher brinde" | `--gradient-brand`, hover scale | `secondary/neutral md` |
| `CartPage.tsx:820` "Aplicar" cupom | `--gradient-brand`, hover scale | `primary/neutral sm` |
| `CartPage.tsx:1003` "Finalizar compra" desktop | raw `--gradient-buy`, hover scale | `primary/buy lg block` |
| `CartPage.tsx:1169` "Selecionar presente" | `--gradient-brand`, hover scale | `primary/neutral md` |
| `CartPage.tsx:1221` "Finalizar compra" mobile | `CTAButton buy md` | `primary/buy lg block` |
| `CartPage.tsx:317` "Limpar" | raw, hover cor | `ghost/danger sm` |
| `CheckoutPage.tsx` (11 `CTAButton`) | `ink`/`buy` | `primary/neutral`, `primary/buy` — troca mecânica |
| `CheckoutPage.tsx:1696` "Voltar" | raw, hover bg | `ghost/neutral md` |
| `CartDrawer.tsx:451` "Revisar pedido" | raw `--buy-green`, 3 estados ok | `primary/buy lg block` |
| `CartDrawer.tsx:446` "Continuar comprando" | raw contorno | `secondary/neutral lg block` |
| `CartDrawer.tsx:603` "Adicionar presente" | `CTAButton buy md` | `primary/buy md` |
| `CartDrawer.tsx:466` "Limpar carrinho" | raw, hover cor | `ghost/danger sm` |

`CartPage.tsx:1003` e `:1221` são o mesmo "Finalizar compra" em desktop e
mobile com componentes e comportamentos diferentes. Convergem no mesmo alvo.

### PDP e catálogo (prioridade 2)

| Origem | Hoje | Alvo |
|---|---|---|
| `ProductPage.tsx:921` "Comprar agora" sticky | `CTAButton buy lg block` | `primary/buy lg block` |
| `ProductPage.tsx:1269` "Comprar agora"/"Reservar" mobile | `CTAButton buy/preorder lg block` | `primary/buy lg block` (rótulo muda, cor não) |
| `ProductPage.tsx:2843` "Comprar agora" sticky mobile | `CTAButton` c/ `h-12` forçado no className | `primary/buy lg` (sem override) |
| `PreOrderPage.tsx:300` "Reservar" | `<span>` `#e08c12`, sem estado nenhum | `primary/buy md` + `PreOrderPill` |
| `ProductPage.tsx:1959` "Enviar Avaliação" | raw `bg-primary`, hover `/90` | `primary/neutral md block` |
| `ProductPage.tsx:1577` "Escrever uma avaliação" | raw contorno | `secondary/neutral md block` |
| `ProductPage.tsx:2188` "Ver descrição completa" | raw, **hover NADA** | `tertiary/neutral md block` |
| `ProductCard.tsx:459` "Adicionar à sacola" | raw `--primary`, **hover NADA** | `primary/buy md block` |
| `ProductCard.tsx:471` "Ver página completa" | raw transparente, **hover NADA** | `ghost/neutral md block` |
| `ProductCardV2.tsx:308` "Comprar agora" desktop | raw `--buy-green`, 3 estados ok | `primary/buy lg block` |
| `ProductCardV2.tsx:422` "Comprar agora" mobile | raw `--buy-green`, **hover NADA** | `primary/buy md block` |
| `ProductsPage.tsx:1601` "Comprar" lista mobile | raw `--gradient-buy`, **hover NADA** | `primary/buy sm block` |
| `ProductsPage.tsx:1637` "Comprar" lista desktop | raw `--gradient-buy`, hover scale | `primary/buy md` |
| `ProductsPage.tsx:1968` "Comprar" quick view | raw `--gradient-buy`, hover scale | `primary/buy lg block` |
| `ProductsPage.tsx:1772` "Mostrar N resultados" | raw `bg-foreground`, hover opacidade | `primary/neutral md block` |
| `ProductsPage.tsx:1509` "Limpar filtros" | raw contorno | `secondary/neutral md` |
| `ProductsPage.tsx:1720` "Carregar mais" | raw, **hover NADA** | `secondary/neutral lg block` |
| `QuickAddButton.tsx` (PopularGrid, ProductCarousel) | `--gradient-buy`, hover scale | `primary/buy sm block` |
| `ComparePage.tsx:263` "Comprar agora" | raw `--buy-green`, **hover NADA** | `primary/buy lg block` |
| `ComparePage.tsx:131` "Ver o catálogo" | raw `--primary`, **hover NADA** | `primary/neutral md` |
| `CompareBar.tsx:284` "Comparar agora" | raw `--primary`, **hover NADA** | `primary/neutral md` |
| `CompareBar.tsx:276` "Limpar" | raw, hover cor | `ghost/neutral sm` |
| `KitDescription.tsx:169` "Ouvir como soa" | raw `bg-foreground`, hover opacidade | `primary/neutral lg block` |
| `KitDescription.tsx:332` "Comparar os kits" | Link contorno | `secondary/neutral md` |
| `PreOrderPage.tsx:1065` "Limpar filtros" | raw `#fff`, hover bg | `secondary/neutral md` |
| `PreOrderBanner.tsx:313` "Comprar agora" | raw gradiente laranja, hover scale | `primary/buy lg block` + `PreOrderPill` ao lado |

### Perfil, auth e modais (prioridade 3)

| Origem | Hoje | Alvo |
|---|---|---|
| `ProfilePage.tsx` (21× `.btn-tonante`) | CSS global | `primary/neutral` |
| `ProfilePage.tsx` (6× `.btn-tonante-ghost`) | CSS global | `secondary/neutral` |
| `ProfilePage.tsx:1228` "Cancelar Pedido" | `bg-red-500/5` | `secondary/danger md` |
| `ProfilePage.tsx:1647`, `:1788` "Remover" | raw, **hover NADA** | `ghost/danger sm` |
| `ProfilePage.tsx:1885` "Ativar" 2FA | `bg-green-500`, hover brilho, **sem radius** | `primary/neutral sm` |
| `AuthModal.tsx:338` "Entrar"/"Criar conta" | `primaryButtonClass`, hover opacidade | `primary/neutral lg block` |
| `ForgotPasswordForm.tsx:82` "Enviar link" | `primaryButtonClass` | `primary/neutral lg block` |
| `RegisterCompanyForm.tsx:386` "Continuar" | `primaryButtonClass` | `primary/neutral lg block` |
| `RegisterCompanyForm.tsx:380` "Voltar" | raw contorno | `secondary/neutral lg` |
| `SocialButtons.tsx:24` "Continuar com Google" | raw branco c/ borda | `secondary/neutral lg block` |
| `AddressFormModal.tsx:167`, `CardFormModal.tsx:344` "Salvar" | `.btn-tonante` | `primary/neutral md` |
| `AddressFormModal.tsx:159`, `CardFormModal.tsx:336` "Cancelar" | `.btn-tonante-ghost` | `ghost/neutral md` |
| `ConfirmDialog.tsx:75` "Confirmar" | `--primary` ou vermelho, hover brilho | `primary/neutral` ou `primary/danger md` |
| `ConfirmDialog.tsx:60` "Cancelar" | raw, hover brilho | `ghost/neutral md` |
| `ReviewModal.tsx:269` "Enviar avaliação" | `.btn-tonante` | `primary/neutral md` |
| `ReviewModal.tsx:265` "Cancelar" | `.btn-tonante-ghost` | `ghost/neutral md` |

### Institucional e ferramentas (prioridade 4)

| Origem | Hoje | Alvo |
|---|---|---|
| `HeroInstitucional.tsx:112` (Revenda, Artistas, Trabalhe Conosco) | `CTAButton brand lg` | `primary/neutral lg` |
| `RevendaPage.tsx:628` "Enviar cadastro" | `CTAButton ink lg block` | `primary/neutral lg block` |
| `ArtistasPage.tsx:548` "Enviar inscrição" | `CTAButton brand lg block` | `primary/neutral lg block` |
| `ArtistasPage.tsx:410` "Continuar" | `CTAButton ink lg block` | `primary/neutral lg block` |
| `TrabalheConoscoPage.tsx:632` "Ver vagas abertas" | `ctaVariants brand lg` | `primary/neutral lg` |
| `AfinadorPage.tsx:390` "Afinar tudo" | `CTAButton brand md block` | `primary/neutral md block` |
| `AfinadorPage.tsx:393` "Parar" | raw contorno | `secondary/neutral md onDark` |
| `DriverDetailPage.tsx:94` "Baixar driver" | raw `bg-primary`, hover scale | `primary/neutral md` |
| `DriverDetailPage.tsx:94` "Baixar manual" | raw contorno | `secondary/neutral md` |
| `DriverDetailPage.tsx:290` "Ver downloads" | raw `bg-primary`, hover scale | `primary/neutral md` |
| `DriverDetailPage.tsx:309` "Página do Produto" | raw contorno | `secondary/neutral md` |
| `DriverDetailPage.tsx:149` "Voltar para Drivers" | raw `bg-primary`, hover scale | `secondary/neutral md` |
| `DriversManuaisPage.tsx:297` "Limpar filtros" | raw fundo suave | `tertiary/neutral md` |
| `MontarPage.tsx:1013` "Levar o kit" | raw `--buy-green`, hover opacidade | `primary/buy lg block` |
| `MontarPage.tsx:356`, `:787` "Continuar"/"Revisar" | raw `bg-foreground`, **hover NADA** | `primary/neutral md block` |
| `MontarPage.tsx:797` "Pular esta etapa" | raw, hover cor | `ghost/neutral md block` |
| `AjudaPage.tsx:178` "Continuar" | raw `bg-foreground`, **hover NADA** | `primary/neutral lg block` |
| `AjudaPage.tsx:746` "Ver o kit" | raw `bg-foreground`, hover opacidade | `primary/neutral md` |
| `AjudaPage.tsx:789` "Falar com um músico" | raw contorno | `secondary/neutral md` |
| `MonteSeuKit.tsx:255` "Adicionar kit" | raw `--primary`, **hover NADA** | `primary/buy md` |
| `GuiaIniciante.tsx:57` "Ver violões para começar" | `--primary`, hover translate | `primary/neutral md` |
| `Newsletter.tsx:141`, `:173` "Assinar" | raw `--primary`, **hover NADA** | `primary/neutral md` |
| `CookieConsent.tsx:58` "Aceitar" | raw `bg-primary`, hover brilho | `primary/neutral sm` |
| `CookieConsent.tsx:54` "Rejeitar" | raw contorno | `ghost/neutral sm` |
| `StoryBand.tsx:90` "Conheça a história" | `--primary`, hover translate | `secondary/brand md` |
| `QuemSomosPage.tsx:325` "Escrever a minha" | `--primary`, hover translate | `secondary/brand md` |
| `MonteSeuPcPage.tsx` (6× `bg-primary`) | hover brilho | `primary/neutral md` |
| `MonteSeuPcPage.tsx` (3× `--gradient-buy`) | hover scale | `primary/buy lg` |
| `BannerShelf.tsx:133`, `ProductShelf.tsx:361` | `GhostButton as="span"` | `secondary/neutral onDark` — ver §12 |
| `MusicosTonante.tsx:272` "Comprar agora" | `#fff` c/ hover por state JS | `primary/buy md` |
| `LinhasDeViolao.tsx:86` "Conhecer a linha" | `#fff`, **hover NADA** | `secondary/neutral md onDark` |
| `Video70Anos.tsx:159` "Ver coleção" | `#fff` c/ hover por state JS | `secondary/neutral lg onDark` |
| `HeaderV2.tsx:448` "Entrar" | raw `--ink-strong`, hover opacidade | `primary/neutral md block` |
| `HeaderV2.tsx:455` "Criar conta" | raw contorno | `secondary/neutral md block` |
| `MobileMenu.tsx:188`, `:195` "Entrar"/"Criar conta" | raw, **hover NADA** | `primary/neutral`, `secondary/neutral md` |
| `WelcomePopup.tsx:217` "Cadastrar" | `#111` quadrado 42px, hover scale | `primary/neutral md` ícone |

### Fora de escopo (não migrar)

- `/legado` — `Navbar`, `AnnouncementBar`, `HomePage`, `HeroSection`,
  `CategoryShowcase`, `OfertasDaSemana`. Rota preservada, não é caminho vivo.
- Código morto — `GuiaPage`, `BannerSection`, `PopularGrid`, `RealMusicians`
  (nenhum import), `Navbar.tsx:1051`.
- `public/pages/*.html` — vermelho pcyes (`#ff2b2e`, `#dc1414`, `#ff0004`).
  São HTML injetado com cascata própria; merecem rodada separada.
- `SearchModal.tsx` — mock de periféricos gamer, sobra do clone pcyes.

## 12. Dois defeitos estruturais a corrigir na migração

**`GhostButton as="span"`** em `BannerShelf.tsx:133` e `ProductShelf.tsx:361`:
o `span` herda `focus-visible:ring` mas não recebe foco. O anel está no
elemento errado. O `<Link>` pai é que deve carregar o foco; o novo `Button`
ganha `asChild`-like via prop `as="span"` que **remove** as classes de foco.

**34 `outline-none` sem substituto** — lista completa via
`grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible`.
Cada um vira `focus-visible:outline-2 focus-visible:outline-[var(--ring)]`
ou perde o `outline-none`.

## 13. Critério de pronto

- Nenhum botão de ação sem hover e pressed de **cor**.
- `grep -rn "bg-primary\|var(--gradient-brand)"` não retorna botão.
- `grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible`
  retorna 0.
- `.btn-tonante`, `primaryButtonClass`, `CTAButton`, `GhostButton`,
  `QuickAddButton` sem consumidores.
- Alturas de botão de ação: só 36/44/52. Raio de botão de ação: só pílula.
- `npm run typecheck` e `npm run build` limpos.
