import { adminErrorResponse, getAdminContext } from "@/lib/supabase/admin";

export async function POST(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid POS sale." }, { status: 400 });
  }
  if (
    !payload.customer ||
    typeof payload.customer.name !== "string" ||
    !Array.isArray(payload.items) ||
    !["Cash", "bKash", "Nagad", "Card"].includes(payload.paymentMethod)
  ) {
    return Response.json({ error: "Provide customer, items, and a valid payment method." }, { status: 400 });
  }

  const { data, error: orderError } = await supabase.rpc("create_order", {
    p_customer: {
      name: payload.customer.name.trim() || "Walk-in customer",
      phone: String(payload.customer.phone || "").trim(),
      address: String(payload.customer.address || "").trim(),
    },
    p_items: payload.items,
    p_channel: "pos",
    p_payment_method: payload.paymentMethod,
  });
  if (orderError) return adminErrorResponse(orderError, 400);
  return Response.json({ order: data }, { status: 201 });
}
