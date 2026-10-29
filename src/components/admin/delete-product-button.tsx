"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="border border-danger px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-danger disabled:opacity-60"
      >
        {pending
          ? "Siliniyor..."
          : confirming
            ? "Silmeyi onayla"
            : "Ürünü sil"}
      </button>
      {confirming && !pending ? (
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="ml-2 text-xs text-muted underline-offset-4 hover:underline"
        >
          Vazgeç
        </button>
      ) : null}
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
