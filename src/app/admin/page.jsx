import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminContext } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Store management | AVRONE" };
export const instant = false;

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-5 py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e5ddcf] bg-white p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9b7c43]">AVRONE · Setup required</p>
          <h1 className="mt-3 font-albert-sans text-3xl font-semibold text-[#173d38]">Connect your store database</h1>
          <p className="mt-3 text-sm leading-6 text-[#6d675f]">Add the Supabase project URL and anon key to <code>.env.local</code>, apply the SQL migration, then create an admin account. See <code>supabase/README.md</code> for setup steps.</p>
        </div>
      </main>
    );
  }

  const { user, error, status } = await getAdminContext();
  if (status === 401) redirect("/admin/login");
  if (error) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-5 py-14">
        <div role="alert" className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8">
          <h1 className="font-albert-sans text-2xl font-semibold text-[#173d38]">Admin access unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#6d675f]">{status === 403 ? "This signed-in account does not have the admin role." : "The admin role could not be verified. Apply the Supabase migration and check the project configuration."}</p>
        </div>
      </main>
    );
  }

  return <AdminDashboard email={user.email ?? ""} />;
}
