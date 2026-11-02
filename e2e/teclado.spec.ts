import { expect, test, type Page } from "@playwright/test";

async function entrar(page: Page, tema: string) {
  await page.clock.setFixedTime(new Date("2026-01-01T17:00:00Z"));
  await page.goto("./");
  await page.getByRole("button", { name: tema }).click();
  await expect(page.locator("math-field")).toBeVisible();
  await expect(page.locator(".MLK__keycap").first()).toBeVisible();
  await page.waitForTimeout(800); // el teclado sube con una animación
}

/** Toca una tecla del teclado virtual, como un dedo: nunca asigna el valor por código. */
async function tocar(page: Page, ...teclas: string[]) {
  for (const tecla of teclas) {
    await page
      .locator(`.MLK__keycap[aria-label="${tecla}"]`)
      .first()
      .click({ force: true });
  }
}

async function salir(page: Page) {
  await page
    .locator('.action[data-command*="moveToNextChar"]')
    .click({ force: true });
}

const valor = (page: Page) =>
  page.locator("math-field").evaluate((el: HTMLInputElement) => el.value);

test("la flecha saca del exponente y la respuesta se corrige", async ({
  page,
}) => {
  await entrar(page, "Derivadas");
  await tocar(page, "2", "0", "x", "xⁿ", "3");
  await salir(page);
  await tocar(page, "-", "6", "x");
  expect(await valor(page)).toBe("20x^3-6x");
  await page.getByRole("button", { name: "Comprobar" }).click();
  await expect(page.getByRole("heading", { name: "✓ Correcto" })).toBeVisible();
});

test("la flecha saca de una fracción", async ({ page }) => {
  await entrar(page, "Derivadas");
  await tocar(page, "1", "a/b", "2");
  await salir(page);
  await tocar(page, "+", "x");
  expect(await valor(page)).toBe(String.raw`\frac12+x`);
});

test("Comprobar sigue alcanzable sobre el teclado en pantalla chica", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await entrar(page, "Integrales");
  await tocar(page, "x");
  await page.locator(".enunciado").evaluate((el: HTMLElement) => {
    el.style.minHeight = "300px"; // simula un enunciado largo por tramos
  });
  await page.getByRole("button", { name: "Comprobar" }).click();
  await expect(page.getByRole("heading", { name: /Incorrecto/ })).toBeVisible();
});

test("las etiquetas largas caben en su tecla", async ({ page }) => {
  await entrar(page, "Derivadas");
  for (const etiqueta of ["arcsen", "arctan"]) {
    const desborde = await page
      .locator(`.MLK__keycap[aria-label="${etiqueta}"]`)
      .first()
      .evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(desborde).toBeLessThanOrEqual(1); // 1px es redondeo del navegador
  }
});
