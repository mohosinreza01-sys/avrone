import { Suspense } from "react";
import OrderConfirmationSearch from "@/components/store/OrderConfirmationSearch";

export const metadata = { title: "Order received | AVRONE" };

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4]">
      <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-gray-500">Loading your order…</div>}>
        <OrderConfirmationSearch />
      </Suspense>
    </div>
  );
}
