class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService) {
    this.collaborationsService = collaborationsService;
    this.playlistsService = playlistsService;
    this.usersService = usersService;
  }

  async postCollaborationHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this.playlistsService.verifyPlaylistOwner({ playlistId, owner });
    await this.usersService.getUserById(userId);
    const collaborationId = await this.collaborationsService.addCollaboration({
      playlistId,
      userId,
    });

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this.playlistsService.verifyPlaylistOwner({ playlistId, owner });
    await this.collaborationsService.deleteCollaboration({ playlistId, userId });

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
