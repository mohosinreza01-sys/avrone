"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginForm({ configured }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const formData = new FormData(event.currentTarget);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")).trim(),
        password: String(formData.get("password")),
      });
      if (signInError) {
        setError("Sign in failed. Check your email and password.");
        return;
      }

      const { data: isAdmin, error: roleError } = await supabase.rpc("is_admin");
      if (roleError || !isAdmin) {
        await supabase.auth.signOut();
        setError(roleError ? "Could not verify admin access. Check the Supabase migration." : "This account is not authorized as an admin.");
        return;
      }

      const requestedPath = searchParams.get("next");
      const nextPath = requestedPath?.startsWith("/admin") && !requestedPath.startsWith("/admin/login")
        ? requestedPath
        : "/admin";
      router.replace(nextPath);
      router.refresh();
    } catch (loginError) {
      console.error("Admin sign-in failed.", loginError);
      setError(loginError.message);
    } finally {
      setPending(false);
    }
  }

  if (!configured) {
    return (
      <div role="alert" className="rounded-xl border border-[#ead9b9] bg-[#fbf7ed] p-4 text-sm leading-6 text-[#684d22]">
        <p className="font-semibold">Connect Supabase to enable admin access.</p>
        <p className="mt-1">Copy <code>.env.example</code> to <code>.env.local</code>, add the Supabase URL and anon key, then apply the migration in <code>supabase/migrations</code>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-xs font-medium text-[#40534b]" htmlFor="admin-email">
        Email address
        <input id="admin-email" name="email" type="email" autoComplete="username" required className="mt-2 w-full rounded-lg border border-[#d8d1c4] px-4 py-3 text-sm outline-none transition focus:border-[#173d38] focus:ring-2 focus:ring-[#173d38]/10" />
      </label>
      <label className="block text-xs font-medium text-[#40534b]" htmlFor="admin-password">
        Password
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-[#d8d1c4] px-4 py-3 text-sm outline-none transition focus:border-[#173d38] focus:ring-2 focus:ring-[#173d38]/10" />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-[#173d38] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0f302c] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in securely"}
      </button>
      <p className="text-center text-[11px] leading-5 text-[#81796d]">Admin accounts are created by the store owner; public sign-up is disabled.</p>
    </form>
  );
}
