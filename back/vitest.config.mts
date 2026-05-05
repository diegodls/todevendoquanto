import path from 'path';
import { defineConfig, defineProject } from 'vitest/config';

const alias = {
  '@prisma': path.resolve(__dirname, './generated/prisma/'),
  '@': path.resolve(__dirname, './src/'),
};

export default defineConfig({
  resolve: { alias, tsconfigPaths: true },

  test: {
    environment: 'node',
    globals: false,
    include: ['**/*.spec.ts', '**/*.test.ts'],
    fileParallelism: false,

    projects: [
      defineProject({
        resolve: {
          alias,
          tsconfigPaths: true,
        },
        test: {
          name: { label: 'unit', color: 'cyan' },
          environment: 'node',
          include: ['**/*.spec.ts'],
        },
      }),
      defineProject({
        resolve: {
          alias,
          tsconfigPaths: true,
        },
        test: {
          name: { label: 'integration', color: 'magenta' },
          environment: 'node',
          include: ['**/*test.ts'],
        },
      }),
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.spec.ts',
        '**/*.test.ts',
        'node_modules/',
        'dist/',
        'src/types/**',
      ],
    },
  },
});
