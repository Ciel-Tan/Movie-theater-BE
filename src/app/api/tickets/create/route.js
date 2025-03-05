import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { ticket_name, ticket_price } = await request.json();
        const price = parseFloat(ticket_price);

        if (!ticket_name || !ticket_price) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        if (isNaN(price)) {
            return NextResponse.json({ message: "Invalid ticket price" }, { status: 400 })
        }

        const newTicket = await services.ticketService.ticketController.default.createTicket({ ticket_name, ticket_price });

        return NextResponse.json(newTicket, { status: 201 })
    }
    catch (error) {
        console.error("Creating ticket error:", error)
        return NextResponse.json({ message: "Creating ticket failed:", error: error.message }, { status: 500 })
    }
}