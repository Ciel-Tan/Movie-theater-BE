import { bookingService } from "../../booking/services/bookingService";

const bookingController = {
    async getAllBooking() {
        try {
            const booking = await bookingService.getAllBooking();
            return booking;
        }
        catch (error) {
            console.error('Error getting all booking in bookingService.getAllBooking:', error);
            throw error;
        }
    },

    async getBookingById(booking_id) {
        try {
            const booking = await bookingService.getBookingById(booking_id);
            return booking;
        }
        catch (error) {
            console.error('Error getting booking by id in bookingService.getBookingById:', error);
            throw error;
        }
    },

    async createBooking(bookingData) {
        try {
            const booking = await bookingService.createBooking(bookingData);
            return booking;
        }
        catch (error) {
            console.error('Error creating booking in bookingService.createBooking:', error);
            throw error;
        }
    },

    async updateBooking(booking_id, bookingData) {
        try {
            const booking = await bookingService.updateBooking(booking_id, bookingData);
            return booking;
        }
        catch (error) {
            console.error('Error updating booking in bookingService.updateBooking:', error);
            throw error;
        }
    },

    async deleteBooking(booking_id) {
        try {
            await bookingService.deleteBooking(booking_id)
        }
        catch (error) {
            console.error('Error deleting booking in bookingService.deleteBooking:', error)
            throw error
        }
    }
}

export default bookingController