import { expect, test } from "@playwright/test";

test("la ruta publicada muestra la marca", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByText("Pasa Cálculo", { exact: true })).toBeVisible();
});
