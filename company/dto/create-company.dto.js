const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  bannerImage: Joi.string(),
  description: Joi.string().required(),
  branches: Joi.string().required(),
  socialLinks: Joi.string().required()
});