const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');

const config = require('./config');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');

const authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./utils/TokenManager');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

async function createServer() {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: {
      request: ['error'],
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic.jwt', 'jwt', {
    keys: config.token.accessKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.accessExpiresIn,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        songsService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
      },
    },
  ]);

  server.ext('onPreResponse', (request) => {
    const { response } = request;

    if (Boom.isBoom(response)) {
      response.output.payload.status = 'fail';
    }

    return response.continue || response;
  });

  return server;
}

(async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
