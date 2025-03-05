import { seatTypeService } from "../services/seatTypeService";

const seatTypeController = {
    async getAllSeatTypes() {
        try {
            const seat_types = await seatTypeService.getAllSeatTypes();
            return seat_types
        }
        catch (error) {
            console.error("Error getting all seat_types in seatTypeService.getAllSeatTypes:", error);
            throw error
        }
    },

    async getSeatTypeById(seat_type_id) {
        try {
            const seat_type = await seatTypeService.getSeatTypeById(seat_type_id);
            return seat_type
        }
        catch (error) {
            console.error("Error getting seat_type by id in seatTypeService.getSeatTypeById:", error);
            throw error
        }
    },

    async createSeatType(seat_type_name) {
        try {
            const seat_type = await seatTypeService.createSeatType(seat_type_name);
            return seat_type
        }
        catch (error) {
            console.error("Error creating seat_type in seatTypeService.createSeatType:", error);
            throw error
        }
    },

    async updateSeatType(seat_type_id, seat_type_name) {
        try {
            const seat_type = await seatTypeService.updateSeatType(seat_type_id, seat_type_name);
            return seat_type
        }
        catch (error) {
            console.error("Error updating seat_type in seatTypeService.updateSeatType:", error);
            throw error
        }
    },

    async deleteSeatType(seat_type_id) {
        try {
            return await seatTypeService.deleteSeatType(seat_type_id);
        }
        catch (error) {
            console.error("Error deleting seat_type in seatTypeService.deleteSeatType:", error);
            throw error
        }
    }
};

export default seatTypeController