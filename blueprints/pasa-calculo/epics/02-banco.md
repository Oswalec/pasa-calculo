# Epic 02: Banco

> Existen los 190 ejercicios en cuatro JSON, verificados en esquema, notación y matemática.

| | |
|---|---|
| **Epic id** | `02-banco` |
| **Tasks** | `E2-T1` … `E2-T4` |
| **Depends on** | 01-base |
| **Unlocks** | 03-motor, 04-pantallas |
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
fuente/ejercicios-pdf.txt  # existe, solo lectura
src/data/banco/limites.json      # NUEVO
src/data/banco/continuidad.json  # NUEVO
src/data/banco/derivadas.json    # NUEVO
src/data/banco/integrales.json   # NUEVO
scripts/verificar-banco.mjs      # NUEVO
tests/verificar-banco.test.ts    # NUEVO
tests/banco-continuidad.test.ts  # NUEVO
tests/banco-derivadas.test.ts    # NUEVO
tests/banco-integrales.test.ts   # NUEVO
tests/fixtures/banco-malo/limites.json  # NUEVO
src/data/tipos.ts                # existe, solo lectura
```

Todo lo demás queda fuera de alcance. Si una tarea parece requerir otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Ejercicio` | todos | `id` con prefijo `lim`, `con`, `der`, `int` más `n` con dos dígitos. `n` conserva el número del PDF |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `01-base` | `src/data/tipos.ts` → `Ejercicio` | el esquema exacto |
| Bootstrap | `fuente/ejercicios-pdf.txt` | 200 ejercicios: LÍMITES línea 11, CONTINUIDAD 164, DERIVADAS 317, INTEGRALES 470 |

**Produced** — los epics siguientes dependen de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `src/data/banco/*.json` | `Ejercicio[]` ordenado por `n` | 03, 04 |
| `scripts/verificar-banco.mjs` | `[--completo] [--dir <carpeta>]`, sale con 0 o 1 | 03, 05 |

## Conventions that bite in this area

- En todo texto mostrado: `\operatorname{sen}` y `\operatorname{arcsen}`. Nunca `~` ni la palabra "sin", ni siquiera en español: el verificador la rechaza.
- `chequeo.f` no se muestra y puede usar `\sin`.
- `continuidad-k` y `continuidad-tipo` solo se validan por esquema; la solución es adaptada del PDF.
- Totales: limites 50, continuidad 40, derivadas 50, integrales 50.

Reglas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/contenido.md` y `.claude/rules/pantallas.md`.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el de construcción.

### `E2-T1` — Construir banco de límites y verificador

**Depends on:** `E1-T2` · **Priority:** p0, metadato para recortes, no un orden

Crea el banco de límites desde `fuente/ejercicios-pdf.txt`, conservando el número del PDF, y el verificador. El contenido ya está transcrito y reescrito aquí: sen en vez de sin, el 18 dice "Diferencia de cubos", el 30 y el 47 usan límites fundamentales y nunca `~`. `chequeo.f` no se muestra al alumno, por eso conserva `\sin`. Copia estos cuatro archivos tal cual.

`scripts/verificar-banco.mjs`. Sin `--completo` informa como `pendiente` el tema cuyo archivo aún no existe y sale con 0, para que este gate pase hoy y siga pasando en los pasos 4 a 6. `continuidad-k` y `continuidad-tipo` solo se validan por esquema y la solución queda adaptada del PDF: no hay chequeo matemático de esas dos clases.

```js
// Verifica el banco de ejercicios: esquema, ids, número del PDF, notación y matemática.
// Uso: node scripts/verificar-banco.mjs [--completo] [--dir <carpeta>]
// Sale con 0 si todo pasa y con 1 si algo falla, nombrando cada id.
// Sin --completo, un tema cuyo archivo aún no existe se informa como pendiente.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ComputeEngine } from "@cortex-js/compute-engine";

const argumentos = process.argv.slice(2);
const completo = argumentos.includes("--completo");
const posicionDir = argumentos.indexOf("--dir");
const carpeta =
  posicionDir === -1 ? "src/data/banco" : argumentos[posicionDir + 1];

const TEMAS = {
  limites: { prefijo: "lim", total: 50, seccion: "LÍMITES" },
  continuidad: { prefijo: "con", total: 40, seccion: "CONTINUIDAD" },
  derivadas: { prefijo: "der", total: 50, seccion: "DERIVADAS" },
  integrales: { prefijo: "int", total: 50, seccion: "INTEGRALES" },
};
const SECCIONES = ["LÍMITES", "CONTINUIDAD", "DERIVADAS", "INTEGRALES"];
const EXCLUIDOS = [6, 25, 26, 27, 28, 29, 30, 31, 34, 43];
const OPCIONES = ["continua", "removible", "salto", "infinita"];
const PUNTOS = [-2.71, -1.37, -0.83, -0.41, 0.23, 0.37, 0.81, 1.43, 2.19, 2.77];
const ce = new ComputeEngine();
const fallas = [];
const falla = (id, motivo) => fallas.push(`FALLA ${id}: ${motivo}`);

function numerosDelPdf() {
  const lineas = readFileSync("fuente/ejercicios-pdf.txt", "utf8").split(
    /\r?\n/,
  );
  const numeros = Object.fromEntries(SECCIONES.map((s) => [s, new Set()]));
  let actual = null;
  for (const linea of lineas) {
    if (SECCIONES.includes(linea.trim())) actual = linea.trim();
    const coincide = actual && linea.match(/^(\d+)\.\s/);
    if (coincide) numeros[actual].add(Number(coincide[1]));
  }
  return numeros;
}

function normalizar(latex) {
  return latex
    .replaceAll("\\operatorname{sen}", "\\sin ")
    .replaceAll("\\operatorname{arcsen}", "\\arcsin ");
}

function evaluar(latex, x) {
  return Number(ce.parse(normalizar(latex)).subs({ x, C: 0 }).N().re);
}

const cerca = (p, q, tolerancia) =>
  Math.abs(p - q) <= tolerancia * Math.max(1, Math.abs(p), Math.abs(q));

