const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional().allow(null, ''),
  parentId: Joi.number().optional().allow(null)
});