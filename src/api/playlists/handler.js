class PlaylistHandler {
  constructor(service, songsService) {
    this.service = service;
    this.songsService = songsService;
  }

  async postPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this.service.addPlaylist({ name, owner });

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this.service.getPlaylists({ owner });
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postSongToPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;
    await this.songsService.getSongById(songId);
    await this.service.addSongToPlaylist({ playlistId, songId, userId: owner });
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const playlist = await this.service.getSongsFromPlaylist({ playlistId, userId });
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { playlistId } = request.params;

    await this.service.verifyPlaylistOwner({ playlistId, owner });
    await this.service.deletePlaylist({ playlistId, userId: owner });

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this.service.deleteSongFromPlaylist({ playlistId, songId, userId: owner });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistSongsActivityHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const playlist = await this.service.getPlaylistById({ playlistId });
    console.log(playlist);
    console.log(`userId: ${userId} playlist.owner: ${playlist.owner}`);
    await this.service.verifyPlaylistAccess({ playlistId, userId });
    const activities = await this.service.getPlaylistSongsActivity({ playlistId });
    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activities,
      },
    };
  }
}

module.exports = PlaylistHandler;
