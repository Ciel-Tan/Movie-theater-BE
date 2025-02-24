// services/movie/services/movieService.js
const db = require('../../../../db');

const getAllMovies = async () => {
    try {
        const sql = 'SELECT * FROM movie';
        const movies = await db.query(sql);
        return movies;
    }
    catch (error) {
        console.error("Error fetching movies from database:", error);
        throw error;
    }
};

const getMovieById = async (movieId) => {
    try {
        const sql = 'SELECT * FROM movie WHERE movie_id = ?';
        const values = [movieId];
        const movies = await db.query(sql, values);
        return movies[0];
    } catch (error) {
        console.error(`Error fetching movie by ID ${movieId} from database:`, error);
        throw error;
    }
};


export default {
    getAllMovies,
    getMovieById,
    // ... other service functions
};