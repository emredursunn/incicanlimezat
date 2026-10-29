import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProductByIdForAdmin } from "@/lib/products";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const product = await getProductByIdForAdmin(id);

  if (!product) notFound();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">Düzenle</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal">{product.name}</h1>
      <div className="mt-8">
        <ProductForm
          productId={product.id}
          product={product}
          created={created === "1"}
        />
      </div>
    </div>
  );
}
