import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { RazorpayService } from "@/lib/razorpay/RazorpayService";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify Razorpay signature - THIS IS CRITICAL FOR SECURITY
    const isValid = RazorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature - payment verification failed" },
        { status: 400 }
      );
    }

    // Find payment record
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
      include: { order: { include: { items: true } } },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Check if already processed (idempotency)
    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        orderId: payment.orderId,
      });
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: "PAID",
        fulfillmentStatus: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    // Reduce inventory
    for (const item of payment.order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Log inventory movement
        await prisma.inventoryMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            type: "STOCK_OUT",
            quantity: item.quantity,
            reason: `Order ${payment.order.orderNumber}`,
            referenceId: payment.orderId,
            referenceType: "ORDER",
          },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await prisma.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: "STOCK_OUT",
            quantity: item.quantity,
            reason: `Order ${payment.order.orderNumber}`,
            referenceId: payment.orderId,
            referenceType: "ORDER",
          },
        });
      }
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: session.user.id! } },
    });

    return NextResponse.json({
      success: true,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      message: "Payment verified and order created successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
