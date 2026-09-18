import { kitProducts } from "../lib/kits";
import { extraProducts } from "./productsExtra";
import { siteOficialProducts } from "./productsSiteOficial";

export interface Product {
  id: number;
  sku?: string;
  name: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  oldPriceNum?: number;
  rating: number;
  reviews: number;
  category: string;
  subcategory?: string;
  tags: string[];
  image: string;
  badge?: string;
  brand?: string;
  inStock?: boolean;
  description?: string;
  htmlDescription?: string;
  seoSlug?: string;
  productUrl?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  images?: string[];
  /** mp3 gravado com o modelo (V3 §8.1) — quando existir, o TimbrePlayer
      troca o timbre simulado pela gravação real */
  audioSample?: string;
  /** autoria do instrumento (V3 §8.2) — ver também LUTHIERS em
      productEnhancements (override por id sem mexer no catálogo) */
  luthier?: { name: string; title: string; photo?: string; bio?: string };
}

const rawProducts: Product[] = [
  {
    "id": 1,
    "sku": "152273",
    "name": "Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD",
    "price": "R$ 34,90",
    "priceNum": 34.9,
    "rating": 4.5,
    "reviews": 141,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Palheta"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/5/152273_2-17459165074785513.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/5/152273_2-17459165074785513.jpeg",
    ],
    "inStock": true,
    "description": "Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD</h2><p>Selecionado pela Tonante, o Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Palheta",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "152273"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "palheta-ibox-1-0mm-c-20-pcs-vermelho-plp100rd-152273",
    "productUrl": "https://tonante.com.br/palheta-ibox-1-0mm-c-20-pcs-vermelho-plp100rd-152273"
  },
  {
    "id": 2,
    "sku": "17415",
    "name": "Suporte P/ Microfone Girafa Smmax Preto",
    "price": "R$ 229,90",
    "priceNum": 229.9,
    "rating": 4.9,
    "reviews": 329,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Microfone"
    ],
    "brand": "SMMax",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/7/17415.jpg-17458886356477024.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/7/17415.jpg-17458886356477024.jpeg",
    ],
    "inStock": true,
    "description": "Suporte P/ Microfone Girafa Smmax Preto. SMMax é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte P/ Microfone Girafa Smmax Preto</h2><p>Selecionado pela Tonante, o Suporte P/ Microfone Girafa Smmax Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Marca parceira: SMMax",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "17415"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "SMMax"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "suporte-p-microfone-girafa-smmax-preto-17415",
    "productUrl": "https://tonante.com.br/suporte-p-microfone-girafa-smmax-preto-17415"
  },
  {
    "id": 3,
    "sku": "29570",
    "name": "Suporte de Parede P/ Violao/guitarra AGS",
    "price": "R$ 119,90",
    "priceNum": 119.9,
    "rating": 4.8,
    "reviews": 166,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/9/29570_2-17459181526727946.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/9/29570_2-17459181526727946.jpeg",
    ],
    "inStock": true,
    "description": "Suporte de Parede P/ Violao/guitarra AGS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede P/ Violao/guitarra AGS</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede P/ Violao/guitarra AGS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "29570"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-p-violao-guitarra-ags-29570",
    "productUrl": "https://tonante.com.br/suporte-de-parede-p-violao-guitarra-ags-29570",
    "oldPrice": "R$ 129,90",
    "oldPriceNum": 129.9,
    "badge": "Oferta"
  },
  {
    "id": 4,
    "sku": "37641",
    "name": "Microfone com Cabo USB PODCAST-400U Preto",
    "price": "R$ 49,90",
    "priceNum": 49.9,
    "rating": 4.4,
    "reviews": 82,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/3/7/37641-17523305064321759.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/3/7/37641-17523305064321759.jpeg",
    ],
    "inStock": true,
    "description": "Microfone com Cabo USB PODCAST-400U Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone com Cabo USB PODCAST-400U Preto</h2><p>Parte da linha Tonante de acessórios, o Microfone com Cabo USB PODCAST-400U Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "37641"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-com-cabo-usb-podcast-400u-preto-37641",
    "productUrl": "https://tonante.com.br/microfone-com-cabo-usb-podcast-400u-preto-37641"
  },
  {
    "id": 5,
    "sku": "CP106936",
    "name": "Estante Para Partitura Portátil com Ajuste de Altura - Dobrável com BAG - TNE1954",
    "price": "R$ 39,90",
    "priceNum": 39.90,
    "rating": 4.7,
    "reviews": 349,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável",
      "Capa"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106936-17522920464015416.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106936-17522920464015416.jpeg"
    ],
    "inStock": true,
    "description": "Estante Para Partitura Portátil com Ajuste de Altura - Dobrável com BAG - TNE1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Estante Para Partitura Portátil com Ajuste de Altura - Dobrável com BAG - TNE1954</h2><p>Parte da linha Tonante de suportes, o Estante Para Partitura Portátil com Ajuste de Altura - Dobrável com BAG - TNE1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável · Capa",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106936"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "estante-para-partitura-portatil-com-ajuste-de-altura-dobravel-com-bag-tne1954-cp106936",
    "productUrl": "https://tonante.com.br/estante-para-partitura-portatil-com-ajuste-de-altura-dobravel-com-bag-tne1954-cp106936"
  },
  {
    "id": 6,
    "sku": "CP106942",
    "name": "Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954",
    "price": "R$ 39,90",
    "priceNum": 39.90,
    "rating": 4.6,
    "reviews": 458,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106942-17522545549759688.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106942-17522545549759688.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106942"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-guitarra-baixo-e-violao-tubular-dobravel-tns1954-cp106942",
    "productUrl": "https://tonante.com.br/suporte-para-guitarra-baixo-e-violao-tubular-dobravel-tns1954-cp106942"
  },
  {
    "id": 7,
    "sku": "CP106943",
    "name": "Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.5,
    "reviews": 487,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106943-17522519523585391.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106943-17522519523585391.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Para Guitarra, Baixo e Violão - Tubular - Dobrável - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106943"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-guitarra-baixo-e-violao-tubular-dobravel-tns1954-cp106943",
    "productUrl": "https://tonante.com.br/suporte-para-guitarra-baixo-e-violao-tubular-dobravel-tns1954-cp106943"
  },
  {
    "id": 8,
    "sku": "CP106944",
    "name": "Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954",
    "price": "R$ 34,90",
    "priceNum": 34.90,
    "rating": 4.8,
    "reviews": 400,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106944-17522514183928029.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106944-17522514183928029.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106944"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-guitarra-baixo-e-violao-tipo-cavalete-dobravel-tns1954-cp106944",
    "productUrl": "https://tonante.com.br/suporte-para-guitarra-baixo-e-violao-tipo-cavalete-dobravel-tns1954-cp106944",
    "oldPrice": "R$ 38,58",
    "oldPriceNum": 38.58,
    "badge": "Oferta"
  },
  {
    "id": 9,
    "sku": "CP106945",
    "name": "Suporte Para Teclado - Dobrável - TNS1954",
    "price": "R$ 63,90",
    "priceNum": 63.90,
    "rating": 4.7,
    "reviews": 429,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106945_3-17458116913004011.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106945_3-17458116913004011.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Teclado - Dobrável - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Teclado - Dobrável - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Para Teclado - Dobrável - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106945"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-teclado-dobravel-tns1954-cp106945",
    "productUrl": "https://tonante.com.br/suporte-para-teclado-dobravel-tns1954-cp106945",
    "oldPrice": "R$ 66,94",
    "oldPriceNum": 66.94,
    "badge": "Oferta"
  },
  {
    "id": 10,
    "sku": "CP106946",
    "name": "Suporte de Parede Para Guitarra, Baixo e Violão - TNS1954",
    "price": "R$ 13,90",
    "priceNum": 13.90,
    "rating": 4.4,
    "reviews": 342,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106946-17523128018929446.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106946-17523128018929446.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede Para Guitarra, Baixo e Violão - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede Para Guitarra, Baixo e Violão - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede Para Guitarra, Baixo e Violão - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106946"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-para-guitarra-baixo-e-violao-tns1954-cp106946",
    "productUrl": "https://tonante.com.br/suporte-de-parede-para-guitarra-baixo-e-violao-tns1954-cp106946"
  },
  {
    "id": 11,
    "sku": "CP106947",
    "name": "Pedestal Para Microfone Girafa com Cachimbo - TNP1954",
    "price": "R$ 64,90",
    "priceNum": 64.90,
    "rating": 4.9,
    "reviews": 371,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106947-17523431730061566.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106947-17523431730061566.jpeg"
    ],
    "inStock": true,
    "description": "Pedestal Para Microfone Girafa com Cachimbo - TNP1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Pedestal Para Microfone Girafa com Cachimbo - TNP1954</h2><p>Parte da linha Tonante de suportes, o Pedestal Para Microfone Girafa com Cachimbo - TNP1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106947"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "pedestal-para-microfone-girafa-com-cachimbo-tnp1954-cp106947",
    "productUrl": "https://tonante.com.br/pedestal-para-microfone-girafa-com-cachimbo-tnp1954-cp106947"
  },
  {
    "id": 12,
    "sku": "CP106949",
    "name": "Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954",
    "price": "R$ 34,90",
    "priceNum": 34.90,
    "rating": 4.7,
    "reviews": 307,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106949-17523362357634390.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/106949-17523362357634390.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Para Guitarra, Baixo e Violão - Tipo Cavalete - Dobrável - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Dobrável",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP106949"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-guitarra-baixo-e-violao-tipo-cavalete-dobravel-tns1954-cp106949",
    "productUrl": "https://tonante.com.br/suporte-para-guitarra-baixo-e-violao-tipo-cavalete-dobravel-tns1954-cp106949"
  },
  {
    "id": 13,
    "sku": "CP108160",
    "name": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Snow White - TV1954SW",
    "price": "R$ 437,90",
    "priceNum": 437.90,
    "badge": "Novidade",
    "rating": 4.6,
    "reviews": 438,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "Single-coil",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108160_1-17680520863657208.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108160_1-17680520863657208.jpeg",
      "https://cdn.oderco.com.br/produtos/108160/108160-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108160/108160-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Snow White - TV1954SW. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A VALENTINE'S</h2><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>A VALENTINE'S</h3><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>OPÇÕES PARA TODOS OS GOSTOS!</h3><p>Como de costume, a Tonante trouxe um lançamento com várias cores disponíveis para você poder escolher exatamente aquela que combina com o seu estilo.\nConheça agora nossas opções, cores disponíveis:</p>",
    "features": [
      "Formato: Ergonômico",
      "Timbre: Tradicional",
      "Público-alvo: Iniciantes",
      "Detalhes: Custo-benefício para dar aquele upgrade!"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108160"
      },
      {
        "label": "Formato",
        "value": "Ergonômico"
      },
      {
        "label": "Timbre",
        "value": "Tradicional"
      },
      {
        "label": "Público-alvo",
        "value": "Iniciantes"
      },
      {
        "label": "Detalhes",
        "value": "Custo-benefício para dar aquele upgrade!"
      }
    ],
    "seoSlug": "guitarra-eletrica-valentine-s-modelo-st-sss-snow-white-tv1954sw-cp108160",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-valentine-s-modelo-st-sss-snow-white-tv1954sw-cp108160"
  },
  {
    "id": 14,
    "sku": "CP108167",
    "name": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Deep Dark - TV1954DD",
    "price": "R$ 437,90",
    "priceNum": 437.90,
    "rating": 4.5,
    "reviews": 293,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "Single-coil",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108167_-17680521668965265.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108167_-17680521668965265.jpeg",
      "https://cdn.oderco.com.br/produtos/108167/108167-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108167/108167-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Deep Dark - TV1954DD. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A VALENTINE'S</h2><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>A VALENTINE'S</h3><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>OPÇÕES PARA TODOS OS GOSTOS!</h3><p>Como de costume, a Tonante trouxe um lançamento com várias cores disponíveis para você poder escolher exatamente aquela que combina com o seu estilo.\nConheça agora nossas opções, cores disponíveis:</p>",
    "features": [
      "Tipo: Guitarra elétrica",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 25.5\"",
      "Raio da escala: 9.5\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108167"
      },
      {
        "label": "Tipo",
        "value": "Guitarra elétrica"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "25.5\""
      },
      {
        "label": "Raio da escala",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast cromadas"
      },
      {
        "label": "Ponte",
        "value": "Tremolo estilo vintage"
      },
      {
        "label": "Captação",
        "value": "3 Single Coils"
      },
      {
        "label": "Controles",
        "value": "1 volume, 2 tones, chave seletora de 5 posições"
      }
    ],
    "seoSlug": "guitarra-eletrica-valentine-s-modelo-st-sss-deep-dark-tv1954dd-cp108167",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-valentine-s-modelo-st-sss-deep-dark-tv1954dd-cp108167"
  },
  {
    "id": 15,
    "sku": "CP108168",
    "name": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Sunset - TV1954SS",
    "price": "R$ 437,90",
    "priceNum": 437.90,
    "rating": 4.8,
    "reviews": 206,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "Single-coil",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108168_1-17680522492235093.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108168_1-17680522492235093.jpeg",
      "https://cdn.oderco.com.br/produtos/108168/108168-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108168/108168-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Sunset - TV1954SS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A VALENTINE'S</h2><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>A VALENTINE'S</h3><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>OPÇÕES PARA TODOS OS GOSTOS!</h3><p>Como de costume, a Tonante trouxe um lançamento com várias cores disponíveis para você poder escolher exatamente aquela que combina com o seu estilo.\nConheça agora nossas opções, cores disponíveis:</p>",
    "features": [
      "Tipo: Guitarra elétrica",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 25.5\"",
      "Raio da escala: 9.5\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108168"
      },
      {
        "label": "Tipo",
        "value": "Guitarra elétrica"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "25.5\""
      },
      {
        "label": "Raio da escala",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast cromadas"
      },
      {
        "label": "Ponte",
        "value": "Tremolo estilo vintage"
      },
      {
        "label": "Captação",
        "value": "3 Single Coils"
      },
      {
        "label": "Controles",
        "value": "1 volume, 2 tones, chave seletora de 5 posições"
      }
    ],
    "seoSlug": "guitarra-eletrica-valentine-s-modelo-st-sss-sunset-tv1954ss-cp108168",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-valentine-s-modelo-st-sss-sunset-tv1954ss-cp108168",
    "oldPrice": "R$ 490,45",
    "oldPriceNum": 490.45,
    "badge": "Oferta"
  },
  {
    "id": 16,
    "sku": "CP108169",
    "name": "Guitarra Elétrica Valentine's - Modelo St-sss - Lipstick RED - TV1954LR",
    "price": "R$ 437,90",
    "priceNum": 437.90,
    "rating": 4.8,
    "reviews": 188,
    "category": "Guitarras",
    "subcategory": "Les Paul",
    "tags": [
      "Guitarras",
      "Single-coil",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108169_1-17680523300367888.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108169_1-17680523300367888.jpeg",
      "https://cdn.oderco.com.br/produtos/108169/108169-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108169/108169-A6.png"
    ],
    "inStock": true,
    "description": "Corpo encorpado e dois humbuckers com presença de sobra. Peso, calor e sustain pra quem leva o palco a sério.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A VALENTINE'S</h2><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>A VALENTINE'S</h3><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>OPÇÕES PARA TODOS OS GOSTOS!</h3><p>Como de costume, a Tonante trouxe um lançamento com várias cores disponíveis para você poder escolher exatamente aquela que combina com o seu estilo.\nConheça agora nossas opções, cores disponíveis:</p>",
    "features": [
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: : Rosewood - 22T - C 25.5\" - R 9.5\"",
      "Nut: 42 mm",
      "Tarraxas: Chrome Die-cast",
      "Ponte: Vintage Tremolo"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108169"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": ": Rosewood - 22T - C 25.5\" - R 9.5\""
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Chrome Die-cast"
      },
      {
        "label": "Ponte",
        "value": "Vintage Tremolo"
      },
      {
        "label": "Captação",
        "value": "3 Single coils"
      },
      {
        "label": "Controles",
        "value": "1V, 2T - Chave 5 posições"
      },
      {
        "label": "Cor",
        "value": "Lipstick Red"
      }
    ],
    "seoSlug": "guitarra-eletrica-valentine-s-modelo-st-sss-lipstick-red-tv1954lr-cp108169",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-valentine-s-modelo-st-sss-lipstick-red-tv1954lr-cp108169",
    "oldPrice": "R$ 492,87",
    "oldPriceNum": 492.87,
    "badge": "Mais vendido"
  },
  {
    "id": 17,
    "sku": "CP108171",
    "name": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Blue Ocean - TV1954BO",
    "price": "R$ 437,90",
    "priceNum": 437.90,
    "rating": 4.8,
    "reviews": 110,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "Single-coil",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108171_1-17680524093678353.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108171_1-17680524093678353.jpeg",
      "https://cdn.oderco.com.br/produtos/108171/108171-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108171/108171-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Valentine's - Modelo ST- SSS - Blue Ocean - TV1954BO. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A VALENTINE'S</h2><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>A VALENTINE'S</h3><p>Essa nossa linha apresenta uma guitarra totalmente nova que incorpora avanços evolutivos no design, indicada principalmente para iniciantes, de todas as idades. É um instrumento marcante pela sua versatilidade e além de claro, carregar o legado da Tonante.</p><h3>OPÇÕES PARA TODOS OS GOSTOS!</h3><p>Como de costume, a Tonante trouxe um lançamento com várias cores disponíveis para você poder escolher exatamente aquela que combina com o seu estilo.\nConheça agora nossas opções, cores disponíveis:</p>",
    "features": [
      "Tipo: Guitarra elétrica",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 25.5\"",
      "Raio da escala: 9.5\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108171"
      },
      {
        "label": "Tipo",
        "value": "Guitarra elétrica"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "25.5\""
      },
      {
        "label": "Raio da escala",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast cromadas"
      },
      {
        "label": "Ponte",
        "value": "Tremolo estilo vintage"
      },
      {
        "label": "Captação",
        "value": "3 Single Coils"
      },
      {
        "label": "Controles",
        "value": "1 volume, 2 tones, chave seletora de 5 posições"
      }
    ],
    "seoSlug": "guitarra-eletrica-valentine-s-modelo-st-sss-blue-ocean-tv1954bo-cp108171",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-valentine-s-modelo-st-sss-blue-ocean-tv1954bo-cp108171"
  },
  {
    "id": 18,
    "sku": "CP108174",
    "name": "Guitarra Elétrica Cecille - Modelo TL - Cobalt Blue - TLC1954CB",
    "price": "R$ 544,90",
    "priceNum": 544.90,
    "rating": 4.9,
    "reviews": 255,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108174_1-17679922300566559.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108174_1-17679922300566559.jpeg",
      "https://cdn.oderco.com.br/produtos/108174/108174-A1..jpg",
      "https://cdn.oderco.com.br/produtos/108174/108174-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Cecille - Modelo TL - Cobalt Blue - TLC1954CB. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A CECILLE</h2><p>Apresenta design de corpo sólido em basswood, headstock e escudo customizados, controles separados de volume e tom e um braço parafusado, tem dois captadores e um tensor ajustável no braço. Esse instrumento tem aparência, sensação e som próprios. Muitas vezes descrito como \"twang\", o som será imediatamente apreciado por uma grande variedade de músicos.</p><h3>VERSÁTIL</h3><p>A simplicidade da Guitarra Elétrica Cecille, modelo TL, faz com que ela tenha um desempenho versátil. É uma ferramenta indispensável tanto para músicos de rock quanto de country e se tornou indelevelmente ligada a artistas individuais de ambos os gêneros, também é um dos modelos mais recomendados quando o assunto é Worship.</p><h3>PATRIMÔNIO E LEGADO</h3><p>Atualmente, a Cecille está disponível em uma variedade de cores para aproveitar!\nCORES DISPONÍVEIS:</p>",
    "features": [
      "Tipo: Guitarra elétrica",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 25.5\"",
      "Raio da escala: 9.5\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108174"
      },
      {
        "label": "Tipo",
        "value": "Guitarra elétrica"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "25.5\""
      },
      {
        "label": "Raio da escala",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast cromadas"
      },
      {
        "label": "Ponte",
        "value": "Estilo Pure Vintage"
      },
      {
        "label": "Captação",
        "value": "1 Single Coil + 1 Lipstick"
      },
      {
        "label": "Controles",
        "value": "1 volume, 1 tone, chave seletora de 3 posições"
      }
    ],
    "seoSlug": "guitarra-eletrica-cecille-modelo-tl-cobalt-blue-tlc1954cb-cp108174",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-cecille-modelo-tl-cobalt-blue-tlc1954cb-cp108174"
  },
  {
    "id": 19,
    "sku": "CP108177",
    "name": "Contrabaixo Elétrico - Jazzmine - Yellow Cake - 4 Cordas - TBJM1954YC",
    "price": "R$ 609,90",
    "priceNum": 609.90,
    "rating": 4.8,
    "reviews": 64,
    "category": "Contrabaixos",
    "subcategory": "Jazz Bass",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108177_-17680208889835810.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108177_-17680208889835810.jpeg",
      "https://cdn.oderco.com.br/produtos/108177/108177-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108177/108177-A6.png"
    ],
    "inStock": true,
    "description": "Dois captadores single-coil estilo JB e corpo leve. O groove limpo e articulado que segura a banda inteira.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 4 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108177"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 4 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-yellow-cake-4-cordas-tbjm1954yc-cp108177",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-yellow-cake-4-cordas-tbjm1954yc-cp108177",
    "badge": "Mais vendido"
  },
  {
    "id": 20,
    "sku": "CP108179",
    "name": "Contrabaixo Elétrico - Jazzmine - Deep Dark - 4 Cordas - TBJM1954DD",
    "price": "R$ 609,90",
    "priceNum": 609.90,
    "rating": 4.6,
    "reviews": 342,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108179_-17680209684252633.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108179_-17680209684252633.jpeg",
      "https://cdn.oderco.com.br/produtos/108179/108179-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108179/108179-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Jazzmine - Deep Dark - 4 Cordas - TBJM1954DD. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.\nImagem do banner - Design Próprio Tonante</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 4 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108179"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 4 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-deep-dark-4-cordas-tbjm1954dd-cp108179",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-deep-dark-4-cordas-tbjm1954dd-cp108179",
    "oldPrice": "R$ 768,71",
    "oldPriceNum": 768.71,
    "badge": "Oferta"
  },
  {
    "id": 21,
    "sku": "CP108180",
    "name": "Contrabaixo Elétrico - Jazzmine - Sunset - 4 Cordas - TBJM1954SS",
    "price": "R$ 609,90",
    "priceNum": 609.90,
    "rating": 4.8,
    "reviews": 41,
    "category": "Contrabaixos",
    "subcategory": "Jazz Bass",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108180_-17680210463088772.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108180_-17680210463088772.jpeg",
      "https://cdn.oderco.com.br/produtos/108180/108180-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108180/108180-A6.png"
    ],
    "inStock": true,
    "description": "A versão black do JazzMine. Mesmo timbre flexível, com atitude no visual.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 4 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108180"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 4 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-sunset-4-cordas-tbjm1954ss-cp108180",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-sunset-4-cordas-tbjm1954ss-cp108180"
  },
  {
    "id": 22,
    "sku": "CP108181",
    "name": "Contrabaixo Elétrico - Theodor - Nude Wood - 4 Cordas - TT1954NW",
    "price": "R$ 717,90",
    "priceNum": 717.90,
    "rating": 4.7,
    "reviews": 52,
    "category": "Contrabaixos",
    "subcategory": "Precision Bass",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108181_1-17680213671014443.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108181_1-17680213671014443.jpeg",
      "https://cdn.oderco.com.br/produtos/108181/108181-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108181/108181-A6.png"
    ],
    "inStock": true,
    "description": "O contrabaixo de toda gravadora. Punch grave e definição que atravessa qualquer mix.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108181"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "4 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-nude-wood-4-cordas-tt1954nw-cp108181",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-nude-wood-4-cordas-tt1954nw-cp108181",
    "oldPrice": "R$ 838,05",
    "oldPriceNum": 838.05,
    "badge": "Promoção"
  },
  {
    "id": 23,
    "sku": "CP108182",
    "name": "Contrabaixo Elétrico - Theodor - Merlot - 4 Cordas - TT1954ML",
    "price": "R$ 717,90",
    "priceNum": 717.90,
    "rating": 4.4,
    "reviews": 232,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108182_-17680215312874966.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108182_-17680215312874966.jpeg",
      "https://cdn.oderco.com.br/produtos/108182/108182-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108182/108182-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Theodor - Merlot - 4 Cordas - TT1954ML. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108182"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "4 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-merlot-4-cordas-tt1954ml-cp108182",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-merlot-4-cordas-tt1954ml-cp108182"
  },
  {
    "id": 24,
    "sku": "CP108183",
    "name": "Contrabaixo Elétrico - Theodor - Deep Dark - 4 Cordas - TT1954DD",
    "price": "R$ 717,90",
    "priceNum": 717.90,
    "rating": 4.9,
    "reviews": 261,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108183_1-17680214492912536.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108183_1-17680214492912536.jpeg",
      "https://cdn.oderco.com.br/produtos/108183/108183-A1.jpg",
      "https://cdn.oderco.com.br/produtos/108183/108183-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Theodor - Deep Dark - 4 Cordas - TT1954DD. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108183"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "4 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-deep-dark-4-cordas-tt1954dd-cp108183",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-deep-dark-4-cordas-tt1954dd-cp108183",
    "oldPrice": "R$ 918,92",
    "oldPriceNum": 918.92,
    "badge": "Oferta"
  },
  {
    "id": 25,
    "sku": "CP108184",
    "name": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Natural - VTL1954N",
    "price": "R$ 248,74",
    "priceNum": 248.74,
    "rating": 4.4,
    "reviews": 58,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108184_1-17692867433513200.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108184_1-17692867433513200.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Natural - VTL1954N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Lorenzzo 39\" - Nylon - Natural - VTL1954N</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Lorenzzo 39\" - Nylon - Natural - VTL1954N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108184"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-lorenzzo-39-nylon-natural-vtl1954n-cp108184",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-lorenzzo-39-nylon-natural-vtl1954n-cp108184"
  },
  {
    "id": 26,
    "sku": "CP108186",
    "name": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Brown - VTL1954M",
    "price": "R$ 259,00",
    "priceNum": 259.00,
    "rating": 4.8,
    "reviews": 116,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108186_1-17691781042869388.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108186_1-17691781042869388.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Brown - VTL1954M. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Lorenzzo 39\" - Nylon - Brown - VTL1954M</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Lorenzzo 39\" - Nylon - Brown - VTL1954M carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108186"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-lorenzzo-39-nylon-brown-vtl1954m-cp108186",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-lorenzzo-39-nylon-brown-vtl1954m-cp108186",
    "oldPrice": "R$ 297,91",
    "oldPriceNum": 297.91,
    "badge": "Oferta"
  },
  {
    "id": 27,
    "sku": "CP108187",
    "name": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Natural Fosco - VTLSC1954N",
    "price": "R$ 399,90",
    "priceNum": 399.90,
    "rating": 4.7,
    "reviews": 145,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108187_1-17458610515934347.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108187_1-17458610515934347.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Natural Fosco - VTLSC1954N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Natural Fosco - VTLSC1954N</h2><p>Parte da linha Tonante de violões, o Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Natural Fosco - VTLSC1954N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108187"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-natural-fosco-vtlsc1954n-cp108187",
    "productUrl": "https://tonante.com.br/violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-natural-fosco-vtlsc1954n-cp108187"
  },
  {
    "id": 28,
    "sku": "CP108189",
    "name": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Brown Fosco - VTLSC1954M",
    "price": "R$ 399,90",
    "priceNum": 399.90,
    "rating": 4.7,
    "reviews": 441,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108189_1-17459144899983650.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/108189_1-17459144899983650.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Brown Fosco - VTLSC1954M. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Brown Fosco - VTLSC1954M</h2><p>Parte da linha Tonante de violões, o Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon - Brown Fosco - VTLSC1954M carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP108189"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-brown-fosco-vtlsc1954m-cp108189",
    "productUrl": "https://tonante.com.br/violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-brown-fosco-vtlsc1954m-cp108189",
    "oldPrice": "R$ 499,88",
    "oldPriceNum": 499.88,
    "badge": "Oferta"
  },
  {
    "id": 29,
    "sku": "CP10964",
    "name": "Cabo de Guitarra Ninja Cable 0,20 MM P10/P10 10FT 3,05M Preto",
    "price": "R$ 48,90",
    "priceNum": 48.90,
    "rating": 4.6,
    "reviews": 120,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10964_1-17573495018096459.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10964_1-17573495018096459.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guitarra Ninja Cable 0,20 MM P10/P10 10FT 3,05M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guitarra Ninja Cable 0,20 MM P10/P10 10FT 3,05M Preto</h2><p>Selecionado pela Tonante, o Cabo de Guitarra Ninja Cable 0,20 MM P10/P10 10FT 3,05M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10964"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guitarra-ninja-cable-0-20-mm-p10-p10-10ft-3-05m-preto-cp10964",
    "productUrl": "https://tonante.com.br/cabo-de-guitarra-ninja-cable-0-20-mm-p10-p10-10ft-3-05m-preto-cp10964",
    "oldPrice": "R$ 60,71",
    "oldPriceNum": 60.71,
    "badge": "Oferta"
  },
  {
    "id": 30,
    "sku": "CP10966",
    "name": "Cabo de Microf. Ninja HG 0,20 MM P10/ XLR F. 03FT 0,91CM T",
    "price": "R$ 34,60",
    "priceNum": 34.60,
    "rating": 4.4,
    "reviews": 178,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10966_1-17573496127964037.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10966_1-17573496127964037.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Microf. Ninja HG 0,20 MM P10/ XLR F. 03FT 0,91CM T. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Microf. Ninja HG 0,20 MM P10/ XLR F. 03FT 0,91CM T</h2><p>Selecionado pela Tonante, o Cabo de Microf. Ninja HG 0,20 MM P10/ XLR F. 03FT 0,91CM T é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10966"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-03ft-0-91cm-t-cp10966",
    "productUrl": "https://tonante.com.br/cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-03ft-0-91cm-t-cp10966"
  },
  {
    "id": 31,
    "sku": "CP10967",
    "name": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 10FT 3,05M PT",
    "price": "R$ 43,50",
    "priceNum": 43.50,
    "rating": 4.9,
    "reviews": 207,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10967_1-17573496501567971.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10967_1-17573496501567971.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 10FT 3,05M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 10FT 3,05M PT</h2><p>Selecionado pela Tonante, o Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 10FT 3,05M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10967"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-10ft-3-05m-pt-cp10967",
    "productUrl": "https://tonante.com.br/cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-10ft-3-05m-pt-cp10967"
  },
  {
    "id": 32,
    "sku": "CP10968",
    "name": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR Femea 15FT 4,57M PT",
    "price": "R$ 48,70",
    "priceNum": 48.70,
    "rating": 4.4,
    "reviews": 474,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10968_1-17573497860192444.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10968_1-17573497860192444.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR Femea 15FT 4,57M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Microf. Ninja HG 0,20 MM P10/XLR Femea 15FT 4,57M PT</h2><p>Selecionado pela Tonante, o Cabo de Microf. Ninja HG 0,20 MM P10/XLR Femea 15FT 4,57M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10968"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-femea-15ft-4-57m-pt-cp10968",
    "productUrl": "https://tonante.com.br/cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-femea-15ft-4-57m-pt-cp10968"
  },
  {
    "id": 33,
    "sku": "CP10969",
    "name": "Cabo Para Microfone XLR M / XLR F Ninja LW 03FT 0,91M Preto",
    "price": "R$ 39,50",
    "priceNum": 39.50,
    "rating": 4.9,
    "reviews": 33,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10969-17458757270742827.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10969-17458757270742827.jpeg"
    ],
    "inStock": true,
    "description": "Cabo Para Microfone XLR M / XLR F Ninja LW 03FT 0,91M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo Para Microfone XLR M / XLR F Ninja LW 03FT 0,91M Preto</h2><p>Selecionado pela Tonante, o Cabo Para Microfone XLR M / XLR F Ninja LW 03FT 0,91M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10969"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-para-microfone-xlr-m-xlr-f-ninja-lw-03ft-0-91m-preto-cp10969",
    "productUrl": "https://tonante.com.br/cabo-para-microfone-xlr-m-xlr-f-ninja-lw-03ft-0-91m-preto-cp10969"
  },
  {
    "id": 34,
    "sku": "CP10971",
    "name": "Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F Ninja 15FT 4,57M Preto",
    "price": "R$ 53,25",
    "priceNum": 53.25,
    "rating": 4.8,
    "reviews": 366,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10971-17457919131095456.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/0/10971-17457919131095456.jpeg"
    ],
    "inStock": true,
    "description": "Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F Ninja 15FT 4,57M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F Ninja 15FT 4,57M Preto</h2><p>Selecionado pela Tonante, o Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F Ninja 15FT 4,57M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP10971"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-para-microf-ninja-lw-0-20-mm-xlr-m-xlr-f-ninja-15ft-4-57m-preto-cp10971",
    "productUrl": "https://tonante.com.br/cabo-para-microf-ninja-lw-0-20-mm-xlr-m-xlr-f-ninja-15ft-4-57m-preto-cp10971"
  },
  {
    "id": 35,
    "sku": "CP11002",
    "name": "Plug P10 Mono Ninja C/ Mola",
    "price": "R$ 9,25",
    "priceNum": 9.25,
    "rating": 4.6,
    "reviews": 430,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11002.jpg-17459198268275043.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11002.jpg-17459198268275043.jpeg"
    ],
    "inStock": true,
    "description": "Plug P10 Mono Ninja C/ Mola. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Plug P10 Mono Ninja C/ Mola</h2><p>Selecionado pela Tonante, o Plug P10 Mono Ninja C/ Mola é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP11002"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "plug-p10-mono-ninja-c-mola-cp11002",
    "productUrl": "https://tonante.com.br/plug-p10-mono-ninja-c-mola-cp11002"
  },
  {
    "id": 36,
    "sku": "CP11008",
    "name": "Plug XLR SAS 3 Pinos Linha Fêmea Niquelado L3FNN01",
    "price": "R$ 13,25",
    "priceNum": 13.25,
    "rating": 4.4,
    "reviews": 140,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11008.jpg-17460176305482622.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11008.jpg-17460176305482622.jpeg"
    ],
    "inStock": true,
    "description": "Plug XLR SAS 3 Pinos Linha Fêmea Niquelado L3FNN01. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Plug XLR SAS 3 Pinos Linha Fêmea Niquelado L3FNN01</h2><p>Parte da linha Tonante de acessórios, o Plug XLR SAS 3 Pinos Linha Fêmea Niquelado L3FNN01 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP11008"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "plug-xlr-sas-3-pinos-linha-femea-niquelado-l3fnn01-cp11008",
    "productUrl": "https://tonante.com.br/plug-xlr-sas-3-pinos-linha-femea-niquelado-l3fnn01-cp11008"
  },
  {
    "id": 37,
    "sku": "CP111578",
    "name": "Guitarra Elétrica Cecille - Modelo TL - Sangria - TLC1954SG",
    "price": "R$ 544,90",
    "priceNum": 544.90,
    "badge": "Novidade",
    "rating": 4.5,
    "reviews": 291,
    "category": "Guitarras",
    "tags": [
      "Guitarras",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111578_-17679923063815163.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111578_-17679923063815163.jpeg",
      "https://cdn.oderco.com.br/produtos/111578/111578-A1.1.jpg",
      "https://cdn.oderco.com.br/produtos/111578/111578-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Cecille - Modelo TL - Sangria - TLC1954SG. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>A CECILLE</h2><p>Apresenta design de corpo sólido em basswood, headstock e escudo customizados, controles separados de volume e tom e um braço parafusado, tem dois captadores e um tensor ajustável no braço. Esse instrumento tem aparência, sensação e som próprios. Muitas vezes descrito como \"twang\", o som será imediatamente apreciado por uma grande variedade de músicos.</p><h3>VERSÁTIL</h3><p>A simplicidade da Guitarra Elétrica Cecille, modelo TL, faz com que ela tenha um desempenho versátil. É uma ferramenta indispensável tanto para músicos de rock quanto de country e se tornou indelevelmente ligada a artistas individuais de ambos os gêneros, também é um dos modelos mais recomendados quando o assunto é Worship.</p><h3>PATRIMÔNIO E LEGADO</h3><p>Atualmente, a Cecille está disponível em uma variedade de cores para aproveitar!\nCORES DISPONÍVEIS:</p>",
    "features": [
      "Tipo: Guitarra elétrica",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Maple",
      "Comprimento de escala: 25.5\"",
      "Raio da escala: 9.5\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111578"
      },
      {
        "label": "Tipo",
        "value": "Guitarra elétrica"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Maple"
      },
      {
        "label": "Comprimento de escala",
        "value": "25.5\""
      },
      {
        "label": "Raio da escala",
        "value": "9.5\""
      },
      {
        "label": "Trastes",
        "value": "22"
      },
      {
        "label": "Nut",
        "value": "42 mm"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast cromadas"
      },
      {
        "label": "Ponte",
        "value": "Estilo Pure Vintage"
      },
      {
        "label": "Captação",
        "value": "1 Single Coil + 1 Lipstick"
      },
      {
        "label": "Controles",
        "value": "1 volume, 1 tone, chave seletora de 3 posições"
      }
    ],
    "seoSlug": "guitarra-eletrica-cecille-modelo-tl-sangria-tlc1954sg-cp111578",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-cecille-modelo-tl-sangria-tlc1954sg-cp111578"
  },
  {
    "id": 38,
    "sku": "CP111593",
    "name": "Guitarra Elétrica Star Light- SS - RED Sunset - TSL21954RS",
    "price": "R$ 699,90",
    "priceNum": 699.90,
    "rating": 4.4,
    "reviews": 464,
    "category": "Guitarras",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111593-17522971558727672.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111593-17522971558727672.jpeg"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Star Light- SS - RED Sunset - TSL21954RS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Guitarra Elétrica Star Light- SS - RED Sunset - TSL21954RS</h2><p>Parte da linha Tonante de guitarras, o Guitarra Elétrica Star Light- SS - RED Sunset - TSL21954RS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Guitarras",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111593"
      },
      {
        "label": "Categoria",
        "value": "Guitarras"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "guitarra-eletrica-star-light-ss-red-sunset-tsl21954rs-cp111593",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-star-light-ss-red-sunset-tsl21954rs-cp111593"
  },
  {
    "id": 39,
    "sku": "CP111594",
    "name": "Guitarra Elétrica Star Light -SS - Vanilla - TSL21954V",
    "price": "R$ 699,90",
    "priceNum": 699.90,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 319,
    "category": "Guitarras",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111594-17523728616964867.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111594-17523728616964867.jpeg"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Star Light -SS - Vanilla - TSL21954V. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Guitarra Elétrica Star Light -SS - Vanilla - TSL21954V</h2><p>Parte da linha Tonante de guitarras, o Guitarra Elétrica Star Light -SS - Vanilla - TSL21954V carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Guitarras",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111594"
      },
      {
        "label": "Categoria",
        "value": "Guitarras"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "guitarra-eletrica-star-light-ss-vanilla-tsl21954v-cp111594",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-star-light-ss-vanilla-tsl21954v-cp111594"
  },
  {
    "id": 40,
    "sku": "CP111597",
    "name": "Guitarra Elétrica Star Light - SS - Azure - TSL21954AZ",
    "price": "R$ 699,90",
    "priceNum": 699.90,
    "rating": 4.8,
    "reviews": 348,
    "category": "Guitarras",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111597-17523185382683191.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111597-17523185382683191.jpeg"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Star Light - SS - Azure - TSL21954AZ. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Guitarra Elétrica Star Light - SS - Azure - TSL21954AZ</h2><p>Parte da linha Tonante de guitarras, o Guitarra Elétrica Star Light - SS - Azure - TSL21954AZ carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Guitarras",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111597"
      },
      {
        "label": "Categoria",
        "value": "Guitarras"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "guitarra-eletrica-star-light-ss-azure-tsl21954az-cp111597",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-star-light-ss-azure-tsl21954az-cp111597",
    "oldPrice": "R$ 916,75",
    "oldPriceNum": 916.75,
    "badge": "Oferta"
  },
  {
    "id": 41,
    "sku": "CP111599",
    "name": "Contrabaixo Elétrico - Jazzmine - Yellow Cake - 5 Cordas - TBJM1954YC5",
    "price": "R$ 674,90",
    "priceNum": 674.90,
    "badge": "Novidade",
    "rating": 4.8,
    "reviews": 174,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111599_1-17680211236497029.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111599_1-17680211236497029.jpeg",
      "https://cdn.oderco.com.br/produtos/111599/111599-A1.jpg",
      "https://cdn.oderco.com.br/produtos/111599/111599-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Jazzmine - Yellow Cake - 5 Cordas - TBJM1954YC5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 5 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111599"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 5 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-yellow-cake-5-cordas-tbjm1954yc5-cp111599",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-yellow-cake-5-cordas-tbjm1954yc5-cp111599"
  },
  {
    "id": 42,
    "sku": "CP111601",
    "name": "Contrabaixo Elétrico - Jazzmine- Deep Dark- 5 Cordas - TBJM1954DD5",
    "price": "R$ 674,90",
    "priceNum": 674.90,
    "rating": 4.6,
    "reviews": 462,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111601_-17680212017815919.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111601_-17680212017815919.jpeg",
      "https://cdn.oderco.com.br/produtos/111601/111601-A1.jpg",
      "https://cdn.oderco.com.br/produtos/111601/111601-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Jazzmine- Deep Dark- 5 Cordas - TBJM1954DD5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 5 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111601"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 5 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-deep-dark-5-cordas-tbjm1954dd5-cp111601",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-deep-dark-5-cordas-tbjm1954dd5-cp111601",
    "oldPrice": "R$ 707,21",
    "oldPriceNum": 707.21,
    "badge": "Oferta"
  },
  {
    "id": 43,
    "sku": "CP111602",
    "name": "Contrabaixo Elétrico - Jazzmine- Sunset - 5 Cordas - TBJM1954SS5",
    "price": "R$ 674,90",
    "priceNum": 674.90,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 79,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111602_-17680212850399424.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111602_-17680212850399424.jpeg",
      "https://cdn.oderco.com.br/produtos/111602/111602-A1.jpg",
      "https://cdn.oderco.com.br/produtos/111602/111602-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Jazzmine- Sunset - 5 Cordas - TBJM1954SS5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O JazzMine</h2><p>Foi desenvolvido com o objetivo de proporcionar aos músicos um timbre mais limpo e articulado. Um dos baixos mais flexíveis e amplamente utilizados em vários gêneros musicais.</p><h3>Design Próprio Tonante</h3><p>Nosso instrumento foi meticulosamente projetado, desde a modelação e acabamento da madeira, até ao cuidado e consideração de cada detalhe.</p><h3>Estilo para todos os gostos</h3><p>Outras cores estão disponíveis, elaboradas para satisfazer todos os estilos de artistas!</p>",
    "features": [
      "Tipo: Contrabaixo modelo JB 5 cordas",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Tarraxas: Blindadas",
      "Captação: Passiva"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111602"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo modelo JB 5 cordas"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Tarraxas",
        "value": "Blindadas"
      },
      {
        "label": "Captação",
        "value": "Passiva"
      },
      {
        "label": "Captadores",
        "value": "2 Single Coils estilo JB com ímãs cerâmicos"
      },
      {
        "label": "Controles",
        "value": "2 volumes, 1 tone"
      },
      {
        "label": "Trastes",
        "value": "21 Jumbo"
      },
      {
        "label": "Tensor",
        "value": "Dual Action"
      },
      {
        "label": "Marcadores",
        "value": "Dot"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-jazzmine-sunset-5-cordas-tbjm1954ss5-cp111602",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-jazzmine-sunset-5-cordas-tbjm1954ss5-cp111602"
  },
  {
    "id": 44,
    "sku": "CP111603",
    "name": "Contrabaixo Elétrico - Theodor - Nude Wood - 5 Cordas - TT1954NW5",
    "price": "R$ 777,90",
    "priceNum": 777.90,
    "rating": 4.4,
    "reviews": 50,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111603_-17683010154697343.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111603_-17683010154697343.jpeg",
      "https://cdn.oderco.com.br/produtos/111604/111604-A1.jpg",
      "https://cdn.oderco.com.br/produtos/111604/111604-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Theodor - Nude Wood - 5 Cordas - TT1954NW5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111603"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "5 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-nude-wood-5-cordas-tt1954nw5-cp111603",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-nude-wood-5-cordas-tt1954nw5-cp111603"
  },
  {
    "id": 45,
    "sku": "CP111604",
    "name": "Contrabaixo Elétrico - Theodor - Merlot - 5 Cordas - TT1954ML5",
    "price": "R$ 777,90",
    "priceNum": 777.90,
    "badge": "Novidade",
    "rating": 4.7,
    "reviews": 137,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111604_-17683991153392531.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111604_-17683991153392531.jpeg",
      "https://cdn.oderco.com.br/produtos/111603/111603-A3.png",
      "https://cdn.oderco.com.br/Empresa/Produtos/Cabos/SKU123456/8"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Theodor - Merlot - 5 Cordas - TT1954ML5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111604"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "5 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-merlot-5-cordas-tt1954ml5-cp111604",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-merlot-5-cordas-tt1954ml5-cp111604"
  },
  {
    "id": 46,
    "sku": "CP111605",
    "name": "Contrabaixo Elétrico - Theodor - Deep Dark - 5 Cordas - TT1954DD5",
    "price": "R$ 777,90",
    "priceNum": 777.90,
    "rating": 4.8,
    "reviews": 108,
    "category": "Contrabaixos",
    "tags": [
      "Contrabaixos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111605_1-17682489091784786.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111605_1-17682489091784786.jpeg",
      "https://cdn.oderco.com.br/produtos/111605/111605-A1.jpg",
      "https://cdn.oderco.com.br/produtos/111605/111605-A6.png"
    ],
    "inStock": true,
    "description": "Contrabaixo Elétrico - Theodor - Deep Dark - 5 Cordas - TT1954DD5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>O Theodor</h2><p>É um baixo projetado para músicos que buscam qualidade &amp; versatilidade em um instrumento.\nCom corpo em Basswood, este instrumento oferece um som equilibrado, com boa definição e excelente resposta em todas as frequências. O braço em Maple garante resistência e durabilidade.</p><h3>Disponível em três opções de cores:</h3><p>- Nude Wood;\n- Merlot;\n- Deep Dark\nO Theodor oferece um visual elegante e moderno.</p>",
    "features": [
      "Tipo: Contrabaixo elétrico",
      "Corpo: Basswood",
      "Braço: Maple",
      "Escala: Rosewood",
      "Comprimento de escala: 34\"",
      "Raio da escala: 14\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111605"
      },
      {
        "label": "Tipo",
        "value": "Contrabaixo elétrico"
      },
      {
        "label": "Corpo",
        "value": "Basswood"
      },
      {
        "label": "Braço",
        "value": "Maple"
      },
      {
        "label": "Escala",
        "value": "Rosewood"
      },
      {
        "label": "Comprimento de escala",
        "value": "34\""
      },
      {
        "label": "Raio da escala",
        "value": "14\""
      },
      {
        "label": "Trastes",
        "value": "24"
      },
      {
        "label": "Cordas",
        "value": "5 cordas"
      },
      {
        "label": "Ponte",
        "value": "Standard"
      },
      {
        "label": "Tarraxas",
        "value": "Die-cast"
      },
      {
        "label": "Captação",
        "value": "2 Humbuckers estilo soapbar com ímãs cerâmicos"
      },
      {
        "label": "Equalização",
        "value": "Ativa"
      }
    ],
    "seoSlug": "contrabaixo-eletrico-theodor-deep-dark-5-cordas-tt1954dd5-cp111605",
    "productUrl": "https://tonante.com.br/contrabaixo-eletrico-theodor-deep-dark-5-cordas-tt1954dd5-cp111605"
  },
  {
    "id": 47,
    "sku": "CP111613",
    "name": "Violão Elétrico Abalone 40\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VGAB1954N40",
    "price": "R$ 499,99",
    "priceNum": 499.99,
    "rating": 4.9,
    "reviews": 351,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111613_1-17522907229355352.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111613_1-17522907229355352.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Abalone 40\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VGAB1954N40. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Abalone 40\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VGAB1954N40</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Abalone 40\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VGAB1954N40 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111613"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-abalone-40-natural-tampo-solido-em-spruce-eq-3-bandas-fosco-vgab1954n40-cp111613",
    "productUrl": "https://tonante.com.br/violao-eletrico-abalone-40-natural-tampo-solido-em-spruce-eq-3-bandas-fosco-vgab1954n40-cp111613"
  },
  {
    "id": 48,
    "sku": "CP111614",
    "name": "Violão Elétrico Abalone 41\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VFA1954N41",
    "price": "R$ 569,90",
    "priceNum": 569.90,
    "rating": 4.6,
    "reviews": 264,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111614_1-17496758262554069.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111614_1-17496758262554069.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Abalone 41\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VFA1954N41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Abalone 41\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VFA1954N41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Abalone 41\" - Natural - Tampo Sólido EM Spruce - EQ 3 Bandas - Fosco - VFA1954N41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111614"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-abalone-41-natural-tampo-solido-em-spruce-eq-3-bandas-fosco-vfa1954n41-cp111614",
    "productUrl": "https://tonante.com.br/violao-eletrico-abalone-41-natural-tampo-solido-em-spruce-eq-3-bandas-fosco-vfa1954n41-cp111614",
    "oldPrice": "R$ 673,98",
    "oldPriceNum": 673.98,
    "badge": "Oferta"
  },
  {
    "id": 49,
    "sku": "CP111616",
    "name": "Violão Elétrico Quartzo 40\" - Tampo Sólido EM Mahogany - Fosco - EQ 4 Bandas - VGAQ1954N40",
    "price": "R$ 839,90",
    "priceNum": 839.90,
    "rating": 4.8,
    "reviews": 206,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111616_-17774682560112308.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111616_-17774682560112308.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Quartzo 40\" - Tampo Sólido EM Mahogany - Fosco - EQ 4 Bandas - VGAQ1954N40. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Quartzo 40\" - Tampo Sólido EM Mahogany - Fosco - EQ 4 Bandas - VGAQ1954N40</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Quartzo 40\" - Tampo Sólido EM Mahogany - Fosco - EQ 4 Bandas - VGAQ1954N40 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111616"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-quartzo-40-tampo-solido-em-mahogany-fosco-eq-4-bandas-vgaq1954n40-cp111616",
    "productUrl": "https://tonante.com.br/violao-eletrico-quartzo-40-tampo-solido-em-mahogany-fosco-eq-4-bandas-vgaq1954n40-cp111616"
  },
  {
    "id": 50,
    "sku": "CP111630",
    "name": "Violão Elétrico Safira 41\" - Tampo EM Zebra - EQ 4 Bandas - Fosco - VSZ1954N41Z",
    "price": "R$ 489,90",
    "priceNum": 489.90,
    "rating": 4.4,
    "reviews": 62,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111630_1-17774819634096250.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111630_1-17774819634096250.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Safira 41\" - Tampo EM Zebra - EQ 4 Bandas - Fosco - VSZ1954N41Z. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Safira 41\" - Tampo EM Zebra - EQ 4 Bandas - Fosco - VSZ1954N41Z</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Safira 41\" - Tampo EM Zebra - EQ 4 Bandas - Fosco - VSZ1954N41Z carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111630"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-safira-41-tampo-em-zebra-eq-4-bandas-fosco-vsz1954n41z-cp111630",
    "productUrl": "https://tonante.com.br/violao-eletrico-safira-41-tampo-em-zebra-eq-4-bandas-fosco-vsz1954n41z-cp111630"
  },
  {
    "id": 51,
    "sku": "CP111631",
    "name": "Violão Elétrico Safira 41\"- Tampo EM Spruce - EQ 4 Bandas - Fosco - VSL1954N41L",
    "price": "R$ 489,90",
    "priceNum": 489.90,
    "rating": 4.9,
    "reviews": 91,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111631_1-17774820006368463.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111631_1-17774820006368463.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Safira 41\"- Tampo EM Spruce - EQ 4 Bandas - Fosco - VSL1954N41L. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Safira 41\"- Tampo EM Spruce - EQ 4 Bandas - Fosco - VSL1954N41L</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Safira 41\"- Tampo EM Spruce - EQ 4 Bandas - Fosco - VSL1954N41L carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111631"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-safira-41-tampo-em-spruce-eq-4-bandas-fosco-vsl1954n41l-cp111631",
    "productUrl": "https://tonante.com.br/violao-eletrico-safira-41-tampo-em-spruce-eq-4-bandas-fosco-vsl1954n41l-cp111631"
  },
  {
    "id": 52,
    "sku": "CP111643",
    "name": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN41",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.8,
    "reviews": 44,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111643-17522980454421331.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111643-17522980454421331.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111643"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-41-tampo-solido-em-spruce-clear-natural-eq-3-bandas-vgac1954cn41-cp111643",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-41-tampo-solido-em-spruce-clear-natural-eq-3-bandas-vgac1954cn41-cp111643",
    "oldPrice": "R$ 613,82",
    "oldPriceNum": 613.82,
    "badge": "Oferta"
  },
  {
    "id": 53,
    "sku": "CP111644",
    "name": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW41",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.7,
    "reviews": 369,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111644-17522908245393531.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111644-17522908245393531.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111644"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-41-tampo-solido-em-spruce-dark-wood-eq-3-bandas-vgac1954dw41-cp111644",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-41-tampo-solido-em-spruce-dark-wood-eq-3-bandas-vgac1954dw41-cp111644",
    "oldPrice": "R$ 666,13",
    "oldPriceNum": 666.13,
    "badge": "Oferta"
  },
  {
    "id": 54,
    "sku": "CP111645",
    "name": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS41",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.8,
    "reviews": 340,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111645-17523725954076509.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111645-17523725954076509.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111645"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-41-tampo-solido-em-spruce-dark-spruce-eq-3-bandas-vgac1954ds41-cp111645",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-41-tampo-solido-em-spruce-dark-spruce-eq-3-bandas-vgac1954ds41-cp111645"
  },
  {
    "id": 55,
    "sku": "CP111646",
    "name": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Sunset - EQ 3 Bandas - VGAC1954S41",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "badge": "Novidade",
    "rating": 4.5,
    "reviews": 427,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111646-17523286356236629.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111646-17523286356236629.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Sunset - EQ 3 Bandas - VGAC1954S41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Sunset - EQ 3 Bandas - VGAC1954S41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Sunset - EQ 3 Bandas - VGAC1954S41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111646"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-41-tampo-solido-em-spruce-sunset-eq-3-bandas-vgac1954s41-cp111646",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-41-tampo-solido-em-spruce-sunset-eq-3-bandas-vgac1954s41-cp111646"
  },
  {
    "id": 56,
    "sku": "CP111647",
    "name": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Blue Wood - EQ 3 Bandas - VGAC1954BW41",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.6,
    "reviews": 398,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111647-17522981473449179.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111647-17522981473449179.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Blue Wood - EQ 3 Bandas - VGAC1954BW41. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Blue Wood - EQ 3 Bandas - VGAC1954BW41</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 41\" - Tampo Sólido EM Spruce - Blue Wood - EQ 3 Bandas - VGAC1954BW41 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111647"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-41-tampo-solido-em-spruce-blue-wood-eq-3-bandas-vgac1954bw41-cp111647",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-41-tampo-solido-em-spruce-blue-wood-eq-3-bandas-vgac1954bw41-cp111647",
    "oldPrice": "R$ 628,96",
    "oldPriceNum": 628.96,
    "badge": "Oferta"
  },
  {
    "id": 57,
    "sku": "CP111648",
    "name": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN40",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.7,
    "reviews": 247,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111648-17522982449924071.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111648-17522982449924071.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN40. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN40</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Clear Natural - EQ 3 Bandas - VGAC1954CN40 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111648"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-40-tampo-solido-em-spruce-clear-natural-eq-3-bandas-vgac1954cn40-cp111648",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-40-tampo-solido-em-spruce-clear-natural-eq-3-bandas-vgac1954cn40-cp111648"
  },
  {
    "id": 58,
    "sku": "CP111649",
    "name": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW40",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.8,
    "reviews": 218,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111649-17523723615448329.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111649-17523723615448329.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW40. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW40</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Wood - EQ 3 Bandas - VGAC1954DW40 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111649"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-40-tampo-solido-em-spruce-dark-wood-eq-3-bandas-vgac1954dw40-cp111649",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-40-tampo-solido-em-spruce-dark-wood-eq-3-bandas-vgac1954dw40-cp111649",
    "oldPrice": "R$ 642,94",
    "oldPriceNum": 642.94,
    "badge": "Oferta"
  },
  {
    "id": 59,
    "sku": "CP111650",
    "name": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS40",
    "price": "R$ 519,90",
    "priceNum": 519.90,
    "rating": 4.4,
    "reviews": 326,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111650-17523496277887760.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/111650-17523496277887760.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS40. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS40</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Coral 40\" - Tampo Sólido EM Spruce - Dark Spruce - EQ 3 Bandas - VGAC1954DS40 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP111650"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-coral-40-tampo-solido-em-spruce-dark-spruce-eq-3-bandas-vgac1954ds40-cp111650",
    "productUrl": "https://tonante.com.br/violao-eletrico-coral-40-tampo-solido-em-spruce-dark-spruce-eq-3-bandas-vgac1954ds40-cp111650"
  },
  {
    "id": 60,
    "sku": "CP112213",
    "name": "Violão Elétrico Magma 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 4 Bandas - TVM1954",
    "price": "R$ 649,90",
    "priceNum": 649.90,
    "rating": 4.4,
    "reviews": 324,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112213-17523500660374203.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112213-17523500660374203.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Magma 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 4 Bandas - TVM1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Magma 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 4 Bandas - TVM1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Magma 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 4 Bandas - TVM1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112213"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-magma-40-tampo-em-mahogany-acabamento-gloss-eq-4-bandas-tvm1954-cp112213",
    "productUrl": "https://tonante.com.br/violao-eletrico-magma-40-tampo-em-mahogany-acabamento-gloss-eq-4-bandas-tvm1954-cp112213",
    "badge": "Oferta"
  },
  {
    "id": 61,
    "sku": "CP112214",
    "name": "Violão Elétrico Opala 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 3 Bandas - TVOP1954",
    "price": "R$ 599,90",
    "priceNum": 599.90,
    "rating": 4.9,
    "reviews": 57,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112214-17523569234116658.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112214-17523569234116658.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Opala 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 3 Bandas - TVOP1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Opala 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 3 Bandas - TVOP1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Opala 40\" - Tampo EM Mahogany - Acabamento Gloss - EQ 3 Bandas - TVOP1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112214"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-opala-40-tampo-em-mahogany-acabamento-gloss-eq-3-bandas-tvop1954-cp112214",
    "productUrl": "https://tonante.com.br/violao-eletrico-opala-40-tampo-em-mahogany-acabamento-gloss-eq-3-bandas-tvop1954-cp112214"
  },
  {
    "id": 62,
    "sku": "CP112217",
    "name": "Violão Elétrico Ônix 40\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVO1954",
    "price": "R$ 529,90",
    "priceNum": 529.90,
    "badge": "Novidade",
    "rating": 4.6,
    "reviews": 440,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112217-17523634973322788.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112217-17523634973322788.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Ônix 40\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVO1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Ônix 40\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVO1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Ônix 40\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVO1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112217"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-onix-40-tampo-em-spruce-acabamento-fosco-eq-3-bandas-tvo1954-cp112217",
    "productUrl": "https://tonante.com.br/violao-eletrico-onix-40-tampo-em-spruce-acabamento-fosco-eq-3-bandas-tvo1954-cp112217"
  },
  {
    "id": 63,
    "sku": "CP112218",
    "name": "Violão Elétrico Ametista Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - VTAM1954",
    "price": "R$ 529,90",
    "priceNum": 529.90,
    "rating": 4.9,
    "reviews": 179,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112218-17522509662142752.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112218-17522509662142752.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Ametista Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - VTAM1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Ametista Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - VTAM1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Ametista Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - VTAM1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112218"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-ametista-mini-36-tampo-em-spruce-acabamento-fosco-eq-3-bandas-vtam1954-cp112218",
    "productUrl": "https://tonante.com.br/violao-eletrico-ametista-mini-36-tampo-em-spruce-acabamento-fosco-eq-3-bandas-vtam1954-cp112218",
    "oldPrice": "R$ 555,75",
    "oldPriceNum": 555.75,
    "badge": "Oferta"
  },
  {
    "id": 64,
    "sku": "CP112220",
    "name": "Violão Elétrico Granada 40\" - Tampo EM Walnut - Acabamento Fosco - EQ 3 Bandas - VTG1954",
    "price": "R$ 539,91",
    "priceNum": 539.91,
    "rating": 4.6,
    "reviews": 100,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112220_2-17458647598892637.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112220_2-17458647598892637.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Granada 40\" - Tampo EM Walnut - Acabamento Fosco - EQ 3 Bandas - VTG1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Granada 40\" - Tampo EM Walnut - Acabamento Fosco - EQ 3 Bandas - VTG1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Granada 40\" - Tampo EM Walnut - Acabamento Fosco - EQ 3 Bandas - VTG1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112220"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-granada-40-tampo-em-walnut-acabamento-fosco-eq-3-bandas-vtg1954-cp112220",
    "productUrl": "https://tonante.com.br/violao-eletrico-granada-40-tampo-em-walnut-acabamento-fosco-eq-3-bandas-vtg1954-cp112220"
  },
  {
    "id": 65,
    "sku": "CP112362",
    "name": "Encordoamento Violao ACO EJ11 012",
    "price": "R$ 56,50",
    "priceNum": 56.50,
    "rating": 4.5,
    "reviews": 185,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112362-17459262031402442.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112362-17459262031402442.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO EJ11 012. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO EJ11 012</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO EJ11 012 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112362"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-ej11-012-cp112362",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-ej11-012-cp112362"
  },
  {
    "id": 66,
    "sku": "CP112392",
    "name": "Microfones Pulse PRO 2 sem FIO + Receiver - SP801",
    "price": "R$ 359,00",
    "priceNum": 359.00,
    "rating": 4.8,
    "reviews": 238,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112392-1-17642509856531753.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/112392-1-17642509856531753.jpeg"
    ],
    "inStock": true,
    "description": "Microfones Pulse PRO 2 sem FIO + Receiver - SP801. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfones Pulse PRO 2 sem FIO + Receiver - SP801</h2><p>Parte da linha Tonante de acessórios, o Microfones Pulse PRO 2 sem FIO + Receiver - SP801 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP112392"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfones-pulse-pro-2-sem-fio-receiver-sp801-cp112392",
    "productUrl": "https://tonante.com.br/microfones-pulse-pro-2-sem-fio-receiver-sp801-cp112392"
  },
  {
    "id": 67,
    "sku": "CP11706",
    "name": "Microfone Profissional MC-200 Prata",
    "price": "R$ 169,90",
    "priceNum": 169.9,
    "rating": 4.5,
    "reviews": 299,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11706.jpg-17523313462302649.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/1/11706.jpg-17523313462302649.jpeg"
    ],
    "inStock": true,
    "description": "Microfone Profissional MC-200 Prata. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone Profissional MC-200 Prata</h2><p>Parte da linha Tonante de acessórios, o Microfone Profissional MC-200 Prata carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP11706"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-profissional-mc-200-prata-cp11706",
    "productUrl": "https://tonante.com.br/microfone-profissional-mc-200-prata-cp11706",
    "oldPrice": "R$ 189,90",
    "oldPriceNum": 189.9,
    "badge": "Oferta"
  },
  {
    "id": 68,
    "sku": "CP13201",
    "name": "Cabo de Guitarra Angel TX 0,30MM P10/P10 90º 10FT 3,05M Textil",
    "price": "R$ 52,25",
    "priceNum": 52.25,
    "rating": 4.9,
    "reviews": 399,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13201_1-17573494242192622.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13201_1-17573494242192622.png"
    ],
    "inStock": true,
    "description": "Cabo de Guitarra Angel TX 0,30MM P10/P10 90º 10FT 3,05M Textil. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guitarra Angel TX 0,30MM P10/P10 90º 10FT 3,05M Textil</h2><p>Selecionado pela Tonante, o Cabo de Guitarra Angel TX 0,30MM P10/P10 90º 10FT 3,05M Textil é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13201"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guitarra-angel-tx-0-30mm-p10-p10-90-10ft-3-05m-textil-cp13201",
    "productUrl": "https://tonante.com.br/cabo-de-guitarra-angel-tx-0-30mm-p10-p10-90-10ft-3-05m-textil-cp13201",
    "oldPrice": "R$ 66,67",
    "oldPriceNum": 66.67,
    "badge": "Oferta"
  },
  {
    "id": 69,
    "sku": "CP13202",
    "name": "Cabo de Guitarra Angel TX 0,30 MM P10/P10 90º 15FT 4,57M Textil",
    "price": "R$ 74,90",
    "priceNum": 74.90,
    "rating": 4.8,
    "reviews": 428,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13202_1-17573492321702087.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13202_1-17573492321702087.png"
    ],
    "inStock": true,
    "description": "Cabo de Guitarra Angel TX 0,30 MM P10/P10 90º 15FT 4,57M Textil. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guitarra Angel TX 0,30 MM P10/P10 90º 15FT 4,57M Textil</h2><p>Selecionado pela Tonante, o Cabo de Guitarra Angel TX 0,30 MM P10/P10 90º 15FT 4,57M Textil é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13202"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guitarra-angel-tx-0-30-mm-p10-p10-90-15ft-4-57m-textil-cp13202",
    "productUrl": "https://tonante.com.br/cabo-de-guitarra-angel-tx-0-30-mm-p10-p10-90-15ft-4-57m-textil-cp13202"
  },
  {
    "id": 70,
    "sku": "CP13205",
    "name": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 25FT 7,62M Preto",
    "price": "R$ 73,90",
    "priceNum": 73.90,
    "rating": 4.5,
    "reviews": 45,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13205_1-17573497533487480.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13205_1-17573497533487480.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 25FT 7,62M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 25FT 7,62M Preto</h2><p>Selecionado pela Tonante, o Cabo de Microf. Ninja HG 0,20 MM P10/XLR F. 25FT 7,62M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13205"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-25ft-7-62m-preto-cp13205",
    "productUrl": "https://tonante.com.br/cabo-de-microf-ninja-hg-0-20-mm-p10-xlr-f-25ft-7-62m-preto-cp13205",
    "oldPrice": "R$ 98,62",
    "oldPriceNum": 98.62,
    "badge": "Oferta"
  },
  {
    "id": 71,
    "sku": "CP13206",
    "name": "Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F 20FT 6,10M Preto",
    "price": "R$ 69,90",
    "priceNum": 69.90,
    "rating": 4.4,
    "reviews": 74,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13206-17569949626965955.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13206-17569949626965955.jpeg"
    ],
    "inStock": true,
    "description": "Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F 20FT 6,10M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F 20FT 6,10M Preto</h2><p>Selecionado pela Tonante, o Cabo Para Microf. Ninja LW 0,20 MM XLR M/ XLR F 20FT 6,10M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13206"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-para-microf-ninja-lw-0-20-mm-xlr-m-xlr-f-20ft-6-10m-preto-cp13206",
    "productUrl": "https://tonante.com.br/cabo-para-microf-ninja-lw-0-20-mm-xlr-m-xlr-f-20ft-6-10m-preto-cp13206",
    "oldPrice": "R$ 81,56",
    "oldPriceNum": 81.56,
    "badge": "Oferta"
  },
  {
    "id": 72,
    "sku": "CP13207",
    "name": "Cabo Para Microfone XLR M / XLR F Ninja LW 25FT 7,62M Preto",
    "price": "R$ 82,90",
    "priceNum": 82.90,
    "rating": 4.9,
    "reviews": 103,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13207-17569946547853736.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13207-17569946547853736.jpeg"
    ],
    "inStock": true,
    "description": "Cabo Para Microfone XLR M / XLR F Ninja LW 25FT 7,62M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo Para Microfone XLR M / XLR F Ninja LW 25FT 7,62M Preto</h2><p>Selecionado pela Tonante, o Cabo Para Microfone XLR M / XLR F Ninja LW 25FT 7,62M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13207"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-para-microfone-xlr-m-xlr-f-ninja-lw-25ft-7-62m-preto-cp13207",
    "productUrl": "https://tonante.com.br/cabo-para-microfone-xlr-m-xlr-f-ninja-lw-25ft-7-62m-preto-cp13207"
  },
  {
    "id": 73,
    "sku": "CP13228",
    "name": "Cabo de Guitarra Angel L 0,30MM P10/P10 90º 10FT 3,05 M Preto",
    "price": "R$ 50,90",
    "priceNum": 50.90,
    "rating": 4.4,
    "reviews": 402,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13228_1-17573491218686946.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13228_1-17573491218686946.png"
    ],
    "inStock": true,
    "description": "Cabo de Guitarra Angel L 0,30MM P10/P10 90º 10FT 3,05 M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guitarra Angel L 0,30MM P10/P10 90º 10FT 3,05 M Preto</h2><p>Selecionado pela Tonante, o Cabo de Guitarra Angel L 0,30MM P10/P10 90º 10FT 3,05 M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13228"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guitarra-angel-l-0-30mm-p10-p10-90-10ft-3-05-m-preto-cp13228",
    "productUrl": "https://tonante.com.br/cabo-de-guitarra-angel-l-0-30mm-p10-p10-90-10ft-3-05-m-preto-cp13228",
    "oldPrice": "R$ 52,66",
    "oldPriceNum": 52.66,
    "badge": "Oferta"
  },
  {
    "id": 74,
    "sku": "CP13230",
    "name": "Cabo de Guitarra Angel L 0,30MM P10/P10 90º 20FT 6,10M Preto",
    "price": "R$ 84,90",
    "priceNum": 84.90,
    "rating": 4.5,
    "reviews": 329,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13230_1-17573491788535710.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/3/13230_1-17573491788535710.png"
    ],
    "inStock": true,
    "description": "Cabo de Guitarra Angel L 0,30MM P10/P10 90º 20FT 6,10M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guitarra Angel L 0,30MM P10/P10 90º 20FT 6,10M Preto</h2><p>Selecionado pela Tonante, o Cabo de Guitarra Angel L 0,30MM P10/P10 90º 20FT 6,10M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP13230"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guitarra-angel-l-0-30mm-p10-p10-90-20ft-6-10m-preto-cp13230",
    "productUrl": "https://tonante.com.br/cabo-de-guitarra-angel-l-0-30mm-p10-p10-90-20ft-6-10m-preto-cp13230"
  },
  {
    "id": 75,
    "sku": "CP1403",
    "name": "Microfone Profissional SM58 P4 BK Preto Fosco",
    "price": "R$ 98,90",
    "priceNum": 98.90,
    "rating": 4.4,
    "reviews": 74,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/1403-1-17484544833202985.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/1403-1-17484544833202985.jpeg"
    ],
    "inStock": true,
    "description": "Microfone Profissional SM58 P4 BK Preto Fosco. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone Profissional SM58 P4 BK Preto Fosco</h2><p>Parte da linha Tonante de acessórios, o Microfone Profissional SM58 P4 BK Preto Fosco carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP1403"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-profissional-sm58-p4-bk-preto-fosco-cp1403",
    "productUrl": "https://tonante.com.br/microfone-profissional-sm58-p4-bk-preto-fosco-cp1403"
  },
  {
    "id": 76,
    "sku": "CP143025",
    "name": "Microfone Dinamico Preto Brilhante MC200",
    "price": "R$ 209,90",
    "priceNum": 209.9,
    "rating": 4.7,
    "reviews": 175,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/143025-3-17637380795897290.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/143025-3-17637380795897290.jpeg"
    ],
    "inStock": true,
    "description": "Microfone Dinamico Preto Brilhante MC200. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone Dinamico Preto Brilhante MC200</h2><p>Parte da linha Tonante de acessórios, o Microfone Dinamico Preto Brilhante MC200 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP143025"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-dinamico-preto-brilhante-mc200-cp143025",
    "productUrl": "https://tonante.com.br/microfone-dinamico-preto-brilhante-mc200-cp143025"
  },
  {
    "id": 77,
    "sku": "CP146108",
    "name": "Suporte Triplo Para Guitarra, Baixo e Violão -TNS1954",
    "price": "R$ 99,90",
    "priceNum": 99.90,
    "rating": 4.4,
    "reviews": 260,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146108-17459061237573801.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146108-17459061237573801.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Triplo Para Guitarra, Baixo e Violão -TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Triplo Para Guitarra, Baixo e Violão -TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte Triplo Para Guitarra, Baixo e Violão -TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP146108"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-triplo-para-guitarra-baixo-e-violao-tns1954-cp146108",
    "productUrl": "https://tonante.com.br/suporte-triplo-para-guitarra-baixo-e-violao-tns1954-cp146108"
  },
  {
    "id": 78,
    "sku": "CP146109",
    "name": "Suporte de Parede Para Guitarra, Baixo e Violão Slatwall com Regulagem - TNS1954",
    "price": "R$ 37,80",
    "priceNum": 37.80,
    "rating": 4.9,
    "reviews": 289,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146109-17523709938482355.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146109-17523709938482355.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede Para Guitarra, Baixo e Violão Slatwall com Regulagem - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede Para Guitarra, Baixo e Violão Slatwall com Regulagem - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede Para Guitarra, Baixo e Violão Slatwall com Regulagem - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP146109"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-para-guitarra-baixo-e-violao-slatwall-com-regulagem-tns1954-cp146109",
    "productUrl": "https://tonante.com.br/suporte-de-parede-para-guitarra-baixo-e-violao-slatwall-com-regulagem-tns1954-cp146109"
  },
  {
    "id": 79,
    "sku": "CP146110",
    "name": "Suporte de Parede Para Guitarra, Baixo e Violão com Trava - TNS1954",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.9,
    "reviews": 479,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146110-17522530403104114.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/146110-17522530403104114.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede Para Guitarra, Baixo e Violão com Trava - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede Para Guitarra, Baixo e Violão com Trava - TNS1954</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede Para Guitarra, Baixo e Violão com Trava - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP146110"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-para-guitarra-baixo-e-violao-com-trava-tns1954-cp146110",
    "productUrl": "https://tonante.com.br/suporte-de-parede-para-guitarra-baixo-e-violao-com-trava-tns1954-cp146110"
  },
  {
    "id": 80,
    "sku": "CP14855",
    "name": "Microfone com FIO Profissional FNK5",
    "price": "R$ 73,00",
    "priceNum": 73.00,
    "rating": 4.9,
    "reviews": 247,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/14855.jpg-17573354444459416.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/4/14855.jpg-17573354444459416.jpeg"
    ],
    "inStock": true,
    "description": "Microfone com FIO Profissional FNK5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone com FIO Profissional FNK5</h2><p>Parte da linha Tonante de acessórios, o Microfone com FIO Profissional FNK5 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP14855"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-com-fio-profissional-fnk5-cp14855",
    "productUrl": "https://tonante.com.br/microfone-com-fio-profissional-fnk5-cp14855"
  },
  {
    "id": 81,
    "sku": "CP152259",
    "name": "Damper em Couro e TAG em Metal Prata Metal DMMD01",
    "price": "R$ 29,60",
    "priceNum": 29.60,
    "rating": 4.4,
    "reviews": 218,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152259-17458629760564369.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152259-17458629760564369.jpeg"
    ],
    "inStock": true,
    "description": "Damper em Couro e TAG em Metal Prata Metal DMMD01. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Damper em Couro e TAG em Metal Prata Metal DMMD01</h2><p>Parte da linha Tonante de acessórios, o Damper em Couro e TAG em Metal Prata Metal DMMD01 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152259"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "damper-em-couro-e-tag-em-metal-prata-metal-dmmd01-cp152259",
    "productUrl": "https://tonante.com.br/damper-em-couro-e-tag-em-metal-prata-metal-dmmd01-cp152259"
  },
  {
    "id": 82,
    "sku": "CP152260",
    "name": "Damper em Couro e TAG em Metal Dourado Metalico DMMD02",
    "price": "R$ 29,60",
    "priceNum": 29.60,
    "rating": 4.6,
    "reviews": 168,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152260-17458693297278892.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152260-17458693297278892.jpeg"
    ],
    "inStock": true,
    "description": "Damper em Couro e TAG em Metal Dourado Metalico DMMD02. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Damper em Couro e TAG em Metal Dourado Metalico DMMD02</h2><p>Parte da linha Tonante de acessórios, o Damper em Couro e TAG em Metal Dourado Metalico DMMD02 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152260"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "damper-em-couro-e-tag-em-metal-dourado-metalico-dmmd02-cp152260",
    "productUrl": "https://tonante.com.br/damper-em-couro-e-tag-em-metal-dourado-metalico-dmmd02-cp152260",
    "badge": "Oferta"
  },
  {
    "id": 83,
    "sku": "CP152261",
    "name": "Damper Ibox em Couro e TAG em Metal Vermelho Metalico DMMD04",
    "price": "R$ 29,60",
    "priceNum": 29.60,
    "rating": 4.5,
    "reviews": 197,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152261-17458494703688373.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152261-17458494703688373.jpeg"
    ],
    "inStock": true,
    "description": "Damper Ibox em Couro e TAG em Metal Vermelho Metalico DMMD04. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Damper Ibox em Couro e TAG em Metal Vermelho Metalico DMMD04</h2><p>Selecionado pela Tonante, o Damper Ibox em Couro e TAG em Metal Vermelho Metalico DMMD04 é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152261"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "damper-ibox-em-couro-e-tag-em-metal-vermelho-metalico-dmmd04-cp152261",
    "productUrl": "https://tonante.com.br/damper-ibox-em-couro-e-tag-em-metal-vermelho-metalico-dmmd04-cp152261"
  },
  {
    "id": 84,
    "sku": "CP152262",
    "name": "Damper em Couro e TAG em Metal Preto DSMD02",
    "price": "R$ 29,60",
    "priceNum": 29.60,
    "rating": 4.8,
    "reviews": 110,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152262-17459240515504932.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152262-17459240515504932.jpeg"
    ],
    "inStock": true,
    "description": "Damper em Couro e TAG em Metal Preto DSMD02. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Damper em Couro e TAG em Metal Preto DSMD02</h2><p>Parte da linha Tonante de acessórios, o Damper em Couro e TAG em Metal Preto DSMD02 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152262"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "damper-em-couro-e-tag-em-metal-preto-dsmd02-cp152262",
    "productUrl": "https://tonante.com.br/damper-em-couro-e-tag-em-metal-preto-dsmd02-cp152262"
  },
  {
    "id": 85,
    "sku": "CP152264",
    "name": "Damper em Poliester e TAG em Metal Marrom DTMD18",
    "price": "R$ 29,60",
    "priceNum": 29.60,
    "rating": 4.4,
    "reviews": 52,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152264-17458916992041633.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152264-17458916992041633.jpeg"
    ],
    "inStock": true,
    "description": "Damper em Poliester e TAG em Metal Marrom DTMD18. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Damper em Poliester e TAG em Metal Marrom DTMD18</h2><p>Parte da linha Tonante de acessórios, o Damper em Poliester e TAG em Metal Marrom DTMD18 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152264"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "damper-em-poliester-e-tag-em-metal-marrom-dtmd18-cp152264",
    "productUrl": "https://tonante.com.br/damper-em-poliester-e-tag-em-metal-marrom-dtmd18-cp152264"
  },
  {
    "id": 86,
    "sku": "CP152268",
    "name": "Palheta Ibox 1.0MM C/ 20 pçs Preto PLP100BK",
    "price": "R$ 15,80",
    "priceNum": 15.80,
    "rating": 4.8,
    "reviews": 406,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Palheta"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152268-17458725957963934.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152268-17458725957963934.jpeg"
    ],
    "inStock": true,
    "description": "Palheta Ibox 1.0MM C/ 20 pçs Preto PLP100BK. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Palheta Ibox 1.0MM C/ 20 pçs Preto PLP100BK</h2><p>Selecionado pela Tonante, o Palheta Ibox 1.0MM C/ 20 pçs Preto PLP100BK é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Palheta",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152268"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "palheta-ibox-1-0mm-c-20-pcs-preto-plp100bk-cp152268",
    "productUrl": "https://tonante.com.br/palheta-ibox-1-0mm-c-20-pcs-preto-plp100bk-cp152268"
  },
  {
    "id": 87,
    "sku": "CP152269",
    "name": "Palheta Ibox 1.00MM C/ 20 pçs Azul PLP100BL",
    "price": "R$ 15,80",
    "priceNum": 15.80,
    "rating": 4.7,
    "reviews": 435,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Palheta"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152269_2-17458614645401589.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152269_2-17458614645401589.jpeg"
    ],
    "inStock": true,
    "description": "Palheta Ibox 1.00MM C/ 20 pçs Azul PLP100BL. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Palheta Ibox 1.00MM C/ 20 pçs Azul PLP100BL</h2><p>Selecionado pela Tonante, o Palheta Ibox 1.00MM C/ 20 pçs Azul PLP100BL é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Palheta",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152269"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "palheta-ibox-1-00mm-c-20-pcs-azul-plp100bl-cp152269",
    "productUrl": "https://tonante.com.br/palheta-ibox-1-00mm-c-20-pcs-azul-plp100bl-cp152269"
  },
  {
    "id": 88,
    "sku": "CP152272",
    "name": "Palheta Ibox 1.00MM C/ 20 pçs Laranja PLP100OG",
    "price": "R$ 15,80",
    "priceNum": 15.80,
    "rating": 4.5,
    "reviews": 213,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Palheta"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152272-17459172713903504.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152272-17459172713903504.jpeg"
    ],
    "inStock": true,
    "description": "Palheta Ibox 1.00MM C/ 20 pçs Laranja PLP100OG. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Palheta Ibox 1.00MM C/ 20 pçs Laranja PLP100OG</h2><p>Selecionado pela Tonante, o Palheta Ibox 1.00MM C/ 20 pçs Laranja PLP100OG é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Palheta",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152272"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "palheta-ibox-1-00mm-c-20-pcs-laranja-plp100og-cp152272",
    "productUrl": "https://tonante.com.br/palheta-ibox-1-00mm-c-20-pcs-laranja-plp100og-cp152272",
    "oldPrice": "R$ 20,12",
    "oldPriceNum": 20.12,
    "badge": "Oferta"
  },
  {
    "id": 89,
    "sku": "CP152273",
    "name": "Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD",
    "price": "R$ 16,90",
    "priceNum": 16.90,
    "rating": 4.6,
    "reviews": 184,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Palheta"
    ],
    "brand": "Ibox",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152273_2-17459165074785513.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152273_2-17459165074785513.jpeg"
    ],
    "inStock": true,
    "description": "Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD. Ibox é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD</h2><p>Selecionado pela Tonante, o Palheta Ibox 1.0MM C/ 20 pçs Vermelho PLP100RD é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Palheta",
      "Marca parceira: Ibox",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152273"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Ibox"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "palheta-ibox-1-0mm-c-20-pcs-vermelho-plp100rd-cp152273",
    "productUrl": "https://tonante.com.br/palheta-ibox-1-0mm-c-20-pcs-vermelho-plp100rd-cp152273"
  },
  {
    "id": 90,
    "sku": "CP152274",
    "name": "Roldanas Cromadas P/ Correias de Instrumento RD01C",
    "price": "R$ 14,90",
    "priceNum": 14.90,
    "rating": 4.9,
    "reviews": 271,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152274-17457143736195612.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152274-17457143736195612.jpeg"
    ],
    "inStock": true,
    "description": "Roldanas Cromadas P/ Correias de Instrumento RD01C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Roldanas Cromadas P/ Correias de Instrumento RD01C</h2><p>Parte da linha Tonante de acessórios, o Roldanas Cromadas P/ Correias de Instrumento RD01C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152274"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "roldanas-cromadas-p-correias-de-instrumento-rd01c-cp152274",
    "productUrl": "https://tonante.com.br/roldanas-cromadas-p-correias-de-instrumento-rd01c-cp152274"
  },
  {
    "id": 91,
    "sku": "CP152275",
    "name": "Correia Comfort 5CM Listras CK505 PT VM BR e CZ",
    "price": "R$ 139,90",
    "priceNum": 139.9,
    "rating": 4.4,
    "reviews": 242,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152275_2-17458148519187147.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152275_2-17458148519187147.jpeg"
    ],
    "inStock": true,
    "description": "Correia Comfort 5CM Listras CK505 PT VM BR e CZ. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Comfort 5CM Listras CK505 PT VM BR e CZ</h2><p>Parte da linha Tonante de acessórios, o Correia Comfort 5CM Listras CK505 PT VM BR e CZ carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152275"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-comfort-5cm-listras-ck505-pt-vm-br-e-cz-cp152275",
    "productUrl": "https://tonante.com.br/correia-comfort-5cm-listras-ck505-pt-vm-br-e-cz-cp152275",
    "oldPrice": "R$ 169,90",
    "oldPriceNum": 169.9,
    "badge": "Oferta"
  },
  {
    "id": 92,
    "sku": "CP152276",
    "name": "Correia Comfort 5CM CK518 Marrom",
    "price": "R$ 109,90",
    "priceNum": 109.9,
    "rating": 4.7,
    "reviews": 329,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152276-17458438836352559.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152276-17458438836352559.jpeg"
    ],
    "inStock": true,
    "description": "Correia Comfort 5CM CK518 Marrom. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Comfort 5CM CK518 Marrom</h2><p>Parte da linha Tonante de acessórios, o Correia Comfort 5CM CK518 Marrom carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152276"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-comfort-5cm-ck518-marrom-cp152276",
    "productUrl": "https://tonante.com.br/correia-comfort-5cm-ck518-marrom-cp152276"
  },
  {
    "id": 93,
    "sku": "CP152277",
    "name": "Correia Comfort 5CM CK520 Cinza",
    "price": "R$ 119,90",
    "priceNum": 119.9,
    "rating": 4.8,
    "reviews": 300,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152277_1-17458299597156385.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152277_1-17458299597156385.jpeg"
    ],
    "inStock": true,
    "description": "Correia Comfort 5CM CK520 Cinza. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Comfort 5CM CK520 Cinza</h2><p>Parte da linha Tonante de acessórios, o Correia Comfort 5CM CK520 Cinza carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152277"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-comfort-5cm-ck520-cinza-cp152277",
    "productUrl": "https://tonante.com.br/correia-comfort-5cm-ck520-cinza-cp152277"
  },
  {
    "id": 94,
    "sku": "CP152278",
    "name": "Correia Luxo CL72I Preta",
    "price": "R$ 124,90",
    "priceNum": 124.9,
    "rating": 4.5,
    "reviews": 387,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152278-17458725286366677.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152278-17458725286366677.jpeg"
    ],
    "inStock": true,
    "description": "Correia Luxo CL72I Preta. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Luxo CL72I Preta</h2><p>Parte da linha Tonante de acessórios, o Correia Luxo CL72I Preta carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152278"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-luxo-cl72i-preta-cp152278",
    "productUrl": "https://tonante.com.br/correia-luxo-cl72i-preta-cp152278",
    "oldPrice": "R$ 139,90",
    "oldPriceNum": 139.9,
    "badge": "Oferta"
  },
  {
    "id": 95,
    "sku": "CP152280",
    "name": "Suporte Tripe P/ Caixa de Som Acustica Profissional TR3",
    "price": "R$ 75,00",
    "priceNum": 75.00,
    "rating": 4.6,
    "reviews": 374,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152280_3-17458928618705847.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152280_3-17458928618705847.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Tripe P/ Caixa de Som Acustica Profissional TR3. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Tripe P/ Caixa de Som Acustica Profissional TR3</h2><p>Parte da linha Tonante de suportes, o Suporte Tripe P/ Caixa de Som Acustica Profissional TR3 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152280"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-tripe-p-caixa-de-som-acustica-profissional-tr3-cp152280",
    "productUrl": "https://tonante.com.br/suporte-tripe-p-caixa-de-som-acustica-profissional-tr3-cp152280",
    "badge": "Oferta"
  },
  {
    "id": 96,
    "sku": "CP152309",
    "name": "Cabo de Guit.shogun 0,75MM P10/P10 90º 20FT 6,10M PT",
    "price": "R$ 147,90",
    "priceNum": 147.90,
    "rating": 4.8,
    "reviews": 320,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152309-17522774362702068.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152309-17522774362702068.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit.shogun 0,75MM P10/P10 90º 20FT 6,10M PT. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit.shogun 0,75MM P10/P10 90º 20FT 6,10M PT</h2><p>Parte da linha Tonante de acessórios, o Cabo de Guit.shogun 0,75MM P10/P10 90º 20FT 6,10M PT carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152309"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cabo-de-guit-shogun-0-75mm-p10-p10-90-20ft-6-10m-pt-cp152309",
    "productUrl": "https://tonante.com.br/cabo-de-guit-shogun-0-75mm-p10-p10-90-20ft-6-10m-pt-cp152309",
    "badge": "Oferta"
  },
  {
    "id": 97,
    "sku": "CP152310",
    "name": "Cabo de Guit. Shogun 0,75MM P10/P10 90º 15FT 4,57M PT",
    "price": "R$ 155,70",
    "priceNum": 155.70,
    "rating": 4.6,
    "reviews": 422,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152310-17522773803622010.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152310-17522773803622010.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit. Shogun 0,75MM P10/P10 90º 15FT 4,57M PT. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit. Shogun 0,75MM P10/P10 90º 15FT 4,57M PT</h2><p>Parte da linha Tonante de acessórios, o Cabo de Guit. Shogun 0,75MM P10/P10 90º 15FT 4,57M PT carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152310"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cabo-de-guit-shogun-0-75mm-p10-p10-90-15ft-4-57m-pt-cp152310",
    "productUrl": "https://tonante.com.br/cabo-de-guit-shogun-0-75mm-p10-p10-90-15ft-4-57m-pt-cp152310"
  },
  {
    "id": 98,
    "sku": "CP152315",
    "name": "Cabo de Guit. Samurai 0,30 MM P10/P10 15FT 4,57M PT",
    "price": "R$ 58,90",
    "priceNum": 58.90,
    "rating": 4.7,
    "reviews": 97,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152315-17523406741251824.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152315-17523406741251824.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit. Samurai 0,30 MM P10/P10 15FT 4,57M PT. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit. Samurai 0,30 MM P10/P10 15FT 4,57M PT</h2><p>Parte da linha Tonante de acessórios, o Cabo de Guit. Samurai 0,30 MM P10/P10 15FT 4,57M PT carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152315"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cabo-de-guit-samurai-0-30-mm-p10-p10-15ft-4-57m-pt-cp152315",
    "productUrl": "https://tonante.com.br/cabo-de-guit-samurai-0-30-mm-p10-p10-15ft-4-57m-pt-cp152315"
  },
  {
    "id": 99,
    "sku": "CP152321",
    "name": "Cabo Para Microfone XLR M / XLR F Ninja LW 30FT 9,15M Preto",
    "price": "R$ 86,60",
    "priceNum": 86.60,
    "rating": 4.4,
    "reviews": 282,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152321-17569947824839406.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152321-17569947824839406.jpeg"
    ],
    "inStock": true,
    "description": "Cabo Para Microfone XLR M / XLR F Ninja LW 30FT 9,15M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo Para Microfone XLR M / XLR F Ninja LW 30FT 9,15M Preto</h2><p>Selecionado pela Tonante, o Cabo Para Microfone XLR M / XLR F Ninja LW 30FT 9,15M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152321"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-para-microfone-xlr-m-xlr-f-ninja-lw-30ft-9-15m-preto-cp152321",
    "productUrl": "https://tonante.com.br/cabo-para-microfone-xlr-m-xlr-f-ninja-lw-30ft-9-15m-preto-cp152321",
    "oldPrice": "R$ 114,18",
    "oldPriceNum": 114.18,
    "badge": "Oferta"
  },
  {
    "id": 100,
    "sku": "CP152324",
    "name": "Plug P10 Ninja Estereo com Mola",
    "price": "R$ 11,25",
    "priceNum": 11.25,
    "rating": 4.7,
    "reviews": 195,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152324-17458522658976617.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/152324-17458522658976617.jpeg"
    ],
    "inStock": true,
    "description": "Plug P10 Ninja Estereo com Mola. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Plug P10 Ninja Estereo com Mola</h2><p>Selecionado pela Tonante, o Plug P10 Ninja Estereo com Mola é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP152324"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "plug-p10-ninja-estereo-com-mola-cp152324",
    "productUrl": "https://tonante.com.br/plug-p10-ninja-estereo-com-mola-cp152324"
  },
  {
    "id": 101,
    "sku": "CP157084",
    "name": "Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 10FT 3,05M PT",
    "price": "R$ 43,90",
    "priceNum": 43.90,
    "rating": 4.7,
    "reviews": 321,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157084_1-17573490355671638.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157084_1-17573490355671638.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 10FT 3,05M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 10FT 3,05M PT</h2><p>Selecionado pela Tonante, o Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 10FT 3,05M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157084"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guit-ninja-l-cable-0-20-mm-p10-p10-90-10ft-3-05m-pt-cp157084",
    "productUrl": "https://tonante.com.br/cabo-de-guit-ninja-l-cable-0-20-mm-p10-p10-90-10ft-3-05m-pt-cp157084",
    "oldPrice": "R$ 54,90",
    "oldPriceNum": 54.90,
    "badge": "Oferta"
  },
  {
    "id": 102,
    "sku": "CP157085",
    "name": "Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 15FT 4,57M PT",
    "price": "R$ 52,90",
    "priceNum": 52.90,
    "rating": 4.8,
    "reviews": 292,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157085_1-17573490616384565.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157085_1-17573490616384565.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 15FT 4,57M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 15FT 4,57M PT</h2><p>Selecionado pela Tonante, o Cabo de Guit. Ninja L Cable 0,20 MM P10/P10 90° 15FT 4,57M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157085"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guit-ninja-l-cable-0-20-mm-p10-p10-90-15ft-4-57m-pt-cp157085",
    "productUrl": "https://tonante.com.br/cabo-de-guit-ninja-l-cable-0-20-mm-p10-p10-90-15ft-4-57m-pt-cp157085"
  },
  {
    "id": 103,
    "sku": "CP157089",
    "name": "Cabo de Micrf. Ninja L Cable 0,20 MM P10/P10 90° 30FT 9,15M Preto",
    "price": "R$ 64,75",
    "priceNum": 64.75,
    "rating": 4.8,
    "reviews": 170,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157089_1-17573495851921192.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157089_1-17573495851921192.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Micrf. Ninja L Cable 0,20 MM P10/P10 90° 30FT 9,15M Preto. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Micrf. Ninja L Cable 0,20 MM P10/P10 90° 30FT 9,15M Preto</h2><p>Selecionado pela Tonante, o Cabo de Micrf. Ninja L Cable 0,20 MM P10/P10 90° 30FT 9,15M Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157089"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-micrf-ninja-l-cable-0-20-mm-p10-p10-90-30ft-9-15m-preto-cp157089",
    "productUrl": "https://tonante.com.br/cabo-de-micrf-ninja-l-cable-0-20-mm-p10-p10-90-30ft-9-15m-preto-cp157089",
    "oldPrice": "R$ 79,48",
    "oldPriceNum": 79.48,
    "badge": "Oferta"
  },
  {
    "id": 104,
    "sku": "CP157090",
    "name": "Cabo de Guit.ninja Cable 0,20 MM P10/P10 30FT 9,15M PT",
    "price": "R$ 80,90",
    "priceNum": 80.90,
    "rating": 4.4,
    "reviews": 278,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157090_1-17573495266677054.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157090_1-17573495266677054.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit.ninja Cable 0,20 MM P10/P10 30FT 9,15M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit.ninja Cable 0,20 MM P10/P10 30FT 9,15M PT</h2><p>Selecionado pela Tonante, o Cabo de Guit.ninja Cable 0,20 MM P10/P10 30FT 9,15M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157090"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guit-ninja-cable-0-20-mm-p10-p10-30ft-9-15m-pt-cp157090",
    "productUrl": "https://tonante.com.br/cabo-de-guit-ninja-cable-0-20-mm-p10-p10-30ft-9-15m-pt-cp157090"
  },
  {
    "id": 105,
    "sku": "CP157093",
    "name": "Cabo de Guit.ninja Cable 0,20 MM P10/10 20FT 6,10M PT",
    "price": "R$ 51,60",
    "priceNum": 51.60,
    "rating": 4.5,
    "reviews": 249,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Cabo"
    ],
    "brand": "Santo Angelo",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157093_1-17573495532412015.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157093_1-17573495532412015.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Guit.ninja Cable 0,20 MM P10/10 20FT 6,10M PT. Santo Angelo é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Guit.ninja Cable 0,20 MM P10/10 20FT 6,10M PT</h2><p>Selecionado pela Tonante, o Cabo de Guit.ninja Cable 0,20 MM P10/10 20FT 6,10M PT é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cabo",
      "Marca parceira: Santo Angelo",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157093"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Santo Angelo"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cabo-de-guit-ninja-cable-0-20-mm-p10-10-20ft-6-10m-pt-cp157093",
    "productUrl": "https://tonante.com.br/cabo-de-guit-ninja-cable-0-20-mm-p10-10-20ft-6-10m-pt-cp157093"
  },
  {
    "id": 106,
    "sku": "CP157101",
    "name": "Cabo de Microfone X30 0,30MM 100 MT Preto",
    "price": "R$ 388,70",
    "priceNum": 388.70,
    "rating": 4.5,
    "reviews": 447,
    "category": "Acessórios",
    "subcategory": "Cabos",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157101-17523339457239813.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/5/157101-17523339457239813.jpeg"
    ],
    "inStock": true,
    "description": "Cabo de Microfone X30 0,30MM 100 MT Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cabo de Microfone X30 0,30MM 100 MT Preto</h2><p>Parte da linha Tonante de acessórios, o Cabo de Microfone X30 0,30MM 100 MT Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP157101"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cabo-de-microfone-x30-0-30mm-100-mt-preto-cp157101",
    "productUrl": "https://tonante.com.br/cabo-de-microfone-x30-0-30mm-100-mt-preto-cp157101",
    "oldPrice": "R$ 406,38",
    "oldPriceNum": 406.38,
    "badge": "Oferta"
  },
  {
    "id": 107,
    "sku": "CP17415",
    "name": "Suporte P/ Microfone Girafa Smmax Preto",
    "price": "R$ 58,79",
    "priceNum": 58.79,
    "rating": 4.4,
    "reviews": 54,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Microfone"
    ],
    "brand": "SMMax",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17415.jpg-17458886356477024.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17415.jpg-17458886356477024.jpeg"
    ],
    "inStock": true,
    "description": "Suporte P/ Microfone Girafa Smmax Preto. SMMax é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte P/ Microfone Girafa Smmax Preto</h2><p>Selecionado pela Tonante, o Suporte P/ Microfone Girafa Smmax Preto é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Marca parceira: SMMax",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP17415"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "SMMax"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "suporte-p-microfone-girafa-smmax-preto-cp17415",
    "productUrl": "https://tonante.com.br/suporte-p-microfone-girafa-smmax-preto-cp17415",
    "oldPrice": "R$ 66,53",
    "oldPriceNum": 66.53,
    "badge": "Oferta"
  },
  {
    "id": 108,
    "sku": "CP17416",
    "name": "Suporte Portatil Para Violao SGV Preto",
    "price": "R$ 36,00",
    "priceNum": 36.00,
    "rating": 4.7,
    "reviews": 141,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17416.jpg-17460175670737556.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17416.jpg-17460175670737556.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Portatil Para Violao SGV Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Portatil Para Violao SGV Preto</h2><p>Parte da linha Tonante de suportes, o Suporte Portatil Para Violao SGV Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP17416"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-portatil-para-violao-sgv-preto-cp17416",
    "productUrl": "https://tonante.com.br/suporte-portatil-para-violao-sgv-preto-cp17416"
  },
  {
    "id": 109,
    "sku": "CP17417",
    "name": "Suporte Para Teclado X30 Preto",
    "price": "R$ 79,06",
    "priceNum": 79.06,
    "rating": 4.8,
    "reviews": 112,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17417.jpg-17458804361727651.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17417.jpg-17458804361727651.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Teclado X30 Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Teclado X30 Preto</h2><p>Parte da linha Tonante de suportes, o Suporte Para Teclado X30 Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP17417"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-teclado-x30-preto-cp17417",
    "productUrl": "https://tonante.com.br/suporte-para-teclado-x30-preto-cp17417"
  },
  {
    "id": 110,
    "sku": "CP17418",
    "name": "Suporte de Parede P/ Violao/guitarra SPF",
    "price": "R$ 18,90",
    "priceNum": 18.90,
    "rating": 4.9,
    "reviews": 431,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17418_2-17459223422141673.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/7/17418_2-17459223422141673.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede P/ Violao/guitarra SPF. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede P/ Violao/guitarra SPF</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede P/ Violao/guitarra SPF carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP17418"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-p-violao-guitarra-spf-cp17418",
    "productUrl": "https://tonante.com.br/suporte-de-parede-p-violao-guitarra-spf-cp17418"
  },
  {
    "id": 111,
    "sku": "CP18566",
    "name": "Encordoamento Guitarra EXL110 .010-.046",
    "price": "R$ 49,00",
    "priceNum": 49.00,
    "rating": 4.8,
    "reviews": 376,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18566.jpg-17458371989119780.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18566.jpg-17458371989119780.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra EXL110 .010-.046. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra EXL110 .010-.046</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra EXL110 .010-.046 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18566"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-guitarra-exl110-010-046-cp18566",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-exl110-010-046-cp18566",
    "badge": "Oferta"
  },
  {
    "id": 112,
    "sku": "CP18568",
    "name": "Encordoamento Guitarra EXL120-B .009.042",
    "price": "R$ 44,90",
    "priceNum": 44.90,
    "rating": 4.6,
    "reviews": 434,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18568.jpg-17458843227533971.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18568.jpg-17458843227533971.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra EXL120-B .009.042. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra EXL120-B .009.042</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra EXL120-B .009.042 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18568"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-guitarra-exl120-b-009-042-cp18568",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-exl120-b-009-042-cp18568"
  },
  {
    "id": 113,
    "sku": "CP18569",
    "name": "Encordoamento Violao ACO EZ890-B 009.045",
    "price": "R$ 48,90",
    "priceNum": 48.90,
    "rating": 4.5,
    "reviews": 463,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18569.jpg-17460175467907563.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18569.jpg-17460175467907563.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO EZ890-B 009.045. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO EZ890-B 009.045</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO EZ890-B 009.045 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18569"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-ez890-b-009-045-cp18569",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-ez890-b-009-045-cp18569"
  },
  {
    "id": 114,
    "sku": "CP18571",
    "name": "Encordoamento Violao ACO EZ910 .011-.052",
    "price": "R$ 48,75",
    "priceNum": 48.75,
    "rating": 4.8,
    "reviews": 332,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18571.jpg-17460175416358217.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18571.jpg-17460175416358217.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO EZ910 .011-.052. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO EZ910 .011-.052</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO EZ910 .011-.052 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18571"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-ez910-011-052-cp18571",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-ez910-011-052-cp18571"
  },
  {
    "id": 115,
    "sku": "CP18572",
    "name": "Encordoamento Violao ACO EZ920 .012-.054",
    "price": "R$ 48,75",
    "priceNum": 48.75,
    "rating": 4.9,
    "reviews": 303,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18572.jpg-17460175364713837.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18572.jpg-17460175364713837.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO EZ920 .012-.054. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO EZ920 .012-.054</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO EZ920 .012-.054 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18572"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-ez920-012-054-cp18572",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-ez920-012-054-cp18572"
  },
  {
    "id": 116,
    "sku": "CP18574",
    "name": "Encordoamento Violao Nylon EJ27N",
    "price": "R$ 61,50",
    "priceNum": 61.50,
    "rating": 4.9,
    "reviews": 477,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18574_1.jpg-17458989310906177.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18574_1.jpg-17458989310906177.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon EJ27N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon EJ27N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon EJ27N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18574"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-ej27n-cp18574",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-ej27n-cp18574"
  },
  {
    "id": 117,
    "sku": "CP18591",
    "name": "Flauta Soprano (barroco) YRS-24B",
    "price": "R$ 30,00",
    "priceNum": 30.00,
    "rating": 4.6,
    "reviews": 238,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18591.jpg-17458368755831633.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18591.jpg-17458368755831633.jpeg"
    ],
    "inStock": true,
    "description": "Flauta Soprano (barroco) YRS-24B. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Flauta Soprano (barroco) YRS-24B</h2><p>Parte da linha Tonante de acessórios, o Flauta Soprano (barroco) YRS-24B carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18591"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "flauta-soprano-barroco-yrs-24b-cp18591",
    "productUrl": "https://tonante.com.br/flauta-soprano-barroco-yrs-24b-cp18591"
  },
  {
    "id": 118,
    "sku": "CP18593",
    "name": "Limpador e Lubrificante de Cordas D'addario - PW-XLR8",
    "price": "R$ 53,90",
    "priceNum": 53.90,
    "rating": 4.4,
    "reviews": 296,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18593_1-17621817484905162.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18593_1-17621817484905162.jpeg"
    ],
    "inStock": true,
    "description": "Limpador e Lubrificante de Cordas D'addario - PW-XLR8. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Limpador e Lubrificante de Cordas D'addario - PW-XLR8</h2><p>Selecionado pela Tonante, o Limpador e Lubrificante de Cordas D'addario - PW-XLR8 é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18593"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "limpador-e-lubrificante-de-cordas-d-addario-pw-xlr8-cp18593",
    "productUrl": "https://tonante.com.br/limpador-e-lubrificante-de-cordas-d-addario-pw-xlr8-cp18593"
  },
  {
    "id": 119,
    "sku": "CP18789",
    "name": "Violao Acustico Estudo Nylon N-14N Natural",
    "price": "R$ 169,00",
    "priceNum": 169.00,
    "rating": 4.9,
    "reviews": 183,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18789.jpg-17523582192987850.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/8/18789.jpg-17523582192987850.jpeg"
    ],
    "inStock": true,
    "description": "Violao Acustico Estudo Nylon N-14N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Acustico Estudo Nylon N-14N Natural</h2><p>Parte da linha Tonante de violões, o Violao Acustico Estudo Nylon N-14N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP18789"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-acustico-estudo-nylon-n-14n-natural-cp18789",
    "productUrl": "https://tonante.com.br/violao-acustico-estudo-nylon-n-14n-natural-cp18789"
  },
  {
    "id": 120,
    "sku": "CP19065",
    "name": "Violao Acustico Estudo Nylon N-14BK Preto",
    "price": "R$ 169,00",
    "priceNum": 169.00,
    "rating": 4.9,
    "reviews": 407,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/19065.jpg-17460175121472345.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/19065.jpg-17460175121472345.jpeg"
    ],
    "inStock": true,
    "description": "Violao Acustico Estudo Nylon N-14BK Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Acustico Estudo Nylon N-14BK Preto</h2><p>Parte da linha Tonante de violões, o Violao Acustico Estudo Nylon N-14BK Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP19065"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-acustico-estudo-nylon-n-14bk-preto-cp19065",
    "productUrl": "https://tonante.com.br/violao-acustico-estudo-nylon-n-14bk-preto-cp19065",
    "oldPrice": "R$ 207,90",
    "oldPriceNum": 207.90,
    "badge": "Oferta"
  },
  {
    "id": 121,
    "sku": "CP19066",
    "name": "Violao Acustico Estudo ACO S-14N Natural",
    "price": "R$ 373,90",
    "priceNum": 373.90,
    "rating": 4.6,
    "reviews": 320,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/19066_1-17477610742189055.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/19066_1-17477610742189055.jpeg"
    ],
    "inStock": true,
    "description": "Violao Acustico Estudo ACO S-14N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Acustico Estudo ACO S-14N Natural</h2><p>Parte da linha Tonante de violões, o Violao Acustico Estudo ACO S-14N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP19066"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-acustico-estudo-aco-s-14n-natural-cp19066",
    "productUrl": "https://tonante.com.br/violao-acustico-estudo-aco-s-14n-natural-cp19066"
  },
  {
    "id": 122,
    "sku": "CP191674",
    "name": "Pedestal Para Caixa de Som - Preto - TNP1954",
    "price": "R$ 99,90",
    "priceNum": 99.90,
    "rating": 4.4,
    "reviews": 20,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/191674-17523643663122196.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/191674-17523643663122196.jpeg"
    ],
    "inStock": true,
    "description": "Pedestal Para Caixa de Som - Preto - TNP1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Pedestal Para Caixa de Som - Preto - TNP1954</h2><p>Parte da linha Tonante de suportes, o Pedestal Para Caixa de Som - Preto - TNP1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP191674"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "pedestal-para-caixa-de-som-preto-tnp1954-cp191674",
    "productUrl": "https://tonante.com.br/pedestal-para-caixa-de-som-preto-tnp1954-cp191674"
  },
  {
    "id": 123,
    "sku": "CP193101",
    "name": "Violao ACO Eletroacustico Performance Plus GGC Plus CEQ NS",
    "price": "R$ 898,00",
    "priceNum": 898.00,
    "rating": 4.5,
    "reviews": 171,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/193101-17523399793398010.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/193101-17523399793398010.jpeg"
    ],
    "inStock": true,
    "description": "Violao ACO Eletroacustico Performance Plus GGC Plus CEQ NS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao ACO Eletroacustico Performance Plus GGC Plus CEQ NS</h2><p>Parte da linha Tonante de violões, o Violao ACO Eletroacustico Performance Plus GGC Plus CEQ NS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP193101"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-aco-eletroacustico-performance-plus-ggc-plus-ceq-ns-cp193101",
    "productUrl": "https://tonante.com.br/violao-aco-eletroacustico-performance-plus-ggc-plus-ceq-ns-cp193101"
  },
  {
    "id": 124,
    "sku": "CP195081",
    "name": "Adaptador P2/P10 ST Vermelho",
    "price": "R$ 15,60",
    "priceNum": 15.60,
    "rating": 4.4,
    "reviews": 476,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "6 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/195081_2-17458511815431511.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/9/195081_2-17458511815431511.jpeg"
    ],
    "inStock": true,
    "description": "Adaptador P2/P10 ST Vermelho. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Adaptador P2/P10 ST Vermelho</h2><p>Parte da linha Tonante de acessórios, o Adaptador P2/P10 ST Vermelho carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "6 cordas",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP195081"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "adaptador-p2-p10-st-vermelho-cp195081",
    "productUrl": "https://tonante.com.br/adaptador-p2-p10-st-vermelho-cp195081",
    "badge": "Oferta"
  },
  {
    "id": 125,
    "sku": "CP22169",
    "name": "Cavaco Acustico CS-14N Natural",
    "price": "R$ 307,28",
    "priceNum": 307.28,
    "rating": 4.8,
    "reviews": 312,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22169_1-17480114599803745.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22169_1-17480114599803745.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Acustico CS-14N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Acustico CS-14N Natural</h2><p>Parte da linha Tonante de acessórios, o Cavaco Acustico CS-14N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22169"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-acustico-cs-14n-natural-cp22169",
    "productUrl": "https://tonante.com.br/cavaco-acustico-cs-14n-natural-cp22169",
    "oldPrice": "R$ 384,20",
    "oldPriceNum": 384.20,
    "badge": "Oferta"
  },
  {
    "id": 126,
    "sku": "CP22170",
    "name": "Violao Infantil 3/4 Nylon 36'' N6-BK Preto",
    "price": "R$ 187,00",
    "priceNum": 187.00,
    "badge": "Novidade",
    "rating": 4.4,
    "reviews": 420,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22170_2.jpg-17459057290766561.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22170_2.jpg-17459057290766561.jpeg"
    ],
    "inStock": true,
    "description": "Violao Infantil 3/4 Nylon 36'' N6-BK Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Infantil 3/4 Nylon 36'' N6-BK Preto</h2><p>Parte da linha Tonante de violões, o Violao Infantil 3/4 Nylon 36'' N6-BK Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22170"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-infantil-3-4-nylon-36-n6-bk-preto-cp22170",
    "productUrl": "https://tonante.com.br/violao-infantil-3-4-nylon-36-n6-bk-preto-cp22170"
  },
  {
    "id": 127,
    "sku": "CP22171",
    "name": "Violao Infantil 3/4 Nylon 36'' N6-N Natural",
    "price": "R$ 348,90",
    "priceNum": 348.90,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 449,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22171.jpg-17523395007519935.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22171.jpg-17523395007519935.jpeg"
    ],
    "inStock": true,
    "description": "Violao Infantil 3/4 Nylon 36'' N6-N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Infantil 3/4 Nylon 36'' N6-N Natural</h2><p>Parte da linha Tonante de violões, o Violao Infantil 3/4 Nylon 36'' N6-N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22171"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-infantil-3-4-nylon-36-n6-n-natural-cp22171",
    "productUrl": "https://tonante.com.br/violao-infantil-3-4-nylon-36-n6-n-natural-cp22171"
  },
  {
    "id": 128,
    "sku": "CP22173",
    "name": "Violao Infantil 1/4 Nylon 30'' Nr-n Natural",
    "price": "R$ 162,00",
    "priceNum": 162.00,
    "rating": 4.5,
    "reviews": 391,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22173.jpg-17523519288882252.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22173.jpg-17523519288882252.jpeg"
    ],
    "inStock": true,
    "description": "Violao Infantil 1/4 Nylon 30'' Nr-n Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Infantil 1/4 Nylon 30'' Nr-n Natural</h2><p>Parte da linha Tonante de violões, o Violao Infantil 1/4 Nylon 30'' Nr-n Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22173"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-infantil-1-4-nylon-30-nr-n-natural-cp22173",
    "productUrl": "https://tonante.com.br/violao-infantil-1-4-nylon-30-nr-n-natural-cp22173"
  },
  {
    "id": 129,
    "sku": "CP22426",
    "name": "Microfone Profissional SM58 P4* Champanhe",
    "price": "R$ 107,90",
    "priceNum": 107.90,
    "rating": 4.6,
    "reviews": 378,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22426_1.jpg-17522752639264211.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22426_1.jpg-17522752639264211.jpeg"
    ],
    "inStock": true,
    "description": "Microfone Profissional SM58 P4* Champanhe. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone Profissional SM58 P4* Champanhe</h2><p>Parte da linha Tonante de acessórios, o Microfone Profissional SM58 P4* Champanhe carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22426"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-profissional-sm58-p4-champanhe-cp22426",
    "productUrl": "https://tonante.com.br/microfone-profissional-sm58-p4-champanhe-cp22426"
  },
  {
    "id": 130,
    "sku": "CP22474",
    "name": "Viola Acustica VS-14N Natural",
    "price": "R$ 369,00",
    "priceNum": 369.00,
    "rating": 4.7,
    "reviews": 241,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22474.jpg-17458502973616093.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/2/22474.jpg-17458502973616093.jpeg"
    ],
    "inStock": true,
    "description": "Viola Acustica VS-14N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Acustica VS-14N Natural</h2><p>Parte da linha Tonante de acessórios, o Viola Acustica VS-14N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP22474"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-acustica-vs-14n-natural-cp22474",
    "productUrl": "https://tonante.com.br/viola-acustica-vs-14n-natural-cp22474"
  },
  {
    "id": 131,
    "sku": "CP23175",
    "name": "Microfone sem FIO UHF Lapela Mini-iii",
    "price": "R$ 347,90",
    "priceNum": 347.90,
    "rating": 4.6,
    "reviews": 140,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/23175.jpg-17459113365166824.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/23175.jpg-17459113365166824.jpeg"
    ],
    "inStock": true,
    "description": "Microfone sem FIO UHF Lapela Mini-iii. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone sem FIO UHF Lapela Mini-iii</h2><p>Parte da linha Tonante de acessórios, o Microfone sem FIO UHF Lapela Mini-iii carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP23175"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-sem-fio-uhf-lapela-mini-iii-cp23175",
    "productUrl": "https://tonante.com.br/microfone-sem-fio-uhf-lapela-mini-iii-cp23175"
  },
  {
    "id": 132,
    "sku": "CP2321",
    "name": "Encordoamento Guitarra Geegst 9",
    "price": "R$ 26,90",
    "priceNum": 26.90,
    "rating": 4.4,
    "reviews": 140,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2321_1-17551165977171574.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2321_1-17551165977171574.png"
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra Geegst 9. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra Geegst 9</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra Geegst 9 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP2321"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-guitarra-geegst-9-cp2321",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-geegst-9-cp2321"
  },
  {
    "id": 133,
    "sku": "CP2322",
    "name": "Encordoamento Guitarra Geegst 10",
    "price": "R$ 25,90",
    "priceNum": 25.90,
    "rating": 4.7,
    "reviews": 227,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2322_1-17551166325417073.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2322_1-17551166325417073.png"
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra Geegst 10. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra Geegst 10</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra Geegst 10 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP2322"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-guitarra-geegst-10-cp2322",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-geegst-10-cp2322",
    "badge": "Oferta"
  },
  {
    "id": 134,
    "sku": "CP2323",
    "name": "Encordoamento Baixo 4 Cordas Geebrl",
    "price": "R$ 29,90",
    "priceNum": 29.9,
    "rating": 4.8,
    "reviews": 198,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "4 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2323-17457546825968998.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2323-17457546825968998.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Baixo 4 Cordas Geebrl. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Baixo 4 Cordas Geebrl</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Baixo 4 Cordas Geebrl carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "4 cordas",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP2323"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-baixo-4-cordas-geebrl-cp2323",
    "productUrl": "https://tonante.com.br/encordoamento-baixo-4-cordas-geebrl-cp2323",
    "badge": "Oferta"
  },
  {
    "id": 135,
    "sku": "CP2324",
    "name": "Encordoamento Baixo 5 Cordas Geebrl 5",
    "price": "R$ 98,00",
    "priceNum": 98.00,
    "rating": 4.7,
    "reviews": 53,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "5 cordas"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2324-17460177147754550.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/2324-17460177147754550.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Baixo 5 Cordas Geebrl 5. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Baixo 5 Cordas Geebrl 5</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Baixo 5 Cordas Geebrl 5 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "5 cordas",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP2324"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-baixo-5-cordas-geebrl-5-cp2324",
    "productUrl": "https://tonante.com.br/encordoamento-baixo-5-cordas-geebrl-5-cp2324",
    "badge": "Oferta"
  },
  {
    "id": 136,
    "sku": "CP23608",
    "name": "Suporte Para Caixa Acustica TR2 Preto",
    "price": "R$ 93,75",
    "priceNum": 93.75,
    "rating": 4.7,
    "reviews": 177,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/23608.jpg-17459004968496374.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/3/23608.jpg-17459004968496374.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Caixa Acustica TR2 Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Caixa Acustica TR2 Preto</h2><p>Parte da linha Tonante de suportes, o Suporte Para Caixa Acustica TR2 Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP23608"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-caixa-acustica-tr2-preto-cp23608",
    "productUrl": "https://tonante.com.br/suporte-para-caixa-acustica-tr2-preto-cp23608",
    "oldPrice": "R$ 112,99",
    "oldPriceNum": 112.99,
    "badge": "Oferta"
  },
  {
    "id": 137,
    "sku": "CP253640",
    "name": "Estante Para Partitura Maestro com Ajuste de Altura - TNE1954",
    "price": "R$ 94,90",
    "priceNum": 94.90,
    "rating": 4.8,
    "reviews": 204,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253640-17523302860378686.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253640-17523302860378686.jpeg"
    ],
    "inStock": true,
    "description": "Estante Para Partitura Maestro com Ajuste de Altura - TNE1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Estante Para Partitura Maestro com Ajuste de Altura - TNE1954</h2><p>Parte da linha Tonante de suportes, o Estante Para Partitura Maestro com Ajuste de Altura - TNE1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253640"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "estante-para-partitura-maestro-com-ajuste-de-altura-tne1954-cp253640",
    "productUrl": "https://tonante.com.br/estante-para-partitura-maestro-com-ajuste-de-altura-tne1954-cp253640"
  },
  {
    "id": 138,
    "sku": "CP253646",
    "name": "Apoio de PE Para Violonista - cor Preta - TNS1954",
    "price": "R$ 21,90",
    "priceNum": 21.90,
    "rating": 4.6,
    "reviews": 262,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253646-17522530861643318.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253646-17522530861643318.jpeg"
    ],
    "inStock": true,
    "description": "Apoio de PE Para Violonista - cor Preta - TNS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Apoio de PE Para Violonista - cor Preta - TNS1954</h2><p>Parte da linha Tonante de acessórios, o Apoio de PE Para Violonista - cor Preta - TNS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253646"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "apoio-de-pe-para-violonista-cor-preta-tns1954-cp253646",
    "productUrl": "https://tonante.com.br/apoio-de-pe-para-violonista-cor-preta-tns1954-cp253646"
  },
  {
    "id": 139,
    "sku": "CP253874",
    "name": "Encordoamento Nylon Cobre Prata Tens. Alta Pesada P/ Violao 0.029 - 0.044 - Tnvch",
    "price": "R$ 16,73",
    "priceNum": 16.73,
    "rating": 4.9,
    "reviews": 83,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253874-5-17458280901488103.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253874-5-17458280901488103.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Nylon Cobre Prata Tens. Alta Pesada P/ Violao 0.029 - 0.044 - Tnvch. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Nylon Cobre Prata Tens. Alta Pesada P/ Violao 0.029 - 0.044 - Tnvch</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Nylon Cobre Prata Tens. Alta Pesada P/ Violao 0.029 - 0.044 - Tnvch carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253874"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-nylon-cobre-prata-tens-alta-pesada-p-violao-0-029-0-044-tnvch-cp253874",
    "productUrl": "https://tonante.com.br/encordoamento-nylon-cobre-prata-tens-alta-pesada-p-violao-0-029-0-044-tnvch-cp253874",
    "oldPrice": "R$ 22,33",
    "oldPriceNum": 22.33,
    "badge": "Oferta"
  },
  {
    "id": 140,
    "sku": "CP253880",
    "name": "Encordoamento 011 Aço Bronze 85 15 P/ Violão 0.011 - 0.052 - TNVA11B85",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.4,
    "reviews": 358,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço",
      "Bronze"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253880-17459063280908387.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253880-17459063280908387.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento 011 Aço Bronze 85 15 P/ Violão 0.011 - 0.052 - TNVA11B85. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 011 Aço Bronze 85 15 P/ Violão 0.011 - 0.052 - TNVA11B85</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 011 Aço Bronze 85 15 P/ Violão 0.011 - 0.052 - TNVA11B85 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Bronze",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253880"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-011-aco-bronze-85-15-p-violao-0-011-0-052-tnva11b85-cp253880",
    "productUrl": "https://tonante.com.br/encordoamento-011-aco-bronze-85-15-p-violao-0-011-0-052-tnva11b85-cp253880",
    "oldPrice": "R$ 23,22",
    "oldPriceNum": 23.22,
    "badge": "Oferta"
  },
  {
    "id": 141,
    "sku": "CP253891",
    "name": "Encordoamento 009 Níquel Plated Steel P/ Guitarra 0.009 - 0.042 - TNGE09N",
    "price": "R$ 16,43",
    "priceNum": 16.43,
    "rating": 4.4,
    "reviews": 18,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253891-17459046427284450.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253891-17459046427284450.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento 009 Níquel Plated Steel P/ Guitarra 0.009 - 0.042 - TNGE09N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 009 Níquel Plated Steel P/ Guitarra 0.009 - 0.042 - TNGE09N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 009 Níquel Plated Steel P/ Guitarra 0.009 - 0.042 - TNGE09N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253891"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-009-niquel-plated-steel-p-guitarra-0-009-0-042-tnge09n-cp253891",
    "productUrl": "https://tonante.com.br/encordoamento-009-niquel-plated-steel-p-guitarra-0-009-0-042-tnge09n-cp253891"
  },
  {
    "id": 142,
    "sku": "CP253893",
    "name": "Encordoamento 011 Níquel Plated Steel P/ Guitarra 0.011 - 0.049 - TNGE11N",
    "price": "R$ 16,43",
    "priceNum": 16.43,
    "rating": 4.6,
    "reviews": 430,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253893-17458727054976449.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253893-17458727054976449.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento 011 Níquel Plated Steel P/ Guitarra 0.011 - 0.049 - TNGE11N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 011 Níquel Plated Steel P/ Guitarra 0.011 - 0.049 - TNGE11N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 011 Níquel Plated Steel P/ Guitarra 0.011 - 0.049 - TNGE11N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253893"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-011-niquel-plated-steel-p-guitarra-0-011-0-049-tnge11n-cp253893",
    "productUrl": "https://tonante.com.br/encordoamento-011-niquel-plated-steel-p-guitarra-0-011-0-049-tnge11n-cp253893"
  },
  {
    "id": 143,
    "sku": "CP253894",
    "name": "Encordoamento 010 Níquel Plated Steel P/ Guitarra 0.010 - 0.046 - TNGE10N",
    "price": "R$ 21,90",
    "priceNum": 21.90,
    "rating": 4.5,
    "reviews": 163,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253894-17458998293186562.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253894-17458998293186562.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento 010 Níquel Plated Steel P/ Guitarra 0.010 - 0.046 - TNGE10N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 010 Níquel Plated Steel P/ Guitarra 0.010 - 0.046 - TNGE10N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 010 Níquel Plated Steel P/ Guitarra 0.010 - 0.046 - TNGE10N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253894"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-010-niquel-plated-steel-p-guitarra-0-010-0-046-tnge10n-cp253894",
    "productUrl": "https://tonante.com.br/encordoamento-010-niquel-plated-steel-p-guitarra-0-010-0-046-tnge10n-cp253894"
  },
  {
    "id": 144,
    "sku": "CP253895",
    "name": "Encordoamento Níquel Plated Steel C/ Bolinha P/ Cavaco 0.011 - 0.029 - RVCA11N",
    "price": "R$ 8,90",
    "priceNum": 8.90,
    "rating": 4.6,
    "reviews": 134,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253895-2-17458688921571993.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253895-2-17458688921571993.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Níquel Plated Steel C/ Bolinha P/ Cavaco 0.011 - 0.029 - RVCA11N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Níquel Plated Steel C/ Bolinha P/ Cavaco 0.011 - 0.029 - RVCA11N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Níquel Plated Steel C/ Bolinha P/ Cavaco 0.011 - 0.029 - RVCA11N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253895"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-niquel-plated-steel-c-bolinha-p-cavaco-0-011-0-029-rvca11n-cp253895",
    "productUrl": "https://tonante.com.br/encordoamento-niquel-plated-steel-c-bolinha-p-cavaco-0-011-0-029-rvca11n-cp253895"
  },
  {
    "id": 145,
    "sku": "CP253898",
    "name": "Encordoamento 040 Níquel Plated Steel P/ Baixo 4 Cordas 0.040 - 0.095 - TNBE40N",
    "price": "R$ 56,02",
    "priceNum": 56.02,
    "rating": 4.5,
    "reviews": 285,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "4 cordas",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253898-17459126435768742.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/253898-17459126435768742.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento 040 Níquel Plated Steel P/ Baixo 4 Cordas 0.040 - 0.095 - TNBE40N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 040 Níquel Plated Steel P/ Baixo 4 Cordas 0.040 - 0.095 - TNBE40N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 040 Níquel Plated Steel P/ Baixo 4 Cordas 0.040 - 0.095 - TNBE40N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "4 cordas · Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253898"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-040-niquel-plated-steel-p-baixo-4-cordas-0-040-0-095-tnbe40n-cp253898",
    "productUrl": "https://tonante.com.br/encordoamento-040-niquel-plated-steel-p-baixo-4-cordas-0-040-0-095-tnbe40n-cp253898"
  },
  {
    "id": 146,
    "sku": "CP253899",
    "name": "Encordoamento 045 Níquel Plated Steel P/ Baixo 4 Cordas 0.045 - 0.100 - TNBE45N",
    "price": "R$ 56,02",
    "priceNum": 56.02,
    "rating": 4.6,
    "reviews": 256,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "4 cordas",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/253899-17894557841684565.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/253899-17894557841684565.jpeg",
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/253899-2-17894557856808159.jpeg",
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/253899-3-17894557870062845.jpeg",
    ],
    "inStock": true,
    "description": "Encordoamento 045 Níquel Plated Steel P/ Baixo 4 Cordas 0.045 - 0.100 - TNBE45N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento 045 Níquel Plated Steel P/ Baixo 4 Cordas 0.045 - 0.100 - TNBE45N</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento 045 Níquel Plated Steel P/ Baixo 4 Cordas 0.045 - 0.100 - TNBE45N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "4 cordas · Níquel",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP253899"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-045-niquel-plated-steel-p-baixo-4-cordas-0-045-0-100-tnbe45n-cp253899",
    "productUrl": "https://tonante.com.br/encordoamento-045-niquel-plated-steel-p-baixo-4-cordas-0-045-0-100-tnbe45n-cp253899"
  },
  {
    "id": 147,
    "sku": "CP25413",
    "name": "Encordoamento Violao Nylon Genwbg",
    "price": "R$ 23,90",
    "priceNum": 23.90,
    "rating": 4.5,
    "reviews": 407,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25413-17457928895827627.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25413-17457928895827627.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon Genwbg. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon Genwbg</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon Genwbg carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25413"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-genwbg-cp25413",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-genwbg-cp25413"
  },
  {
    "id": 148,
    "sku": "CP25415",
    "name": "Encordoamento Violao Nylon Genwbs",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.5,
    "reviews": 233,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25415_1-17551166609139939.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25415_1-17551166609139939.png"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon Genwbs. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon Genwbs</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon Genwbs carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25415"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-genwbs-cp25415",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-genwbs-cp25415"
  },
  {
    "id": 149,
    "sku": "CP25416",
    "name": "Encordoamento Violao Nylon Genws",
    "price": "R$ 19,60",
    "priceNum": 19.60,
    "rating": 4.4,
    "reviews": 262,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25416-17460173986615019.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25416-17460173986615019.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon Genws. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon Genws</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon Genws carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25416"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-genws-cp25416",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-genws-cp25416"
  },
  {
    "id": 150,
    "sku": "CP25417",
    "name": "Encordoamento Violao ACO Geswal",
    "price": "R$ 22,00",
    "priceNum": 22.00,
    "rating": 4.9,
    "reviews": 291,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25417-17458472193001700.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25417-17458472193001700.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Geswal. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Geswal</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Geswal carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25417"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-geswal-cp25417",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-geswal-cp25417"
  },
  {
    "id": 151,
    "sku": "CP25418",
    "name": "Encordoamento Violao ACO Geswam",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.6,
    "reviews": 82,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25418.jpg-17460173930315426.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25418.jpg-17460173930315426.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Geswam. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Geswam</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Geswam carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25418"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-geswam-cp25418",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-geswam-cp25418"
  },
  {
    "id": 152,
    "sku": "CP25419",
    "name": "Encordoamento Violao ACO Gespw",
    "price": "R$ 19,40",
    "priceNum": 19.40,
    "rating": 4.5,
    "reviews": 111,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25419-17459203436056562.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25419-17459203436056562.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Gespw. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Gespw</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Gespw carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25419"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-gespw-cp25419",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-gespw-cp25419"
  },
  {
    "id": 153,
    "sku": "CP25420",
    "name": "Encordoamento Violao ACO Geewak",
    "price": "R$ 22,30",
    "priceNum": 22.30,
    "rating": 4.5,
    "reviews": 143,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25420-17458330766554249.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25420-17458330766554249.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Geewak. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Geewak</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Geewak carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25420"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-geewak-cp25420",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-geewak-cp25420"
  },
  {
    "id": 154,
    "sku": "CP25421",
    "name": "Encordoamento Violao ACO Geefle",
    "price": "R$ 22,30",
    "priceNum": 22.30,
    "rating": 4.6,
    "reviews": 114,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25421-17460173874314202.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25421-17460173874314202.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Geefle. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Geefle</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Geefle carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25421"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-geefle-cp25421",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-geefle-cp25421"
  },
  {
    "id": 155,
    "sku": "CP25422",
    "name": "Encordoamento Violao ACO Geeflk",
    "price": "R$ 22,10",
    "priceNum": 22.10,
    "rating": 4.9,
    "reviews": 201,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25422-17460173820938679.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25422-17460173820938679.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO Geeflk. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO Geeflk</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO Geeflk carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25422"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-geeflk-cp25422",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-geeflk-cp25422"
  },
  {
    "id": 156,
    "sku": "CP25424",
    "name": "Encordoamento Guitarra GESGT9",
    "price": "R$ 16,30",
    "priceNum": 16.30,
    "rating": 4.9,
    "reviews": 27,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Giannini",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/25424-17894526011104641.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/2/5/25424-17894526011104641.jpeg",
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra GESGT9. Giannini é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra GESGT9</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra GESGT9 é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Marca parceira: Giannini",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25424"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Giannini"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "encordoamento-guitarra-gesgt9-cp25424",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-gesgt9-cp25424"
  },
  {
    "id": 157,
    "sku": "CP25425",
    "name": "Encordoamento Guitarra GESGT10",
    "price": "R$ 16,30",
    "priceNum": 16.30,
    "rating": 4.4,
    "reviews": 468,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Giannini",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25425.jpg-17459152659418611.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25425.jpg-17459152659418611.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Guitarra GESGT10. Giannini é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Guitarra GESGT10</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Guitarra GESGT10 é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Marca parceira: Giannini",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25425"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Giannini"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "encordoamento-guitarra-gesgt10-cp25425",
    "productUrl": "https://tonante.com.br/encordoamento-guitarra-gesgt10-cp25425"
  },
  {
    "id": 158,
    "sku": "CP25664",
    "name": "Suporte em X Para Teclado X20",
    "price": "R$ 68,90",
    "priceNum": 68.90,
    "rating": 4.7,
    "reviews": 391,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25664.jpg-17459261245325728.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/5/25664.jpg-17459261245325728.jpeg"
    ],
    "inStock": true,
    "description": "Suporte em X Para Teclado X20. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte em X Para Teclado X20</h2><p>Parte da linha Tonante de suportes, o Suporte em X Para Teclado X20 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP25664"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-em-x-para-teclado-x20-cp25664",
    "productUrl": "https://tonante.com.br/suporte-em-x-para-teclado-x20-cp25664"
  },
  {
    "id": 159,
    "sku": "CP264289",
    "name": "Violão Nylon Eletroacústico Performance GNF-3 CEQ Translucent Dark Wine (tdw)",
    "price": "R$ 812,00",
    "priceNum": 812.00,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 431,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/6/264289_-_1-17459009948087158.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/6/264289_-_1-17459009948087158.jpeg"
    ],
    "inStock": true,
    "description": "Violão Nylon Eletroacústico Performance GNF-3 CEQ Translucent Dark Wine (tdw). Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Nylon Eletroacústico Performance GNF-3 CEQ Translucent Dark Wine (tdw)</h2><p>Parte da linha Tonante de violões, o Violão Nylon Eletroacústico Performance GNF-3 CEQ Translucent Dark Wine (tdw) carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP264289"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-nylon-eletroacustico-performance-gnf-3-ceq-translucent-dark-wine-tdw-cp264289",
    "productUrl": "https://tonante.com.br/violao-nylon-eletroacustico-performance-gnf-3-ceq-translucent-dark-wine-tdw-cp264289"
  },
  {
    "id": 160,
    "sku": "CP27752",
    "name": "Violao Eletrico ACO Cutaway GF1D CEQ WS",
    "price": "R$ 829,00",
    "priceNum": 829.00,
    "rating": 4.9,
    "reviews": 373,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27752-17460173238325331.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27752-17460173238325331.jpeg"
    ],
    "inStock": true,
    "description": "Violao Eletrico ACO Cutaway GF1D CEQ WS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Eletrico ACO Cutaway GF1D CEQ WS</h2><p>Parte da linha Tonante de violões, o Violao Eletrico ACO Cutaway GF1D CEQ WS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP27752"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-aco-cutaway-gf1d-ceq-ws-cp27752",
    "productUrl": "https://tonante.com.br/violao-eletrico-aco-cutaway-gf1d-ceq-ws-cp27752"
  },
  {
    "id": 161,
    "sku": "CP27757",
    "name": "Violao Eletrico Nylon GNF3 CEQ NS",
    "price": "R$ 858,90",
    "priceNum": 858.90,
    "rating": 4.8,
    "reviews": 228,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27757-17460173129464204.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27757-17460173129464204.jpeg"
    ],
    "inStock": true,
    "description": "Violao Eletrico Nylon GNF3 CEQ NS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Eletrico Nylon GNF3 CEQ NS</h2><p>Parte da linha Tonante de violões, o Violao Eletrico Nylon GNF3 CEQ NS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP27757"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-nylon-gnf3-ceq-ns-cp27757",
    "productUrl": "https://tonante.com.br/violao-eletrico-nylon-gnf3-ceq-ns-cp27757"
  },
  {
    "id": 162,
    "sku": "CP27759",
    "name": "Cavaco Eletroacustico CS-14 EP Preto",
    "price": "R$ 346,50",
    "priceNum": 346.50,
    "rating": 4.4,
    "reviews": 48,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27759-17460173074465728.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27759-17460173074465728.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Eletroacustico CS-14 EP Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Eletroacustico CS-14 EP Preto</h2><p>Parte da linha Tonante de acessórios, o Cavaco Eletroacustico CS-14 EP Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP27759"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-eletroacustico-cs-14-ep-preto-cp27759",
    "productUrl": "https://tonante.com.br/cavaco-eletroacustico-cs-14-ep-preto-cp27759"
  },
  {
    "id": 163,
    "sku": "CP27760",
    "name": "Cavaco Eletroacustico CS-14 EP Natural",
    "price": "R$ 393,90",
    "priceNum": 393.90,
    "badge": "Novidade",
    "rating": 4.6,
    "reviews": 480,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27760_1-17482937404663813.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/7/27760_1-17482937404663813.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Eletroacustico CS-14 EP Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Eletroacustico CS-14 EP Natural</h2><p>Parte da linha Tonante de acessórios, o Cavaco Eletroacustico CS-14 EP Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP27760"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-eletroacustico-cs-14-ep-natural-cp27760",
    "productUrl": "https://tonante.com.br/cavaco-eletroacustico-cs-14-ep-natural-cp27760"
  },
  {
    "id": 164,
    "sku": "CP28102",
    "name": "Viola Eletroacustica VS-14 EQ Preta",
    "price": "R$ 494,05",
    "priceNum": 494.05,
    "rating": 4.7,
    "reviews": 375,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Eletroacústico",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28102-17458588494637857.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28102-17458588494637857.jpeg"
    ],
    "inStock": true,
    "description": "Viola Eletroacustica VS-14 EQ Preta. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Eletroacustica VS-14 EQ Preta</h2><p>Parte da linha Tonante de acessórios, o Viola Eletroacustica VS-14 EQ Preta carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Eletroacústico · Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28102"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-eletroacustica-vs-14-eq-preta-cp28102",
    "productUrl": "https://tonante.com.br/viola-eletroacustica-vs-14-eq-preta-cp28102"
  },
  {
    "id": 165,
    "sku": "CP28463",
    "name": "Caixa Amplificada Elevate LP Usb/sd/bt 15'' 800W RMS",
    "price": "R$ 1.149,00",
    "priceNum": 1149.00,
    "rating": 4.9,
    "reviews": 95,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28463_1-17587373213956392.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28463_1-17587373213956392.jpeg"
    ],
    "inStock": true,
    "description": "Caixa Amplificada Elevate LP Usb/sd/bt 15'' 800W RMS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Caixa Amplificada Elevate LP Usb/sd/bt 15'' 800W RMS</h2><p>Parte da linha Tonante de acessórios, o Caixa Amplificada Elevate LP Usb/sd/bt 15'' 800W RMS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28463"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "caixa-amplificada-elevate-lp-usb-sd-bt-15-800w-rms-cp28463",
    "productUrl": "https://tonante.com.br/caixa-amplificada-elevate-lp-usb-sd-bt-15-800w-rms-cp28463"
  },
  {
    "id": 166,
    "sku": "CP28568",
    "name": "Violao Eletrico ACO GD1 EQ Vsbs Sunburst Satin",
    "price": "R$ 626,00",
    "priceNum": 626.00,
    "rating": 4.5,
    "reviews": 35,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28568-17522937053434790.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28568-17522937053434790.jpeg"
    ],
    "inStock": true,
    "description": "Violao Eletrico ACO GD1 EQ Vsbs Sunburst Satin. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Eletrico ACO GD1 EQ Vsbs Sunburst Satin</h2><p>Parte da linha Tonante de violões, o Violao Eletrico ACO GD1 EQ Vsbs Sunburst Satin carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28568"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-aco-gd1-eq-vsbs-sunburst-satin-cp28568",
    "productUrl": "https://tonante.com.br/violao-eletrico-aco-gd1-eq-vsbs-sunburst-satin-cp28568"
  },
  {
    "id": 167,
    "sku": "CP28777",
    "name": "Cavaco Acústico CS-14BK Preto",
    "price": "R$ 288,00",
    "priceNum": 288.00,
    "rating": 4.5,
    "reviews": 99,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28777_1-17480112038168219.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28777_1-17480112038168219.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Acústico CS-14BK Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Acústico CS-14BK Preto</h2><p>Parte da linha Tonante de acessórios, o Cavaco Acústico CS-14BK Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28777"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-acustico-cs-14bk-preto-cp28777",
    "productUrl": "https://tonante.com.br/cavaco-acustico-cs-14bk-preto-cp28777"
  },
  {
    "id": 168,
    "sku": "CP28778",
    "name": "Viola Acustica VS-14BK Preta",
    "price": "R$ 360,00",
    "priceNum": 360.00,
    "rating": 4.6,
    "reviews": 244,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28778-17523238807972305.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28778-17523238807972305.jpeg"
    ],
    "inStock": true,
    "description": "Viola Acustica VS-14BK Preta. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Acustica VS-14BK Preta</h2><p>Parte da linha Tonante de acessórios, o Viola Acustica VS-14BK Preta carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28778"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-acustica-vs-14bk-preta-cp28778",
    "productUrl": "https://tonante.com.br/viola-acustica-vs-14bk-preta-cp28778"
  },
  {
    "id": 169,
    "sku": "CP28993",
    "name": "Microfone sem FIO de MAO VHF695",
    "price": "R$ 200,00",
    "priceNum": 200.00,
    "rating": 4.9,
    "reviews": 317,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28993-17458134330301208.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28993-17458134330301208.jpeg"
    ],
    "inStock": true,
    "description": "Microfone sem FIO de MAO VHF695. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone sem FIO de MAO VHF695</h2><p>Parte da linha Tonante de acessórios, o Microfone sem FIO de MAO VHF695 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28993"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-sem-fio-de-mao-vhf695-cp28993",
    "productUrl": "https://tonante.com.br/microfone-sem-fio-de-mao-vhf695-cp28993",
    "oldPrice": "R$ 248,29",
    "oldPriceNum": 248.29,
    "badge": "Oferta"
  },
  {
    "id": 170,
    "sku": "CP28997",
    "name": "Microfone com FIO Profissional PRO",
    "price": "R$ 97,70",
    "priceNum": 97.70,
    "rating": 4.5,
    "reviews": 433,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28997-17539630769207113.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/8/28997-17539630769207113.jpeg"
    ],
    "inStock": true,
    "description": "Microfone com FIO Profissional PRO. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone com FIO Profissional PRO</h2><p>Parte da linha Tonante de acessórios, o Microfone com FIO Profissional PRO carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP28997"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-com-fio-profissional-pro-cp28997",
    "productUrl": "https://tonante.com.br/microfone-com-fio-profissional-pro-cp28997"
  },
  {
    "id": 171,
    "sku": "CP29033",
    "name": "Encordoamento Violao Nylon Genwpa",
    "price": "R$ 29,30",
    "priceNum": 29.30,
    "rating": 4.5,
    "reviews": 221,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29033-1-17683257513625501.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29033-1-17683257513625501.png"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon Genwpa. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon Genwpa</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon Genwpa carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29033"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-genwpa-cp29033",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-genwpa-cp29033",
    "badge": "Oferta"
  },
  {
    "id": 172,
    "sku": "CP29035",
    "name": "Encordoamento Violao Nylon Genwpm",
    "price": "R$ 29,20",
    "priceNum": 29.20,
    "rating": 4.5,
    "reviews": 395,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29035-1-17683257903503315.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29035-1-17683257903503315.png"
    ],
    "inStock": true,
    "description": "Encordoamento Violao Nylon Genwpm. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao Nylon Genwpm</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao Nylon Genwpm carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29035"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-nylon-genwpm-cp29035",
    "productUrl": "https://tonante.com.br/encordoamento-violao-nylon-genwpm-cp29035"
  },
  {
    "id": 173,
    "sku": "CP29036",
    "name": "Encordoamento Cavaco ACO Gescl",
    "price": "R$ 13,90",
    "priceNum": 13.90,
    "rating": 4.8,
    "reviews": 308,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29036-17460172807882125.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29036-17460172807882125.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Cavaco ACO Gescl. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Cavaco ACO Gescl</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Cavaco ACO Gescl carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29036"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-cavaco-aco-gescl-cp29036",
    "productUrl": "https://tonante.com.br/encordoamento-cavaco-aco-gescl-cp29036"
  },
  {
    "id": 174,
    "sku": "CP29038",
    "name": "Encordoamento Viola ACO Cobra Gesvl",
    "price": "R$ 24,10",
    "priceNum": 24.10,
    "rating": 4.6,
    "reviews": 18,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29038-17458341002875961.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29038-17458341002875961.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Viola ACO Cobra Gesvl. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Viola ACO Cobra Gesvl</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Viola ACO Cobra Gesvl carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29038"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-viola-aco-cobra-gesvl-cp29038",
    "productUrl": "https://tonante.com.br/encordoamento-viola-aco-cobra-gesvl-cp29038"
  },
  {
    "id": 175,
    "sku": "CP29039",
    "name": "Encordoamento Viola ACO Cobra Gesvm",
    "price": "R$ 23,90",
    "priceNum": 23.90,
    "rating": 4.5,
    "reviews": 47,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29039-17460172732108806.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29039-17460172732108806.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Viola ACO Cobra Gesvm. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Viola ACO Cobra Gesvm</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Viola ACO Cobra Gesvm carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29039"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-viola-aco-cobra-gesvm-cp29039",
    "productUrl": "https://tonante.com.br/encordoamento-viola-aco-cobra-gesvm-cp29039",
    "badge": "Oferta"
  },
  {
    "id": 176,
    "sku": "CP29040",
    "name": "Encordoamento Viola ACO Cobra Gesvp",
    "price": "R$ 23,90",
    "priceNum": 23.90,
    "rating": 4.9,
    "reviews": 431,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29040-17458228270786678.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29040-17458228270786678.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Viola ACO Cobra Gesvp. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Viola ACO Cobra Gesvp</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Viola ACO Cobra Gesvp carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29040"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-viola-aco-cobra-gesvp-cp29040",
    "productUrl": "https://tonante.com.br/encordoamento-viola-aco-cobra-gesvp-cp29040"
  },
  {
    "id": 177,
    "sku": "CP29056",
    "name": "Violao Eletrico ACO GSF-1D CEQ NG Natural",
    "price": "R$ 664,90",
    "priceNum": 664.90,
    "rating": 4.4,
    "reviews": 160,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29056-17522879776268390.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29056-17522879776268390.jpeg"
    ],
    "inStock": true,
    "description": "Violao Eletrico ACO GSF-1D CEQ NG Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Eletrico ACO GSF-1D CEQ NG Natural</h2><p>Parte da linha Tonante de violões, o Violao Eletrico ACO GSF-1D CEQ NG Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29056"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-aco-gsf-1d-ceq-ng-natural-cp29056",
    "productUrl": "https://tonante.com.br/violao-eletrico-aco-gsf-1d-ceq-ng-natural-cp29056"
  },
  {
    "id": 178,
    "sku": "CP29096",
    "name": "Encordoamento Violao ACO EJ13-B",
    "price": "R$ 57,10",
    "priceNum": 57.10,
    "rating": 4.4,
    "reviews": 268,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29096-17460172576404085.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29096-17460172576404085.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento Violao ACO EJ13-B. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento Violao ACO EJ13-B</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento Violao ACO EJ13-B carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29096"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-violao-aco-ej13-b-cp29096",
    "productUrl": "https://tonante.com.br/encordoamento-violao-aco-ej13-b-cp29096",
    "oldPrice": "R$ 66,63",
    "oldPriceNum": 66.63,
    "badge": "Oferta"
  },
  {
    "id": 179,
    "sku": "CP29405",
    "name": "Violao Eletrico Flat ACO SF-14 CEQ N Natural",
    "price": "R$ 531,00",
    "priceNum": 531.00,
    "rating": 4.4,
    "reviews": 94,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29405-17458536562491594.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29405-17458536562491594.jpeg"
    ],
    "inStock": true,
    "description": "Violao Eletrico Flat ACO SF-14 CEQ N Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Eletrico Flat ACO SF-14 CEQ N Natural</h2><p>Parte da linha Tonante de violões, o Violao Eletrico Flat ACO SF-14 CEQ N Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29405"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-flat-aco-sf-14-ceq-n-natural-cp29405",
    "productUrl": "https://tonante.com.br/violao-eletrico-flat-aco-sf-14-ceq-n-natural-cp29405"
  },
  {
    "id": 180,
    "sku": "CP29438",
    "name": "Suporte Para Violao GT1 Preto",
    "price": "R$ 149,90",
    "priceNum": 149.9,
    "rating": 4.4,
    "reviews": 214,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29438-17458657133267478.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29438-17458657133267478.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Para Violao GT1 Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Para Violao GT1 Preto</h2><p>Parte da linha Tonante de suportes, o Suporte Para Violao GT1 Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29438"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-para-violao-gt1-preto-cp29438",
    "productUrl": "https://tonante.com.br/suporte-para-violao-gt1-preto-cp29438",
    "oldPrice": "R$ 199,90",
    "oldPriceNum": 199.9,
    "badge": "Oferta"
  },
  {
    "id": 181,
    "sku": "CP29440",
    "name": "Suporte Parede P/ Violao/guitarra Spfr",
    "price": "R$ 169,90",
    "priceNum": 169.9,
    "rating": 4.9,
    "reviews": 459,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29440-17458496461946713.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29440-17458496461946713.jpeg"
    ],
    "inStock": true,
    "description": "Suporte Parede P/ Violao/guitarra Spfr. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte Parede P/ Violao/guitarra Spfr</h2><p>Parte da linha Tonante de suportes, o Suporte Parede P/ Violao/guitarra Spfr carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29440"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-parede-p-violao-guitarra-spfr-cp29440",
    "productUrl": "https://tonante.com.br/suporte-parede-p-violao-guitarra-spfr-cp29440",
    "oldPrice": "R$ 199,90",
    "oldPriceNum": 199.9,
    "badge": "Oferta"
  },
  {
    "id": 182,
    "sku": "CP29441",
    "name": "Suporte de Parede Fixo 24CM 25KG SPC177",
    "price": "R$ 42,45",
    "priceNum": 42.45,
    "rating": 4.4,
    "reviews": 430,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29441-17459045229614227.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29441-17459045229614227.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede Fixo 24CM 25KG SPC177. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede Fixo 24CM 25KG SPC177</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede Fixo 24CM 25KG SPC177 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29441"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-fixo-24cm-25kg-spc177-cp29441",
    "productUrl": "https://tonante.com.br/suporte-de-parede-fixo-24cm-25kg-spc177-cp29441"
  },
  {
    "id": 183,
    "sku": "CP29442",
    "name": "Suporte de Parede Regulavel 35KG Spcr",
    "price": "R$ 56,25",
    "priceNum": 56.25,
    "rating": 4.5,
    "reviews": 401,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29442-17459255409714100.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29442-17459255409714100.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede Regulavel 35KG Spcr. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede Regulavel 35KG Spcr</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede Regulavel 35KG Spcr carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29442"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-regulavel-35kg-spcr-cp29442",
    "productUrl": "https://tonante.com.br/suporte-de-parede-regulavel-35kg-spcr-cp29442"
  },
  {
    "id": 184,
    "sku": "CP29570",
    "name": "Suporte de Parede P/ Violao/guitarra AGS",
    "price": "R$ 39,50",
    "priceNum": 39.50,
    "rating": 4.9,
    "reviews": 81,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29570_2-17459181526727946.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29570_2-17459181526727946.jpeg"
    ],
    "inStock": true,
    "description": "Suporte de Parede P/ Violao/guitarra AGS. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Suporte de Parede P/ Violao/guitarra AGS</h2><p>Parte da linha Tonante de suportes, o Suporte de Parede P/ Violao/guitarra AGS carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Suportes",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29570"
      },
      {
        "label": "Categoria",
        "value": "Suportes"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "suporte-de-parede-p-violao-guitarra-ags-cp29570",
    "productUrl": "https://tonante.com.br/suporte-de-parede-p-violao-guitarra-ags-cp29570"
  },
  {
    "id": 185,
    "sku": "CP29581",
    "name": "Microfone C/ Fio Profissional LS58 Champanhe",
    "price": "R$ 159,90",
    "priceNum": 159.9,
    "rating": 4.5,
    "reviews": 287,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29581-1-17707778359919208.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/29581-1-17707778359919208.png"
    ],
    "inStock": true,
    "description": "Microfone C/ Fio Profissional LS58 Champanhe. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone C/ Fio Profissional LS58 Champanhe</h2><p>Parte da linha Tonante de acessórios, o Microfone C/ Fio Profissional LS58 Champanhe carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP29581"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-c-fio-profissional-ls58-champanhe-cp29581",
    "productUrl": "https://tonante.com.br/microfone-c-fio-profissional-ls58-champanhe-cp29581",
    "oldPrice": "R$ 169,90",
    "oldPriceNum": 169.9,
    "badge": "Oferta"
  },
  {
    "id": 186,
    "sku": "CP296011",
    "name": "Microfone UHF Dupla Frequência Fixa Transmissão Digital",
    "price": "R$ 407,00",
    "priceNum": 407.00,
    "rating": 4.9,
    "reviews": 463,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/M/I/MICROFONE_UHF_DUPLA_FREQUENCIA_FIXA_TRANSMISSAO_DIGITAL-17483502582767010.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/M/I/MICROFONE_UHF_DUPLA_FREQUENCIA_FIXA_TRANSMISSAO_DIGITAL-17483502582767010.png"
    ],
    "inStock": true,
    "description": "Microfone UHF Dupla Frequência Fixa Transmissão Digital. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone UHF Dupla Frequência Fixa Transmissão Digital</h2><p>Parte da linha Tonante de acessórios, o Microfone UHF Dupla Frequência Fixa Transmissão Digital carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP296011"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-uhf-dupla-frequencia-fixa-transmissao-digital-cp296011",
    "productUrl": "https://tonante.com.br/microfone-uhf-dupla-frequencia-fixa-transmissao-digital-cp296011"
  },
  {
    "id": 187,
    "sku": "CP296015",
    "name": "Microfone UHF Duplo Multi-frequência 2X300 Canais Transmissão Digital",
    "price": "R$ 540,00",
    "priceNum": 540.00,
    "rating": 4.5,
    "reviews": 109,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/296015_1.jpg-17479413198836920.png",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/2/9/296015_1.jpg-17479413198836920.png"
    ],
    "inStock": true,
    "description": "Microfone UHF Duplo Multi-frequência 2X300 Canais Transmissão Digital. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone UHF Duplo Multi-frequência 2X300 Canais Transmissão Digital</h2><p>Parte da linha Tonante de acessórios, o Microfone UHF Duplo Multi-frequência 2X300 Canais Transmissão Digital carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP296015"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-uhf-duplo-multi-frequencia-2x300-canais-transmissao-digital-cp296015",
    "productUrl": "https://tonante.com.br/microfone-uhf-duplo-multi-frequencia-2x300-canais-transmissao-digital-cp296015"
  },
  {
    "id": 188,
    "sku": "CP303442",
    "name": "Correia Tonante de Polipropileno Lisa Preta- TN01P",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.8,
    "reviews": 192,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303442_1-17510478646444437.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303442_1-17510478646444437.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Preta- TN01P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Preta- TN01P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Preta- TN01P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303442"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-preta-tn01p-cp303442",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-preta-tn01p-cp303442",
    "oldPrice": "R$ 21,96",
    "oldPriceNum": 21.96,
    "badge": "Oferta"
  },
  {
    "id": 189,
    "sku": "CP303447",
    "name": "Correia Tonante de Polipropileno Lisa Vermelha - TN04P",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.9,
    "reviews": 337,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303447_1-17510493049895374.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303447_1-17510493049895374.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Vermelha - TN04P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Vermelha - TN04P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Vermelha - TN04P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303447"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-vermelha-tn04p-cp303447",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-vermelha-tn04p-cp303447"
  },
  {
    "id": 190,
    "sku": "CP303448",
    "name": "Correia Tonante de Polipropileno Lisa Azul-escura - TN03P",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.8,
    "reviews": 18,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303448_1-17510493653606832.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303448_1-17510493653606832.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Azul-escura - TN03P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Azul-escura - TN03P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Azul-escura - TN03P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303448"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-azul-escura-tn03p-cp303448",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-azul-escura-tn03p-cp303448"
  },
  {
    "id": 191,
    "sku": "CP303449",
    "name": "Correia Tonante de Polipropileno Lisa Verde - TN05P",
    "price": "R$ 14,93",
    "priceNum": 14.93,
    "rating": 4.7,
    "reviews": 47,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303449_1-17510494293286907.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303449_1-17510494293286907.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Verde - TN05P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Verde - TN05P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Verde - TN05P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303449"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-verde-tn05p-cp303449",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-verde-tn05p-cp303449",
    "oldPrice": "R$ 18,33",
    "oldPriceNum": 18.33,
    "badge": "Oferta"
  },
  {
    "id": 192,
    "sku": "CP303453",
    "name": "Correia Tonante de Polipropileno Lisa Violeta- TN06P",
    "price": "R$ 14,93",
    "priceNum": 14.93,
    "rating": 4.4,
    "reviews": 254,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303453_1-17510495448917238.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303453_1-17510495448917238.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Violeta- TN06P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Violeta- TN06P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Violeta- TN06P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303453"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-violeta-tn06p-cp303453",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-violeta-tn06p-cp303453",
    "oldPrice": "R$ 18,33",
    "oldPriceNum": 18.33,
    "badge": "Oferta"
  },
  {
    "id": 193,
    "sku": "CP303456",
    "name": "Correia Tonante de Polipropileno Lisa Azul-clara - TN031P",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.5,
    "reviews": 303,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303456_1-17510497854449071.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303456_1-17510497854449071.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Polipropileno Lisa Azul-clara - TN031P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Polipropileno Lisa Azul-clara - TN031P</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Polipropileno Lisa Azul-clara - TN031P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303456"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-polipropileno-lisa-azul-clara-tn031p-cp303456",
    "productUrl": "https://tonante.com.br/correia-tonante-de-polipropileno-lisa-azul-clara-tn031p-cp303456"
  },
  {
    "id": 194,
    "sku": "CP303472",
    "name": "Correia Tonante de Poliéster Design Woodstock Vermelha - TN11S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.9,
    "reviews": 33,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303472_1-17510503865329860.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303472_1-17510503865329860.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Design Woodstock Vermelha - TN11S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Design Woodstock Vermelha - TN11S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Design Woodstock Vermelha - TN11S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303472"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-design-woodstock-vermelha-tn11s-cp303472",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-design-woodstock-vermelha-tn11s-cp303472"
  },
  {
    "id": 195,
    "sku": "CP303489",
    "name": "Correia Tonante de Poliéster Animal Print Chita - TN09S",
    "price": "R$ 24,68",
    "priceNum": 24.68,
    "rating": 4.7,
    "reviews": 405,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303489_1-17510505050882630.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303489_1-17510505050882630.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Animal Print Chita - TN09S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Animal Print Chita - TN09S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Animal Print Chita - TN09S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303489"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-animal-print-chita-tn09s-cp303489",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-animal-print-chita-tn09s-cp303489",
    "badge": "Oferta"
  },
  {
    "id": 196,
    "sku": "CP303490",
    "name": "Correia Tonante de Poliéster Animal Print Cobra - TN09S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.9,
    "reviews": 303,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303490_-17510506271663693.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303490_-17510506271663693.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Animal Print Cobra - TN09S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Animal Print Cobra - TN09S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Animal Print Cobra - TN09S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303490"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-animal-print-cobra-tn09s-cp303490",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-animal-print-cobra-tn09s-cp303490"
  },
  {
    "id": 197,
    "sku": "CP303493",
    "name": "Correia Tonante de Poliéster Animal Print Tigre - TN09S",
    "price": "R$ 24,68",
    "priceNum": 24.68,
    "rating": 4.8,
    "reviews": 332,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303493_-17510508085356723.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303493_-17510508085356723.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Animal Print Tigre - TN09S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Animal Print Tigre - TN09S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Animal Print Tigre - TN09S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303493"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-animal-print-tigre-tn09s-cp303493",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-animal-print-tigre-tn09s-cp303493"
  },
  {
    "id": 198,
    "sku": "CP303506",
    "name": "Correia Tonante de Poliéster Animal Print Vaca - TN09S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.5,
    "reviews": 225,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303506_1-17510507444664915.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303506_1-17510507444664915.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Animal Print Vaca - TN09S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Animal Print Vaca - TN09S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Animal Print Vaca - TN09S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303506"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-animal-print-vaca-tn09s-cp303506",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-animal-print-vaca-tn09s-cp303506"
  },
  {
    "id": 199,
    "sku": "CP303507",
    "name": "Correia Tonante de Poliéster Estampa Floral Laranja - TN10S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.6,
    "reviews": 196,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303507_1-17510515846911976.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303507_1-17510515846911976.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Estampa Floral Laranja - TN10S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Estampa Floral Laranja - TN10S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Estampa Floral Laranja - TN10S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303507"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-estampa-floral-laranja-tn10s-cp303507",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-estampa-floral-laranja-tn10s-cp303507"
  },
  {
    "id": 200,
    "sku": "CP303508",
    "name": "Correia Tonante de Poliéster Estampa Floral Rosa - TN10S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.9,
    "reviews": 161,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303508_1-17510516524816332.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303508_1-17510516524816332.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Estampa Floral Rosa - TN10S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Estampa Floral Rosa - TN10S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Estampa Floral Rosa - TN10S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303508"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-estampa-floral-rosa-tn10s-cp303508",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-estampa-floral-rosa-tn10s-cp303508"
  },
  {
    "id": 201,
    "sku": "CP303509",
    "name": "Correia Tonante de Poliéster Estampa Floral Violeta - TN10S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.4,
    "reviews": 132,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303509_1-17510516987597580.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303509_1-17510516987597580.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Estampa Floral Violeta - TN10S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Estampa Floral Violeta - TN10S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Estampa Floral Violeta - TN10S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303509"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-estampa-floral-violeta-tn10s-cp303509",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-estampa-floral-violeta-tn10s-cp303509",
    "oldPrice": "R$ 41,57",
    "oldPriceNum": 41.57,
    "badge": "Oferta"
  },
  {
    "id": 202,
    "sku": "CP303510",
    "name": "Correia Tonante de Poliéster Estampa Floral Branca e Preta - TN10S",
    "price": "R$ 32,90",
    "priceNum": 32.90,
    "rating": 4.6,
    "reviews": 240,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303510_1-17510517774514117.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303510_1-17510517774514117.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Poliéster Estampa Floral Branca e Preta - TN10S. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Poliéster Estampa Floral Branca e Preta - TN10S</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Poliéster Estampa Floral Branca e Preta - TN10S carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303510"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-poliester-estampa-floral-branca-e-preta-tn10s-cp303510",
    "productUrl": "https://tonante.com.br/correia-tonante-de-poliester-estampa-floral-branca-e-preta-tn10s-cp303510"
  },
  {
    "id": 203,
    "sku": "CP303571",
    "name": "Correia Tonante de Couro Argentino cor Preta -TN01C",
    "price": "R$ 62,90",
    "priceNum": 62.90,
    "rating": 4.5,
    "reviews": 123,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303571_1-17510518269735458.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303571_1-17510518269735458.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Couro Argentino cor Preta -TN01C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Couro Argentino cor Preta -TN01C</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Couro Argentino cor Preta -TN01C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303571"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-couro-argentino-cor-preta-tn01c-cp303571",
    "productUrl": "https://tonante.com.br/correia-tonante-de-couro-argentino-cor-preta-tn01c-cp303571"
  },
  {
    "id": 204,
    "sku": "CP303572",
    "name": "Correia Tonante de Couro Argentino cor Marrom - TN02C",
    "price": "R$ 62,90",
    "priceNum": 62.90,
    "rating": 4.8,
    "reviews": 36,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303572_1-17510518891916846.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303572_1-17510518891916846.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Couro Argentino cor Marrom - TN02C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Couro Argentino cor Marrom - TN02C</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Couro Argentino cor Marrom - TN02C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303572"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-couro-argentino-cor-marrom-tn02c-cp303572",
    "productUrl": "https://tonante.com.br/correia-tonante-de-couro-argentino-cor-marrom-tn02c-cp303572"
  },
  {
    "id": 205,
    "sku": "CP303622",
    "name": "Correia Tonante de Couro Argentino cor Azul-escuro - TN03C",
    "price": "R$ 50,32",
    "priceNum": 50.32,
    "rating": 4.8,
    "reviews": 404,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303622_1-17510519470696200.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303622_1-17510519470696200.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Couro Argentino cor Azul-escuro - TN03C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Couro Argentino cor Azul-escuro - TN03C</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Couro Argentino cor Azul-escuro - TN03C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303622"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-couro-argentino-cor-azul-escuro-tn03c-cp303622",
    "productUrl": "https://tonante.com.br/correia-tonante-de-couro-argentino-cor-azul-escuro-tn03c-cp303622"
  },
  {
    "id": 206,
    "sku": "CP303624",
    "name": "Correia Tonante de Couro Argentino cor Verde Militar - TN051C",
    "price": "R$ 62,90",
    "priceNum": 62.90,
    "rating": 4.8,
    "reviews": 108,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303624_1-17510519966317051.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303624_1-17510519966317051.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Couro Argentino cor Verde Militar - TN051C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Couro Argentino cor Verde Militar - TN051C</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Couro Argentino cor Verde Militar - TN051C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303624"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-couro-argentino-cor-verde-militar-tn051c-cp303624",
    "productUrl": "https://tonante.com.br/correia-tonante-de-couro-argentino-cor-verde-militar-tn051c-cp303624"
  },
  {
    "id": 207,
    "sku": "CP303652",
    "name": "Violão Elétrico Jade Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas- VTJM1954",
    "price": "R$ 559,90",
    "priceNum": 559.90,
    "rating": 4.7,
    "reviews": 299,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303562-17601019297722082.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303562-17601019297722082.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Jade Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas- VTJM1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Jade Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas- VTJM1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Jade Mini 36\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas- VTJM1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303652"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-jade-mini-36-tampo-em-spruce-acabamento-fosco-eq-3-bandas-vtjm1954-cp303652",
    "productUrl": "https://tonante.com.br/violao-eletrico-jade-mini-36-tampo-em-spruce-acabamento-fosco-eq-3-bandas-vtjm1954-cp303652"
  },
  {
    "id": 208,
    "sku": "CP303655",
    "name": "Correia Tonante de Couro Argentino cor Caramelo- TN12C",
    "price": "R$ 50,32",
    "priceNum": 50.32,
    "rating": 4.8,
    "reviews": 444,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303655_-17510520416651491.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303655_-17510520416651491.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Couro Argentino cor Caramelo- TN12C. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Couro Argentino cor Caramelo- TN12C</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Couro Argentino cor Caramelo- TN12C carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303655"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-couro-argentino-cor-caramelo-tn12c-cp303655",
    "productUrl": "https://tonante.com.br/correia-tonante-de-couro-argentino-cor-caramelo-tn12c-cp303655"
  },
  {
    "id": 209,
    "sku": "CP303656",
    "name": "Violão Elétrico Masaya 41\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVMS1954",
    "price": "R$ 649,90",
    "priceNum": 649.90,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 415,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303656-17601040478759442.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303656-17601040478759442.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Masaya 41\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVMS1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Masaya 41\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVMS1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Masaya 41\" - Tampo EM Spruce - Acabamento Fosco - EQ 3 Bandas - TVMS1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303656"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-masaya-41-tampo-em-spruce-acabamento-fosco-eq-3-bandas-tvms1954-cp303656",
    "productUrl": "https://tonante.com.br/violao-eletrico-masaya-41-tampo-em-spruce-acabamento-fosco-eq-3-bandas-tvms1954-cp303656"
  },
  {
    "id": 210,
    "sku": "CP303658",
    "name": "Correia Tonante de Camurça Argentina cor Preta -TN01CA",
    "price": "R$ 50,32",
    "priceNum": 50.32,
    "rating": 4.9,
    "reviews": 119,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303658_1-17510520925152157.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303658_1-17510520925152157.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Camurça Argentina cor Preta -TN01CA. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Camurça Argentina cor Preta -TN01CA</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Camurça Argentina cor Preta -TN01CA carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303658"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-camurca-argentina-cor-preta-tn01ca-cp303658",
    "productUrl": "https://tonante.com.br/correia-tonante-de-camurca-argentina-cor-preta-tn01ca-cp303658"
  },
  {
    "id": 211,
    "sku": "CP303659",
    "name": "Correia Tonante de Camurça Argentina cor Marrom - TN02CA",
    "price": "R$ 62,90",
    "priceNum": 62.90,
    "rating": 4.4,
    "reviews": 90,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303659_1-17510521839201627.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303659_1-17510521839201627.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante de Camurça Argentina cor Marrom - TN02CA. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante de Camurça Argentina cor Marrom - TN02CA</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante de Camurça Argentina cor Marrom - TN02CA carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303659"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-de-camurca-argentina-cor-marrom-tn02ca-cp303659",
    "productUrl": "https://tonante.com.br/correia-tonante-de-camurca-argentina-cor-marrom-tn02ca-cp303659"
  },
  {
    "id": 212,
    "sku": "CP303661",
    "name": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon- Sunburst- VTLSC1954SB",
    "price": "R$ 399,90",
    "priceNum": 399.90,
    "rating": 4.9,
    "reviews": 75,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303661_1-17691716109475930.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303661_1-17691716109475930.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon- Sunburst- VTLSC1954SB. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon- Sunburst- VTLSC1954SB</h2><p>Parte da linha Tonante de violões, o Violão Clássico Eletro-acústico Lorenzzo 39\" - Slim Cutaway - Nylon- Sunburst- VTLSC1954SB carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303661"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-sunburst-vtlsc1954sb-cp303661",
    "productUrl": "https://tonante.com.br/violao-classico-eletro-acustico-lorenzzo-39-slim-cutaway-nylon-sunburst-vtlsc1954sb-cp303661"
  },
  {
    "id": 213,
    "sku": "CP303663",
    "name": "Correia Tonante Talabarte de Polipropileno cor Preta- TN01T",
    "price": "R$ 12,90",
    "priceNum": 12.90,
    "rating": 4.5,
    "reviews": 487,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303663_1-17510522306704028.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/0/303663_1-17510522306704028.jpeg"
    ],
    "inStock": true,
    "description": "Correia Tonante Talabarte de Polipropileno cor Preta- TN01T. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Correia Tonante Talabarte de Polipropileno cor Preta- TN01T</h2><p>Parte da linha Tonante de acessórios, o Correia Tonante Talabarte de Polipropileno cor Preta- TN01T carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP303663"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "correia-tonante-talabarte-de-polipropileno-cor-preta-tn01t-cp303663",
    "productUrl": "https://tonante.com.br/correia-tonante-talabarte-de-polipropileno-cor-preta-tn01t-cp303663"
  },
  {
    "id": 214,
    "sku": "CP31350",
    "name": "Ukulele Soprano GUK-21 ZW Zebra",
    "price": "R$ 257,31",
    "priceNum": 257.31,
    "rating": 4.8,
    "reviews": 332,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31350-17522877064491910.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31350-17522877064491910.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Soprano GUK-21 ZW Zebra. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Soprano GUK-21 ZW Zebra</h2><p>Parte da linha Tonante de violões, o Ukulele Soprano GUK-21 ZW Zebra carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP31350"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-soprano-guk-21-zw-zebra-cp31350",
    "productUrl": "https://tonante.com.br/ukulele-soprano-guk-21-zw-zebra-cp31350"
  },
  {
    "id": 215,
    "sku": "CP31351",
    "name": "Ukulele Concerto GUK-23 WS Sapele",
    "price": "R$ 284,90",
    "priceNum": 284.90,
    "rating": 4.7,
    "reviews": 361,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31351-17458455072014652.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31351-17458455072014652.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Concerto GUK-23 WS Sapele. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Concerto GUK-23 WS Sapele</h2><p>Parte da linha Tonante de violões, o Ukulele Concerto GUK-23 WS Sapele carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP31351"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-concerto-guk-23-ws-sapele-cp31351",
    "productUrl": "https://tonante.com.br/ukulele-concerto-guk-23-ws-sapele-cp31351"
  },
  {
    "id": 216,
    "sku": "CP31352",
    "name": "Ukulele Concerto GUK-23 ZW Zebra",
    "price": "R$ 300,90",
    "priceNum": 300.90,
    "rating": 4.4,
    "reviews": 274,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31352-17522686935888342.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31352-17522686935888342.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Concerto GUK-23 ZW Zebra. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Concerto GUK-23 ZW Zebra</h2><p>Parte da linha Tonante de violões, o Ukulele Concerto GUK-23 ZW Zebra carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP31352"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-concerto-guk-23-zw-zebra-cp31352",
    "productUrl": "https://tonante.com.br/ukulele-concerto-guk-23-zw-zebra-cp31352"
  },
  {
    "id": 217,
    "sku": "CP31353",
    "name": "Ukulele Soprano UKS-21 NS Natural",
    "price": "R$ 222,90",
    "priceNum": 222.90,
    "rating": 4.9,
    "reviews": 303,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31353-17523314915317577.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/31353-17523314915317577.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Soprano UKS-21 NS Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Soprano UKS-21 NS Natural</h2><p>Parte da linha Tonante de violões, o Ukulele Soprano UKS-21 NS Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP31353"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-soprano-uks-21-ns-natural-cp31353",
    "productUrl": "https://tonante.com.br/ukulele-soprano-uks-21-ns-natural-cp31353"
  },
  {
    "id": 218,
    "sku": "CP314787",
    "name": "Viola Eletroacústica Tonante - Natural - VTN1954NE",
    "price": "R$ 489,90",
    "priceNum": 489.90,
    "rating": 4.8,
    "reviews": 320,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Eletroacústico",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314787_1-17693492338688925.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314787_1-17693492338688925.jpeg"
    ],
    "inStock": true,
    "description": "Viola Eletroacústica Tonante - Natural - VTN1954NE. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Eletroacústica Tonante - Natural - VTN1954NE</h2><p>Parte da linha Tonante de acessórios, o Viola Eletroacústica Tonante - Natural - VTN1954NE carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Eletroacústico · Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314787"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-eletroacustica-tonante-natural-vtn1954ne-cp314787",
    "productUrl": "https://tonante.com.br/viola-eletroacustica-tonante-natural-vtn1954ne-cp314787"
  },
  {
    "id": 219,
    "sku": "CP314791",
    "name": "Viola Acústica Tonante- Natural - VTN1954N",
    "price": "R$ 389,90",
    "priceNum": 389.90,
    "rating": 4.5,
    "reviews": 277,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314791_1-17692712428874405.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314791_1-17692712428874405.jpeg"
    ],
    "inStock": true,
    "description": "Viola Acústica Tonante- Natural - VTN1954N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Acústica Tonante- Natural - VTN1954N</h2><p>Parte da linha Tonante de acessórios, o Viola Acústica Tonante- Natural - VTN1954N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314791"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-acustica-tonante-natural-vtn1954n-cp314791",
    "productUrl": "https://tonante.com.br/viola-acustica-tonante-natural-vtn1954n-cp314791",
    "badge": "Oferta"
  },
  {
    "id": 220,
    "sku": "CP314824",
    "name": "Viola Eletroacústica Tonante - Black - VTN1954BKE",
    "price": "R$ 444,53",
    "priceNum": 444.53,
    "rating": 4.8,
    "reviews": 92,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Eletroacústico",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314824_1-17693088323616088.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314824_1-17693088323616088.jpeg"
    ],
    "inStock": true,
    "description": "Viola Eletroacústica Tonante - Black - VTN1954BKE. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Eletroacústica Tonante - Black - VTN1954BKE</h2><p>Parte da linha Tonante de acessórios, o Viola Eletroacústica Tonante - Black - VTN1954BKE carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Eletroacústico · Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314824"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-eletroacustica-tonante-black-vtn1954bke-cp314824",
    "productUrl": "https://tonante.com.br/viola-eletroacustica-tonante-black-vtn1954bke-cp314824",
    "badge": "Oferta"
  },
  {
    "id": 221,
    "sku": "CP314826",
    "name": "Viola Acústica Tonante - Black - VTN1954BK",
    "price": "R$ 338,31",
    "priceNum": 338.31,
    "rating": 4.6,
    "reviews": 150,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314826_1-17693261760092628.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314826_1-17693261760092628.jpeg"
    ],
    "inStock": true,
    "description": "Viola Acústica Tonante - Black - VTN1954BK. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Viola Acústica Tonante - Black - VTN1954BK</h2><p>Parte da linha Tonante de acessórios, o Viola Acústica Tonante - Black - VTN1954BK carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico · Viola",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314826"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "viola-acustica-tonante-black-vtn1954bk-cp314826",
    "productUrl": "https://tonante.com.br/viola-acustica-tonante-black-vtn1954bk-cp314826"
  },
  {
    "id": 222,
    "sku": "CP314827",
    "name": "Cavaco Elétrico Tonante - Natural - CTN1954NE",
    "price": "R$ 339,90",
    "priceNum": 339.90,
    "rating": 4.5,
    "reviews": 179,
    "category": "Violões",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314827_1-17691726250833262.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314827_1-17691726250833262.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Elétrico Tonante - Natural - CTN1954NE. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Elétrico Tonante - Natural - CTN1954NE</h2><p>Parte da linha Tonante de acessórios, o Cavaco Elétrico Tonante - Natural - CTN1954NE carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314827"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-eletrico-tonante-natural-ctn1954ne-cp314827",
    "productUrl": "https://tonante.com.br/cavaco-eletrico-tonante-natural-ctn1954ne-cp314827"
  },
  {
    "id": 223,
    "sku": "CP314828",
    "name": "Cavaco Acústico Tonante - Natural - CTN1954N",
    "price": "R$ 269,90",
    "priceNum": 269.90,
    "rating": 4.6,
    "reviews": 446,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314828_-17691727384089153.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314828_-17691727384089153.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Acústico Tonante - Natural - CTN1954N. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Acústico Tonante - Natural - CTN1954N</h2><p>Parte da linha Tonante de acessórios, o Cavaco Acústico Tonante - Natural - CTN1954N carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314828"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-acustico-tonante-natural-ctn1954n-cp314828",
    "productUrl": "https://tonante.com.br/cavaco-acustico-tonante-natural-ctn1954n-cp314828",
    "badge": "Oferta"
  },
  {
    "id": 224,
    "sku": "CP314830",
    "name": "Cavaco Elétrico Tonante - Preto - CTN1954PE",
    "price": "R$ 310,11",
    "priceNum": 310.11,
    "rating": 4.9,
    "reviews": 367,
    "category": "Violões",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314830_1-17691728390817499.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314830_1-17691728390817499.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Elétrico Tonante - Preto - CTN1954PE. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Elétrico Tonante - Preto - CTN1954PE</h2><p>Parte da linha Tonante de acessórios, o Cavaco Elétrico Tonante - Preto - CTN1954PE carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314830"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-eletrico-tonante-preto-ctn1954pe-cp314830",
    "productUrl": "https://tonante.com.br/cavaco-eletrico-tonante-preto-ctn1954pe-cp314830"
  },
  {
    "id": 225,
    "sku": "CP314831",
    "name": "Cavaco Acústico Tonante - Preto - CTN1954P",
    "price": "R$ 244,31",
    "priceNum": 244.31,
    "rating": 4.4,
    "reviews": 338,
    "category": "Violões",
    "tags": [
      "Acessórios",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314831_1-17691729356873364.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314831_1-17691729356873364.jpeg"
    ],
    "inStock": true,
    "description": "Cavaco Acústico Tonante - Preto - CTN1954P. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cavaco Acústico Tonante - Preto - CTN1954P</h2><p>Parte da linha Tonante de acessórios, o Cavaco Acústico Tonante - Preto - CTN1954P carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314831"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "cavaco-acustico-tonante-preto-ctn1954p-cp314831",
    "productUrl": "https://tonante.com.br/cavaco-acustico-tonante-preto-ctn1954p-cp314831"
  },
  {
    "id": 226,
    "sku": "CP314833",
    "name": "Ukulele Soprano - Haka - Mahogany - USH1954M",
    "price": "R$ 147,90",
    "priceNum": 147.90,
    "rating": 4.6,
    "reviews": 280,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314833-17692591430362710.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314833-17692591430362710.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Soprano - Haka - Mahogany - USH1954M. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Soprano - Haka - Mahogany - USH1954M</h2><p>Parte da linha Tonante de violões, o Ukulele Soprano - Haka - Mahogany - USH1954M carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314833"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-soprano-haka-mahogany-ush1954m-cp314833",
    "productUrl": "https://tonante.com.br/ukulele-soprano-haka-mahogany-ush1954m-cp314833"
  },
  {
    "id": 227,
    "sku": "CP314834",
    "name": "Ukulele Concert - Haka - Mahogany - UCH1954M",
    "price": "R$ 159,90",
    "priceNum": 159.90,
    "rating": 4.7,
    "reviews": 251,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314834-17692600882486556.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314834-17692600882486556.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Concert - Haka - Mahogany - UCH1954M. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Concert - Haka - Mahogany - UCH1954M</h2><p>Parte da linha Tonante de violões, o Ukulele Concert - Haka - Mahogany - UCH1954M carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314834"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-concert-haka-mahogany-uch1954m-cp314834",
    "productUrl": "https://tonante.com.br/ukulele-concert-haka-mahogany-uch1954m-cp314834",
    "oldPrice": "R$ 164,60",
    "oldPriceNum": 164.60,
    "badge": "Oferta"
  },
  {
    "id": 228,
    "sku": "CP314850",
    "name": "Ukulele Soprano - Haka - KOA - USH1954K",
    "price": "R$ 219,90",
    "priceNum": 219.90,
    "rating": 4.7,
    "reviews": 97,
    "category": "Violões",
    "tags": [
      "Violões",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314850-17693262784312119.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/1/314850-17693262784312119.jpeg"
    ],
    "inStock": true,
    "description": "Ukulele Soprano - Haka - KOA - USH1954K. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Ukulele Soprano - Haka - KOA - USH1954K</h2><p>Parte da linha Tonante de violões, o Ukulele Soprano - Haka - KOA - USH1954K carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Ukulele",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP314850"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "ukulele-soprano-haka-koa-ush1954k-cp314850",
    "productUrl": "https://tonante.com.br/ukulele-soprano-haka-koa-ush1954k-cp314850"
  },
  {
    "id": 229,
    "sku": "CP320127",
    "name": "KIT de 7 Microfones Para Bateria SADRUM7",
    "price": "R$ 169,90",
    "priceNum": 169.9,
    "rating": 4.5,
    "reviews": 265,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320127_3-17491297447224493.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320127_3-17491297447224493.jpeg"
    ],
    "inStock": true,
    "description": "KIT de 7 Microfones Para Bateria SADRUM7. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>KIT de 7 Microfones Para Bateria SADRUM7</h2><p>Parte da linha Tonante de acessórios, o KIT de 7 Microfones Para Bateria SADRUM7 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP320127"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "kit-de-7-microfones-para-bateria-sadrum7-cp320127",
    "productUrl": "https://tonante.com.br/kit-de-7-microfones-para-bateria-sadrum7-cp320127"
  },
  {
    "id": 230,
    "sku": "CP320131",
    "name": "Microfone PRO UHF S/fio Duplo de MAO Saclarity-ii",
    "price": "R$ 1.009,91",
    "priceNum": 1009.91,
    "rating": 4.8,
    "reviews": 308,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320131_1-17493168254213103.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320131_1-17493168254213103.jpeg"
    ],
    "inStock": true,
    "description": "Microfone PRO UHF S/fio Duplo de MAO Saclarity-ii. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone PRO UHF S/fio Duplo de MAO Saclarity-ii</h2><p>Parte da linha Tonante de acessórios, o Microfone PRO UHF S/fio Duplo de MAO Saclarity-ii carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP320131"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-pro-uhf-s-fio-duplo-de-mao-saclarity-ii-cp320131",
    "productUrl": "https://tonante.com.br/microfone-pro-uhf-s-fio-duplo-de-mao-saclarity-ii-cp320131",
    "oldPrice": "R$ 1.147,69",
    "oldPriceNum": 1147.69,
    "badge": "Oferta"
  },
  {
    "id": 231,
    "sku": "CP320137",
    "name": "Microfone UHF Duplo UF224",
    "price": "R$ 357,00",
    "priceNum": 357.00,
    "rating": 4.4,
    "reviews": 250,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320137_1-17493303038668576.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/320137_1-17493303038668576.jpeg"
    ],
    "inStock": true,
    "description": "Microfone UHF Duplo UF224. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone UHF Duplo UF224</h2><p>Parte da linha Tonante de acessórios, o Microfone UHF Duplo UF224 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP320137"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-uhf-duplo-uf224-cp320137",
    "productUrl": "https://tonante.com.br/microfone-uhf-duplo-uf224-cp320137"
  },
  {
    "id": 232,
    "sku": "CP32515",
    "name": "Anti-feedback Abafador Violao Folk Boca Redonda Affk",
    "price": "R$ 21,90",
    "priceNum": 21.90,
    "rating": 4.6,
    "reviews": 108,
    "category": "Acessórios",
    "subcategory": "Abafadores",
    "tags": [
      "Acessórios",
      "Abafador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32515-17459237286197861.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32515-17459237286197861.jpeg"
    ],
    "inStock": true,
    "description": "Anti-feedback Abafador Violao Folk Boca Redonda Affk. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Anti-feedback Abafador Violao Folk Boca Redonda Affk</h2><p>Parte da linha Tonante de violões, o Anti-feedback Abafador Violao Folk Boca Redonda Affk carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Abafador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP32515"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "anti-feedback-abafador-violao-folk-boca-redonda-affk-cp32515",
    "productUrl": "https://tonante.com.br/anti-feedback-abafador-violao-folk-boca-redonda-affk-cp32515",
    "oldPrice": "R$ 25,43",
    "oldPriceNum": 25.43,
    "badge": "Oferta"
  },
  {
    "id": 233,
    "sku": "CP32516",
    "name": "Anti-feedback Abafador Violao Classsico Boca Redonda Afcl",
    "price": "R$ 20,90",
    "priceNum": 20.90,
    "rating": 4.9,
    "reviews": 195,
    "category": "Acessórios",
    "subcategory": "Abafadores",
    "tags": [
      "Acessórios",
      "Abafador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32516-17460171746788185.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32516-17460171746788185.jpeg"
    ],
    "inStock": true,
    "description": "Anti-feedback Abafador Violao Classsico Boca Redonda Afcl. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Anti-feedback Abafador Violao Classsico Boca Redonda Afcl</h2><p>Parte da linha Tonante de violões, o Anti-feedback Abafador Violao Classsico Boca Redonda Afcl carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Abafador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP32516"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "anti-feedback-abafador-violao-classsico-boca-redonda-afcl-cp32516",
    "productUrl": "https://tonante.com.br/anti-feedback-abafador-violao-classsico-boca-redonda-afcl-cp32516"
  },
  {
    "id": 234,
    "sku": "CP32517",
    "name": "Anti-feedback Abafador Violao de Boca Oval Afov",
    "price": "R$ 21,90",
    "priceNum": 21.90,
    "rating": 4.4,
    "reviews": 166,
    "category": "Acessórios",
    "subcategory": "Abafadores",
    "tags": [
      "Acessórios",
      "Abafador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32517-17459001808633468.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32517-17459001808633468.jpeg"
    ],
    "inStock": true,
    "description": "Anti-feedback Abafador Violao de Boca Oval Afov. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Anti-feedback Abafador Violao de Boca Oval Afov</h2><p>Parte da linha Tonante de violões, o Anti-feedback Abafador Violao de Boca Oval Afov carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Abafador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP32517"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "anti-feedback-abafador-violao-de-boca-oval-afov-cp32517",
    "productUrl": "https://tonante.com.br/anti-feedback-abafador-violao-de-boca-oval-afov-cp32517"
  },
  {
    "id": 235,
    "sku": "CP32563",
    "name": "Encordoamento P/ Cavaco C/ Bolinha Gescb",
    "price": "R$ 9,80",
    "priceNum": 9.80,
    "rating": 4.5,
    "reviews": 387,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32563-17458348511256942.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/32563-17458348511256942.jpeg"
    ],
    "inStock": true,
    "description": "Encordoamento P/ Cavaco C/ Bolinha Gescb. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Encordoamento P/ Cavaco C/ Bolinha Gescb</h2><p>Parte da linha Tonante de cordas &amp; encordoamentos, o Encordoamento P/ Cavaco C/ Bolinha Gescb carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Cordas & Encordoamentos",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP32563"
      },
      {
        "label": "Categoria",
        "value": "Cordas & Encordoamentos"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "encordoamento-p-cavaco-c-bolinha-gescb-cp32563",
    "productUrl": "https://tonante.com.br/encordoamento-p-cavaco-c-bolinha-gescb-cp32563"
  },
  {
    "id": 236,
    "sku": "CP328663",
    "name": "Violão Clássico Acústico Nylon TN39N Natural – TON",
    "price": "R$ 229,90",
    "priceNum": 229.90,
    "rating": 4.4,
    "reviews": 112,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328663_1-17715118271743254.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328663_1-17715118271743254.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Nylon TN39N Natural – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Nylon TN39N Natural – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Nylon TN39N Natural – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328663"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-nylon-tn39n-natural-ton-cp328663",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-nylon-tn39n-natural-ton-cp328663"
  },
  {
    "id": 237,
    "sku": "CP328664",
    "name": "Violão Clássico Acústico Nylon TN39NB Brown – TON",
    "price": "R$ 229,90",
    "priceNum": 229.90,
    "badge": "Novidade",
    "rating": 4.9,
    "reviews": 437,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328664_1-17706909607789746.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328664_1-17706909607789746.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Nylon TN39NB Brown – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Nylon TN39NB Brown – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Nylon TN39NB Brown – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328664"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-nylon-tn39nb-brown-ton-cp328664",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-nylon-tn39nb-brown-ton-cp328664"
  },
  {
    "id": 238,
    "sku": "CP328665",
    "name": "Violão Clássico Acústico Nylon TN39P Preto – TON",
    "price": "R$ 229,90",
    "priceNum": 229.90,
    "badge": "Novidade",
    "rating": 4.4,
    "reviews": 408,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328665_1-17706507254418513.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328665_1-17706507254418513.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Nylon TN39P Preto – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Nylon TN39P Preto – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Nylon TN39P Preto – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328665"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-nylon-tn39p-preto-ton-cp328665",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-nylon-tn39p-preto-ton-cp328665"
  },
  {
    "id": 239,
    "sku": "CP328666",
    "name": "Violão Clássico Cutaway com EQ Nylon TN39NCE Natural – TON",
    "price": "R$ 319,90",
    "priceNum": 319.90,
    "rating": 4.7,
    "reviews": 25,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328666-17706560169716879.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328666-17706560169716879.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Cutaway com EQ Nylon TN39NCE Natural – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Cutaway com EQ Nylon TN39NCE Natural – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Cutaway com EQ Nylon TN39NCE Natural – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328666"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-cutaway-com-eq-nylon-tn39nce-natural-ton-cp328666",
    "productUrl": "https://tonante.com.br/violao-classico-cutaway-com-eq-nylon-tn39nce-natural-ton-cp328666",
    "badge": "Oferta"
  },
  {
    "id": 240,
    "sku": "CP328667",
    "name": "Violão Clássico Cutaway com EQ Nylon TN39NBCE Brown – TON",
    "price": "R$ 319,90",
    "priceNum": 319.90,
    "badge": "Novidade",
    "rating": 4.8,
    "reviews": 466,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328667_1-17710630262929039.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328667_1-17710630262929039.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Cutaway com EQ Nylon TN39NBCE Brown – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Cutaway com EQ Nylon TN39NBCE Brown – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Cutaway com EQ Nylon TN39NBCE Brown – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328667"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-cutaway-com-eq-nylon-tn39nbce-brown-ton-cp328667",
    "productUrl": "https://tonante.com.br/violao-classico-cutaway-com-eq-nylon-tn39nbce-brown-ton-cp328667"
  },
  {
    "id": 241,
    "sku": "CP328671",
    "name": "Violão Clássico Acústico Infantil 3/4 Nylon TN36N Natural – TON",
    "price": "R$ 239,90",
    "priceNum": 239.90,
    "badge": "Novidade",
    "rating": 4.5,
    "reviews": 423,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328671-17714456835354326.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328671-17714456835354326.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Infantil 3/4 Nylon TN36N Natural – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Infantil 3/4 Nylon TN36N Natural – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Infantil 3/4 Nylon TN36N Natural – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328671"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-infantil-3-4-nylon-tn36n-natural-ton-cp328671",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-infantil-3-4-nylon-tn36n-natural-ton-cp328671"
  },
  {
    "id": 242,
    "sku": "CP328672",
    "name": "Violão Clássico Acústico Infantil 3/4 Nylon TN36P Preto – TON",
    "price": "R$ 239,90",
    "priceNum": 239.90,
    "rating": 4.8,
    "reviews": 336,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328671_-17706654255026292.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/2/328671_-17706654255026292.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Infantil 3/4 Nylon TN36P Preto – TON. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Infantil 3/4 Nylon TN36P Preto – TON</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Infantil 3/4 Nylon TN36P Preto – TON carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP328672"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-infantil-3-4-nylon-tn36p-preto-ton-cp328672",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-infantil-3-4-nylon-tn36p-preto-ton-cp328672",
    "oldPrice": "R$ 254,54",
    "oldPriceNum": 254.54,
    "badge": "Oferta"
  },
  {
    "id": 243,
    "sku": "CP330516",
    "name": "Suporte Para Teclado em X Desmontável Ajustável TNS1954D",
    "price": "R$ 69,90",
    "priceNum": 69.90,
    "rating": 4.7,
    "reviews": 110,
    "category": "Suportes",
    "subcategory": "Suporte teclado",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330516-17715115799083421.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330516-17715115799083421.jpeg",
      "https://cdn.oderco.com.br/produtos/330516/A1-330516.jpg",
      "https://cdn.oderco.com.br/produtos/330516/330516-A5.png"
    ],
    "inStock": true,
    "description": "Estabilidade, praticidade e resistência. Altura ajustável pra tocar do seu jeito.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>RESISTENTE E AJUSTÁVEL</h2><h3>PENSADO PARA A ROTINA DO MÚSICO</h3><p>Esse suporte foi desenvolvido para oferecer segurança e liberdade ao tocar.</p>",
    "features": [
      "Modelo: Suporte X desmontável",
      "Altura: 24–88 cm",
      "Material: Ferro",
      "Tubo: 25 mm",
      "Peso: 1,52 kg",
      "Material: Acabamento resistente"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330516"
      },
      {
        "label": "Modelo",
        "value": "Suporte X desmontável"
      },
      {
        "label": "Altura",
        "value": "24–88 cm"
      },
      {
        "label": "Material",
        "value": "Ferro"
      },
      {
        "label": "Tubo",
        "value": "25 mm"
      },
      {
        "label": "Peso",
        "value": "1,52 kg"
      },
      {
        "label": "Material",
        "value": "Acabamento resistente"
      }
    ],
    "seoSlug": "suporte-para-teclado-em-x-desmontavel-ajustavel-tns1954d-cp330516",
    "productUrl": "https://tonante.com.br/suporte-para-teclado-em-x-desmontavel-ajustavel-tns1954d-cp330516",
    "oldPrice": "R$ 87,46",
    "oldPriceNum": 87.46,
    "badge": "Promoção"
  },
  {
    "id": 244,
    "sku": "CP330543",
    "name": "Suporte Tripé Para Caixa de Som Ajustável TNT1954",
    "price": "R$ 47,52",
    "priceNum": 47.52,
    "rating": 4.7,
    "reviews": 76,
    "category": "Suportes",
    "subcategory": "Tripé caixa",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330543-17715116245403064.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330543-17715116245403064.jpeg",
      "https://cdn.oderco.com.br/produtos/330543/330543--A1.jpg",
      "https://cdn.oderco.com.br/produtos/330543/330543-A5.png"
    ],
    "inStock": true,
    "description": "Estabilidade, altura ajustável e praticidade pra levar o seu som mais alto.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>DOBRÁVEL, RESISTENTE E FÁCIL DE TRANSPORTAR</h2><p>Com design dobrável que facilita o transporte e otimiza o espaço, o suporte une praticidade e robustez em cada detalhe. Sua estrutura reforçada oferece alta capacidade de carga, enquanto a base triangular garante equilíbrio superior, proporcionando mais segurança e estabilidade durante o uso.</p><h3>MAIS SEGURANÇA PARA SUA SONORIZAÇÃO</h3><p>Desenvolvido para garantir firmeza e estabilidade na instalação de caixas de som, o suporte conta com ajuste de altura para melhor projeção do áudio, oferecendo praticidade na montagem e segurança no uso em qualquer situação.</p>",
    "features": [
      "Versao: DisplayPort 2.1",
      "Comprimento: 2 metros",
      "Altura ajustável: 99–176 cm (7 níveis)"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330543"
      },
      {
        "label": "Versao",
        "value": "DisplayPort 2.1"
      },
      {
        "label": "Comprimento",
        "value": "2 metros"
      },
      {
        "label": "Altura ajustável",
        "value": "99–176 cm (7 níveis)"
      }
    ],
    "seoSlug": "suporte-tripe-para-caixa-de-som-ajustavel-tnt1954-cp330543",
    "productUrl": "https://tonante.com.br/suporte-tripe-para-caixa-de-som-ajustavel-tnt1954-cp330543"
  },
  {
    "id": 245,
    "sku": "CP330553",
    "name": "Suporte Duplo Para Teclado em X Desmontável TNS1954D",
    "price": "R$ 82,90",
    "priceNum": 82.90,
    "rating": 4.9,
    "reviews": 347,
    "category": "Suportes",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330553-17715116654345948.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330553-17715116654345948.jpeg",
      "https://cdn.oderco.com.br/produtos/330553/330553-A1.jpg",
      "https://cdn.oderco.com.br/produtos/330553/330553-A5.png"
    ],
    "inStock": true,
    "description": "Suporte Duplo Para Teclado em X Desmontável TNS1954D. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>ESTRUTURA DUPLA PARA MAIS POSSIBILIDADES</h2><p>Possui estrutura reforçada em X, garantindo firmeza durante a execução, além de ajustes de altura e largura para melhor adaptação ao músico.</p><h3>PENSADO PARA PERFORMANCE PROFISSIONAL</h3><p>Desenvolvido para teclados maiores e pianos digitais, o suporte amplia suas possibilidades com máxima estabilidade. Oferece firmeza, organização e praticidade, garantindo mais controle, segurança e liberdade para o músico focar totalmente na execução.</p>",
    "features": [
      "Altura ajustável: 1–96 cm",
      "Largura ajustável: 46–97 cm",
      "Material: Ferro, ABS e borracha",
      "Peso: 2,2 kg"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330553"
      },
      {
        "label": "Altura ajustável",
        "value": "1–96 cm"
      },
      {
        "label": "Largura ajustável",
        "value": "46–97 cm"
      },
      {
        "label": "Material",
        "value": "Ferro, ABS e borracha"
      },
      {
        "label": "Peso",
        "value": "2,2 kg"
      }
    ],
    "seoSlug": "suporte-duplo-para-teclado-em-x-desmontavel-tns1954d-cp330553",
    "productUrl": "https://tonante.com.br/suporte-duplo-para-teclado-em-x-desmontavel-tns1954d-cp330553",
    "oldPrice": "R$ 106,86",
    "oldPriceNum": 106.86,
    "badge": "Oferta"
  },
  {
    "id": 246,
    "sku": "CP330641",
    "name": "Banqueta Para Piano Estofada Preta - TN1954BP",
    "price": "R$ 140,98",
    "priceNum": 140.98,
    "rating": 4.8,
    "reviews": 88,
    "category": "Suportes",
    "subcategory": "Banqueta",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330641-17715117116978257.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330641-17715117116978257.jpeg",
      "https://cdn.oderco.com.br/produtos/330641/330641-A1.jpg",
      "https://cdn.oderco.com.br/produtos/330641/330641-A5.png"
    ],
    "inStock": true,
    "description": "Estabilidade e conforto para uma performance sem cansaço, do ensaio ao show.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>ESTRUTURA REFORÇADA E DURÁVEL</h2><p>Construída em ferro de alta resistência, a estrutura conta com tubo de maior diâmetro, proporcionando mais firmeza no uso. Possui pés com borrachas antiderrapantes que evitam movimentos indesejados, além de um design simples, resistente e fácil de montar.</p><h3>FOCO TOTAL NA SUA EXECUÇÃO</h3><p>Desenvolvida para oferecer apoio estável e postura adequada ao pianista.</p>",
    "features": [
      "Altura fixa: 50 cm",
      "Material da estrutura: Ferro",
      "Peso líquido: 4 kg",
      "Capacidade de carga: Até 150 kg",
      "Acabamento: Pintura eletrostática",
      "Cor: Preta"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330641"
      },
      {
        "label": "Altura fixa",
        "value": "50 cm"
      },
      {
        "label": "Material da estrutura",
        "value": "Ferro"
      },
      {
        "label": "Peso líquido",
        "value": "4 kg"
      },
      {
        "label": "Capacidade de carga",
        "value": "Até 150 kg"
      },
      {
        "label": "Acabamento",
        "value": "Pintura eletrostática"
      },
      {
        "label": "Cor",
        "value": "Preta"
      }
    ],
    "seoSlug": "banqueta-para-piano-estofada-preta-tn1954bp-cp330641",
    "productUrl": "https://tonante.com.br/banqueta-para-piano-estofada-preta-tn1954bp-cp330641"
  },
  {
    "id": 247,
    "sku": "CP330672",
    "name": "Banqueta Para Teclado Musical Dobrável Preta&nbsp; - TN1954BT",
    "price": "R$ 88,32",
    "priceNum": 88.32,
    "rating": 4.5,
    "reviews": 473,
    "category": "Suportes",
    "tags": [
      "Suportes",
      "Dobrável"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330672-17715117420645043.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330672-17715117420645043.jpeg",
      "https://cdn.oderco.com.br/produtos/330672/330672-A1.jpg",
      "https://cdn.oderco.com.br/produtos/330672/330672-A5.png"
    ],
    "inStock": true,
    "description": "Banqueta Para Teclado Musical Dobrável Preta&nbsp; - TN1954BT. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>CONFORTO AJUSTÁVEL PARA MELHOR PERFORMANCE</h2><p>Conta com altura ajustável em três níveis, permitindo adaptação à posição ideal de uso. Possui assento amplo e acolchoado, com espuma de alta densidade que proporciona maior conforto, além de revestimento resistente que garante durabilidade no dia a dia.</p><h3>PENSADA PARA SUA EVOLUÇÃO MUSICAL</h3><p>Desenvolvida para oferecer postura correta e mais conforto ao tocar, a nossa banqueta contribui diretamente para uma performance mais segura e consistente.</p>",
    "features": [
      "Ajuste de altura: 3 níveis",
      "Material da estrutura: Ferro",
      "Detalhes: Assento com espuma de alta densidade",
      "Base: Borracha antiderrapante",
      "Cor: Preta"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330672"
      },
      {
        "label": "Ajuste de altura",
        "value": "3 níveis"
      },
      {
        "label": "Material da estrutura",
        "value": "Ferro"
      },
      {
        "label": "Detalhes",
        "value": "Assento com espuma de alta densidade"
      },
      {
        "label": "Base",
        "value": "Borracha antiderrapante"
      },
      {
        "label": "Cor",
        "value": "Preta"
      }
    ],
    "seoSlug": "banqueta-para-teclado-musical-dobravel-preta-nbsp-tn1954bt-cp330672",
    "productUrl": "https://tonante.com.br/banqueta-para-teclado-musical-dobravel-preta-nbsp-tn1954bt-cp330672"
  },
  {
    "id": 248,
    "sku": "CP330674",
    "name": "Suporte de Chão Para Violão, Baixo e Guitarra com Trava TNS1954",
    "price": "R$ 36,90",
    "priceNum": 36.90,
    "rating": 4.8,
    "reviews": 233,
    "category": "Suportes",
    "subcategory": "Suporte de chão",
    "tags": [
      "Suportes"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330674-17715117783793699.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/330674-17715117783793699.jpeg",
      "https://cdn.oderco.com.br/produtos/330674/330674-A1.jpg",
      "https://cdn.oderco.com.br/produtos/330674/330674-A5.png"
    ],
    "inStock": true,
    "description": "Segurança, praticidade e estabilidade. Seu instrumento sempre em pé, sempre seguro.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>ESTRUTURA REFORÇADA E DESIGN FUNCIONAL</h2><p>Construído em ferro com componentes em ABS, o produto oferece alta resistência para uso contínuo. Conta com tubo de maior espessura e base com pés emborrachados, garantindo máxima estabilidade. Além disso, é dobrável e leve, sendo ideal para transporte prático e montagem rápida.</p><h3>PROTEÇÃO E FIRMEZA NO DIA A DIA</h3><p>Desenvolvido para manter sua guitarra segura e sempre pronta para uso.</p>",
    "features": [
      "Altura ajustável: 64–74 cm",
      "Material: Ferro, ABS e esponja",
      "Capacidade de carga: até 15 kg",
      "Peso: 0,9 kg",
      "Base: Borracha antiderrapante",
      "Cor: Preto"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP330674"
      },
      {
        "label": "Altura ajustável",
        "value": "64–74 cm"
      },
      {
        "label": "Material",
        "value": "Ferro, ABS e esponja"
      },
      {
        "label": "Capacidade de carga",
        "value": "até 15 kg"
      },
      {
        "label": "Peso",
        "value": "0,9 kg"
      },
      {
        "label": "Base",
        "value": "Borracha antiderrapante"
      },
      {
        "label": "Cor",
        "value": "Preto"
      }
    ],
    "seoSlug": "suporte-de-chao-para-violao-baixo-e-guitarra-com-trava-tns1954-cp330674",
    "productUrl": "https://tonante.com.br/suporte-de-chao-para-violao-baixo-e-guitarra-com-trava-tns1954-cp330674"
  },
  {
    "id": 249,
    "sku": "CP33697",
    "name": "Teclado Musical Casiotone Vermelho - CT-S200RDC2-BR",
    "price": "R$ 729,00",
    "priceNum": 729.00,
    "rating": 4.8,
    "reviews": 178,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/33697-17522380235431762.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/33697-17522380235431762.jpeg"
    ],
    "inStock": true,
    "description": "Teclado Musical Casiotone Vermelho - CT-S200RDC2-BR. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Teclado Musical Casiotone Vermelho - CT-S200RDC2-BR</h2><p>Parte da linha Tonante de acessórios, o Teclado Musical Casiotone Vermelho - CT-S200RDC2-BR carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP33697"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "teclado-musical-casiotone-vermelho-ct-s200rdc2-br-cp33697",
    "productUrl": "https://tonante.com.br/teclado-musical-casiotone-vermelho-ct-s200rdc2-br-cp33697"
  },
  {
    "id": 250,
    "sku": "CP33698",
    "name": "Teclado Musical Casiotone Preto - CT-S300C2-BR",
    "price": "R$ 968,90",
    "priceNum": 968.90,
    "rating": 4.7,
    "reviews": 33,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/33698-17510322186809476.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/33698-17510322186809476.jpeg"
    ],
    "inStock": true,
    "description": "Teclado Musical Casiotone Preto - CT-S300C2-BR. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Teclado Musical Casiotone Preto - CT-S300C2-BR</h2><p>Parte da linha Tonante de acessórios, o Teclado Musical Casiotone Preto - CT-S300C2-BR carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP33698"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "teclado-musical-casiotone-preto-ct-s300c2-br-cp33698",
    "productUrl": "https://tonante.com.br/teclado-musical-casiotone-preto-ct-s300c2-br-cp33698"
  },
  {
    "id": 251,
    "sku": "CP338666",
    "name": "Capotraste Para Violão em Alumínio - Prata - CPT",
    "price": "R$ 9,50",
    "priceNum": 9.50,
    "rating": 4.8,
    "reviews": 104,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Capotraste"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/338666_1-17773826474786195.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/338666_1-17773826474786195.jpeg",
      "https://cdn.oderco.com.br/produtos/338666/338666-A1.jpg",
      "https://cdn.oderco.com.br/produtos/338666/338666-A6.png"
    ],
    "inStock": true,
    "description": "Capotraste Para Violão em Alumínio - Prata - CPT. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Praticidade e precisão para acompanhar sua música</h2><p>Os Capotrastes Tonante CPT-30 foram desenvolvidos para proporcionar mudanças rápidas de tonalidade com segurança, conforto e praticidade. Disponíveis nas versões prata e preta, são ideais para violões com cordas de nylon, oferecendo excelente fixação e ótimo custo-benefício para músicos de todos os níveis.</p><h3>Leveza, resistência e encaixe seguro</h3><p>Produzidos em alumínio leve e resistente, os modelos CPT-30 garantem durabilidade e praticidade no uso diário. Seu sistema de encaixe facilita trocas rápidas durante apresentações, ensaios ou estudos, mantendo firmeza nas cordas e estabilidade na afinação.</p><h3>O acessório ideal para acompanhar cada acorde</h3><p>Compactos, resistentes e fáceis de transportar, os Capotrastes Tonante CPT-30 oferecem conforto e praticidade para músicos que buscam agilidade nas mudanças de tom sem abrir mão da qualidade. Uma solução versátil para diferentes estilos musicais e momentos de performance.</p>",
    "features": [
      "Modelo: CPT-30PR",
      "Indicação: Violões com cordas de nylon",
      "Material: Alumínio",
      "Cores: Prata",
      "Estrutura: Leve e resistente",
      "Peso: 60g"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP338666"
      },
      {
        "label": "Modelo",
        "value": "CPT-30PR"
      },
      {
        "label": "Indicação",
        "value": "Violões com cordas de nylon"
      },
      {
        "label": "Material",
        "value": "Alumínio"
      },
      {
        "label": "Cores",
        "value": "Prata"
      },
      {
        "label": "Estrutura",
        "value": "Leve e resistente"
      },
      {
        "label": "Peso",
        "value": "60g"
      },
      {
        "label": "Dimensões",
        "value": "14 x 11 x 2 cm"
      },
      {
        "label": "Garantia",
        "value": "365 dias"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      }
    ],
    "seoSlug": "capotraste-para-violao-em-aluminio-prata-cpt-cp338666",
    "productUrl": "https://tonante.com.br/capotraste-para-violao-em-aluminio-prata-cpt-cp338666"
  },
  {
    "id": 252,
    "sku": "CP338667",
    "name": "Capotraste Para Violão em Alumínio - Preto - CPT",
    "price": "R$ 9,50",
    "priceNum": 9.50,
    "rating": 4.7,
    "reviews": 274,
    "category": "Acessórios",
    "subcategory": "Capotraste",
    "tags": [
      "Acessórios",
      "Capotraste"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/338667_-17773826708619782.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/3/338667_-17773826708619782.jpeg",
      "https://cdn.oderco.com.br/produtos/338667/338667-A1.jpg",
      "https://cdn.oderco.com.br/produtos/338667/338667-A6.png"
    ],
    "inStock": true,
    "description": "Pressão equilibrada que não desafina. Muda o tom da música sem mudar o jeito de tocar.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Praticidade e precisão para acompanhar sua música</h2><p>Os Capotrastes Tonante CPT-30 foram desenvolvidos para proporcionar mudanças rápidas de tonalidade com segurança, conforto e praticidade. Disponíveis nas versões prata e preta, são ideais para violões com cordas de nylon, oferecendo excelente fixação e ótimo custo-benefício para músicos de todos os níveis.</p><h3>Leveza, resistência e encaixe seguro</h3><p>Produzidos em alumínio leve e resistente, os modelos CPT-30 garantem durabilidade e praticidade no uso diário. Seu sistema de encaixe facilita trocas rápidas durante apresentações, ensaios ou estudos, mantendo firmeza nas cordas e estabilidade na afinação.</p><h3>O acessório ideal para cada acorde</h3><p>Compactos, resistentes e fáceis de transportar, os Capotrastes Tonante CPT-30 oferecem conforto e praticidade para músicos que buscam agilidade nas mudanças de tom sem abrir mão da qualidade. Uma solução versátil para diferentes estilos musicais e momentos de performance.</p>",
    "features": [
      "Modelo: CPT-30",
      "Indicação: Violões com cordas de nylon",
      "Material: Alumínio",
      "Cores: Prata",
      "Estrutura: Leve e resistente",
      "Peso: 60g"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP338667"
      },
      {
        "label": "Modelo",
        "value": "CPT-30"
      },
      {
        "label": "Indicação",
        "value": "Violões com cordas de nylon"
      },
      {
        "label": "Material",
        "value": "Alumínio"
      },
      {
        "label": "Cores",
        "value": "Prata"
      },
      {
        "label": "Estrutura",
        "value": "Leve e resistente"
      },
      {
        "label": "Peso",
        "value": "60g"
      },
      {
        "label": "Dimensões",
        "value": "14 x 11 x 2 cm"
      },
      {
        "label": "Garantia",
        "value": "365 dias"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      }
    ],
    "seoSlug": "capotraste-para-violao-em-aluminio-preto-cpt-cp338667",
    "productUrl": "https://tonante.com.br/capotraste-para-violao-em-aluminio-preto-cpt-cp338667",
    "badge": "Mais vendido"
  },
  {
    "id": 253,
    "sku": "CP34160",
    "name": "Afinador Cromatico Digital AF10 Preto",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.6,
    "reviews": 484,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Afinador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34160-17522531913581922.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34160-17522531913581922.jpeg"
    ],
    "inStock": true,
    "description": "Afinador Cromatico Digital AF10 Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Afinador Cromatico Digital AF10 Preto</h2><p>Parte da linha Tonante de acessórios, o Afinador Cromatico Digital AF10 Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Afinador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34160"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "afinador-cromatico-digital-af10-preto-cp34160",
    "productUrl": "https://tonante.com.br/afinador-cromatico-digital-af10-preto-cp34160"
  },
  {
    "id": 254,
    "sku": "CP342288",
    "name": "Encordoamento 010 Aço Bronze 85 15 P/ Violão 0.010 - 0.047 - Pack (C/3) - TNVA10B853",
    "price": "R$ 49,90",
    "priceNum": 49.90,
    "rating": 4.8,
    "reviews": 520,
    "category": "Cordas & Encordoamentos",
    "subcategory": "Jogo 6 cordas",
    "tags": [
      "Cordas & Encordoamentos",
      "Aço",
      "Bronze"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342288_1-17734961058253226.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342288_1-17734961058253226.jpeg",
      "https://cdn.oderco.com.br/produtos/342288/342288-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342288/342288-A6.png"
    ],
    "inStock": true,
    "description": "Timbre equilibrado, durabilidade e economia. O toque que muda tudo no seu violão.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>SOM DE QUALIDADE E ALTA RESISTÊNCIA</h2><p>Construído com liga de bronze 85/15 sobre núcleo hexagonal de aço estanhado. Timbre quente, brilhante e equilibrado, ideal para diversos estilos musicais.</p><h3>O SOM QUE ACOMPANHA SUA EVOLUÇÃO</h3><p>Pensado para músicos que buscam qualidade, praticidade e consistência no dia a dia.</p><h3>PRECISÃO NO DETALHE QUE FAZ DIFERENÇA</h3><p>O núcleo hexagonal em aço estanhado garante maior estabilidade de afinação e melhor fixação do enrolamento.\nIsso se traduz em mais firmeza, durabilidade e resposta sonora consistente ao tocar.</p>",
    "features": [
      "Tipo: Encordoamento para violão aço",
      "Modelo: TNVA10B853",
      "Calibre: .010 – .047",
      "Tensão: Leve",
      "Material: Bronze 85/15",
      "Quantidade: 6 cordas"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342288"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para violão aço"
      },
      {
        "label": "Modelo",
        "value": "TNVA10B853"
      },
      {
        "label": "Calibre",
        "value": ".010 – .047"
      },
      {
        "label": "Tensão",
        "value": "Leve"
      },
      {
        "label": "Material",
        "value": "Bronze 85/15"
      },
      {
        "label": "Quantidade",
        "value": "6 cordas"
      },
      {
        "label": "Pack",
        "value": "3 jogos completos (embalados individualmente)"
      },
      {
        "label": "Corda extra",
        "value": "1ª Mi (.010)"
      }
    ],
    "seoSlug": "encordoamento-010-aco-bronze-85-15-p-violao-0-010-0-047-pack-c-3-tnva10b853-cp342288",
    "productUrl": "https://tonante.com.br/encordoamento-010-aco-bronze-85-15-p-violao-0-010-0-047-pack-c-3-tnva10b853-cp342288",
    "oldPrice": "R$ 50,82",
    "oldPriceNum": 50.82,
    "badge": "Oferta"
  },
  {
    "id": 255,
    "sku": "CP342290",
    "name": "Encordoamento 010 Níquel Plated Steel P/ Guitarra 0.010 - 0.046 - Pack (C/3) - TNGE10N3",
    "price": "R$ 54,90",
    "priceNum": 54.90,
    "rating": 4.7,
    "reviews": 388,
    "category": "Cordas & Encordoamentos",
    "subcategory": "Jogo 6 cordas",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342290_1-17734961285921725.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342290_1-17734961285921725.jpeg",
      "https://cdn.oderco.com.br/produtos/342290/342290-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342290/342290-A61.png"
    ],
    "inStock": true,
    "description": "Calibre .010 em níquel. Bends macios e afinação estável pro seu som.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>MAIS DETALHES</h2><p>A escolha confiável de guitarristas brasileiros há décadas.\nPorque tocar bem também é confiar no que está no seu instrumento.</p><h3>APLICAÇÃO E USO</h3><p>Ideal para guitarristas que atuam em ensaios, estúdios e apresentações ao vivo.\nEntrega timbre definido, sustain prolongado e desempenho consistente em estilos como rock, blues e pop.</p><h3>NÚCLEO HEXAGONAL</h3><p>O formato Hex Core garante maior aderência do enrolamento, proporcionando estabilidade na afinação e consistência ao tocar.</p>",
    "features": [
      "Tipo: Encordoamento para guitarra",
      "Modelo: TNGE10N3",
      "Calibre: .010 – .046",
      "Tensão: Leve",
      "Material: Aço niquelado (Nickel Plated Steel) com núcleo hexagonal",
      "Quantidade: 6 cordas"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342290"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para guitarra"
      },
      {
        "label": "Modelo",
        "value": "TNGE10N3"
      },
      {
        "label": "Calibre",
        "value": ".010 – .046"
      },
      {
        "label": "Tensão",
        "value": "Leve"
      },
      {
        "label": "Material",
        "value": "Aço niquelado (Nickel Plated Steel) com núcleo hexagonal"
      },
      {
        "label": "Quantidade",
        "value": "6 cordas"
      },
      {
        "label": "Pack",
        "value": "3 jogos completos (embalados individualmente)"
      },
      {
        "label": "Corda extra",
        "value": "1ª Mi (.010)"
      }
    ],
    "seoSlug": "encordoamento-010-niquel-plated-steel-p-guitarra-0-010-0-046-pack-c-3-tnge10n3-cp342290",
    "productUrl": "https://tonante.com.br/encordoamento-010-niquel-plated-steel-p-guitarra-0-010-0-046-pack-c-3-tnge10n3-cp342290",
    "oldPrice": "R$ 71,98",
    "oldPriceNum": 71.98,
    "badge": "Promoção"
  },
  {
    "id": 256,
    "sku": "CP342291",
    "name": "Encordoamento Ukulele Soprano Nylon White .023 .032 .037 .028 - Tnuksnw",
    "price": "R$ 9,03",
    "priceNum": 9.03,
    "rating": 4.8,
    "reviews": 133,
    "category": "Cordas & Encordoamentos",
    "subcategory": "Jogo ukulele soprano",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342291_1-17734961521016850.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342291_1-17734961521016850.jpeg",
      "https://cdn.oderco.com.br/produtos/342291/342291-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342291/342291-A6.png"
    ],
    "inStock": true,
    "description": "Nylon branco para o som tropical e doce do ukulele soprano.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>CLAREZA EM CADA NOTA</h2><p>O nylon de alta densidade proporciona maior consistência e projeção sonora.</p><h3>APLICAÇÃO E USO</h3><p>Ideal para estudos, apresentações e momentos de descontração.\nEntrega um som doce, brilhante e característico, perfeito para destacar o ukulele em qualquer estilo ou ambiente.</p><h3>MAIS DETALHES</h3><p>A escolha ideal para quem busca qualidade com custo-benefício.\nO timbre que faz o ukulele brilhar em qualquer roda!</p>",
    "features": [
      "Tipo: Encordoamento para ukulele soprano",
      "Modelo: TNUKSNW",
      "Calibre: .023 – .028",
      "Material: Nylon branco (White Nylon) de alta densidade",
      "Quantidade de cordas: 4 cordas"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342291"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para ukulele soprano"
      },
      {
        "label": "Modelo",
        "value": "TNUKSNW"
      },
      {
        "label": "Calibre",
        "value": ".023 – .028"
      },
      {
        "label": "Material",
        "value": "Nylon branco (White Nylon) de alta densidade"
      },
      {
        "label": "Quantidade de cordas",
        "value": "4 cordas"
      }
    ],
    "seoSlug": "encordoamento-ukulele-soprano-nylon-white-023-032-037-028-tnuksnw-cp342291",
    "productUrl": "https://tonante.com.br/encordoamento-ukulele-soprano-nylon-white-023-032-037-028-tnuksnw-cp342291"
  },
  {
    "id": 257,
    "sku": "CP342292",
    "name": "Encordoamento Ukulele Concert White Nylon .024 .032 .038 .028 - Tnukcnw",
    "price": "R$ 9,03",
    "priceNum": 9.03,
    "rating": 4.4,
    "reviews": 18,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Nylon",
      "Ukulele"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342292_1-17734961755057606.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342292_1-17734961755057606.jpeg",
      "https://cdn.oderco.com.br/produtos/342292/342292-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342292/342292-A6.png"
    ],
    "inStock": true,
    "description": "Encordoamento Ukulele Concert White Nylon .024 .032 .038 .028 - Tnukcnw. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>PROJEÇÃO E RESPOSTA SUPERIOR</h2><p>Oferece timbre cristalino com boa projeção e resposta rápida, garantindo definição em cada nota.</p><h3>APLICAÇÃO E USO</h3><p>Ideal para quem busca mais presença sonora em ensaios, apresentações ou gravações.\nEntrega conforto ao tocar e um som equilibrado, valorizando cada acorde.</p><h3>MAIS DETALHES</h3><p>Desenvolvido para músicos que buscam qualidade e desempenho.\nConforto e projeção que acompanham sua evolução musical!</p>",
    "features": [
      "Tipo: Encordoamento para ukulele concert",
      "Modelo: TNUKCNW",
      "Calibre: .024 – .028",
      "Material: Nylon branco (White Nylon) de alta performance",
      "Quantidade de cordas: 4 cordas"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342292"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para ukulele concert"
      },
      {
        "label": "Modelo",
        "value": "TNUKCNW"
      },
      {
        "label": "Calibre",
        "value": ".024 – .028"
      },
      {
        "label": "Material",
        "value": "Nylon branco (White Nylon) de alta performance"
      },
      {
        "label": "Quantidade de cordas",
        "value": "4 cordas"
      }
    ],
    "seoSlug": "encordoamento-ukulele-concert-white-nylon-024-032-038-028-tnukcnw-cp342292",
    "productUrl": "https://tonante.com.br/encordoamento-ukulele-concert-white-nylon-024-032-038-028-tnukcnw-cp342292",
    "badge": "Oferta"
  },
  {
    "id": 258,
    "sku": "CP342294",
    "name": "Encordoamento Viola Caipira Média Níquel com Bolinha Cebolao RÉ - Tnvnr",
    "price": "R$ 19,12",
    "priceNum": 19.12,
    "rating": 4.8,
    "reviews": 76,
    "category": "Cordas & Encordoamentos",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342294_1-17734961988487960.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342294_1-17734961988487960.jpeg",
      "https://cdn.oderco.com.br/produtos/342294/342294-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342294/342294-A6.png"
    ],
    "inStock": true,
    "description": "Encordoamento Viola Caipira Média Níquel com Bolinha Cebolao RÉ - Tnvnr. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>TRADIÇÃO E RESISTÊNCIA NA CONSTRUÇÃO</h2><p>O revestimento em níquel com proteção anticorrosiva oferece maior vida útil e desempenho consistente.\nA construção com bolinha proporciona fixação segura e prática, mantendo a afinação estável no uso diário.</p><h3>APLICAÇÃO E USO</h3><p>Ideal para moda de viola e estilos da raiz brasileira.</p><h3>MAIS DETALHES</h3><p>Disponível nas versões Cebolão Ré (média) e Cebolão Mi (leve), atendendo diferentes preferências de tocabilidade.\nUm encordoamento feito para quem carrega a tradição da viola, com resistência e qualidade para acompanhar o dia a dia.</p>",
    "features": [
      "Tipo: Encordoamento para viola caipira",
      "Modelo: TNVNM",
      "Afinação: Cebolão em Ré",
      "Tensão: Média",
      "Material: Aço com revestimento em níquel",
      "Fixação: Com bolinha (ball end)"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342294"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para viola caipira"
      },
      {
        "label": "Modelo",
        "value": "TNVNM"
      },
      {
        "label": "Afinação",
        "value": "Cebolão em Ré"
      },
      {
        "label": "Tensão",
        "value": "Média"
      },
      {
        "label": "Material",
        "value": "Aço com revestimento em níquel"
      },
      {
        "label": "Fixação",
        "value": "Com bolinha (ball end)"
      },
      {
        "label": "Quantidade de cordas",
        "value": "10 cordas (5 pares)"
      }
    ],
    "seoSlug": "encordoamento-viola-caipira-media-niquel-com-bolinha-cebolao-re-tnvnr-cp342294",
    "productUrl": "https://tonante.com.br/encordoamento-viola-caipira-media-niquel-com-bolinha-cebolao-re-tnvnr-cp342294"
  },
  {
    "id": 259,
    "sku": "CP342295",
    "name": "Encordoamento Viola Caipira Leve Níquel com Bolinha Cebolao MI - Tnvnm",
    "price": "R$ 19,12",
    "priceNum": 19.12,
    "rating": 4.9,
    "reviews": 97,
    "category": "Cordas & Encordoamentos",
    "subcategory": "Jogo viola 10 cordas",
    "tags": [
      "Cordas & Encordoamentos",
      "Níquel",
      "Viola"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342295_1-17734962222599730.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/342295_1-17734962222599730.jpeg",
      "https://cdn.oderco.com.br/produtos/342295/342295-A1.jpg",
      "https://cdn.oderco.com.br/produtos/342295/342295-A6.png"
    ],
    "inStock": true,
    "description": "Níquel com bolinha para a viola caipira. Brilho e tradição em cada ponteado.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>TRADIÇÃO E RESISTÊNCIA NA CONSTRUÇÃO</h2><p>O revestimento em níquel com proteção anticorrosiva oferece maior vida útil e desempenho consistente.\nA construção com bolinha proporciona fixação segura e prática, mantendo a afinação estável no uso diário.</p><h3>APLICAÇÃO E USO</h3><p>Ideal para moda de viola e estilos da raiz brasileira.</p><h3>MAIS DETALHES</h3><p>Disponível nas versões Cebolão Ré (média) e Cebolão Mi (leve), atendendo diferentes preferências de tocabilidade.\nUm encordoamento feito para quem carrega a tradição da viola, com resistência e qualidade para acompanhar o dia a dia.</p>",
    "features": [
      "Tipo: Encordoamento para viola caipira",
      "Modelo: TNVNL",
      "Afinação: Cebolão em Mi",
      "Tensão: Leve",
      "Material: Aço com revestimento em níquel",
      "Fixação: Com bolinha (ball end)"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP342295"
      },
      {
        "label": "Tipo",
        "value": "Encordoamento para viola caipira"
      },
      {
        "label": "Modelo",
        "value": "TNVNL"
      },
      {
        "label": "Afinação",
        "value": "Cebolão em Mi"
      },
      {
        "label": "Tensão",
        "value": "Leve"
      },
      {
        "label": "Material",
        "value": "Aço com revestimento em níquel"
      },
      {
        "label": "Fixação",
        "value": "Com bolinha (ball end)"
      },
      {
        "label": "Quantidade de cordas",
        "value": "10 cordas (5 pares)"
      }
    ],
    "seoSlug": "encordoamento-viola-caipira-leve-niquel-com-bolinha-cebolao-mi-tnvnm-cp342295",
    "productUrl": "https://tonante.com.br/encordoamento-viola-caipira-leve-niquel-com-bolinha-cebolao-mi-tnvnm-cp342295"
  },
  {
    "id": 260,
    "sku": "CP34236",
    "name": "Afinador Cromatico Digital AF10 Azul",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.6,
    "reviews": 146,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Afinador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34236-17522656450145170.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34236-17522656450145170.jpeg"
    ],
    "inStock": true,
    "description": "Afinador Cromatico Digital AF10 Azul. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Afinador Cromatico Digital AF10 Azul</h2><p>Parte da linha Tonante de acessórios, o Afinador Cromatico Digital AF10 Azul carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Afinador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34236"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "afinador-cromatico-digital-af10-azul-cp34236",
    "productUrl": "https://tonante.com.br/afinador-cromatico-digital-af10-azul-cp34236"
  },
  {
    "id": 261,
    "sku": "CP34237",
    "name": "Afinador Cromatico Digital AF10 Vermelho",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.5,
    "reviews": 175,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Afinador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34237-17523016710621689.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34237-17523016710621689.jpeg"
    ],
    "inStock": true,
    "description": "Afinador Cromatico Digital AF10 Vermelho. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Afinador Cromatico Digital AF10 Vermelho</h2><p>Parte da linha Tonante de acessórios, o Afinador Cromatico Digital AF10 Vermelho carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Afinador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34237"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "afinador-cromatico-digital-af10-vermelho-cp34237",
    "productUrl": "https://tonante.com.br/afinador-cromatico-digital-af10-vermelho-cp34237"
  },
  {
    "id": 262,
    "sku": "CP34238",
    "name": "Afinador Cromatico Digital AF10 Branco",
    "price": "R$ 19,90",
    "priceNum": 19.90,
    "rating": 4.8,
    "reviews": 88,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Afinador"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34238-17523015964855195.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34238-17523015964855195.jpeg"
    ],
    "inStock": true,
    "description": "Afinador Cromatico Digital AF10 Branco. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Afinador Cromatico Digital AF10 Branco</h2><p>Parte da linha Tonante de acessórios, o Afinador Cromatico Digital AF10 Branco carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Afinador",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34238"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "afinador-cromatico-digital-af10-branco-cp34238",
    "productUrl": "https://tonante.com.br/afinador-cromatico-digital-af10-branco-cp34238",
    "badge": "Oferta"
  },
  {
    "id": 263,
    "sku": "CP34578",
    "name": "Violao Tonante Acústico Infantil Nylon 34\" (1/2) - TN34 Natural",
    "price": "R$ 260,62",
    "priceNum": 260.62,
    "rating": 4.9,
    "reviews": 91,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34578_2-17459257445047516.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34578_2-17459257445047516.jpeg"
    ],
    "inStock": true,
    "description": "Violao Tonante Acústico Infantil Nylon 34\" (1/2) - TN34 Natural. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Tonante Acústico Infantil Nylon 34\" (1/2) - TN34 Natural</h2><p>Parte da linha Tonante de violões, o Violao Tonante Acústico Infantil Nylon 34\" (1/2) - TN34 Natural carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34578"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-tonante-acustico-infantil-nylon-34-1-2-tn34-natural-cp34578",
    "productUrl": "https://tonante.com.br/violao-tonante-acustico-infantil-nylon-34-1-2-tn34-natural-cp34578"
  },
  {
    "id": 264,
    "sku": "CP34582",
    "name": "Violao Tonante Acústico Nylon Estudo - TNA39 Preto",
    "price": "R$ 249,90",
    "priceNum": 249.90,
    "badge": "Novidade",
    "rating": 4.8,
    "reviews": 422,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34582-17522621963484168.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/4/34582-17522621963484168.jpeg"
    ],
    "inStock": true,
    "description": "Violao Tonante Acústico Nylon Estudo - TNA39 Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violao Tonante Acústico Nylon Estudo - TNA39 Preto</h2><p>Parte da linha Tonante de violões, o Violao Tonante Acústico Nylon Estudo - TNA39 Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP34582"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-tonante-acustico-nylon-estudo-tna39-preto-cp34582",
    "productUrl": "https://tonante.com.br/violao-tonante-acustico-nylon-estudo-tna39-preto-cp34582"
  },
  {
    "id": 265,
    "sku": "CP352800",
    "name": "Polidor Creme Restore D'addario - Pwpl",
    "price": "R$ 57,20",
    "priceNum": 57.20,
    "rating": 4.4,
    "reviews": 424,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352800_1-17648493815847936.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352800_1-17648493815847936.jpeg"
    ],
    "inStock": true,
    "description": "Polidor Creme Restore D'addario - Pwpl. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Polidor Creme Restore D'addario - Pwpl</h2><p>Selecionado pela Tonante, o Polidor Creme Restore D'addario - Pwpl é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP352800"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "polidor-creme-restore-d-addario-pwpl-cp352800",
    "productUrl": "https://tonante.com.br/polidor-creme-restore-d-addario-pwpl-cp352800"
  },
  {
    "id": 266,
    "sku": "CP352804",
    "name": "Cera Liquida Protetora de Carnauba D'addario - Pw-pl",
    "price": "R$ 52,00",
    "priceNum": 52.00,
    "rating": 4.8,
    "reviews": 308,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352804_1-17648494161855651.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352804_1-17648494161855651.jpeg"
    ],
    "inStock": true,
    "description": "Cera Liquida Protetora de Carnauba D'addario - Pw-pl. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Cera Liquida Protetora de Carnauba D'addario - Pw-pl</h2><p>Selecionado pela Tonante, o Cera Liquida Protetora de Carnauba D'addario - Pw-pl é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP352804"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "cera-liquida-protetora-de-carnauba-d-addario-pw-pl-cp352804",
    "productUrl": "https://tonante.com.br/cera-liquida-protetora-de-carnauba-d-addario-pw-pl-cp352804",
    "badge": "Oferta"
  },
  {
    "id": 267,
    "sku": "CP352805",
    "name": "Condicionador Hidratante Para Escalas D'addario - Pw-fbc",
    "price": "R$ 38,00",
    "priceNum": 38.00,
    "rating": 4.7,
    "reviews": 337,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352805_1-17621818172457670.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352805_1-17621818172457670.jpeg"
    ],
    "inStock": true,
    "description": "Condicionador Hidratante Para Escalas D'addario - Pw-fbc. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Condicionador Hidratante Para Escalas D'addario - Pw-fbc</h2><p>Selecionado pela Tonante, o Condicionador Hidratante Para Escalas D'addario - Pw-fbc é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP352805"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "condicionador-hidratante-para-escalas-d-addario-pw-fbc-cp352805",
    "productUrl": "https://tonante.com.br/condicionador-hidratante-para-escalas-d-addario-pw-fbc-cp352805"
  },
  {
    "id": 268,
    "sku": "CP352813",
    "name": "Polidor Spray Shine D'addario - PW-PL03",
    "price": "R$ 57,00",
    "priceNum": 57.00,
    "rating": 4.6,
    "reviews": 26,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352813_1-17648494554714414.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352813_1-17648494554714414.jpeg"
    ],
    "inStock": true,
    "description": "Polidor Spray Shine D'addario - PW-PL03. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Polidor Spray Shine D'addario - PW-PL03</h2><p>Selecionado pela Tonante, o Polidor Spray Shine D'addario - PW-PL03 é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP352813"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "polidor-spray-shine-d-addario-pw-pl03-cp352813",
    "productUrl": "https://tonante.com.br/polidor-spray-shine-d-addario-pw-pl03-cp352813"
  },
  {
    "id": 269,
    "sku": "CP352833",
    "name": "Óleo de Limão Para Limpeza D'addario - Pw-lmn",
    "price": "R$ 35,80",
    "priceNum": 35.80,
    "rating": 4.6,
    "reviews": 424,
    "category": "Acessórios",
    "tags": [
      "Acessórios"
    ],
    "brand": "D'Addario",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352833_1-17621817720784471.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/352833_1-17621817720784471.jpeg"
    ],
    "inStock": true,
    "description": "Óleo de Limão Para Limpeza D'addario - Pw-lmn. D'Addario é marca parceira selecionada pela Tonante.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Óleo de Limão Para Limpeza D'addario - Pw-lmn</h2><p>Selecionado pela Tonante, o Óleo de Limão Para Limpeza D'addario - Pw-lmn é de uma marca parceira que passa pela curadoria Tonante: só entra no catálogo o que a gente usaria no próprio palco.</p><h3>Curadoria de quem entende</h3><p>Mais de meio século de música nos dá critério: testamos e escolhemos parceiros que entregam qualidade de verdade.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Acessórios",
      "Marca parceira: D'Addario",
      "Garantia de 2 anos",
      "Curadoria Tonante"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP352833"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "D'Addario"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Marca parceira · curadoria Tonante"
      }
    ],
    "seoSlug": "oleo-de-limao-para-limpeza-d-addario-pw-lmn-cp352833",
    "productUrl": "https://tonante.com.br/oleo-de-limao-para-limpeza-d-addario-pw-lmn-cp352833"
  },
  {
    "id": 270,
    "sku": "CP355802",
    "name": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Sunburst - VTL1954SB",
    "price": "R$ 299,90",
    "priceNum": 299.90,
    "rating": 4.9,
    "reviews": 95,
    "category": "Violões",
    "tags": [
      "Violões",
      "Nylon",
      "Acústico",
      "Clássico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/355802_1-17798893654568500.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/355802_1-17798893654568500.jpeg"
    ],
    "inStock": true,
    "description": "Violão Clássico Acústico Lorenzzo 39\" - Nylon - Sunburst - VTL1954SB. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Clássico Acústico Lorenzzo 39\" - Nylon - Sunburst - VTL1954SB</h2><p>Parte da linha Tonante de violões, o Violão Clássico Acústico Lorenzzo 39\" - Nylon - Sunburst - VTL1954SB carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Nylon · Acústico · Clássico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP355802"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-classico-acustico-lorenzzo-39-nylon-sunburst-vtl1954sb-cp355802",
    "productUrl": "https://tonante.com.br/violao-classico-acustico-lorenzzo-39-nylon-sunburst-vtl1954sb-cp355802"
  },
  {
    "id": 271,
    "sku": "CP357159",
    "name": "Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Blue (ctb)",
    "price": "R$ 603,90",
    "priceNum": 603.90,
    "rating": 4.4,
    "reviews": 444,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/357159_1-17678224568006415.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/357159_1-17678224568006415.jpeg"
    ],
    "inStock": true,
    "description": "Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Blue (ctb). Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Blue (ctb)</h2><p>Parte da linha Tonante de violões, o Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Blue (ctb) carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP357159"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-aco-eletroacustico-performance-gdc-1-ceq-color-top-blue-ctb-cp357159",
    "productUrl": "https://tonante.com.br/violao-aco-eletroacustico-performance-gdc-1-ceq-color-top-blue-ctb-cp357159",
    "badge": "Oferta"
  },
  {
    "id": 272,
    "sku": "CP357160",
    "name": "Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Black (ctbk)",
    "price": "R$ 603,90",
    "priceNum": 603.90,
    "rating": 4.8,
    "reviews": 270,
    "category": "Violões",
    "tags": [
      "Violões",
      "Aço",
      "Eletroacústico",
      "Acústico"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/357160_1-17677966635888053.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/5/357160_1-17677966635888053.jpeg"
    ],
    "inStock": true,
    "description": "Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Black (ctbk). Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Black (ctbk)</h2><p>Parte da linha Tonante de violões, o Violão Aço Eletroacústico Performance GDC-1 CEQ Color TOP Black (ctbk) carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Aço · Eletroacústico · Acústico",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP357160"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-aco-eletroacustico-performance-gdc-1-ceq-color-top-black-ctbk-cp357160",
    "productUrl": "https://tonante.com.br/violao-aco-eletroacustico-performance-gdc-1-ceq-color-top-black-ctbk-cp357160"
  },
  {
    "id": 273,
    "sku": "CP35892",
    "name": "Capotraste Para Violao em Alumínio - Prata - CPT10",
    "price": "R$ 9,50",
    "priceNum": 9.50,
    "rating": 4.9,
    "reviews": 109,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Capotraste"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17458696672894743.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17458696672894743.jpeg"
    ],
    "inStock": true,
    "description": "Capotraste Para Violao em Alumínio - Prata - CPT10. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Capotraste Para Violao em Alumínio - Prata - CPT10</h2><p>Parte da linha Tonante de acessórios, o Capotraste Para Violao em Alumínio - Prata - CPT10 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Capotraste",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP35892"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "capotraste-para-violao-em-aluminio-prata-cpt10-cp35892",
    "productUrl": "https://tonante.com.br/capotraste-para-violao-em-aluminio-prata-cpt10-cp35892",
    "oldPrice": "R$ 10,86",
    "oldPriceNum": 10.86,
    "badge": "Oferta"
  },
  {
    "id": 274,
    "sku": "CP35895",
    "name": "Capotraste Para Violao em Alumínio - Preto - CPT10",
    "price": "R$ 9,50",
    "priceNum": 9.50,
    "rating": 4.8,
    "reviews": 138,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Capotraste"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17522997159603437.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17522997159603437.jpeg"
    ],
    "inStock": true,
    "description": "Capotraste Para Violao em Alumínio - Preto - CPT10. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Capotraste Para Violao em Alumínio - Preto - CPT10</h2><p>Parte da linha Tonante de acessórios, o Capotraste Para Violao em Alumínio - Preto - CPT10 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Capotraste",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP35895"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "capotraste-para-violao-em-aluminio-preto-cpt10-cp35895",
    "productUrl": "https://tonante.com.br/capotraste-para-violao-em-aluminio-preto-cpt10-cp35895",
    "oldPrice": "R$ 11,88",
    "oldPriceNum": 11.88,
    "badge": "Oferta"
  },
  {
    "id": 275,
    "sku": "CP35896",
    "name": "Capotraste Para Violao em Liga de Zinco - Preto - CPT20",
    "price": "R$ 21,50",
    "priceNum": 21.50,
    "rating": 4.5,
    "reviews": 225,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Capotraste"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17459253901688909.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/1/-/1-17459253901688909.jpeg"
    ],
    "inStock": true,
    "description": "Capotraste Para Violao em Liga de Zinco - Preto - CPT20. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Capotraste Para Violao em Liga de Zinco - Preto - CPT20</h2><p>Parte da linha Tonante de acessórios, o Capotraste Para Violao em Liga de Zinco - Preto - CPT20 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Capotraste",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP35896"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "capotraste-para-violao-em-liga-de-zinco-preto-cpt20-cp35896",
    "productUrl": "https://tonante.com.br/capotraste-para-violao-em-liga-de-zinco-preto-cpt20-cp35896"
  },
  {
    "id": 276,
    "sku": "CP360326",
    "name": "Guitarra Elétrica Tonante - Edição 70 Aniversário - Satin Black - TN70THBK",
    "price": "R$ 3.989,90",
    "priceNum": 3989.9,
    "rating": 4.4,
    "reviews": 242,
    "category": "Guitarras",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360326_-17783068717248056.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360326_-17783068717248056.jpeg",
      "https://cdn.oderco.com.br/produtos/360326/360326-A1.jpg",
      "https://cdn.oderco.com.br/produtos/360326/360326-A8.png",
      "https://cdn.oderco.com.br/produtos/360326/360326-A5.png",
      "https://cdn.oderco.com.br/produtos/360326/360326-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Tonante - Edição 70 Aniversário - Satin Black - TN70THBK. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Celebre 70 anos de história</h2><p>A Guitarra Elétrica 70th Anniversary Edition foi criada para homenagear o legado da Tonante com um instrumento exclusivo, sofisticado e de alta performance. Com corpo em Alder, braço em Roasted Maple e captadores duplos Humbucker, ela entrega versatilidade sonora, tocabilidade moderna e um visual marcante em quatro acabamentos especiais.</p><h3>Performance incomparável</h3><p>Cada detalhe foi cuidadosamente desenvolvido para oferecer uma experiência única. Dos trastes Jumbo em inox ao tensor Spoke Wheel, passando pelo acabamento premium e hardware exclusivo de cada versão, esta guitarra representa o encontro perfeito entre tradição, inovação e excelência musical.</p><h3>Quatro acabamentos exclusivos</h3><p>Escolha a versão que mais combina com o seu estilo. \nDisponível em quatro cores:\nSatin Military Green  |  Satin Black  |  Metallic Blue  |  Olympic White</p>",
    "features": [
      "Formato do Corpo: Jazz Master",
      "Corpo: Alder",
      "Braço: Roasted Maple",
      "Escala: Bolivian Rosewood",
      "Shape do Braço: Modern C",
      "Raio da Escala: 12\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP360326"
      },
      {
        "label": "Formato do Corpo",
        "value": "Jazz Master"
      },
      {
        "label": "Corpo",
        "value": "Alder"
      },
      {
        "label": "Braço",
        "value": "Roasted Maple"
      },
      {
        "label": "Escala",
        "value": "Bolivian Rosewood"
      },
      {
        "label": "Shape do Braço",
        "value": "Modern C"
      },
      {
        "label": "Raio da Escala",
        "value": "12\""
      },
      {
        "label": "Largura do Nut",
        "value": "42 mm"
      },
      {
        "label": "Comprimento da Escala",
        "value": "25.5\""
      },
      {
        "label": "Número de Trastes",
        "value": "21"
      },
      {
        "label": "Tipo de Traste",
        "value": "Jumbo Inox"
      },
      {
        "label": "Marcações",
        "value": "Bloco"
      },
      {
        "label": "Tensor",
        "value": "Spoke Wheel"
      }
    ],
    "seoSlug": "guitarra-eletrica-tonante-edicao-70-aniversario-satin-black-tn70thbk-cp360326",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-tonante-edicao-70-aniversario-satin-black-tn70thbk-cp360326",
    "oldPrice": "R$ 4.509,90",
    "oldPriceNum": 4509.9,
    "badge": "Oferta"
  },
  {
    "id": 277,
    "sku": "CP360327",
    "name": "Guitarra Elétrica Tonante - Edição 70 Aniversário - Metallic Blue - TN70THMB",
    "price": "R$ 1.499,90",
    "priceNum": 1499.90,
    "rating": 4.9,
    "reviews": 271,
    "category": "Guitarras",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360327_-17783068254208289.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360327_-17783068254208289.jpeg",
      "https://cdn.oderco.com.br/produtos/360327/360327-A1.jpg",
      "https://cdn.oderco.com.br/produtos/360327/360327-A8.png",
      "https://cdn.oderco.com.br/produtos/360327/360327-A5.png",
      "https://cdn.oderco.com.br/produtos/360327/360327-A6.png"
    ],
    "inStock": true,
    "description": "Guitarra Elétrica Tonante - Edição 70 Aniversário - Metallic Blue - TN70THMB. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Celebre 70 anos de história</h2><p>A Guitarra Elétrica 70th Anniversary Edition foi criada para homenagear o legado da Tonante com um instrumento exclusivo, sofisticado e de alta performance. Com corpo em Alder, braço em Roasted Maple e captadores duplos Humbucker, ela entrega versatilidade sonora, tocabilidade moderna e um visual marcante em quatro acabamentos especiais.</p><h3>Performance incomparável</h3><p>Cada detalhe foi cuidadosamente desenvolvido para oferecer uma experiência única. Dos trastes Jumbo em inox ao tensor Spoke Wheel, passando pelo acabamento premium e hardware exclusivo de cada versão, esta guitarra representa o encontro perfeito entre tradição, inovação e excelência musical.</p><h3>Quatro acabamentos exclusivos</h3><p>Escolha a versão que mais combina com o seu estilo. \nDisponível em quatro cores:\nSatin Military Green  |  Satin Black  |  Metallic Blue  |  Olympic White</p>",
    "features": [
      "Formato do Corpo: Jazz Master",
      "Corpo: Alder",
      "Braço: Roasted Maple",
      "Escala: Bolivian Rosewood",
      "Shape do Braço: Modern C",
      "Raio da Escala: 12\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP360327"
      },
      {
        "label": "Formato do Corpo",
        "value": "Jazz Master"
      },
      {
        "label": "Corpo",
        "value": "Alder"
      },
      {
        "label": "Braço",
        "value": "Roasted Maple"
      },
      {
        "label": "Escala",
        "value": "Bolivian Rosewood"
      },
      {
        "label": "Shape do Braço",
        "value": "Modern C"
      },
      {
        "label": "Raio da Escala",
        "value": "12\""
      },
      {
        "label": "Largura do Nut",
        "value": "42 mm"
      },
      {
        "label": "Comprimento da Escala",
        "value": "25.5\""
      },
      {
        "label": "Número de Trastes",
        "value": "21"
      },
      {
        "label": "Tipo de Traste",
        "value": "Jumbo Inox"
      },
      {
        "label": "Marcações",
        "value": "Bloco"
      },
      {
        "label": "Tensor",
        "value": "Spoke Wheel"
      }
    ],
    "seoSlug": "guitarra-eletrica-tonante-edicao-70-aniversario-metallic-blue-tn70thmb-cp360327",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-tonante-edicao-70-aniversario-metallic-blue-tn70thmb-cp360327"
  },
  {
    "id": 278,
    "sku": "CP360331",
    "name": "Guitarra Elétrica Tonante - Edição 70 Aniversário - Olympic White - TN70THOW",
    "price": "R$ 3.490,00",
    "priceNum": 3490,
    "rating": 4.9,
    "reviews": 54,
    "category": "Guitarras",
    "subcategory": "Edição comemorativa",
    "tags": [
      "Guitarras"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360331_1-17783069090081006.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/360331_1-17783069090081006.jpeg",
      "https://cdn.oderco.com.br/produtos/360331/360331-A1.jpg",
      "https://cdn.oderco.com.br/produtos/360331/360331-A8.png",
      "https://cdn.oderco.com.br/produtos/360331/360331-A5.png",
      "https://cdn.oderco.com.br/produtos/360331/360331-A6.png"
    ],
    "inStock": true,
    "description": "Edição comemorativa de 70 anos da Tonante. Acabamento exclusivo e versatilidade HSS pra todos os estilos.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Celebre 70 anos de história</h2><p>A Guitarra Elétrica 70th Anniversary Edition foi criada para homenagear o legado da Tonante com um instrumento exclusivo, sofisticado e de alta performance. Com corpo em Alder, braço em Roasted Maple e captadores duplos Humbucker, ela entrega versatilidade sonora, tocabilidade moderna e um visual marcante em quatro acabamentos especiais.</p><h3>Performance incomparável</h3><p>Cada detalhe foi cuidadosamente desenvolvido para oferecer uma experiência única. Dos trastes Jumbo em inox ao tensor Spoke Wheel, passando pelo acabamento premium e hardware exclusivo de cada versão, esta guitarra representa o encontro perfeito entre tradição, inovação e excelência musical.</p><h3>Quatro acabamentos exclusivos</h3><p>Escolha a versão que mais combina com o seu estilo. \nDisponível em quatro cores:\nSatin Military Green  |  Satin Black  |  Metallic Blue  |  Olympic White</p>",
    "features": [
      "Formato do Corpo: Jazz Master",
      "Corpo: Alder",
      "Braço: Roasted Maple",
      "Escala: Bolivian Rosewood",
      "Shape do Braço: Modern C",
      "Raio da Escala: 12\""
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP360331"
      },
      {
        "label": "Formato do Corpo",
        "value": "Jazz Master"
      },
      {
        "label": "Corpo",
        "value": "Alder"
      },
      {
        "label": "Braço",
        "value": "Roasted Maple"
      },
      {
        "label": "Escala",
        "value": "Bolivian Rosewood"
      },
      {
        "label": "Shape do Braço",
        "value": "Modern C"
      },
      {
        "label": "Raio da Escala",
        "value": "12\""
      },
      {
        "label": "Largura do Nut",
        "value": "42 mm"
      },
      {
        "label": "Comprimento da Escala",
        "value": "25.5\""
      },
      {
        "label": "Número de Trastes",
        "value": "21"
      },
      {
        "label": "Tipo de Traste",
        "value": "Jumbo Inox"
      },
      {
        "label": "Marcações",
        "value": "Bloco"
      },
      {
        "label": "Tensor",
        "value": "Spoke Wheel"
      }
    ],
    "seoSlug": "guitarra-eletrica-tonante-edicao-70-aniversario-olympic-white-tn70thow-cp360331",
    "productUrl": "https://tonante.com.br/guitarra-eletrica-tonante-edicao-70-aniversario-olympic-white-tn70thow-cp360331",
    "badge": "Edição 70 anos"
  },
  {
    "id": 279,
    "sku": "CP36758",
    "name": "Violão Elétrico Ágata 40\"- Cutaway - Natural - EQ 3 Bandas - ACTNA1954",
    "price": "R$ 457,44",
    "priceNum": 457.44,
    "rating": 4.5,
    "reviews": 161,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36758-17522568871905769.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36758-17522568871905769.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Ágata 40\"- Cutaway - Natural - EQ 3 Bandas - ACTNA1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Ágata 40\"- Cutaway - Natural - EQ 3 Bandas - ACTNA1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Ágata 40\"- Cutaway - Natural - EQ 3 Bandas - ACTNA1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP36758"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-agata-40-cutaway-natural-eq-3-bandas-actna1954-cp36758",
    "productUrl": "https://tonante.com.br/violao-eletrico-agata-40-cutaway-natural-eq-3-bandas-actna1954-cp36758"
  },
  {
    "id": 280,
    "sku": "CP36759",
    "name": "Violão Elétrico Jade 41\" - Natural - EQ 3 Bandas - ACTNJ1954",
    "price": "R$ 458,38",
    "priceNum": 458.38,
    "rating": 4.6,
    "reviews": 132,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36759-17523524803061187.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36759-17523524803061187.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Jade 41\" - Natural - EQ 3 Bandas - ACTNJ1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Jade 41\" - Natural - EQ 3 Bandas - ACTNJ1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Jade 41\" - Natural - EQ 3 Bandas - ACTNJ1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP36759"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-jade-41-natural-eq-3-bandas-actnj1954-cp36759",
    "productUrl": "https://tonante.com.br/violao-eletrico-jade-41-natural-eq-3-bandas-actnj1954-cp36759"
  },
  {
    "id": 281,
    "sku": "CP36760",
    "name": "Violão Elétrico Ametista 41\" - Tobacco - EQ 3 Bandas - ACTNAB1954",
    "price": "R$ 559,90",
    "priceNum": 559.90,
    "rating": 4.6,
    "reviews": 88,
    "category": "Violões",
    "tags": [
      "Violões"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36760-17523571405014983.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/6/36760-17523571405014983.jpeg"
    ],
    "inStock": true,
    "description": "Violão Elétrico Ametista 41\" - Tobacco - EQ 3 Bandas - ACTNAB1954. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Violão Elétrico Ametista 41\" - Tobacco - EQ 3 Bandas - ACTNAB1954</h2><p>Parte da linha Tonante de violões, o Violão Elétrico Ametista 41\" - Tobacco - EQ 3 Bandas - ACTNAB1954 carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Violões",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP36760"
      },
      {
        "label": "Categoria",
        "value": "Violões"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "violao-eletrico-ametista-41-tobacco-eq-3-bandas-actnab1954-cp36760",
    "productUrl": "https://tonante.com.br/violao-eletrico-ametista-41-tobacco-eq-3-bandas-actnab1954-cp36760",
    "oldPrice": "R$ 626,21",
    "oldPriceNum": 626.21,
    "badge": "Oferta"
  },
  {
    "id": 282,
    "sku": "CP37641",
    "name": "Microfone com Cabo USB PODCAST-400U Preto",
    "price": "R$ 119,90",
    "priceNum": 119.9,
    "rating": 4.7,
    "reviews": 221,
    "category": "Acessórios",
    "tags": [
      "Acessórios",
      "Microfone",
      "Cabo"
    ],
    "brand": "Tonante",
    "image": "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/7/37641-17523305064321759.jpeg",
    "images": [
      "https://www.oderco.com.br/media/catalog/product/cache/c5b0e6136a6dd7f7d91d8b889ed40f35/3/7/37641-17523305064321759.jpeg"
    ],
    "inStock": true,
    "description": "Microfone com Cabo USB PODCAST-400U Preto. Tradição Tonante desde 1954.",
    "htmlDescription": "<section class=\"produto-descricao\"><h2>Microfone com Cabo USB PODCAST-400U Preto</h2><p>Parte da linha Tonante de acessórios, o Microfone com Cabo USB PODCAST-400U Preto carrega a tradição de quem faz instrumento desde 1954. Qualidade de fábrica, pronto pra fazer parte da sua história musical.</p><h3>Cuidado de quem entende</h3><p>Mais de meio século de experiência em cada detalhe. Materiais selecionados e controle de qualidade rigoroso, do galpão ao palco.</p><h3>Pronto para tocar</h3><p>Sai da caixa ajustado e conferido. É só começar a tocar a sua próxima música.</p>",
    "features": [
      "Microfone · Cabo",
      "Acabamento Tonante de fábrica",
      "Garantia de 2 anos",
      "Tradição brasileira desde 1954"
    ],
    "specs": [
      {
        "label": "SKU",
        "value": "CP37641"
      },
      {
        "label": "Categoria",
        "value": "Acessórios"
      },
      {
        "label": "Marca",
        "value": "Tonante"
      },
      {
        "label": "Garantia",
        "value": "2 anos contra defeitos de fabricação"
      },
      {
        "label": "Origem",
        "value": "Brasil · tradição desde 1954"
      }
    ],
    "seoSlug": "microfone-com-cabo-usb-podcast-400u-preto-cp37641",
    "productUrl": "https://tonante.com.br/microfone-com-cabo-usb-podcast-400u-preto-cp37641"
  }
];

