import type { Ejercicio, Tema } from "../data/tipos.ts";

/** Carga solo el banco del tema elegido: cada JSON queda en su propio archivo. */
export async function cargarBanco(tema: Tema): Promise<Ejercicio[]> {
  const modulos = {
    limites: () => import("../data/banco/limites.json"),
    continuidad: () => import("../data/banco/continuidad.json"),
    derivadas: () => import("../data/banco/derivadas.json"),
    integrales: () => import("../data/banco/integrales.json"),
  };
  const modulo = await modulos[tema]();
  return modulo.default as unknown as Ejercicio[];
}
