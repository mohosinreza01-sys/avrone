import { adminErrorResponse, getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  const { data, error: queryError } = await supabase
    .from("customers")
    .select("id,name,phone,email,address,notes,created_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(1000);
  if (queryError) return adminErrorResponse(queryError, 503);
  return Response.json({ customers: data });
}

export async function PATCH(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid customer update." }, { status: 400 });
  }
  if (
    typeof payload.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(payload.id) ||
    typeof payload.notes !== "string" ||
    payload.notes.length > 2000
  ) {
    return Response.json({ error: "Invalid customer notes." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("customers")
    .update({ notes: payload.notes.trim(), updated_at: new Date().toISOString() })
    .eq("id", payload.id);
  if (updateError) return adminErrorResponse(updateError, 400);
  return Response.json({ success: true });
}