function chequearLimite(e) {
  const { f, punto } = e.chequeo;
  if (punto === "\\infty" || punto === "-\\infty") {
    const x = punto === "\\infty" ? 1e6 : -1e6;
    const valor = evaluar(f, x);
    if (e.respuesta === "\\infty" || e.respuesta === "-\\infty") {
      const signo = e.respuesta === "\\infty" ? 1 : -1;
      if (!(valor * signo > 1e3))
        falla(e.id, `el límite no diverge a ${e.respuesta}: ${valor}`);
      return;
    }
    const esperado = evaluar(e.respuesta, 0);
    if (!cerca(valor, esperado, 1e-3))
      falla(e.id, `límite ${valor}, respuesta ${esperado}`);
    return;
  }
  const a = evaluar(punto, 0);
  const esperado = evaluar(e.respuesta, 0);
  for (const h of [1e-3, -1e-3]) {
    const valor = evaluar(f, a + h);
    if (!cerca(valor, esperado, 2e-2))
      falla(e.id, `f(${a + h})=${valor}, respuesta ${esperado}`);
  }
}

function derivadaNumerica(f, x) {
  const h = 1e-5;
  return (evaluar(f, x + h) - evaluar(f, x - h)) / (2 * h);
}

function compararEnPuntos(e, izquierda, derecha) {
  let usados = 0;
  for (const x of PUNTOS) {
    const p = izquierda(x);
    const q = derecha(x);
    if (!Number.isFinite(p) || !Number.isFinite(q)) continue;
    usados += 1;
    if (!cerca(p, q, 1e-3)) falla(e.id, `en x=${x}: ${p} frente a ${q}`);
  }
  if (usados < 4) falla(e.id, `solo ${usados} puntos utilizables`);
}

function chequearDerivada(e) {
  const { f, en } = e.chequeo;
  if (en === undefined) {
    compararEnPuntos(
      e,
      (x) => derivadaNumerica(f, x),
      (x) => evaluar(e.respuesta, x),
    );
    return;
  }
  const valor = derivadaNumerica(f, en);
  const esperado = evaluar(e.respuesta, 0);
  if (!cerca(valor, esperado, 1e-3))
    falla(e.id, `f'(${en})=${valor}, respuesta ${esperado}`);
}

function simpson(f, a, b) {
  const pasos = 200;
  const h = (b - a) / pasos;
  let suma = evaluar(f, a) + evaluar(f, b);
  for (let i = 1; i < pasos; i++)
    suma += (i % 2 === 0 ? 2 : 4) * evaluar(f, a + i * h);
  return (suma * h) / 3;
}

function chequearIntegral(e) {
  const { f, a, b } = e.chequeo;
  if (a === undefined || b === undefined) {
    compararEnPuntos(
      e,
      (x) => derivadaNumerica(e.respuesta, x),
      (x) => evaluar(f, x),
    );
    return;
  }
  const valor = simpson(f, a, b);
  const esperado = evaluar(e.respuesta, 0);
  if (!cerca(valor, esperado, 1e-3))
    falla(e.id, `integral ${valor}, respuesta ${esperado}`);
}

function chequearEsquema(e, tema, pdf) {
  const { prefijo, seccion } = TEMAS[tema];
  const id = String(e.id);
  const textos = [e.enunciado, e.respuesta, e.solucion];
  if (id !== `${prefijo}-${String(e.n).padStart(2, "0")}`)
    falla(id, `id no coincide con n=${e.n}`);
  if (e.tema !== tema) falla(id, `tema ${e.tema} en el archivo ${tema}`);
  if (!pdf[seccion].has(e.n))
    falla(id, `n=${e.n} no existe en ${seccion} del PDF`);
  if (tema === "continuidad" && EXCLUIDOS.includes(e.n))
    falla(id, `n=${e.n} está excluido`);
  if (!textos.every((t) => typeof t === "string" && t.length > 0))
    falla(id, "falta un texto");
  if (e.tipo !== "expresion" && e.tipo !== "opcion")
    falla(id, `tipo inválido: ${e.tipo}`);
  for (const texto of textos) {
    if (/\b(sin|arcsin)\b/.test(texto))
      falla(id, `notación prohibida en: ${texto}`);
    if (texto.includes("~")) falla(id, `"~" prohibido en: ${texto}`);
    if ((texto.match(/\$/g) ?? []).length % 2 !== 0)
      falla(id, `"$" sin cerrar en: ${texto}`);
  }
  if (e.tipo === "opcion") {
    if (JSON.stringify(e.opciones) !== JSON.stringify(OPCIONES))
      falla(id, "opciones inválidas");
    if (!OPCIONES.includes(e.respuesta))
      falla(id, `respuesta fuera de opciones: ${e.respuesta}`);
    if (e.chequeo?.clase !== "continuidad-tipo")
      falla(id, "chequeo debe ser continuidad-tipo");
  } else if (e.opciones !== undefined) {
    falla(id, "tipo expresion no lleva opciones");
  }
  const esperaC = e.constante === true;
  if (esperaC !== /\+C$/.test(e.respuesta))
    falla(id, "constante y +C de la respuesta no coinciden");
}

function chequearMatematica(e, tema) {
  const clase = e.chequeo?.clase;
  const esperadas = {
    limites: ["limite"],
    continuidad: ["continuidad-k", "continuidad-tipo"],
    derivadas: ["derivada"],
    integrales: ["integral"],
  };
  if (!esperadas[tema].includes(clase))
    return falla(e.id, `chequeo inválido: ${clase}`);
  // continuidad-k y continuidad-tipo solo se validan por esquema: la solución es adaptada del PDF.
  if (clase === "limite") chequearLimite(e);
  if (clase === "derivada") chequearDerivada(e);
  if (clase === "integral") chequearIntegral(e);
}

const pdf = numerosDelPdf();
for (const [tema, { total }] of Object.entries(TEMAS)) {
  const ruta = join(carpeta, `${tema}.json`);
  if (!existsSync(ruta)) {
    if (completo) falla(tema, `falta ${ruta}`);
    else console.log(`pendiente: ${ruta}`);
    continue;
  }
  const lista = JSON.parse(readFileSync(ruta, "utf8"));
  const ids = new Set();
  for (const e of lista) {
    if (ids.has(e.id)) falla(e.id, "id repetido");
    ids.add(e.id);
    chequearEsquema(e, tema, pdf);
    chequearMatematica(e, tema);
  }
  if (lista.length !== total)
    falla(tema, `tiene ${lista.length} ejercicios, deben ser ${total}`);
}

