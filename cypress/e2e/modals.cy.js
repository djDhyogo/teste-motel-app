// Função utilitária para identificar status da suíte pela cor
function statusDaSuite(cor) {
  if (cor.includes('bg-green-500')) {
    return 'livre';
  } else if (cor.includes('bg-red-500')) {
    return 'ocupado';
  } else if (cor.includes('bg-yellow-500')) {
    return 'manutencao';
  } else if (cor.includes('bg-blue-500')) {
    return 'conferencia';
  }
  return 'desconhecido';
}


/// <reference types="cypress" />

// Testes de modais do sistema motel-app

describe('Painel de Controle de Suítes', () => {
  it('Seleciona aleatoriamente uma suíte livre, faz check-in e valida mudanças', () => {
    // 1. Seleciona aleatoriamente uma suíte livre
    cy.get('.bg-green-500 .text-2xl.font-bold')
      .then($suites => {
        expect($suites.length).to.be.greaterThan(0);
        const randomIndex = Math.floor(Math.random() * $suites.length);
        const $suite = $suites.eq(randomIndex);
        const suiteNumber = $suite.text();
        cy.wrap($suite).should('be.visible');
        cy.log('Suíte selecionada:', suiteNumber);
        console.log('Suíte selecionada:', suiteNumber);

        // 2. Dar entrada (check-in) na suíte
        cy.wrap($suite)
          .parents('.bg-green-500')
          .click();

        // 3. Conferir se a cor mudou e o status da suíte após o check-in
        // cy.get('h3.text-2xl.font-bold')
        //   .contains(suiteNumber)
        //   .parents('.bg-green-500, .bg-red-500, .bg-yellow-500, .bg-blue-500')
        //   .then(($suiteAtualizada) => {
        //     const corAtual = $suiteAtualizada.attr('class');
        //     const statusAtual = statusDaSuite(corAtual);
        //     cy.log('Cor atual:', corAtual);
        //     cy.log('Status atual:', statusAtual);
        //     expect(statusAtual).to.equal('ocupado'); // Exemplo de assert
        //   });

        // // 4. Captura a mensagem de notificação do usuário (ajuste o seletor conforme seu sistema)
        // cy.get('.notificacao-usuario') // Exemplo de seletor
        //   .should('be.visible')
        //   .invoke('text')
        //   .then(msg => {
        //     cy.log('Mensagem de notificação:', msg);
        //     expect(msg).to.contain('Check-in realizado'); // Exemplo de assert
        //   });
      });

      
  });
  beforeEach(() => {
    // Ajuste a URL conforme o ambiente local
    cy.visit('http://localhost:5173');
  });

  it('Seleciona uma suíte livre', () => {
    // Simula clique para abrir o modal de check-in
    cy.contains('Suíte');
    // Seleciona a primeira suíte livre
    cy.get('.bg-green-500.rounded-lg.cursor-pointer').first().click();
    // Abre o modal de check-in
    cy.contains('Check-in');
    cy.get('.bg-green-500 > .flex').should('be.visible').click();

    // Extrai o número da suíte do modal
    cy.get('.bg-green-500 > .flex > div > .text-lg')
      .should('be.visible')
      .invoke('text')
      .then((suiteText) => {
        const match = suiteText.match(/Suíte\s*(\d+)/i);
        const suiteNumber = match ? match[1] : null;
        cy.log('Suite selecionada para o teste:', suiteNumber);
        Cypress.env('suiteNumber', suiteNumber); // Salva para uso em outros testes
      });
  });

  it('Recebe o numero de uma suite (suiteNumber) e retorna status', () => {
    const suiteNumber = Cypress.env('suiteNumber');
    cy.log('Suite buscada:', suiteNumber);
    // Busca o elemento da suíte pelo número
    cy.get('h3.text-2xl.font-bold')
      .contains(suiteNumber)
      .should('exist')
      .should('be.visible')
      .parents('.bg-green-500, .bg-red-500, .bg-yellow-500, .bg-blue-500')
      .then(($suite) => {
      // Obtém a cor (classe CSS)
      const cor = $suite.attr('class');
      cy.log('Classe/cor da suíte:', cor);
      const status = statusDaSuite(cor);
      cy.log('Status da suíte:', status);
      console.log('Status da suíte:', status);
      });
  });


//   it('abre e fecha o CheckoutModal', () => {

//   });

//   it('abre e fecha o ConferenciaModal', () => {

//   });

//   it('abre e fecha o PedidoModal', () => {

//   });

//   it('abre e fecha o TrocaSuiteModal', () => {
//   });
});
