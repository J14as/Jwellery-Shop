import { ProductService } from "@/services/ProductService";
import { CATEGORIES } from "@/lib/constants";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import { CategoryFilterView } from "@/components/CategoryFilterView";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

interface Props {
  params: { slug: string };
  searchParams: { page?: string; sort?: string; metal?: string; price?: string; purity?: string; tag?: string };
}

export async function generateMetadata({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return {};

  return {
    title: `${category.name} Collection | JEWELS Haute Joaillerie`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const page = Number(searchParams.page) || 1;
  
  let products: any[] = [];

  try {
    const result = await ProductService.getProducts(page, 12, {
      categoryId: category.id,
      sortBy: searchParams.sort,
    });
    if (result && result.products.length > 0) {
      products = result.products;
    }
  } catch (err) {
    // Database fallback
  }

  // Fallback to mock products if database is empty/unseeded
  if (products.length === 0) {
    const categoryMocks = MOCK_PRODUCTS.filter(
      (p) => p.category === category.slug || p.categoryId === category.slug
    );
    products = categoryMocks;
  }

  return (
    <div className="bg-dark min-h-screen pt-8 pb-24 text-white">
      {/* Breadcrumb */}
      <div className="container-custom mb-8">
        <nav className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/categories" className="hover:text-gold transition-colors">Collections</Link>
          <ChevronRight size={12} />
          <span className="text-gold font-medium">{category.name}</span>
        </nav>
      </div>

      {/* Category Editorial Hero */}
      <div className="container-custom mb-14">
        <div className="relative overflow-hidden glass-card p-8 md:p-14 border border-gold/15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="section-label mb-3 inline-block">Haute Collection</span>
            <h1 className="font-serif text-4xl md:text-6xl text-white mb-4 leading-tight">
              {category.name}
            </h1>
            <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-6">
              {category.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-white/50 tracking-wider">
              <span className="flex items-center gap-1.5 text-gold">
                <Sparkles size={14} /> 100% Certified Diamonds
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" /> BIS Hallmarked Purity
              </span>
              <span className="text-white/40">
                {products.length} Masterpiece Designs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Filter, Sort & Product Grid */}
      <div className="container-custom mb-16">
        <CategoryFilterView
          initialProducts={products}
          categoryName={category.name}
          categorySlug={category.slug}
        />
      </div>

      {/* Heritage Note */}
      <div className="container-custom">
        <div className="p-8 md:p-12 border border-gold/15 bg-gradient-to-r from-dark-50 via-dark-100 to-dark-50 text-center max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
            The {category.name} Atelier Standard
          </h3>
          <p className="text-white/50 text-sm font-light leading-relaxed max-w-2xl mx-auto">
            Every creation in our {category.name.toLowerCase()} atelier undergoes rigorous 40-point quality inspections, diamond clarity mapping, and laser hallmark certification before receiving its bespoke velvet case.
          </p>
        </div>
      </div>
    </div>
  );
}
