# Handoff — Tonante, frente SISTEMA DE BOTÕES

Estado em 2026-09-21. Branch `tonante/website-v1`, projeto em
`~/dev/ux-prototipos/empresas/tonante/projetos/website/versoes/v1`.

**Este handoff é só sobre botões.** O handoff anterior (17/09, frente mobile)
está em `git show 2ad5d96e:./docs/HANDOFF.md` (o repo é um monorepo: o `./`
importa) e continua valendo para tudo que não estiver aqui. `docs/STATE.md`
complementa.

**O site é protótipo e não vai ao ar.** Placeholder (WhatsApp, depoimento de
músico, flag de estoque, arte de banco de imagem) não é pendência e não deve
ser listado como risco. Decisão do Gabriel, 15/09.

**Atenção: outra sessão está commitando nesta mesma branch.** Durante a
sessão de 21/09 entraram `21285b6f`, `e946767f` e `1e4691cc` vindos de fora.
Rode `git log --oneline -5` e `git status` antes de encostar em qualquer
arquivo.

---

## 1. De onde veio este trabalho

Gabriel pediu, em 21/09, uma varredura de todos os botões do site. A pergunta
que abriu tudo: *"pq o botão de drivers e manuais é um marrom, e nao preto? e
pq n tem hover ali? e onde usariamos esse botão que parece ser um de
marketing/branding?"*

A varredura cobriu home, PDP, catálogo, carrinho, checkout, perfil, auth,
institucionais, ferramentas e as páginas HTML injetadas. Achados:

- **445 `<button>` crus.** O DS existe e quase ninguém chama: `CTAButton` em 9
  arquivos, `GhostButton` em 3, `ui/button` do shadcn em 2.
- **4 sistemas paralelos** pintando a ação principal com a mesma tinta
  `--ink-strong` e animando o hover de três jeitos diferentes: cor `#2b2b2b`
  (`CTAButton`, `.btn-tonante`), `opacity-90` (`auth/styles.ts`), e escala.
- **6 alturas** (h-8 38×, h-9 76×, h-10 55×, h-11 106×, h-12 45×, h-14 18×) e
  **13 raios**.
- **7 tintas de ação.** Só o verde sólido `--buy-green` tem os três estados.
- **34 `outline-none`** sem foco substituto, matando o anel global do
  `theme.css:557`.

Gabriel aprovou a proposta de refazer o sistema em dois eixos e pediu plano e
mapa antes de executar. É o que está escrito.

## 2. O que ler, nesta ordem

1. `docs/superpowers/specs/2026-09-21-sistema-de-botoes-design.md` — o spec.
   Taxonomia, matriz do que é permitido, rampas de cor com contraste medido, e
   o **mapeamento arquivo a arquivo** de cada botão para o alvo novo (§11).
2. `docs/superpowers/plans/2026-09-21-sistema-de-botoes.md` — o plano, com as
   **9 tasks escritas**. Task 1 tokens, Task 2 o `Button.tsx` com código
   completo, Task 3 showcase, Tasks 4 a 7 as quatro ondas de migração em ordem
   de prioridade, Task 8 foco de teclado, Task 9 limpeza e `DECISIONS.md`.

O plano está pronto para executar. Comece pela Task 1 e siga em ordem: cada
task depende da anterior.

## 3. As decisões de design que já estão tomadas

Não reabrir sem falar com o Gabriel:

- **Dois eixos:** `hierarchy` (primary/secondary/tertiary/ghost) × `intent`
  (neutral/buy/danger/brand). O `variant` antigo misturava os dois, e é por
  isso que tudo que não era o CTA principal virava `<button>` cru.
- **Âmbar nunca preenche botão.** `#C87800` chapado lê marrom em área grande.
  `brand` só existe como `secondary`: borda âmbar `#C87800`, texto `#965a00`
  (o âmbar puro dá 3.42:1 e reprova como texto). Já havia dois comentários no
  repo com esse mesmo diagnóstico, em `CTAButton.tsx:48` e `theme.css:906`,
  aplicados só em duas telas.
- **Verde só é primário.** Mata os cinco desenhos de "Comprar" que existem.
- **`preorder` sai como intent.** `#e08c12` dá 2.65:1 com texto branco;
  escurecer até passar em 3:1 dá exatamente o âmbar da marca. Pré-venda vira
  estado do produto: botão é `primary/buy` com rótulo "Reservar" e a cor da
  campanha fica no `PreOrderPill` ao lado.
