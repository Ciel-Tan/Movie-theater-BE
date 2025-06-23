import { NextResponse } from "next/server";
import PayOS from "@payos/node";

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

export async function POST(req) {
  try {
    const { orderCode, amount, description, returnUrl, cancelUrl } = await req.json();

    if (!orderCode || !amount || !description || !returnUrl || !cancelUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paymentData = {
      orderCode: parseInt(orderCode),
      amount,
      description,
      returnUrl,
      cancelUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
    };

    const paymentLink = await payos.createPaymentLink(paymentData);

    return NextResponse.json({ checkoutUrl: paymentLink.checkoutUrl });
  }
  catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json({ error: `Failed to create payment link: ${error.message}` }, { status: 500 });
  }
} 