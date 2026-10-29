import Link from "next/link";
import { InstagramIcon } from "@/components/instagram-icon";
import type { SiteSettings } from "@/types/settings";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-ivory-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center md:px-8">
        <div>
          <Link
            href="/"
            className="font-display text-xl tracking-[0.04em] text-charcoal"
          >
            {settings.storeName}
          </Link>
          <p className="mt-2 text-sm text-muted">
            © {year} {settings.storeName}. Tüm hakları saklıdır.
          </p>
        </div>

        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-charcoal-soft transition-opacity hover:opacity-60"
        >
          <InstagramIcon className="h-4 w-4" />
          {settings.instagramHandle}
        </a>
      </div>
    </footer>
  );
}
