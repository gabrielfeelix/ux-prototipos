# Handoff — Tonante, frente SISTEMA DE BOTÕES

Estado em 2026-09-21, fim do dia. Branch `tonante/website-v1`, projeto em
`~/dev/ux-prototipos/empresas/tonante/projetos/website/versoes/v1`.

**Este handoff é só sobre botões.** A frente de performance e layout mobile
tem o handoff dela em `docs/HANDOFF-pdp-mobile.md`. O handoff de 17/09 está em
`git show 2ad5d96e:./docs/HANDOFF.md` (o repo é um monorepo: o `./` importa).
`docs/STATE.md` complementa.

**O site é protótipo e não vai ao ar.** Placeholder (WhatsApp, depoimento de
músico, flag de estoque, arte de banco de imagem) não é pendência e não deve
ser listado como risco. Decisão do Gabriel, 15/09.

**Atenção: outra sessão commita nesta mesma branch, ao vivo.** Em 21/09
entraram dela `21285b6f`, `e946767f`, `1e4691cc`, `71d16662`, `35ce14a6`,
`bab9c2f1`, `f6f95eb3`, `93c6243b`, `6856bd42`, `7c47e022` e `923f0f99` — uma
delas carregou junto uma alteração minha em `ProductPage.tsx`. Rode
`git log --oneline -8` e `git status` antes de encostar em qualquer arquivo, e
commite em lotes pequenos.

---

## 1. Onde a frente está

**Tasks 1, 2 e 3 do plano estão feitas e commitadas.** A Task 4 é a próxima.

| commit | o que entrou |
|---|---|
| `3f9090c9` | Task 1 — 16 tokens de rampa de cor no `theme.css:149-180`, mais 4 republicados no `@theme` (`:424-429`) |
| `b10a77dd` | Task 2 — `src/app/components/section/Button.tsx`, o primitivo |
| `79c31718` | dois defeitos do `Button` achados na conferência (ver §3) |
| `d8a27b51` | Task 3 — showcase em `/ds/botoes` |
| `0714a343` | escala de rótulo um degrau acima + card mobile para `lg` |
| `0764586c` | todos os outros botões de compra do site em 52/16 |

Nenhum consumidor usa o `Button` novo ainda, fora o showcase. A migração de
verdade começa na Task 4.

## 2. O que ler, nesta ordem

1. `docs/superpowers/specs/2026-09-21-sistema-de-botoes-design.md` — o spec.
   Taxonomia, matriz do que é permitido, contraste medido, e o mapeamento
   arquivo a arquivo de cada botão para o alvo novo (§11).
2. `docs/superpowers/plans/2026-09-21-sistema-de-botoes.md` — o plano, com as
   9 tasks escritas. **Comece pela Task 4.**
3. `http://localhost:5174/ds/botoes` (`npm run dev`) — o showcase. É a
   superfície de conferência de tudo que vem depois.

## 3. Decisões tomadas. Não reabrir sem falar com o Gabriel

As do spec continuam valendo todas (dois eixos, âmbar nunca preenche, verde só
é primário, `preorder` morto como intent, `buy` mantido em 2.60:1, cor sólida
nunca gradiente, controles fora). O que **mudou ou nasceu depois** que o spec
foi escrito:

- **Escala de rótulo um degrau acima: 13 / 15 / 16px** para `sm` / `md` / `lg`.
  As alturas ficam em 36 / 44 / 52. Motivo medido: o rótulo estava em 14px,
  menor que o nome do produto (16px) e muito abaixo do preço (20px) — a ação
  era o texto mais fraco do card. 44px é o piso de toque da Apple e fica abaixo
  dos 48dp do Material: é a medida de um botão de fechar. Spec §7 atualizado.
- **Comprar em card é `lg`, nunca `md`.** Vale para `ProductCard`,
  `ProductCardV2`, lista do catálogo e `QuickAddButton`. O critério de pronto
  do spec (§13) agora exige isso.
- **A comparação 44 / 48 / 52 está registrada no showcase**, com o porquê da
  escolha, para não se reabrir daqui a três meses.
- **Carregando não é desabilitado.** O rótulo continua ocupando o lugar,
  invisível, e o spinner entra por cima (largura não pula); e as cores de
  `disabled` só valem quando `loading` é falso, senão o spinner some no cinza.
- **Sobre fundo escuro, a intenção deixa de pintar** da segunda linha para
  baixo: `secondary`, `tertiary` e `ghost` com `onDark` são sempre translúcidos
  brancos, seja qual for o `intent`. Só `primary` continua dizendo a intenção
  no escuro. Não estava no spec; é consequência dos compounds e o Gabriel viu
  no print e aprovou.

## 4. O que já foi ajustado fora do plano (e por quê)

Na conferência de tamanho, os botões de compra foram redimensionados **antes**
da migração, porque o Gabriel pediu o ajuste ao ver o print do celular. Todos
em 52px / 16px: `ProductCard`, `ProductCardV2` (mobile e o que flutua no
hover), lista do catálogo em mobile e desktop, quick view, `ComparePage`,
`CartDrawer`, `CartPage` desktop, `QuickAddButton`, `MontarPage`,
`MonteSeuKit`, `MusicosTonante`, `PreOrderBanner`, `PreOrderPage` e o sticky
mobile da PDP.

Duas consequências para quem migrar:

