const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: validator.playlistValidator,
      },
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request) => handler.getPlaylistsHandler(request),
    options: {
      auth: 'openmusic.jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: validator.playlistSongValidator,
      },
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: (request) => handler.getSongsFromPlaylistHandler(request),
    options: {
      auth: 'openmusic.jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: (request) => handler.deletePlaylistHandler(request),
    options: {
      auth: 'openmusic.jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: (request) => handler.deleteSongFromPlaylistHandler(request),
    options: {
      auth: 'openmusic.jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: (request) => handler.getPlaylistSongsActivityHandler(request),
    options: {
      auth: 'openmusic.jwt',
    },
  },
];

module.exports = routes;
