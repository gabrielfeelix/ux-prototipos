/**
 * Exporta os design tokens da Tonante a partir do CSS que o protótipo realmente usa.
 *
 * Rodar: node handoff/export-tokens.mjs
 *
 * A fonte da verdade continua sendo src/styles/theme.css. Este script apenas lê
 * o bloco :root e reemite o mesmo conteúdo em JSON e em TypeScript, para que o
 * time de front (GraphCommerce/MUI, que não consome Tailwind) possa alimentar o
 * createTheme sem recopiar valores à mão. Se um token mudar no CSS, rode de novo;
 * nunca edite os arquivos gerados.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const THEME = resolve(here, "../src/styles/theme.css");
const css = readFileSync(THEME, "utf8");

/** Conteúdo do primeiro bloco :root, contando chaves para não parar num `{` de comentário. */
function rootBlock(source) {
  const start = source.indexOf(":root");
  if (start === -1) throw new Error("bloco :root não encontrado em theme.css");
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error("bloco :root não fecha");
}

/** Remove comentários antes de partir em declarações, senão `;` dentro deles quebra o split. */
function declarations(block) {
  const clean = block.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  for (const chunk of clean.split(";")) {
    const decl = chunk.trim();
    if (!decl.startsWith("--")) continue;
    const colon = decl.indexOf(":");
    if (colon === -1) continue;
    out.push([decl.slice(2, colon).trim(), decl.slice(colon + 1).trim().replace(/\s+/g, " ")]);
  }
  return out;
}

/** rgba(r, g, b, 1.00) vira hex: MUI e a maioria das ferramentas de design leem hex melhor. */
function toHex(value) {
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value);
  if (!m) return value;
  const [, r, g, b, a] = m;
  if (a !== undefined && Number(a) < 1) return value;
  const hex = [r, g, b].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  return `#${hex}`;
}

/** Agrupa por papel. A ordem importa: `gradient-*` tem que ser testado antes de `color`. */
function group(name, value) {
  if (name.startsWith("gradient-")) return "gradient";
  if (name.startsWith("shadow-") || name.startsWith("elevation-")) return "shadow";
  if (name.startsWith("radius")) return "radius";
  if (name.startsWith("font-family") || name.startsWith("font-display") || name === "font-sans") return "fontFamily";
  if (name.startsWith("font-weight")) return "fontWeight";
  if (name.startsWith("text-") || name === "font-size") return "fontSize";
  if (name.startsWith("space-") || name.startsWith("container-") || name === "announce-h") return "layout";
  if (name === "ease") return "motion";
  if (/^(surface|ink|edge|stage|tone|btn|buy|amber|well)/.test(name)) return "semantic";
  if (/(rgb)$/.test(name)) return "raw";
  if (/^(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|chart|sidebar|faint)/.test(name)) return "color";
  return "raw";
}

const tokens = {};
for (const [name, value] of declarations(rootBlock(css))) {
  const bucket = (tokens[group(name, value)] ??= {});
  bucket[name] = /^rgba?\(/.test(value) ? toHex(value) : value;
}

const header = `Gerado por handoff/export-tokens.mjs a partir de src/styles/theme.css. Não editar à mão.`;

writeFileSync(
  resolve(here, "tokens.json"),
  `${JSON.stringify({ $comment: header, ...tokens }, null, 2)}\n`,
);

const ts = [
  `/* ${header} */`,
  ``,
  ...Object.entries(tokens).map(
    ([bucket, entries]) =>
      `export const ${bucket} = ${JSON.stringify(entries, null, 2)} as const;`,
  ),
  ``,
  `export const tokens = { ${Object.keys(tokens).join(", ")} } as const;`,
  ``,
].join("\n");
writeFileSync(resolve(here, "tokens.ts"), ts);

const total = Object.values(tokens).reduce((n, b) => n + Object.keys(b).length, 0);
console.log(`${total} tokens em ${Object.keys(tokens).length} grupos -> handoff/tokens.json, handoff/tokens.ts`);
