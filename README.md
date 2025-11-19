# 🛵 UaiFood Backend

Este é o back-end da aplicação **UaiFood**, uma API RESTful desenvolvida para gerenciar toda a lógica de negócios, persistência de dados e comunicação em tempo real da plataforma de delivery.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com um conjunto robusto de tecnologias para garantir performance, segurança e escalabilidade:

  * **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
  * **Runtime:** [Node.js](https://nodejs.org/)
  * **Framework Web:** [Express](https://expressjs.com/)
  * **ORM (Object-Relational Mapping):** [Prisma](https://www.prisma.io/)
  * **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
  * **Autenticação:** [JWT (JSON Web Token)](https://jwt.io/) & Passport.js
  * **Validação:** [Zod](https://zod.dev/)
  * **Comunicação em Tempo Real:** [Socket.io](https://socket.io/)
  * **Documentação:** [Swagger / OpenAPI](https://swagger.io/)
  * **Injeção de Dependência:** [TSyringe](https://github.com/microsoft/tsyringe)

## 📐 Modelagem e Arquitetura

O sistema utiliza uma arquitetura em camadas (Controllers, Services, Repositories) para separar responsabilidades.

### Diagrama de Classes

Abaixo está a representação visual das classes e relacionamentos do sistema:

<img src="./docs/class-diagram.png" alt="Diagrama de classes UaiFood" />

### Banco de Dados (Prisma)

As principais entidades do sistema são:

  * **User:** Usuários do sistema (Clientes e Administradores).
  * **Address:** Endereços de entrega vinculados aos usuários.
  * **Category & Item:** Gestão do cardápio (Categorias e Pratos).
  * **Order & OrderItem:** Pedidos realizados e seus itens.
  * **Notification:** Notificações para usuários.

## ✨ Funcionalidades da API

  * **Autenticação e Autorização:**
      * Login e Cadastro (Sign In / Sign Up).
      * Gerenciamento de Refresh Tokens.
      * Controle de acesso baseado em cargos (Admin vs Client).
  * **Gestão de Usuários:** Atualização de perfil e endereços.
  * **Gestão de Cardápio:** CRUD de categorias e itens (disponibilidade, preço, imagem).
  * **Fluxo de Pedidos:**
      * Criação de pedidos.
      * Atualização de status (Pendente -\> Confirmado -\> Entregue/Cancelado).
      * Cálculo automático de subtotal e total.
  * **Notificações em Tempo Real:** Atualizações via Socket.io quando o status do pedido muda.

## 📦 Pré-requisitos

  * [Node.js](https://nodejs.org/) (v18+)
  * [PostgreSQL](https://www.postgresql.org/) (Banco de dados)

## 🔧 Instalação e Configuração

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/uaifood-backend.git
    cd uaifood-backend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto copiando o exemplo fornecido:

    ```bash
    cp .env.example .env
    ```

    Preencha as variáveis no arquivo `.env` com suas configurações locais:

    ```env
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/uaifood?schema=public"
    SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/uaifood_shadow?schema=public"
    JWT_SECRET="seu_segredo_jwt"
    REFRESH_SECRET="seu_segredo_refresh"
    FRONTEND_URL="http://localhost:5173"
    ```

4.  **Configuração do Banco de Dados:**

    Execute as migrações do Prisma para criar as tabelas:

    ```bash
    npx prisma migrate dev
    ```

    *(Opcional) Popule o banco com dados iniciais:*

    ```bash
    npm run prisma:seed
    ```

## 🏃‍♂️ Rodando a Aplicação

  * **Modo de Desenvolvimento (com auto-reload):**

    ```bash
    npm run dev
    ```

  * **Modo de Produção:**

    ```bash
    npm run build
    npm start
    ```

O servidor iniciará (por padrão) em `http://localhost:3000`.

## 📚 Documentação da API (Swagger)

Com a aplicação rodando, você pode acessar a documentação interativa das rotas em:

```
http://localhost:3000/api/docs
```

## 📂 Estrutura de Pastas

```
src/
├── @types/       # Definições de tipos globais
├── auth/         # Configurações de autenticação (Passport, JWT)
├── config/       # Configurações gerais (Env, Swagger, Socket)
├── controllers/  # Controladores das rotas (Request/Response)
├── middlewares/  # Middlewares (Auth, Error Handling)
├── repositories/ # Camada de acesso a dados
├── routes/       # Definição das rotas da API
├── services/     # Regras de negócio
├── utils/        # Funções utilitárias
└── zodSchemes/   # Schemas de validação Zod
```

## 🤝 Contribuição

Contribuições são bem-vindas\! Por favor, abra uma issue ou pull request para melhorias.

-----

Desenvolvido pelo time UaiFood.
