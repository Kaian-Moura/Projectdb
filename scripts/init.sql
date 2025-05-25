-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_number VARCHAR(20) UNIQUE,
    role VARCHAR(10) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_domain_check CHECK (email LIKE '%@inteli.edu.br' OR email LIKE '%@sou.inteli.edu.br'),
    CONSTRAINT valid_role CHECK (role IN ('student', 'admin'))
);

-- Tabela de tarefas (necessária para o CRUD de tarefas)
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    user_id INT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    priority VARCHAR(20) DEFAULT 'media',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT valid_status CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
    CONSTRAINT valid_priority CHECK (priority IN ('baixa', 'media', 'alta', 'urgente'))
);

-- Adicionar índice para melhorar performance de consultas por usuário
CREATE INDEX idx_tarefas_user ON tarefas(user_id);

-- Tabela de tipos de salas
CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de salas
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_type_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Tabela de faixas de horário disponíveis para reserva
CREATE TABLE reservation_slots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_time_range UNIQUE (start_time, end_time),
    CONSTRAINT valid_slot_range CHECK (end_time > start_time)
);

-- Tabela de reservas de salas
CREATE TABLE room_reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    slot_id INT NOT NULL,
    purpose VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (slot_id) REFERENCES reservation_slots(id),
    CONSTRAINT unique_reservation_per_slot UNIQUE (room_id, reservation_date, slot_id)
);

-- Tabela de notificações
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    reservation_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reservation_id) REFERENCES room_reservations(id)
);

-- Drop tables if they exist
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS salas;

-- Create the salas (rooms) table
CREATE TABLE IF NOT EXISTS salas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  capacidade INT NOT NULL,
  localizacao VARCHAR(100) NOT NULL,
  recursos TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the reservas (reservations) table
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

-- Inserindo dados iniciais para os horários de reserva
INSERT INTO reservation_slots (name, start_time, end_time) VALUES 
    ('Manhã - 1º horário', '08:00:00', '10:00:00'),
    ('Manhã - 2º horário', '10:15:00', '12:15:00'),
    ('Tarde - 1º horário', '13:30:00', '15:30:00'),
    ('Tarde - 2º horário', '15:45:00', '17:45:00');

-- Inserindo dados iniciais para tipos de salas
INSERT INTO room_types (name, description) VALUES 
    ('Sala de Aula', 'Espaço para aulas regulares'),
    ('Laboratório', 'Espaço para atividades práticas'),
    ('Auditório', 'Espaço para palestras e eventos');

-- Inserindo administrador padrão
INSERT INTO users (name, email, password, role) VALUES 
    ('Administrador', 'admin@inteli.edu.br', '$2y$10$example_hashed_password', 'admin');

-- Índices úteis
CREATE INDEX idx_reservations_user ON room_reservations(user_id);
CREATE INDEX idx_reservations_room ON room_reservations(room_id);
CREATE INDEX idx_reservations_date ON room_reservations(reservation_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Insert sample rooms
INSERT INTO salas (nome, capacidade, localizacao, recursos) VALUES
('Sala de Reunião 1', 8, 'Bloco A, 1º Andar', 'Projetor, Quadro, Videoconferência'),
('Sala de Conferência', 20, 'Bloco B, 2º Andar', 'Projetor, Sistema de som, Videoconferência'),
('Sala de Estudo', 4, 'Biblioteca', 'Quadro branco'),
('Auditório', 50, 'Prédio Principal', 'Palco, Sistema de som, Projetor, Microfones');

-- Insert some sample reservations
INSERT INTO reservas (sala_id, usuario_nome, data_inicio, data_fim, proposito) VALUES
(1, 'João Silva', NOW() + interval '1 day', NOW() + interval '1 day 1 hour', 'Reunião de equipe'),
(2, 'Maria Souza', NOW() + interval '2 days', NOW() + interval '2 days 2 hours', 'Apresentação de projeto'),
(3, 'Carlos Santos', NOW() + interval '3 days', NOW() + interval '3 days 2 hours', 'Sessão de estudo');
