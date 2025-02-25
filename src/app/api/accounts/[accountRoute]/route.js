import { services } from "@/src/services"
import { NextResponse } from "next/server"

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const action = awaitedParams.accountRoute

        let responseAccounts
        switch (action) {
            case 'getAll':
                responseAccounts = await services.accountService.accountController.default.getAllAccount()
                break;
            default:
                const account_id = parseInt(action, 10)

                if (isNaN(account_id)) {
                    return NextResponse.json({ message: "Invalid account id" }, { status: 400 })
                }

                if (!account_id) {
                    return NextResponse.json({ message: "Account_id is required" }, { status: 400 })
                }

                responseAccounts = await services.accountService.accountController.default.getAccountById(account_id)

                if (!responseAccounts) {
                    return NextResponse.json({ message: "Account not found" }, { status: 404 })
                }

                break;
        }

        return NextResponse.json(responseAccounts, { status: 200 })
    }
    catch (error) {
        console.error("Getting account by id error:", error)
        return NextResponse.json({ message: "Getting info account failed:", error: error.message }, { status: 400 })
    }
}

export async function PUT(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const account_id = parseInt(awaitedParams.accountRoute, 10)
        const accountData = await request.json()

        if (isNaN(account_id)) {
            return NextResponse.json({ message: "Invalid account id" }, { status: 400 })
        }

        if (!account_id) {
            return NextResponse.json({ message: "Account id is required" }, { status: 400 })
        }

        const updatedAccount = await services.accountService.accountController.default.updateAccount(account_id, accountData)
        
        if (!updatedAccount) {
            return NextResponse.json({ message: "Account not found" }, { status: 400 })
        }

        return NextResponse.json(updatedAccount, { status: 200 })
    }
    catch (error) {
        console.error("Updating account error:", error)
        return NextResponse.json({ message: "Updating account failed:", error: error.message }, { status: 400 })
    }
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const account_id = parseInt(awaitedParams.accountRoute, 10)

        if (isNaN(account_id)) {
            return NextResponse.json({ message: "Invalid account id" }, { status: 400 })
        }

        if (!account_id) {
            return NextResponse.json({ message: "Account id is required" }, { status: 400 })
        }

        const deletedAccount = await services.accountService.accountController.default.deleteAccount(account_id)

        if (!deletedAccount) {
            return NextResponse.json({ message: "Account not found" }, { status: 400 })
        }

        return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Deleting account error:", error)
        return NextResponse.json({ message: "Deleting account failed:", error: error.message }, { status: 400 })
    }
}
