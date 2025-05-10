import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allSeats = await services.seatService.seatController.default.getAllSeats()
        return NextResponse.json(allSeats, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all seats:", error);
        return NextResponse.json({ message: "Error getting all seats:", error: error.message }, { status: 500 })
    }
}