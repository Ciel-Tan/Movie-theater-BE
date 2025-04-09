import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const showtimeData = await request.json();
        const newShowtime = await services.showtimeService.showtimeController.default.createShowtime(showtimeData);
        return NextResponse.json(newShowtime, { status: 201 })
    }
    catch (error) {
        console.error("Error creating showtime:", error);
        return NextResponse.json({ message: "Creating showtime failed:", error: error.message }, { status: 500 })
    }
}