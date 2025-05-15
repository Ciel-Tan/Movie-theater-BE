import db from "../../../../db";

export const showtimeService = {
    async getShowtimeQuery(showtime_id = null) {
        try {
            let whereClause = ''
            let queryParams = []

            if (showtime_id != null) {
                whereClause = 'Where st.showtime_id = ?'
                queryParams = [showtime_id]
            }

            const showtime = await db.query(
                `SELECT
                    st.showtime_id,

                    JSON_OBJECT(
                        'cinema_id', c.cinema_id,
                        'cinema_name', c.cinema_name,
                        'address', JSON_OBJECT(
                            'address_id', a.address_id,
                            'address_name', a.address_name
                        )
                    ) AS cinema,
                    
                    JSON_OBJECT(
                        'movie_id', m.movie_id,
                        'poster_image', m.poster_image,
                        'poster_url', m.poster_url,
                        'title', m.title,
                        'description', m.description,
                        'age_rating', m.age_rating,
                        'run_time', m.run_time,
                        'release_date', m.release_date,
                        'trailer_link', m.trailer_link,
                        'language', m.language,
                        'director_id', m.director_id
                    ) AS movie,

                    JSON_OBJECT(
                        'room_id', r.room_id,
                        'room_name', r.room_name
                    ) AS room,
                    
                    DATE_FORMAT(st.show_datetime, '%Y-%m-%d %H:%i:%s.000000') AS show_datetime
                 FROM showtime st
                 JOIN movie m ON st.movie_id = m.movie_id
                 JOIN room r ON st.room_id = r.room_id
                 JOIN cinema c ON st.cinema_id = c.cinema_id
                 JOIN address a ON c.address_id = a.address_id
                 ${whereClause}`, queryParams
            );

            return showtime
        }
        catch (error) {
            console.error('Error getting showtime from database:', error);
            throw error;
        }
    },

    async getAllShowtime() {
        return await this.getShowtimeQuery()
    },

    async getShowtimeById(showtime_id) {
        const showtime = await this.getShowtimeQuery(showtime_id)
        return showtime[0]
    },

    async createMovieShowtime(movieData) {
        const { title } = movieData;
        try {
            const existingMovie = await db.query(
                `SELECT movie_id FROM movie WHERE title = ?`,
                [title],
            );

            if (existingMovie.length > 0) {
                return existingMovie[0].movie_id
            }

            const movie = await db.query(`INSERT INTO movie SET title = ?`, [title]);
            return movie.insertId
        }
        catch (error) {
            console.error('Error creating movie from database:', error);
            throw error;
        }
    },

    async createShowtimeTable(movie_id, cinema_id, room_id, show_datetime) {
        try {
            const showtime = await db.query(
                `INSERT INTO showtime SET
                 movie_id = ?, cinema_id = ?, room_id = ?, show_datetime = ?`,
                [movie_id, cinema_id, room_id, show_datetime.slice(0, 19).replace('T', ' ')],
            );
            
            return showtime.insertId
        }
        catch (error) {
            console.error('Error creating showtime from database:', error);
            throw error;
        }
    },

    async createShowtime(showtimeData) {
        const { movie, cinema, room, show_datetime } = showtimeData;

        const movie_id = await this.createMovieShowtime(movie)
        const showtime_id = await this.createShowtimeTable(movie_id, cinema.cinema_id, room.room_id, show_datetime)

        return await this.getShowtimeById(showtime_id)
    },

    async updateMovie(movieData) {
        const { movie_id, title } = movieData;
        
        try {
            await db.query(
                `UPDATE movie SET
                 title = ?
                 WHERE movie_id = ?`,
                [title, movie_id],
            );
        }
        catch (error) {
            console.error('Error updating movie from database:', error);
            throw error;
        }
    },

    async updateRoom(showtime_id, roomData) {
        const { room_id } = roomData;
        
        try {
            await db.query(
                `UPDATE showtime SET
                 room_id = ?
                 WHERE showtime_id = ?`,
                [room_id, showtime_id],
            );
        }
        catch (error) {
            console.error('Error updating room from database:', error);
            throw error;
        }
    },

    async updateShowtimeTable(showtime_id, show_datetime) {
        try {
            await db.query(
                `UPDATE showtime SET
                 show_datetime = ?
                 WHERE showtime_id = ?`,
                [show_datetime, showtime_id],
            );
        }
        catch (error) {
            console.error('Error updating showtime from database:', error);
            throw error;
        }
    },

    async updateShowtime(showtime_id, showtimeData) {
        const { movie, room, show_datetime } = showtimeData;

        await this.updateMovie(movie);
        await this.updateRoom(showtime_id, room);
        await this.updateShowtimeTable(showtime_id, show_datetime);

        const updatedShowtime = await this.getShowtimeById(showtime_id);
        return updatedShowtime
    },

    async deleteShowtime(showtime_id) {
        try {
            await db.query(`DELETE FROM booking WHERE showtime_id = ?`, [showtime_id])
            const result = await db.query(`DELETE FROM showtime WHERE showtime_id = ?`, [showtime_id])
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting showtime from database:", error)
            throw error    
        }
    }
}