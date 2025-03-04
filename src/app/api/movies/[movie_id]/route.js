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

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const movie_id = parseInt(awaitedParams.movie_id, 10)
        const requestBody = await request.json()

        const movieData = {
            poster_image: requestBody.poster_image,
            title: requestBody.title,
            description: requestBody.description,
            age_rating: requestBody.age_rating,
            release_date: requestBody.release_date,
            run_time: requestBody.run_time,
            trailer_link: requestBody.trailer_link,
            language: requestBody.language,
            genre_ids: requestBody.genres,
            director_id: requestBody.director_id,
            actor_ids: requestBody.actors,
            showtime: requestBody.showtime
        }

        if (isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if (!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const update = await services.movieService.movieController.default.updateMovie(movie_id, movieData)

        if (!update) {
            return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
        }

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