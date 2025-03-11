import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

interface PaymentRequest {
  eventId: string;
  amount: number;
}

interface RazorpayOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
}

interface RazorpayOrder {
  id: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { eventId, amount }: PaymentRequest = await request.json();
    
    const options: RazorpayOrderOptions = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${eventId}_${Date.now()}`,
    };

    const order: RazorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
