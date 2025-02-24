// src/app/api/login/route.js
import { services } from '@/src/services';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/accounts/login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login failed"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
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