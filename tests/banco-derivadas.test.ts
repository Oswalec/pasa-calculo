import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/derivadas.json";
import type { Ejercicio } from "../src/data/tipos.ts";

const lista = banco as unknown as Ejercicio[];

describe("banco de derivadas", () => {
  it("evalúa en el punto del PDF los números 33 a 35", () => {
    const puntos = lista
      .filter((e) => e.n >= 33 && e.n <= 35)
      .map((e) => [
        e.n,
        e.chequeo.clase === "derivada" && e.chequeo.en,
        e.respuesta,
      ]);
    expect(puntos).toEqual([
      [33, 2, "10"],
      [34, -1, "-11"],
      [35, 1, "5"],
    ]);
  });

  it("pide f'(x) en todos los demás", () => {
    for (const e of lista.filter((e) => e.n < 33 || e.n > 35)) {
      expect(e.enunciado).toContain("Halla $f'(x)$");
    }
  });

  it("guarda solo el lado derecho en la respuesta", () => {
    expect(lista.filter((e) => e.respuesta.includes("f'(x)="))).toEqual([]);
  });
});
