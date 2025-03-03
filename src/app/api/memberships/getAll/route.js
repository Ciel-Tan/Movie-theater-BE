import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allMemberships = await services.membershipService.membershipController.default.getAllMemberships()
        return NextResponse.json(allMemberships, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all memberships:", error);
        return NextResponse.json({ message: "Error getting all memberships:", error: error.message }, { status: 500 })
    }
}