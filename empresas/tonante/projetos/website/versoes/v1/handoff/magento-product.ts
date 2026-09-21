/**
 * De onde cada campo da tela sai no Magento.
 *
 * O protótipo usa uma interface `Product` própria (src/app/components/productsData.ts),
 * achatada de propósito: `price: "R$ 34,90"` é string porque não existe backend para
 * formatar. Renomear esses campos no protótipo quebraria as ~60 telas sem ajudar
 * ninguém, então o mapeamento mora aqui, fora do caminho.
 *
 * Este arquivo não é importado pelo protótipo. Serve para responder, em um lugar só,
 * a pergunta "que query esse card precisa" — e para deixar explícito quais campos NÃO
 * saem do Magento padrão e portanto viram atributo customizado, módulo ou decisão.
 */
import type { Product } from '../src/app/components/productsData'

/* ---------------------------------------------------------------------------
 * 1. Mapa campo a campo
 * ------------------------------------------------------------------------ */

/**
 * `nativo`  = atributo padrão do Magento 2, vem de graça na query
 * `atributo`= precisa de atributo customizado no catálogo (cadastro + indexação)
 * `derivado`= calculado no front a partir de outros campos, não se pede ao backend
 * `modulo`  = depende de módulo/serviço além do catálogo
 */
export type Origem = 'nativo' | 'atributo' | 'derivado' | 'modulo'

export const CAMPOS: Record<keyof Product, { origem: Origem; magento: string; nota?: string }> = {
  id:            { origem: 'nativo',   magento: 'id' },
  sku:           { origem: 'nativo',   magento: 'sku' },
  name:          { origem: 'nativo',   magento: 'name' },
  seoSlug:       { origem: 'nativo',   magento: 'url_key', nota: 'a rota /p/[url_key] do GraphCommerce come isto direto' },
  productUrl:    { origem: 'derivado', magento: '—', nota: 'montar a partir de url_key; não guardar URL absoluta no catálogo' },

  priceNum:      { origem: 'nativo',   magento: 'price_range.minimum_price.final_price.value' },
  price:         { origem: 'derivado', magento: '—', nota: 'formatação; usar <Money> do next-ui, não string pronta' },
  oldPriceNum:   { origem: 'nativo',   magento: 'price_range.minimum_price.regular_price.value', nota: 'só exibir quando > final_price' },
  oldPrice:      { origem: 'derivado', magento: '—' },

  image:         { origem: 'nativo',   magento: 'small_image.url' },
  images:        { origem: 'nativo',   magento: 'media_gallery { url, label, position }' },
  description:   { origem: 'nativo',   magento: 'short_description.html' },
  htmlDescription:{ origem: 'nativo',  magento: 'description.html' },

  brand:         { origem: 'atributo', magento: 'brand', nota: 'Magento não tem marca nativa; select attribute no catálogo' },
  category:      { origem: 'nativo',   magento: 'categories { name, url_path, level }', nota: 'a tela usa UMA categoria; escolher por level, não pegar a primeira' },
  subcategory:   { origem: 'nativo',   magento: 'categories', nota: 'mesma fonte, nível abaixo' },
  tags:          { origem: 'derivado', magento: '—', nota: 'a busca do protótipo usa; no Magento vira categoria + atributo, ver productSearch.ts' },

  inStock:       { origem: 'nativo',   magento: 'stock_status', nota: 'IN_STOCK | OUT_OF_STOCK' },

  rating:        { origem: 'nativo',   magento: 'rating_summary', nota: 'Magento devolve 0–100; a tela mostra 0–5, dividir por 20' },
  reviews:       { origem: 'nativo',   magento: 'review_count' },

  specs:         { origem: 'derivado', magento: 'custom_attributes / aggregations', nota: 'tabela da PDP; montar a partir dos atributos visíveis na ficha' },
  features:      { origem: 'atributo', magento: '—', nota: 'lista de bullets curada, não sai de atributo padrão' },
  badge:         { origem: 'derivado', magento: '—', nota: 'ver regra abaixo: é cálculo, não campo' },

  audioSample:   { origem: 'atributo', magento: '—', nota: 'mp3 do timbre do modelo; atributo de arquivo ou CDN próprio' },
  luthier:       { origem: 'atributo', magento: '—', nota: 'nome/foto/bio de quem fez o instrumento; melhor como entidade própria, não 4 atributos soltos' },
}