if (fallas.length > 0) {
  console.log(fallas.join("\n"));
  process.exit(1);
}
console.log("banco ok");
```

`tests/verificar-banco.test.ts`

```ts
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const correr = (...args: string[]) =>
  spawnSync(process.execPath, ["scripts/verificar-banco.mjs", ...args], {
    encoding: "utf8",
  });

describe("verificar-banco", () => {
  it("rechaza notación sin y respuesta falsa nombrando el id", () => {
    const { status, stdout } = correr("--dir", "tests/fixtures/banco-malo");
    expect(status).toBe(1);
    expect(stdout).toContain("FALLA lim-01: notación prohibida");
    expect(stdout).toContain("FALLA lim-01: f(");
    expect(stdout).toContain("FALLA limites: tiene 1 ejercicios, deben ser 50");
  });

  it("con --completo exige los cuatro temas", () => {
    const { status, stdout } = correr(
      "--completo",
      "--dir",
      "tests/fixtures/no-existe",
    );
    expect(status).toBe(1);
    expect(stdout).toContain("FALLA integrales: falta");
  });
});
```

`tests/fixtures/banco-malo/limites.json`

```json
[
  {
    "id": "lim-01",
    "tema": "limites",
    "n": 1,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\sin x}{x}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Límite fundamental.",
    "chequeo": { "clase": "limite", "f": "\\frac{\\sin x}{x}", "punto": "0" }
  }
]
```

`src/data/banco/limites.json`

```json
[
  {
    "id": "lim-01",
    "tema": "limites",
    "n": 1,
    "enunciado": "Calcula $\\lim_{x\\to 2}\\left(3x^2-x+1\\right)$.",
    "tipo": "expresion",
    "respuesta": "11",
    "solucion": "Sustitución directa: $3(2)^2-2+1=12-2+1$.",
    "chequeo": {
      "clase": "limite",
      "f": "3x^2-x+1",
      "punto": "2"
    }
  },
  {
    "id": "lim-02",
    "tema": "limites",
    "n": 2,
    "enunciado": "Calcula $\\lim_{x\\to -1}\\left(x^3+2x^2-4\\right)$.",
    "tipo": "expresion",
    "respuesta": "-3",
    "solucion": "Sustitución directa: $(-1)^3+2(-1)^2-4=-1+2-4$.",
    "chequeo": {
      "clase": "limite",
      "f": "x^3+2x^2-4",
      "punto": "-1"
    }
  },
  {
    "id": "lim-03",
    "tema": "limites",
    "n": 3,
    "enunciado": "Calcula $\\lim_{x\\to 3}\\left(2x^2+5x-1\\right)$.",
    "tipo": "expresion",
    "respuesta": "32",
    "solucion": "Sustitución directa: $2(3)^2+5(3)-1=18+15-1$.",
    "chequeo": {
      "clase": "limite",
      "f": "2x^2+5x-1",
      "punto": "3"
    }
  },
  {
    "id": "lim-04",
    "tema": "limites",
    "n": 4,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\left(4x^3-7x+6\\right)$.",
    "tipo": "expresion",
    "respuesta": "6",
    "solucion": "Sustitución directa: $0-0+6$.",
    "chequeo": {
      "clase": "limite",
      "f": "4x^3-7x+6",
      "punto": "0"
    }
  },
  {
    "id": "lim-05",
    "tema": "limites",
    "n": 5,
    "enunciado": "Calcula $\\lim_{x\\to -2}\\left(x^2-3x+2\\right)$.",
    "tipo": "expresion",
    "respuesta": "12",
    "solucion": "Sustitución directa: $4+6+2$.",
    "chequeo": {
      "clase": "limite",
      "f": "x^2-3x+2",
      "punto": "-2"
    }
  },
  {
    "id": "lim-06",
    "tema": "limites",
    "n": 6,
    "enunciado": "Calcula $\\lim_{x\\to 1}\\left(x^4+2x^2+3\\right)$.",
    "tipo": "expresion",
    "respuesta": "6",
    "solucion": "Sustitución directa: $1+2+3$.",
    "chequeo": {
      "clase": "limite",
      "f": "x^4+2x^2+3",
      "punto": "1"
    }
  },
  {
    "id": "lim-07",
    "tema": "limites",
    "n": 7,
    "enunciado": "Calcula $\\lim_{x\\to 2}\\frac{x^2+3x}{x+1}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{10}{3}",
    "solucion": "Sustitución directa: $\\frac{4+6}{3}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2+3x}{x+1}",
      "punto": "2"
    }
  },
  {
    "id": "lim-08",
    "tema": "limites",
    "n": 8,
    "enunciado": "Calcula $\\lim_{x\\to -1}\\frac{2x^2+1}{x-3}$.",
    "tipo": "expresion",
    "respuesta": "-\\frac{3}{4}",
    "solucion": "Sustitución directa: $\\frac{3}{-4}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{2x^2+1}{x-3}",
      "punto": "-1"
    }
  },
  {
    "id": "lim-09",
    "tema": "limites",
    "n": 9,
    "enunciado": "Calcula $\\lim_{x\\to 4}\\sqrt{x+5}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "La raíz es continua: $\\sqrt{4+5}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\sqrt{x+5}",
      "punto": "4"
    }
  },
  {
    "id": "lim-10",
    "tema": "limites",
    "n": 10,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\operatorname{sen} x}{x}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Límite trigonométrico fundamental.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sin x}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-11",
    "tema": "limites",
    "n": 11,
    "enunciado": "Calcula $\\lim_{x\\to 3}\\frac{x^2-9}{x-3}$.",
    "tipo": "expresion",
    "respuesta": "6",
    "solucion": "Factoriza: $\\frac{(x-3)(x+3)}{x-3}$. Para $x\\neq 3$ queda $x+3$; evalúa.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-9}{x-3}",
      "punto": "3"
    }
  },
  {
    "id": "lim-12",
    "tema": "limites",
    "n": 12,
    "enunciado": "Calcula $\\lim_{x\\to -2}\\frac{x^2+5x+6}{x+2}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Factoriza: $\\frac{(x+2)(x+3)}{x+2}$. Queda $x+3$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2+5x+6}{x+2}",
      "punto": "-2"
    }
  },
  {
    "id": "lim-13",
    "tema": "limites",
    "n": 13,
    "enunciado": "Calcula $\\lim_{x\\to 1}\\frac{x^2-1}{x-1}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Factoriza: $\\frac{(x-1)(x+1)}{x-1}$. Queda $x+1$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-1}{x-1}",
      "punto": "1"
    }
  },
  {
    "id": "lim-14",
    "tema": "limites",
    "n": 14,
    "enunciado": "Calcula $\\lim_{x\\to 4}\\frac{x^2-16}{x-4}$.",
    "tipo": "expresion",
    "respuesta": "8",
    "solucion": "Factoriza: $\\frac{(x-4)(x+4)}{x-4}$. Queda $x+4$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-16}{x-4}",
      "punto": "4"
    }
  },
  {
    "id": "lim-15",
    "tema": "limites",
    "n": 15,
    "enunciado": "Calcula $\\lim_{x\\to 2}\\frac{x^2-5x+6}{x-2}$.",
    "tipo": "expresion",
    "respuesta": "-1",
    "solucion": "Factoriza: $\\frac{(x-2)(x-3)}{x-2}$. Queda $x-3$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-5x+6}{x-2}",
      "punto": "2"
    }
  },
  {
    "id": "lim-16",
    "tema": "limites",
    "n": 16,
    "enunciado": "Calcula $\\lim_{x\\to -3}\\frac{x^2+6x+9}{x+3}$.",
    "tipo": "expresion",
    "respuesta": "0",
    "solucion": "Factoriza: $\\frac{(x+3)^2}{x+3}$. Queda $x+3$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2+6x+9}{x+3}",
      "punto": "-3"
    }
  },
  {
    "id": "lim-17",
    "tema": "limites",
    "n": 17,
    "enunciado": "Calcula $\\lim_{x\\to 5}\\frac{x^2-25}{x-5}$.",
    "tipo": "expresion",
    "respuesta": "10",
    "solucion": "Factoriza: $\\frac{(x-5)(x+5)}{x-5}$. Queda $x+5$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-25}{x-5}",
      "punto": "5"
    }
  },
  {
    "id": "lim-18",
    "tema": "limites",
    "n": 18,
    "enunciado": "Calcula $\\lim_{x\\to 1}\\frac{x^3-1}{x-1}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "Diferencia de cubos: $(x-1)(x^2+x+1)$. Evalúa $1+1+1$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^3-1}{x-1}",
      "punto": "1"
    }
  },
  {
    "id": "lim-19",
    "tema": "limites",
    "n": 19,
    "enunciado": "Calcula $\\lim_{x\\to 2}\\frac{x^3-8}{x-2}$.",
    "tipo": "expresion",
    "respuesta": "12",
    "solucion": "Diferencia de cubos: $(x-2)(x^2+2x+4)$. Evalúa $4+4+4$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^3-8}{x-2}",
      "punto": "2"
    }
  },
  {
    "id": "lim-20",
    "tema": "limites",
    "n": 20,
    "enunciado": "Calcula $\\lim_{x\\to -1}\\frac{x^3+1}{x+1}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "Suma de cubos: $(x+1)(x^2-x+1)$. Evalúa $1+1+1$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^3+1}{x+1}",
      "punto": "-1"
    }
  },
  {
    "id": "lim-21",
    "tema": "limites",
    "n": 21,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\sqrt{x+9}-3}{x}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{6}",
    "solucion": "Racionaliza: multiplica por $\\sqrt{x+9}+3$. Queda $\\frac{1}{\\sqrt{x+9}+3}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{x+9}-3}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-22",
    "tema": "limites",
    "n": 22,
    "enunciado": "Calcula $\\lim_{x\\to 5}\\frac{\\sqrt{x+4}-3}{x-5}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{6}",
    "solucion": "Racionaliza: $\\frac{x+4-9}{(x-5)(\\sqrt{x+4}+3)}$. Cancela $x-5$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{x+4}-3}{x-5}",
      "punto": "5"
    }
  },
  {
    "id": "lim-23",
    "tema": "limites",
    "n": 23,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\sqrt{1+2x}-1}{x}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Racionaliza: $\\frac{2}{\\sqrt{1+2x}+1}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{1+2x}-1}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-24",
    "tema": "limites",
    "n": 24,
    "enunciado": "Calcula $\\lim_{x\\to 3}\\frac{\\sqrt{x+6}-3}{x-3}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{6}",
    "solucion": "Racionaliza: $\\frac{x-3}{(x-3)(\\sqrt{x+6}+3)}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{x+6}-3}{x-3}",
      "punto": "3"
    }
  },
  {
    "id": "lim-25",
    "tema": "limites",
    "n": 25,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\sqrt{4+x}-2}{x}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{4}",
    "solucion": "Racionaliza: $\\frac{1}{\\sqrt{4+x}+2}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{4+x}-2}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-26",
    "tema": "limites",
    "n": 26,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{1-\\cos x}{x^2}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{2}",
    "solucion": "Límite trigonométrico fundamental.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{1-\\cos x}{x^2}",
      "punto": "0"
    }
  },
  {
    "id": "lim-27",
    "tema": "limites",
    "n": 27,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\operatorname{sen} 5x}{x}$.",
    "tipo": "expresion",
    "respuesta": "5",
    "solucion": "Escribe $5\\cdot\\frac{\\operatorname{sen} 5x}{5x}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sin 5x}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-28",
    "tema": "limites",
    "n": 28,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\tan 3x}{x}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "Escribe $3\\cdot\\frac{\\tan 3x}{3x}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\tan 3x}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-29",
    "tema": "limites",
    "n": 29,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\operatorname{sen} 2x}{\\operatorname{sen} 7x}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{2}{7}",
    "solucion": "Reescribe como $\\frac{2}{7}\\cdot\\frac{\\operatorname{sen} 2x}{2x}\\cdot\\frac{7x}{\\operatorname{sen} 7x}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sin 2x}{\\sin 7x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-30",
    "tema": "limites",
    "n": 30,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{1-\\cos 4x}{x^2}$.",
    "tipo": "expresion",
    "respuesta": "8",
    "solucion": "Reescribe $\\frac{1-\\cos 4x}{x^2}=16\\cdot\\frac{1-\\cos 4x}{(4x)^2}$ y usa $\\lim_{u\\to 0}\\frac{1-\\cos u}{u^2}=\\frac{1}{2}$ con $u=4x$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{1-\\cos 4x}{x^2}",
      "punto": "0"
    }
  },
  {
    "id": "lim-31",
    "tema": "limites",
    "n": 31,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{3x^2+2x-1}{x^2-4}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "Divide entre $x^2$; dominan los coeficientes principales.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{3x^2+2x-1}{x^2-4}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-32",
    "tema": "limites",
    "n": 32,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{5x^3-x}{2x^3+7}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{5}{2}",
    "solucion": "Mismo grado: cociente de coeficientes principales.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{5x^3-x}{2x^3+7}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-33",
    "tema": "limites",
    "n": 33,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{2x+1}{x^2+3}$.",
    "tipo": "expresion",
    "respuesta": "0",
    "solucion": "El denominador crece más rápido que el numerador.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{2x+1}{x^2+3}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-34",
    "tema": "limites",
    "n": 34,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{4x^2-1}{x^3+2}$.",
    "tipo": "expresion",
    "respuesta": "0",
    "solucion": "Grado del denominador mayor: el cociente tiende a cero.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{4x^2-1}{x^3+2}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-35",
    "tema": "limites",
    "n": 35,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{7x^3+2}{x^2-1}$.",
    "tipo": "expresion",
    "respuesta": "\\infty",
    "solucion": "El grado del numerador es mayor; el término dominante es $7x$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{7x^3+2}{x^2-1}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-36",
    "tema": "limites",
    "n": 36,
    "enunciado": "Calcula $\\lim_{x\\to -\\infty}\\frac{7x^3+2}{x^2-1}$.",
    "tipo": "expresion",
    "respuesta": "-\\infty",
    "solucion": "El término dominante es $7x$; cuando $x\\to-\\infty$, $7x\\to-\\infty$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{7x^3+2}{x^2-1}",
      "punto": "-\\infty"
    }
  },
  {
    "id": "lim-37",
    "tema": "limites",
    "n": 37,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{\\sqrt{x^2+4x}}{x}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Para $x$ positivo: $\\frac{\\sqrt{x^2(1+4/x)}}{x}=\\sqrt{1+\\frac{4}{x}}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{x^2+4x}}{x}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-38",
    "tema": "limites",
    "n": 38,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{2x^2+3}{x^2-5x}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Divide entre $x^2$: $\\frac{2+3/x^2}{1-5/x}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{2x^2+3}{x^2-5x}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-39",
    "tema": "limites",
    "n": 39,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{x^2-3x}{4x^2+1}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{4}",
    "solucion": "Mismo grado: cociente $\\frac{1}{4}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-3x}{4x^2+1}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-40",
    "tema": "limites",
    "n": 40,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{6x^4+x}{3x^4-2}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Mismo grado: cociente $\\frac{6}{3}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{6x^4+x}{3x^4-2}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-41",
    "tema": "limites",
    "n": 41,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{e^x-1}{x}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Límite fundamental de la exponencial.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{e^x-1}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-42",
    "tema": "limites",
    "n": 42,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\ln(1+x)}{x}$.",
    "tipo": "expresion",
    "respuesta": "1",
    "solucion": "Límite fundamental del logaritmo natural.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\ln(1+x)}{x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-43",
    "tema": "limites",
    "n": 43,
    "enunciado": "Calcula $\\lim_{x\\to 2}\\frac{x^2-4}{x^2-3x+2}$.",
    "tipo": "expresion",
    "respuesta": "4",
    "solucion": "Factoriza: $\\frac{(x-2)(x+2)}{(x-1)(x-2)}$. Queda $\\frac{x+2}{x-1}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-4}{x^2-3x+2}",
      "punto": "2"
    }
  },
  {
    "id": "lim-44",
    "tema": "limites",
    "n": 44,
    "enunciado": "Calcula $\\lim_{x\\to 1}\\frac{x^2-3x+2}{x-1}$.",
    "tipo": "expresion",
    "respuesta": "-1",
    "solucion": "Factoriza: $\\frac{(x-1)(x-2)}{x-1}$. Queda $x-2$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-3x+2}{x-1}",
      "punto": "1"
    }
  },
  {
    "id": "lim-45",
    "tema": "limites",
    "n": 45,
    "enunciado": "Calcula $\\lim_{x\\to -2}\\frac{x^2-4}{x^2+3x+2}$.",
    "tipo": "expresion",
    "respuesta": "4",
    "solucion": "Factoriza: $\\frac{(x-2)(x+2)}{(x+1)(x+2)}$. Queda $\\frac{x-2}{x+1}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{x^2-4}{x^2+3x+2}",
      "punto": "-2"
    }
  },
  {
    "id": "lim-46",
    "tema": "limites",
    "n": 46,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\operatorname{sen} 4x}{\\operatorname{sen} 2x}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Reescribe usando los límites fundamentales: $\\frac{4}{2}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sin 4x}{\\sin 2x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-47",
    "tema": "limites",
    "n": 47,
    "enunciado": "Calcula $\\lim_{x\\to 0}\\frac{\\tan 2x}{\\operatorname{sen} 5x}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{2}{5}",
    "solucion": "Reescribe como $\\frac{\\tan 2x}{2x}\\cdot\\frac{5x}{\\operatorname{sen} 5x}\\cdot\\frac{2}{5}$ y usa los límites fundamentales.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\tan 2x}{\\sin 5x}",
      "punto": "0"
    }
  },
  {
    "id": "lim-48",
    "tema": "limites",
    "n": 48,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{\\sqrt{9x^2+x}}{x}$.",
    "tipo": "expresion",
    "respuesta": "3",
    "solucion": "Para $x$ positivo: $\\sqrt{9+\\frac{1}{x}}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{\\sqrt{9x^2+x}}{x}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-49",
    "tema": "limites",
    "n": 49,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{3x^2-x+1}{6x^2+4}$.",
    "tipo": "expresion",
    "respuesta": "\\frac{1}{2}",
    "solucion": "Mismo grado; cociente de coeficientes principales.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{3x^2-x+1}{6x^2+4}",
      "punto": "\\infty"
    }
  },
  {
    "id": "lim-50",
    "tema": "limites",
    "n": 50,
    "enunciado": "Calcula $\\lim_{x\\to \\infty}\\frac{8x^3-2x}{4x^3+5}$.",
    "tipo": "expresion",
    "respuesta": "2",
    "solucion": "Los polinomios tienen el mismo grado; se dividen los coeficientes principales: $\\frac{8}{4}$.",
    "chequeo": {
      "clase": "limite",
      "f": "\\frac{8x^3-2x}{4x^3+5}",
      "punto": "\\infty"
    }
  }
]
```

**Files**

- `src/data/banco/limites.json` — nuevo: 50 ejercicios de límites
- `scripts/verificar-banco.mjs` — nuevo: verificador de esquema, notación y matemática
- `tests/verificar-banco.test.ts` — nuevo: prueba el camino de falla del verificador
- `tests/fixtures/banco-malo/limites.json` — nuevo: banco con notación y respuesta falsas

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `npm run banco` runs with only `src/data/banco/limites.json` present **THE SYSTEM SHALL** exit 0, print `banco ok` and list the 3 missing topics as `pendiente`.
2. **WHEN** `npm run banco` evaluates each limit numerically near `chequeo.punto`, or at large x for infinity, **THE SYSTEM SHALL** find it equal to `respuesta` for all 50 items.
3. **WHEN** `scripts/verificar-banco.mjs` reads `tests/fixtures/banco-malo` **THE SYSTEM SHALL** exit 1 printing `FALLA lim-01: notación prohibida` and `FALLA lim-01: f(`.
4. **WHEN** `scripts/verificar-banco.mjs --completo` misses a topic file **THE SYSTEM SHALL** exit 1 printing `FALLA integrales: falta`.
5. **WHEN** `src/data/banco/limites.json` is read **THE SYSTEM SHALL** contain `Diferencia de cubos`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run banco
npm test -- tests/verificar-banco.test.ts
grep -q 'Diferencia de cubos' src/data/banco/limites.json
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T1: Construir banco de límites y verificador"
git tag step-03-banco-limites
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E2-T2` — Construir banco de continuidad

**Depends on:** `E2-T1` · **Priority:** p0, metadato para recortes, no un orden

Crea `src/data/banco/continuidad.json` desde la sección CONTINUIDAD de `fuente/ejercicios-pdf.txt`, en orden de `n`, con el mismo formato de los ejemplos de abajo.

- Excluye los números 6, 25, 26, 27, 28, 29, 30, 31, 34 y 43: sus respuestas no encajan. Quedan 40.
- `tipo: "opcion"` para los números 1 a 5, 7 a 24, 32, 33 y 35 a 40. `opciones` siempre es `["continua", "removible", "salto", "infinita"]` y `chequeo` es `{ "clase": "continuidad-tipo" }`.
- `respuesta` de los opcion: `removible` para 3, 4, 22, 24, 36. `salto` para 8, 11 a 20, 38, 40. `infinita` para 5. `continua` para 1, 2, 7, 9, 10, 21, 23, 32, 33, 35, 37, 39.
- `tipo: "expresion"` para 41, 42 y 44 a 50: la respuesta es k, sin escribir `k=`, y `chequeo` es `{ "clase": "continuidad-k" }`. Valores del PDF: 41 → `0`, 42 → `-1`, 44 → `2`, 45 → `1`, 46 → `2`, 47 → `1`, 48 → `4`, 49 → `2`, 50 → `11`.
- Enunciado opcion: `Sea $f(x)=...$. ¿Cómo es $f$ en $x=a$?`, con tramos en `\begin{cases}`. Los números 21 a 24, 35 y 36 definen el valor puntual como un segundo tramo.
- Enunciado expresion: `Sea $f(x)=\begin{cases}...\end{cases}$. Halla $k$ para que $f$ sea continua en $x=a$.`
- Del 11 al 20 limpia la notación del PDF: `1x+(-2)` → `x-2`, `-1x+(4)` → `-x+4`, `x²+(0)x+(1)`, y elimina los términos cero, de modo que `x²+(1)x+(0)` → `x^2+x` y `x²+(-1)x+(0)` → `x^2-x`.
- El número 8 usa `\lfloor x\rfloor`. El número 9 usa `\operatorname{sen} x`.
- `solucion` es el Procedimiento del PDF en una línea, con `$LaTeX$`. No uses la palabra "sin", ni `~`: el verificador las rechaza en cualquier texto mostrado.

Ejemplos exactos del formato:

```json
{
  "id": "con-11",
  "tema": "continuidad",
  "n": 11,
  "enunciado": "Sea $f(x)=\\begin{cases}2x+3 & x<0\\\\ x^2+x & x\\ge 0\\end{cases}$. ¿Cómo es $f$ en $x=0$?",
  "tipo": "opcion",
  "respuesta": "salto",
  "opciones": ["continua", "removible", "salto", "infinita"],
  "solucion": "Límite izquierdo $3$. Límite derecho y valor $0$. Los laterales no coinciden.",
  "chequeo": { "clase": "continuidad-tipo" }
}
```

```json
{
  "id": "con-41",
  "tema": "continuidad",
  "n": 41,
  "enunciado": "Sea $f(x)=\\begin{cases}kx+2 & x<1\\\\ x^2+1 & x\\ge 1\\end{cases}$. Halla $k$ para que $f$ sea continua en $x=1$.",
  "tipo": "expresion",
  "respuesta": "0",
  "solucion": "Izquierda $k+2$. Derecha $2$. Igualamos $k+2=2$.",
  "chequeo": { "clase": "continuidad-k" }
}
```

`tests/banco-continuidad.test.ts`

```ts
import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/continuidad.json";

const numeros = (filtro: (e: (typeof banco)[number]) => boolean) =>
  banco
    .filter(filtro)
    .map((e) => e.n)
    .sort((a, b) => a - b);
const rango = (desde: number, hasta: number) =>
  Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);

describe("banco de continuidad", () => {
  it("excluye los números que no encajan", () => {
    const excluidos = [6, 25, 26, 27, 28, 29, 30, 31, 34, 43];
    expect(banco.filter((e) => excluidos.includes(e.n))).toEqual([]);
    expect(banco).toHaveLength(40);
  });

  it("reparte las respuestas de opción", () => {
    expect(numeros((e) => e.respuesta === "removible")).toEqual([
      3, 4, 22, 24, 36,
    ]);
    expect(numeros((e) => e.respuesta === "salto")).toEqual([
      8,
      ...rango(11, 20),
      38,
      40,
    ]);
    expect(numeros((e) => e.respuesta === "infinita")).toEqual([5]);
  });

  it("deja como expresión solo los de hallar k", () => {
    expect(numeros((e) => e.tipo === "expresion")).toEqual([
      41,
      42,
      ...rango(44, 50),
    ]);
  });

  it("limpia la notación del 11 al 20", () => {
    for (const e of banco.filter((e) => e.n >= 11 && e.n <= 20)) {
      expect(e.enunciado).not.toContain("+(");
      expect(e.enunciado).not.toMatch(/\b1x/);
    }
  });
});
```

Formatea con `npm run format` antes de verificar.

**Files**

- `src/data/banco/continuidad.json` — nuevo: 40 ejercicios de continuidad
- `tests/banco-continuidad.test.ts` — nuevo: fija el reparto de respuestas y de tipos

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `npm run banco` runs **THE SYSTEM SHALL** exit 0 with `src/data/banco/continuidad.json` holding 40 items, each id `con-NN` matching a number of the PDF section.
2. **WHEN** `tests/banco-continuidad.test.ts` runs **THE SYSTEM SHALL** find no item with n in 6, 25, 26, 27, 28, 29, 30, 31, 34, 43.
3. **WHEN** `tests/banco-continuidad.test.ts` runs **THE SYSTEM SHALL** find `removible` exactly at 3, 4, 22, 24, 36, `salto` at 8, 11 to 20, 38, 40, and `infinita` only at 5.
4. **WHEN** `tests/banco-continuidad.test.ts` runs **THE SYSTEM SHALL** find `tipo` `expresion` exactly at 41, 42, 44 to 50.
5. **WHEN** a statement from 11 to 20 is read **THE SYSTEM SHALL** contain no `+(` or `1x` of the PDF's raw notation.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run banco
npm test -- tests/banco-continuidad.test.ts
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T2: Construir banco de continuidad"
git tag step-04-banco-continuidad
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E2-T3` — Construir banco de derivadas

**Depends on:** `E2-T1` · **Priority:** p0, metadato para recortes, no un orden

Crea `src/data/banco/derivadas.json` desde la sección DERIVADAS de `fuente/ejercicios-pdf.txt`, con los 50 ejercicios en orden de `n` y `tipo: "expresion"`.

- Enunciado general: `Halla $f'(x)$ para $f(x)=...$.`
- Números 33, 34 y 35: `Halla $f'(a)$ para $f(x)=...$.` con a = 2, -1 y 1. La respuesta es el número (`10`, `-11`, `5`) y `chequeo` lleva `en` con ese a.
- `respuesta` es solo el lado derecho en LaTeX, sin `f'(x)=`. Ejemplo: `20x^3-6x`.
- `chequeo` es `{ "clase": "derivada", "f": "<f en LaTeX>" }`. `chequeo.f` puede usar `\sin` porque no se muestra; en todo lo mostrado usa `\operatorname{sen}` y `\operatorname{arcsen}`.
- `solucion` es el Procedimiento del PDF en una línea, con `$LaTeX$`. No uses la palabra "sin" ni `~`.

Ejemplos exactos del formato:

```json
{
  "id": "der-22",
  "tema": "derivadas",
  "n": 22,
  "enunciado": "Halla $f'(x)$ para $f(x)=x^2\\operatorname{sen} x$.",
  "tipo": "expresion",
  "respuesta": "2x\\operatorname{sen} x+x^2\\cos x",
  "solucion": "Producto: $(2x)\\operatorname{sen} x+x^2\\cos x$.",
  "chequeo": { "clase": "derivada", "f": "x^2\\sin x" }
}
```

```json
{
  "id": "der-33",
  "tema": "derivadas",
  "n": 33,
  "enunciado": "Halla $f'(2)$ para $f(x)=x^4-6x^2+2x$.",
  "tipo": "expresion",
  "respuesta": "10",
  "solucion": "$f'(x)=4x^3-12x+2$; evalúa en $2$: $32-24+2$.",
  "chequeo": { "clase": "derivada", "f": "x^4-6x^2+2x", "en": 2 }
}
```

`tests/banco-derivadas.test.ts`

```ts
import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/derivadas.json";
import type { Ejercicio } from "../src/data/tipos.ts";

const lista = banco as unknown as Ejercicio[];

describe("banco de derivadas", () => {
  it("evalúa en el punto del PDF los números 33 a 35", () => {
    const puntos = lista
      .filter((e) => e.n >= 33 && e.n <= 35)
      .map((e) => [
        e.n,
        e.chequeo.clase === "derivada" && e.chequeo.en,
        e.respuesta,
      ]);
    expect(puntos).toEqual([
      [33, 2, "10"],
      [34, -1, "-11"],
      [35, 1, "5"],
    ]);
  });

  it("pide f'(x) en todos los demás", () => {
    for (const e of lista.filter((e) => e.n < 33 || e.n > 35)) {
      expect(e.enunciado).toContain("Halla $f'(x)$");
    }
  });

  it("guarda solo el lado derecho en la respuesta", () => {
    expect(lista.filter((e) => e.respuesta.includes("f'(x)="))).toEqual([]);
  });
});
```

Formatea con `npm run format` antes de verificar.

**Files**

- `src/data/banco/derivadas.json` — nuevo: 50 ejercicios de derivadas
- `tests/banco-derivadas.test.ts` — nuevo: fija enunciados y puntos de evaluación

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `npm run banco` runs **THE SYSTEM SHALL** exit 0 with `src/data/banco/derivadas.json` holding 50 items whose central difference of `chequeo.f` equals `respuesta`.
2. **WHEN** `tests/banco-derivadas.test.ts` runs **THE SYSTEM SHALL** find `chequeo.en` as 2, -1 and 1 at n = 33, 34, 35 with `respuesta` 10, -11 and 5.
3. **WHEN** `tests/banco-derivadas.test.ts` runs **THE SYSTEM SHALL** find the text `Halla $f'(x)$` in every other statement.
4. **WHEN** `tests/banco-derivadas.test.ts` runs **THE SYSTEM SHALL** find no `f'(x)=` inside any `respuesta`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run banco
npm test -- tests/banco-derivadas.test.ts
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T3: Construir banco de derivadas"
git tag step-05-banco-derivadas
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E2-T4` — Construir banco de integrales

**Depends on:** `E2-T2`, `E2-T3` · **Priority:** p0, metadato para recortes, no un orden

Crea `src/data/banco/integrales.json` desde la sección INTEGRALES de `fuente/ejercicios-pdf.txt`, con los 50 ejercicios en orden de `n` y `tipo: "expresion"`.

- Enunciado: `Calcula $\int ... \,dx$.` Las definidas llevan límites: `Calcula $\int_{0}^{2}3x^2\,dx$.`
- Indefinidas (1 a 30 y 41 a 50): `constante: true`, `respuesta` termina en `+C`, `chequeo` es `{ "clase": "integral", "f": "<integrando en LaTeX>" }`.
- Definidas (31 a 40): sin `constante`, `respuesta` sin C, y `chequeo` lleva `a` y `b` como números. El 33 usa `b: 3.141592653589793`, el 34 `b: 1.5707963267948966`, el 40 `b: 0.7853981633974483`. El 37 responde `21`, no la cuenta del PDF. El 35 responde `\ln 2` y el 36 `e-1`.
- `\operatorname{sen}` y `\operatorname{arcsen}` en todo lo mostrado; `chequeo.f` puede usar `\sin`. Valor absoluto con `|`, por ejemplo `2\ln|x|+C`.
- `solucion` es el Procedimiento del PDF en una línea, con `$LaTeX$`. No uses la palabra "sin" ni `~`.

Ejemplos exactos del formato:

```json
{
  "id": "int-15",
  "tema": "integrales",
  "n": 15,
  "enunciado": "Calcula $\\int(3\\cos x-2\\operatorname{sen} x)\\,dx$.",
  "tipo": "expresion",
  "respuesta": "3\\operatorname{sen} x+2\\cos x+C",
  "constante": true,
  "solucion": "Integra término a término: $3\\operatorname{sen} x+2\\cos x$.",
  "chequeo": { "clase": "integral", "f": "3\\cos x-2\\sin x" }
}
```

```json
{
  "id": "int-33",
  "tema": "integrales",
  "n": 33,
  "enunciado": "Calcula $\\int_{0}^{\\pi}\\operatorname{sen} x\\,dx$.",
  "tipo": "expresion",
  "respuesta": "2",
  "solucion": "Primitiva $-\\cos x$. Evalúa: $-\\cos\\pi+\\cos 0=1+1$.",
  "chequeo": { "clase": "integral", "f": "\\sin x", "a": 0, "b": 3.141592653589793 }
}
```

`tests/banco-integrales.test.ts`

```ts
import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/integrales.json";
import type { Ejercicio } from "../src/data/tipos.ts";

const lista = banco as unknown as Ejercicio[];
const definida = (n: number) => n >= 31 && n <= 40;

describe("banco de integrales", () => {
  it("marca las indefinidas con constante y +C", () => {
    for (const e of lista.filter((e) => !definida(e.n))) {
      expect(e.constante).toBe(true);
      expect(e.respuesta.endsWith("+C")).toBe(true);
    }
  });

  it("deja las definidas sin constante y con límites numéricos", () => {
    for (const e of lista.filter((e) => definida(e.n))) {
      expect(e.constante).toBeUndefined();
      expect(e.respuesta).not.toContain("C");
      expect(e.chequeo.clase === "integral" && typeof e.chequeo.a).toBe(
        "number",
      );
      expect(e.chequeo.clase === "integral" && typeof e.chequeo.b).toBe(
        "number",
      );
    }
  });
});
```

Formatea con `npm run format` antes de verificar.

**Files**

- `src/data/banco/integrales.json` — nuevo: 50 ejercicios de integrales
- `tests/banco-integrales.test.ts` — nuevo: fija indefinidas y definidas

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `npm run banco -- --completo` runs **THE SYSTEM SHALL** exit 0 with the four topic files present and totals 50, 40, 50, 50.
2. **WHEN** `npm run banco` checks an indefinite integral **THE SYSTEM SHALL** find the central difference of `respuesta` equal to `chequeo.f`.
3. **WHEN** `npm run banco` checks a definite integral **THE SYSTEM SHALL** find the Simpson value equal to `respuesta`.
4. **WHEN** `tests/banco-integrales.test.ts` runs **THE SYSTEM SHALL** find `constante` true and a final `+C` at n = 1 to 30 and 41 to 50, and neither at n = 31 to 40.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run banco -- --completo
npm test -- tests/banco-integrales.test.ts
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T4: Construir banco de integrales"
git tag step-06-banco-integrales
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

---

## Epic acceptance

El epic termina cuando cada tarea está `done` y además:

1. **WHEN** `npm run banco -- --completo` runs **THE SYSTEM SHALL** exit 0 printing `banco ok`.

```bash
npm run format:check && npm test && npm run build
npm run banco -- --completo
```

## Pitfalls

- **Heredocs** — destruyen las barras invertidas. Escribe los JSON con la herramienta de edición.
- **Un fallo de `verificar-banco`** significa que la respuesta o `chequeo.f` están mal. No edites el verificador.
- **π en `chequeo`** — `a` y `b` son números, no LaTeX.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag; `git tag -l 'step-*'` los lista.
- [ ] El gate pasa limpio desde la raíz del proyecto.
- [ ] Cada contrato de "Produced" existe con esa firma.
- [ ] No se tocó ningún archivo fuera del subárbol.
- [ ] Un commit por tarea, con el id de la tarea, seguido de su tag.
