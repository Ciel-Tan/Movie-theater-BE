import { services } from '@/src/services';

/**
 * @swagger
 * /api/movies/get:
 *   get:
 *     summary: Get all movies (paginated and optionally filterable)
 *     description: Retrieve a list of movies from the database. Supports pagination and optional filtering.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication to access (adjust as needed)
 *     parameters: # Example query parameters for pagination and filtering
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of movies per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter movies by genre name
 *       - in: query
 *         name: actor
 *         schema:
 *           type: string
 *         description: Filter movies by actor name
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *         description: Filter movies by director name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search movies by title or description
 *     responses:
 *       200:
 *         description: Successful operation - returns an array of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie' # Assuming you have a Movie schema defined in components/schemas
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch movies"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */

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