// routes/index.js
const express = require("express");
const router = express.Router();

// Import routes
try {
  const reservasRoutes = require("./reservas");

  // Register routes
  router.use("/reservas", reservasRoutes);
  console.log("Reservas routes registered successfully");
} catch (error) {
  console.error("Error loading reservas routes:", error.message);
}

// Rota para a página de visualização de salas
router.get("/salas-view", async (req, res) => {
  try {
    // Buscar todas as salas do banco de dados
    const result = await pool.query("SELECT * FROM salas");
    const salas = result.rows;

    res.render("salas", { salas });
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    res.render("salas", { salas: [], erro: "Erro ao carregar as salas." });
  }
});

// Rota de API para salas
router.get("/api/salas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salas");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro na API de salas:", error);
    res.status(500).json({ error: "Erro ao buscar salas" });
  }
});

module.exports = router;
