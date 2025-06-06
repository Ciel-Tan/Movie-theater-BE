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

    async getMovieNowShowing() {
        try {
            const movies = await movieService.getMovieNowShowing();
            return movies;
        }
        catch (error) {
            console.error("Error fetching now showing movies:", error);
            throw error;
        }
    },

    async getMovieComingSoon() {
        try {
            const movies = await movieService.getMovieComingSoon();
            return movies;
        }
        catch (error) {
            console.error("Error fetching coming soon movies:", error);
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
            return await movieService.deleteMovie(movie_id)
        }
        catch (error) {
            console.error("Error deleting movie:", error);
            throw error;
        }
    }
};

export default movieController