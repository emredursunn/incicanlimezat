"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/site-config";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Giriş başarısız. E-posta veya şifreyi kontrol edin.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Giriş başarısız. Tekrar deneyin.");
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setError("Bu hesap yönetici yetkisine sahip değil.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm text-charcoal-soft">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-charcoal-soft">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none ring-charcoal/20 focus:ring-2"
        />
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-charcoal px-4 py-3 text-xs uppercase tracking-[0.2em] text-ivory transition-opacity disabled:opacity-60"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}

function StoreNameHeading() {
  const [name, setName] = useState(siteConfig.name);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from("site_settings")
      .select("store_name")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.store_name) setName(data.store_name);
      });
  }, []);

  return (
    <h1 className="mt-3 font-display text-4xl text-charcoal">{name}</h1>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Yönetim</p>
        <StoreNameHeading />
        <p className="mt-3 text-sm text-muted">
          Ürünleri yönetmek için giriş yapın.
        </p>

        <Suspense
          fallback={<p className="mt-10 text-sm text-muted">Yükleniyor...</p>}
        >
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">
            Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
