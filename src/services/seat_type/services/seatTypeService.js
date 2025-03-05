import db from '../../../../db';

export const seatTypeService = {
    async getAllSeatTypes() {
        try {
            const seat_types = await db.query(`SELECT * FROM seat_type`);
            return seat_types
        }
        catch (error) {
            console.error("Error getting seat_type from database:", error);
            throw error 
        }
    },

    async getSeatTypeById(seat_type_id) {
        try {
            const seat_type = await db.query(`SELECT * FROM seat_type WHERE seat_type_id = ?`, [seat_type_id]);
            return seat_type[0]
        }
        catch (error) {
            console.error("Error getting seat_type by id from database:", error);
            throw error 
        }
    },

    async createSeatType(seat_type_name) {
        try {
            const seat_type = await db.query(`INSERT INTO seat_type SET seat_type_name = ?`, [seat_type_name]);

            const seat_typeById = await this.getSeatTypeById(seat_type.insertId);
            return seat_typeById
        }
        catch (error) {
            console.error("Error creating seat_type from database:", error);
            throw error    
        }
    },

    async updateSeatType(seat_type_id, seat_type_name) {
        try {
            await db.query(`UPDATE seat_type SET seat_type_name = ? WHERE seat_type_id = ?`, [seat_type_name, seat_type_id]);

            const seat_type = await this.getSeatTypeById(seat_type_id)
            return seat_type
        }
        catch (error) {
            console.error("Error updating seat_type from database:", error);
            throw error
        }
    },

    async deleteSeatType(seat_type_id) {
        try {
            await db.query('UPDATE seat SET seat_type_id = NULL WHERE seat_type_id = ?', [seat_type_id])
            const result = await db.query(`DELETE FROM seat_type WHERE seat_type_id = ?`, [seat_type_id])
            
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting seat_type from database:", error)
            throw error
        }
    }
}