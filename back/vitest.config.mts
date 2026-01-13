import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // 'node' = backend, 'jsdom'/'happy-dom' = frontend.

    globals: false, // Importar explicitamente evita conflitos

    include: ["**/*.spec.ts", "**/*.test.ts"], // Padronize: .spec = unitários | .test = integração |  ['tests/unit/**/*.{test,spec}.ts'],

    fileParallelism: false, // Testes podem executar tarefas no banco ao mesmo tempo (ou outros), gerando erros

    projects: [
      {
        test: {
          name: { label: "unit", color: "cyan" },
          environment: "node",
          include: ["**/*.spec.ts"],
        },
      },
      {
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
      exclude: ["src/**/*.spec.ts", "src/types/**"], // Não meça cobertura de arquivos desses tipos
    },
  },
});
