import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { movie_id, room_id, show_datetime } = await request.json();

        if (!movie_id || !room_id || !show_datetime) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const newShowtime = await services.showtimeService.showtimeController.default.createShowtime({ movie_id, room_id, show_datetime });

        return NextResponse.json(newShowtime, { status: 201 })
    }
    catch (error) {
        console.error("Error creating showtime:", error);
        return NextResponse.json({ message: "Creating showtime failed:", error: error.message }, { status: 500 })
    }
}