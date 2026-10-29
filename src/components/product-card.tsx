import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getStoragePublicUrl } from "@/lib/images";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = getStoragePublicUrl(product.main_image_path);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group block animate-fade-up"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Görsel yok
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium tracking-wide text-charcoal md:text-[0.95rem]">
          {product.name}
        </h3>
        <p className="text-sm text-muted">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
