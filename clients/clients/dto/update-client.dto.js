const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().optional(),
  link: Joi.string().optional().allow(null, ''),
  image: Joi.string().optional().allow(null, ''),
  type: Joi.string().valid('desktop', 'mobile').optional()
});