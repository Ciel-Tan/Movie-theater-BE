import { membershipService } from "../../membership/services/membershipService";

const membershipController = {
    async getAllMemberships () {
        try {
            const memberships = await membershipService.getAllMemberships()
            return memberships
        }
        catch (error) {
            console.error("Error in membershipService.getAllMemberships:", error);
            throw error
        }
    },

    async getMembershipById (membership_id) {
        try {
            const membership = await membershipService.getMembershipById(membership_id)
            return membership
        }
        catch (error) {
            console.error("Error in membershipService.getMembershipById:", error);
            throw error
        }
    },

    async createMembership (membershipData) {
        try {
            const membership = await membershipService.createMembership(membershipData)
            return membership
        }
        catch (error) {
            console.error("Error in membershipService.createMembership:", error);
            throw error
        }
    },

    async updateMembership(membership_id, membershipData) {
        try {
            const update = await membershipService.updateMembership(membership_id, membershipData)
            return update
        }
        catch (error) {
            console.error("Error in membershipService.updateMembership:", error);
            throw error
        }
    },

    async deleteMembership(membership_id) {
        try {
            await membershipService.deleteMembership(membership_id)
        }
        catch (error) {
            console.error("Error in membershipService.deleteMembership:", error);
            throw error
        }
    },
}

export default membershipController