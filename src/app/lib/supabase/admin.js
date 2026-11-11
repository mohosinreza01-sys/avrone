import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { supabase, error: userError, status: 401 };
  }
  if (!user) {
    return { supabase, error: new Error("Admin sign-in is required."), status: 401 };
  }

  const { data: isAdmin, error: roleError } = await supabase.rpc("is_admin");
  if (roleError) {
    return { supabase, error: roleError, status: 503 };
  }
  if (!isAdmin) {
    return { supabase, error: new Error("This account is not authorized for admin access."), status: 403 };
  }

  return { supabase, user, error: null, status: 200 };
}

export function adminErrorResponse(error, status) {
  console.error("Admin request could not be authorized or completed.", error);
  const message =
    status === 401
      ? "Sign in to continue."
      : status === 403
        ? "This account does not have admin access."
        : status === 503
          ? "Admin data is temporarily unavailable. Check your Supabase configuration and migration."
          : "The change could not be saved. Check the submitted information and try again.";
  return Response.json({ error: message }, { status });
}
