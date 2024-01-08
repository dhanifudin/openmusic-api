const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const config = require('../config');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.token.accessKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.token.refreshKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.token.refreshKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw Boom.badRequest('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
