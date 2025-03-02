import db from '../../../../db';

export const directorService = {
    async getAllDirectors () {
        try {
            const directors = await db.query('SELECT * FROM director');
            return directors
        }
        catch (error) {
            console.error("Error getting all directors:", error);
            throw error    
        }
    },

    async getDirectorById (director_id) {
        try {
            const director = await db.query('SELECT * FROM director WHERE director_id = ?', [director_id]);
            return director[0]
        }
        catch (error) {
            console.error("Error getting director by id:", error);
            throw error    
        }
    },

    async createDirector (director_name) {
        try {
            director_name = director_name.replace(/\s+/g, ' ').trim();

            const result = await db.query('INSERT INTO director SET director_name = ?', [director_name]);

            const directorById = await this.getDirectorById(result.insertId);
            return directorById
        }
        catch (error) {
            console.error("Error creating director:", error);
            throw error    
        }
    },

    async updateDirector(director_id, director_name) {
        try {
            await db.query(
                `UPDATE director
                 SET director_name = ?
                 WHERE director_id = ?`,
                [director_name, director_id]
            )

            const director = await this.getDirectorById(director_id)

            return director
        }
        catch (error) {
            console.error("Error updating director from database:", error)
            throw error
        }
    },

    async deleteDirector(director_id) {
        try {
            await db.query(`DELETE FROM director WHERE director_id = ?`, [director_id])
            await db.query('UPDATE movie SET director_id = NULL WHERE director_id = ?', [director_id])
            return { message: "Delete director successfully" }
        }
        catch (error) {
            console.error("Error deleting director from database:", error)
            throw error
        }
    }
};