import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Account | AVRONE" };

export default function LoginPage() {
  return (
    <div className="min-h-[65vh] bg-[#F8F7F4] px-5 py-16 md:px-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-sm md:p-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">AVRONE account</p>
        <h1 className="mt-4 font-serif text-4xl text-[#111820]">Your account is coming soon.</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">This storefront demo doesn&apos;t yet have secure customer accounts. You can still place cash-on-delivery orders and track orders in this browser.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/track-order" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111820] px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white">Track an order <ArrowRight size={14} /></Link>
          <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#111820]">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
