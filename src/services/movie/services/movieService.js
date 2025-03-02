// services/movie/services/movieService.js
const db = require('../../../../db');

export const movieService = {
    async getAllMovies() {
        try {
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
                            'show_datetime', st_sub.show_datetime,
                            'room_id', st_sub.room_id
                        ) AS showtime_json
                        FROM showtime st_sub
                        WHERE st_sub.movie_id = m.movie_id
                    ) AS distinct_showtime
                    ) AS showtime

                FROM movie m
                LEFT JOIN director d ON m.director_id = d.director_id
                GROUP BY m.movie_id, d.director_id, d.director_name`,
            );

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
        }
        catch (error) {
            console.error("Error fetching movies from database:", error);
            throw error;
        }
    },

    async getMovieById(movie_id) {
        try {
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
                            'show_datetime', st_sub.show_datetime,
                            'room_id', st_sub.room_id
                        ) AS showtime_json
                        FROM showtime st_sub
                        WHERE st_sub.movie_id = m.movie_id
                    ) AS distinct_showtime
                    ) AS showtime

                FROM movie m
                LEFT JOIN director d ON m.director_id = d.director_id
                WHERE m.movie_id = ?
                GROUP BY m.movie_id, d.director_id, d.director_name`,
                [movie_id]
            );

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
        }
        catch (error) {
            console.error(`Error fetching movie by ID ${movie_id} from database:`, error);
            throw error;
        }
    },

    async createMovie(movieData) {
        try {
            const { genre_ids, actor_ids, ...rest } = movieData;
            const {
                poster_image, title, description, age_rating,
                run_time,
                release_date, trailer_link, language, director_id,
            } = rest

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

            const movie_id = addMovie.insertId;

            if (genre_ids && Array.isArray(genre_ids) && genre_ids.length > 0) {
                for (const genre_id in genre_ids) {
                    await db.query(
                        'INSERT INTO movie_genre SET movie_id = ?, genre_id = ?', 
                        [movie_id, genre_id]
                    );
                }
            }

            if (actor_ids && Array.isArray(actor_ids) && actor_ids.length > 0) {
                for (const actor_id in actor_ids) {
                    await db.query(
                        'INSERT INTO movie_actor SET movie_id = ?, actor_id = ?', 
                        [movie_id, actor_id]
                    );
                }
            }

            const movie = await this.getMovieById(movie_id);
            return movie;
        }
        catch (error) {
            console.error("Error creating movie in database:", error);
            throw error;
        }
    },

    async updateMovie(movie_id, movieData) {
        try {
            const {
                poster_image, title, description, age_rating,
                run_time,
                release_date, trailer_link, language, director_id,
            } = movieData

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
            await db.query(`DELETE FROM movie_actor WHERE movie_id = ?`, [movie_id])

            return { message: "Delete movie successfully" }
        }
        catch (error) {
            console.error("Error deleting movie in database:", error);
            throw error;
        }
    }
};