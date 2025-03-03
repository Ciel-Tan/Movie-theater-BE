import { directorService } from "../services/directorService";

const directorController = {
    async getAllDirectors () {
        try {
            const directors = await directorService.getAllDirectors()
            return directors
        }
        catch (error) {
            console.error("Error in directorService.getAllDirectors:", error);
            throw error
        }
    },

    async getDirectorById (director_id) {
        try {
            const director = await directorService.getDirectorById(director_id)
            return director
        }
        catch (error) {
            console.error("Error in directorService.getDirectorById:", error);
            throw error
        }
    },

    async createDirector (director_name) {
        try {
            const director = await directorService.createDirector(director_name)
            return director
        }
        catch (error) {
            console.error("Error in directorService.createDirector:", error);
            throw error
        }
    },

    async updateDirector(director_id, director_name) {
        try {
            const update = await directorService.updateDirector(director_id, director_name)
            return update
        }
        catch (error) {
            console.error("Error in directorService.updateDirector:", error);
            throw error
        }
    },

    async deleteDirector(director_id) {
        try {
            await directorService.deleteDirector(director_id)
        }
        catch (error) {
            console.error("Error in directorService.deleteDirector:", error);
            throw error
        }
    },
}

export default directorController