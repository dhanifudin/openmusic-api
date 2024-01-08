const Joi = require('joi');

const songValidator = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021)
    .required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { songValidator };
