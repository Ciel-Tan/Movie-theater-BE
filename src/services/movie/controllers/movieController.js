// services/movie/controllers/movieController.js
import movieService from '../services/movieService';

const getMovies = async () => {
    try {
        const movies = await movieService.getAllMovies();
        return movies;
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
};

const getMovieById = async (movieId) => {
    try {
        const movie = await movieService.getMovieById(movieId);
        if (movie) {
            return movie;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
    }
};

export default {
    getMovies,
    getMovieById
};