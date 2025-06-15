const Joi = require("joi");

// Schema de validação para reservas
const reservaSchema = Joi.object({
  sala_id: Joi.number().integer().positive().required().messages({
    "number.base": "ID da sala deve ser um número",
    "number.integer": "ID da sala deve ser um número inteiro",
    "number.positive": "ID da sala deve ser positivo",
    "any.required": "ID da sala é obrigatório",
  }),

  usuario_nome: Joi.string().min(3).max(100).required().messages({
    "string.base": "Nome do usuário deve ser texto",
    "string.min": "Nome do usuário deve ter no mínimo {#limit} caracteres",
    "string.max": "Nome do usuário deve ter no máximo {#limit} caracteres",
    "any.required": "Nome do usuário é obrigatório",
  }),

  data_inicio: Joi.date().iso().greater("now").required().messages({
    "date.base": "Data de início deve ser uma data válida",
    "date.format": "Data de início deve estar em formato ISO",
    "date.greater": "Data de início deve ser no futuro",
    "any.required": "Data de início é obrigatória",
  }),

  data_fim: Joi.date().iso().min(Joi.ref("data_inicio")).required().messages({
    "date.base": "Data de término deve ser uma data válida",
    "date.format": "Data de término deve estar em formato ISO",
    "date.min": "Data de término deve ser após a data de início",
    "any.required": "Data de término é obrigatória",
  }),

  proposito: Joi.string().min(5).max(500).messages({
    "string.base": "Propósito deve ser texto",
    "string.min": "Propósito deve ter no mínimo {#limit} caracteres",
    "string.max": "Propósito deve ter no máximo {#limit} caracteres",
  }),

  status: Joi.string()
    .valid("confirmada", "cancelada", "pendente")
    .default("confirmada")
    .messages({
      "any.only": "Status deve ser confirmada, cancelada ou pendente",
    }),
});

// Funções de validação
const validateReserva = (reservaData) => {
  return reservaSchema.validate(reservaData, { abortEarly: false });
};

// Validação parcial para atualizações
const validateReservaUpdate = (reservaData) => {
  const updateSchema = Joi.object({
    sala_id: reservaSchema.extract("sala_id").optional(),
    usuario_nome: reservaSchema.extract("usuario_nome").optional(),
    data_inicio: reservaSchema.extract("data_inicio").optional(),
    data_fim: reservaSchema.extract("data_fim").optional(),
    proposito: reservaSchema.extract("proposito").optional(),
    status: reservaSchema.extract("status").optional(),
  });

  return updateSchema.validate(reservaData, { abortEarly: false });
};

module.exports = {
  validateReserva,
  validateReservaUpdate,
};
