import Link from "next/link";

type CategoryFilterProps = {
  categories: string[];
  activeCategory?: string | null;
};

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  const linkClass = (selected: boolean) =>
    `shrink-0 border px-3 py-1.5 text-xs tracking-wide transition-colors ${
      selected
        ? "border-charcoal bg-charcoal text-ivory"
        : "border-border text-charcoal-soft hover:border-charcoal hover:text-charcoal"
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href="/urunler" className={linkClass(!activeCategory)} scroll={false}>
        Tümü
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/urunler?kategori=${encodeURIComponent(category)}`}
          className={linkClass(activeCategory === category)}
          scroll={false}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
