"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import {
  getStoragePublicUrl,
  PRODUCT_IMAGES_BUCKET,
  validateImageFile,
} from "@/lib/images";
import { createClient } from "@/lib/supabase/client";

type ImageUploaderProps = {
  productId: string;
  mainImagePath: string;
  additionalImagePaths: string[];
  onMainChange: (path: string) => void;
  onAdditionalChange: (paths: string[]) => void;
  /** When true, remove replaced/removed files from storage immediately (new product drafts). */
  cleanupImmediately?: boolean;
};

export function ImageUploader({
  productId,
  mainImagePath,
  additionalImagePaths,
  onMainChange,
  onAdditionalChange,
  cleanupImmediately = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null, asMain: boolean) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      const list = Array.from(files);
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const validationError = validateImageFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        setProgress(`${i + 1}/${list.length} yükleniyor...`);
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${productId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGES_BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          setError(uploadError.message);
          continue;
        }

        uploaded.push(path);
      }

      if (asMain && uploaded[0]) {
        const previousMain = mainImagePath;
        onMainChange(uploaded[0]);
        const extras = uploaded.slice(1);
        if (extras.length > 0) {
          onAdditionalChange([...additionalImagePaths, ...extras]);
        }
        if (
          cleanupImmediately &&
          previousMain &&
          previousMain !== uploaded[0]
        ) {
          await supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .remove([previousMain]);
        }
      } else if (uploaded.length > 0) {
        onAdditionalChange([...additionalImagePaths, ...uploaded]);
      }
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  async function removePath(path: string, isMain: boolean) {
    setError(null);
    if (isMain) {
      setError("Ana görseli kaldırmadan önce yeni bir ana görsel yükleyin.");
      return;
    }
    onAdditionalChange(additionalImagePaths.filter((p) => p !== path));
    if (cleanupImmediately) {
      const supabase = createClient();
      await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
    }
  }

  function promoteToMain(path: string) {
    const previous = mainImagePath;
    onMainChange(path);
    const rest = additionalImagePaths.filter((p) => p !== path);
    if (previous) {
      onAdditionalChange([previous, ...rest]);
    } else {
      onAdditionalChange(rest);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-charcoal-soft">Ana görsel</p>
        <div className="mt-3 flex flex-wrap items-start gap-4">
          {mainImagePath ? (
            <div className="relative h-40 w-32 overflow-hidden bg-ivory-deep">
              <Image
                src={getStoragePublicUrl(mainImagePath)}
                alt="Ana görsel"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          ) : (
            <div className="flex h-40 w-32 items-center justify-center border border-dashed border-border text-xs text-muted">
              Yok
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-sm text-charcoal hover:bg-ivory-deep">
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            Ana görsel yükle
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                void uploadFiles(e.target.files, true);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-charcoal-soft">Ek görseller</p>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-charcoal underline-offset-4 hover:underline">
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            Ekle
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                void uploadFiles(e.target.files, false);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {additionalImagePaths.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {additionalImagePaths.map((path) => (
              <li key={path} className="relative h-28 w-20 overflow-hidden bg-ivory-deep">
                <Image
                  src={getStoragePublicUrl(path)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="88px"
                />
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-charcoal/70 p-1">
                  <button
                    type="button"
                    onClick={() => promoteToMain(path)}
                    className="flex-1 text-[10px] uppercase tracking-wide text-ivory"
                  >
                    Ana yap
                  </button>
                  <button
                    type="button"
                    onClick={() => void removePath(path, false)}
                    aria-label="Kaldır"
                    className="px-1 text-ivory"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-muted">Ek görsel yok.</p>
        )}
      </div>

      {uploading ? (
        <p className="inline-flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress ?? "Yükleniyor..."}
        </p>
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
