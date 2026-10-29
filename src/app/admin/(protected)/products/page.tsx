import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getAllProductsForAdmin } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            Katalog
          </p>
          <h1 className="mt-2 font-display text-3xl text-charcoal">Ürünler</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-charcoal px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-ivory"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Yeni ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          Henüz ürün yok. İlk ürünü ekleyerek başlayın.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ivory-deep/70 text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Ürün</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Öne çıkan</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 text-charcoal">{product.name}</td>
                  <td className="px-4 py-3 text-charcoal-soft">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.active ? "text-success" : "text-muted"
                      }
                    >
                      {product.active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.featured ? "Evet" : "Hayır"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-charcoal underline-offset-4 hover:underline"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
