// ./config/database.js
require("dotenv").config();

const { Pool } = require("pg");
const isSSL = process.env.DB_SSL === "true";

// Criando a pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

// Testa a conexão ao iniciar a aplicação
pool
  .connect()
  .then((client) => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    client.release();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  });

module.exports = pool;
