import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4321/pasa-calculo/";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["blueprints/**"],
  reporter: "list",
  use: {
    baseURL,
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 740 },
      },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
