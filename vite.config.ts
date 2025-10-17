/// <reference types="vitest/config" />

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // similar error: https://github.com/tailwindlabs/tailwindcss/issues/18802
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["**/components/ui/**"],
    },
  },
});
