# Monte seu kit — ajuda, kit pronto, kit montado

Spec de design. 2026-09-17. Branch `tonante/website-v1`.

Referência: `MONTE SEU SETUP` do PCYES v3, em `/home/gabrielbarbosa/dev/v3-codigo-fonte`
(há quatro cópias do v3 na máquina; esta é a que o Gabriel chama de `v3-codigo-fonte`
e é a que vale).

---

## 1. O que estamos copiando, e o que não

O v3 tem três caminhos a partir de uma tela só: montar do zero, pedir ajuda, ou
levar pronto. A parte que faz aquilo parecer caro **não é o quiz** — é o dado.
`src/app/lib/gameLibrary.ts` (319 linhas) guarda ~80 jogos e programas, e cada
entrada carrega três coisas que fazem todo o trabalho visual e lógico:

```ts
{ id: "valorant", name: "Valorant", alias: ["valo"],
  cover: wikiImg("en/b/ba/Valorant_cover.jpg"),
  bg1: "#FF4655", bg2: "#0F1923", weight: "light", tag: "FPS Tático" }
```

- a **capa**, que transforma um formulário num grid de pôsteres;
- as **duas cores da marca**, que dão ao card o gradiente do próprio jogo;
- o **`weight`** (`light | medium | heavy`), que é a única ponte entre gosto e
  produto.

E a mesma biblioteca serve dois lugares: o passo do quiz e o bloco
"O QUE RODA NESSA MÁQUINA" na PDP de cada setup
(`src/app/components/SetupWorkloadsBlock.tsx`). Uma fonte, dois usos — está
documentado no topo de `gameLibrary.ts` que foi exatamente assim que nasceu.

**O que não copiamos:** no v3 a performance é um número (FPS). Timbre não é. O
eixo único do `weight` não traduz, e forçá-lo produziria recomendação burra.

---

## 2. `bandLibrary.ts` — o coração

Arquivo novo, `src/app/lib/bandLibrary.ts`. É o gargalo do projeto e é trabalho
de curadoria, não de código.

```ts
export interface Band {
  id: string; name: string; alias?: string[];
  cover: string;              // capa de álbum (Wikipedia, mesma técnica do v3)
  bg1: string; bg2: string;   // cores tiradas da capa
  genero: Genero;             // rock | folk | samba | gospel | mpb | blues | sertanejo | pop
  subgenero: string;          // livre; não vira UI, só explica o som
  som: Som;
  tag: string;                // "Punk 70s", "Folk americano"
}

export interface Som {
  corda: "nylon" | "aco" | "ambos";
  captacao: "nenhuma" | "passiva" | "single" | "humbucker";
  nivel: "facil" | "medio" | "dificil";
  ataque: "suave" | "brilhante" | "agressivo";
}
```

Exemplo:

```ts
{ id: "ramones", name: "Ramones", alias: ["ramone"],
  cover: wikiImg("en/6/6e/Ramonesramones.jpg"),
  bg1: "#E8E3D3", bg2: "#1A1A1A",
  genero: "rock", subgenero: "punk",
  som: { corda: "aco", captacao: "humbucker", nivel: "facil", ataque: "agressivo" },
  tag: "Punk 70s" }
```

**Por que quatro campos e não um.** Foi a pergunta do Gabriel: "ele curte folk,
mas qual tipo?". A resposta do desenho é que não precisamos de uma taxonomia de
gênero mais funda — precisamos que Fleet Foxes e Mumford & Sons, os dois folk,
peçam violões diferentes. Quem diz isso é o `som`. O `subgenero` existe só para
explicar o resultado ao usuário, nunca como pergunta.

Meta: ~60 bandas, cobrindo os 8 gêneros, com viés para repertório brasileiro
(o quiz atual já usa sertanejo, gospel/louvor e samba/pagode como estilos —
`src/app/pages/guia/motor.ts:40-49`).

### Como entra no scorer

`src/app/pages/guia/motor.ts` já é um **scorer, não um filtro** (`recomendar()`,
linhas 200-232): pontua cada produto e nunca devolve lista vazia. Isso fica.

| campo de `som` | estado hoje | mudança |
|---|---|---|
| `corda` | existe, peso +4 | reaproveita |
| `captacao` | existe como booleano | vira enum, peso por tipo |
| `nivel` | não existe | novo eixo |
| `ataque` | não existe | novo eixo |

