import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    // use one of the built-in reporters to avoid "Failed to load custom Reporter" errors
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});
