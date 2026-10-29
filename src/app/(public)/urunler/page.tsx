import type { Metadata } from "next";
import { CategoryFilter } from "@/components/category-filter";
import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { isProductCategory } from "@/lib/categories";
import { getActiveProducts, getUsedCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Koleksiyon",
  description: `${siteConfig.name} ürün koleksiyonu.`,
};

type PageProps = {
  searchParams: Promise<{ kategori?: string }>;
};

export default async function CatalogPage({ searchParams }: PageProps) {
  const { kategori } = await searchParams;
  const requested = kategori?.trim() ?? "";

  const usedCategories = (await getUsedCategories()).filter(isProductCategory);
  const effectiveCategory =
    requested &&
    isProductCategory(requested) &&
    usedCategories.includes(requested)
      ? requested
      : null;

  const products = await getActiveProducts(effectiveCategory);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20">
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">
          Koleksiyon
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
          {effectiveCategory ?? "Tüm ürünler"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Özenle seçilmiş elbise, çanta ve kadın moda ürünleri.
        </p>
      </div>

      {usedCategories.length > 0 ? (
        <div className="mt-10">
          <CategoryFilter
            categories={usedCategories}
            activeCategory={effectiveCategory}
          />
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="mt-14">
          <EmptyState
            title="Henüz ürün yok"
            description="Koleksiyon yakında burada olacak."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
