# Projeto Node.js CREATUS

Este projeto é uma aplicação Node.js que implementa funcionalidades de gestão de usuários, incluindo criação, autenticação, listagem, atualização, exclusão e geração de relatórios em formatos PDF e CSV.

# Pré-requisitos
- Node.js instalado
- MongoDB configurado e rodando

# Instalação
Clone o repositório: https://github.com/PatrickBomm/DesafioCreatus.git

Instale as dependências:
`npm install`

# Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

PORT=8080
MONGODB_URI=mongodb://localhost:27017/seu-database
JWT_SECRET=seu-segredo-jwt

# Inicie o servidor:
npm run dev


# ENDPOINTS DA APLICAÇÃO:

- Autenticação:
Login
URL: /creatus/login

- Usuários:

Criar Usuário
URL: /creatus/users

Listar Todos os Usuários
URL: /creatus/users

Obter Usuário por ID
URL: /creatus/users/:id

Atualizar Usuário por ID
URL: /creatus/users/:id

Deletar (Desativar) Usuário por ID
URL: /creatus/users/:id

- Relatórios:
Gerar Relatório
URL: /creatus/users/report