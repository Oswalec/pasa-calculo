const ZONA = "America/Lima";
const MS_DIA = 86_400_000;

function partesLima(ahora: Date): Record<string, string> {
  const formato = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const partes: Record<string, string> = {};
  for (const { type, value } of formato.formatToParts(ahora))
    partes[type] = value;
  return partes;
}

/** Fecha calendario en Lima como "AAAA-MM-DD". Nunca usa la zona del dispositivo. */
export function fechaLima(ahora: Date = new Date()): string {
  const { year, month, day } = partesLima(ahora);
  return `${year}-${month}-${day}`;
}

function aUtc(fecha: string): number {
  const [anio, mes, dia] = fecha.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return Date.UTC(anio, mes - 1, dia);
}

/** Días calendario de `desde` a `hasta`. Negativo si `hasta` es anterior. */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUtc(hasta) - aUtc(desde)) / MS_DIA);
}

/** Tiempo hasta la próxima medianoche de Lima como "HH:MM:SS". */
export function cuentaRegresiva(ahora: Date = new Date()): string {
  const { hour, minute, second } = partesLima(ahora);
  const pasados = Number(hour) * 3600 + Number(minute) * 60 + Number(second);
  const faltan = 86_400 - pasados;
  const horas = Math.floor(faltan / 3600);
  const minutos = Math.floor((faltan % 3600) / 60);
  const segundos = faltan % 60;
  return [horas, minutos, segundos]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}
