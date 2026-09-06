import { prisma } from "@/lib/db";

interface CartItemData {
  variantId?: string;
  productId: string;
  quantity: number;
}

interface PricingCalculation {
  subtotal: number;
  itemDiscount: number;
  couponDiscount: number;
  shippingCost: number;
  tax: number;
  total: number;
  breakdown: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      discount: number;
      subtotal: number;
    }>;
  };
}

const GST_RATE = parseFloat(process.env.GST_RATE || "18") / 100;
const FREE_SHIPPING_THRESHOLD = parseFloat(
  process.env.FREE_SHIPPING_THRESHOLD || "5000"
);
const STANDARD_SHIPPING_CHARGE = parseFloat(
  process.env.STANDARD_SHIPPING_CHARGE || "150"
);

export class PricingService {
  /**
   * Calculate cart totals with coupon and shipping
   */
  static async calculateCartTotals(
    cartItems: CartItemData[],
    couponCode?: string,
    _shippingAddress?: { postalCode: string }
  ): Promise<PricingCalculation> {
    // Fetch product prices and discounts
    const itemsWithPrices = await Promise.all(
      cartItems.map(async (item) => {
        let price = 0;
        let discount = 0;

        if (item.variantId) {
          const variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (!variant) {
            throw new Error(`Variant ${item.variantId} not found`);
          }

          price = variant.price;
          discount = variant.product.discount || 0;
        } else {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          price = product.sellingPrice;
          discount = product.discount || 0;
        }

        const itemSubtotal = price * item.quantity;
        const itemDiscount = (itemSubtotal * discount) / 100;
        const itemTotal = itemSubtotal - itemDiscount;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price,
          discount: itemDiscount,
          subtotal: itemTotal,
        };
      })
    );

    // Calculate subtotal
    let subtotal = itemsWithPrices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let itemDiscount = itemsWithPrices.reduce(
      (sum, item) => sum + item.discount,
      0
    );
    let subtotalAfterDiscount = subtotal - itemDiscount;

    // Apply coupon
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.active) {
        if (new Date() <= (coupon.expiryDate || new Date())) {
          if (subtotalAfterDiscount >= coupon.minimumOrderValue) {
            if (coupon.discountType === "PERCENTAGE") {
              couponDiscount = (subtotalAfterDiscount * coupon.discountValue) / 100;
              if (coupon.maximumDiscount) {
                couponDiscount = Math.min(couponDiscount, coupon.maximumDiscount);
              }
            } else {
              couponDiscount = coupon.discountValue;
            }
          }
        }
      }
    }

    const afterCoupon = subtotalAfterDiscount - couponDiscount;

    // Calculate shipping
    let shippingCost = 0;
    if (afterCoupon < FREE_SHIPPING_THRESHOLD) {
      shippingCost = STANDARD_SHIPPING_CHARGE;
    }

    // Calculate tax (on subtotal before discounts, per GST rules)
    const taxableAmount = afterCoupon + shippingCost;
    const tax = taxableAmount * GST_RATE;

    // Final total
    const total = afterCoupon + shippingCost + tax;

    return {
      subtotal,
      itemDiscount,
      couponDiscount,
      shippingCost,
      tax,
      total,
      breakdown: {
        items: itemsWithPrices,
      },
    };
  }

  /**
   * Validate coupon
   */
  static async validateCoupon(
    couponCode: string,
    minimumAmount: number,
    userId: string
  ): Promise<{ valid: boolean; reason?: string }> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!coupon) {
      return { valid: false, reason: "Coupon not found" };
    }

    if (!coupon.active) {
      return { valid: false, reason: "Coupon is inactive" };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return { valid: false, reason: "Coupon has expired" };
    }

    if (minimumAmount < coupon.minimumOrderValue) {
      return {
        valid: false,
        reason: `Minimum order value is ₹${coupon.minimumOrderValue}`,
      };
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, reason: "Coupon usage limit reached" };
    }

    // Check per-customer usage
    const customerUsage = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });

    if (customerUsage >= coupon.usagePerCustomer) {
      return {
        valid: false,
        reason: `You have already used this coupon ${coupon.usagePerCustomer} time(s)`,
      };
    }

    return { valid: true };
  }

  /**
   * Format price in INR
   */
  static formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
