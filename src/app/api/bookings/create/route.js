import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const bookingData = await request.json();

        const { showtime_id, account_id, booking_datetime, booking_fee, booking_ticket, booking_seat } = bookingData;

        const showtimeId = parseInt(showtime_id, 10);
        const accountId = parseInt(account_id, 10);
        const bookingFee = parseFloat(booking_fee);

        if (isNaN(showtimeId) || isNaN(accountId) || isNaN(bookingFee)) {
            return NextResponse.json({ message: "Invalid data type" }, { status: 400 })
        }

        if (!showtime_id || !account_id || !booking_datetime || !booking_fee || !booking_ticket || !booking_seat) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        const newBooking = await services.bookingService.bookingController.default.createBooking(bookingData);

        return NextResponse.json(newBooking, { status: 201 })
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ message: "Creating booking failed:", error: error.message }, { status: 500 })
    }
}