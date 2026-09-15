#!/usr/bin/env python3
"""classifica-papel — que PAPEL cada foto de produto cumpre na PDP.

Irmão do classifica-fundo.py. Aquele responde "tem fundo branco?"; este
responde "essa foto serve pra quê?". A descrição da PDP precisa saber a
diferença entre o plano aberto do instrumento inteiro (bom pra grade de
ângulos, ruim pra bloco editorial) e o macro do cavalete (o contrário).

Papéis:
  angulo   — instrumento inteiro flutuando em fundo liso. É a maioria.
  detalhe  — macro que preenche o quadro: boca, cavalete, EQ, junta, knobs.
  cena     — foto ambientada do fotógrafo (sofá, parede, palco, mão tocando).
  faixa    — panorâmica (banner do site institucional, 1200x328).
  tira     — retrato estreitíssimo (240x1167), o perfil lateral recortado.

Como decide:
  1. proporção resolve faixa e tira;
  2. nome de arquivo resolve cena — a sessão ambientada do site vem com nome
     descritivo (`-top-`, `-espec-`, `-lateral-`, `-central-`, `-estrada-`),
     enquanto a de estúdio é só numerada (`111635_8.webp`);
  3. o resto sai da COBERTURA: mede-se a cor média do anel de borda e conta-se
     quanto da foto se afasta dela. Instrumento inteiro em fundo liso cobre
     10–35% do quadro; macro cobre 97%+. Guitarra branca em fundo branco
     engana a cobertura (o corpo tem a cor do fundo), então vale também a
     caixa do conteúdo: se ela encosta nas quatro bordas, é macro.

Uso: python3 scripts/classifica-papel.py   (regenera photoRoles.ts)
"""
import os
import re
import sys

import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTOS = os.path.join(RAIZ, "public", "produtos", "oficial")
SAIDA = os.path.join(RAIZ, "src", "app", "components", "photoRoles.ts")

# nome descritivo = sessão ambientada; numerado = estúdio
NOME_DE_CENA = re.compile(r"-(top|espec|lateral|central|combinacao|estrada)[-_]", re.I)


def medir(caminho: str):
    im = Image.open(caminho)
    W, H = im.size
    im = im.convert("RGB")
    im.thumbnail((220, 220))
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape
    m = max(2, int(round(min(h, w) * 0.03)))
    anel = np.concatenate([
        a[:m].reshape(-1, 3), a[-m:].reshape(-1, 3),
        a[:, :m].reshape(-1, 3), a[:, -m:].reshape(-1, 3),
    ])
    mascara = np.linalg.norm(a - anel.mean(0), axis=2) > 30
    cobertura = float(mascara.mean())
    ys, xs = np.nonzero(mascara)
    if len(xs):
        caixa_w = (xs.max() - xs.min() + 1) / w
        caixa_h = (ys.max() - ys.min() + 1) / h
    else:
        caixa_w = caixa_h = 0.0
    return W, H, cobertura, float(caixa_w), float(caixa_h)


def papel(nome: str, W: int, H: int, cobertura: float, caixa_w: float, caixa_h: float) -> str:
    asp = W / H
    if asp >= 1.7:
        return "faixa"
    if asp <= 0.62:
        return "tira"
    if NOME_DE_CENA.search(nome) or re.search(r"-(violao|ukulele|guitarra)-", nome, re.I):
        return "cena"
    # macro preenche o quadro: ou cobre quase tudo, ou o conteúdo encosta nas
    # quatro bordas. O segundo teste existe por causa da guitarra branca em
    # fundo branco, que "cobre" pouco porque tem a cor do fundo.
    if cobertura >= 0.70 or (caixa_w >= 0.92 and caixa_h >= 0.92):
        return "detalhe"
    return "angulo"


def main() -> int:
    if not os.path.isdir(FOTOS):
        print(f"não achei {FOTOS}", file=sys.stderr)
        return 1

    papeis: dict[str, str] = {}
    for pasta in sorted(os.listdir(FOTOS)):
        pp = os.path.join(FOTOS, pasta)
        if not os.path.isdir(pp):
            continue
        for arq in sorted(os.listdir(pp)):
            try:
                W, H, cob, cw, ch = medir(os.path.join(pp, arq))
            except Exception as erro:  # arquivo quebrado não derruba a varredura
                print(f"pulei {pasta}/{arq}: {erro}", file=sys.stderr)
                continue
            papeis[f"/produtos/oficial/{pasta}/{arq}"] = papel(arq, W, H, cob, cw, ch)

    conta = {p: sum(1 for v in papeis.values() if v == p) for p in
             ("angulo", "detalhe", "cena", "faixa", "tira")}
    linhas = [f'  "{k}": "{v}",' for k, v in sorted(papeis.items())]
    cabecalho = f'''/* photoRoles — que PAPEL cada foto oficial cumpre na descrição da PDP.
 *
 * GERADO por scripts/classifica-papel.py — não editar à mão.
 *
 * angulo   instrumento inteiro em fundo liso (grade "de todos os ângulos")
 * detalhe  macro que preenche o quadro: boca, cavalete, EQ, junta, knobs
 * cena     foto ambientada da sessão do site (sofá, parede, palco, mão tocando)
 * faixa    panorâmica 1200x328 — vira faixa de largura total
 * tira     retrato estreitíssimo 240x1167 — perfil lateral, não vira bloco
 *
 * {len(papeis)} fotos: {conta["angulo"]} ângulos, {conta["detalhe"]} detalhes,
 * {conta["cena"]} cenas, {conta["faixa"]} faixas, {conta["tira"]} tiras.
 *
 * Só cobre as fotos LOCAIS (public/produtos/oficial). Foto do CDN do Magento
 * não é medida aqui — o produto que só tem ela cai no fallback do productStory.
 */

export type PapelDeFoto = "angulo" | "detalhe" | "cena" | "faixa" | "tira";

const PAPEIS: Record<string, PapelDeFoto> = {{
'''
    rodape = '''};

/** Papel da foto. Foto não medida (CDN do Magento) responde "angulo". */
export function getPapelDaFoto(src?: string): PapelDeFoto {
  if (!src) return "angulo";
  return PAPEIS[src] ?? "angulo";
}
'''
    with open(SAIDA, "w") as fh:
        fh.write(cabecalho + "\n".join(linhas) + "\n" + rodape)
    print(f"{len(papeis)} fotos → {SAIDA}")
    print(conta)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