- **O `CTAButton` velho também foi alinhado** à escala nova (36/13, 44/15,
  52/16). Ele ainda pinta a PDP e os 11 botões do checkout até a migração
  chegar lá.
- **Nas Tasks 4 e 5, o tamanho desses botões já está certo.** Trocar o
  `<button>` cru pelo primitivo, sem mexer em altura nem em fonte.

O `QuickAddButton` vinha com `--radius-button` (raio reto), que no sistema novo
é forma de controle e não de ação; virou pílula.

## 5. Armadilhas técnicas

- **Tailwind v4 e o foco.** `outline-none` emite `outline-style: none` na
  camada `utilities`, que vence `@layer base` por **ordem de cascata**, não por
  especificidade. O anel global do `theme.css:557-571` morre sob qualquer um
  deles. Por isso o `Button` declara o foco na própria classe.
- **`tailwind-merge` não distingue `text-*` de cor e de tamanho.** Usar
  `[color:#fff]`, nunca `text-[#fff]`. Verificado na mão: `twMerge` preserva
  `[color:#fff]` ao lado de `text-[15px]`, e um `h-12` sobrando no `className`
  **vence** o `h-11` do primitivo silenciosamente. Ao trocar um botão, apagar
  também o `className` de altura, raio, sombra e hover que sobrava.
- **`as="span"` não dispara `:hover`.** Quem passa o mouse é o `<Link>` pai. O
  `Button` resolve com `group-hover:`/`group-active:`, e **o consumidor precisa
  ter `group` no `<Link>` que envolve** — sem isso o botão fica inerte. Os dois
  cartões no fim do showcase demonstram com e sem.
- **Tema travado em claro** (`ThemeProvider.tsx:35`). Contexto sobre foto ou
  palco é a prop `onDark`.
- **`npm run typecheck` NÃO está limpo, e não é desta frente.** 6 erros em
  `vite.config.ts:29-33` (`item.code` e `item.source` sobre `unknown`), vindos
  do commit `21285b6f` da outra sessão. O critério "typecheck limpo" das tasks
  deve ser lido como "zero erros fora do `vite.config.ts`":
  `npm run typecheck 2>&1 | grep 'error TS' | grep -v vite.config`.

## 6. Como conferir em tela (não existe framework de teste)

`npm run dev` sobe em `localhost:5174` (a 5173 costuma estar ocupada pela outra
sessão). Não há Playwright instalado nem Chrome headless de Linux no WSL; o que
funciona é o Chrome do Windows em headless:

```bash
CH="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CH" --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=9000 --window-size=390,1600 \
  --screenshot="C:\\Users\\Public\\tela.png" "http://localhost:5174/produtos"
cp /mnt/c/Users/Public/tela.png "$SCRATCHPAD/tela.png"
```

O `--virtual-time-budget` é obrigatório: sem ele a captura pega a tela de
abertura do site. Para recortar um pedaço, PIL está disponível no `python3`.

## 7. O que falta: Tasks 4 a 9

Em ordem, cada uma terminando em typecheck, build, conferência visual e commit:

- **Task 4 — carrinho e checkout.** O carrinho tem 4 botões no
  `--gradient-brand` e dois "Finalizar compra" diferentes (`:1003` e `:1221`).
- **Task 5 — PDP e catálogo.** Os cinco "Comprar" e o "Adicionar à sacola".
- **Task 6 — perfil, auth e modais.** Mata `.btn-tonante` e
  `primaryButtonClass`.
- **Task 7 — institucional e ferramentas.** Aqui entra drivers, que foi a
  pergunta que abriu a frente, e morrem `CTAButton` e `GhostButton`.
- **Task 8 — foco de teclado.** A varredura dá **39** hoje (eram 34 quando o
  spec foi escrito; a outra sessão subiu o número). Rodar de novo antes de
  começar: `grep -rn "outline-none" --include=*.tsx src/app | grep -v focus-visible`.
- **Task 9 — limpeza**, `DECISIONS.md` (ainda não existe) e `STATE.md`.

Hoje 15 arquivos ainda importam `CTAButton`, `GhostButton` ou
`QuickAddButton`. O número tem que chegar a zero na Task 9.

## 8. O que não migrar

- **`/legado`** — `Navbar`, `AnnouncementBar`, `HomePage`, `HeroSection`,
  `CategoryShowcase`, `OfertasDaSemana`. A home viva é `HomeV2`.
- **Código morto** — `GuiaPage`, `BannerSection`, `PopularGrid`,
  `RealMusicians`, `Navbar.tsx:1051` e **`MonteSeuPcPage`** (ninguém importa;
  tem 3 botões de compra e 6 `bg-primary`, e por isso aparece no spec — a Task
  7 decide entre migrar ou deletar).
- **`public/pages/*.html`** — vermelho pcyes, cascata própria, rodada separada.
- **`SearchModal.tsx`** — mock de periféricos gamer, sobra do clone pcyes.

## 9. Como o Gabriel trabalha

- Ele pede, você faz e mostra print. Não peça spec pra aprovar.
- Terso por padrão. Sem travessão em copy de interface.
- Quando ele diz "pode ser impressão, não sei a boa prática", ele quer o número
  medido e uma recomendação, não um menu de opções.
- Opus na thread principal para qualquer coisa de julgamento visual.
- Deploy da Tonante sai só pelo CLI da Vercel; push no GitHub não publica.
