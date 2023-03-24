const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InVariantError = require('../../exception/InVariantError');
const NotFoundError = require('../../exception/NotFoundError');
const {mapAlbumToModel} = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }


  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw InVariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getDetailAlbum(id) {
    const query = {
      text: `
      SELECT
      a.id,
      a.name,
      a.year,
      s.id as song_id,
      s.title,
      s.performer
      FROM
      albums a
      LEFT JOIN songs s ON a.id = s.album_Id
      WHERE
      a.id = $1`,
      values: [id],
    };

    const result = (await this._pool.query(query)).rows;
    if (!result.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return mapAlbumToModel(result);
  }

  async editAlbumById(id, {name, year}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, ' +
                'updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
