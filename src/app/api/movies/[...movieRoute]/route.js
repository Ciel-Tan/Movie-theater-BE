import { services } from '@/src/services';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const action = awaitedParams.movieRoute[0];

        let responseData;
        switch (action) {
            case 'getAll':
                responseData = await services.movieService.movieController.default.getAllMovies();
                break;
            default:
                const movie_id = parseInt(action, 10)

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

                break;
                
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
        const movie_id = parseInt(awaitedParams.movieRoute[0], 10)
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
        const movie_id = parseInt(awaitedParams.movieRoute[0], 10)

        if (isNaN(movie_id)) {
            return NextResponse.json({ message: "Invalid movie id" }, { status: 400 })
        }

        if (!movie_id) {
            return NextResponse.json({ message: "Movie id is required" }, { status: 400 })
        }

        const deletedMovie = await services.movieService.movieController.default.deleteMovie(movie_id)

        return NextResponse.json(deletedMovie, { status: 200 })

    }
    catch (error) {
        console.error("Error in delete movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}