#!/usr/bin/env python3
"""Descobre quais produtos são variantes de cor uns dos outros.

O seletor de cor da PDP dependia de COLOR_RULES, uma lista herdada do protótipo
de origem com dez cores genéricas ("preto", "azul", "vermelho"). O catálogo
Tonante não fala assim: as cores são Deep Dark, Yellow Cake, Merlot, Sunset,
Blue Wood, Coffee Sparkle. Nenhuma batia, então quase nenhum produto mostrava
variante — Jazzmine Yellow Cake e Jazzmine Deep Dark apareciam como dois
produtos sem relação.

Como a família é encontrada: o nome de catálogo é uma lista de atributos
separados por " - ". Dois produtos são variantes quando todos os segmentos
batem menos um, e esse um não é estrutural (4/5 cordas, 40"/41", nº de bandas)
nem o código do modelo no fim. O segmento que sobra é o nome da cor.

Por que a cor é medida na foto: "Merlot" e "Yellow Cake" não têm hex. O script
abre a foto de estúdio do produto, descarta o fundo branco e tira a mediana do
corpo. Isso também serve de prova: se duas "variantes" têm a mesma cor medida,
não é variação de cor (Suporte Tubular x Tipo Cavalete) e a família é
descartada.

Uso:  python3 scripts/variantes.py
Escreve src/app/components/productVariants.ts.
"""
import collections
import io
import json
import os
import re
import statistics
import unicodedata
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
COMP = RAIZ / "src/app/components"
SAIDA = COMP / "productVariants.ts"
UA = {"User-Agent": "Mozilla/5.0"}

CODIGO = re.compile(r"^[A-Z0-9][A-Z0-9\-/\.]{4,}$")
ESTRUTURAL = re.compile(r"\d|cordas|bandas|tampo|eq |mm|polegada|modelo|acabamento|fosco|gloss|brilhante", re.I)
# separador de atributos: o dump escreve "Jazzmine- Deep Dark- 5 Cordas" tanto
# quanto "Jazzmine - Deep Dark - 5 Cordas". Exige espaço de um lado só, para não
# partir palavra hifenizada ("Azul-escura", "eletro-acústico").
SEPARADOR = re.compile(r"\s+[-–]\s*|\s*[-–]\s+")
# variação de formato não é variação de cor
FORMATO = re.compile(r"tubular|cavalete|parede|dobr|tripe|tripé|girafa|slatwall|trava|portat|portát|mesa|chao|chão", re.I)
NOME_DE_PRODUTO = re.compile(
    r"violao|violão|guitarra|contrabaixo|baixo|suporte|microfone|encordoamento|capotraste|"
    r"cavaco|pedestal|estante|bateria|ukulele|viola|palheta|correia|afinador|cabo|bag|capa|banqueta", re.I)
# distância mínima no RGB para duas variantes contarem como cores diferentes
DISTANCIA_MINIMA = 14


