import { ProductService } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");

    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;

    const result = await ProductService.getProducts(page, limit, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
