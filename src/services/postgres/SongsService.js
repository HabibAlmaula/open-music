const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InVariantError = require('../../exception/InVariantError');
const NotFoundError = require('../../exception/NotFoundError');

class SongsService {
  constructor(albumService) {
    this._pool = new Pool();
    this._albumService = albumService;
  }

  async addSong({albumId = null, title, year, genre, performer, duration}) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    if (albumId != null) {
      await this._albumService.getDetailAlbum(albumId);
    }
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, ' +
                '$4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, albumId, title, year,
        genre, performer, duration, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InVariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs({title, performer}) {
    let query = 'SELECT id, title, performer FROM songs';

    if (title || performer) {
      query += ' WHERE ';

      if (title) {
        query += `title ILIKE '%${title}%' AND `;
      }

      if (performer) {
        query += `performer ILIKE '%${performer}%' AND `;
      }

      query = query.slice(0, -5); // Remove the last 'AND'
    }


    const {rows} = await this._pool.query(query);
    return rows;
  }

  async getDetailSong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async editSongById(id, {
    albumId = null, title,
    year, genre, performer, duration,
  }) {
    const updatedAt = new Date().toISOString();
    if (albumId != null) {
      await this._albumService.getDetailAlbum(albumId);
    }
    const query = {
      text: 'UPDATE songs SET album_Id = $1, ' +
                'title = $2, year = $3, genre = $4, performer = $5, ' +
                'duration = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [albumId, title, year,
        genre, performer, duration, updatedAt, id],
    };

    console.log(query);

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu, Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
