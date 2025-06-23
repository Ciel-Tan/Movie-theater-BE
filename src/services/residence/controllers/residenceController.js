import { residenceService } from "../services/residenceService";

const residenceController = {
    async getAllResidences() {
        try {
            const residences = await residenceService.getAllResidences();
            return residences
        }
        catch (error) {
            console.error("Error getting all residences in residenceService.getAllResidences:", error);
            throw error
        }
    },

    async setResidenceAccount(account_id, residence_id) {
        try {
            const residence = await residenceService.setResidenceAccount(account_id, residence_id);
            return residence
        }
        catch (error) {
            console.error("Error setting residence account in residenceService.setResidenceAccount:", error);   
            throw error
        }
    },
};

export default residenceController