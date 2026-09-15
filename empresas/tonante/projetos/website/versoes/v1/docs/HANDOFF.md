# Handoff — Tonante website

Estado em 2026-09-15, 10h. Branch `tonante/website-v1`, projeto em
`~/dev/ux-prototipos/empresas/tonante/projetos/website/versoes/v1`.
Substitui o handoff de 14/09. O que ele dizia sobre estrutura da home, header,
card v2, cor e tipografia **continua valendo** — leia `docs/STATE.md` junto.

**O site é protótipo e não vai ao ar.** Placeholder (número de WhatsApp,
depoimento de músico, flag de estoque, arte de banco de imagem) **não é
pendência** e não deve ser listado como risco. Decisão do Gabriel, 15/09.

## Tem outro agente trabalhando no mesmo repo

Um agente paralelo cuidava de **imagens e catálogo**. **Encerrou em 15/09** —
não há mais ninguém mexendo no repo junto. O que ele deixou commitado:

- `5aa0f7fb` — 32 produtos do site institucional (`productsSiteOficial.ts`):
  Pro Series, Volcano, Legacy, Muriel's, Star Light, baterias Sonora e cores
  que faltavam. Entram em `allProducts`.
- `24c5da7a` — Baterias no menu de categorias.
- `cca1c0f2` — 6 SKUs cuja URL de cache do Magento devolve o placeholder cinza
  com status 200.

Deixou também `scripts/fotos-oficiais.py`, que raspa a media library do
WordPress de `tonantebrasil.com.br` (`/wp-json/wp/v2/media`), casa por número de
SKU (`CP111602` → `111602_2.jpg`), baixa, converte pra WebP, deduplica e regera
`productGalleries.ts` (95 SKUs, 1205 fotos em `public/produtos/oficial/`).
Agora que ele parou, esses arquivos são seus — mas rode o script antes de
editar `productGalleries.ts` na mão, porque ele regera o arquivo inteiro.

## O que mudou nesta sessão (commitado em 15/09)

```
836a419d  classificador de fundo de foto (scripts/classifica-fundo.py)
fa1ebf22  regra do quadro: QuadroFoto.tsx + ProductCardV2
e78cca6a  instrumentos dos músicos viram produtos reais (223 e 285)
ee43eb22  vídeo do feed não trava no hover + ordem do trilho
993aadd9  preço real da Oderço nos 11 violões do site institucional
d72c9b67  faixa de números sai da home, vídeo de 70 anos mais alto
```

`ProductPage.tsx` (regra do quadro em toda a PDP) entrou junto com o commit do
outro agente. `npx vite build` passa limpo depois de tudo isso.

`productsData.ts` e `photoBackdrop.ts` já foram commitados pelo outro agente
junto com o trabalho dele, com o repreçamento dentro.

### 1. Regra do quadro (foto de produto)

Regra do Gabriel, textual: *"tem fundo branco? remove e fica no fundo do card.
é ambientada? tem que preencher o card todo"*. Vale na foto principal e nas
miniaturas. Implementada em `QuadroFoto.tsx`, em três casos:

1. **Recorte de estúdio** — aparece inteiro, `object-contain`, e o branco some
   no fundo do quadro via `mixBlendMode: multiply`.
2. **Ambientada** — `object-cover`, preenche. Sem isso o corte da foto aparece
   dentro do card e parece defeito.
3. **Ambientada e desproporcional** (retrato 240×1167, banner 1200×328) — em
   quadro quase quadrado o `cover` amplia 5× e vira tira borrada. Aí a própria
   foto desfocada e ampliada faz o fundo e a foto aparece inteira por cima.

Quem sabe em que caso cada arquivo cai é **`photoBackdrop.ts`**, gerado por
`scripts/classifica-fundo.py` — medido **offline** porque o CDN não manda CORS
(mesmo motivo do `instrumentFraming`). Hoje: **598 ambientadas de 1567 fotos,
174 delas desproporcionais**.

O classificador amostra dois anéis: 0–4% e 8–12% da borda. Anel branco = recorte.
Os dois anéis existem porque recorte com moldura desenhada tem anel externo
colorido e miolo branco, enquanto foto deitada colada num quadrado tem tarja
branca em cima e conteúdo nas laterais — só o anel de dentro separa os dois.

