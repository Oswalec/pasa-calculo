# Epic 01: Base

> Existe el sitio publicado localmente en su ruta real, el esquema del banco y el reparto diario de retos.

| | |
|---|---|
| **Epic id** | `01-base` |
| **Tasks** | `E1-T1` … `E1-T2` |
| **Depends on** | nada, empieza aquí |
| **Unlocks** | 02-banco, 03-motor |
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
src/
  pages/index.astro     # NUEVO: la única ruta
  layouts/Base.astro    # NUEVO: head, Poppins y estilos
  styles/tokens.css     # NUEVO: tokens
  styles/global.css     # NUEVO: base y componentes
  data/tipos.ts         # NUEVO: esquema exacto
  lib/fechas.ts         # NUEVO: fechas de Lima
  lib/fechas.test.ts    # NUEVO
  lib/retos.ts          # NUEVO: reparto en tríos
  lib/retos.test.ts     # NUEVO
e2e/humo.spec.ts         # NUEVO: la ruta publicada en un navegador
scripts/probar-sitio.mjs # existe, llegó con el Bootstrap
```

Todo lo demás queda fuera de alcance. Si una tarea parece requerir otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Ejercicio` | todos: `id`, `tema`, `n`, `enunciado`, `tipo`, `respuesta`, `opciones`, `constante`, `solucion`, `chequeo` | solo el tipo; los datos llegan en 02-banco |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| Bootstrap | `scripts/probar-sitio.mjs` | sirve `dist/` y exige 200 con `Pasa Cálculo` en `http://localhost:4321/pasa-calculo/` |

**Produced** — los epics siguientes dependen de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `src/data/tipos.ts` → `Ejercicio`, `Tema`, `Opcion`, `Chequeo`, `ETIQUETA_OPCION`, `ETIQUETA_TEMA` | ver el archivo | 02, 03, 04 |
| `src/lib/fechas.ts` → `fechaLima`, `diasEntre`, `cuentaRegresiva` | `(ahora?: Date) => string`, `(desde, hasta) => number` | 03, 04 |
| `src/lib/retos.ts` → `trios`, `retoDeHoy` | `retoDeHoy(lista, fecha) => [T, T, T]` | 04 |

## Conventions that bite in this area

- La fecha siempre sale de `America/Lima` con `Intl.DateTimeFormat`, nunca de la zona del dispositivo.
- Los imports internos llevan extensión real: `./fechas.ts`.
- `npm run e2e` usa `npm run preview`: construye antes con `npm run build`.
- El `h1` no va en `index.astro`: cada pantalla de la isla trae el suyo. El texto estático `Pasa Cálculo` es un `p`.

Reglas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/contenido.md` y `.claude/rules/pantallas.md`.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el de construcción.

### `E1-T1` — Crear estructura y tokens

**Depends on:** nada · **Priority:** p0, metadato para recortes, no un orden

Crea la página única de Astro y el sistema visual. Los archivos de configuración, incluido `scripts/probar-sitio.mjs`, ya llegaron con el Bootstrap: no los escribas. Copia estos cinco archivos tal cual.

`src/styles/tokens.css`

```css
:root {
  color-scheme: dark;

  --negro: #0b0b0c;
  --superficie: #17171a;
  --borde: #2a2a2e;
  --durazno: #efb18c;
  --texto: #f7f3ef;
  --suave: #b9b2ab;
  --acierto: #2fbf71;
  --error: #f0524f;

  --fuente: "Poppins", system-ui, sans-serif;
  --radio: 12px;
  --toque: 48px;
  --margen: 16px;
  --ancho: 480px;
  --feedback: 180ms;
}
```

`src/styles/global.css`

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--negro);
}

body {
  margin: 0 auto;
  max-width: var(--ancho);
  min-height: 100dvh;
  padding: var(--margen);
  background: var(--negro);
  color: var(--texto);
  font-family: var(--fuente);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

h1 {
  margin: 0 0 var(--margen);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.marca {
  margin: 0 0 var(--margen);
  color: var(--suave);
  font-size: 14px;
  font-weight: 600;
}

.boton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--toque);
  padding: 12px var(--margen);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  background: var(--superficie);
  color: var(--texto);
  font: inherit;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity var(--feedback) ease-out;
}

.boton-primario {
  border-color: var(--durazno);
  background: var(--durazno);
  color: var(--negro);
}

.boton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.enlace-pequeno {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--toque);
  padding: 0 var(--margen);
  border: 0;
  background: none;
  color: var(--durazno);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.pantalla {
  display: grid;
  gap: var(--margen);
}

.discreto {
  margin: 0;
  color: var(--suave);
  font-size: 14px;
}

.enunciado {
  overflow-wrap: anywhere;
  font-size: 18px;
}

.formula {
  overflow-x: auto;
}

.acierto {
  color: var(--acierto);
}

.error {
  color: var(--error);
}

math-field {
  display: block;
  width: 100%;
  min-height: var(--toque);
  padding: 8px;
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  background: var(--superficie);
  color: var(--texto);
  font-size: 20px;
}

math-field::part(virtual-keyboard-toggle),
math-field::part(menu-toggle) {
  display: none;
}

body {
  --keyboard-background: var(--superficie);
  --keyboard-border: var(--borde);
  --keycap-background: var(--borde);
  --keycap-background-hover: var(--borde);
  --keycap-text: var(--texto);
  --keycap-border: var(--borde);
  --keycap-border-bottom: var(--borde);
  --keycap-secondary-background: var(--negro);
  --keycap-secondary-background-hover: var(--negro);
  --keycap-secondary-text: var(--texto);
  --keycap-secondary-border: var(--borde);
  --keycap-secondary-border-bottom: var(--borde);
}

:focus-visible {
  outline: 2px solid var(--durazno);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

`src/layouts/Base.astro`

```astro
---
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/800.css";
import "../styles/tokens.css";
import "../styles/global.css";

