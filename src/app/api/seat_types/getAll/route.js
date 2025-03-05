import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allSeatTypes = await services.seatTypeService.seatTypeController.default.getAllSeatTypes()
        return NextResponse.json(allSeatTypes, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all seat_types:", error);
        return NextResponse.json({ message: "Error getting all seat_types:", error: error.message }, { status: 500 })
    }
}