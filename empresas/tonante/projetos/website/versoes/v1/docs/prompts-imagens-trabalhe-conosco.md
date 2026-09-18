# Imagens do hover de benefícios — /trabalhe-conosco

Onze imagens, uma por benefício da lista. Elas aparecem num card de 296×222 que
segue o cursor quando o mouse encosta no item. A décima segunda, "Recrutamento
interno", já está resolvida com `dupla-conferindo.webp`.

Gerar em **1200×900 (4:3)**, salvar em `public/lp/` com o nome da tabela abaixo,
converter pra `.webp` antes de commitar.

---

## O que faz a imagem não parecer de IA

Quatro coisas, em ordem de importância:

1. **Luz vinda de um lugar só.** Imagem de IA costuma ter luz em todo canto e
   sombra em nenhum. Todo prompt daqui nomeia a fonte: janela à esquerda,
   claraboia, sol das seis da tarde. Sombra dura é amiga.
2. **Gente ocupada, não gente posando.** Ninguém olha pra câmera, ninguém sorri
   pro fotógrafo. Todo mundo está no meio de alguma coisa: servindo, subindo,
   apertando, conferindo.
3. **Sujeira.** Parede com marca, bancada gasta, café derramado, caixa fora do
   lugar. Cenário limpo demais é a assinatura do render.
4. **Câmera de verdade.** Cada prompt traz lente e abertura. Mudar o número
   muda o achatamento do fundo, e é isso que separa foto de ilustração.

O uniforme da casa é **polo azul-marinho**, e ele aparece em todas as cenas de
fábrica — é o que amarra as onze imagens como se fossem do mesmo dia.

## Trecho base

Vai colado no começo de **todos** os prompts:

> Fotografia documental, câmera full-frame, cor natural sem filtro. Brasil,
> interior do Paraná, dia comum de semana. Pessoas brasileiras reais entre 25 e
> 55 anos, diversidade de tom de pele, corpo e idade, roupa de trabalho usada e
> amassada. Ninguém olha para a câmera. Grão fino de sensor, leve imperfeição de
> foco, nada de HDR. Sem texto legível, sem logotipo, sem marca d'água.

## Trecho negativo

Se o gerador aceitar prompt negativo, use este em todas:

> render 3d, ilustração, cgi, plástico, pele lisa demais, dente branco demais,
> sorriso para a câmera, pose de banco de imagem, iluminação de estúdio chapada,
> hdr, saturação exagerada, texto, logotipo, marca d'água, mão com seis dedos,
> rosto deformado, corpo simétrico demais, escritório americano, gente loira de
> terno

---

## Os onze prompts

### 1. Assistência médica Unimed → `ben-unimed.webp`

> Consultório médico pequeno de clínica de bairro no Brasil. Uma médica de
> jaleco branco, cabelo preso, sentada de lado numa cadeira giratória, escuta um
> paciente de meia-idade que gesticula enquanto explica alguma coisa. Ela anota
> num bloco de papel, não no computador. Entre os dois, uma mesa com papelada,
> um porta-canetas cheio e um copo d'água. Luz de janela grande à esquerda,
> persiana meio aberta, listras de sol no chão. Parede bege com um cartaz
> desbotado sem texto legível. 50mm, f/2, foco nos dois rostos de perfil.

### 2. Assistência odontológica → `ben-odonto.webp`

> Consultório odontológico de clínica popular. Dentista de máscara, touca e luva
> azul inclinada sobre um paciente reclinado na cadeira, com a auxiliar ao lado
> segurando o sugador. O refletor odontológico está aceso e é a fonte de luz
> mais forte do quadro, estourando um pouco no branco do equipamento. Ao fundo,
> armário de fórmica com frascos e algodão. Enquadramento de perto, pela lateral
> da cadeira, com o ombro da auxiliar desfocado em primeiro plano. 35mm, f/2.8.

### 3. Convênio com farmácia → `ben-farmacia.webp`

