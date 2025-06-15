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
  data_inicio: Joi.date().required().messages({
    "any.required": "A data de início é obrigatória",
    "date.base": "Data de início inválida",
  }),
  data_fim: Joi.date().min(Joi.ref("data_inicio")).required().messages({
    "any.required": "A data de término é obrigatória",
    "date.base": "Data de término inválida",
    "date.min":
      "A data de término deve ser igual ou posterior à data de início",
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
  data_inicio: Joi.date().optional(),
  data_fim: Joi.date().optional(),
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
  // Criar uma cópia dos dados para não modificar o original
  const processedData = { ...data };

  // Tratar o campo id: remover se for string vazia
  if (processedData.id === "") {
    delete processedData.id;
  }
  // Garantir que id seja um número se presente
  else if (processedData.id && typeof processedData.id === "string") {
    processedData.id = parseInt(processedData.id, 10);
  }

  // Garantir que sala_id seja um número
  if (processedData.sala_id && typeof processedData.sala_id === "string") {
    processedData.sala_id = parseInt(processedData.sala_id, 10);
  }

  return reservaSchema.validate(processedData, { abortEarly: false });
}

/**
 * Valida dados de reserva para atualização
 * @param {Object} data - Dados da reserva para atualização
 * @returns {Object} Resultado da validação
 */
function validateReservaUpdate(data) {
  // Criar uma cópia dos dados para não modificar o original
  const processedData = { ...data };

  // Tratar o campo id: remover se for string vazia
  if (processedData.id === "") {
    delete processedData.id;
  }
  // Garantir que id seja um número se presente
  else if (processedData.id && typeof processedData.id === "string") {
    processedData.id = parseInt(processedData.id, 10);
  }

  // Garantir que sala_id seja um número se presente
  if (processedData.sala_id && typeof processedData.sala_id === "string") {
    processedData.sala_id = parseInt(processedData.sala_id, 10);
  }

  return reservaUpdateSchema.validate(processedData, { abortEarly: false });
}

module.exports = { validateReserva, validateReservaUpdate };
