const Joi = require('joi');

const albumValidator = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { albumValidator };
