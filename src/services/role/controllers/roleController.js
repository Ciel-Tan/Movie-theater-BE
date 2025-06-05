import { roleService } from "../services/roleService";

const roleController = {
    async getAllRoles() {
        try {
            const roles = await roleService.getAllRoles();
            return roles
        }
        catch (error) {
            console.error("Error getting all roles in roleService.getAllRoles:", error);
            throw error
        }
    },
};

export default roleController