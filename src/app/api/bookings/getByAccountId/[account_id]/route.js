import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const account_id = parseInt(awaitedParams.account_id, 10);

        if(isNaN(account_id)) {
            return NextResponse.json({ message: "Invalid account id" }, { status: 400 })
        }

        if(!account_id) {
            return NextResponse.json({ message: "Account id is required" }, { status: 400 })
        }

        const booking = await services.bookingService.bookingController.default.getBookingByAccountId(account_id);

        if(!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 })
        }

        return NextResponse.json(booking, { status: 200 })
    }
    catch (error) {
        console.error("Error getting booking by account id:", error);
        return NextResponse.json({ message: "Getting booking by account id failed:", error: error.message }, { status: 500 })
    }
}