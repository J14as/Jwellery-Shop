import { z } from "zod";

// Auth Schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Schemas
export const profileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Invalid postal code (6 digits)"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  slug: z.string().min(3),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  costPrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  mrp: z.number().positive(),
  discount: z.number().min(0).max(100).default(0),
  metalType: z.enum(["GOLD", "ROSE_GOLD", "WHITE_GOLD", "SILVER", "PLATINUM"]).optional(),
  metalPurity: z.enum(["K14", "K18", "K22", "K24", "STERLING_SILVER_925"]).optional(),
  stock: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(10),
  categoryId: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const productVariantSchema = z.object({
  sku: z.string().min(3),
  ringSize: z.number().optional(),
  metalColor: z.string().optional(),
  metalPurity: z.string().optional(),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  stock: z.number().int().nonnegative().default(0),
  weight: z.number().positive().optional(),
  active: z.boolean().default(true),
});

// Cart Schemas
export const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().or(z.literal(0)),
});

// Checkout Schemas
export const checkoutSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  shippingAddressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
});

export const paymentVerificationSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// Review Schemas
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(255),
  content: z.string().min(10).max(1000),
});

// Coupon Schemas
export const couponSchema = z.object({
  code: z.string().min(3).max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive(),
  minimumOrderValue: z.number().nonnegative().default(0),
  maximumDiscount: z.number().positive().optional(),
  startDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
  usagePerCustomer: z.number().int().positive().default(1),
  active: z.boolean().default(true),
});

// Contact Schemas
export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

// Types
export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type AddToCartData = z.infer<typeof addToCartSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type ContactData = z.infer<typeof contactSchema>;
