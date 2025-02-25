// src/app/api/login/route.js
import { services } from '@/src/services';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const loginResult = await services.accountService.accountController.default.login({ email, password })
        if (loginResult && loginResult.token) {
            return NextResponse.json(
                {
                    token: loginResult.token,
                    expiresIn: loginResult.expiresIn
                },
                { status: 200 }
            );
        }
        else if (loginResult && loginResult.message === "Invalid credentials") {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }
        else {
            return NextResponse.json({ message: "Login failed" }, { status: 500 }); // Generic failure
        }

    }
    catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
    }
}