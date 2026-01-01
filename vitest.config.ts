/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        global: {
          statements: 75,
          branches: 75,
          functions: 75,
          lines: 75,
        },
      },
      include: ["lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/.next/**",
        "**/coverage/**",
        "**/test/**",
        "**/*.config.*",
      ],
    },
  },
});
