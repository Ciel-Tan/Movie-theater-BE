import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allDirectors = await services.directorService.directorController.default.getAllDirectors()
        return NextResponse.json(allDirectors, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all directors:", error);
        return NextResponse.json({ message: "Error getting all directors:", error: error.message }, { status: 500 })
    }
}