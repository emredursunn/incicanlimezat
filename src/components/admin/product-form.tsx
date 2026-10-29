"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import {
  createProduct,
  updateProduct,
  type ActionState,
} from "@/app/admin/actions";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types/product";

type ProductFormProps = {
  productId: string;
  product?: Product;
  created?: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-charcoal px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-ivory disabled:opacity-60"
    >
      {pending ? "Kaydediliyor..." : label}
    </button>
  );
}

const initialState: ActionState = {};

export function ProductForm({ productId, product, created }: ProductFormProps) {
  const isEdit = Boolean(product);
  const boundUpdate = updateProduct.bind(null, productId);
  const [state, formAction] = useActionState(
    isEdit ? boundUpdate : createProduct,
    initialState,
  );

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [mainImagePath, setMainImagePath] = useState(
    product?.main_image_path ?? "",
  );
  const [additionalImagePaths, setAdditionalImagePaths] = useState<string[]>(
    product?.additional_image_paths ?? [],
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    created ? "Ürün oluşturuldu." : null,
  );

  useEffect(() => {
    if (state.success) setSuccessMessage(state.success);
  }, [state.success]);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="main_image_path" value={mainImagePath} />
      <input
        type="hidden"
        name="additional_image_paths"
        value={additionalImagePaths.join(",")}
      />
      {isEdit ? (
        <>
          <input
            type="hidden"
            name="previous_main_image_path"
            value={product?.main_image_path ?? ""}
          />
          <input
            type="hidden"
            name="previous_additional_image_paths"
            value={(product?.additional_image_paths ?? []).join(",")}
          />
        </>
      ) : (
        <input type="hidden" name="id" value={productId} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="text-sm text-charcoal-soft">
              Ürün adı *
            </label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="slug" className="text-sm text-charcoal-soft">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
            <p className="mt-1 text-xs text-muted">
              URL: /urunler/{slug || "..."}
            </p>
          </div>

          <div>
            <label htmlFor="price" className="text-sm text-charcoal-soft">
              Fiyat (TRY) *
            </label>
            <input
              id="price"
              name="price"
              required
              inputMode="decimal"
              defaultValue={product ? String(product.price) : ""}
              placeholder="2490"
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="category" className="text-sm text-charcoal-soft">
              Kategori
            </label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category ?? ""}
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            >
              <option value="">Kategori seçin</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {product?.category &&
              !(PRODUCT_CATEGORIES as readonly string[]).includes(
                product.category,
              ) ? (
                <option value={product.category}>{product.category}</option>
              ) : null}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="text-sm text-charcoal-soft">
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={product?.description ?? ""}
              className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                name="active"
                defaultChecked={product?.active ?? true}
                className="size-4 accent-charcoal"
              />
              Aktif (yayında)
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="size-4 accent-charcoal"
              />
              Öne çıkan
            </label>
          </div>
        </div>

        <div className="border border-border bg-ivory-deep/30 p-5">
          <h2 className="font-display text-xl text-charcoal">Görseller</h2>
          <p className="mt-1 text-xs text-muted">
            JPEG, PNG veya WebP · en fazla 5 MB
          </p>
          <div className="mt-5">
            <ImageUploader
              productId={productId}
              mainImagePath={mainImagePath}
              additionalImagePaths={additionalImagePaths}
              onMainChange={setMainImagePath}
              onAdditionalChange={setAdditionalImagePaths}
              cleanupImmediately={!isEdit}
            />
          </div>
        </div>
      </div>

      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {successMessage ? (
        <p className="text-sm text-success">{successMessage}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <div className="flex flex-wrap gap-3">
          <SubmitButton label={isEdit ? "Değişiklikleri kaydet" : "Ürünü oluştur"} />
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2.5 text-sm text-muted hover:text-charcoal"
          >
            İptal
          </Link>
        </div>
        {isEdit ? <DeleteProductButton productId={productId} /> : null}
      </div>
    </form>
  );
}
