import Link from "next/link";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { getFeaturedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getFeaturedProducts(4),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero settings={settings} />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              Seçilmiş parçalar
            </p>
            <h2 className="mt-3 font-display text-3xl text-charcoal md:text-4xl">
              Öne çıkanlar
            </h2>
          </div>
          <Link
            href="/urunler"
            className="hidden text-sm tracking-wide text-charcoal-soft underline-offset-4 transition-opacity hover:opacity-60 hover:underline md:inline"
          >
            Tüm koleksiyon
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Yakında yeni parçalar"
              description="Koleksiyon hazırlanıyor. Instagram üzerinden bizi takip edebilirsiniz."
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/urunler"
            className="inline-flex border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
          >
            Tüm koleksiyon
          </Link>
        </div>
      </section>
    </>
  );
}
