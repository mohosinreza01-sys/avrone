"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/data/products";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setOrder(null);
    setPending(true);
    try {
      const params = new URLSearchParams({ orderNumber: orderId.trim(), phone: phone.trim() });
      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not find that order.");
      setOrder(data.order);
    } catch (lookupError) {
      setError(lookupError.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[65vh] bg-[#F8F7F4] px-5 py-16 md:px-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm md:p-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Order support</p>
        <h1 className="mt-4 font-serif text-4xl text-[#111820]">Track your order</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">Enter your order number and the phone number used at checkout.</p>
        <form onSubmit={handleSubmit} className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="sr-only" htmlFor="order-id">Order number</label>
          <input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} required placeholder="Order number (e.g. AVR-...)" className="min-w-0 rounded-full border border-black/10 bg-[#F8F7F4] px-5 py-3 text-sm outline-none focus:border-[#111820]" />
          <label className="sr-only" htmlFor="order-phone">Phone number used at checkout</label>
          <input id="order-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder="Phone number" className="min-w-0 rounded-full border border-black/10 bg-[#F8F7F4] px-5 py-3 text-sm outline-none focus:border-[#111820]" />
          <button type="submit" disabled={pending} className="rounded-full bg-[#111820] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-60">{pending ? "Checking..." : "Find order"}</button>
        </form>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {order && (
            <div className="mt-7 rounded-2xl bg-[#F8F7F4] p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <p className="font-medium text-[#111820]">{order.order_number}</p>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {formatPrice(order.total)} · {order.payment_method}</p>
              <p className="mt-2 text-xs text-gray-500">Placed {new Date(order.created_at).toLocaleDateString()}</p>
              <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
                {order.items.map((item, index) => <p key={`${item.name}-${index}`} className="text-xs text-gray-600">{item.name} · {item.size} × {item.quantity}</p>)}
              </div>
            </div>
        )}
        <Link href="/contact" className="mt-7 inline-flex text-xs text-gray-500 underline underline-offset-4">Need help? Contact us</Link>
      </div>
    </div>
  );
}