def sem_acento(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn")


def chave(texto):
    """Grafia varia no dump: 'Jazzmine-', 'EM Spruce' e 'em Spruce' são o mesmo."""
    return re.sub(r"[^a-z0-9]+", " ", sem_acento(texto).lower()).strip()


def galerias_oficiais():
    """{sku: [fotos]} — a sessão de estúdio, que o produto novo não lista inteira."""
    src = (COMP / "productGalleries.ts").read_text()
    out = {}
    for bloco in re.finditer(r'"([^"]+)": \[(.*?)\n  \]', src, re.S):
        out[bloco.group(1)] = re.findall(r'"([^"]+)"', bloco.group(2))
    return out


def ambientadas():
    """Fotos com cenário — medir cor nelas mede o cenário (ver photoBackdrop.ts)."""
    return set(re.findall(r'"([^"]+)"', (COMP / "photoBackdrop.ts").read_text()))


def catalogo():
    produtos = []
    for arquivo in ("productsData.ts", "productsExtra.ts", "productsSiteOficial.ts"):
        src = (COMP / arquivo).read_text()
        for m in re.finditer(r'"sku": "([^"]+)"|sku: "([^"]+)"', src):
            sku = m.group(1) or m.group(2)
            ini = max(src.rfind('{\n    "id"', 0, m.start()), src.rfind("  {\n", 0, m.start()))
            bloco = src[ini:src.find("\n  },", m.start())]
            def campo(nome):
                achou = (re.search(r'"%s": "((?:[^"\\]|\\.)*)"' % nome, bloco)
                         or re.search(r'%s: "((?:[^"\\]|\\.)*)"' % nome, bloco))
                return achou.group(1).replace('\\"', '"') if achou else ""
            imagens = re.findall(r'"((?:https?:)?/[^"]+?\.(?:jpe?g|png|webp))"', bloco, re.I)
            produtos.append({"sku": sku, "name": campo("name"), "category": campo("category"),
                             "images": imagens})
    return produtos


def segmentos(nome):
    partes = [p.strip() for p in SEPARADOR.split(nome) if p.strip()]
    if partes and CODIGO.match(partes[-1].replace(" ", "")):
        partes = partes[:-1]
    return partes


def familias(produtos):
    """{(categoria, prefixo): [(sku, rótulo da cor)]}"""
    candidatas = collections.defaultdict(list)
    for p in produtos:
        partes = segmentos(p["name"])
        for i, seg in enumerate(partes):
            if ESTRUTURAL.search(seg) or NOME_DE_PRODUTO.search(seg) or FORMATO.search(seg) or len(seg.split()) > 3:
                continue
            resto = partes[:i] + partes[i + 1:]
            if not resto or sum(len(x) for x in resto) < 8:
                continue
            candidatas[(chave(p["category"]), tuple(chave(x) for x in resto))].append((p["sku"], seg))
    # um produto pode servir a mais de um recorte; fica no maior
    escolhida = {}
    for k, v in sorted(candidatas.items(), key=lambda kv: -len(kv[1])):
        for sku, seg in v:
            escolhida.setdefault(sku, (k, seg))
    saida = collections.defaultdict(list)
    for sku, (k, seg) in escolhida.items():
        saida[k].append((sku, seg))
    return {k: v for k, v in saida.items() if len({chave(s) for _, s in v}) > 1}


def carrega(ref):
    if ref.startswith("/"):
        caminho = RAIZ / "public" / ref.lstrip("/")
        return Image.open(caminho) if caminho.exists() else None
    with urllib.request.urlopen(urllib.request.Request(ref, headers=UA), timeout=45) as r:
        return Image.open(io.BytesIO(r.read()))


def cor_do_corpo(produto, galeria, com_cenario):
    """Mediana do que não é fundo branco, na primeira foto de estúdio que abrir.

    A ordem importa: foto ambientada devolve a cor do cenário, não a do
    instrumento — foi o que fez o Coral 40 Sunset e o Blue Wood medirem igual.
    """
    fotos = [f for f in galeria.get(produto["sku"], []) + produto["images"] if f not in com_cenario]
    fotos += [f for f in produto["images"] if f in com_cenario]      # último recurso
    for ref in fotos[:5]:
        try:
            im = carrega(ref)
            if im is None:
                continue
            im = im.convert("RGB")
            im.thumbnail((160, 160))
            px = list(im.getdata())
            corpo = [p for p in px if min(p) < 232]
            if len(corpo) < 150:
                continue
            return tuple(int(statistics.median(c[i] for c in corpo)) for i in range(3))
        except Exception:
            continue
    return None


def main():
    produtos = catalogo()
    galeria, com_cenario = galerias_oficiais(), ambientadas()
    por_sku = {p["sku"]: p for p in produtos}
    grupos = familias(produtos)
    alvos = sorted({sku for v in grupos.values() for sku, _ in v})
    print(f"{len(grupos)} famílias candidatas, {len(alvos)} produtos — medindo cor nas fotos")

    with ThreadPoolExecutor(10) as pool:
        cores = dict(zip(alvos, pool.map(lambda s: cor_do_corpo(por_sku[s], galeria, com_cenario), alvos)))

    saida, descartadas = {}, []
    for (cat, prefixo), itens in grupos.items():
        medidas = [(sku, rotulo, cores.get(sku)) for sku, rotulo in itens if cores.get(sku)]
        if len(medidas) < 2:
            continue
        # sem contraste entre as fotos não é variação de cor, é de formato
        pares = [(a, b) for i, (_, _, a) in enumerate(medidas) for _, _, b in medidas[i + 1:]]
        if max((sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5 for a, b in pares), default=0) < DISTANCIA_MINIMA:
            descartadas.append((cat, " - ".join(prefixo), [r for _, r, _ in medidas]))
            continue
        familia = f"{cat}::{'-'.join(prefixo)}"
        vistos = set()
        for sku, rotulo, cor in medidas:
            if chave(rotulo) in vistos:
                continue
            vistos.add(chave(rotulo))
            saida[sku] = {"family": familia, "label": rotulo,
                          "color": "#%02x%02x%02x" % cor}

    for cat, prefixo, rotulos in descartadas:
        print(f"  descartada (mesma cor nas fotos): {cat} · {prefixo[:44]} · {', '.join(rotulos)}")

    familias_finais = collections.Counter(v["family"] for v in saida.values())
    corpo = ",\n".join(
        '  "%s": { family: "%s", label: "%s", color: "%s" }'
        % (sku, v["family"], v["label"].replace('"', '\\"'), v["color"])
        for sku, v in sorted(saida.items(), key=lambda kv: (kv[1]["family"], kv[1]["label"])))
    SAIDA.write_text(CABECALHO.format(produtos=len(saida), familias=len(familias_finais))
                     + "export const VARIANTS: Record<string, VariantInfo> = {\n" + corpo + ",\n};\n" + RODAPE)
    print(f"\nprodutVariants.ts: {len(saida)} produtos em {len(familias_finais)} famílias")


CABECALHO = '''/* productVariants — quais produtos são a mesma peça em cor diferente.
 *
 * GERADO por scripts/variantes.py — não editar à mão.
 *
 * O seletor de cor antes dependia de COLOR_RULES, dez cores genéricas herdadas
 * do protótipo de origem ("preto", "azul", "vermelho"). O catálogo Tonante não
 * fala assim — Deep Dark, Yellow Cake, Merlot, Blue Wood, Coffee Sparkle — então
 * quase nenhuma variante era reconhecida: Jazzmine Yellow Cake e Jazzmine Deep
 * Dark apareciam na prateleira como dois produtos sem relação.
 *
 * Família: dois produtos são variantes quando o nome bate em todos os segmentos
 * menos um, e esse um não é estrutural (4/5 cordas, 40"/41", nº de bandas) nem o
 * código do modelo. O segmento que sobra vira o rótulo — o nome comercial da
 * cor, não uma aproximação.
 *
 * `color` é medido na foto do produto (mediana do que não é fundo branco), que é
 * o único jeito de dar hex a "Merlot". A medição também filtra: família cujas
 * fotos têm a mesma cor não é variação de cor e não entra aqui.
 *
 * {produtos} produtos em {familias} famílias.
 */

export interface VariantInfo {{
  /** chave da família — produtos que a compartilham são a mesma peça */
  family: string;
  /** nome comercial da cor, como aparece no nome do produto */
  label: string;
  /** hex medido na foto, para quando não houver imagem */
  color: string;
}}

'''

RODAPE = '''
/** Família e cor de um SKU, quando ele faz parte de um grupo de variantes. */
export function getVariantInfo(sku?: string): VariantInfo | null {
  if (!sku) return null;
  return VARIANTS[sku] ?? null;
}
'''

if __name__ == "__main__":
    main()
