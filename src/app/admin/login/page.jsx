import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = { title: "Admin login | AVRONE" };

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e5ddcf] bg-white p-7 shadow-[0_20px_60px_rgba(23,61,56,0.08)] sm:p-9">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9b7c43]">AVRONE · Management</p>
          <h1 className="mt-3 font-albert-sans text-3xl font-semibold tracking-tight text-[#173d38]">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-[#6d675f]">Sign in with an authorized admin account to manage the store.</p>
        </div>
        <Suspense fallback={<div className="min-h-48" aria-label="Loading sign-in form" />}>
          <AdminLoginForm configured={configured} />
        </Suspense>
      </div>
    </main>
  );
}
