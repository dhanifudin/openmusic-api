const Boom = require('@hapi/boom');
const { nanoid } = require('nanoid');
const pool = require('./pool');

class PlaylistsService {
  constructor(collaborationsService) {
    this.pool = pool;
    this.collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.badRequest('Playlist gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getPlaylists({ owner }) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      INNER JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const { rows } = await this.pool.query(query);
    return rows;
  }

  async getPlaylistById({ playlistId }) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const { rows, rowCount } = await this.pool.query(query);
    if (!rowCount) {
      throw Boom.notFound('Playlist tidak ditemukan');
    }
    return rows[0];
  }

  async addSongToPlaylist({ playlistId, songId, userId }) {
    await this.verifyPlaylistAccess({ playlistId, userId });
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.badRequest('Lagu gagal ditambahkan ke playlist');
    }

    const activityId = `activity-${nanoid(16)}`;

    const activityQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [activityId, playlistId, songId, userId, 'add', new Date()],
    };

    await this.pool.query(activityQuery);

    return rows[0].id;
  }

  async getSongsFromPlaylist({ playlistId, userId }) {
    await this.verifyPlaylistAccess({ playlistId, userId });
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists INNER JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const { rows, rowCount } = await this.pool.query(playlistQuery);

    if (!rowCount) {
      throw Boom.notFound('Playlist tidak ditemukan');
    }
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      INNER JOIN playlists ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      INNER JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlists.id = $1 AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
      values: [playlistId, userId],
    };

    const { rows: songs } = await this.pool.query(songsQuery);
    return {
      ...rows[0],
      songs,
    };
  }

  async deletePlaylist({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const { rowCount } = await this.pool.query(query);
    if (!rowCount) {
      throw Boom.notFound('Playlist tidak ditemukan');
    }
    const activityQuery = {
      text: 'DELETE FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };
    await this.pool.query(activityQuery);
  }

  async getPlaylistSongsActivity({ playlistId }) {
    const query = {
      text: `SELECT users.username, songs.title,
        playlist_song_activities.action, playlist_song_activities.time
        FROM playlist_song_activities
        INNER JOIN playlists ON playlist_song_activities.playlist_id = playlists.id
        INNER JOIN users ON playlist_song_activities.user_id = users.id
        INNER JOIN songs ON playlist_song_activities.song_id = songs.id
        WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this.pool.query(query);

    return rows;
  }

  async deleteSongFromPlaylist({ playlistId, songId, userId }) {
    await this.verifyPlaylistAccess({ playlistId, userId });
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const { rowCount } = await this.pool.query(query);
    if (!rowCount) {
      throw Boom.badRequest('Lagu tidak ditemukan');
    }
    const activityId = `activity-${nanoid(16)}`;

    const activityQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [activityId, playlistId, songId, userId, 'delete', new Date()],
    };

    await this.pool.query(activityQuery);
  }

  async verifyPlaylistOwner({ playlistId, owner }) {
    console.log('call verifyPlaylistOwner');
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.notFound('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw Boom.forbidden('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess({ playlistId, userId }) {
    try {
      await this.verifyPlaylistOwner({ playlistId, owner: userId });
    } catch (error) {
      if (error.output.statusCode === 404) {
        throw error;
      }
      try {
        await this.collaborationsService.verifyCollaborator({ playlistId, userId });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
