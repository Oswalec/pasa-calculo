import { describe, expect, it } from "vitest";
import { cuentaRegresiva, diasEntre, fechaLima } from "./fechas.ts";

describe("fechas de Lima", () => {
  it("sigue siendo el día anterior en Lima a las 03:00 UTC", () => {
    expect(fechaLima(new Date("2026-03-10T03:00:00Z"))).toBe("2026-03-09");
  });

  it("cambia de día a las 05:00 UTC", () => {
    expect(fechaLima(new Date("2026-03-10T05:00:00Z"))).toBe("2026-03-10");
  });

  it("cuenta días calendario", () => {
    expect(diasEntre("2026-01-01", "2026-01-01")).toBe(0);
    expect(diasEntre("2026-01-01", "2026-03-01")).toBe(59);
    expect(diasEntre("2026-01-02", "2026-01-01")).toBe(-1);
  });

  it("formatea la cuenta regresiva hasta la medianoche de Lima", () => {
    expect(cuentaRegresiva(new Date("2026-03-10T04:59:59Z"))).toBe("00:00:01");
    expect(cuentaRegresiva(new Date("2026-03-10T17:00:00Z"))).toBe("12:00:00");
  });
});
