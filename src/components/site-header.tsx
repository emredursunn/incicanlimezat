import Link from "next/link";
import { InstagramIcon } from "@/components/instagram-icon";
import type { SiteSettings } from "@/types/settings";

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.04em] text-charcoal md:text-2xl"
        >
          {settings.storeName}
        </Link>

        <nav className="flex items-center gap-6 text-sm tracking-wide text-charcoal-soft md:gap-8">
          <Link
            href="/urunler"
            className="transition-opacity hover:opacity-60"
          >
            Koleksiyon
          </Link>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-60"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
