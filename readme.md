# Sistema de Reserva de Salas - Inteli

## Descrição do Sistema

O Sistema de Reserva de Salas é uma aplicação web desenvolvida para simular como seria a reserva e utilização das salas de reunião do Inteli (R01 até R10)(Porém, não usamos esse nome). O sistema permite que estudantes e funcionários possam agendar as salas disponíveis para reuniões, trabalhos em grupo, mentorias e outras atividades acadêmicas, garantindo organização e otimização dos espaços compartilhados.

### Características principais:

- **Reserva de Salas**: Agendamento de salas de reunião (R01 até R10) com datas e horários específicos
- **Gerenciamento de Usuários**: Cadastro e controle de estudantes, professores e administradores
- **Controle de Disponibilidade**: Visualização em tempo real das salas disponíveis
- **Agendamentos Recorrentes**: Possibilidade de agendar reservas periódicas (semanais, mensais)
- **Notificações**: Sistema de alerta para confirmação e lembretes de reservas
- **Relatórios**: Geração de relatórios de utilização por sala, usuário ou período

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL (para o banco de dados)

### Instalação e Configuração

1. Clone o repositório:

```bash
git clone git@github.com:Kaian-Moura/Projectdb.git
cd inteli-assignments/Projectdb
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com seus dados de conexão ao banco
```

Exemplo de configuração do `.env`:

```
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=
DB_SSL=
PORT=
NODE_ENV=development
```

4. Inicialize o banco de dados:

```bash
psql -U seu_usuario -d nome_do_banco -f scripts/init.sql
```

5. Execute o servidor:

```bash
npm start
```

O servidor estará disponível em http://localhost:3000

## Testes

Para executar os testes:

```bash
npm test
```

Para testar os endpoints da API, utilize o arquivo `rest.http` com a extensão REST Client do VS Code.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Arquitetura**: MVC (Model-View-Controller)
- **Testes**: Jest
- **Documentação**: Markdown, OpenAPI (em desenvolvimento)

## API Endpoints

A API oferece endpoints para gerenciamento completo do sistema. Principais recursos:

- **Usuários**: `/usuarios` - Gerenciamento de estudantes e administradores
- **Salas**: `/salas` - Gerenciamento de salas de estudo e cabines
- **Tipos de Sala**: `/tipos-sala` - Categorização dos espaços
- **Reservas**: `/reservas` - Agendamento e controle de reservas

Para a documentação completa dos endpoints, consulte o arquivo [`docs/wad.md`](./docs/wad.md).

## Documentação

- **Documentação Técnica Completa**
  - Arquitetura Web (WAD): [`docs/wad.md`](./docs/wad.md)
  - Documentação HTML: `public/documentacao-reservas.html` (versão navegável)
- **Modelo de Dados**
  - Diagrama: `assets/banco-salas.pdf` e `assets/banco-salas.svg`

## Estrutura de Pastas e Arquivos

```
./
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── assets/                # Arquivos estáticos
│   └── banco-salas.pdf    # Diagrama do banco de dados
├── config/                # Arquivos de configuração
│   └── database.js        # Conexão com o banco de dados
├── controllers/           # Lógica de controle das requisições
│   └── HomeController.js  # Controlador da página inicial
├── docs/                  # Documentação do projeto
│   └── wad.md             # Web Application Document
├── jest.config.js         # Configuração de testes
├── models/                # Definição dos modelos de dados
│   └── User.js            # Modelo de usuário
├── package-lock.json      # Versões exatas das dependências
├── package.json           # Dependências do projeto
├── readme.md              # Documentação do projeto (este arquivo)
├── rest.http              # Testes de API
├── routes/                # Definição das rotas do sistema
│   └── index.js           # Rotas principais
├── scripts/               # Scripts
│   └── ini.sql            # Configuração sql
│   └── runSQLScript.sql   # Configuração sql
├── server.js              # Arquivo principal que inicializa o servidor
├── services/              # Serviços auxiliares
│   └── userService.js     # Serviço para gerenciamento de salas
├── public/                # Arquivos estáticos (HTML, CSS, JS)
```

## Modelo de Dados

O sistema utiliza um banco de dados relacional com as seguintes entidades principais:

