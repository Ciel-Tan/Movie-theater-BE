import { NextResponse } from "next/server";
import PayOS from "@payos/node";

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode");

    if (!orderCode) {
      return NextResponse.json({ error: "Missing order code" }, { status: 400 });
    }

    const paymentInfo = await payos.getPaymentLinkInformation(parseInt(orderCode));

    if (!paymentInfo) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      status: paymentInfo.status,
      ...paymentInfo
    });
  }
  catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
} 