import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { genre_name } = await request.json();

        if (!genre_name) {
            return NextResponse.json({ message: "Genre name is required" }, { status: 400 })
        }

        const newGenre = await services.genreService.genreController.default.createGenre(genre_name);

        return NextResponse.json(newGenre, { status: 201 })
    }
    catch (error) {
        console.error("Error creating genre:", error);
        return NextResponse.json({ message: "Creating genre failed:", error: error.message }, { status: 500 })
    }
}