// cypress/e2e/modals.cy.js
/*
  Objetivo: testar fluxos principais de modais do Painel de Suítes.
  Pré-condições: usuário cadastrado; fixtures/placa.jpg disponível.
  Observação: seletores originais mantidos — prefira data-cy no app.
*/

//
// --- Helpers ---
//
function escolherSuiteAleatoria(corClasse) {
  return cy
    .get(`${corClasse} .text-2xl.font-bold`)
    .should('have.length.greaterThan', 0)
    .then($suites => {
      const idx = Math.floor(Math.random() * $suites.length);
      const $suite = $suites.eq(idx);
      const suiteNumber = $suite.text().trim();

      cy.wrap(suiteNumber).as('suiteNumber');
      return cy.wrap($suite).parents(corClasse).first().click();
    });
}



function fazerCheckinSuiteLivre() {
  return escolherSuiteAleatoria('.bg-green-500').then(() => {
    cy.get('@suiteNumber').then(suiteNumber => {
      cy.contains('h3', `Suíte ${suiteNumber}`).should('be.visible');
    });

    cy.contains('button', /Check-in|Abertura de Suíte/i).click();

    // Preenche formulário de check-in
    cy.get('input[name="acompanhantes"]').clear().type('4');
    cy.get('input.w-48').eq(1).clear().type('3').should('have.value', '3-App');
    cy.get('label:contains("Cor")').click().type('1');
    cy.get('label:contains("Digite o Numero da Placa")')
      .parent()
      .find('input[type="text"]')
      .clear()
      .type('abc5-543')
      .should('have.value', 'ABC5-543');
    cy.get('label.cursor-pointer input[type="file"]').selectFile('cypress/fixtures/placa.jpg', { force: true });
    cy.get('label.cursor-pointer input[type="file"]').should('have.prop', 'files').then(files => {
      expect(files[0].name).to.equal('placa.jpg');
    });
    cy.get('.bg-green-600 > .items-center > :nth-child(2)').click(); // Clique no botão Confirmar Check-in
    // Submete formulário

    cy.get('.rh-toast > .flex-1')
      .should('be.visible')
      .invoke('text')
      .then(msg => {
        expect(msg).to.contain('Check-in realizado');
      });
  });
}

//
// --- Testes ---
//
describe('Painel de Controle de Suítes', () => {
  beforeEach(() => {
    cy.login();
  });

  it('faz check-in em uma suíte livre', () => {
    // Valida fluxo de check-in
    fazerCheckinSuiteLivre();
  });

  it('seleciona uma suíte ocupada e abre modal de pedido', () => {

    fazerCheckinSuiteLivre();// Dando entrada em uma suíte para garantir que há uma ocupada

    escolherSuiteAleatoria('.bg-red-500').then(() => {
      cy.get('@suiteNumber').then(suiteNumber => {
        cy.contains('h3', `Atendimento - Suíte ${suiteNumber}`)
          .should('be.visible')
          .parents('div.inline-block')
          .first()
          .as('atendimentoModal');

        cy.get('@atendimentoModal').within(() => {
          cy.contains('button', /Lançamento de Pedido/).as('btnPedido');
          cy.contains('button', 'Fechamento de Suíte / Check-out').as('btnCheckout');
          cy.contains('button', 'Troca de Suíte').as('btnTroca');
        });

        cy.get('@btnPedido').click();

        cy.get('div[role="dialog"]').should('be.visible').first().as('pedidoDialog');
        cy.contains('button', 'Adicionar Pedido').should('be.visible');
        cy.contains('button', 'Imprimir').should('be.visible');
        cy.contains('button', 'Atualizar').should('be.visible');

        // lançar pedido simples
        cy.get('.border-r > :nth-child(2) > .w-full').click().type('31{enter}');
        cy.get('tbody > tr.border-b > td.py-3.hidden.sm\\:table-cell').should('contain', '31');
        cy.contains('button', /Adicionar Pedido/i).click();

        // confirmação
        cy.get('body').then($body => {
          if ($body.find('[data-testid="pedido-confirm-dialog"]').length) {
            cy.get('[data-testid="pedido-confirm-ok"]').click();
          } else {
            cy.contains('h3', 'Confirmação').parents('div').eq(1).within(() => {
              cy.contains('button', 'OK').click();
            });
          }
        });
      });
    });
  });
});
