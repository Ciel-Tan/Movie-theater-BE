import { services } from "@/src/services";
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
    try {
        const movieData = await request.json();

        const newMovie = await services.movieService.movieController.default.createMovie(movieData);

        return NextResponse.json(newMovie, { status: 201 })
    }
    catch (error) {
        console.error("Creating movie error:", error)
        return NextResponse.json({ message: "Creating movie failed:", error: error.message }, { status: 500 })
    }
}