/* rawProducts vem do Magento; extraProducts é o que ainda não existe no ERP e
   foi montado à mão (ver productsExtra.ts); siteOficialProducts são as linhas
   que só existem no site institucional da Tonante (ver productsSiteOficial.ts).
   Tudo que consome catálogo usa allProducts, então não há dois caminhos pra
   achar um produto. */
/* A viola caipira mora dentro de "Violões" no catálogo, e buscar por "viola"
   traz todo violão junto (o normalizador vê "viola" dentro de "violao").
   A tag abaixo dá um termo exclusivo pra home linkar a família direto. */
const TAG_VIOLA = "Viola Caipira";
const isViolaCaipira = (p: Product) => p.category === "Violões" && /^viola\b/i.test(p.name);

export const allProducts: Product[] = [
  ...rawProducts,
  ...extraProducts,
  ...siteOficialProducts,
  /* Kits "Pronto pra Tocar" entram como produto de catálogo, não como combo
     montado no carrinho — mesma decisão que o PCYES v3 tomou com os setups.
     Assim eles herdam busca, filtro, comparador e PDP sem código novo. */
  ...kitProducts,
].map((p) =>
  isViolaCaipira(p) && !p.tags.includes(TAG_VIOLA) ? { ...p, tags: [...p.tags, TAG_VIOLA] } : p,
);

export const categories = ["Pronto pra Tocar","Violões","Guitarras","Contrabaixos","Baterias","Acessórios","Cordas & Encordoamentos","Suportes"];
export const allTags = ["Acessórios","Palheta","Suportes","Microfone","Cabo","Dobrável","Capa","Guitarras","Single-coil","6 cordas","Contrabaixos","4 cordas","Violões","Nylon","Acústico","Clássico","Níquel","5 cordas","Cordas & Encordoamentos","Aço","Eletroacústico","Viola","Bronze","Ukulele","Capotraste","Afinador","Baterias","Pro Series","Legacy","Volcano","Abalone","Safira","Coral","Baby","Muriel's","Star Light","Cecille","Sonora","Viola Caipira"];
export const brands = ["Tonante"];
