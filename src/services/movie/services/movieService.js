// services/movie/services/movieService.js
const db = require('../../../../db');

export const movieService = {
    async getMovieQuery(movie_id = null) {
        try {
            let whereClause = ''
            let queryParams = []

            if (movie_id != null) {
                whereClause = 'Where m.movie_id = ?'
                queryParams = [movie_id]
            }

            const movies = await db.query(
                `SELECT
                    m.movie_id, m.title, m.poster_image, m.poster_url, m.description,
                    m.age_rating, m.run_time, m.release_date, m.trailer_link, m.language,
                    
                    JSON_OBJECT(
                        'director_id', d.director_id,
                        'director_name', d.director_name
                    ) AS director,

                    (SELECT JSON_ARRAYAGG(genre_json)
                    FROM (
                        SELECT DISTINCT JSON_OBJECT(
                            'genre_id', g_sub.genre_id,
                            'genre_name', g_sub.genre_name
                        ) AS genre_json
                        FROM movie_genre mg_sub
                        JOIN genre g_sub ON mg_sub.genre_id = g_sub.genre_id
                        WHERE mg_sub.movie_id = m.movie_id
                    ) AS distinct_genres
                    ) AS genres,

                    (SELECT JSON_ARRAYAGG(actor_json)
                    FROM (
                        SELECT DISTINCT JSON_OBJECT(
                            'actor_id', a_sub.actor_id,
                            'actor_name', a_sub.actor_name
                        ) AS actor_json
                        FROM movie_actor ma_sub
                        JOIN actor a_sub ON ma_sub.actor_id = a_sub.actor_id
                        WHERE ma_sub.movie_id = m.movie_id
                    ) AS distinct_actors
                    ) AS actors,

                    (SELECT JSON_ARRAYAGG(showtime_json)
                    FROM (
                        SELECT DISTINCT JSON_OBJECT(
                            'showtime_id', st_sub.showtime_id,
                            'movie_id', st_sub.movie_id,
                            'room', JSON_OBJECT(
                                'room_id', r_sub.room_id,
                                'room_name', r_sub.room_name
                            ),
                            'show_datetime', st_sub.show_datetime
                        ) AS showtime_json
                        FROM showtime st_sub
                        JOIN room r_sub ON st_sub.room_id = r_sub.room_id
                        WHERE st_sub.movie_id = m.movie_id
                    ) AS distinct_showtime
                    ) AS showtime

                FROM movie m
                LEFT JOIN director d ON m.director_id = d.director_id
                ${whereClause}
                GROUP BY m.movie_id, d.director_id, d.director_name`,
                queryParams
            );

            return movies
        }
        catch (error) {
            console.error("Error executing query get movie query in database:", error)
            throw error
        }
    },

    async getAllMovies() {
        return await this.getMovieQuery()
    },

    async getMovieById(movie_id) {
        const movies = await this.getMovieQuery(movie_id)
        return movies[0]
    },

    async createMovieTable(movieData) {
        try {
            const {
                poster_image, title, description, age_rating,
                run_time,
                release_date, trailer_link, language, director_id,
            } = movieData

            const addMovie = await db.query(
                `INSERT INTO movie SET
                 poster_image = ?, title = ?, description = ?, age_rating = ?, 
                 run_time = ?, 
                 release_date = ?, trailer_link = ?, language = ? director_id = ?`,
                [
                    poster_image, title, description, age_rating,
                    run_time,
                    release_date, trailer_link, language, director_id,
                ]
            );

            return addMovie.insertId
        }
        catch (error) {
            console.error("Error creating movie in database:", error)
            throw error
        }
    },

    async createMovieRelationships(movie_id, list_ids, table, column) {
        try {
            if (list_ids && Array.isArray(list_ids) && list_ids.length > 0) {
                for (const id in list_ids) {
                    await db.query(
                        `INSERT INTO ${table} SET movie_id = ?, ${column} = ?`, 
                        [movie_id, id]
                    );
                }
            }
        }
        catch (error) {
            console.error(`Error creating ${table} in database:`, error)
            throw error   
        }
    },

    async createMovie(movieData) {
        try {
            const { genre, actor, ...rest } = movieData;
            
            const movie_id = await this.createMovieTable(rest)
            await this.createMovieRelationships(movie_id, genre, 'movie_genre', 'genre_id')
            await this.createMovieRelationships(movie_id, actor, 'movie_actor', 'actor_id')

            const movie = await this.getMovieById(movie_id);
            return movie;
        }
        catch (error) {
            console.error("Error creating movie in database:", error);
            throw error;
        }
    },

    async updateMovieTable(movie_id, movieData) {
        try {
            const {
                poster_image, title, description, age_rating,
                run_time,
                release_date, trailer_link, language, director,
            } = movieData

            const existingDirector = await db.query(
                `SELECT * FROM director WHERE director_name = ?`,
                [director.director_name]
            )

            console.log(existingDirector)

            if (existingDirector.length === 0) {
                const newDirector = await db.query(
                    `INSERT INTO director SET director_name = ?`,
                    [director.director_name]
                )
                director.director_id = newDirector.insertId
            }

            // Update the movie
            await db.query(
                `UPDATE movie SET
                 poster_image = ?, title = ?, description = ?, age_rating = ?, 
                 run_time = ?, 
                 release_date = ?, trailer_link = ?, language = ?, director_id = ?
                 WHERE movie_id = ?`,
                [
                    poster_image, title, description, age_rating, run_time,
                    release_date, trailer_link, language, director.director_id, movie_id
                ]
            )
        }
        catch (error) {
            console.error("Error updating movie in database:", error);
            throw error;
        }
    },

    async updateMovieRelationships(movie_id, list_ids, table, column) {
        try {
            if (list_ids && list_ids.length > 0) {
                const newIds = list_ids.map(item => (typeof item === 'object' ? item[column] : item));

                const existingRelated = await db.query(
                    `SELECT ${column} FROM ${table} WHERE movie_id = ?`,
                    [movie_id]
                );
                const existingRelatedIds = existingRelated.map(row => row[column]);

                const relatedToRemove = existingRelatedIds.filter(existingId => !newIds.includes(existingId));
                const relatedToAdd = newIds.filter(newId => !existingRelatedIds.includes(newId));

                if (relatedToRemove.length > 0) {
                    await db.query(
                        `DELETE FROM ${table} WHERE movie_id = ? AND ${column} IN (?)`,
                        [movie_id, relatedToRemove]
                    );
                }

                if (relatedToAdd.length > 0) {
                    // Dynamically create placeholders for bulk insert
                    const values = relatedToAdd.map(relatedId => [movie_id, relatedId]);
                    const placeholders = values.map(() => "(?, ?)").join(", ");
                    const flatValues = values.flat();
                    const sql = `INSERT INTO ${table} (movie_id, ${column}) VALUES ${placeholders}`;
                    await db.query(sql, flatValues);
                }
            } else {
                await db.query(`DELETE FROM ${table} WHERE movie_id = ?`, [movie_id]);
            }
        }
        catch (error) {
            console.error("Error updating movie relationships in database:", error);
            throw error;
        }
    },

    async updateMovieShowtime(movie_id, showtime) {
        try {
            const existingShowtime = await db.query(
                `SELECT showtime_id FROM showtime WHERE movie_id = ?`,
                [movie_id]
            );
            const existingIds = existingShowtime.map(row => row.showtime_id);

            for (const st of showtime) {
                if (st.showtime_id && existingIds.includes(st.showtime_id)) {
                    await db.query(
                        `UPDATE showtime 
                         SET room_id = ?, show_datetime = ?
                         WHERE showtime_id = ? AND movie_id = ?`,
                        [st.room.room_id, st.show_datetime, st.showtime_id, movie_id]
                    );
                } else {
                    await db.query(
                        `INSERT INTO showtime (movie_id, room_id, show_datetime) 
                         VALUES (?, ?, ?)`,
                        [movie_id, st.room.room_id, st.show_datetime]
                    );
                }
            }
        }
        catch (error) {
            console.error("Error updating movie showtime in database:", error);
            throw error;
        }
    },

    async updateMovie(movie_id, movieData) {
        try {
            const { genres, actors, showtime, ...rest } = movieData;
            
            await this.updateMovieShowtime(movie_id, showtime)
            await this.updateMovieRelationships(movie_id, genres, 'movie_genre', 'genre_id');
            await this.updateMovieRelationships(movie_id, actors, 'movie_actor', 'actor_id');
            await this.updateMovieTable(movie_id, rest);

            const movie = await this.getMovieById(movie_id)
            return movie
        }
        catch (error) {
            console.error("Error updating movie in database:", error);
            throw error;
        }
    },

    async deleteMovie(movie_id) {
        try {
            await db.query(`DELETE FROM showtime WHERE movie_id = ?`, [movie_id])
            await db.query(`DELETE FROM movie_actor WHERE movie_id = ?`, [movie_id])
            await db.query(`DELETE FROM movie_genre WHERE movie_id = ?`, [movie_id])
            const result = await db.query(`DELETE FROM movie WHERE movie_id = ?`, [movie_id])

            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting movie in database:", error);
            throw error;
        }
    }
};