import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-03-10T17:00:00Z"));
});

test("muestra los cuatro temas y ninguna racha sin progreso", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Reto de hoy: 3 ejercicios" }),
  ).toBeVisible();
  for (const tema of ["Límites", "Continuidad", "Derivadas", "Integrales"]) {
    await expect(page.getByRole("button", { name: tema })).toBeVisible();
  }
  await expect(page.getByText("CEC | Cálculo")).toBeVisible();
  await expect(page.getByText("Racha")).toHaveCount(0);
});

test("muestra la racha guardada", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "pasa-calculo:v1",
      JSON.stringify({
        resultados: {
          "2026-03-09": { limites: 2 },
          "2026-03-10": { derivadas: 3 },
        },
      }),
    );
  });
  await page.goto("./");
  await expect(page.getByText("Racha: 2 días")).toBeVisible();
});

test("no carga MathLive en Inicio", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("button", { name: "Límites" })).toBeVisible();
  const definido = await page.evaluate(
    () => customElements.get("math-field") !== undefined,
  );
  expect(definido).toBe(false);
});

test("entra al primer ejercicio al tocar un tema", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Límites" }).click();
  await expect(page.getByRole("heading", { name: "1 de 3" })).toBeVisible();
});
