const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().optional(),
  thumbnail: Joi.string().optional().allow(null, ''),
  videoLink: Joi.string().optional().allow(null, ''),
  description: Joi.string().optional().allow(null, ''),
  categoryId: Joi.array().items(Joi.number()).optional().allow(null, []),
  year: Joi.number().optional().allow(null, ''),
  client: Joi.string().optional().allow(null, ''),
});