Quando o usuário marca várias bandas, o perfil é a **moda** de cada campo, com
empate resolvido pela banda marcada primeiro. Os "porquês" da tela de resultado
(que já existem) passam a citar a banda: *"aço, porque Ramones"*.

### Risco aberto: `nivel` e `ataque` não existem no catálogo

Atributo de produto hoje é **regex sobre o nome**
(`src/app/components/productAttributes.ts`, `getProductAttributes`). Regex
extrai madeira, corda e tipo, mas não sabe se um violão é fácil de tocar.

Decisão: um mapa à mão por **linha de produto** (Lorenzzo, Coral, Jazzmine…),
não por SKU — são poucas linhas e elas é que determinam ação e timbre. Mora em
`src/app/lib/linhaPerfil.ts`, e o `productAttributes` passa a consultá-lo.

---

## 3. Rotas

| rota | o que é |
|---|---|
| `/monte-seu-kit` | tela de entrada, 3 caminhos |
| `/monte-seu-kit/ajuda` | quiz |
| `/monte-seu-kit/montar` | builder |
| `/pronto-pra-tocar` | listagem de kits (categoria) |

`/monte-seu-pc`, herdada do PCYES e hoje morta, sai do `src/app/routes.tsx`.

**Nome da aba: "Pronto pra Tocar"**, escolhido pelo Gabriel sobre Backline, Rigs
e Setups. Não é jargão, é promessa: chega, liga e toca. Entende-se sem legenda.

---

## 4. Tela de entrada

Molde: `WelcomeScreen` (`MonteSeuPcPage.tsx:3651-3808`). Hero com título e
subtítulo, depois grid `md:grid-cols-3` de cards.

| card | destino | badge |
|---|---|---|
| Me ajuda a escolher | `/monte-seu-kit/ajuda` | **POPULAR**, em foco por padrão |
| Quero montar meu kit | `/monte-seu-kit/montar` | — |
| Já tá pronto, quero levar | `/pronto-pra-tocar` | — |

O terceiro **não abre tela própria** — navega para a listagem. É o que o v3 fez
quando migrou "builds prontas" para o catálogo (`MonteSeuPcPage.tsx:3800-3802`).

Diferença de arte: o v3 usa SVG blueprint inline (`PathBlueprint.tsx`). Aqui
usamos **fotografia**, conforme a direção "Apple com imagem" — ver §8.

---

## 5. O quiz

Quatro passos. O v3 tem 2-3 e é por isso que não cansa; seis passos matariam o
fluxo. Máquina de estados por pilha (`history: StepId[]`, back = pop), igual ao
`QuizFlow` do v3 (`MonteSeuPcPage.tsx:1799-2220`).

**1 · Qual instrumento.** Grid de 8 famílias: violão, guitarra, contrabaixo,
viola caipira, ukulele, bateria, teclado, sopro. Card com foto da família.

> **O card toca o timbre no hover.** `TimbrePlayer` e `src/app/lib/timbre.ts` já
> existem, e `public/audio/` já tem mp3 de bateria, viola, teclado e flauta —
> famílias que ainda nem têm produto. O v3 mostra FPS; aqui a tela faz som.
> Melhor troca do projeto, e sai quase de graça. Em toque (sem hover), toca no
> primeiro tap e seleciona no segundo.

**2 · Quem você quer tocar.** Uma tela só. Chips de gênero no topo filtram um
grid de capas de álbum embaixo, com busca por nome e alias. É o `GameTile`
(`MonteSeuPcPage.tsx:1412-1538`) com outra arte, incluindo o fallback: se a capa
não carregar, mostra o nome em tipografia grande sobre as duas cores. Seleção
múltipla. **Pulável** — quem não sabe ou não liga segue sem penalidade.

**3 · Há quanto tempo você toca.** Três cards sem foto, molde do `LevelCard`
(`MonteSeuPcPage.tsx:1660-1799`): ícone grande, chip de spec, cor de destaque.
Primeiro instrumento / voltando depois de anos / toco faz tempo.

**4 · Onde e quanto.** Contexto (casa, igreja, palco, estúdio) e faixa de preço
na mesma tela. As duas perguntas já existem no `GuiaPage` atual.

