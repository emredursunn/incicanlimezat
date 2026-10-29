import { createClient } from "@supabase/supabase-js";

/** Cookie-free client for public reads (e.g. site settings). */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
