import { adminErrorResponse, getAdminContext } from "@/lib/supabase/admin";

const productFields = "id,slug,name,category,brand,price,compare_at_price,badge,color,sizes,stock,image,description,active,updated_at";

function isAllowedProductImage(image) {
  try {
    const imageUrl = new URL(image);
    if (imageUrl.protocol !== "https:") return false;
    if (imageUrl.hostname === "images.unsplash.com") return true;
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!projectUrl) return false;
    const projectHost = new URL(projectUrl).hostname;
    return (
      imageUrl.hostname === projectHost &&
      imageUrl.pathname.startsWith("/storage/v1/object/public/product-images/")
    );
  } catch {
    return false;
  }
}

function isValidProduct(product) {
  return (
    product &&
    typeof product.id === "string" &&
    /^[a-z0-9-]{2,80}$/.test(product.id) &&
    typeof product.slug === "string" &&
    /^[a-z0-9-]{2,100}$/.test(product.slug) &&
    typeof product.name === "string" &&
    product.name.trim().length >= 2 &&
    typeof product.category === "string" &&
    product.category.trim().length >= 2 &&
    typeof product.brand === "string" &&
    Number.isInteger(product.price) &&
    product.price >= 0 &&
    (product.compare_at_price == null ||
      (Number.isInteger(product.compare_at_price) && product.compare_at_price >= product.price)) &&
    typeof product.color === "string" &&
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    product.sizes.length <= 20 &&
    new Set(product.sizes).size === product.sizes.length &&
    product.sizes.every((size) => typeof size === "string" && size.trim().length > 0 && size.length <= 10) &&
    product.stock &&
    typeof product.stock === "object" &&
    !Array.isArray(product.stock) &&
    product.sizes.every((size) => Number.isInteger(product.stock[size]) && product.stock[size] >= 0) &&
    (product.badge == null || (typeof product.badge === "string" && product.badge.length <= 50)) &&
    typeof product.image === "string" &&
    isAllowedProductImage(product.image) &&
    typeof product.description === "string"
  );
}

export async function GET() {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  const { data, error: queryError } = await supabase
    .from("products")
    .select(productFields)
    .order("updated_at", { ascending: false });
  if (queryError) return adminErrorResponse(queryError, 503);
  return Response.json({ products: data });
}

export async function POST(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  let product;
  try {
    product = await request.json();
  } catch {
    return Response.json({ error: "Invalid product details." }, { status: 400 });
  }
  if (!isValidProduct(product)) {
    return Response.json({ error: "Check product details, price, sizes, stock, and HTTPS image URL." }, { status: 400 });
  }

  const { data, error: insertError } = await supabase
    .from("products")
    .insert({
      ...product,
      name: product.name.trim(),
      category: product.category.trim(),
      brand: product.brand.trim(),
      compare_at_price: product.compare_at_price || null,
      active: true,
    })
    .select(productFields)
    .single();
  if (insertError) return adminErrorResponse(insertError, 400);
  return Response.json({ product: data }, { status: 201 });
}

export async function PATCH(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);

  let product;
  try {
    product = await request.json();
  } catch {
    return Response.json({ error: "Invalid product details." }, { status: 400 });
  }
  if (!isValidProduct(product)) {
    return Response.json({ error: "Check product details, price, sizes, stock, and HTTPS image URL." }, { status: 400 });
  }

  const { data, error: updateError } = await supabase
    .from("products")
    .update({
      slug: product.slug,
      name: product.name.trim(),
      category: product.category.trim(),
      brand: product.brand.trim(),
      price: product.price,
      compare_at_price: product.compare_at_price || null,
      badge: product.badge || null,
      color: product.color,
      sizes: product.sizes,
      stock: product.stock,
      image: product.image,
      description: product.description,
      active: product.active !== false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", product.id)
    .select(productFields)
    .single();
  if (updateError) return adminErrorResponse(updateError, 400);
  return Response.json({ product: data });
}

export async function DELETE(request) {
  const { supabase, error, status } = await getAdminContext();
  if (error) return adminErrorResponse(error, status);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "A product ID is required." }, { status: 400 });

  const { error: updateError } = await supabase
    .from("products")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return adminErrorResponse(updateError, 400);
  return Response.json({ success: true });
}
