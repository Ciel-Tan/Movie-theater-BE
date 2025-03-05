import { ticketService } from "../../ticket/services/ticketService";

const ticketController = {
    async getAllTickets () {
        try {
            const tickets = await ticketService.getAllTickets()
            return tickets
        }
        catch (error) {
            console.error("Error in ticketService.getAllTickets:", error);
            throw error
        }
    },

    async getTicketById (ticket_id) {
        try {
            const ticket = await ticketService.getTicketById(ticket_id)
            return ticket
        }
        catch (error) {
            console.error("Error in ticketService.getTicketById:", error);
            throw error
        }
    },

    async createTicket (ticketData) {
        try {
            const ticket = await ticketService.createTicket(ticketData)
            return ticket
        }
        catch (error) {
            console.error("Error in ticketService.createTicket:", error);
            throw error
        }
    },

    async updateTicket(ticket_id, ticketData) {
        try {
            const update = await ticketService.updateTicket(ticket_id, ticketData)
            return update
        }
        catch (error) {
            console.error("Error in ticketService.updateTicket:", error);
            throw error
        }
    },

    async deleteTicket(ticket_id) {
        try {
            return await ticketService.deleteTicket(ticket_id)
        }
        catch (error) {
            console.error("Error in ticketService.deleteTicket:", error);
            throw error
        }
    },
}

export default ticketController