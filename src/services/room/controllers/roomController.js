import { roomService } from "../services/roomService";

const roomController = {
    async getAllRooms() {
        try {
            const rooms = await roomService.getAllRooms();
            return rooms
        }
        catch (error) {
            console.error("Error getting all rooms in roomService.getAllRooms:", error);
            throw error
        }
    },

    async getRoomById(room_id) {
        try {
            const room = await roomService.getRoomById(room_id);
            return room
        }
        catch (error) {
            console.error("Error getting room by id in roomService.getRoomById:", error);
            throw error
        }
    },

    async createRoom(room_name) {
        try {
            const room = await roomService.createRoom(room_name);
            return room
        }
        catch (error) {
            console.error("Error creating room in roomService.createRoom:", error);
            throw error
        }
    },

    async updateRoom(room_id, room_name) {
        try {
            const room = await roomService.updateRoom(room_id, room_name);
            return room
        }
        catch (error) {
            console.error("Error updating room in roomService.updateRoom:", error);
            throw error
        }
    },

    async deleteRoom(room_id) {
        try {
            await roomService.deleteRoom(room_id);
        }
        catch (error) {
            console.error("Error deleting room in roomService.deleteRoom:", error);
            throw error
        }
    }
};

export default roomController