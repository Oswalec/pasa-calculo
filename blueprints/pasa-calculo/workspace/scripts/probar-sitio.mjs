// Sirve dist/ con el preview de Astro y exige 200 con "Pasa Cálculo" en la ruta publicada.
// Usa la API de Astro para no dejar procesos vivos en Windows ni en Linux.
import { preview } from "astro";

const url = "http://localhost:4321/pasa-calculo/";
const servidor = await preview({ root: ".", logLevel: "error" });
let fallo = "";
try {
  const respuesta = await fetch(url);
  const html = await respuesta.text();
  if (respuesta.status !== 200) fallo = `estado ${respuesta.status} en ${url}`;
  else if (!html.includes("Pasa Cálculo"))
    fallo = `falta "Pasa Cálculo" en ${url}`;
} catch (error) {
  fallo = `no respondió ${url}: ${error.message}`;
} finally {
  await servidor.stop();
}
if (fallo) {
  console.error(fallo);
  process.exit(1);
}
console.log(`ok ${url}`);
process.exit(0);
