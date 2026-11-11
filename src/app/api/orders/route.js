import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const orderNumber = searchParams.get("orderNumber")?.trim() ?? "";
  const phone = searchParams.get("phone")?.trim() ?? "";
  if (!orderNumber || !/^[+0-9 ()-]{7,20}$/.test(phone) || !/\d/.test(phone)) {
    return Response.json({ error: "Enter the order number and phone number used at checkout." }, { status: 400 });
  }

  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.rpc("track_order", {
      p_order_number: orderNumber,
      p_phone: phone,
    });
    if (error) {
      console.error("Could not look up order status.", error);
      return Response.json({ error: "Order tracking is temporarily unavailable." }, { status: 503 });
    }
    return data
      ? Response.json({ order: data })
      : Response.json({ error: "No order matches that order number and phone." }, { status: 404 });
  } catch (error) {
    console.error("Order tracking service is not available.", error);
    return Response.json({ error: "Order tracking is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid order request." }, { status: 400 });
  }
  if (
    !payload?.customer ||
    typeof payload.customer.name !== "string" ||
    payload.customer.name.trim().length < 2 ||
    payload.customer.name.trim().length > 100 ||
    typeof payload.customer.phone !== "string" ||
    !/^[+0-9 ()-]{7,20}$/.test(payload.customer.phone) ||
    !/\d/.test(payload.customer.phone) ||
    typeof payload.customer.address !== "string" ||
    payload.customer.address.trim().length < 8 ||
    payload.customer.address.trim().length > 500 ||
    !Array.isArray(payload.items) ||
    payload.items.length < 1 ||
    payload.items.length > 30 ||
    !payload.items.every((item) =>
      item &&
      typeof item.productId === "string" &&
      typeof item.size === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 50
    )
  ) {
    return Response.json({ error: "Check customer details and order items, then try again." }, { status: 400 });
  }

  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.rpc("create_order", {
      p_customer: payload.customer,
      p_items: payload.items,
      p_channel: "online",
      p_payment_method: "Cash on delivery",
    });

    if (error) {
      console.error("Could not place storefront order.", error);
      const knownErrors = [
        "Insufficient stock",
        "Product or size is not available",
        "A complete delivery address is required",
        "Enter a valid customer name and phone number",
      ];
      const publicMessage = knownErrors.find((message) => error.message.includes(message));
      return Response.json({ error: publicMessage ?? "Your order could not be placed. Please check the details and try again." }, { status: 400 });
    }

    return Response.json({ order: data }, { status: 201 });
  } catch (error) {
    console.error("Order service is not available.", error);
    return Response.json({ error: error.message }, { status: 503 });
  }
}
