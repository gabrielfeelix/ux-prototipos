# Onde salvar as imagens do Monte seu kit

Prompts: `docs/superpowers/specs/2026-09-17-prompts-imagem.md`.
Cada prompt de lá diz o caminho exato do arquivo. Esta é a visão de cima.

Formato: **PNG**, igual ao resto de `categorias/` e `setups/`. Sem otimizar na
mão — o `scripts/` do projeto converte para webp quando for a hora.

As oito chaves de kit, usadas como nome de arquivo em todas as pastas:

`primeiro-acorde` · `primeiro-palco` · `louvor` · `ministerio` · `culto-cheio`
`ensaio` · `bar` · `palco`

| pasta | o que vai | quantos | proporção |
|---|---|---|---|
| `monte-seu-kit/` | os 3 cards da tela de entrada | 3 | 4:5 retrato |
| `categorias/` | teclado e sopro (a pasta já existe e já tem as outras) | 2 | 1:1 |
| `kits/tall/` | hero do kit no card da listagem | 8 | 3:4 retrato |
| `kits/wide/` | hero do kit no topo da PDP | 8 | 16:9 |
| `kits/quem/` | macro do bloco "pra quem é" | 8 | 1:1 full-bleed |
| `cenas/` | quarto, igreja, palco — compartilhadas por todos os kits | 3 | 2:1 |

`kits/` na raiz fica vazia de propósito: o v3 guarda o hero solto em
`setups/setup-{key}.webp` e as variantes em `tall/`/`wide/`, mas aqui as duas
variantes cobrem todo uso. Se aparecer um terceiro enquadramento, ele entra como
`kits/{key}.png`.

Enquanto o arquivo não existe, a tela mostra placeholder cinza e não quebra.

`setups/` é lixo herdado do PCYES (setup-apex, setup-strike…) e sai quando os
kits entrarem.
