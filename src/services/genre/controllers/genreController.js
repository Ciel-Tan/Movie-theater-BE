import { genreService } from "../services/genreService";


const genreController = {
    async getAllGenres () {
        try {
            const genres = await genreService.getAllGenres()
            return genres
        }
        catch (error) {
            console.error("Error in genreService.getAllGenres:", error);
            throw error
        }
    },

    async getGenreById (genre_id) {
        try {
            const genre = await genreService.getGenreById(genre_id)
            return genre
        }
        catch (error) {
            console.error("Error in genreService.getGenreById:", error);
            throw error
        }
    },

    async createGenre (genre_name) {
        try {
            const genre = await genreService.createGenre(genre_name)
            return genre
        }
        catch (error) {
            console.error("Error in genreService.createGenre:", error);
            throw error
        }
    },

    async updateGenre(genre_id, genre_name) {
        try {
            const update = await genreService.updateGenre(genre_id, genre_name)
            return update
        }
        catch (error) {
            console.error("Error in genreService.updateGenre:", error);
            throw error
        }
    },

    async deleteGenre(genre_id) {
        try {
            const deleted = await genreService.deleteGenre(genre_id)
            return deleted
        }
        catch (error) {
            console.error("Error in genreService.deleteGenre:", error);
            throw error
        }
    },
}

export default genreController