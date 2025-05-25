// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const path = require("path"); // Adicionando a importação do path

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas definidas
app.use("/api", routes);

// Configurando o EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rota para a raiz - sem dependência do banco de dados
app.get("/", (req, res) => {
  res.render("home", {
    titulo: "Sistema de Reserva de Salas - Inteli",
    mensagem: "Bem-vindo ao Sistema de Reserva de Salas!",
  });
});

// Exemplo de rota usando EJS
app.get("/tarefas-view", async (req, res) => {
  let pool;
  try {
    pool = require("./config/database");
    const result = await pool.query("SELECT * FROM tarefas");
    res.render("tarefas", { tarefas: result.rows });
  } catch (err) {
    console.error("Erro na rota /tarefas-view:", err);
    // Enhanced error reporting
    res.render("tarefas", {
      tarefas: [],
      erro: `Erro ao carregar tarefas: ${err.message}. Detalhes: ${
        err.stack ? err.stack.split("\n")[0] : "N/A"
      }`,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