**Regerar quando entrar foto nova**: `python3 scripts/classifica-fundo.py --cdn`
(~4 min; sem `--cdn` mede só as locais). Ele varre `productsData.ts`,
`productsExtra.ts`, `productsSiteOficial.ts` e `public/produtos/oficial/`.
Atenção: o catálogo usa **dois hosts** (`www.oderco.com.br/media/...` e
`cdn.oderco.com.br/produtos/...`) e o segundo devolve **403** pro User-Agent
padrão do urllib.

**Armadilha já paga**: na PDP a foto some num fade do `framer-motion`. Enquanto
anima, o wrapper vira grupo isolado e o `multiply` fica sem fundo com que se
misturar — o branco do recorte aparecia como um quadrado por ~1s. O `motion.div`
agora pinta o mesmo cinza do quadro em **cor opaca** (não alpha) e declara
`isolation: isolate`. Não troque por gradiente com alpha, o bug volta.

### 2. Preços agora são os reais da Oderço

O dump estava ~3× acima da loja real (mediana da razão 0,31; só 11 de 275 dentro
de ±20%), e errava pros dois lados — `CP22169` custava R$ 79,90 aqui e R$ 307,28
lá. **276 produtos** repreçados pelo GraphQL público da Oderço:

```bash
curl -s https://www.oderco.com.br/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{products(search:\"CP111630\",pageSize:1){items{sku name price_range{minimum_price{final_price{value}}} stock_status}}}"}'
```

O **percentual** de desconto foi preservado: onde havia `oldPrice`, ele foi
escalado pelo mesmo fator, senão apareceria badge de −98%. Os 58 descontos do
catálogo ficaram entre 2% e 25%.

**34 SKUs continuam com o preço antigo (inflado)** — a Oderço não responde por
eles. Decisão pendente: marcar com comentário ou escalar pela mediana (÷3,2).

### 3. Feed de músicos

- Ordem do trilho é lista explícita `ORDEM` em `MusicosTonante.tsx`: Paulo André,
  Rogério Alves, André Batista, Thiago Nunes, Alfredo José. Músico fora da lista
  entra no fim sozinho.
- **Vídeos travavam no hover.** Eram 15 `<video>` no trilho (3 voltas × 5) todos
  com `preload="metadata"`: disputavam as 6 conexões por origem e o vídeo sob o
  mouse ficava na fila. Agora `preload="none"` e o `play()` repete em
  `loadeddata`/`canplay`. **Não verificado no Chrome do Gabriel** — o Chromium
  headless não tem codec H.264 (`DEMUXER_ERROR_NO_SUPPORTED_STREAMS`).
- Alfredo José ganhou sobrenome.

### 4. Produtos dos músicos

- Rogério aponta pro **produto real do catálogo**: `Cavaco Acústico Tonante
  Natural`, id 223. O SKU inventado 284 foi apagado.
- O violão do Thiago **existe**: `CP111630`, "Violão Elétrico Safira 41" — Tampo
  em Zebra — EQ 4 Bandas — Fosco — VSZ1954N41Z", R$ 489,90, marcado OUT_OF_STOCK
  na Oderço (aqui fica `inStock: true` de propósito, com comentário). A busca por
  "zebrano" dava zero porque o catálogo chama o tampo de **"Zebra"**. Fica em
  `productsExtra.ts` com SKU do ERP, que é o que casa com a galeria oficial.

## Pendências

Ordenadas por impacto visual, que é o que importa num protótipo.

1. **`public/ofertas/` está vazia** — faltam `mais-vendidos.jpg`, `ofertas.jpg`,
   `primeiro-instrumento.jpg` (retrato 1024×1536). `OfertasV2` cai em fallback.
2. **`public/categorias/`** — faltam `afinadores`, `capas`, `palhetas`, `cabos`,
   `correias` (1024×1024). Existem violão, guitarra, contrabaixo, encordoamento,
   microfone, suporte.
3. **`MonteSeuKit` refeita 100%** — vira o "Combo Tonante". Está na home,
   posição 8.
