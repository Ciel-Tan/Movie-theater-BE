import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const action = awaitedParams.director_id

        let response
        switch (action) {
            case 'getAll':
                response = await services.directorService.directorController.default.getAllDirectors()
                break;
            default:
                const director_id = parseInt(action, 10)

                if (isNaN(director_id)) {
                    return NextResponse.json({ message: "Invalid director id" }, { status: 400 })
                }

                if (!director_id) {
                    return NextResponse.json({ message: "Director_id is required" }, { status: 400 })
                }

                response = await services.directorService.directorController.default.getDirectorById(director_id)

                if (!response) {
                    return NextResponse.json({ message: "Director not found" }, { status: 404 })
                }

                break;
        }

        return NextResponse.json(response, { status: 200 })
    }
    catch (error) {
        console.error("Getting director info error:", error)
        return NextResponse.json({ message: "Getting info director failed:", error: error.message }, { status: 400 })
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

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Updating director info error:", error)
        return NextResponse.json({ message: "Updating info director failed:", error: error.message }, { status: 500 })
    }
}