> Balcão de farmácia de bairro brasileira, fim de tarde. Atendente de jaleco
> entregando uma caixinha de remédio branca, sem nada escrito, para um cliente
> de camisa de trabalho que já estende a mão. Atrás, prateleiras cheias de caixas
> coloridas desfocadas. Luz fluorescente fria do teto misturada com a luz quente
> que entra da rua pela vitrine. Balcão com marcas de uso e um pote de balas
> perto da máquina de cartão. 35mm, f/2.5, foco nas duas mãos.

### 4. Wellhub → `ben-wellhub.webp`

> Academia de bairro num fim de tarde vazio. Homem de uns 45 anos, camiseta
> velha de algodão e short, sentado num aparelho de musculação no meio de uma
> série, testa suada, olhando para o chão e concentrado. Aparelho com a pintura
> descascada, anilhas empilhadas fora do lugar, espelho encardido ao fundo
> refletindo a janela. Luz laranja das seis da tarde entrando de lado e
> recortando o braço dele. Nada de academia de rede, nada de corpo de capa de
> revista. 50mm, f/2, fundo achatado.

### 5. Horário comercial → `ben-horario.webp`

> Portaria de uma fábrica de médio porte em Maringá, sete da manhã. Fila curta
> de trabalhadores de polo azul-marinho entrando pelo portão lateral, crachá no
> peito, mochila nas costas, um deles passando o crachá na catraca. Sol baixo
> vindo de trás, quase contra a câmera, alongando as sombras no asfalto e
> deixando uma névoa dourada no ar. Galpão de telha metálica ao fundo, placa
> sem texto legível. 35mm, f/4, contraluz.

### 6. Refeitório da casa → `ben-refeitorio.webp`

> Refeitório de fábrica no meio do almoço. Mesas compridas de fórmica ocupadas
> por trabalhadores de polo azul-marinho comendo e conversando, alguns de costas
> pra câmera. Em primeiro plano, uma bandeja de inox com arroz, feijão, bife,
> salada e um copo de suco. Luz branca de claraboia caindo de cima, sem sombra
> dura. Ao fundo, o balcão de servir com cubas e uma funcionária de touca. Vapor
> subindo da panela. Ruído visual de refeitório de verdade: guardanapo amassado,
> celular na mesa, garrafinha de água. 28mm, f/3.5, altura do peito.

### 7. Transporte → `ben-transporte.webp`

> Ônibus fretado branco, modelo rodoviário simples e um pouco velho, parado na
> saída de uma fábrica no fim da tarde. Trabalhadores de polo azul-marinho
> subindo pela porta da frente, um deles ainda chegando de longe com passo
> apressado. Asfalto molhado de chuva recente refletindo o céu alaranjado. Nada
> escrito na lataria do ônibus. Fotografado de fora, um pouco de longe, com o
> galpão cortado no canto do quadro. 50mm, f/4.

### 8. Café durante o expediente → `ben-cafe.webp`

> Copa pequena de fábrica. Close das mãos calejadas de um trabalhador de polo
> azul-marinho servindo café preto de uma garrafa térmica de inox numa xícara
> branca pequena, com vapor visível. Bancada de granito manchada, açucareiro
> aberto, algumas xícaras sujas ao lado e um pano de prato dobrado. Luz quente
> de lâmpada amarela vindo de cima à direita. Fundo desfocado com um colega de
> costas. 50mm macro, f/2.8, foco na xícara.

### 9. PLR → `ben-plr.webp`

> Chão de fábrica de instrumentos, oito ou dez trabalhadores de polo
> azul-marinho reunidos em roda comemorando um resultado: palma, sorriso aberto,
> um deles com o braço no ombro do outro, uma mulher rindo no meio. Ninguém olha
> para a câmera, o olhar de todos vai para alguém que fala fora do quadro. Ao
> redor, bancadas de marcenaria, corpos de violão pendurados na parede e serragem
> no chão. Luz de claraboia caindo no grupo e deixando o fundo mais escuro. Nada
> de palco, nada de troféu, nada de confete. 35mm, f/2.8.

