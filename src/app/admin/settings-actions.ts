"use server";

import { revalidatePath } from "next/cache";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/images";
import { requireAdmin } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export type SettingsActionState = {
  error?: string;
  success?: string;
};

function revalidateSiteAppearance() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export async function updateSiteSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Yetkisiz işlem." };

  const storeName = String(formData.get("store_name") ?? "").trim();
  const heroHeadline = String(formData.get("hero_headline") ?? "").trim();
  const heroSubheadline = String(formData.get("hero_subheadline") ?? "").trim();
  const heroCtaLabel = String(formData.get("hero_cta_label") ?? "").trim();
  const instagramUrl = String(formData.get("instagram_url") ?? "").trim();
  const heroImagePath = String(formData.get("hero_image_path") ?? "").trim();
  const previousHeroImagePath = String(
    formData.get("previous_hero_image_path") ?? "",
  ).trim();

  if (!storeName) return { error: "Mağaza adı zorunludur." };
  if (!heroHeadline) return { error: "Ana başlık zorunludur." };
  if (!heroSubheadline) return { error: "Alt yazı zorunludur." };
  if (!heroCtaLabel) return { error: "Buton metni zorunludur." };

  if (instagramUrl) {
    try {
      const parsed = new URL(instagramUrl);
      if (!parsed.protocol.startsWith("http")) {
        return { error: "Instagram adresi geçerli bir URL olmalıdır." };
      }
    } catch {
      return { error: "Instagram adresi geçerli bir URL olmalıdır." };
    }
  }

  const payload = {
    id: 1,
    store_name: storeName,
    hero_headline: heroHeadline,
    hero_subheadline: heroSubheadline,
    hero_cta_label: heroCtaLabel,
    hero_image_path: heroImagePath || null,
    instagram_url: instagramUrl || siteConfig.instagramUrl,
  };

  const { error } = await supabase.from("site_settings").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    return {
      error:
        error.message ||
        "Ayarlar kaydedilemedi. site_settings tablosunu oluşturduğunuzdan emin olun.",
    };
  }

  if (
    previousHeroImagePath &&
    previousHeroImagePath !== heroImagePath &&
    !previousHeroImagePath.startsWith("http")
  ) {
    await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([previousHeroImagePath]);
  }

  revalidateSiteAppearance();
  return { success: "Site ayarları kaydedildi." };
}
