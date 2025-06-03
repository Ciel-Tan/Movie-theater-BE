import db from "../../../../db";

export const bookingService = {
    async getBookingQuery(booking_id = null, account_id = null, movie_id = null) {
        try {
            let whereClause = '';
            const queryParams = [];

            if (booking_id !== null) {
                whereClause = 'WHERE b.booking_id = ?';
                queryParams.push(booking_id);
            }
            else if (account_id !== null) {
                whereClause = 'WHERE b.account_id = ?';
                queryParams.push(account_id);
            }
            else if (movie_id !== null) {
                whereClause = 'WHERE m.movie_id = ?';
                queryParams.push(movie_id);
            }

            const bookings = await db.query(
                `SELECT
                    b.booking_id,
                    b.booking_datetime AS booking_datetime,
                    b.booking_fee,
                    b.total_price,

                    JSON_OBJECT(
                        'account_id', acc.account_id,
                        'full_name', acc.full_name,
                        'email', acc.email,
                        'gender', acc.gender,
                        'birthday', acc.birthday,
                        'id_number', acc.id_number,
                        'phone_number', acc.phone_number,
                        'role', JSON_OBJECT(
                            'role_id', r.role_id,
                            'role_name', r.role_name
                        ),
                        'membership_type', JSON_OBJECT(
                            'membership_id', mt.membership_id,
                            'membership_name', mt.membership_name,
                            'discount_rate', mt.discount_rate
                        )
                    ) AS account,

                    JSON_OBJECT(
                        'showtime_id', st.showtime_id,
                        'movie', JSON_OBJECT(
                            'movie_id', m.movie_id,
                            'title', m.title,
                            'poster_image', m.poster_image,
                            'poster_url', m.poster_url,
                            'description', m.description,
                            'age_rating', m.age_rating,
                            'run_time', m.run_time,
                            'release_date', m.release_date,
                            'trailer_link', m.trailer_link,
                            'language', m.language,
                            'director', JSON_OBJECT(
                                'director_id', d.director_id,
                                'director_name', d.director_name
                            )
                        ),
                        'cinema', JSON_OBJECT(
                            'cinema_id', c.cinema_id,
                            'cinema_name', c.cinema_name,
                            'address', JSON_OBJECT(
                                'address_id', a.address_id,
                                'address_name', a.address_name
                            )  
                        ),
                        'room', JSON_OBJECT(
                            'room_id', rm.room_id,
                            'room_name', rm.room_name
                        ),
                        'show_datetime', st.show_datetime
                    ) AS showtime,

                    -- aggregate tickets
                    (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'ticket_quantity', bt2.ticket_quantity,
                                'ticket', JSON_OBJECT(
                                    'ticket_id', t.ticket_id,
                                    'ticket_name', t.ticket_name,
                                    'ticket_price', t.ticket_price
                                )
                            )
                        )
                    FROM booking_ticket bt2
                    JOIN ticket t ON bt2.ticket_id = t.ticket_id
                    WHERE bt2.booking_id = b.booking_id
                    ) AS booking_ticket,

                    -- aggregate seats
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'seat_id', s.seat_id,
                            'seat_location', s.seat_location,
                            'seat_type', JSON_OBJECT(
                                'seat_type_id', stt.seat_type_id,
                                'seat_type_name', stt.seat_type_name
                            )
                        )
                    )
                    FROM booking_seat bs2
                    JOIN seat s ON bs2.seat_id = s.seat_id
                    JOIN seat_type stt ON s.seat_type_id = stt.seat_type_id
                    WHERE bs2.booking_id = b.booking_id
                    ) AS booking_seat

                FROM booking b
                LEFT JOIN account acc ON b.account_id = acc.account_id
                LEFT JOIN role r ON acc.role_id = r.role_id
                LEFT JOIN membership_type mt ON acc.membership_id = mt.membership_id
                LEFT JOIN showtime st ON b.showtime_id = st.showtime_id
                LEFT JOIN movie m ON st.movie_id = m.movie_id
                LEFT JOIN cinema c ON st.cinema_id = c.cinema_id
                LEFT JOIN address a ON c.address_id = a.address_id
                LEFT JOIN director d ON m.director_id = d.director_id
                LEFT JOIN room rm ON st.room_id = rm.room_id
                ${whereClause}
                ORDER BY b.booking_datetime DESC;`,
                queryParams
            );

            return bookings;
        }
        catch (error) {
            console.error("Error executing query getBookingQuery:", error);
            throw error;
        }
    },

    async getAllBooking() {
        return await this.getBookingQuery()
    },

    async getBookingById(booking_id) {
        const bookings = await this.getBookingQuery(booking_id, null, null)
        return bookings[0];
    },

    async getBookingByAccountId(account_id) {
        const bookings = await this.getBookingQuery(null, account_id, null)
        return bookings;
    },

    async getBookingByMovieId(movie_id) {
        const bookings = await this.getBookingQuery(null, null, movie_id)
        return bookings;
    },

    async createBookingTable(bookingData) {
        const { showtime, account, booking_datetime, booking_fee, total_price } = bookingData;
        try {
            const booking = await db.query(
                `INSERT INTO booking SET
                 showtime_id = ?, account_id = ?, booking_datetime = ?, booking_fee = ?, total_price = ?`,
                [showtime.showtime_id, account.account_id, booking_datetime.slice(0, 19).replace('T', ' '), booking_fee, total_price],
            );

            return booking.insertId
        }
        catch (error) {
            console.error('Error creating booking from database:', error);
            throw error;
        }
    },

    async createBookingTicket(booking_id, booking_ticket) {
        if (!Array.isArray(booking_ticket) || booking_ticket.length === 0) {
            return;
        }

        const placeholders = booking_ticket.map(() => '(?, ?, ?)').join(', ');
        const values = booking_ticket.reduce((acc, { ticket_quantity, ticket }) => {
            acc.push(booking_id, ticket.ticket_id, ticket_quantity);
            return acc;
          }, []);

        try {
            await db.query(
                `INSERT INTO booking_ticket (booking_id, ticket_id, ticket_quantity) VALUES ${placeholders}`,
                values,
            )
        }
        catch (error) {
            console.error('Error creating booking_ticket from database:', error);
            throw error;
        }
    },

    async createBookingSeat(booking_id, booking_seat) {
        try {
            if (booking_seat && Array.isArray(booking_seat) && booking_seat.length > 0) {
                for (const seat of booking_seat) {
                    await db.query(
                        `INSERT INTO booking_seat SET booking_id = ?, seat_id = ?`, 
                        [booking_id, seat.seat_id]
                    );
                }
            }
        }
        catch (error) {
            console.error('Error creating booking_seat from database:', error);
            throw error;
        }
    },

    async createBooking(bookingData) {
        const { booking_ticket, booking_seat, ...rest } = bookingData;
        try {
            const booking_id = await this.createBookingTable(rest);
            await this.createBookingTicket(booking_id, booking_ticket);
            await this.createBookingSeat(booking_id, booking_seat);
            
            return await this.getBookingById(booking_id)
        }
        catch (error) {
            console.error('Error creating booking from database:', error);
            throw error;
        }
    },

    async updateBookingTable(booking_id, bookingData) {
        const { showtime_id, account_id, booking_datetime, booking_fee } = bookingData;
        try {
            await db.query(
                `UPDATE booking SET
                 showtime_id = ?, account_id = ?, booking_datetime = ?, booking_fee = ?
                 WHERE booking_id = ?`,
                [showtime_id, account_id, booking_datetime.slice(0, 19).replace('T', ' '), booking_fee, booking_id],
            );
        }
        catch(error) {
            console.error("Error updating booking from database:", error);
            throw error
        }
    },

    async updateBookingTicket(booking_id, booking_ticket) {
        if (!Array.isArray(booking_ticket) || booking_ticket.length === 0) {
            return
        }

        const values = booking_ticket.map(({ ticket_quantity, ticket_id }) => [booking_id, ticket_quantity, ticket_id]);
        const placeholders = values.map(() => "(?,?,?)").join(",");

        try {
            await db.query(
                `DELETE FROM booking_ticket WHERE booking_id = ?`,
                [booking_id]
            )
            await db.query(
                `INSERT INTO booking_ticket (booking_id, ticket_quantity, ticket_id) VALUES ${placeholders}`,
                values.flat(),
            )
        }
        catch (error) {
            console.error("Error updating booking_ticket from database:", error);
            throw error
        }
    },

    async updateBookingSeat(booking_id, booking_seat) {
        if (!Array.isArray(booking_seat) || booking_seat.length === 0) {
            return
        }
        try {
            await db.query(
                `DELETE FROM booking_seat WHERE booking_id = ?`,
                [booking_id]
            )
            
            if (booking_seat && Array.isArray(booking_seat) && booking_seat.length > 0) {
                for (const seat of booking_seat) {
                    await db.query(
                        `INSERT INTO booking_seat SET booking_id = ?, seat_id = ?`, 
                        [booking_id, seat.seat_id]
                    );
                }
            }
        }
        catch (error) {
            console.error("Error updating booking_seat from database:", error);
            throw error
        }
    },

    async updateBooking(booking_id, bookingData) {
        const { booking_ticket, booking_seat, ...rest } = bookingData;
        try {
            await this.updateBookingTable(booking_id, rest);
            await this.updateBookingTicket(booking_id, booking_ticket);
            await this.updateBookingSeat(booking_id, booking_seat);

            return await this.getBookingById(booking_id)
        }
        catch (error) {
            console.error('Error updating booking from database:', error);
            throw error;
        }
    },

    async deleteBooking(booking_id) {
        try {
            await db.query(`DELETE FROM booking_seat WHERE booking_id = ?`, [booking_id])
            await db.query(`DELETE FROM booking_ticket WHERE booking_id = ?`, [booking_id])
            const result = await db.query(`DELETE FROM booking WHERE booking_id = ?`, [booking_id])
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting booking from database:", error)
            throw error    
        }
    }
}