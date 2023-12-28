const Boom = require('@hapi/boom');
const Hapi = require('@hapi/hapi');

const { config } = require('./config');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

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
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
