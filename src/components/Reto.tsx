import { useState } from "preact/hooks";
import type { Ejercicio as Item, Tema } from "../data/tipos.ts";
import { cargarBanco } from "../lib/banco.ts";
import type { Veredicto } from "../lib/corrector.ts";
import { fechaLima } from "../lib/fechas.ts";
import { retoDeHoy } from "../lib/retos.ts";
import Ejercicio from "./Ejercicio.tsx";
import Inicio from "./Inicio.tsx";

type Pantalla = "inicio" | "ejercicio" | "respuesta" | "resultado";

export default function Reto() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [tema, setTema] = useState<Tema>("limites");
  const [trio, setTrio] = useState<[Item, Item, Item] | null>(null);
  const [indice, setIndice] = useState(0);

  async function elegirTema(elegido: Tema) {
    const banco = await cargarBanco(elegido);
    setTema(elegido);
    setTrio(retoDeHoy(banco, fechaLima()));
    setIndice(0);
    setPantalla("ejercicio");
  }

  function alComprobar(_veredicto: Veredicto) {
    setPantalla("respuesta");
  }

  if (pantalla === "inicio" || !trio) return <Inicio alElegir={elegirTema} />;
  return (
    <Ejercicio
      key={indice}
      ejercicio={trio[indice] as Item}
      tema={tema}
      indice={indice}
      alComprobar={alComprobar}
    />
  );
}