**Resultado.** Navega direto para a PDP do produto recomendado, como
`handleQuizComplete` (`MonteSeuPcPage.tsx:5648-5656`). Se o perfil bater melhor
com um kit do que com um instrumento solto, manda para o kit. Fallback de
sempre: "Falar com um músico" → `/fale-conosco`.

### O que acontece com `/guia`

`/guia` e seu `motor.ts` **não são jogados fora** — o motor é reaproveitado e a
rota passa a redirecionar para `/monte-seu-kit/ajuda`. A `GuiaPage` atual é
absorvida pelo passo 4 e pela tela de resultado.

---

## 6. Pronto pra Tocar

### Listagem

Não é rota especial. É a `ProductsPage` genérica com o mesmo truque do v3:
`isSetupListing` (`ProductsPage.tsx:772`) detecta que a maioria dos itens
filtrados tem a tag e liga facetas exclusivas.

| faceta v3 | aqui |
|---|---|
| Faixa (Entrada/Intermediário/Avançado) | fica |
| Hardware (GPU/RAM) | vira **Instrumento** |

Card ganha arte própria em retrato e selo de faixa (`SetupTierBadge`,
`ProductsPage.tsx:1746`).

### Modelagem dos kits

Molde: `SETUP_SEED` (`src/app/lib/setups.ts:51-115`). Em `src/app/lib/kits.ts`.

O v3 tem 9 setups porque suas 3 personas fazem sentido nas 3 faixas. Aqui não:
"quem tá começando" na faixa Avançado é uma contradição. **São 8 kits**, com um
buraco assumido — a alternativa seria inventar um quarto perfil só para fechar a
grade, e grade cheia não é motivo suficiente.

| perfil | Entrada | Intermediário | Avançado |
|---|---|---|---|
| Quem tá começando | Primeiro Acorde | Primeiro Palco | *(vazio, de propósito)* |
| Quem toca na igreja | Louvor | Ministério | Culto Cheio |
| Quem toca fora de casa | Ensaio | Bar | Palco |

(Nomes são proposta; ajustáveis na execução.)

Cada seed vira um `Product` real, com PDP, preço único, rating e compra em um
clique — **sem explodir o carrinho em itens**, que é o padrão que o v3 adotou
(`setups.ts:5-17`). Ganha de graça o comparador e a busca que já existem.

### PDP

Gate igual ao v3 (`ProductPage.tsx:2798-2809`): só desvia para a descrição
especial quando o produto é kit. Produto normal nunca passa por aqui.

| bloco do v3 | aqui | file:line de referência |
|---|---|---|
| PRA QUEM É | igual: texto + arte quadrada full-bleed | `ProductPage.tsx:2696-2717` |
| POR QUE ESSA CONFIGURAÇÃO | **POR QUE ESSAS PEÇAS** — 3 cards com foto da peça | `ProductPage.tsx:2721-2764` |
| vídeo do YouTube + régua de stats | **vídeo de músico** (`public/musicos/*.mp4`, já existe) + **timbre tocável** no lugar dos números | `SetupStorySections.tsx:77-133` |
| cenas panorâmicas com métrica na foto | cenas de uso: no quarto, na igreja, no palco | `SetupStorySections.tsx:139-165` |
| O QUE RODA NESSA MÁQUINA | **O QUE DÁ PRA TOCAR COM ISSO** | `SetupWorkloadsBlock.tsx` |
| FAQ acordeão | igual | `SetupStorySections.tsx:177-215` |
| sidebar FICHA DO SETUP | **FICHA DO KIT** + linha "bandas que esse kit dá conta" | `ProductPage.tsx:1679-1747` |
| drawer lateral de peças, preço total, comprar | igual | `ProductPage.tsx:1512-1661` |

O vídeo segue a regra do v3: thumb estático, `<iframe>`/`<video>` só é injetado
no clique.

### "O QUE DÁ PRA TOCAR COM ISSO"

É onde a simetria fecha. A mesma `bandLibrary`, o mesmo card, a mesma capa que o
usuário clicou no quiz — agora com um veredito:

| veredito | quando |
|---|---|
| Dá conta | `som` da banda casa com o kit em corda e captação |
| Dá, mas apertado | casa em corda, falha em captação ou nível |
| Não é pra isso | conflito de corda (nylon x aço) |

Item não suportado **não some** — aparece apagado, exatamente como o
`supported: false` do v3 (`setups.ts:317-342`). Abas Bandas / Estilos, até 6 em
destaque, e um sheet lateral com busca para o catálogo inteiro.

