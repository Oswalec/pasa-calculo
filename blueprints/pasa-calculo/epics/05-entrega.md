# Epic 05: Entrega

> El flujo completo pasa a 360px y existe el workflow que prueba y publica en cada push a main.

| | |
|---|---|
| **Epic id** | `05-entrega` |
| **Tasks** | `E5-T1` … `E5-T2` |
| **Depends on** | 04-pantallas |
| **Unlocks** | nada |
| **Parallel with** | ninguno |

No necesitas ningún otro archivo para completar este epic. Lo de abajo se repite aquí a propósito.

---

## Stack

Astro estático · TypeScript · isla Preact · CSS propio con tokens · KaTeX · MathLive · Compute Engine · sin base de datos · sin auth · GitHub Pages.
Gestor de paquetes: `npm`. Runtime fijado en `.nvmrc`. Las versiones están en `package-lock.json`: léelas ahí, nunca las adivines.

| Tarea | Comando |
|---|---|
| Desarrollo | `npm run dev` |
| Construir (incluye `astro check`) | `npm run build` |
| Prueba de un archivo | `npm test -- src/lib/retos.test.ts` |
| Todas las pruebas | `npm test` |
| Banco | `npm run banco` · `npm run banco -- --completo` |
| Un spec E2E | `npm run e2e -- e2e/flujo.spec.ts` |
| Formatear | `npm run format` |
| Revisar formato | `npm run format:check` |

**Gate:** `npm run format:check && npm run build` pasa antes de marcar cualquier tarea aquí como hecha. Desde `E1-T2`, cuando ya existen pruebas, también `npm test`.

No hay servicios locales ni variables de entorno. Todo archivo de configuración ya está en la raíz del proyecto: llegó con el Bootstrap desde `workspace/`, no lo escribes tú. Los comandos corren desde la raíz, en Git Bash o Linux.

## Directory subtree

Solo las partes que toca este epic:

```
e2e/flujo.spec.ts              # NUEVO
.github/workflows/deploy.yml   # NUEVO
scripts/verificar-dist.mjs     # NUEVO
tests/verificar-dist.test.ts   # NUEVO
tests/fixtures/dist-malo/index.html  # NUEVO
src/components/*.tsx           # existe, solo si el flujo descubre un defecto
src/styles/global.css          # existe, solo si el flujo descubre un defecto
```

Todo lo demás queda fuera de alcance. Si una tarea parece requerir otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| ninguna | no agrega datos | no aplica |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `04-pantallas` | la isla completa | las 4 pantallas |

**Produced** — los epics siguientes dependen de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `.github/workflows/deploy.yml` | push a `main` prueba y publica | lista de lanzamiento |

## Conventions that bite in this area

- Crear el repositorio y activar Pages no es tarea de este epic: es de la lista de lanzamiento, a cargo del dueño.
- Nunca hagas `git push`: está denegado en `.claude/settings.json`.

Reglas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/contenido.md` y `.claude/rules/pantallas.md`.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el de construcción.

### `E5-T1` — Probar flujo completo en móvil

**Depends on:** `E4-T5` · **Priority:** p0, metadato para recortes, no un orden

Escribe `e2e/flujo.spec.ts`, el flujo completo a 360×740 con la fecha fija `2026-01-01T17:00:00Z` por `page.clock`. Corrige en el código lo que este gate descubra. Si necesitas tocar otro archivo, solo puede ser uno de `src/components/` o `src/styles/global.css`.

- Para cada tema, un `test`: toca el tema, responde los 3 ejercicios con la respuesta correcta y llega a `3 de 3`. En `opcion` toca la etiqueta; en `expresion` escribe en `math-field` con `evaluate((el: HTMLInputElement, v: string) => {...})`, asignando `value` y disparando `input`.
- En cada pantalla comprueba: `document.documentElement.scrollWidth <= 360`, exactamente un `h1`, y que cada `main button` y `main a` mida al menos 48px de alto con `boundingBox()`.
- Un `test` repite Inicio a 320×568 y exige `scrollWidth <= 320`.
- Un `test` termina un tema, recarga, toca el tema y llega directo a Resultado.
- Un `test` comprueba el `href` exacto `https://wa.link/de928w`.

**Files**