/**
 * `badge` é o caso que mais gera retrabalho se for tratado como campo de catálogo.
 * No protótipo ele é sempre derivado, e a ordem de precedência importa: um produto
 * que é lançamento E tem desconto mostra um selo só. Se isso virar um atributo
 * digitado no Magento, dois produtos vizinhos vão discordar e ninguém saberá qual
 * está certo — e o cadastro passa a ter que ser mantido à mão a cada promoção.
 */
export const BADGE_PRECEDENCIA = ['pre-venda', 'desconto', 'novidade', 'mais-vendido'] as const

/* ---------------------------------------------------------------------------
 * 2. A query que a vitrine precisa
 * ------------------------------------------------------------------------ */

/** Campos do card. É o fragmento que a listagem, o carrossel e a busca compartilham. */
export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment TonanteProductCard on ProductInterface {
    id
    sku
    name
    url_key
    stock_status
    rating_summary
    review_count
    brand
    small_image { url label }
    price_range {
      minimum_price {
        final_price { value currency }
        regular_price { value currency }
        discount { percent_off amount_off }
      }
    }
    categories { uid name url_path level }
  }
`

/** O que a PDP acrescenta ao fragmento do card. */
export const PRODUCT_PAGE_FRAGMENT = /* GraphQL */ `
  fragment TonanteProductPage on ProductInterface {
    ...TonanteProductCard
    description { html }
    short_description { html }
    media_gallery { url label position }
    ... on ConfigurableProduct {
      configurable_options { attribute_code label values { uid label swatch_data { value } } }
      variants { attributes { code value_index } product { sku stock_status price_range { minimum_price { final_price { value } } } } }
    }
  }
`

/* ---------------------------------------------------------------------------
 * 3. Adapter
 * ------------------------------------------------------------------------ */

/** Subconjunto da resposta do Magento que o adapter abaixo consome. */
export interface MagentoProductCard {
  id: number
  sku: string
  name: string
  url_key: string
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK'
  rating_summary?: number
  review_count?: number
  brand?: string | null
  small_image?: { url: string; label?: string | null } | null
  price_range: {
    minimum_price: {
      final_price: { value: number; currency: string }
      regular_price: { value: number; currency: string }
    }
  }
  categories?: { name: string; url_path: string; level: number }[] | null
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Converte a resposta do Magento no formato que os componentes do protótipo esperam.
 *
 * Existe para uma coisa só: permitir plugar o catálogo real em qualquer tela do
 * protótipo sem reescrevê-la, e assim validar o design contra os dados de verdade
 * (nome longo que quebra em três linhas, produto sem foto, preço sem desconto)
 * antes de a tela ser reconstruída em MUI. Não é código de produção.
 */
export function fromMagento(p: MagentoProductCard): Product {
  const final = p.price_range.minimum_price.final_price.value
  const regular = p.price_range.minimum_price.regular_price.value
  const temDesconto = regular > final
  const folha = p.categories?.length
    ? [...p.categories].sort((a, b) => b.level - a.level)[0]
    : undefined
  const raiz = p.categories?.length
    ? [...p.categories].sort((a, b) => a.level - b.level)[0]
    : undefined

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    price: brl.format(final),
    priceNum: final,
    oldPrice: temDesconto ? brl.format(regular) : undefined,
    oldPriceNum: temDesconto ? regular : undefined,
    // Magento devolve 0–100
    rating: (p.rating_summary ?? 0) / 20,
    reviews: p.review_count ?? 0,
    category: raiz?.name ?? 'Sem categoria',
    subcategory: folha && folha !== raiz ? folha.name : undefined,
    tags: p.categories?.map((c) => c.name) ?? [],
    image: p.small_image?.url ?? '',
    brand: p.brand ?? undefined,
    inStock: p.stock_status === 'IN_STOCK',
    seoSlug: p.url_key,
  }
}
