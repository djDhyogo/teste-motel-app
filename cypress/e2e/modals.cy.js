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
          // Continua o fluxo: clica no botão de Check-in para abrir o formulário
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
          
            // Se aparecer o modal de confirmação (padrão estilizado), valida e confirma
            cy.get('body').then($body => {
              if ($body.find('h3:contains("Confirmação")').length) {
                cy.contains('h3', 'Confirmação').should('be.visible').parents('div').eq(1).as('confirmModal');

                cy.get('@confirmModal').find('p').first().as('confirmModalP');
                cy.get('@confirmModalP').invoke('text').then(texto => {
                  cy.log('Texto da confirmação:', texto.trim());
                  const m = texto.match(/suí?te\s*(\d+)/i);
                  const suiteConfirm = m ? m[1] : null;
                  cy.wrap(suiteConfirm).as('confirmSuite');
                });

                cy.get('@confirmModal').within(() => {
                  cy.contains('button', 'Cancelar').should('be.visible').and('be.enabled');
                  cy.contains('button', 'OK').should('be.visible').and('be.enabled').click();
                });
              }
            });
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
            .as('suiteTile');
          cy.get('@suiteTile').click();
          // Verifica se o modal abriu e espera o modal de atendimento com o número da suíte
          cy.contains('h3', `Atendimento - Suíte ${suiteNumberTrim}`)
            .should('be.visible')
            .parents('div.inline-block') // sobe até o container do modal
            .then($parents => {
              cy.wrap($parents.first()).as('atendimentoModal');
            });

          // Verifica e cria aliases simples para os botões principais (curto e retryable)
          cy.get('@atendimentoModal').within(() => {
            cy.contains('button', /Lançamento de Pedido|Abertura de Suíte \/ Check-in/i)
              .should('be.visible').and('be.enabled').as('btnPedido');

            cy.contains('button', 'Fechamento de Suíte / Check-out')
              .should('be.visible').and('be.enabled').as('btnCheckout');

            cy.contains('button', 'Troca de Suíte')
              .should('be.visible').and('be.enabled').as('btnTroca');
          });

          // Clica no botão de Lançamento de Pedido
          cy.get('@btnPedido').click();
          // Verifica se o modal de pedido abriu
          // espera o modal (role dialog) e trabalha dentro dele
          cy.get('div[role="dialog"]').should('be.visible').then($dialogs => {
            cy.wrap($dialogs.first()).as('pedidoDialog');
          });
          cy.get('@pedidoDialog').within(() => {
            // título do modal
            cy.get('h3').then($h3s => { cy.wrap($h3s.first()).as('pedidoTitulo'); });
            cy.get('@pedidoTitulo').invoke('text').then((titulo) => {
              const tituloTrim = titulo.trim();
              cy.log('Título do modal:', tituloTrim);

              // extrai o número da suíte do título (ex: "Pedido - Suíte 2001")
              const match = tituloTrim.match(/Suíte\s*(\d+)/i);
              const suiteNumberFromModal = match ? match[1] : null;
              cy.log('Número da suíte extraído:', suiteNumberFromModal);

              // opcional: comparar com variável existente
              // if (typeof suiteNumberTrim !== 'undefined') {
              //   expect(suiteNumberFromModal).to.equal(suiteNumberTrim);
              // }
            });
            // Lançar um pedido
            cy.get('.border-r > :nth-child(2) > .w-full').click().type('31{enter}');
            // Verifica se o pedido foi adicionado na lista
            cy.get('tbody > tr.border-b > td.py-3.hidden.sm\\:table-cell').should('contain', '31');
            
            
            // listar textos dos botões do rodapé/área do modal
            cy.get('button').then($btns => {
              const textos = [...$btns].map(b => b.innerText.trim()).filter(Boolean);
              cy.log('Botões encontrados:', textos.join(' | '));
            });
            
            // checar botões importantes do modal
            cy.contains('button', 'Adicionar Pedido').should('be.visible').and('be.enabled');
            cy.contains('button', 'Imprimir').should('be.visible').and('be.enabled');
            cy.contains('button', 'Atualizar').should('be.visible').and('be.enabled');

            // cy.contains('button', /Adicionar Pedido/i).click();
            cy.contains('button', /Adicionar Pedido/i).should('be.visible').click();
            });

            // 5) Espera o diálogo de confirmação e confirma usando data-testid (retryable)
            cy.get('body').then($body => {
              if ($body.find('[data-testid="pedido-confirm-dialog"]').length) {
                cy.get('[data-testid="pedido-confirm-dialog"]').should('be.visible').within(() => {
                  cy.get('[data-testid="pedido-confirm-ok"]').should('be.visible').and('be.enabled').click();
                });
              } else {
                // fallback: procurar por título "Confirmação" e clicar no OK
                cy.contains('h3', 'Confirmação').should('be.visible').parents('div').eq(1).within(() => {
                  cy.contains('button', 'OK').click();
                });
              }
            });
          });
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