### 10. Mixtra → `ben-mixtra.webp`

> Mãos segurando um celular na vertical, visto por cima do ombro. Na tela, uma
> lista de cartões de cupom empilhados, mostrados só como blocos de cor e formas
> geométricas, sem nenhum texto legível e sem logotipo. Fundo: mesa de escritório
> desfocada com caneca, teclado e um caderno aberto. Luz de janela fria vindo da
> esquerda, reflexo suave no vidro do celular. 50mm, f/2.2, foco na tela.

### 11. Desconto de colaborador → `ben-desconto.webp`

> Natureza-morta de estúdio sobre fundo cinza-claro liso, sem cenário. Três
> objetos lado a lado, ligeiramente desalinhados: um violão de aço em pé apoiado
> num suporte discreto, um headset gamer preto deitado e um notebook fino
> fechado. Uma única fonte de luz suave vindo de cima à direita, projetando uma
> sombra longa e coerente para todos. Reflexo fraco no piso. Nenhum logotipo,
> nenhum adesivo, nenhuma marca em nenhum dos produtos. 85mm, f/8, tudo em foco.

---

## Quando as imagens chegarem

Cada bullet em `src/app/pages/TrabalheConoscoPage.tsx` tem um campo `foto`, que
é o rótulo do poço vazio, e aceita um campo `src`. Ligar a imagem é acrescentar
uma linha:

```tsx
{
  nome: "Wellhub",
  texto: "Acesso a academias, estúdios e aplicativos de treino pelo país.",
  foto: "Pessoa treinando em academia",
  src: "/lp/ben-wellhub.webp",
},
```

Sem `src`, o card mostra o poço hachurado com o rótulo em caixa alta. É assim
que ele está hoje, e é por isso que dá pra entregar as imagens aos poucos, sem
quebrar nada.

## Logo de marca

Unimed, Wellhub e Mixtra não entram como logo gerado por IA: sai torto e sai
falso. As cenas 1, 4 e 10 são genéricas de propósito. Se a marca precisar
aparecer, o caminho é pegar o logotipo oficial e compor por cima da foto, não
pedir pro gerador desenhar.

---

## O que acabou entrando (18/09/2026)

As imagens foram geradas fora destes prompts, por conta do Gabriel, e ficaram
melhores que o que estava descrito aqui — principalmente porque as marcas
aparecem de verdade (a placa da Unimed na parede do consultório, o app do
Wellhub na mão, os cupons do Mixtra na tela) em vez de cena genérica.

| Benefício | Arquivo em `public/lp/` |
|---|---|
| Assistência médica Unimed | `ben-unimed.webp` |
| Assistência odontológica | `ben-odonto.webp` |
| Convênio com farmácia | `ben-farmacia.webp` |
| Wellhub | `ben-wellhub.webp` |
| Horário comercial | `ben-horario.webp` |
| Refeitório da casa | `ben-refeitorio.webp` |
| Transporte | `ben-transporte.webp` |
| Café durante o expediente | `ben-cafe.webp` |
| PLR | `ben-plr.webp` |
| Mixtra | `ben-mixtra.webp` |
| Desconto de colaborador | `ben-desconto.webp` |
| Recrutamento interno | `ben-crescer.webp` |

Sobraram quatro variantes não usadas em `public/assets/`, todas boas e todas
segunda opção de um tema que já tinha vencedor: outro celular do Mixtra, outro
café (de cafeteria, não de copa de fábrica), outro time comemorando (em
escritório de design, não no galpão) e outro still do desconto (fundo cinza de
estúdio, no lugar do aparador de casa).

Os PNGs originais, de 2 MB cada, ficam fora do git: o que entra no repositório
é só o `.webp` de até 1200 px que a página usa.
