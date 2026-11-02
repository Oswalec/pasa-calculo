import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const correr = (...args: string[]) =>
  spawnSync(process.execPath, ["scripts/verificar-banco.mjs", ...args], {
    encoding: "utf8",
  });

describe("verificar-banco", () => {
  it("rechaza notación sin y respuesta falsa nombrando el id", () => {
    const { status, stdout } = correr("--dir", "tests/fixtures/banco-malo");
    expect(status).toBe(1);
    expect(stdout).toContain("FALLA lim-01: notación prohibida");
    expect(stdout).toContain("FALLA lim-01: f(");
    expect(stdout).toContain("FALLA limites: tiene 1 ejercicios, deben ser 50");
  });

  it("con --completo exige los cuatro temas", () => {
    const { status, stdout } = correr(
      "--completo",
      "--dir",
      "tests/fixtures/no-existe",
    );
    expect(status).toBe(1);
    expect(stdout).toContain("FALLA integrales: falta");
  });
});
