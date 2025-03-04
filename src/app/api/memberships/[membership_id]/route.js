import { services } from "@/src/services";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const membership_id = parseInt(awaitedParams.membership_id, 10)
        
        if (isNaN(membership_id)) {
            return NextResponse.json({ message: "Invalid membership id" }, { status: 400 })
        }

        if (!membership_id) {
            return NextResponse.json({ message: "Membership_id is required" }, { status: 400 })
        }

        const membership = await services.membershipService.membershipController.default.getMembershipById(membership_id)

        if (!response) {
            return NextResponse.json({ message: "Membership not found" }, { status: 404 })
        }

        return NextResponse.json(membership, { status: 200 })
    }
    catch (error) {
        console.error("Getting membership info error:", error)
        return NextResponse.json({ message: "Getting info membership failed:", error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const awaitedParams = await Promise.resolve(params)
        const membership_id = parseInt(awaitedParams.membership_id, 10)
        const { membership_name, discount_rate } = await request.json()

        if (isNaN(membership_id)) {
            return NextResponse.json({ message: "Invalid membership id" }, { status: 400 })
        }

        if (!membership_id) {
            return NextResponse.json({ message: "Membership id is required" }, { status: 400 })
        }

        const update = await services.membershipService.membershipController.default.updateMembership(membership_id, {membership_name, discount_rate})

        if (!update) {
            return NextResponse.json({ message: "Membership not found" }, { status: 404 })
        }

        return NextResponse.json(update, { status: 200 })
    }
    catch (error) {
        console.error("Updating membership info error:", error)
        return NextResponse.json({ message: "Updating info membership failed:", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, {params}) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const membership_id = parseInt(awaitedParams.membership_id, 10);

        if (isNaN(membership_id)) {
            return NextResponse.json({ message: "Invalid membership id" }, { status: 400 })
        }

        if (!membership_id) {
            return NextResponse.json({ message: "Membership id is required" }, { status: 400 })
        }

        const deletedMembership = await services.membershipService.membershipController.default.deleteMembership(membership_id);

        if (!deletedMembership) {
            return NextResponse.json({ message: "Membership not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Membership deleted successfully" }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting membership:", error);
        return NextResponse.json({ message: "Deleting membership failed:", error: error.message }, { status: 500 })   
    }
}