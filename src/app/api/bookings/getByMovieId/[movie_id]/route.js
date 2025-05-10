import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const movie_id = parseInt(awaitedParams.movie_id, 10);

        if(isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if(!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const booking = await services.bookingService.bookingController.default.getBookingByMovieId(movie_id);

        if(!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        return NextResponse.json(booking, { status: 200 })
    }
    catch (error) {
        console.error("Error getting booking by movie id:", error);
        return NextResponse.json({ message: "Getting booking by movie id failed:", error: error.message }, { status: 500 })
    }
}