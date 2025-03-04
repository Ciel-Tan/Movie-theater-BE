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
                    d.director_id,
                    d.director_name,

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
        const movies = await this.getMovieQuery()

        return movies.map(movie => ({
            movie_id: movie.movie_id,
            title: movie.title,
            poster_image: movie.poster_image,
            poster_url: movie.poster_url,
            description: movie.description,
            age_rating: movie.age_rating,
            run_time: movie.run_time,
            release_date: movie.release_date,
            trailer_link: movie.trailer_link,
            language: movie.language,
            genres: movie.genres,
            director: {
                director_id: movie.director_id,
                director_name: movie.director_name
            },
            actors: movie.actors,
            showtime: movie.showtime
        }));
    },

    async getMovieById(movie_id) {
        const movies = await this.getMovieQuery(movie_id)
        const movie = movies[0]

        return {
            movie_id: movie.movie_id,
            title: movie.title,
            poster_image: movie.poster_image,
            poster_url: movie.poster_url,
            description: movie.description,
            age_rating: movie.age_rating,
            run_time: movie.run_time,
            release_date: movie.release_date,
            trailer_link: movie.trailer_link,
            language: movie.language,
            genres: movie.genres,
            director: {
                director_id: movie.director_id,
                director_name: movie.director_name
            },
            actors: movie.actors,
            showtime: movie.showtime
        }
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
            const { genre_ids, actor_ids, ...rest } = movieData;
            
            const movie_id = await this.createMovieTable(rest)
            await this.createMovieRelationships(movie_id, genre_ids, 'movie_genre', 'genre_id')
            await this.createMovieRelationships(movie_id, actor_ids, 'movie_actor', 'actor_id')

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
                release_date, trailer_link, language, director_id,
            } = movieData

            // Update the movie
            await db.query(
                `UPDATE movie SET
                 poster_image = ?, title = ?, description = ?, age_rating = ?, 
                 run_time = ?, 
                 release_date = ?, trailer_link = ?, language = ? director_id = ?
                 WHERE movie_id = ?`,
                [
                    poster_image, title, description, age_rating, run_time,
                    release_date, trailer_link, language, director_id, movie_id
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
                const existingRelated = await db.query(`SELECT ${column} FROM ${table} WHERE movie_id = ?`, [movie_id]);
                
                const existingRelatedIds = existingRelated.map(row => row[column]);

                const relatedToRemove = existingRelatedIds.filter(existingId => !list_ids.includes(existingId));

                const relatedToAdd = list_ids.filter(newId => !existingRelatedIds.includes(newId));

                if (relatedToRemove.length > 0) {
                    await db.query(
                        `DELETE FROM ${table} WHERE movie_id = ? AND ${column} IN (?)`,
                        [movie_id, relatedToRemove]
                    );
                }

                if (relatedToAdd.length > 0) {
                    const values = relatedToAdd.map(relatedId => [movie_id, relatedId]);
                    await db.query(`INSERT INTO ${table} (movie_id, ${column}) VALUES ?`, [values]);
                }
            }
            else await db.query(`DELETE FROM ${table} WHERE movie_id = ?`, [movie_id]);
        }
        catch (error) {
            console.error("Error updating movie relationships in database:", error);
            throw error;
        }
    },

    async updateMovieShowtime(movie_id, showtime) {
        try {
            await db.query(`DELETE FROM showtime WHERE movie_id = ?`, [movie_id]);

            if (showtime && showtime.length > 0) {
                const values = showtime.map(st => [
                    movie_id,
                    st.room_id,
                    st.show_datetime,
                ]);
                await db.query(`INSERT INTO showtime (movie_id, room_id, show_datetime) VALUES ?`, [values]);
            }
        }
        catch (error) {
            console.error("Error updating movie showtime in database:", error);
            throw error;
        }
    },

    async updateMovie(movie_id, movieData) {
        try {
            const { genre_ids, actor_ids, showtime, ...rest } = movieData;
            
            await this.updateMovieTable(movie_id, rest);
            await this.updateMovieRelationships(movie_id, genre_ids, 'movie_genre', 'genre_id');
            await this.updateMovieRelationships(movie_id, actor_ids, 'movie_actor', 'actor_id');
            await this.updateMovieShowtime(movie_id, showtime)

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
            await db.query(`DELETE FROM movie WHERE movie_id = ?`, [movie_id])
            await db.query(`DELETE FROM movie_genre WHERE movie_id = ?`, [movie_id])
            await db.query(`DELETE FROM movie_actor WHERE movie_id = ?`, [movie_id])
            await db.query(`DELETE FROM showtime WHERE movie_id = ?`, [movie_id])
        }
        catch (error) {
            console.error("Error deleting movie in database:", error);
            throw error;
        }
    }
};