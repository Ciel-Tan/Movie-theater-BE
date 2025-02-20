// services/movie/services/movieService.js
const db = require('../../../../db'); // Adjust path to your db.js

const getAllMovies = async () => {
    try {
        const sql = 'SELECT * FROM movie'; // SQL query to get all movies
        const movies = await db.query(sql);
        return movies; // Return the movie data fetched from MySQL
    } catch (error) {
        console.error("Error fetching movies from database:", error);
        throw error; // Re-throw the error to be handled by the controller
    }
};

const getMovieById = async (movieId) => {
    try {
        const sql = 'SELECT * FROM movie WHERE movie_id = ?'; // SQL query with placeholder
        const values = [movieId];
        const movies = await db.query(sql, values);
        return movies[0]; // Assuming movie_id is unique, return the first movie or undefined
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