const titulo = "Pasa Cálculo";
const descripcion = "Reto diario gratis de 3 ejercicios de Cálculo.";
const canonica = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0B0B0C" />
    <title>{titulo}</title>
    <meta name="description" content={descripcion} />
    <link rel="canonical" href={canonica} />
    <link rel="icon" href="data:," />
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/index.astro`

```astro
---
import Base from "../layouts/Base.astro";
---

<Base>
  <p class="marca">Pasa Cálculo</p>
  <main id="principal">
    <noscript>Activa JavaScript para hacer el reto de hoy.</noscript>
  </main>
</Base>
```

`e2e/humo.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("la ruta publicada muestra la marca", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByText("Pasa Cálculo", { exact: true })).toBeVisible();
});
```

**Files**

- `src/pages/index.astro` — nuevo: la única ruta; el texto estático `Pasa Cálculo` y el `main` donde vivirá la isla
- `src/layouts/Base.astro` — nuevo: head, metadatos, Poppins y estilos
- `src/styles/tokens.css` — nuevo: los tokens de la paleta y las medidas
- `src/styles/global.css` — nuevo: base, botones, pantallas, `math-field` y teclado
- `e2e/humo.spec.ts` — nuevo: ejercita `playwright.config.ts` y la ruta publicada en un navegador

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `npm run build` runs **THE SYSTEM SHALL** exit 0 with `astro check` reporting 0 errors and write `dist/index.html`.
2. **WHEN** `node scripts/probar-sitio.mjs` serves `dist/` at `http://localhost:4321/pasa-calculo/` **THE SYSTEM SHALL** answer status 200 with a body containing `Pasa Cálculo`, and the script SHALL exit 0.
3. **WHEN** `dist/index.html` is read **THE SYSTEM SHALL** contain `lang="es"` and the description `Reto diario gratis de 3 ejercicios de Cálculo.`.
4. **WHEN** JavaScript is unavailable **THE SYSTEM SHALL** offer the text `Activa JavaScript para hacer el reto de hoy.` inside `noscript`.
5. **WHEN** `npm run e2e -- e2e/humo.spec.ts` runs against `npm run preview` **THE SYSTEM SHALL** find `Pasa Cálculo` visible at `./` and exit 0.
6. **WHEN** `npm run format:check` runs from the project root with `blueprints/` present **THE SYSTEM SHALL** exit 0.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run format:check
npm run build
node scripts/probar-sitio.mjs
npm run e2e -- e2e/humo.spec.ts
grep -q 'lang="es"' dist/index.html
grep -q 'Reto diario gratis de 3 ejercicios de Cálculo.' dist/index.html
grep -q 'Activa JavaScript para hacer el reto de hoy.' dist/index.html
grep -qi -- '--durazno: #efb18c' src/styles/tokens.css
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T1: Crear estructura y tokens"
git tag step-01-estructura
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E1-T2` — Definir tipos y reparto de retos

**Depends on:** `E1-T1` · **Priority:** p0, metadato para recortes, no un orden

Escribe el esquema exacto del banco, las fechas de Lima y el reparto en tríos. La fecha siempre se calcula en `America/Lima` con `Intl.DateTimeFormat`, nunca con la zona del dispositivo. Copia estos cinco archivos tal cual.

`src/data/tipos.ts`

```ts
export type Tema = "limites" | "continuidad" | "derivadas" | "integrales";

