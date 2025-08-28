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
beforeEach(() => {
  // Ajuste a URL conforme o ambiente local
  cy.visit('http://localhost:5173');
});

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
        cy.wrap($suite).parents('.bg-green-500').click();
        console.log('Suíte selecionada:', suiteNumber);

      // 2. Verifica se o modal de atendimento abriu e captura o título
      cy.get('h3.text-2xl.font-bold.text-gray-900')
        .should('be.visible')
        .invoke('text')
        .then((tituloModal) => {
          cy.log('Título do modal:', tituloModal);
          const match = tituloModal.match(/Suíte\s*(\d+)/i);
          const suiteModalNumber = match ? match[1] : null;
          expect(suiteModalNumber).to.equal(suiteNumber);
          cy.log('Número da suíte no modal:', suiteModalNumber);
          cy.get('.shadow-sm > .grid > .bg-green-500').should('be.visible').click();
        
        });
      // 3. Verifica se o modal do formulário de check-in abriu
      cy.get('form#checkin-form')
        .should('be.visible');
        // Captura o número da suíte no título do modal
      cy.get('form#checkin-form .text-gray-700')
        .contains('Número:')
        .find('.font-bold.text-gray-900')
        .invoke('text')
        .then((suiteModalNumber) => {
          cy.log('Número da suíte no modal de check-in:', suiteModalNumber);
          // Exemplo de assert:
          // expect(numeroSuite).to.equal(suiteNumber);
        });
        
        // 4. Preencher dados do Check-in

        // Quant. De Pessoas
        cy.get('input[name="acompanhantes"]')
          .should('be.visible')
          .should('be.enabled')
          .clear()
          .type('4');

        // Condução
        cy.get('input.w-48').eq(1) // O segundo input.w-48 é o de Condução
        .should('be.visible')
        .should('be.enabled')
        .clear()
        .type('3')
        .should('have.value', '3-App');


        // // Cor
        cy.get('label:contains("Cor")').click()
        .should('be.visible')
        .type('1')
        // .should('have.value', '1-Preto');


        // Digite o Número da Placa
        cy.get('label:contains("Digite o Numero da Placa")').parent().find('input[type="text"]')
          .should('be.visible')
          .should('be.enabled')
          .clear()
          //Setando com letra minuscula para o codigo retorar formatado
          .type('abc5-543')
          .should('have.value', 'ABC5-543');

          // Clica no botão de check-in
          cy.get('.bg-green-600 > .items-center > :nth-child(2)').click();
          // Aguarda a notificação de sucesso
          cy.get('.rh-toast > .flex-1')
            .should('be.visible')
            .invoke('text')
            .then((msg) => {
              cy.log('Mensagem de notificação:', msg);
              expect(msg).to.contain('Check-in realizado'); // Exemplo de assert
            });

        // 4. Conferir se a cor mudou e o status da suíte após o check-in
            // Usa a variável `suiteNumber` já capturada acima. Faz assert retryable
            // para esperar até que a suíte mude de cor/estado.
        const suiteNumberTrim = suiteNumber.trim();
        cy.log('Verificando mudança de cor/status para a suíte:', suiteNumberTrim);
        cy.get('h3.text-2xl.font-bold')
          .contains(suiteNumberTrim)
          .should('exist')
          .parents('.bg-green-500, .bg-red-500, .bg-yellow-500, .bg-blue-500')
          .then(($suiteAtualizada) => {
            const corAtual = $suiteAtualizada.attr('class') || '';
            const statusAtual = statusDaSuite(corAtual);
            cy.log('Classe/cor da suíte:', corAtual);
            cy.log('Status atual:', statusAtual);
            expect(statusAtual).to.equal('ocupado');
            console.log('Status atual:', statusAtual);
          });

          // 5. Clica na suíte (procura em qualquer cor) para abrir o modal de check-in
          cy.get('h3.text-2xl.font-bold')
            .contains(suiteNumberTrim)
            .parents('.bg-green-500, .bg-red-500, .bg-yellow-500, .bg-blue-500')
            .first()
            .click();
      });
    });
});

  // it('Seleciona uma suíte livre', () => {
  //   // Simula clique para abrir o modal de check-in
  //   cy.contains('Suíte');
  //   // Seleciona a primeira suíte livre
  //   cy.get('.bg-green-500.rounded-lg.cursor-pointer').first().click();
  //   // Abre o modal de check-in
  //   cy.contains('Check-in');
  //   cy.get('.bg-green-500 > .flex').should('be.visible').click();

  //   // Extrai o número da suíte do modal
  //   cy.get('.bg-green-500 > .flex > div > .text-lg')
  //     .should('be.visible')
  //     .invoke('text')
  //     .then((suiteText) => {
  //       const match = suiteText.match(/Suíte\s*(\d+)/i);
  //       const suiteNumber = match ? match[1] : null;
  //       cy.log('Suite selecionada para o teste:', suiteNumber);
  //       Cypress.env('suiteNumber', suiteNumber); // Salva para uso em outros testes
  //     });
  // });

  // it('Recebe o numero de uma suite (suiteNumber) e retorna status', () => {
  //   const suiteNumber = Cypress.env('suiteNumber');
  //   cy.log('Suite buscada:', suiteNumber);
  //   // Busca o elemento da suíte pelo número
  //   cy.get('h3.text-2xl.font-bold')
  //     .contains(suiteNumber)
  //     .should('exist')
  //     .should('be.visible')
  //     .parents('.bg-green-500, .bg-red-500, .bg-yellow-500, .bg-blue-500')
  //     .then(($suite) => {
  //     // Obtém a cor (classe CSS)
  //     const cor = $suite.attr('class');
  //     cy.log('Classe/cor da suíte:', cor);
  //     const status = statusDaSuite(cor);
  //     cy.log('Status da suíte:', status);
  //     console.log('Status da suíte:', status);
  //     });
  // });


//   it('abre e fecha o CheckoutModal', () => {

//   });

//   it('abre e fecha o ConferenciaModal', () => {

//   });

//   it('abre e fecha o PedidoModal', () => {

//   });

//   it('abre e fecha o TrocaSuiteModal', () => {
//   });

