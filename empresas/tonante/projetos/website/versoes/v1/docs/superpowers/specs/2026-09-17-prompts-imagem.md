# Prompts de imagem — Monte seu kit

2026-09-17. Acompanha `2026-09-17-monte-seu-kit-design.md`.

Cada prompt diz onde o arquivo vai. Mapa das pastas em
`public/LEIA-ME-imagens-kit.md`. Formato: **PNG**.

## Regras que valem para todos

Cole este bloco no fim de qualquer prompt da lista:

> Single soft key light from upper left, long gentle shadow falling right. Seamless
> continuous backdrop, no props, no set dressing, no horizon line. Generous negative
> space, subject smaller in frame than feels natural. Warm desaturated palette, deep
> warm black #111111, off-white #FAF8F5; amber #C87800 appears only as light or as a
> highlight on wood, never as a flat background. Shot on medium format, 85mm, f/4,
> everything tack sharp. No text, no logo, no watermark, no people unless stated.

Nunca pedir: cenário de quarto/loja, instrumento em uso por pessoa (salvo cenas),
grão pesado, lens flare, tipografia dentro da imagem.

---

## 1 · Cards da tela de entrada (3) — prioridade alta

Retrato 4:5, o objeto na metade de baixo, topo respirando.

**a) Me ajuda a escolher** → `public/monte-seu-kit/ajuda.png`
> Three acoustic guitars of different body sizes standing upright in a row on a
> seamless warm off-white backdrop, receding slightly in depth so the nearest is
> sharp and the farthest softens. Natural spruce, mahogany and zebrawood tops.

**b) Quero montar meu kit** → `public/monte-seu-kit/montar.png`
> An acoustic guitar disassembled into its parts, laid flat and evenly spaced on a
> seamless warm off-white surface, shot straight from above: body, neck, tuners,
> bridge pins, a coiled set of strings, a strap. Museum specimen layout, wide even
> gaps between pieces.

**c) Já tá pronto, quero levar** → `public/monte-seu-kit/pronto.png`
> An electric guitar, a small amplifier and a coiled cable arranged as a tight
> still-life group on a seamless warm off-white backdrop, the three objects
> touching but not overlapping, lit as one single sculptural mass.

---

## 2 · Categoria: teclado e sopro (2) — prioridade alta

Casar com o que já existe em `public/categorias/` (bateria, viola, ukulele,
microfone). Quadrado, objeto recortável, fundo liso e claro.

**a) Teclado** → `public/categorias/teclado.png`
> A 61-key digital stage piano seen from a low three-quarter angle on a seamless
> warm off-white backdrop, matte black chassis, white keys catching a warm
> highlight along their front edge.

**b) Sopro** → `public/categorias/sopro.png`
> A brass tenor saxophone standing upright on a seamless warm off-white backdrop,
> three-quarter view, lacquered brass warming from gold to deep amber where the
> light falls, pearl key inlays crisp.

---

## 3 · Hero dos kits (8, em duas proporções) — prioridade alta

Oito kits — a grade 3×3 tem um buraco de propósito, ver o spec. Gerar cada um em **retrato 3:4** (card da
listagem) e **panorâmico 16:9** (topo da PDP). Mesmo enquadramento, mesma luz,
mesmo fundo nos oito — é um conjunto, precisa parecer um conjunto.

Destino: `public/kits/tall/{chave}.png` e `public/kits/wide/{chave}.png`.

Molde:

> [PEÇAS DO KIT] arranged as a single still-life group on a seamless warm
> off-white backdrop, objects overlapping slightly into one sculptural silhouette,
> composed as a family portrait of gear.

Peças por kit:

| kit | chave (= nome do arquivo) | PEÇAS DO KIT |
|---|---|---|
| Primeiro Acorde | `primeiro-acorde` | a nylon-string classical guitar, a clip-on tuner, a fabric strap, a small pack of picks |
| Primeiro Palco | `primeiro-palco` | a steel-string acoustic guitar with a pickup, a coiled instrument cable, a strap, a tuner |
| Louvor | `louvor` | a nylon-string acoustic-electric guitar, a folding guitar stand, a coiled cable |
| Ministério | `ministerio` | a steel-string acoustic-electric guitar, a compact acoustic amplifier, a cable, a strap |
| Culto Cheio | `culto-cheio` | a steel-string acoustic-electric guitar, a condenser microphone on a short stand, an amplifier, two coiled cables |
| Ensaio | `ensaio` | an electric guitar, a small practice amplifier, a cable, a strap |
| Bar | `bar` | an electric guitar, a mid-size combo amplifier, two coiled cables, a folding stand |
| Palco | `palco` | an electric guitar, a large stack amplifier, a pedal, three coiled cables, a strap |

---

## 4 · "Pra quem é" (8) — prioridade média

Quadrado 1:1, full-bleed, **sem espaço negativo** — este é o único bloco que
preenche o quadro inteiro. Detalhe macro, não o instrumento todo.

Destino: `public/kits/quem/{chave}.png`, mesma chave do grupo 3.

> Extreme close-up macro of [DETALHE], filling the entire frame edge to edge,
> shallow depth of field, warm single-source light raking across the surface.

| kit | chave | DETALHE |
|---|---|---|
| Primeiro Acorde | `primeiro-acorde` | a beginner's fingers pressing a first chord on nylon strings |
| Primeiro Palco | `primeiro-palco` | a pick striking steel strings above a soundhole rosette |
| Louvor | `louvor` | light falling across the cedar top of a classical guitar |
| Ministério | `ministerio` | the control panel of an acoustic guitar preamp, EQ sliders lit |
| Culto Cheio | `culto-cheio` | a condenser microphone grille, warm light through the mesh |
| Ensaio | `ensaio` | the tone and volume knobs of an electric guitar, chrome and amber |
| Bar | `bar` | the worn leather corner of an amplifier cabinet |
| Palco | `palco` | a hand on a whammy bar, strings blurred in motion |

---

## 5 · Cenas de uso (3, compartilhadas) — prioridade média

Panorâmico 2:1. **Única exceção à regra "sem pessoas" e "sem cenário"** — estas
são cenas. Ainda assim: uma fonte de luz, paleta quente e dessaturada, muito ar.

**a) No quarto** → `public/cenas/quarto.png`
> A person sitting on the edge of a bed playing an acoustic guitar, seen from
> across a quiet room, late afternoon light from a single window, the figure small
> in a wide frame, most of the image empty wall.

**b) Na igreja** → `public/cenas/igreja.png`
> A guitarist standing to the side of a simple church platform, seen from the back
> of the empty room, warm light from high windows, wide frame, the figure small.

**c) No palco** → `public/cenas/palco.png`
> A guitarist on a small club stage seen from the back of the room, single warm
> spotlight, everything else falling into deep warm black, the figure small in a
> wide frame.

---

## Ordem sugerida de geração

Os grupos 1 e 2 destravam a tela de entrada. O 3 destrava a listagem e o topo da
PDP. O 4 e o 5 são o miolo da PDP e podem esperar — até lá a tela roda com
placeholder cinza.

Capa de álbum não entra aqui: vem da Wikipedia.
