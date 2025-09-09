/// <reference types="cypress" />

const APP_URL = Cypress.config('baseUrl') || 'http://localhost:5173';

describe('SISMOTEL – Painel de Atendimento', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  // Teste que apenas valida a tela de login (sem autenticar)
  it('deve verificar se a aplicação carregou a pagina de login', () => {
    cy.visit(APP_URL);
    cy.get('.text-4xl').contains('Bem-vindo');
  });

  // A partir daqui os testes precisam estar autenticados; colocamos em um bloco aninhado
  describe('com sessão autenticada', () => {
    beforeEach(() => {
      // login padrão antes de cada teste deste bloco
      cy.login();
    });

    it('deve carregar a aplicação e exibir menu lateral', () => {
      // Verifica título da página (aumenta timeout caso carregamento demore)
      cy.contains('SISMOTEL', { timeout: 10000 }).should('be.visible');

      // Verifica itens do menu lateral
      const menus = ['Atendimento', 'Cadastros', 'Turno', 'Relatórios', 'Utilitários', 'Sobre'];
      menus.forEach(menu => {
        cy.contains('button', menu).should('be.visible');
      });
    });

    it('deve alternar filtros de status das suítes', () => {
      // Botões de filtro ficam no topo
      cy.contains('button', /^Todos/).as('btnTodos');
      cy.contains('button', /^Livre/).as('btnLivre');
      cy.contains('button', /^Ocupado/).as('btnOcupado');

      // Quantidade exibida no botão "Todos" é referência inicial
      cy.get('@btnTodos').then($btn => {
        const totalSuites = parseInt($btn.text().match(/\d+/)[0]);

        // Clica em "Livre" somente quando não estiver desabilitado
        cy.get('@btnLivre')
          .should('not.be.disabled')
          .click()
          .then($livre => {
            const livre = parseInt($livre.text().match(/\d+/)[0]);
            expect(livre).to.be.lte(totalSuites);
          });

        // Clica em "Ocupado" somente quando não estiver desabilitado
        cy.get('@btnOcupado')
          .should('not.be.disabled')
          .click()
          .then($ocupado => {
            const ocupado = parseInt($ocupado.text().match(/\d+/)[0]);
            expect(ocupado).to.be.lte(totalSuites);
          });
      });
    });

    it('deve abrir detalhes de uma suíte ao clicar no card', () => {
      // Seleciona o primeiro card de suíte (usa o número 113 como exemplo)
      cy.contains('h3', '113', { timeout: 10000 }).click();

      // Aguarda diálogo/modal (caso exista) e verifica se trouxe o número da suíte
      cy.contains('113').should('be.visible');

      // Fecha modal com Esc ou botão sair se existir
      cy.get('body').type('{esc}');
    });
  });
});
