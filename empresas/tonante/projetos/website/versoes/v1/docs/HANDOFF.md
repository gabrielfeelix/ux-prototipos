# Handoff — Tonante website

Estado em 2026-09-14. Branch `tonante/website-v1`. **Nada commitado** — tudo em
working tree. Repo: `~/dev/ux-prototipos`, projeto em
`empresas/tonante/projetos/website/versoes/v1`.

Substitui o handoff anterior, que descrevia a v2 como redesign paralelo em `/v2`.
Isso acabou: **a v2 virou o site**.

## O que mudou desde o handoff anterior

A v2 deixou de ser rota de teste. Hoje:

| rota | o que é |
|---|---|
| `/` | `HomeV2` — home nova |
| `/legado` | `HomePage` — home antiga, preservada como referência |
| `/v2` | **não existe mais** (cai no catch-all `:category` e renderiza catálogo vazio) |

O `HeaderV2` é o cabeçalho do **site inteiro**, montado pelo `RootLayout`
([RootLayout.tsx:42](../src/app/components/RootLayout.tsx)). Só `/legado` usa o
`Navbar` + `AnnouncementBar` antigos; `/checkout` e `/monte-seu-pc` seguem sem
cabeçalho, como já era.

O card de produto v2 é o **padrão do site** — `CardVariantContext` tem default
`"v2"`, e a `HomePage` do legado é quem se declara `"classic"`.

## Ordem da home (decidida com o Gabriel, e ele vai continuar mexendo)

O princípio: o visitante tem que estar quase sempre com produto na tela. A cada
bloco comercial segue um institucional, que dá respiro, cor, e empurra pra algo
que vende. Ele resumiu como "ou 1 carrossel e institucional, ou 2 carrosséis e
institucional".

1. `HeroBannersV2` — anúncio, única dobra sem produto
2. `ProductShelf` da **campanha ativa** — primeiro contato oferta, não cataloga
3. `CategoriasV2`
4. `OfertasV2` — banner + trilho "Mais vendidos"
5. `StoryBand` + `SocialProofBar` — institucional
6. `ProductShelf` "Top da semana" (ainda com abas)
7. `EncordoamentosV2`
8. `MonteSeuKit` — **vai ser refeita 100%**, é o "Combo Tonante"
9. `LinhasDeViolao` — institucional
10. `ProductShelf` "Cordas, acessórios e suportes"
11. `MusicosTonante` → `Newsletter` → `Footer`

`GuiaIniciante` saiu da home (duplicava a captura da newsletter). O componente
continua existindo. O Gabriel cogitou trazê-lo de volta **como banner**, não
como componente com frases e botões — decisão em aberto.

**Próximo passo que ele já anunciou**: melhorar as seções que acha feias e
reordenar de novo por lógica comercial. Os candidatos que ele mesmo apontou são
os institucionais (`StoryBand`, `LinhasDeViolao`) e o `MonteSeuKit`.

## Decisões que não estão óbvias no código

### Rotas e chrome
- **Páginas perderam o `pt-[calc(142px+var(--announce-h))]`.** Isso compensava o
  `Navbar` fixo da v1; com o spacer do `HeaderV2` virava ~180px de buraco.
  Removido de `ProductsPage`, `ProductPage`, `ProfilePage`, `PreOrderPage`.
  `HeroSection` manteve o dela — só `/legado` usa.
- **`HeaderV2` é `fixed` + spacer de altura medida.** `HeroBannersV2` mede o
  **spacer**, nunca o header (o header colapsa no scroll).
- **Os painéis do header são filhos diretos do `<header>`.** A faixa de navegação
  usa `overflow: hidden` pra animar o colapso e recortava qualquer dropdown
  ancorado lá dentro — era esse o "menu bugado dentro do header".
- Mega menu, conta e (antes) carrinho abrem no **hover com atraso de 140ms** no
  fechamento (`useHoverPanel`), senão o painel some ao atravessar o vão.
- **Carrinho não tem prévia no hover, de propósito**: a intenção é levar pra
  sidebar, que é onde tem frete, brinde e cupom. É só ícone + bolinha vermelha.

### Card de produto (`ProductCardV2`)
- **As miniaturas são VARIANTES de acabamento, não fotos do mesmo produto.**
  Vêm de `getProductSwatches()`; clicar troca o produto exibido (nome, preço,
  avaliações e link). Somem quando só há uma variante. 40×40px.
