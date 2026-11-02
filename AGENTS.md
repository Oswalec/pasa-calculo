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
