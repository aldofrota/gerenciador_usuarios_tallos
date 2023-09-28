# Tallos Users

## Ferramentas Utilizadas

- **Front-End:**

  - VueJs
  - VueX
  - Socket.io

- **Back-End:**

  - NestJS

- **Banco de Dados:**

  - MongoDB

- **Containerização:**

  - Docker

- **DevOps:**

  - GitFlow
  - Swagger

- **Testes:**
  - Jest
  - Supertest

# Funcionalidades da Aplicação

1. **Login:**

   - Os usuários podem realizar login na plataforma.

2. **Cadastro de Usuários:**

   - É possível criar novos usuários na aplicação.

3. **Prevenção de Login Simultâneo:**

   - A aplicação evita que o mesmo usuário faça login em sessões diferentes simultaneamente.

4. **Reflexo de Ações entre Usuários:**

   - As ações como criar, mudar permissões e deletar usuários são refletidas em tempo real para todos os usuários logados por via de notificações.

5. **Mudança de Permissões:**

   - Os usuários podem ter suas permissões alteradas.

6. **Remoção de Usuários:**

   - Os usuários podem ser removidos da plataforma.

7. **Autenticação JWT:**

   - Todas as rotas da API são autenticadas utilizando JSON Web Tokens (JWT).

8. **Containerização:**

   - As aplicações (front-end, back-end, banco de dados) são conteinerizadas com Docker.

9. **Gerenciamento de Estados dos Usuários:**

   - O front-end possui gerenciamento de estados dos usuários.

10. **Documentação de Rotas da API:**

- Todas as rotas da API estão documentadas utilizando Swagger.

11. **Testes Unitários e de Integração:**

- A aplicação possui testes unitários e de integração na API para garantir a qualidade do código e funcionalidades.

## Como Rodar o Projeto com Docker-Compose

Certifique-se de ter o Docker e o Docker-Compose instalados em seu sistema.

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/aldofrota/tallos-users.git
   cd tallos-users
   ```

2. **Execute o Docker-Compose para iniciar os serviços:**

   ```bash
   docker-compose up -d
   ```

   Isso criará os contêineres para o MongoDB, API NestJS e a aplicação Vue.js, iniciando os serviços em segundo plano.

3. **Acesse a aplicação Vue.js:**

   [http://localhost:8080](http://localhost:8080)

4. **Acesse a API NestJS:**

   [http://localhost:3000](http://localhost:3000)

5. **Acesse a documentação da API NestJS:**

   [http://localhost:3000/doc](http://localhost:3000/doc)

6. **O MongoDB estará disponível na porta 27017.**

7. **Para parar os serviços, execute:**

   ```bash
   docker-compose down
   ```

8. **Usuário Admin:**
   - Para acessar o sistema como administrador, faça login com as seguintes credenciais:
     - **E-mail:** admin@admin
     - **Senha:** admin1234

## Como Rodar o Projeto Apenas com Docker

Se você deseja rodar os serviços individualmente com Docker sem usar o Docker-Compose, siga os passos abaixo.

### Banco de Dados (MongoDB)

1. **Certifique-se de ter o Docker instalado em seu sistema.**

2. **Inicie o contêiner do MongoDB:**

   ```bash
   docker run -d -p 27017:27017 --name mongodb --network host mongo
   ```

3. **O MongoDB estará disponível na porta 27017.**

4. **Para parar e remover o contêiner do MongoDB, execute:**

   ```bash
   docker stop mongodb
   docker rm mongodb
   ```

### Backend (API NestJS)

Certifique-se de ter o Docker instalado em seu sistema.

1. **Build da imagem e inicie o contêiner:**

   ```bash
   docker build -t tallos-users-api api/.
   docker run -d -p 3000:3000 --name api --network host tallos-users-api
   ```

2. **Acesse a API NestJS em:**

   [http://localhost:3000](http://localhost:3000)

3. **Acesse a documentação da API NestJS em:**

   [http://localhost:3000/doc](http://localhost:3000/doc)

### Frontend (Aplicação Vue.js)

1. **Certifique-se de ter o Docker instalado em seu sistema.**

2. **Build da imagem e inicie o contêiner:**

   ```bash
   docker build -t tallos-users-app app/.
   docker run -d -p 8080:8080 --name app --network host tallos-users-app
   ```

3. **Acesse a aplicação Vue.js no seu navegador:**

   [http://localhost:8080](http://localhost:8080)
