import { services } from "@/src/services"
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const account_id = parseInt(awaitedParams.account_id, 10)
        const { currentPassword, newPassword } = await request.json()

        if (isNaN(account_id)) {
            return NextResponse.json({ message: "Invalid account id" }, { status: 400 })
        }

        if (!account_id) {
            return NextResponse.json({ message: "Account id is required" }, { status: 400 })
        }

        const responseChange = await services.accountService.accountController.default.changePassword(account_id, currentPassword, newPassword)

        if (!responseChange) {
            return NextResponse.json({ message: "Account not found" }, { status: 400 })
        }

        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Changing password error:", error)
        return NextResponse.json({ message: "Changing password failed:", error: error.message }, { status: 400 })
    }
}