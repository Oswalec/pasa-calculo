# Pasa Cálculo — Blueprint

> Generado por The Architect el 2026-11-01
> Shape: marketing-site · `knowledge/shapes/marketing-site.md`
> Runtime track: ts-node · `knowledge/runtime-tracks/ts-node.md`
> Modo de emisión: bundle
> Versión del blueprint: 1
> Versiones verificadas: 2026-11-01. La procedencia por paquete está en §11

---

## 1. Project Overview & Non-Goals

### Vision

Pasa Cálculo es un reto diario gratis de 3 ejercicios de Cálculo, en español y pensado primero para el celular. Lo usa el universitario peruano que jaló el curso, que va en tercera matrícula o que empieza de cero. Entra sin cuenta, elige Límites, Continuidad, Derivadas o Integrales y resuelve 3 ejercicios fáciles que se corrigen al instante, aunque escriba la respuesta de otra forma equivalente.

Es el imán de contactos del profesor CEC | Cálculo. Al terminar, el alumno ve su puntaje y un solo botón a WhatsApp para pedir acompañamiento. La regla de interfaz es una pantalla, una decisión y un botón primario: sin menús, sin registro, sin instrucciones, sin temporizador, sin vidas y sin castigo.

### Users

| Persona | Qué viene a hacer | Frecuencia |
|---|---|---|
| Alumno jalado | Comprobar qué tan lejos está y buscar ayuda para aprobar | Diaria mientras cursa |
| Alumno en tercera matrícula (trica) | Practicar con urgencia, sin riesgo, y contactar al profesor | Diaria |
| Alumno que empieza de cero | Probar si puede con 3 ejercicios fáciles | Semanal |
| Profesor CEC \| Cálculo | Recibir por WhatsApp a quien terminó el reto | Cada contacto |

### Goals — v1 scope

1. El alumno completa un reto de 3 ejercicios en cualquiera de los 4 temas sin leer instrucciones.
2. El corrector acepta formas equivalentes y olvidos de `+C`, y nunca consume un intento por una entrada ilegible.
3. Cada día de Lima ofrece un trío nuevo por tema, y lo mismo a todos los alumnos.
4. Resultado lleva al alumno al WhatsApp del profesor con un solo toque.
5. El alumno guarda su racha y puede compartir una tarjeta de su resultado sin servicios externos.

### Non-Goals — explicitly out of scope for v1

| No se construye | Por qué no ahora | Se revisa cuando |
|---|---|---|
| Cuentas, base de datos o almacenamiento de contactos | La meta es llevar al alumno a WhatsApp; un registro lo espanta | Más de 100 contactos al mes hagan falta seguir por cohorte |
| Analítica | El dueño mide por los chats que recibe; evita aviso de cookies | El dueño necesite saber dónde abandonan |
| Rankings | Compiten con el mensaje de acompañamiento | Haya comunidad activa de alumnos |
| Clases en vivo | Es otro producto | El acompañamiento lo pida |
| Práctica libre fuera del reto | Rompe el ritual diario de 3 ejercicios | El banco supere 500 ejercicios |
| Pagos o precios | La venta ocurre en WhatsApp | El dueño venda sin conversar |
| Mensajes de WhatsApp por tema | `wa.link` es fijo por decisión del dueño | Se necesite atribuir contactos |
| Pantalla de situación del alumno | Agrega una decisión antes del primer ejercicio | Se quiera segmentar el mensaje |
| Sendy | Es la automatización de otro flujo | El volumen de chats no se pueda atender |
| Otros cursos | Lanzamiento solo de Cálculo | El reto retenga alumnos en Cálculo |
| Modo claro | Identidad de marca negro y durazno | Lo pida un alumno con baja visión |
| Dominio propio | Cuesta y no cambia el resultado | El reto tenga tráfico sostenido |

**El constructor no implementa nada de esta tabla**, aunque parezca un agregado pequeño mientras trabaja en algo cercano. Si un paso parece requerir un no-objetivo, es un defecto del blueprint: detente y repórtalo.

### Success metrics

| Métrica | Meta | Cómo se mide |
|---|---|---|
| Alumnos que llegan al botón sin explicación | 3 de 3 en la prueba de lanzamiento | Observación directa, §20.1 |
| Chats iniciados desde el reto | 10 en los primeros 30 días | Conteo manual del dueño en WhatsApp |
| Respuestas correctas calificadas mal | 0 | `npm test -- src/lib/corrector.test.ts` |

---

## 2. Tech Stack

**Runtime track: ts-node.** Esta tabla nombra decisiones, no versiones. Cada versión vive en la Sección 11 y en ningún otro lugar.

Las versiones vienen del reporte de versiones de esta sesión, que es la autoridad.

| Capa | Decisión | Por qué, y frente a qué |
|---|---|---|
| Lenguaje / runtime | TypeScript sobre Node | Tipos compartidos entre banco, lógica y pruebas. La línea TS 7 queda fuera porque `@astrojs/check` no la acepta |
| Framework | Astro estático con una isla | Inicio pesa poco y GitHub Pages sirve archivos. Next sobraría: no hay servidor |
| Estilos | CSS propio con tokens en variables | Son 4 pantallas y el canvas lee los mismos tokens. Tailwind añadiría un paso de build sin ahorrar nada aquí |
| Capa de componentes | Preact con `useState` | La isla necesita muy poco JS en Inicio. React pesa más y signals no hace falta |
| Base de datos | NOT APPLICABLE | Banco estático en JSON y progreso en `localStorage` |
| ORM / acceso a datos | NOT APPLICABLE | No hay base de datos |
| Auth | NOT APPLICABLE | No hay cuentas |
| Trabajo en segundo plano | NOT APPLICABLE | No hay servidor |
| Pagos | NOT APPLICABLE | La venta ocurre en WhatsApp |
| Almacenamiento de archivos | NOT APPLICABLE | La tarjeta se genera en el navegador |
| Email / notificaciones | NOT APPLICABLE | El contacto es WhatsApp |
| Fórmulas | KaTeX | Rápido y estable en móvil. MathJax es más pesado |
| Entrada matemática | MathLive con teclado propio por tema | Un `input` de texto obliga a saber LaTeX |
| Corrección | Compute Engine, comparación numérica en 10 puntos | Probado en esta sesión con formas equivalentes; comparar texto rechazaría respuestas correctas |
| Hosting | GitHub Pages con Actions | Gratis y basta con estáticos. Cloudflare Pages exige otra cuenta |
| Gestor de paquetes | npm | El equipo ya lo usa y `npm ci` corre sin configurar nada |
| Formato | Prettier con `prettier-plugin-astro` | Biome no formatea archivos `.astro` por completo |

### Compatibility check

Revisado contra `knowledge/stack-compatibility.md`: ninguna fila de combinaciones conocidas como malas aplica. Se apartan del track por decisión del dueño: npm en lugar de pnpm, Prettier en lugar de Biome, y GitHub Pages en lugar de Cloudflare Pages. El track pide no adoptar TypeScript 7 con Astro, y esta decisión lo cumple.

---

## 3. Directory Structure

```
pasa-calculo/
  .claude/                     # configuración del agente, llega con el Bootstrap
    settings.json
    rules/contenido.md
    rules/pantallas.md
    skills/agregar-ejercicio/SKILL.md
  .github/workflows/deploy.yml # paso 15
  blueprints/pasa-calculo/     # este bundle; ninguna herramienta lo recorre
  dist/                        # salida de astro build, ignorada por git
  e2e/                         # specs de Playwright
    humo.spec.ts               # paso 1
    inicio.spec.ts             # paso 9
    ejercicio.spec.ts          # paso 10
    respuesta.spec.ts          # paso 11
    resultado.spec.ts          # paso 12
    compartir.spec.ts          # paso 13
    flujo.spec.ts              # paso 14
  fuente/ejercicios-pdf.txt    # datos fuente, llega con el Bootstrap
  scripts/
    probar-sitio.mjs           # llega con el Bootstrap
    verificar-banco.mjs        # paso 3
    verificar-dist.mjs         # paso 15
  src/
    components/
      Reto.tsx                 # paso 9: la isla y su máquina de estados
      Inicio.tsx               # paso 9
      Ejercicio.tsx            # paso 10
      Formula.tsx              # paso 10
      Respuesta.tsx            # paso 11
      Resultado.tsx            # paso 12
    data/
      tipos.ts                 # paso 2
      banco/limites.json       # paso 3
      banco/continuidad.json   # paso 4
      banco/derivadas.json     # paso 5
      banco/integrales.json    # paso 6
    layouts/Base.astro         # paso 1
    lib/
      fechas.ts                # paso 2
      fechas.test.ts           # paso 2
      retos.ts                 # paso 2
      retos.test.ts            # paso 2
      corrector.ts             # paso 7
      corrector.test.ts        # paso 7
      progreso.ts              # paso 8
      progreso.test.ts         # paso 8
      banco.ts                 # paso 9
      teclado.ts               # paso 10
      tarjeta.ts               # paso 13
    pages/index.astro          # paso 1, la única ruta
    styles/tokens.css          # paso 1
    styles/global.css          # paso 1
  tests/
    verificar-banco.test.ts    # paso 3
    banco-continuidad.test.ts  # paso 4
    banco-derivadas.test.ts    # paso 5
    banco-integrales.test.ts   # paso 6
    verificar-dist.test.ts     # paso 15
    fixtures/banco-malo/limites.json  # paso 3
    fixtures/dist-malo/index.html     # paso 15
  .gitattributes  .gitignore  .nvmrc  .prettierignore  .prettierrc   # Bootstrap
  AGENTS.md  CLAUDE.md                                               # Bootstrap
  astro.config.mjs  package.json  playwright.config.ts               # Bootstrap
  tsconfig.json  vitest.config.ts                                    # Bootstrap
```

Lo que aquí dice Bootstrap se emite en `workspace/` y aterriza con la copia única de §10. El resto lo crea el paso indicado. `package-lock.json` lo escribe `npm install`.

**Reglas de frontera**
- `src/components/` nunca importa un JSON del banco: pasa por `src/lib/banco.ts`.
- Solo `src/lib/progreso.ts` toca `localStorage`.
- `src/lib/` no importa Preact.
- `mathlive` y `src/lib/corrector.ts` se importan solo con `import()`.
- La forma de los imports es una convención de resolución y se reconcilia en §19.6, *Resolution convention matrix*.

---

## 4. Data Model

No hay base de datos. Los ejercicios son archivos JSON del repositorio y el progreso vive en el navegador del alumno.

### Entities

**Ejercicio** — un ejercicio del banco. Se crea en los pasos 3 a 6 y solo cambia por commit.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | string | único | `lim-01`, `con-01`, `der-01`, `int-01`: prefijo más `n` con dos dígitos |
| `tema` | enum | `limites`, `continuidad`, `derivadas`, `integrales` | coincide con el archivo |
| `n` | number | existe en esa sección del PDF | conserva el número del PDF y ordena el reparto |
| `enunciado` | string | no vacío | texto en español con `$LaTeX$` |
| `tipo` | enum | `expresion`, `opcion` | decide `math-field` o botones |
| `respuesta` | string | no vacío | LaTeX; en `opcion`, la clave de la opción |
| `opciones` | string[] | solo en `opcion` | siempre `continua`, `removible`, `salto`, `infinita` |
| `constante` | boolean | opcional | true en integrales indefinidas |
| `solucion` | string | no vacío | una línea con `$LaTeX$` |
| `chequeo` | objeto | ver esquema | lo usa `verificar-banco`; nunca se muestra |

Etiquetas de `opciones`: `continua` → Continua, `removible` → Discontinua removible, `salto` → Discontinua de salto, `infinita` → Discontinua infinita.

**Progreso** — lo que recuerda el navegador, bajo la clave `pasa-calculo:v1` de `localStorage`.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `resultados` | objeto | fecha de Lima → tema → aciertos | ejemplo: `{ "resultados": { "2026-03-10": { "limites": 2 } } }` |

### Relationships

Ejercicio —(n:1)→ tema. Progreso se refiere a un tema por nombre, no a ejercicios. No hay borrados en cascada.

### Indexes

NOT APPLICABLE — no hay base de datos; `retoDeHoy` recorre arreglos de menos de 51 elementos.

### Schema

`src/data/tipos.ts`, escrito en el paso 2:

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

### Migrations

NOT APPLICABLE — no hay base de datos. Si cambia la forma del progreso, la clave sube a `pasa-calculo:v2`.

### Seed data

NOT APPLICABLE — los JSON del banco son los datos y se versionan.

### Reparto de retos

`L` es la lista del tema ordenada por `n`. `k = floor(largo / 3)`. Se parte en tres tramos consecutivos `A`, `B`, `C` de tamaño `k`, y el sobrante se descarta. El trío `i` es `[A[i], B[i], C[i]]`: va de fácil a menos fácil y no repite dentro del ciclo. El índice es `días desde 2026-01-01 (fecha de Lima) módulo k`. Límites, derivadas e integrales dan k = 16; continuidad da k = 13.

---

## 5. API Design

NOT APPLICABLE — el sitio es estático y no tiene backend ni endpoints propios.

---

## 6. Frontend Architecture

### Routes

| Route | Page | Data source | Auth |
|---|---|---|---|
| `/` (publicada en `/pasa-calculo/`) | `src/pages/index.astro` | JSON del banco por `import()`, progreso de `localStorage` | pública |

### Rendering strategy

