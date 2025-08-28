# Testes automatizados com Cypress para motel-app

Este repositório contém a estrutura de testes end-to-end do sistema motel-app utilizando Cypress.

## Estrutura
- `cypress/e2e/`: testes automatizados (ex: modals.cy.js)
- `cypress/support/`: comandos customizados e configurações globais
- `cypress/component/`: testes de componentes (opcional)
- `README.md`: documentação dos testes
- `package.json`: dependências e scripts

## Como rodar os testes

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o servidor do motel-app (ex: `npm run dev` no projeto principal).
3. Execute os testes Cypress:
   ```sh
   npx cypress open
   ```
   ou para rodar em modo headless:
   ```sh
   npx cypress run
   ```

## Scripts úteis

- `npx cypress open` — abre o runner interativo
- `npx cypress run` — executa todos os testes em modo headless

## Dicas
- Certifique-se que o ambiente do motel-app está rodando em `http://localhost:5173`.
- Adapte os seletores e comandos conforme a interface do sistema.
- Os testes podem ser expandidos para cobrir fluxos completos, atalhos, validações e integrações.

---

Para dúvidas ou sugestões, consulte a documentação do Cypress: https://docs.cypress.io/
