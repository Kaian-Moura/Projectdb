const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Rotas
const routes = require('./routes/index');
app.use('/', routes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});