"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import {
  getStoragePublicUrl,
  PRODUCT_IMAGES_BUCKET,
  validateImageFile,
} from "@/lib/images";
import { createClient } from "@/lib/supabase/client";

type HeroImageUploaderProps = {
  imagePath: string;
  fallbackSrc: string;
  onChange: (path: string) => void;
};

export function HeroImageUploader({
  imagePath,
  fallbackSrc,
  onChange,
}: HeroImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewSrc =
    imagePath.length > 0
      ? imagePath.startsWith("http")
        ? imagePath
        : getStoragePublicUrl(imagePath)
      : fallbackSrc;

  async function uploadFile(files: FileList | null) {
    if (!files?.[0]) return;
    const file = files[0];
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `site/hero-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      onChange(path);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt="Hero önizleme"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-sm text-charcoal hover:bg-ivory-deep">
          <Upload className="h-4 w-4" strokeWidth={1.5} />
          Hero görseli yükle
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              void uploadFile(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {imagePath ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            Varsayılana dön
          </button>
        ) : null}
      </div>

      {uploading ? (
        <p className="inline-flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yükleniyor...
        </p>
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
