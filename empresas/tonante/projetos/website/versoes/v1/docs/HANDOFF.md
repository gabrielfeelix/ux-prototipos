# Handoff — Tonante, frente MOBILE

Estado em 2026-09-17. Branch `tonante/website-v1`, projeto em
`~/dev/ux-prototipos/empresas/tonante/projetos/website/versoes/v1`.

**Este handoff é só sobre celular.** O handoff anterior (15/09), com header,
card v2, cor, tipografia, vídeos dos músicos e catálogo, está em
`git show 13a65aee:./docs/HANDOFF.md` (o repo é um monorepo: o `./` importa) e continua valendo para tudo que não
estiver aqui. `docs/STATE.md` é o complemento obrigatório: ele tem o registro
detalhado da rodada mobile.

**O site é protótipo e não vai ao ar.** Placeholder (WhatsApp, depoimento de
músico, flag de estoque, arte de banco de imagem) não é pendência e não deve
ser listado como risco. Decisão do Gabriel, 15/09.

---

## 1. O próximo trabalho: o checkout no celular

Pedido do Gabriel, 17/09, com as palavras dele preservadas onde importam.

> "no mobile esse resumo no checkout, depois que eu já passei da cartpage, não
> faz sentido. A gente já tem aquele footer ali com o preço e valor justamente
> pra isso. O que poderíamos ter é ali um **ver detalhes**, e clicando abre de
> baixo pra cima os detalhes — a imagem dos produtos, cupons, etc. Mas sem
> ficar aparente ali as coisas na tela, assim a pessoa se foca só no que ela
> está ali pra fazer naquela etapa. Aí ela pode ver detalhes ou ver menos, pra
> voltar pro padrão. A única coisa que acho bom é colocar ali **usar cupom** e
> **usar Ton Points**, nesse footer fixo, algo pequeno igual tem na sidebar do
> mobile, algo sutil, uma linha. E só clicando é que abre."

### O que isso quer dizer, em termos do código

Hoje, no celular, a página de checkout mostra **duas vezes** a mesma
informação: o card "Resumo" (`CheckoutPage.tsx:1665` em diante — lista de itens
com foto, cupom, Ton Points, linhas de valor e total) empilha logo abaixo do
formulário da etapa, e a barra fixa do rodapé (`CheckoutPage.tsx:1921`) já
carrega TOTAL + CTA da etapa. O card é `lg:sticky` porque no desktop ele é a
coluna da direita; no celular ele só vira mais uma tela de rolagem depois do
que a pessoa veio fazer.

O alvo:

1. **O card "Resumo" some da rolagem no celular** (fica `hidden lg:block`, ou o
   equivalente). No desktop nada muda — aquela coluna está validada.
2. **A barra fixa ganha "Ver detalhes"**, que abre uma folha de baixo para
   cima (bottom sheet) com o conteúdo do resumo: fotos dos produtos,
   quantidades, frete, descontos e total. Fechando, volta ao padrão — o Gabriel
   chamou de "ver menos".
3. **Cupom e Ton Points viram duas linhas sutis na própria barra fixa**, no
   modelo do que já existe na sidebar do carrinho no celular (ver
   `CartDrawer.tsx`, é a referência visual que ele citou). Uma linha cada, sem
   campo aberto: **só abre ao tocar**.

### O que já existe e deve ser reaproveitado, não reescrito

| peça | onde |
|---|---|
| card Resumo completo (itens, cupom, Ton Points, linhas, total) | `CheckoutPage.tsx:1665`–`~1900` |
| cupom inline, com estado e validação (`setCouponError`, `appliedCoupon`) | `CheckoutPage.tsx:435`, `:1725` |
| Ton Points, com input e limite | `CheckoutPage.tsx:1792` |
| barra fixa do celular (TOTAL + Continuar/Finalizar) | `CheckoutPage.tsx:1921` |
| linha sutil de cupom/pontos como referência visual | `CartDrawer.tsx` |
| botão da casa (verde `--buy-green`, texto branco) | `section/CTAButton.tsx` |

### Armadilhas conhecidas nessa área

- **A barra fixa do checkout está em z-40.** O banner de cookies (z-80) e o
  botão de WhatsApp (z-90) passam por cima dela. Ao mexer nela, siga a tabela
  de z-index da seção 3 — e a folha de detalhes precisa ficar **acima de 90**,
  senão o cookie cobre o botão de fechar.
- **`--fab-lift`** já existe para levantar WhatsApp e cookies quando uma barra
  sobe no pé da tela (hoje só a PDP a usa). A barra do checkout deveria passar
  a usar a mesma variável.
- **Campo de formulário no celular** já tem regra central no `theme.css`
  (`.checkout-field` etc.: `min-height: 44px; font-size: 16px !important`).
  Abaixo de 16px o iOS dá zoom ao focar. Campo novo tem que entrar nessa lista.

---

## 2. O que esta rodada já entregou (não refazer)

Commits `83c4ce0c` → `216b6a21`. Todos com o "porquê" na mensagem — leia
`git log` antes de mexer em qualquer um desses arquivos.

