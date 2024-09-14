import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { order_id, payment_id, course_id, signature } = body;

    if (!order_id || !payment_id || !signature) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return new NextResponse("Internal server error", { status: 500 });
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");

    if (signature !== generatedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    await db.purchase.create({
      data: {
        userId: userId,
        courseId: course_id,
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