**O veredito é calculado, nunca digitado por SKU.** É a regra explícita do topo
do `SetupWorkloadsBlock.tsx` e existe para os kits não divergirem entre si.

### "Essa ou a vizinha"

O v3 tinha comparação com o kit da faixa ao lado e o cliente mandou tirar; o
código ficou morto (`SetupStorySections.tsx:7-17`). **Aqui mantemos** — o
Tonante já tem `/comparar` funcionando, então é um link, não uma feature.

---

## 7. Catálogo: o que precisa ser semeado

Hoje o catálogo tem seis categorias e só três são instrumento: Violões,
Guitarras, Contrabaixos (mais Cordas, Suportes, Acessórios). O Gabriel decidiu
mostrar as 8 famílias e semear produto para as que faltam.

| família | estado |
|---|---|
| Violões, Guitarras, Contrabaixos | existe |
| Ukulele | existe, mas preso dentro de Violões — vira categoria |
| Viola caipira, Bateria, Teclado, Sopro | **semear ~8 produtos cada** |

Cada família nova precisa também de um parser em `productAttributes.ts`, no
mesmo padrão dos que já estão lá (`parseViolao`, `parseGuitarra`, `parseBaixo`).

`public/categorias/` **já tem** arte de bateria, viola, ukulele e microfone —
faltam teclado e sopro.

---

## 8. Imagens

Direção do Gabriel: **Apple, com foto**. Traduzido para regras:

- objeto sobre fundo contínuo, sem cenário e sem prop;
- uma fonte de luz só, sombra longa e macia;
- muito espaço negativo, objeto ocupando menos do que parece certo;
- paleta quente e dessaturada; âmbar `#C87800` aparece como luz, nunca como
  fundo chapado;
- nada de texto, logo ou marca d'água na imagem.

Isso conversa com o que o site já faz: `photoBackdrop.ts` separa foto recortada
(fundo branco, `object-contain`) de foto ambientada (`object-cover`), e a
miniatura de produto é retrato 50×66 enquadrado a 62% da altura
(`v2/instrumentFraming.ts`) porque pelo centro só aparece braço.

As imagens entram como **placeholder** e o Gabriel gera uma a uma depois. Os
prompts estão em `docs/superpowers/specs/2026-09-17-prompts-imagem.md`.

Inventário:

| o que | quantas | prioridade |
|---|---|---|
| cards da tela de entrada | 3 | alta |
| categoria: teclado, sopro | 2 | alta |
| hero dos kits (retrato + panorâmico) | 8 × 2 | alta |
| "pra quem é", quadrada | 8 | média |
| cenas de uso (quarto, igreja, palco) | 3, compartilhadas | média |

Capa de álbum **não é gerada** — vem da Wikipedia, mesma técnica do `wikiImg`
do v3.

---

## 9. Ordem de execução

1. `bandLibrary.ts` + `linhaPerfil.ts` + eixos novos no `motor.ts`. Sem UI.
2. Seed de catálogo das 4 famílias novas + parsers + ukulele como categoria.
3. `kits.ts` no molde do `SETUP_SEED` + faceta na `ProductsPage` + rota da aba.
4. PDP do kit: os sete blocos, com placeholder de imagem.
5. Tela de entrada + quiz reformado; `/guia` redireciona.
6. Troca dos placeholders pelas imagens geradas.

Cada etapa é navegável ao fim dela. Ninguém fica preso esperando imagem.

---

## 10. Riscos registrados

**Capa de álbum é material protegido.** Em protótipo interno, tudo bem. Se for
para produção, é pendência jurídica — não some sozinha. A alternativa, se o dia
chegar, é o card de arte abstrata com as duas cores e o nome em tipografia, que
o fallback de erro já desenha.

**`nivel` e `ataque` são julgamento, não dado.** O mapa por linha de produto é
uma opinião minha e do Gabriel escrita em arquivo. Ela vai errar em casos de
borda, e o scorer nunca devolve vazio, então errar significa recomendar um
instrumento pior — não quebrar a tela.

**Produto semeado é ficção.** Bateria, teclado, viola e sopro não existem no
catálogo real da Tonante. O protótipo fica completo e navegável ao custo de dado
inventado. Está alinhado com o que o projeto já faz em outros pontos (músicos,
depoimentos, estoque).
