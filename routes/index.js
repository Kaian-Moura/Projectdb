const express = require("express");
const router = express.Router();
const db = require("../config/database.js");

// Rota básica para teste
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.send(`Bem-vindo, faça sua reserva de sala
    <br>Hora no servidor: ${result.rows[0].now}`);
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).send("Erro interno do servidor");
  }
});

// Exportando o router como um middleware Express
module.exports = router;
