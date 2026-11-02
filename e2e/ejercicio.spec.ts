import { expect, test, type Page } from "@playwright/test";

async function entrar(page: Page, tema: string) {
  await page.clock.setFixedTime(new Date("2026-01-01T17:00:00Z"));
  await page.goto("./");
  await page.getByRole("button", { name: tema }).click();
  await expect(page.getByRole("heading", { name: "1 de 3" })).toBeVisible();
}

async function escribir(page: Page, valor: string) {
  await page
    .locator("math-field")
    .evaluate((el: HTMLInputElement, v: string) => {
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, valor);
}

const disposiciones = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      (window as unknown as { mathVirtualKeyboard: { layouts: unknown } })
        .mathVirtualKeyboard.layouts,
    ),
  );

test("Derivadas abre con enunciado, campo y teclado visible", async ({
  page,
}) => {
  await entrar(page, "Derivadas");
  await expect(page.locator(".enunciado .katex").first()).toBeVisible();
  await expect(page.locator("math-field")).toBeVisible();
  await expect(page.getByRole("button", { name: "Comprobar" })).toBeDisabled();
  await expect
    .poll(() =>
      page.evaluate(() => ({
        definido: customElements.get("math-field") !== undefined,
        visible: (
          window as unknown as { mathVirtualKeyboard: { visible: boolean } }
        ).mathVirtualKeyboard.visible,
      })),
    )
    .toEqual({ definido: true, visible: true });
});

test("habilita Comprobar con un valor", async ({ page }) => {
  await entrar(page, "Derivadas");
  await expect(page.locator("math-field")).toBeVisible();
  await escribir(page, "x");
  await expect(page.getByRole("button", { name: "Comprobar" })).toBeEnabled();
});

test("pide revisar una respuesta ilegible y no avanza", async ({ page }) => {
  await entrar(page, "Derivadas");
  await expect(page.locator("math-field")).toBeVisible();
  await escribir(page, "x=");
  await page.getByRole("button", { name: "Comprobar" }).click();
  await expect(page.getByText("Revisa tu respuesta")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1 de 3" })).toBeVisible();
});

test("Continuidad ofrece cuatro opciones y ningún campo", async ({ page }) => {
  await entrar(page, "Continuidad");
  for (const opcion of [
    "Continua",
    "Discontinua removible",
    "Discontinua de salto",
    "Discontinua infinita",
  ]) {
    await expect(
      page.getByRole("button", { name: opcion, exact: true }),
    ).toBeVisible();
  }
  await expect(page.locator("math-field")).toHaveCount(0);
});

test("cada tema tiene su teclado", async ({ page }) => {
  await entrar(page, "Límites");
  await expect(page.locator("math-field")).toBeVisible();
  await expect.poll(() => disposiciones(page)).toContain("∞");
  expect(await disposiciones(page)).not.toContain("arcsen");

  await entrar(page, "Derivadas");
  await expect(page.locator("math-field")).toBeVisible();
  await expect.poll(() => disposiciones(page)).toContain("arcsen");
  expect(await disposiciones(page)).not.toContain("∞");

  await entrar(page, "Integrales");
  await expect(page.locator("math-field")).toBeVisible();
  await expect.poll(() => disposiciones(page)).toContain('"label":"C"');
});
