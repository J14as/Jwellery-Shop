import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { RazorpayService } from "@/lib/razorpay/RazorpayService";
import { PricingService } from "@/lib/pricing/PricingService";
import { OrderService } from "@/services/OrderService";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const userId = session.user.id!;

    // Fetch cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate cart items and calculate totals
    const cartItems = cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? undefined,
      quantity: item.quantity,
    }));

    const totals = await PricingService.calculateCartTotals(
      cartItems,
      data.couponCode
    );

    // Create order
    const order = await OrderService.createOrder(
      userId,
      data.shippingAddressId || "",
      data.couponCode,
      data.paymentMethod,
      totals
    );

    // Create order items from cart
    for (const cartItem of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: cartItem.productId },
      });

      if (product) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            variantId: cartItem.variantId,
            productName: product.name,
            sku: product.sku,
            quantity: cartItem.quantity,
            unitPrice: product.sellingPrice,
            discount: (product.discount / 100) * product.sellingPrice * cartItem.quantity,
            taxAmount: totals.tax / cart.items.length,
            totalPrice: (totals.total / cart.items.length),
          },
        });
      }
    }

    // Create Razorpay order if payment method is Razorpay
    let razorpayOrder = null;
    if (data.paymentMethod === "RAZORPAY") {
      razorpayOrder = await RazorpayService.createOrder(totals.total, order.id);

      await prisma.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: totals.total,
          status: "CREATED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrder: razorpayOrder ? { id: razorpayOrder.id } : null,
      totals,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
