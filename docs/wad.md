# Documento de Arquitetura Web (WAD)

## Sistema de Reserva de Salas - Inteli

## Introdução

O Sistema de Reserva de Salas do Inteli é uma aplicação web desenvolvida para atender às necessidades específicas da comunidade acadêmica do Instituto de Tecnologia e Liderança. O sistema permite o agendamento e gerenciamento das salas de reunião (R01 até R10), otimizando a utilização desses espaços compartilhados para atividades acadêmicas, reuniões, mentorias e trabalhos em grupo.

### Objetivos do Sistema

- Facilitar o processo de reserva das salas de reunião do campus (R01 até R10)
- Fornecer uma visão clara da disponibilidade de salas em tempo real
- Permitir o acompanhamento do histórico de reservas por usuário e sala
- Notificar usuários sobre confirmações ou cancelamentos de reservas
- Gerar relatórios de utilização para fins administrativos e planejamento

### Escopo

O sistema gerencia o processo completo de reserva de salas, desde a consulta de disponibilidade, agendamento, confirmação até o cancelamento ou modificação das reservas. Ele é projetado especificamente para atender à comunidade do Inteli, utilizando autenticação com emails institucionais.

### Público-alvo

- Estudantes do Inteli que necessitam de espaços para reuniões e trabalhos em grupo
- Professores que precisam agendar mentorias e atendimentos
- Administradores responsáveis pelo gerenciamento dos espaços

## Diagrama do Banco de Dados

![Diagrama do Banco de Dados](../assets/banco-salas.svg)

### Entidades Principais

1. **Users (Usuários)**

   - Armazena dados dos estudantes, professores e administradores
   - Inclui informações de autenticação e perfil

2. **Rooms (Salas)**

   - Representa as salas de reunião disponíveis (R01 até R10)
   - Armazena informações sobre capacidade e localização

3. **Room_Features (Recursos das Salas)**

   - Registra equipamentos e recursos disponíveis em cada sala
   - Inclui projetores, quadros, sistemas de videoconferência, etc.

4. **Reservation_Types (Tipos de Reserva)**

   - Categoriza os diferentes propósitos de reserva (reunião, mentoria, estudo em grupo, etc.)
   - Define níveis de prioridade para resolução de conflitos

5. **Reservations (Reservas)**

   - Registra cada reserva realizada no sistema
   - Armazena informações de data, horário de início e fim, título e descrição

6. **Reservation_Participants (Participantes)**

   - Registra os participantes de cada reserva além do organizador
   - Permite confirmação de participação pelos convidados

7. **Notifications (Notificações)**
   - Sistema de comunicação com os usuários
   - Envia alertas sobre confirmações, lembretes ou cancelamentos

### Relacionamentos

- Uma sala pode ter múltiplos recursos associados (1:N)
- Um usuário pode criar múltiplas reservas (1:N)
- Uma sala pode ter múltiplas reservas em diferentes horários (1:N)
- Uma reserva pode ter múltiplos participantes (1:N)
- Uma reserva está associada a um tipo específico (N:1)
- Um usuário pode receber múltiplas notificações (1:N)
- Uma reserva pode gerar múltiplas notificações (1:N)

### Restrições Importantes

- Apenas usuários com email institucional (@inteli.edu.br ou @sou.inteli.edu.br) podem acessar o sistema
- Reservas só podem ser feitas para horários futuros
- Cada sala tem uma capacidade máxima que deve ser respeitada
- Reservas de maior prioridade podem sobrepor reservas de menor prioridade mediante aprovação administrativa
- Cancelamentos com menos de 24 horas de antecedência são registrados para fins de auditoria