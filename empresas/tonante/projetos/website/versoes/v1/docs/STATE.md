# Estado — Tonante website

Atualizado em 2026-09-17. Branch `tonante/website-v1`.
Complementa `HANDOFF.md`, que continua valendo para tudo que não está aqui.

## Rodada mobile (17/09) — commits 83c4ce0c…0fe21854

O site foi desenhado no desktop e validado lá. Esta rodada passou o celular a
limpo em quatro fases. Medições feitas em Chrome headless a 390×844, com
`Emulation.setTouchEmulationEnabled` (sem hover) — os números abaixo são dessa
medição, não estimativa.

### O que estava quebrado (para não voltar)

- **`HeaderV2` não tinha menu no celular.** Busca (`hidden md:block`), conta
  (`hidden sm:block`), ajuda/acessibilidade/favoritos (`hidden md:flex`) sumiam
  sem substituto. Sobravam logo, carrinho e uma tira de categorias com alvos de
  31px. Existia um menu mobile completo em `Navbar.tsx`, mas ele só monta em
  `/legado`, rota que nada linka — era código morto.
- **A barra fixa de compra da PDP existia e nunca ligava:**
  `setShowMobileStickyCta` não era chamado em lugar nenhum. E no tema claro ela
  vinha com `background: rgba(var(--foreground-rgb),.95)` e `text-foreground` —
  barra #111 com letra #111.
- **`--gradient-buy` não é o verde da casa.** O botão de compra oficial é
  `<CTAButton variant="buy">`, que usa `--buy-green` chapado
  (`rgb(27,184,99)`). Qualquer botão de compra novo deve usar o componente, não
  recriar o estilo.
- **`.footer-col`, `.touch-visivel`, `.touch-sobe` e `.pdp-desc-clamp`** vivem
  no `theme.css` justamente para não existirem no desktop: são regras dentro de
  `@media (max-width:1023px)` ou `@media (hover:none)`.

### O que passou a existir

| o que | onde |
|---|---|
| gaveta de menu com drill-down (categoria → tipo/marca) | `v2/MobileMenu.tsx` |
| busca aberta na 2ª linha do header, variante `compact` | `HeaderV2` + `SearchBar` |
| `--header-h` (altura atual do header, por ResizeObserver) | `HeaderV2` |
| barra de filtros grudada abaixo do header | `ProductsPage` |
| "Carregar mais" no lugar da paginação numerada | `ProductsPage` |
| barra fixa de compra ligada, com `CTAButton` | `ProductPage` |
| `--fab-lift` (WhatsApp e cookies sobem junto com a barra) | `ProductPage` → `WhatsAppFab`, `CookieConsent` |
| colunas do rodapé em `<details>` | `Footer` |

### Empilhamento no pé da tela (z-index)

Três coisas disputam o mesmo canto. A ordem combinada é:

| z | quem |
|---|---|
| 61 | `CartDrawer` |
| 75 | barra fixa de compra da PDP (recolhe com o carrinho aberto) |
| 80 | banner de cookies |
| 90 | botão de WhatsApp |
| 95/96 | gaveta de menu e gaveta de filtros |

Gaveta nova precisa ficar **acima de 90**, senão cookies e WhatsApp cobrem o
botão de ação dela. Foi o que acontecia com os filtros em z-50.

### Alturas no celular (390px)

| página | antes | depois |
|---|---|---|
| PDP (`/produto/19`) | 11.127px | 8.836px |
| home | 14.326px | 13.288px |
| rodapé (em toda página) | 2.065px | 1.213px |
| banner da home | 650px | 388px |
| header fixo | 164px sempre | 164px no topo, 120px ao rolar |

Nenhuma rota tem rolagem horizontal: `scrollWidth` = 390 em `/`, `/produtos`,
`/produto/:id`, `/carrinho`, `/checkout` e `/monte-seu-kit`.

### O que ficou de fora

- **Arte vertical do banner.** A peça é 1942×809 (2,4:1); no celular ela está
  reenquadrada (46svh, âncora em 16%) para mostrar manchete e CTA. É o teto do
  material existente — a saída de verdade é arte 4:5 própria por slide.
- **A home ainda tem 13.288px**, concentrados no quiz de cordas (2.410px) e em
  acessórios (1.825px). Encurtar ali é decisão de conteúdo.
- **Cobertura responsiva do `v2/`**: `ProductCardV2` (406 linhas) e `HomeV2`
  seguem sem nenhum prefixo `sm:/md:/lg:`. Funcionam porque a grade que os
  contém é responsiva, não porque eles sejam.

## O que mudou na rodada anterior (14/09)

