import { describe, expect, it } from "vitest";
import type { Ejercicio } from "../data/tipos.ts";
import continuidad from "../data/banco/continuidad.json";
import derivadas from "../data/banco/derivadas.json";
import integrales from "../data/banco/integrales.json";
import limites from "../data/banco/limites.json";
import { corregir, normalizar } from "./corrector.ts";

const r = String.raw;
const bancos = [
  limites,
  continuidad,
  derivadas,
  integrales,
] as unknown as Ejercicio[][];
const expresiones = bancos.flat().filter((e) => e.tipo === "expresion");
const CORRECTO = { estado: "correcto", faltaC: false };

describe("normalizar", () => {
  it("toma lo que sigue al último igual y traduce sen", () => {
    expect(normalizar(r`f'(x)=\operatorname{sen}x`)).toBe(r`\sin x`);
    expect(normalizar(r`\operatorname{arcsen}x`)).toBe(r`\arcsin x`);
  });
});

describe("equivalencias", () => {
  it.each([
    [r`2\operatorname{sen}x\cos x`, r`\operatorname{sen}2x`],
    [r`\frac{1}{2\sqrt{x}}`, r`0.5x^{-\frac12}`],
    [r`\ln\left|x^2+1\right|`, r`\ln(x^2+1)`],
    [r`\sec^2x`, r`1+\tan^2x`],
    [r`e^x(x^2+2x)`, r`2xe^x+x^2e^x`],
    [r`-\csc^2x`, r`-\frac{1}{\operatorname{sen}^2x}`],
  ])("%s equivale a %s", (alumno, esperado) => {
    expect(corregir(alumno, esperado)).toEqual(CORRECTO);
  });

  it.each([
    ["5", "6"],
    ["x^2", "x^3"],
    ["t^2", "x^2"],
  ])("%s no equivale a %s", (alumno, esperado) => {
    expect(corregir(alumno, esperado)).toEqual({ estado: "incorrecto" });
  });
});

describe("casos límite", () => {
  it("marca inválido lo vacío y lo que no se puede leer", () => {
    expect(corregir("  ", "2")).toEqual({ estado: "invalido" });
    expect(corregir("x=", "2")).toEqual({ estado: "invalido" });
  });

  it("compara infinitos por forma", () => {
    expect(corregir(r`\infty`, r`\infty`)).toEqual(CORRECTO);
    expect(corregir(r`-\infty`, r`\infty`)).toEqual({ estado: "incorrecto" });
  });

  it("acepta otra constante y detecta la falta de C", () => {
    expect(corregir(r`x^2+C`, r`x^2+C`, true)).toEqual(CORRECTO);
    expect(corregir(r`x^2+7`, r`x^2+C`, true)).toEqual({
      estado: "correcto",
      faltaC: true,
    });
    expect(corregir(r`x^3+C`, r`x^2+C`, true)).toEqual({
      estado: "incorrecto",
    });
  });
});

describe("bancos", () => {
  it.each(expresiones.map((e) => [e.id, e] as const))(
    "%s se corrige a sí mismo",
    (_id, e) => {
      expect(corregir(e.respuesta, e.respuesta, e.constante).estado).toBe(
        "correcto",
      );
    },
  );

  it.each(expresiones.map((e) => [e.id, e] as const))(
    "%s rechaza una falsa",
    (_id, e) => {
      const infinita = e.respuesta.endsWith(r`\infty`);
      const falsa = infinita ? "0" : r`\left(${e.respuesta}\right)+x`;
      expect(corregir(falsa, e.respuesta, e.constante).estado).toBe(
        "incorrecto",
      );
    },
  );
});
