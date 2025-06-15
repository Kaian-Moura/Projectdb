const Joi = require("joi");

/**
 * Validation schema for room
 */
const salaSchema = Joi.object({
  id: Joi.number().optional(),
  nome: Joi.string().min(3).max(100).required().messages({
    "any.required": "O nome da sala é obrigatório",
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.max": "O nome deve ter no máximo 100 caracteres",
  }),
  capacidade: Joi.number().integer().min(1).required().messages({
    "any.required": "A capacidade é obrigatória",
    "number.base": "A capacidade deve ser um número",
    "number.integer": "A capacidade deve ser um número inteiro",
    "number.min": "A capacidade deve ser pelo menos 1",
  }),
  localizacao: Joi.string().min(3).max(100).required().messages({
    "any.required": "A localização é obrigatória",
    "string.min": "A localização deve ter pelo menos 3 caracteres",
    "string.max": "A localização deve ter no máximo 100 caracteres",
  }),
  recursos: Joi.string().allow("").optional(),
});

/**
 * Validation schema for updating room
 */
const salaUpdateSchema = Joi.object({
  nome: Joi.string().min(3).max(100).optional(),
  capacidade: Joi.number().integer().min(1).optional(),
  localizacao: Joi.string().min(3).max(100).optional(),
  recursos: Joi.string().allow("").optional(),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

/**
 * Validates room data for creation
 * @param {Object} data - Room data
 * @returns {Object} Validation result
 */
function validateSala(data) {
  return salaSchema.validate(data, { abortEarly: false });
}

/**
 * Validates room data for update
 * @param {Object} data - Room data for update
 * @returns {Object} Validation result
 */
function validateSalaUpdate(data) {
  return salaUpdateSchema.validate(data, { abortEarly: false });
}

module.exports = { validateSala, validateSalaUpdate };
