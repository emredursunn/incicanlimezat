export const siteConfig = {
  name: "İnci Canlı",
  description:
    "Özenle seçilmiş elbise, çanta ve kadın moda ürünlerinden oluşan butik koleksiyon.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagramUrl: "https://www.instagram.com/incicanli",
  instagramHandle: "@incicanli",
  hero: {
    headline: "Zarafetin sade hali",
    subheadline: "Elbise, çanta ve seçilmiş parçalarla yeni sezon koleksiyonu.",
    ctaLabel: "Koleksiyonu Keşfet",
    ctaHref: "/urunler",
    /** Public path or remote URL for the hero image */
    imageSrc:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "İnci Canlı butik koleksiyonu",
  },
  currency: "TRY" as const,
  locale: "tr-TR" as const,
};
