import db from '../../../../db';

export const ticketService = {
    async getAllTickets () {
        try {
            const tickets = await db.query('SELECT * FROM ticket');
            return tickets
        }
        catch (error) {
            console.error("Error getting all tickets:", error);
            throw error    
        }
    },

    async getTicketById (ticket_id) {
        try {
            const ticket = await db.query('SELECT * FROM ticket WHERE ticket_id = ?', [ticket_id]);
            return ticket[0]
        }
        catch (error) {
            console.error("Error getting ticket by id:", error);
            throw error    
        }
    },

    async createTicket (ticketData) {
        try {
            const { ticket_name, ticket_price } = ticketData
            const name = ticket_name.replace(/\s+/g, ' ').trim();

            const result = await db.query(
                'INSERT INTO ticket SET ticket_name = ?, ticket_price = ?',
                [name, ticket_price]
            );

            const ticketById = await this.getTicketById(result.insertId);
            return ticketById
        }
        catch (error) {
            console.error("Error creating ticket:", error);
            throw error    
        }
    },

    async updateTicket(ticket_id, ticketData) {
        try {
            const { ticket_name, ticket_price } = ticketData
            await db.query(
                `UPDATE ticket
                 SET ticket_name = ?, ticket_price = ?
                 WHERE ticket_id = ?`,
                [ticket_name, ticket_price, ticket_id]
            )

            const ticket = await this.getTicketById(ticket_id)
            return ticket
        }
        catch (error) {
            console.error("Error updating ticket from database:", error)
            throw error
        }
    },

    async deleteTicket(ticket_id) {
        try {
            await db.query('UPDATE booking_ticket SET ticket_id = NULL WHERE ticket_id = ?', [ticket_id])
            const result = await db.query(`DELETE FROM ticket WHERE ticket_id = ?`, [ticket_id])
            
            return result.affectedRows
        }
        catch (error) {
            console.error("Error deleting ticket from database:", error)
            throw error
        }
    }
}