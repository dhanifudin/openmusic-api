const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
    options: {
      validate: {
        payload: validator,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request) => handler.getAlbumByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request) => handler.putAlbumByIdHandler(request),
    options: {
      validate: {
        payload: validator,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request) => handler.deleteAlbumByIdHandler(request),
  },
];

module.exports = routes;
