const CollaborationsHandler = require('./handler');
const collaborationValidator = require('./validator');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistsService, usersService }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
    );
    server.route(routes(collaborationsHandler, collaborationValidator));
  },
};
