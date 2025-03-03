import db from '../../../../db';

export const actorService = {
    async getAllActors () {
        try {
            const actors = await db.query('SELECT * FROM actor');
            return actors
        }
        catch (error) {
            console.error("Error getting all actors:", error);
            throw error    
        }
    },

    async getActorById (actor_id) {
        try {
            const actor = await db.query('SELECT * FROM actor WHERE actor_id = ?', [actor_id]);
            return actor[0]
        }
        catch (error) {
            console.error("Error getting actor by id:", error);
            throw error    
        }
    },

    async createActor (actor_name) {
        try {
            actor_name = actor_name.replace(/\s+/g, ' ').trim();

            const result = await db.query('INSERT INTO actor SET actor_name = ?', [actor_name]);

            const actorById = await this.getActorById(result.insertId);
            return actorById
        }
        catch (error) {
            console.error("Error creating actor:", error);
            throw error    
        }
    },

    async updateActor(actor_id, actor_name) {
        try {
            await db.query(
                `UPDATE actor
                    SET actor_name = ?
                    WHERE actor_id = ?`,
                [actor_name, actor_id]
            )

            const actor = await this.getActorById(actor_id)

            return actor
        }
        catch (error) {
            console.error("Error updating actor from database:", error)
            throw error
        }
    },

    async deleteActor(actor_id) {
        try {
            await db.query(`DELETE FROM actor WHERE actor_id = ?`, [actor_id])
            await db.query(`DELETE FROM movie_actor WHERE actor_id = ?`, [actor_id])
        }
        catch (error) {
            console.error("Error deleting actor from database:", error)
            throw error
        }
    }
};