La página se genera estática con `output: "static"`. La isla usa `client:only="preact"`: no se renderiza en el servidor porque depende de `localStorage`, de la fecha de hoy y de MathLive. El HTML estático trae título, descripción, la marca `Pasa Cálculo` y el texto de `noscript`.

### Component hierarchy

```
index.astro (estático)
  Base.astro (estático)
    main
      Reto.tsx (isla, client:only)
        Inicio.tsx
        Ejercicio.tsx → Formula.tsx, math-field o botones de opción
        Respuesta.tsx → Formula.tsx
        Resultado.tsx → tarjeta.ts
```

### Pantallas

| # | Pantalla | Contenido | Botón primario |
|---|---|---|---|
| 1 | Inicio | `Reto de hoy: 3 ejercicios`, 4 botones de tema, `Racha: N días` si hay racha, firma `CEC \| Cálculo` | tocar un tema |
| 2 | Ejercicio | `1 de 3`, enunciado, `math-field` u opciones, `Revisa tu respuesta` si la entrada no se entiende | `Comprobar` |
| 3 | Respuesta | `✓ Correcto` o `✗ Incorrecto`, respuesta correcta, solución en una línea; `Correcto. Recuerda escribir el +C.` si falta C | `Siguiente`; en el tercero, `Ver resultado` |
| 4 | Resultado | `N de 3`, nivel, `Te acompañaré hasta que logres pasar el cálculo que necesites`, `Compartir resultado`, racha y `Nuevo reto en HH:MM:SS` | `Quiero que me acompañes` |

Si el reto de hoy de un tema ya está hecho, tocar ese tema lleva directo a la pantalla 4.

### Teclado

Cada tema tiene su fila de teclas en `src/lib/teclado.ts`, emitida en el paso 10. Todos: dígitos, `+ - × / ( ) x`, fracción, potencia, raíz y borrar. Límites agrega ∞. Derivadas e integrales agregan sen, cos, tan, sec, csc, cot, ln, e, arcsen, arctan y valor absoluto. Integrales agrega C. La tecla sen inserta `\operatorname{sen}`.

### State management

Todo el estado vive en `useState` dentro de `Reto.tsx`: pantalla, tema, trío, índice y aciertos. Lo persistente pasa por `src/lib/progreso.ts`. No hay estado global, signals ni caché de servidor.

### Loading, empty, and error states

| Superficie | Cargando | Vacío | Error |
|---|---|---|---|
| Inicio | no aplica: no carga datos | sin racha, no muestra la línea | `localStorage` caído: racha 0, el reto sigue |
| Ejercicio | el botón `Comprobar` sigue deshabilitado mientras cargan MathLive y el corrector | campo vacío: `Comprobar` deshabilitado | entrada ilegible: `Revisa tu respuesta`, sin consumir intento |
| Resultado | no aplica | no aplica | `localStorage` caído: muestra el puntaje de la sesión |

---

## 7. Design System

Solo modo oscuro, sin tema claro. Los valores salen de la marca negro y durazno de CEC | Cálculo.

### Colors

| Token | Dark | Usage |
|---|---|---|
| `--negro` | `#0B0B0C` | fondo; texto sobre durazno |
| `--superficie` | `#17171A` | botones y campos |
| `--borde` | `#2A2A2E` | bordes |
| `--durazno` | `#EFB18C` | marca y acción primaria |
| `--texto` | `#F7F3EF` | texto principal |
| `--suave` | `#B9B2AB` | texto secundario |
| `--acierto` | `#2FBF71` | solo retroalimentación correcta |
| `--error` | `#F0524F` | solo retroalimentación incorrecta |

**Contraste:** todos los pares cumplen WCAG 2.2 AA. Los tres más riesgosos, medidos: `--error` sobre `--negro` 5.64:1, `--acierto` sobre `--negro` 8.26:1 y `--suave` sobre `--superficie` 8.53:1. `--negro` sobre `--durazno` da 10.62:1.

### Typography

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display | Poppins | 28px / 1.2 | 800 | 0 |
| Heading | Poppins | 18px / 1.5 | 600 | 0 |
| Body | Poppins | 16px / 1.5 | 400 | 0 |
| Mono | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |

**Carga de fuentes:** autoalojada con `@fontsource/poppins`, pesos 400, 600 y 800. Respaldo `system-ui, sans-serif`.

### Spacing, radius, elevation

- Espaciado: 8, 12, 16px. El margen de página es 16px.
- Radio: 12px en botones y campos.
- Sombras: ninguna, solo bordes.
- Ancho máximo: 480px centrado. Sin puntos de quiebre: una sola columna.
- Objetivo táctil mínimo: 48px.

### Motion

Retroalimentación de 180ms con `ease-out`, solo en `opacity`. Con `prefers-reduced-motion: reduce` las duraciones pasan a 0ms.

### Component style

Oscuro, plano y directo: botones grandes de ancho completo, un solo durazno por pantalla, y nada que distraiga del ejercicio. Si un componente necesita una explicación, no pertenece aquí.

---

## 8. Authentication & Authorization

NOT APPLICABLE — el producto no tiene cuentas, sesiones ni datos privados.

---

## 9. BUILD ORDER

**Esta es la sección para la que existe el blueprint.** Un constructor que sigue esta sección al pie de la letra y se detiene en cada gate verde publica el proyecto.

### Reglas de un paso

1. Cada paso tiene `Do`, `Done when`, `Verify` y `Checkpoint`, y corre en ese orden. El `Verify` nunca depende del commit de su propio paso.
2. Un paso no termina hasta que pasan sus comandos y los de los pasos anteriores.
3. Corre `npm run format` antes de `Verify` si escribiste archivos a mano.
4. Si un paso sale mal, vuelve al paso anterior con `git reset --hard step-NN-slug` y reintenta. Solo se resetea a un tag `step-NN`, nunca a otra referencia. Una falla en el paso 1 se reporta, no se resetea: no hay tag anterior. No sigas depurando sobre un punto roto.
5. Si un paso se bloquea, detente y repórtalo. No empieces el siguiente.
6. Nunca edites un comando de `Verify` para que pase.
7. Los archivos con LaTeX se escriben con la herramienta de edición. Los heredocs de Bash destruyen las barras invertidas.

Los comandos corren desde la raíz del proyecto, en Git Bash o Linux.

### Step map

| # | Step | Depends on | Touches | Gate |
|---|---|---|---|---|
| 1 | Crear estructura y tokens | — | `src/pages/index.astro`, `src/layouts/Base.astro`, `src/styles/tokens.css`, `src/styles/global.css`, `e2e/humo.spec.ts` | `node scripts/probar-sitio.mjs` |
| 2 | Definir tipos y reparto de retos | 1 | `src/data/tipos.ts`, `src/lib/fechas.ts`, `src/lib/retos.ts`, `src/lib/fechas.test.ts`, `src/lib/retos.test.ts` | `npm test -- src/lib/fechas.test.ts src/lib/retos.test.ts` |
| 3 | Construir banco de límites y verificador | 2 | `src/data/banco/limites.json`, `scripts/verificar-banco.mjs`, `tests/verificar-banco.test.ts`, `tests/fixtures/banco-malo/limites.json` | `npm run banco` |
| 4 | Construir banco de continuidad | 3 | `src/data/banco/continuidad.json`, `tests/banco-continuidad.test.ts` | `npm test -- tests/banco-continuidad.test.ts` |
| 5 | Construir banco de derivadas | 3 | `src/data/banco/derivadas.json`, `tests/banco-derivadas.test.ts` | `npm test -- tests/banco-derivadas.test.ts` |
| 6 | Construir banco de integrales | 4, 5 | `src/data/banco/integrales.json`, `tests/banco-integrales.test.ts` | `npm run banco -- --completo` |
| 7 | Implementar corrector | 4, 5, 6 | `src/lib/corrector.ts`, `src/lib/corrector.test.ts` | `npm test -- src/lib/corrector.test.ts` |
| 8 | Guardar progreso y racha | 2 | `src/lib/progreso.ts`, `src/lib/progreso.test.ts` | `npm test -- src/lib/progreso.test.ts` |
| 9 | Crear isla Reto y pantalla Inicio | 4, 5, 6, 8 | `src/components/Reto.tsx`, `src/components/Inicio.tsx`, `src/lib/banco.ts`, `src/pages/index.astro`, `e2e/inicio.spec.ts` | `npm run e2e -- e2e/inicio.spec.ts` |
| 10 | Crear pantalla Ejercicio con teclado | 7, 9 | `src/components/Ejercicio.tsx`, `src/components/Formula.tsx`, `src/lib/teclado.ts`, `src/components/Reto.tsx`, `e2e/ejercicio.spec.ts` | `npm run e2e -- e2e/ejercicio.spec.ts` |
| 11 | Crear pantalla Respuesta | 10 | `src/components/Respuesta.tsx`, `src/components/Reto.tsx`, `e2e/respuesta.spec.ts` | `npm run e2e -- e2e/respuesta.spec.ts` |
| 12 | Crear pantalla Resultado y WhatsApp | 11 | `src/components/Resultado.tsx`, `src/components/Reto.tsx`, `e2e/resultado.spec.ts` | `npm run e2e -- e2e/resultado.spec.ts` |
| 13 | Crear tarjeta para compartir | 12 | `src/lib/tarjeta.ts`, `src/components/Resultado.tsx`, `e2e/compartir.spec.ts` | `npm run e2e -- e2e/compartir.spec.ts` |
| 14 | Probar flujo completo en móvil | 13 | `e2e/flujo.spec.ts` | `npm run e2e` |
| 15 | Configurar publicación en GitHub Pages | 14 | `.github/workflows/deploy.yml`, `scripts/verificar-dist.mjs`, `tests/verificar-dist.test.ts`, `tests/fixtures/dist-malo/index.html` | `node scripts/verificar-dist.mjs` |

**Una unidad.** Un paso de esta sección es una tarea de `tasks.json` y un bloque de tarea en un epic. Son 15 pasos, agrupados en 5 epics por decisión del dueño: `01-base` (1 y 2), `02-banco` (3 a 6), `03-motor` (7 y 8), `04-pantallas` (9 a 13) y `05-entrega` (14 y 15).

El paso 1 sirve el sitio, comprueba la ruta publicada y corre Playwright, así que la contradicción entre `base` y las URLs aparece en el primer gate.

---

#### Step 1 — Crear estructura y tokens

**Do**

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

Archivos:

- `src/pages/index.astro` — nuevo: la única ruta; el texto estático `Pasa Cálculo` y el `main` donde vivirá la isla
- `src/layouts/Base.astro` — nuevo: head, metadatos, Poppins y estilos
- `src/styles/tokens.css` — nuevo: los tokens de la paleta y las medidas
- `src/styles/global.css` — nuevo: base, botones, pantallas, `math-field` y teclado
- `e2e/humo.spec.ts` — nuevo: ejercita `playwright.config.ts` y la ruta publicada en un navegador

**Done when**

- [ ] WHEN `npm run build` runs THE SYSTEM SHALL exit 0 with `astro check` reporting 0 errors and write `dist/index.html`.
- [ ] WHEN `node scripts/probar-sitio.mjs` serves `dist/` at `http://localhost:4321/pasa-calculo/` THE SYSTEM SHALL answer status 200 with a body containing `Pasa Cálculo`, and the script SHALL exit 0.
- [ ] WHEN `dist/index.html` is read THE SYSTEM SHALL contain `lang="es"` and the description `Reto diario gratis de 3 ejercicios de Cálculo.`.
- [ ] WHEN JavaScript is unavailable THE SYSTEM SHALL offer the text `Activa JavaScript para hacer el reto de hoy.` inside `noscript`.
- [ ] WHEN `npm run e2e -- e2e/humo.spec.ts` runs against `npm run preview` THE SYSTEM SHALL find `Pasa Cálculo` visible at `./` and exit 0.
- [ ] WHEN `npm run format:check` runs from the project root with `blueprints/` present THE SYSTEM SHALL exit 0.

**Verify**

```bash
npm run format:check                                    # expect: exit 0, el bundle queda fuera por .prettierignore
npm run build                                           # expect: exit 0, 0 errores de astro check
node scripts/probar-sitio.mjs                           # expect: exit 0, imprime ok con la URL publicada
npm run e2e -- e2e/humo.spec.ts                         # expect: exit 0, 0 fallidas
grep -q 'lang="es"' dist/index.html                     # expect: exit 0
grep -q 'Reto diario gratis de 3 ejercicios de Cálculo.' dist/index.html  # expect: exit 0
grep -q 'Activa JavaScript para hacer el reto de hoy.' dist/index.html  # expect: exit 0
grep -qi -- '--durazno: #efb18c' src/styles/tokens.css  # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 1: estructura"
git tag step-01-estructura
```

---

#### Step 2 — Definir tipos y reparto de retos

**Do**

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

Archivos:

- `src/data/tipos.ts` — nuevo: esquema exacto de `Ejercicio` y etiquetas
- `src/lib/fechas.ts` — nuevo: `fechaLima`, `diasEntre`, `cuentaRegresiva`
- `src/lib/retos.ts` — nuevo: `trios`, `retoDeHoy`
- `src/lib/fechas.test.ts` — nuevo: pruebas de fechas
- `src/lib/retos.test.ts` — nuevo: pruebas del reparto

**Done when**

