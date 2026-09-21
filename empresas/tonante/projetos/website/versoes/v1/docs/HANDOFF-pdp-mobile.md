# Handoff — Tonante, frente PERFORMANCE E LAYOUT MOBILE

Estado em 2026-09-21. Branch `tonante/website-v1`, projeto em
`~/dev/ux-prototipos/empresas/tonante/projetos/website/versoes/v1`.

**Esta frente não é a dos botões.** `docs/HANDOFF.md` é outro assunto, escrito
por outra sessão que continua commitando nesta mesma branch. Rode
`git log --oneline -8` e `git status` antes de encostar em qualquer arquivo —
os dois lados mexem em `src/app/components/ProductPage.tsx`.

**O site é protótipo.** Placeholder (WhatsApp, depoimento, flag de estoque)
não é pendência. Decisão do Gabriel, 15/09.

---

## Tarefa aberta (é por aqui que o Gabriel quer continuar)

**O esqueleto de rota mente sobre a PDP.** `EsqueletoPagina`
(`src/app/components/Esqueletos.tsx`) desenha título + duas linhas de texto +
uma grade de 8 cards quadrados. Isso descreve o catálogo, não a página de
produto: a PDP abre com uma foto grande única, ficha à esquerda e bloco de
preço, e nada de grade. Quem abre um produto vê vários cards piscando e
depois um layout completamente diferente — o esqueleto promete a página
errada.

O esqueleto é o `fallback` de `<Suspense>` em `src/app/routes.tsx`, hoje o
mesmo para todas as rotas preguiçosas (ver a função `carregar`).

Caminhos possíveis, não decididos:

- um `EsqueletoPDP` com a forma real (foto quadrada grande, três linhas de
  ficha, bloco de preço) e `carregar()` aceitando qual esqueleto usar;
- esqueletos por família de rota (catálogo, produto, institucional) em vez de
  um genérico;
- um esqueleto neutro que não afirme grade nenhuma.

Gabriel ainda não escolheu. Pergunte antes de implementar — ele reparou no
problema, não pediu uma solução específica.

Vale checar se o mesmo descompasso existe em outras rotas: checkout, perfil,
carrinho e afinador também caem no esqueleto de grade.

---

## O que entrou nesta sessão

Do mais antigo para o mais novo. Todos já em `origin/tonante/website-v1`.

| commit | o quê |
|---|---|
| `21285b6f` | home abre em 3 MB em vez de 34; esqueletos; code splitting |
| `e946767f` | título de Drivers/legais parava de flutuar longe do header |
| `1e4691cc` | tela de abertura volta no F5; `fetchpriority` minúsculo |
| `f6f95eb3` | busca do celular entra no headroom e deixa uma lupa |
| `bab9c2f1` | some a fresta entre header e barra de filtros |
| `35ce14a6` | logo do celular para de deslizar quando a lupa entra |
| `71d16662` | saem 34 MB de PNG que o WebP substituiu |
| `93c6243b` | PDP: vão vazio entre ficha e preço |
| `6856bd42` | PDP: ouvir o instrumento passa a vir antes do preço |
| `7c47e022` | PDP: seções de baixo param de usar respiro de desktop |

### Performance da home — números medidos

Build de produção, headless a 1440px, cache desligado:

| | antes | depois |
|---|---|---|
| requisições | 245 | 87 |
| bytes | 34.940 KB | 3.021 KB |
| first contentful paint | 1672 ms | 1040 ms |
| bundle inicial | 2,37 MB num arquivo | 4 chunks + 1 por rota |

As três causas, em ordem de peso:

1. **`BootLoader` esperava `window.load`**, que só dispara quando a última
   imagem termina. Com 234 imagens pedidas de uma vez ele nunca chegava
   dentro do teto, o teto de 6 s estourava, e a pessoa via 6 segundos de
   "CARREGANDO…" sobre uma página que já estava pronta por baixo. Hoje ele
   não espera imagem nenhuma (`src/app/components/LoadingScreen.tsx`).
2. **`ProductCardV2` baixava até 4 fotos por card no mount** só para medir
   proporção — ~190 downloads. Pior: pedia a versão sem `/cache/` do Magento
   achando que a outra era miniatura de 300x300. **Não é**: as duas são
   1200x1200, muda só a compressão (60 KB contra 111 KB). Agora mede a mesma
   URL que exibe e só quando o card chega perto da dobra
   (`src/app/lib/usePertoDaTela.ts`).
3. **Arte em PNG**: banners 9,1 MB → 588 KB, categorias 16 MB → 318 KB,
   encordoamentos 7,4 MB → 392 KB. Tudo WebP, com versão de 960px no hero
   para celular. Os PNGs originais foram removidos do repositório em
   `71d16662`.

### Sobre os esqueletos (o que já existe e por quê)

