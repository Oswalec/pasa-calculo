# Epic 03: Motor

> Existen el corrector numérico, probado contra los cuatro bancos, y el progreso con racha.

| | |
|---|---|
| **Epic id** | `03-motor` |
| **Tasks** | `E3-T1` … `E3-T2` |
| **Depends on** | 01-base, 02-banco |
| **Unlocks** | 04-pantallas |
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
src/lib/corrector.ts       # NUEVO
src/lib/corrector.test.ts  # NUEVO
src/lib/progreso.ts        # NUEVO
src/lib/progreso.test.ts   # NUEVO
src/data/banco/*.json      # existe, solo lectura
```

Todo lo demás queda fuera de alcance. Si una tarea parece requerir otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Progreso` | `resultados` | fecha de Lima → tema → aciertos, en `localStorage` bajo `pasa-calculo:v1` |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `02-banco` | `src/data/banco/*.json` | 190 ejercicios verificados |
| `01-base` | `src/lib/fechas.ts` → `diasEntre` | días calendario |

**Produced** — los epics siguientes dependen de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `src/lib/corrector.ts` → `corregir` | `(alumno, esperado, constante?) => Veredicto` | 04 |
| `src/lib/progreso.ts` → `guardarResultado`, `resultadoDe`, `racha` | ver paso 8 | 04 |

## Conventions that bite in this area

- `corrector.ts` se importa solo con `import()` desde la isla.
- `ce.parse('').isValid` es true: el vacío se revisa antes de parsear.
- `\operatorname{sen}` se traduce con espacio final: sin él, `\sinx` da NaN.

Reglas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/contenido.md` y `.claude/rules/pantallas.md`.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el de construcción.

### `E3-T1` — Implementar corrector

**Depends on:** `E2-T2`, `E2-T3`, `E2-T4` · **Priority:** p0, metadato para recortes, no un orden

Implementa el corrector numérico sobre Compute Engine. Este módulo solo se importa de forma dinámica desde la isla, para que Inicio siga ligero. Copia estos dos archivos tal cual. Las pruebas usan `String.raw` porque los heredocs de Bash destruyen las barras invertidas: escribe los archivos con la herramienta de edición, no con un heredoc.

`src/lib/corrector.ts`

```ts
import { ComputeEngine } from "@cortex-js/compute-engine";

export type Veredicto =
  | { estado: "invalido" }
  | { estado: "correcto"; faltaC: boolean }
  | { estado: "incorrecto" };

const PUNTOS = [-2.71, -1.37, -0.83, -0.41, 0.23, 0.37, 0.81, 1.43, 2.19, 2.77];
const MINIMO_PUNTOS = 4;
const TOLERANCIA = 1e-6;
const INFINITOS = ["\\infty", "-\\infty"];

const ce = new ComputeEngine();

/** Deja solo la expresión: quita lo anterior al último "=" y traduce sen y arcsen. */
export function normalizar(latex: string): string {
  const derecha = latex.slice(latex.lastIndexOf("=") + 1).trim();
  return derecha
    .replaceAll("\\operatorname{sen}", "\\sin ")
    .replaceAll("\\operatorname{arcsen}", "\\arcsin ");
}

function valor(latex: string, x: number): number {
  return Number(ce.parse(latex).subs({ x, C: 0 }).N().re);
}

const iguales = (p: number, q: number): boolean =>
  Math.abs(p - q) <= TOLERANCIA * Math.max(1, Math.abs(p), Math.abs(q));

