"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [orderId, setOrderId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const order = orders.find((item) => item.id.toLowerCase() === searchedId.trim().toLowerCase());

  function handleSubmit(event) {
    event.preventDefault();
    setSearchedId(orderId);
  }

  return (
    <div className="min-h-[65vh] bg-[#F8F7F4] px-5 py-16 md:px-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm md:p-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Order support</p>
        <h1 className="mt-4 font-serif text-4xl text-[#111820]">Track your order</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">Enter the order number from your confirmation. Demo orders can only be looked up in the browser where they were placed.</p>
        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="order-id" className="sr-only">Order number</label>
          <input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} required placeholder="e.g. AVR-M..." className="min-w-0 flex-1 rounded-full border border-black/10 bg-[#F8F7F4] px-5 py-3 text-sm outline-none focus:border-[#111820]" />
          <button type="submit" className="rounded-full bg-[#111820] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white">Find order</button>
        </form>

        {searchedId && (
          order ? (
            <div className="mt-7 rounded-2xl bg-[#F8F7F4] p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <p className="font-medium text-[#111820]">{order.id}</p>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {formatPrice(order.total)} · Cash on delivery</p>
              <p className="mt-2 text-xs text-gray-500">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p role="status" className="mt-6 rounded-xl bg-[#F8F7F4] p-4 text-sm text-gray-600">No matching order found in this browser.</p>
          )
        )}
        <Link href="/contact" className="mt-7 inline-flex text-xs text-gray-500 underline underline-offset-4">Need help? Contact us</Link>
      </div>
    </div>
  );
}