- A pintura é a classe `.tn-skel` em `src/styles/theme.css`, aplicada como
  **fundo do próprio `<img>`**, nunca como um `<div>` irmão: os cards
  posicionam a foto com `absolute inset-0` e blend `multiply`, e um nó a mais
  desfaria esses enquadramentos um por um.
- `ImageWithFallback` guarda num `Set` o que já pintou nesta aba e checa
  `img.complete` num ref callback antes do primeiro paint. Por isso **o
  esqueleto não aparece em tela já visitada nem em cache de segunda visita** —
  foi pedido explícito do Gabriel ("não é pra ficar aparecendo sem
  necessidade"). Se for testar e não vir esqueleto nenhum, marque "Disable
  cache" no DevTools antes de concluir que está quebrado.
- **Esqueleto só onde existe espera real.** O catálogo é local e síncrono
  (`productsData.ts` é import estático), então um esqueleto de vitrine
  renderiza por zero milissegundo e só pisca. O que espera é imagem remota e
  chunk de rota.

---

## Pendência: o deploy não saiu

Nada desta sessão está no ar. **Push no GitHub não publica o site da Tonante**
— só o CLI da Vercel publica.

A permissão já está resolvida: `.claude/settings.local.json` na raiz do
monorepo tem `Bash(npx vercel:*)` e `Bash(vercel:*)` no allow, e o arquivo foi
posto no `.gitignore`.

O que falta é autenticação, e é coisa do Gabriel: `vercel whoami` responde
`gabfeelix1-7902`, e `vercel teams ls` lista só `freela1`. O projeto
`tonante-website` está em `team_DGc4dr0IDidKz6uJdAno9Oik`, que essa conta não
alcança — daí o `"Not authorized"`. Precisa de `npx vercel login` com a conta
certa (fluxo OAuth, só ele faz) ou de um `VERCEL_TOKEN` exportado.

---

## Padrão que se repetiu três vezes hoje

**Espaçamento e separadores escritos para a coluna do desktop, herdados sem
revisão pelo empilhamento do celular.** Os três casos tinham a mesma forma:
dois filetes fazendo o mesmo trabalho, com respiro de tela larga entre eles.

- Ficha → preço: 81px e dois traços viraram 40px e um.
- Card de compra → descrição: a `border-b` do card e a `border-t` da seção
  ficavam uma embaixo da outra; a da seção some no celular.
- Seções de baixo: `pb-20`, `py-16` e `py-20` (80, 64, 80) valiam igual numa
  tela de 440. Foram para 40 no celular, valor original a partir de `md`.

**Gabriel pediu uma varredura da PDP atrás de outras ocorrências** (`py-16` /
`py-20` sem prefixo responsivo, `border-t` logo depois de `border-b`) — ele
quer ver a lista antes de qualquer mudança. Ainda não foi feita.

---

## Ferramentas e armadilhas

**Screenshots e medição.** Não há Playwright instalado; o headless shell está
em `~/.cache/ms-playwright/chromium_headless_shell-1234/…` e roda com
`LD_LIBRARY_PATH` apontando para `~/.local/chromedeps/usr/lib/x86_64-linux-gnu`
e `~/.cache/chromelibs`. Os scripts CDP desta sessão ficaram no scratchpad
(`shot.py`, `medir.py`, `pdp.py`) e **morrem com a sessão** — se precisar,
reescreva. Duas pegadinhas que custaram tempo: `/json/new` exige `PUT` nas
versões novas, e o handshake do websocket precisa de
`--remote-allow-origins=*`.

**Meça no build de produção, nunca no dev server.** Em dev o Vite serve ~2000
módulos soltos; com rede limitada a tela fica branca porque o JS ainda está
chegando, não porque falta esqueleto. Use `npx vite build && npx vite preview`.

**Comentário JSX antes do `return (`.** Escrevi `{/* … */}` como primeiro
filho de um `return (` duas vezes e quebrei o build as duas. Dentro de
`return ( … )`, o comentário tem que estar dentro do elemento, ou vira
comentário JS normal acima do `return`.

**React é 18.3.1 aqui.** `fetchPriority` em camelCase só existe no 19 — no 18
vira aviso no console e o atributo não chega ao DOM. Escreva `fetchpriority`
minúsculo, espalhado por spread, porque os tipos instalados são os do 19.

**Sondas de DOM por texto erram fácil.** Uma busca por "VIOLÕES" pegou um
link do rodapé e devolveu um vão de 7340px. Prefira ler o código primeiro e
usar a sonda só para confirmar um número que você já espera.

---

## Como o Gabriel trabalha

Ele é designer. Pede, você faz e mostra print — não monte spec para aprovação.
Quando ele pergunta "onde você poria?" ele quer opinião com recomendação, não
um leque de opções. Números medidos valem mais que adjetivos: ele responde bem
a "81px viraram 40px" e mal a "ficou mais compacto".

Voz: modo caveman ativo (terso, sem floreio), mas **commits e código em
português normal e completo**. Nunca usar travessão em copy de interface.
