const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().required(),
  link: Joi.string().optional().allow(null, ''),
  image: Joi.string().optional().allow(null, '')
});