4. **`LinhasDeViolao`** — o outro institucional que o Gabriel acha feio, logo
   depois do MonteSeuKit: dois blocos fracos seguidos.
5. **Seção "Primeiro instrumento"** — saiu das abas do `OfertasV2` pra virar
   seção própria e nunca foi criada.
6. **`GuiaIniciante` como banner** — ele cogitou trazer de volta, decisão aberta.
7. **Botão de acessibilidade do header não faz nada** (placeholder combinado).
8. **~19 CTAs em âmbar no checkout** — 10 em `CheckoutPage`, 9 em `CartPage`,
   contra o preto do resto do site.
9. **`SearchModal.tsx` órfão** com catálogo PCYES hardcoded — candidato a
   deletar. `SearchBar` tem 3 cópias de markup dentro do `Navbar`.
10. **Órfãos em `public/produtos/`**: `111630_*.png`, `violao-tonante-zebrano*.png`
    e `-2/-3/-4.jpg`, `cavaquinho-tonante-natural.jpg`. Nada referencia (o 285
    usa a galeria oficial em `public/produtos/oficial/111630/`). Ficaram fora do
    commit de propósito. O modo automático bloqueia `rm`, então peça pro Gabriel.

### Decisões abertas com ele

- **Arte de campanha com texto** (a do 70 anos): o `cover` corta as letras
  ("...ada para celebrar gerações"). Cabe um quarto caso "arte com texto fica
  inteira", ou a arte sai da galeria?
- **Os 34 SKUs sem preço na Oderço** (ver acima).
- Testar o hover dos vídeos no Chrome dele.

## Como verificar visualmente

Dev server: `npm run dev` (costuma estar em `localhost:5173`). Não há Playwright;
use o Chrome do ms-playwright com as libs extraídas, via CDP:

```bash
CHROME=~/.cache/ms-playwright/chromium-1169/chrome-linux/chrome
LD_LIBRARY_PATH=$HOME/.cache/chromelibs/usr/lib/x86_64-linux-gnu \
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
  --remote-debugging-port=9333 --user-data-dir=/tmp/claude-1000/chromeprof about:blank &
```

Os scripts vivem no scratchpad da sessão e somem com ela; refazer leva minutos.
Eram três, com `WebSocket` nativo do Node 24 (o pacote `ws` não está instalado):
`cap.mjs` (navega, fecha cookies/popup, roda um JS, printa), `ev.mjs` (avalia
expressão e imprime o retorno — mede DOM sem gastar imagem) e `pdp.mjs` (printa
a mesma página em 350/900/2500ms, que foi como o flash do fundo branco apareceu).

URL de PDP é canônica, não `/produto/:id`: `/violoes/tonante/<seoSlug>/`.

Armadilhas do headless: **vídeo não toca** (sem H.264), **canvas com foto de
produto é impossível** (sem CORS), e cookies/newsletter cobrem a tela — os
scripts já clicam em "Aceitar" e "Não, obrigado".

`npx tsc --noEmit` tem erros **pré-existentes** em `vite.config.ts`, `Navbar.tsx`
(17, todos de `Variants` do motion), `CartPage.tsx`, `CheckoutPage.tsx`,
`ProductPage.tsx` (props faltando em `StickyCard`) e `MonteSeuPcPage.tsx`.
`npx vite build` passa limpo.

## Como o Gabriel trabalha

- Manda print da referência e cobra fidelidade: respeitar medidas em vez de
  aproximar. Inspeciona o DevTools da referência e passa os números.
- **Revisa por screenshot. Capturar e mostrar vale mais que descrever.**
- Não quer spec pra aprovar: pede, você faz e mostra o print.
- Repara em motion: as coisas têm que **surgir**, com deslocamento leve na
  direção final. Padrão `cubic-bezier(0.22, 1, 0.36, 1)` com 420ms (600ms no
  zoom da foto). `transition` inline sobrescreve a classe do Tailwind, e o
  Tailwind v4 anima `translate`/`scale`, não `transform`.
- Menos informação por card, mais respiro, menos "cara de IA".
- Quando ele diz "tira isso", é remover — não esconder.
- Fala em português, direto. Responde melhor a alternativa concreta que a
  pergunta aberta.
