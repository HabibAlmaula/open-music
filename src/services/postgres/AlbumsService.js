const {Pool} = require("pg");
const {nanoid} = require("nanoid");
const InVariantError = require("../../exception/InVariantError");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }


    async addAlbum({name, year}){
        const id = `album-${nanoid(16)}`
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, createdAt],
        }

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw InVariantError('Album gagal ditambahkan')
        }
        return result.rows[0].id;
    }

    async getAlbums(){
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows;
    }
}

module.exports = AlbumsService;
