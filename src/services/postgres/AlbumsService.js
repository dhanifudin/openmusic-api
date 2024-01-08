const { nanoid } = require('nanoid');
const Boom = require('@hapi/boom');
const pool = require('./pool');

class AlbumsService {
  constructor() {
    this.pool = pool;
  }

  async addAlbum({ name, year }) {
    const id = `albums-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    await this.pool.query(query);
    return id;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows } = await this.pool.query(albumQuery);

    if (!rows.length) {
      throw Boom.notFound('Album tidak ditemukan');
    }

    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const { rows: songs } = await this.pool.query(songQuery);

    return {
      ...rows[0],
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw Boom.notFound('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw Boom.notFound('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
