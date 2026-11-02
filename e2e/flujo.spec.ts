import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  ETIQUETA_OPCION,
  type Ejercicio,
  type Opcion,
} from "../src/data/tipos.ts";
import { retoDeHoy } from "../src/lib/retos.ts";

const FECHA = "2026-01-01";
const TEMAS = [
  ["limites", "Límites"],
  ["continuidad", "Continuidad"],
  ["derivadas", "Derivadas"],
  ["integrales", "Integrales"],
] as const;

function trioDe(tema: string) {
  const texto = readFileSync(`src/data/banco/${tema}.json`, "utf8");
  return retoDeHoy(JSON.parse(texto) as Ejercicio[], FECHA);
}

async function abrir(page: Page) {
  await page.clock.setFixedTime(new Date(`${FECHA}T17:00:00Z`));
  await page.goto("./");
  await expect(page.getByRole("button", { name: "Límites" })).toBeVisible();
}

async function revisarPantalla(page: Page, ancho = 360) {
  const scroll = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scroll).toBeLessThanOrEqual(ancho);
  await expect(page.locator("h1")).toHaveCount(1);
  const controles = await page
    .locator("main button:visible, main a:visible")
    .all();
  for (const control of controles) {
    const caja = await control.boundingBox();
    expect(caja?.height ?? 0).toBeGreaterThanOrEqual(48);
  }
}

async function responder(page: Page, ejercicio: Ejercicio) {
  if (ejercicio.tipo === "opcion") {
    const etiqueta = ETIQUETA_OPCION[ejercicio.respuesta as Opcion];
    await page.getByRole("button", { name: etiqueta, exact: true }).click();
  } else {
    const campo = page.locator("math-field");
    await expect(campo).toBeVisible();
    await campo.evaluate((el: HTMLInputElement, v: string) => {
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, ejercicio.respuesta);
  }
  await page.getByRole("button", { name: "Comprobar" }).click();
}

async function completar(page: Page, tema: string, etiqueta: string) {
  await page.getByRole("button", { name: etiqueta }).click();
  for (const [i, ejercicio] of trioDe(tema).entries()) {
    await expect(
      page.getByRole("heading", { name: `${i + 1} de 3` }),
    ).toBeVisible();
    await revisarPantalla(page);
    await responder(page, ejercicio);
    await expect(
      page.getByRole("heading", { name: /^(✓ Correcto|Correcto\.)/ }),
    ).toBeVisible();
    await revisarPantalla(page);
    const siguiente = i === 2 ? "Ver resultado" : "Siguiente";
    await page.getByRole("button", { name: siguiente }).click();
  }
}

for (const [tema, etiqueta] of TEMAS) {
  test(`completa ${etiqueta} con 3 de 3 a 360×740`, async ({ page }) => {
    await abrir(page);
    await revisarPantalla(page);
    await completar(page, tema, etiqueta);
    await expect(page.getByRole("heading", { name: "3 de 3" })).toBeVisible();
    await revisarPantalla(page);
  });
}

test("Inicio cabe a 320×568", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await abrir(page);
  await revisarPantalla(page, 320);
});

test("un tema terminado reabre Resultado con el enlace exacto", async ({
  page,
}) => {
  await abrir(page);
  await completar(page, "limites", "Límites");
  await page.reload();
  await page.getByRole("button", { name: "Límites" }).click();
  await expect(page.getByRole("heading", { name: "3 de 3" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Quiero que me acompañes" }),
  ).toHaveAttribute("href", "https://wa.link/de928w");
});
