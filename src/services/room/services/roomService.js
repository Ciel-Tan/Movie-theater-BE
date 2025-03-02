import db from '../../../../db';

export const roomService = {
    async getAllRooms() {
        try {
            const rooms = await db.query(`SELECT * FROM room`);
            return rooms
        }
        catch (error) {
            console.error("Error getting room from database:", error);
            throw error 
        }
    },

    async getRoomById(room_id) {
        try {
            const room = await db.query(`SELECT * FROM room WHERE room_id = ?`, [room_id]);
            return room[0]
        }
        catch (error) {
            console.error("Error getting room by id from database:", error);
            throw error 
        }
    },

    async createRoom(room_name) {
        try {
            const room = await db.query(`INSERT INTO room SET room_name = ?`, [room_name]);

            const roomById = await this.getRoomById(room.insertId);
            return roomById
        }
        catch (error) {
            console.error("Error creating room from database:", error);
            throw error    
        }
    },

    async updateRoom(room_id, room_name) {
        try {
            await db.query(`UPDATE room SET room_name = ? WHERE room_id = ?`, [room_name, room_id]);

            const room = await this.getRoomById(room_id)
            return room
        }
        catch (error) {
            console.error("Error updating room from database:", error);
            throw error
        }
    },

    async deleteRoom(room_id) {
        try {
            await db.query(`DELETE FROM room WHERE room_id = ?`, [room_id])
            return { message: "Delete room successfully" }
        }
        catch (error) {
            console.error("Error deleting room from database:", error)
            throw error
        }
    }
}