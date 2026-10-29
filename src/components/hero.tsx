import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import type { SiteSettings } from "@/types/settings";

type HeroProps = {
  settings: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal">
      <Image
        src={settings.heroImageSrc}
        alt={settings.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-charcoal/20" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-8 md:px-8 md:pb-24">
        <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-ivory/80">
          {settings.storeName}
        </p>
        <h1 className="animate-fade-up animate-delay-1 mt-4 max-w-xl font-display text-4xl leading-tight text-ivory md:text-6xl">
          {settings.heroHeadline}
        </h1>
        <p className="animate-fade-up animate-delay-2 mt-4 max-w-md text-sm leading-relaxed text-ivory/85 md:text-base">
          {settings.heroSubheadline}
        </p>
        <div className="animate-fade-up animate-delay-3 mt-8">
          <Link
            href={siteConfig.hero.ctaHref}
            className="inline-flex border border-ivory/80 px-6 py-3 text-xs uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ivory hover:text-charcoal"
          >
            {settings.heroCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
