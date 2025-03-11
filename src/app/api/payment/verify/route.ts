import { NextResponse } from "next/server";
import crypto from "crypto";

interface PaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { orderId, paymentId, signature }: PaymentRequest = await request.json();

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
