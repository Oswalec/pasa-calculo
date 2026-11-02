# Epic 04: Pantallas

> Existen las cuatro pantallas de la isla, del tema al botón de WhatsApp y la tarjeta para compartir.

| | |
|---|---|
| **Epic id** | `04-pantallas` |
| **Tasks** | `E4-T1` … `E4-T5` |
| **Depends on** | 02-banco, 03-motor |
| **Unlocks** | 05-entrega |
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
src/pages/index.astro         # existe, editar: montar la isla
src/components/Reto.tsx       # NUEVO, se edita en cada tarea
src/components/Inicio.tsx     # NUEVO
src/components/Ejercicio.tsx  # NUEVO
src/components/Formula.tsx    # NUEVO
src/components/Respuesta.tsx  # NUEVO
src/components/Resultado.tsx  # NUEVO
src/lib/banco.ts              # NUEVO
src/lib/teclado.ts            # NUEVO
src/lib/tarjeta.ts            # NUEVO
e2e/*.spec.ts                 # NUEVO, un spec por tarea
```

Todo lo demás queda fuera de alcance. Si una tarea parece requerir otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Ejercicio` | lee todos | desde `cargarBanco(tema)` |
| `Progreso` | escribe `resultados` | solo por `src/lib/progreso.ts` |

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `03-motor` | `corregir`, `guardarResultado`, `resultadoDe`, `racha` | ver `src/lib/corrector.ts` y `src/lib/progreso.ts` |
| `01-base` | `fechaLima`, `cuentaRegresiva`, `retoDeHoy`, `ETIQUETA_OPCION` | ver `src/lib/` |

**Produced** — los epics siguientes dependen de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `src/components/Reto.tsx` | isla sin props, montada con `client:only="preact"` | 05 |

## Conventions that bite in this area

- Una pantalla, una decisión, un botón primario. Sin menús, instrucciones, temporizador ni vidas.
- `npm run e2e` usa `npm run preview`: construye antes con `npm run build`.
- Fija la fecha con `page.clock.setFixedTime` antes de `page.goto("./")`.
- En los specs lee los JSON con `readFileSync`, no con `import`.
- Verde y rojo solo para retroalimentación.

Reglas del proyecto: `CLAUDE.md`. Reglas por área: `.claude/rules/contenido.md` y `.claude/rules/pantallas.md`.

---

## Tasks

En el mismo orden que `tasks.json`. Ese orden es el de construcción.

### `E4-T1` — Crear isla Reto y pantalla Inicio

**Depends on:** `E2-T2`, `E2-T3`, `E2-T4`, `E3-T2` · **Priority:** p0, metadato para recortes, no un orden

Monta la isla Preact en la única ruta con `<Reto client:only="preact" />` dentro de `main` en `src/pages/index.astro`.

- `src/lib/banco.ts`: `cargarBanco(tema)` con cuatro `import()` dinámicos de los JSON, devolviendo `Ejercicio[]`. No importes los JSON de forma estática.
- `src/components/Reto.tsx`: máquina de estados con `useState`, sin signals y sin rutas. Estados: `inicio`, `ejercicio`, `respuesta`, `resultado`. Tocar un tema carga el banco, llama a `retoDeHoy(banco, fechaLima())` y pasa a `ejercicio` con índice 0 y 0 aciertos. Mientras no existan las otras pantallas, `ejercicio` muestra solo un `h1` con `1 de 3`.
- `src/components/Inicio.tsx`: `h1` `Reto de hoy: 3 ejercicios`, cuatro `button class="boton"` con `Límites`, `Continuidad`, `Derivadas`, `Integrales`, la línea `Racha: N días` con clase `discreto` solo si `racha(fechaLima()) > 0` (con N = 1 escribe `Racha: 1 día`), y la firma `CEC | Cálculo` con clase `discreto`.
- `e2e/inicio.spec.ts`: fija la fecha con `await page.clock.setFixedTime(new Date("2026-03-10T17:00:00Z"))` antes de `page.goto("./")`. Siembra racha con `page.addInitScript` escribiendo `pasa-calculo:v1` en `localStorage`.

**Files**

- `src/components/Reto.tsx` — nuevo: la isla y su máquina de estados
- `src/components/Inicio.tsx` — nuevo: pantalla 1
- `src/lib/banco.ts` — nuevo: carga dinámica por tema
- `src/pages/index.astro` — editar: montar la isla
- `e2e/inicio.spec.ts` — nuevo: prueba de Inicio

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `/` loads with no stored progress **THE SYSTEM SHALL** show the heading `Reto de hoy: 3 ejercicios`, four buttons `Límites`, `Continuidad`, `Derivadas`, `Integrales`, the text `CEC | Cálculo`, and no `Racha` line.
2. **WHEN** `pasa-calculo:v1` holds results for today and yesterday **THE SYSTEM SHALL** show `Racha: 2 días`.
3. **WHEN** Inicio has loaded **THE SYSTEM SHALL** leave `customElements.get("math-field")` undefined, proving MathLive is not loaded yet.
4. **WHEN** the student taps `Límites` **THE SYSTEM SHALL** show `1 de 3`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e -- e2e/inicio.spec.ts
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E4-T1: Crear isla Reto y pantalla Inicio"
git tag step-09-inicio
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E4-T2` — Crear pantalla Ejercicio con teclado

**Depends on:** `E3-T1`, `E4-T1` · **Priority:** p0, metadato para recortes, no un orden

Construye la pantalla 2 y conéctala en `Reto.tsx`.

- `src/components/Formula.tsx`: recibe texto con `$LaTeX$`, lo parte por `$` y pinta cada tramo con `katex.renderToString(tramo, { throwOnError: false })`. Importa `katex/dist/katex.min.css` aquí. Los tramos de texto se pintan como texto, nunca como HTML.
- `src/lib/teclado.ts`: cópialo tal cual.

```ts
import type { Tema } from "../data/tipos.ts";

type Tecla =
  string | { label?: string; latex?: string; insert?: string; class?: string };

const DIGITOS_1: Tecla[] = ["7", "8", "9", "+", "-"];
const DIGITOS_2: Tecla[] = ["4", "5", "6", { label: "×", insert: "\\cdot " }];
const DIGITOS_3: Tecla[] = ["1", "2", "3", "/"];
const BASE_4: Tecla[] = ["0", "(", ")", "x", "[backspace]"];
const FORMA: Tecla[] = [
  { label: "a/b", insert: "\\frac{#@}{#?}" },
  { label: "xⁿ", insert: "#@^{#?}" },
  { label: "√", insert: "\\sqrt{#?}" },
];
const SEN = { label: "sen", insert: "\\operatorname{sen}" };
const ARCSEN = {
  label: "arcsen",
  insert: "\\operatorname{arcsen}",
  class: "small",
};
const ARCTAN = { label: "arctan", insert: "\\arctan", class: "small" };
const funcion = (nombre: string) => ({
  label: nombre,
  insert: `\\${nombre}`,
});
const TRIGO: Tecla[] = [
  SEN,
  funcion("cos"),
  funcion("tan"),
  funcion("sec"),
  funcion("csc"),
  funcion("cot"),
];
const OTRAS: Tecla[] = [
  funcion("ln"),
  { label: "e", latex: "e" },
  ARCSEN,
  ARCTAN,
  { label: "|x|", insert: "\\left|#?\\right|" },
];

/** Filas del teclado de cada tema. Solo `rows`: sin capas, sin barra de edición. */
export function filasTeclado(tema: Tema): Tecla[][] {
  const forma: Tecla[] = [...FORMA];
  if (tema === "limites") forma.push({ label: "∞", latex: "\\infty" });
  if (tema === "integrales") forma.push({ label: "C", latex: "C" });
  const base = [
    [...DIGITOS_1],
    [...DIGITOS_2, ...forma.slice(0, 1)],
    [...DIGITOS_3, ...forma.slice(1)],
    [...BASE_4],
  ];
  if (tema === "derivadas" || tema === "integrales") {
    return [TRIGO, OTRAS, ...base];
  }
  return base;
}

