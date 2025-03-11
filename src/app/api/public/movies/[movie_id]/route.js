import { services } from '@/src/services';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const movie_id = parseInt(awaitedParams.movie_id, 10)

        if (isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if (!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const movie = await services.movieService.movieController.default.getMovieById(movie_id);

        if (!movie) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
        }

        return Response.json(movie, { status: 200 });
    }
    catch (error) {
        console.error("Error in movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}