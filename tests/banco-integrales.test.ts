import { describe, expect, it } from "vitest";
import banco from "../src/data/banco/integrales.json";
import type { Ejercicio } from "../src/data/tipos.ts";

const lista = banco as unknown as Ejercicio[];
const definida = (n: number) => n >= 31 && n <= 40;

describe("banco de integrales", () => {
  it("marca las indefinidas con constante y +C", () => {
    for (const e of lista.filter((e) => !definida(e.n))) {
      expect(e.constante).toBe(true);
      expect(e.respuesta.endsWith("+C")).toBe(true);
    }
  });

  it("deja las definidas sin constante y con límites numéricos", () => {
    for (const e of lista.filter((e) => definida(e.n))) {
      expect(e.constante).toBeUndefined();
      expect(e.respuesta).not.toContain("C");
      expect(e.chequeo.clase === "integral" && typeof e.chequeo.a).toBe(
        "number",
      );
      expect(e.chequeo.clase === "integral" && typeof e.chequeo.b).toBe(
        "number",
      );
    }
  });
});
