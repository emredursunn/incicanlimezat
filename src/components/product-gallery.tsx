"use client";

import Image from "next/image";
import { useState } from "react";
import { getStoragePublicUrl } from "@/lib/images";

type ProductGalleryProps = {
  name: string;
  mainImagePath: string;
  additionalImagePaths?: string[] | null;
};

export function ProductGallery({
  name,
  mainImagePath,
  additionalImagePaths,
}: ProductGalleryProps) {
  const images = [
    mainImagePath,
    ...(additionalImagePaths ?? []).filter(Boolean),
  ].map(getStoragePublicUrl);

  const [active, setActive] = useState(0);
  const hasGallery = images.length > 1;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
        {images[active] ? (
          <Image
            src={images[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="animate-fade-in object-cover"
            key={images[active]}
          />
        ) : null}
      </div>

      {hasGallery ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Görsel ${index + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-opacity ${
                active === index
                  ? "border-charcoal opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
