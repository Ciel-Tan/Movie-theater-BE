import db from '../../../../db';

export const genreService = {
    async getAllGenres () {
        try {
            const genres = await db.query('SELECT * FROM genre');
            return genres
        }
        catch (error) {
            console.error("Error getting all genres:", error);
            throw error    
        }
    },

    async getGenreById (genre_id) {
        try {
            const genre = await db.query('SELECT * FROM genre WHERE genre_id = ?', [genre_id]);
            return genre[0]
        }
        catch (error) {
            console.error("Error getting genre by id:", error);
            throw error    
        }
    },

    async createGenre (genre_name) {
        try {
            const name = genre_name.replace(/\s+/g, ' ').trim();

            const result = await db.query('INSERT INTO genre SET genre_name = ?', [name]);

            const genreById = await this.getGenreById(result.insertId);
            return genreById
        }
        catch (error) {
            console.error("Error creating genre:", error);
            throw error    
        }
    },

    async updateGenre(genre_id, genre_name) {
        try {
            await db.query(
                `UPDATE genre
                    SET genre_name = ?
                    WHERE genre_id = ?`,
                [genre_name, genre_id]
            )

            const genre = await this.getGenreById(genre_id)

            return genre
        }
        catch (error) {
            console.error("Error updating genre from database:", error)
            throw error
        }
    },

    async deleteGenre(genre_id) {
        try {
            await db.query(`DELETE FROM movie_genre WHERE genre_id = ?`, [genre_id])
            const result = await db.query(`DELETE FROM genre WHERE genre_id = ?`, [genre_id])

            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting genre from database:", error)
            throw error
        }
    }
};