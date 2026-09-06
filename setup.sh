#!/bin/bash

echo "🏃 Premium Jewellery Store - Quick Start"
echo "========================================"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Setup environment
echo "⚙️  Setting up environment..."
cp .env.example .env.local

echo ""
echo "📝 Edit .env.local with your credentials:"
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - NEXTAUTH_SECRET (generate: openssl rand -base64 32)"
echo "   - RAZORPAY_KEY_ID & RAZORPAY_SECRET_KEY"
echo ""

# Step 3: Database setup
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init
npx prisma db seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🔑 Test Credentials (after seed):"
echo "   Admin:    admin@jewels.com / admin123"
echo "   Customer: customer@jewels.com / customer123"
echo ""
echo "📖 Visit http://localhost:3000"
