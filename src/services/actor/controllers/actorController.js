import { actorService } from "../services/actorService";


const actorController = {
    async getAllActors () {
        try {
            const actors = await actorService.getAllActors()
            return actors
        }
        catch (error) {
            console.error("Error in actorService.getAllActors:", error);
            throw error
        }
    },

    async getActorById (actor_id) {
        try {
            const actor = await actorService.getActorById(actor_id)
            return actor
        }
        catch (error) {
            console.error("Error in actorService.getActorById:", error);
            throw error
        }
    },

    async createActor (actor_name) {
        try {
            const actor = await actorService.createActor(actor_name)
            return actor
        }
        catch (error) {
            console.error("Error in actorService.createActor:", error);
            throw error
        }
    },

    async updateActor(actor_id, actor_name) {
        try {
            const update = await actorService.updateActor(actor_id, actor_name)
            return update
        }
        catch (error) {
            console.error("Error in actorService.updateActor:", error);
            throw error
        }
    }
}

export default actorController