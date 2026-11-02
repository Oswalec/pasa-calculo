import katex from "katex";
import "katex/dist/katex.min.css";

/** Pinta texto con tramos $LaTeX$. Los tramos de texto nunca se tratan como HTML. */
export default function Formula({ texto }: { texto: string }) {
  return (
    <div class="formula">
      {texto.split("$").map((tramo, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(tramo, { throwOnError: false }),
            }}
          />
        ) : (
          tramo
        ),
      )}
    </div>
  );
}