- **Enquadramento de instrumento é tabelado, não calculado em runtime.**
  `instrumentFraming.ts` tem `[zoom, dy]` por id de produto, medido offline: um
  script Python baixou as 93 fotos de instrumento, achou o retângulo que não é
  fundo branco e derivou o zoom pra todo instrumento sair com ~58% da largura do
  card. **Por que offline**: o CDN da Oderco não manda CORS, então `canvas` no
  browser é impossível (`crossOrigin` falha ao carregar). **Regerar quando as
  fotos do catálogo mudarem** — sem isso, foto nova cai no padrão `[1.55, 0]` e
  pode sair desproporcional.
- O zoom usa `object-contain` + `origin-bottom` + `transform`, **não**
  `object-cover`. Com cover, a fatia visível dependia da proporção do arquivo, e
  foto estreita (havia uma 466×1200) virava close no cavalete.
- Acessório/corda não recebe zoom: `object-contain` com `p-[20%]`.

### Imagens
- **Toda foto de produto passa por um upgrade de resolução.** A URL do Magento
  `/media/catalog/product/cache/<hash32>/…` é uma thumb de **300×300**; a mesma
  foto sem o segmento `/cache/<hash>/` é **1200×1200**. `upgradeProductImage()`
  faz a troca e o `ImageWithFallback` tenta o original **e volta pra thumb se ele
  não existir** — é esse fallback que impede a imagem quebrada.

### Cor e tipografia
- **Nada de bege.** O Gabriel foi explícito: "somos BRANCO E PRETO, com alguns
  elementos em marrom". Duas varreduras foram feitas:
  1. hexes quentes (`#1a1714` ink, `#f6f5f2`, `#f5f4f0` well, cremes de texto)
     → neutros (`#111111`, `#f5f5f5`, `#f4f4f4`, `#ffffff`);
  2. **âmbar com alpha baixo**, que é o que renderizava areia: `bg-primary/5…20`,
     `bg-primary/[0.02…0.12]`, `bg-amber-50/100`, `rgba(200,120,0,0.04…0.18)`,
     `border-primary/10…30` → cinza neutro. Regra: âmbar com alpha ≤ 0,25 usado
     como fundo/borda vira cinza; âmbar sólido (ícone, texto, pill) fica.
  Exceção preservada: o gradiente de `EncordoamentosV2`, amostrado das artes.
- **CTA de compra é preto**, não verde nem âmbar: `--gradient-buy` foi trocado
  para preto e vale pra PDP, sticky bar e todo `CTAButton variant="buy"`. Verde
  sobrou só como sinal semântico (em estoque, PIX, frete grátis).
- **Display trocada: Bodoni Moda → Fraunces.** A didone sumia em tamanho pequeno.
  Isso **contraria o manual de marca** (que pede família Bodoni) — foi decisão do
  Gabriel, está registrada no comentário de `fonts.css`. O token continua com o
  nome legado `--font-family-figtree`.
