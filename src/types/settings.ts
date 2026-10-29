export type SiteSettingsRow = {
  id: number;
  store_name: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_label: string;
  hero_image_path: string | null;
  instagram_url: string | null;
  updated_at: string;
};

export type SiteSettings = {
  storeName: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroImageSrc: string;
  heroImageAlt: string;
  instagramUrl: string;
  instagramHandle: string;
};
