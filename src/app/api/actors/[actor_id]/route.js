import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params); 
        const actor_id = parseInt(awaitedParams.actor_id, 10)
        
        if (isNaN(actor_id)) {
            return NextResponse.json({ message: "Invalid actor id" }, { status: 400 })
        }

        if (!actor_id) {
            return NextResponse.json({ message: "Actor id is required" }, { status: 400 })
        }

        const actor = await services.actorService.actorController.default.getActorById(actor_id)

        if (!response) {
            return NextResponse.json({ message: "Actor not found" }, { status: 404 })
        }

        return NextResponse.json(actor, { status: 200 })
    }
    catch (error) {
        console.error("Getting actor info error:", error)
        return NextResponse.json({ message: "Getting info actor failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const actor_id = parseInt(awaitedParams.actor_id, 10)
        const { actor_name } = await request.json()

        if (isNaN(actor_id)) {
            return NextResponse.json({ message: "Invalid actor id" }, { status: 400 })
        }

        if (!actor_id) {
            return NextResponse.json({ message: "Actor id is required" }, { status: 400 })
        }

        const update = await services.actorService.actorController.default.updateActor(actor_id, actor_name)

        if (!update) {
            return NextResponse.json({ message: "Actor not found" }, { status: 404 })
        }

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Updating actor info error:", error)
        return NextResponse.json({ message: "Updating info actor failed:", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const actor_id = parseInt(awaitedParams.actor_id, 10);

        if(isNaN(actor_id)) {
            return NextResponse.json({ message: "Invalid actor id" }, { status: 400 })
        }

        if(!actor_id) {
            return NextResponse.json({ message: "Actor id is required" }, { status: 400 })
        }

        const deletedActor = await services.actorService.actorController.default.deleteActor(actor_id);

        if (!deletedActor) {
            return NextResponse.json({ message: "Actor not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Actor deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting actor:", error);
        return NextResponse.json({ message: "Deleting actor failed:", error: error.message }, { status: 500 })   
    }
}