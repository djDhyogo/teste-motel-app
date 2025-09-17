// Comandos customizados do Cypress

// Comando para login via UI; usa valores do .env expostos via Cypress.env
const DEFAULT_USERNAME = Cypress.env('USERNAME');
const DEFAULT_PASSWORD = Cypress.env('PASSWORD');

Cypress.Commands.add('login', (username = DEFAULT_USERNAME, password = DEFAULT_PASSWORD) => {
  const APP_URL = Cypress.env('APP_URL') || Cypress.config('baseUrl') || 'http://localhost:5173';
  // Visita a aplicação e realiza login pela UI
  cy.viewport(1366, 768);
  cy.visit(APP_URL);
  cy.get('#username').should('be.visible').clear().type(username);
  cy.get('#password').should('be.visible').clear().type(password);
  cy.contains('button', 'ENTRAR').click();
  // Garante que o painel carregou após login
  cy.get('.hidden > .text-2xl').should('be.visible').and('contain', 'Atendimento');
});
