import { ETIQUETA_OPCION, type Ejercicio, type Opcion } from "../data/tipos.ts";
import type { Veredicto } from "../lib/corrector.ts";
import Formula from "./Formula.tsx";
import Meme from "./Meme.tsx";

type Props = {
  ejercicio: Ejercicio;
  veredicto: Veredicto;
  ultimo: boolean;
  alSeguir: () => void;
};

function titular(veredicto: Veredicto): string {
  if (veredicto.estado !== "correcto") return "✗ Incorrecto";
  return veredicto.faltaC ? "Correcto. Recuerda escribir el +C." : "✓ Correcto";
}

export default function Respuesta({
  ejercicio,
  veredicto,
  ultimo,
  alSeguir,
}: Props) {
  const correcto = veredicto.estado === "correcto";
  return (
    <section class="pantalla">
      <div role="status">
        <h1 class={correcto ? "acierto" : "error"}>{titular(veredicto)}</h1>
      </div>
      <Meme
        imagen={correcto ? "acierto" : "error"}
        texto={
          correcto
            ? "Y dicen que Cálculo es difícil"
            : "Un signo nos traiciona a todos"
        }
      />
      {ejercicio.tipo === "opcion" ? (
        <p class="enunciado">
          {ETIQUETA_OPCION[ejercicio.respuesta as Opcion]}
        </p>
      ) : (
        <div class="enunciado">
          <Formula texto={`$${ejercicio.respuesta}$`} />
        </div>
      )}
      <Formula texto={ejercicio.solucion} />
      <button type="button" class="boton boton-primario" onClick={alSeguir}>
        {ultimo ? "Ver resultado" : "Siguiente"}
      </button>
    </section>
  );
}
