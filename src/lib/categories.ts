/** Sabit butik kategorileri — admin select listesi */
export const PRODUCT_CATEGORIES = [
  "Elbise",
  "Bluz & Gömlek",
  "Etek",
  "Pantolon",
  "Ceket & Trençkot",
  "Triko & Kazak",
  "Çanta",
  "Ayakkabı",
  "Aksesuar",
  "Takı",
  "Şal & Eşarp",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export function normalizeCategory(
  value: string | null | undefined,
): ProductCategory | null {
  if (!value) return null;
  const trimmed = value.trim();
  return isProductCategory(trimmed) ? trimmed : null;
}
