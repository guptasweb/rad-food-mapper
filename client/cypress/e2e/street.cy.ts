describe('Street search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('gibberish returns empty state', () => {
    // Stub the API to ensure deterministic empty response
    // Use project-level fixtures path (client/cypress/fixtures)
    cy.intercept('GET', '/api/v1/streets*', { fixture: 'street-empty.json' }).as('street');

    cy.get('[data-testid="nav-street"]').click();
    cy.get('[data-testid="form-street"]').within(() => {
      cy.get('[data-testid="input-street"]').type('THISISNOTASTREET');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@street');
    cy.get('[data-testid="results-count"]').should('have.text', '0');
    cy.get('[data-testid="results-empty"]').should('exist');
  });
});

