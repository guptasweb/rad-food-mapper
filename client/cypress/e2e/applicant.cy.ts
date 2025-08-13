describe('Applicant search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('empty state initially', () => {
    cy.get('[data-testid="results-header"]').contains('Results');
    cy.get('[data-testid="results-count"]').should('have.text', '0');
    cy.get('[data-testid="results-empty"]').should('exist');
  });

  it('requires applicant input', () => {
    cy.get('[data-testid="form-applicant"]').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="results-count"]').should('have.text', '0');
  });

  it('performs a basic applicant search and shows rows', () => {
    // Stubbing a deterministic non-empty result set
    cy.intercept('GET', '/api/v1/applicants*', { fixture: 'applicant-results.json' }).as('applicants');
    cy.get('[data-testid="form-applicant"]').within(() => {
      cy.get('[data-testid="input-applicant"]').type('TACO');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@applicants');
    cy.get('[data-testid="results-count"]').should('have.text', '2');
    cy.get('[data-testid="results-row"]').should('have.length.at.least', 1);
  });
});

