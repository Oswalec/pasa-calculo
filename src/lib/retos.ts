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
