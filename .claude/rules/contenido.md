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
