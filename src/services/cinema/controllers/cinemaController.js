import { cinemaService } from "../services/cinemaService";


const genreController = {
    async getAlCinemas () {
        try {
            const cinemas = await cinemaService.getAllCinemas()
            return cinemas
        }
        catch (error) {
            console.error("Error in cinemaService.getAllCinemas:", error);
            throw error
        }
    }
}

export default genreController