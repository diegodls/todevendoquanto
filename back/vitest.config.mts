import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },

  test: {
    environment: "node", // 'node' = backend, 'jsdom'/'happy-dom' = frontend.

    globals: false, // Importar explicitamente evita conflitos

    include: ["**/*.spec.ts", "**/*.test.ts"], // Padronize: .spec = unitários | .test = integração |  ['tests/unit/**/*.{test,spec}.ts'],

    fileParallelism: false, // Testes podem executar tarefas no banco ao mesmo tempo (ou outros), gerando erros

    projects: [
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src/"),
          },
        },

        // extends: true,

        test: {
          name: { label: "unit", color: "cyan" },
          environment: "node",
          include: ["**/*.spec.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src/"),
          },
        },

        // extends: true,

        test: {
          name: { label: "integration", color: "magenta" },
          environment: "node",
          include: ["**/*test.ts"],
        },
      },
    ],

    coverage: {
      provider: "v8", // V8 é extremamente rápida
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "**/*.spec.ts",
        "**/*.test.ts",
        "node_modules/",
        "dist/",
        "src/types/**",
      ], // Não meça cobertura deste arquivos/pastas
    },
  },
});
