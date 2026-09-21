# Decisões — Tonante website

Registro append-only do *porquê*. O que as coisas fazem está no código; aqui
fica o que uma leitura do diff não conta. Entrada nova vai no fim.

## 2026-09-21 — Acessibilidade é o VLibras do gov.br, não um painel caseiro

O ícone de mão no `HeaderV2` era placeholder: `onClick={() => {}}`.

A saída óbvia seria o painel que os plugins comerciais oferecem (contraste,
tamanho de fonte, cursor grande). A loja não precisa dele: contraste e escala de
texto já vêm do sistema operacional e do navegador, e um painel próprio
duplicaria isso com um controle pior. O que a loja não tinha, e ninguém supre
por fora, é Libras — primeira língua de parte do público surdo, em que o
português escrito é segunda língua.

Ficou o [VLibras](https://vlibras.gov.br) (`vlibras-plugin.js`, v7.12.2 no CDN
do governo). É o tradutor oficial do gov.br, gratuito, e o avatar já é
reconhecido por quem usa.

Implementação em `src/app/lib/vlibras.ts`:

- **Carregado sob demanda.** O pacote traz avatar 3D em WebGL. Nada é baixado
  no boot; o primeiro clique no header injeta o markup `[vw]`, baixa o script e
  instancia o widget.
- **O uso fica lembrado** (`localStorage: tonante-vlibras`). `restaurarVLibras`,
  chamada em `RootLayout` dentro de `requestIdleCallback`, remonta o widget nas
  visitas seguintes. Sem isso o botão flutuante sumia a cada F5 e quem depende
  de Libras tinha que pedir de novo a cada página — o custo de performance caía
  justamente sobre quem mais precisa do recurso.
- **O botão de abrir mora num shadow root.** Da v7 em diante o plugin cria
  `#vlibras-access-wrapper` com shadow próprio; `querySelector` comum não
  alcança e o plugin não expõe API de abrir. Daí a descida explícita até
  `#vlibras-button`, com fallback para o `[vw-access-button]` legado.
- **Alinhamento com o WhatsApp.** Os dois flutuam na borda direita com tamanhos
  diferentes (40px e 56px), então igualar a margem desalinha os centros. Os
  centros é que foram igualados, a ~43px da borda: o FAB do WhatsApp foi para
  `right-3 md:right-4` e o VLibras recebeu `right: 19px / 23px` via `<style>`
  injetado dentro do shadow root.

Dependência externa aceita conscientemente: se o CDN do governo cair, a
restauração falha em silêncio e o ícone do header segue tentando. A loja não
quebra.
