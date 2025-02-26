// services/movie/controllers/movieController.js
import { movieService } from '../services/movieService';

const movieController = {
    async getAllMovies() {
        try {
            const movies = await movieService.getAllMovies();
            return movies;
        }
        catch (error) {
            console.error("Error fetching movies:", error);
            throw error;
        }
    },

    async getMovieById(movie_id) {
        try {
            const movie = await movieService.getMovieById(movie_id);
            return movie;
        }
        catch (error) {
            console.error("Error fetching movie:", error);
            throw error;
        }
    },

    async createMovie(movieData) {
        try {
            const movie = await movieService.createMovie(movieData);
            return movie;
        }
        catch (error) {
            console.error("Error creating movie:", error);
            throw error;
        }
    },

    async updateMovie(movie_id, movieData) {
        try {
            const movie = await movieService.updateMovie(movie_id, movieData);
            return movie;
        }
        catch (error) {
            console.error("Error updating movie:", error);
            throw error;
        }
    },

    async deleteMovie(movie_id) {
        try {
            const result = await movieService.deleteMovie(movie_id)
            return result
        }
        catch (error) {
            console.error("Error deleting movie:", error);
            throw error;
        }
    }
};

export default movieController