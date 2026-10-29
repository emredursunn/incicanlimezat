import { getStoragePublicUrl } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteSettings, SiteSettingsRow } from "@/types/settings";

function instagramHandleFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    const handle = pathname.split("/").filter(Boolean).pop();
    return handle ? `@${handle}` : siteConfig.instagramHandle;
  } catch {
    return siteConfig.instagramHandle;
  }
}

function resolveHeroImage(path: string | null | undefined): string {
  if (!path) return siteConfig.hero.imageSrc;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return getStoragePublicUrl(path) || siteConfig.hero.imageSrc;
}

export function defaultsToSiteSettings(): SiteSettings {
  return {
    storeName: siteConfig.name,
    heroHeadline: siteConfig.hero.headline,
    heroSubheadline: siteConfig.hero.subheadline,
    heroCtaLabel: siteConfig.hero.ctaLabel,
    heroImageSrc: siteConfig.hero.imageSrc,
    heroImageAlt: siteConfig.hero.imageAlt,
    instagramUrl: siteConfig.instagramUrl,
    instagramHandle: siteConfig.instagramHandle,
  };
}

export function mapSettingsRow(row: SiteSettingsRow): SiteSettings {
  const instagramUrl = row.instagram_url?.trim() || siteConfig.instagramUrl;
  const storeName = row.store_name.trim() || siteConfig.name;

  return {
    storeName,
    heroHeadline: row.hero_headline.trim() || siteConfig.hero.headline,
    heroSubheadline:
      row.hero_subheadline.trim() || siteConfig.hero.subheadline,
    heroCtaLabel: row.hero_cta_label.trim() || siteConfig.hero.ctaLabel,
    heroImageSrc: resolveHeroImage(row.hero_image_path),
    heroImageAlt: `${storeName} butik koleksiyonu`,
    instagramUrl,
    instagramHandle: instagramHandleFromUrl(instagramUrl),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getSiteSettings", error.message);
      return defaultsToSiteSettings();
    }

    return mapSettingsRow(data as SiteSettingsRow);
  } catch (error) {
    console.error("getSiteSettings", error);
    return defaultsToSiteSettings();
  }
}

export async function getSiteSettingsRow(): Promise<SiteSettingsRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("getSiteSettingsRow", error.message);
      return null;
    }

    return data as SiteSettingsRow | null;
  } catch (error) {
    console.error("getSiteSettingsRow", error);
    return null;
  }
}
