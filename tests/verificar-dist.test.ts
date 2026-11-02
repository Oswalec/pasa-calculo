import { spawnSync } from "node:child_process";
import { expect, it } from "vitest";

it("verificar-dist rechaza un sitio sin título y con ruta fuera de la base", () => {
  const { status, stdout } = spawnSync(
    process.execPath,
    ["scripts/verificar-dist.mjs", "--dir", "tests/fixtures/dist-malo"],
    { encoding: "utf8" },
  );
  expect(status).toBe(1);
  expect(stdout).toContain("FALLA falta el título");
  expect(stdout).toContain("FALLA ruta fuera de la base: /otra-base/a.js");
});
