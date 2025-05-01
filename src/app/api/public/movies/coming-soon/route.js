import { services } from '@/src/services';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const movies = await services.movieService.movieController.default.getMovieComingSoon();
        return NextResponse.json(movies, { status: 200 });
    }
    catch (error) {
        console.error("Error in movie API:", error);
        return NextResponse.json({ message: 'Failed to process movie request', error: error.message }, { status: 500 });
    }
}