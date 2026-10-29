const BUCKET = "product-images";

export function getStoragePublicUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;

  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export { BUCKET as PRODUCT_IMAGES_BUCKET };

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Yalnızca JPEG, PNG veya WebP yükleyebilirsiniz.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Görsel en fazla 5 MB olabilir.";
  }
  return null;
}