export type Opcion = "continua" | "removible" | "salto" | "infinita";

export type Chequeo =
  | { clase: "limite"; f: string; punto: string }
  | { clase: "derivada"; f: string; en?: number }
  | { clase: "integral"; f: string; a?: number; b?: number }
  | { clase: "continuidad-k" }
  | { clase: "continuidad-tipo" };

export type Ejercicio = {
  id: string;
  tema: Tema;
  n: number;
  enunciado: string;
  tipo: "expresion" | "opcion";
  respuesta: string;
  opciones?: Opcion[];
  constante?: boolean;
  solucion: string;
  chequeo: Chequeo;
};

export const ETIQUETA_OPCION: Record<Opcion, string> = {
  continua: "Continua",
  removible: "Discontinua removible",
  salto: "Discontinua de salto",
  infinita: "Discontinua infinita",
};

export const ETIQUETA_TEMA: Record<Tema, string> = {
  limites: "Límites",
  continuidad: "Continuidad",
  derivadas: "Derivadas",
  integrales: "Integrales",
};
```

`src/lib/fechas.ts`

```ts
const ZONA = "America/Lima";
const MS_DIA = 86_400_000;

function partesLima(ahora: Date): Record<string, string> {
  const formato = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const partes: Record<string, string> = {};
  for (const { type, value } of formato.formatToParts(ahora))
    partes[type] = value;
  return partes;
}

/** Fecha calendario en Lima como "AAAA-MM-DD". Nunca usa la zona del dispositivo. */
export function fechaLima(ahora: Date = new Date()): string {
  const { year, month, day } = partesLima(ahora);
  return `${year}-${month}-${day}`;
}

function aUtc(fecha: string): number {
  const [anio, mes, dia] = fecha.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return Date.UTC(anio, mes - 1, dia);
}

/** Días calendario de `desde` a `hasta`. Negativo si `hasta` es anterior. */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUtc(hasta) - aUtc(desde)) / MS_DIA);
}

/** Tiempo hasta la próxima medianoche de Lima como "HH:MM:SS". */
export function cuentaRegresiva(ahora: Date = new Date()): string {
  const { hour, minute, second } = partesLima(ahora);
  const pasados = Number(hour) * 3600 + Number(minute) * 60 + Number(second);
  const faltan = 86_400 - pasados;
  const horas = Math.floor(faltan / 3600);
  const minutos = Math.floor((faltan % 3600) / 60);
  const segundos = faltan % 60;
  return [horas, minutos, segundos]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}
```

`src/lib/retos.ts`

```ts
import { diasEntre } from "./fechas.ts";

const INICIO = "2026-01-01";

/** Reparte la lista en tríos [A[i], B[i], C[i]]: de fácil a menos fácil, sin repetir en el ciclo. */
export function trios<T extends { n: number }>(
  lista: readonly T[],
): [T, T, T][] {
  const orden = [...lista].sort((a, b) => a.n - b.n);
  const k = Math.floor(orden.length / 3);
  const resultado: [T, T, T][] = [];
  for (let i = 0; i < k; i++) {
    resultado.push([orden[i] as T, orden[k + i] as T, orden[2 * k + i] as T]);
  }
  return resultado;
}

/** Trío del día para una fecha de Lima "AAAA-MM-DD". */
export function retoDeHoy<T extends { n: number }>(
  lista: readonly T[],
  fecha: string,
): [T, T, T] {
  const ciclo = trios(lista);
  if (ciclo.length === 0) throw new Error("Banco sin ejercicios suficientes");
  const dias = diasEntre(INICIO, fecha);
  const indice = ((dias % ciclo.length) + ciclo.length) % ciclo.length;
  return ciclo[indice] as [T, T, T];
}
```

`src/lib/fechas.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { cuentaRegresiva, diasEntre, fechaLima } from "./fechas.ts";

describe("fechas de Lima", () => {
  it("sigue siendo el día anterior en Lima a las 03:00 UTC", () => {
    expect(fechaLima(new Date("2026-03-10T03:00:00Z"))).toBe("2026-03-09");
  });

  it("cambia de día a las 05:00 UTC", () => {
    expect(fechaLima(new Date("2026-03-10T05:00:00Z"))).toBe("2026-03-10");
  });

  it("cuenta días calendario", () => {
    expect(diasEntre("2026-01-01", "2026-01-01")).toBe(0);
    expect(diasEntre("2026-01-01", "2026-03-01")).toBe(59);
    expect(diasEntre("2026-01-02", "2026-01-01")).toBe(-1);
  });

  it("formatea la cuenta regresiva hasta la medianoche de Lima", () => {
    expect(cuentaRegresiva(new Date("2026-03-10T04:59:59Z"))).toBe("00:00:01");
    expect(cuentaRegresiva(new Date("2026-03-10T17:00:00Z"))).toBe("12:00:00");
  });
});
```

`src/lib/retos.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { retoDeHoy, trios } from "./retos.ts";

