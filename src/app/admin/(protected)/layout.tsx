import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/products";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await requireAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full flex flex-col bg-ivory">
      <AdminHeader />
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 md:px-8">
        {children}
      </div>
    </div>
  );
}