/** Disposición que recibe `window.mathVirtualKeyboard.layouts`. */
export function disposicionTeclado(tema: Tema) {
  return {
    id: `teclado-${tema}`,
    label: tema,
    displayShiftedKeycaps: false,
    displayEditToolbar: false,
    rows: filasTeclado(tema),
  };
}
```

- `src/components/Ejercicio.tsx`: muestra `h1` con `1 de 3`, el enunciado con `Formula` y `class="enunciado"`, y según `tipo`: `math-field` o cuatro botones grandes con `ETIQUETA_OPCION`. El botón primario `Comprobar` está deshabilitado mientras no haya valor.
- Al entrar a esta pantalla, y nunca antes, carga en este orden. Los identificadores salen de los tipos publicados de MathLive. El `Verify` de este paso comprueba `customElements.get("math-field")`, y ahí se confirma que `import("mathlive")` registra el elemento:

```ts
await import("mathlive/fonts.css");
const { MathfieldElement } = await import("mathlive");
MathfieldElement.fontsDirectory = null; // las fuentes ya vienen de mathlive/fonts.css
MathfieldElement.soundsDirectory = null;
MathfieldElement.computeEngine = null;
const { corregir } = await import("../lib/corrector.ts");
```

- `math-field` lleva `math-virtual-keyboard-policy="manual"` y `aria-label="Tu respuesta"`. En un `useEffect`, después de montarlo: asigna `window.mathVirtualKeyboard.layouts = [disposicionTeclado(tema)]`, llama a `el.focus()` y a `window.mathVirtualKeyboard.show()`. Así abre en teléfono y en escritorio. Lee el valor con `onInput` y `event.target.value`.
- Para que Preact acepte el elemento en TypeScript, declara en `Ejercicio.tsx`: `declare module "preact" { namespace JSX { interface IntrinsicElements { "math-field": any } } }`.
- `Comprobar` llama a `corregir(valor, ej.respuesta, ej.constante)`. Si devuelve `invalido`, muestra `Revisa tu respuesta` en un `p` con `role="status"`, se queda en el mismo ejercicio y no cuenta intento. Si no, pasa a `respuesta`. En `opcion`, tocar una opción la selecciona y `Comprobar` compara la clave.
- `e2e/ejercicio.spec.ts` fija la fecha `2026-01-01T17:00:00Z`. Para escribir en el campo usa `page.locator("math-field").evaluate((el: HTMLInputElement, v: string) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, valor)`.

**Files**

- `src/components/Ejercicio.tsx` — nuevo: pantalla 2
- `src/components/Formula.tsx` — nuevo: texto con KaTeX
- `src/lib/teclado.ts` — nuevo: filas por tema
- `src/components/Reto.tsx` — editar: conectar la pantalla
- `e2e/ejercicio.spec.ts` — nuevo: prueba de Ejercicio

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** the student enters `Derivadas` **THE SYSTEM SHALL** show `1 de 3`, a `.katex` statement, a `math-field`, `Comprobar` disabled, `customElements.get("math-field")` defined and `window.mathVirtualKeyboard.visible` true.
2. **WHEN** a value is set in `math-field` **THE SYSTEM SHALL** enable `Comprobar`.
3. **WHEN** the value `x=` is checked **THE SYSTEM SHALL** show `Revisa tu respuesta` and keep `1 de 3`.
4. **WHEN** the student enters `Continuidad` on `2026-01-01` **THE SYSTEM SHALL** show the buttons `Continua`, `Discontinua removible`, `Discontinua de salto`, `Discontinua infinita` and no `math-field`.
5. **WHEN** `JSON.stringify(window.mathVirtualKeyboard.layouts)` is read **THE SYSTEM SHALL** contain `∞` and no `arcsen` in `Límites`, contain `arcsen` and no `∞` in `Derivadas`, and contain the key `C` label in `Integrales`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e -- e2e/ejercicio.spec.ts
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E4-T2: Crear pantalla Ejercicio con teclado"
git tag step-10-ejercicio
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E4-T3` — Crear pantalla Respuesta

