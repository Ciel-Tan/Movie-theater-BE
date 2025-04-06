import { services } from "@/src/services";
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
    try {
        const movieData = await request.json();
        const {
            title, description, age_rating, run_time,
            release_date, trailer_link, language, director
        } = movieData

        if (
            !title || !description || !age_rating || !run_time || 
            !release_date || !trailer_link || !language || !director
        ) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const newMovie = await services.movieService.movieController.default.createMovie(movieData);

        return NextResponse.json(newMovie, { status: 201 })
    }
    catch (error) {
        console.error("Creating movie error:", error)
        return NextResponse.json({ message: "Creating movie failed:", error: error.message }, { status: 500 })
    }
}