import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allRoles = await services.roleService.roleController.default.getAllRoles()
        return NextResponse.json(allRoles, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all roles:", error);
        return NextResponse.json({ message: "Error getting all roles:", error: error.message }, { status: 500 })
    }
}