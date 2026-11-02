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
