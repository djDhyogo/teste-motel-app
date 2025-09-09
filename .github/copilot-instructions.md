(## Instruções do repositório para o Copilot

Estas instruções orientam o comportamento do GitHub Copilot / assistentes automatizados ao sugerir código neste repositório.

Contexto do projeto

- Projeto: testes E2E para motel-app com Cypress.
- Linguagem principal dos testes: JavaScript (Cypress), alguns arquivos de exemplo em TypeScript.

Preferências de estilo

- Manter código claro e conciso. Preferir funções pequenas e responsabilidades únicas.
- Seguir padrões comuns do Cypress: usar comandos customizados em `cypress/support/commands.js` para ações repetidas.
- Evitar alterar arquivos da aplicação (src/) sem instrução explícita do desenvolvedor.

Seletores e fragilidade

- Preferir `data-cy` para seletores de testes. Quando sugerir seletores, proponha `data-cy` em vez de classes ou textos.
- Se usar classes/texto, documentar por que e apontar alternativa `data-cy`.

Testes e fixtures

- Sugira `cy.intercept()` para mockar chamadas de rede em testes que precisam ser determinísticos.
- Para asserts que dependem de tempo, sugerir `cy.clock()`/`cy.tick()`.
- Quando gerar fixtures, coloque-as em `cypress/fixtures/` e inclua um pequeno comentário com a estrutura do JSON.

Mensagens e documentação

- Ao criar/alterar testes, inclua um comentário curto no topo do spec com o objetivo do teste (ex.: "happy path check-in") e pré-condições.
- Atualize o `README.md` se adicionar novos comandos/fixtures/specs que exijam instruções de execução.

Segurança e permissões

- Nunca exfiltre segredos ou tokens. Se o código requer configuração de variáveis de ambiente, documente-as no README e use placeholders.

Automação e CI

- Sugira passos para rodar os testes no CI (ex.: GitHub Actions) usando `npx cypress run` e variáveis de ambiente para URL/base.

Quando pedir para gerar código:

- Forneça exemplos completos e funcionais (spec + fixtures + comandos) sempre que possível.
- Preferir alterações pequenas e seguras. Se uma mudança maior for necessária, explique o risco e proponha um PR separado.

Idioma

- Responder em português (pt-BR) por padrão, a menos que o desenvolvedor peça outro idioma.

Fim das instruções.)
