#!/usr/bin/env python3
"""Baixa as fotos de estúdio do site oficial e regera productGalleries.ts.

O dump do Magento traz uma foto por produto. O site institucional
(tonantebrasil.com.br, WordPress) tem a sessão inteira: 8 a 30 ângulos em
1200x1200. A media library dele é pública em /wp-json/wp/v2/media, e os
arquivos são nomeados pelo número do SKU sem o prefixo "CP"
(CP111602 -> 111602_2.jpg) — é esse casamento que monta as galerias.

Uso:
    python3 scripts/fotos-oficiais.py

Idempotente: pula arquivo que já existe, então rodar de novo só traz o que
o site publicou desde a última vez.

Requer Pillow. Não há WooCommerce no site: os produtos são páginas do
Elementor, por isso a media library é a fonte, não um endpoint de catálogo.
"""
import collections
import hashlib
import io
import json
import os
import re
import unicodedata
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/produtos/oficial")
CATALOG = [os.path.join(ROOT, "src/app/components/productsData.ts"),
           os.path.join(ROOT, "src/app/components/productsExtra.ts"),
           os.path.join(ROOT, "src/app/components/productsSiteOficial.ts")]
TARGET = os.path.join(ROOT, "src/app/components/productGalleries.ts")
MEDIA = "https://tonantebrasil.com.br/wp-json/wp/v2/media"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}

SIZE_SUFFIX = re.compile(r"-\d+x\d+(\.\w+)$")   # -600x600.jpg -> .jpg (o original)
SKU_PREFIX = re.compile(r"^(\d{4,7})[_\-.]")     # 111602_2.jpg -> 111602


def fetch(url, timeout=90):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def media_urls():
    """Todas as imagens da media library, sem as variantes de tamanho do WP."""
    urls = []
    for page in range(1, 40):
        try:
            data = json.loads(fetch(f"{MEDIA}?per_page=100&page={page}&_fields=source_url", timeout=60))
        except urllib.error.HTTPError as exc:
            if exc.code == 400:      # o WP responde 400, não lista vazia, ao passar da última página
                break
            raise
        if not data:
            break
        urls += [item["source_url"] for item in data]
    return urls


# O site nomeia as fotos com o código antigo de fábrica; o ERP já renumerou o
# mesmo produto. Sem isso as sessões dos ukuleles Haka ficariam órfãs.
ALIASES = {
    "35668": "CP314833",   # Ukulele Soprano Haka Mahogany USH1954M
    "35669": "CP314834",   # Ukulele Concert Haka Mahogany UCH1954M
}


def catalog_skus():
    """{numero: sku} — o numero é a chave que o site oficial usa nos arquivos."""
    out = {}
    for path in CATALOG:
        src = open(path, encoding="utf-8").read()
        for m in re.finditer(r'sku: "([^"]+)"|"sku": "([^"]+)"', src):
            sku = m.group(1) or m.group(2)
            out[sku.replace("CP", "")] = sku
    for num, sku in ALIASES.items():
        if sku in out.values():
            out[num] = sku
    return out


# A fábrica erra o upload de vez em quando e deixa a foto de um modelo na pasta
# de outro (111635-top-JASPE-BABY.jpg no meio do Rubi). Quando o nome do arquivo
# cita um modelo que não é o do produto, a foto não entra na galeria.
MODELOS = ["RUBI", "JASPE", "AMBAR", "ABALONE", "SAFIRA", "CORAL", "CITRINO", "TOPAZIO",
           "KILAUEA", "VESUVIO", "ETNA", "MISTI", "QUARTZO", "AMETISTA", "JADE", "AGATA",
           "ONIX", "OPALA", "MAGMA", "GRANADA", "LORENZZO", "MURIEL", "CECILLE",
           "VALENTINE", "STARLIGHT", "JAZZMINE", "THEODOR", "SONORA", "MASAYA", "HAKA"]


def sem_acento(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto)
                   if unicodedata.category(c) != "Mn").upper()


def de_outro_modelo(nome_arquivo, nome_produto):
    arquivo, produto = sem_acento(nome_arquivo), sem_acento(nome_produto)
    citados = [m for m in MODELOS if m in arquivo]
    return bool(citados) and not any(m in produto for m in citados)


def product_names():
    """{sku: nome} — para saber de que modelo cada pasta é."""
    out = {}
    for path in CATALOG:
        src = open(path, encoding="utf-8").read()
        for m in re.finditer(r'(?:"sku": "([^"]+)"|sku: "([^"]+)")(.{0,400}?)(?:"name": "((?:[^"\\]|\\.)*)"|name: "((?:[^"\\]|\\.)*)")',
                             src, re.S):
            sku = m.group(1) or m.group(2)
            out[sku] = m.group(4) or m.group(5) or ""
    return out


def download(job):
    url, path = job
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    try:
        img = Image.open(io.BytesIO(fetch(url)))
        if img.mode != "RGB":
            img = img.convert("RGB")
        img.thumbnail((1200, 1200), Image.LANCZOS)
        img.save(path, "WEBP", quality=80, method=5)
        return path
    except Exception as exc:                       # foto morta na media library
        print("FALHOU", url, type(exc).__name__, exc)
        return None


