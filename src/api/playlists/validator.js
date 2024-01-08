const Joi = require('joi');

const playlistValidator = Joi.object({
  name: Joi.string().required(),
});

const playlistSongValidator = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { playlistValidator, playlistSongValidator };
