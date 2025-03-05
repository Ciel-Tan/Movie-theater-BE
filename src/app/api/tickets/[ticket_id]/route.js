import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const ticket_id = parseInt(awaitedParams.ticket_id, 10)
        
        if (isNaN(ticket_id)) {
            return NextResponse.json({ message: "Invalid ticket id" }, { status: 400 })
        }

        if (!ticket_id) {
            return NextResponse.json({ message: "ticket_id is required" }, { status: 400 })
        }

        const ticket = await services.ticketService.ticketController.default.getTicketById(ticket_id)

        if (!ticket) {
            return NextResponse.json({ message: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json(ticket, { status: 200 })
    }
    catch (error) {
        console.error("Getting ticket info error:", error)
        return NextResponse.json({ message: "Getting info ticket failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const ticket_id = parseInt(awaitedParams.ticket_id, 10)
        const { ticket_name, ticket_price } = await request.json()

        const price = parseFloat(ticket_price)

        if (isNaN(ticket_id) || isNaN(price)) {
            return NextResponse.json({ message: "Invalid ticket id or ticket price" }, { status: 400 })
        }

        if (!ticket_id || !ticket_price || !ticket_name) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const update = await services.ticketService.ticketController.default.updateTicket(ticket_id, {ticket_name, ticket_price})

        if (!update) {
            return NextResponse.json({ message: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Updating ticket info error:", error)
        return NextResponse.json({ message: "Updating info ticket failed:", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const ticket_id = parseInt(awaitedParams.ticket_id, 10);

        if (isNaN(ticket_id)) {
            return NextResponse.json({ message: "Invalid ticket id" }, { status: 400 })
        }

        if (!ticket_id) {
            return NextResponse.json({ message: "Ticket id is required" }, { status: 400 })
        }

        const deletedTicket = await services.ticketService.ticketController.default.deleteTicket(ticket_id);

        if (!deletedTicket) {
            return NextResponse.json({ message: "Ticket not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Ticket deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting ticket:", error);
        return NextResponse.json({ message: "Deleting ticket failed:", error: error.message }, { status: 500 })   
    }
}