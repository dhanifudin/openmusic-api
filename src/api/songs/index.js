const SongsHandler = require('./handler');
const songValidator = require('./validator');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const songsHandler = new SongsHandler(service);
    server.route(routes(songsHandler, songValidator));
  },
};
