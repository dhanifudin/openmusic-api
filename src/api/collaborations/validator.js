const Joi = require('joi');

const playlistValidator = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { playlistValidator };
