import { useState } from "preact/hooks";
import type { Ejercicio as Item, Tema } from "../data/tipos.ts";
import { cargarBanco } from "../lib/banco.ts";
import type { Veredicto } from "../lib/corrector.ts";
import { fechaLima } from "../lib/fechas.ts";
import { retoDeHoy } from "../lib/retos.ts";
import Ejercicio from "./Ejercicio.tsx";
import Inicio from "./Inicio.tsx";
import Respuesta from "./Respuesta.tsx";

type Pantalla = "inicio" | "ejercicio" | "respuesta" | "resultado";

export default function Reto() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [tema, setTema] = useState<Tema>("limites");
  const [trio, setTrio] = useState<[Item, Item, Item] | null>(null);
  const [indice, setIndice] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [veredicto, setVeredicto] = useState<Veredicto | null>(null);

  async function elegirTema(elegido: Tema) {
    const banco = await cargarBanco(elegido);
    setTema(elegido);
    setTrio(retoDeHoy(banco, fechaLima()));
    setIndice(0);
    setAciertos(0);
    setPantalla("ejercicio");
  }

  function alComprobar(nuevo: Veredicto) {
    setVeredicto(nuevo);
    if (nuevo.estado === "correcto") setAciertos(aciertos + 1);
    setPantalla("respuesta");
  }

  function alSeguir() {
    if (indice === 2) {
      setPantalla("resultado");
      return;
    }
    setIndice(indice + 1);
    setPantalla("ejercicio");
  }

  if (pantalla === "inicio" || !trio) return <Inicio alElegir={elegirTema} />;
  if (pantalla === "resultado") return <h1>{aciertos} de 3</h1>;
  const ejercicio = trio[indice] as Item;
  if (pantalla === "respuesta" && veredicto) {
    return (
      <Respuesta
        ejercicio={ejercicio}
        veredicto={veredicto}
        ultimo={indice === 2}
        alSeguir={alSeguir}
      />
    );
  }
  return (
    <Ejercicio
      key={indice}
      ejercicio={ejercicio}
      tema={tema}
      indice={indice}
      alComprobar={alComprobar}
    />
  );
}
