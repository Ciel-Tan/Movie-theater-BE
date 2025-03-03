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

        responseData = await services.movieService.movieController.default.getMovieById(movie_id);

        if (!responseData) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
        }

        return Response.json(responseData, { status: 200 });
    }
    catch (error) {
        console.error("Error in movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const movie_id = parseInt(awaitedParams.movie_id, 10)
        const requestBody = await request.json()

        if (isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if (!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const update = await services.movieService.movieController.default.updateMovie(movie_id, requestBody)

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Error in update movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const movie_id = parseInt(awaitedParams.movie_id, 10)

        if (isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if (!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const deletedMovie = await services.movieService.movieController.default.deleteMovie(movie_id)

        if (!deletedMovie) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Movie deleted successfully' }, { status: 200 })

    }
    catch (error) {
        console.error("Error in delete movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}