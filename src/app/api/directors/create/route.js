import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { director_name } = await request.json();

        if (!director_name) {
            return NextResponse.json({ message: "Director name is required" }, { status: 400 })
        }

        const newDirector = await services.directorService.directorController.default.createDirector(director_name);

        return NextResponse.json(newDirector, { status: 201 })
    }
    catch (error) {
        console.error("Creating director error:", error)
        return NextResponse.json({ message: "Creating director failed:", error: error.message }, { status: 400 })
    }
}