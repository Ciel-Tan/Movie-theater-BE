import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { account_id, residence_id } = await request.json()
        const residence = await services.residenceService.residenceController.default.setResidenceAccount(account_id, residence_id)
        return NextResponse.json(residence, { status: 200 })
    }
    catch (error) {
        console.error("Error setting residence account:", error);
        return NextResponse.json({ message: "Error setting residence account:", error: error.message }, { status: 500 })
    }
}