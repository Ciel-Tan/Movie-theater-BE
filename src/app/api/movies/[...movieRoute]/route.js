import { services } from '@/src/services';

export async function GET(request, { params }) {
    const { movieRoute: routeSegments } = await params;
    const action = routeSegments ? routeSegments[0] : null;
    const movieId = routeSegments && routeSegments[1] ? routeSegments[1] : null;

    try {
        let responseData;
        switch (action) {
            case 'get':
                if (movieId) {
                    responseData = await services.movieService.movieController.default.getMovieById(movieId);
                    if (!responseData) {
                        return Response.json({ message: 'Movie not found' }, { status: 404 });
                    }
                } else {
                    responseData = await services.movieService.movieController.default.getMovies();
                }
                break;
            default:
                return Response.json({ message: 'Movie action not found' }, { status: 404 });
        }
        return Response.json(responseData, { status: 200 });
    }
    catch (error) {
        console.error("Error in movie API:", error);
        return Response.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}