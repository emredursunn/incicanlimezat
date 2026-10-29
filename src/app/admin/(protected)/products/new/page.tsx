import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  const productId = crypto.randomUUID();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">Yeni</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal">Ürün ekle</h1>
      <div className="mt-8">
        <ProductForm productId={productId} />
      </div>
    </div>
  );
}
