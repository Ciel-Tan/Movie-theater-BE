import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allCinemas = await services.cinemaService.cinemaController.default.getAlCinemas()
        return NextResponse.json(allCinemas, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all cinemas:", error);
        return NextResponse.json({ message: "Error getting all cinemas:", error: error.message }, { status: 500 })
    }
}