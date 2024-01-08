const { nanoid } = require('nanoid');
const Boom = require('@hapi/boom');
const pool = require('./pool');

class SongsService {
  constructor() {
    this.pool = pool;
  }

  async addSong({
    title, year, performer, genre, duration = null, albumId = null,
  }) {
    const id = `songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    await this.pool.query(query);
    return id;
  }

  async getSongs(filter) {
    const { title, performer } = filter;
    const conditions = [];
    if (title) {
      conditions.push(`title ILIKE '%${title}%'`);
    }
    if (performer) {
      conditions.push(`performer ILIKE '%${performer}%'`);
    }
    const where = conditions.length ? conditions.join(' AND ') : 'TRUE';
    const query = `SELECT id, title, performer FROM songs WHERE ${where}`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw Boom.notFound('Lagu tidak ditemukan');
    }

    return rows[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw Boom.notFound('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw Boom.notFound('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
