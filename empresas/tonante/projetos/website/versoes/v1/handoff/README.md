# Handoff Tonante → front GraphCommerce

Escrito para: os desenvolvedores que vão construir a loja em GraphCommerce (Next.js + MUI + Magento GraphQL).

Este protótipo é **especificação visual e de comportamento**, não código para colar em produção. Ele é Vite + Tailwind + Radix; vocês são Next + MUI. O markup não porta e não deveria — a tradução para MUI é trabalho de vocês. O que esta pasta faz é evitar que essa tradução seja feita a partir de prints e chutes.

Nada aqui é importado pelo protótipo, e `tsconfig.json` não compila esta pasta.

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| `tokens.json`, `tokens.ts` | 163 tokens (cor, tipografia, raio, sombra, gradiente, espaço) extraídos do CSS que o protótipo realmente usa |
| `export-tokens.mjs` | gera os dois acima a partir de `src/styles/theme.css` — rode de novo quando o design mudar, não edite o gerado |
| `mui-theme.ts` | `createTheme` já preenchido com esses tokens, para colar em `components/theme.ts` |
| `magento-product.ts` | de onde cada campo da tela sai no Magento, os fragmentos GraphQL do card e da PDP, e um adapter |

```bash
node handoff/export-tokens.mjs
```

## Rotas

O protótipo usa nomes em português porque foi desenhado para o cliente ler. Onde o GraphCommerce já tem convenção, **adotem a de vocês** — a coluna da direita é a que vale.

| Protótipo | GraphCommerce | Fonte |
|---|---|---|
| `/produto/:id` | `/p/[url_key]` | `products(filter: { url_key })` |
| `/:category`, `/:category/:subcategory` | `/c/[...url_key]` | `categories` + `products` |
| `/:category/:brand/:slug` | `/p/[url_key]` | a URL longa é decoração de SEO; o produto resolve por `url_key` |
| `/produtos`, `/ofertas` | `/c/...` ou busca | são listagens filtradas, não páginas próprias |
| `/carrinho`, `/checkout` | `/cart`, `/checkout` | ver seção abaixo |
| `/perfil` | `/account` | `customer` |
| `/comparar` | — | `compareList` do Magento 2.4.5+ |
| institucionais (`/quem-somos`, `/faq`, `/termos-de-uso`, `/politica-*`, `/trabalhe-conosco`, `/revendedor`, `/fale-conosco`, `/onde-encontrar`) | CMS pages | conteúdo, não catálogo |
| `/pre-venda`, `/monte-seu-kit`, `/afinador`, `/drivers-e-manuais`, `/influenciadores`, `/maringa-fc`, `/guia` | — | ver "fora do catálogo" |
| `/ds/botoes`, `/legado` | — | páginas internas do protótipo, não vão para produção |

## Catálogo

`magento-product.ts` tem o mapa completo. O resumo do que **não** é nativo e portanto precisa de decisão de vocês antes de começar:

- **`brand`** — Magento não tem marca nativa. Atributo de catálogo (select), usado em card, PDP, filtro e busca.
- **`rating`** — Magento devolve `rating_summary` em 0–100; a tela mostra 0–5. O adapter divide por 20.
- **`badge`** — é **cálculo, não campo**. Precedência em `BADGE_PRECEDENCIA`. Se virar atributo digitado, o cadastro passa a ter que ser mantido à mão a cada promoção e dois produtos vizinhos vão discordar.
- **`price` formatado** — usem `<Money>` do next-ui. A string pronta existe no protótipo só porque não há backend.
- **`audioSample`, `luthier`, `features`** — curadoria editorial da Tonante, não saem do catálogo padrão.

O adapter `fromMagento()` serve para plugar o catálogo real nas telas do protótipo e ver o design contra dados de verdade (nome que quebra em três linhas, produto sem foto, preço sem desconto) **antes** de reconstruir em MUI. Vale o esforço: é onde os problemas aparecem.

## Carrinho e checkout

Entendido daqui que o Magento fica com o checkout de verdade (carrinho, pagamento, pedido) e o front é headless. Então o que o protótipo desenhou em `CartDrawer`, `CartPage` e `CheckoutPage` é **a interface**, e cada passo dela precisa cair numa mutation:

| Tela | Mutation |
|---|---|
| adicionar ao carrinho | `addProductsToCart` |
| drawer / página de carrinho | `cart(cart_id)` |
| alterar quantidade, remover | `updateCartItems`, `removeItemFromCart` |
| cupom | `applyCouponToCart` |
| endereço | `setShippingAddressesOnCart`, `setBillingAddressOnCart` |
| frete | `setShippingMethodsOnCart` |
| pagamento | `setPaymentMethodOnCart` |
| finalizar | `placeOrder` |

Dois pontos que valem checagem cedo, porque mudam o desenho e não só a implementação:

1. **PIX.** O protótipo mostra QR code, relógio de expiração e estado "aguardando pagamento". Isso depende do módulo de pagamento contratado e do que ele expõe via GraphQL. Se o módulo só devolver uma URL de redirect, a tela muda. Confirmem qual módulo antes de a tela ser construída.

2. **Parcelamento.** O card e a PDP mostram "em Nx de R$ Y" e "no PIX R$ Z". Essas regras precisam vir do backend, não serem recalculadas no front — senão a vitrine e o checkout vão discordar em centavos, e é o tipo de divergência que gera chamado.

## Fora do catálogo

Nada disto sai de módulo pronto. Estão no protótipo porque são parte do produto, mas cada um é escopo próprio — listados aqui para entrarem no orçamento, não para surpreender no meio da sprint:

| O quê | Onde no protótipo | Nota |
|---|---|---|
| Monte seu Kit | `MonteSeuKit.tsx`, `lib/kits.ts`, `lib/bandLibrary.ts` | kit pronto é **produto**, não carrinho pré-montado: tem PDP, entra na busca e no comparador |
| Afinador | `lib/tuner.ts`, `strum.ts`, `timbre.ts`, `audioFoco.ts` | Web Audio, roda todo no cliente |
| Pré-venda | `PreOrderPage.tsx`, `PreOrderData.ts` | fluxo de pedido próprio |
| Drivers e manuais | `pages/DriversManuaisPage.tsx` | catálogo de arquivos |
| Músicos / artistas | `MusicosTonante.tsx`, `RealMusicians.tsx` | conteúdo editorial |
| VLibras | `lib/vlibras.ts` | script do gov.br, é só incluir |

## Lógica que porta como está

TypeScript puro, sem React e sem framework. Copiem e colem:

`lib/productSearch.ts` (busca com tolerância a erro de digitação) · `lib/cpf.ts` · `lib/cnpj.ts` · `lib/phone.ts` · `lib/password.ts` · `lib/slug.ts`

Vale manter a disciplina do lado de vocês: regra de negócio fora de componente.

## Animação

O protótipo usa `motion` (Framer Motion), que roda em Next igual. As curvas e durações estão nos tokens (`ease`, e as transições declaradas em `theme.css`). A animação é parte do desenho, não enfeite — se algo for cortado por prazo, avisem, porque muda a percepção de qualidade da loja.

## O que não fazer

- Não migrem o protótipo para Next. Trocar Vite por Next não faz Tailwind virar MUI nem mock virar Magento; só atrasa o design.
- Não tentem reusar os componentes Radix. Radix e MUI têm modelos de composição diferentes; a tradução manual é mais rápida que a ponte.
- Não tratem o Supabase do `package.json` como decisão de arquitetura. É andaime do protótipo.