/** Compara la respuesta del alumno con la esperada del banco. Lanza si el banco está mal. */
export function corregir(
  alumno: string,
  esperado: string,
  constante = false,
): Veredicto {
  const texto = normalizar(alumno);
  if (texto === "") return { estado: "invalido" };
  const expresion = ce.parse(texto);
  if (!expresion.isValid) return { estado: "invalido" };

  if (INFINITOS.includes(esperado)) {
    const coincide =
      JSON.stringify(expresion.json) ===
      JSON.stringify(ce.parse(esperado).json);
    return coincide
      ? { estado: "correcto", faltaC: false }
      : { estado: "incorrecto" };
  }

  const objetivo = normalizar(esperado);
  const diferencias: number[] = [];
  for (const x of PUNTOS) {
    const p = valor(objetivo, x);
    if (!Number.isFinite(p)) continue;
    const q = valor(texto, x);
    if (!Number.isFinite(q)) return { estado: "incorrecto" };
    diferencias.push(q - p);
  }
  if (diferencias.length < MINIMO_PUNTOS) {
    throw new Error(`Banco: menos de ${MINIMO_PUNTOS} puntos para ${esperado}`);
  }

  if (constante) {
    const primera = diferencias[0] as number;
    const coincide = diferencias.every((d) => iguales(d, primera));
    if (!coincide) return { estado: "incorrecto" };
    return { estado: "correcto", faltaC: !expresion.unknowns.includes("C") };
  }
  const coincide = diferencias.every((d) => iguales(d, 0));
  return coincide
    ? { estado: "correcto", faltaC: false }
    : { estado: "incorrecto" };
}
```

`src/lib/corrector.test.ts`

```ts
import { describe, expect, it } from "vitest";
import type { Ejercicio } from "../data/tipos.ts";
import continuidad from "../data/banco/continuidad.json";
import derivadas from "../data/banco/derivadas.json";
import integrales from "../data/banco/integrales.json";
import limites from "../data/banco/limites.json";
import { corregir, normalizar } from "./corrector.ts";

const r = String.raw;
const bancos = [
  limites,
  continuidad,
  derivadas,
  integrales,
] as unknown as Ejercicio[][];
const expresiones = bancos.flat().filter((e) => e.tipo === "expresion");
const CORRECTO = { estado: "correcto", faltaC: false };

describe("normalizar", () => {
  it("toma lo que sigue al último igual y traduce sen", () => {
    expect(normalizar(r`f'(x)=\operatorname{sen}x`)).toBe(r`\sin x`);
    expect(normalizar(r`\operatorname{arcsen}x`)).toBe(r`\arcsin x`);
  });
});

describe("equivalencias", () => {
  it.each([
    [r`2\operatorname{sen}x\cos x`, r`\operatorname{sen}2x`],
    [r`\frac{1}{2\sqrt{x}}`, r`0.5x^{-\frac12}`],
    [r`\ln\left|x^2+1\right|`, r`\ln(x^2+1)`],
    [r`\sec^2x`, r`1+\tan^2x`],
    [r`e^x(x^2+2x)`, r`2xe^x+x^2e^x`],
    [r`-\csc^2x`, r`-\frac{1}{\operatorname{sen}^2x}`],
  ])("%s equivale a %s", (alumno, esperado) => {
    expect(corregir(alumno, esperado)).toEqual(CORRECTO);
  });

  it.each([
    ["5", "6"],
    ["x^2", "x^3"],
    ["t^2", "x^2"],
  ])("%s no equivale a %s", (alumno, esperado) => {
    expect(corregir(alumno, esperado)).toEqual({ estado: "incorrecto" });
  });
});

describe("casos límite", () => {
  it("marca inválido lo vacío y lo que no se puede leer", () => {
    expect(corregir("  ", "2")).toEqual({ estado: "invalido" });
    expect(corregir("x=", "2")).toEqual({ estado: "invalido" });
  });

  it("compara infinitos por forma", () => {
    expect(corregir(r`\infty`, r`\infty`)).toEqual(CORRECTO);
    expect(corregir(r`-\infty`, r`\infty`)).toEqual({ estado: "incorrecto" });
  });

  it("acepta otra constante y detecta la falta de C", () => {
    expect(corregir(r`x^2+C`, r`x^2+C`, true)).toEqual(CORRECTO);
    expect(corregir(r`x^2+7`, r`x^2+C`, true)).toEqual({
      estado: "correcto",
      faltaC: true,
    });
    expect(corregir(r`x^3+C`, r`x^2+C`, true)).toEqual({
      estado: "incorrecto",
    });
  });
});

