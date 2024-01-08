const Boom = require('@hapi/boom');
const { nanoid } = require('nanoid');
const pool = require('./pool');

class CollaborationsService {
  constructor() {
    this.pool = pool;
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collaborations-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.badRequest('Kolaborasi gagal ditambahkan');
    }

    return rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.badRequest('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator({ playlistId, userId }) {
    console.log('call verifyCollaborator');
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.badRequest('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