- [ ] WHEN `trios` receives 50 items THE SYSTEM SHALL return 16 trios whose first is n = 1, 17, 33, dropping the leftover items.
- [ ] WHEN `trios` receives 40 items THE SYSTEM SHALL return 13 trios with no repeated item in the cycle.
- [ ] WHEN `retoDeHoy` receives a Lima date THE SYSTEM SHALL pick the trio at days since `2026-01-01` modulo k, including dates before `2026-01-01`.
- [ ] WHEN `fechaLima` receives `2026-03-10T03:00:00Z` THE SYSTEM SHALL return `2026-03-09`, the Lima date, on any device time zone.
- [ ] WHEN `retoDeHoy` receives fewer than 3 items THE SYSTEM SHALL throw `Banco sin ejercicios suficientes`.

**Verify**

```bash
npm test -- src/lib/fechas.test.ts src/lib/retos.test.ts  # expect: exit 0, 0 fallidas, 0 omitidas
status=0; grep -rnE 'getDate\(|getMonth\(|getFullYear\(|getHours\(|toLocaleDateString' src/lib || status=$?; test "$status" -eq 1  # expect: exit 0: 1 = ninguna fecha local, 2 = error de grep y falla
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 2: retos"
git tag step-02-retos
```

---

#### Step 3 — Construir banco de límites y verificador

**Do**

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

Archivos:

- `src/data/banco/limites.json` — nuevo: 50 ejercicios de límites
- `scripts/verificar-banco.mjs` — nuevo: verificador de esquema, notación y matemática
- `tests/verificar-banco.test.ts` — nuevo: prueba el camino de falla del verificador
- `tests/fixtures/banco-malo/limites.json` — nuevo: banco con notación y respuesta falsas

**Done when**

- [ ] WHEN `npm run banco` runs with only `src/data/banco/limites.json` present THE SYSTEM SHALL exit 0, print `banco ok` and list the 3 missing topics as `pendiente`.
- [ ] WHEN `npm run banco` evaluates each limit numerically near `chequeo.punto`, or at large x for infinity, THE SYSTEM SHALL find it equal to `respuesta` for all 50 items.
- [ ] WHEN `scripts/verificar-banco.mjs` reads `tests/fixtures/banco-malo` THE SYSTEM SHALL exit 1 printing `FALLA lim-01: notación prohibida` and `FALLA lim-01: f(`.
- [ ] WHEN `scripts/verificar-banco.mjs --completo` misses a topic file THE SYSTEM SHALL exit 1 printing `FALLA integrales: falta`.
- [ ] WHEN `src/data/banco/limites.json` is read THE SYSTEM SHALL contain `Diferencia de cubos`.

**Verify**

```bash
npm run banco                                           # expect: exit 0, imprime banco ok y 3 temas pendientes
npm test -- tests/verificar-banco.test.ts               # expect: exit 0, cubre el exit 1 del verificador
grep -q 'Diferencia de cubos' src/data/banco/limites.json  # expect: exit 0
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 3: banco-limites"
git tag step-03-banco-limites
```

---

#### Step 4 — Construir banco de continuidad

**Do**

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

Archivos:

- `src/data/banco/continuidad.json` — nuevo: 40 ejercicios de continuidad
- `tests/banco-continuidad.test.ts` — nuevo: fija el reparto de respuestas y de tipos

**Done when**

- [ ] WHEN `npm run banco` runs THE SYSTEM SHALL exit 0 with `src/data/banco/continuidad.json` holding 40 items, each id `con-NN` matching a number of the PDF section.
- [ ] WHEN `tests/banco-continuidad.test.ts` runs THE SYSTEM SHALL find no item with n in 6, 25, 26, 27, 28, 29, 30, 31, 34, 43.
- [ ] WHEN `tests/banco-continuidad.test.ts` runs THE SYSTEM SHALL find `removible` exactly at 3, 4, 22, 24, 36, `salto` at 8, 11 to 20, 38, 40, and `infinita` only at 5.
- [ ] WHEN `tests/banco-continuidad.test.ts` runs THE SYSTEM SHALL find `tipo` `expresion` exactly at 41, 42, 44 to 50.
- [ ] WHEN a statement from 11 to 20 is read THE SYSTEM SHALL contain no `+(` or `1x` of the PDF's raw notation.

**Verify**

```bash
npm run banco                                           # expect: exit 0, imprime banco ok
npm test -- tests/banco-continuidad.test.ts             # expect: exit 0, 0 fallidas
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 4: banco-continuidad"
git tag step-04-banco-continuidad
```

---

#### Step 5 — Construir banco de derivadas

**Do**

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

Archivos:

- `src/data/banco/derivadas.json` — nuevo: 50 ejercicios de derivadas
- `tests/banco-derivadas.test.ts` — nuevo: fija enunciados y puntos de evaluación

**Done when**

- [ ] WHEN `npm run banco` runs THE SYSTEM SHALL exit 0 with `src/data/banco/derivadas.json` holding 50 items whose central difference of `chequeo.f` equals `respuesta`.
- [ ] WHEN `tests/banco-derivadas.test.ts` runs THE SYSTEM SHALL find `chequeo.en` as 2, -1 and 1 at n = 33, 34, 35 with `respuesta` 10, -11 and 5.
- [ ] WHEN `tests/banco-derivadas.test.ts` runs THE SYSTEM SHALL find the text `Halla $f'(x)$` in every other statement.
- [ ] WHEN `tests/banco-derivadas.test.ts` runs THE SYSTEM SHALL find no `f'(x)=` inside any `respuesta`.

**Verify**

```bash
npm run banco                                           # expect: exit 0, imprime banco ok
npm test -- tests/banco-derivadas.test.ts               # expect: exit 0, 0 fallidas
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 5: banco-derivadas"
git tag step-05-banco-derivadas
```

---

#### Step 6 — Construir banco de integrales

**Do**

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

Archivos:

- `src/data/banco/integrales.json` — nuevo: 50 ejercicios de integrales
- `tests/banco-integrales.test.ts` — nuevo: fija indefinidas y definidas

**Done when**

- [ ] WHEN `npm run banco -- --completo` runs THE SYSTEM SHALL exit 0 with the four topic files present and totals 50, 40, 50, 50.
- [ ] WHEN `npm run banco` checks an indefinite integral THE SYSTEM SHALL find the central difference of `respuesta` equal to `chequeo.f`.
- [ ] WHEN `npm run banco` checks a definite integral THE SYSTEM SHALL find the Simpson value equal to `respuesta`.
- [ ] WHEN `tests/banco-integrales.test.ts` runs THE SYSTEM SHALL find `constante` true and a final `+C` at n = 1 to 30 and 41 to 50, and neither at n = 31 to 40.

**Verify**

```bash
npm run banco -- --completo                             # expect: exit 0, imprime banco ok y ningún pendiente
npm test -- tests/banco-integrales.test.ts              # expect: exit 0, 0 fallidas
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 6: banco-integrales"
git tag step-06-banco-integrales
```

---

#### Step 7 — Implementar corrector

**Do**

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

Archivos:

- `src/lib/corrector.ts` — nuevo: `normalizar`, `corregir`
- `src/lib/corrector.test.ts` — nuevo: equivalencias y autocorrección de los cuatro bancos

**Done when**

- [ ] WHEN `corregir` compares equivalent forms such as `2\operatorname{sen}x\cos x` and `\operatorname{sen}2x` THE SYSTEM SHALL return `correcto`.
- [ ] WHEN `corregir` receives `x=` or blank text THE SYSTEM SHALL return `invalido` and consume no attempt.
- [ ] WHEN `corregir` receives `t^2` for `x^2` THE SYSTEM SHALL return `incorrecto`.
- [ ] WHEN an item has `constante` true and the student omits C THE SYSTEM SHALL return `correcto` with `faltaC` true.
- [ ] WHEN `tests` run over every `tipo` `expresion` item of the four banks THE SYSTEM SHALL grade its own `respuesta` as `correcto`.
- [ ] WHEN `tests` run over every `tipo` `expresion` item of the four banks THE SYSTEM SHALL grade a false answer as `incorrecto`.

**Verify**

```bash
npm test -- src/lib/corrector.test.ts                   # expect: exit 0, 0 fallidas, 0 omitidas
npm run banco -- --completo                             # expect: exit 0
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 7: corrector"
git tag step-07-corrector
```

---

#### Step 8 — Guardar progreso y racha

**Do**

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

Archivos:

- `src/lib/progreso.ts` — nuevo: resultados y racha
- `src/lib/progreso.test.ts` — nuevo: pruebas con almacén falso

**Done when**

- [ ] WHEN `guardarResultado("limites", "2026-03-10", 2)` runs THE SYSTEM SHALL store `{"resultados":{"2026-03-10":{"limites":2}}}` under the key `pasa-calculo:v1`.
- [ ] WHEN results exist on 3 consecutive Lima dates ending today THE SYSTEM SHALL return `racha` 3.
- [ ] WHEN the latest result is yesterday THE SYSTEM SHALL keep the streak, and WHEN it is older THE SYSTEM SHALL return `racha` 0.
- [ ] WHEN stored JSON is corrupt THE SYSTEM SHALL return `null` from `resultadoDe` and 0 from `racha` without throwing.
- [ ] WHEN `setItem` throws THE SYSTEM SHALL finish `guardarResultado` without throwing.

**Verify**

```bash
npm test -- src/lib/progreso.test.ts                    # expect: exit 0, 0 fallidas, 0 omitidas
npm run build                                           # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 8: progreso"
git tag step-08-progreso
```

---

#### Step 9 — Crear isla Reto y pantalla Inicio

**Do**

Monta la isla Preact en la única ruta con `<Reto client:only="preact" />` dentro de `main` en `src/pages/index.astro`.

- `src/lib/banco.ts`: `cargarBanco(tema)` con cuatro `import()` dinámicos de los JSON, devolviendo `Ejercicio[]`. No importes los JSON de forma estática.
- `src/components/Reto.tsx`: máquina de estados con `useState`, sin signals y sin rutas. Estados: `inicio`, `ejercicio`, `respuesta`, `resultado`. Tocar un tema carga el banco, llama a `retoDeHoy(banco, fechaLima())` y pasa a `ejercicio` con índice 0 y 0 aciertos. Mientras no existan las otras pantallas, `ejercicio` muestra solo un `h1` con `1 de 3`.
- `src/components/Inicio.tsx`: `h1` `Reto de hoy: 3 ejercicios`, cuatro `button class="boton"` con `Límites`, `Continuidad`, `Derivadas`, `Integrales`, la línea `Racha: N días` con clase `discreto` solo si `racha(fechaLima()) > 0` (con N = 1 escribe `Racha: 1 día`), y la firma `CEC | Cálculo` con clase `discreto`.
- `e2e/inicio.spec.ts`: fija la fecha con `await page.clock.setFixedTime(new Date("2026-03-10T17:00:00Z"))` antes de `page.goto("./")`. Siembra racha con `page.addInitScript` escribiendo `pasa-calculo:v1` en `localStorage`.

Archivos:

- `src/components/Reto.tsx` — nuevo: la isla y su máquina de estados
- `src/components/Inicio.tsx` — nuevo: pantalla 1
- `src/lib/banco.ts` — nuevo: carga dinámica por tema
- `src/pages/index.astro` — editar: montar la isla
- `e2e/inicio.spec.ts` — nuevo: prueba de Inicio

**Done when**

- [ ] WHEN `/` loads with no stored progress THE SYSTEM SHALL show the heading `Reto de hoy: 3 ejercicios`, four buttons `Límites`, `Continuidad`, `Derivadas`, `Integrales`, the text `CEC | Cálculo`, and no `Racha` line.
- [ ] WHEN `pasa-calculo:v1` holds results for today and yesterday THE SYSTEM SHALL show `Racha: 2 días`.
- [ ] WHEN Inicio has loaded THE SYSTEM SHALL leave `customElements.get("math-field")` undefined, proving MathLive is not loaded yet.
- [ ] WHEN the student taps `Límites` THE SYSTEM SHALL show `1 de 3`.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e -- e2e/inicio.spec.ts                       # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 9: inicio"
git tag step-09-inicio
```

---

#### Step 10 — Crear pantalla Ejercicio con teclado

**Do**

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

Archivos:

- `src/components/Ejercicio.tsx` — nuevo: pantalla 2
- `src/components/Formula.tsx` — nuevo: texto con KaTeX
- `src/lib/teclado.ts` — nuevo: filas por tema
- `src/components/Reto.tsx` — editar: conectar la pantalla
- `e2e/ejercicio.spec.ts` — nuevo: prueba de Ejercicio

**Done when**

- [ ] WHEN the student enters `Derivadas` THE SYSTEM SHALL show `1 de 3`, a `.katex` statement, a `math-field`, `Comprobar` disabled, `customElements.get("math-field")` defined and `window.mathVirtualKeyboard.visible` true.
- [ ] WHEN a value is set in `math-field` THE SYSTEM SHALL enable `Comprobar`.
- [ ] WHEN the value `x=` is checked THE SYSTEM SHALL show `Revisa tu respuesta` and keep `1 de 3`.
- [ ] WHEN the student enters `Continuidad` on `2026-01-01` THE SYSTEM SHALL show the buttons `Continua`, `Discontinua removible`, `Discontinua de salto`, `Discontinua infinita` and no `math-field`.
- [ ] WHEN `JSON.stringify(window.mathVirtualKeyboard.layouts)` is read THE SYSTEM SHALL contain `∞` and no `arcsen` in `Límites`, contain `arcsen` and no `∞` in `Derivadas`, and contain the key `C` label in `Integrales`.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e -- e2e/ejercicio.spec.ts                    # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 10: ejercicio"
git tag step-10-ejercicio
```

---

