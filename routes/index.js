// routes/index.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Importar rotas
try {
  const reservasRoutes = require("./reservas");

  // Registrar rotas
  router.use("/reservas", reservasRoutes);
  console.log("Rotas de reservas registradas com sucesso");
} catch (error) {
  console.error("Erro ao carregar rotas de reservas:", error.message);
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
