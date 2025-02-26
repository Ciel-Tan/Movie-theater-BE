import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { actor_name } = await request.json();

        if (!actor_name) {
            return NextResponse.json({ message: "Actor name is required" }, { status: 400 })
        }

        const newActor = await services.actorService.actorController.default.createActor(actor_name);

        return NextResponse.json(newActor, { status: 201 })
    }
    catch (error) {
        console.error("Creating actor error:", error)
        return NextResponse.json({ message: "Creating actor failed:", error: error.message }, { status: 400 })
    }
}