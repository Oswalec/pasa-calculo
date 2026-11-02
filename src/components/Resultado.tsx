import { useEffect, useState } from "preact/hooks";
import { cuentaRegresiva, fechaLima } from "../lib/fechas.ts";
import { racha } from "../lib/progreso.ts";

function nivel(aciertos: number): string {
  if (aciertos === 3) return "¡Excelente!";
  if (aciertos === 2) return "Vas bien, te falta poco";
  return "Aquí te conviene reforzar";
}

export default function Resultado({ aciertos }: { aciertos: number }) {
  const [restante, setRestante] = useState(() => cuentaRegresiva());
  const dias = racha(fechaLima());

  useEffect(() => {
    const reloj = setInterval(() => setRestante(cuentaRegresiva()), 1000);
    return () => clearInterval(reloj);
  }, []);

  return (
    <section class="pantalla">
      <h1>{aciertos} de 3</h1>
      <p class="enunciado">{nivel(aciertos)}</p>
      <p>Te acompañaré hasta que logres pasar el cálculo que necesites</p>
      <a
        class="boton boton-primario"
        href="https://wa.link/de928w"
        target="_blank"
        rel="noopener"
      >
        Quiero que me acompañes
      </a>
      <p class="discreto">
        {dias > 0 && `Racha: ${dias} ${dias === 1 ? "día" : "días"} · `}
        Nuevo reto en {restante}
      </p>
    </section>
  );
}
