# Premium Jewellery E-Commerce Platform

A full-stack Next.js 14 e-commerce platform for premium jewellery with integrated payment processing, admin dashboard, and inventory management.

## 🚀 Features

- **Customer Experience**
  - Browse products by categories, collections, and occasions
  - Advanced filtering (metal type, purity, price, etc.)
  - Secure shopping cart with coupon support
  - Multi-step checkout with address management
  - Razorpay payment integration with HMAC signature verification
  - Order tracking and history
  - Wishlist and reviews
  - Free insured shipping on orders >₹5,000

- **Admin Features**
  - Dashboard with sales metrics and recent orders
  - Product management (CRUD with variants)
  - Order management and fulfillment
  - Customer insights
  - Inventory tracking with movement logs
  - Coupon management
  - Return and refund processing

- **Technical Highlights**
  - TypeScript strict mode
  - Secure authentication with NextAuth.js
  - PostgreSQL with Prisma ORM
  - Server-side payment verification
  - Webhook idempotency handling
  - Centralized pricing engine
  - SEO-optimized pages

## 📋 Tech Stack

- **Frontend**: Next.js 14.0.0, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma 5.7.0, PostgreSQL
- **Auth**: NextAuth.js 5.0.0-beta.12 with Credentials provider
- **Payments**: Razorpay 2.9.0
- **Validation**: Zod 3.22.0
- **UI Components**: Lucide React, shadcn/ui
- **Styling**: Tailwind CSS 3.3.0 with custom luxury theme

## 🏗️ Architecture

### Database Schema (40+ models)
- **Users & Auth**: User, Session (JWT-based)
- **Products**: Product, ProductVariant, ProductImage, ProductCollection
- **Orders**: Order, OrderItem, Payment, Return, ReturnItem
- **Customers**: Cart, CartItem, Wishlist, Address, Review
- **Business**: Category, Collection, Coupon, InventoryMovement, WebhookEvent
- **Marketplace**: Notification, PromoImage

### Key Services
1. **PricingService** (lib/pricing/PricingService.ts)
   - Centralized price calculation
   - 18% GST, shipping (free >₹5k), coupon logic
   - Ensures consistency across checkout

2. **OrderService** (services/OrderService.ts)
   - Order lifecycle management
   - Status tracking with timestamps
   - Inventory restoration on cancellation

3. **RazorpayService** (lib/razorpay/RazorpayService.ts)
   - Secure payment processing
   - HMAC-SHA256 signature verification
   - Webhook support with idempotency

4. **ProductService** (services/ProductService.ts)
   - Product queries with filters
   - Featured/new/bestseller products
   - Search functionality

## 🔐 Security Features

- ✅ Server-side Razorpay signature verification (never frontend)
- ✅ JWT sessions with 30-day max age
- ✅ Middleware-based route protection (/account, /admin)
- ✅ Role-based access control (CUSTOMER, STAFF, ADMIN)
- ✅ Webhook idempotency with database tracking
- ✅ Zod input validation on all endpoints
- ✅ Database transactions for order creation
- ✅ Bcrypt password hashing (12 rounds)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository>
cd jewellers-website
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jewels"

# Auth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_SECRET_KEY="your-razorpay-secret"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# CDN
NEXT_PUBLIC_IMAGE_OPTIMIZATION_PROVIDER="cloudinary"
```

### 3. Database Setup

```bash
# Create database
createdb jewels

# Run migrations
npx prisma migrate dev --name init

# Seed with demo data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

After seeding, use these test accounts:

**Admin:**
- Email: `admin@jewels.com`
- Password: `admin123`
- Access: `/admin/dashboard`

**Customer:**
- Email: `customer@jewels.com`
- Password: `customer123`
- Access: `/account/profile`

## 📁 Project Structure

