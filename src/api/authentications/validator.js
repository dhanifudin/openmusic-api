const Joi = require('joi');

const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const authenticationValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenValidator = Joi.object({
  refreshToken: Joi.string()
    .pattern(jwtPattern)
    .required(),
});

module.exports = {
  authenticationValidator,
  refreshTokenValidator,
};
