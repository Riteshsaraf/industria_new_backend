const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().required(),
  thumbnail: Joi.string().optional().allow(null, ''),
  videoLink: Joi.string().optional().allow(null, ''),
  description: Joi.string().optional().allow(null, ''),
  categoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  year: Joi.string().optional().allow(null, ''),
  client: Joi.string().optional().allow(null, ''),
  mainCategory: Joi.string().optional().allow(null, '')
});