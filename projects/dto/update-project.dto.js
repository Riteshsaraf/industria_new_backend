const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().optional(),
  thumbnail: Joi.string().optional().allow(null, ''),
  videoLink: Joi.string().optional().allow(null, ''),
  description: Joi.string().optional().allow(null, ''),
  categoryId: Joi.number().optional()
});