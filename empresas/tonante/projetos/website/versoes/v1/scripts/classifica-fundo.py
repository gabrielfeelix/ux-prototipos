#!/usr/bin/env python3
"""Classifica cada foto de produto em 'estúdio' (fundo branco) ou 'ambientada'.

Por que offline: o CDN da Oderço não manda CORS, então ler pixel no browser é
impossível — o mesmo motivo que fez instrumentFraming virar tabela. As fotos
oficiais são locais (public/produtos/oficial/), mas o resultado precisa valer
pros dois casos, então a tabela cobre tudo.

Critério: amostra o anel externo da foto (moldura de 4% de cada lado). Se quase
todo o anel for branco, a foto é recorte de estúdio e o card deve mostrá-la
inteira sobre o próprio fundo (object-contain + multiply). Se não for, é foto
ambientada e o quadro tem que ser preenchido (object-cover), senão aparece o
corte da foto dentro do card.

Uso:  python3 scripts/classifica-fundo.py          # só as fotos locais
      python3 scripts/classifica-fundo.py --cdn    # baixa também as do Magento

Escreve src/app/components/photoBackdrop.ts.
"""
import json
import os
import re
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
OFICIAL = RAIZ / "public/produtos/oficial"
SAIDA = RAIZ / "src/app/components/photoBackdrop.ts"

# branco de estúdio nunca é puro em JPEG/WebP: 242 absorve o ruído da compressão
LIMIAR_BRANCO = 242
# fração do anel que precisa ser branca pra foto contar como recorte
FRACAO_MINIMA = 0.90
# espessura do anel externo, em fração do lado
MOLDURA = 0.04
# segundo anel, mais pra dentro: pega o recorte que tem moldura desenhada na
# arte (anel externo colorido, mas fundo branco logo atrás) sem confundir com
# foto deitada colada num quadrado — nessa, o conteúdo continua nas laterais.
ANEL_INTERNO = (0.08, 0.12)


# fora desta faixa a foto não cabe num quadro quase quadrado sem virar tira:
# `cover` aumenta tanto que só sobra um pedaço borrado (ver LARGA_DEMAIS no TS)
PROPORCAO_OK = (0.62, 1.6)


