import { PRODUCT_CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export async function getActiveProducts(
  category?: string | null,
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getActiveProducts", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

/** Aktif ürünlerde kullanılan kategoriler (boş kategoriler hariç) */
export async function getUsedCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true)
    .not("category", "is", null);

  if (error) {
    console.error("getUsedCategories", error.message);
    return [];
  }

  const unique = new Set<string>();
  for (const row of data ?? []) {
    if (typeof row.category === "string" && row.category.trim()) {
      unique.add(row.category.trim());
    }
  }

  return PRODUCT_CATEGORIES.filter((category) => unique.has(category));
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data: featured, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts", error.message);
    return getLatestActiveProducts(limit);
  }

  if (featured && featured.length > 0) {
    return featured as Product[];
  }

  return getLatestActiveProducts(limit);
}

async function getLatestActiveProducts(limit: number): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getLatestActiveProducts", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug", error.message);
    return null;
  }

  return data as Product | null;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProductsForAdmin", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductByIdForAdmin(
  id: string,
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getProductByIdForAdmin", error.message);
    return null;
  }

  return data as Product | null;
}

export async function getAdminDashboardStats() {
  const products = await getAllProductsForAdmin();
  return {
    total: products.length,
    active: products.filter((p) => p.active).length,
    recent: products.slice(0, 5),
  };
}

export async function getExistingSlugs(excludeId?: string): Promise<string[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("id, slug");
  const { data, error } = await query;

  if (error || !data) return [];

  return data
    .filter((row) => (excludeId ? row.id !== excludeId : true))
    .map((row) => row.slug as string);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isAdmin: false };

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: Boolean(data) };
}
