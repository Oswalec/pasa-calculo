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
