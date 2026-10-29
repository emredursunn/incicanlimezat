import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getAdminDashboardStats } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { total, active, recent } = await getAdminDashboardStats();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Özet</p>
          <h1 className="mt-2 font-display text-3xl text-charcoal md:text-4xl">
            Yönetim paneli
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/settings"
            className="inline-flex items-center border border-border px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-charcoal hover:bg-ivory-deep"
          >
            Site ayarları
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-charcoal px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-ivory"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Yeni ürün
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="border border-border bg-ivory-deep/50 px-5 py-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Toplam ürün
          </p>
          <p className="mt-3 font-display text-4xl text-charcoal">{total}</p>
        </div>
        <div className="border border-border bg-ivory-deep/50 px-5 py-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Aktif ürün
          </p>
          <p className="mt-3 font-display text-4xl text-charcoal">{active}</p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-charcoal">Son eklenenler</h2>
          <Link
            href="/admin/products"
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            Tümünü gör
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Henüz ürün eklenmedi.</p>
        ) : (
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {recent.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between gap-4 py-4 transition-opacity hover:opacity-70"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {product.active ? "Aktif" : "Pasif"}
                      {product.featured ? " · Öne çıkan" : ""}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal-soft">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