describe("bancos", () => {
  it.each(expresiones.map((e) => [e.id, e] as const))(
    "%s se corrige a sí mismo",
    (_id, e) => {
      expect(corregir(e.respuesta, e.respuesta, e.constante).estado).toBe(
        "correcto",
      );
    },
  );

  it.each(expresiones.map((e) => [e.id, e] as const))(
    "%s rechaza una falsa",
    (_id, e) => {
      const infinita = e.respuesta.endsWith(r`\infty`);
      const falsa = infinita ? "0" : r`\left(${e.respuesta}\right)+x`;
      expect(corregir(falsa, e.respuesta, e.constante).estado).toBe(
        "incorrecto",
      );
    },
  );
});
```

**Files**

- `src/lib/corrector.ts` — nuevo: `normalizar`, `corregir`
- `src/lib/corrector.test.ts` — nuevo: equivalencias y autocorrección de los cuatro bancos

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `corregir` compares equivalent forms such as `2\operatorname{sen}x\cos x` and `\operatorname{sen}2x` **THE SYSTEM SHALL** return `correcto`.
2. **WHEN** `corregir` receives `x=` or blank text **THE SYSTEM SHALL** return `invalido` and consume no attempt.
3. **WHEN** `corregir` receives `t^2` for `x^2` **THE SYSTEM SHALL** return `incorrecto`.
4. **WHEN** an item has `constante` true and the student omits C **THE SYSTEM SHALL** return `correcto` with `faltaC` true.
5. **WHEN** `tests` run over every `tipo` `expresion` item of the four banks **THE SYSTEM SHALL** grade its own `respuesta` as `correcto`.
6. **WHEN** `tests` run over every `tipo` `expresion` item of the four banks **THE SYSTEM SHALL** grade a false answer as `incorrecto`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm test -- src/lib/corrector.test.ts
npm run banco -- --completo
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E3-T1: Implementar corrector"
git tag step-07-corrector
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E3-T2` — Guardar progreso y racha

**Depends on:** `E1-T2` · **Priority:** p0, metadato para recortes, no un orden

Implementa `src/lib/progreso.ts` con la clave `pasa-calculo:v1`. El valor guardado es exactamente `{ "resultados": { "2026-03-10": { "limites": 2 } } }`: fecha de Lima, tema y aciertos. Toda lectura y escritura va en `try/catch` y, si el almacenamiento falla, el reto sigue funcionando sin guardar.

Exporta estas firmas. `almacen` existe para probar en Node, que no tiene `localStorage`:

```ts
type Almacen = Pick<Storage, "getItem" | "setItem">;
export function guardarResultado(tema: Tema, fecha: string, aciertos: number, almacen?: Almacen): void;
export function resultadoDe(tema: Tema, fecha: string, almacen?: Almacen): number | null;
export function racha(hoy: string, almacen?: Almacen): number;
```

`racha` cuenta fechas consecutivas de Lima con al menos un resultado, terminando hoy o ayer. Si la última fecha es anterior a ayer, vale 0. Usa `diasEntre` de `src/lib/fechas.ts`.

`src/lib/progreso.test.ts` usa un almacén falso en memoria y cubre: guardar y leer, tema no hecho devuelve `null`, racha de 3 días, racha terminando ayer, racha rota por un día vacío, JSON corrupto devuelve `null` y 0 sin lanzar, y un almacén cuyo `setItem` lanza no rompe `guardarResultado`.

**Files**

- `src/lib/progreso.ts` — nuevo: resultados y racha
- `src/lib/progreso.test.ts` — nuevo: pruebas con almacén falso

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `guardarResultado("limites", "2026-03-10", 2)` runs **THE SYSTEM SHALL** store `{"resultados":{"2026-03-10":{"limites":2}}}` under the key `pasa-calculo:v1`.
2. **WHEN** results exist on 3 consecutive Lima dates ending today **THE SYSTEM SHALL** return `racha` 3.
3. **WHEN** the latest result is yesterday **THE SYSTEM SHALL** keep the streak, and WHEN it is older THE SYSTEM SHALL return `racha` 0.
4. **WHEN** stored JSON is corrupt **THE SYSTEM SHALL** return `null` from `resultadoDe` and 0 from `racha` without throwing.
5. **WHEN** `setItem` throws **THE SYSTEM SHALL** finish `guardarResultado` without throwing.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm test -- src/lib/progreso.test.ts
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E3-T2: Guardar progreso y racha"
git tag step-08-progreso
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

---

## Epic acceptance

El epic termina cuando cada tarea está `done` y además:

1. **WHEN** `npm test` runs **THE SYSTEM SHALL** grade every `expresion` item's own `respuesta` as `correcto`.

```bash
npm run format:check && npm test && npm run build
```

## Pitfalls

- **Falsa de prueba** — sumar `+1` a una integral sigue siendo correcto. Por eso la prueba suma `x`.
- **Node no tiene `localStorage`** — `progreso.ts` recibe `almacen` para probarlo.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag; `git tag -l 'step-*'` los lista.
- [ ] El gate pasa limpio desde la raíz del proyecto.
- [ ] Cada contrato de "Produced" existe con esa firma.
- [ ] No se tocó ningún archivo fuera del subárbol.
- [ ] Un commit por tarea, con el id de la tarea, seguido de su tag.
