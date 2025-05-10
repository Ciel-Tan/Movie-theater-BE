import { seatService } from "../services/seatService";


const seatController = {
    async getAllSeats() {
        try {
            const seat = await seatService.getAllSeats();
            return seat
        }
        catch (error) {
            console.error("Error getting all seat in seatService.getAllSeats:", error);
            throw error
        }
    },

    async getSeatById(seat_id) {
        try {
            const seat = await seatService.getSeatById(seat_id);
            return seat
        }
        catch (error) {
            console.error("Error getting seat by id in seatService.getSeatById:", error);
            throw error
        }
    },

    // async createSeatType(seat_type_name) {
    //     try {
    //         const seat_type = await seatTypeService.createSeatType(seat_type_name);
    //         return seat_type
    //     }
    //     catch (error) {
    //         console.error("Error creating seat_type in seatTypeService.createSeatType:", error);
    //         throw error
    //     }
    // },

    // async updateSeatType(seat_type_id, seat_type_name) {
    //     try {
    //         const seat_type = await seatTypeService.updateSeatType(seat_type_id, seat_type_name);
    //         return seat_type
    //     }
    //     catch (error) {
    //         console.error("Error updating seat_type in seatTypeService.updateSeatType:", error);
    //         throw error
    //     }
    // },

    // async deleteSeatType(seat_type_id) {
    //     try {
    //         return await seatTypeService.deleteSeatType(seat_type_id);
    //     }
    //     catch (error) {
    //         console.error("Error deleting seat_type in seatTypeService.deleteSeatType:", error);
    //         throw error
    //     }
    // }
};

export default seatController