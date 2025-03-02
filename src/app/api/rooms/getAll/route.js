import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allRooms = await services.roomService.roomController.default.getAllRooms()
        return NextResponse.json(allRooms, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all rooms:", error);
        return NextResponse.json({ message: "Error getting all rooms:", error: error.message }, { status: 500 })
    }
}