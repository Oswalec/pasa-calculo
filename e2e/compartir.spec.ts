import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const PERMITIDOS = ["http://localhost:4321/", "data:", "blob:"];

async function irAResultado(page: Page) {
  await page.clock.setFixedTime(new Date("2026-01-01T17:00:00Z"));
  await page.addInitScript(() => {
    localStorage.setItem(
      "pasa-calculo:v1",
      JSON.stringify({ resultados: { "2026-01-01": { limites: 2 } } }),
    );
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Límites" }).click();
  await expect(page.getByRole("heading", { name: "2 de 3" })).toBeVisible();
}

function vigilarRedes(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (peticion) => urls.push(peticion.url()));
  return urls;
}

const ajenas = (urls: string[]) =>
  urls.filter((url) => !PERMITIDOS.some((base) => url.startsWith(base)));

test("descarga un PNG de 1080×1920 si no hay Web Share", async ({ page }) => {
  const urls = vigilarRedes(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      value: undefined,
      configurable: true,
    });
  });
  await irAResultado(page);
  const [descarga] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Compartir resultado" }).click(),
  ]);
  expect(descarga.suggestedFilename()).toBe("pasa-calculo-resultado.png");
  const png = readFileSync(await descarga.path());
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1920);
  expect(ajenas(urls)).toEqual([]);
});

test("usa Web Share con un PNG y no descarga nada", async ({ page }) => {
  const urls = vigilarRedes(page);
  let descargas = 0;
  page.on("download", () => {
    descargas += 1;
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      value: () => true,
      configurable: true,
    });
    Object.defineProperty(navigator, "share", {
      value: async ({ files }: { files: File[] }) => {
        (window as unknown as { compartido: unknown }).compartido = {
          cantidad: files.length,
          tipo: files[0]?.type,
          nombre: files[0]?.name,
        };
      },
      configurable: true,
    });
  });
  await irAResultado(page);
  await page.getByRole("button", { name: "Compartir resultado" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { compartido?: unknown }).compartido,
      ),
    )
    .toEqual({
      cantidad: 1,
      tipo: "image/png",
      nombre: "pasa-calculo-resultado.png",
    });
  expect(descargas).toBe(0);
  expect(ajenas(urls)).toEqual([]);
});
