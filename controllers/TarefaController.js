const pool = require("../config/database");

exports.criarTarefa = async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome da tarefa é obrigatório" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tarefas (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao || ""]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`Erro ao criar tarefa: ${err.message}`);
    return res
      .status(500)
      .json({ error: "Falha ao criar tarefa", detalhes: err.message });
  }
};

exports.listarTarefas = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tarefas ORDER BY created_at DESC"
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(`Erro ao listar tarefas: ${err.message}`);
    return res
      .status(500)
      .json({ error: "Falha ao buscar tarefas", detalhes: err.message });
  }
};

exports.editarTarefa = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome da tarefa é obrigatório" });
  }

  try {
    const result = await pool.query(
      `UPDATE tarefas 
       SET nome = $1, 
           descricao = $2, 
           status = $3, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [nome, descricao || "", status || "pendente", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Erro ao atualizar tarefa ${id}: ${err.message}`);
    return res
      .status(500)
      .json({ error: "Falha ao atualizar tarefa", detalhes: err.message });
  }
};

exports.excluirTarefa = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID de tarefa inválido" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    return res.status(200).json({ message: "Tarefa excluída com sucesso", id });
  } catch (err) {
    console.error(`Erro ao excluir tarefa ${id}: ${err.message}`);
    return res
      .status(500)
      .json({ error: "Falha ao excluir tarefa", detalhes: err.message });
  }
};
