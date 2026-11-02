import { ETIQUETA_TEMA, type Tema } from "../data/tipos.ts";
import { fechaLima } from "../lib/fechas.ts";
import { racha } from "../lib/progreso.ts";

const TEMAS: Tema[] = ["limites", "continuidad", "derivadas", "integrales"];

export default function Inicio({
  alElegir,
}: {
  alElegir: (tema: Tema) => void;
}) {
  const dias = racha(fechaLima());
  return (
    <section class="pantalla">
      <h1>Reto de hoy: 3 ejercicios</h1>
      {TEMAS.map((tema) => (
        <button
          key={tema}
          type="button"
          class="boton"
          onClick={() => alElegir(tema)}
        >
          {ETIQUETA_TEMA[tema]}
        </button>
      ))}
      {dias > 0 && (
        <p class="discreto">
          Racha: {dias} {dias === 1 ? "día" : "días"}
        </p>
      )}
      <p class="discreto">CEC | Cálculo</p>
    </section>
  );
}
