import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/settings";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">404</p>
        <h1 className="mt-4 font-display text-4xl text-charcoal md:text-5xl">
          Sayfa bulunamadı
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted">
          Aradığınız ürün veya sayfa mevcut değil ya da artık yayınlanmıyor.
        </p>
        <Link
          href="/urunler"
          className="mt-10 inline-flex border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
        >
          Koleksiyona git
        </Link>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
