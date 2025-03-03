import db from '../../../../db';

export const membershipService = {
    async getAllMemberships () {
        try {
            const memberships = await db.query('SELECT * FROM membership_type');
            return memberships
        }
        catch (error) {
            console.error("Error getting all memberships:", error);
            throw error    
        }
    },

    async getMembershipById (membership_id) {
        try {
            const membership = await db.query('SELECT * FROM membership_type WHERE membership_id = ?', [membership_id]);
            return membership[0]
        }
        catch (error) {
            console.error("Error getting membership by id:", error);
            throw error    
        }
    },

    async createMembership (membershipData) {
        try {
            const { membership_name, discount_rate } = membershipData
            membership_name = membership_name.replace(/\s+/g, ' ').trim();

            const result = await db.query(
                'INSERT INTO membership_type SET membership_name = ?, discount_rate = ?',
                [membership_name, discount_rate]
            );

            const membershipById = await this.getMembershipById(result.insertId);
            return membershipById
        }
        catch (error) {
            console.error("Error creating membership:", error);
            throw error    
        }
    },

    async updateMembership(membership_id, membershipData) {
        try {
            const { membership_name, discount_rate } = membershipData
            await db.query(
                `UPDATE membership_type
                 SET membership_name = ?, discount_rate = ?
                 WHERE membership_id = ?`,
                [membership_name, discount_rate, membership_id]
            )

            const membership = await this.getMembershipById(membership_id)

            return membership
        }
        catch (error) {
            console.error("Error updating membership from database:", error)
            throw error
        }
    },

    async deleteMembership(membership_id) {
        try {
            await db.query(`DELETE FROM membership_type WHERE membership_id = ?`, [membership_id])
            await db.query('UPDATE account SET membership_id = NULL WHERE membership_id = ?', [membership_id])
        }
        catch (error) {
            console.error("Error deleting membership from database:", error)
            throw error
        }
    }
}