def rgb_sobre_branco(im):
    """RGB com o transparente virando BRANCO.

    `convert("RGB")` puro pinta o alfa de PRETO: todo PNG recortado (fundo
    transparente) era lido como foto ambientada e o card passava a preencher o
    quadro por corte — foi assim que a guitarra do 70 Aniversário apareceu
    cortada na home."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        fundo = Image.new("RGB", im.size, (255, 255, 255))
        rgba = im.convert("RGBA")
        fundo.paste(rgba, mask=rgba.split()[-1])
        return fundo
    return im.convert("RGB")


def proporcao(im) -> float:
    w, h = im.size
    return w / h if h else 1.0


def eh_estudio(caminho_ou_img) -> bool:
    im = caminho_ou_img
    if not isinstance(im, Image.Image):
        im = Image.open(im)
    im = rgb_sobre_branco(im)
    # 200px de lado basta pro anel e corta o custo de decodificar 1200x1200
    im.thumbnail((200, 200))
    w, h = im.size
    mx = max(2, int(w * MOLDURA))
    my = max(2, int(h * MOLDURA))
    px = im.load()
    def fracao_branca(ax, ay, bx, by):
        """Fração branca do anel entre o retângulo (ax,ay,bx,by) e o de dentro."""
        brancos = total = 0
        for y in range(ay, by):
            na_borda_v = y < ay + my or y >= by - my
            for x in range(ax, bx):
                if not (na_borda_v or x < ax + mx or x >= bx - mx):
                    continue
                r, g, b = px[x, y]
                total += 1
                if min(r, g, b) >= LIMIAR_BRANCO:
                    brancos += 1
        return brancos / total if total else 0.0

    if fracao_branca(0, 0, w, h) >= FRACAO_MINIMA:
        return True
    ix, iy = int(w * ANEL_INTERNO[0]), int(h * ANEL_INTERNO[0])
    return fracao_branca(ix, iy, w - ix, h - iy) >= FRACAO_MINIMA


def fotos_locais():
    for pasta in sorted(OFICIAL.iterdir()):
        if pasta.is_dir():
            for f in sorted(pasta.iterdir()):
                if f.suffix.lower() in (".webp", ".jpg", ".jpeg", ".png"):
                    yield "/produtos/oficial/%s/%s" % (pasta.name, f.name), f


def urls_do_catalogo():
    """Toda foto remota citada nos dados — o catálogo usa dois hosts
    (www.oderco.com.br/media/... do Magento e cdn.oderco.com.br/produtos/...)."""
    urls = set()
    for arquivo in ("productsData.ts", "productsExtra.ts", "productsSiteOficial.ts"):
        dados = (RAIZ / "src/app/components" / arquivo).read_text()
        urls |= set(re.findall(r'"(https://[^"]+\.(?:jpe?g|png|webp))"', dados, re.I))
    return sorted(urls)


def main():
    ambientadas = []
    desproporcionais = []
    total = 0
    for chave, caminho in fotos_locais():
        total += 1
        img = Image.open(caminho)
        r = proporcao(img)
        if not eh_estudio(img):
            ambientadas.append(chave)
            if not (PROPORCAO_OK[0] <= r <= PROPORCAO_OK[1]):
                desproporcionais.append(chave)

    if "--cdn" in sys.argv:
        import urllib.request
        import io

        for url in urls_do_catalogo():
            total += 1
            # o cdn.oderco devolve 403 pro User-Agent padrão do urllib
            pedido = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urllib.request.urlopen(pedido, timeout=20) as r:
                    img = Image.open(io.BytesIO(r.read()))
            except Exception as e:  # rede falhou: melhor não classificar do que errar
                print("  ! %s (%s)" % (url.split("/")[-1], e), file=sys.stderr)
                continue
            r = proporcao(img)
            if not eh_estudio(img):
                ambientadas.append(url)
                if not (PROPORCAO_OK[0] <= r <= PROPORCAO_OK[1]):
                    desproporcionais.append(url)

    corpo = ",\n".join('  "%s"' % a for a in sorted(ambientadas))
    corpo_desp = ",\n".join('  "%s"' % a for a in sorted(desproporcionais))
    SAIDA.write_text(
        '/* photoBackdrop — quais fotos de produto são AMBIENTADAS.\n'
        ' *\n'
        ' * Gerado por scripts/classifica-fundo.py (medido offline: o CDN não manda\n'
        ' * CORS, então não dá pra olhar pixel no browser). Regerar quando entrar\n'
        ' * foto nova no catálogo.\n'
        ' *\n'
        ' * A regra que isto serve: foto de fundo branco é recorte — aparece inteira\n'
        ' * sobre o fundo do card (object-contain + multiply). Foto ambientada tem\n'
        ' * cenário e precisa PREENCHER o quadro (object-cover), senão o card mostra\n'
        ' * o corte da foto dentro dele.\n'
        ' *\n'
        ' * %d de %d fotos são ambientadas — por isso a lista guarda a minoria.\n'
        ' */\n'
        'const AMBIENTADAS = new Set<string>([\n%s,\n]);\n\n'
        '/* Ambientadas que também são muito estreitas ou muito deitadas: num\n'
        ' * quadro quase quadrado o `cover` amplia tanto que a foto vira uma tira\n'
        ' * borrada. Essas preenchem com a própria foto desfocada atrás e aparecem\n'
        ' * inteiras por cima — %d delas. */\n'
        'const DESPROPORCIONAIS = new Set<string>([\n%s,\n]);\n\n'
        '/** true quando a foto tem cenário e o quadro deve ser preenchido. */\n'
        'export function isFotoAmbientada(src?: string): boolean {\n'
        '  if (!src) return false;\n'
        '  return AMBIENTADAS.has(src);\n'
        '}\n\n'
        '/** true quando preencher por corte destruiria a foto (ver acima). */\n'
        'export function isFotoDesproporcional(src?: string): boolean {\n'
        '  if (!src) return false;\n'
        '  return DESPROPORCIONAIS.has(src);\n'
        '}\n' % (len(ambientadas), total, corpo, len(desproporcionais), corpo_desp)
    )
    print("%d ambientadas de %d fotos -> %s" % (len(ambientadas), total, SAIDA.relative_to(RAIZ)))


if __name__ == "__main__":
    main()