**Depends on:** `E4-T2` · **Priority:** p0, metadato para recortes, no un orden

Construye la pantalla 3 y conéctala en `Reto.tsx`, que suma un acierto cuando corresponde.

- Muestra `✓ Correcto` con clase `acierto` o `✗ Incorrecto` con clase `error` en un `h1`. El texto acompaña al color, y la región lleva `role="status"`.
- Muestra la respuesta correcta: con `Formula` en `expresion`, con `ETIQUETA_OPCION` en `opcion`. Debajo, la `solucion` con `Formula`.
- Si `faltaC` es true, muestra `Correcto. Recuerda escribir el +C.` en vez de `✓ Correcto`, y cuenta como acierto.
- El botón primario dice `Siguiente`; en el tercer ejercicio dice `Ver resultado`.
- `e2e/respuesta.spec.ts` fija la fecha `2026-01-01T17:00:00Z` y obtiene las respuestas leyendo el JSON con `readFileSync` y `retoDeHoy` de `src/lib/retos.ts`.

**Files**

- `src/components/Respuesta.tsx` — nuevo: pantalla 3
- `src/components/Reto.tsx` — editar: conectar la pantalla y contar aciertos
- `e2e/respuesta.spec.ts` — nuevo: prueba de Respuesta

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** the correct `respuesta` is checked **THE SYSTEM SHALL** show `✓ Correcto` with the green class `acierto`, the correct answer in `.katex` and the `solucion`.
2. **WHEN** a false answer is checked **THE SYSTEM SHALL** show `✗ Incorrecto` with the red class `error` and the correct answer.
3. **WHEN** an indefinite integral is answered correctly without C **THE SYSTEM SHALL** show `Correcto. Recuerda escribir el +C.`.
4. **WHEN** the third exercise has been checked **THE SYSTEM SHALL** label the primary button `Ver resultado`, and on the first two `Siguiente`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e -- e2e/respuesta.spec.ts
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E4-T3: Crear pantalla Respuesta"
git tag step-11-respuesta
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E4-T4` — Crear pantalla Resultado y WhatsApp

**Depends on:** `E4-T3` · **Priority:** p0, metadato para recortes, no un orden

Construye la pantalla 4 y guarda el resultado al llegar a ella con `guardarResultado`.

- `h1` con `N de 3`. Nivel: 0 o 1 aciertos `Aquí te conviene reforzar`, 2 `Vas bien, te falta poco`, 3 `¡Excelente!`.
- La frase literal `Te acompañaré hasta que logres pasar el cálculo que necesites`.
- Enlace primario `<a class="boton boton-primario" href="https://wa.link/de928w" target="_blank" rel="noopener">Quiero que me acompañes</a>`. La URL es fija: nunca arma un mensaje.
- Línea `discreto` con la racha y `Nuevo reto en HH:MM:SS`, usando `cuentaRegresiva()` y actualizando cada segundo con `setInterval`, que se limpia al desmontar.
- En `Reto.tsx`, al tocar un tema ya hecho hoy según `resultadoDe(tema, fechaLima())`, salta directo a `resultado` con ese puntaje.
- `e2e/resultado.spec.ts` fija `2026-01-01T17:00:00Z` y completa `Límites` tres veces, en contextos limpios: con 3, con 2 y con 0 aciertos.

**Files**

- `src/components/Resultado.tsx` — nuevo: pantalla 4
- `src/components/Reto.tsx` — editar: guardar y saltar si ya está hecho
- `e2e/resultado.spec.ts` — nuevo: prueba de Resultado

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** three correct answers are given **THE SYSTEM SHALL** show `3 de 3` and `¡Excelente!`.
2. **WHEN** two or fewer correct answers are given **THE SYSTEM SHALL** show `Vas bien, te falta poco` for 2 and `Aquí te conviene reforzar` for 0.
3. **WHEN** Resultado is shown **THE SYSTEM SHALL** show the phrase `Te acompañaré hasta que logres pasar el cálculo que necesites` and a link `Quiero que me acompañes` with href exactly `https://wa.link/de928w`, `target` `_blank` and `rel` containing `noopener`.
4. **WHEN** Resultado is shown **THE SYSTEM SHALL** show text matching `Nuevo reto en \d\d:\d\d:\d\d`.
5. **WHEN** the page reloads and the student taps the finished topic **THE SYSTEM SHALL** go straight to Resultado with the same score.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e -- e2e/resultado.spec.ts
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E4-T4: Crear pantalla Resultado y WhatsApp"
git tag step-12-resultado
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

