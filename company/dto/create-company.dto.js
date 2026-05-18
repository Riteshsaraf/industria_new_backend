const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  bannerImage: Joi.string().required(),
  description: Joi.string().required(),
  branches: Joi.array().optional(),
  socialLinks: Joi.array().optional()
});