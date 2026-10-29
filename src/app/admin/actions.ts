"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeCategory } from "@/lib/categories";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/images";
import { requireAdmin, getExistingSlugs } from "@/lib/products";
import { makeUniqueSlug, slugify } from "@/lib/slug";

export type ActionState = {
  error?: string;
  success?: string;
};

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/urunler", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

function parsePrice(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const normalized = value.replace(",", ".").trim();
  const num = Number(normalized);
  if (Number.isNaN(num) || num < 0) return null;
  return num;
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Yetkisiz işlem." };

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const category = categoryRaw ? normalizeCategory(categoryRaw) : null;
  const mainImagePath = String(formData.get("main_image_path") ?? "").trim();
  const additionalRaw = String(formData.get("additional_image_paths") ?? "");
  const additionalImagePaths = additionalRaw
    ? additionalRaw.split(",").map((p) => p.trim()).filter(Boolean)
    : [];
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const price = parsePrice(formData.get("price"));

  if (!id) return { error: "Ürün kimliği eksik." };
  if (!name) return { error: "Ürün adı zorunludur." };
  if (price === null) return { error: "Geçerli bir fiyat girin." };
  if (!mainImagePath) return { error: "Ana görsel zorunludur." };
  if (categoryRaw && !category) {
    return { error: "Geçersiz kategori seçimi." };
  }

  const existing = await getExistingSlugs();
  const slug = makeUniqueSlug(slugInput || name, existing);

  const { data, error } = await supabase
    .from("products")
    .insert({
      id,
      name,
      slug,
      description: description || null,
      category,
      price,
      main_image_path: mainImagePath,
      additional_image_paths: additionalImagePaths,
      featured,
      active,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message || "Ürün kaydedilemedi." };
  }

  revalidatePublic();
  redirect(`/admin/products/${data.id}/edit?created=1`);
}

export async function updateProduct(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Yetkisiz işlem." };

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const category = categoryRaw ? normalizeCategory(categoryRaw) : null;
  const mainImagePath = String(formData.get("main_image_path") ?? "").trim();
  const additionalRaw = String(formData.get("additional_image_paths") ?? "");
  const additionalImagePaths = additionalRaw
    ? additionalRaw.split(",").map((p) => p.trim()).filter(Boolean)
    : [];
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const price = parsePrice(formData.get("price"));
  const previousMain = String(formData.get("previous_main_image_path") ?? "");
  const previousAdditionalRaw = String(
    formData.get("previous_additional_image_paths") ?? "",
  );
  const previousAdditional = previousAdditionalRaw
    ? previousAdditionalRaw.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  if (!name) return { error: "Ürün adı zorunludur." };
  if (price === null) return { error: "Geçerli bir fiyat girin." };
  if (!mainImagePath) return { error: "Ana görsel zorunludur." };
  if (categoryRaw && !category) {
    return { error: "Geçersiz kategori seçimi." };
  }

  const existing = await getExistingSlugs(productId);
  const desired = slugify(slugInput || name);
  const slug = existing.includes(desired)
    ? makeUniqueSlug(desired, existing)
    : desired;

  const { data: current, error: fetchError } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();

  if (fetchError || !current) {
    return { error: "Ürün bulunamadı." };
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description: description || null,
      category,
      price,
      main_image_path: mainImagePath,
      additional_image_paths: additionalImagePaths,
      featured,
      active,
    })
    .eq("id", productId);

  if (error) {
    return { error: error.message || "Ürün güncellenemedi." };
  }

  const keep = new Set([mainImagePath, ...additionalImagePaths]);
  const orphans = [previousMain, ...previousAdditional].filter(
    (path) => path && !keep.has(path),
  );

  if (orphans.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(orphans);
  }

  revalidatePublic();
  revalidatePath(`/urunler/${slug}`);
  if (current.slug !== slug) {
    revalidatePath(`/urunler/${current.slug}`);
  }
  revalidatePath(`/admin/products/${productId}/edit`);

  return { success: "Ürün güncellendi." };
}

export async function deleteProduct(productId: string): Promise<ActionState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Yetkisiz işlem." };

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("slug, main_image_path, additional_image_paths")
    .eq("id", productId)
    .maybeSingle();

  if (fetchError || !product) {
    return { error: "Ürün bulunamadı." };
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) {
    return { error: error.message || "Ürün silinemedi." };
  }

  const paths = [
    product.main_image_path,
    ...(product.additional_image_paths ?? []),
  ].filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);
  }

  // Best-effort: remove leftover folder objects for this product id
  const { data: leftovers } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .list(productId);
  if (leftovers && leftovers.length > 0) {
    await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(leftovers.map((file) => `${productId}/${file.name}`));
  }

  revalidatePublic();
  revalidatePath(`/urunler/${product.slug}`);
  redirect("/admin/products");
}
