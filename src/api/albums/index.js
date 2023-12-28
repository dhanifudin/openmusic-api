const AlbumsHandler = require('./handler');
const albumValidator = require('./validator');
const routes = require('./routes');

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumsHandler = new AlbumsHandler(service);
    server.route(routes(albumsHandler, albumValidator));
  },
};

module.exports = albums;
