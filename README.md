# Testes automatizados com Cypress para motel-app

Este repositório contém a estrutura de testes end-to-end do sistema motel-app utilizando Cypress.

## Estrutura
- `cypress/e2e/`: testes automatizados (ex: modals.cy.js)
- `cypress/support/`: comandos customizados e configurações globais
- `cypress/component/`: testes de componentes (opcional)
- `README.md`: documentação dos testes
- `package.json`: dependências e scripts
# Testes E2E com Cypress — motel-app

Este repositório contém casos de teste end-to-end para o motel-app usando Cypress. O foco aqui é tornar os testes determinísticos, legíveis e fáceis de manter.

## Visão rápida
- Stack: Cypress (E2E + component), comandos customizados em `cypress/support`.
- Testes principais: `cypress/e2e/*` (ex.: `modals.cy.js`).

## Estrutura relevante
- `cypress/e2e/`: specs de E2E
- `cypress/support/`: comandos customizados e helpers (ex.: `commands.js`)
- `cypress/fixtures/`: dados mock para testes

## Pré-requisitos
- Node.js (recomendado: versão LTS)
- Dependências do projeto:

```bash
npm install
```

Certifique-se de que o frontend do motel-app esteja rodando (ex.: `npm run dev`) em `http://localhost:5173` ou ajuste a URL nos testes.

## Como executar os testes

- Abrir runner interativo:

```bash
npx cypress open
```

- Executar em modo headless (CI/local):

```bash
npx cypress run --spec "cypress/e2e/modals.cy.js"
```

Substitua o `--spec` conforme o arquivo que deseja rodar.

## Scripts úteis
- Abrir runner: `npx cypress open`
- Rodar todos os specs headless: `npx cypress run`

## Convenções e boas práticas
- Preferir seletores `data-cy` para tornar testes robustos frente a mudanças de estilo/texto.
- Mockar APIs com `cy.intercept()` para cenários determinísticos.
- Controlar tempo com `cy.clock()`/`cy.tick()` quando validar timestamps.
- Criar comandos reutilizáveis em `cypress/support/commands.js` para ações comuns (ex.: seed, login, fluxos).

## Seletor recomendados (exemplos a adicionar ao app)
- `data-cy="btn-open-checkin"` — botão que abre modal de check-in
- `data-cy="input-guest-name"` — campo nome do hóspede
- `data-cy="input-document"` — campo documento
- `data-cy="btn-confirm-checkin"` — confirma check-in
- `data-cy="notification"` — área de notificações
- `data-cy="room-card-<NUMBER>"` — card do quarto (ex.: `room-card-101`)
- `data-cy="room-status"` — status do quarto

## Fixtures sugeridas
- `cypress/fixtures/rooms-available.json` — lista de quartos disponíveis
- `cypress/fixtures/guest.json` — payload de hóspede

## Exemplo de spec (happy-path)

O exemplo abaixo é um template que pode ser adaptado para o markup real do projeto.

```ts
// cypress/e2e/checkin.spec.ts
describe('Check-in flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/rooms', { fixture: 'rooms-available.json' });
    cy.visit('/');
  });

  it('faz check-in com sucesso no quarto 101', () => {
    cy.get('[data-cy=room-card-101]').click();
    cy.get('[data-cy=btn-open-checkin]').click();
    cy.get('[data-cy=input-guest-name]').type('João Silva');
    cy.get('[data-cy=input-document]').type('123456789');
    cy.clock(); // fixa o tempo para validar checkInTime
    cy.get('[data-cy=btn-confirm-checkin]').click();

    cy.get('[data-cy=notification]').should('contain', 'Check-in realizado');
    cy.get('[data-cy=room-status]').should('contain', 'Ocupado');

    // valida appState na janela (se app expõe state para testes)
    cy.window().its('appState').then((state: any) => {
      const room = state.rooms.find((r: any) => r.number === 101);
      expect(room).to.exist;
      expect(room.checkInTime).to.be.a('string');
    });
  });
});
```

## Casos de borda importantes
1. Submissão com campos vazios → validação UI
2. Quarto já ocupado no momento do submit → conflito 409
3. Falha de rede ao confirmar (500) → exibir erro e não marcar quarto como ocupado
4. Validação de timestamps (usar `cy.clock()`)
5. Persistência: reload mantém estado do check-in

## Próximos passos sugeridos
1. Adicionar atributos `data-cy` nos componentes (ex.: `src/components/modals/*`, cards).
2. Criar fixtures em `cypress/fixtures` conforme recomendado.
3. Criar specs isolados (ex.: `checkin.spec.ts`, `pedido.spec.ts`) e comandos reutilizáveis.
4. Integrar execução dos testes no CI (ex.: GitHub Actions) usando `npx cypress run`.
