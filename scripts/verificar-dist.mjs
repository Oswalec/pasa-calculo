// Verifica el sitio construido antes de publicar.
// Uso: node scripts/verificar-dist.mjs [--dir <carpeta>]. Sale con 0 o con 1 nombrando cada falla.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const posicionDir = process.argv.indexOf("--dir");
const carpeta = posicionDir === -1 ? "dist" : process.argv[posicionDir + 1];
const BASE = "/pasa-calculo/";
const WHATSAPP = "https://wa.link/de928w";
const fallas = [];

const html = readFileSync(join(carpeta, "index.html"), "utf8");
if (!html.includes("<title>Pasa Cálculo</title>"))
  fallas.push("falta el título");
if (!html.includes("Reto diario gratis de 3 ejercicios de Cálculo.")) {
  fallas.push("falta la descripción");
}
if (!html.includes('href="https://oswalec.github.io/pasa-calculo/"')) {
  fallas.push("falta la canónica");
}

for (const [, ruta] of html.matchAll(
  /(?:src|href|component-url|renderer-url)="(\/[^"]+)"/g,
)) {
  if (!ruta.startsWith(BASE)) fallas.push(`ruta fuera de la base: ${ruta}`);
  else if (!existsSync(join(carpeta, ruta.slice(BASE.length))))
    fallas.push(`no existe: ${ruta}`);
}

for (const [url] of html.matchAll(/https?:\/\/[^"'\s)]+/g)) {
  if (!url.startsWith("https://oswalec.github.io/"))
    fallas.push(`servicio externo: ${url}`);
}

const assets = join(carpeta, "_astro");
const scripts = existsSync(assets)
  ? readdirSync(assets).filter((f) => f.endsWith(".js"))
  : [];
const conWhatsapp = scripts.some((f) =>
  readFileSync(join(assets, f), "utf8").includes(WHATSAPP),
);
if (!conWhatsapp) fallas.push(`ningún script contiene ${WHATSAPP}`);

if (fallas.length > 0) {
  console.log(fallas.map((f) => `FALLA ${f}`).join("\n"));
  process.exit(1);
}
console.log("dist ok");
