import db from "../../../../db";

export const showtimeService = {
    async getAllShowtime() {
        try {
            const showtime = await db.query(`SELECT * FROM showtime`);
            return showtime;
        }
        catch (error) {
            console.error('Error getting all showtime from database:', error);
            throw error;
        }
    },

    async getShowtimeById(showtime_id) {
        try {
            const showtime = await db.query(`SELECT * FROM showtime WHERE showtime_id = ?`, [showtime_id]);
            return showtime[0];
        }
        catch (error) {
            console.error('Error getting showtime by id from database:', error);
            throw error;
        }
    },

    async createShowtime(showtimeData) {
        const { movie_id, room_id, show_datetime } = showtimeData;
        try {
            const showtime = await db.query(
                `INSERT INTO showtime SET
                movie_id = ?, room_id = ?, show_datetime = ?`,
                [movie_id, room_id, show_datetime.slice(0, 19).replace('T', ' ')],
            );
            
            const newShowtime = await this.getShowtimeById(showtime.insertId);
            return newShowtime
        }
        catch (error) {
            console.error('Error creating showtime from database:', error);
            throw error;
        }
    },

    async updateShowtime(showtime_id, showtimeData) {
        const { movie_id, room_id, show_datetime } = showtimeData;
        try {
            await db.query(
                `UPDATE showtime SET
                movie_id = ?, room_id = ?, show_datetime = ?
                WHERE showtime_id = ?`,
                [movie_id, room_id, show_datetime, showtime_id],
            );
            
            const updatedShowtime = await this.getShowtimeById(showtime_id);
            return updatedShowtime
        }
        catch (error) {
            console.error('Error updating showtime from database:', error);
            throw error;
        }
    },

    async deleteShowtime(showtime_id) {
        try {
            const result = await db.query(`DELETE FROM showtime WHERE showtime_id = ?`, [showtime_id])
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting showtime from database:", error)
            throw error    
        }
    }
}