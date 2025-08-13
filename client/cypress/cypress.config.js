const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    numTestsKeptInMemory: 1,
  },
});
