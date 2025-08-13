import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
  },
  video: false,
  screenshotOnRunFailure: false,
  numTestsKeptInMemory: 1,
});

