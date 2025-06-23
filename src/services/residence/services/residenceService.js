import db from '../../../../db';

export const residenceService = {
    async getAllResidences() {
        try {
            const residences = await db.query(`SELECT * FROM residence`);
            return residences
        }
        catch (error) {
            console.error("Error getting residence from database:", error);
            throw error 
        }
    },

    async setResidenceAccount(account_id, residence_id) {
        try {   
            const residence = await db.query(`UPDATE account SET residence_id = ? WHERE account_id = ?`, [residence_id, account_id]);
            return residence
        }
        catch (error) {
            console.error("Error setting residence account in database:", error);
            throw error
        }
    }
}