import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const genre_id = parseInt(awaitedParams.genre_id, 10);

        if(isNaN(genre_id)) {
            return NextResponse.json({ message: "Invalid genre id" }, { status: 400 })
        }

        if(!genre_id) {
            return NextResponse.json({ message: "Genre id is required" }, { status: 400 })
        }

        const genre = await services.genreService.genreController.default.getGenreById(genre_id);

        if(!genre) {
            return NextResponse.json({ message: "Genre not found" }, { status: 404 })
        }

        return NextResponse.json(genre, { status: 200 })
    }
    catch (error) {
        console.error("Error getting genre by id:", error);
        return NextResponse.json({ message: "Getting genre by id failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const genre_id = parseInt(awaitedParams.genre_id, 10);
        const requestBody = await request.json();

        if(isNaN(genre_id)) {
            return NextResponse.json({ message: "Invalid genre id" }, { status: 400 })
        }

        if(!genre_id) {
            return NextResponse.json({ message: "Genre id is required" }, { status: 400 })
        }

        const updatedGenre = await services.genreService.genreController.default.updateGenre(genre_id, requestBody);

        return NextResponse.json(updatedGenre, { status: 200 })
    }
    catch (error) {
        console.error("Error updating genre:", error);
        return NextResponse.json({ message: "Updating genre failed:", error: error.message }, { status: 500 })
    }     
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const genre_id = parseInt(awaitedParams.genre_id, 10);

        if(isNaN(genre_id)) {
            return NextResponse.json({ message: "Invalid genre id" }, { status: 400 })
        }

        if(!genre_id) {
            return NextResponse.json({ message: "Genre id is required" }, { status: 400 })
        }

        const deletedGenre = await services.genreService.genreController.default.deleteGenre(genre_id);

        if (!deletedGenre) {
            return NextResponse.json({ message: "Genre not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Genre deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting genre:", error);
        return NextResponse.json({ message: "Deleting genre failed:", error: error.message }, { status: 500 })   
    }
}