### `E4-T5` — Crear tarjeta para compartir

**Depends on:** `E4-T4` · **Priority:** p1, metadato para recortes, no un orden

Agrega en Resultado el enlace pequeño `Compartir resultado`, un `button class="enlace-pequeno"`.

- `src/lib/tarjeta.ts` exporta `crearTarjeta({ tema, aciertos }): Promise<Blob>` y `compartirTarjeta(blob): Promise<void>`. Dibuja en un `canvas` de 1080×1920, sobre fondo `--negro`, en durazno y texto: `Pasa Cálculo`, el nombre del tema, `N de 3` y `oswalec.github.io/pasa-calculo`. Lee los colores con `getComputedStyle(document.documentElement).getPropertyValue("--negro")`. Antes de dibujar espera `document.fonts.load("800 96px Poppins")`.
- Crea `new File([blob], "pasa-calculo-resultado.png", { type: "image/png" })`. Si `navigator.canShare?.({ files: [file] })` es true usa `navigator.share({ files: [file] })`; si no, descarga con un `a` con atributo `download`. No hay servicios externos.
- `e2e/compartir.spec.ts`: para la descarga, usa `page.addInitScript` que deja `navigator.canShare` en `undefined`, captura con `page.waitForEvent("download")` y lee ancho y alto del bloque IHDR del PNG (`readUInt32BE(16)` y `readUInt32BE(20)`). Para Web Share, el init script define `canShare` que devuelve true y `share` que guarda `files[0].type` y `files[0].name` en `window`. Registra `page.on("request")` y exige que cada URL empiece con `http://localhost:4321/` o `data:` o `blob:`.