#### Step 11 — Crear pantalla Respuesta

**Do**

Construye la pantalla 3 y conéctala en `Reto.tsx`, que suma un acierto cuando corresponde.

- Muestra `✓ Correcto` con clase `acierto` o `✗ Incorrecto` con clase `error` en un `h1`. El texto acompaña al color, y la región lleva `role="status"`.
- Muestra la respuesta correcta: con `Formula` en `expresion`, con `ETIQUETA_OPCION` en `opcion`. Debajo, la `solucion` con `Formula`.
- Si `faltaC` es true, muestra `Correcto. Recuerda escribir el +C.` en vez de `✓ Correcto`, y cuenta como acierto.
- El botón primario dice `Siguiente`; en el tercer ejercicio dice `Ver resultado`.
- `e2e/respuesta.spec.ts` fija la fecha `2026-01-01T17:00:00Z` y obtiene las respuestas leyendo el JSON con `readFileSync` y `retoDeHoy` de `src/lib/retos.ts`.

Archivos:

- `src/components/Respuesta.tsx` — nuevo: pantalla 3
- `src/components/Reto.tsx` — editar: conectar la pantalla y contar aciertos
- `e2e/respuesta.spec.ts` — nuevo: prueba de Respuesta

**Done when**

- [ ] WHEN the correct `respuesta` is checked THE SYSTEM SHALL show `✓ Correcto` with the green class `acierto`, the correct answer in `.katex` and the `solucion`.
- [ ] WHEN a false answer is checked THE SYSTEM SHALL show `✗ Incorrecto` with the red class `error` and the correct answer.
- [ ] WHEN an indefinite integral is answered correctly without C THE SYSTEM SHALL show `Correcto. Recuerda escribir el +C.`.
- [ ] WHEN the third exercise has been checked THE SYSTEM SHALL label the primary button `Ver resultado`, and on the first two `Siguiente`.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e -- e2e/respuesta.spec.ts                    # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 11: respuesta"
git tag step-11-respuesta
```

---

#### Step 12 — Crear pantalla Resultado y WhatsApp

**Do**

Construye la pantalla 4 y guarda el resultado al llegar a ella con `guardarResultado`.

- `h1` con `N de 3`. Nivel: 0 o 1 aciertos `Aquí te conviene reforzar`, 2 `Vas bien, te falta poco`, 3 `¡Excelente!`.
- La frase literal `Te acompañaré hasta que logres pasar el cálculo que necesites`.
- Enlace primario `<a class="boton boton-primario" href="https://wa.link/de928w" target="_blank" rel="noopener">Quiero que me acompañes</a>`. La URL es fija: nunca arma un mensaje.
- Línea `discreto` con la racha y `Nuevo reto en HH:MM:SS`, usando `cuentaRegresiva()` y actualizando cada segundo con `setInterval`, que se limpia al desmontar.
- En `Reto.tsx`, al tocar un tema ya hecho hoy según `resultadoDe(tema, fechaLima())`, salta directo a `resultado` con ese puntaje.
- `e2e/resultado.spec.ts` fija `2026-01-01T17:00:00Z` y completa `Límites` tres veces, en contextos limpios: con 3, con 2 y con 0 aciertos.

Archivos:

- `src/components/Resultado.tsx` — nuevo: pantalla 4
- `src/components/Reto.tsx` — editar: guardar y saltar si ya está hecho
- `e2e/resultado.spec.ts` — nuevo: prueba de Resultado

**Done when**

- [ ] WHEN three correct answers are given THE SYSTEM SHALL show `3 de 3` and `¡Excelente!`.
- [ ] WHEN two or fewer correct answers are given THE SYSTEM SHALL show `Vas bien, te falta poco` for 2 and `Aquí te conviene reforzar` for 0.
- [ ] WHEN Resultado is shown THE SYSTEM SHALL show the phrase `Te acompañaré hasta que logres pasar el cálculo que necesites` and a link `Quiero que me acompañes` with href exactly `https://wa.link/de928w`, `target` `_blank` and `rel` containing `noopener`.
- [ ] WHEN Resultado is shown THE SYSTEM SHALL show text matching `Nuevo reto en \d\d:\d\d:\d\d`.
- [ ] WHEN the page reloads and the student taps the finished topic THE SYSTEM SHALL go straight to Resultado with the same score.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e -- e2e/resultado.spec.ts                    # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 12: resultado"
git tag step-12-resultado
```

---

#### Step 13 — Crear tarjeta para compartir

**Do**

Agrega en Resultado el enlace pequeño `Compartir resultado`, un `button class="enlace-pequeno"`.

- `src/lib/tarjeta.ts` exporta `crearTarjeta({ tema, aciertos }): Promise<Blob>` y `compartirTarjeta(blob): Promise<void>`. Dibuja en un `canvas` de 1080×1920, sobre fondo `--negro`, en durazno y texto: `Pasa Cálculo`, el nombre del tema, `N de 3` y `oswalec.github.io/pasa-calculo`. Lee los colores con `getComputedStyle(document.documentElement).getPropertyValue("--negro")`. Antes de dibujar espera `document.fonts.load("800 96px Poppins")`.
- Crea `new File([blob], "pasa-calculo-resultado.png", { type: "image/png" })`. Si `navigator.canShare?.({ files: [file] })` es true usa `navigator.share({ files: [file] })`; si no, descarga con un `a` con atributo `download`. No hay servicios externos.
- `e2e/compartir.spec.ts`: para la descarga, usa `page.addInitScript` que deja `navigator.canShare` en `undefined`, captura con `page.waitForEvent("download")` y lee ancho y alto del bloque IHDR del PNG (`readUInt32BE(16)` y `readUInt32BE(20)`). Para Web Share, el init script define `canShare` que devuelve true y `share` que guarda `files[0].type` y `files[0].name` en `window`. Registra `page.on("request")` y exige que cada URL empiece con `http://localhost:4321/` o `data:` o `blob:`.

Archivos:

- `src/lib/tarjeta.ts` — nuevo: dibujo y compartir
- `src/components/Resultado.tsx` — editar: enlace `Compartir resultado`
- `e2e/compartir.spec.ts` — nuevo: prueba de descarga y de Web Share

**Done when**

- [ ] WHEN `navigator.canShare` is unavailable and the student taps `Compartir resultado` THE SYSTEM SHALL download `pasa-calculo-resultado.png`, a PNG of 1080 by 1920 pixels.
- [ ] WHEN `navigator.canShare` returns true THE SYSTEM SHALL call `navigator.share` with one `image/png` file named `pasa-calculo-resultado.png` and start no download.
- [ ] WHEN Resultado is shown THE SYSTEM SHALL make no request to any host other than the page origin while creating the card.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e -- e2e/compartir.spec.ts                    # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 13: compartir"
git tag step-13-compartir
```

---

#### Step 14 — Probar flujo completo en móvil

**Do**

Escribe `e2e/flujo.spec.ts`, el flujo completo a 360×740 con la fecha fija `2026-01-01T17:00:00Z` por `page.clock`. Corrige en el código lo que este gate descubra. Si necesitas tocar otro archivo, solo puede ser uno de `src/components/` o `src/styles/global.css`.

- Para cada tema, un `test`: toca el tema, responde los 3 ejercicios con la respuesta correcta y llega a `3 de 3`. En `opcion` toca la etiqueta; en `expresion` escribe en `math-field` con `evaluate((el: HTMLInputElement, v: string) => {...})`, asignando `value` y disparando `input`.
- En cada pantalla comprueba: `document.documentElement.scrollWidth <= 360`, exactamente un `h1`, y que cada `main button` y `main a` mida al menos 48px de alto con `boundingBox()`.
- Un `test` repite Inicio a 320×568 y exige `scrollWidth <= 320`.
- Un `test` termina un tema, recarga, toca el tema y llega directo a Resultado.
- Un `test` comprueba el `href` exacto `https://wa.link/de928w`.

Archivos:

- `e2e/flujo.spec.ts` — nuevo: flujo completo en los cuatro temas

**Done when**

- [ ] WHEN each of the four topics is completed with correct answers at 360 by 740 THE SYSTEM SHALL reach `3 de 3`.
- [ ] WHEN each screen is shown at 360 by 740 THE SYSTEM SHALL keep `document.documentElement.scrollWidth` at 360 or less and render exactly one `h1`.
- [ ] WHEN each screen is shown THE SYSTEM SHALL render every `main button` and `main a` at 48px of height or more.
- [ ] WHEN the viewport is 320 by 568 THE SYSTEM SHALL keep `document.documentElement.scrollWidth` at 320 or less.
- [ ] WHEN a finished topic is reopened after a reload THE SYSTEM SHALL show Resultado with `href` exactly `https://wa.link/de928w`.

**Verify**

```bash
npm run build                                           # expect: exit 0
npm run e2e                                             # expect: exit 0, 0 fallidas en todos los specs
npm test                                                # expect: exit 0, 0 fallidas
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 14: e2e-completo"
git tag step-14-e2e-completo
```

---

#### Step 15 — Configurar publicación en GitHub Pages

**Do**

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

Archivos:

- `.github/workflows/deploy.yml` — nuevo: pruebas y publicación en cada push a main
- `scripts/verificar-dist.mjs` — nuevo: revisa título, rutas, servicios externos y WhatsApp
- `tests/verificar-dist.test.ts` — nuevo: prueba el camino de falla
- `tests/fixtures/dist-malo/index.html` — nuevo: sitio roto para la prueba

**Done when**

- [ ] WHEN `node scripts/verificar-dist.mjs` reads the built `dist/` THE SYSTEM SHALL exit 0 printing `dist ok`.
- [ ] WHEN `scripts/verificar-dist.mjs` reads `tests/fixtures/dist-malo` THE SYSTEM SHALL exit 1 printing `FALLA falta el título` and `FALLA ruta fuera de la base: /otra-base/a.js`.
- [ ] WHEN `.github/workflows/deploy.yml` is read THE SYSTEM SHALL name `actions/deploy-pages@v5`, a push trigger on `main`, and the commands `npm test`, `npm run banco -- --completo`, `npm run build` and `npm run e2e`.

**Verify**

```bash
npm test -- tests/verificar-dist.test.ts                # expect: exit 0, cubre el exit 1 del verificador
npm run build                                           # expect: exit 0
node scripts/verificar-dist.mjs                         # expect: exit 0, imprime dist ok
grep -q 'actions/deploy-pages@v5' .github/workflows/deploy.yml  # expect: exit 0
grep -q 'branches: \[main\]' .github/workflows/deploy.yml  # expect: exit 0
grep -q 'run: npm test' .github/workflows/deploy.yml    # expect: exit 0
grep -q 'run: npm run build' .github/workflows/deploy.yml  # expect: exit 0
grep -q 'npm run banco -- --completo' .github/workflows/deploy.yml  # expect: exit 0
grep -q 'npm run e2e' .github/workflows/deploy.yml      # expect: exit 0
npm run format:check                                    # expect: exit 0
```

**Checkpoint**

```bash
git add -A && git commit -m "step 15: publicar"
git tag step-15-publicar
git ls-files --error-unmatch .github/workflows/deploy.yml  # expect: exit 0, ya quedó registrado por el commit de arriba
```

---


### 9.1 Parity and cutover

NOT APPLICABLE — greenfield build, no system is being replaced.

---

## 10. Environment Setup

### Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node | 24 (`.nvmrc`) | `node -v` |
| npm | el que trae Node | `npm -v` |
| Git | cualquiera reciente | `git --version` |
| Git Bash (Windows) | el que trae Git | `bash --version` |

### Accounts to create first

Ninguna para construir. El repositorio público `Oswalec/pasa-calculo` se crea en la lista de lanzamiento de §20.1, después del paso 15.

### Environment variables

| Variable | Purpose | Where to get it | Required by step | Secret? |
|---|---|---|---|---|
| ninguna | el proyecto no lee variables de entorno | no aplica | no aplica | no |

No hay `.env`, ni `.env.example`, ni validación de entorno al arrancar. Ninguna herramienta de este proyecto lee una variable que el blueprint deba cargar.

### Files that must be committed

| File | Why it is committed | Ignore-file exception line |
|---|---|---|
| `fuente/ejercicios-pdf.txt` | fuente de todos los ejercicios; `verificar-banco` la lee | — not matched by any ignore pattern |
| `blueprints/pasa-calculo/` | el plan que construyó el proyecto | — not matched by any ignore pattern |
| `package-lock.json` | `npm ci` lo exige | — not matched by any ignore pattern |
| `.claude/settings.json` | permisos del constructor | — not matched by any ignore pattern |
| `.gitignore` | gobierna lo que entra al primer commit | — not matched by any ignore pattern |
| `.gitattributes` | fija LF en todas las plataformas | — not matched by any ignore pattern |
| `.prettierrc`, `.prettierignore`, `.nvmrc`, `tsconfig.json` | configuración que leen los gates | — not matched by any ignore pattern |
| `astro.config.mjs`, `vitest.config.ts`, `playwright.config.ts` | configuración que leen los gates | — not matched by any ignore pattern |
| `scripts/probar-sitio.mjs` | gate del paso 1 | — not matched by any ignore pattern |

El `.gitignore` emitido solo excluye `node_modules/`, `dist/`, `.astro/`, `test-results/`, `playwright-report/`, `.env` y `.env.*`.

### Bootstrap

Se ejecuta desde la raíz del proyecto, con el bundle ya en `blueprints/pasa-calculo/`. Es no interactivo, idempotente y sale con 0 en una segunda corrida. Estos comandos se ejecutaron dos veces en un directorio de prueba el 2026-11-01.