- `Eyebrow` usava `letter-spacing: 0.3em` em `--primary` (#c87800, ~3,4:1).
  Agora 0.12em em `--amber-text` (#a05f00, 5:1) — que é o âmbar que o próprio
  `theme.css` reserva pra texto pequeno.
- **Cores dos cards de corda são amostradas da arte.** Cada foto tem degradê
  horizontal na base; o bloco de texto usa `linear-gradient(90deg, …)` com 9
  stops medidos da faixa inferior, ignorando as colunas onde o instrumento
  escuro cobre o fundo (detectadas por luminância e interpoladas). **Trocou a
  arte → reamostrar**, senão aparece emenda.

### Layout
- Largura do site: `maxWidth: 1680px` + respiro lateral `px-12`, em 18 arquivos.
  Passou por 1600→1840→1680; 1840 ficou esticado demais na tela do Gabriel.
  **Mexer nisso é mexer em todos de uma vez**, senão header e seções desalinham.

### Busca
- `lib/searchMatch.ts` normaliza acento e tenta o singular ("violao" acha
  "Violão", "cordas" acha "corda"). Aplicado em `SearchBar`, `Navbar`,
  `ProductsPage`. `SearchModal.tsx` **não é importado em lugar nenhum** e ainda
  tem catálogo PCYES hardcoded — candidato a deletar.

### Seções
- `MusicosTonante` foi refeita na referência que o Gabriel mandou: card 292px,
  vídeo 292×516 (9:16), gap 30px, **vídeo toca sozinho** quando a seção entra na
  viewport (`IntersectionObserver`, muted/loop/playsInline), pausa fora da tela e
  com o modal aberto. Embaixo do vídeo vai a caixa do produto que o músico toca.
  O marquee automático que existia antes foi removido — vídeo tocando com trilho
  andando brigava pela atenção.
- `campanhas.ts` guarda as campanhas da home (Mês do Músico, 70 anos, Back to
  70's). Uma no ar por vez via `CAMPANHA_ATIVA`; a seleção de produtos de hoje é
  provisória (maior desconto real), esperando curadoria.
- `OfertasV2` perdeu as abas. "Ofertas da semana" saiu (dependia de curadoria
  semanal e competia com a campanha do topo) e "Primeiro instrumento" saiu pra
  virar **seção própria, ainda não criada**. Sobrou "Mais vendidos", que se
  sustenta sem ninguém configurar nada.

## Pendências

1. **Número do WhatsApp** — `WhatsAppFab.tsx` está com placeholder
   `5544999999999` e um `TODO`. O botão já está no ar em todas as páginas menos
   `/checkout`.
2. **Botão de acessibilidade do header não faz nada** — é placeholder combinado.
3. **Seção "Primeiro instrumento"** ainda não existe; saiu das abas pra virar
   seção dedicada.
4. **`MonteSeuKit` vai ser refeita 100%** ("Combo Tonante").
5. **Artes faltando** (o código cai em fallback): `public/categorias/`
   (`afinadores.png`, `capas.png`, `palhetas.png`, `cabos.png`, `correias.png`,
   `microfones.png`, quadradas 1024×1024) e `public/ofertas/`
   (`mais-vendidos.jpg`, `ofertas.jpg`, `primeiro-instrumento.jpg`, retrato
   1024×1536).
6. **Artes de corda trazem marca D'Addario legível** — o Gabriel sabe, não
   decidiu se regera.
7. **~20 CTAs em `var(--gradient-brand)` (âmbar) em `CheckoutPage` e `CartPage`.**
   No drawer eu já troquei os dois principais pra preto; o resto espera ele
   olhar o checkout.
8. `SearchBar` duplicado com o bloco interno do `Navbar.tsx` (3 cópias de markup:
   drawer mobile, barra desktop, overlay). Unificar quando puder mexer na v1.
9. Bateria, sopro e outros instrumentos **não existem** em `productsData` — só
   Violões, Guitarras, Contrabaixos, Cordas, Acessórios, Suportes.

## Como verificar visualmente

Dev server: `npm run dev` (costuma já estar em `localhost:5173`).

Não há Playwright. Use o Chrome do ms-playwright com as libs extraídas, via CDP:

```bash
CHROME=~/.cache/ms-playwright/chromium-1169/chrome-linux/chrome
LD_LIBRARY_PATH=$HOME/.cache/chromelibs/usr/lib/x86_64-linux-gnu \
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
  --remote-debugging-port=9333 --user-data-dir=/tmp/claude-1000/chromeprof about:blank &
```

Os scripts da sessão ficaram no scratchpad (some quando a sessão morre; refazer
é rápido): `cap.mjs` (navega, fecha cookies/popup, rola, printa), `capx.mjs`
(mesma coisa + roda um JS antes do print, pra abrir menu/hover) e `ev.mjs`
(avalia uma expressão e imprime o retorno — bom pra medir DOM sem gastar imagem).
Use `WebSocket` nativo do Node 24; o pacote `ws` não está instalado.

Armadilhas conhecidas do headless:
- **Vídeo não toca**: o Chromium do playwright não tem codec H.264, então MP4
  devolve `NotSupportedError`. No navegador do Gabriel roda.
- **Canvas com foto de produto é impossível**: sem CORS do CDN.
- Cookies ("Aceitar") e o popup de newsletter ("Não, obrigado") cobrem a tela —
  os scripts já clicam neles antes de printar.

`npx tsc --noEmit` tem erros **pré-existentes** em `vite.config.ts`,
`Navbar.tsx` (17, todos de `Variants` do motion), `CartPage.tsx`,
`CheckoutPage.tsx`, `ProductPage.tsx` (props faltando em `StickyCard`) e
`MonteSeuPcPage.tsx`. Nenhum em `src/app/v2/`.

## Como o Gabriel trabalha

- Manda print da referência e cobra fidelidade: respeitar medidas (tamanho,
  padding, proporção) em vez de aproximar. Ele inspeciona o DevTools da
  referência e passa os números.
- Revisa por screenshot. Capturar e mostrar vale mais que descrever.
- Repara em motion: quer que as coisas **surjam**, com deslocamento leve na
  direção final e curva suave. O padrão adotado é
  `cubic-bezier(0.22, 1, 0.36, 1)` com 420ms (600ms no zoom da foto). Detalhe
  que já mordeu: `transition` inline sobrescreve a classe do Tailwind, e o
  Tailwind v4 anima as propriedades `translate`/`scale`, não `transform`.
- Menos informação por card, mais respiro, menos "cara de IA".
- Quando ele diz "tira isso", é remover — não esconder.
- Fala em português, direto. Responde melhor a alternativa concreta que a
  pergunta aberta.