- **Users**: Armazena informações dos usuários (estudantes, professores e administradores)
- **Rooms**: Armazena informações sobre as salas de reunião (R01 até R10)
- **Reservations**: Registra cada reserva realizada pelos usuários
- **RoomFeatures**: Características específicas de cada sala (capacidade, recursos disponíveis)
- **ReservationTypes**: Categoriza os tipos de reserva (reunião, mentoria, grupo de estudo, etc.)
- **Notifications**: Sistema de notificação para alertar usuários sobre suas reservas
- **Tarefas**: (CRUD de tarefas para exemplo de uso da API)

O diagrama do banco de dados está disponível em <a href="./assets/banco-salas.pdf">`assets/banco-salas.pdf`</a>.<br>

<img src="./assets/banco-salas.svg">

## Arquitetura MVC

O projeto segue a arquitetura **MVC (Model-View-Controller)**, que separa a aplicação em três camadas principais:

- **Model:** Responsável pela estrutura dos dados e interação direta com o banco de dados PostgreSQL (sem ORM, usando SQL puro).
- **Controller:** Gerencia a lógica de negócios, recebendo requisições HTTP, validando dados e manipulando o banco de dados.
- **View:** Representada pelo frontend (ou cliente REST) que consome a API, exibindo e interagindo com os dados.

### Diagrama de Arquitetura MVC

```plaintext
+---------+         +-------------+         +---------+
|  View   | <-----> | Controller  | <-----> |  Model  |
| (Front) |         | (Rotas/API) |         | (SQL/DB)|
+---------+         +-------------+         +---------+
```

- **View:** Interface do usuário (pode ser um frontend web ou ferramentas como Postman).
- **Controller:** Funções como `criarTarefa`, `listarTarefas`, etc.
- **Model:** Tabelas SQL como `tarefas`, `users`, etc.

## Como Configurar o Banco de Dados

1. **Crie o banco de dados PostgreSQL** (ex: `kaian`).
2. **Configure as variáveis de ambiente** no arquivo `.env`:
   ```
   DB_HOST=...
   DB_PORT=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=kaian
   ```
3. **Rode as migrações**:
   Execute o script SQL para criar as tabelas e dados iniciais:
   ```bash
   psql -U seu_usuario -d kaian -f scripts/init.sql
   ```

## Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL (para o banco de dados)

### Passos para Execução

1. Clone o repositório:

```bash
git clone git@github.com:Kaian-Moura/Projectdb.git
cd inteli-assignments/Projectdb
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente: **(ainda não necessário).**

```bash
cp .env.example .env
# Edite o arquivo .env com seus dados de conexão ao banco
```

4. Crie o banco de dados: (**ainda não necessário).**

```bash
# Execute o SQL disponível na documentação para criar o schema
psql -U seu_usuario -d nome_do_banco -f schema.sql
```

5. Execute o servidor:

```bash
npm start
```

6. Acesse o sistema no navegador:

```
http://localhost:3000 ou http://127.0.0.1:3000/
```

## Funcionalidades Principais

- Visualização de disponibilidade das salas
- Reserva de salas por períodos específicos
- Cancelamento e alteração de reservas
- Visualização de histórico de reservas pessoais
- Notificações de confirmação e lembretes

## Documentação Adicional

A documentação completa da arquitetura web está disponível em <a href="./docs/wad.md">`docs/wad.md`</a>.

## Como Testar as APIs

Você pode testar os endpoints usando ferramentas como Postman, Insomnia ou o arquivo `rest.http` incluso no projeto.

Exemplo de endpoints:

- **Criar tarefa:** `POST /api/tarefas`
- **Listar tarefas:** `GET /api/tarefas`
- **Editar tarefa:** `PUT /api/tarefas/:id`
- **Excluir tarefa:** `DELETE /api/tarefas/:id`

Veja exemplos de requisições no arquivo `rest.http` ou utilize o Postman para enviar requisições HTTP.

## Requisitos Mínimos Atendidos

- [x] Criação do banco de dados PostgreSQL e conexão
- [x] Migração funcional (`scripts/init.sql`)
- [x] Implementação de Models (SQL e arquivos em `models/`)
- [x] Implementação de Controllers (`controllers/`)
- [x] Rotas funcionando (`routes/`)
- [x] Arquitetura MVC completa (Models, Views [API], Controllers)
- [x] Documentação completa (este README e docs/wad.md)
