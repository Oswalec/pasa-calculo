import { useEffect, useRef, useState } from "preact/hooks";
import {
  ETIQUETA_OPCION,
  type Ejercicio as Item,
  type Opcion,
  type Tema,
} from "../data/tipos.ts";
import type { Veredicto } from "../lib/corrector.ts";
import { disposicionTeclado } from "../lib/teclado.ts";
import Formula from "./Formula.tsx";

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": any;
    }
  }
}

type Corregir = typeof import("../lib/corrector.ts").corregir;

let carga: Promise<Corregir> | null = null;

/** Carga MathLive y el corrector una sola vez, al entrar a la primera pantalla de ejercicio. */
function cargarHerramientas(): Promise<Corregir> {
  carga ??= (async () => {
    await import("mathlive/fonts.css");
    const { MathfieldElement } = await import("mathlive");
    MathfieldElement.fontsDirectory = null; // las fuentes ya vienen de mathlive/fonts.css
    MathfieldElement.soundsDirectory = null;
    MathfieldElement.computeEngine = null;
    const { corregir } = await import("../lib/corrector.ts");
    return corregir;
  })();
  return carga;
}

type Props = {
  ejercicio: Item;
  tema: Tema;
  indice: number;
  alComprobar: (veredicto: Veredicto) => void;
};

export default function Ejercicio({
  ejercicio,
  tema,
  indice,
  alComprobar,
}: Props) {
  const [corregir, setCorregir] = useState<Corregir | null>(null);
  const [valor, setValor] = useState("");
  const [invalido, setInvalido] = useState(false);
  const campo = useRef<HTMLElement>(null);
  const esOpcion = ejercicio.tipo === "opcion";

  useEffect(() => {
    let vigente = true;
    void cargarHerramientas().then((funcion) => {
      if (vigente) setCorregir(() => funcion);
    });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    if (!corregir || esOpcion || !campo.current) return;
    const teclado = window.mathVirtualKeyboard;
    teclado.layouts = [disposicionTeclado(tema)];
    campo.current.focus();
    teclado.show();
    return () => teclado.hide();
  }, [corregir, esOpcion, tema]);

  function comprobar() {
    if (esOpcion) {
      alComprobar(
        valor === ejercicio.respuesta
          ? { estado: "correcto", faltaC: false }
          : { estado: "incorrecto" },
      );
      return;
    }
    if (!corregir) return;
    const veredicto = corregir(valor, ejercicio.respuesta, ejercicio.constante);
    if (veredicto.estado === "invalido") {
      setInvalido(true);
      return;
    }
    alComprobar(veredicto);
  }

  return (
    <section class="pantalla">
      <h1>{indice + 1} de 3</h1>
      <div class="enunciado">
        <Formula texto={ejercicio.enunciado} />
      </div>
      {esOpcion
        ? ejercicio.opciones?.map((opcion: Opcion) => (
            <button
              key={opcion}
              type="button"
              class="boton"
              aria-pressed={valor === opcion}
              onClick={() => setValor(opcion)}
            >
              {ETIQUETA_OPCION[opcion]}
            </button>
          ))
        : corregir && (
            <math-field
              ref={campo}
              math-virtual-keyboard-policy="manual"
              aria-label="Tu respuesta"
              onInput={(evento: Event) => {
                setInvalido(false);
                setValor((evento.target as HTMLInputElement).value);
              }}
            />
          )}
      {invalido && <p role="status">Revisa tu respuesta</p>}
      <button
        type="button"
        class="boton boton-primario"
        disabled={valor === "" || (!esOpcion && !corregir)}
        onClick={comprobar}
      >
        Comprobar
      </button>
    </section>
  );
}
