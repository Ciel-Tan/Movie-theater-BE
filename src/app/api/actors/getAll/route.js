import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allActors = await services.actorService.actorController.default.getAllActors()
        return NextResponse.json(allActors, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all actors:", error);
        return NextResponse.json({ message: "Error getting all actors:", error: error.message }, { status: 500 })
    }
}