### A home trocou a StoryBand por um vídeo
`StoryBand` saiu da `HomeV2`; no lugar entrou `v2/Video70Anos.tsx`: faixa de
largura total, sem texto, com vinheta fraca, e o quadro inteiro linka para
`/produtos?search=Edição 70 Aniversário`. **Sem parallax** — chegou a existir e
foi removido a pedido do Gabriel: o plano do vídeo já tem movimento próprio e os
dois competiam. O vídeo pausa fora da viewport.

`StoryBand.tsx` continua no repo e ainda é usada pela `HomePage` (rota
`/legado`) — não virou órfã.

### "Quem toca, conta" virou feed real
- **Só entra quem tem vídeo nosso.** O elenco é
  `MUSICIANS.filter(m => m.video?.startsWith("/musicos/"))`. Os quatro músicos
  de banco de imagem com vídeo de amostra do Google continuam no `musiciansData`
  e voltam sozinhos se ganharem material.
- **Carrossel infinito**: o trilho carrega três voltas do elenco e o visitante
  fica sempre na do meio; ao se afastar, a posição salta uma volta inteira e o
  conteúdo idêntico esconde o salto. A correção só roda **150ms depois que a
  rolagem para** — mexer em `scrollLeft` durante um `behavior: "smooth"` cancela
  a animação e trava a seta no meio do caminho.
- **O card não é clicável como um todo**, de propósito: cursor normal, sem
  camada invisível por cima. Cada alvo tem hover próprio — miniatura leva pra
  PDP, botão compra e abre o carrinho, selo do IG vai pro perfil. O modal com a
  história do músico saiu daqui e vive em `MusicianStoryModal.tsx`, exportado e
  sem gatilho, à espera de um botão próprio.
- **Hover-to-play**: em ponteiro fino o vídeo só toca com o mouse em cima. Onde
  não há hover (toque) o autoplay da viewport continua valendo.

### Miniatura do produto
Instrumento é objeto vertical, então a miniatura é **retrato 50×66**, não
quadrada. Usa o zoom de `v2/instrumentFraming.ts` **ancorado em 62% da altura**:
ampliar pelo centro enquadrava o meio do braço, que não identifica nada; pelo
corpo, aparece a silhueta. Foto nossa (`/produtos/…`) é fotográfica e usa
`object-cover` sem `multiply` — o `multiply` existe só para casar o fundo branco
das fotos do Magento com o branco da miniatura.

### Popup de boas-vindas
`WelcomePopup` deixou de ser modal centralizado: agora é cartão horizontal
790×390 no canto inferior direito, que chega deslizando da direita (480ms,
`cubic-bezier(0.22,1,0.36,1)`). Toda a lógica de gatilho (scroll ≥40% ou 20s,
espera o consent fechar +5s, mobile só na 2ª página) ficou intacta.

## Vídeos: onde ficam e como são feitos

| pasta | o que é | no git? |
|---|---|---|
| `assets-fonte/musicos/` | gravações brutas (939 MB) | **não** — está no `.gitignore` |
| `public/musicos/` | clipes cortados que o site serve (~11 MB) | sim |
| `public/home/` | o vídeo de 70 anos (5,3 MB) | sim |

Os brutos **não podem voltar para `public/`**: tudo que está lá entra no build
do Vite e no commit. `Conceito.mp4` sozinho tem 135 MB, `MVI_9386.MP4` tem 435.

Todo clipe do feed é **864×1080 (4:5, a proporção do card)**, H.264 + AAC, com
`-movflags +faststart` — sem isso o navegador baixa o arquivo inteiro antes de
começar e o hover fica com meio segundo de atraso. Receita e requisitos em
`public/musicos/LEIA-ME.md`.

Não há `ffmpeg` no sistema. Foi usado via `npm install ffmpeg-static
ffprobe-static` num prefixo fora do projeto, para não sujar o `package.json`.

### O que cada clipe é

| arquivo | fonte | trecho | produto |
|---|---|---|---|
| `andre-batista.mp4` | Conceito.mp4 | 14,85–17,75s | 221 — Viola Acústica Tonante Black (catálogo) |
| `rogerio-alves.mp4` | Conceito.mp4 | 18,0–19,85s | 284 — Cavaquinho Natural (**inventado**) |
| `paulo-andre.mp4` | Paulo André - Billie jean | 20–28s | 19 — Contrabaixo Jazzmine Yellow Cake (catálogo) |
| `thiago-nunes.mp4` | MVI_9386 | 2–20s | 285 — Violão Zebrano (**inventado**) |
| `alfredo.mp4` | Alfredo - Jacksons five | 0–47,5s | 277 — Guitarra 70 Anos Metallic Blue (catálogo) |

