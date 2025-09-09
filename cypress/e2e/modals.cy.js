// cypress/e2e/modals.rewritten.cy.js
function statusDaSuite(cor) {
  if (!cor) return 'desconhecido';
  if (cor.includes('bg-green-500')) return 'livre';
  if (cor.includes('bg-red-500')) return 'ocupado';
  if (cor.includes('bg-yellow-500')) return 'manutencao';
  if (cor.includes('bg-blue-500')) return 'conferencia';
  return 'desconhecido';
}
const APP_URL = Cypress.config('baseUrl') || 'http://localhost:5173';

describe('Painel de Controle de Suítes — fluxo completo (Check-in + Pedido)', () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit(APP_URL);
  });

  it('faz check-in em uma suíte livre, valida mudança e em seguida cria e finaliza um pedido', () => {
    // ---------- Selecionar suíte livre aleatoriamente ----------
    cy.get('.bg-green-500 .text-2xl.font-bold')
      .should('have.length.greaterThan', 0)
      .then($suites => {
        const idx = Math.floor(Math.random() * $suites.length);
        const $suite = $suites.eq(idx);
        const suiteNumber = $suite.text().trim();
        cy.wrap(suiteNumber).as('suiteNumber');
        cy.wrap($suite).should('be.visible').parents('.bg-green-500').first().click();
      });

    // ---------- Abrir modal de Atendimento e iniciar Check-in ----------
    cy.get('h3.text-2xl.font-bold.text-gray-900', { timeout: 5000 })
      .should('be.visible')
      .invoke('text')
      .then(titleText => {
        cy.log('Modal de atendimento aberto:', titleText.trim());
        //Comparar número da suíte e o mesmo do titulo
        cy.get('@suiteNumber').then(suiteNumber => {
          expect(titleText).to.include(suiteNumber);
        });
      });
    // Clicar no botão de Check-in / Abertura de Suíte
    cy.contains('button', /Abertura de Suíte \/ Check-in|Check-in|Abertura de Suíte/i)
      .should('be.visible')
      .click();

    // ---------- Preencher formulário de check-in ----------
    // 4. Preencher dados do Check-in

    // Quant. De Pessoas
    cy.get('input[name="acompanhantes"]').should('be.visible', 'be.enabled').clear().type('4');

    // Condução
    cy.get('input.w-48')
      .eq(1) // O segundo input.w-48 é o de Condução
      .should('be.visible', 'be.enabled')
      .clear()
      .type('3')
      .should('have.value', '3-App');

    // // Cor
    cy.get('label:contains("Cor")').click().should('be.visible').type('1');
    // .should('have.value', '1-Preto')

    // Digite o Número da Placa
    cy.get('label:contains("Digite o Numero da Placa")')
      .parent()
      .find('input[type="text"]')
      .should('be.visible')
      .should('be.enabled')
      .clear()
      //Setando com letra minuscula para o codigo retorar formatado
      .type('abc5-543')
      .should('have.value', 'ABC5-543');

    // Alternativa: seleciona o input dentro do label com classe cursor-pointer
    cy.get('label.cursor-pointer input[type="file"]').selectFile('cypress/fixtures/placa.jpg', {
      force: true,
    });
    // Confirma que a foto foi carregada verificando se o input possui arquivos
    cy.get('label.cursor-pointer input[type="file"]')
      .should('have.prop', 'files')
      .then(files => {
        expect(files).to.have.length.greaterThan(0);
        expect(files[0].name).to.equal('placa.jpg');
      });

    // Clica no botão de check-in
    cy.get('.bg-green-600 > .items-center > :nth-child(2)').click();
    // Aguarda a notificação de sucesso
    cy.get('.rh-toast > .flex-1')
      .should('be.visible')
      .invoke('text')
      .then(msg => {
        cy.log('Mensagem de notificação:', msg);
        expect(msg).to.contain('Check-in realizado'); // Não estar retornando o codigo da suite
      });
  });

  it('Conferir se a mudou o status para ocupada', () => {
    // ---------- Selecionar suíte ocupada aleatoriamente ----------
    cy.get('.bg-red-500 .text-2xl.font-bold')
      .should('have.length.greaterThan', 0)
      .then($suites => {
        const idx = Math.floor(Math.random() * $suites.length);
        const $suite = $suites.eq(idx);
        const suiteNumber = $suite.text().trim();
        cy.wrap(suiteNumber).as('suiteNumber');
        cy.wrap($suite).should('be.visible').parents('.bg-red-500').first().click();
      });
  });

  it('Selecionar uma Suite e Lançar Pedido', () => {
    // Seleciona uma suíte no status ocupada aleatoriamente para abrir o modal de atendimento
    cy.get('.bg-red-500 .text-2xl.font-bold')
      .should('have.length.greaterThan', 0)
      .then($suites => {
        const idx = Math.floor(Math.random() * $suites.length);
        const $suite = $suites.eq(idx);
        const suiteNumberTrim = $suite.text().trim();
        cy.wrap(suiteNumberTrim).as('suiteNumberTrim');

        // Clica na suíte selecionada
        cy.wrap($suite).should('be.visible').parents('.bg-red-500').first().as('suiteTile');
        cy.get('@suiteTile').click();
        console.log('Suite selecionada para pedido --->>>:', suiteNumberTrim);

        // Verifica se o modal com o número da suíte
        cy.contains('h3', `Atendimento - Suíte ${suiteNumberTrim}`)
          .should('be.visible')
          .parents('div.inline-block') // sobe até o container do modal
          .then($parents => {
            cy.wrap($parents.first()).as('atendimentoModal');
          });

        // Verifica os botões principais "Menu de atendimento"
        cy.get('@atendimentoModal').within(() => {
          cy.contains('button', /Lançamento de Pedido|Abertura de Suíte \/ Check-in/i)
            .should('be.visible')
            .and('be.enabled')
            .as('btnPedido');

          cy.contains('button', 'Fechamento de Suíte / Check-out')
            .should('be.visible')
            .and('be.enabled')
            .as('btnCheckout');

          cy.contains('button', 'Troca de Suíte')
            .should('be.visible')
            .and('be.enabled')
            .as('btnTroca');
        });

        // Clica no botão de Lançamento de Pedido
        cy.get('@btnPedido').click();

        // Conferir de o modal de lancamento de pedido abrio
        cy.get('div[role="dialog"]')
          .should('be.visible')
          .then($dialogs => {
            cy.wrap($dialogs.first()).as('pedidoDialog');
          });
        // Conferindo se os botões principais estão visíveis e habilitados
        cy.contains('button', 'Adicionar Pedido').should('be.visible').and('be.enabled');
        cy.contains('button', 'Imprimir').should('be.visible').and('be.enabled');
        cy.contains('button', 'Atualizar').should('be.visible').and('be.enabled');

        cy.log('Conferindo se o modal de lançamento de pedido abriu');
        // Lançar um pedido
        cy.get('.border-r > :nth-child(2) > .w-full').click().type('31{enter}');
        // Verifica se o pedido foi adicionado na lista
        cy.get('tbody > tr.border-b > td.py-3.hidden.sm\\:table-cell').should('contain', '31');

        // cy.contains('button', /Adicionar Pedido/i).click()
        cy.contains('button', /Adicionar Pedido/i)
          .should('be.visible')
          .click();

        cy.get('body').then($body => {
          if ($body.find('[data-testid="pedido-confirm-dialog"]').length) {
            cy.get('[data-testid="pedido-confirm-dialog"]')
              .should('be.visible')
              .within(() => {
                cy.get('[data-testid="pedido-confirm-ok"]')
                  .should('be.visible')
                  .and('be.enabled')
                  .click();
              });
          } else {
            // fallback: procurar por título "Confirmação" e clicar no OK
            cy.contains('h3', 'Confirmação')
              .should('be.visible')
              .parents('div')
              .eq(1)
              .within(() => {
                cy.contains('button', 'OK').click();
              });
          }
        });
      });
  });
});
