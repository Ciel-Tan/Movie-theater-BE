import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allResidences = await services.residenceService.residenceController.default.getAllResidences()
        return NextResponse.json(allResidences, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all residences:", error);
        return NextResponse.json({ message: "Error getting all residences:", error: error.message }, { status: 500 })
    }
}