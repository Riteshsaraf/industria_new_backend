const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ''),
  parentId: Joi.number().optional().allow(null)
});