- **`83c4ce0c` — menu e busca no celular.** `HeaderV2` não tinha nenhum menu:
  busca, conta, favoritos e ajuda eram `hidden` sem substituto. Nasceu
  `v2/MobileMenu.tsx` (gaveta com drill-down categoria → tipo/marca, linhas de
  56px) e a busca virou campo aberto na 2ª linha do header, variante `compact`
  da `SearchBar` (sem o seletor de categoria, input de 16px). A faixa preta de
  avisos colapsa ao rolar: header fixo 164px → 120px.
- **`b782ad4c` — PDP.** Foto primeiro, timbre depois do preço, descrição
  colapsada em 760px, stepper a 44px. A barra fixa de compra **existia e nunca
  ligava** (`setShowMobileStickyCta` não era chamado por ninguém) e no tema
  claro saía #111 sobre #111. 11.127px → 8.836px.
- **`2506913a` — listagem.** Barra de Filtros/Ordenar grudada abaixo do header
  via `--header-h`; comparar, "mostrar N" e grade/lista só no desktop;
  paginação numerada virou "Carregar mais".
- **`5bc9c337` — home e rodapé.** Banner reenquadrado (46svh, âncora 16%),
  `.touch-visivel` para os controles que só existiam no hover, rodapé em
  `<details>`. Home 14.326px → 13.288px.
- **`7e3d1711`, `0fe21854`, `216b6a21` — acertos.** Gaveta fechada sai do
  alcance do Tab; barra de compra passa a usar `CTAButton` (o verde certo é
  `--buy-green`, `rgb(27,184,99)`, **não** `--gradient-buy`) e recolhe com o
  carrinho aberto; `pt-[80px]` fantasma some do topo do carrinho e do checkout.

---

## 3. Contratos que o celular passou a ter

**Empilhamento no pé da tela.** Três coisas disputam o mesmo canto:

| z | quem |
|---|---|
| 40 | barra fixa do checkout (**ainda baixa demais, ver seção 1**) |
| 61 | `CartDrawer` |
| 75 | barra de compra da PDP |
| 80 | banner de cookies |
| 90 | botão de WhatsApp |
| 95 / 96 | gaveta de menu · gaveta de filtros |

Gaveta ou folha nova tem que passar de 90.

**Variáveis de CSS que uma parte da tela publica para a outra:**

- `--header-h` — altura que o `HeaderV2` tem **agora** (ele encolhe ao rolar),
  atualizada por `ResizeObserver`. Quem gruda abaixo do header usa isso.
- `--fab-lift` — quanto o WhatsApp e o banner de cookies precisam subir porque
  alguma barra ocupou o pé da tela.

**Utilitárias do `theme.css`, todas dentro de media query para não existirem no
desktop:**

- `.pdp-desc-clamp` / `.is-open` — descrição da PDP em `max-width: 1023px`.
- `.touch-visivel` — em `@media (hover: none)`, mostra o que só aparecia no
  hover.
- `.touch-sobe` — o par da anterior: abre o espaço de quem sobe no hover. As
  duas andam juntas; usar uma sem a outra foi exatamente o bug que empilhou o
  botão de compra em cima do preço no card do músico.
- `.footer-col` — colunas do rodapé como sanfona abaixo de 768px.

---

## 4. Como medir (não confie no olho)

Não há navegador de UI aqui. O que funciona:

- Servidor: `npx vite --port 5199 --strictPort` na raiz do projeto.
- Chrome: `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` com
  `LD_LIBRARY_PATH=~/.cache/chromelibs/extract/usr/lib/x86_64-linux-gnu`
  (as libs `libnss3`/`libnspr4`/`libasound2t64` foram extraídas ali sem root).
  Subir com `--headless=new --remote-debugging-port=NNNN --no-sandbox
  --hide-scrollbars --window-size=390,844` e falar CDP puro pelo WebSocket do
  Node 24.
- Antes de navegar: `Page.bringToFront` + `Emulation.setFocusEmulationEnabled`,
  senão `motion/react` fica parado no `initial` e o print sai branco.
- Para medir celular de verdade: `Emulation.setDeviceMetricsOverride`
  `{width:390,height:844,deviceScaleFactor:2,mobile:true}` +
  `Emulation.setTouchEmulationEnabled`. Com toque emulado, `@media (hover:none)`
  entra — que é o ponto.
- **Espere ~7s depois do `Page.navigate`**: com HMR ligado o app às vezes
  mostra a tela de "CARREGANDO…" e a medição sai zerada.
- Diagnóstico barato, sem gastar imagem: rodar `Runtime.evaluate` medindo
  `document.documentElement.scrollWidth` (tem que dar 390 em toda rota),
  `getBoundingClientRect()` dos blocos e `getComputedStyle` dos botões. Foi
  assim que apareceram o verde errado e a barra que nunca ligava.

## 5. Como o Gabriel trabalha

- Ele pede, você faz e **mostra print**. Não monte lista de specs para aprovar.
- Em dúvida entre duas soluções, escolha a recomendada e siga; ele corrige
  depois se não for.
- **Nunca use travessão em texto de interface** (só em comentário de código).
- Voz das respostas: seca, sem floreio. Commits e código, português normal e
  completo, sempre explicando o porquê.
