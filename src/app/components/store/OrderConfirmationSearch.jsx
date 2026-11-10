"use client";

import { useSearchParams } from "next/navigation";
import OrderConfirmation from "@/components/store/OrderConfirmation";

export default function OrderConfirmationSearch() {
  const searchParams = useSearchParams();
  return <OrderConfirmation orderId={searchParams.get("orderId") ?? ""} />;
}
