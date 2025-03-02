import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allShowtime = await services.showtimeService.showtimeController.default.getAllShowtime()
        return NextResponse.json(allShowtime, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all showtime:", error);
        return NextResponse.json({ message: "Error getting all showtime:", error: error.message }, { status: 500 })
    }
}