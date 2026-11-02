import { ETIQUETA_TEMA, type Tema } from "../data/tipos.ts";

const ANCHO = 1080;
const ALTO = 1920;
const CENTRO = ANCHO / 2;
const NOMBRE = "pasa-calculo-resultado.png";
const DOMINIO = "oswalec.github.io/pasa-calculo";

const token = (nombre: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();

/** Dibuja la tarjeta 1080×1920 en el navegador, sin servicios externos. */
export async function crearTarjeta({
  tema,
  aciertos,
}: {
  tema: Tema;
  aciertos: number;
}): Promise<Blob> {
  await document.fonts.load("800 96px Poppins");
  const lienzo = document.createElement("canvas");
  lienzo.width = ANCHO;
  lienzo.height = ALTO;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  ctx.fillStyle = token("--negro");
  ctx.fillRect(0, 0, ANCHO, ALTO);
  ctx.textAlign = "center";

  ctx.fillStyle = token("--durazno");
  ctx.font = "800 96px Poppins, sans-serif";
  ctx.fillText("Pasa Cálculo", CENTRO, 420);

  ctx.fillStyle = token("--texto");
  ctx.font = "600 64px Poppins, sans-serif";
  ctx.fillText(ETIQUETA_TEMA[tema], CENTRO, 760);

  ctx.fillStyle = token("--durazno");
  ctx.font = "800 200px Poppins, sans-serif";
  ctx.fillText(`${aciertos} de 3`, CENTRO, 1040);

  ctx.fillStyle = token("--suave");
  ctx.font = "400 48px Poppins, sans-serif";
  ctx.fillText(DOMINIO, CENTRO, 1540);

  return new Promise((resolver, rechazar) => {
    lienzo.toBlob(
      (blob) => (blob ? resolver(blob) : rechazar(new Error("Sin imagen"))),
      "image/png",
    );
  });
}

/** Comparte con Web Share si se puede; si no, descarga el PNG. */
export async function compartirTarjeta(blob: Blob): Promise<void> {
  const archivo = new File([blob], NOMBRE, { type: "image/png" });
  if (navigator.canShare?.({ files: [archivo] })) {
    await navigator.share({ files: [archivo] });
    return;
  }
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = NOMBRE;
  enlace.click();
  URL.revokeObjectURL(url);
}