def dedupe(folder):
    """O WP reenvia a mesma foto em meses diferentes (_02 e _2, sufixo -1)."""
    seen, dropped = {}, 0
    for name in sorted(os.listdir(folder)):
        path = os.path.join(folder, name)
        digest = hashlib.md5(open(path, "rb").read()).hexdigest()
        if digest in seen:
            keep = min([seen[digest], name],
                       key=lambda n: (bool(re.search(r"-\d+\.webp$", n)), len(n), n))
            os.remove(os.path.join(folder, name if keep == seen[digest] else seen[digest]))
            seen[digest] = keep
            dropped += 1
        else:
            seen[digest] = name
    return dropped


def order(num, name, folder):
    """Foto principal, sessão numerada, lifestyle/infográfico, e banner no fim.

    O banner panorâmico (1920x1080) fica com tarja na moldura quadrada da
    galeria, então vai por último mesmo tendo nome de sessão.
    """
    stem = re.sub(r"\.webp$", "", name)
    try:
        w, h = Image.open(os.path.join(folder, name)).size
        panoramic = w / h > 1.6
    except Exception:
        panoramic = False
    if panoramic:
        return (9, 0, name)
    if stem == num:
        return (0, 0, name)
    numbered = re.fullmatch(rf"{num}_0*(\d+)", stem)
    if numbered:
        return (1, int(numbered.group(1)), name)
    dashed = re.fullmatch(rf"{num}-(\d+)", stem)
    if dashed:
        return (2, int(dashed.group(1)), name)
    return (3, 0, name)


def main():
    os.makedirs(OUT, exist_ok=True)
    skus = catalog_skus()

    groups = collections.defaultdict(set)
    for url in media_urls():
        match = SKU_PREFIX.match(os.path.basename(url))
        if match and match.group(1) in skus:
            groups[match.group(1)].add(SIZE_SUFFIX.sub(r"\1", url))
    print(f"{len(groups)} produtos do catálogo têm sessão publicada no site")

    jobs = []
    for num, urls in groups.items():
        folder = os.path.join(OUT, num)
        os.makedirs(folder, exist_ok=True)
        for url in urls:
            name = re.sub(r"\.\w+$", ".webp", os.path.basename(url))
            jobs.append((url, os.path.join(folder, name)))

    with ThreadPoolExecutor(12) as pool:
        saved = [p for p in pool.map(download, jobs) if p]
    print(f"{len(saved)}/{len(jobs)} imagens em disco")

    dropped = sum(dedupe(os.path.join(OUT, num)) for num in groups)
    print(f"{dropped} duplicatas removidas")

    nomes_de_produto = product_names()
    galleries, intrusas = {}, 0
    for num in sorted(groups):
        folder = os.path.join(OUT, num)
        names = sorted(os.listdir(folder), key=lambda n: order(num, n, folder))
        produto = nomes_de_produto.get(skus[num], "")
        limpo = [n for n in names if not de_outro_modelo(n, produto)]
        intrusas += len(names) - len(limpo)
        galleries[skus[num]] = [f"/produtos/oficial/{num}/{n}" for n in limpo]
    print(f"{intrusas} fotos descartadas por serem de outro modelo")

    total = sum(len(v) for v in galleries.values())
    body = "\n".join(
        f'  "{sku}": [\n' + "".join(f'    "{p}",\n' for p in paths) + "  ],"
        for sku, paths in sorted(galleries.items())
    )
    open(TARGET, "w", encoding="utf-8").write(HEADER.format(
        produtos=len(galleries), fotos=total) + f"\nexport const OFFICIAL_GALLERIES: Record<string, string[]> = {{\n{body}\n}};\n" + FOOTER)
    print(f"productGalleries.ts: {len(galleries)} produtos, {total} fotos")


HEADER = '''/* productGalleries — fotos oficiais de estúdio, extraídas de tonantebrasil.com.br.
 *
 * GERADO por scripts/fotos-oficiais.py — não editar à mão.
 *
 * O dump do Magento (`productsData.ts`) traz 1 foto por produto na maioria dos
 * casos. O site institucional tem a sessão completa: 8 a 30 ângulos em
 * 1200x1200. Este mapa cola as duas coisas.
 *
 * Chave = SKU do catálogo. O site nomeia os arquivos pelo número do SKU sem o
 * prefixo "CP" (CP111602 -> 111602_2.jpg), e é esse casamento que gera o mapa.
 *
 * Ordem: foto principal, sessão numerada do fotógrafo, lifestyle/infográfico,
 * banner panorâmico por último.
 *
 * Arquivos em public/produtos/oficial/<numero>/ — WebP q80, máx 1200px,
 * deduplicados por hash.
 *
 * {produtos} produtos, {fotos} fotos.
 */
'''

FOOTER = '''
/** Fotos oficiais de um SKU, ou [] quando o produto não tem sessão no site. */
export function getOfficialGallery(sku?: string): string[] {
  if (!sku) return [];
  return OFFICIAL_GALLERIES[sku] ?? [];
}
'''

if __name__ == "__main__":
    main()
