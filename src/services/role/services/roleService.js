import db from '../../../../db';

export const roleService = {
    async getAllRoles() {
        try {
            const roles = await db.query(`SELECT * FROM role`);
            return roles
        }
        catch (error) {
            console.error("Error getting role from database:", error);
            throw error 
        }
    }
}