```
├── app/
│   ├── (store)/              # Customer-facing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── categories/       # Category browsing
│   │   ├── products/         # Product details
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Multi-step checkout
│   │   └── account/          # User dashboard
│   ├── admin/                # Admin pages
│   │   ├── dashboard/        # Metrics & overview
│   │   ├── products/         # Product management
│   │   ├── orders/           # Order management
│   │   ├── customers/        # Customer list
│   │   └── inventory/        # Stock management
│   ├── api/                  # API routes
│   │   ├── checkout/         # Payment creation/verification
│   │   ├── webhooks/         # Razorpay webhooks
│   │   └── admin/            # Admin APIs
│   ├── auth/                 # Authentication pages
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                 # Prisma client
│   ├── constants.ts          # App-wide constants
│   ├── validations/          # Zod schemas
│   ├── pricing/              # PricingService
│   └── razorpay/             # RazorpayService
├── services/                 # Business logic
│   ├── OrderService.ts
│   ├── ProductService.ts
│   └── EmailService.ts (template)
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Demo data
├── middleware.ts             # Route protection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🛒 Key Workflows

### Customer Checkout Flow
1. Browse & add items to cart
2. Enter checkout → Enter/select shipping address
3. Review cart with real-time pricing (subtotal + discounts + shipping + tax)
4. Apply coupon code (optional)
5. Select payment method → Razorpay
6. Enter payment details
7. Server verifies Razorpay signature
8. Order created → Inventory updated
9. Cart cleared
10. Order confirmation with tracking

### Admin Product Management
1. Login to `/admin/dashboard`
2. Create product with:
   - Basic info (name, SKU, description)
   - Pricing (cost, selling, MRP)
   - Images (primary + gallery)
   - Variants (ring sizes, metal colors)
   - Categorization (category, collections)
3. Set featured/bestseller/new arrival flags
4. Manage pricing and discount
5. Track inventory in real-time

## 💳 Payment Integration

### Razorpay Setup
1. Create account at [Razorpay](https://razorpay.com)
2. Get API keys from dashboard
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_SECRET_KEY=xxxxx
   ```
4. Setup webhook at dashboard:
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Events: `payment.authorized`, `payment.failed`

### Security Flow
```
Frontend (Unsafe)
  ↓
Payment Details Sent
  ↓
Backend (Safe) - RazorpayService.verifyPaymentSignature()
  ↓
HMAC-SHA256 Verification
  ↓
Order Created + Inventory Updated
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
git push origin main  # Auto-deploys from Vercel
```

Environment variables in Vercel dashboard:
- DATABASE_URL (PostgreSQL connection)
- NEXTAUTH_SECRET
- NEXTAUTH_URL (your domain)
- Razorpay keys
- Email configuration

### Manual Deployment

1. **Backend**: Neon PostgreSQL or Supabase
2. **Frontend**: Vercel, Netlify, or self-hosted Node.js
3. **Run**: `npm run build && npm start`

## 📊 Pricing Logic

### Calculation Formula
```
Subtotal = SUM(product_price × quantity for all items)
Item Discount = SUM(product discount percentage applied)
Subtotal After Item Discount = Subtotal - Item Discount

Coupon Discount = 
  - If PERCENTAGE: (Subtotal After Item Discount) × (coupon_value / 100)
  - If FIXED: coupon_value

Subtotal After All Discounts = Subtotal After Item Discount - Coupon Discount

Shipping Cost = 
  - 0 if Subtotal After All Discounts >= 5000
  - 150 if Subtotal After All Discounts < 5000

GST (18%) = (Subtotal After All Discounts + Shipping Cost) × 0.18

Total = Subtotal After All Discounts + Shipping Cost + GST
```

This logic is implemented once in **PricingService** and reused in:
- Cart display
- Checkout preview
- Order creation
- Admin reports

## 🧪 Testing

```bash
# Unit tests (when added)
npm run test

# E2E tests (when added)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 API Endpoints

### Public
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `GET /api/categories` - List categories

### Authenticated (Customer)
- `POST /api/checkout/create-order` - Create order
- `POST /api/checkout/verify-payment` - Verify Razorpay payment
- `POST /api/cart` - Manage cart
- `POST /api/wishlist` - Manage wishlist
- `GET /api/orders` - List customer orders

### Admin Only
- `GET|POST /api/admin/products` - Product CRUD
- `GET|PUT /api/admin/orders/[id]` - Manage orders
- `GET /api/admin/customers` - Customer data
- `GET /api/admin/dashboard/metrics` - Metrics

### Webhooks
- `POST /api/webhooks/razorpay` - Razorpay payment confirmation

## 🛠️ Troubleshooting

**Issue**: Database connection failed
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Run `npx prisma db push`

**Issue**: Auth not working
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Check `NEXTAUTH_URL` matches your domain

**Issue**: Payment verification failing
- Verify `RAZORPAY_SECRET_KEY` is correct
- Check webhook configuration
- Review server logs for signature mismatch

**Issue**: Images not loading
- Configure Cloudinary/Unsplash image domains in `next.config.js`
- Use absolute URLs for product images

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Razorpay Docs](https://razorpay.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Support

For issues or questions:
1. Check existing issues in GitHub
2. Review troubleshooting section
3. Contact: support@jewels.com

---

**Happy Selling! ✨**
