// Verifica el banco de ejercicios: esquema, ids, número del PDF, notación y matemática.
// Uso: node scripts/verificar-banco.mjs [--completo] [--dir <carpeta>]
// Sale con 0 si todo pasa y con 1 si algo falla, nombrando cada id.
// Sin --completo, un tema cuyo archivo aún no existe se informa como pendiente.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ComputeEngine } from "@cortex-js/compute-engine";

const argumentos = process.argv.slice(2);
const completo = argumentos.includes("--completo");
const posicionDir = argumentos.indexOf("--dir");
const carpeta =
  posicionDir === -1 ? "src/data/banco" : argumentos[posicionDir + 1];

const TEMAS = {
  limites: { prefijo: "lim", total: 50, seccion: "LÍMITES" },
  continuidad: { prefijo: "con", total: 40, seccion: "CONTINUIDAD" },
  derivadas: { prefijo: "der", total: 50, seccion: "DERIVADAS" },
  integrales: { prefijo: "int", total: 50, seccion: "INTEGRALES" },
};
const SECCIONES = ["LÍMITES", "CONTINUIDAD", "DERIVADAS", "INTEGRALES"];
const EXCLUIDOS = [6, 25, 26, 27, 28, 29, 30, 31, 34, 43];
const OPCIONES = ["continua", "removible", "salto", "infinita"];
const PUNTOS = [-2.71, -1.37, -0.83, -0.41, 0.23, 0.37, 0.81, 1.43, 2.19, 2.77];
const ce = new ComputeEngine();
const fallas = [];
const falla = (id, motivo) => fallas.push(`FALLA ${id}: ${motivo}`);

function numerosDelPdf() {
  const lineas = readFileSync("fuente/ejercicios-pdf.txt", "utf8").split(
    /\r?\n/,
  );
  const numeros = Object.fromEntries(SECCIONES.map((s) => [s, new Set()]));
  let actual = null;
  for (const linea of lineas) {
    if (SECCIONES.includes(linea.trim())) actual = linea.trim();
    const coincide = actual && linea.match(/^(\d+)\.\s/);
    if (coincide) numeros[actual].add(Number(coincide[1]));
  }
  return numeros;
}

function normalizar(latex) {
  return latex
    .replaceAll("\\operatorname{sen}", "\\sin ")
    .replaceAll("\\operatorname{arcsen}", "\\arcsin ");
}

function evaluar(latex, x) {
  return Number(ce.parse(normalizar(latex)).subs({ x, C: 0 }).N().re);
}

const cerca = (p, q, tolerancia) =>
  Math.abs(p - q) <= tolerancia * Math.max(1, Math.abs(p), Math.abs(q));

function chequearLimite(e) {
  const { f, punto } = e.chequeo;
  if (punto === "\\infty" || punto === "-\\infty") {
    const x = punto === "\\infty" ? 1e6 : -1e6;
    const valor = evaluar(f, x);
    if (e.respuesta === "\\infty" || e.respuesta === "-\\infty") {
      const signo = e.respuesta === "\\infty" ? 1 : -1;
      if (!(valor * signo > 1e3))
        falla(e.id, `el límite no diverge a ${e.respuesta}: ${valor}`);
      return;
    }
    const esperado = evaluar(e.respuesta, 0);
    if (!cerca(valor, esperado, 1e-3))
      falla(e.id, `límite ${valor}, respuesta ${esperado}`);
    return;
  }
  const a = evaluar(punto, 0);
  const esperado = evaluar(e.respuesta, 0);
  for (const h of [1e-3, -1e-3]) {
    const valor = evaluar(f, a + h);
    if (!cerca(valor, esperado, 2e-2))
      falla(e.id, `f(${a + h})=${valor}, respuesta ${esperado}`);
  }
}

function derivadaNumerica(f, x) {
  const h = 1e-5;
  return (evaluar(f, x + h) - evaluar(f, x - h)) / (2 * h);
}

function compararEnPuntos(e, izquierda, derecha) {
  let usados = 0;
  for (const x of PUNTOS) {
    const p = izquierda(x);
    const q = derecha(x);
    if (!Number.isFinite(p) || !Number.isFinite(q)) continue;
    usados += 1;
    if (!cerca(p, q, 1e-3)) falla(e.id, `en x=${x}: ${p} frente a ${q}`);
  }
  if (usados < 4) falla(e.id, `solo ${usados} puntos utilizables`);
}

function chequearDerivada(e) {
  const { f, en } = e.chequeo;
  if (en === undefined) {
    compararEnPuntos(
      e,
      (x) => derivadaNumerica(f, x),
      (x) => evaluar(e.respuesta, x),
    );
    return;
  }
  const valor = derivadaNumerica(f, en);
  const esperado = evaluar(e.respuesta, 0);
  if (!cerca(valor, esperado, 1e-3))
    falla(e.id, `f'(${en})=${valor}, respuesta ${esperado}`);
}

