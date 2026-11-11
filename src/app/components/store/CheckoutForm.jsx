"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 150;

export default function CheckoutForm() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useStore();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    if (!/^[+0-9 ()-]{7,20}$/.test(String(customer.phone)) || !/\d/.test(String(customer.phone))) {
      setError("Enter a valid phone number so we can confirm delivery.");
      return;
    }
    customer.name = String(customer.name).trim();
    customer.address = String(customer.address).trim();
    if (customer.name.length < 2 || customer.address.length < 8) {
      setError("Enter your full name and a complete delivery address.");
      return;
    }
    if (!cartItems.length) {
      setError("Your bag is empty. Add an item before checking out.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cartItems.map(({ product, size, quantity }) => ({
            productId: product.id,
            size,
            quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your order could not be placed.");

      const order = data.order;
      const confirmation = {
        id: order.order_number,
        createdAt: new Date().toISOString(),
        customer: {
          name: order.customer_name,
          phone: order.customer_phone,
          address: order.customer_address,
        },
        items: order.items.map((item) => ({
          productId: item.product_id,
          name: item.product_name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        })),
        subtotal: order.subtotal,
        shipping: order.delivery_fee,
        total: order.total,
        paymentMethod: order.payment_method,
        status: order.status,
      };
      window.sessionStorage.setItem("avrone-last-order", JSON.stringify(confirmation));
      clearCart();
      router.push(`/order-confirmation?orderId=${encodeURIComponent(order.order_number)}`);
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
        <h1 className="font-serif text-4xl text-[#111820]">Your bag is empty</h1>
        <p className="mt-3 text-sm text-gray-600">Add something you love before continuing to checkout.</p>
        <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[#111820] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Shop AVRONE</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#78867e]">Secure checkout</p>
        <h1 className="mt-3 font-serif text-4xl text-[#173d38] md:text-5xl">Delivery details</h1>
        <p className="mt-2 text-sm text-gray-600">Just your name, phone number, and delivery address.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.7fr]">
        <div className="h-fit rounded-2xl border border-[#173d38]/10 bg-white p-5 shadow-[0_8px_30px_rgba(17,24,32,0.04)] sm:p-7 md:p-8">
          <div className="space-y-5">
            <label className="block text-xs font-medium text-[#40534b]" htmlFor="checkout-name">Full name
              <input id="checkout-name" name="name" autoComplete="name" minLength={2} maxLength={100} required className="mt-2 w-full rounded-lg border border-[#173d38]/15 bg-white px-4 py-3.5 text-sm text-[#173d38] outline-none transition placeholder:text-gray-400 focus:border-[#075b54] focus:ring-2 focus:ring-[#075b54]/10" placeholder="Enter your full name" />
            </label>
            <label className="block text-xs font-medium text-[#40534b]" htmlFor="checkout-phone">Phone number
              <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" minLength={7} maxLength={20} required className="mt-2 w-full rounded-lg border border-[#173d38]/15 bg-white px-4 py-3.5 text-sm text-[#173d38] outline-none transition placeholder:text-gray-400 focus:border-[#075b54] focus:ring-2 focus:ring-[#075b54]/10" placeholder="+880 1XXX-XXXXXX" />
              <span className="mt-1.5 block text-[11px] font-normal text-gray-500">We&apos;ll call to confirm your order and delivery.</span>
            </label>
            <label className="block text-xs font-medium text-[#40534b]" htmlFor="checkout-address">Full delivery address
              <textarea id="checkout-address" name="address" autoComplete="street-address" rows={4} minLength={8} maxLength={500} required className="mt-2 w-full resize-y rounded-lg border border-[#173d38]/15 bg-white px-4 py-3.5 text-sm text-[#173d38] outline-none transition placeholder:text-gray-400 focus:border-[#075b54] focus:ring-2 focus:ring-[#075b54]/10" placeholder="House, road, area, and district" />
            </label>
            <div className="flex items-start gap-3 rounded-lg bg-[#f5f7f3] p-4">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#075b54] text-[9px] text-[#075b54]">✓</span>
              <span>
                <span className="block text-sm font-medium text-[#173d38]">Cash on delivery</span>
                <span className="mt-1 block text-xs leading-5 text-gray-500">Pay in cash when your order arrives.</span>
              </span>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-[#124d48] p-6 text-white md:p-8">
          <h2 className="font-serif text-2xl">Your order</h2>
          <div className="mt-6 space-y-4">
            {cartItems.map(({ product, size, quantity }) => (
              <div key={`${product.id}-${size}`} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
                  <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] text-[#111820]">{quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <p className="mt-1 text-xs text-gray-400">Size {size}</p>
                </div>
                <p className="text-sm">{formatPrice(product.price * quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
            <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-gray-300"><span>Delivery</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
            <div className="flex justify-between border-t border-white/15 pt-4 text-base font-medium"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
          </div>
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-950/60 p-3 text-sm text-red-100">{error}</p>}
          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-white px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#111820] transition hover:bg-gray-200 disabled:cursor-wait disabled:opacity-60">{submitting ? "Placing order..." : `Place order · ${formatPrice(subtotal + shipping)}`}</button>
          <p className="mt-4 text-center text-[10px] leading-5 text-gray-400">Cash on delivery · We&apos;ll call to confirm your order.</p>
        </aside>
      </form>
    </div>
  );
}
