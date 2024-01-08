const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: validator.collaborationValidator,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => handler.deleteCollaborationHandler(request),
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: validator.collaborationValidator,
      },
    },
  },
];

module.exports = routes;
