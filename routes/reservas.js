const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const {
  validateReserva,
  validateReservaUpdate,
} = require("../models/ReservaValidation");

// Buscar todas as reservas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, s.nome as sala_nome 
      FROM reservas r
      JOIN salas s ON r.sala_id = s.id
      ORDER BY r.data_inicio
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar reservas por nome de usuário
router.get("/usuario/:nome", async (req, res) => {
  try {
    const { nome } = req.params;
    const result = await pool.query(
      `
      SELECT r.*, s.nome as sala_nome 
      FROM reservas r
      JOIN salas s ON r.sala_id = s.id
      WHERE r.usuario_nome ILIKE $1
      ORDER BY r.data_inicio
    `,
      [`%${nome}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar uma nova reserva
router.post("/", async (req, res) => {
  try {
    // Validar dados da reserva
    const { error, value } = validateReserva(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { sala_id, usuario_nome, data_inicio, data_fim, proposito } = value;

    // Verificar disponibilidade da sala
    const conflito = await pool.query(
      `SELECT id FROM reservas 
       WHERE sala_id = $1 
       AND status = 'confirmada'
       AND ((data_inicio <= $2 AND data_fim >= $2) OR 
            (data_inicio <= $3 AND data_fim >= $3) OR
            (data_inicio >= $2 AND data_fim <= $3))`,
      [sala_id, data_inicio, data_fim]
    );

    if (conflito.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Sala já reservada para este horário" });
    }

    const result = await pool.query(
      "INSERT INTO reservas (sala_id, usuario_nome, data_inicio, data_fim, proposito) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [sala_id, usuario_nome, data_inicio, data_fim, proposito]
    );

    // Obter o nome da sala para retornar uma resposta mais completa
    const salaInfo = await pool.query("SELECT nome FROM salas WHERE id = $1", [
      sala_id,
    ]);
    const reservaCompleta = {
      ...result.rows[0],
      sala_nome: salaInfo.rows[0]?.nome || "Sala desconhecida",
    };

    res.status(201).json(reservaCompleta);
  } catch (err) {
    console.error("Erro ao criar reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma reserva
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar dados da atualização
    const { error, value } = validateReservaUpdate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details.map((d) => d.message),
      });
    }

    const { sala_id, usuario_nome, data_inicio, data_fim, proposito, status } =
      value;

    // Verificar se a reserva existe
    const reservaExistente = await pool.query(
      "SELECT * FROM reservas WHERE id = $1",
      [id]
    );
    if (reservaExistente.rows.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Verificar disponibilidade da sala (se estiver atualizando data/sala)
    if ((data_inicio && data_fim) || sala_id) {
      const salaIdParaChecar = sala_id || reservaExistente.rows[0].sala_id;
      const dataInicioParaChecar =
        data_inicio || reservaExistente.rows[0].data_inicio;
      const dataFimParaChecar = data_fim || reservaExistente.rows[0].data_fim;

      const conflito = await pool.query(
        `SELECT id FROM reservas 
         WHERE sala_id = $1 
         AND id != $2
         AND status = 'confirmada'
         AND ((data_inicio <= $3 AND data_fim >= $3) OR 
              (data_inicio <= $4 AND data_fim >= $4) OR
              (data_inicio >= $3 AND data_fim <= $4))`,
        [salaIdParaChecar, id, dataInicioParaChecar, dataFimParaChecar]
      );

      if (conflito.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Sala já reservada para este horário" });
      }
    }

    // Construir update dinamicamente com campos presentes
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (sala_id !== undefined) {
      updateFields.push(`sala_id = $${paramIndex}`);
      updateValues.push(sala_id);
      paramIndex++;
    }

    if (usuario_nome !== undefined) {
      updateFields.push(`usuario_nome = $${paramIndex}`);
      updateValues.push(usuario_nome);
      paramIndex++;
    }

    if (data_inicio !== undefined) {
      updateFields.push(`data_inicio = $${paramIndex}`);
      updateValues.push(data_inicio);
      paramIndex++;
    }

    if (data_fim !== undefined) {
      updateFields.push(`data_fim = $${paramIndex}`);
      updateValues.push(data_fim);
      paramIndex++;
    }

    if (proposito !== undefined) {
      updateFields.push(`proposito = $${paramIndex}`);
      updateValues.push(proposito);
      paramIndex++;
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      updateValues.push(status);
      paramIndex++;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Se não há campos para atualizar
    if (updateFields.length === 1) {
      return res.status(400).json({ error: "Nenhum campo para atualizar" });
    }

    const query = `
      UPDATE reservas SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex} RETURNING *
    `;

    const result = await pool.query(query, [...updateValues, id]);

    // Obter o nome da sala para a resposta
    const salaAtualizada = result.rows[0].sala_id;
    const salaInfo = await pool.query("SELECT nome FROM salas WHERE id = $1", [
      salaAtualizada,
    ]);

    const reservaCompleta = {
      ...result.rows[0],
      sala_nome: salaInfo.rows[0]?.nome || "Sala desconhecida",
    };

    res.json(reservaCompleta);
  } catch (err) {
    console.error("Erro ao atualizar reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Excluir uma reserva
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      "DELETE FROM reservas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json({ message: "Reserva excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar todas as salas
router.get("/salas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salas ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar salas:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
