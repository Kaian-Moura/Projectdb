const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all reservations
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
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get reservations by user name
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

// Create a new reservation
router.post("/", async (req, res) => {
  try {
    console.log("Creating new reservation:", req.body);
    const { sala_id, usuario_nome, data_inicio, data_fim, proposito } =
      req.body;

    // Validate required fields
    if (!sala_id || !usuario_nome || !data_inicio || !data_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const result = await pool.query(
      "INSERT INTO reservas (sala_id, usuario_nome, data_inicio, data_fim, proposito) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [sala_id, usuario_nome, data_inicio, data_fim, proposito]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating reservation:", req.params.id, req.body);
    const { id } = req.params;
    const { sala_id, usuario_nome, data_inicio, data_fim, proposito, status } =
      req.body;

    // Validate required fields
    if (!sala_id || !usuario_nome || !data_inicio || !data_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const result = await pool.query(
      "UPDATE reservas SET sala_id = $1, usuario_nome = $2, data_inicio = $3, data_fim = $4, proposito = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
      [
        sala_id,
        usuario_nome,
        data_inicio,
        data_fim,
        proposito,
        status || "confirmada",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a reservation
router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting reservation:", req.params.id);
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reservas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json({ message: "Reserva excluída com sucesso" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all rooms
router.get("/salas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salas ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
