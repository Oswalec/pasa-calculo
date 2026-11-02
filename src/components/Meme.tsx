const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Imagen del cuy con su frase. El texto va aparte para corregirlo sin regenerar la imagen. */
export default function Meme({
  imagen,
  texto,
}: {
  imagen: string;
  texto: string;
}) {
  return (
    <figure class="meme">
      <img src={`${BASE}/cuy/${imagen}.webp`} alt="" width={520} height={390} />
      <figcaption>{texto}</figcaption>
    </figure>
  );
}
