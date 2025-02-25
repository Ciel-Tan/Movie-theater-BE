import { NextResponse } from "next/server";
import { services } from "@/src/services";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        if (typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }

        await services.accountService.accountController.default.forgotPassword(email);

        // Security best practice:  Always return a success message even if the email doesn't exist
        // to prevent email enumeration attacks.
        return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
    }
    catch (error) {
        console.error("Error initiating forgot password process:", error);
        return NextResponse.json({ message: "Failed to initiate password reset", error: error.message }, { status: 500 });
    }
}