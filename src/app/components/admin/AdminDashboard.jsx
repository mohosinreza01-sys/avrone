"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Plus,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "orders", label: "Orders", Icon: ClipboardList },
  { id: "products", label: "Products & stock", Icon: Boxes },
  { id: "customers", label: "Customers", Icon: Users },
  { id: "pos", label: "Point of sale", Icon: CircleDollarSign },
];

const money = (amount = 0) => `৳${new Intl.NumberFormat("en-BD").format(amount)}`;

async function requestApi(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request could not be completed.");
  return data;
}

function ProductEditor({ product, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    id: product?.id ?? "",
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    category: product?.category ?? "",
    brand: product?.brand ?? "AVRONE",
    price: product?.price ?? "",
    compare_at_price: product?.compare_at_price ?? "",
    badge: product?.badge ?? "",
    color: product?.color ?? "",
    sizes: (product?.sizes ?? []).join(", "),
    stock: product?.stock ?? {},
    image: product?.image ?? "",
    description: product?.description ?? "",
    active: product?.active ?? true,
  }));
  const [pending, setPending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSizes(value) {
    const sizes = [...new Set(value.split(",").map((size) => size.trim()).filter(Boolean))];
    setForm((current) => ({
      ...current,
      sizes: value,
      stock: Object.fromEntries(sizes.map((size) => [size, current.stock[size] ?? 0])),
    }));
  }

  function updateStock(size, value) {
    const count = value === "" ? 0 : Number(value);
    setForm((current) => ({ ...current, stock: { ...current.stock, [size]: count } }));
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choose a JPG, PNG, or WebP image up to 5 MB.");
      return;
    }

    setUploadingImage(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      update("image", data.publicUrl);
    } catch (uploadError) {
      console.error("Could not upload the product image.", uploadError);
      setError(uploadError.message || "Image upload failed. Check the storage bucket and admin policy.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const sizes = [...new Set(form.sizes.split(",").map((size) => size.trim()).filter(Boolean))];
    const generatedSlug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = form.slug.trim() || generatedSlug || `product-${Date.now()}`;
    const payload = {
      ...form,
      id: form.id || `avr-${Date.now()}`,
      slug,
      name: form.name.trim(),
      price: Number(form.price),
      compare_at_price: form.compare_at_price === "" ? null : Number(form.compare_at_price),
      badge: form.badge || null,
      sizes,
      stock: Object.fromEntries(sizes.map((size) => [size, Number(form.stock[size] ?? 0)])),
    };

    try {
      await requestApi("/api/admin/products", {
        method: product ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      await onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setPending(false);
    }
  }

  const sizes = [...new Set(form.sizes.split(",").map((size) => size.trim()).filter(Boolean))];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102c29]/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9b7c43]">Catalog management</p>
            <h2 className="mt-2 font-albert-sans text-2xl font-semibold text-[#173d38]">{product ? "Edit product" : "Add a product"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-[#e5ddcf] px-3 py-2 text-xs text-[#6d675f] hover:bg-[#f8f6f1]">Close</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Product name", "Signature Panjabi"],
            ["slug", "URL slug", "signature-panjabi"],
            ["category", "Category", "Panjabi"],
            ["brand", "Brand / label", "AVRONE Studio"],
            ["price", "Price (৳)", "2490"],
            ["compare_at_price", "Original price (৳)", "2990"],
            ["color", "Color", "Deep olive"],
            ["badge", "Badge (optional)", "New"],
            ["image", "Product image HTTPS URL", "https://..."],
          ].map(([field, label, placeholder]) => (
            <label key={field} className="block text-xs font-medium text-[#46564f]">
              {label}
              <input
                type={field.includes("price") ? "number" : "text"}
                min={field.includes("price") ? "0" : undefined}
                value={form[field]}
                onChange={(event) => update(field, event.target.value)}
                placeholder={placeholder}
                required={!["compare_at_price", "badge", "slug"].includes(field)}
                className="mt-1.5 w-full rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm outline-none focus:border-[#173d38] focus:ring-2 focus:ring-[#173d38]/10"
              />
            </label>
          ))}
          <label className="block text-xs font-medium text-[#46564f] sm:col-span-2">
            Upload product image
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploadingImage} className="mt-1.5 block w-full rounded-lg border border-[#ded7cb] bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#f5f2eb] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#173d38]" />
            <span className="mt-1 block text-[10px] font-normal text-[#81796d]">{uploadingImage ? "Uploading image..." : form.image ? "An image is ready. Upload a new one to replace it." : "JPG, PNG, or WebP · maximum 5 MB"}</span>
          </label>
          <label className="block text-xs font-medium text-[#46564f] sm:col-span-2">
            Sizes (comma separated)
            <input value={form.sizes} onChange={(event) => updateSizes(event.target.value)} placeholder="S, M, L, XL" required className="mt-1.5 w-full rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm outline-none focus:border-[#173d38]" />
          </label>
          {sizes.length > 0 && (
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-xs font-medium text-[#46564f]">Opening stock by size</legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {sizes.map((size) => (
                  <label key={size} className="rounded-lg border border-[#e5ddcf] bg-[#fbfaf6] p-2 text-center">
                    <span className="block text-[10px] font-semibold text-[#173d38]">{size}</span>
                    <input type="number" min="0" step="1" value={form.stock[size] ?? 0} onChange={(event) => updateStock(size, event.target.value)} aria-label={`${size} stock`} className="mt-1 w-full bg-transparent text-center text-sm outline-none" />
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <label className="block text-xs font-medium text-[#46564f] sm:col-span-2">
            Product description
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm outline-none focus:border-[#173d38]" />
          </label>
          {product && (
            <label className="flex items-center gap-2 text-xs text-[#46564f] sm:col-span-2">
              <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} className="accent-[#173d38]" />
              Product is visible in the storefront
            </label>
          )}
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#d8d1c4] px-4 py-2.5 text-xs font-medium text-[#53615a]">Cancel</button>
          <button disabled={pending || uploadingImage} className="rounded-lg bg-[#173d38] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#0f302c] disabled:opacity-60">{pending ? "Saving..." : product ? "Save changes" : "Add product"}</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard({ email }) {
  const router = useRouter();
  const [section, setSection] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [productEditor, setProductEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [posProductId, setPosProductId] = useState("");
  const [posSize, setPosSize] = useState("");
  const [posItems, setPosItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [posCustomer, setPosCustomer] = useState({ name: "Walk-in customer", phone: "", address: "" });
  const [posPending, setPosPending] = useState(false);

  const loadSummary = useCallback(async () => {
    const data = await requestApi("/api/admin/summary");
    setSummary(data);
  }, []);

  const loadSection = useCallback(async (target) => {
    if (target === "overview") return;
    setLoading(true);
    setError("");
    try {
      const endpoint = target === "pos" ? "products" : target;
      const { [endpoint]: data } = await requestApi(`/api/admin/${endpoint}`);
      if (endpoint === "orders") setOrders(data);
      if (endpoint === "products") setProducts(data);
      if (endpoint === "customers") setCustomers(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary().catch((loadError) => setError(loadError.message));
  }, [loadSummary]);

  useEffect(() => {
    loadSection(section);
  }, [loadSection, section]);

  const activeProducts = products.filter((product) => product.active);
  const selectedProduct = activeProducts.find((product) => product.id === posProductId);
  const selectedProductSizes = selectedProduct?.sizes ?? [];
  const posTotal = useMemo(
    () => posItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
    [posItems],
  );

  function addPosItem() {
    if (!selectedProduct || !posSize) return;
    const available = Number(selectedProduct.stock?.[posSize] ?? 0);
    const existing = posItems.find((item) => item.productId === selectedProduct.id && item.size === posSize);
    if (available < (existing?.quantity ?? 0) + 1) {
      setError("There is not enough stock for that size.");
      return;
    }
    setError("");
    setPosItems((current) => {
      const match = current.find((item) => item.productId === selectedProduct.id && item.size === posSize);
      if (match) return current.map((item) => item === match ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, {
        productId: selectedProduct.id,
        product_name: selectedProduct.name,
        size: posSize,
        unit_price: selectedProduct.price,
        quantity: 1,
        available,
      }];
    });
  }

  async function submitPosSale(event) {
    event.preventDefault();
    if (!posItems.length) {
      setError("Add at least one in-stock item to complete a sale.");
      return;
    }
    setPosPending(true);
    setError("");
    try {
      const { order } = await requestApi("/api/admin/pos", {
        method: "POST",
        body: JSON.stringify({
          customer: posCustomer,
          paymentMethod,
          items: posItems.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        }),
      });
      setNotice(`POS sale ${order.order_number} recorded successfully.`);
      setPosItems([]);
      setPosCustomer({ name: "Walk-in customer", phone: "", address: "" });
      await Promise.all([loadSummary(), loadSection("products")]);
    } catch (posError) {
      setError(posError.message);
    } finally {
      setPosPending(false);
    }
  }

  async function updateOrder(id, status) {
    setError("");
    setNotice("");
    try {
      await requestApi("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id, status }) });
      await Promise.all([loadSection("orders"), loadSummary()]);
      setNotice("Order status updated.");
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function saveCustomerNotes(customer) {
    setError("");
    try {
      await requestApi("/api/admin/customers", {
        method: "PATCH",
        body: JSON.stringify({ id: customer.id, notes: customer.notes }),
      });
      setNotice("Customer notes saved.");
      return true;
    } catch (saveError) {
      setError(saveError.message);
      return false;
    }
  }

  async function archiveProduct(product) {
    if (!window.confirm(`Hide "${product.name}" from the storefront? Past sales will stay intact.`)) return;
    setError("");
    try {
      await requestApi(`/api/admin/products?id=${encodeURIComponent(product.id)}`, { method: "DELETE" });
      await Promise.all([loadSection("products"), loadSummary()]);
      setNotice("Product hidden from the storefront.");
    } catch (archiveError) {
      setError(archiveError.message);
    }
  }

  async function signOut() {
    const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const filteredProducts = products.filter((product) => `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(search.toLowerCase()));
  const filteredOrders = orders.filter((order) => `${order.order_number} ${order.customer_name} ${order.customer_phone}`.toLowerCase().includes(search.toLowerCase()));
  const filteredCustomers = customers.filter((customer) => `${customer.name} ${customer.phone} ${customer.email ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  const activeSection = sections.find((item) => item.id === section);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#173d38] lg:flex">
      <aside className="border-b border-[#e2dacd] bg-[#173d38] text-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <div>
            <p className="font-albert-sans text-xl font-bold tracking-[0.18em]">AVRONE</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/55">Store management</p>
          </div>
          <button type="button" onClick={signOut} aria-label="Sign out" className="rounded-lg border border-white/15 p-2 text-white/75 transition hover:bg-white/10 lg:hidden"><LogOut size={17} /></button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:overflow-y-auto lg:px-3 lg:py-2">
          {sections.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => { setSection(id); setSearch(""); setError(""); setNotice(""); }} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition lg:mb-1 lg:w-full ${section === id ? "bg-[#d6bd8b] font-semibold text-[#173d38]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <p className="truncate text-[10px] text-white/60">{email}</p>
          <button type="button" onClick={signOut} className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/75 transition hover:bg-white/10"><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-9">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#9b7c43]">AVRONE · Admin workspace</p>
            <h1 className="mt-2 font-albert-sans text-2xl font-semibold tracking-tight sm:text-3xl">{activeSection?.label}</h1>
          </div>
          {["orders", "products", "customers"].includes(section) && (
            <label className="relative block w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#83796c]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${section}...`} className="w-full rounded-lg border border-[#ded7cb] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#173d38]" />
            </label>
          )}
          {section === "products" && (
            <button type="button" onClick={() => setProductEditor({})} className="inline-flex items-center gap-2 rounded-lg bg-[#173d38] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0f302c]"><PackagePlus size={15} /> Add product</button>
          )}
        </header>

        {error && <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
        {notice && <div role="status" className="mb-5 rounded-lg border border-[#d8c8a9] bg-[#fbf7ed] px-4 py-3 text-sm text-[#684d22]">{notice}</div>}

        {section === "overview" && (
          <section>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Products", summary?.products, Boxes],
                ["Orders", summary?.orders, ClipboardList],
                ["Customers", summary?.customers, Users],
                ["Net sales", summary ? money(summary.revenue) : null, CircleDollarSign],
              ].map(([label, value, Icon]) => (
                <article key={label} className="rounded-xl border border-[#e5ddcf] bg-white p-5 shadow-[0_6px_18px_rgba(23,61,56,0.03)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#777065]">{label}</p>
                    <span className="rounded-lg bg-[#f5f2eb] p-2 text-[#9b7c43]"><Icon size={17} /></span>
                  </div>
                  <p className="mt-4 font-albert-sans text-2xl font-semibold">{value ?? "—"}</p>
                  {label === "Orders" && <p className="mt-1 text-[10px] text-[#8b8174]">{summary?.pendingOrders ?? 0} need confirmation</p>}
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-[#e5ddcf] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[#f5f2eb] p-2 text-[#9b7c43]"><ShoppingBag size={18} /></span>
                <div>
                  <h2 className="text-sm font-semibold">Sell online and in-store</h2>
                  <p className="mt-1 text-xs text-[#777065]">Manage COD orders, customer records, product stock, and counter sales in one place.</p>
                </div>
              </div>
              <button type="button" onClick={() => setSection("pos")} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#d8c8a9] px-4 py-2.5 text-xs font-semibold text-[#173d38] transition hover:bg-[#fbf7ed]"><Plus size={14} /> Start a POS sale</button>
            </div>
          </section>
        )}

        {section === "orders" && (
          <section className="overflow-hidden rounded-xl border border-[#e5ddcf] bg-white">
            {loading ? <p className="p-8 text-sm text-[#777065]">Loading orders...</p> : filteredOrders.length === 0 ? <p className="p-8 text-sm text-[#777065]">No orders found.</p> : (
              <div className="divide-y divide-[#eee8de]">
                {filteredOrders.map((order) => (
                  <article key={order.id} className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1.2fr_1.2fr_1fr_auto] xl:items-center">
                    <div>
                      <p className="font-semibold">{order.order_number}</p>
                      <p className="mt-1 text-[10px] text-[#81796d]">{new Date(order.created_at).toLocaleString("en-BD")} · {order.channel === "pos" ? "In-store POS" : "Online"}</p>
                      <p className="mt-2 text-xs text-[#6d675f]">{order.items.map((item) => `${item.product_name} · ${item.size} × ${item.quantity}`).join(" / ")}</p>
                    </div>
                    <div className="text-xs">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="mt-1 text-[#777065]">{order.customer_phone || "Walk-in customer"}</p>
                      <p className="mt-1 line-clamp-2 text-[#777065]">{order.customer_address}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{money(order.total)}</p>
                      <p className="mt-1 text-[10px] text-[#81796d]">{order.payment_method} · {order.payment_status}</p>
                    </div>
                    <label className="flex items-center gap-2">
                      <span className="sr-only">Update status for {order.order_number}</span>
                      <select value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)} className="w-full rounded-lg border border-[#ded7cb] bg-white px-3 py-2 text-xs capitalize outline-none focus:border-[#173d38] sm:w-auto">
                        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {section === "products" && (
          <section className="overflow-hidden rounded-xl border border-[#e5ddcf] bg-white">
            {loading ? <p className="p-8 text-sm text-[#777065]">Loading products...</p> : filteredProducts.length === 0 ? <p className="p-8 text-sm text-[#777065]">No products found. Add your first product.</p> : (
              <div className="divide-y divide-[#eee8de]">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-sm font-semibold">{product.name}</h2>
                        {!product.active && <span className="rounded-full bg-[#f1ede5] px-2 py-1 text-[9px] uppercase tracking-wider text-[#81796d]">Hidden</span>}
                      </div>
                      <p className="mt-1 text-[10px] text-[#81796d]">{product.category} · {product.brand} · {money(product.price)}</p>
                      <p className="mt-2 text-[10px] text-[#53615a]">{product.sizes.map((size) => `${size}: ${product.stock?.[size] ?? 0}`).join("  ·  ")}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => setProductEditor(product)} className="rounded-lg border border-[#d8d1c4] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#fbfaf6]">Edit & stock</button>
                      {product.active && <button type="button" onClick={() => archiveProduct(product)} className="rounded-lg border border-[#ead8d5] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#985b50] hover:bg-red-50">Hide</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {section === "customers" && (
          <section className="overflow-hidden rounded-xl border border-[#e5ddcf] bg-white">
            {loading ? <p className="p-8 text-sm text-[#777065]">Loading customers...</p> : filteredCustomers.length === 0 ? <p className="p-8 text-sm text-[#777065]">No customers found. Online orders and POS customers with phone numbers will appear here.</p> : (
              <div className="divide-y divide-[#eee8de]">
                {filteredCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} onSave={saveCustomerNotes} />
                ))}
              </div>
            )}
          </section>
        )}

        {section === "pos" && (
          <form onSubmit={submitPosSale} className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-xl border border-[#e5ddcf] bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">New counter sale</h2>
                  <p className="mt-1 text-xs text-[#81796d]">Stock updates automatically when the sale is recorded.</p>
                </div>
                <span className="rounded-lg bg-[#f5f2eb] p-2 text-[#9b7c43]"><ShoppingBag size={18} /></span>
              </div>
              {products.filter((product) => product.active).length === 0 ? (
                <p className="rounded-lg bg-[#fbf7ed] p-4 text-sm text-[#684d22]">Add a product and set its stock before using POS.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">
                    Product
                    <select value={posProductId} onChange={(event) => { setPosProductId(event.target.value); setPosSize(""); }} className="mt-1.5 w-full rounded-lg border border-[#ded7cb] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38]">
                      <option value="">Select product</option>
                      {activeProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select>
                  </label>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">
                    Size
                    <select value={posSize} onChange={(event) => setPosSize(event.target.value)} disabled={!selectedProduct} className="mt-1.5 w-full rounded-lg border border-[#ded7cb] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38] disabled:bg-[#f5f2eb]">
                      <option value="">Select size</option>
                      {selectedProductSizes.map((size) => <option key={size} value={size} disabled={!selectedProduct.stock?.[size]}>{size} · {selectedProduct.stock?.[size] ?? 0} available</option>)}
                    </select>
                  </label>
                  <button type="button" onClick={addPosItem} disabled={!selectedProduct || !posSize} className="self-end rounded-lg bg-[#173d38] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0f302c] disabled:cursor-not-allowed disabled:opacity-40"><Plus size={15} className="inline" /> Add</button>
                </div>
              )}
              {posItems.length > 0 && (
                <div className="mt-6 divide-y divide-[#eee8de] border-y border-[#eee8de]">
                  {posItems.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div><p className="font-medium">{item.product_name}</p><p className="mt-1 text-[10px] text-[#81796d]">Size {item.size} · Qty {item.quantity}</p></div>
                      <div className="flex items-center gap-3"><span className="font-medium">{money(item.unit_price * item.quantity)}</span><button type="button" aria-label={`Remove ${item.product_name} from sale`} onClick={() => setPosItems((current) => current.filter((entry) => entry !== item))} className="text-lg text-[#9b6259]">×</button></div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="h-fit rounded-xl border border-[#e5ddcf] bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold">Customer & payment</h2>
              <label className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">Customer name
                <input value={posCustomer.name} onChange={(event) => setPosCustomer({ ...posCustomer, name: event.target.value })} minLength={2} required className="mt-1.5 w-full rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38]" />
              </label>
              <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">Phone (optional)
                <input value={posCustomer.phone} onChange={(event) => setPosCustomer({ ...posCustomer, phone: event.target.value })} type="tel" className="mt-1.5 w-full rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38]" />
              </label>
              <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">Payment method
                <span className="relative mt-1.5 block">
                  <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="w-full appearance-none rounded-lg border border-[#ded7cb] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38]">
                    {["Cash", "bKash", "Nagad", "Card"].map((method) => <option key={method}>{method}</option>)}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#81796d]" />
                </span>
              </label>
              <div className="mt-5 flex items-center justify-between border-t border-[#eee8de] pt-4 text-sm">
                <span className="text-[#777065]">Total</span><strong className="text-lg">{money(posTotal)}</strong>
              </div>
              <button disabled={posPending || !posItems.length} className="mt-4 w-full rounded-lg bg-[#173d38] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#0f302c] disabled:cursor-not-allowed disabled:opacity-50">{posPending ? "Recording sale..." : "Complete sale"}</button>
            </aside>
          </form>
        )}

        {loading && <span className="sr-only" role="status">Loading data</span>}
      </main>
      {productEditor && <ProductEditor product={productEditor.id ? productEditor : null} onClose={() => setProductEditor(null)} onSaved={async () => { await Promise.all([loadSection("products"), loadSummary()]); setNotice("Product and inventory saved."); }} />}
    </div>
  );
}

function CustomerRow({ customer, onSave }) {
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const wasSaved = await onSave({ ...customer, notes });
    setSaving(false);
    setSaved(wasSaved);
  }

  return (
    <article className="grid gap-3 p-4 sm:grid-cols-[1fr_1.2fr] sm:p-5">
      <div>
        <h2 className="text-sm font-semibold">{customer.name}</h2>
        <p className="mt-1 text-xs text-[#6d675f]">{customer.phone || "No phone on file"}</p>
        {customer.email && <p className="mt-1 text-xs text-[#81796d]">{customer.email}</p>}
        {customer.address && <p className="mt-2 text-xs leading-5 text-[#81796d]">{customer.address}</p>}
        <p className="mt-2 text-[9px] uppercase tracking-wider text-[#9b7c43]">Customer since {new Date(customer.created_at).toLocaleDateString("en-BD")}</p>
      </div>
      <div className="flex items-end gap-2">
        <label className="min-w-0 flex-1 text-[9px] font-semibold uppercase tracking-wider text-[#81796d]">Private staff note
          <input value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} maxLength={2000} placeholder="Preferences, follow-up notes..." className="mt-1.5 w-full rounded-lg border border-[#ded7cb] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#173d38]" />
        </label>
        <button type="button" onClick={save} disabled={saving || notes === (customer.notes ?? "")} className="rounded-lg border border-[#d8c8a9] px-3 py-2.5 text-[9px] font-semibold uppercase tracking-wider text-[#173d38] disabled:opacity-40">{saving ? "Saving" : saved ? "Saved" : "Save"}</button>
      </div>
    </article>
  );
}
