import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { seat_type_name } = await request.json();

        if (!seat_type_name) {
            return NextResponse.json({ message: "Seat type name is required" }, { status: 400 })
        }

        const newSeatType = await services.seatTypeService.seatTypeController.default.createSeatType(seat_type_name);

        return NextResponse.json(newSeatType, { status: 201 })
    }
    catch (error) {
        console.error("Error creating seat_type:", error);
        return NextResponse.json({ message: "Creating seat_type failed:", error: error.message }, { status: 500 })
    }
}