import db from '../../../../db';

export const seatService = {
    async getAllSeats() {
        try {
            const seats = await db.query(`
                SELECT s.seat_id, s.seat_location,
                JSON_OBJECT(
                    'seat_type_id', st.seat_type_id,
                    'seat_type_name', st.seat_type_name
                ) AS seat_type
                FROM seat s
                LEFT JOIN seat_type st ON s.seat_type_id = st.seat_type_id
            `);
            return seats
        }
        catch (error) {
            console.error("Error getting all seat from database:", error);
            throw error 
        }
    },

    async getSeatById(seat_id) {
        try {
            const seat = await db.query(`
                SELECT s.seat_id, s.seat_location,
                JSON_OBJECT(
                    'seat_type_id', st.seat_type_id,
                    'seat_type_name', st.seat_type_name
                ) AS seat_type
                FROM seat s
                LEFT JOIN seat_type st ON s.seat_type_id = st.seat_type_id
                WHERE s.seat_id = ?
            `, [seat_id]);
            return seat[0]
        }
        catch (error) {
            console.error("Error getting seat by id from database:", error);
            throw error 
        }
    },

    // async createSeatType(seat_type_name) {
    //     try {
    //         const seat_type = await db.query(`INSERT INTO seat_type SET seat_type_name = ?`, [seat_type_name]);

    //         const seat_typeById = await this.getSeatTypeById(seat_type.insertId);
    //         return seat_typeById
    //     }
    //     catch (error) {
    //         console.error("Error creating seat_type from database:", error);
    //         throw error    
    //     }
    // },

    // async updateSeatType(seat_type_id, seat_type_name) {
    //     try {
    //         await db.query(`UPDATE seat_type SET seat_type_name = ? WHERE seat_type_id = ?`, [seat_type_name, seat_type_id]);

    //         const seat_type = await this.getSeatTypeById(seat_type_id)
    //         return seat_type
    //     }
    //     catch (error) {
    //         console.error("Error updating seat_type from database:", error);
    //         throw error
    //     }
    // },

    // async deleteSeatType(seat_type_id) {
    //     try {
    //         await db.query('UPDATE seat SET seat_type_id = NULL WHERE seat_type_id = ?', [seat_type_id])
    //         const result = await db.query(`DELETE FROM seat_type WHERE seat_type_id = ?`, [seat_type_id])
            
    //         return result.affectedRows
    //     }
    //     catch (error) {
    //         console.error("Error deleting seat_type from database:", error)
    //         throw error
    //     }
    // }
}