export type Tema = "limites" | "continuidad" | "derivadas" | "integrales";

export type Opcion = "continua" | "removible" | "salto" | "infinita";

export type Chequeo =
  | { clase: "limite"; f: string; punto: string }
  | { clase: "derivada"; f: string; en?: number }
  | { clase: "integral"; f: string; a?: number; b?: number }
  | { clase: "continuidad-k" }
  | { clase: "continuidad-tipo" };

export type Ejercicio = {
  id: string;
  tema: Tema;
  n: number;
  enunciado: string;
  tipo: "expresion" | "opcion";
  respuesta: string;
  opciones?: Opcion[];
  constante?: boolean;
  solucion: string;
  chequeo: Chequeo;
};

export const ETIQUETA_OPCION: Record<Opcion, string> = {
  continua: "Continua",
  removible: "Discontinua removible",
  salto: "Discontinua de salto",
  infinita: "Discontinua infinita",
};

export const ETIQUETA_TEMA: Record<Tema, string> = {
  limites: "Límites",
  continuidad: "Continuidad",
  derivadas: "Derivadas",
  integrales: "Integrales",
};
