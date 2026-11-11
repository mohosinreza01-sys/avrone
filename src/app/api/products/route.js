import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const productFields =
  "id,slug,name,category,brand,price,compare_at_price,badge,color,sizes,stock,image,description,active";
const pageSize = 1000;

export async function GET() {
  await connection();
  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const products = [];
    let totalCount = null;

    while (totalCount === null || products.length < totalCount) {
      const { data, error, count } = await supabase
        .from("products")
        .select(productFields, { count: "exact" })
        .eq("active", true)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(products.length, products.length + pageSize - 1);

      if (error) {
        console.error("Could not load storefront products.", error);
        return Response.json({ error: "Could not load products from the catalog." }, { status: 503 });
      }

      if (totalCount === null) {
        if (count === null) {
          throw new Error("The product catalog did not return a total count.");
        }
        totalCount = count;
      }
      if (!data.length && products.length < totalCount) {
        throw new Error("The product catalog returned an incomplete page.");
      }
      products.push(...data);
    }

    return Response.json({
      products: products.map((product) => ({
        ...product,
        compareAtPrice: product.compare_at_price,
        compare_at_price: undefined,
      })),
    });
  } catch (error) {
    console.error("Product catalog is not available.", error);
    return Response.json({ error: error.message }, { status: 503 });
  }
}