```bash
# orden: repositorio → identidad → archivos (.gitignore incluido) → dependencias → navegador → primer commit
git rev-parse --git-dir >/dev/null 2>&1 || git init -b main
git config user.name >/dev/null 2>&1 || git config user.name "Pasa Cálculo"                                   # sin identidad, git commit sale con error
git config user.email >/dev/null 2>&1 || git config user.email "pasa-calculo@users.noreply.github.com"
node -e "require('fs').cpSync('blueprints/pasa-calculo/workspace','.',{recursive:true,force:false})"          # force:false nunca pisa un archivo que ya existe y sale con 0
npm install                                                                                                   # imprime EBADENGINE por compute-engine: es solo un aviso
npx playwright install chromium
git add -A
git rev-parse --verify HEAD >/dev/null 2>&1 || git commit -m "chore: bootstrap"
```

**Por qué esta copia.** Git Bash no trae `rsync`, y `cp -n` cambia su código de salida entre plataformas. `cpSync` con `force: false` se comporta igual en Git Bash y en Linux: copia lo que falta, omite lo existente en silencio y sale con 0. `package.json` y `package-lock.json` nunca se pisan una vez instalados.

**El orden es a propósito.** `.gitignore` llega con la copia, antes del primer `git add -A`, porque una vez que git registra una ruta ninguna regla de ignorar la vuelve a excluir. `.prettierignore` llega antes del primer `format:check`, y `.gitattributes` antes del primer commit.

El primer commit incluye `fuente/` y `blueprints/`.

---

## 11. Dependencies

Las versiones y sus fuentes vienen del reporte de versiones de esta sesión, verificado el 2026-11-01. `package.json` se emite con estos valores y `npm install` del Bootstrap instala cada paquete.

### Runtime

| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| astro | ^7.4.4 | https://registry.npmjs.org/-/package/astro/dist-tags | 2026-11-01 | §10 Bootstrap | sitio estático; `npm run build` y `preview` |
| @astrojs/preact | ^6.1.1 | https://registry.npmjs.org/-/package/@astrojs%2fpreact/dist-tags | 2026-11-01 | §10 Bootstrap | integra Preact; peer preact ^10.6.5 \|\| ^11.0.0 |
| preact | ^10.29.8 | `npm view preact@10`, reporte de esta sesión | 2026-11-01 | §10 Bootstrap | la isla; 11 no hace falta |
| mathlive | 0.111.4 | https://registry.npmjs.org/-/package/mathlive/dist-tags | 2026-11-01 | §10 Bootstrap | campo matemático y teclado; versión exacta por ser 0.x |
| @cortex-js/compute-engine | 0.176.0 | https://registry.npmjs.org/-/package/@cortex-js%2fcompute-engine/dist-tags | 2026-11-01 | §10 Bootstrap | corrector y verificador; exacta por ser 0.x. Solo ESM. Declara engines node >=26.13.0 como aviso: npm imprime EBADENGINE en Node 24 y funcionó en 24.19.0. Nunca activar engine-strict |
| katex | 0.19.1 | https://registry.npmjs.org/-/package/katex/dist-tags | 2026-11-01 | §10 Bootstrap | muestra fórmulas; exacta por ser 0.x |
| @fontsource/poppins | ^5.3.0 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | Poppins autoalojada |

### Development

| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| typescript | ^6.0.3 | https://unpkg.com/typescript@6/package.json | 2026-11-01 | §10 Bootstrap | tipos. No la 7.0.2: `@astrojs/check` pide ^5 \|\| ^6 |
| @astrojs/check | ^0.9.12 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | `astro check` dentro de `npm run build`; caret en 0.x por el rango del reporte |
| vitest | ^5.0.5 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | pruebas unitarias; usa el vite que trae astro |
| @playwright/test | ^1.64.1 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | E2E en Chromium |
| prettier | ^3.9.10 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | formato |
| prettier-plugin-astro | ^1.1.2 | reporte de esta sesión | 2026-11-01 | §10 Bootstrap | formato de `.astro` |
| @types/node | ^26.6.6 | `npm view`, reporte de esta sesión | 2026-11-01 | §10 Bootstrap | tipos de Node en pruebas |

### Runtime del proyecto y CI

| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| Node | 24 (LTS 24.22.2; piso de astro >=22.23.4) | https://nodejs.org/dist/index.json | 2026-11-01 | §10 Prerequisites | transitivo del entorno: lo instala el desarrollador; `.nvmrc` y `engines` |
| actions/checkout | @v7 | mayor inferida del `tag_name` del release | 2026-11-01 | paso 15, `deploy.yml` | CI |
| actions/setup-node | @v7 | mayor inferida del `tag_name` del release | 2026-11-01 | paso 15, `deploy.yml` | CI |
| actions/configure-pages | @v6 | mayor inferida del `tag_name` del release | 2026-11-01 | paso 15, `deploy.yml` | CI |
| actions/upload-pages-artifact | @v5 | mayor inferida del `tag_name` del release | 2026-11-01 | paso 15, `deploy.yml` | CI |
| actions/deploy-pages | @v5 | mayor inferida del `tag_name` del release | 2026-11-01 | paso 15, `deploy.yml` | CI |

### Deliberately not used

| Rejected | Instead | Why |
|---|---|---|
| vite como dependencia directa | el que trae astro | fijarlo arriesga dos versiones de vite |
| Tailwind | CSS propio con tokens | 4 pantallas no lo justifican |
| signals de Preact | `useState` | el estado cabe en un componente |
| Testing Library | Playwright sobre la isla real | las pantallas se prueban con MathLive real |
| axe | asserts de `h1`, altura y scroll en `e2e/flujo.spec.ts` y pases manuales | decisión del dueño; §15 lo registra |
| TypeScript 7 | línea 6 | `@astrojs/check` no la acepta |
| preact 11 | línea 10 | no aporta nada aquí |

---

## 12. Deployment Strategy

### Hosting

GitHub Pages desde Actions, en el repositorio público `Oswalec/pasa-calculo`. URL final `https://oswalec.github.io/pasa-calculo/`. Comando `npm run build`, salida `dist`. Plan gratuito. Sin servidor.

### Environments

| Environment | Branch | URL | Database | Third-party mode |
|---|---|---|---|---|
| Local | cualquiera | http://localhost:4321/pasa-calculo/ | no aplica | no aplica |
| Production | `main` | https://oswalec.github.io/pasa-calculo/ | no aplica | no aplica |

No hay vistas previas por PR: GitHub Pages no las ofrece y el dueño es el único que publica.

### CI/CD

Cada push a `main` corre `.github/workflows/deploy.yml`, escrito en el paso 15: `npm ci`, `npx playwright install --with-deps chromium`, `npm run format:check`, `npm test`, `npm run banco -- --completo`, `npm run build`, `node scripts/verificar-dist.mjs`, `npm run e2e`, y solo entonces publica. Difiere de §20.1 en dos cosas: CI instala Chromium con `--with-deps` porque corre en Linux, y no ejecuta `node scripts/probar-sitio.mjs`, que queda como gate local.

### Release and rollback

Publicar es hacer push a `main`. Para revertir: `git revert <commit>` y push; toma lo que dure el workflow, unos 5 minutos. Sin migraciones.

### Domain, DNS, TLS

Sin dominio propio. GitHub Pages sirve HTTPS en `oswalec.github.io`.

---

## 13. Testing Strategy

Las pruebas existen para hacer verificables los `Done when` de la Sección 9.

| Layer | Framework | What it covers | Where | Runs |
|---|---|---|---|---|
| Unit | Vitest | fechas, reparto, corrector, progreso, bancos, verificadores | `src/**/*.test.ts`, `tests/**/*.test.ts` | cada paso y CI |
| Datos | `scripts/verificar-banco.mjs` | esquema, notación y matemática del banco | `npm run banco` | pasos 3 a 7 y CI |
| Integration | NOT APPLICABLE | no hay servicios | no aplica | no aplica |
| E2E | Playwright en Chromium a 360×740 | la ruta publicada y las 4 pantallas con MathLive real | `e2e/` | pasos 1, 9 a 14 y CI |

### Critical flows to cover E2E

1. Un reto completo en cada tema hasta `3 de 3` y el botón de WhatsApp.
2. Una entrada ilegible no consume intento.
3. Un reto ya hecho salta a Resultado.
4. Una indefinida sin C cuenta como correcta y muestra la nota.

### Test data

Las pruebas usan los JSON reales del banco con fecha fija por `page.clock`, y `localStorage` limpio por test. No comparten estado ni dependen del orden. Los JSON se leen con `readFileSync` en los specs.

### What is deliberately not tested

La comodidad del teclado en un celular real, porque no se puede decidir por script: va en §20.1. Tampoco se prueba la entrega real de WhatsApp. `continuidad-k` y `continuidad-tipo` no tienen chequeo matemático: solo se validan por esquema y su solución es adaptada del PDF.

---

## 14. Security & Secrets

| Concern | Control | Implemented in |
|---|---|---|
| Secret storage | no hay secretos | no aplica |
| Secret rotation | no hay secretos | no aplica |
| Input validation | la entrada del alumno solo se evalúa con Compute Engine, nunca con `eval` | `src/lib/corrector.ts` |
| Output encoding / XSS | la entrada del alumno nunca se pinta como HTML. KaTeX solo recibe textos del banco, versionados en el repositorio | `src/components/Formula.tsx` |
| SQL injection | no hay SQL | no aplica |
| AuthN / AuthZ | no hay cuentas | no aplica |
| CSRF | no hay servidor | no aplica |
| Rate limiting / abuse | no hay servidor | no aplica |
| Webhook verification | no hay webhooks | no aplica |
| Dependency audit | `npm audit`, manual antes de lanzar | §20.1 |
| Security headers | GitHub Pages no permite configurarlos; no hay datos que proteger | no aplica |
| PII handling | no se guarda ningún dato personal. `localStorage` solo tiene fechas y puntajes | `src/lib/progreso.ts` |
| Logging hygiene | no hay registros | no aplica |

**Reglas duras**
- Ningún secreto se escribe en el repositorio. Este proyecto no los necesita.
- Lo que llega al navegador es público.

No maneja datos regulados: no hay datos personales ni cuentas.

---

## 15. Accessibility

**Objetivo: WCAG 2.2 nivel AA.**

### Baseline requirements

| Requirement | Rule |
|---|---|
| Semantic HTML | `main`, un `h1` por pantalla, `lang="es"`. La página no tiene navegación, así que no lleva enlace de salto |
| Keyboard | todo se opera con `button` y `a` nativos, y `math-field` recibe foco al abrir |
| Focus visible | contorno de 2px en durazno, 10.62:1 contra el fondo |
| Contrast | §7 |
| Forms | `math-field` lleva `aria-label="Tu respuesta"`. `Revisa tu respuesta` es texto con `role="status"` |
| Images | la interfaz no usa imágenes |
| Motion | `prefers-reduced-motion: reduce` apaga las transiciones |
| Zoom / reflow | sin scroll horizontal a 320px, probado en `e2e/flujo.spec.ts` |
| Live regions | Respuesta y `Revisa tu respuesta` usan `role="status"` |

### WCAG 2.2 additions — the ones most often missed

| SC | Requirement |
|---|---|
| 2.4.11 Focus Not Obscured (Min) | sin barras fijas propias; el teclado de MathLive se revisa en el pase manual |
| 2.5.7 Dragging Movements | no hay arrastre |
| 2.5.8 Target Size (Min) | 48px en `main button` y `main a`, probado |
| 3.3.7 Redundant Entry | no aplica: no se pide nada dos veces |
| 3.3.8 Accessible Authentication (Min) | no aplica: no hay login |

### Verification

```bash
npm run e2e   # expect: exit 0; flujo.spec.ts comprueba un h1 por pantalla, 48px y scroll
```

Por decisión del dueño no se usa axe. Antes de lanzar va un pase solo con teclado y un pase con lector de pantalla, listados en §20.1.

---

## 16. Observability & Cost

### Instrumentation

| Signal | Tool | What it captures | Who looks at it |
|---|---|---|---|
| Errors | ninguna: la analítica es un no-objetivo | no aplica | no aplica |
| Logs | Actions | resultado de cada publicación | dueño |
| Metrics | conteo manual | chats recibidos en WhatsApp | dueño |
| Uptime | GitHub Pages | sin monitor propio | dueño |

### The metrics that matter for this project

| Metric | Target | Alert at |
|---|---|---|
| Chats nuevos desde el reto | 10 en 30 días | menos de 3 en 30 días |
| Publicación fallida en Actions | 0 | 1, por correo de GitHub |

### Health check

`node scripts/probar-sitio.mjs` comprueba localmente que la ruta publicada responde 200. En producción no hay sondeo.

### Cost model

| Service | Free tier | Cost at expected v1 scale | Cost at 10× | Cliff to watch |
|---|---|---|---|---|
| GitHub Pages | sitios públicos gratis, 100 GB al mes | S/0 | S/0 | superar 100 GB al mes |
| GitHub Actions | gratis en repos públicos | S/0 | S/0 | ninguno |

**Costo mensual estimado al lanzar: S/0.** No hay ninguna línea que crezca con el uso.

---

## 17. Model Routing

NOT APPLICABLE — this project does not call an LLM at runtime.

---

## 18. Skills to Use During Build

Ninguna es obligatoria: si falta, sigue con lo que dice este blueprint y anótalo en una línea.

