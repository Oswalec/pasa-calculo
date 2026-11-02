import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: "https://oswalec.github.io",
  base: "/pasa-calculo",
  output: "static",
  integrations: [preact()],
});
