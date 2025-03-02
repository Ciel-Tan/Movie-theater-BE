import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const showtime_id = parseInt(awaitedParams.showtime_id, 10);

        if(isNaN(showtime_id)) {
            return NextResponse.json({ message: "Invalid showtime id" }, { status: 400 })
        }

        if(!showtime_id) {
            return NextResponse.json({ message: "Showtime id is required" }, { status: 400 })
        }

        const showtime = await services.showtimeService.showtimeController.default.getShowtimeById(showtime_id);

        if(!showtime) {
            return NextResponse.json({ message: "Showtime not found" }, { status: 404 })
        }

        return NextResponse.json(showtime, { status: 200 })
    }
    catch (error) {
        console.error("Error getting showtime by id:", error);
        return NextResponse.json({ message: "Getting showtime by id failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const showtime_id = parseInt(awaitedParams.showtime_id, 10);
        const requestBody = await request.json();

        if(isNaN(showtime_id)) {
            return NextResponse.json({ message: "Invalid showtime id" }, { status: 400 })
        }

        if(!showtime_id) {
            return NextResponse.json({ message: "Showtime id is required" }, { status: 400 })
        }

        const updatedshowtime = await services.showtimeService.showtimeController.default.updateShowtime(showtime_id, requestBody);

        return NextResponse.json(updatedshowtime, { status: 200 })
    }
    catch (error) {
        console.error("Error updating showtime:", error);
        return NextResponse.json({ message: "Updating showtime failed:", error: error.message }, { status: 500 })
    }     
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const showtime_id = parseInt(awaitedParams.showtime_id, 10);

        if(isNaN(showtime_id)) {
            return NextResponse.json({ message: "Invalid showtime id" }, { status: 400 })
        }

        if(!showtime_id) {
            return NextResponse.json({ message: "Showtime id is required" }, { status: 400 })
        }

        const deletedShowtime = await services.showtimeService.showtimeController.default.deleteShowtime(showtime_id);

        return NextResponse.json(deletedShowtime, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting showtime:", error);
        return NextResponse.json({ message: "Deleting showtime failed:", error: error.message }, { status: 500 })   
    }
}