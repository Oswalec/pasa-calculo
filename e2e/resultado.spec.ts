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

test("tres aciertos muestran el mejor nivel y el enlace", async ({ page }) => {
  await completarLimites(page, correctas);
  await expect(page.getByRole("heading", { name: "3 de 3" })).toBeVisible();
  await expect(page.getByText("¡Excelente!")).toBeVisible();
  await expect(
    page.getByText(
      "Te acompañaré hasta que logres pasar el cálculo que necesites",
    ),
  ).toBeVisible();
  const enlace = page.getByRole("link", { name: "Quiero que me acompañes" });
  await expect(enlace).toHaveAttribute("href", "https://wa.link/de928w");
  await expect(enlace).toHaveAttribute("target", "_blank");
  await expect(enlace).toHaveAttribute("rel", /noopener/);
  await expect(page.getByText(/Nuevo reto en \d\d:\d\d:\d\d/)).toBeVisible();
});

test("dos aciertos animan a seguir", async ({ page }) => {
  await completarLimites(page, [correctas[0], correctas[1], FALSA] as string[]);
  await expect(page.getByRole("heading", { name: "2 de 3" })).toBeVisible();
  await expect(page.getByText("Vas bien, te falta poco")).toBeVisible();
});

test("cero aciertos sugieren reforzar", async ({ page }) => {
  await completarLimites(page, [FALSA, FALSA, FALSA]);
  await expect(page.getByRole("heading", { name: "0 de 3" })).toBeVisible();
  await expect(page.getByText("Aquí te conviene reforzar")).toBeVisible();
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
