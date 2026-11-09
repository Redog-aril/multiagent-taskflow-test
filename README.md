# TaskFlow

Aplicação de gerenciamento de tarefas desenvolvida sobre arquitetura Express/Node.js.

## Estrutura do Projeto

- `src/controllers/taskController.js`: Lógica de negócio e gerenciamento de tarefas.
- `src/middleware/validateTask.js`: Validações de entrada e sanitização de payloads.
- `src/routes/taskRoutes.js`: Definição dos endpoints REST da API.
- `src/app.js`: Configuração da aplicação Express.
- `tests/tasks.test.js`: Testes automatizados cobrindo as operações CRUD e validações.

## Instruções de Instalação e Execução

### Pré-requisitos
- Node.js >= 18
- npm

### Instalação
```bash
npm install
```

### Executar Testes
```bash
npm test
```