| Skill | Build steps | Why | Install |
|---|---|---|---|
| frontend-design | 9 a 13 | pantallas con identidad propia | `/plugin marketplace add anthropics/skills` luego `/plugin install example-skills@anthropic-agent-skills` |
| emil-design-eng | 9 a 13 | la transición corta de los botones | `npx skills@latest add emilkowalski/skills` |
| playwright-cli | 14 | explorar fallas del flujo completo | `npm install -g @playwright/cli@latest` luego `playwright-cli install --skills` |

Estas skills se activan por intención: se nombran en prosa, sin barra.

---

## 19. Agent Workspace

`workspace/` es una copia exacta de la raíz del proyecto para todo lo que debe existir antes del paso 1: configuración del agente, configuración que los gates necesitan y los datos fuente. El constructor la aplica con una sola orden, en §10:

```bash
node -e "require('fs').cpSync('blueprints/pasa-calculo/workspace','.',{recursive:true,force:false})"  # force:false: nunca pisa, sale con 0, seguro de repetir
```

Nada más del bundle se copia. Los archivos que nunca se sobrescriben al repetirla son todos los que ya existan, en especial `package.json` y `package-lock.json`. Todo lo emitido pasa `npm run format:check` con el `.prettierrc` emitido. No se emite `.claude/commands/`.

### 19.1 `CLAUDE.md`

`CLAUDE.md`

```markdown
# Pasa Cálculo

Reto diario gratis de 3 ejercicios de Cálculo para universitarios peruanos, imán de contactos del profesor CEC | Cálculo.

## Comandos

| Tarea                       | Comando                                              |
| --------------------------- | ---------------------------------------------------- |
| Instalar                    | `npm install`                                        |
| Servidor de desarrollo      | `npm run dev` en http://localhost:4321/pasa-calculo/ |
| Construir                   | `npm run build` (incluye `astro check`)              |
| Servir lo construido        | `npm run preview`                                    |
| Pruebas unitarias           | `npm test`                                           |
| Una prueba                  | `npm test -- src/lib/retos.test.ts`                  |
| E2E (construye antes)       | `npm run e2e`                                        |
| Un spec E2E                 | `npm run e2e -- e2e/flujo.spec.ts`                   |
| Banco, temas existentes     | `npm run banco`                                      |
| Banco, los cuatro temas     | `npm run banco -- --completo`                        |
| Revisar el sitio construido | `node scripts/verificar-dist.mjs`                    |
| Probar la ruta publicada    | `node scripts/probar-sitio.mjs`                      |
| Formatear                   | `npm run format`                                     |
| Revisar formato             | `npm run format:check`                               |

**Gate:** `npm run format:check && npm run build` pasa antes de dar una tarea por hecha. Desde el paso 2, cuando ya existen pruebas, también `npm test`.

Node 24 fijado en `.nvmrc`. Las versiones viven en `package-lock.json`: léelas ahí, nunca las adivines. `npm install` imprime `EBADENGINE` por `@cortex-js/compute-engine`: es solo un aviso. Nunca actives `engine-strict`.

## Stack

Astro · TypeScript · Preact · CSS propio con tokens · KaTeX · MathLive · Compute Engine · GitHub Pages.

## Arquitectura

**Recorrido.** `src/pages/index.astro` monta `src/components/Reto.tsx` con `client:only="preact"`. Reto carga el banco con `src/lib/banco.ts`, pide el trío a `src/lib/retos.ts` con la fecha de `src/lib/fechas.ts`, muestra `Ejercicio.tsx`, corrige con `src/lib/corrector.ts`, muestra `Respuesta.tsx`, guarda con `src/lib/progreso.ts` y termina en `Resultado.tsx`.

**Límites.**

| Capa                    | Puede importar                                                                                                  | Nunca                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/pages/**`          | `src/layouts`, `src/components`                                                                                 | lógica de reto                                               |
| `src/components/**`     | `src/lib`, `src/data/tipos.ts`                                                                                  | JSON del banco directo, `localStorage` directo               |
| `src/lib/**`            | `src/data/tipos.ts`, otros módulos de `src/lib`, Compute Engine; JSON del banco solo en `banco.ts` y en pruebas | Preact, componentes                                          |
| `src/data/banco/*.json` | nada                                                                                                            | se editan a mano solo siguiendo `.claude/rules/contenido.md` |

**Dónde vive cada cosa.**

| Tema            | Única fuente                                                      |
| --------------- | ----------------------------------------------------------------- |
| Tipos del banco | `src/data/tipos.ts`                                               |
| Ejercicios      | `src/data/banco/*.json`, derivados de `fuente/ejercicios-pdf.txt` |
| Fecha de hoy    | `fechaLima()` en `src/lib/fechas.ts`                              |
| Reto del día    | `retoDeHoy()` en `src/lib/retos.ts`                               |
| Progreso        | `src/lib/progreso.ts`, clave `pasa-calculo:v1`                    |
| Tokens          | `src/styles/tokens.css`                                           |

## Reglas de código

1. Importa con ruta relativa y extensión real: `./fechas.ts`, `../data/tipos.ts`. Sin alias.
2. Sin archivos barril. Importa del módulo fuente.
3. La fecha siempre sale de `fechaLima()`. Nunca `getDate`, `getHours` ni `toLocaleDateString`.
4. `mathlive` y `src/lib/corrector.ts` se importan solo con `import()`, al entrar a Ejercicio.
5. Máximo 300 líneas por componente.
6. Toda lectura o escritura de `localStorage` va en `try/catch`.
7. Una pantalla, una decisión, un botón primario. Sin menús, sin instrucciones, sin temporizador, sin vidas.
8. Escribe archivos con LaTeX con la herramienta de edición, no con heredocs de Bash: destruyen las barras invertidas.

## Sistema de diseño

Solo oscuro. Los tokens se definen una vez en `src/styles/tokens.css`. Sin hex en componentes.

| Token          | Valor     | Uso                               |
| -------------- | --------- | --------------------------------- |
| `--negro`      | `#0B0B0C` | fondo; texto sobre durazno        |
| `--superficie` | `#17171A` | botones y campos                  |
| `--borde`      | `#2A2A2E` | bordes                            |
| `--durazno`    | `#EFB18C` | marca y acción primaria           |
| `--texto`      | `#F7F3EF` | texto principal                   |
| `--suave`      | `#B9B2AB` | texto secundario                  |
| `--acierto`    | `#2FBF71` | solo retroalimentación correcta   |
| `--error`      | `#F0524F` | solo retroalimentación incorrecta |

- **Tipo:** Poppins 400, 600 y 800, autoalojada con `@fontsource/poppins`. Cuerpo 16px. `h1` 28px 800.
- **Medidas:** toque mínimo 48px, margen 16px, ancho máximo 480px centrado, radio 12px.
- **Movimiento:** 180ms `ease-out`. Se apaga con `prefers-reduced-motion: reduce`.
- **Fórmulas:** KaTeX con `katex/dist/katex.min.css`.

## Entorno

Este proyecto no usa variables de entorno ni secretos.

## Reglas por área

| Archivo                      | Aplica a                                       |
| ---------------------------- | ---------------------------------------------- |
| `.claude/rules/contenido.md` | `src/data/banco/**`, `fuente/**`               |
| `.claude/rules/pantallas.md` | `src/components/**`, `src/styles/**`, `e2e/**` |

Skill del proyecto: `agregar-ejercicio`.

## Innegociable

1. Sin cuentas, base de datos, backend, analítica ni servicios externos.
2. El enlace de WhatsApp es exactamente `https://wa.link/de928w`. Nunca arma un mensaje.
3. Nunca se muestra `sin`, `arcsin` ni `~`: siempre `\operatorname{sen}` y `\operatorname{arcsen}`.
4. Verde y rojo solo para retroalimentación.
5. Toda respuesta del banco pasa `npm run banco -- --completo` y se corrige a sí misma en `src/lib/corrector.test.ts`.
6. Nunca des por hecha una tarea con un gate en rojo, y nunca edites un comando de verificación para que pase.
```

### 19.2 `AGENTS.md`

`AGENTS.md`

```markdown
# Pasa Cálculo: instrucciones para agentes

Reto diario gratis de 3 ejercicios de Cálculo para universitarios peruanos: sitio estático en Astro con una isla Preact, publicado en GitHub Pages.

## Comandos

| Tarea             | Comando                       |
| ----------------- | ----------------------------- |
| Instalar          | `npm install`                 |
| Desarrollo        | `npm run dev`                 |
| Construir         | `npm run build`               |
| Pruebas unitarias | `npm test`                    |
| E2E               | `npm run e2e`                 |
| Banco completo    | `npm run banco -- --completo` |
| Revisar formato   | `npm run format:check`        |

## Innegociable

1. Sin cuentas, base de datos, backend, analítica ni servicios externos.
2. El enlace de WhatsApp es exactamente `https://wa.link/de928w`.
3. Nunca se muestra `sin`, `arcsin` ni `~`: siempre `\operatorname{sen}` y `\operatorname{arcsen}`.
4. La fecha siempre se calcula en `America/Lima` con `fechaLima()`.
5. `mathlive` y el corrector se cargan solo con `import()`, al entrar a Ejercicio.
6. Nunca edites un comando de verificación para que pase.

