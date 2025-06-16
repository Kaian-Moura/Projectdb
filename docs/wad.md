# Documento de Arquitetura Web (WAD)

## Sistema de Reserva de Salas - Inteli

## Índice

1. [Introdução](#introdução)
   - [Objetivos do Sistema](#objetivos-do-sistema)
   - [Escopo](#escopo)
   - [Público-alvo](#público-alvo)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
   - [Estrutura do Projeto](#estrutura-do-projeto)
   - [Padrão MVC](#padrão-mvc)
   - [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Banco de Dados](#banco-de-dados)
   - [Configuração PostgreSQL](#configuração-postgresql)
   - [Modelo de Dados](#modelo-de-dados)
   - [Estrutura das Tabelas](#estrutura-das-tabelas)
4. [API REST](#api-rest)
   - [Endpoints Disponíveis](#endpoints-disponíveis)
   - [Modelos de Dados](#modelos-de-dados)
   - [Regras de Negócio](#regras-de-negócio)
5. [Aspectos Técnicos](#aspectos-técnicos)
   - [Segurança](#segurança)
   - [Performance](#performance)
   - [Testes](#testes)
   - [Monitoramento](#monitoramento)
6. [Implantação e Manutenção](#implantação-e-manutenção)
   - [Deployment](#deployment)
   - [Manutenção](#manutenção)
7. [Próximos Passos](#próximos-passos)
8. [Reflexões sobre o Desenvolvimento](#reflexões-sobre-o-desenvolvimento)
   - [Decisões Técnicas](#decisões-técnicas)
   - [Aprendizados e Desafios](#aprendizados-e-desafios)
   - [Pontos Fortes e Melhorias Futuras](#pontos-fortes-e-melhorias-futuras)

## Introdução

O Sistema de Reserva de Salas do Inteli é uma aplicação web para simular o agendamento e gerenciamento de salas de reunião e estudo no campus. O sistema foi desenvolvido para facilitar o uso compartilhado dos espaços, permitindo que estudantes e funcionários reservem salas de forma simples e transparente.

### Objetivos do Sistema

- Permitir reservas de salas de estudo e reunião por estudantes e funcionários
- Visualizar disponibilidade em tempo real
- Gerenciar usuários, salas e reservas via API RESTful
- Possibilitar cancelamento e alteração de reservas
- Notificar usuários sobre confirmações e lembretes de reservas

### Escopo

O sistema cobre:
- Cadastro e autenticação de usuários (com email institucional)
- Cadastro e consulta de salas e tipos de sala
- CRUD de reservas de salas
- Visualização de histórico e status das reservas

### Público-alvo

- Estudantes e funcionários do Inteli
- Administradores do campus

## Arquitetura do Sistema

### Estrutura do Projeto

```
./
├── config/                # Configuração do banco de dados
├── controllers/           # Lógica de controle das requisições
├── docs/                  # Documentação do projeto
├── models/                # Modelos de dados (JS)
├── public/                # Arquivos estáticos (HTML, CSS, JS)
├── routes/                # Definição das rotas da API
├── scripts/               # Scripts SQL de inicialização
├── services/              # Serviços auxiliares
├── views/                 # Templates EJS
├── server.js              # Inicialização do servidor Express
├── package.json           # Dependências do projeto
└── readme.md              # Documentação principal
```

### Padrão MVC

O projeto segue o padrão Model-View-Controller:
- **Model:** Define a estrutura dos dados e interage com o PostgreSQL via SQL puro (sem ORM).
- **View:** Templates EJS para renderização de páginas HTML e respostas JSON para a API.
- **Controller:** Lógica de negócio, validação e manipulação dos dados, recebendo requisições HTTP.

### Tecnologias Utilizadas

- **Node.js** e **Express** para backend e API
- **PostgreSQL** para banco de dados relacional
- **EJS** para views dinâmicas
- **Jest** para testes automatizados
- **dotenv** para variáveis de ambiente

## Banco de Dados

### Configuração PostgreSQL

O banco de dados é configurado via variáveis de ambiente no arquivo `.env`:

```
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=
DB_SSL=
```

A estrutura do banco pode ser criada rodando o script `scripts/init.sql`.

### Modelo de Dados

Principais entidades:
- **users**: id, name, email, password, registration_number, role, created_at, updated_at
- **salas**: id, nome, capacidade, localizacao, recursos, created_at, updated_at
- **reservas**: id, sala_id, usuario_nome, data_inicio, data_fim, proposito, status, created_at, updated_at
- **room_types**, **room_reservations**, **notifications**, **tarefas** (para exemplos de CRUD)

Veja o diagrama em `assets/banco-salas.pdf` ou `assets/banco-salas.svg`.

### Estrutura das Tabelas

As tabelas são criadas conforme o script `scripts/init.sql`. Exemplo de tabela de reservas:

```sql
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  sala_id INT NOT NULL,
  usuario_nome VARCHAR(100) NOT NULL,
  data_inicio TIMESTAMP NOT NULL,
  data_fim TIMESTAMP NOT NULL,
  proposito TEXT,
  status VARCHAR(20) DEFAULT 'confirmada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE
);
```

## API REST

### Endpoints Disponíveis

Os principais endpoints implementados neste projeto são:

#### Reservas

- `GET /api/reservas` — Lista todas as reservas cadastradas no sistema.
  ```json
  [
    {
      "id": 1,
      "sala_nome": "Auditório",
      "usuario_nome": "Kaian",
      "data_inicio": "2025-05-24T14:00:00",
      "data_fim": "2025-05-24T13:00:00",
      "proposito": "Estudar",
      "status": "confirmada"
    },
    {
      "id": 2,
      "sala_nome": "Sala de Reunião 1",
      "usuario_nome": "João Silva",
      "data_inicio": "2025-05-26T16:51:21",
      "data_fim": "2025-05-26T17:51:21",
      "proposito": "Reunião de equipe",
      "status": "confirmada"
    },
    {
      "id": 3,
      "sala_nome": "Sala de Conferência",
      "usuario_nome": "Maria Souza",
      "data_inicio": "2025-05-27T16:51:21",
      "data_fim": "2025-05-27T18:51:21",
      "proposito": "Apresentação de projeto",
      "status": "confirmada"
    },
    {
      "id": 4,
      "sala_nome": "Sala de Estudo",
      "usuario_nome": "Carlos Santos",
      "data_inicio": "2025-05-28T16:51:21",
      "data_fim": "2025-05-28T18:51:21",
      "proposito": "Sessão de estudo",
      "status": "confirmada"
    }
  ]
  ```

- `GET /api/reservas/:id` — Busca uma reserva específica pelo ID.
  - Parâmetro: `id` (número)
  ```json
  {
    "id": 2,
    "sala_nome": "Sala de Reunião 1",
    "usuario_nome": "João Silva",
    "data_inicio": "2025-05-26T16:51:21",
    "data_fim": "2025-05-26T17:51:21",
    "proposito": "Reunião de equipe",
    "status": "confirmada"
  }
  ```

- `POST /api/reservas` — Cria uma nova reserva no sistema.
  - Exemplo de requisição:
  ```json
  {
    "sala_id": 1,
    "usuario_nome": "Kaian",
    "data_inicio": "2025-05-24T14:00:00",
    "data_fim": "2025-05-24T13:00:00",
    "proposito": "Estudar"
  }
  ```
  - Exemplo de resposta:
  ```json
  {
    "id": 1,
    "sala_nome": "Auditório",
    "usuario_nome": "Kaian",
    "data_inicio": "2025-05-24T14:00:00",
    "data_fim": "2025-05-24T13:00:00",
    "proposito": "Estudar",
    "status": "confirmada"
  }
  ```

- `PUT /api/reservas/:id` — Atualiza os dados de uma reserva existente.
  - Parâmetro: `id` (número)
  - Exemplo de requisição:
  ```json
  {
    "sala_id": 1,
    "usuario_nome": "Kaian",
    "data_inicio": "2025-05-24T15:00:00",
    "data_fim": "2025-05-24T16:00:00",
    "proposito": "Estudo em grupo"
  }
  ```
  - Exemplo de resposta:
  ```json
  {
    "id": 1,
    "sala_nome": "Auditório",
    "usuario_nome": "Kaian",
    "data_inicio": "2025-05-24T15:00:00",
    "data_fim": "2025-05-24T16:00:00",
    "proposito": "Estudo em grupo",
    "status": "confirmada"
  }
  ```

- `DELETE /api/reservas/:id` — Remove uma reserva do sistema.
  - Parâmetro: `id` (número)
  - Exemplo de resposta:
  ```json
  { "message": "Reserva removida com sucesso" }
  ```

### Modelos de Dados

Exemplo de modelo de reserva (JSON):

```json
{
  "id": 1,
  "sala_id": 2,
  "usuario_nome": "João Silva",
  "data_inicio": "2025-05-26T16:51:21",
  "data_fim": "2025-05-26T17:51:21",
  "proposito": "Reunião de equipe",
  "status": "confirmada"
}
```

### Regras de Negócio

- Reservas só podem ser feitas para horários futuros
- Não é permitido sobrepor reservas para a mesma sala e horário
- Usuários devem ter email institucional válido
- Reservas podem ser canceladas ou editadas antes do início

## Aspectos Técnicos

### Segurança

- Senhas armazenadas com hash (ex: bcrypt)
- Validação de email institucional
- Middleware para tratamento de erros
- Uso de variáveis de ambiente para dados sensíveis

### Performance

- Índices em colunas de busca frequente (ex: sala_id, usuario_nome)
- Pool de conexões com o banco de dados

### Testes

- Testes unitários e de integração com Jest
- Testes de API via arquivo `rest.http`

### Monitoramento

- Logs de erros no servidor
- Monitoramento básico de status da API (`/status`)

## Implantação e Manutenção

### Deployment

- Configuração de variáveis de ambiente
- Execução do script SQL de inicialização
- Deploy do servidor Node.js

### Manutenção

- Atualização de dependências
- Backup regular do banco de dados
- Monitoramento de logs

## Próximos Passos

- Melhorar interface web para reservas
- Adicionar notificações por email
- Otimizações de performance e segurança

## Reflexões sobre o Desenvolvimento

### Decisões Técnicas

Durante o desenvolvimento do Sistema de Reserva de Salas, diversas decisões técnicas foram tomadas para garantir um produto final robusto e funcional:

- **Framework Backend**: Node.js com Express foi escolhido pela sua flexibilidade e facilidade de implementação, permitindo construir rapidamente uma API RESTful.
- **Validação de Dados**: Utilizei Joi para validação de dados de entrada, garantindo que todos os dados recebidos pela API estejam em conformidade com as regras de negócio.
- **Banco de Dados**: PostgreSQL foi selecionado por ser um banco de dados relacional robusto, que oferece suporte completo a transações ACID e relações complexas entre tabelas, essencial para gerenciar reservas e evitar conflitos.
- **Supabase**: Implementado como uma camada adicional para facilitar operações com o banco de dados e oferecer funcionalidades de autenticação.
- **Arquitetura MVC**: A aplicação foi estruturada seguindo o padrão Model-View-Controller para separar claramente as responsabilidades e facilitar manutenções futuras.
- **Templates EJS**: Utilizados para renderização server-side das páginas, oferecendo uma experiência dinâmica sem necessidade de um framework frontend complexo.
- **Comunicação Assíncrona**: Fetch API para comunicação entre cliente e servidor sem necessidade de recarregar páginas inteiras.

### Aprendizados e Desafios

Durante o desenvolvimento, enfrentei alguns desafios importantes:

1. **Comunicação Front-end/Back-end**: Um dos principais desafios foi configurar corretamente a comunicação entre o front-end e o back-end, principalmente garantindo que as rotas de reserva e listagem estivessem funcionando em tempo real. A implementação de requisições assíncronas via Fetch API permitiu atualizar a interface sem recarregar a página inteira, melhorando a experiência do usuário.

2. **Controle de Conflitos de Horários**: Para evitar que duas pessoas reservassem a mesma sala no mesmo horário, implementei uma verificação no backend que consulta o banco de dados por sobreposições antes de confirmar uma nova reserva. Este sistema verifica se há alguma reserva existente que se sobreponha com o período solicitado para a mesma sala.

3. **Validação de Dados**: Garantir que todos os dados de entrada estivessem corretamente formatados e dentro das regras de negócio foi um desafio superado com a implementação da biblioteca Joi para validação.

4. **Design Responsivo**: Adaptar a interface para diferentes tamanhos de tela exigiu atenção especial ao CSS e à estruturação dos componentes.

5. **Tratamento de Erros**: Implementar um sistema robusto de tratamento de erros que fornecesse feedback útil tanto para os usuários quanto para fins de debugging foi um aprendizado importante.

### Pontos Fortes e Melhorias Futuras

**Pontos que funcionaram bem:**

1. **Interface Intuitiva**: O design simples e direto facilita o uso do sistema mesmo para usuários inexperientes.
2. **Sistema de Feedback**: Os modais de confirmação proporcionam feedback imediato sobre ações realizadas.
3. **Validação em Tempo Real**: A validação de formulários previne erros antes da submissão.
4. **API Bem Estruturada**: Endpoints claros e organizados facilitam a manutenção e expansão do sistema.
5. **Controle de Conflitos**: O mecanismo para evitar sobreposição de reservas funcionou conforme esperado.

**Pontos para melhoria:**

1. **Autenticação Completa**: Implementar um sistema de autenticação robusto com diferentes níveis de acesso.
2. **Performance**: Otimizar consultas ao banco de dados para grandes volumes de reservas.
3. **Notificações**: Adicionar sistema de notificações por email para lembretes de reservas.
4. **Estatísticas de Uso**: Desenvolver um dashboard para administradores visualizarem estatísticas de uso das salas.
5. **Testes Automatizados**: Aumentar a cobertura de testes automatizados para garantir estabilidade.
6. **Documentação Interativa da API**: Implementar Swagger ou similar para documentação interativa dos endpoints.

O desenvolvimento deste projeto proporcionou um grande aprendizado sobre desenvolvimento web fullstack, desde o design da interface até a implementação de lógicas complexas de negócio e interação com banco de dados.