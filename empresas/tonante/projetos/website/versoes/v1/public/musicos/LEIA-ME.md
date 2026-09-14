# Vídeos e fotos dos Músicos Tonante

Arquivos desta pasta são servidos pela raiz do site: `public/musicos/rafael-monteiro.mp4`
vira `/musicos/rafael-monteiro.mp4`.

## Convenção

Um par por músico, nomeado pelo `id` dele em `src/app/components/musiciansData.ts`:

| arquivo | o que é |
|---|---|
| `<id>.mp4` | o reel, vertical **9:16** |
| `<id>.jpg` | o poster — primeiro frame, mesmo enquadramento |

Exemplo para `id: "rafael-monteiro"`:

```
public/musicos/rafael-monteiro.mp4
public/musicos/rafael-monteiro.jpg
```

Depois de colocar o par, troque no `musiciansData.ts`:

```ts
photo: "/musicos/rafael-monteiro.jpg",
video: "/musicos/rafael-monteiro.mp4",
```

## O que o vídeo precisa ter

- **H.264 (avc1) + AAC, container .mp4.** É o único codec que toca em todo
  navegador. Nada de HEVC, AV1 ou .mov.
- **Vertical 9:16**, 1080×1920. O card é 4:5 e corta topo e base — enquadre o
  músico no **tronco e nas mãos**, não no corpo inteiro.
- **Loop limpo**: o último frame tem que casar com o primeiro, senão o corte
  aparece a cada volta. Entre 6 e 12 segundos.
- **Com áudio.** O card entra mudo e o visitante liga no ícone de som, então o
  áudio precisa existir na faixa.
- **Peso**: mire abaixo de 3 MB por vídeo. São cinco tocando na home.

Receita de conversão que atende tudo isso:

```bash
ffmpeg -i entrada.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -movflags +faststart \
  -c:a aac -b:a 128k saida.mp4

# poster: primeiro frame
ffmpeg -i saida.mp4 -frames:v 1 -q:v 2 saida.jpg
```

`-movflags +faststart` não é opcional: sem ele o navegador baixa o arquivo
inteiro antes de começar a tocar, e o hover fica com meio segundo de atraso.