**Files**

- `src/lib/tarjeta.ts` — nuevo: dibujo y compartir
- `src/components/Resultado.tsx` — editar: enlace `Compartir resultado`
- `e2e/compartir.spec.ts` — nuevo: prueba de descarga y de Web Share

**Acceptance**

Copiados del arreglo `acceptance` de esta tarea en `tasks.json`.

1. **WHEN** `navigator.canShare` is unavailable and the student taps `Compartir resultado` **THE SYSTEM SHALL** download `pasa-calculo-resultado.png`, a PNG of 1080 by 1920 pixels.
2. **WHEN** `navigator.canShare` returns true **THE SYSTEM SHALL** call `navigator.share` with one `image/png` file named `pasa-calculo-resultado.png` and start no download.
3. **WHEN** Resultado is shown **THE SYSTEM SHALL** make no request to any host other than the page origin while creating the card.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale con 0 cuando la tarea está bien.

```bash
npm run build
npm run e2e -- e2e/compartir.spec.ts
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E4-T5: Crear tarjeta para compartir"
git tag step-13-compartir
```

Córrelo después de que el último `Verify` salga con 0. El tag es el punto de retorno de esta tarea.

---

## Epic acceptance

El epic termina cuando cada tarea está `done` y además:

1. **WHEN** `npm run e2e` runs **THE SYSTEM SHALL** exit 0 with 0 failed across the specs of this epic.

```bash
npm run format:check && npm test && npm run build
npm run e2e
```

## Pitfalls

- **`mathVirtualKeyboard.show()`** — con la política `manual` hay que llamarlo tú; así abre también en escritorio.
- **`layouts`** — se asigna al montar el campo, para que cada tema tenga el suyo.
- **`client:only`** — evita que MathLive corra en el servidor; no lo cambies por `client:load`.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag; `git tag -l 'step-*'` los lista.
- [ ] El gate pasa limpio desde la raíz del proyecto.
- [ ] Cada contrato de "Produced" existe con esa firma.
- [ ] No se tocó ningún archivo fuera del subárbol.
- [ ] Un commit por tarea, con el id de la tarea, seguido de su tag.
