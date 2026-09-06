import { prisma } from "@/lib/db";

export class ProductService {
  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: { where: { active: true } },
        reviews: { where: { approved: true } },
        collections: {
          include: { collection: true },
        },
      },
    });
  }

  static async getProducts(
    page: number = 1,
    limit: number = 12,
    filters: any = {}
  ) {
    const skip = (page - 1) * limit;
    const where: any = { published: true };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.minPrice) where.sellingPrice = { gte: filters.minPrice };
    if (filters.maxPrice)
      where.sellingPrice = { ...where.sellingPrice, lte: filters.maxPrice };
    if (filters.search)
      where.name = { contains: filters.search };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { take: 1 },
        variants: { take: 1 },
      },
      orderBy: filters.sortBy === "price_asc"
        ? { sellingPrice: "asc" }
        : filters.sortBy === "price_desc"
          ? { sellingPrice: "desc" }
          : { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.product.count({ where });

    return { products, total, page, pages: Math.ceil(total / limit) };
  }

  static async getFeaturedProducts(limit: number = 8) {
    return prisma.product.findMany({
      where: { published: true, featured: true },
      include: { images: { take: 1 } },
      take: limit,
    });
  }

  static async getNewArrivals(limit: number = 8) {
    return prisma.product.findMany({
      where: { published: true, newArrival: true },
      include: { images: { take: 1 } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async getBestSellers(limit: number = 8) {
    return prisma.product.findMany({
      where: { published: true, bestSeller: true },
      include: { images: { take: 1 } },
      take: limit,
    });
  }

  static async searchProducts(query: string, limit: number = 20) {
    return prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      include: { images: { take: 1 } },
      take: limit,
    });
  }
}
