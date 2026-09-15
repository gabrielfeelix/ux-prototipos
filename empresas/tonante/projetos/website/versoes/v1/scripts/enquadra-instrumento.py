#!/usr/bin/env python3
"""Mede o enquadramento de cada instrumento e escreve instrumentFraming.ts.

Por que offline: o CDN da Oderço não manda CORS, então ler pixel no browser é
impossível — mesmo motivo de classifica-fundo.py. A tabela guarda, por produto,
o zoom e o deslocamento vertical que o card aplica na foto.

Como o card usa os números (ver v2/ProductCardV2.tsx):

    caixa quadrada de lado S, <img object-contain origin-bottom>
    transform: translateY(dy%) scale(zoom)

Numa foto retrato a imagem ocupa S de altura e S*r de largura (r = w/h). Se o
instrumento ocupa a fatia [x0,x1] da largura da foto, ele aparece com
S*r*(x1-x0) de largura; o zoom leva isso ao alvo de 58% da largura do card:

    zoom = min(ALVO_LARGURA / (r * (x1 - x0)), ALTURA_MAX / altura)

A escala é ancorada no rodapé, então a base do instrumento fica a
(1-y1)*zoom do fundo da caixa, e o translate desce o que sobra até a folga:

    dy = ((1 - y1) * zoom - FOLGA_BASE) * 100

Quem não é medido cai em FRAMING_PADRAO — foto oficial já vem bem enquadrada,
o problema é a foto de catálogo antigo, que deixa o instrumento pequeno no meio
do branco (era o caso do cavaco, que aparecia em miniatura ao lado do violão).

Uso:  python3 scripts/enquadra-instrumento.py           # só quem falta
      python3 scripts/enquadra-instrumento.py --tudo    # remede o catálogo

Escreve src/app/v2/instrumentFraming.ts.
"""
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "src/app/v2/instrumentFraming.ts"
CACHE = Path(tempfile.gettempdir()) / "tonante-fotos"

# branco de estúdio nunca é puro em JPEG/WebP: 242 absorve o ruído da compressão
LIMIAR_BRANCO = 242
# largura que o instrumento deve ocupar no card, em fração do lado
ALVO_LARGURA = 0.58
# folga entre a base do instrumento e o rodapé da caixa
FOLGA_BASE = 0.05
# Teto de ALTURA: o alvo de largura sozinho estoura em foto de instrumento
# deitado na diagonal (a do 70 Aniversário), onde a caixa do conteúdo é estreita
# e altíssima — o zoom pra largura ampliava tanto que sobrava só o corpo. Altura
# final, em caixas: 1.0 = instrumento inteiro; acima disso o braço sai por cima.
ALTURA_MAX = 1.35
# limites de sanidade: zoom demais borra a foto, dy demais joga o corpo pra fora
ZOOM = (1.0, 2.6)
DY = (-5.0, 20.0)

# o card só aplica a tabela em foto de estúdio em pé (ver zoomNoCorpo)
PROPORCAO_MAX = 1.2

# O card não mostra necessariamente a foto principal: ele mede as candidatas e
# exibe a de maior resolução que couber na caixa (ver ProductCardV2). Medir só a
# principal fazia a guitarra do 70 Aniversário receber o zoom de OUTRA foto e
# sair cortada. Por isso a tabela é POR FOTO, na mesma lista e na mesma ordem
# que o card usa.
PROBE = """
import { catalogo, tipoDoProduto } from "%s/src/app/v2/curadoria";
import { getProductImagesRanked, upgradeProductImage } from "%s/src/app/components/productPresentation";
const lista = catalogo
  .filter((p) => tipoDoProduto(p) === "instrumento")
  .map((p) => ({
    id: p.id,
    fotos: [...new Set(getProductImagesRanked(p).map(upgradeProductImage))].slice(0, 4),
  }));
console.log(JSON.stringify(lista));
"""


def instrumentos():
    """Lista [{id, fotos}] — sai da própria curadoria, pra tabela e site
    concordarem sobre o que é instrumento."""
    with tempfile.TemporaryDirectory() as tmp:
        entrada = Path(tmp) / "probe.ts"
        saida = Path(tmp) / "probe.cjs"
        entrada.write_text(PROBE % (RAIZ, RAIZ))
        subprocess.run(
            ["npx", "esbuild", str(entrada), "--bundle", "--platform=node",
             "--format=cjs", f"--outfile={saida}", "--log-level=error"],
            cwd=RAIZ, check=True,
        )
        return json.loads(subprocess.run(["node", str(saida)], capture_output=True, check=True).stdout)


