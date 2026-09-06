import { prisma } from "@/lib/db";
import type { Order } from "@prisma/client";

export class OrderService {
  static async createOrder(
    userId: string,
    shippingAddressId: string,
    couponCode: string | undefined,
    paymentMethod: "RAZORPAY" | "COD",
    totals: any
  ): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return prisma.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId,
        subtotal: totals.subtotal,
        itemDiscount: totals.itemDiscount,
        couponDiscount: totals.couponDiscount,
        shippingCost: totals.shippingCost,
        taxAmount: totals.tax,
        totalAmount: totals.total,
        couponCode,
        paymentMethod,
        paymentStatus: "PENDING",
        fulfillmentStatus: "PENDING",
      },
    });
  }

  static async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    courierProvider?: string
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        fulfillmentStatus: status,
        ...(trackingNumber && { trackingNumber }),
        ...(courierProvider && { courierProvider }),
        ...(status === "SHIPPED" && { shippedAt: new Date() }),
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
      },
    });
  }

  static async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    const cancellableStatuses = ["PENDING", "CONFIRMED", "PROCESSING"];
    if (!cancellableStatuses.includes(order.fulfillmentStatus)) {
      throw new Error("Cannot cancel order in current status");
    }

    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentStatus: "CANCELLED", cancelledAt: new Date() },
    });
  }

  static async getCustomerOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, shippingAddress: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    const total = await prisma.order.count({ where: { userId } });
    return { orders, total, page, pages: Math.ceil(total / limit) };
  }
}
