import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const booking_id = parseInt(awaitedParams.booking_id, 10);

        if(isNaN(booking_id)) {
            return NextResponse.json({ message: "Invalid booking id" }, { status: 400 })
        }

        if(!booking_id) {
            return NextResponse.json({ message: "Booking id is required" }, { status: 400 })
        }

        const booking = await services.bookingService.bookingController.default.getBookingById(booking_id);

        if(!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        return NextResponse.json(booking, { status: 200 })
    }
    catch (error) {
        console.error("Error getting booking by id:", error);
        return NextResponse.json({ message: "Getting booking by id failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const booking_id = parseInt(awaitedParams.booking_id, 10);
        const requestBody = await request.json();
        const { showtime_id, account_id, booking_datetime, booking_fee, booking_ticket, booking_seat } = requestBody;

        const showtimeId = parseInt(showtime_id, 10);
        const accountId = parseInt(account_id, 10);
        const bookingFee = parseFloat(booking_fee);

        if(isNaN(booking_id) || isNaN(showtimeId) || isNaN(accountId) || isNaN(bookingFee)) {
            return NextResponse.json({ message: "Invalid data type" }, { status: 400 })
        }

        if(!booking_id || !showtime_id || !account_id || !booking_datetime || !booking_fee || !booking_ticket || !booking_seat) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const updatedBooking = await services.bookingService.bookingController.default.updateBooking(booking_id, requestBody);

        if (!updatedBooking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        return NextResponse.json(updatedBooking, { status: 200 })
    }
    catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ message: "Updating booking failed:", error: error.message }, { status: 500 })
    }     
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const booking_id = parseInt(awaitedParams.booking_id, 10);

        if(isNaN(booking_id)) {
            return NextResponse.json({ message: "Invalid booking id" }, { status: 400 })
        }

        if(!booking_id) {
            return NextResponse.json({ message: "Booking id is required" }, { status: 400 })
        }

        const deletedBooking = await services.bookingService.bookingController.default.deleteBooking(booking_id);

        if (!deletedBooking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json({ message: "Deleting booking failed:", error: error.message }, { status: 500 })   
    }
}