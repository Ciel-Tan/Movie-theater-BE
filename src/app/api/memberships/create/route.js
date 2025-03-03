import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { membership_name, discount_rate } = await request.json();
        discount_rate = parseInt(discount_rate, 10)

        if (!membership_name || !discount_rate) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        if (isNaN(discount_rate)) {
            return NextResponse.json({ message: "Invalid discount rate" }, { status: 400 })
        }

        const newMembership = await services.membershipService.membershipController.default.createMembership({membership_name, discount_rate});

        return NextResponse.json(newMembership, { status: 201 })
    }
    catch (error) {
        console.error("Creating membership error:", error)
        return NextResponse.json({ message: "Creating membership failed:", error: error.message }, { status: 400 })
    }
}