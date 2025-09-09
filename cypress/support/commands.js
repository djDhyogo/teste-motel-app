// Comandos customizados do Cypress podem ser adicionados aqui
// Comando reutilizável de login via UI.
// Uso: cy.login() — usa credenciais padrão (admin / 123456)
// Ou: cy.login('usuario', 'senha')
Cypress.Commands.add('login', (username = 'admin', password = '123456') => {
  const APP_URL = Cypress.config('baseUrl') || 'http://localhost:5173';
  // Visita a aplicação e realiza login pela UI
  cy.visit(APP_URL);
  cy.get('#username').should('be.visible').clear().type(username);
  cy.get('#password').should('be.visible').clear().type(password);
  cy.contains('button', 'ENTRAR').click();
  // Garante que o painel carregou após login
  cy.get('.hidden > .text-2xl').should('be.visible').and('contain', 'Atendimento');
});
