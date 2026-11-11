import { adminErrorResponse, getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  const { data, error: queryError } = await supabase.rpc("admin_dashboard_summary");
  if (queryError) return adminErrorResponse(queryError, 503);
  return Response.json(data);
}
