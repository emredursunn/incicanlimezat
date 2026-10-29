import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { formatPrice } from "@/lib/format";
import { getStoragePublicUrl } from "@/lib/images";
import { getProductBySlug } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Ürün bulunamadı" };
  }

  const image = getStoragePublicUrl(product.main_image_path);

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ||
      `${product.name} · ${siteConfig.name}`,
    openGraph: {
      title: product.name,
      description:
        product.description?.slice(0, 160) || siteConfig.description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20">
      <Link
        href="/urunler"
        className="inline-flex items-center gap-2 text-sm text-muted transition-opacity hover:opacity-70"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Koleksiyona dön
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery
          name={product.name}
          mainImagePath={product.main_image_path}
          additionalImagePaths={product.additional_image_paths}
        />

        <div className="md:pt-4">
          {product.category ? (
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {product.category}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-charcoal-soft">
            {formatPrice(product.price)}
          </p>

          {product.description ? (
            <div className="mt-8 border-t border-border pt-8">
              <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal-soft md:text-base">
                {product.description}
              </p>
            </div>
          ) : null}

          <div className="mt-10">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
            >
              Instagram&apos;dan sorun
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
