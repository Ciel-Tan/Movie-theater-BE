import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allBooking = await services.bookingService.bookingController.default.getAllBooking()
        return NextResponse.json(allBooking, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all booking:", error);
        return NextResponse.json({ message: "Error getting all booking:", error: error.message }, { status: 500 })
    }
}