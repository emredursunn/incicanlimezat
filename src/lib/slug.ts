const TURKISH_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugify(input: string): string {
  const normalized = input
    .trim()
    .split("")
    .map((char) => TURKISH_MAP[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "urun";
}

export function makeUniqueSlug(base: string, existing: string[]): string {
  const slugBase = slugify(base);
  if (!existing.includes(slugBase)) return slugBase;

  let i = 2;
  while (existing.includes(`${slugBase}-${i}`)) {
    i += 1;
  }
  return `${slugBase}-${i}`;
}
