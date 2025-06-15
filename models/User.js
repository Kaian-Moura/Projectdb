const pool = require("../config/database");
const Joi = require("joi");

// Schema de validação para usuário
const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Nome deve ser texto",
    "string.min": "Nome deve ter no mínimo {#limit} caracteres",
    "string.max": "Nome deve ter no máximo {#limit} caracteres",
    "any.required": "Nome é obrigatório",
  }),
  email: Joi.string()
    .email()
    .required()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .messages({
      "string.email": "Email inválido",
      "any.required": "Email é obrigatório",
      "string.pattern.base": "Email deve ter formato válido",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Senha deve ter no mínimo {#limit} caracteres",
    "any.required": "Senha é obrigatória",
  }),
  registration_number: Joi.string()
    .pattern(/^[0-9]{6,10}$/)
    .messages({
      "string.pattern.base":
        "Número de registro deve conter entre 6 e 10 dígitos numéricos",
    }),
  role: Joi.string()
    .valid("student", "faculty", "admin")
    .default("student")
    .messages({
      "any.only": "Função deve ser student, faculty ou admin",
    }),
});

const User = {
  validate(userData) {
    return userSchema.validate(userData, { abortEarly: false });
  },

  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  async create(userData) {
    // Validar dados antes de inserir
    const { error } = this.validate(userData);
    if (error) throw new Error(error.details.map((d) => d.message).join("; "));

    const { name, email, password, registration_number, role } = userData;
    const result = await pool.query(
      "INSERT INTO users (name, email, password, registration_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, password, registration_number, role || "student"]
    );
    return result.rows[0];
  },

  async findById(id) {
    if (!id || isNaN(parseInt(id))) throw new Error("ID inválido");

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  async update(id, userData) {
    // Validação parcial permitindo atualização de campos específicos
    const { error } = Joi.object({
      name: userSchema.extract("name").optional(),
      email: userSchema.extract("email").optional(),
      password: userSchema.extract("password").optional(),
      registration_number: userSchema.extract("registration_number").optional(),
      role: userSchema.extract("role").optional(),
    }).validate(userData, { abortEarly: false });

    if (error) throw new Error(error.details.map((d) => d.message).join("; "));

    // Construir query dinâmica baseada nos campos fornecidos
    const fields = Object.keys(userData).filter(
      (key) => userData[key] !== undefined
    );
    if (fields.length === 0)
      throw new Error("Nenhum dado fornecido para atualização");

    const setClause = fields
      .map((field, i) => `${field} = $${i + 1}`)
      .join(", ");
    const values = fields.map((field) => userData[field]);

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${fields.length + 1} 
      RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  },
};

module.exports = User;
