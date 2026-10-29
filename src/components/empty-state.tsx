type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
      <p className="font-display text-2xl text-charcoal">{title}</p>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
