"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { HeroImageUploader } from "@/components/admin/hero-image-uploader";
import {
  updateSiteSettings,
  type SettingsActionState,
} from "@/app/admin/settings-actions";
import { siteConfig } from "@/lib/site-config";
import type { SiteSettingsRow } from "@/types/settings";

type SettingsFormProps = {
  settings: SiteSettingsRow | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-charcoal px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-ivory disabled:opacity-60"
    >
      {pending ? "Kaydediliyor..." : "Kaydet"}
    </button>
  );
}

const initialState: SettingsActionState = {};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction] = useActionState(updateSiteSettings, initialState);
  const [heroImagePath, setHeroImagePath] = useState(
    settings?.hero_image_path ?? "",
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) setSuccessMessage(state.success);
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="hero_image_path" value={heroImagePath} />
      <input
        type="hidden"
        name="previous_hero_image_path"
        value={settings?.hero_image_path ?? ""}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="store_name" className="text-sm text-charcoal-soft">
              Mağaza adı *
            </label>
            <input
              id="store_name"
              name="store_name"
              required
              defaultValue={settings?.store_name ?? siteConfig.name}
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
            <p className="mt-1 text-xs text-muted">
              Header, footer ve ana sayfada görünür.
            </p>
          </div>

          <div>
            <label
              htmlFor="instagram_url"
              className="text-sm text-charcoal-soft"
            >
              Instagram adresi
            </label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={
                settings?.instagram_url ?? siteConfig.instagramUrl
              }
              placeholder="https://www.instagram.com/..."
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="hero_headline"
              className="text-sm text-charcoal-soft"
            >
              Ana başlık *
            </label>
            <input
              id="hero_headline"
              name="hero_headline"
              required
              defaultValue={
                settings?.hero_headline ?? siteConfig.hero.headline
              }
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="hero_subheadline"
              className="text-sm text-charcoal-soft"
            >
              Alt yazı *
            </label>
            <textarea
              id="hero_subheadline"
              name="hero_subheadline"
              required
              rows={3}
              defaultValue={
                settings?.hero_subheadline ?? siteConfig.hero.subheadline
              }
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="hero_cta_label"
              className="text-sm text-charcoal-soft"
            >
              Buton metni *
            </label>
            <input
              id="hero_cta_label"
              name="hero_cta_label"
              required
              defaultValue={
                settings?.hero_cta_label ?? siteConfig.hero.ctaLabel
              }
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>
        </div>

        <div className="border border-border bg-ivory-deep/30 p-5">
          <h2 className="font-display text-xl text-charcoal">Hero görseli</h2>
          <p className="mt-1 text-xs text-muted">
            Ana sayfanın büyük arka plan fotoğrafı. JPEG, PNG veya WebP · en
            fazla 5 MB
          </p>
          <div className="mt-5">
            <HeroImageUploader
              imagePath={heroImagePath}
              fallbackSrc={siteConfig.hero.imageSrc}
              onChange={setHeroImagePath}
            />
          </div>
        </div>
      </div>

      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {successMessage ? (
        <p className="text-sm text-success">{successMessage}</p>
      ) : null}

      <div className="border-t border-border pt-6">
        <SubmitButton />
      </div>
    </form>
  );
}
