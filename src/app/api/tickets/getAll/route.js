import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allTickets = await services.ticketService.ticketController.default.getAllTickets()
        return NextResponse.json(allTickets, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all tickets:", error);
        return NextResponse.json({ message: "Error getting all tickets:", error: error.message }, { status: 500 })
    }
}