import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const seat_type_id = parseInt(awaitedParams.seat_type_id, 10);

        if(isNaN(seat_type_id)) {
            return NextResponse.json({ message: "Invalid seat_type id" }, { status: 400 })
        }

        if(!seat_type_id) {
            return NextResponse.json({ message: "Seat type id is required" }, { status: 400 })
        }

        const seatType = await services.seatTypeService.seatTypeController.default.getSeatTypeById(seat_type_id);

        if(!seatType) {
            return NextResponse.json({ message: "Seat type not found" }, { status: 404 })
        }

        return NextResponse.json(seatType, { status: 200 })
    }
    catch (error) {
        console.error("Error getting seat_type by id:", error);
        return NextResponse.json({ message: "Getting seat_type by id failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const seat_type_id = parseInt(awaitedParams.seat_type_id, 10);
        const { seat_type_name } = await request.json();

        if(isNaN(seat_type_id)) {
            return NextResponse.json({ message: "Invalid seat_type id" }, { status: 400 })
        }

        if(!seat_type_id) {
            return NextResponse.json({ message: "Seat type id is required" }, { status: 400 })
        }

        const updatedSeatType = await services.seatTypeService.seatTypeController.default.updateSeatType(seat_type_id, seat_type_name);

        if (!updatedSeatType) {
            return NextResponse.json({ message: "Seat type not found" }, { status: 404 })
        }

        return NextResponse.json(updatedSeatType, { status: 200 })
    }
    catch (error) {
        console.error("Error updating seat_type:", error);
        return NextResponse.json({ message: "Updating seat_type failed:", error: error.message }, { status: 500 })
    }     
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const seat_type_id = parseInt(awaitedParams.seat_type_id, 10);

        if(isNaN(seat_type_id)) {
            return NextResponse.json({ message: "Invalid seat_type id" }, { status: 400 })
        }

        if(!seat_type_id) {
            return NextResponse.json({ message: "Seat type id is required" }, { status: 400 })
        }

        const deletedSeatType = await services.seatTypeService.seatTypeController.default.deleteSeatType(seat_type_id);

        if (!deletedSeatType) {
            return NextResponse.json({ message: "Seat type not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Seat type deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting seat_type:", error);
        return NextResponse.json({ message: "Deleting seat_type failed:", error: error.message }, { status: 500 })   
    }
}