- **`buy` fica como está**, com 2.60:1 no repouso. É decisão registrada do
  Gabriel em `theme.css:140`. Não reabrir.
- **Cor sólida, nunca gradiente.** Gradiente não transiciona: é a causa raiz
  de todo hover morto do site.
- **Controles ficam fora.** `CarouselNavButton`, `QtyStepper`, chips de
  filtro, abas, swatches, dots e steps de checkout são seleção, não ação.
  Merecem um `Chip`/`Toggle` próprio numa rodada futura.

## 4. Ordem de execução

Cada task termina com `npm run typecheck`, `npm run build`, conferência visual
e commit — não existe framework de teste neste repo, e essa é a convenção dos
planos anteriores.

A ordem das ondas de migração (Tasks 4 a 7) é por impacto, não por facilidade:
carrinho e checkout primeiro porque é onde a inconsistência custa conversão;
drivers, que foi a pergunta que abriu a frente, só na Task 7 porque depende do
primitivo estar rodado nas telas de maior tráfego antes.

Os números de linha no plano e no spec são do estado de 21/09 e **vão andar**
conforme a edição avança. Conferir pelo rótulo do botão, nunca pela linha.

**Um detalhe que atrapalha se passar batido:** ao trocar um botão, apagar
também o `className` de altura, raio, sombra e hover que sobrava. Se ficar
`h-12` ou `rounded-[10px]` no `className`, o `tailwind-merge` deixa vencer e o
tamanho do primitivo é ignorado silenciosamente.

## 5. Armadilhas técnicas descobertas nesta rodada

- **Tailwind v4 e o foco.** `outline-none` emite `outline-style: none` na
  camada `utilities`, que vence `@layer base` por **ordem de cascata**, não por
  especificidade. O anel global do `theme.css:557-571` morre sob qualquer um
  deles. Por isso o `Button` novo declara o foco na própria classe.
- **`as="span"` não dispara `:hover`.** Quem passa o mouse é o `<Link>` pai.
  O `GhostButton` atual tem esse bug: o botão fica inerte dentro de um banner
  que reage. O `Button` do plano resolve com uma variante `spanHover` que
  reemite os estados como `group-hover:`/`group-active:` — o consumidor
  precisa ter `group` no `<Link>` que envolve.
- **`tailwind-merge` não distingue `text-*` de cor e de tamanho.** Já está
  documentado no `CTAButton.tsx:24`: usar `[color:#fff]`, nunca `text-[#fff]`,
  ou o `text-[var(--text-sm)]` do size engole a cor.
- **Tema travado em claro.** `ThemeProvider.tsx:35` sempre remove `dark` e
  adiciona `light`. Não existe token set escuro; `html.light
  [data-page-light-scope]` no `theme.css:681` é só para as páginas HTML
  injetadas. Contexto sobre foto/stage é a prop `onDark`.

## 6. O que não migrar

- **`/legado`** — `Navbar`, `AnnouncementBar`, `HomePage`, `HeroSection`,
  `CategoryShowcase`, `OfertasDaSemana`. A home viva é `HomeV2`
  (`routes.tsx:42`); `RootLayout.tsx:48` só monta `Navbar` em `/legado`.
- **Código morto** — `GuiaPage`, `BannerSection`, `PopularGrid`,
  `RealMusicians` não são importados por ninguém. `Navbar.tsx:1051` idem.
- **`public/pages/*.html`** — ainda usam o vermelho pcyes (`#ff2b2e`,
  `#dc1414`, `#ff0004`) e não referenciam os tokens de `shared-tokens.css`.
  Cascata própria, com o `unified-overrides.css` por cima. Rodada separada.
- **`SearchModal.tsx`** — dados mock de periféricos gamer, sobra do clone
  pcyes.

## 7. Como o Gabriel trabalha

- Ele pede, você faz e mostra print. Não peça spec pra aprovar.
- Terso por padrão. Sem travessão em copy de interface.
- Opus na thread principal para qualquer coisa de julgamento visual. Sonnet
  só para varredura mecânica.
- Deploy da Tonante sai só pelo CLI da Vercel; push no GitHub não publica.
