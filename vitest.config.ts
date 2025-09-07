import * as path from "path";
import { configDefaults, defineConfig } from "vitest/config";
// @ts-expect-error - Module resolution issue but works at runtime
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "src/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/components/WeatherForecast/__test__/setup.ts"],
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "src/**/__test__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [...configDefaults.coverage.exclude, "node_modules/"],
    },
  },
});
