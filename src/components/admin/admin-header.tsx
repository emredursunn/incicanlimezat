import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { getSiteSettings } from "@/lib/settings";

export async function AdminHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="border-b border-border bg-ivory">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="font-display text-lg tracking-wide text-charcoal"
          >
            {settings.storeName}
            <span className="ml-2 text-xs font-sans uppercase tracking-[0.18em] text-muted">
              Yönetim
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-charcoal-soft sm:flex">
            <Link href="/admin" className="hover:opacity-60">
              Özet
            </Link>
            <Link href="/admin/products" className="hover:opacity-60">
              Ürünler
            </Link>
            <Link href="/admin/settings" className="hover:opacity-60">
              Ayarlar
            </Link>
            <Link href="/" target="_blank" className="hover:opacity-60">
              Siteyi gör
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
