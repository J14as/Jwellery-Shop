// Categories
export const CATEGORIES = [
  { id: "rings", name: "Rings", slug: "rings", description: "Explore our exquisite collection of rings crafted with precision and elegance." },
  { id: "earrings", name: "Earrings", slug: "earrings", description: "Discover beautiful earrings for every style and occasion." },
  { id: "necklaces", name: "Necklaces", slug: "necklaces", description: "Stunning necklaces that make every outfit complete." },
  { id: "pendants", name: "Pendants", slug: "pendants", description: "Elegant pendants for a touch of sophistication." },
  { id: "bracelets", name: "Bracelets", slug: "bracelets", description: "Timeless bracelets to complement your look." },
  { id: "bangles", name: "Bangles", slug: "bangles", description: "Traditional and contemporary bangles for every celebration." },
  { id: "chains", name: "Chains", slug: "chains", description: "Premium chains in gold, silver, and platinum." },
];

// Collections
export const COLLECTIONS = [
  { id: "bridal", name: "Bridal Collection", slug: "bridal" },
  { id: "everyday", name: "Everyday Gold", slug: "everyday" },
  { id: "diamond", name: "Diamond Essentials", slug: "diamond" },
  { id: "festive", name: "Festive Collection", slug: "festive" },
  { id: "minimal", name: "Minimal Jewellery", slug: "minimal" },
];

// Occasions
export const OCCASIONS = [
  "Wedding",
  "Engagement",
  "Anniversary",
  "Birthday",
  "Festival",
  "Everyday Wear",
];

// Price Ranges
export const PRICE_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹25,000", min: 10000, max: 25000 },
  { label: "₹25,000 – ₹50,000", min: 25000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

// Metal Types
export const METAL_TYPES = ["Gold", "Rose Gold", "White Gold", "Silver", "Platinum"];

// Metal Purity
export const METAL_PURITY = ["14K", "18K", "22K", "24K", "925 Silver"];

// Stone Types
export const STONE_TYPES = [
  "Diamond",
  "Ruby",
  "Emerald",
  "Sapphire",
  "Pearl",
  "Zircon",
  "None",
];

// Ring Sizes
export const RING_SIZES = Array.from({ length: 16 }, (_, i) => (i + 6).toString());

// Order Status Colors
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  PACKED: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

// Currency
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";

// Pagination
export const ITEMS_PER_PAGE = 12;

// Navigation Items
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/categories/rings", label: "Rings" },
  { href: "/categories/earrings", label: "Earrings" },
  { href: "/categories/necklaces", label: "Necklaces" },
  { href: "/categories/bracelets", label: "Bracelets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Toast Messages
export const TOAST_MESSAGES = {
  ADDED_TO_CART: "Item added to cart",
  REMOVED_FROM_CART: "Item removed from cart",
  ADDED_TO_WISHLIST: "Added to wishlist",
  REMOVED_FROM_WISHLIST: "Removed from wishlist",
  COUPON_APPLIED: "Coupon applied successfully",
  COUPON_INVALID: "Invalid coupon code",
  ORDER_PLACED: "Order placed successfully",
  ORDER_CANCELLED: "Order cancelled successfully",
};
