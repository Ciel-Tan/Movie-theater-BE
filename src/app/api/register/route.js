// src/app/api/register/route.js
import { services } from '@/src/services';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/accounts/signup:
 *   post:
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *                 description: Role ID for the new account (e.g., 2 for customer)
 *                 example: 2
 *               full_name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               gender:
 *                 type: string
 *                 enum: ["Male", "Female", "Other", "Not Specified"]
 *                 description: User's gender
 *                 example: "Male"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: User's birthday (YYYY-MM-DD)
 *                 example: "1990-01-15"
 *               id_number:
 *                 type: string
 *                 description: User's ID number
 *                 example: "ID123456789"
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *                 example: "123-456-7890"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "P@$$wOrd123"
 *             required:
 *               - full_name
 *               - gender
 *               - birthday
 *               - id_number
 *               - phone_number
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created successfully"
 *                 account:
 *                   type: object
 *                   description: Details of the newly created account
 *                   # Define schema for Account object properties here if needed
 *       400:
 *         description: Bad request (e.g., missing required fields, invalid email format, duplicate email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *                 errors:
 *                   type: object
 *                   description: "Validation errors, if any" # Example: email: "Email is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create account"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { full_name, gender, birthday, id_number, phone_number, email, password } = requestBody;

        if (!full_name || !gender || !birthday || !id_number || !phone_number || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const accountData = {
            full_name: full_name,
            gender: gender,
            birthday: birthday,
            id_number: id_number,
            phone_number: phone_number,
            email: email,
            password: password,
        };

        const newAccount = await services.accountService.accountController.default.register(accountData);

        return NextResponse.json({ message: "Account created successfully", account: newAccount }, { status: 201 });

    } catch (error) {
        console.error("Error during account registration:", error);

        if (error.message === "Email already exists") { // Example specific error handling
            return NextResponse.json({ message: "Email already exists" }, { status: 400 }); // Or 409 Conflict
        }

        return NextResponse.json({ message: "Failed to create account", error: error.message }, { status: 500 });
    }
}