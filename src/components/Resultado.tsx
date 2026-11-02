import { useEffect, useState } from "preact/hooks";
import type { Tema } from "../data/tipos.ts";
import { cuentaRegresiva, fechaLima } from "../lib/fechas.ts";
import { racha } from "../lib/progreso.ts";
import { compartirTarjeta, crearTarjeta } from "../lib/tarjeta.ts";

type Cierre = {
  titulo: string;
  reflexion: string;
  oferta: string;
  boton: string;
};

const OFERTA_BASE =
  "En mi acompañamiento te guío paso a paso hasta que logres pasar el cálculo que necesites.";
const BOTON_BASE = "Quiero el acompañamiento";

/** El cierre según los aciertos: reflexión primero y la oferta de pago al final. */
const CIERRES: Record<number, Cierre> = {
  0: {
    titulo: "Hoy no salió, y está bien que lo sepas ahora",
    reflexion:
      "Esto no significa que no puedas con Cálculo. Casi siempre falta una base que nadie te explicó bien, y seguir practicando solo, sin saber dónde falla, suele dar el mismo resultado.",
    oferta: OFERTA_BASE,
    boton: BOTON_BASE,
  },
  1: {
    titulo: "Ya tienes una parte",
    reflexion:
      "Ese acierto te muestra que sí puedes. Lo que falta es ordenar la base para que no dependa de la suerte.",
    oferta: OFERTA_BASE,
    boton: BOTON_BASE,
  },
  2: {
    titulo: "Estuviste cerca, y ahí está el riesgo",
    reflexion:
      "Un 2 de 3 te hace sentir listo, pero ese error que no corriges es el que se repite en el examen y te cuesta el curso.",
    oferta:
      "En mi acompañamiento encontramos qué te hace fallar y lo corregimos antes de tu examen.",
    boton: "Quiero corregirlo antes del examen",
  },
  3: {
    titulo: "¡Excelente! Ya tienes la base",
    reflexion:
      "Estos ejercicios son los fáciles. El examen sube de nivel, y ahí es donde muchos que iban bien se quedan.",
    oferta:
      "En mi acompañamiento avanzas al nivel de examen, para que llegues preparado y no solo con la base.",
    boton: "Quiero llegar listo al examen",
  },
};

type Props = { tema: Tema; aciertos: number; alOtroTema: () => void };

export default function Resultado({ tema, aciertos, alOtroTema }: Props) {
  const [restante, setRestante] = useState(() => cuentaRegresiva());
  const dias = racha(fechaLima());
  const cierre = CIERRES[aciertos] ?? (CIERRES[0] as Cierre);

  async function compartir() {
    try {
      await compartirTarjeta(await crearTarjeta({ tema, aciertos }));
    } catch {
      // El alumno canceló el menú de compartir: no hay nada que mostrar.
    }
  }

  useEffect(() => {
    const reloj = setInterval(() => setRestante(cuentaRegresiva()), 1000);
    return () => clearInterval(reloj);
  }, []);

  return (
    <section class="pantalla">
      <h1>{aciertos} de 3</h1>
      <p class="cierre-titulo">{cierre.titulo}</p>
      <p class="cierre-texto">{cierre.reflexion}</p>
      <p class="cierre-texto">{cierre.oferta}</p>
      <a
        class="boton boton-primario"
        href="https://wa.link/de928w"
        target="_blank"
        rel="noopener"
      >
        {cierre.boton}
      </a>
      <p class="discreto">
        Practica con estos retos que son gratis, el acompañamiento ya es de
        pago.
      </p>
      <button type="button" class="enlace-pequeno" onClick={alOtroTema}>
        Hacer otro tema
      </button>
      <button type="button" class="enlace-pequeno" onClick={compartir}>
        Compartir resultado
      </button>
      <p class="discreto">
        {dias > 0 && `Racha: ${dias} ${dias === 1 ? "día" : "días"} · `}
        Nuevo reto en {restante}
      </p>
    </section>
  );
}
