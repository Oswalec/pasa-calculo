import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/continuidad.json";

const numeros = (filtro: (e: (typeof banco)[number]) => boolean) =>
  banco
    .filter(filtro)
    .map((e) => e.n)
    .sort((a, b) => a - b);
const rango = (desde: number, hasta: number) =>
  Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);

describe("banco de continuidad", () => {
  it("excluye los números que no encajan", () => {
    const excluidos = [6, 25, 26, 27, 28, 29, 30, 31, 34, 43];
    expect(banco.filter((e) => excluidos.includes(e.n))).toEqual([]);
    expect(banco).toHaveLength(40);
  });

  it("reparte las respuestas de opción", () => {
    expect(numeros((e) => e.respuesta === "removible")).toEqual([
      3, 4, 22, 24, 36,
    ]);
    expect(numeros((e) => e.respuesta === "salto")).toEqual([
      8,
      ...rango(11, 20),
      38,
      40,
    ]);
    expect(numeros((e) => e.respuesta === "infinita")).toEqual([5]);
  });

  it("deja como expresión solo los de hallar k", () => {
    expect(numeros((e) => e.tipo === "expresion")).toEqual([
      41,
      42,
      ...rango(44, 50),
    ]);
  });

  it("limpia la notación del 11 al 20", () => {
    for (const e of banco.filter((e) => e.n >= 11 && e.n <= 20)) {
      expect(e.enunciado).not.toContain("+(");
      expect(e.enunciado).not.toMatch(/\b1x/);
    }
  });
});
