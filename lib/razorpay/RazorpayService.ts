import Razorpay from "razorpay";
import crypto from "crypto";

export class RazorpayService {
  private static getInstance() {
    return new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || "",
    });
  }

  static async createOrder(amount: number, receipt: string) {
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
    };
    return RazorpayService.getInstance().orders.create(options);
  }

  static verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    return expectedSignature === razorpaySignature;
  }

  static verifyWebhookSignature(body: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }

  static async fetchPayment(paymentId: string) {
    return RazorpayService.getInstance().payments.fetch(paymentId);
  }

  static async createRefund(paymentId: string, amount: number) {
    return RazorpayService.getInstance().payments.refund(paymentId, {
      amount: Math.round(amount * 100),
    });
  }
}
