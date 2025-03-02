import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { room_name } = await request.json();

        if (!room_name) {
            return NextResponse.json({ message: "Room name is required" }, { status: 400 })
        }

        const newRoom = await services.roomService.roomController.default.createRoom(room_name);

        return NextResponse.json(newRoom, { status: 201 })
    }
    catch (error) {
        console.error("Error creating room:", error);
        return NextResponse.json({ message: "Creating room failed:", error: error.message }, { status: 500 })
    }
}