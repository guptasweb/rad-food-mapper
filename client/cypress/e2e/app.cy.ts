describe('SF Food Mapper UI', () => {
  beforeEach(() => {
    // Set up pass-through intercepts so we can wait on network responses
    cy.intercept('GET', '/api/v1/applicants*').as('applicants');
    cy.intercept('GET', '/api/v1/streets*').as('streets');
    cy.intercept('GET', '/api/v1/nearest*').as('nearest');
  });

  it('loads and shows forms', () => {
    cy.visit('/', { timeout: 60000 });
    cy.contains('SF Food Mapper', { timeout: 30000 });
    cy.contains('Search by Applicant');
    cy.contains('Search by Street');
    cy.contains('Find Nearest');
    cy.get('[data-testid="results-count"]').should('exist');
  });

  it('shows empty state before any search', () => {
    cy.visit('/', { timeout: 60000 });
    cy.contains(/^\d+ Results$/);
    cy.get('[data-testid="results-empty"]').should('exist');
  });

  it('applicant search validates input and shows result count', () => {
    cy.visit('/');
    cy.get('[data-testid="form-applicant"]').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="results-count"]').should('have.text', '0');

    cy.get('[data-testid="form-applicant"]').within(() => {
      cy.get('[data-testid="input-applicant"]').type('TACO');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@applicants', { timeout: 30000 });
    cy.contains('Results');
  });

  it('street search only matches address and shows empty state for gibberish', () => {
    cy.visit('/');
    cy.get('[data-testid="form-street"]').within(() => {
      cy.get('[data-testid="input-street"]').type('THISISNOTASTREET');
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@streets', { timeout: 30000 });
    cy.get('[data-testid="results-empty"]').should('exist');
  });

  it('nearest search requires lat and lng', () => {
    cy.visit('/');
    cy.get('[data-testid="form-nearest"]').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="results-count"]').should('have.text', '0');
  });
});