La arquitectura completa, los límites entre capas y los tokens están en `CLAUDE.md`, en esta misma carpeta.
```

### 19.3 `.claude/settings.json`

Cada comando de los `Verify` y de §20.1 está permitido, subcomando por subcomando. Los bloques de fallo esperado usan `grep` y `test`, ambos en la lista.

`.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install)",
      "Bash(npm ci)",
      "Bash(npm audit)",
      "Bash(npm test)",
      "Bash(npm test:*)",
      "Bash(npm run build)",
      "Bash(npm run banco)",
      "Bash(npm run banco:*)",
      "Bash(npm run e2e)",
      "Bash(npm run e2e:*)",
      "Bash(npm run format)",
      "Bash(npm run format:check)",
      "Bash(npm run dev)",
      "Bash(npm run preview)",
      "Bash(npx playwright install chromium)",
      "Bash(node scripts/probar-sitio.mjs)",
      "Bash(node scripts/verificar-banco.mjs:*)",
      "Bash(node scripts/verificar-dist.mjs:*)",
      "Bash(node -e \"require('fs').cpSync('blueprints/pasa-calculo/workspace','.',{recursive:true,force:false})\")",
      "Bash(test:*)",
      "Bash(grep:*)",
      "Bash(git rev-parse:*)",
      "Bash(git init -b main)",
      "Bash(git config user.name)",
      "Bash(git config user.name:*)",
      "Bash(git config user.email)",
      "Bash(git config user.email:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git tag:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git ls-files:*)",
      "Bash(git check-ignore:*)",
      "Bash(git rev-list:*)",
      "Bash(git reset --hard step-*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(git push:*)",
      "Bash(npm publish:*)",
      "Bash(gh repo create:*)"
    ]
  }
}
```

### 19.4 Project skills — `.claude/skills/<name>/SKILL.md`

| Skill | Triggers on | What it automates |
|---|---|---|
| `agregar-ejercicio` | "agrega un ejercicio", "corrige la respuesta" | editar el banco y verificarlo |

`.claude/skills/agregar-ejercicio/SKILL.md`

````markdown
---
name: agregar-ejercicio
description: Agrega o corrige un ejercicio del banco de Pasa Cálculo. Úsala cuando pidan "agrega un ejercicio", "corrige la respuesta de lim-30", "cambia un enunciado" o "hay un error en un ejercicio".
---

# Agregar ejercicio

## Cuándo usarla

Cuando un ejercicio de `src/data/banco/*.json` se agrega o cambia.

## Pasos

1. Lee `.claude/rules/contenido.md`.
2. Abre el JSON del tema y copia la forma de un ejercicio vecino del mismo `tipo`.
3. Conserva el orden por `n`. Si el ejercicio viene del PDF, usa su número. Si es nuevo, primero agrégalo en `fuente/ejercicios-pdf.txt`, en su sección.
4. Si cambia el total de un tema, actualiza `TEMAS` en `scripts/verificar-banco.mjs` y la prueba del tema en `tests/`.
5. Un tema con 3 ejercicios más agrega un trío: el reparto de `src/lib/retos.ts` se recalcula solo.

## Verificar

```bash
npm run format
npm run banco -- --completo               # expect: exit 0, imprime banco ok
npm test -- src/lib/corrector.test.ts     # expect: exit 0, se corrige a sí mismo
```

## No hagas

- No escribas `\sin`, `\arcsin`, `~` ni la palabra "sin" en un texto mostrado.
- No hagas pasar una respuesta editando `scripts/verificar-banco.mjs`: si el chequeo falla, la respuesta o la función están mal.
````

### 19.5 `.claude/rules/*.md`

| File | `paths` globs | Covers |
|---|---|---|
| `.claude/rules/contenido.md` | `src/data/banco/**`, `fuente/**` | notación sen, sin `~`, formato |
| `.claude/rules/pantallas.md` | `src/components/**`, `src/styles/**`, `e2e/**` | pantallas, tokens y E2E |

`.claude/rules/contenido.md`

```markdown
---
description: Notación y formato del banco de ejercicios
paths:
  - "src/data/banco/**"
  - "fuente/**"
---

# Contenido del banco

- Cada ejercicio conserva el número `n` del PDF. El id es `lim-NN`, `con-NN`, `der-NN` o `int-NN`.
- En todo texto mostrado (`enunciado`, `respuesta`, `solucion`) usa `\operatorname{sen}` y `\operatorname{arcsen}`.
- `chequeo.f` no se muestra y puede usar `\sin` y `\arcsin`.
- Nunca escribas `~`. Reescribe con límites fundamentales.
- Nunca escribas la palabra "sin" en un texto mostrado, ni siquiera en español: el verificador la rechaza. Usa "que no tiene" u otra frase.
- `enunciado` y `solucion` son texto en español con `$LaTeX$`. Una línea de solución.
- `respuesta` es LaTeX sin `f'(x)=` ni `k=`. En `opcion`, es la clave de la opción.
- Las indefinidas llevan `constante: true` y terminan en `+C`.
- Continuidad excluye los números 6, 25, 26, 27, 28, 29, 30, 31, 34 y 43.
- Después de editar, corre `npm run format`, `npm run banco -- --completo` y `npm test -- src/lib/corrector.test.ts`.
```

`.claude/rules/pantallas.md`

```markdown
---
description: Convenciones de pantallas, estilos y pruebas E2E
paths:
  - "src/components/**"
  - "src/styles/**"
  - "e2e/**"
---

# Pantallas

- Una pantalla, una decisión, un botón primario con `class="boton boton-primario"`.
- Cada pantalla tiene exactamente un `h1`.
- Usa `button` y `a` nativos. Nunca `onClick` en un `div`.
- Todo `main button` y `main a` mide al menos 48px de alto.
- El color nunca va solo: `✓ Correcto` y `✗ Incorrecto` llevan texto.
- Sin hex ni medidas sueltas en componentes: usa las variables de `src/styles/tokens.css`.
- Los mensajes que aparecen sin cambio de foco llevan `role="status"`.
- Las fechas de los E2E se fijan con `page.clock.setFixedTime`, antes de `page.goto("./")`.
- Los E2E leen los JSON con `readFileSync` y no con `import`.
- En los E2E, el campo se llena con `evaluate((el: HTMLInputElement, v: string) => {...})`, asignando `value` y disparando `input`.
```

### 19.6 Verify-critical config and local infrastructure

Todos estos archivos son reales y están en `workspace/`, en la ruta que ocupan en el proyecto. Ningún paso los escribe.

| File | Path in the project | Which `Verify` commands need it | Resolution/env handling it carries | Bundle-path exclusion |
|---|---|---|---|---|
| Manifiesto | `package.json` | todos | scripts `banco`, `e2e`, `format`, `format:check`; `"type": "module"`; ningún tool lee env | `n/a — npm no recorre el árbol: no hay workspaces` |
| TypeScript | `tsconfig.json` | `npm run build` (`astro check`) | `extends astro/tsconfigs/strict`, `jsx` preact, `types: ["node"]` | `"exclude": ["dist", "node_modules", "blueprints"]` |
| Astro | `astro.config.mjs` | `npm run build`, `probar-sitio`, `npm run e2e` | `site`, `base`, integración preact | `n/a — Astro solo recorre src/` |
| Vitest | `vitest.config.ts` | `npm test` | none needed: compute-engine resuelve simple en Node y ninguna prueba importa mathlive | `exclude: ["blueprints/**", ...]` |
| Playwright | `playwright.config.ts` | `npm run e2e` | `webServer` con `npm run preview`, viewport 360×740 | `testIgnore: ["blueprints/**"]` |
| Prettier | `.prettierrc`, `.prettierignore` | `npm run format:check` | plugin de Astro, `endOfLine: auto` | línea `blueprints` en `.prettierignore` |
| Git | `.gitignore`, `.gitattributes` | checkpoints | LF fijo | `n/a — el bundle se versiona a propósito` |
| Runtime | `.nvmrc` | CI | Node 24 | `n/a — este archivo no recorre el árbol` |
| Prueba de ruta | `scripts/probar-sitio.mjs` | paso 1, §20.1 | usa `preview()` de Astro para no dejar procesos vivos | `n/a — solo lee dist/` |
| Datos fuente | `fuente/ejercicios-pdf.txt` | `npm run banco` | ninguno | línea `fuente` en `.prettierignore` |

No hay servicios locales: ningún `Verify` necesita base de datos, caché ni cola. Ninguna herramienta lee variables de entorno.

`package.json`

```json
{
  "name": "pasa-calculo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "e2e": "playwright test",
    "banco": "node scripts/verificar-banco.mjs",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "@astrojs/preact": "^6.1.1",
    "@cortex-js/compute-engine": "0.176.0",
    "@fontsource/poppins": "^5.3.0",
    "astro": "^7.4.4",
    "katex": "0.19.1",
    "mathlive": "0.111.4",
    "preact": "^10.29.8"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.12",
    "@playwright/test": "^1.64.1",
    "@types/node": "^26.6.6",
    "prettier": "^3.9.10",
    "prettier-plugin-astro": "^1.1.2",
    "typescript": "^6.0.3",
    "vitest": "^5.0.5"
  }
}
```

`tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "types": ["node"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules", "blueprints"]
}
```

`astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: "https://oswalec.github.io",
  base: "/pasa-calculo",
  output: "static",
  integrations: [preact()],
});
```

`vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["blueprints/**", "e2e/**", "dist/**", "node_modules/**"],
    testTimeout: 30000,
  },
});
```

`playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4321/pasa-calculo/";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["blueprints/**"],
  reporter: "list",
  use: {
    baseURL,
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 740 },
      },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
```

`.prettierrc`

```json
{
  "endOfLine": "auto",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

`.prettierignore`

```text
blueprints
fuente
dist
package-lock.json
```

`.gitignore`

```text
node_modules/
dist/
.astro/
test-results/
playwright-report/
.env
.env.*
```

`.gitattributes`

```text
* text=auto eol=lf
*.png binary
```

`.nvmrc`

```text
24
```

`scripts/probar-sitio.mjs`

```js
// Sirve dist/ con el preview de Astro y exige 200 con "Pasa Cálculo" en la ruta publicada.
// Usa la API de Astro para no dejar procesos vivos en Windows ni en Linux.
import { preview } from "astro";

const url = "http://localhost:4321/pasa-calculo/";
const servidor = await preview({ root: ".", logLevel: "error" });
let fallo = "";
try {
  const respuesta = await fetch(url);
  const html = await respuesta.text();
  if (respuesta.status !== 200) fallo = `estado ${respuesta.status} en ${url}`;
  else if (!html.includes("Pasa Cálculo"))
    fallo = `falta "Pasa Cálculo" en ${url}`;
} catch (error) {
  fallo = `no respondió ${url}: ${error.message}`;
} finally {
  await servidor.stop();
}
if (fallo) {
  console.error(fallo);
  process.exit(1);
}
console.log(`ok ${url}`);
process.exit(0);
```

#### Resolution convention matrix

**La convención, una sola vez:** los imports internos son relativos y llevan la extensión real, por ejemplo `./fechas.ts` o `../data/tipos.ts`. No hay alias de ruta ni archivos barril.

| Context | Command that exercises it | Convention as it appears there | Config + literal setting that makes it work |
|---|---|---|---|
| Application source | `npm run build` | `./fechas.ts`, `../lib/teclado.ts` | `tsconfig.json`: `extends astro/tsconfigs/strict`, que trae `allowImportingTsExtensions: true` y `moduleResolution: "bundler"` |
| Test files | `npm test` | `./retos.ts`, `../data/banco/limites.json` | el resolvedor de Vite en `vitest.config.ts`; `resolveJsonModule` viene de la misma base de Astro |
| Standalone scripts | `node scripts/verificar-banco.mjs` | solo `node:*` y paquetes; nunca importan `src/` | `.mjs` más `"type": "module"` en `package.json`. Node resuelve `@cortex-js/compute-engine` por su `exports`; por eso `normalizar` existe también dentro del script |
| Build / bundle | `npm run build` | igual que la aplicación | Vite de Astro empaqueta y los `import()` crean trozos aparte |
| E2E | `npm run e2e` | `../src/lib/retos.ts`; JSON con `readFileSync` | el cargador TypeScript de Playwright; el JSON no se importa porque ESM lo exigiría con atributo |
| Paquete con condición | `npm run e2e -- e2e/ejercicio.spec.ts` | `import("mathlive")` solo en el navegador | condición `browser` de `exports`; `client:only` evita que corra en el servidor, y ninguna prueba de Vitest lo importa |

Las filas de aplicación, pruebas, scripts, build y E2E se ejercitan con sus comandos desde los pasos 1 a 3. La fila de MathLive se apoya en lo que publica el paquete: la condición `browser` de su `exports` y los identificadores de sus tipos. El `Verify` del paso 10 comprueba `customElements.get("math-field")` con `npm run build` más `e2e/ejercicio.spec.ts`.

#### Cross-artifact value reconciliation

| Shared value | Single source — the file that decides it | Literal value | Every other place it appears | Compared |
|---|---|---|---|---|
| Ruta base | `astro.config.mjs` — `base` | `/pasa-calculo` en `base`; `/pasa-calculo/` con barra final en cada URL | `scripts/probar-sitio.mjs` — `url`; `playwright.config.ts` — `baseURL`; `scripts/verificar-dist.mjs` — `BASE`; §12 | yes |
| Origen del sitio | `astro.config.mjs` — `site` | `https://oswalec.github.io` | `scripts/verificar-dist.mjs`; §12; paso 13 sin esquema | yes |
| Puerto local | predeterminado de `astro preview` | `4321` | `scripts/probar-sitio.mjs`; `playwright.config.ts`; `CLAUDE.md`; §12; paso 13, en `http://localhost:4321/` | yes |
| Salida | predeterminado de Astro | `dist` | `.gitignore`; `.prettierignore`; `tsconfig.json`; `vitest.config.ts`; `deploy.yml` — `path`; `scripts/verificar-dist.mjs` | yes |
| Carpeta E2E | `playwright.config.ts` — `testDir` | `e2e` | `vitest.config.ts` — `exclude`; pasos 1, 9 a 14 | yes |
| Ruta del bundle | §10 Bootstrap | `blueprints/pasa-calculo/workspace` | `.claude/settings.json`; §19; `.prettierignore`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts` por su prefijo `blueprints` | yes |
| Fuente del banco | `fuente/ejercicios-pdf.txt` | `fuente/ejercicios-pdf.txt` | `scripts/verificar-banco.mjs`; `CLAUDE.md`; §10; pasos 3 a 6 | yes |
| Carpeta del banco | `scripts/verificar-banco.mjs` — `carpeta` | `src/data/banco` | `CLAUDE.md`; `.claude/rules/contenido.md`; pasos 3 a 6. Forma relativa distinta, `../data/banco/`, en `src/lib/banco.ts` y `src/lib/corrector.test.ts` | yes |
| WhatsApp | `src/components/Resultado.tsx` | `https://wa.link/de928w` | `scripts/verificar-dist.mjs` — `WHATSAPP`; `CLAUDE.md`; `AGENTS.md`; `e2e/flujo.spec.ts` | yes |
| Clave de progreso | `src/lib/progreso.ts` | `pasa-calculo:v1` | `e2e/inicio.spec.ts`; `CLAUDE.md`; §4 | yes |
| Versión de Node | `.nvmrc` | `24` | `package.json` — `engines` `>=24`; `deploy.yml` — `node-version-file` | yes |
| Título | `src/layouts/Base.astro` | `Pasa Cálculo` | `scripts/probar-sitio.mjs`; `scripts/verificar-dist.mjs`; paso 1 | yes |
| Descripción | `src/layouts/Base.astro` | `Reto diario gratis de 3 ejercicios de Cálculo.` | `scripts/verificar-dist.mjs`; paso 1 | yes |
| Viewport E2E | `playwright.config.ts` | `360` × `740` | paso 14 | yes |
| Ruta de `verificar-dist` | paso 15 — `Do` | `scripts/verificar-dist.mjs` | `.github/workflows/deploy.yml`; `.claude/settings.json`; `CLAUDE.md`; §12; §20.1 | yes |
| Ruta de `probar-sitio` | `workspace/scripts/probar-sitio.mjs` | `scripts/probar-sitio.mjs` | `.claude/settings.json`; `CLAUDE.md`; paso 1; §12; §16; §20.1 | yes |
| Ruta de `verificar-banco` | `package.json` — script `banco` | `scripts/verificar-banco.mjs` | `.claude/settings.json`; `.claude/skills/agregar-ejercicio/SKILL.md`; `tests/verificar-banco.test.ts`; paso 3; §13 | yes |
| Ruta del workflow | paso 15 — `Do` | `.github/workflows/deploy.yml` | §3; §12; `tests` de paso 15 por `grep`; epic `05-entrega` | yes |
| Raíces de prueba | `vitest.config.ts` — `include` | `src/**/*.test.ts`, `tests/**/*.test.ts` | §3; §13; rutas de `npm test --` en pasos 2 a 8 y 15 | yes |
| Script `dev` | `package.json` — `scripts.dev` | `astro dev` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json` | yes |
| Script `build` | `package.json` — `scripts.build` | `astro check && astro build` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json`; `.github/workflows/deploy.yml`; paso 1; §20 | yes |
| Script `preview` | `package.json` — `scripts.preview` | `astro preview` | `playwright.config.ts`; `CLAUDE.md`; `.claude/settings.json` | yes |
| Script `test` | `package.json` — `scripts.test` | `vitest run` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json`; `.github/workflows/deploy.yml`; paso 2; §20 | yes |
| Script `e2e` | `package.json` — `scripts.e2e` | `playwright test` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json`; `.github/workflows/deploy.yml`; paso 1; §20 | yes |
| Script `banco` | `package.json` — `scripts.banco` | `node scripts/verificar-banco.mjs` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json`; `.claude/rules/contenido.md`; `.github/workflows/deploy.yml`; paso 3; §20 | yes |
| Script `format` | `package.json` — `scripts.format` | `prettier --write .` | `CLAUDE.md`; `.claude/settings.json`; `.claude/rules/contenido.md`; paso 4 | yes |
| Script `format:check` | `package.json` — `scripts.format:check` | `prettier --check .` | `CLAUDE.md`; `AGENTS.md`; `.claude/settings.json`; `.github/workflows/deploy.yml`; paso 1; §20 | yes |
| Bandera de banco completo | `scripts/verificar-banco.mjs` — `argumentos.includes` | `--completo` | `CLAUDE.md`; `AGENTS.md`; `.claude/rules/contenido.md`; `.claude/skills/agregar-ejercicio/SKILL.md`; `.github/workflows/deploy.yml`; `tests/verificar-banco.test.ts`; paso 3; paso 6; paso 7; paso 15; §12; §20 | yes |
| Repositorio | §10 — *Accounts to create first* | `Oswalec/pasa-calculo` | §12; §20 | yes |
| Nombre del paquete | `package.json` — `name` | `pasa-calculo` | `astro.config.mjs`; §12 | yes |
| URL publicada | `astro.config.mjs` — `site` más `base` | `https://oswalec.github.io/pasa-calculo/` | `scripts/verificar-dist.mjs`; §20. `site` y `base` la componen; la tarjeta del paso 13 la imprime sin esquema como `oswalec.github.io/pasa-calculo` | yes |
| Rama de publicación | §10 Bootstrap — `git init -b main` | `main` | `.github/workflows/deploy.yml`; `.claude/settings.json`; §12; paso 15 | yes |
| Copia del workspace | §10 Bootstrap | `node -e "require('fs').cpSync('blueprints/pasa-calculo/workspace','.',{recursive:true,force:false})"` | §19. también en `.claude/settings.json`, con las comillas escapadas que exige JSON | yes |
| Instalación de Chromium | §10 Bootstrap | `npx playwright install chromium` | `.claude/settings.json`; §20. `deploy.yml` usa a propósito la forma distinta `npx playwright install --with-deps chromium` | yes |
| Prefijo de tags | §9 — campo `Checkpoint` | `step-` | `tasks.json` E1-T1; epic `01-base`; `.claude/settings.json`; §20. cada tag completo, `step-NN-slug`, es igual en §9, `tasks.json` y su epic | yes |
| Clave de progreso, valor | §4 — *Progreso* | `resultados` | paso 8; `tasks.json` E3-T2. §4 y el paso 8 lo muestran con espacios; el criterio del paso 8 lo muestra compacto. Es el mismo JSON | yes |
| Familia y pesos de fuente | `src/layouts/Base.astro` — imports `@fontsource/poppins` | `Poppins` | `src/styles/tokens.css`; `CLAUDE.md`; paso 13. pesos `400`, `600`, `800` en `Base.astro`, §7 y `CLAUDE.md`; el paso 13 carga el peso `800`; `package.json` nombra `@fontsource/poppins` | yes |
| Tokens de color | `src/styles/tokens.css` | `--durazno` | `CLAUDE.md`; §7; paso 1. los 8 tokens y valores coinciden; Prettier deja el hex en minúscula en `tokens.css` y §7, `CLAUDE.md` y `theme-color` lo escriben en mayúscula. CSS no distingue, y el paso 1 usa `grep -qi` | yes |
| Zona horaria | `src/lib/fechas.ts` — `ZONA` | `America/Lima` | `AGENTS.md`; paso 2 | yes |
| Fecha de inicio del reparto | `src/lib/retos.ts` — `INICIO` | `2026-01-01` | §4; paso 2; `src/lib/retos.test.ts` | yes |
| Prefijos de id | `scripts/verificar-banco.mjs` — `TEMAS` | `lim` | §4; `.claude/rules/contenido.md`. `lim`, `con`, `der`, `int`, en §4 y en `.claude/rules/contenido.md` con la forma `lim-NN` | yes |
| Totales por tema | `scripts/verificar-banco.mjs` — `TEMAS` | `total: 40` | 50, 40, 50, 50, repetidos en los pasos 3 a 6 y en el epic `02-banco`; `tests/banco-continuidad.test.ts` fija el 40 | yes |
| Números excluidos | `scripts/verificar-banco.mjs` — `EXCLUIDOS` | `6, 25, 26, 27, 28, 29, 30, 31, 34` | `tests/banco-continuidad.test.ts`; `.claude/rules/contenido.md`; paso 4. el 43 cierra la lista; en prosa va tras "y" | yes |
| Puntos de evaluación | `src/lib/corrector.ts` — `PUNTOS` | `-2.71, -1.37, -0.83, -0.41, 0.23, 0.37, 0.81, 1.43, 2.19, 2.77` | `scripts/verificar-banco.mjs` | yes |
| Claves de opción | `src/data/tipos.ts` — `Opcion` | `removible` | `scripts/verificar-banco.mjs`; `tests/banco-continuidad.test.ts`; §4; paso 4. `continua`, `removible`, `salto`, `infinita` | yes |
| Etiquetas de opción | `src/data/tipos.ts` — `ETIQUETA_OPCION` | `Discontinua de salto` | §4; paso 10; `tasks.json` E4-T2 | yes |
| Traducción de sen y arcsen | `src/lib/corrector.ts` — `normalizar` | `\\operatorname{arcsen}` | `scripts/verificar-banco.mjs`; `src/lib/teclado.ts`. la misma traducción, con espacio final, en corrector y verificador; la tecla inserta `\operatorname{arcsen}` | yes |
| Archivo de la tarjeta | paso 13 — `Do` | `pasa-calculo-resultado.png` | `tasks.json` E4-T5; epic `04-pantallas` | yes |
| Texto de acompañamiento | §6 — *Pantallas* | `Te acompañaré hasta que logres pasar el cálculo que necesites` | paso 12; `tasks.json` E4-T4; epic `04-pantallas` | yes |
| Texto del botón de WhatsApp | §6 — *Pantallas* | `Quiero que me acompañes` | paso 12; `tasks.json` E4-T4 | yes |
| Texto de entrada inválida | §6 — *Pantallas* | `Revisa tu respuesta` | paso 10; `tasks.json` E4-T2; §15 | yes |
| Texto de falta de C | §6 — *Pantallas* | `Correcto. Recuerda escribir el +C.` | paso 11; `tasks.json` E4-T3 | yes |
| Título de Inicio | §6 — *Pantallas* | `Reto de hoy: 3 ejercicios` | paso 9; `tasks.json` E4-T1 | yes |
| Texto de cuenta regresiva | §6 — *Pantallas* | `Nuevo reto en` | paso 12; `tasks.json` E4-T4 | yes |
| Versiones de actions | `.github/workflows/deploy.yml` — `uses` | `checkout@v7`, `setup-node@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5` | §11; paso 15 `Verify` para `deploy-pages@v5` | yes |

