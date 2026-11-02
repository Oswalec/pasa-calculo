import type { Tema } from "../data/tipos.ts";
import { diasEntre } from "./fechas.ts";

const CLAVE = "pasa-calculo:v1";

type Almacen = Pick<Storage, "getItem" | "setItem">;
type Progreso = { resultados: Record<string, Partial<Record<Tema, number>>> };

function almacenPorDefecto(): Almacen | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function leer(almacen: Almacen | null): Progreso {
  try {
    const texto = almacen?.getItem(CLAVE);
    if (!texto) return { resultados: {} };
    const dato = JSON.parse(texto) as Partial<Progreso> | null;
    if (typeof dato?.resultados !== "object" || dato.resultados === null) {
      return { resultados: {} };
    }
    return { resultados: dato.resultados };
  } catch {
    return { resultados: {} };
  }
}

/** Guarda los aciertos del día. Si el almacenamiento falla, el reto sigue sin guardar. */
export function guardarResultado(
  tema: Tema,
  fecha: string,
  aciertos: number,
  almacen: Almacen | null = almacenPorDefecto(),
): void {
  const progreso = leer(almacen);
  progreso.resultados[fecha] = {
    ...progreso.resultados[fecha],
    [tema]: aciertos,
  };
  try {
    almacen?.setItem(CLAVE, JSON.stringify(progreso));
  } catch {
    // Sin espacio o sin permiso: el reto continúa.
  }
}

/** Aciertos guardados de un tema en una fecha, o null si no se hizo. */
export function resultadoDe(
  tema: Tema,
  fecha: string,
  almacen: Almacen | null = almacenPorDefecto(),
): number | null {
  return leer(almacen).resultados[fecha]?.[tema] ?? null;
}

/** Fechas consecutivas de Lima con resultado, terminando hoy o ayer. */
export function racha(
  hoy: string,
  almacen: Almacen | null = almacenPorDefecto(),
): number {
  const { resultados } = leer(almacen);
  const fechas = Object.keys(resultados)
    .filter((f) => Object.keys(resultados[f] ?? {}).length > 0)
    .sort()
    .reverse();
  const [ultima] = fechas;
  if (ultima === undefined || diasEntre(ultima, hoy) > 1) return 0;
  let cuenta = 1;
  for (let i = 1; i < fechas.length; i++) {
    const anterior = fechas[i - 1] as string;
    if (diasEntre(fechas[i] as string, anterior) !== 1) break;
    cuenta += 1;
  }
  return cuenta;
}