function simpson(f, a, b) {
  const pasos = 200;
  const h = (b - a) / pasos;
  let suma = evaluar(f, a) + evaluar(f, b);
  for (let i = 1; i < pasos; i++)
    suma += (i % 2 === 0 ? 2 : 4) * evaluar(f, a + i * h);
  return (suma * h) / 3;
}

function chequearIntegral(e) {
  const { f, a, b } = e.chequeo;
  if (a === undefined || b === undefined) {
    compararEnPuntos(
      e,
      (x) => derivadaNumerica(e.respuesta, x),
      (x) => evaluar(f, x),
    );
    return;
  }
  const valor = simpson(f, a, b);
  const esperado = evaluar(e.respuesta, 0);
  if (!cerca(valor, esperado, 1e-3))
    falla(e.id, `integral ${valor}, respuesta ${esperado}`);
}

function chequearEsquema(e, tema, pdf) {
  const { prefijo, seccion } = TEMAS[tema];
  const id = String(e.id);
  const textos = [e.enunciado, e.respuesta, e.solucion];
  if (id !== `${prefijo}-${String(e.n).padStart(2, "0")}`)
    falla(id, `id no coincide con n=${e.n}`);
  if (e.tema !== tema) falla(id, `tema ${e.tema} en el archivo ${tema}`);
  if (!pdf[seccion].has(e.n))
    falla(id, `n=${e.n} no existe en ${seccion} del PDF`);
  if (tema === "continuidad" && EXCLUIDOS.includes(e.n))
    falla(id, `n=${e.n} está excluido`);
  if (!textos.every((t) => typeof t === "string" && t.length > 0))
    falla(id, "falta un texto");
  if (e.tipo !== "expresion" && e.tipo !== "opcion")
    falla(id, `tipo inválido: ${e.tipo}`);
  for (const texto of textos) {
    if (/\b(sin|arcsin)\b/.test(texto))
      falla(id, `notación prohibida en: ${texto}`);
    if (texto.includes("~")) falla(id, `"~" prohibido en: ${texto}`);
    if ((texto.match(/\$/g) ?? []).length % 2 !== 0)
      falla(id, `"$" sin cerrar en: ${texto}`);
  }
  if (e.tipo === "opcion") {
    if (JSON.stringify(e.opciones) !== JSON.stringify(OPCIONES))
      falla(id, "opciones inválidas");
    if (!OPCIONES.includes(e.respuesta))
      falla(id, `respuesta fuera de opciones: ${e.respuesta}`);
    if (e.chequeo?.clase !== "continuidad-tipo")
      falla(id, "chequeo debe ser continuidad-tipo");
  } else if (e.opciones !== undefined) {
    falla(id, "tipo expresion no lleva opciones");
  }
  const esperaC = e.constante === true;
  if (esperaC !== /\+C$/.test(e.respuesta))
    falla(id, "constante y +C de la respuesta no coinciden");
}

function chequearMatematica(e, tema) {
  const clase = e.chequeo?.clase;
  const esperadas = {
    limites: ["limite"],
    continuidad: ["continuidad-k", "continuidad-tipo"],
    derivadas: ["derivada"],
    integrales: ["integral"],
  };
  if (!esperadas[tema].includes(clase))
    return falla(e.id, `chequeo inválido: ${clase}`);
  // continuidad-k y continuidad-tipo solo se validan por esquema: la solución es adaptada del PDF.
  if (clase === "limite") chequearLimite(e);
  if (clase === "derivada") chequearDerivada(e);
  if (clase === "integral") chequearIntegral(e);
}

const pdf = numerosDelPdf();
for (const [tema, { total }] of Object.entries(TEMAS)) {
  const ruta = join(carpeta, `${tema}.json`);
  if (!existsSync(ruta)) {
    if (completo) falla(tema, `falta ${ruta}`);
    else console.log(`pendiente: ${ruta}`);
    continue;
  }
  const lista = JSON.parse(readFileSync(ruta, "utf8"));
  const ids = new Set();
  for (const e of lista) {
    if (ids.has(e.id)) falla(e.id, "id repetido");
    ids.add(e.id);
    chequearEsquema(e, tema, pdf);
    chequearMatematica(e, tema);
  }
  if (lista.length !== total)
    falla(tema, `tiene ${lista.length} ejercicios, deben ser ${total}`);
}

if (fallas.length > 0) {
  console.log(fallas.join("\n"));
  process.exit(1);
}
console.log("banco ok");
