// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas definidas
app.use("/api", routes);

// Rota para a raiz
app.get("/", (req, res) => {
  res.send("API online");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
