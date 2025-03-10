import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const director_id = parseInt(awaitedParams.director_id, 10)
        
        if (isNaN(director_id)) {
            return NextResponse.json({ message: "Invalid director id" }, { status: 400 })
        }

        if (!director_id) {
            return NextResponse.json({ message: "Director_id is required" }, { status: 400 })
        }

        const director = await services.directorService.directorController.default.getDirectorById(director_id)

        if (!response) {
            return NextResponse.json({ message: "Director not found" }, { status: 404 })
        }

        return NextResponse.json(director, { status: 200 })
    }
    catch (error) {
        console.error("Getting director info error:", error)
        return NextResponse.json({ message: "Getting info director failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const director_id = parseInt(awaitedParams.director_id, 10)
        const { director_name } = await request.json()

        if (isNaN(director_id)) {
            return NextResponse.json({ message: "Invalid director id" }, { status: 400 })
        }

        if (!director_id) {
            return NextResponse.json({ message: "Director id is required" }, { status: 400 })
        }

        const update = await services.directorService.directorController.default.updateDirector(director_id, director_name)

        if (!update) {
            return NextResponse.json({ message: "Director not found" }, { status: 404 })
        }

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Updating director info error:", error)
        return NextResponse.json({ message: "Updating info director failed:", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const director_id = parseInt(awaitedParams.director_id, 10);

        if(isNaN(director_id)) {
            return NextResponse.json({ message: "Invalid director id" }, { status: 400 })
        }

        if(!director_id) {
            return NextResponse.json({ message: "Director id is required" }, { status: 400 })
        }

        const deletedDirector = await services.directorService.directorController.default.deleteDirector(director_id);

        if (!deletedDirector) {
            return NextResponse.json({ message: "Director not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Director deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting director:", error);
        return NextResponse.json({ message: "Deleting director failed:", error: error.message }, { status: 500 })   
    }
}