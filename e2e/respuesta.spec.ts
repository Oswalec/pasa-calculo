import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import type { Ejercicio } from "../src/data/tipos.ts";
import { retoDeHoy } from "../src/lib/retos.ts";

const FECHA = "2026-01-01";

function trioDe(tema: string) {
  const texto = readFileSync(`src/data/banco/${tema}.json`, "utf8");
  return retoDeHoy(JSON.parse(texto) as Ejercicio[], FECHA);
}

async function entrar(page: Page, tema: string) {
  await page.clock.setFixedTime(new Date(`${FECHA}T17:00:00Z`));
  await page.goto("./");
  await page.getByRole("button", { name: tema }).click();
}

async function comprobar(page: Page, valor: string) {
  const campo = page.locator("math-field");
  await expect(campo).toBeVisible();
  await campo.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, valor);
  await page.getByRole("button", { name: "Comprobar" }).click();
}

const textoDe = (solucion: string) =>
  solucion
    .split("$")
    .filter((_, i) => i % 2 === 0)
    .map((t) => t.trim())
    .find((t) => t.length > 0) ?? "";

test("una respuesta correcta muestra acierto, respuesta y solución", async ({
  page,
}) => {
  const [primero] = trioDe("limites");
  await entrar(page, "Límites");
  await comprobar(page, primero.respuesta);
  const titulo = page.getByRole("heading", { name: "✓ Correcto" });
  await expect(titulo).toBeVisible();
  await expect(titulo).toHaveClass(/acierto/);
  await expect(page.locator(".enunciado .katex").first()).toBeVisible();
  await expect(page.locator("main")).toContainText(textoDe(primero.solucion));
});

test("una respuesta falsa muestra error y la respuesta correcta", async ({
  page,
}) => {
  await entrar(page, "Límites");
  await comprobar(page, "123456");
  const titulo = page.getByRole("heading", { name: "✗ Incorrecto" });
  await expect(titulo).toBeVisible();
  await expect(titulo).toHaveClass(/error/);
  await expect(page.locator(".enunciado .katex").first()).toBeVisible();
});

test("una indefinida correcta que no lleva C recuerda el +C", async ({
  page,
}) => {
  const [primero] = trioDe("integrales");
  await entrar(page, "Integrales");
  await comprobar(page, primero.respuesta.replace(/\+C$/, ""));
  await expect(
    page.getByRole("heading", { name: "Correcto. Recuerda escribir el +C." }),
  ).toBeVisible();
});

test("el botón dice Siguiente y al final Ver resultado", async ({ page }) => {
  const trio = trioDe("derivadas");
  await entrar(page, "Derivadas");
  await comprobar(page, trio[0].respuesta);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByRole("heading", { name: "2 de 3" })).toBeVisible();
  await comprobar(page, trio[1].respuesta);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByRole("heading", { name: "3 de 3" })).toBeVisible();
  await comprobar(page, trio[2].respuesta);
  await expect(
    page.getByRole("button", { name: "Ver resultado" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Siguiente" })).toHaveCount(0);
});