- `e2e/flujo.spec.ts` — nuevo: flujo completo en los cuatro temas

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** each of the four topics is completed with correct answers at 360 by 740 **THE SYSTEM SHALL** reach `3 de 3`.
2. **WHEN** each screen is shown at 360 by 740 **THE SYSTEM SHALL** keep `document.documentElement.scrollWidth` at 360 or less and render exactly one `h1`.
3. **WHEN** each screen is shown **THE SYSTEM SHALL** render every `main button` and `main a` at 48px of height or more.
4. **WHEN** the viewport is 320 by 568 **THE SYSTEM SHALL** keep `document.documentElement.scrollWidth` at 320 or less.
5. **WHEN** a finished topic is reopened after a reload **THE SYSTEM SHALL** show Resultado with `href` exactly `https://wa.link/de928w`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e
npm test
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E5-T1: Probar flujo completo en móvil"
git tag step-14-e2e-completo
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E5-T2` — Configurar publicación en GitHub Pages

**Depends on:** `E5-T1` · **Priority:** p0, metadato para recortes, no un orden

Agrega el flujo de publicación y la verificación del sitio construido. Crear el repositorio y activar Pages son tareas de la lista de lanzamiento, no de este paso: aquí no se publica nada. Copia estos cuatro archivos tal cual.

`.github/workflows/deploy.yml`

```yaml
name: Publicar

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  construir:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run format:check
      - run: npm test
      - run: npm run banco -- --completo
      - run: npm run build
      - run: node scripts/verificar-dist.mjs
      - run: npm run e2e
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  publicar:
    needs: construir
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.publicacion.outputs.page_url }}
    steps:
      - id: publicacion
        uses: actions/deploy-pages@v5
```

`scripts/verificar-dist.mjs`

```js
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
```

`tests/verificar-dist.test.ts`

```ts
import { spawnSync } from "node:child_process";
import { expect, it } from "vitest";

it("verificar-dist rechaza un sitio sin título y con ruta fuera de la base", () => {
  const { status, stdout } = spawnSync(
    process.execPath,
    ["scripts/verificar-dist.mjs", "--dir", "tests/fixtures/dist-malo"],
    { encoding: "utf8" },
  );
  expect(status).toBe(1);
  expect(stdout).toContain("FALLA falta el título");
  expect(stdout).toContain("FALLA ruta fuera de la base: /otra-base/a.js");
});
```

`tests/fixtures/dist-malo/index.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <title>Otro sitio</title>
  </head>
  <body>
    <script src="/otra-base/a.js"></script>
  </body>
</html>
```

**Files**

- `.github/workflows/deploy.yml` — nuevo: pruebas y publicación en cada push a main
- `scripts/verificar-dist.mjs` — nuevo: revisa título, rutas, servicios externos y WhatsApp
- `tests/verificar-dist.test.ts` — nuevo: prueba el camino de falla
- `tests/fixtures/dist-malo/index.html` — nuevo: sitio roto para la prueba

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `node scripts/verificar-dist.mjs` reads the built `dist/` **THE SYSTEM SHALL** exit 0 printing `dist ok`.
2. **WHEN** `scripts/verificar-dist.mjs` reads `tests/fixtures/dist-malo` **THE SYSTEM SHALL** exit 1 printing `FALLA falta el título` and `FALLA ruta fuera de la base: /otra-base/a.js`.
3. **WHEN** `.github/workflows/deploy.yml` is read **THE SYSTEM SHALL** name `actions/deploy-pages@v5`, a push trigger on `main`, and the commands `npm test`, `npm run banco -- --completo`, `npm run build` and `npm run e2e`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm test -- tests/verificar-dist.test.ts
npm run build
node scripts/verificar-dist.mjs
grep -q 'actions/deploy-pages@v5' .github/workflows/deploy.yml
grep -q 'branches: \[main\]' .github/workflows/deploy.yml
grep -q 'run: npm test' .github/workflows/deploy.yml
grep -q 'run: npm run build' .github/workflows/deploy.yml
grep -q 'npm run banco -- --completo' .github/workflows/deploy.yml
grep -q 'npm run e2e' .github/workflows/deploy.yml
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E5-T2: Configurar publicación en GitHub Pages"
git tag step-15-publicar
git ls-files --error-unmatch .github/workflows/deploy.yml  # expect: exit 0, ya quedó registrado por el commit de arriba
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

---

## Epic acceptance

El epic termina cuando cada tarea está `done` y además:

1. **WHEN** `npm run e2e` and `node scripts/verificar-dist.mjs` run after `npm run build` **THE SYSTEM SHALL** exit 0.

```bash
npm run format:check && npm test && npm run build
npm run banco -- --completo
node scripts/verificar-dist.mjs
npm run e2e
```

## Pitfalls

- **Teclado en el E2E** — las medidas de 48px miran `main button` y `main a`; las teclas de MathLive no están en `main`.
- **`dist`** — `verificar-dist` lee lo construido: corre `npm run build` antes.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag; `git tag -l 'step-*'` los lista.
- [ ] El gate pasa limpio desde la raíz del proyecto.
- [ ] Cada contrato de "Produced" existe con esa firma.
- [ ] No se tocó ningún archivo fuera del subárbol.
- [ ] Un commit por tarea, con el id de la tarea, seguido de su tag.
