import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allGenres = await services.genreService.genreController.default.getAllGenres()
        return NextResponse.json(allGenres, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all genres:", error);
        return NextResponse.json({ message: "Error getting all genres:", error: error.message }, { status: 500 })
    }
}