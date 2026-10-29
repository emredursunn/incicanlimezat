import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettingsRow } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsRow();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">Görünüm</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal">Site ayarları</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Mağaza adı, ana sayfa yazıları ve hero fotoğrafını buradan
        güncelleyebilirsiniz.
      </p>
      {!settings ? (
        <p className="mt-6 rounded border border-border bg-ivory-deep/50 px-4 py-3 text-sm text-charcoal-soft">
          Veritabanında henüz ayar kaydı yok. Formu kaydettiğinizde oluşturulur.
          İsterseniz önce{" "}
          <code className="text-xs">supabase/migrations/002_site_settings.sql</code>{" "}
          dosyasını Supabase SQL Editor&apos;da çalıştırın.
        </p>
      ) : null}
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
