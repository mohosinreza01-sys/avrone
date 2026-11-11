import Link from "next/link";

export default function AnnouncementBar() {
    return (
        <div className="bg-[#075b54] text-[10px] uppercase tracking-[0.16em] text-white">
            <div className="relative mx-auto flex min-h-9 max-w-[1480px] items-center justify-center px-5 py-2">
                <p className="text-center">New season, better essentials · Free delivery over ৳3,000</p>
                <div className="absolute right-8 hidden items-center gap-5 text-[9px] tracking-[0.12em] text-white/75 lg:flex">
                    <Link href="/track-order" className="transition hover:text-white">Track order</Link>
                    <Link href="/contact" className="transition hover:text-white">Customer care</Link>
                </div>
            </div>
        </div>
    );
}