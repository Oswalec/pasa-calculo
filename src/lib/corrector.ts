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
