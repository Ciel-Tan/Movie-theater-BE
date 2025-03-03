import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allAccounts = await services.accountService.accountController.default.getAllAccounts()
        return NextResponse.json(allAccounts, { status: 200 })
    }
    catch (error) {
        console.error("Error getting all accounts:", error);
        return NextResponse.json({ message: "Error getting all accounts:", error: error.message }, { status: 500 })
    }
}