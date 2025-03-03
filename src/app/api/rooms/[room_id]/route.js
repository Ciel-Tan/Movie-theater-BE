import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const room_id = parseInt(awaitedParams.room_id, 10);

        if(isNaN(room_id)) {
            return NextResponse.json({ message: "Invalid room id" }, { status: 400 })
        }

        if(!room_id) {
            return NextResponse.json({ message: "Room id is required" }, { status: 400 })
        }

        const room = await services.roomService.roomController.default.getRoomById(room_id);

        if(!room) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 })
        }

        return NextResponse.json(room, { status: 200 })
    }
    catch (error) {
        console.error("Error getting room by id:", error);
        return NextResponse.json({ message: "Getting room by id failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const room_id = parseInt(awaitedParams.room_id, 10);
        const requestBody = await request.json();

        if(isNaN(room_id)) {
            return NextResponse.json({ message: "Invalid room id" }, { status: 400 })
        }

        if(!room_id) {
            return NextResponse.json({ message: "Room id is required" }, { status: 400 })
        }

        const updatedRoom = await services.roomService.roomController.default.updateRoom(room_id, requestBody);

        return NextResponse.json(updatedRoom, { status: 200 })
    }
    catch (error) {
        console.error("Error updating room:", error);
        return NextResponse.json({ message: "Updating room failed:", error: error.message }, { status: 500 })
    }     
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const room_id = parseInt(awaitedParams.room_id, 10);

        if(isNaN(room_id)) {
            return NextResponse.json({ message: "Invalid room id" }, { status: 400 })
        }

        if(!room_id) {
            return NextResponse.json({ message: "Room id is required" }, { status: 400 })
        }

        const deletedRoom = await services.roomService.roomController.default.deleteRoom(room_id);

        if (!deletedRoom) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting room:", error);
        return NextResponse.json({ message: "Deleting room failed:", error: error.message }, { status: 500 })   
    }
}