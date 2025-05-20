# Expense Tracker UI

Interface de usuário para o sistema de gerenciamento de despesas e viagens de motoristas.

## Tecnologias

- Vue.js 3
- Vue Router
- Axios
- Bootstrap Vue
- JavaScript ES6+

## Pré-requisitos

- Node.js (versão 14+)
- npm ou yarn
- API Backend rodando na porta 8001

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd expense-tracker-ui
```

2. Instale as dependências:

```bash
npm install
```
3. Configure o ambiente:
Copie o arquivo .env.example para .env:
```bash
cp .env.example .env
```

* Ajuste as variáveis de ambiente conforme necessário

### Execução
Ambiente de desenvolvimento

```bash
npm run serve
```

A aplicação estará disponível em http://localhost:8080

**Build para produção**

```bash
npm run build
```
### Estrutura do Projeto

```bash
expense-tracker-ui/
├── src/
│   ├── assets/        # Recursos estáticos
│   ├── components/    # Componentes Vue
│   ├── router/        # Configuração de rotas
│   ├── services/      # Serviços e API
│   ├── store/         # Gerenciamento de estado
│   └── views/         # Páginas/Views
├── public/           # Arquivos públicos
└── tests/           # Testes
```
### Funcionalidades
* Autenticação de usuários
* Gerenciamento de despesas
* Controle de viagens
* Configuração de metas
* Geração de relatórios
* Perfil de usuário
### API Endpoints
A aplicação se comunica com o backend através dos seguintes endpoints:
* /api/login - Autenticação
* /api/expenses - Gerenciamento de despesas
* /api/trips - Gerenciamento de viagens
* /api/goals - Gerenciamento de metas
* /api/reports - Geração de relatórios
* /api/users/me - Perfil do usuário

### Scripts Disponíveis
* npm run serve - Inicia servidor de desenvolvimento
* npm run build - Build para produção
* npm run test:unit - Executa testes unitários
* npm run lint - Verifica e corrige problemas de código

### Variáveis de Ambiente
* VUE_APP_API_URL - URL base da API (default: http://localhost:8001)
* VUE_APP_TITLE - Título da aplicação