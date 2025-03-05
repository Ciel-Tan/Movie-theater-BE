import db from "../../../../db";

export const bookingService = {
    async getAllBooking() {
        try {
            const booking = await db.query(`SELECT * FROM booking`);
            return booking;
        }
        catch (error) {
            console.error('Error getting all booking from database:', error);
            throw error;
        }
    },

    async getBookingById(booking_id) {
        try {
            const booking = await db.query(`SELECT * FROM booking WHERE booking_id = ?`, [booking_id]);
            return booking[0];
        }
        catch (error) {
            console.error('Error getting booking by id from database:', error);
            throw error;
        }
    },

    async createBooking(bookingData) {
        const { showtime_id, account_id, booking_datetime, booking_fee } = bookingData;
        try {
            const booking = await db.query(
                `INSERT INTO booking SET
                 showtime_id = ?, account_id = ?, booking_datetime = ?, booking_fee = ?`,
                [showtime_id, account_id, booking_datetime.slice(0, 19).replace('T', ' '), booking_fee],
            );
            
            const newBooking = await this.getBookingById(booking.insertId);
            return newBooking
        }
        catch (error) {
            console.error('Error creating booking from database:', error);
            throw error;
        }
    },

    async updateBooking(booking_id, bookingData) {
        const { showtime_id, account_id, booking_datetime, booking_fee } = bookingData;
        try {
            await db.query(
                `UPDATE booking SET
                showtime_id = ?, account_id = ?, booking_datetime = ?, booking_fee = ?
                WHERE booking_id = ?`,
                [showtime_id, account_id, booking_datetime.slice(0, 19).replace('T', ' '), booking_fee, booking_id],
            );
            
            const updatedBooking = await this.getBookingById(booking_id);
            return updatedBooking
        }
        catch (error) {
            console.error('Error updating booking from database:', error);
            throw error;
        }
    },

    async deleteBooking(booking_id) {
        try {
            const result = await db.query(`DELETE FROM booking WHERE booking_id = ?`, [booking_id])
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting booking from database:", error)
            throw error    
        }
    }
}