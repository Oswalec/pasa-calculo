import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import type { Ejercicio } from "../src/data/tipos.ts";
import { retoDeHoy } from "../src/lib/retos.ts";

const FECHA = "2026-01-01";
const FALSA = "123456";

const trio = retoDeHoy(
  JSON.parse(
    readFileSync("src/data/banco/limites.json", "utf8"),
  ) as Ejercicio[],
  FECHA,
);

async function completarLimites(page: Page, respuestas: string[]) {
  await page.clock.setFixedTime(new Date(`${FECHA}T17:00:00Z`));
  await page.goto("./");
  await page.getByRole("button", { name: "Límites" }).click();
  for (const [i, respuesta] of respuestas.entries()) {
    await expect(
      page.getByRole("heading", { name: `${i + 1} de 3` }),
    ).toBeVisible();
    const campo = page.locator("math-field");
    await expect(campo).toBeVisible();
    await campo.evaluate((el: HTMLInputElement, v: string) => {
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, respuesta);
    await page.getByRole("button", { name: "Comprobar" }).click();
    const nombre = i === 2 ? "Ver resultado" : "Siguiente";
    await page.getByRole("button", { name: nombre }).click();
  }
}

const correctas = trio.map((e) => e.respuesta);

const PAGO =
  "Practica con estos retos que son gratis, el acompañamiento ya es de pago.";

async function revisarCierre(page: Page, textos: string[], boton: string) {
  for (const texto of textos) {
    await expect(page.getByText(texto)).toBeVisible();
  }
  await expect(page.getByText(PAGO)).toBeVisible();
  const enlace = page.getByRole("link", { name: boton });
  await expect(enlace).toHaveAttribute("href", "https://wa.link/de928w");
  await expect(enlace).toHaveAttribute("target", "_blank");
  await expect(enlace).toHaveAttribute("rel", /noopener/);
}

test("tres aciertos venden el nivel de examen", async ({ page }) => {
  await completarLimites(page, correctas);
  await expect(page.getByRole("heading", { name: "3 de 3" })).toBeVisible();
  await revisarCierre(
    page,
    [
      "¡Excelente! Ya tienes la base",
      "Estos ejercicios son los fáciles.",
      "En mi acompañamiento avanzas al nivel de examen",
    ],
    "Quiero llegar listo al examen",
  );
  await expect(page.getByText(/Nuevo reto en \d\d:\d\d:\d\d/)).toBeVisible();
});

test("dos aciertos venden corregir el error", async ({ page }) => {
  await completarLimites(page, [correctas[0], correctas[1], FALSA] as string[]);
  await expect(page.getByRole("heading", { name: "2 de 3" })).toBeVisible();
  await revisarCierre(
    page,
    [
      "Estuviste cerca, y ahí está el riesgo",
      "Un 2 de 3 te hace sentir listo",
      "En mi acompañamiento encontramos qué te hace fallar",
    ],
    "Quiero corregirlo antes del examen",
  );
});

test("un acierto reconoce lo logrado y ofrece el acompañamiento", async ({
  page,
}) => {
  await completarLimites(page, [correctas[0], FALSA, FALSA] as string[]);
  await expect(page.getByRole("heading", { name: "1 de 3" })).toBeVisible();
  await revisarCierre(
    page,
    [
      "Ya tienes una parte",
      "Ese acierto te muestra que sí puedes.",
      "te guío paso a paso hasta que logres pasar",
    ],
    "Quiero el acompañamiento",
  );
});

test("cero aciertos reflexionan primero y ofrecen el acompañamiento", async ({
  page,
}) => {
  await completarLimites(page, [FALSA, FALSA, FALSA]);
  await expect(page.getByRole("heading", { name: "0 de 3" })).toBeVisible();
  await revisarCierre(
    page,
    [
      "Hoy no salió, y está bien que lo sepas ahora",
      "Esto no significa que no puedas con Cálculo.",
      "te guío paso a paso hasta que logres pasar",
    ],
    "Quiero el acompañamiento",
  );
});

test("Hacer otro tema vuelve a Inicio y conserva lo hecho", async ({
  page,
}) => {
  await completarLimites(page, [FALSA, FALSA, FALSA]);
  await page.getByRole("button", { name: "Hacer otro tema" }).click();
  await expect(
    page.getByRole("heading", { name: "Reto de hoy: 3 ejercicios" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Límites" }).click();
  await expect(page.getByRole("heading", { name: "0 de 3" })).toBeVisible();
});

test("un tema terminado vuelve directo a Resultado tras recargar", async ({
  page,
}) => {
  await completarLimites(page, [correctas[0], correctas[1], FALSA] as string[]);
  await page.reload();
  await page.getByRole("button", { name: "Límites" }).click();
  await expect(page.getByRole("heading", { name: "2 de 3" })).toBeVisible();
  await expect(page.locator("math-field")).toHaveCount(0);
});
