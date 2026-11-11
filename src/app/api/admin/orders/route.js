import { adminErrorResponse, getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (ordersError) return adminErrorResponse(ordersError, 503);

  const orderIds = orders.map((order) => order.id);
  let items = [];
  if (orderIds.length) {
    const { data, error: itemsError } = await supabase
      .from("order_items")
      .select("order_id,product_name,size,quantity,unit_price")
      .in("order_id", orderIds);
    if (itemsError) return adminErrorResponse(itemsError, 503);
    items = data;
  }

  return Response.json({
    orders: orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    })),
  });
}

export async function PATCH(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid order update." }, { status: 400 });
  }
  if (
    typeof payload.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(payload.id) ||
    !["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].includes(payload.status)
  ) {
    return Response.json({ error: "Invalid order or status." }, { status: 400 });
  }

  const { error: updateError } = await supabase.rpc("update_order_status", {
    p_order_id: payload.id,
    p_status: payload.status,
  });
  if (updateError) return adminErrorResponse(updateError, 400);
  return Response.json({ success: true });
}