La ruta base se ejercita en el paso 1 con `node scripts/probar-sitio.mjs` y con `npm run e2e -- e2e/humo.spec.ts`, el primer paso en que existen ambos lados.

#### Byte-exact artifact reconciliation

NOT APPLICABLE — this blueprint authors no byte-exact expected output.

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando de abajo sale con 0 en un checkout limpio. CI corre lo mismo salvo dos diferencias: instala Chromium con `--with-deps` y no ejecuta `node scripts/probar-sitio.mjs`.

```bash
npm ci                              # expect: exit 0; imprime EBADENGINE como aviso
npx playwright install chromium     # expect: exit 0
npm run format:check                # expect: exit 0
npm test                            # expect: exit 0, 0 fallidas, 0 omitidas
npm run banco -- --completo         # expect: exit 0, imprime banco ok
npm run build                       # expect: exit 0, 0 errores de astro check
node scripts/verificar-dist.mjs     # expect: exit 0, imprime dist ok
node scripts/probar-sitio.mjs       # expect: exit 0, la ruta publicada responde 200
npm run e2e                         # expect: exit 0, 0 fallidas
```

Gates manuales de construcción, revisados una vez al terminar:

- [ ] `git tag -l 'step-*'` lista los 15 tags de §9.
- [ ] Cada archivo de *Files that must be committed* está registrado. Por ruta: `git ls-files --error-unmatch fuente/ejercicios-pdf.txt` y `git ls-files --error-unmatch package-lock.json` salen con 0, y `status=0; git check-ignore -q fuente/ejercicios-pdf.txt || status=$?; test "$status" -eq 1` sale con 0 (1 = no ignorado, 128 = uso incorrecto, y eso falla).
- [ ] `.gitignore` estuvo antes del primer commit: `test "$(git log --diff-filter=A --format=%H -- .gitignore | tail -n 1)" = "$(git rev-list --max-parents=0 HEAD)"` sale con 0.
- [ ] El Bootstrap de §10 se ejecutó otra vez sobre el árbol terminado, **salió con 0** y `npm test` sigue pasando.
- [ ] Cada fila de *Cross-artifact value reconciliation* dice `yes`, y `format:check` y `build` corrieron con el bundle presente.
- [ ] Cada no-objetivo de §1 sigue sin construir.

**Ninguna advertencia se ignora**, salvo `EBADENGINE`, documentada en §11.

Lista de lanzamiento, a cargo del dueño. Dependen de un tercero o de una persona, por eso no son gates de construcción:

- [ ] Crear el repositorio público: `gh repo create Oswalec/pasa-calculo --public --source=. --push`.
- [ ] Activar Pages con origen GitHub Actions en la configuración del repositorio y hacer el primer push.
- [ ] Abrir `https://oswalec.github.io/pasa-calculo/` y completar un reto. Los flujos críticos de §13 pasan contra esa URL.
- [ ] Probar el teclado en un celular real antes de pulir nada más: escribir una fracción, una potencia y sen.
- [ ] Probar con 3 alumnos, sin explicación, y que cada uno llegue al botón.
- [ ] Confirmar que `https://wa.link/de928w` abre el chat correcto.
- [ ] Pase solo con teclado y pase con lector de pantalla sobre el flujo principal.
- [ ] `npm audit` sin hallazgos altos o críticos.
- [ ] Un `git revert` de prueba publicado y deshecho, para ensayar la reversión de §12.

### 20.2 Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| Una respuesta correcta se califica mal | M | H | quejas por WhatsApp | paso 7: cada respuesta se corrige a sí misma; comparación numérica en 10 puntos |
| Teclado incómodo en un celular real | M | H | alumnos que no terminan el primer ejercicio | lista de lanzamiento: celular real antes de pulir |
| No se atribuyen contactos porque el mensaje de `wa.link` es fijo | H | L | el dueño no distingue el origen | aceptado por el dueño |
| Los ejercicios se repiten cada 13 a 16 días por tema | H | M | alumnos reconocen ejercicios | aceptado; se agregan más con la skill `agregar-ejercicio` |
| Compute Engine declara un `engines` mayor y pesa bastante | M | M | `EBADENGINE`, carga lenta de Ejercicio | se carga con `import()`; solo es un aviso, nunca `engine-strict` |
| Una versión nueva de MathLive cambia `layouts` | L | M | `e2e/ejercicio.spec.ts` falla | versión exacta y `package-lock.json` |

### 20.3 Decision log

| # | Decision | Rejected alternative | Why | Would reverse if |
|---|---|---|---|---|
| 1 | Astro estático con una isla Preact | Next | no hay servidor y Pages sirve estáticos | aparezcan cuentas o datos privados |
| 2 | Sin base de datos, JSON y `localStorage` | Supabase | el contacto ocurre en WhatsApp | haya que seguir alumnos entre dispositivos |
| 3 | Sin auth | login con Google | una pantalla más espanta a quien jaló | el dueño venda por suscripción |
| 4 | GitHub Pages | Cloudflare Pages | gratis y ya tiene la cuenta | necesite cabeceras propias |
| 5 | CSS propio con tokens | Tailwind | 4 pantallas; el canvas lee los mismos tokens | el sitio pase de 10 pantallas |
| 6 | Estado en `useState` | signals | cabe en un componente | se comparta estado entre islas |
| 7 | Corrección numérica en 10 puntos | CAS simbólico o comparar texto | aceptó todas las equivalencias probadas | un banco tenga funciones con pocos puntos válidos |
| 8 | Fecha siempre en `America/Lima` | fecha local | todos ven el mismo reto | el reto salga de Perú |
| 9 | Compute Engine y MathLive con `import()` | carga inicial | Inicio queda ligero | un trozo dinámico falle en redes malas |
| 10 | Copia con `cpSync` y `force: false` | `rsync`, `cp -n` | Git Bash no trae `rsync` y `cp -n` varía | el proyecto deje Windows |
| 11 | `client:only` | hidratar con HTML previo | depende de `localStorage` y de la fecha | se necesite indexar la pantalla de Inicio |

### 20.4 What to build next

1. Más ejercicios por tema, cuando los alumnos reconozcan repetidos.
2. Mensajes de WhatsApp por tema, cuando haga falta atribuir contactos.
3. Práctica libre, cuando el banco supere 500 ejercicios.
4. Analítica, cuando el dueño necesite saber dónde abandonan.
5. Dominio propio, cuando el reto tenga tráfico sostenido.

---

*Fin del blueprint. El orden de construcción es §9. Detente cuando §20.1 esté en verde.*
