const Joi = require("joi");

const reservaSchema = Joi.object({
  id: Joi.number().optional(),
  sala_id: Joi.number().required().messages({
    "any.required": "O ID da sala é obrigatório",
    "number.base": "O ID da sala deve ser um número",
  }),
  usuario_nome: Joi.string().min(3).max(100).required().messages({
    "any.required": "O nome do usuário é obrigatório",
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.max": "O nome deve ter no máximo 100 caracteres",
  }),
  data_inicio: Joi.date().iso().required().messages({
    "any.required": "A data de início é obrigatória",
    "date.base": "Data de início inválida",
    "date.format": "Data de início deve estar no formato ISO",
  }),
  data_fim: Joi.date()
    .iso()
    .greater(Joi.ref("data_inicio"))
    .required()
    .messages({
      "any.required": "A data de término é obrigatória",
      "date.base": "Data de término inválida",
      "date.greater": "A data de término deve ser posterior à data de início",
    }),
  proposito: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid("confirmada", "cancelada", "pendente")
    .default("confirmada"),
});

/**
 * Schema de validação para atualização de reserva
 */
const reservaUpdateSchema = Joi.object({
  id: Joi.number().optional(),
  sala_id: Joi.number().optional(),
  usuario_nome: Joi.string().min(3).max(100).optional(),
  data_inicio: Joi.date().iso().optional(),
  data_fim: Joi.date().iso().optional(),
  proposito: Joi.string().allow("").optional(),
  status: Joi.string().valid("confirmada", "cancelada", "pendente").optional(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

/**
 * Valida dados de reserva para criação
 * @param {Object} data - Dados da reserva
 * @returns {Object} Resultado da validação
 */
function validateReserva(data) {
  return reservaSchema.validate(data, { abortEarly: false });
}

/**
 * Valida dados de reserva para atualização
 * @param {Object} data - Dados da reserva para atualização
 * @returns {Object} Resultado da validação
 */
function validateReservaUpdate(data) {
  return reservaUpdateSchema.validate(data, { abortEarly: false });
}

module.exports = { validateReserva, validateReservaUpdate };
