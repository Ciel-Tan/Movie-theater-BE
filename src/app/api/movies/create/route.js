import { services } from "@/src/services";
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
    try {
        const {
            poster_image,
            title,
            description,
            age_rating,
            run_time,
            release_date,
            trailer_link,
            language,
            genre_ids,
            director_id,
            actor_ids
        } = await request.json();

        if (
            !poster_image || !title || !description || !age_rating || !run_time || 
            !release_date || !trailer_link || !language || !genre_ids || !director_id || !actor_ids
        ) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const movieData = {   
            poster_image: poster_image,
            title: title,
            description: description,
            age_rating: age_rating,
            run_time: run_time,
            release_date: release_date,
            trailer_link: trailer_link,
            language: language,
            genre_ids: genre_ids,
            director_id: director_id,
            actor_ids: actor_ids
        };

        const newMovie = await services.movieService.movieController.default.createMovie(movieData);

        return NextResponse.json(newMovie, { status: 201 })
    }
    catch (error) {
        console.error("Creating movie error:", error)
        return NextResponse.json({ message: "Creating movie failed:", error: error.message }, { status: 400 })
    }
}