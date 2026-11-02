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
