// ./config/database.js
require("dotenv").config();

const { Pool } = require("pg");
const isSSL = process.env.DB_SSL === "true";

// Criando a pool de conexões
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

// Log connection events to help with debugging
pool.on("connect", () => {
  console.log("Database connection established");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  // Don't exit the process, just log the error
});

// Testa a conexão ao iniciar a aplicação
pool
  .query("SELECT NOW()")
  .then(() => console.log("Database connection test successful"))
  .catch((err) =>
    console.error("Database connection test failed:", err.message)
  );

module.exports = pool;