const lista = (largo: number) =>
  Array.from({ length: largo }, (_, i) => ({ n: i + 1 }));

describe("reparto de retos", () => {
  it("arma 16 tríos con 50 ejercicios y descarta el sobrante", () => {
    const ciclo = trios(lista(50));
    expect(ciclo).toHaveLength(16);
    expect(ciclo[0]?.map((e) => e.n)).toEqual([1, 17, 33]);
    expect(ciclo[15]?.map((e) => e.n)).toEqual([16, 32, 48]);
  });

  it("arma 13 tríos con 40 ejercicios", () => {
    expect(trios(lista(40))).toHaveLength(13);
  });

  it("no repite ejercicios dentro del ciclo", () => {
    const usados = trios(lista(50))
      .flat()
      .map((e) => e.n);
    expect(new Set(usados).size).toBe(usados.length);
  });

  it("ordena por n aunque la lista venga desordenada", () => {
    const desordenada = lista(9).reverse();
    expect(trios(desordenada)[0]?.map((e) => e.n)).toEqual([1, 4, 7]);
  });

  it("usa el día desde 2026-01-01 módulo k", () => {
    expect(retoDeHoy(lista(50), "2026-01-01")[0].n).toBe(1);
    expect(retoDeHoy(lista(50), "2026-01-17")[0].n).toBe(1);
    expect(retoDeHoy(lista(50), "2026-01-02")[0].n).toBe(2);
    expect(retoDeHoy(lista(50), "2025-12-31")[0].n).toBe(16);
  });

  it("falla si el banco no alcanza para un trío", () => {
    expect(() => retoDeHoy(lista(2), "2026-01-01")).toThrow(
      "Banco sin ejercicios suficientes",
    );
  });
});
```

**Files**

- `src/data/tipos.ts` — nuevo: esquema exacto de `Ejercicio` y etiquetas
- `src/lib/fechas.ts` — nuevo: `fechaLima`, `diasEntre`, `cuentaRegresiva`
- `src/lib/retos.ts` — nuevo: `trios`, `retoDeHoy`
- `src/lib/fechas.test.ts` — nuevo: pruebas de fechas
- `src/lib/retos.test.ts` — nuevo: pruebas del reparto

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `trios` receives 50 items **THE SYSTEM SHALL** return 16 trios whose first is n = 1, 17, 33, dropping the leftover items.
2. **WHEN** `trios` receives 40 items **THE SYSTEM SHALL** return 13 trios with no repeated item in the cycle.
3. **WHEN** `retoDeHoy` receives a Lima date **THE SYSTEM SHALL** pick the trio at days since `2026-01-01` modulo k, including dates before `2026-01-01`.
4. **WHEN** `fechaLima` receives `2026-03-10T03:00:00Z` **THE SYSTEM SHALL** return `2026-03-09`, the Lima date, on any device time zone.
5. **WHEN** `retoDeHoy` receives fewer than 3 items **THE SYSTEM SHALL** throw `Banco sin ejercicios suficientes`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm test -- src/lib/fechas.test.ts src/lib/retos.test.ts
status=0; grep -rnE 'getDate\(|getMonth\(|getFullYear\(|getHours\(|toLocaleDateString' src/lib || status=$?; test "$status" -eq 1
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T2: Definir tipos y reparto de retos"
git tag step-02-retos
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

---

## Epic acceptance

El epic termina cuando cada tarea está `done` y además:

1. **WHEN** `node scripts/probar-sitio.mjs` runs after `npm run build` **THE SYSTEM SHALL** exit 0.
2. **WHEN** `npm test` runs **THE SYSTEM SHALL** exit 0 with 0 failed.

```bash
npm run format:check && npm test && npm run build
node scripts/probar-sitio.mjs
```

## Pitfalls

- **`Astro.site` y `base`** — la canónica se arma con `new URL(Astro.url.pathname, Astro.site)`; no escribas la URL a mano en otro lado.
- **Módulo negativo** — `retoDeHoy` debe normalizar el índice para fechas anteriores a 2026-01-01.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag; `git tag -l 'step-*'` los lista.
- [ ] El gate pasa limpio desde la raíz del proyecto.
- [ ] Cada contrato de "Produced" existe con esa firma.
- [ ] No se tocó ningún archivo fuera del subárbol.
- [ ] Un commit por tarea, con el id de la tarea, seguido de su tag.
