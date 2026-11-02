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
