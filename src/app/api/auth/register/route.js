// src/app/api/register/route.js
import { services } from '@/src/services';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { full_name, gender, birthday, id_number, phone_number, email, password } = requestBody;

        if (!full_name || !birthday || !id_number || !phone_number || !email || !password) {
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

    }
    catch (error) {
        console.error("Error during account registration:", error);

        if (error.message === "Email already exists") { // Example specific error handling
            return NextResponse.json({ message: "Email already exists" }, { status: 400 }); // Or 409 Conflict
        }

        return NextResponse.json({ message: "Failed to create account", error: error.message }, { status: 500 });
    }
}