def abre(img: str):
    if img.startswith("/"):
        caminho = RAIZ / "public" / img.lstrip("/")
        return Image.open(caminho) if caminho.exists() else None
    CACHE.mkdir(parents=True, exist_ok=True)
    destino = CACHE / re.sub(r"[^a-zA-Z0-9.]+", "_", img)[-120:]
    if not destino.exists():
        pedido = urllib.request.Request(img, headers={"User-Agent": "Mozilla/5.0"})
        try:
            destino.write_bytes(urllib.request.urlopen(pedido, timeout=30).read())
        except Exception as erro:  # foto fora do ar não trava a medição do resto
            print(f"  ! {img}: {erro}", file=sys.stderr)
            return None
    try:
        return Image.open(destino)
    except Exception:
        return None


def rgb_sobre_branco(im):
    """RGB com o transparente virando BRANCO — `convert("RGB")` puro pinta o
    alfa de preto e a caixa do instrumento vira a foto inteira (zoom 1.00)."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        fundo = Image.new("RGB", im.size, (255, 255, 255))
        rgba = im.convert("RGBA")
        fundo.paste(rgba, mask=rgba.split()[-1])
        return fundo
    return im.convert("RGB")


def caixa(im):
    """Retângulo do que não é fundo branco, em fração da foto."""
    im = rgb_sobre_branco(im)
    im.thumbnail((400, 400))
    w, h = im.size
    px = im.load()
    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if min(r, g, b) < LIMIAR_BRANCO:
                x0, y0 = min(x0, x), min(y0, y)
                x1, y1 = max(x1, x), max(y1, y)
    if x1 <= x0 or y1 <= y0:
        return None
    return x0 / w, y0 / h, (x1 + 1) / w, (y1 + 1) / h


def mede(im):
    w, h = im.size
    r = w / h if h else 1.0
    if r > PROPORCAO_MAX:  # deitada: o card não aplica a tabela
        return None
    bbox = caixa(im)
    if not bbox:
        return None
    x0, y0, x1, y1 = bbox
    largura = r * (x1 - x0)
    # altura do conteúdo em caixas: foto em pé preenche a altura; foto deitada
    # encolhe na proporção r
    altura = (y1 - y0) if r <= 1 else (y1 - y0) * r
    por_largura = ALVO_LARGURA / largura if largura else 1.0
    por_altura = ALTURA_MAX / altura if altura else 1.0
    zoom = min(ZOOM[1], max(ZOOM[0], min(por_largura, por_altura)))
    dy = min(DY[1], max(DY[0], ((1 - y1) * zoom - FOLGA_BASE) * 100))
    return round(zoom, 2), round(dy, 1)


def tabelas_atuais():
    texto = SAIDA.read_text()
    por_id = {
        int(i): (float(z), float(d))
        for i, z, d in re.findall(r"^\s*(\d+): \[([\d.]+), (-?[\d.]+)\],", texto, re.M)
    }
    por_foto = {
        src: (float(z), float(d))
        for src, z, d in re.findall(r'^\s*"([^"]+)": \[([\d.]+), (-?[\d.]+)\],', texto, re.M)
    }
    return por_id, por_foto


def escreve(por_id, por_foto, cabecalho):
    linhas_id = "\n".join(f"  {i}: [{z:.2f}, {d:.1f}]," for i, (z, d) in sorted(por_id.items()))
    linhas_foto = "\n".join(f'  "{s}": [{z:.2f}, {d:.1f}],' for s, (z, d) in sorted(por_foto.items()))
    SAIDA.write_text(
        f"{cabecalho}"
        "/** Enquadramento da foto que está na tela — o card troca de foto (miniatura,\n"
        " *  variante, galeria oficial) e cada uma tem margem branca própria. */\n"
        "export const FRAMING_POR_FOTO: Record<string, [zoom: number, dy: number]> = {\n"
        f"{linhas_foto}\n}};\n\n"
        "/** Reserva por produto, pra foto que ainda não foi medida. */\n"
        "export const INSTRUMENT_FRAMING: Record<number, [zoom: number, dy: number]> = {\n"
        f"{linhas_id}\n}};\n\n/** Instrumento sem medida cai no padrão. */\n"
        "export const FRAMING_PADRAO: [number, number] = [1.55, 0];\n"
    )


def main():
    tudo = "--tudo" in sys.argv
    por_id, por_foto = tabelas_atuais()
    cabecalho = SAIDA.read_text().split("/** Enquadramento da foto")[0].split("export const INSTRUMENT_FRAMING")[0]
    novos = 0
    for item in instrumentos():
        for i, foto in enumerate(item["fotos"]):
            if not tudo and foto in por_foto:
                continue
            im = abre(foto)
            if im is None:
                continue
            medida = mede(im)
            if medida is None:
                continue
            por_foto[foto] = medida
            if i == 0 and (tudo or item["id"] not in por_id):
                por_id[item["id"]] = medida
            novos += 1
        print(f"  {item['id']}: {len(item['fotos'])} foto(s)")
    escreve(por_id, por_foto, cabecalho)
    print(f"{novos} fotos medidas · {len(por_foto)} na tabela por foto · {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
