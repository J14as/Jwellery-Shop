import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Rings", slug: "rings", description: "Elegant rings for every occasion", active: true },
    }),
    prisma.category.create({
      data: { name: "Earrings", slug: "earrings", description: "Beautiful earrings for every style", active: true },
    }),
    prisma.category.create({
      data: { name: "Necklaces", slug: "necklaces", description: "Stunning necklaces", active: true },
    }),
    prisma.category.create({
      data: { name: "Bracelets", slug: "bracelets", description: "Elegant bracelets", active: true },
    }),
  ]);

  // Create collections
  await Promise.all([
    prisma.collection.create({
      data: { name: "Bridal Collection", slug: "bridal", description: "Perfect for weddings", active: true, featured: true },
    }),
    prisma.collection.create({
      data: { name: "Everyday Gold", slug: "everyday", description: "Daily wear pieces", active: true },
    }),
    prisma.collection.create({
      data: { name: "Diamond Essentials", slug: "diamond", description: "Diamond jewellery", active: true, featured: true },
    }),
  ]);

  const metalTypes = ["GOLD", "ROSE_GOLD", "WHITE_GOLD"];
  const metalPurities = ["K18", "K22"];
  const itemTypes = ["Ring", "Earring", "Necklace", "Bracelet"];

  for (let i = 1; i <= 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Premium ${itemTypes[i % 4]} Collection ${i}`,
        slug: `premium-product-${i}`,
        sku: `SKU-${String(i).padStart(6, "0")}`,
        description: `High-quality jewellery piece with certified authenticity. Perfect for any occasion.`,
        shortDescription: `Beautiful ${itemTypes[i % 4].toLowerCase()}`,
        costPrice: 5000 + i * 100,
        sellingPrice: 8000 + i * 200,
        mrp: 12000 + i * 300,
        discount: Math.floor(Math.random() * 30),
        metalType: metalTypes[i % 3],
        metalPurity: metalPurities[i % 2],
        stock: Math.floor(Math.random() * 50) + 10,
        lowStockThreshold: 10,
        categoryId: categories[i % categories.length].id,
        published: true,
        featured: i % 5 === 0,
        bestSeller: i % 4 === 0,
        newArrival: i % 6 === 0,
        seoTitle: `Premium jewellery piece ${i}`,
        seoDescription: `Shop authentic jewellery`,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&q=80`,
        altText: product.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    for (let j = 0; j < 3; j++) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${product.sku}-VAR-${j}`,
          ringSize: j + 6,
          metalColor: ["Yellow Gold", "White Gold", "Rose Gold"][j % 3],
          metalPurity: "18K",
          price: product.sellingPrice + j * 500,
          stock: Math.floor(Math.random() * 30) + 5,
          weight: 3.5 + j * 0.5,
          active: true,
        },
      });
    }
  }

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@jewels.com",
      password: adminPassword,
      name: "Admin User",
      phone: "9876543210",
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.create({
    data: {
      email: "customer@jewels.com",
      password: customerPassword,
      name: "John Doe",
      phone: "9876543211",
      role: "CUSTOMER",
    },
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "John Doe",
      phone: "9876543211",
      addressLine1: "123 Main Street",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      isDefault: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      description: "Welcome discount",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minimumOrderValue: 1000,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      active: true,
    },
  });

  console.log("✓ Database seeded successfully!");
  console.log("\nTest credentials:");
  console.log("Admin:    admin@jewels.com    / admin123");
  console.log("Customer: customer@jewels.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
