const pool = require("../config/database");

const User = {
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },
  async create({ name, email, password, registration_number, role }) {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, registration_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, password, registration_number, role]
    );
    return result.rows[0];
  },
  // ...outros métodos podem ser adicionados conforme necessário...
};

module.exports = User;
