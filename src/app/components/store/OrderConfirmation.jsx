"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";

export default function OrderConfirmation({ orderId }) {
  const { orders, ready } = useStore();
  const order = orders.find((item) => item.id === orderId);

  if (!ready) {
    return <div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-gray-500">Loading your order…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="font-serif text-3xl text-[#111820]">We couldn&apos;t find that order on this device.</p>
        <p className="mt-3 text-sm text-gray-600">Orders from this demo are stored locally in the browser where they were placed.</p>
        <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[#111820] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Continue shopping</Link>
      </div>
    );
  }

  const customerName =
    order.customer.name ||
    [order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ") ||
    "there";
  const deliveryAddress = [
    order.customer.address,
    order.customer.city,
    order.customer.postalCode,
  ].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <div className="rounded-[2rem] bg-white p-7 text-center shadow-[0_8px_30px_rgba(17,24,32,0.05)] md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE8E2] text-[#111820]"><Check size={25} /></div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-gray-500">Order received</p>
        <h1 className="mt-3 font-serif text-4xl text-[#111820]">Thank you, {customerName}.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">Your order <span className="font-medium text-[#111820]">{order.id}</span> has been saved. We&apos;ll contact you to confirm delivery.</p>
        <div className="mt-8 rounded-2xl bg-[#F8F7F4] p-5 text-left">
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-600">{item.name} · {item.size} × {item.quantity}</span>
                <span className="shrink-0">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-sm font-medium">
            <span>Total · {order.paymentMethod}</span><span>{formatPrice(order.total)}</span>
          </div>
          {deliveryAddress && <p className="mt-2 text-xs text-gray-500">{deliveryAddress}</p>}
          {order.customer.phone && <p className="mt-1 text-xs text-gray-500">Contact: {order.customer.phone}</p>}
        </div>
        <p className="mt-5 text-xs text-gray-500">Demo order stored in this browser only. No payment has been processed.</p>
        <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[#111820] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Continue shopping</Link>
      </div>
    </div>
  );
}