Armadilhas que já custaram retrabalho:
- **`MVI_9386` vem deitado** (4K em paisagem, sem metadado de rotação): precisa
  de `transpose=2` antes de qualquer recorte.
- O áudio do `thiago-nunes` **não é o da câmera**: é `gravacao-violao.wav`,
  cortado no mesmo offset de 2s.
- **`Alfredo - Jacksons five` tem pillarbox** (conteúdo útil
  `1010×1846+36+30`) e termina com cartela de marca a partir de 48s, que em loop
  não serve. O recorte usa `y:120` porque o vídeo alterna plano aberto e fechado
  e um enquadramento centrado decapita o músico nos trechos fechados.
- **`Conceito.mp4` só mostra o instrumento a partir de 14,8s** — antes disso é
  plano aberto com o logo.
- Vídeo de banner (`guitarra-70-anos.mp4`) vai **sem áudio**: autoplay só existe
  mudo.

## Produtos inventados

`components/productsExtra.ts` existe porque `productsData.ts` é despejo do
Magento e misturar dado fabricado ali confunde depois. `allProducts` concatena
os dois. Hoje há **dois** itens inventados — preço, SKU, avaliações e specs são
fabricados:

- **284** — Cavaquinho Tonante Natural
- **285** — Violão Aço Eletroacústico Zebrano

O que era o produto 283 ("Cavaquinho Tonante Preto") foi **apagado**: ampliando a
cabeça do instrumento dá pra contar 5 tarraxas de cada lado numa cabeça vazada —
são 10 cordas, é **viola caipira**, e existe no catálogo real (id 221).

## Pendências

1. **Hover do card deve mostrar nome e preço ao lado da miniatura.** Hoje o
   hover mostra só o botão "Comprar agora" e o nome do instrumento aparece num
   balão ao passar o mouse na miniatura. O pedido: quando o botão surgir,
   aparecer **ao lado da miniatura** o nome e o valor do produto, e a base do
   vídeo escurecer um pouco mais em gradiente para o texto ficar legível.
2. **A foto do produto não representa o produto em dois cards** — `rogerio-alves`
   (284) e `thiago-nunes` (285). As duas fotos são frames do próprio vídeo, com
   fundo de feira e de estúdio e o músico em quadro, então a miniatura mostra
   uma pessoa em vez do instrumento. Precisa de foto de catálogo em fundo
   branco, como as do Magento.
3. **`alfredo.mp4` tem 47s e 5,4 MB** — é o clipe mais pesado da home e carrega
   junto com outros quatro. Vale encurtar para ~10s no melhor trecho.
4. **Não existe landing de 70 anos.** O clique no vídeo cai em
   `/produtos?search=Edição 70 Aniversário`, que resolve as três guitarras
   comemorativas. Se a ideia for uma seção de verdade, ela ainda não existe.
5. **Nome do produto 284 e 285 são fabricados** e precisam virar cadastro real
   antes de qualquer publicação.
6. **Paulo André e Alfredo são pessoas reais** identificadas pelo nome do
   arquivo: cidade, @ e depoimento ficaram vazios ou marcados como placeholder
   de propósito. Nada disso pode ir ao ar sem eles autorizarem.
7. Padrões de layout que o Gabriel levantou e ainda não viraram trabalho: banner
   de largura total, "faixa" (ele não gosta do nome, gosta do efeito) e mais
   respiro entre seções, com imagem ou frase.

8. **Arte de banner vertical para o celular** (ver "O que ficou de fora"), e a
   cobertura responsiva de `ProductCardV2` / `HomeV2`.

Continuam de pé as pendências do `HANDOFF.md` que não foram tocadas: número do
WhatsApp, botão de acessibilidade, seção "Primeiro instrumento", `MonteSeuKit`,
artes de `public/categorias/` e `public/ofertas/`, CTAs âmbar no checkout.

## Como ver hover em screenshot

O Tailwind v4 embrulha todo `group-hover:` em `@media (hover: hover)`, e o
Chrome headless reporta `hover: none` — **nenhum hover renderiza no print**. É
preciso subir o Chrome com
`--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`,
e o ajuste **só vale na primeira navegação da instância**: cada captura precisa
de um Chrome novo. Também não use `Emulation.setDeviceMetricsOverride` — ele
zera o hover do blink; passe o tamanho por `--window-size`.

Elementos que sobem no hover saem de onde estavam: para mirar um deles, passe o
mouse no card, espere a animação assentar e **só então** recalcule as
coordenadas do alvo.
