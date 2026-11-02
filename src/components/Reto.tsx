import { useState } from "preact/hooks";
import type { Ejercicio, Tema } from "../data/tipos.ts";
import { cargarBanco } from "../lib/banco.ts";
import { fechaLima } from "../lib/fechas.ts";
import { retoDeHoy } from "../lib/retos.ts";
import Inicio from "./Inicio.tsx";

type Pantalla = "inicio" | "ejercicio" | "respuesta" | "resultado";

export default function Reto() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [, setTrio] = useState<[Ejercicio, Ejercicio, Ejercicio] | null>(null);
  const [indice, setIndice] = useState(0);

  async function elegirTema(tema: Tema) {
    const banco = await cargarBanco(tema);
    setTrio(retoDeHoy(banco, fechaLima()));
    setIndice(0);
    setPantalla("ejercicio");
  }

  if (pantalla === "inicio") return <Inicio alElegir={elegirTema} />;
  return <h1>{indice + 1} de 3</h1>;
}
