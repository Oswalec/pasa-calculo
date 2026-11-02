import { describe, expect, it } from "vitest";
import { guardarResultado, racha, resultadoDe } from "./progreso.ts";

function memoria(inicial?: string) {
  const datos = new Map<string, string>();
  if (inicial !== undefined) datos.set("pasa-calculo:v1", inicial);
  return {
    datos,
    getItem: (clave: string) => datos.get(clave) ?? null,
    setItem: (clave: string, valor: string) => void datos.set(clave, valor),
  };
}

describe("progreso", () => {
  it("guarda con el formato exacto bajo la clave", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-10", 2, almacen);
    expect(almacen.datos.get("pasa-calculo:v1")).toBe(
      '{"resultados":{"2026-03-10":{"limites":2}}}',
    );
  });

  it("lee lo guardado y conserva los otros temas del día", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-10", 2, almacen);
    guardarResultado("derivadas", "2026-03-10", 0, almacen);
    expect(resultadoDe("limites", "2026-03-10", almacen)).toBe(2);
    expect(resultadoDe("derivadas", "2026-03-10", almacen)).toBe(0);
  });

  it("devuelve null para un tema no hecho", () => {
    expect(resultadoDe("integrales", "2026-03-10", memoria())).toBeNull();
  });

  it("cuenta 3 días consecutivos que terminan hoy", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-08", 1, almacen);
    guardarResultado("limites", "2026-03-09", 1, almacen);
    guardarResultado("limites", "2026-03-10", 1, almacen);
    expect(racha("2026-03-10", almacen)).toBe(3);
  });

  it("cruza el fin de mes", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-02-28", 1, almacen);
    guardarResultado("limites", "2026-03-01", 1, almacen);
    expect(racha("2026-03-01", almacen)).toBe(2);
  });

  it("mantiene la racha si lo último fue ayer", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-08", 1, almacen);
    guardarResultado("limites", "2026-03-09", 1, almacen);
    expect(racha("2026-03-10", almacen)).toBe(2);
  });

  it("vale 0 si lo último es anterior a ayer", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-08", 1, almacen);
    expect(racha("2026-03-10", almacen)).toBe(0);
  });

  it("se corta en un día vacío", () => {
    const almacen = memoria();
    guardarResultado("limites", "2026-03-07", 1, almacen);
    guardarResultado("limites", "2026-03-09", 1, almacen);
    guardarResultado("limites", "2026-03-10", 1, almacen);
    expect(racha("2026-03-10", almacen)).toBe(2);
  });

  it("devuelve null y 0 con JSON corrupto, sin lanzar", () => {
    const almacen = memoria("{roto");
    expect(resultadoDe("limites", "2026-03-10", almacen)).toBeNull();
    expect(racha("2026-03-10", almacen)).toBe(0);
  });

  it("no lanza si setItem falla", () => {
    const almacen = {
      getItem: () => null,
      setItem: () => {
        throw new Error("sin espacio");
      },
    };
    expect(() =>
      guardarResultado("limites", "2026-03-10", 2, almacen),
    ).not.toThrow();
  });
});
