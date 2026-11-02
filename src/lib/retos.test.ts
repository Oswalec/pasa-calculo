import { describe, expect, it } from "vitest";
import { retoDeHoy, trios } from "./retos.ts";

const lista = (largo: number) =>
  Array.from({ length: largo }, (_, i) => ({ n: i + 1 }));

describe("reparto de retos", () => {
  it("arma 16 tríos con 50 ejercicios y descarta el sobrante", () => {
    const ciclo = trios(lista(50));
    expect(ciclo).toHaveLength(16);
    expect(ciclo[0]?.map((e) => e.n)).toEqual([1, 17, 33]);
    expect(ciclo[15]?.map((e) => e.n)).toEqual([16, 32, 48]);
  });

  it("arma 13 tríos con 40 ejercicios", () => {
    expect(trios(lista(40))).toHaveLength(13);
  });

  it("no repite ejercicios dentro del ciclo", () => {
    const usados = trios(lista(50))
      .flat()
      .map((e) => e.n);
    expect(new Set(usados).size).toBe(usados.length);
  });

  it("ordena por n aunque la lista venga desordenada", () => {
    const desordenada = lista(9).reverse();
    expect(trios(desordenada)[0]?.map((e) => e.n)).toEqual([1, 4, 7]);
  });

  it("usa el día desde 2026-01-01 módulo k", () => {
    expect(retoDeHoy(lista(50), "2026-01-01")[0].n).toBe(1);
    expect(retoDeHoy(lista(50), "2026-01-17")[0].n).toBe(1);
    expect(retoDeHoy(lista(50), "2026-01-02")[0].n).toBe(2);
    expect(retoDeHoy(lista(50), "2025-12-31")[0].n).toBe(16);
  });

  it("falla si el banco no alcanza para un trío", () => {
    expect(() => retoDeHoy(lista(2), "2026-01-01")).toThrow(
      "Banco sin ejercicios suficientes",
    );
  });
});
