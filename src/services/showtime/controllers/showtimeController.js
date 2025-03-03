import { showtimeService } from "../services/showtimeService";

const showtimeController = {
    async getAllShowtime() {
        try {
            const showtime = await showtimeService.getAllShowtime();
            return showtime;
        }
        catch (error) {
            console.error('Error getting all showtime in showtimeService.getAllShowtime:', error);
            throw error;
        }
    },

    async getShowtimeById(showtime_id) {
        try {
            const showtime = await showtimeService.getShowtimeById(showtime_id);
            return showtime;
        }
        catch (error) {
            console.error('Error getting showtime by id in showtimeService.getShowtimeById:', error);
            throw error;
        }
    },

    async createShowtime(showtimeData) {
        try {
            const showtime = await showtimeService.createShowtime(showtimeData);
            return showtime;
        }
        catch (error) {
            console.error('Error creating showtime in showtimeService.createShowtime:', error);
            throw error;
        }
    },

    async updateShowtime(showtime_id, showtimeData) {
        try {
            const showtime = await showtimeService.updateShowtime(showtime_id, showtimeData);
            return showtime;
        }
        catch (error) {
            console.error('Error updating showtime in showtimeService.updateShowtime:', error);
            throw error;
        }
    },

    async deleteShowtime(showtime_id) {
        try {
            await showtimeService.deleteShowtime(showtime_id)
        }
        catch (error) {
            console.error('Error deleting showtime in showtimeService.deleteShowtime:', error)
            throw error
        }
    }
}

export default showtimeController