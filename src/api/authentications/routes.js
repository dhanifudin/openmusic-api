const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
    options: {
      validate: {
        payload: validator.authenticationValidator,
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
    options: {
      validate: {
        payload: validator.refreshTokenValidator,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    options: {
      validate: {
        payload: validator.refreshTokenValidator,
      },
    },
  },
];

module.exports = routes;
