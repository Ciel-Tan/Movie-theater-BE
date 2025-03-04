import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const bookingData = await request.json();

        const { showtime_id, account_id, booking_datetime, booking_fee } = bookingData;

        showtime_id = parseInt(showtime_id, 10);
        account_id = parseInt(account_id, 10);
        booking_fee = parseFloat(booking_fee);

        if (!showtime_id || !account_id || !booking_datetime || !booking_fee) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        if (isNaN(showtime_id) || isNaN(account_id) || isNaN(booking_fee)) {
            return NextResponse.json({ message: "Invalid data type" }, { status: 400 })
        }

        const newBooking = await services.bookingService.bookingController.default.createBooking(bookingData);

        return NextResponse.json(newBooking, { status: 201 })
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ message: "Creating booking failed:", error: error.message }, { status: 500 })
    }
}