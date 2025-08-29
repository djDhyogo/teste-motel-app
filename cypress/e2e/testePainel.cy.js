
/// <reference types="cypress" />

const APP_URL = Cypress.config('baseUrl') || 'http://localhost:5173'

describe('SISMOTEL – Painel de Atendimento', () => {

  beforeEach(() => {
      cy.viewport(1366, 768)
      cy.visit(APP_URL)
    })

  it('deve carregar a aplicação e exibir menu lateral', () => {
    // Verifica título da página
    cy.contains('SISMOTEL').should('be.visible')

    // Verifica itens do menu lateral
    const menus = ['Atendimento', 'Cadastros', 'Turno', 'Relatórios', 'Utilitários', 'Sobre']
    menus.forEach((menu) => {
      cy.contains('button', menu).should('be.visible')
    })
  })

  it('deve alternar filtros de status das suítes', () => {
    // Botões de filtro ficam no topo
    cy.contains('button', /^Todos/).as('btnTodos')
    cy.contains('button', /^Livre/).as('btnLivre')
    cy.contains('button', /^Ocupado/).as('btnOcupado')

    // Quantidade exibida no botão "Todos" é referência inicial
    cy.get('@btnTodos').then(($btn) => {
      const totalSuites = parseInt($btn.text().match(/\d+/)[0])

      // Clica em "Livre" e garante que o número exibido seja menor ou igual ao total
      cy.get('@btnLivre').click().then(($livre) => {
        const livre = parseInt($livre.text().match(/\d+/)[0])
        expect(livre).to.be.lte(totalSuites)
      })

      // Clica em "Ocupado" e garante que o número exibido seja menor ou igual ao total
      cy.get('@btnOcupado').click().then(($ocupado) => {
        const ocupado = parseInt($ocupado.text().match(/\d+/)[0])
        expect(ocupado).to.be.lte(totalSuites)
      })
    })
  })

  it('deve abrir detalhes de uma suíte ao clicar no card', () => {
    // Seleciona o primeiro card de suíte (usa o número 113 como exemplo)
    cy.contains('h3', '113').click()

    // Aguarda diálogo/modal (caso exista) e verifica se trouxe o número da suíte
    cy.contains('113').should('be.visible')

    // Fecha modal com Esc ou botão sair se existir
    cy.get('body').type('{esc}')
  })
})
