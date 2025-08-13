describe('Street search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('gibberish returns empty state', () => {
    // Stubbing the API to ensure deterministic empty response and using project-level fixtures path
    cy.intercept('GET', '/api/v1/streets*', { fixture: 'street-empty.json' }).as('street');
    cy.contains('SF Food Mapper', { timeout: 30000 });
    cy.get('[data-testid="nav-street"]', { timeout: 30000 }).click();
    cy.get('[data-testid="form-street"]').within(() => {
      cy.get('[data-testid="input-street"]').type('THISISNOTASTREET');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@street');
    cy.get('[data-testid="results-count"]').should('have.text', '0');
    cy.get('[data-testid="results-empty"]').should('exist');
  });

  it('returns non-empty results for a valid street fragment', () => {
    cy.intercept('GET', '/api/v1/streets*', { fixture: 'street-results.json' }).as('streetsOk');
    cy.get('[data-testid="nav-street"]').click();
    cy.get('[data-testid="form-street"]').within(() => {
      cy.get('[data-testid="input-street"]').type('SANSOME');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@streetsOk');
    cy.get('[data-testid="results-count"]').should('have.text', '1');
    cy.get('[data-testid="results-row"]').should('have.length.at.least', 1);
  });
});

